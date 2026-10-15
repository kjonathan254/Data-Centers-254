/**
 * Route-level guard-stack tests for POST /api/opportunity-brief/inquiry.
 *
 * tests/opportunity-brief-store.test.ts pins the store's fail-closed
 * persistence contract; this file pins the route's guard stack on top of it:
 * same-origin, per-IP rate limit, payload ceiling, honeypot, field
 * validation, and the two fail-closed paths (no Upstash -> 503 before
 * parsing; storage failure -> 503, never a fake success).
 *
 * Run: npx vitest run tests/opportunity-brief.test.ts
 */
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";

// No Upstash env at import time → rate-limit resolves to its deterministic
// memory backend and the enquiry route starts in its fail-closed state.
const { POST } = await import("@/app/api/opportunity-brief/inquiry/route");
const { OB_ENQUIRY_TTL_SECONDS } = await import(
  "@/lib/opportunity-brief-store"
);

const ENDPOINT = "http://localhost:3000/api/opportunity-brief/inquiry";

const VALID_BODY = {
  name: "Wanjiku Kamau",
  email: "Wanjiku.Kamau@Example.com",
  organisation: "PowerGrid Cooling Ltd",
  role: "Head of Business Development",
  buyerType: "vendor",
  preferredFormat: "single-brief",
  question:
    "Which upcoming Nairobi projects should we target for cooling retrofits this quarter?",
  consent: true,
};

function makeReq(
  body: unknown,
  headers: Record<string, string> = {}
): NextRequest {
  return new NextRequest(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

/** Stub Upstash env so the route's per-call storage check passes. */
function stubUpstash() {
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://test-redis.upstash.io");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
}

/**
 * Stateful Upstash REST fake matching the store's path-style commands
 * (set/expire/rpush/incr), with call recording for assertions.
 */
function makeUpstashFake(opts?: { fail?: boolean }) {
  const calls: string[][] = [];
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    if (opts?.fail) return new Response("upstream down", { status: 500 });
    const url = new URL(String(input));
    const segments = url.pathname
      .split("/")
      .filter(Boolean)
      .map(decodeURIComponent);
    const cmd = (segments[0] ?? "").toUpperCase();
    calls.push([cmd, ...segments.slice(1)]);
    const result = cmd === "INCR" ? 1 : cmd === "RPUSH" ? 1 : "OK";
    return new Response(JSON.stringify({ result }), { status: 200 });
  });
  vi.stubGlobal("fetch", fetchMock);
  return { calls, fetchMock };
}

describe("POST /api/opportunity-brief/inquiry (route guard stack)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("rejects cross-origin requests with 403 before anything else", async () => {
    stubUpstash();
    const { calls } = makeUpstashFake();
    const res = await POST(
      makeReq(VALID_BODY, { origin: "https://evil.example" })
    );
    expect(res.status).toBe(403);
    expect(calls).toHaveLength(0);
  });

  it("returns 429 once the per-IP limit is exhausted", async () => {
    stubUpstash();
    makeUpstashFake();
    const headers = { "x-real-ip": "10.30.0.1" };
    let last: Response | undefined;
    for (let i = 0; i < 6; i++) {
      last = await POST(makeReq(VALID_BODY, headers));
    }
    expect(last!.status).toBe(429);
  });

  it("fails closed with an honest 503 when persistent storage is missing", async () => {
    const res = await POST(makeReq(VALID_BODY, { "x-real-ip": "10.30.1.1" }));
    expect(res.status).toBe(503);
    const data = (await res.json()) as { error: string };
    expect(data.error).toMatch(/temporarily unavailable/i);
  });

  it("rejects oversized bodies via content-length with 413", async () => {
    stubUpstash();
    const res = await POST(
      makeReq("x".repeat(13_000), {
        "x-real-ip": "10.30.2.1",
        "content-length": "13000",
      })
    );
    expect(res.status).toBe(413);
  });

  it("gives honeypot submissions a success-shaped response and stores nothing", async () => {
    stubUpstash();
    const { calls } = makeUpstashFake();
    const res = await POST(
      makeReq(
        { ...VALID_BODY, website: "http://spam.example" },
        { "x-real-ip": "10.30.4.1" }
      )
    );
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ ok: true });
    expect(calls).toHaveLength(0);
  });

  it("validates required fields and answers 400 with the reason", async () => {
    stubUpstash();
    vi.stubGlobal("fetch", vi.fn());

    const cases: [Record<string, unknown>, RegExp][] = [
      [{ ...VALID_BODY, name: "" }, /name/i],
      [{ ...VALID_BODY, email: "not-an-email" }, /email/i],
      [{ ...VALID_BODY, question: "" }, /decision/i],
      [{ ...VALID_BODY, buyerType: "hacker" }, /organisation/i],
      [{ ...VALID_BODY, preferredFormat: "free-stuff" }, /interested/i],
      [{ ...VALID_BODY, consent: false }, /consent/i],
    ];
    for (const [i, [body, pattern]] of cases.entries()) {
      const res = await POST(
        makeReq(body, { "x-real-ip": `10.31.0.${i + 1}` })
      );
      expect(res.status).toBe(400);
      const data = (await res.json()) as { error: string };
      expect(data.error).toMatch(pattern);
    }
  });

  it("stores a cleaned record with referrer and user agent on the happy path", async () => {
    stubUpstash();
    const { calls, fetchMock } = makeUpstashFake();

    const res = await POST(
      makeReq(VALID_BODY, {
        "x-real-ip": "10.32.0.1",
        referer: "https://data-centers-254.vercel.app/opportunity-brief",
        "user-agent": "vitest-agent/1.0",
      })
    );
    expect(res.status).toBe(201);
    const data = (await res.json()) as { ok: boolean; reference: string };
    expect(data.ok).toBe(true);
    expect(data.reference).toMatch(/^[A-Z0-9]{8}$/);

    expect(fetchMock).toHaveBeenCalledTimes(5); // set, expire, rpush, expire, incr
    const setCall = calls.find((c) => c[0] === "SET");
    expect(setCall).toBeDefined();
    expect(setCall![1]).toMatch(/^ob:enquiry:/);

    const stored = JSON.parse(setCall![2]) as Record<string, unknown>;
    expect(stored.email).toBe("wanjiku.kamau@example.com"); // lowercased
    expect(stored.name).toBe("Wanjiku Kamau");
    expect(stored.buyerType).toBe("vendor");
    expect(stored.preferredFormat).toBe("single-brief");
    expect(stored.consent).toBe(true);
    expect(stored.privacyVersion).toBe("2026-10-15");
    expect(stored.referrer).toContain("/opportunity-brief");
    expect(stored.userAgent).toBe("vitest-agent/1.0");
    expect(stored.id).toBeDefined();
    expect(stored.createdAt).toBeDefined();
  });

  it("strips angle brackets from text fields before storage", async () => {
    stubUpstash();
    const { calls } = makeUpstashFake();

    await POST(
      makeReq({ ...VALID_BODY, name: "<script>Evil</script>" }, {
        "x-real-ip": "10.33.0.1",
      })
    );

    const setCall = calls.find((c) => c[0] === "SET");
    const stored = JSON.parse(setCall![2]) as Record<string, unknown>;
    expect(stored.name).toBe("scriptEvil/script");
  });

  it("re-stamps the 730-day retention TTL on the stored record", async () => {
    stubUpstash();
    const { calls } = makeUpstashFake();

    await POST(makeReq(VALID_BODY, { "x-real-ip": "10.34.0.1" }));

    const expireCall = calls.find((c) => c[0] === "EXPIRE" && c[1]?.startsWith("ob:enquiry:"));
    expect(expireCall).toBeDefined();
    expect(Number(expireCall![2])).toBe(OB_ENQUIRY_TTL_SECONDS);
  });

  it("answers a fail-closed 503 when the store write fails mid-flight", async () => {
    stubUpstash();
    makeUpstashFake({ fail: true });

    const res = await POST(makeReq(VALID_BODY, { "x-real-ip": "10.35.0.1" }));
    expect(res.status).toBe(503);
    const data = (await res.json()) as { error: string };
    expect(data.error).toMatch(/temporarily unavailable/i);
  });
});
