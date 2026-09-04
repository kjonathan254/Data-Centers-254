/**
 * Multi-provider LLM wiring for Jibu — the single place that knows how the
 * brain and the voice are wired. Everything degrades silently: when no key
 * is configured (or a key stops working), callers fall back to the
 * deterministic engine and the device-side voice. The site never breaks
 * because of this file.
 *
 * Providers, in priority order (the first configured one answers; the rest
 * are fail-over slots that activate the moment their key appears in env):
 *
 *   1. groq        — GROQ_API_KEY (recommended) / CHAT_LLM_API_KEY /
 *                    GROQ_KEY / GROQ_TOKEN / DATACENTRE254_JIBU, or any env
 *                    var whose name mentions "groq"/"jibu" holding a gsk_…
 *                    key.  Base: https://api.groq.com/openai/v1
 *                    Also serves the playai-tts HD voice (Groq-only).
 *   2. nvidia      — NVIDIA_API_KEY (nvapi-…), free from build.nvidia.com →
 *                    "Get API Key".  Base: https://integrate.api.nvidia.com/v1
 *   3. huggingface — HF_TOKEN (hf_…), from huggingface.co/settings/tokens;
 *                    monthly inference credits, OpenAI-compatible router.
 *                    Base: https://router.huggingface.co/v1
 *
 * All three speak the OpenAI chat-completions dialect, so one client walks
 * them all. Failure semantics:
 *   - model-level refusal (retired id, 404) → that model is skipped and the
 *     next candidate in the same provider's chain takes over;
 *   - 401/403 → the provider's key is dead: it is benched for the lifetime
 *     of this instance and the next provider takes over immediately;
 *   - anything else (quota, network, 5xx) → ends the walk for this request;
 *     the shared circuit breaker (3 consecutive failures → 5 min
 *     deterministic) still caps total damage.
 *
 * Model ids were verified against the live catalogs on 2026-09-04:
 *   integrate.api.nvidia.com/v1/models and router.huggingface.co/v1/models.
 * Chains self-heal regardless: a refused id is remembered and skipped.
 */

export type ProviderId = "groq" | "nvidia" | "huggingface";

export interface ProviderSpec {
  id: ProviderId;
  label: string;
  baseUrl: string;
  key: string;
  /** Ordered candidate chain (env-pinned model first, refusals filtered). */
  models: string[];
}

// ─── Base URLs ────────────────────────────────────────────────────────────────

export const LLM_BASE_URL =
  process.env.CHAT_LLM_BASE_URL || "https://api.groq.com/openai/v1";
const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";
const HF_BASE_URL = "https://router.huggingface.co/v1";

// ─── Key resolution ───────────────────────────────────────────────────────────

const GROQ_KEY_SHAPE = /^gsk_[A-Za-z0-9]{20,}$/;
const NVIDIA_KEY_SHAPE = /^nvapi-[A-Za-z0-9_\-]{20,}$/;
const HF_KEY_SHAPE = /^hf_[A-Za-z0-9_\-]{20,}$/;

function envValue(...names: string[]): string | null {
  for (const n of names) {
    const v = process.env[n];
    if (v && v.trim()) return v.trim();
  }
  return null;
}

export function resolveGroqKey(): string | null {
  const named = envValue(
    "GROQ_API_KEY",
    "CHAT_LLM_API_KEY",
    "GROQ_KEY",
    "GROQ_TOKEN",
    "DATACENTRE254_JIBU",
  );
  if (named) return named;
  for (const [name, value] of Object.entries(process.env)) {
    if (value && /groq|jibu/i.test(name) && GROQ_KEY_SHAPE.test(value.trim())) {
      return value.trim();
    }
  }
  return null;
}

export function resolveNvidiaKey(): string | null {
  const named = envValue(
    "NVIDIA_API_KEY",
    "NVIDIA_NIM_API_KEY",
    "NVIDIA_KEY",
    "NVIDIA_TOKEN",
  );
  if (named) return named;
  for (const [name, value] of Object.entries(process.env)) {
    if (value && /nvidia|nim/i.test(name) && NVIDIA_KEY_SHAPE.test(value.trim())) {
      return value.trim();
    }
  }
  return null;
}

export function resolveHuggingFaceKey(): string | null {
  const named = envValue(
    "HF_TOKEN",
    "HUGGINGFACE_API_KEY",
    "HUGGING_FACE_TOKEN",
    "HF_API_TOKEN",
  );
  if (named) return named;
  for (const [name, value] of Object.entries(process.env)) {
    if (value && /hugging|^hf_/i.test(name) && HF_KEY_SHAPE.test(value.trim())) {
      return value.trim();
    }
  }
  return null;
}

// ─── Model chains ─────────────────────────────────────────────────────────────
// Order reflects the live catalogs of 2026-09. Groq ids unchanged; the NVIDIA
// and HuggingFace chains lead with gpt-oss (proven in production on Groq,
// supports reasoning_effort), then a QA-tuned / high-quality non-reasoner,
// then progressively lighter fallbacks.

const GROQ_CHAIN = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
];

const NVIDIA_CHAIN = [
  "openai/gpt-oss-20b",
  "nvidia/llama3-chatqa-1.5-70b",
  "deepseek-ai/deepseek-v4-flash-0731",
  "google/gemma-3-12b-it",
  "mistralai/mistral-7b-instruct-v0.3",
];

const HF_CHAIN = [
  "openai/gpt-oss-120b",
  "meta-llama/Llama-3.1-8B-Instruct",
  "Qwen/Qwen3-4B-Instruct-2507",
  "openai/gpt-oss-20b",
];

function chainFor(id: ProviderId): string[] {
  if (id === "groq") {
    const pin = (process.env.GROQ_MODEL || process.env.CHAT_LLM_MODEL || "").trim();
    return pin ? [pin, ...GROQ_CHAIN.filter((m) => m !== pin)] : [...GROQ_CHAIN];
  }
  if (id === "nvidia") {
    const pin = (process.env.NVIDIA_MODEL || "").trim();
    return pin ? [pin, ...NVIDIA_CHAIN.filter((m) => m !== pin)] : [...NVIDIA_CHAIN];
  }
  const pin = (process.env.HF_MODEL || process.env.HUGGINGFACE_MODEL || "").trim();
  return pin ? [pin, ...HF_CHAIN.filter((m) => m !== pin)] : [...HF_CHAIN];
}

// ─── Rejection memory (per instance, per provider) ───────────────────────────

const rejectedModels = new Map<ProviderId, Set<string>>();
const authDead = new Set<ProviderId>();

function rejectedSet(id: ProviderId): Set<string> {
  let set = rejectedModels.get(id);
  if (!set) {
    set = new Set();
    rejectedModels.set(id, set);
  }
  return set;
}

/** Remember an id the provider refused, so the next request starts further down. */
export function noteModelRejected(id: ProviderId, model: string): void {
  rejectedSet(id).add(model);
}

/** Bench a provider whose key was refused (401/403) for this instance's lifetime. */
export function noteProviderAuthDead(id: ProviderId): void {
  authDead.add(id);
}

// ─── Provider resolution ──────────────────────────────────────────────────────

const PRIORITY: { id: ProviderId; label: string; baseUrl: string; key: string | null }[] = [
  { id: "groq", label: "Groq", baseUrl: LLM_BASE_URL, key: resolveGroqKey() },
  { id: "nvidia", label: "NVIDIA NIM", baseUrl: NVIDIA_BASE_URL, key: resolveNvidiaKey() },
  { id: "huggingface", label: "HuggingFace", baseUrl: HF_BASE_URL, key: resolveHuggingFaceKey() },
];

/**
 * Providers ready to answer right now, in priority order: configured, not
 * benched for auth failure, with refusals filtered out of their chains. At
 * most 3 candidates per provider keeps the walk inside the 10s budget.
 */
export function activeProviders(): ProviderSpec[] {
  const out: ProviderSpec[] = [];
  for (const p of PRIORITY) {
    if (!p.key || authDead.has(p.id)) continue;
    const chain = chainFor(p.id).filter((m) => !rejectedSet(p.id).has(m));
    const usable = chain.length ? chain : chainFor(p.id); // re-probe when exhausted
    out.push({
      id: p.id,
      label: p.label,
      baseUrl: p.baseUrl,
      key: p.key,
      models: usable.slice(0, 3),
    });
  }
  return out;
}

/** Every provider slot with its configuration status — for /api/chat/health. */
export function allProviderConfigs() {
  return PRIORITY.map((p) => {
    const chain = chainFor(p.id).filter((m) => !rejectedSet(p.id).has(m));
    const model = (chain.length ? chain : chainFor(p.id))[0];
    return {
      id: p.id,
      label: p.label,
      baseUrl: p.baseUrl,
      configured: Boolean(p.key),
      benched: authDead.has(p.id),
      model,
    };
  });
}

// ─── Reasoner helpers ─────────────────────────────────────────────────────────

/** Models that accept the OpenAI reasoning_effort parameter. */
export function reasonerEffort(model: string): "low" | null {
  return /gpt-oss/i.test(model) ? "low" : null;
}

/** True when the model may emit <think>…</think> blocks (DeepSeek, Qwen thinking…). */
export function mayEmitThinking(model: string): boolean {
  return /deepseek|qwq|thinking|kimi/i.test(model);
}

/** Strip chain-of-thought blocks some reasoner endpoints inline in content. */
export function stripThinking(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

/** Generous token ceiling for reasoners whose deliberation eats the budget. */
export function tokenCeiling(model: string): number {
  return mayEmitThinking(model) || /gpt-oss/i.test(model) ? 2000 : 1000;
}

// ─── Voice (Groq-only) ────────────────────────────────────────────────────────

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
