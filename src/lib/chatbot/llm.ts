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
 * Free-tier models (as configured by default):
 *   - Chat: llama-3.3-70b-versatile  (grounded synthesis for Jibu's answers)
 *   - Voice: playai-tts              (HD voice; requires accepting the model
 *     terms once at console.groq.com → PlayAI — until then the client silently
 *     uses the device Web Speech voice.)
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

export function llmModel(): string {
  return process.env.GROQ_MODEL || process.env.CHAT_LLM_MODEL || "llama-3.3-70b-versatile";
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
