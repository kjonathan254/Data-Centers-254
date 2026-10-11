/**
 * Generate public/llms-full.txt at build time — the expanded companion to the
 * hand-maintained public/llms.txt.
 *
 * Why (tech-debt audit + claude-seo technical audit, 2026-10-11): llms.txt
 * passed the Lighthouse rules but its documented expanded sibling
 * /llms-full.txt returned 404. The llms.txt community spec (llmstxt.org)
 * defines llms-full.txt as the full-content version that AI agents fetch when
 * they want the whole corpus in one document. DC254's stated ambition is to
 * be citable by AI answer engines, so publishing the full corpus is a direct
 * GEO win: 109 researched articles, machine-readable, one fetch.
 *
 * Shape (llmstxt.org "expanded" pattern):
 *   # site title + one-line description
 *   ## <article title>
 *   URL, cluster, dates, meta description, then the full markdown body.
 *
 * Deterministic: output depends only on content/articles/ so the file is
 * byte-identical across rebuilds of the same tree (no timestamps).
 *
 * Run automatically by `npm run build` (wired in package.json before
 * `next build`). Cost: ~2.3 MB static file, served from the CDN edge.
 */
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import matter from "gray-matter";

const root = process.cwd();
const articlesDir = join(root, "content", "articles");
const outPath = join(root, "public", "llms-full.txt");

const SITE = "https://data-centers-254.vercel.app";

const files = readdirSync(articlesDir)
  .filter((f) => f.endsWith(".md"))
  .sort();

const sections = [];
for (const f of files) {
  const raw = readFileSync(join(articlesDir, f), "utf8");
  const { data, content } = matter(raw);
  const slug = (data.slug || f.replace(/\.md$/, "")).trim();
  const title = (data.title || slug).trim();
  const lines = [];
  lines.push(`## ${title}`);
  lines.push("");
  lines.push(`URL: ${SITE}/articles/${slug}`);
  if (data.category) lines.push(`Cluster: ${String(data.category).trim()}`);
  if (data.published_date) lines.push(`Published: ${String(data.published_date).trim()}`);
  if (data.updated_date) lines.push(`Updated: ${String(data.updated_date).trim()}`);
  if (data.meta_description) lines.push(`Summary: ${String(data.meta_description).trim()}`);
  lines.push("");
  lines.push(content.trim());
  lines.push("");
  sections.push(lines.join("\n"));
}

const header = [
  `# ${"Data Centre 254 (DC254)"}`,
  "",
  "> Full-content edition of public/llms.txt: every DC254 article as clean markdown. An independent Kenyan educational and research platform explaining the physical infrastructure behind Kenya's digital economy - data centres, connectivity, power, AI, and the systems that make the digital world work. Published from Nairobi, Kenya.",
  "",
  `${sections.length} articles follow, one "## " section each. The curated index of key pages lives at ${SITE}/llms.txt; per-article HTML at ${SITE}/articles/<slug>; RSS at ${SITE}/feed.xml.`,
  "",
].join("\n");

writeFileSync(outPath, header + sections.join("\n"), "utf8");
console.log(
  `generate_llms_full: ${sections.length} articles -> public/llms-full.txt`
);
