/**
 * Build the State of the Market 2026-Q3 dataset bundle into
 * public/datasets/2026-Q3/ from the frozen quarterly snapshot and the
 * market tracker datasets. Output is committed: the bundle is a static,
 * citable artifact (audit Phase 2: "dataset products and API become
 * cuttable from one source of truth").
 *
 * Run: node scripts/build_dataset_bundle.mjs
 * Zip: cd public/datasets && zip -r dc254-dataset-bundle-2026-Q3.zip 2026-Q3
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..");
const OUT = join(repo, "public", "datasets", "2026-Q3");

const snapshot = JSON.parse(
  readFileSync(join(repo, "src", "data", "directory", "snapshots", "2026-Q3.json"), "utf-8")
);
const trackers = await import(join(repo, "src", "lib", "market-trackers.ts"));

/* ---------- CSV helpers ---------- */

function csvCell(v) {
  if (v == null) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function toCsv(headers, rows) {
  return [headers.join(","), ...rows.map((r) => r.map(csvCell).join(","))].join("\n") + "\n";
}
function write(name, content) {
  writeFileSync(join(OUT, name), content, "utf-8");
  console.log(`  wrote ${name} (${(content.length / 1024).toFixed(1)} KB)`);
}

mkdirSync(OUT, { recursive: true });

/* ---------- 1. Facilities CSV ---------- */

const FACILITY_COLS = [
  "id", "name", "slug", "status", "city", "region", "country",
  "itLoadMw", "totalCapacityMw", "rackCount", "tierRating", "facilityType",
  "aiReady", "carrierNeutral", "openedDate", "expansionDate",
  "operatorId", "operatorName", "operatorType", "operatorParent",
  "lastVerified", "dataConfidence", "dataSource",
];
const facRows = snapshot.facilities.map((f) => [
  f.id, f.name, f.slug, f.status, f.city, f.region, f.country || "Kenya",
  f.itLoadMw, f.totalCapacityMw, f.rackCount, f.tierRating, f.facilityType,
  f.aiReady, f.carrierNeutral ?? "", f.openedDate, f.expansionDate,
  f.operatorId, f.operator?.name ?? "", f.operator?.type ?? "", f.operator?.parentCompany ?? "",
  f.lastVerified, f.dataConfidence, f.dataSource,
]);
write("facilities-2026-Q3.csv", toCsv(FACILITY_COLS, facRows));

/* ---------- 2. Operators CSV ---------- */

const opRows = snapshot.operators.map((o) => [
  o.id, o.name, o.slug, o.type, o.parentCompany ?? "", o.hqCountry, o.websiteUrl ?? "",
]);
write("operators-2026-Q3.csv", toCsv(
  ["id", "name", "slug", "type", "parentCompany", "hqCountry", "websiteUrl"],
  opRows
));

/* ---------- 3. Subsea cables CSV ---------- */

const cableRows = trackers.SUBSEA_CABLES.map((c) => [
  c.name, c.longName ?? "", c.status, c.rfsDate ?? "", c.kenyanLandings.join("; "),
  c.owners, c.designCapacity ?? "", c.note, c.lastVerified, c.dataConfidence,
  c.sources.map((s) => s.label).join("; "), c.sources.map((s) => s.url).join("; "),
  c.dc254Article ?? "",
]);
write("subsea-cables-2026-Q3.csv", toCsv(
  ["name", "longName", "status", "rfsDate", "kenyanLandings", "owners",
   "designCapacity", "note", "lastVerified", "dataConfidence",
   "sourceLabels", "sourceUrls", "dc254Article"],
  cableRows
));

/* ---------- 4. Power tariffs CSV ---------- */

const tariffRows = trackers.POWER_TARIFFS.map((t) => [
  t.metric, t.value, t.basis, t.note,
]);
write("power-tariffs-2026-Q3.csv", toCsv(
  ["metric", "value", "basis", "note"], tariffRows
));

/* ---------- 5. Licensing CSV ---------- */

const licRows = trackers.LICENSING_REGIMES.map((r) => [
  r.regime, r.status, r.keyFees, r.validity, r.note,
]);
write("licensing-2026-Q3.csv", toCsv(
  ["regime", "status", "keyFees", "validity", "note"], licRows
));

/* ---------- 6. manifest.json ---------- */

const manifest = {
  datasetId: "dc254-dataset-bundle",
  edition: "2026-Q3",
  releasedAt: snapshot.takenAt,
  publisher: "Data Centre 254",
  publisherUrl: "https://data-centers-254.vercel.app",
  snapshotOf: snapshot.snapshotOf,
  recordCounts: {
    facilities: snapshot.facilities.length,
    operators: snapshot.operators.length,
    subseaCables: trackers.SUBSEA_CABLES.length,
    tariffBenchmarks: trackers.POWER_TARIFFS.length,
    licensingRegimes: trackers.LICENSING_REGIMES.length,
  },
  files: [
    { name: "facilities-2026-Q3.csv", description: "Facility-level records: status, capacity, operator, verification date, confidence." },
    { name: "operators-2026-Q3.csv", description: "Operator records with parent company and HQ country." },
    { name: "subsea-cables-2026-Q3.csv", description: "Submarine cable systems at Kenyan landings: status, RFS, owners, sources." },
    { name: "power-tariffs-2026-Q3.csv", description: "Power tariff benchmarks with basis labels (published / DC254 estimate / reported)." },
    { name: "licensing-2026-Q3.csv", description: "Licensing regimes: NFP-T2, proposed standalone licence, ODPC obligations." },
    { name: "README.txt", description: "Data dictionary, confidence grades and citation guidance." },
  ],
  licence: "CC BY 4.0. Cite as: Data Centre 254, 'DC254 Dataset Bundle, 2026-Q3 edition', released <date>, https://data-centers-254.vercel.app/research/state-of-the-market-2026-q3.",
  verification: {
    method: "Every row carries named sources and a last-verified month. Confidence grades: High = operator-confirmed; Medium = single-source or mixed; Low = fragmentary.",
    methodologyUrl: "https://data-centers-254.vercel.app/methodology",
    correctionsUrl: "https://data-centers-254.vercel.app/corrections",
  },
};
write("manifest.json", JSON.stringify(manifest, null, 2) + "\n");

/* ---------- 7. README.txt ---------- */

const readme = `DC254 Dataset Bundle - 2026-Q3 edition
=======================================
Publisher: Data Centre 254 (https://data-centers-254.vercel.app)
Snapshot of: ${snapshot.snapshotOf} (taken ${snapshot.takenAt})

WHAT THIS IS
The quarterly, frozen dataset behind DC254's State of the Market report:
${manifest.recordCounts.facilities} facility records (${manifest.recordCounts.operators} operators) plus the subsea cable,
power tariff and licensing trackers. The live directory keeps moving at
/directory; this bundle is the citable edition for the quarter.

FILES
${manifest.files.map((f) => `- ${f.name}: ${f.description}`).join("\n")}

CONFIDENCE GRADES
High   = operator-confirmed (primary operator page or announcement)
Medium = single-source or mixed evidence; the source is named per row
Low    = fragmentary; figures are estimates and treated as signals only

FIELD NOTES
- itLoadMw        : verified in-service IT load where the operator publishes it.
- totalCapacityMw : designed capacity (operational) or developer-announced
                    capacity (pipeline stages). These are never blended.
- carrierNeutral  : TRUE only where operator-stated or independently evidenced;
                    blank means unknown, not negative.
- lastVerified    : YYYY-MM month the record was last re-verified against
                    sources. A monthly sweep and quarterly full re-verification
                    are promised on /methodology.

CITATION
${manifest.licence}

CORRECTIONS
Found something wrong? Corrections are a product, not a scandal:
https://data-centers-254.vercel.app/corrections
`;
write("README.txt", readme);

console.log(`bundle built: ${OUT}`);
