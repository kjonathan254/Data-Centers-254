import directoryJson from "../data/directory/current.json";

export interface ConnectivityProvider {
  name: string;
  type: string;
}

export interface Cert {
  certification: { name: string; type: string };
}

export interface Operator {
  id: string;
  name: string;
  slug: string;
  type: string;
  parentCompany: string | null;
  hqCountry: string;
  websiteUrl: string | null;
}

/**
 * Investment-standard supply pipeline staging (mirrors the language used by
 * global market trackers): built capacity flows from Live through Under
 * Construction (financed, build underway), Committed (land/funding secured,
 * pre-build) and Early Stage (announced intent) before it reaches the grid.
 */
export type FacilityStatus =
  | "Operational"
  | "Under Construction"
  | "Committed"
  | "Early Stage";

export const STATUS_ORDER: FacilityStatus[] = [
  "Operational",
  "Under Construction",
  "Committed",
  "Early Stage",
];

/** A citable source behind a facility record. */
export interface SourceRef {
  label: string;
  url: string;
  /** operator = primary operator page · registry = independent register · press = credible third-party report · gov = government/institutional */
  kind: "operator" | "registry" | "press" | "gov";
}

export interface Facility {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: FacilityStatus;
  address: string | null;
  city: string;
  region: string;
  /** Country the facility sits in. Older (Kenya-census) records predate the
   * field; the loader defaults them to "Kenya" so display code can rely on it. */
  country: string;
  itLoadMw: number | null;
  totalCapacityMw: number | null;
  rackCount: number | null;
  tierRating: string | null;
  facilityType: string | null;
  aiReady: boolean;
  openedDate: string | null;
  expansionDate: string | null;
  coolingType: string | null;
  powerSource: string | null;
  renewableClaim: string | null;
  notable: string | null;
  lastVerified: string;
  dataSource: string;
  dataConfidence: string;
  /** Hand-curated links to DC254 coverage of this facility/operator. */
  articleSlugs?: string[];
  /** Per-claim source links, the claim, the source, the date. */
  sources?: SourceRef[];
  /** Cross-reference against the PeeringDB facility register. */
  peeringdbFacId?: number;
  peeringdbNetworks?: number;
  peeringdbIxs?: number;
  /** True only where carrier neutrality is operator-stated or independently evidenced. */
  carrierNeutral?: boolean;
  /** Third-party certification position, stated precisely (design vs constructed-facility). */
  certNote?: string | null;
  /** Where marketing claims and available evidence part ways, said plainly. */
  divergenceNote?: string | null;
  /** Publisher-supplied, identity-confirmed photo of the facility, rendered as the page hero. */
  heroImage?: string;
  /** Credit line shown under the hero image. */
  heroImageCredit?: string;
  operatorId: string;
  operator: Operator;
  connectivityFacility: { provider: ConnectivityProvider }[];
  certifications: Cert[];
}

/** Versioned-dataset metadata, carried in the JSON's `meta` block. */
export interface DatasetMeta {
  datasetId: string;
  version: string;
  quarter: string;
  releasedAt: string;
  scope: string;
  recordCounts: { facilities: number; operators: number };
}

// ─── Versioned dataset loader ─────────────────────────────────────────────
//
// The source of truth is src/data/directory/current.json, a versioned
// structured file (audit Phase 2: "migrate directory data to versioned
// structured files; snapshot quarterly"). Quarterly snapshots live next to
// it under data/directory/snapshots/. This module is the typed access
// layer: it joins operators onto facilities and keeps the query helpers
// every surface (directory, tracker, map, compare, API) already uses.

type RawFacility = Omit<Facility, "operator" | "country"> & { country?: string };

const dataset = directoryJson as unknown as {
  meta: DatasetMeta;
  operators: Operator[];
  facilities: RawFacility[];
};

const operators: Operator[] = dataset.operators;

const facilities: Facility[] = dataset.facilities.map((f) => ({
  country: "Kenya",
  ...f,
  operator: operators.find((o) => o.id === f.operatorId) as Operator,
}));

export function getDatasetMeta(): DatasetMeta {
  return dataset.meta;
}

export function facilityCountry(f: Facility): string {
  return f.country || "Kenya";
}

export function getFacilities() {
  return facilities;
}

/**
 * Kenya city split for the intro sentence and the meta description:
 * counts for Nairobi and Mombasa plus the alphabetised list of the
 * remaining Kenyan cities. Dataset-derived so body copy and metadata
 * always sum to the Kenya total and can never drift apart.
 */
export function getKenyaCitySplit() {
  const ke = facilities.filter((f) => facilityCountry(f) === "Kenya");
  const nairobi = ke.filter((f) => f.city === "Nairobi").length;
  const mombasa = ke.filter((f) => f.city === "Mombasa").length;
  const others = Array.from(
    new Set(ke.map((f) => f.city).filter((c) => c !== "Nairobi" && c !== "Mombasa"))
  ).sort();
  const list =
    others.length > 1
      ? `${others.slice(0, -1).join(", ")} and ${others[others.length - 1]}`
      : others.join(", ");
  return { nairobi, mombasa, others, count: ke.length - nairobi - mombasa, list };
}

export function getFacilityBySlug(slug: string) {
  return facilities.find((f) => f.slug === slug) || null;
}

/**
 * Market supply snapshot, staged by pipeline status. Capacity basis:
 * Operational = built (designed) capacity of live facilities; pipeline
 * stages = developer-announced capacity. liveItLoadMw is the verified
 * in-service IT load, tracked separately for honesty about utilisation.
 * countryMw/stages stay Kenya-comparable: regional starter records are
 * few, so country splits are exposed separately, not blended in.
 */
export function getMarketSnapshot() {
  const ke = facilities.filter((f) => facilityCountry(f) === "Kenya");
  const stages = STATUS_ORDER.map((stage) => {
    const inStage = ke.filter((f) => f.status === stage);
    const mw = inStage.reduce((s, f) => s + (f.totalCapacityMw || 0), 0);
    return { stage, count: inStage.length, mw };
  });
  const totalSupplyMw = stages.reduce((s, x) => s + x.mw, 0);
  const liveItLoadMw = ke
    .filter((f) => f.status === "Operational")
    .reduce((s, f) => s + (f.itLoadMw || 0), 0);
  const dates = facilities.map((f) => f.lastVerified).sort();
  const lastVerified = dates[dates.length - 1] || "";
  const regional = facilities.length - ke.length;
  return {
    stages,
    totalSupplyMw,
    liveItLoadMw,
    facilities: facilities.length,
    kenyaFacilities: ke.length,
    regionalFacilities: regional,
    operators: operators.length,
    lastVerified,
  };
}

export function getOperators() {
  return operators;
}

export function getDirectoryStats() {
  const ops = facilities.filter((f) => f.status === "Operational");
  const mw = facilities.reduce((s, f) => s + (f.itLoadMw || 0), 0);
  const racks = facilities.reduce((s, f) => s + (f.rackCount || 0), 0);
  const ai = facilities.filter((f) => f.aiReady).length;
  const neutral = facilities.filter((f) => f.carrierNeutral === true && f.status === "Operational").length;
  const countries = new Set(facilities.map(facilityCountry));
  return {
    totalFacilities: facilities.length,
    operationalCount: ops.length,
    totalMw: mw,
    totalRacks: racks,
    aiReadyCount: ai,
    carrierNeutralCount: neutral,
    countryCount: countries.size,
    regionalCount: facilities.length - facilities.filter((f) => facilityCountry(f) === "Kenya").length,
  };
}

export function getFilterMeta() {
  const statuses = facilities.reduce<Record<string, number>>((acc, f) => {
    acc[f.status] = (acc[f.status] || 0) + 1;
    return acc;
  }, {});
  const cities = [...new Set(facilities.map((f) => f.city))];
  const countries = [...new Set(facilities.map(facilityCountry))].sort();
  const types = [...new Set(facilities.map((f) => f.facilityType).filter(Boolean))];
  // Only offer operators that actually have facilities in the directory
  const usedOperatorIds = new Set(facilities.map((f) => f.operatorId));
  return {
    operators: operators
      .filter((o) => usedOperatorIds.has(o.id))
      .map((o) => ({ id: o.id, name: o.name })),
    statuses: Object.entries(statuses).map(([value, count]) => ({ value, count })),
    cities,
    countries,
    types,
  };
}
