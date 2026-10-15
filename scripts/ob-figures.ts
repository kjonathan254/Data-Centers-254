/**
 * Opportunity Brief figures extractor.
 *
 * Dumps the canonical market figures (the exact numbers behind the public
 * directory, tracker and stats surfaces) into scripts/ob-figures.json so the
 * redacted sample PDF can be generated from the same data the site shows.
 * Rule (2026-10-15 product blueprint): the brief must never maintain a
 * second set of MW figures - every number traces back to current.json and
 * market-trackers.ts via the site's own accessor functions.
 *
 * Run: npx tsx scripts/ob-figures.ts
 * Output: scripts/ob-figures.json
 */
import { writeFileSync } from "node:fs";
import { getMarketSnapshot, getFacilities, getDatasetMeta } from "../src/lib/directory-data";
import { getPlatformStats } from "../src/lib/site-stats";
import { SUBSEA_CABLES, LICENSING_REGIMES } from "../src/lib/market-trackers";

const snap = getMarketSnapshot();
const ke = getFacilities().filter((f) => f.country !== "" ? f.country === "Kenya" : true)
  .filter((f) => {
    // country defaults to Kenya in the loader; guard for any future change
    return (f.country || "Kenya") === "Kenya";
  });

const facilities = ke.map((f) => ({
  name: f.name,
  slug: f.slug,
  operator: f.operator?.name ?? null,
  city: f.city,
  status: f.status,
  designedMw: f.totalCapacityMw,
  itLoadMw: f.itLoadMw,
  tier: f.tierRating,
  aiReady: f.aiReady,
  openedDate: f.openedDate,
  expansionDate: f.expansionDate,
  notable: f.notable,
  lastVerified: f.lastVerified,
  dataConfidence: f.dataConfidence,
  sources: (f.sources ?? []).map((s) => ({ label: s.label, url: s.url, kind: s.kind })),
}));

const out = {
  generatedAt: new Date().toISOString().slice(0, 10),
  dataset: {
    datasetId: getDatasetMeta().datasetId,
    version: getDatasetMeta().version,
    quarter: getDatasetMeta().quarter,
    releasedAt: getDatasetMeta().releasedAt,
  },
  platform: getPlatformStats(),
  stages: snap.stages,
  lastVerified: snap.lastVerified,
  kenyaFacilities: facilities,
  cables: SUBSEA_CABLES.map((c) => ({
    name: c.name,
    status: c.status,
    rfsDate: c.rfsDate,
    kenyanLandings: c.kenyanLandings,
    lastVerified: c.lastVerified,
    confidence: c.dataConfidence,
  })),
  licensing: LICENSING_REGIMES.map((r) => ({
    regime: r.regime,
    status: r.status,
  })),
};

writeFileSync(new URL("./ob-figures.json", import.meta.url), JSON.stringify(out, null, 2));
console.log(
  `ob-figures.json written: ${out.platform.kenyaFacilities} Kenya facilities, ` +
    `${out.platform.designedLiveMw} MW designed, ${out.platform.publishedItLoadMw} MW IT load, ` +
    `${out.platform.cables.inService} cables in service, lastVerified ${out.lastVerified}`
);
console.log(
  "stages:",
  out.stages.map((s: { stage: string; count: number; mw: number }) => `${s.stage}=${s.count}`).join(", ")
);
