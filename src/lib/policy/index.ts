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

// ─── Presentation helpers (audit §14: one terminology, one date format) ────

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
