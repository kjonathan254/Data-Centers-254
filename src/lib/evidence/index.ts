/**
 * Evidence Engine v0.2 — claims-data access layer.
 *
 * Loads claims-2026-Q3.json (facility -> claims -> tiered sources with
 * verbatim excerpts) and derives the PUBLIC, human-gated verification view:
 *
 *  - The editor's approval is the gate. Claims with humanReview !==
 *    "approved" never expose their proposed state publicly.
 *  - While a facility sits in editorial review, the public sees
 *    "Unverified" plus an honest "editorial review in progress" note.
 *
 * Constants and the written state rules live in ./config (single source of
 * truth). This module stays a thin, typed loader so the directory pages,
 * compare views and APIs can all rely on it.
 */
import claimsJson from "@/data/directory/claims-2026-Q3.json";
import {
  CORE_CLAIM_TYPES,
  FACILITY_STATE_LABELS,
  type VerificationState,
} from "./config";

export interface EvidenceSource {
  label: string;
  url: string;
  tier: number;
  publisher: string;
  sourceType: string;
  publishedDate: string | null;
  retrievedDate: string;
  excerpt: string;
}

export interface EvidenceClaim {
  id: string;
  type: string;
  statement: string;
  sourceIds: string[];
  note?: string | null;
  /** AI-proposed state — internal signal, gated by humanReview for public display. */
  state: VerificationState;
  humanReview: "pending" | "approved" | "rejected";
  reviewedBy: string | null;
  reviewedAt: string | null;
  assessment: {
    method: string;
    traceability: number;
    independence: number;
    composite: number;
    rationale: string;
  };
}

interface FacilityEvidence {
  investigatedAt: string;
  investigationNote?: string | null;
  claims: EvidenceClaim[];
}

interface ClaimsDoc {
  schemaVersion: string;
  datasetVersion: string;
  generatedAt: string;
  assessmentMethod: string;
  humanGate: string;
  sources: Record<string, EvidenceSource>;
  facilities: Record<string, FacilityEvidence>;
}

const doc = claimsJson as unknown as ClaimsDoc;

export function getEvidenceSources(): Record<string, EvidenceSource> {
  return doc.sources;
}

/** Raw claim-level evidence for a facility (may be undefined: not yet in the pilot). */
export function getFacilityEvidence(slug: string): (FacilityEvidence & {
  sources: Record<string, EvidenceSource>;
}) | null {
  const fac = doc.facilities[slug];
  if (!fac) return null;
  return { ...fac, sources: doc.sources };
}

export interface PublicVerification {
  state: VerificationState;
  label: string;
  /** Editorial approval status of the facility's claim set. */
  editorialStatus: "approved" | "in-review" | "not-in-pilot";
  lastReviewed: string | null;
  claimCount: number;
  approvedCount: number;
  sourceCount: number;
  tierCounts: Record<number, number>;
  /** Worst proposed state among approved core claims — after approval this becomes `state`. */
  proposedState: VerificationState;
}

/**
 * Facility-level public state, human-gated.
 * Rule (see ./config): verified = every core claim verified;
 * unsupported = any core claim unsupported; review = all assessed, some
 * not verified; unverified = nothing assessed (or nothing approved yet).
 */
export function getPublicVerification(slug: string): PublicVerification {
  const fac = doc.facilities[slug];
  if (!fac) {
    return {
      state: "unverified",
      label: FACILITY_STATE_LABELS.unverified,
      editorialStatus: "not-in-pilot",
      lastReviewed: null,
      claimCount: 0,
      approvedCount: 0,
      sourceCount: 0,
      tierCounts: {},
      proposedState: "unverified",
    };
  }

  const claims = fac.claims;
  const core = claims.filter((c) => CORE_CLAIM_TYPES.includes(c.type));
  const sourceIds = new Set(claims.flatMap((c) => c.sourceIds));
  const tierCounts: Record<number, number> = {};
  for (const sid of sourceIds) {
    const t = doc.sources[sid]?.tier;
    if (t) tierCounts[t] = (tierCounts[t] || 0) + 1;
  }
  const approved = claims.filter((c) => c.humanReview === "approved");
  const approvedCore = core.filter((c) => c.humanReview === "approved");

  // Proposed (internal) facility state from ALL core claims
  let proposed: VerificationState = "unverified";
  if (core.length > 0) {
    if (core.some((c) => c.state === "unsupported")) proposed = "unsupported";
    else if (core.every((c) => c.state === "verified")) proposed = "verified";
    else proposed = "review";
  }

  // Public state: only approved claims count. Nothing approved yet -> unverified.
  let state: VerificationState = "unverified";
  if (approvedCore.length > 0) {
    if (approvedCore.some((c) => c.state === "unsupported")) state = "unsupported";
    else if (approvedCore.every((c) => c.state === "verified")) state = "verified";
    else state = "review";
  }

  const lastReviewed =
    approved
      .map((c) => c.reviewedAt)
      .filter((d): d is string => Boolean(d))
      .sort()
      .at(-1) || null;

  return {
    state,
    label: FACILITY_STATE_LABELS[state],
    editorialStatus: approved.length > 0 ? "approved" : "in-review",
    lastReviewed,
    claimCount: claims.length,
    approvedCount: approved.length,
    sourceCount: sourceIds.size,
    tierCounts,
    proposedState: proposed,
  };
}
