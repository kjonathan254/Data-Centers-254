import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resolveGroqKey, LLM_BASE_URL, llmTtsVoice } from "@/lib/chatbot/llm";

/**
 * POST /api/chat/tts — HD voice for Jibu via Groq's free PlayAI TTS.
 *
 * Request:  { text: string } (≤ 600 chars — Jibu's replies are short)
 * Response: audio/wav stream on success.
 *
 * Any failure (no key, PlayAI terms not yet accepted at console.groq.com,
 * quota, network) returns 503 JSON and the client silently falls back to the
 * device-side Web Speech voice — the user never sees an error. A circuit
 * breaker stops hammering Groq for 10 minutes after a config-level failure.
 */

export const runtime = "nodejs";

const BodySchema = z.object({ text: z.string().trim().min(2).max(600) });

const RATE_LIMIT = 10;
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

let downUntil = 0;

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too fast — one moment." }, { status: 429 });
  }

  const apiKey = resolveGroqKey();
  if (!apiKey || Date.now() < downUntil) {
    return NextResponse.json({ error: "Voice not configured" }, { status: 503 });
  }

  let text: string;
  try {
    const body = BodySchema.parse(await request.json());
    text = body.text;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  try {
    const res = await fetch(`${LLM_BASE_URL}/audio/speech`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.CHAT_TTS_MODEL || "playai-tts",
        voice: llmTtsVoice(),
        input: text,
        response_format: "wav",
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      // 403/404 usually mean the free TTS model terms aren't accepted yet on
      // this Groq account. Back off so we don't retry on every message.
      downUntil = Date.now() + 10 * 60_000;
      return NextResponse.json({ error: "Voice unavailable" }, { status: 503 });
    }
    const audio = await res.arrayBuffer();
    if (audio.byteLength < 512) {
      return NextResponse.json({ error: "Voice unavailable" }, { status: 503 });
    }
    const contentType = res.headers.get("content-type") || "audio/wav";
    return new Response(audio, {
      headers: {
        "Content-Type": contentType.startsWith("audio/") ? contentType : "audio/wav",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Voice unavailable" }, { status: 503 });
  }
}
