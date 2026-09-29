/**
 * Policy Intelligence config — SINGLE SOURCE OF TRUTH
 * ====================================================
 * The 4-country policy & regulatory evidence layer behind /policy/intelligence.
 * Companion to the facility-level Evidence Engine (src/lib/evidence): where
 * the evidence engine verifies WHAT a facility is, the policy layer verifies
 * WHAT GOVERNS building and operating one.
 *
 * Dataset: src/data/policy/policy-claims-2026-Q3.json
 * Validator: scripts/policy_research/validate_policy_claims.py (re-run after
 * every dataset edit; the build must never ship a failing dataset).
 *
 * Editorial invariants (do not break in code):
 *  - The full 5-state publication vocabulary lives here. Unsupported is not
 *    false: it means "not yet established", and capture-pending self-upgrades
 *    when the named instrument is finally captured.
 *  - One claim ≠ one article. Claims are dataset objects with an auditable
 *    evidence chain; articles are the interpretation layer that may cite them.
 *  - Structured pillar-gaps never borrow claim states — a pillar not yet
 *    researched is a GAP with expected sources and an upgrade path, never an
 *    "unverified claim".
 */

export const POLICY_SCHEMA_VERSION = "0.2-policy";
export const POLICY_DATASET_VERSION = "2026-Q3";

// ─── The 10 research pillars ───────────────────────────────────────────────

export const POLICY_PILLARS: Record<string, { label: string; blurb: string }> = {
  licensing: {
    label: "Licensing",
    blurb: "Who may build and operate a data centre, under which licence classes and regulator.",
  },
  "data-protection": {
    label: "Data protection",
    blurb: "Controller/processor registration, processing preconditions and penalty regimes.",
  },
  "data-localisation-sovereignty": {
    label: "Localisation & sovereignty",
    blurb: "Where data must physically live, and what authorisation moves it across borders.",
  },
  "tax-incentives": {
    label: "Tax & incentives",
    blurb: "SEZ/EPZ relief, capital-goods exemptions, preferential rates and digital-services tax.",
  },
  "energy-electricity": {
    label: "Energy & electricity",
    blurb: "The electricity regulator, generation/supply licensing and large-load connection rules.",
  },
  "construction-building": {
    label: "Construction & building",
    blurb: "Building codes, permits and physical-planning approvals that govern the build itself.",
  },
  environmental: {
    label: "Environmental",
    blurb: "EIA requirements, environmental compliance regimes and expert registration.",
  },
  "ai-digital-policy": {
    label: "AI & digital policy",
    blurb: "National digital masterplans and AI-era policy framing that shapes demand.",
  },
  "cross-border-data-flows": {
    label: "Cross-border data flows",
    blurb: "Adequacy, permits and transfer conditions for data leaving the country.",
  },
  "regional-frameworks": {
    label: "Regional frameworks",
    blurb: "EAC/AU instruments that harmonise — or fail to harmonise — the four regimes.",
  },
};

// ─── The 5-state publication vocabulary ────────────────────────────────────

export const POLICY_STATES = {
  verified: {
    label: "Verified",
    blurb: "Supported by acceptable evidence — a Tier-1/Tier-2 instrument, or two independent corroborating sources.",
    chip: "border-emerald-500/25 text-emerald-500 bg-emerald-500/10",
    dot: "bg-emerald-500",
  },
  "partially-verified": {
    label: "Partial",
    blurb: "Some elements supported, others unresolved — single source, or instrument text pending.",
    chip: "border-amber-500/25 text-amber-500 bg-amber-500/10",
    dot: "bg-amber-500",
  },
  "capture-pending": {
    label: "Pending capture",
    blurb: "The relevant source is identified but not yet retrieved; the state self-upgrades when it is captured.",
    chip: "border-sky-500/25 text-sky-500 bg-sky-500/10",
    dot: "bg-sky-500",
  },
  unverified: {
    label: "Unverified",
    blurb: "The claim exists but evidence has not yet met the publication threshold. Unsupported is not false.",
    chip: "border-slate-500/30 text-slate-400 bg-slate-500/10",
    dot: "bg-slate-400",
  },
  contradicted: {
    label: "Contradicted",
    blurb: "Credible evidence cuts against the claim. Published only with the contradicting evidence attached.",
    chip: "border-red-500/25 text-red-400 bg-red-500/10",
    dot: "bg-red-500",
  },
} as const;

export type PolicyState = keyof typeof POLICY_STATES;

/**
 * Display vocabulary (audit 2026-09-23, §14): one label per internal state.
 * Verified · Partial · Pending capture · Unverified · Contradicted · Structured gap.
 */
export const POLICY_GAP_STYLE = {
  chip: "border-dashed border-violet-400/40 bg-violet-400/5 text-violet-300",
  text: "text-violet-300",
} as const;

/** Source tiers as used by the policy layer (Tier 4 discovery sources are never registered). */
export const POLICY_SOURCE_TIERS: Record<number, string> = {
  1: "T1 · Primary instrument / regulator",
  2: "T2 · Independent authoritative",
  3: "T3 · Reputable secondary",
};

export const POLICY_CAPTURE_LABELS: Record<string, string> = {
  captured: "full text captured",
  snippet: "snippet capture",
  "capture-pending": "capture pending",
};

// ─── "Since last review" deltas (dashboard panel) ────────────────────────
//
// Hand-refreshed on every dataset bump: diff the previous published dataset
// against the new one (git show <prev>:src/data/policy/policy-claims-2026-Q3.json)
// and rewrite the items below. Kept static on purpose — the page must never
// run git at request time.

export const SINCE_LAST_REVIEW: {
  fromVersion: string;
  toVersion: string;
  date: string;
  items: { label: string; detail: string; tone: "up" | "flat" | "note" }[];
} = {
  fromVersion: "policy-2026-Q3-r15",
  toVersion: "policy-2026-Q3-r16",
  date: "2026-09-26",
  items: [
    {
      label: "+2 sources registered (Dangote Lamu energy reporting)",
      detail:
        "Kenyans.co.ke (T2, full capture) + The Africa Report (T2, snippet; paywalled - headline facts only): reference records for the announced 1,000 MW Lamu refinery power plant, ~500 MW offered to Kenya; LNG fuel type per The Africa Report",
      tone: "up",
    },
    {
      label: "0 claim changes",
      detail:
        "61 claims unchanged (55 verified / 6 partially-verified); both records carry explicit no-claim-yet notes - upgrade path opens if a PPA, grid-connection or financing instrument surfaces",
      tone: "flat",
    },
    { label: "20 structured gaps (unchanged)", detail: "Energy/construction/environment pillars still unresearched in UG/RW; EAC regional frameworks untouched across all four markets", tone: "flat" },
  ],
} as const;

/**
 * Control Room surface palette (audit 2026-09-23, §15) — scoped to
 * /policy/intelligence so the rest of the site keeps its brand background.
 */
export const CONTROL_ROOM_SURFACES = {
  canvas: "bg-[#07111F]",
  panel: "bg-[#0E1D31]",
  card: "bg-[#101D30]",
  deep: "bg-[#0B1627]",
  border: "border-[rgba(135,180,220,0.16)]",
  borderSoft: "border-[rgba(135,180,220,0.10)]",
} as const;

// ─── Presentation helpers (audit §14: one terminology, one date format) ────
//
// NOTE: these live in this leaf module (NOT index.ts) so client components
// can import them without pulling the 148KB claims dataset into the client
// JS bundle — index.ts statically imports the JSON. Server pages may keep
// importing them via index.ts (re-exported there for compatibility).

/** "1 facility" / "3 facilities" — never "1 facilities". */
export function countLabel(n: number, singular: string, plural?: string): string {
  return `${n.toLocaleString("en-GB")} ${n === 1 ? singular : (plural ?? `${singular}s`)}`;
}

/** One date format across the whole dashboard: "22 September 2026". */
export function formatPolicyDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
