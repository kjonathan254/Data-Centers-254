#!/usr/bin/env node
/**
 * contextdev_capture.mjs - Evidence Engine source CAPTURE via Context.dev
 * (machine step, human decides). Firecrawl-free path while Firecrawl is 402.
 *
 * Usage:
 *   node scripts/contextdev_capture.mjs <url> [--tier 1|2|3] [--claims KE-ODPC-01,TZ-EW-02] [--note "..."]
 *
 * 1. POST Context.dev /v1/web/scrape (markdown; handles public PDFs, +1 credit
 *    per OCR-recovered page — born-digital PDFs cost the flat 1 credit)
 * 2. Writes research/captures/<YYYY-MM-DD>-<slug>.md with provenance front matter
 * 3. Status stays "capture-pending" until an EDITOR verifies the content
 *
 * humanGate: machine capture is evidence, never verification.
 * Requires CONTEXT_DEV_API_KEY in env or .env.local (gitignored; never commit keys).
 * Docs: https://docs.context.dev/api-reference/web-scraping/scrape
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

function loadKey() {
  if (process.env.CONTEXT_DEV_API_KEY) return process.env.CONTEXT_DEV_API_KEY;
  const envLocal = fileURLToPath(new URL("../.env.local", import.meta.url));
  if (existsSync(envLocal)) {
    for (const line of readFileSync(envLocal, "utf8").split("\n")) {
      const m = line.match(/^\s*CONTEXT_DEV_API_KEY\s*=\s*(\S+)\s*$/);
      if (m) return m[1];
    }
  }
  return null;
}

const KEY = loadKey();
if (!KEY) {
  console.error("CONTEXT_DEV_API_KEY missing. Add it to .env.local (never commit it).");
  process.exit(1);
}

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith("--"));
if (!url || !/^https?:\/\//i.test(url)) {
  console.error('Usage: node scripts/contextdev_capture.mjs <url> [--tier 1|2|3] [--claims id,id] [--note "..."]');
  process.exit(1);
}
const opt = (flag, def = "") => {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : def;
};
const tier = opt("--tier", "2");
const claims = opt("--claims")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const note = opt("--note");

console.log(`Scraping: ${url}`);
const res = await fetch("https://api.context.dev/v1/web/scrape", {
  method: "POST",
  headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
  body: JSON.stringify({ url, formats: { markdown: true }, maxAgeMs: 0 }),
});

if (!res.ok) {
  console.error(`Context.dev /scrape failed: HTTP ${res.status}`);
  console.error((await res.text()).slice(0, 500));
  process.exit(1);
}

const json = await res.json();
const md = json?.markdown?.data || "";
if (!md.trim()) {
  console.error("Empty markdown returned (markdown output envelope: " + JSON.stringify(json?.markdown ?? null) + ").");
  process.exit(1);
}

const capturedAt = new Date().toISOString();
const u = new URL(url);
const slug =
  u.hostname.replace(/^www\./, "") +
  "-" +
  (u.pathname.replace(/\//g, "-").replace(/^-+|-+$/g, "").slice(0, 50) || "root");
const fileSlug = `${capturedAt.slice(0, 10)}-${slug}`.replace(/[^a-z0-9-]/gi, "-").replace(/-{2,}/g, "-");

const fm = [
  "---",
  `captured_at: ${capturedAt}`,
  `source_url: ${url}`,
  `final_url: ${json?.url || url}`,
  `title: ${String(json?.metadata?.title || "(untitled)").replace(/"/g, "'")}`,
  `tool: context.dev POST /v1/web/scrape (markdown, maxAgeMs=0)`,
  `http_status: ${res.status}`,
  `tier: ${tier}`,
  `claims: [${claims.join(", ")}]`,
  `status: capture-pending # becomes verified ONLY after an editor reads and confirms content`,
  note ? `note: ${note.replace(/"/g, "'")}` : null,
  "---",
  "",
].filter((l) => l !== null);

const outDir = fileURLToPath(new URL("../research/captures/", import.meta.url));
mkdirSync(outDir, { recursive: true });
const outPath = `${outDir}${fileSlug}.md`;
writeFileSync(outPath, `${fm.join("\n")}\n${md}\n`);

console.log(`\nCaptured -> research/captures/${fileSlug}.md (${(statSync(outPath).size / 1024).toFixed(0)} KB)`);
console.log(`Claims linked: ${claims.join(", ") || "(none)"}`);
console.log(`Tier: ${tier}`);
console.log("\nREMINDER (humanGate): status=capture-pending. An editor must verify the content");
console.log("before any claim upgrades. Register the capture in src/data/policy/ and re-run the validator.");
