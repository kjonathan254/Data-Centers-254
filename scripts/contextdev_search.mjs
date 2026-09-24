#!/usr/bin/env node
/**
 * contextdev_search.mjs - Evidence Engine source DISCOVERY via Context.dev
 * (machine step, human decides). Firecrawl replacement while Firecrawl credits
 * are exhausted (HTTP 402).
 *
 * Usage:
 *   node scripts/contextdev_search.mjs "query text" [--limit 10] [--freshness last_year]
 *
 * Requires CONTEXT_DEV_API_KEY in env or .env.local (gitignored; never commit keys).
 * Calls Context.dev POST /v1/web/search (1 credit per 10 results) and prints
 * numbered candidates (relevance - title - url - snippet).
 * It NEVER auto-captures: the editor picks targets, then a capture step reads
 * the full text. humanGate: AI proposes, editor disposes.
 *
 * Docs: https://docs.context.dev/api-reference/web-scraping/search
 */
import { readFileSync, existsSync } from "node:fs";
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
const query = args.find((a) => !a.startsWith("--"));
const limitIdx = args.indexOf("--limit");
// API minimum is 10 results (1 credit); we may print fewer.
const numResults = limitIdx >= 0 ? Math.min(Math.max(parseInt(args[limitIdx + 1], 10) || 10, 10), 100) : 10;
const freshIdx = args.indexOf("--freshness");
const freshness = freshIdx >= 0 ? args[freshIdx + 1] : undefined;

if (!query) {
  console.error('Usage: node scripts/contextdev_search.mjs "query" [--limit 10] [--freshness last_week]');
  process.exit(1);
}

const body = { query, numResults };
if (freshness) body.freshness = freshness;

const res = await fetch("https://api.context.dev/v1/web/search", {
  method: "POST",
  headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

if (!res.ok) {
  const detail = await res.text().catch(() => "");
  console.error(`Context.dev search failed: HTTP ${res.status} ${detail.slice(0, 400)}`);
  process.exit(1);
}

const json = await res.json();
const results = json.results ?? [];
if (!results.length) {
  console.error("No results.");
  process.exit(2);
}

console.log(`CANDIDATES (${results.length} of ${numResults} requested) — editor picks, humanGate applies:\n`);
results.forEach((r, i) => {
  console.log(`${i + 1}. relevance=${r.relevance ?? "?"} | ${r.title ?? "(untitled)"}`);
  console.log(`   ${r.url}`);
  if (r.description) console.log(`   ${String(r.description).slice(0, 220)}`);
});
console.log(`\nNext: editor selects a target, then read + capture the Tier-1 text (never upgrade from snippets).`);
