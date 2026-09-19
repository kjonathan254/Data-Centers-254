/**
 * One-time migration: extract the directory dataset from
 * src/lib/directory-data.ts (the original TS source of truth) into
 * src/data/directory/current.json, the versioned structured file the
 * audit's Phase 2 calls for ("migrate directory data to versioned
 * structured files").
 *
 * The embedded `operator` object is stripped from each facility record;
 * the loader in directory-data.ts re-joins operators by operatorId, so
 * the JSON keeps a normalised shape (operators and facilities as peers).
 *
 * Run: node scripts/extract_directory_json.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, "..", "src", "data", "directory", "current.json");

const { getFacilities, getOperators } = await import(
  join(here, "..", "src", "lib", "directory-data.ts")
);

const operators = getOperators();
const facilities = getFacilities().map(({ operator: _op, ...rest }) => rest);

// Sanity checks before we commit to the new source of truth.
const opIds = new Set(operators.map((o) => o.id));
for (const f of facilities) {
  if (!opIds.has(f.operatorId)) {
    throw new Error(`facility ${f.slug} references unknown operatorId ${f.operatorId}`);
  }
}
const slugs = new Set();
for (const f of facilities) {
  if (slugs.has(f.slug)) throw new Error(`duplicate facility slug: ${f.slug}`);
  slugs.add(f.slug);
}

const dataset = {
  meta: {
    datasetId: "dc254-directory",
    version: "2026-Q3",
    quarter: "2026-Q3",
    releasedAt: "2026-09-19",
    scope:
      "Data centre facilities and operators tracked by DC254. Kenya census plus the first East Africa regional records (Tanzania, Uganda, Rwanda).",
    recordCounts: {
      facilities: facilities.length,
      operators: operators.length,
    },
  },
  operators,
  facilities,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(dataset, null, 2) + "\n", "utf-8");
console.log(
  `wrote ${OUT}: ${facilities.length} facilities, ${operators.length} operators, version ${dataset.meta.version}`
);
