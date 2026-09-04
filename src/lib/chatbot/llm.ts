/**
 * Groq LLM configuration — the single place that knows how the brain and the
 * voice are wired. Everything degrades silently: when no key is configured
 * (or the key stops working), callers fall back to the deterministic engine
 * and the device-side voice. The site never breaks because of this file.
 *
 * Key resolution order:
 *   1. GROQ_API_KEY            — recommended name
 *   2. CHAT_LLM_API_KEY        — original adapter name
 *   3. GROQ_KEY / GROQ_TOKEN   — common alternates
 *   4. DATACENTRE254_JIBU      — project-specific name
 *   5. Any env var whose NAME mentions "groq" or "jibu" and whose VALUE looks
 *      like a Groq key (gsk_…) — tolerates custom names in the Vercel panel.
 *
 * Models — a self-healing candidate chain:
 *   GROQ_MODEL / CHAT_LLM_MODEL win if set; otherwise the chain below is
 *   walked in order. Groq retires model ids over time (llama-3.3-70b-versatile
 *   was withdrawn from newer accounts in 2026); when the API answers with a
 *   model-level error, the id is remembered as rejected for this instance and
 *   the next candidate takes over — no redeploy, no manual env changes.
 *   /api/chat/health reports which ids the account actually offers.
 *   - Voice: playai-tts (HD voice; requires accepting the model terms once at
 *     console.groq.com → PlayAI — until then the client silently uses the
 *     device Web Speech voice.)
 */

const KEY_SHAPE = /^gsk_[A-Za-z0-9]{20,}$/;

export function resolveGroqKey(): string | null {
  const named =
    process.env.GROQ_API_KEY ||
    process.env.CHAT_LLM_API_KEY ||
    process.env.GROQ_KEY ||
    process.env.GROQ_TOKEN ||
    process.env.DATACENTRE254_JIBU ||
    null;
  if (named) return named.trim();
  for (const [name, value] of Object.entries(process.env)) {
    if (value && /groq|jibu/i.test(name) && KEY_SHAPE.test(value.trim())) {
      return value.trim();
    }
  }
  return null;
}

export const LLM_BASE_URL =
  process.env.CHAT_LLM_BASE_URL || "https://api.groq.com/openai/v1";

// Ordered candidate chain. Groq's /models endpoint is the source of truth —
// /api/chat/health reports what the account actually offers. Order reflects
// the 2026 Groq line-up for current accounts: the gpt-oss models are the
// flagship text models still served (120b quality, 20b speed), qwen is the
// wide-availability fallback, and the llama ids remain for older accounts
// that still have them. Reasoning-model quirks (empty content when
// max_tokens is tight) are handled in llmAnswer().
const DEFAULT_MODEL_CHAIN = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
];

const rejectedModels = new Set<string>();

export function modelCandidates(): string[] {
  const configured = (process.env.GROQ_MODEL || process.env.CHAT_LLM_MODEL || "").trim();
  if (configured) return [configured, ...DEFAULT_MODEL_CHAIN.filter((m) => m !== configured)];
  return [...DEFAULT_MODEL_CHAIN];
}

/** Candidates not (yet) refused by Groq on this instance; re-probe when exhausted. */
export function liveModelCandidates(): string[] {
  const usable = modelCandidates().filter((m) => !rejectedModels.has(m));
  if (usable.length) return usable.slice(0, 3);
  // Every known id has been refused at some point. Clear the memory and
  // re-probe from the top: a model-level refusal costs ~150ms, and a retired
  // id is far cheaper to re-ask than locking the instance out of its only
  // live model (which all.slice(0,1) used to do — it kept retrying the first,
  // already-dead entry forever).
  rejectedModels.clear();
  return modelCandidates().slice(0, 3);
}

/** The model to try first on the next request. */
export function llmModel(): string {
  return liveModelCandidates()[0];
}

/** Remember an id Groq refused, so the next request starts further down the chain. */
export function noteModelRejected(model: string): void {
  rejectedModels.add(model);
}

export function llmTtsVoice(): string {
  return process.env.CHAT_TTS_VOICE || "Celeste-PlayAI";
}

// ─── Circuit breaker ──────────────────────────────────────────────────────────
// A revoked / mistyped key returns 403 in ~150ms, but we still don't want to
// pay that on every message. After 3 consecutive LLM failures the breaker
// opens for 5 minutes and Jibu runs fully deterministic. Any success resets it.

let consecutiveFailures = 0;
let downUntil = 0;

export function llmTemporarilyDown(): boolean {
  return Date.now() < downUntil;
}

export function noteLlmFailure(): void {
  consecutiveFailures += 1;
  if (consecutiveFailures >= 3) {
    downUntil = Date.now() + 5 * 60_000;
    consecutiveFailures = 0;
  }
}

export function noteLlmSuccess(): void {
  consecutiveFailures = 0;
}
