/**
 * Tests for the Opportunity Brief enquiry store (commercial pipeline).
 *
 * The store's core contract is fail-closed persistence: a buyer enquiry is
 * either durably in Redis or the caller gets an error it can turn into a 503.
 * These tests pin that contract mechanically, plus the 730-day retention TTL
 * the privacy policy publishes.
 *
 * Run: npx vitest run
 */
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

const {
  saveEnquiry,
  enquiryCount,
  storageConfigured,
  enquiryReference,
  BUYER_TYPES,
  PREFERRED_FORMATS,
  OB_ENQUIRY_TTL_SECONDS,
} = await import("@/lib/opportunity-brief-store");

/** Minimal stateful Upstash REST fake with command recording. */
function makeUpstashFake() {
  const db = new Map<string, string>();
  const lists = new Map<string, string[]>();
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
    } else if (cmd === "EXPIRE") {
      result = 1;
    } else if (cmd === "RPUSH") {
      const list = lists.get(args[0]) ?? [];
      for (const v of args.slice(1)) list.push(v);
      lists.set(args[0], list);
      result = list.length;
    } else if (cmd === "INCR") {
      const n = Number(db.get(args[0]) ?? "0") + 1;
      db.set(args[0], String(n));
      result = n;
    }
    return new Response(JSON.stringify({ result }), { status: 200 });
  });
  return { db, lists, calls, fetchMock };
}

const VALID_INPUT = {
  name: "Test Buyer",
  email: "buyer@example.com",
  organisation: "Example Ltd",
  role: "Head of Procurement",
  buyerType: "vendor" as const,
  question: "Which construction-stage projects have open procurement windows?",
  preferredFormat: "single-brief" as const,
  privacyVersion: "2026-10-15",
  consent: true as const,
  referrer: "https://data-centers-254.vercel.app/opportunity-brief",
  userAgent: "vitest",
};

describe("opportunity-brief-store (audit D01 lineage: commercial data must not evaporate)", () => {
  let fake: ReturnType<typeof makeUpstashFake>;

  beforeEach(() => {
    vi.stubEnv(
      "UPSTASH_REDIS_REST_URL",
      "https://ob-test.example.upstash.io"
    );
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
    fake = makeUpstashFake();
    vi.stubGlobal("fetch", fake.fetchMock);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("knows when it is not configured", () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    expect(storageConfigured()).toBe(false);
  });

  it("persists an enquiry with the full guard record", async () => {
    const record = await saveEnquiry(VALID_INPUT);
    expect(record.id).toBeTruthy();
    expect(record.email).toBe("buyer@example.com");
    expect(record.privacyVersion).toBe("2026-10-15");

    const set = fake.calls.find((c) => c[0] === "SET");
    expect(set?.[1]).toBe(`ob:enquiry:${record.id}`);
    const stored = JSON.parse(fake.db.get(`ob:enquiry:${record.id}`)!);
    expect(stored.consent).toBe(true);
    expect(stored.buyerType).toBe("vendor");
  });

  it("stamps the 730-day retention TTL the privacy policy promises", async () => {
    const record = await saveEnquiry(VALID_INPUT);
    const expire = fake.calls.find((c) => c[0] === "EXPIRE");
    expect(expire?.[1]).toBe(`ob:enquiry:${record.id}`);
    expect(Number(expire?.[2])).toBe(730 * 24 * 3600);
    expect(OB_ENQUIRY_TTL_SECONDS).toBe(730 * 24 * 3600);
  });

  it("indexes the enquiry and bumps the counter", async () => {
    const record = await saveEnquiry(VALID_INPUT);
    expect(fake.lists.get("ob:enquiries:index")).toContain(record.id);
    expect(fake.db.get("ob:enquiries:count")).toBe("1");
    expect(await enquiryCount()).toBe(1);
  });

  it("gives the buyer a stable, readable reference", async () => {
    const record = await saveEnquiry(VALID_INPUT);
    const ref = enquiryReference(record.id);
    expect(ref).toHaveLength(8);
    expect(ref).toBe(record.id.slice(0, 8).toUpperCase());
  });

  it("rejects input outside the allow-lists", async () => {
    // Type-level allow-lists are the API route's first filter; pin them.
    expect(BUYER_TYPES).toContain("vendor");
    expect(BUYER_TYPES).not.toContain("hacker");
    expect(PREFERRED_FORMATS).toContain("single-brief");
    expect(PREFERRED_FORMATS).not.toContain("everything");
  });
});
