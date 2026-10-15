/**
 * Persistent enquiry store for the Opportunity Brief (commercial product).
 *
 * Design contract (2026-10-15 product blueprint, audit D01/D02 lineage):
 *
 *  - FAIL CLOSED. This is a *commercial* pipeline: a buyer enquiry that
 *    silently evaporates during a serverless redeploy is worse than no
 *    enquiry, because the buyer believes they were heard. Unlike the
 *    newsletter store there is deliberately NO in-memory fallback. Without
 *    Upstash configuration the save throws and the API route answers 503,
 *    which the form surfaces as "temporarily unavailable - email us".
 *
 *  - RETENTION. Enquiries are business records with consent evidence, so
 *    each record carries a 730-day TTL (privacy policy states this). The
 *    TTL is re-stamped on every write so records are erased two years
 *    after their last update, matching the published retention promise.
 *
 *  - KEYS (single shared Upstash DB, namespaced like nl:* / rl:*):
 *      ob:enquiry:{id}      full enquiry record (JSON, TTL 730d)
 *      ob:enquiries:index   LIST of ids, oldest first (TTL re-stamped)
 *      ob:enquiries:count   total accepted enquiries
 *
 *  Server-side only. Plain fetch against the Upstash REST API (no SDK),
 *  mirroring newsletter-store.ts.
 */

export const OB_ENQUIRY_TTL_SECONDS = 730 * 24 * 3600;

export const BUYER_TYPES = [
  "vendor",
  "investor",
  "operator",
  "consultant",
  "journalist",
  "educator",
  "other",
] as const;
export type BuyerType = (typeof BUYER_TYPES)[number];

export const PREFERRED_FORMATS = [
  "single-brief",
  "bundle",
  "custom-research",
  "not-sure",
] as const;
export type PreferredFormat = (typeof PREFERRED_FORMATS)[number];

export interface OpportunityBriefEnquiry {
  id: string;
  name: string;
  email: string;
  organisation: string;
  role: string;
  buyerType: BuyerType;
  question: string;
  preferredFormat: PreferredFormat;
  /** "v1" style pointer to the privacy text the consent was taken under. */
  privacyVersion: string;
  consent: true;
  /** Operational context, never shown to the buyer. */
  referrer: string;
  userAgent: string;
  createdAt: string;
}

export function storageConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

async function upstash(
  command: string,
  ...args: (string | number)[]
): Promise<unknown> {
  const url = (process.env.UPSTASH_REDIS_REST_URL ?? "").replace(/\/+$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? "";
  if (!url || !token) throw new Error("upstash not configured");
  const path = [command, ...args.map((a) => encodeURIComponent(String(a)))]
    .join("/")
    .replace(/\/$/, "");
  const res = await fetch(`${url}/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
    // Bounded so a hung Redis can never stall the route that awaits us.
    signal: AbortSignal.timeout(5_000),
  });
  if (!res.ok) throw new Error(`upstash ${command} failed: ${res.status}`);
  const json = (await res.json()) as { result?: unknown; error?: string };
  if (json.error) throw new Error(`upstash ${command}: ${json.error}`);
  return json.result;
}

/** Enquiry reference shown to the buyer (first 8 chars of the stored id). */
export function enquiryReference(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

/**
 * Persist one enquiry. Throws on any storage failure - the route translates
 * that into a fail-closed 503. Returns the stored record.
 */
export async function saveEnquiry(
  input: Omit<OpportunityBriefEnquiry, "id" | "createdAt">
): Promise<OpportunityBriefEnquiry> {
  const id = crypto.randomUUID();
  const record: OpportunityBriefEnquiry = {
    ...input,
    id,
    createdAt: new Date().toISOString(),
  };
  const key = `ob:enquiry:${id}`;

  // SET + EXPIRE + index + counter. If any leg fails the whole call throws:
  // a half-written enquiry must not look accepted.
  await upstash("set", key, JSON.stringify(record));
  await upstash("expire", key, OB_ENQUIRY_TTL_SECONDS);
  await upstash("rpush", "ob:enquiries:index", id);
  await upstash("expire", "ob:enquiries:index", OB_ENQUIRY_TTL_SECONDS);
  await upstash("incr", "ob:enquiries:count");

  return record;
}

/** Number of accepted enquiries (observability / media-kit proof). */
export async function enquiryCount(): Promise<number> {
  const n = (await upstash("get", "ob:enquiries:count")) as string | null;
  return Number(n ?? 0);
}

/**
 * Aggregate-only counter (e.g. ob:sample:views for sample downloads).
 * Never holds personal data, so it is allowed to fail loudly: callers that
 * use it for metrics should catch and continue.
 */
export async function incrCounter(key: string): Promise<number> {
  const safe = key.replace(/[^a-z0-9:._-]/gi, "");
  return (await upstash("incr", safe)) as number;
}
