/**
 * Route-level E2E tests for the double opt-in subscription lifecycle.
 *
 * The BIG TASK DO2 residue listed "signup / confirmation / unsubscribe /
 * erase E2E tests" as missing: the existing suites covered the store
 * mechanics (newsletter-store.test.ts, audit D02) and the token crypto
 * (lib.smoke.test.ts) in isolation, but never the actual route handlers
 * wired together as a visitor would experience them:
 *
 *   POST /api/subscribe            → unverified record + confirmation mail
 *   GET  /api/subscribe/verify     → verified record (double opt-in)
 *   GET  /api/subscribe/unsubscribe→ PII erased, anonymised tombstone
 *
 * Everything runs in-memory: no Upstash (memory store + memory rate
 * limiter), no Resend (dev mode skips the confirmation email), no network.
 * Modules are re-imported per test so the in-memory stores and rate-limit
 * counters start clean every time.
 *
 * Run: npx vitest run
 */
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";

const BASE = "http://localhost:3000";

type RouteModule = {
  POST?: (req: NextRequest) => Promise<Response>;
  GET?: (req: NextRequest) => Promise<Response>;
};

/** Fresh module registry per test → fresh stores, fresh rate-limit state. */
async function importLifecycle() {
  vi.resetModules();
  const [subscribe, verify, unsubscribe, store, tokens] = await Promise.all([
    import("@/app/api/subscribe/route"),
    import("@/app/api/subscribe/verify/route"),
    import("@/app/api/subscribe/unsubscribe/route"),
    import("@/lib/newsletter-store"),
    import("@/lib/subscribe-tokens"),
  ]);
  return {
    subscribe: subscribe as RouteModule,
    verify: verify as RouteModule,
    unsubscribe: unsubscribe as RouteModule,
    store,
    tokens,
  };
}

function signupRequest(
  payload: Record<string, unknown>,
  opts: { ip?: string; origin?: string } = {}
): NextRequest {
  const headers = new Headers({
    "content-type": "application/json",
    "x-real-ip": opts.ip ?? "198.51.100.20",
  });
  if (opts.origin) headers.set("origin", opts.origin);
  return new NextRequest(`${BASE}/api/subscribe`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
}

function tokenRequest(
  path: string,
  token: string | null
): NextRequest {
  const qs = token === null ? "" : `?token=${encodeURIComponent(token)}`;
  return new NextRequest(`${BASE}${path}${qs}`, {
    headers: new Headers({ "x-real-ip": "198.51.100.21" }),
  });
}

function redirectPath(res: Response): string {
  const location = res.headers.get("location");
  expect(location, "expected a redirect response").toBeTruthy();
  return new URL(location!).pathname;
}

describe("subscribe flow E2E (double opt-in lifecycle)", () => {
  beforeEach(() => {
    // Dev mode: the email stack is unconfigured, the route logs and
    // continues — the flow mechanics stay testable without Resend.
    vi.stubEnv("NODE_ENV", "development");
    // Force the memory backends regardless of the host environment.
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("runs the full lifecycle: signup → confirm → unsubscribe erases PII → resubscribe counts once", async () => {
    const { subscribe, verify, unsubscribe, store, tokens } =
      await importLifecycle();
    const email = "e2e-lifecycle@example.com";

    // 1. Signup → "check your inbox", record stored as unverified.
    const signup = await subscribe.POST!(
      signupRequest({
        email,
        role: "investor",
        companyType: "Acme <Cap>",
        source: "e2e-test",
      })
    );
    expect(signup.status).toBe(200);
    expect(((await signup.json()) as { message: string }).message).toMatch(
      /inbox/i
    );

    const before = await store.getSubscriber(email);
    expect(before).not.toBeNull();
    expect(before!.status).toBe("unverified");
    expect(before!.role).toBe("investor");
    expect(before!.companyType).toBe("Acme Cap"); // <> stripped by sanitizer

    // 2. Confirmation link (signed token as it would arrive in the email)
    //    → redirect to /subscribe/verified, record flips to verified.
    const verifyToken = tokens.signActionToken(email, "verify");
    expect(verifyToken).not.toBeNull();
    const confirmed = await verify.GET!(tokenRequest("/api/subscribe/verify", verifyToken!));
    expect(confirmed.status).toBe(302);
    expect(redirectPath(confirmed)).toBe("/subscribe/verified");

    const after = await store.getSubscriber(email);
    expect(after!.status).toBe("verified");
    expect(after!.verifiedAt).toBeTruthy();

    // 3. Unsubscribe link → tombstone: every personal detail erased.
    const unsubToken = tokens.signActionToken(email, "unsubscribe");
    const unsubscribed = await unsubscribe.GET!(
      tokenRequest("/api/subscribe/unsubscribe", unsubToken!)
    );
    expect(unsubscribed.status).toBe(302);
    expect(redirectPath(unsubscribed)).toBe("/subscribe/unsubscribed");

    const tombstone = await store.getSubscriber(email);
    expect(tombstone!.status).toBe("unsubscribed");
    expect(tombstone!.email).toBe(""); // PII gone, hash-keyed tombstone remains
    expect(tombstone!.companyType).toBe("");
    expect(tombstone!.source).toBe("");

    // 4. Resubscribe after erasure re-activates without double-counting:
    //    total was incremented, decremented on scrub, incremented again.
    const resignup = await subscribe.POST!(signupRequest({ email }));
    expect(resignup.status).toBe(200);
    const reactivated = await store.getSubscriber(email);
    expect(reactivated!.status).toBe("unverified");
    const stats = await store.getStats();
    expect(stats.total).toBe(1);
  });

  it("second unsubscribe click is an idempotent no-op", async () => {
    const { subscribe, verify, unsubscribe, store, tokens } =
      await importLifecycle();
    const email = "e2e-double-unsub@example.com";
    await subscribe.POST!(signupRequest({ email }));
    await verify.GET!(
      tokenRequest("/api/subscribe/verify", tokens.signActionToken(email, "verify")!)
    );
    await unsubscribe.GET!(
      tokenRequest("/api/subscribe/unsubscribe", tokens.signActionToken(email, "unsubscribe")!)
    );

    const again = await unsubscribe.GET!(
      tokenRequest("/api/subscribe/unsubscribe", tokens.signActionToken(email, "unsubscribe")!)
    );
    expect(again.status).toBe(302);
    expect(redirectPath(again)).toBe("/subscribe/unsubscribed");
    const tombstone = await store.getSubscriber(email);
    expect(tombstone!.status).toBe("unsubscribed");
    expect(tombstone!.email).toBe("");
  });

  it("verify rejects a forged token and leaves the record untouched", async () => {
    const { subscribe, verify, store } = await importLifecycle();
    const email = "e2e-forged@example.com";
    await subscribe.POST!(signupRequest({ email }));

    const res = await verify.GET!(tokenRequest("/api/subscribe/verify", "forged.payload.sig"));
    expect(res.status).toBe(302);
    expect(redirectPath(res)).toBe("/subscribe/invalid");

    const record = await store.getSubscriber(email);
    expect(record!.status).toBe("unverified");
  });

  it("verify rejects a valid token minted for the wrong action", async () => {
    const { subscribe, verify, store, tokens } = await importLifecycle();
    const email = "e2e-wrong-action@example.com";
    await subscribe.POST!(signupRequest({ email }));

    // An unsubscribe token must never confirm a subscription.
    const res = await verify.GET!(
      tokenRequest("/api/subscribe/verify", tokens.signActionToken(email, "unsubscribe")!)
    );
    expect(res.status).toBe(302);
    expect(redirectPath(res)).toBe("/subscribe/invalid");
    expect((await store.getSubscriber(email))!.status).toBe("unverified");
  });

  it("expired verify tokens land on /subscribe/invalid", async () => {
    const { subscribe, verify, store, tokens } = await importLifecycle();
    const email = "e2e-expired@example.com";
    await subscribe.POST!(signupRequest({ email }));

    const expired = tokens.signActionToken(email, "verify", -10)!;
    const res = await verify.GET!(tokenRequest("/api/subscribe/verify", expired));
    expect(redirectPath(res)).toBe("/subscribe/invalid");
    expect((await store.getSubscriber(email))!.status).toBe("unverified");
  });

  it("cross-origin signup is rejected before any store write", async () => {
    const { subscribe, store } = await importLifecycle();
    const res = await subscribe.POST!(
      signupRequest(
        { email: "e2e-cors@example.com" },
        { origin: "https://evil.example" }
      )
    );
    expect(res.status).toBe(403);
    expect(await store.getSubscriber("e2e-cors@example.com")).toBeNull();
  });

  it("honeypot fill returns fake success and records nothing", async () => {
    const { subscribe, store } = await importLifecycle();
    const res = await subscribe.POST!(
      signupRequest({ email: "e2e-honeypot@example.com", website: "http://spam.example" })
    );
    expect(res.status).toBe(201);
    expect(await store.getSubscriber("e2e-honeypot@example.com")).toBeNull();
  });

  it("rejects missing and malformed emails with 400, storing nothing", async () => {
    const { subscribe, store } = await importLifecycle();
    const missing = await subscribe.POST!(signupRequest({}));
    expect(missing.status).toBe(400);

    const malformed = await subscribe.POST!(signupRequest({ email: "not-an-email" }));
    expect(malformed.status).toBe(400);

    expect(await store.getSubscriber("not-an-email")).toBeNull();
  });

  it("a verified subscriber re-subscribing hears 'Already subscribed'", async () => {
    const { subscribe, verify, store, tokens } = await importLifecycle();
    const email = "e2e-already@example.com";
    await subscribe.POST!(signupRequest({ email }));
    await verify.GET!(
      tokenRequest("/api/subscribe/verify", tokens.signActionToken(email, "verify")!)
    );

    const again = await subscribe.POST!(signupRequest({ email }));
    expect(again.status).toBe(200);
    expect(((await again.json()) as { message: string }).message).toBe(
      "Already subscribed"
    );
    expect((await store.getSubscriber(email))!.status).toBe("verified");
  });

  it("caps signups at the per-IP rate limit with 429", async () => {
    const { subscribe } = await importLifecycle();
    const ip = "203.0.113.77";

    const responses: Response[] = [];
    for (let i = 0; i < 11; i++) {
      responses.push(
        await subscribe.POST!(
          signupRequest({ email: `e2e-rl-${i}@example.com` }, { ip })
        )
      );
    }
    expect(responses.slice(0, 10).every((r) => r.status === 200)).toBe(true);
    expect(responses[10].status).toBe(429);
  });
});

describe("subscribe route fail-closed posture (production)", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("RESEND_FROM_EMAIL", "");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns a retryable 503 instead of promising mail it cannot send", async () => {
    const { subscribe, store } = await importLifecycle();
    const email = "e2e-prod-unconfigured@example.com";

    const res = await subscribe.POST!(signupRequest({ email }));
    expect(res.status).toBe(503);
    expect(((await res.json()) as { error: string }).error).toMatch(
      /temporarily unavailable/i
    );

    // The store write happens before the email step (by design): the
    // signup is parked unverified, never silently lost.
    const record = await store.getSubscriber(email);
    expect(record!.status).toBe("unverified");
  });
});
