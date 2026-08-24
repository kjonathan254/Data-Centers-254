"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft, Clock, Calendar, Shield, ExternalLink,
  ChevronRight, BookOpen, AlertTriangle, CheckCircle2, HelpCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Claim {
  id: string;
  claim: string;
  source: string | null;
  sourceTitle: string | null;
  verifiedDate: string | null;
  confidence: string;
  notes: string | null;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  tlDr: string | null;
  description: string | null;
  cluster: string;
  content: string;
  readingTimeMin: number | null;
  lastVerified: string | null;
  dataSource: string | null;
  claims: Claim[];
  createdAt: string;
}

interface Related {
  title: string;
  slug: string;
  tlDr: string | null;
  readingTimeMin: number | null;
}

const clusterMeta: Record<string, { label: string; href: string; color: string }> = {
  Beginner: { label: "Beginner Guides", href: "/data-centres", color: "text-cyan bg-cyan/10 border-cyan/25" },
  Kenya: { label: "Kenya", href: "/ai", color: "text-neon bg-neon/10 border-neon/25" },
  Internet: { label: "Internet & Connectivity", href: "/infrastructure", color: "text-blue-400 bg-blue-400/10 border-blue-400/25" },
  Energy: { label: "Energy & Power", href: "/energy", color: "text-amber-400 bg-amber-400/10 border-amber-400/25" },
  Careers: { label: "Careers & Business", href: "/careers", color: "text-purple-400 bg-purple-400/10 border-purple-400/25" },
};

const confidenceCfg: Record<string, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  High: { icon: CheckCircle2, color: "text-neon", bg: "bg-neon/10 border-neon/25" },
  Medium: { icon: Shield, color: "text-cyan", bg: "bg-cyan/10 border-cyan/25" },
  Low: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/25" },
  Unverified: { icon: HelpCircle, color: "text-muted-foreground", bg: "bg-accent/50 border-border" },
};

export default function ArticlePageClient({
  article,
  related,
  cluster,
}: {
  article: Article;
  related: Related[];
  cluster: string;
}) {
  const [showClaims, setShowClaims] = useState(false);
  const meta = clusterMeta[cluster] || clusterMeta.Beginner;

  return (
    <div className="relative">
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_10%,oklch(0.78_0.14_195/3%),transparent_70%)]" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="size-3.5" />
          <Link href={meta.href} className="hover:text-foreground transition-colors">{meta.label}</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground/60 truncate max-w-[200px]">{article.title}</span>
        </motion.div>

        {/* Header */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="text-section-label">{meta.label.toUpperCase()}</span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight mb-4 mt-4">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
            {article.readingTimeMin && (
              <span className="flex items-center gap-1.5"><Clock className="size-4" />{article.readingTimeMin} min read</span>
            )}
            {article.lastVerified && (
              <span className="flex items-center gap-1.5"><Shield className="size-4" />Verified {article.lastVerified}</span>
            )}
            <span className="flex items-center gap-1.5"><Calendar className="size-4" />{new Date(article.createdAt).toLocaleDateString("en-KE", { year: "numeric", month: "long" })}</span>
          </div>

          <Separator className="bg-border/50 mb-10" />

          {/* TL;DR Pull Quote */}
          {article.tlDr && (
            <div className="my-10 py-6 border-y border-border/30">
              <p className="pull-quote text-center max-w-2xl mx-auto">{article.tlDr}</p>
            </div>
          )}

          {/* Article Body */}
          <div className="mt-10 space-y-6 text-base sm:text-lg leading-relaxed text-muted-foreground prose-max">
            <ReactMarkdown
              components={{
                h2: ({ children, ..._rest }: { children?: React.ReactNode; [key: string]: unknown }) => (
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mt-14 mb-4 first:mt-0">
                    {children}
                  </h2>
                ),
                h3: ({ children, ..._rest }: { children?: React.ReactNode; [key: string]: unknown }) => (
                  <h3 className="text-xl font-semibold text-foreground mt-10 mb-3">
                    {children}
                  </h3>
                ),
                p: ({ children, ..._rest }: { children?: React.ReactNode; [key: string]: unknown }) => (
                  <p className="mb-6">{children}</p>
                ),
                blockquote: ({ children, ..._rest }: { children?: React.ReactNode; [key: string]: unknown }) => (
                  <div className="my-8 border-l-2 border-cyan/50 pl-6 py-2">
                    <p className="text-lg sm:text-xl font-medium text-foreground/90 italic leading-relaxed">
                      {children}
                    </p>
                  </div>
                ),
                strong: ({ children, ..._rest }: { children?: React.ReactNode; [key: string]: unknown }) => (
                  <strong className="text-foreground font-semibold">{children}</strong>
                ),
                ul: ({ children, ..._rest }: { children?: React.ReactNode; [key: string]: unknown }) => (
                  <ul className="my-6 space-y-2">{children}</ul>
                ),
                li: ({ children, ..._rest }: { children?: React.ReactNode; [key: string]: unknown }) => (
                  <li className="flex items-start gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan" />
                    <span>{children}</span>
                  </li>
                ),
                a: ({ href, children, ..._rest }: { href?: string; children?: React.ReactNode; [key: string]: unknown }) => (
                  <a href={href} className="text-cyan hover:underline underline-offset-4" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                code: ({ className, children, ..._rest }: { className?: string; children?: React.ReactNode; [key: string]: unknown }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="text-cyan bg-cyan/10 px-1.5 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code>
                    );
                  }
                  return <code className={className}>{children}</code>;
                },
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>

          {/* Claims & Sources Section */}
          {article.claims.length > 0 && (
            <div className="mt-14">
              <Separator className="bg-border/50 mb-8" />
              <button
                onClick={() => setShowClaims(!showClaims)}
                className="flex items-center gap-2 text-foreground font-semibold text-lg mb-6 group"
              >
                <Shield className="size-5 text-cyan" />
                Claims & Sources
                <span className="text-xs font-mono text-muted-foreground ml-2">{article.claims.length} claim{article.claims.length !== 1 ? "s" : ""}</span>
                <svg
                  className={`size-4 text-muted-foreground transition-transform ${showClaims ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showClaims && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-3"
                >
                  {article.claims.map((c) => {
                    const cfg = confidenceCfg[c.confidence] || confidenceCfg.Medium;
                    const CIcon = cfg.icon;
                    return (
                      <div key={c.id} className={`glass-card rounded-xl p-4 border border-border/50`}>
                        <div className="flex items-start gap-3">
                          <CIcon className={`size-4 mt-0.5 shrink-0 ${cfg.color}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground leading-relaxed">{c.claim}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                              {c.source && (
                                <a
                                  href={c.source}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-cyan hover:underline"
                                >
                                  {c.sourceTitle || c.source}
                                  <ExternalLink className="size-3" />
                                </a>
                              )}
                              {c.verifiedDate && <span className="text-xs text-muted-foreground">Verified {c.verifiedDate}</span>}
                              <Badge variant="outline" className={`rounded-full px-2 py-0 text-[10px] font-medium border ${cfg.bg} ${cfg.color}`}>
                                {c.confidence}
                              </Badge>
                            </div>
                            {c.notes && <p className="text-xs text-muted-foreground/70 mt-1.5">{c.notes}</p>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <p className="text-xs text-muted-foreground/50 mt-4">
                    Every factual claim in this article is tracked individually. Confidence levels: High = independently confirmed, Medium = from reliable source but not independently verified, Low = single source, Unverified = needs confirmation.
                  </p>
                </motion.div>
              )}
            </div>
          )}

          {/* Related Articles */}
          {related.length > 0 && (
            <div className="mt-14">
              <Separator className="bg-border/50 mb-8" />
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="size-5 text-cyan" />
                <h2 className="text-lg font-semibold text-foreground">Continue Reading</h2>
              </div>
              <div className="space-y-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/articles/${r.slug}`}
                    className="block glass-card glass-card-hover rounded-xl p-4 border border-border/50 hover:border-cyan/30 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-cyan transition-colors">{r.title}</h3>
                        {r.tlDr && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{r.tlDr}</p>}
                      </div>
                      {r.readingTimeMin && <span className="text-xs text-muted-foreground shrink-0">{r.readingTimeMin} min</span>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="mt-14">
            <Button variant="outline" asChild className="border-border/50 gap-2">
              <Link href={meta.href}>
                <ArrowLeft className="size-4" />
                Back to {meta.label}
              </Link>
            </Button>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
