import { NextRequest, NextResponse } from "next/server";
import { resolveGroqKey, llmModel, LLM_BASE_URL } from "@/lib/chatbot/llm";

/**
 * GET /api/chat/health — LLM wiring diagnostic for Jibu.
 *
 * Answers the exact question that is otherwise invisible from outside a
 * serverless deployment: "why is Jibu running deterministic?"
 *
 *   keyResolved     — does this deployment see a Groq key? (env var present)
 *   groq.reachable  — can the deployment reach api.groq.com at all?
 *   groq.authOk     — does Groq accept the key? (false = revoked/typo)
 *   groq.modelAvailable — is the configured chat model offered to this key?
 *
 * Reports booleans only — the key itself is never echoed, logged or inferred.
 * When keyResolved is false the answer is returned immediately (no network
 * call, no secret in scope). A light per-IP limiter keeps probes polite.
 */

export const runtime = "nodejs";

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

async function probeGroq(apiKey: string) {
  const model = llmModel();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5_000);
  try {
    const res = await fetch(`${LLM_BASE_URL}/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: controller.signal,
    });
    if (res.status === 401 || res.status === 403) {
      return { reachable: true, authOk: false, modelAvailable: null as boolean | null };
    }
    if (!res.ok) {
      return { reachable: true, authOk: null as boolean | null, modelAvailable: null as boolean | null };
    }
    const data = (await res.json().catch(() => null)) as { data?: { id?: string }[] } | null;
    const ids = Array.isArray(data?.data) ? data!.data.map((m) => m.id ?? "") : null;
    return {
      reachable: true,
      authOk: true,
      modelAvailable: ids ? ids.includes(model) : (null as boolean | null),
    };
  } catch {
    return { reachable: false, authOk: null as boolean | null, modelAvailable: null as boolean | null };
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Slow down a little." }, { status: 429 });
  }

  const apiKey = resolveGroqKey();
  const model = llmModel();

  if (!apiKey) {
    return NextResponse.json(
      {
        ok: true,
        keyResolved: false,
        groq: { reachable: null, authOk: null, modelAvailable: null },
        model,
        hint: "No Groq key is visible to this deployment. Add GROQ_API_KEY (Project Settings → Environment Variables) in the Vercel project that serves this domain, then redeploy — env vars only apply to deployments created after they are saved.",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const groq = await probeGroq(apiKey);

  let hint: string | null = null;
  if (groq.reachable === false) {
    hint = "api.groq.com could not be reached from this deployment within 5s. Check network egress or CHAT_LLM_BASE_URL.";
  } else if (groq.authOk === false) {
    hint = "Groq rejected this key (401/403) — it is revoked or mistyped. Generate a fresh one at console.groq.com/keys and paste it directly into Vercel (never into a chat).";
  } else if (groq.modelAvailable === false) {
    hint = `The key works, but model "${model}" is not offered to this account. Set GROQ_MODEL to an available model id from console.groq.com (e.g. llama-3.1-8b-instant) and redeploy.`;
  } else if (groq.authOk === true && groq.modelAvailable === true) {
    hint = "LLM wiring is fully operational. Jibu will answer in llm mode; TTS additionally needs the PlayAI terms accepted once at console.groq.com.";
  }

  return NextResponse.json(
    { ok: true, keyResolved: true, groq, model, hint },
    { headers: { "Cache-Control": "no-store" } },
  );
}
