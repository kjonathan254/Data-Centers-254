/**
 * Newsletter / monetization data store.
 *
 * Server-side only. Env-gated backend, mirroring the rate-limiter pattern:
 *   - UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN present → Upstash
 *     Redis via its REST API (no SDK; plain fetch, works on Vercel serverless)
 *   - otherwise → in-memory fallback (dev / pre-config; data survives only
 *     for the process lifetime, logs make this explicit)
 *
 * Records kept here:
 *   - subscribers: email + role segmentation + source + status
 *     (segmentation is the media-kit asset, kept even when Resend is not
 *     configured, so signups are never lost while the key is missing)
 *   - export interests: emails captured on /data-exports pre-checkout
 *   - sponsor click counters: per-slug redirect tallies
 */

export type SubscriberRole =
  | "operator"
  | "leadership"
  | "investor"
  | "journalist"
  | "vendor"
  | "student"
  | "other";

export const SUBSCRIBER_ROLES: { value: SubscriberRole; label: string }[] = [
  { value: "operator", label: "Data centre operator / staff" },
  { value: "leadership", label: "CTO / IT leadership" },
  { value: "investor", label: "Investor / analyst" },
  { value: "journalist", label: "Journalist / media" },
  { value: "vendor", label: "Vendor / supplier" },
  { value: "student", label: "Student / learning" },
  { value: "other", label: "Other" },
];

export type SubscriberStatus = "unverified" | "verified" | "unsubscribed";

export interface SubscriberRecord {
  email: string;
  role: SubscriberRole;
  companyType: string;
  source: string;
  status: SubscriberStatus;
  createdAt: string;
  verifiedAt: string | null;
  unsubscribedAt?: string | null;
}

export interface NewsletterStats {
  backend: "upstash" | "memory";
  total: number;
  verified: number;
  byRole: Record<SubscriberRole, number>;
  exportInterests: number;
}

const ROLE_KEYS: SubscriberRole[] = [
  "operator",
  "leadership",
  "investor",
  "journalist",
  "vendor",
  "student",
  "other",
];

const TTL_OK = { returned: 1 };

function upstashConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ""), token };
}

export function storageBackend(): "upstash" | "memory" {
  return upstashConfig() ? "upstash" : "memory";
}

async function upstash(
  command: string,
  ...args: (string | number)[]
): Promise<unknown> {
  const cfg = upstashConfig();
  if (!cfg) throw new Error("upstash not configured");
  const path = [command, ...args.map((a) => encodeURIComponent(String(a)))]
    .join("/")
    .replace(/\/$/, "");
  const res = await fetch(`${cfg.url}/${path}`, {
    headers: { Authorization: `Bearer ${cfg.token}` },
    // GET-style REST commands are cache-safe; still avoid Next fetch caching
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`upstash ${command} failed: ${res.status}`);
  const json = (await res.json()) as { result?: unknown; error?: string };
  if (json.error) throw new Error(`upstash ${command}: ${json.error}`);
  return json.result;
}

/* ---------------- in-memory fallback ---------------- */

const memSubs = new Map<string, SubscriberRecord>();
const memCounts = new Map<string, number>();
const memExport = new Set<string>();

function memIncr(key: string): number {
  const next = (memCounts.get(key) ?? 0) + 1;
  memCounts.set(key, next);
  return next;
}

function memDecr(key: string): void {
  const next = Math.max(0, (memCounts.get(key) ?? 1) - 1);
  memCounts.set(key, next);
}

/* ---------------- helpers ---------------- */

export async function emailHash(email: string): Promise<string> {
  const data = new TextEncoder().encode(email.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizeRole(raw: unknown): SubscriberRole {
  const v = typeof raw === "string" ? raw.toLowerCase().trim() : "";
  return (ROLE_KEYS as string[]).includes(v) ? (v as SubscriberRole) : "other";
}

function cleanText(raw: unknown, max: number): string {
  return typeof raw === "string"
    ? raw.replace(/[<>]/g, "").trim().slice(0, max)
    : "";
}

/* ---------------- subscribers ---------------- */

/**
 * Insert or update a subscriber. Idempotent on email: an existing record is
 * returned unchanged (never double-counted) unless it was unsubscribed, in
 * which case it is re-activated. Returns { created, record }.
 */
export async function upsertSubscriber(input: {
  email: string;
  role?: unknown;
  companyType?: unknown;
  source?: unknown;
  status?: SubscriberStatus;
}): Promise<{ created: boolean; record: SubscriberRecord }> {
  const email = input.email.trim().toLowerCase();
  const hash = await emailHash(email);
  const backend = storageBackend();

  const existing = await getSubscriber(email);
  if (existing && existing.status !== "unsubscribed") {
    return { created: false, record: existing };
  }

  // A scrubbed tombstone (see scrubSubscriber) had its counters decremented,
  // so a returning address must re-increment; a plain unsubscribed record
  // was never decremented, so it must not be.
  const resubscribed = existing?.status === "unsubscribed";
  const wasScrubbed = resubscribed && existing.email === "";

  const record: SubscriberRecord = {
    email,
    role: normalizeRole(input.role),
    companyType: cleanText(input.companyType, 80),
    source: cleanText(input.source, 60) || "homepage",
    status: input.status ?? "unverified",
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    verifiedAt: input.status === "verified" ? new Date().toISOString() : null,
    unsubscribedAt: null,
  };

  const firstCounted = !existing || wasScrubbed;
  if (backend === "upstash") {
    await upstash("set", `nl:sub:${hash}`, JSON.stringify(record));
    if (firstCounted) {
      await upstash("incr", "nl:count:total");
      await upstash("incr", `nl:count:role:${record.role}`);
    }
    if (record.status === "unverified") {
      // Double opt-in: an unconfirmed request is personal data for a signup
      // the visitor may have abandoned. Auto-erases after 60 days; confirming
      // (markSubscriber -> persistSubscriber) makes the record permanent.
      // Aggregate counters are intentionally not rolled back.
      try {
        await upstash("expire", `nl:sub:${hash}`, 60 * 24 * 3600);
      } catch {
        // TTL is hygiene, not correctness - never fail the signup over it.
      }
    }
  } else {
    memSubs.set(hash, record);
    if (firstCounted) {
      memIncr("nl:count:total");
      memIncr(`nl:count:role:${record.role}`);
    }
  }

  return { created: firstCounted, record };
}

export async function getSubscriber(
  email: string
): Promise<SubscriberRecord | null> {
  const hash = await emailHash(email);
  if (storageBackend() === "upstash") {
    const raw = (await upstash("get", `nl:sub:${hash}`)) as string | null;
    if (!raw) return null;
    try {
      return JSON.parse(raw) as SubscriberRecord;
    } catch {
      return null;
    }
  }
  return memSubs.get(hash) ?? null;
}

export async function markSubscriber(
  email: string,
  status: SubscriberStatus
): Promise<boolean> {
  const existing = await getSubscriber(email);
  if (!existing) return false;
  const updated: SubscriberRecord = {
    ...existing,
    status,
    verifiedAt:
      status === "verified"
        ? existing.verifiedAt ?? new Date().toISOString()
        : existing.verifiedAt,
  };
  const hash = await emailHash(email);
  if (storageBackend() === "upstash") {
    await upstash("set", `nl:sub:${hash}`, JSON.stringify(updated));
    if (status === "verified") {
      // A confirmed subscription is permanent - clear the 60-day
      // double-opt-in auto-erasure TTL set by upsertSubscriber.
      try {
        await upstash("persist", `nl:sub:${hash}`);
      } catch {
        // Hygiene only - never fail verification over it.
      }
    }
  } else {
    memSubs.set(hash, updated);
  }
  return true;
}

/**
 * Erase the personal details of a subscription record (unsubscribe / data
 * erasure request / hard bounce). The record becomes an anonymised tombstone
 * keyed by email hash: no email, role, company, or source remains, but the
 * address is not counted twice if it ever returns.
 *
 * Idempotent: scrubbing an already-scrubbed or unknown address is a no-op.
 * Returns true when a live record was scrubbed this call.
 */
export async function scrubSubscriber(email: string): Promise<boolean> {
  const existing = await getSubscriber(email);
  if (!existing) return false;
  if (existing.status === "unsubscribed" && existing.email === "") return false;

  const hash = await emailHash(email);
  const tombstone: SubscriberRecord = {
    email: "",
    role: "other",
    companyType: "",
    source: "",
    status: "unsubscribed",
    createdAt: existing.createdAt,
    verifiedAt: existing.verifiedAt,
    unsubscribedAt: new Date().toISOString(),
  };

  if (storageBackend() === "upstash") {
    await upstash("set", `nl:sub:${hash}`, JSON.stringify(tombstone));
    await upstash("decr", "nl:count:total");
    await upstash("decr", `nl:count:role:${existing.role}`);
  } else {
    memSubs.set(hash, tombstone);
    memDecr("nl:count:total");
    memDecr(`nl:count:role:${existing.role}`);
  }
  return true;
}

/* ---------------- export interests ---------------- */

export async function saveExportInterest(
  email: string,
  kind: string
): Promise<boolean> {
  const hash = await emailHash(email);
  if (storageBackend() === "upstash") {
    const exists = (await upstash("exists", `nl:exp:${hash}`)) as number;
    if (exists) return false;
    await upstash(
      "set",
      `nl:exp:${hash}`,
      JSON.stringify({ email, kind, at: new Date().toISOString() })
    );
    await upstash("incr", "nl:count:export");
    return true;
  }
  if (memExport.has(hash)) return false;
  memExport.add(hash);
  memIncr("nl:count:export");
  return true;
}

/* ---------------- sponsor clicks ---------------- */

export async function trackSponsorClick(slug: string): Promise<number> {
  const safe = cleanText(slug, 40).replace(/[^a-z0-9-]/gi, "") || "generic";
  if (storageBackend() === "upstash") {
    const n = (await upstash("incr", `nl:click:${safe}`)) as number;
    return n;
  }
  return memIncr(`nl:click:${safe}`);
}

/* ---------------- stats (media kit) ---------------- */

export async function getStats(): Promise<NewsletterStats> {
  const backend = storageBackend();
  const byRole = Object.fromEntries(
    ROLE_KEYS.map((r) => [r, 0])
  ) as Record<SubscriberRole, number>;

  if (backend === "upstash") {
    let total = 0;
    try {
      const t = (await upstash("get", "nl:count:total")) as string | null;
      total = Number(t ?? 0);
      for (const role of ROLE_KEYS) {
        const v = (await upstash(
          "get",
          `nl:count:role:${role}`
        )) as string | null;
        byRole[role] = Number(v ?? 0);
      }
      const exp = (await upstash("get", "nl:count:export")) as string | null;
      void TTL_OK;
      return {
        backend,
        total,
        verified: 0, // verified counted from records when resends land
        byRole,
        exportInterests: Number(exp ?? 0),
      };
    } catch {
      // fall through to zeros on any Upstash hiccup, stats are display-only
      return { backend, total: 0, verified: 0, byRole, exportInterests: 0 };
    }
  }

  let verified = 0;
  for (const rec of memSubs.values()) {
    if (rec.status === "verified") verified += 1;
  }
  return {
    backend,
    total: memCounts.get("nl:count:total") ?? 0,
    verified,
    byRole,
    exportInterests: memCounts.get("nl:count:export") ?? 0,
  };
}
