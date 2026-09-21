/**
 * TypeSafe Phase 0 — calibration harness (offline tool, NOT part of the site build)
 *
 * Runs Jev over 15 real articles + 15 real directory records (the same
 * deterministic sample as scripts/phase0_sample.py), compares answers to
 * pre-registered ground-truth labels, and reports accuracy, false
 * positives/negatives, human-review rate, latency and cost.
 *
 * Run:  cd /home/z/my-project/dc254 && npx -y tsx scripts/typesafe_phase0.ts
 * Needs TYPESAFE_API_KEY in .env.local (gitignored).
 */
import * as fs from "node:fs";
import * as path from "node:path";
import matter from "gray-matter";
import {
  TYPESAFE_MODEL,
  TYPESAFE_ENDPOINT,
  PRICE_PER_MTOK_INPUT,
  CONFIDENCE_MIN_AUTO,
  NOUL_VERIFIED_MIN,
  NOUL_UNSUPPORTED_MAX,
  ARTICLE_QUESTIONS,
  FACILITY_QUESTIONS,
  FACILITY_TYPE_MAP,
} from "../src/lib/typesafe/config";

const ROOT = path.resolve(__dirname, "..");
const ARTICLES_DIR = path.join(ROOT, "content", "articles");
const DIRECTORY = path.join(ROOT, "src", "data", "directory", "current.json");
const LABELS = JSON.parse(
  fs.readFileSync(path.join(__dirname, "typesafe_phase0_labels.json"), "utf-8")
);
const REPORT_PATH = "/home/z/my-project/download/typesafe-phase0-report.json";
const N_ARTICLES = 15;
const N_FACILITIES = 15;
const BODY_CAP = 6000;
const CONCURRENCY = 4;

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

// ── sampling (mirrors scripts/phase0_sample.py exactly, incl. raw-date sort) ──
function sampleArticles() {
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"));
  const rows = files.map((file) => {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf-8");
    const fmMatch = raw.match(/^---\n(.*?)\n---\n/s);
    let date = "";
    if (fmMatch) {
      const line = fmMatch[1]
        .split("\n")
        .find((l) => l.startsWith("published_date:"));
      if (line) date = line.replace(/^published_date:\s*/, "").replace(/"/g, "").trim();
    }
    return { date, slug: file.replace(/\.md$/, "") };
  });
  rows.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.slug < b.slug ? -1 : 1));
  const step = rows.length / N_ARTICLES;
  return Array.from({ length: N_ARTICLES }, (_, i) => rows[Math.floor(i * step)]);
}

function sampleFacilities(): any[] {
  const rec = JSON.parse(fs.readFileSync(DIRECTORY, "utf-8"));
  const fac = rec.facilities;
  const step = fac.length / N_FACILITIES;
  return Array.from({ length: N_FACILITIES }, (_, i) => fac[Math.floor(i * step)]);
}

// ── TypeSafe call ────────────────────────────────────────────────────────
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
      await new Promise((r) => setTimeout(r, (ra ? ra * 1000 : attempt * 2000)));
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

// ── main ─────────────────────────────────────────────────────────────────
async function main() {
  const key = loadKey();
  const artRows = sampleArticles();
  const facRows = sampleFacilities();
  console.log(`Sample: ${artRows.length} articles, ${facRows.length} facilities. Model: ${TYPESAFE_MODEL}\n`);

  const errors: string[] = [];

  // Articles
  const artResults = await pool(artRows, CONCURRENCY, (row) => {
    const filePath = path.join(ARTICLES_DIR, `${row.slug}.md`);
    const { data: fm, content } = matter(fs.readFileSync(filePath, "utf-8"));
    const state = {
      title: fm.title,
      meta_description: fm.meta_description,
      body: content.slice(0, BODY_CAP),
    };
    return ask(key, state, ARTICLE_QUESTIONS)
      .then((r) => ({ slug: row.slug, truthCluster: fm.cluster ?? "", ok: true, r }))
      .catch((e) => {
        errors.push(`article ${row.slug}: ${e.message}`);
        return { slug: row.slug, truthCluster: fm.cluster ?? "", ok: false, e: e.message } as any;
      });
  });

  // Facilities (strip fields that would leak the labels we test against)
  const facResults = await pool(facRows, CONCURRENCY, (f) => {
    const leak: Record<string, unknown> = { facilityType: 1, dataConfidence: 1 };
    const state: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(f)) if (!(k in leak)) state[k] = v;
    return ask(key, state, FACILITY_QUESTIONS)
      .then((r) => ({ name: f.name, truthType: f.facilityType ?? "", ok: true, r }))
      .catch((e) => {
        errors.push(`facility ${f.name}: ${e.message}`);
        return { name: f.name, truthType: f.facilityType ?? "", ok: false, e: e.message } as any;
      });
  });

  // ── metrics ────────────────────────────────────────────────────────────
  const pct = (n: number, d: number) => (d === 0 ? null : Math.round((n / d) * 1000) / 10);
  const lat = artResults.concat(facResults).filter((r) => r.ok).map((r) => r.r._latencyMs as number);
  const tokIn = artResults.concat(facResults).filter((r) => r.ok)
    .reduce((s, r) => s + ((r.r.usage?.input_tokens as number) ?? 0), 0);

  // topic
  const topicRows = artResults.filter((r) => r.ok);
  const topicHit = topicRows.filter((r) => r.r.answers?.topic?.choice === r.truthCluster);
  const topicReview = topicRows.filter((r) => (r.r.answers?.topic?.confidence ?? 0) < CONFIDENCE_MIN_AUTO);

  // kenya relevance (agent labels)
  let kenyaCovered = 0, kenyaFP = 0, kenyaFN = 0, kenyaTP = 0, kenyaTN = 0;
  const kenyaDetail: any[] = [];
  for (const r of topicRows) {
    const lab = LABELS.articles[r.slug]?.kenya;
    if (lab === undefined || lab === null) continue;
    kenyaCovered++;
    const p = r.r.answers?.kenya_relevance?.noul as number | undefined;
    if (p === undefined) continue;
    const pred = p >= 0.5;
    if (pred && lab) kenyaTP++; else if (pred && !lab) kenyaFP++; else if (!pred && !lab) kenyaTN++; else kenyaFN++;
    kenyaDetail.push({ slug: r.slug, label: lab, noul: p });
  }

  // depth (agent labels, within-1 tolerance)
  let depthCovered = 0, depthExact = 0, depthWithin1 = 0;
  const depthDetail: any[] = [];
  for (const r of topicRows) {
    const lab = LABELS.articles[r.slug]?.depth;
    const s = r.r.answers?.depth?.score;
    if (lab === undefined || s === undefined) continue;
    depthCovered++;
    const pred = Math.round(s);
    if (pred === lab) depthExact++;
    if (Math.abs(pred - lab) <= 1) depthWithin1++;
    depthDetail.push({ slug: r.slug, label: lab, score: s, pred });
  }

  // facility type
  const facOk = facResults.filter((r) => r.ok);
  const facTypeRows = facOk.map((r) => ({
    name: r.name,
    truth: FACILITY_TYPE_MAP[r.truthType] ?? "other",
    pred: r.r.answers?.facility_type?.choice as string | undefined,
    conf: r.r.answers?.facility_type?.confidence as number | undefined,
  }));
  const facTypeHit = facTypeRows.filter((r) => r.pred === r.truth);
  const facTypeReview = facTypeRows.filter((r) => (r.conf ?? 0) < CONFIDENCE_MIN_AUTO);

  // evidence support (agent labels + noul bands)
  const evRows = facOk.map((r) => {
    const lab = LABELS.facilities[r.name]?.evidence;
    const p = r.r.answers?.evidence_support?.noul as number | undefined;
    const band = p === undefined ? undefined : p >= NOUL_VERIFIED_MIN ? "verified" : p < NOUL_UNSUPPORTED_MAX ? "unsupported" : "review";
    return { name: r.name, label: lab, noul: p, band };
  });
  const evCovered = evRows.filter((r) => r.label !== undefined && r.noul !== undefined);
  const evAgree = evCovered.filter((r) => (r.noul >= 0.5) === r.label);
  const evTrueNeg = evCovered.filter((r) => !r.label && r.band === "unsupported");   // model agrees it's weak
  const evFalsePos = evCovered.filter((r) => !r.label && r.band === "verified");     // labeled weak but called supported
  const evFalseNeg = evCovered.filter((r) => r.label && r.band === "unsupported");   // labeled supported but called weak

  const mean = (a: number[]) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0);
  const p95 = (a: number[]) => (a.length ? a.slice().sort((x, y) => x - y)[Math.min(a.length - 1, Math.floor(a.length * 0.95))] : 0);

  const report = {
    runAt: new Date().toISOString(),
    model: TYPESAFE_MODEL,
    disclosure: "Ground-truth labels are agent-assigned pre-registered estimates; editorial authority is the site owner. Topic ground truth = each article's own frontmatter cluster.",
    thresholds: { CONFIDENCE_MIN_AUTO, NOUL_VERIFIED_MIN, NOUL_UNSUPPORTED_MAX },
    errors,
    metrics: {
      topic: { n: topicRows.length, accuracyPct: pct(topicHit.length, topicRows.length), reviewRatePct: pct(topicReview.length, topicRows.length), misses: topicRows.filter((r) => r.r.answers?.topic?.choice !== r.truthCluster).map((r) => ({ slug: r.slug, truth: r.truthCluster, pred: r.r.answers?.topic?.choice, conf: r.r.answers?.topic?.confidence })) },
      kenyaRelevance: { covered: kenyaCovered, TP: kenyaTP, TN: kenyaTN, FP: kenyaFP, FN: kenyaFN, detail: kenyaDetail },
      depth: { covered: depthCovered, exactPct: pct(depthExact, depthCovered), within1Pct: pct(depthWithin1, depthCovered), detail: depthDetail },
      facilityType: { n: facTypeRows.length, accuracyPct: pct(facTypeHit.length, facTypeRows.length), reviewRatePct: pct(facTypeReview.length, facTypeRows.length), rows: facTypeRows },
      evidenceSupport: { covered: evCovered.length, agreementPct: pct(evAgree.length, evCovered.length), trueNegatives: evTrueNeg.map((r) => r.name), falsePositives: evFalsePos.map((r) => r.name), falseNegatives: evFalseNeg.map((r) => r.name), rows: evRows },
      performance: { latencyMeanMs: Math.round(mean(lat)), latencyP95Ms: Math.round(p95(lat)), inputTokens: tokIn, costUsd: Math.round(((tokIn / 1e6) * PRICE_PER_MTOK_INPUT) * 1e4) / 1e4 },
    },
    raw: { articles: artResults, facilities: facResults },
  };
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  // ── console summary ────────────────────────────────────────────────────
  console.log("== TOPIC (truth = frontmatter cluster) ==");
  console.log(`accuracy ${pct(topicHit.length, topicRows.length)}%  review-rate ${pct(topicReview.length, topicRows.length)}%`);
  for (const m of report.metrics.topic.misses) console.log(`  miss: ${m.slug}  truth=${m.truth} pred=${m.pred} conf=${m.conf}`);
  console.log("\n== KENYA RELEVANCE (agent labels) ==");
  console.log(`TP=${kenyaTP} TN=${kenyaTN} FP=${kenyaFP} FN=${kenyaFN} (covered ${kenyaCovered})`);
  console.log("\n== DEPTH (agent labels) ==");
  console.log(`exact ${report.metrics.depth.exactPct}%  within-1 ${report.metrics.depth.within1Pct}% (covered ${depthCovered})`);
  console.log("\n== FACILITY TYPE (truth = record field via map) ==");
  console.log(`accuracy ${report.metrics.facilityType.accuracyPct}%  review-rate ${report.metrics.facilityType.reviewRatePct}%`);
  for (const r of facTypeRows) if (r.pred !== r.truth) console.log(`  miss: ${r.name}  truth=${r.truth} pred=${r.pred} conf=${r.conf}`);
  console.log("\n== EVIDENCE SUPPORT (agent labels, noul bands) ==");
  console.log(`agreement ${report.metrics.evidenceSupport.agreementPct}% (covered ${evCovered.length})`);
  for (const r of evRows) console.log(`  ${r.name}: label=${r.label} noul=${r.noul} band=${r.band}`);
  console.log("\n== PERFORMANCE ==");
  console.log(`latency mean ${report.metrics.performance.latencyMeanMs}ms / p95 ${report.metrics.performance.latencyP95Ms}ms`);
  console.log(`input tokens ${tokIn}  cost $${report.metrics.performance.costUsd}`);
  if (errors.length) console.log(`\nERRORS (${errors.length}):`, errors.join(" | "));
  console.log(`\nReport saved: ${REPORT_PATH}`);
}

main().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
