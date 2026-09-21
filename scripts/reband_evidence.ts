/**
 * Re-band evidence-2026-Q3.json from its stored scores using the CURRENT
 * thresholds in src/lib/typesafe/config.ts (single source of truth).
 *
 * Deterministic post-processing only — no TypeSafe API calls, no new
 * judgments. Run whenever the editor recalibrates NOUL_VERIFIED_MIN /
 * NOUL_UNSUPPORTED_MAX. The upstream scores are untouched, so this is
 * fully reversible via git.
 *
 * Run:  cd /home/z/my-project/dc254 && npx -y tsx scripts/reband_evidence.ts
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { NOUL_VERIFIED_MIN, NOUL_UNSUPPORTED_MAX } from "../src/lib/typesafe/config";

const FILE = path.resolve(__dirname, "..", "src", "data", "directory", "evidence-2026-Q3.json");

type Rec = { traceability: number; independence: number; evidence: number; band: string; review: boolean };
type Doc = {
  version: string;
  generatedAt: string;
  rebandedAt?: string;
  model: string;
  compositeRule: string;
  thresholds: { NOUL_VERIFIED_MIN: number; NOUL_UNSUPPORTED_MAX: number };
  note: string;
  records: Record<string, Rec>;
};

const doc: Doc = JSON.parse(fs.readFileSync(FILE, "utf-8"));

if (doc.compositeRule !== "min") throw new Error(`Unexpected compositeRule: ${doc.compositeRule}`);

const bandOf = (c: number) =>
  c >= NOUL_VERIFIED_MIN ? "verified" : c < NOUL_UNSUPPORTED_MAX ? "unsupported" : "review";

const counts = { verified: 0, review: 0, unsupported: 0 };

for (const [name, rec] of Object.entries(doc.records)) {
  // Recompute the composite from the untouched atomic judgments, then band.
  const composite = Math.min(rec.traceability, rec.independence);
  if (Math.abs(composite - rec.evidence) > 1e-9) {
    throw new Error(`${name}: stored evidence ${rec.evidence} != min() ${composite} — regenerate with evidence_engine.ts first`);
  }
  rec.band = bandOf(composite);
  rec.review = rec.band === "review";
  counts[rec.band as keyof typeof counts]++;
}

doc.thresholds = { NOUL_VERIFIED_MIN, NOUL_UNSUPPORTED_MAX };
doc.rebandedAt = new Date().toISOString();
doc.note =
  "Model-graded strength of the evidence each facility record cites. AI grades evidence, never establishes facts; editorial authority is the DC254 editor. Bands are INTERNAL review/ranking signals only — no hard gates, no public verification claims (editorial decision 2026-09-21). Bands: strongest >= 0.55, no traceable evidence < 0.2, review in between — cut at the two observed distribution gaps, not aspirational round numbers. Regenerate scores with scripts/evidence_engine.ts when the directory version changes; re-band with scripts/reband_evidence.ts when thresholds change.";

fs.writeFileSync(FILE, JSON.stringify(doc, null, 2) + "\n");

console.log(`Re-banded ${Object.keys(doc.records).length} records (thresholds ${NOUL_UNSUPPORTED_MAX} / ${NOUL_VERIFIED_MIN}):`);
console.log(`  strongest   >= ${NOUL_VERIFIED_MIN} : ${counts.verified}`);
console.log(`  review             : ${counts.review}`);
console.log(`  no traceable < ${NOUL_UNSUPPORTED_MAX} : ${counts.unsupported}`);
console.log("\nReview-band worklist (homepage-grade sources to upgrade):");
for (const [name, rec] of Object.entries(doc.records)) if (rec.band === "review") console.log(`  ${rec.evidence.toFixed(2)}  ${name}`);
