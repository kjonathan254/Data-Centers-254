import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import {
  isSameOriginRequest,
  originRejectedResponse,
} from "@/lib/api-guards";
import { answerQuestion, scrubReply, type ChatTurn } from "@/lib/chatbot/engine";
import { BOT_IDENTITY } from "@/lib/chatbot/identity";
import {
  activeProviders,
  reasonerEffort,
  chatTemplateKwargs,
  tokenCeiling,
  stripThinking,
  llmTemporarilyDown,
  noteLlmFailure,
  noteLlmSuccess,
  noteModelRejected,
  noteProviderAuthDead,
  type ProviderSpec,
} from "@/lib/chatbot/llm";
import {
  agentSpanAttributes,
  llmSpanResponseAttributes,
  llmSpanStartAttributes,
  type LlmCallContext,
} from "@/lib/chatbot/tracing";

/**
 * POST /api/chat, the answer engine endpoint.
 *
 * Deterministic by default (zero cost, zero keys, corpus-grounded). When a
 * Groq key is configured, two LLM steps run on top, both grounded strictly
 * in retrieved facts, both time-boxed, both degrading silently:
 *
 *   1. Confident path , the deterministic draft is handed to the LLM to
 *      polish phrasing. A numeric guardrail rejects any output containing a
 *      figure that doesn't appear in the draft or the facts.
 *   2. Weak-match path, questions that scored below the retrieval threshold
 *      get a second chance: the nearest chunks are offered under an
 *      answer-or-NOT_IN_NOTES contract. If the model doesn't vouch for the
 *      answer, the honest deterministic reply stands.
 *
 *   3. Agent tracing , every real model call becomes a Sentry `gen_ai.chat`
 *      span and the whole walk a `gen_ai.invoke_agent` run span (manual
 *      instrumentation per Sentry's Agent Tracing conventions — Jibu speaks
 *      the OpenAI dialect over raw fetch, so no SDK auto-instrumentation
 *      applies). The widget's anonymous session id groups a multi-turn chat
 *      into one conversation. See src/lib/chatbot/tracing.ts.
 *
 * Env (all optional; see src/lib/chatbot/llm.ts for resolution order):
 *   GROQ_API_KEY (or CHAT_LLM_API_KEY / GROQ_KEY / GROQ_TOKEN, or any
 *   groq-or-jibu-named var holding a gsk_… key)
 *   NVIDIA_API_KEY, free nvapi-… key from build.nvidia.com; dormant fail-over
 *   HF_TOKEN, HuggingFace Inference Providers token; dormant third slot
 *   GROQ_MODEL / NVIDIA_MODEL / HF_MODEL, pin a provider's first candidate;
 *   otherwise each provider walks a self-healing candidate chain that advances
 *   whenever an id is retired, and a dead key hands over to the next provider.
 */

export const runtime = "nodejs";

const BodySchema = z.object({
  message: z.string().trim().min(1).max(500),
  history: z
    .array(z.object({ role: z.enum(["user", "bot"]), content: z.string().max(2000) }))
    .max(8)
    .optional(),
  // Anonymous per-tab session id from the widget: groups one conversation's
  // turns in Sentry (gen_ai.conversation.id). Opaque random string with no
  // identity content; optional so older clients and non-widget callers
  // (curl, tests) keep working unchanged.
  sessionId: z
    .string()
    .trim()
    .min(8)
    .max(64)
    .regex(/^[A-Za-z0-9_-]+$/, "session id shape")
    .optional(),
});

const RATE_LIMIT = 20;
const WINDOW_MS = 60_000;

// ─── Optional LLM step (grounded, time-boxed, self-limiting) ────────────────

/** Every figure appearing in a string, comma-normalised ("90,000" → "90000"). */
function numbersIn(s: string): Set<string> {
  return new Set((s.match(/\d+(?:[.,]\d+)*/g) ?? []).map((n) => n.replace(/,/g, "")));
}

/** The polished reply may never introduce a figure absent from draft or facts. */
function numbersConsistent(polished: string, allowed: string): boolean {
  const allowedSet = numbersIn(allowed);
  for (const n of numbersIn(polished)) if (!allowedSet.has(n)) return false;
  return true;
}

async function llmAnswer(
  message: string,
  history: ChatTurn[],
  facts: { title: string; href: string; text: string }[],
  deterministic: string,
  weak: boolean,
  sessionId: string | null,
): Promise<string | null> {
  const providers = activeProviders();
  if (!providers.length || llmTemporarilyDown()) return null;

  const factBlock = facts.length
    ? facts.map((f, i) => `[${i + 1}] ${f.title}: ${f.text}`).join("\n")
    : "(none)";

  const system = [
    `You are ${BOT_IDENTITY.name}, ${BOT_IDENTITY.role} for Data Centre 254 (DC254), a Kenyan publication tracking data centre infrastructure. ${BOT_IDENTITY.tagline}`,
    `Voice: warm, sharp, concise. Kenyan English. Never use emoji, markdown, bold or headings, plain flowing sentences only.`,
    `HARD RULES: Ground every claim in the material provided. Never invent numbers, names, dates, capacities or statuses. Keep every figure exactly as given. Keep the reply under 90 words.`,
  ].join("\n");

  const task = weak
    ? [
        `QUESTION: ${message}`,
        `SEARCH RESULT SNIPPETS (weak matches, may or may not be relevant):`,
        factBlock,
        `If (and only if) these snippets genuinely cover the question, write a direct, grounded answer citing what you used (e.g. "per DC254's verified records …").`,
        `If they do not cover it, reply with exactly this token and nothing else: NOT_IN_NOTES`,
      ].join("\n")
    : [
        `QUESTION: ${message}`,
        `VERIFIED FACTS:`,
        factBlock,
        `DRAFT ANSWER (already verified, improve its flow and warmth, do not change any figure): ${deterministic}`,
      ].join("\n");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  const messages = [
    { role: "system", content: system },
    ...history.slice(-4).map((t) => ({
      role: t.role === "bot" ? ("assistant" as const) : ("user" as const),
      content: t.content,
    })),
    { role: "user", content: task },
  ];
  const ctx: LlmCallContext = {
    conversationId: sessionId,
    system,
    messages,
    temperature: 0.3,
    path: weak ? "weak_match_rescue" : "confidence_polish",
  };

  // Walk the providers, then each provider's model chain: when a provider has
  // retired an id, it answers with a model-level error in ~150ms, remember
  // the rejection and try the next candidate within the same request. A
  // 401/403 benches the whole provider (dead key) and hands over to the next
  // one. Any other failure (quota, network) ends the walk immediately. The
  // 10s timer bounds the whole walk and is always released in the finally.
  //
  // The whole walk is one `gen_ai.invoke_agent` run span; each real model
  // call inside it gets its own `gen_ai.chat` child span (see attemptModel),
  // so Sentry's Agent view shows the run and every per-call detail.
  try {
    return await Sentry.startSpan(
      {
        op: "gen_ai.invoke_agent",
        name: "invoke_agent Jibu",
        attributes: agentSpanAttributes(ctx, providers.map((p) => p.id)),
      },
      async () => {
        for (const provider of providers) {
          let providerDead = false;
          for (const model of provider.models) {
            const outcome = await attemptModel(
              provider,
              model,
              ctx,
              controller.signal,
              `${deterministic}\n${factBlock}`,
            );
            if (outcome.kind === "success") return outcome.text;
            if (outcome.kind === "model-rejected") continue;
            if (outcome.kind === "auth-dead") {
              providerDead = true;
              break;
            }
            if (outcome.kind === "honest-decline") return null;
            noteLlmFailure(); // failed: quota, network or a guardrail trip
            return null;
          }
          if (providerDead) continue; // benched, next provider answers
          // Every remaining candidate id of this provider was refused as a
          // model error this request; fall through to the next provider.
        }
        noteLlmFailure();
        return null;
      },
    );
  } finally {
    clearTimeout(timer);
  }
}

// ─── One provider/model attempt, wrapped in a gen_ai.chat span ─────────────

type AttemptOutcome =
  | { kind: "success"; text: string }
  | { kind: "model-rejected" }
  | { kind: "auth-dead" }
  | { kind: "honest-decline" }
  | { kind: "failed" };

/**
 * A single fetch against one provider/model candidate, instrumented as a
 * Sentry `gen_ai.chat` span (manual Agent Tracing instrumentation — Jibu
 * speaks the OpenAI dialect over raw fetch, so no SDK auto-instrumentation
 * applies). Every exit preserves the exact semantics of the pre-instrumentation
 * walk: 401/403 benches the provider, 404/model errors advance the chain,
 * hard failures end the walk, and the rescue path's NOT_IN_NOTES decline is
 * an honest outcome rather than a failure.
 */
async function attemptModel(
  provider: ProviderSpec,
  model: string,
  ctx: LlmCallContext,
  signal: AbortSignal,
  allowed: string,
): Promise<AttemptOutcome> {
  return Sentry.startSpan(
    {
      op: "gen_ai.chat",
      name: `chat ${model}`,
      attributes: {
        ...llmSpanStartAttributes(provider.id, model, ctx),
        "gen_ai.request.max_tokens": tokenCeiling(model),
      },
    },
    async (span) => {
      const markError = (type: string) => {
        span?.setStatus({ code: 2 });
        span?.setAttribute("error.type", type);
      };
      try {
        // gpt-oss models are reasoners: with a tight max_tokens their chain
        // of thought eats the budget and content comes back empty. Give
        // reasoners a generous ceiling and ask gpt-oss for low reasoning
        // effort, the polish task never needs deep deliberation.
        const res = await fetch(`${provider.baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${provider.key}`,
          },
          body: JSON.stringify({
            model,
            temperature: ctx.temperature,
            max_tokens: tokenCeiling(model),
            ...(reasonerEffort(model) ? { reasoning_effort: reasonerEffort(model) } : {}),
            ...(chatTemplateKwargs(model) ? { chat_template_kwargs: chatTemplateKwargs(model) } : {}),
            messages: ctx.messages,
          }),
          signal,
        });
        if (!res.ok) {
          const errBody = await res.text().catch(() => "");
          let errCode = "";
          try {
            errCode = String((JSON.parse(errBody) as { error?: { code?: string } })?.error?.code ?? "");
          } catch {
            // non-JSON error body, fall through to status heuristics
          }
          if (res.status === 401 || res.status === 403) {
            // Key revoked or mistyped, bench this provider, try the next.
            markError(`http_${res.status}`);
            noteProviderAuthDead(provider.id);
            return { kind: "auth-dead" };
          }
          const modelError =
            /model/i.test(errCode) ||
            // OpenAI dialect: an unknown model on a valid route is always a
            // 404 ("model_not_found" on Groq/HF; NIM words it as "Function
            // '…': Not found for account" without the word "model").
            res.status === 404;
          if (modelError) {
            markError("model_refused");
            noteModelRejected(provider.id, model);
            return { kind: "model-rejected" };
          }
          markError(`http_${res.status}`);
          noteLlmFailure();
          return { kind: "failed" };
        }
        const data = (await res.json()) as {
          id?: string;
          model?: string;
          choices?: { message?: { content?: string }; finish_reason?: string }[];
          usage?: { prompt_tokens?: number; completion_tokens?: number };
        };
        let text = stripThinking(data.choices?.[0]?.message?.content?.trim() ?? "");
        if (!text || text.length < 8 || text.length > 1200) {
          markError(text ? "oversized_response" : "empty_response");
          noteLlmFailure();
          return { kind: "failed" };
        }
        if (ctx.path === "weak_match_rescue" && text.startsWith("NOT_IN_NOTES")) {
          // Honesty contract honoured — a valid outcome of the rescue path,
          // not a failure: record it and let the deterministic reply stand.
          span?.setAttributes(
            llmSpanResponseAttributes({
              model: data.model,
              id: data.id,
              text: "(declined: NOT_IN_NOTES)",
              finishReason: "refused",
              inputTokens: data.usage?.prompt_tokens ?? null,
              outputTokens: data.usage?.completion_tokens ?? null,
            }),
          );
          return { kind: "honest-decline" };
        }
        // Strip markdown emphasis, the UI renders plain text + citation chips.
        text = text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/^#+\s*/gm, "").trim();
        if (!numbersConsistent(text, allowed)) {
          markError("guardrail_numbers");
          noteLlmFailure();
          return { kind: "failed" };
        }
        span?.setAttributes(
          llmSpanResponseAttributes({
            model: data.model,
            id: data.id,
            text,
            finishReason: data.choices?.[0]?.finish_reason ?? null,
            inputTokens: data.usage?.prompt_tokens ?? null,
            outputTokens: data.usage?.completion_tokens ?? null,
          }),
        );
        noteLlmSuccess();
        return { kind: "success", text };
      } catch (err) {
        markError(err instanceof Error && err.name === "AbortError" ? "timeout" : "network");
        noteLlmFailure();
        return { kind: "failed" };
      }
    },
  );
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // CSRF guard: cross-site calls burn paid LLM quota under a victim's IP.
  if (!isSameOriginRequest(request)) return originRejectedResponse();

  const ip = clientIp(request);
  if ((await rateLimit("chat", ip, RATE_LIMIT, WINDOW_MS)).limited) {
    return NextResponse.json(
      { error: "Too many questions, too fast. Give me a moment." },
      { status: 429 },
    );
  }

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "That message didn't parse. Try again?" }, { status: 400 });
  }

  const history = (body.history ?? []) as ChatTurn[];
  const result = answerQuestion(body.message, history);

  let reply = result.reply;
  let mode: "deterministic" | "llm" = "deterministic";
  const polished = await llmAnswer(
    body.message,
    history,
    result.contextChunks,
    result.reply,
    result.weak ?? false,
    body.sessionId ?? null,
  );
  if (polished) {
    // The model is under a strict ground-in-the-material contract, but its
    // output is still untrusted text: the leak scrub applies to it too.
    reply = scrubReply(polished);
    mode = "llm";
    if (result.weak) {
      // The rescue took: upgrade the reply to a real, vouched answer.
      result.citations = result.contextChunks.map((c) => ({ label: c.title, href: c.href }));
      result.answered = true;
      result.fallback = undefined;
    }
  }

  return NextResponse.json({
    reply,
    citations: result.citations,
    suggestions: result.suggestions,
    intent: result.intent,
    answered: result.answered,
    fallback: result.fallback ?? null,
    verifiedAsOf: result.verifiedAsOf ?? null,
    mode,
  });
}
