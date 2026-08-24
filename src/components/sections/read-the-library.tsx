"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { useEffect, useState } from "react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" } as const,
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } as const,
};

interface ClusterEntry {
  cluster: string;
  _count: { cluster: number };
  firstArticle?: {
    title: string;
    slug: string;
    tlDr: string | null;
    readingTimeMin: number | null;
    href?: string;
  };
}

const clusterMeta: Record<string, { label: string; entry: string }> = {
  Beginner: {
    label: "START HERE",
    entry: "You use data centres every day. Most people have no idea what they are.",
  },
  Kenya: {
    label: "KENYA",
    entry: "Nairobi and Mombasa. The two cities where Kenya’s digital economy actually lives.",
  },
  Internet: {
    label: "CONNECTIVITY",
    entry: "Undersea cables, fibre routes, and the physical paths that carry your data.",
  },
  Energy: {
    label: "ENERGY",
    entry: "Geothermal from the Rift Valley. The power behind the servers.",
  },
  Careers: {
    label: "CAREERS",
    entry: "The jobs inside these buildings — roles most Kenyans have never heard of.",
  },
};

const clusterRoutes: Record<string, string> = {
  Beginner: "/data-centres",
  Kenya: "/kenya",
  Internet: "/infrastructure",
  Energy: "/energy",
  Careers: "/careers",
};

const FALLBACK_CLUSTERS: ClusterEntry[] = [
  {
    cluster: "Kenya",
    _count: { cluster: 1 },
    firstArticle: {
      title: "Kenya's Data Centre Licensing Framework: What NFP-T1 and NFP-T2 Mean for the Industry",
      slug: "kenya-data-centre-licensing-framework",
      tlDr: "For the first time, commercial data centres are explicitly licensed under the NFP-T2 tier.",
      readingTimeMin: 12,
      href: "/news/kenya-data-centre-licensing-framework",
    },
  },
];

export default function ReadTheLibrary() {
  const [clusters, setClusters] = useState<ClusterEntry[]>(FALLBACK_CLUSTERS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/articles");
        if (res.ok) {
          const data = await res.json();
          const clusterList = data.clusters || [];
          if (clusterList.length > 0) {
            // Fetch first article for each cluster
            const enriched = await Promise.all(
              clusterList.map(
                async (c: { cluster: string; _count: { cluster: number } }) => {
                  try {
                    const aRes = await fetch(
                      `/api/articles?cluster=${c.cluster}&limit=1`
                    );
                    if (aRes.ok) {
                      const articles = await aRes.json();
                      return {
                        ...c,
                        firstArticle: articles[0] || undefined,
                      };
                    }
                  } catch {
                    // skip
                  }
                  return c;
                }
              )
            );
            setClusters(enriched);
          }
          // If DB returns empty, keep showing fallback
        }
      } catch {
        // DB unavailable — keep fallback
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <section className="section-y-lg section-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Label */}
        <motion.div {...fadeUp} className="text-center">
          <span className="text-section-label">THE LIBRARY</span>
        </motion.div>

        {/* Headline — editorial, quiet authority */}
        <motion.h2
          {...fadeUp}
          className="mt-8 text-center text-display-sm text-foreground"
        >
          50 explanations of infrastructure
        </motion.h2>
        <motion.h2
          {...fadeUp}
          className="mt-2 text-center text-display-sm text-gradient-cyan"
        >
          most people never think about.
        </motion.h2>

        <motion.p {...fadeUp} className="mt-6 text-subtitle-center">
          Data centres, connectivity, energy, AI, careers — broken down
          for anyone who wants to understand what actually powers Kenya’s
          digital economy.
        </motion.p>
      </div>

      {/* Cluster entries — editorial list, not cards */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        {loading ? (
          <div className="flex flex-col gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse">
                <div className="h-3 w-20 rounded bg-muted mb-3" />
                <div className="h-4 w-full rounded bg-muted mb-2" />
                <div className="h-4 w-3/4 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col">
            {clusters.map((cluster, i) => {
              const meta = clusterMeta[cluster.cluster] || {
                label: cluster.cluster.toUpperCase(),
                entry: "",
              };
              const route = clusterRoutes[cluster.cluster] || "/";

              return (
                <motion.div
                  key={cluster.cluster}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="py-8 border-b border-border/30 first:pt-0 last:border-b-0">
                    {/* Cluster label + count */}
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-cyan/60">
                        {meta.label}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground/50">
                        {cluster._count.cluster} articles
                      </span>
                    </div>

                    {/* Editorial entry line */}
                    <p className="mt-2 text-sm text-foreground/90 leading-relaxed">
                      {meta.entry}
                    </p>

                    {/* First article as a starting point */}
                    {cluster.firstArticle && (
                      <Link
                        href={cluster.firstArticle.href || `/articles/${cluster.firstArticle.slug}`}
                        className="group flex items-start gap-3 mt-4"
                      >
                        <span className="text-foreground/30 group-hover:text-cyan/60 transition-colors duration-300 mt-px">
                          <ArrowRight className="size-3.5" />
                        </span>
                        <div>
                          <span className="text-sm font-medium text-foreground/80 group-hover:text-cyan transition-colors duration-300">
                            {cluster.firstArticle.title}
                          </span>
                          {cluster.firstArticle.readingTimeMin && (
                            <span className="ml-3 text-xs text-muted-foreground/60 font-mono">
                              {cluster.firstArticle.readingTimeMin} min
                            </span>
                          )}
                        </div>
                      </Link>
                    )}

                    {/* "N more" link to cluster page */}
                    {cluster._count.cluster > 1 && (
                      <Link
                        href={route}
                        className="inline-flex items-center gap-1.5 mt-3 text-xs text-muted-foreground/60 hover:text-cyan/80 transition-colors duration-300"
                      >
                        {cluster._count.cluster - 1} more
                        <ArrowRight className="size-3" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
