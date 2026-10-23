/**
 * Route-level tests for the export-interest enquiry capture (POST
 * /api/export-interest), the pre-checkout store behind /data-exports.
 *
 * Tech-audit 2026-10-23 findings covered here:
 *   - enquiry-store atomicity: the Upstash write path must be a single
 *     atomic EVAL (exists + set + incr in one script), and a storage
 *     failure must never surface as a success response to a buyer;
 *   - route journey tests: validation, honeypot, duplicates, rate limit,
 *     origin guard and the failure path, none of which the subscribe
 *     suites cover (different route, different store keys).
 *
 * Everything runs in-memory: no Upstash (memory store + memory rate
 * limiter) except the two contract tests that stub global fetch to
 * capture the EVAL payload, and no network.
 *
 * Run: npx vitest run
 */
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";

const BASE = "http://localhost:3000";

type RouteModule = {
  POST: (req: NextRequest) => Promise<Response>;
};

async function importRoute() {
  vi.resetModules();
  const route = await import("@/app/api/export-interest/route");
  return route as unknown as RouteModule;
}

function enquiryRequest(
  payload: Record<string, unknown>,
  opts: { ip?: string; origin?: string } = {}
): NextRequest {
  const headers = new Headers({
    "content-type": "application/json",
    "x-real-ip": opts.ip ?? "198.51.100.40",
  });
  if (opts.origin) headers.set("origin", opts.origin);
  return new NextRequest(`${BASE}/api/export-interest`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
}

describe("export-interest route (buyer enquiry capture)", () => {
  beforeEach(() => {
    // Dev mode + forced memory backends: no Upstash, no Resend, no network.
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("stores a valid enquiry and returns 201 created", async () => {
    const route = await importRoute();
    const store = await import("@/lib/newsletter-store");
    const res = await route.POST(
      enquiryRequest({
        email: "Buyer@Example.com",
        kind: "q4-2026-snapshot",
      })
    );
    expect(res.status).toBe(201);
    const stats = await store.getStats();
    expect(stats.exportInterests).toBe(1);
  });

  it("is idempotent: the same address twice counts once and answers 200", async () => {
    const route = await importRoute();
    const store = await import("@/lib/newsletter-store");
    const first = await route.POST(
      enquiryRequest({ email: "buyer@example.com", kind: "invoice-request" })
    );
    const second = await route.POST(
      enquiryRequest({ email: "buyer@example.com", kind: "invoice-request" })
    );
    expect(first.status).toBe(201);
    expect(second.status).toBe(200);
    const body = (await second.json()) as { message?: string };
    expect(body.message).toBe("Already on the list");
    expect((await store.getStats()).exportInterests).toBe(1);
  });

  it("rejects missing and malformed emails with 400, storing nothing", async () => {
    const route = await importRoute();
    const store = await import("@/lib/newsletter-store");
    for (const email of ["", "not-an-email", "a@b", undefined]) {
      const res = await route.POST(enquiryRequest({ email }));
      expect(res.status).toBe(400);
    }
    expect((await store.getStats()).exportInterests).toBe(0);
  });

  it("honeypot fill returns fake success and records nothing", async () => {
    const route = await importRoute();
    const store = await import("@/lib/newsletter-store");
    const res = await route.POST(
      enquiryRequest({
        email: "buyer@example.com",
        website: "http://spam.example",
      })
    );
    expect(res.status).toBe(201);
    expect((await store.getStats()).exportInterests).toBe(0);
  });

  it("cross-origin submissions are rejected before any store write", async () => {
    const route = await importRoute();
    const store = await import("@/lib/newsletter-store");
    const res = await route.POST(
      enquiryRequest(
        { email: "buyer@example.com" },
        { origin: "https://evil.example" }
      )
    );
    expect(res.status).toBe(403);
    expect((await store.getStats()).exportInterests).toBe(0);
  });

  it("caps submissions at the per-IP rate limit with 429", async () => {
    const route = await importRoute();
    for (let i = 0; i < 5; i++) {
      const res = await route.POST(
        enquiryRequest(
          { email: `buyer-${i}@example.com` },
          { ip: "203.0.113.9" }
        )
      );
      expect(res.status).toBe(201);
    }
    const sixth = await route.POST(
      enquiryRequest(
        { email: "buyer-6@example.com" },
        { ip: "203.0.113.9" }
      )
    );
    expect(sixth.status).toBe(429);
  });

  it("oversized payloads are rejected with 413 before parsing", async () => {
    const route = await importRoute();
    const headers = new Headers({
      "content-type": "application/json",
      "x-real-ip": "198.51.100.41",
      "content-length": String(50_000),
    });
    const res = await route.POST(
      new NextRequest(`${BASE}/api/export-interest`, {
        method: "POST",
        headers,
        body: JSON.stringify({ email: "buyer@example.com" }),
      })
    );
    expect(res.status).toBe(413);
  });

  it("a storage failure returns 500 and never a success response", async () => {
    vi.doMock("@/lib/newsletter-store", async (importOriginal) => {
      const actual =
        await importOriginal<typeof import("@/lib/newsletter-store")>();
      return {
        ...actual,
        saveExportInterest: vi
          .fn()
          .mockRejectedValue(new Error("upstash unavailable")),
      };
    });
    const route = await importRoute();
    const res = await route.POST(
      enquiryRequest({ email: "buyer@example.com", kind: "invoice-request" })
    );
    expect(res.status).toBe(500);
    const body = (await res.json()) as { error?: string; message?: string };
    expect(body.error).toBeTruthy();
    expect(body.message).toBeUndefined();
    vi.doUnmock("@/lib/newsletter-store");
  });
});

describe("export-interest Upstash path (atomic EVAL contract)", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("sends exists + set + incr as ONE atomic EVAL command", async () => {
    const calls: { url: string; body: string }[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string | URL, init?: RequestInit) => {
        calls.push({ url: String(url), body: String(init?.body) });
        return new Response(JSON.stringify({ result: 1 }), { status: 200 });
      })
    );
    const store = await import("@/lib/newsletter-store");
    const created = await store.saveExportInterest(
      "buyer@example.com",
      "q4-2026-snapshot"
    );
    expect(created).toBe(true);
    expect(calls).toHaveLength(1);
    const cmd = JSON.parse(calls[0].body) as string[];
    expect(cmd[0]).toBe("EVAL");
    expect(Number(cmd[2])).toBe(2); // two keys
    expect(cmd[3]).toMatch(/^nl:exp:[0-9a-f]{64}$/);
    expect(cmd[4]).toBe("nl:count:export");
    const script = cmd[1];
    expect(script).toContain("exists");
    expect(script).toContain("redis.call('set'");
    expect(script).toContain("redis.call('incr'");
    // the record payload travels inside the script's ARGV, not a second call
    expect(cmd[5]).toContain("buyer@example.com");
  });

  it("maps the script's 0 (already exists) to created=false", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ result: 0 }), { status: 200 })
      )
    );
    const store = await import("@/lib/newsletter-store");
    expect(await store.saveExportInterest("dup@example.com", "x")).toBe(false);
  });

  it("propagates storage failures so the route can fail closed", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("upstash 500", { status: 500 }))
    );
    const store = await import("@/lib/newsletter-store");
    await expect(
      store.saveExportInterest("buyer@example.com", "x")
    ).rejects.toThrow(/EVAL failed/);
  });
});
