import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { answerQuestion, type ChatTurn } from "@/lib/chatbot/engine";
import { BOT_IDENTITY } from "@/lib/chatbot/identity";
import {
  resolveGroqKey,
  liveModelCandidates,
  LLM_BASE_URL,
  llmTemporarilyDown,
  noteLlmFailure,
  noteLlmSuccess,
  noteModelRejected,
} from "@/lib/chatbot/llm";

/**
 * POST /api/chat — the answer engine endpoint.
 *
 * Deterministic by default (zero cost, zero keys, corpus-grounded). When a
 * Groq key is configured, two LLM steps run on top — both grounded strictly
 * in retrieved facts, both time-boxed, both degrading silently:
 *
 *   1. Confident path  — the deterministic draft is handed to the LLM to
 *      polish phrasing. A numeric guardrail rejects any output containing a
 *      figure that doesn't appear in the draft or the facts.
 *   2. Weak-match path — questions that scored below the retrieval threshold
 *      get a second chance: the nearest chunks are offered under an
 *      answer-or-NOT_IN_NOTES contract. If the model doesn't vouch for the
 *      answer, the honest deterministic reply stands.
 *
 * Env (all optional; see src/lib/chatbot/llm.ts for resolution order):
 *   GROQ_API_KEY (or CHAT_LLM_API_KEY / GROQ_KEY / GROQ_TOKEN /
 *   DATACENTRE254_JIBU, or any groq-or-jibu-named var holding a gsk_… key)
 *   GROQ_MODEL / CHAT_LLM_MODEL — pins the model; otherwise a self-healing
 *   candidate chain advances whenever Groq retires an id.
 */

export const runtime = "nodejs";

const BodySchema = z.object({
  message: z.string().trim().min(1).max(500),
  history: z
    .array(z.object({ role: z.enum(["user", "bot"]), content: z.string().max(2000) }))
    .max(8)
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
): Promise<string | null> {
  const apiKey = resolveGroqKey();
  if (!apiKey || llmTemporarilyDown()) return null;

  const factBlock = facts.length
    ? facts.map((f, i) => `[${i + 1}] ${f.title}: ${f.text}`).join("\n")
    : "(none)";

  const system = [
    `You are ${BOT_IDENTITY.name}, ${BOT_IDENTITY.role} for Data Centre 254 (DC254) — a Kenyan publication tracking data centre infrastructure. ${BOT_IDENTITY.tagline}`,
    `Voice: warm, sharp, concise. Kenyan English. Never use emoji, markdown, bold or headings — plain flowing sentences only.`,
    `HARD RULES: Ground every claim in the material provided. Never invent numbers, names, dates, capacities or statuses. Keep every figure exactly as given. Keep the reply under 90 words.`,
  ].join("\n");

  const task = weak
    ? [
        `QUESTION: ${message}`,
        `SEARCH RESULT SNIPPETS (weak matches — may or may not be relevant):`,
        factBlock,
        `If — and only if — these snippets genuinely cover the question, write a direct, grounded answer citing what you used (e.g. "per DC254's verified records …").`,
        `If they do not cover it, reply with exactly this token and nothing else: NOT_IN_NOTES`,
      ].join("\n")
    : [
        `QUESTION: ${message}`,
        `VERIFIED FACTS:`,
        factBlock,
        `DRAFT ANSWER (already verified — improve its flow and warmth, do not change any figure): ${deterministic}`,
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

  // Walk the model chain: when Groq has retired an id, it answers with a
  // model-level error in ~150ms — remember the rejection and try the next
  // candidate within the same request. Any other failure (auth, quota,
  // network) ends the walk immediately. The 10s timer bounds the whole walk
  // and is always released in the finally.
  try {
    for (const model of liveModelCandidates()) {
      try {
        // gpt-oss models are reasoners: with a tight max_tokens their chain
        // of thought eats the budget and content comes back empty. Give them
        // a generous token ceiling and ask for low reasoning effort — the
        // polish task never needs deep deliberation.
        const isReasoner = /gpt-oss/i.test(model);
        const res = await fetch(`${LLM_BASE_URL}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            temperature: 0.3,
            max_tokens: 1000,
            ...(isReasoner ? { reasoning_effort: "low" } : {}),
            messages,
          }),
          signal: controller.signal,
        });
        if (!res.ok) {
          const errBody = await res.text().catch(() => "");
          let errCode = "";
          try {
            errCode = String((JSON.parse(errBody) as { error?: { code?: string } })?.error?.code ?? "");
          } catch {
            // non-JSON error body — fall through to status heuristics
          }
          const modelError =
            /model/i.test(errCode) ||
            (res.status === 404 && /model/i.test(errBody));
          if (modelError) {
            noteModelRejected(model);
            continue;
          }
          noteLlmFailure();
          return null;
        }
        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        let text = data.choices?.[0]?.message?.content?.trim() ?? "";
        if (!text || text.length < 8 || text.length > 1200) {
          noteLlmFailure();
          return null;
        }
        if (weak && text.startsWith("NOT_IN_NOTES")) return null; // honesty contract honoured
        // Strip markdown emphasis — the UI renders plain text + citation chips.
        text = text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/^#+\s*/gm, "").trim();
        if (!numbersConsistent(text, `${deterministic}\n${factBlock}`)) {
          noteLlmFailure();
          return null;
        }
        noteLlmSuccess();
        return text;
      } catch {
        noteLlmFailure();
        return null;
      }
    }
    // Every remaining candidate id was refused as a model error this request.
    noteLlmFailure();
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
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
  const polished = await llmAnswer(body.message, history, result.contextChunks, result.reply, result.weak ?? false);
  if (polished) {
    reply = polished;
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
