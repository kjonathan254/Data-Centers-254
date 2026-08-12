"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Circle, Clock, FileText } from "lucide-react";

interface FoundationArticle {
  foundationalOrder: number;
  title: string;
  slug: string;
  tlDr: string | null;
  cluster: string;
  status: string;
  readingTimeMin: number | null;
  lastVerified: string | null;
  claimCount: number;
}

interface Phase {
  name: string;
  range: readonly [number, number];
  description: string;
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as const,
};

const statusConfig: Record<string, { label: string; color: string }> = {
  Published: { label: "Published", color: "text-emerald-400/80" },
  InReview: { label: "In Review", color: "text-amber-400/80" },
  Draft: { label: "Draft", color: "text-muted-foreground" },
};

export default function FoundationsClient({
  articles,
  phases,
  publishedCount,
  total,
}: {
  articles: FoundationArticle[];
  phases: Phase[];
  publishedCount: number;
  total: number;
}) {
  const progress = Math.round((publishedCount / total) * 100);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Foundations</span>
        </nav>

        {/* Header */}
        <motion.div {...fadeUp} className="mt-10">
          <p className="text-[11px] font-mono uppercase tracking-widest text-cyan/50">
            Editorial Pipeline
          </p>
          <h1 className="mt-4 text-display-sm text-foreground">
            12 foundational articles.
          </h1>
          <p className="mt-2 text-subtitle">
            The articles that establish DC254&apos;s editorial foundation. Once
            these are published with verified sources, DC254 Brief launches.
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div {...fadeUp} className="mt-10">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground">
              {publishedCount} of {total} published
            </span>
          </div>
          <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="h-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.78 0.14 195), oklch(0.75 0.18 155))",
              }}
            />
          </div>
        </motion.div>

        {/* Phases */}
        <div className="mt-16 flex flex-col gap-14">
          {phases.map((phase) => {
            const phaseArticles = articles.filter(
              (a) =>
                a.foundationalOrder >= phase.range[0] &&
                a.foundationalOrder <= phase.range[1]
            );

            return (
              <motion.div key={phase.name} {...fadeUp}>
                {/* Phase header */}
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-cyan/50">
                    Phase {phase.range[0]}–{phase.range[1]}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {phase.name}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  {phase.description}
                </p>

                {/* Articles */}
                <div className="flex flex-col">
                  {phaseArticles.map((article, i) => {
                    const sc = statusConfig[article.status] || statusConfig.Draft;
                    const isPublished = article.status === "Published";

                    return (
                      <motion.div
                        key={article.slug}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{
                          duration: 0.5,
                          delay: i * 0.05,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <div className="py-5 border-b border-border/25 last:border-b-0 group">
                          <div className="flex items-start gap-3">
                            {/* Status icon */}
                            <div className="flex-shrink-0 mt-0.5">
                              {isPublished ? (
                                <CheckCircle2 className="size-4 text-emerald-400/60" />
                              ) : (
                                <Circle className="size-4 text-muted-foreground/30" />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 flex-wrap">
                                {isPublished ? (
                                  <Link
                                    href={`/articles/${article.slug}`}
                                    className="text-sm font-medium text-foreground/90 group-hover:text-cyan transition-colors duration-200"
                                  >
                                    {article.title}
                                  </Link>
                                ) : (
                                  <span className="text-sm font-medium text-foreground/50">
                                    {article.title}
                                  </span>
                                )}
                                <span
                                  className={`text-[10px] font-mono uppercase tracking-wider ${sc.color}`}
                                >
                                  {sc.label}
                                </span>
                              </div>

                              <div className="flex items-center gap-4 mt-1.5 text-[11px] text-muted-foreground/60 font-mono">
                                <span className="flex items-center gap-1">
                                  <FileText className="size-3" />
                                  {article.cluster}
                                </span>
                                {article.readingTimeMin && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="size-3" />
                                    {article.readingTimeMin} min
                                  </span>
                                )}
                                <span>{article.claimCount} claims</span>
                                {article.lastVerified && (
                                  <span>Verified {article.lastVerified}</span>
                                )}
                              </div>
                            </div>

                            {/* Arrow for published */}
                            {isPublished && (
                              <Link
                                href={`/articles/${article.slug}`}
                                className="flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <ArrowRight className="size-3.5 text-cyan/60" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom note */}
        <motion.p
          {...fadeUp}
          className="mt-16 text-xs text-muted-foreground/50 text-center"
        >
          Each article requires: research, sourcing, fact verification, Kenyan
          context, original analysis, and editing before publication.
        </motion.p>
      </div>
    </div>
  );
}
