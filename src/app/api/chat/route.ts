import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { answerQuestion, type ChatTurn } from "@/lib/chatbot/engine";
import { BOT_IDENTITY } from "@/lib/chatbot/identity";

/**
 * POST /api/chat — the answer engine endpoint.
 *
 * Deterministic by default (zero cost, zero keys, corpus-grounded). If an
 * OpenAI-compatible LLM is configured via env vars, retrieved facts are
 * handed to it to polish phrasing — grounded strictly in those facts, with a
 * hard timeout and a graceful fall back to the deterministic reply.
 *
 * Optional env (e.g. Groq's free tier):
 *   CHAT_LLM_API_KEY  — API key
 *   CHAT_LLM_BASE_URL — default https://api.groq.com/openai/v1
 *   CHAT_LLM_MODEL    — default llama-3.3-70b-versatile
 */

export const runtime = "nodejs";

const BodySchema = z.object({
  message: z.string().trim().min(1).max(500),
  history: z
    .array(z.object({ role: z.enum(["user", "bot"]), content: z.string().max(2000) }))
    .max(8)
    .optional(),
});

// ─── Best-effort rate limiting (per serverless instance) ─────────────────────
const RATE_LIMIT = 20;
const WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

// ─── Optional LLM polish (grounded, time-boxed) ──────────────────────────────

async function llmPolish(
  message: string,
  history: ChatTurn[],
  facts: { title: string; href: string; text: string }[],
  deterministic: string,
): Promise<string | null> {
  const apiKey = process.env.CHAT_LLM_API_KEY;
  if (!apiKey) return null;
  const baseUrl = process.env.CHAT_LLM_BASE_URL || "https://api.groq.com/openai/v1";
  const model = process.env.CHAT_LLM_MODEL || "llama-3.3-70b-versatile";

  const factBlock = facts.length
    ? facts.map((f, i) => `[${i + 1}] ${f.title}: ${f.text}`).join("\n")
    : "(no retrieved passages — rely only on the deterministic answer below)";

  const system = [
    `You are ${BOT_IDENTITY.name}, ${BOT_IDENTITY.role} for Data Centre 254 (DC254) — a Kenyan publication tracking data centre infrastructure. ${BOT_IDENTITY.tagline}`,
    `Voice: warm, sharp, concise. Kenyan English. Never use emoji. Never use markdown bold or headings — plain sentences only.`,
    `HARD RULES: Use ONLY the verified facts provided below and the deterministic draft. Never invent numbers, names, dates or capacities. If the facts don't cover the question, say honestly that you don't track it and suggest the DC254 team. Keep the reply under 100 words.`,
    `VERIFIED FACTS:\n${factBlock}`,
    `DETERMINISTIC DRAFT (already correct — improve flow, do not change figures): ${deterministic}`,
  ].join("\n\n");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8_000);
  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 260,
        messages: [
          { role: "system", content: system },
          ...history.slice(-4).map((t) => ({
            role: t.role === "bot" ? ("assistant" as const) : ("user" as const),
            content: t.content,
          })),
          { role: "user", content: message },
        ],
      }),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text || text.length < 8 || text.length > 1200) return null;
    // Strip markdown emphasis — the UI renders plain text + citation chips.
    return text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/^#+\s*/gm, "");
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
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
  const polished = await llmPolish(body.message, history, result.contextChunks, result.reply);
  if (polished) {
    reply = polished;
    mode = "llm";
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
