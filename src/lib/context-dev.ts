/**
 * context-dev.ts — server-side wrapper for the Context.dev API (ONE module;
 * never scatter raw fetch calls across the app).
 *
 * Docs (source of truth):
 *   - Quickstart:  https://docs.context.dev/quickstart
 *   - Search:      https://docs.context.dev/api-reference/web-scraping/search
 *   - Scrape:      https://docs.context.dev/api-reference/web-scraping/scrape
 *
 * Conventions (per project standing rules + Context.dev ground rules):
 *   - ZERO new npm dependencies: native fetch only (Vercel 10GB incident rule).
 *   - The API key is a server-side secret: read from env (CONTEXT_DEV_API_KEY,
 *     gitignored .env.local locally / Vercel env in production). Never import
 *     this module from a client component — the guard below throws.
 *   - 429 → honor Retry-After (bounded); 408/5xx → bounded backoff retries;
 *     other 4xx → fail fast (validation errors never retry).
 *   - Cached responses are served by the API by default (maxAgeMs, default 1
 *     day, max 30 days). Pass maxAgeMs: 0 for fresh captures.
 *   - Credits: search = 1 per 10 results; scrape = 1 (2 with browser actions).
 *     Use sparingly — one targeted call, not loops. For >a few hundred URLs
 *     use the Batch API (POST /batch/submit) instead.
 */

const BASE_URL = "https://api.context.dev/v1";

export type ContextSearchResult = {
  url: string;
  title: string;
  description: string;
  relevance: "high" | "medium" | "low";
};

export type ContextSearchOptions = {
  numResults?: number; // 10–100, default 10 (billed per 10)
  includeDomains?: string[];
  excludeDomains?: string[];
  freshness?: "last_24_hours" | "last_week" | "last_month" | "last_year";
  maxAgeMs?: number; // cache TTL for any scraped markdown, 0 = fresh
};

export type ContextScrapeOptions = {
  maxAgeMs?: number; // 0 = fresh capture; default API-side 1 day
  waitForMs?: number; // 0–30000, JS-heavy pages
};

export class ContextDevError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ContextDevError";
    this.status = status;
  }
}

function apiKey(): string {
  if (typeof window !== "undefined") {
    throw new ContextDevError("context-dev module is server-only", 0);
  }
  const key = process.env.CONTEXT_DEV_API_KEY;
  if (!key) {
    throw new ContextDevError(
      "CONTEXT_DEV_API_KEY missing — add it to .env.local (gitignored) or the Vercel env",
      0,
    );
  }
  return key;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function call<T>(path: string, body: unknown): Promise<T> {
  const key = apiKey();
  let lastError: ContextDevError | null = null;
  let retryAfterSeconds = 0;

  // Bounded retry loop: only 429 (honor Retry-After) and 408/5xx (backoff).
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      const delay = retryAfterSeconds > 0 ? retryAfterSeconds * 1000 : 1000 * 2 ** attempt;
      await sleep(Math.min(delay, 30_000));
    }
    retryAfterSeconds = 0;
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (res.ok) return (await res.json()) as T;

    if (res.status === 429 || res.status === 408 || res.status >= 500) {
      retryAfterSeconds = Number(res.headers.get("Retry-After") ?? 0);
      lastError = new ContextDevError(
        `Context.dev ${res.status} on ${path}${retryAfterSeconds ? ` (Retry-After ${retryAfterSeconds}s)` : ""}`,
        res.status,
      );
      continue;
    }
    // 4xx validation/permission errors: never retry.
    const detail = await res.text().catch(() => "");
    throw new ContextDevError(
      `Context.dev ${res.status} on ${path}: ${detail.slice(0, 300) || res.statusText}`,
      res.status,
    );
  }
  throw lastError ?? new ContextDevError("Context.dev call failed", 0);
}

/** POST /web/search — ranked web results (1 credit per 10 results). */
export async function contextSearch(
  query: string,
  opts: ContextSearchOptions = {},
): Promise<ContextSearchResult[]> {
  const body: Record<string, unknown> = { query, numResults: opts.numResults ?? 10 };
  if (opts.includeDomains?.length) body.includeDomains = opts.includeDomains;
  if (opts.excludeDomains?.length) body.excludeDomains = opts.excludeDomains;
  if (opts.freshness) body.freshness = opts.freshness;
  if (typeof opts.maxAgeMs === "number") body.maxAgeMs = opts.maxAgeMs;
  const json = await call<{ results?: ContextSearchResult[] }>("/web/search", body);
  return json.results ?? [];
}

/** POST /web/scrape — one URL as Markdown (1 credit; 2 with browser actions). */
export async function contextScrape(
  url: string,
  opts: ContextScrapeOptions = {},
): Promise<string> {
  const body: Record<string, unknown> = { url, formats: { markdown: true } };
  if (typeof opts.maxAgeMs === "number") body.maxAgeMs = opts.maxAgeMs;
  if (typeof opts.waitForMs === "number") body.waitForMs = opts.waitForMs;
  const json = await call<{ markdown?: string }>("/web/scrape", body);
  return json.markdown ?? "";
}
