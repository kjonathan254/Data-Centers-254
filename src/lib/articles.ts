import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getClusterImage } from "@/lib/imagery";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ArticleImage {
  src: string;
  alt: string;
  caption?: string;
  position: "hero" | "section-break" | "inline" | "infographic" | "comparison" | "diagram";
}

export interface ArticleFaq {
  question: string;
  answer: string;
}

export interface InternalLink {
  text: string;
  href: string;
}

export interface ExternalSource {
  title: string;
  url: string;
}

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  meta_description: string;
  primary_keyword: string;
  secondary_keywords: string[];
  author: string;
  author_bio_link: string;
  published_date: string;
  updated_date: string;
  category: string;
  cluster: string;
  og_image: string;
  reading_time: string;
  images: ArticleImage[];
  internal_links: InternalLink[];
  external_sources: ExternalSource[];
  faq: ArticleFaq[];
  canonical_url?: string;
  /** Set false to keep the green New badge off a story regardless of publish date. */
  new?: boolean;
}

export interface Article {
  frontmatter: ArticleFrontmatter;
  content: string;
  // Derived fields
  headings: { id: string; text: string; level: number }[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

// CLUSTER_META (SEO audit: duplicate-definition drift risk) — single source
// of truth now lives in ./cluster-meta; re-exported below so existing
// importers of @/lib/articles keep working.

// ─── Heading extraction ─────────────────────────────────────────────────────

function extractHeadings(markdown: string) {
  const headings: { id: string; text: string; level: number }[] = [];
  const lines = markdown.split("\n");
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const text = match[2].replace(/\*\*/g, "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      headings.push({ id, text, level: match[1].length });
    }
  }
  return headings;
}

// ─── Freshness ─────────────────────────────────────────────────────────────

/** A story's freshness date: updated_date when it is later, else published. */
function freshnessDate(a: Article): Date {
  const p = new Date(a.frontmatter.published_date);
  const u = new Date(a.frontmatter.updated_date);
  return u > p ? u : p;
}

/** Newest first by freshness date, breaking ties on published date. */
function byFreshness(a: Article, b: Article): number {
  const diff = freshnessDate(b).getTime() - freshnessDate(a).getTime();
  if (diff !== 0) return diff;
  return (
    new Date(b.frontmatter.published_date).getTime() -
    new Date(a.frontmatter.published_date).getTime()
  );
}

/**
 * "New" badge window in hours. A story shows the green NEW badge in
 * listings while its published date is within this window. Evaluated at
 * build time, redeploy to refresh. Bump here if the editorial rule
 * changes.
 *
 * Editorial rule (15 Sep 2026): the badge keys off published_date ONLY.
 * Bumping updated_date refreshes listings order but must not re-badge
 * an old story as New, so updated stories stop wearing the badge the
 * day after their original publish date.
 */
export const FRESH_WINDOW_HOURS = 24;

export function isArticleFresh(a: Article, now: Date = new Date()): boolean {
  if (a.frontmatter.new === false) return false;
  const ageHours = 
    (now.getTime() - new Date(a.frontmatter.published_date).getTime()) /
    3_600_000;
  return ageHours <= FRESH_WINDOW_HOURS;
}

/**
 * The photograph that represents this article in cards and grids:
 * its own hero image when the frontmatter defines one, else its first
 * body image, else the cluster photograph as a last resort. Using the
 * article's own hero keeps listing pages visually distinct, every
 * card shows the story it links to, not the topic banner.
 */
export function getArticleHeroImage(
  a: Article
): { src: string; alt: string } {
  const hero =
    a.frontmatter.images.find((i) => i.position === "hero") ??
    a.frontmatter.images[0];
  if (hero) return { src: hero.src, alt: hero.alt };
  return getClusterImage(a.frontmatter.cluster);
}

// ─── Core: read a single article ─────────────────────────────────────────────

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    frontmatter: data as ArticleFrontmatter,
    content,
    headings: extractHeadings(content),
  };
}

// ─── Core: list all articles ─────────────────────────────────────────────

/**
 * Module-level parse cache (perf audit M8): getAllArticles() used to re-read
 * AND gray-matter-parse all 105 markdown files on every call — /api/search,
 * /api/articles and /api/chat (via chatbot knowledge) paid that cost per
 * request. The cache is keyed on a cheap directory signature (file count +
 * newest mtime), so dev-time edits still invalidate while production's
 * immutable filesystem hits the cache ~always.
 */
let articlesCache: { sig: string; articles: Article[] } | null = null;

function articlesDirSignature(): string {
  let latestMtime = 0;
  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".md"));
  for (const f of files) {
    const m = fs.statSync(path.join(ARTICLES_DIR, f)).mtimeMs;
    if (m > latestMtime) latestMtime = m;
  }
  return `${files.length}:${latestMtime}`;
}

export function getAllArticles(): Article[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  const sig = articlesDirSignature();
  if (articlesCache && articlesCache.sig === sig) return articlesCache.articles;

  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".md"));

  const articles = files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      return getArticleBySlug(slug);
    })
    .filter((a): a is Article => a !== null)
    .sort(byFreshness);

  articlesCache = { sig, articles };
  return articles;
}

// ─── Helpers: filtered views ─────────────────────────────────────────────────

export function getArticlesByCluster(cluster: string): Article[] {
  return getAllArticles().filter(
    (a) => (a.frontmatter.cluster ?? "").toLowerCase() === cluster.toLowerCase()
  );
}

export function getLatestArticles(limit = 3): Article[] {
  return getAllArticles().slice(0, limit);
}

export function getRelatedArticles(
  currentSlug: string,
  cluster: string,
  limit = 5
): Article[] {
  // Audit fix: related was same-cluster only, which orphaned pages whose
  // topic family spans clusters (e.g. security pages split Beginner/Kenya).
  // Cluster members still come first, freshest first; remaining slots fill
  // with the freshest site-wide so no page renders a short related list.
  const all = getAllArticles().filter((a) => a.frontmatter.slug !== currentSlug);
  const inCluster = all.filter(
    (a) => a.frontmatter.cluster.toLowerCase() === cluster.toLowerCase()
  );
  const rest = all.filter(
    (a) => a.frontmatter.cluster.toLowerCase() !== cluster.toLowerCase()
  );
  return [...inCluster, ...rest].slice(0, limit);
}

// ─── Helpers: cluster summary ────────────────────────────────────────────────

export interface ClusterSummary {
  cluster: string;
  count: number;
  firstArticle?: {
    title: string;
    slug: string;
    reading_time: string;
  };
  /** Most recent article date in this cluster (max of updated/published), ISO string. */
  lastUpdated?: string;
}

export function getClusterSummaries(): ClusterSummary[] {
  const all = getAllArticles();
  const map = new Map<string, Article[]>();

  for (const article of all) {
    const c = article.frontmatter.cluster;
    const existing = map.get(c) || [];
    existing.push(article);
    map.set(c, existing);
  }

  return Array.from(map.entries()).map(([cluster, articles]) => {
    const latest = articles.reduce((max, a) => {
      const fm = a.frontmatter;
      const d = new Date(fm.updated_date > fm.published_date ? fm.updated_date : fm.published_date);
      return d > max ? d : max;
    }, new Date(0));
    return {
      cluster,
      count: articles.length,
      firstArticle: articles[0]
        ? {
            title: articles[0].frontmatter.title,
            slug: articles[0].frontmatter.slug,
            reading_time: articles[0].frontmatter.reading_time,
          }
        : undefined,
      lastUpdated: latest.getTime() > 0 ? latest.toISOString() : undefined,
    };
  });
}

// ─── Helpers: slugs for static generation ────────────────────────────────────

export function getAllSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

// ─── Export cluster meta for use in components ───────────────────────────────

export { CLUSTER_META } from "./cluster-meta";
