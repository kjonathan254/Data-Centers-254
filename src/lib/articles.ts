import fs from "fs";
import path from "path";
import matter from "gray-matter";

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
}

export interface Article {
  frontmatter: ArticleFrontmatter;
  content: string;
  // Derived fields
  headings: { id: string; text: string; level: number }[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

const CLUSTER_META: Record<
  string,
  { label: string; href: string; color: string }
> = {
  Beginner: {
    label: "Beginner Guides",
    href: "/beginners",
    color: "text-cyan bg-cyan/10 border-cyan/25",
  },
  Kenya: {
    label: "Kenya",
    href: "/kenya",
    color: "text-neon bg-neon/10 border-neon/25",
  },
  Internet: {
    label: "Internet & Connectivity",
    href: "/infrastructure",
    color: "text-blue-400 bg-blue-400/10 border-blue-400/25",
  },
  Energy: {
    label: "Energy & Power",
    href: "/energy",
    color: "text-amber-400 bg-amber-400/10 border-amber-400/25",
  },
  Careers: {
    label: "Careers & Business",
    href: "/careers",
    color: "text-purple-400 bg-purple-400/10 border-purple-400/25",
  },
  AI: {
    label: "AI & Cloud",
    href: "/ai",
    color: "text-neon bg-neon/10 border-neon/25",
  },
  Infrastructure: {
    label: "Infrastructure",
    href: "/infrastructure",
    color: "text-blue-400 bg-blue-400/10 border-blue-400/25",
  },
  Policy: {
    label: "Policy & Regulation",
    href: "/kenya",
    color: "text-amber-400 bg-amber-400/10 border-amber-400/25",
  },
};

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

// ─── Core: list all articles ─────────────────────────────────────────────────

export function getAllArticles(): Article[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".md"));

  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      return getArticleBySlug(slug);
    })
    .filter((a): a is Article => a !== null)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.published_date).getTime() -
        new Date(a.frontmatter.published_date).getTime()
    );
}

// ─── Helpers: filtered views ─────────────────────────────────────────────────

export function getArticlesByCluster(cluster: string): Article[] {
  return getAllArticles().filter(
    (a) => a.frontmatter.cluster.toLowerCase() === cluster.toLowerCase()
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
  return getAllArticles()
    .filter(
      (a) =>
        a.frontmatter.slug !== currentSlug &&
        a.frontmatter.cluster.toLowerCase() === cluster.toLowerCase()
    )
    .slice(0, limit);
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

export { CLUSTER_META };
