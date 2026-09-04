import { NextRequest, NextResponse } from "next/server";
import {
  resolveGroqKey,
  llmModel,
  modelCandidates,
  LLM_BASE_URL,
} from "@/lib/chatbot/llm";
import { rateLimit, clientIp } from "@/lib/rate-limit";

/**
 * GET /api/chat/health — LLM wiring diagnostic for Jibu.
 *
 * Answers the exact question that is otherwise invisible from outside a
 * serverless deployment: "why is Jibu running deterministic?"
 *
 *   keyResolved     — does this deployment see a Groq key? (env var present)
 *   groq.reachable  — can the deployment reach api.groq.com at all?
 *   groq.authOk     — does Groq accept the key? (false = revoked/typo)
 *   groq.modelAvailable — is the current candidate model offered to this key?
 *   groq.availableModels — the ids this key may use (public metadata), capped.
 *
 * Reports booleans and public model ids only — the key itself is never
 * echoed, logged or inferred. When keyResolved is false the answer is
 * returned immediately (no network call, no secret in scope). A light
 * per-IP limiter keeps probes polite.
 */

export const runtime = "nodejs";

const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;
const MAX_LISTED_MODELS = 60;

type GroqProbe = {
  reachable: boolean | null;
  authOk: boolean | null;
  modelAvailable: boolean | null;
  availableModels: string[] | null;
};

async function probeGroq(apiKey: string): Promise<GroqProbe> {
  const model = llmModel();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5_000);
  try {
    const res = await fetch(`${LLM_BASE_URL}/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: controller.signal,
    });
    if (res.status === 401 || res.status === 403) {
      return { reachable: true, authOk: false, modelAvailable: null, availableModels: null };
    }
    if (!res.ok) {
      return { reachable: true, authOk: null, modelAvailable: null, availableModels: null };
    }
    const data = (await res.json().catch(() => null)) as { data?: { id?: string }[] } | null;
    const ids = Array.isArray(data?.data) ? data!.data.map((m) => m.id ?? "").filter(Boolean) : null;
    return {
      reachable: true,
      authOk: true,
      modelAvailable: ids ? ids.includes(model) : null,
      availableModels: ids ? ids.slice(0, MAX_LISTED_MODELS) : null,
    };
  } catch {
    return { reachable: false, authOk: null, modelAvailable: null, availableModels: null };
  } finally {
    clearTimeout(timer);
  }
}

function buildHint(groq: GroqProbe): string | null {
  if (groq.reachable === false) {
    return "api.groq.com could not be reached from this deployment within 5s. Check network egress or CHAT_LLM_BASE_URL.";
  }
  if (groq.authOk === false) {
    return "Groq rejected this key (401/403) — it is revoked or mistyped. Generate a fresh one at console.groq.com/keys and paste it directly into Vercel (never into a chat).";
  }
  if (groq.authOk === true && groq.availableModels) {
    const offered = new Set(groq.availableModels);
    if (!offered.has(llmModel())) {
      const chainPick = modelCandidates().find((m) => offered.has(m) && m !== llmModel());
      if (chainPick) {
        return `Model "${llmModel()}" is retired for this key, but "${chainPick}" is available — Jibu's fallback chain will switch automatically on the next question. Optionally pin it with GROQ_MODEL=${chainPick}.`;
      }
      const suggestions = groq.availableModels
        .filter((m) => /llama|gpt|kimi|qwen|gemma/i.test(m))
        .slice(0, 4);
      return `Model "${llmModel()}" is retired for this key and no chain candidate matched. Set GROQ_MODEL to one of the account's available models, e.g. ${suggestions.join(", ") || groq.availableModels[0]}.`;
    }
    return "LLM wiring is fully operational. Jibu will answer in llm mode; TTS additionally needs the PlayAI terms accepted once at console.groq.com.";
  }
  return null;
}

export async function GET(request: NextRequest) {
  const ip = clientIp(request);
  if ((await rateLimit("health", ip, RATE_LIMIT, WINDOW_MS)).limited) {
    return NextResponse.json({ error: "Slow down a little." }, { status: 429 });
  }

  const apiKey = resolveGroqKey();
  const model = llmModel();

  if (!apiKey) {
    return NextResponse.json(
      {
        ok: true,
        keyResolved: false,
        groq: { reachable: null, authOk: null, modelAvailable: null, availableModels: null },
        model,
        hint: "No Groq key is visible to this deployment. Add GROQ_API_KEY (Project Settings → Environment Variables) in the Vercel project that serves this domain, then redeploy — env vars only apply to deployments created after they are saved.",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const groq = await probeGroq(apiKey);
  const hint = buildHint(groq);

  return NextResponse.json(
    { ok: true, keyResolved: true, groq, model, hint },
    { headers: { "Cache-Control": "no-store" } },
  );
}
