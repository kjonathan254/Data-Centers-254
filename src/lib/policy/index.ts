/**
 * Policy Intelligence — claims-data access layer.
 *
 * Thin, typed loader over policy-claims-2026-Q3.json (the 4-country policy &
 * regulatory evidence layer). Mirrors src/lib/evidence: the page layer and
 * any future API routes all read through this module so the JSON shape is
 * typed exactly once.
 *
 * The dataset's humanGate is currently EDITORIAL REVIEW COMPLETE for all
 * three researched countries (Uganda r2, Rwanda r3, Tanzania r4; 2026-09-22,
 * delegated authority recorded in the dataset). If a future country pipeline
 * lands PENDING, gate its public states here the way lib/evidence does —
 * do not render proposed states publicly before the editor approves.
 */
import policyJson from "@/data/policy/policy-claims-2026-Q3.json";
import changelogJson from "@/data/policy/policy-changelog.json";
import type { PolicyState } from "./config";

// ─── Dataset shapes (typed once, here) ─────────────────────────────────────

export interface PolicySource {
  label: string;
  url: string;
  tier: number;
  publisher: string;
  sourceType: string;
  publishedDate: string | null;
  retrievedDate: string;
  captureStatus: "captured" | "snippet" | "capture-pending";
  captureNote?: string;
  excerpt: string;
}

export interface PolicyClaim {
  id: string;
  pillar: string;
  statement: string;
  sourceIds: string[];
  state: PolicyState;
  note: string;
}

export interface PillarGap {
  pillar: string;
  gap: string;
  expectedSources: string[];
  upgradePath: string;
}

export interface PolicyCountry {
  name: string;
  iso: string;
  directoryFacilities: number;
  facilitiesNote?: string;
  /** Regulatory domains mapped to the responsible institution(s). */
  regulators: Record<string, string>;
  pillarGaps: PillarGap[];
  investigatedAt: string;
  investigationNote?: string;
  claims: PolicyClaim[];
}

interface PolicyDatasetJson {
  schemaVersion: string;
  datasetVersion: string;
  generatedAt: string;
  researchQuestion: string;
  method: string;
  humanGate: {
    rule: string;
    status: string;
    reviewedBy: string;
    reviewedAt: string;
    scope: string;
    rulings?: Record<string, string>;
  };
  statusVocabulary: Record<string, string>;
  pillars: string[];
  sources: Record<string, PolicySource>;
  countries: Record<string, PolicyCountry>;
  publicationPolicy: Record<string, string>;
  gapSchema: { rule: string };
}

const data = policyJson as unknown as PolicyDatasetJson;

// ─── Loaders ───────────────────────────────────────────────────────────────

// ─── Evidence-pipeline deep links ──────────────────────────────────────────

// Public blob base for verbatim capture files. When a source's captureNote
// references research/captures/<file>.md, policyCaptureUrl() turns it into a
// link so the claim → source → verbatim capture chain is auditable from the
// site itself. validate_policy.py's capture-link gate verifies every path
// exists on disk, so a generated link can never 404 inside the repo.
const REPO_BLOB_BASE = "https://github.com/kjonathan254/Data-Centers-254/blob/main";
const CAPTURE_PATH_RE = /research\/captures\/[\w.-]+\.md/;

export function policyCaptureUrl(note: string | null | undefined): string | undefined {
  const m = note?.match(CAPTURE_PATH_RE);
  return m ? `${REPO_BLOB_BASE}/${m[0]}` : undefined;
}

// ─── Dataset access ────────────────────────────────────────────────────────

export function getPolicyDataset(): PolicyDatasetJson {
  return data;
}

/** Countries in research order (Uganda first — the pilot pipeline). */
const COUNTRY_ORDER = ["uganda", "rwanda", "tanzania", "kenya"] as const;

export function getPolicyCountries(): Array<{ key: string } & PolicyCountry> {
  return COUNTRY_ORDER.filter((k) => data.countries[k]).map((key) => ({
    key,
    ...data.countries[key],
  }));
}

export function getPolicySource(id: string): PolicySource | undefined {
  return data.sources[id];
}

export function policyClaimSources(claim: PolicyClaim): PolicySource[] {
  return claim.sourceIds
    .map((id) => data.sources[id])
    .filter((s): s is PolicySource => Boolean(s));
}

// ─── Presentation helpers ─────────────────────────────────────────────────
//
// countLabel / formatPolicyDate moved to config.ts (perf audit C1): client
// components (matrix-console, control-room, source-quality) import them from
// the leaf module so this JSON-heavy file stays out of the client bundle.
// Re-exported here so server-side callers keep one import path.
export { countLabel, formatPolicyDate } from "./config";

// ─── Aggregates ────────────────────────────────────────────────────────────

export interface PolicyStats {
  countries: number;
  claims: number;
  sources: number;
  byState: Record<string, number>;
  gaps: number;
  humanGateStatus: string;
  reviewedAt: string;
}

export function getPolicyStats(): PolicyStats {
  const byState: Record<string, number> = {};
  let claims = 0;
  let gaps = 0;
  for (const c of getPolicyCountries()) {
    for (const cl of c.claims) byState[cl.state] = (byState[cl.state] ?? 0) + 1;
    claims += c.claims.length;
    gaps += c.pillarGaps?.length ?? 0;
  }
  return {
    countries: getPolicyCountries().length,
    claims,
    sources: Object.keys(data.sources).length,
    byState,
    gaps,
    humanGateStatus: data.humanGate.status,
    reviewedAt: data.humanGate.reviewedAt,
  };
}

/** One matrix cell: how a pillar is covered in one country. */
export interface PillarCell {
  pillar: string;
  stateCounts: Partial<Record<PolicyState, number>>;
  total: number;
  gap?: PillarGap;
}

export function getPillarMatrix(): Record<string, Record<string, PillarCell>> {
  const matrix: Record<string, Record<string, PillarCell>> = {};
  for (const c of getPolicyCountries()) {
    matrix[c.key] = {};
    for (const cl of c.claims) {
      const cell =
        matrix[c.key][cl.pillar] ??
        (matrix[c.key][cl.pillar] = { pillar: cl.pillar, stateCounts: {}, total: 0 });
      cell.stateCounts[cl.state] = (cell.stateCounts[cl.state] ?? 0) + 1;
      cell.total += 1;
    }
    for (const gap of c.pillarGaps ?? []) {
      const cell =
        matrix[c.key][gap.pillar] ??
        (matrix[c.key][gap.pillar] = { pillar: gap.pillar, stateCounts: {}, total: 0 });
      cell.gap = gap;
    }
  }
  return matrix;
}

// ─── Claim-level changelog (hand-refreshed per dataset bump) ────────────────

export interface ChangelogClaim {
  id: string;
  country: string;
  pillar: string;
  action: string;
  previousState: string | null;
  state: PolicyState;
  previousVersionNote: string;
  statement: string;
  sourceIds: string[];
  editorialDecision: string;
}

export interface ChangelogEntry {
  version: string;
  previousVersion: string;
  date: string;
  summary: string;
  claims: ChangelogClaim[];
  sourcesAdded: string[];
  editorialDecisionSummary: string;
}

interface PolicyChangelogJson {
  schemaVersion: string;
  datasetVersion: string;
  note: string;
  entries: ChangelogEntry[];
}

/**
 * Claim-level dataset history (claim -> sources -> previous version ->
 * editorial decision). Entries are hand-refreshed on every dataset bump by
 * diffing the previous published dataset against the new one - the page must
 * never run git at request time. Sources resolve from the registry by id.
 */
export function getPolicyChangelog(): ChangelogEntry[] {
  return (changelogJson as unknown as PolicyChangelogJson).entries;
}
