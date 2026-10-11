/**
 * Smoke tests for DC254's trust-boundary libraries.
 *
 * Tech-debt audit 2026-10-11 (test-debt finding): the repo shipped with zero
 * tests. These cover the three highest-value pure-logic surfaces — the
 * subscription-token HMAC lifecycle, the in-memory rate limiter, and the
 * JSON-LD serializer — chosen because they guard untrusted input or gate
 * production actions, run everywhere (no Redis or network needed), and
 * break loudly when regressed.
 *
 * Run: npx vitest run
 */
import { describe, expect, it, beforeEach, vi, afterEach } from "vitest";
import type { RateLimitVerdict } from "@/lib/rate-limit";

// ─── subscribe-tokens: HMAC sign/verify lifecycle ────────────────────────────

// Isolated process env per test: production mode + a real 32+ char secret
// exercises the same code path Vercel runs (the dev fallback secret would
// bypass the gate). The secret is resolved at every sign/verify call, so
// stubbing env in beforeEach is sufficient — no module re-import needed.
const { signActionToken, verifyActionToken } = await import(
  "@/lib/subscribe-tokens"
);

describe("subscribe-tokens", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SUBSCRIBE_SECRET", "test-secret-0123456789abcdef0123456789abcdef");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("round-trips a verify token to the original email", () => {
    const token = signActionToken("Reader@Example.com ", "verify");
    expect(token).not.toBeNull();
    expect(verifyActionToken(token, "verify")).toEqual({
      email: "reader@example.com",
    });
  });

  it("rejects a token used for the wrong action", () => {
    const token = signActionToken("reader@example.com", "verify");
    expect(verifyActionToken(token, "unsubscribe")).toBeNull();
  });

  it("rejects forged and tampered payloads", () => {
    const token = signActionToken("reader@example.com", "unsubscribe")!;
    const [payload, sig] = token.split(".");
    // flip one signature char
    const badSig = (sig[0] === "A" ? "B" : "A") + sig.slice(1);
    expect(verifyActionToken(`${payload}.${badSig}`, "unsubscribe")).toBeNull();
    // forged token (no valid signature)
    expect(verifyActionToken("e30.invalid-signature", "verify")).toBeNull();
    // garbage input never throws
    expect(verifyActionToken(null, "verify")).toBeNull();
    expect(verifyActionToken("", "verify")).toBeNull();
  });

  it("honours expiry: expired tokens are rejected", () => {
    const token = signActionToken("reader@example.com", "verify", -10);
    expect(verifyActionToken(token, "verify")).toBeNull();
  });

  it("fails closed in production without a usable secret", () => {
    vi.stubEnv("SUBSCRIBE_SECRET", "too-short");
    expect(signActionToken("reader@example.com", "verify")).toBeNull();
  });
});

// ─── rate-limit: in-memory sliding window ────────────────────────────────────

const { rateLimit, clientIp } = await import("@/lib/rate-limit");

describe("rate-limit (memory backend)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-11T12:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows up to the limit then returns 429 verdicts", async () => {
    const verdicts: RateLimitVerdict[] = [];
    for (let i = 0; i < 5; i++) {
      verdicts.push(await rateLimit("test-bucket", "1.2.3.4", 4, 60_000));
    }
    expect(verdicts.slice(0, 4).every((v) => !v.limited)).toBe(true);
    expect(verdicts[3].remaining).toBe(0);
    expect(verdicts[4].limited).toBe(true);
    expect(verdicts[4].backend).toBe("memory");
  });

  it("resets the window after it rolls over", async () => {
    await rateLimit("test-window", "5.6.7.8", 1, 60_000);
    const blocked = await rateLimit("test-window", "5.6.7.8", 1, 60_000);
    expect(blocked.limited).toBe(true);
    vi.advanceTimersByTime(60_001);
    const allowed = await rateLimit("test-window", "5.6.7.8", 1, 60_000);
    expect(allowed.limited).toBe(false);
  });

  it("isolates buckets and clients", async () => {
    await rateLimit("bucket-a", "9.9.9.9", 1, 60_000);
    const otherBucket = await rateLimit("bucket-b", "9.9.9.9", 1, 60_000);
    const otherIp = await rateLimit("bucket-a", "8.8.8.8", 1, 60_000);
    expect(otherBucket.limited).toBe(false);
    expect(otherIp.limited).toBe(false);
  });

  it("derives the client IP from x-forwarded-for", () => {
    const headers = new Headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" });
    expect(clientIp({ headers })).toBe("203.0.113.7");
  });
});

// ─── jsonld: script-safe serialization ───────────────────────────────────────

const { safeJsonLd } = await import("@/lib/jsonld");

describe("safeJsonLd", () => {
  it("escapes </script> breakout attempts", () => {
    const out = safeJsonLd({ name: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("</script>");
    expect(JSON.parse(out).name).toBe("</script><script>alert(1)</script>");
  });

  it("escapes raw < anywhere in strings while remaining valid JSON", () => {
    const out = safeJsonLd({ a: "x < y", b: "<em>hi</em>" });
    expect(out).not.toContain("<");
    const parsed = JSON.parse(out);
    expect(parsed.a).toBe("x < y");
    expect(parsed.b).toBe("<em>hi</em>");
  });

  it("escapes U+2028/U+2029 line separators (valid JSON, illegal in JS strings)", () => {
    const out = safeJsonLd({ a: "line\u2028sep\u2029end" });
    expect(out).not.toMatch(/[\u2028\u2029]/);
    expect(JSON.parse(out).a).toBe("line\u2028sep\u2029end");
  });

  it("leaves clean payloads byte-identical to JSON.stringify", () => {
    const obj = { name: "Kenya Data Centres", count: 27, ok: true, nested: ["a", 1] };
    expect(safeJsonLd(obj)).toBe(JSON.stringify(obj));
  });
});
