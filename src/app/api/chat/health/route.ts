import { NextRequest, NextResponse } from "next/server";
import {
  allProviderConfigs,
  activeProviders,
  reasonerEffort,
  chatTemplateKwargs,
  tokenCeiling,
} from "@/lib/chatbot/llm";
import { rateLimit, clientIp, persistentLimitingActive } from "@/lib/rate-limit";

/**
 * GET /api/chat/health — LLM wiring diagnostic for Jibu.
 *
 * Answers the exact question that is otherwise invisible from outside a
 * serverless deployment: "why is Jibu running deterministic?"
 *
 * Jibu walks a provider priority chain (groq → nvidia → huggingface; see
 * src/lib/chatbot/llm.ts). This endpoint reports every slot:
 *
 *   configured      — a key for that provider is visible to this deployment
 *   benched         — the key was refused (401/403) earlier on this instance
 *   active          — the provider that would answer right now (first configured)
 *
 * The active slot additionally gets a live probe:
 *   reachable       — could the deployment reach the provider at all?
 *   authOk          — does the provider accept the key? (a 1-token chat call;
 *                     /models is public on NIM/HF and proves nothing about auth)
 *   modelAvailable  — does the provider accept the current candidate model?
 *   availableModels — the ids the account/catalog lists (public metadata), capped.
 *
 * Reports booleans and public model ids only — keys are never echoed, logged
 * or inferred. When no key is configured the answer is returned immediately
 * (no network call, no secret in scope). A light per-IP limiter keeps probes
 * polite.
 */

export const runtime = "nodejs";

const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;
const MAX_LISTED_MODELS = 60;

type Probe = {
  reachable: boolean | null;
  authOk: boolean | null;
  modelAvailable: boolean | null;
  availableModels: string[] | null;
};

const emptyProbe = (): Probe => ({
  reachable: null,
  authOk: null,
  modelAvailable: null,
  availableModels: null,
});

/**
 * Two cheap calls against the active provider: a 1-token chat completion
 * (the real auth + model verdict) and a /models listing (catalog reference
 * for hint generation). Any network error ⇒ reachable: false.
 */
async function probeProvider(
  baseUrl: string,
  apiKey: string,
  model: string,
): Promise<Probe> {
  const probe = emptyProbe();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6_000);
  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: tokenCeiling(model),
        ...(reasonerEffort(model) ? { reasoning_effort: reasonerEffort(model) } : {}),
        ...(chatTemplateKwargs(model) ? { chat_template_kwargs: chatTemplateKwargs(model) } : {}),
        messages: [{ role: "user", content: "Reply with the single word: ready" }],
      }),
      signal: controller.signal,
    });
    if (res.status === 401 || res.status === 403) {
      probe.reachable = true;
      probe.authOk = false;
      return probe;
    }
    if (!res.ok) {
      // Reachable, key accepted unless proven otherwise, but this model id
      // was refused — the chain self-heals on real traffic. A 404 on a valid
      // chat route is model-level (NIM: "Function … Not found for account").
      probe.reachable = true;
      probe.authOk = res.status !== 402; // 402 = out of credit
      probe.modelAvailable = res.status === 404 ? false : null;
      return probe;
    }
    probe.reachable = true;
    probe.authOk = true;
    probe.modelAvailable = true;
  } catch {
    probe.reachable = false;
    return probe;
  } finally {
    clearTimeout(timer);
  }

  // Catalog listing — public metadata, never fails the probe.
  const listController = new AbortController();
  const listTimer = setTimeout(() => listController.abort(), 5_000);
  try {
    const res = await fetch(`${baseUrl}/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: listController.signal,
    });
    if (res.ok) {
      const data = (await res.json().catch(() => null)) as {
        data?: { id?: string }[];
      } | null;
      const ids = Array.isArray(data?.data)
        ? data!.data.map((m) => m.id ?? "").filter(Boolean)
        : null;
      probe.availableModels = ids ? ids.slice(0, MAX_LISTED_MODELS) : null;
    }
  } catch {
    // listing is best-effort
  } finally {
    clearTimeout(listTimer);
  }
  return probe;
}

function buildHint(
  activeSpec: { id: string; label: string; model: string } | null,
  probe: Probe,
  fallbacks: string[],
): string | null {
  if (!activeSpec) {
    return "No LLM key is visible to this deployment. Add GROQ_API_KEY (console.groq.com/keys) — or NVIDIA_API_KEY (build.nvidia.com → Get API Key) or HF_TOKEN (huggingface.co/settings/tokens) — under Project Settings → Environment Variables in the Vercel project that serves this domain, then redeploy. Env vars only apply to deployments created after they are saved. Without a key Jibu answers deterministically and never breaks.";
  }
  if (probe.reachable === false) {
    return `${activeSpec.label} could not be reached from this deployment within 6s. Check network egress in the Vercel region.`;
  }
  if (probe.authOk === false) {
    return `${activeSpec.label} rejected this key (401/403) — it is revoked or mistyped. Generate a fresh one and paste it directly into Vercel (never into a chat). ${fallbacks.length ? `Configured fallbacks: ${fallbacks.join(", ")}.` : "No fallback provider is configured yet (NVIDIA_API_KEY / HF_TOKEN)."}`;
  }
  if (probe.authOk === true && probe.modelAvailable === false) {
    const listed = probe.availableModels ?? [];
    const suggestion = listed.find((m) => /gpt-oss|llama|qwen|gemma|mistral|nemotron/i.test(m));
    const pinVar =
      activeSpec.id === "groq" ? "GROQ_MODEL" : activeSpec.id === "nvidia" ? "NVIDIA_MODEL" : "HF_MODEL";
    return `Model "${activeSpec.model}" was refused by ${activeSpec.label}. Set ${pinVar}=${suggestion ?? listed[0] ?? "<a listed id>"} to pin a working id — the fallback chain also switches automatically on the next question.`;
  }
  if (probe.authOk === true) {
    return `LLM wiring is fully operational via ${activeSpec.label}. Jibu will answer in llm mode. ${fallbacks.length ? `Fail-over slots configured: ${fallbacks.join(", ")}.` : "Optional fail-over slots (auto-activate when their key is added): NVIDIA_API_KEY (build.nvidia.com), HF_TOKEN (huggingface.co)."}`;
  }
  return null;
}

export async function GET(request: NextRequest) {
  const ip = clientIp(request);
  const rlVerdict = await rateLimit("health", ip, RATE_LIMIT, WINDOW_MS);
  if (rlVerdict.limited) {
    return NextResponse.json({ error: "Slow down a little." }, { status: 429 });
  }

  const configs = allProviderConfigs();
  const actives = activeProviders();
  const activeSpec = actives[0] ?? null;

  const providers: Record<
    string,
    { configured: boolean; benched: boolean; model: string; probe: Probe }
  > = {};
  for (const c of configs) {
    providers[c.id] = {
      configured: c.configured,
      benched: c.benched,
      model: c.model,
      probe: emptyProbe(),
    };
  }

  let hint: string | null = null;
  if (activeSpec) {
    const probe = await probeProvider(activeSpec.baseUrl, activeSpec.key, activeSpec.models[0]);
    providers[activeSpec.id].probe = probe;
    const fallbacks = actives
      .slice(1)
      .map((p) => providers[p.id].model ? `${p.id} (${providers[p.id].model})` : p.id);
    hint = buildHint(
      { id: activeSpec.id, label: activeSpec.label, model: activeSpec.models[0] },
      probe,
      fallbacks,
    );
  } else {
    hint = buildHint(null, emptyProbe(), []);
  }

  return NextResponse.json(
    {
      ok: true,
      keyResolved: Boolean(activeSpec),
      active: activeSpec?.id ?? null,
      providers,
      rateLimit: {
        configured: persistentLimitingActive(),
        backend: rlVerdict.backend,
      },
      hint,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
