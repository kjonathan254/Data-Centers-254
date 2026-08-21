"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Clock, Calendar, ChevronRight, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const clusterMeta: Record<string, { label: string; href: string }> = {
  Beginner: { label: "Beginner Guides", href: "/data-centres" },
  Kenya: { label: "Kenya", href: "/ai" },
  Internet: { label: "Internet & Connectivity", href: "/infrastructure" },
  Energy: { label: "Energy & Power", href: "/energy" },
  Careers: { label: "Careers & Business", href: "/careers" },
};

export default function ArticleStaticClient({
  title,
  subtitle,
  tlDr,
  content,
  readingTimeMin,
  publishedDate,
  author,
  cluster,
  slug,
}: {
  title: string;
  subtitle: string;
  tlDr: string;
  content: string;
  readingTimeMin: number;
  publishedDate: string;
  author: string;
  cluster: string;
  slug: string;
}) {
  const meta = clusterMeta[cluster] || clusterMeta.Kenya;
  const formattedDate = new Date(publishedDate).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative">
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_10%,oklch(0.78_0.14_195/3%),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="size-3.5" />
          <Link href={meta.href} className="hover:text-foreground transition-colors">
            {meta.label}
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground/60 truncate max-w-[200px]">{title}</span>
        </motion.div>

        {/* Header */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="text-section-label">{meta.label.toUpperCase()} &middot; REGULATORY INTELLIGENCE</span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight mb-4 mt-4">
            {title}
          </h1>

          {subtitle && (
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
              {subtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-6 mb-8">
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" />
              {readingTimeMin} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="size-4" />
              Verified August 2026
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              {formattedDate}
            </span>
            <Badge variant="secondary" className="rounded-md px-2 py-0.5 text-xs font-medium">
              {cluster}
            </Badge>
          </div>

          <Separator className="bg-border/50 mb-10" />

          {/* TL;DR Pull Quote */}
          {tlDr && (
            <div className="my-10 py-6 border-y border-border/30">
              <p className="pull-quote text-center max-w-2xl mx-auto">{tlDr}</p>
            </div>
          )}

          {/* Article Body */}
          <div className="mt-10 space-y-6 text-base sm:text-lg leading-relaxed text-muted-foreground prose-max">
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mt-14 mb-4 first:mt-0">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-foreground mt-10 mb-3">
                    {children}
                  </h3>
                ),
                p: ({ children }) => <p className="mb-6">{children}</p>,
                blockquote: ({ children }) => (
                  <div className="my-8 border-l-2 border-cyan/50 pl-6 py-2">
                    <p className="text-lg sm:text-xl font-medium text-foreground/90 italic leading-relaxed">
                      {children}
                    </p>
                  </div>
                ),
                strong: ({ children }) => (
                  <strong className="text-foreground font-semibold">{children}</strong>
                ),
                em: ({ children }) => (
                  <em>{children}</em>
                ),
                ul: ({ children }) => (
                  <ul className="my-6 space-y-2">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="flex items-start gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan" />
                    <span>{children}</span>
                  </li>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-cyan hover:underline underline-offset-4"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                code: ({ className, children }) => {
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
                table: ({ children }) => (
                  <div className="my-8 overflow-x-auto rounded-xl border border-border/50">
                    <table className="w-full text-sm">{children}</table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-secondary/50">{children}</thead>
                ),
                th: ({ children }) => (
                  <th className="px-4 py-3 text-left font-semibold text-foreground text-xs uppercase tracking-wider">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-3 border-t border-border/30 text-muted-foreground">
                    {children}
                  </td>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>

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
