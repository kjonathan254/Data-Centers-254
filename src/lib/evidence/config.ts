/**
 * Evidence Engine v0.2 config — SINGLE SOURCE OF TRUTH
 * =====================================================
 * The claim-level evidence model behind the DC254 directory: source tiers,
 * claim taxonomy, verification states, and the deterministic rules that
 * derive them. Plain data only, so both the Next.js runtime and offline
 * scripts can rely on it.
 *
 * Editorial invariants (do not break in code):
 *  - The AI discovers, extracts and scores evidence; it never establishes
 *    facts. DataCentre254 (the editor) is the sole verification authority.
 *  - Public verification states are human-gated: a claim shows its state
 *    publicly only after editorial approval (humanReview === "approved").
 *  - The editor may settle a claim at a different state than the rule
 *    derivation (editorState) when their own primary-source review justifies
 *    it. Every editorState must carry a rationale (claim note) and a ledger
 *    entry; the rule-derived state is preserved for audit.
 *  - Tier 4 sources are for DISCOVERY of Tier 1-3 documents; they never
 *    support a claim on their own.
 *
 * State derivation is implemented deterministically in
 * scripts/evidence_v02_validate.py (re-derivation check) and
 * scripts/evidence_v02_build.py (initial assessment). Keep all three in
 * sync; this file is the written rule, the validator is the enforcement.
 */

export const EVIDENCE_SCHEMA_VERSION = "0.2";
export const EVIDENCE_DATASET_VERSION = "2026-Q3";

// ─── Claim taxonomy (editorial brief, 2026-09-22) ─────────────────────────

/** Every facility fact is verified claim-by-claim, never facility-wide. */
export const CLAIM_TYPES: Record<string, string> = {
  identity: "The facility exists as described: a real data-centre facility, operating or in-development.",
  operator: "The named operator owns and/or operates this facility.",
  facility_type: "The facility's primary role: colocation, hyperscale, enterprise, government, cable landing or operator-owned.",
  location: "Where the facility physically sits: site, street area and city.",
  status: "The facility's pipeline stage: operational, under construction, committed or early stage.",
  capacity: "The documented power capacity (MW) and/or rack count.",
  connectivity: "Documented connectivity: submarine cables, IXPs and networks present at the facility.",
  power: "Documented power infrastructure serving the facility.",
  sustainability: "Documented renewable-energy or efficiency claims.",
};

/** Claims that determine the facility-level public verification state. */
export const CORE_CLAIM_TYPES: string[] = [
  "identity",
  "operator",
  "facility_type",
  "location",
];

// ─── Source hierarchy (editorial brief, 2026-09-22) ───────────────────────

export const SOURCE_TIERS: Record<number, { label: string; includes: string }> = {
  1: {
    label: "Primary",
    includes:
      "Data-centre operator, government agency, regulator, official project documentation, official corporate filing, official press release — highest evidentiary value.",
  },
  2: {
    label: "Independent authoritative",
    includes:
      "Government reports, regulatory documents, research institutions, established industry organisations (e.g. the PeeringDB facility registry), major infrastructure reports.",
  },
  3: {
    label: "Reputable secondary",
    includes:
      "Established technology and business publications, specialist data-centre publications, credible news organisations.",
  },
  4: {
    label: "Discovery only",
    includes:
      "Aggregators, directories, search snippets, Wikipedia, random blogs, AI-generated pages. May help find a facility; never establishes that it is verified.",
  },
};

// ─── Verification states (public-facing, simplified) ──────────────────────

export const VERIFICATION_STATES = {
  verified: "Enough strong evidence exists to support the claim.",
  review: "Evidence exists, but it does not yet meet the verification threshold.",
  unsupported: "The current evidence does not adequately support the claim.",
  unverified: "The claim has not been investigated sufficiently yet.",
} as const;

export type VerificationState = keyof typeof VERIFICATION_STATES;

/** Facility-level chip shown in the directory. */
export const FACILITY_STATE_LABELS: Record<VerificationState, string> = {
  verified: "Verified",
  review: "Review",
  unsupported: "Unsupported",
  unverified: "Unverified",
};

// ─── Deterministic state derivation (the written rule) ────────────────────
//
// Per claim, from its source list:
//   verified    : at least one source of tier <= 2  AND  at least one further
//                 source from a DIFFERENT organisation with tier <= 3.
//   review      : investigated; at least one source of tier <= 3, but the
//                 verified threshold is unmet (e.g. single organisation,
//                 or Tier-3 press without a primary/authoritative anchor).
//   unsupported : investigated; no usable evidence (Tier-4 only, or nothing
//                 found that documents the claim).
//   unverified  : not yet investigated.
//
// Facility-level public state (core claims only):
//   verified    : every core claim verified.
//   unsupported : any core claim unsupported.
//   review      : every core claim assessed, at least one review/unsupported.
//   unverified  : no core claims assessed (or the facility is not in the
//                 claims dataset yet).
//
// Human gate: the PUBLIC state reflects editorially approved claims only.
// Until the editor approves, an investigated facility shows "Unverified"
// with an "editorial review in progress" note.

/** Rule-floor traceability score per tier (TypeSafe scoring layers on top when a key is configured). */
export const TIER_TRACE_SCORE: Record<number, number> = {
  1: 0.9,
  2: 0.75,
  3: 0.6,
  4: 0.15,
};

/** How code combines traceability + independence into one composite. */
export const EVIDENCE_COMPOSITE = "min" as const;

/** Human review states for a claim. */
export const HUMAN_REVIEW_STATES = ["pending", "approved", "rejected"] as const;
export type HumanReviewState = (typeof HUMAN_REVIEW_STATES)[number];
