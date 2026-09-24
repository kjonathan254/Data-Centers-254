/**
 * Serializable payload types for the Policy Intelligence Control Room.
 * Built on the server (page.tsx), consumed by client components
 * (control-room.tsx, matrix-console.tsx). Literal-field only — survives RSC.
 */

export interface OpsSource {
  id: string;
  label: string;
  url: string;
  tier: number;
  publisher: string;
  captureStatus: string;
  /** e.g. "statute", "regulator", "policy-document", "press" — from the dataset. */
  sourceType: string;
  excerpt: string;
}

export interface OpsClaim {
  id: string;
  country: string;
  countryName: string;
  pillar: string;
  statement: string;
  note: string;
  state: string;
  strength: string;
  captureSummary: string;
  sources: OpsSource[];
}

export interface OpsGap {
  country: string;
  countryName: string;
  pillar: string;
  gap: string;
  expectedSources: string[];
  upgradePath: string;
  priority: "high" | "medium";
}

export interface OpsCountry {
  key: string;
  name: string;
  iso: string;
  facilities: number;
  claims: number;
  verified: number;
  partial: number;
  coveragePct: number;
  investigatedLong: string;
  regulators: { domain: string; name: string }[];
  facilitiesNote?: string;
  investigationNote?: string;
}

export interface OpsCell {
  country: string;
  pillar: string;
  states: Record<string, number>;
  total: number;
  gap: boolean;
}

export interface SinceReview {
  fromVersion: string;
  toVersion: string;
  date: string;
  items: { label: string; detail: string; tone: "up" | "flat" | "note" }[];
}

/** Claim-level changelog row: claim -> sources -> previous version -> editorial decision. */
export interface OpsChangelogClaim {
  id: string;
  country: string;
  pillar: string;
  action: string;
  previousState: string | null;
  state: string;
  previousVersionNote: string;
  statement: string;
  editorialDecision: string;
  sources: OpsSource[];
}

export interface OpsChangelogEntry {
  version: string;
  previousVersion: string;
  date: string;
  summary: string;
  claims: OpsChangelogClaim[];
  sourcesAdded: OpsSource[];
  editorialDecisionSummary: string;
}

export interface OpsData {
  countries: OpsCountry[];
  pillars: { id: string; label: string; blurb: string }[];
  claims: OpsClaim[];
  gaps: OpsGap[];
  cells: OpsCell[];
  /** Full source registry (60 entries at r11) — powers the source-quality panel. */
  sources: OpsSource[];
  sinceReview: SinceReview;
  changelog: OpsChangelogEntry[];
  meta: {
    gateShort: string;
    gateFull: string;
    reviewedLong: string;
    schemaVersion: string;
    datasetVersion: string;
    claims: number;
    sources: number;
    gaps: number;
    verified: number;
    partial: number;
    coveragePct: number;
  };
}
