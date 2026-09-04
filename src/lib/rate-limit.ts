/**
 * Shared rate limiter — audit remediation #9 (persistent rate limiting).
 *
 * Two modes, selected automatically:
 *
 *  - PERSISTENT: when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are
 *    configured, counters live in Upstash Redis (fixed window via INCR +
 *    PEXPIRE over the REST API). Limits then hold across cold starts and are
 *    global across all serverless instances — one abuser can no longer
 *    multiply the limits by triggering parallel lambdas. Plain fetch only,
 *    so the module works in both the Node runtime and the Edge/proxy runtime.
 *
 *  - IN-MEMORY fallback (per serverless instance, resets on cold start): the
 *    original best-effort behaviour, used whenever the Upstash variables are
 *    absent or the Redis call fails. Rate limiting must never take the API
 *    down with it, so limiter infrastructure errors degrade to this mode.
 *
 * Usage:
 *   const verdict = await rateLimit("contact", clientIp(req), 5, 60_000);
 *   if (verdict.limited) return tooMany();
 *
 * Bucket names isolate counters ("api" = global proxy limiter, "contact",
 * "subscribe", "chat", "tts", "health", "csp-report").
 */

type HeadersLike = { headers: Headers };

export type RateLimitVerdict = {
  /** true → caller must reject with 429 */
  limited: boolean;
  /** requests left in the current window */
  remaining: number;
  /** epoch ms when the current window rolls over */
  resetAt: number;
  /** which backend produced the verdict */
  backend: "redis" | "memory";
};

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const PERSISTENT = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

// ─── In-memory fallback store (original behaviour + leak guard) ──────────────
const hits = new Map<string, { count: number; reset: number }>();

/** Opportunistic sweep so abandoned IPs don't accumulate forever. */
function sweepExpired(now: number): void {
  if (hits.size < 512) return;
  for (const [k, v] of hits) if (now > v.reset) hits.delete(k);
}

function memLimit(
  bucket: string,
  ip: string,
  limit: number,
  windowMs: number
): RateLimitVerdict {
  const now = Date.now();
  const key = `${bucket}:${ip}`;
  let entry = hits.get(key);
  if (!entry || now > entry.reset) {
    entry = { count: 0, reset: now + windowMs };
    hits.set(key, entry);
  }
  entry.count += 1;
  sweepExpired(now);
  return {
    limited: entry.count > limit,
    remaining: Math.max(0, limit - entry.count),
    resetAt: entry.reset,
    backend: "memory",
  };
}

// ─── Upstash REST fixed window (returns null on any failure → fall back) ─────
async function redisLimit(
  bucket: string,
  ip: string,
  limit: number,
  windowMs: number
): Promise<RateLimitVerdict | null> {
  const windowId = Math.floor(Date.now() / windowMs);
  const key = `rl:${bucket}:${ip}:${windowId}`;
  try {
    const res = await fetch(`${UPSTASH_URL}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "application/json",
      },
      // INCR + PEXPIRE in one round trip. Padding the TTL beyond the window
      // keeps the key alive for stragglers; the window id bounds overcounts.
      body: JSON.stringify([
        ["INCR", key],
        ["PEXPIRE", key, String(windowMs + 5_000)],
      ]),
      cache: "no-store",
      // Edge-compatible signal; serverless functions finish well inside it.
      signal: AbortSignal.timeout(2_000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{
      result?: number | string | null;
      error?: string;
    }>;
    const count = Number(data?.[0]?.result ?? NaN);
    if (!Number.isFinite(count)) return null;
    const resetAt = (windowId + 1) * windowMs;
    return {
      limited: count > limit,
      remaining: Math.max(0, limit - count),
      resetAt,
      backend: "redis",
    };
  } catch {
    return null;
  }
}

/**
 * Consume one unit from the bucket for this IP. Await it at the top of every
 * API route handler (and inside src/proxy.ts for the global /api limit).
 */
export async function rateLimit(
  bucket: string,
  ip: string,
  limit: number,
  windowMs = 60_000
): Promise<RateLimitVerdict> {
  if (PERSISTENT) {
    const viaRedis = await redisLimit(bucket, ip, limit, windowMs);
    if (viaRedis) return viaRedis;
  }
  return memLimit(bucket, ip, limit, windowMs);
}

/** True when limits are enforced against Redis instead of instance memory. */
export function persistentLimitingActive(): boolean {
  return PERSISTENT;
}

/** Consistent client-IP extraction across all API routes and the proxy. */
export function clientIp(req: HeadersLike): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}
