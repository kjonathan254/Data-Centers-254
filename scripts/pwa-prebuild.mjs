#!/usr/bin/env node
/**
 * PWA prebuild step — runs before `next build` (see package.json).
 *
 * Compiles scripts/sw-template.js to public/sw.js, embedding a per-build
 * stamp. Because the stamp changes on every build, the browser detects a
 * new service worker, installs it, and the activate handler purges the
 * previous build's page/asset caches. This is what makes stale-while-
 * revalidate safe: cached HTML can never outlive the static chunks it
 * references.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const templatePath = join(here, "sw-template.js");
const outPath = join(here, "..", "public", "sw.js");

const stamp = Date.now().toString(36);
const template = readFileSync(templatePath, "utf8");

if (!template.includes("__BUILD_STAMP__")) {
  console.error("pwa-prebuild: __BUILD_STAMP__ placeholder missing in sw-template.js");
  process.exit(1);
}

writeFileSync(outPath, template.replaceAll("__BUILD_STAMP__", stamp));
console.log(`pwa-prebuild: public/sw.js written (build stamp ${stamp})`);
