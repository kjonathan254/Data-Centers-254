#!/usr/bin/env node
/**
 * firecrawl_capture.mjs - Evidence Engine source CAPTURE (machine step).
 *
 * Usage:
 *   node scripts/firecrawl_capture.mjs <url> [--tier 1|2|3] [--claims KE-ODPC-01,TZ-EW-02] [--note "..."]
 *
 * 1. POST Firecrawl v2 /scrape (markdown, onlyMainContent) - handles public PDFs too
 * 2. Writes research/captures/<YYYY-MM-DD>-<slug>.md with provenance front matter
 * 3. Status stays "capture-pending" until an EDITOR verifies the content
 *
 * humanGate: machine capture is evidence, never verification.
 * Requires FIRECRAWL_API_KEY in env or .env.local (gitignored; never commit keys).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

function loadKey() {
  if (process.env.FIRECRAWL_API_KEY) return process.env.FIRECRAWL_API_KEY;
  const envLocal = fileURLToPath(new URL("../.env.local", import.meta.url));
  if (existsSync(envLocal)) {
    for (const line of readFileSync(envLocal, "utf8").split("\n")) {
      const m = line.match(/^\s*FIRECRAWL_API_KEY\s*=\s*(\S+)\s*$/);
      if (m) return m[1];
    }
  }
  return null;
}

const KEY = loadKey();
if (!KEY) {
  console.error("FIRECRAWL_API_KEY missing. Add it to .env.local (never commit it).");
  process.exit(1);
}

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith("--"));
if (!url || !/^https?:\/\//i.test(url)) {
  console.error("Usage: node scripts/firecrawl_capture.mjs <url> [--tier 1|2|3] [--claims id,id] [--note \"...\"] [--wait ms]");
  process.exit(1);
}
const opt = (flag, def = "") => {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : def;
};
const tier = opt("--tier", "2");
const waitMs = parseInt(opt("--wait", "0"), 10) || 0;
const claims = opt("--claims")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const note = opt("--note");

console.log(`Scraping: ${url}`);
const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
  method: "POST",
  headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    url,
    formats: ["markdown"],
    onlyMainContent: true,
    timeout: 90000,
    ...(waitMs ? { waitFor: waitMs } : {}),
  }),
});

if (!res.ok) {
  console.error(`Firecrawl /scrape failed: ${res.status} ${res.statusText}`);
  console.error((await res.text()).slice(0, 500));
  process.exit(1);
}

const json = await res.json();
const data = json?.data;
const md = data?.markdown || "";
if (!md.trim()) {
  console.error("Empty markdown returned. The page may need JS interaction (use interact) or block scraping.");
  process.exit(1);
}

const meta = data.metadata || {};
const capturedAt = new Date().toISOString();
const slug = new URL(meta.sourceURL || url).hostname.replace(/^www\./, "") +
  "-" +
  (new URL(meta.sourceURL || url).pathname.replace(/\//g, "-").replace(/^-+|-+$/g, "").slice(0, 50) || "root");
const fileSlug = `${capturedAt.slice(0, 10)}-${slug}`.replace(/[^a-z0-9-]/gi, "-").replace(/-{2,}/g, "-");

const fm = [
  "---",
  `captured_at: ${capturedAt}`,
  `source_url: ${url}`,
  `final_url: ${meta.sourceURL || url}`,
  `title: ${(meta.title || "(untitled)").replace(/"/g, "'")}`,
  `tool: firecrawl-v2 POST /scrape (markdown, onlyMainContent${waitMs ? `, waitFor ${waitMs}ms` : ""})`,
  `http_status: ${meta.statusCode || "n/a"}`,
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

const bytes = (await import("node:fs")).statSync(outPath).size;
console.log(`\nCaptured -> research/captures/${fileSlug}.md (${(bytes / 1024).toFixed(0)} KB)`);
console.log(`Title: ${meta.title || "(untitled)"}`);
console.log(`Claims linked: ${claims.join(", ") || "(none)"}`);
console.log(`Tier: ${tier}`);
console.log("\nREMINDER (humanGate): status=capture-pending. An editor must verify the content");
console.log("before any claim upgrades. Register the capture in src/data/policy/ and re-run the validator.");
