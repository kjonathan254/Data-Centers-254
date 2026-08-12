"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" } as const,
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } as const,
};

interface Article {
  id: string;
  title: string;
  slug: string;
  tlDr: string | null;
  cluster: string;
  readingTimeMin: number | null;
  createdAt: string;
}

export default function LatestIntelligence() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/articles?limit=3&status=Published");
        if (res.ok) {
          const data = await res.json();
          setArticles(Array.isArray(data) ? data : data.articles || []);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  return (
    <section className="section-y-lg px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Label */}
        <motion.div {...fadeUp} className="text-center">
          <span className="text-section-label">LATEST INTELLIGENCE</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          {...fadeUp}
          className="mt-8 text-center text-display-sm text-foreground max-w-3xl mx-auto"
        >
          The infrastructure is being built right now.
        </motion.h2>

        <motion.p {...fadeUp} className="mt-6 text-subtitle-center">
          New data centres. New submarine cables. New AI capacity.
          Kenya&apos;s digital infrastructure is changing fast — and DC254
          tracks every development.
        </motion.p>

        {/* Articles or empty state */}
        <div className="mt-14">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="glass-card rounded-xl p-6 animate-pulse"
                >
                  <div className="h-3 w-16 rounded bg-muted mb-4" />
                  <div className="h-5 w-full rounded bg-muted mb-3" />
                  <div className="h-4 w-3/4 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {articles.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link href={`/articles/${article.slug}`} className="block group">
                    <div className="glass-card glass-card-hover rounded-xl overflow-hidden p-6 transition-all duration-300 relative">
                      {article.readingTimeMin && (
                        <div className="absolute top-4 right-4">
                          <Badge
                            variant="outline"
                            className="rounded-md px-2 py-0.5 text-xs font-mono border-cyan/20 text-cyan bg-cyan/5"
                          >
                            <Clock className="size-3 mr-1" />
                            {article.readingTimeMin} min
                          </Badge>
                        </div>
                      )}
                      <h3 className="text-base font-semibold text-foreground line-clamp-2 group-hover:text-cyan transition-colors duration-300 pr-16">
                        {article.title}
                      </h3>
                      {article.tlDr && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {article.tlDr}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/50">
                        {article.cluster && (
                          <Badge
                            variant="secondary"
                            className="rounded-md px-2 py-0.5 text-xs font-medium"
                          >
                            {article.cluster}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className="glass-card rounded-xl p-8 sm:p-10 text-center max-w-2xl mx-auto"
              {...fadeUp}
            >
              <p className="text-lg font-semibold text-foreground">
                The first articles are being written.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                DC254 is building an intelligence library — explaining
                Kenya&apos;s data centres, connectivity, energy, AI and
                policy in depth. Subscribe to be notified when it launches.
              </p>
            </motion.div>
          )}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-10"
          {...fadeUp}
        >
          <Link
            href="/data-centres"
            className="inline-flex items-center gap-2 text-cyan font-medium text-sm hover:gap-3 transition-all duration-300"
          >
            View all articles
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
