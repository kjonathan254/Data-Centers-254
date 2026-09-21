/**
 * Evidence Engine v0.1 — batch evidence grading for the DC254 directory.
 * =====================================================================
 * Offline generator (NOT part of the site build). For EVERY facility record
 * in src/data/directory/current.json it asks Jev (TypeSafe) two atomic
 * questions — can the claims be TRACED to the cited sources, and is the
 * evidence INDEPENDENT — then CODE combines them deterministically.
 *
 * Architecture law (project principles):
 *   CODE     = deterministic truth (composite, bands, file emission)
 *   SOURCES  = the evidence cited in each record
 *   TYPESAFE = semantic judgment of that evidence (Jev)
 *   LLM/Jibu = explanation only (never here)
 *   HUMAN    = editorial authority (this output is a REVIEW AID, not a gate)
 *
 * Outputs:
 *   1. src/data/directory/evidence-<version>.json — committed, versioned
 *   2. download/evidence-engine-v01-report.json   — full run + comparison
 *     vs the editor's existing dataConfidence, with review triggers.
 *
 * Run:  cd /home/z/my-project/dc254 && npx -y tsx scripts/evidence_engine.ts
 * Needs TYPESAFE_API_KEY in .env.local (gitignored).
 */
import * as fs from "node:fs";
import * as path from "node:path";
import {
  TYPESAFE_MODEL,
  TYPESAFE_ENDPOINT,
  PRICE_PER_MTOK_INPUT,
  NOUL_VERIFIED_MIN,
  NOUL_UNSUPPORTED_MAX,
  FACILITY_QUESTIONS,
  FACILITY_TYPE_MAP,
  EVIDENCE_COMPOSITE,
} from "../src/lib/typesafe/config";

const ROOT = path.resolve(__dirname, "..");
const DIRECTORY = path.join(ROOT, "src", "data", "directory", "current.json");
const OUT_DIR_REPORT = "/home/z/my-project/download";
const CONCURRENCY = 4;

/** Fields that hold human/editor judgments — must not leak into the model's view. */
const STRIP_FIELDS = ["dataConfidence", "facilityType", "divergenceNote"];

// ── env ──────────────────────────────────────────────────────────────────
function loadKey(): string {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) throw new Error(".env.local not found");
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const m = line.match(/^TYPESAFE_API_KEY=(.+)\s*$/);
    if (m) return m[1].trim();
  }
  throw new Error("TYPESAFE_API_KEY missing in .env.local");
}

// ── TypeSafe call (same retry policy as the calibration harness) ────────
async function ask(key: string, state: unknown, questions: unknown, attempt = 1): Promise<any> {
  const t0 = performance.now();
  const res = await fetch(TYPESAFE_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ state, model: TYPESAFE_MODEL, questions }),
  });
  const latencyMs = performance.now() - t0;
  if (!res.ok) {
    const body = (await res.text()).slice(0, 300);
    if ((res.status === 429 || res.status >= 500) && attempt < 3) {
      const ra = Number(res.headers.get("retry-after"));
      await new Promise((r) => setTimeout(r, ra ? ra * 1000 : attempt * 2000));
      return ask(key, state, questions, attempt + 1);
    }
    throw new Error(`HTTP ${res.status}: ${body}`);
  }
  const json = await res.json();
  return { ...json, _latencyMs: latencyMs };
}

async function pool<T, R>(items: T[], n: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: n }, worker));
  return out;
}

const bandOf = (p: number) =>
  p >= NOUL_VERIFIED_MIN ? "verified" : p < NOUL_UNSUPPORTED_MAX ? "unsupported" : "review";

// ── main ─────────────────────────────────────────────────────────────────
async function main() {
  const key = loadKey();
  const dir = JSON.parse(fs.readFileSync(DIRECTORY, "utf-8"));
  const facilities: any[] = dir.facilities;
  const version: string = dir.meta?.version ?? dir.meta?.directoryVersion ?? "2026-Q3";
  console.log(`Evidence Engine v0.1 — ${facilities.length} facilities, directory ${version}, model ${TYPESAFE_MODEL}`);

  const errors: string[] = [];
  const results = await pool(facilities, CONCURRENCY, (f) => {
    const state: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(f)) if (!STRIP_FIELDS.includes(k)) state[k] = v;
    return ask(key, state, FACILITY_QUESTIONS)
      .then((r) => ({ f, r, ok: true as const }))
      .catch((e) => {
        errors.push(`${f.name}: ${e.message}`);
        return { f, r: null, ok: false as const };
      });
  });

  const ok = results.filter((r) => r.ok) as { f: any; r: any; ok: true }[];
  const graded = ok.map(({ f, r }) => {
    const t = r.answers?.evidence_traceability?.noul as number | undefined;
    const i = r.answers?.evidence_independence?.noul as number | undefined;
    const comp =
      t === undefined || i === undefined
        ? undefined
        : EVIDENCE_COMPOSITE === "min"
          ? Math.min(t, i)
          : (t + i) / 2;
    return {
      name: f.name as string,
      slug: f.slug as string,
      editorFacilityType: f.facilityType,
      jevFacilityType: r.answers?.facility_type?.choice,
      jevFacilityTypeConf: r.answers?.facility_type?.confidence,
      editorDataConfidence: f.dataConfidence,
      traceability: t,
      independence: i,
      evidence: comp,
      band: comp === undefined ? undefined : bandOf(comp),
      latencyMs: Math.round(r._latencyMs),
    };
  });

  const tokIn = ok.reduce((s, x) => s + ((x.r.usage?.input_tokens as number) ?? 0), 0);
  const lat = ok.map((x) => x.r._latencyMs as number);
  const mean = (a: number[]) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0);
  const p95 = (a: number[]) =>
    a.length ? a.slice().sort((x, y) => x - y)[Math.min(a.length - 1, Math.floor(a.length * 0.95))] : 0;
  const pct = (n: number, d: number) => (d === 0 ? null : Math.round((n / d) * 1000) / 10);

  // Editorial review triggers (CODE, deterministic):
  //  A. band = review  → threshold band says human decides
  //  B. editor said High but engine says unsupported → disagreement to resolve
  //  C. engine says verified but editor said Low/Medium → editor can upgrade
  const reviewA = graded.filter((g) => g.band === "review");
  const reviewB = graded.filter((g) => g.editorDataConfidence === "High" && g.band === "unsupported");
  const reviewC = graded.filter((g) => g.editorDataConfidence !== "High" && g.band === "verified");

  // 1) committed, versioned evidence file
  const records: Record<string, unknown> = {};
  for (const g of graded) {
    records[g.name] = {
      traceability: g.traceability,
      independence: g.independence,
      evidence: g.evidence,
      band: g.band,
      review: g.band === "review",
    };
  }
  const evidenceFile = {
    version,
    generatedAt: new Date().toISOString(),
    model: TYPESAFE_MODEL,
    compositeRule: EVIDENCE_COMPOSITE,
    thresholds: { NOUL_VERIFIED_MIN, NOUL_UNSUPPORTED_MAX },
    note: "Model-graded strength of the evidence each facility record cites. AI grades evidence, never establishes facts; editorial authority is the DC254 editor. Bands: verified >= 0.75, unsupported < 0.5, review in between. Regenerate with scripts/evidence_engine.ts when the directory version changes.",
    records,
  };
  const outPath = path.join(ROOT, "src", "data", "directory", `evidence-${version}.json`);
  fs.writeFileSync(outPath, JSON.stringify(evidenceFile, null, 2) + "\n");

  // 2) full report for the editor
  const report = {
    engine: "evidence-v0.1",
    runAt: evidenceFile.generatedAt,
    directoryVersion: version,
    model: TYPESAFE_MODEL,
    compositeRule: EVIDENCE_COMPOSITE,
    thresholds: { NOUL_VERIFIED_MIN, NOUL_UNSUPPORTED_MAX },
    errors,
    summary: {
      n: facilities.length,
      graded: graded.length,
      verifiedPct: pct(graded.filter((g) => g.band === "verified").length, graded.length),
      reviewPct: pct(reviewA.length, graded.length),
      unsupportedPct: pct(graded.filter((g) => g.band === "unsupported").length, graded.length),
      reviewTriggers: { A_thresholdReview: reviewA.map((g) => g.name), B_editorHighEngineUnsupported: reviewB.map((g) => g.name), C_engineVerifiedEditorNotHigh: reviewC.map((g) => g.name) },
    },
    facilityTypeAgreement: {
      n: graded.filter((g) => g.jevFacilityType).length,
      agreementPct: pct(
        graded.filter((g) => g.jevFacilityType).filter((g) => {
          const map = FACILITY_TYPE_MAP[g.editorFacilityType] ?? "other";
          return map === g.jevFacilityType;
        }).length,
        graded.filter((g) => g.jevFacilityType).length
      ),
    },
    performance: {
      latencyMeanMs: Math.round(mean(lat)),
      latencyP95Ms: Math.round(p95(lat)),
      inputTokens: tokIn,
      costUsd: Math.round((tokIn / 1e6) * PRICE_PER_MTOK_INPUT * 1e4) / 1e4,
    },
    records: graded,
  };
  const reportPath = path.join(OUT_DIR_REPORT, "evidence-engine-v01-report.json");
  fs.mkdirSync(OUT_DIR_REPORT, { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`graded ${graded.length}/${facilities.length}  errors: ${errors.length}`);
  console.log(`bands: verified ${report.summary.verifiedPct}%  review ${report.summary.reviewPct}%  unsupported ${report.summary.unsupportedPct}%`);
  console.log(`review A (threshold): ${reviewA.map((g) => g.name).join(", ") || "none"}`);
  console.log(`review B (editor High vs engine unsupported): ${reviewB.map((g) => g.name).join(", ") || "none"}`);
  console.log(`review C (engine verified vs editor not-High): ${reviewC.map((g) => g.name).join(", ") || "none"}`);
  console.log(`cost $${report.performance.costUsd}  latency mean ${report.performance.latencyMeanMs}ms / p95 ${report.performance.latencyP95Ms}ms`);
  console.log(`\nCommitted: ${outPath}\nReport:   ${reportPath}`);
}

main().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
