import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import NewBadge from "@/components/new-badge";
import {
  getAllArticles,
  getArticlesByCluster,
  getArticleHeroImage,
  isArticleFresh,
  CLUSTER_META,
} from "@/lib/articles";

// ─── Metadata ────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "All Articles — The Complete Library",
  description:
    "Every Data Centre 254 article in one place: beginner guides, Kenya market analysis, connectivity, energy, policy, AI & cloud, careers, and inside-data-centres explainers.",
  alternates: { canonical: "/articles" },
  keywords: [
    "data centre articles Kenya",
    "Kenya digital infrastructure library",
    "data centre guides East Africa",
    "submarine cables Mombasa",
    "colocation Kenya",
  ],
  openGraph: {
    title: "All Articles — The Complete Data Centre 254 Library",
    description:
      "Every guide, explainer and market analysis on Kenya's data centre industry in one index, grouped by topic.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
    images: [
      {
        url: "/images/east-africa-data-centre-aerial.webp",
        width: 1200,
        height: 675,
        alt: "Aerial view of a data centre campus in East Africa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Articles — The Complete Data Centre 254 Library",
    description:
      "Every guide, explainer and market analysis on Kenya's data centre industry in one index.",
    images: ["/images/east-africa-data-centre-aerial.webp"],
  },
};

// ─── Page ────────────────────────────────────────────────────────────────

interface ArticleGroup {
  cluster: string;
  label: string;
  href: string;
  color: string;
  articles: ReturnType<typeof getAllArticles>;
}

function buildGroups(): ArticleGroup[] {
  const articles = getAllArticles();
  const seen = new Set(articles.map((a) => a.frontmatter.cluster ?? ""));

  // Clusters in CLUSTER_META order first, then any unlisted cluster at the end.
  const keys = [
    ...Object.keys(CLUSTER_META),
    ...Array.from(seen).filter((c) => c && !(c in CLUSTER_META)),
  ];

  const groups: ArticleGroup[] = [];
  for (const cluster of keys) {
    const list = getArticlesByCluster(cluster);
    if (list.length === 0) continue;
    const meta = CLUSTER_META[cluster];
    groups.push({
      cluster,
      label: meta?.label ?? cluster,
      href: meta?.href ?? `/articles`,
      color: meta?.color ?? "text-cyan bg-cyan/10 border-cyan/25",
      articles: list,
    });
  }
  return groups;
}

export default function ArticlesIndexPage() {
  const groups = buildGroups();
  const total = groups.reduce((n, g) => n + g.articles.length, 0);

  const lastUpdated = getAllArticles().reduce((max, a) => {
    const fm = a.frontmatter;
    const d = new Date(
      fm.updated_date > fm.published_date ? fm.updated_date : fm.published_date
    );
    return d > max ? d : max;
  }, new Date(0));
  const showUpdated = lastUpdated.getTime() > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Photographic page header */}
        <header className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0">
            <Image
              src="/images/east-africa-data-centre-aerial.webp"
              alt="Aerial view of a data centre campus in East Africa"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/40"
            />
          </div>

          <div className="relative z-10 container-site py-20 sm:py-28">
            <p className="eyebrow">THE FULL LIBRARY</p>
            <h1 className="h-display mt-3 max-w-2xl text-foreground">
              All Articles
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Every Data Centre 254 article in one place — beginner guides,
              market analysis, connectivity, energy, policy and the physical
              systems inside the machine room. Grouped by topic.
            </p>
            <p className="mt-5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {total} article{total !== 1 ? "s" : ""}
              {showUpdated && (
                <>
                  {" · "}Updated{" "}
                  {lastUpdated.toLocaleDateString("en-KE", {
                    year: "numeric",
                    month: "short",
                  })}
                </>
              )}
            </p>
          </div>
        </header>

        {/* Articles grouped by cluster */}
        <div className="container-site py-14 sm:py-16">
          {groups.map((group) => (
            <section
              key={group.cluster}
              className="mt-12 first:mt-0"
              id={group.cluster.toLowerCase()}
            >
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-semibold text-foreground">
                  {group.label}
                </h2>
                <span
                  className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider ${group.color}`}
                >
                  {group.articles.length}
                </span>
                <Link
                  href={group.href}
                  className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-cyan"
                >
                  Topic hub
                  <ArrowRight className="size-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {group.articles.map((a) => {
                  const img = getArticleHeroImage(a);
                  return (
                    <Link
                      key={a.frontmatter.slug}
                      href={`/articles/${a.frontmatter.slug}`}
                      className="group block"
                    >
                      <article className="card-solid card-solid-hover flex h-full overflow-hidden">
                        <div className="relative hidden w-36 shrink-0 sm:block">
                          <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            sizes="144px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1 p-5">
                          <h3 className="text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-cyan">
                            {a.frontmatter.title}
                          </h3>
                          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                            {a.frontmatter.meta_description}
                          </p>
                          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" />
                              {a.frontmatter.reading_time}
                            </span>
                            <span className="font-mono">
                              {new Date(
                                a.frontmatter.published_date
                              ).toLocaleDateString("en-KE", {
                                year: "numeric",
                                month: "short",
                              })}
                            </span>
                            {isArticleFresh(a) && <NewBadge />}
                          </div>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}

          {/* Back to all topics */}
          <Link
            href="/#the-library"
            className="mt-10 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-cyan"
          >
            <ArrowRight className="size-4 rotate-180" />
            All topics
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
