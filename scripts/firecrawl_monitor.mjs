#!/usr/bin/env node
/**
 * firecrawl_monitor.mjs - Evidence drift monitor for DataCentre254 Policy Intelligence.
 *
 * Zero-dependency (no npm installs - keep function bundles lean; see Task 39 storage incident).
 *
 * What it does:
 *   1. Builds the watchlist from src/data/policy/policy-claims-2026-Q3.json:
 *      every Tier-1 source with captureStatus == "captured".
 *   2. Re-scrapes each URL via Firecrawl v2 (markdown, onlyMainContent).
 *   3. Compares normalized text against the capture file referenced in captureNote.
 *   4. Writes a drift report to research/monitor/report-<date>.md and prints a summary.
 *
 * Drift verdicts:
 *   ok              normalized word-overlap >= 98%
 *   minor-diff      overlap >= 90% (probably boilerplate/ads; human glance)
 *   CONTENT DRIFT   overlap < 90%  -> the source text changed materially
 *   fetch-failed    scrape error (page moved, token expired, rate limit)
 *   no-capture-ref  source has no research/captures path in captureNote (skipped)
 *
 * Exit codes: 0 = no CONTENT DRIFT; 1 = at least one CONTENT DRIFT (CI attention signal).
 *
 * Usage:
 *   node scripts/firecrawl_monitor.mjs                 # full watchlist
 *   node scripts/firecrawl_monitor.mjs --url URL       # single URL check
 *   node scripts/firecrawl_monitor.mjs --max 5         # cap requests (smoke test)
 *   node scripts/firecrawl_monitor.mjs --threshold 90  # custom DRIFT threshold
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DATASET = resolve(ROOT, "src/data/policy/policy-claims-2026-Q3.json");
const CAPTURES = resolve(ROOT, "research/captures");
const MONITOR_DIR = resolve(ROOT, "research/monitor");

// ---- args
const argv = process.argv.slice(2);
const arg = (name, dflt) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : dflt;
};
const has = (name) => argv.includes(`--${name}`);
const ONLY_URL = has("url") ? arg("url") : null;
const MAX = parseInt(arg("max", "1000"), 10);
const DRIFT_BELOW = parseFloat(arg("threshold", "90"));
const MINOR_BELOW = parseFloat(arg("minor", "98"));

// ---- key
function loadKey() {
  if (process.env.FIRECRAWL_API_KEY) return process.env.FIRECRAWL_API_KEY;
  const envLocal = readFileSync(resolve(ROOT, ".env.local"), "utf8");
  const m = envLocal.match(/^FIRECRAWL_API_KEY=(.+)$/m);
  if (m) return m[1].trim();
  console.error("FIRECRAWL_API_KEY missing (env or .env.local).");
  process.exit(2);
}

// ---- watchlist from the dataset (auto-syncs with policy data)
function captureIndexByUrl() {
  // fallback lookup: capture-file front matter (source_url / final_url) -> file path
  const idx = new Map();
  if (!existsSync(CAPTURES)) return idx;
  for (const f of readdirSync(CAPTURES)) {
    if (!f.endsWith(".md")) continue;
    const p = resolve(CAPTURES, f);
    const head = readFileSync(p, "utf8").slice(0, 800);
    const m = head.match(/^(?:source|final)_url:\s*(.+)$/m);
    if (m) idx.set(m[1].trim(), `research/captures/${f}`);
  }
  return idx;
}

function watchlist() {
  const d = JSON.parse(readFileSync(DATASET, "utf8"));
  const byUrl = captureIndexByUrl();
  const list = [];
  for (const [id, s] of Object.entries(d.sources || {})) {
    if (s.tier !== 1 || s.captureStatus !== "captured") continue;
    const cap =
      (s.captureNote || "").match(/research\/captures\/([\w.\-]+\.md)/) ||
      (byUrl.get(s.url) ? [null, byUrl.get(s.url).split("/").pop()] : null);
    list.push({
      id,
      url: s.url,
      capture: cap ? resolve(CAPTURES, cap[1]) : null,
      captureRel: cap ? `research/captures/${cap[1]}` : null,
    });
  }
  return list;
}

// ---- firecrawl v2 scrape (same shape as firecrawl_capture.mjs) + 429 backoff
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function scrape(key, url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ url, formats: ["markdown"], onlyMainContent: true }),
    });
    if (res.status === 429) {
      await sleep(8000 * (attempt + 1)); // rate limited - back off and retry
      continue;
    }
    if (!res.ok) return { error: `HTTP ${res.status}` };
    const j = await res.json();
    const md = j?.data?.markdown;
    if (!md) return { error: "no markdown in response" };
    return { md };
  }
  return { error: "HTTP 429 after 3 attempts" };
}

// ---- normalization + word-overlap similarity (multiset Jaccard on words)
function normalize(t) {
  return t
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> text
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();
}
function wordBag(t) {
  const bag = new Map();
  for (const w of t.split(/\s+/)) {
    if (w.length < 2) continue; // ignore noise tokens
    bag.set(w, (bag.get(w) || 0) + 1);
  }
  return bag;
}
function overlap(a, b) {
  const A = wordBag(a), B = wordBag(b);
  let inter = 0, union = 0;
  for (const [w, n] of A) { union += n; const m = B.get(w); if (m) inter += Math.min(n, m); }
  for (const [w, n] of B) { if (!A.has(w)) union += n; }
  return union === 0 ? 100 : (100 * inter) / union;
}
function stripFrontMatter(t) {
  return t.replace(/^---\n[\s\S]*?\n---\n/, "");
}

// ---- main
const key = loadKey();
const list = watchlist();
const targets = ONLY_URL ? list.filter((t) => t.url === ONLY_URL) : list;
const runList = targets.length ? targets : (ONLY_URL ? [{ id: "ad-hoc", url: ONLY_URL, capture: null, captureRel: null }] : list);

console.log(`Monitor watchlist: ${runList.length} URL(s) (dataset T1 captured sources: ${list.length})`);
mkdirSync(MONITOR_DIR, { recursive: true });

const results = [];
let drift = 0;
for (const t of runList.slice(0, MAX)) {
  let verdict = "no-capture-ref", sim = null;
  const r = await scrape(key, t.url);
  if (r.error) {
    verdict = "fetch-failed";
    results.push({ ...t, verdict, detail: r.error });
    console.log(`  [${verdict}] ${t.id}: ${r.error}`);
  } else if (!t.capture || !existsSync(t.capture)) {
    results.push({ ...t, verdict, detail: t.capture ? "capture file missing" : "no capture ref in captureNote" });
    console.log(`  [${verdict}] ${t.id}`);
  } else {
    const oldText = normalize(stripFrontMatter(readFileSync(t.capture, "utf8")));
    sim = overlap(oldText, normalize(r.md));
    verdict = sim >= MINOR_BELOW ? "ok" : sim >= DRIFT_BELOW ? "minor-diff" : "CONTENT DRIFT";
    if (verdict === "CONTENT DRIFT") drift++;
    results.push({ ...t, verdict, similarity: sim });
    console.log(`  [${verdict}] ${t.id} overlap=${sim.toFixed(1)}%`);
  }
  await new Promise((res) => setTimeout(res, 800)); // throttle
}

// ---- report
const date = new Date().toISOString().slice(0, 10);
const lines = [
  `# Evidence drift report - ${date} (UTC)`,
  "",
  `Watchlist: ${runList.length} | ok: ${results.filter(r=>r.verdict==="ok").length} | minor-diff: ${results.filter(r=>r.verdict==="minor-diff").length} | CONTENT DRIFT: ${results.filter(r=>r.verdict==="CONTENT DRIFT").length} | fetch-failed: ${results.filter(r=>r.verdict==="fetch-failed").length}`,
  "",
  "| source | verdict | overlap | capture |",
  "|---|---|---|---|",
  ...results.map((r) =>
    `| ${r.id} | ${r.verdict} | ${r.similarity == null ? "-" : r.similarity.toFixed(1) + "%"} | ${r.captureRel || "-"} |`
  ),
  "",
  "CONTENT DRIFT = re-scraped text diverges materially from the stored capture.",
  "Editor action: re-capture (scripts/firecrawl_capture.mjs), then review the claim note for staleness.",
  "Note: this file is generated by scripts/firecrawl_monitor.mjs and is not itself evidence.",
];
const reportPath = resolve(MONITOR_DIR, `report-${date}.md`);
writeFileSync(reportPath, lines.join("\n") + "\n");
console.log(`\nReport: research/monitor/report-${date}.md`);

if (drift > 0) {
  console.log(`RESULT: ${drift} CONTENT DRIFT source(s) - review needed`);
  process.exit(1);
}
console.log("RESULT: no content drift");
