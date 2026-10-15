/**
 * Mechanical verification of the privacy-policy retention promises (audit D02).
 *
 * /privacy promises two behaviours that used to be unverifiable:
 *   1. "Unconfirmed (double opt-in) signup requests that are never verified
 *      are treated as abandoned and erased after 60 days."
 *   2. Verified subscriptions are permanent (no surprise erasure).
 *
 * Since the store went persistent (D01), promise 1 is implemented as a Redis
 * EXPIRE of 60 days set on every unverified record, and promise 2 as a PERSIST
 * (TTL clear) the moment a record is verified. These tests pin both commands
 * mechanically, so the policy text and the store behaviour can no longer
 * drift apart silently. A regression here is a compliance regression, not
 * just a data one.
 *
 * Run: npx vitest run
 */
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

const { upsertSubscriber, markSubscriber, getStats, storageBackend } =
  await import("@/lib/newsletter-store");

// 60 days expressed in seconds, exactly as the privacy policy phrases it.
const SIXTY_DAYS_SECONDS = 60 * 24 * 3600; // 5,184,000

/** Minimal stateful Upstash REST fake: real command recording + GET/SET. */
function makeUpstashFake() {
  const db = new Map<string, string>();
  const calls: string[][] = [];
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = new URL(String(input));
    const segments = url.pathname
      .split("/")
      .filter(Boolean)
      .map(decodeURIComponent);
    const cmd = (segments[0] ?? "").toUpperCase();
    const args = segments.slice(1);
    calls.push([cmd, ...args]);

    let result: unknown = null;
    if (cmd === "SET") {
      db.set(args[0], args[1]);
      result = "OK";
    } else if (cmd === "GET") {
      result = db.get(args[0]) ?? null;
    } else if (cmd === "EXISTS") {
      result = db.has(args[0]) ? 1 : 0;
    } else if (cmd === "INCR") {
      const n = Number(db.get(args[0]) ?? "0") + 1;
      db.set(args[0], String(n));
      result = n;
    } else if (cmd === "DECR") {
      const n = Number(db.get(args[0] ?? "") ?? "1") - 1;
      if (args[0]) db.set(args[0], String(n));
      result = n;
    } else if (cmd === "EXPIRE" || cmd === "PERSIST") {
      result = 1;
    }
    return new Response(JSON.stringify({ result }), { status: 200 });
  });
  return { db, calls, fetchMock };
}

describe("newsletter-store retention promises (audit D02)", () => {
  let fake: ReturnType<typeof makeUpstashFake>;

  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv(
      "UPSTASH_REDIS_REST_URL",
      "https://d02-test.example.upstash.io"
    );
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
    fake = makeUpstashFake();
    vi.stubGlobal("fetch", fake.fetchMock);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("reports the persistent backend when Upstash env vars are present", () => {
    expect(storageBackend()).toBe("upstash");
  });

  it("sets a 60-day TTL on every unverified (double opt-in) record", async () => {
    const { created, record } = await upsertSubscriber({
      email: "d02-unverified@example.com",
    });
    expect(created).toBe(true);
    expect(record.status).toBe("unverified");

    const expire = fake.calls.find((c) => c[0] === "EXPIRE");
    expect(expire, "unverified signup must issue EXPIRE").toBeDefined();
    // Same key that holds the record, TTL exactly the published 60 days.
    const set = fake.calls.find((c) => c[0] === "SET");
    expect(expire![1]).toBe(set![1]);
    expect(Number(expire![2])).toBe(SIXTY_DAYS_SECONDS);
  });

  it("does not set a TTL on a record created already-verified", async () => {
    await upsertSubscriber({
      email: "d02-verified@example.com",
      status: "verified",
    });
    // A verified record is permanent from birth: no EXPIRE anywhere.
    expect(fake.calls.find((c) => c[0] === "EXPIRE")).toBeUndefined();
  });

  it("clears the TTL (PERSIST) the moment a signup is verified", async () => {
    const email = "d02-confirm@example.com";
    await upsertSubscriber({ email });
    expect(fake.calls.find((c) => c[0] === "EXPIRE")).toBeDefined();

    const persisted = await markSubscriber(email, "verified");
    expect(persisted).toBe(true);
    const persist = fake.calls.find((c) => c[0] === "PERSIST");
    expect(persist, "verification must issue PERSIST").toBeDefined();
    const set = fake.calls.find((c) => c[0] === "SET");
    expect(persist![1]).toBe(set![1]);
  });

  it("never reports the durable backend as memory while configured", async () => {
    const stats = await getStats();
    expect(stats.backend).toBe("upstash");
  });
});
