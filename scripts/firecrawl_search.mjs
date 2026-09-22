#!/usr/bin/env node
/**
 * firecrawl_search.mjs - Evidence Engine source DISCOVERY (machine step, human decides).
 *
 * Usage:
 *   node scripts/firecrawl_search.mjs "query text" [--limit 6]
 *
 * Requires FIRECRAWL_API_KEY in env or .env.local (gitignored; never commit keys).
 * Calls Firecrawl v2 POST /search and prints numbered candidates (title - url - snippet).
 * It NEVER auto-captures: the editor picks targets, then runs firecrawl_capture.mjs.
 * humanGate: AI proposes, editor disposes.
 */
import { readFileSync, existsSync } from "node:fs";
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
const query = args.find((a) => !a.startsWith("--"));
const limitIdx = args.indexOf("--limit");
const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) || 6 : 6;

if (!query) {
  console.error('Usage: node scripts/firecrawl_search.mjs "query" [--limit 6]');
  process.exit(1);
}

const res = await fetch("https://api.firecrawl.dev/v2/search", {
  method: "POST",
  headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
  body: JSON.stringify({ query, limit }),
});

if (!res.ok) {
  console.error(`Firecrawl /search failed: ${res.status} ${res.statusText}`);
  console.error((await res.text()).slice(0, 500));
  process.exit(1);
}

const json = await res.json();
const items = json?.data?.web || (Array.isArray(json?.data) ? json.data : []);

if (!items.length) {
  console.log("No results. Try a narrower query.");
  process.exit(0);
}

console.log(`Query: "${query}"  (${items.length} results)\n`);
items.forEach((it, i) => {
  console.log(`${i + 1}. ${it.title || "(untitled)"}`);
  console.log(`   ${it.url}`);
  if (it.description) console.log(`   ${String(it.description).slice(0, 220)}`);
  console.log("");
});
console.log("Pick Tier-1/2 targets manually, then: node scripts/firecrawl_capture.mjs <url> --tier 1 --claims <IDs>");
