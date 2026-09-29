#!/usr/bin/env node
/**
 * OG image pipeline — build-time 1200x630 JPEG derivatives (Task 65).
 *
 * Problem (senior-engineer audit, Task 62, deferred item): 104/105 og_images
 * were webp files with non-canonical dimensions. WhatsApp, LinkedIn, Facebook
 * and X mis-render (or drop) webp og:image payloads and crop arbitrarily when
 * dimensions are not 1200x630, so link previews were unreliable site-wide.
 *
 * Fix: generate a 1200x630 JPEG derivative for every image referenced as an
 * og:image source, at BUILD time, into public/og/ (gitignored — derivatives
 * are build artifacts, never committed, keeping repo weight flat per the
 * Vercel storage incident). Metadata points at /og/<stem>.jpg via
 * src/lib/og-image.ts. sharp is consumed as Next's own optional dependency
 * (zero new dependencies, standing rule 5).
 *
 * Sources (union):
 *   1. content/articles/*.md frontmatter og_image (quoted or unquoted YAML)
 *   2. src/data/directory/current.json facility heroImage values
 *   3. PAGE_SOURCES below — images referenced by page-level openGraph blocks
 *
 * Fail-open: if sharp cannot load, exits 0 with a warning and og-image.ts
 * falls back to the original paths (builds never break).
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
const OUT_DIR = join(PUBLIC, "og");
const SIZE = { width: 1200, height: 630 };

// Page-level openGraph images (page.tsx metadata blocks). Keep in sync with
// src/app/**/page.tsx metadata. og-default.png is intentionally absent:
// it is already a compliant 1200x630 PNG.
const PAGE_SOURCES = [
  "/images/africa-dc-map.webp",                     // directory, tracker, compare + facility fallback
  "/images/nairobi-skyline.webp",                   // /kenya
  "/images/kenya-transmission-pylons-3.webp",       // /tracker/power
  "/images/national-assembly-chamber-session.webp", // /tracker/licensing
  "/images/limuru-campus-aerial-solar.webp",        // research reports + facility heroImage
  "/images/dc-gpu-cluster.webp",                    // /beginners
  "/images/og-infrastructure-map.webp",             // /infrastructure/map
  "/images/nbo2-launch-ribbon-cutting.webp",        // /infrastructure
  "/images/east-africa-data-centre-aerial.webp",    // /articles index
  "/images/mombasa-cable-landing-4.webp",           // /tracker/cables
  "/images/dc-cooling-crac.webp",                   // /data-centres
  "/images/ai-gpu-servers.webp",                    // /ai
  "/images/kenya-geothermal-plant.webp",            // /energy
  "/images/founder-photo.webp",                     // /about
  "/images/policy-intelligence-hero.webp",          // /policy + /policy/intelligence
  "/images/rack-report-cover.png",                  // /rack-report
];

// Crop focus overrides for images whose subject sits off-centre. Mirrors
// src/lib/image-focus.ts (CSS object-position semantics); a vertical bias in
// the top half maps to sharp's "top" gravity so heads survive the crop.
const FOCUS = {
  "/images/tanui-ps-konza-podium.webp": "top",
  "/images/tanui-ps-konza-address.webp": "top",
};

const t0 = Date.now();
const sources = new Map(); // public path -> origin note

function addSource(p, note) {
  if (!p) return;
  const clean = String(p).trim();
  if (!clean.startsWith("/images/")) return;
  if (clean === "/images/og-default.png") return; // already compliant
  if (!sources.has(clean)) sources.set(clean, note);
}

// 1. article frontmatter og_image (quoted or unquoted YAML)
const articlesDir = join(ROOT, "content", "articles");
for (const f of readdirSync(articlesDir)) {
  if (!f.endsWith(".md")) continue;
  const fm = readFileSync(join(articlesDir, f), "utf8").split(/^---$/m)[1] || "";
  const m = fm.match(/^og_image:\s*(.+)$/m);
  if (m) addSource(m[1].trim().replace(/^["']|["']$/g, ""), `article:${f}`);
}

// 2. facility heroImage from the directory dataset
try {
  const dir = JSON.parse(readFileSync(join(ROOT, "src", "data", "directory", "current.json"), "utf8"));
  (function walk(node) {
    if (Array.isArray(node)) return node.forEach(walk);
    if (node && typeof node === "object") {
      if (typeof node.heroImage === "string") addSource(node.heroImage, "directory:heroImage");
      Object.values(node).forEach(walk);
    }
  })(dir);
} catch {
  /* directory dataset optional for this pipeline */
}

// 3. page-level metadata images
for (const p of PAGE_SOURCES) addSource(p, "page-metadata");

// Collision guard: two source files differing only in extension (foo.webp vs
// foo.jpg) would both map to /og/foo.jpg — fail loudly instead of clobbering.
const stemOf = new Map(); // public path -> output stem
const stemOwners = new Map(); // output stem -> public path
for (const p of sources.keys()) {
  const stem = basename(p, extname(p));
  if (stemOwners.has(stem) && stemOwners.get(stem) !== p) {
    console.error(`generate_og_images: stem collision ${stemOwners.get(stem)} vs ${p} -> both map to /og/${stem}.jpg`);
    process.exit(1);
  }
  stemOwners.set(stem, p);
  stemOf.set(p, stem);
}

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch (err) {
  console.warn(`generate_og_images: sharp unavailable (${err?.message || err}) — skipping, metadata falls back to source images`);
  process.exit(0);
}

mkdirSync(OUT_DIR, { recursive: true });

let generated = 0;
let fresh = 0;
let missing = 0;
for (const [p, note] of sources) {
  const src = join(PUBLIC, p.replace(/^\//, ""));
  if (!existsSync(src)) {
    console.warn(`generate_og_images: missing source ${p} (${note})`);
    missing++;
    continue;
  }
  const stem = stemOf.get(p);
  const out = join(OUT_DIR, `${stem}.jpg`);
  if (existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs) {
    fresh++;
    continue;
  }
  const position = FOCUS[p] || "centre";
  await sharp(src)
    .rotate()
    .resize(SIZE.width, SIZE.height, { fit: "cover", position })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);
  generated++;
}

console.log(
  `generate_og_images: ${sources.size} sources -> ${generated} generated, ${fresh} up-to-date, ${missing} missing (${Date.now() - t0}ms)`,
);
