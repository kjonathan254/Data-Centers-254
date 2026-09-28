"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Clock, Calendar, ChevronRight, BookOpen,
  Share2, LinkIcon, CheckCircle2, ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SubscribeCompact from "@/components/sections/subscribe-compact";
import ListenBar from "@/components/ListenBar";

import { ArticleImageBlock } from "./article-media";

// NOTE (perf audit H1): the markdown body is rendered server-side by
// ArticleBody.tsx and passed in as the `body` prop, so react-markdown,
// remark-gfm and framer-motion no longer ship to article pages.

import type {
  Article, ArticleFaq,
} from "@/lib/articles";
import { CLUSTER_META } from "@/lib/cluster-meta";
import { getClusterImage } from "@/lib/imagery";

// ─── Types ────────────────────────────────────────────────────────────────

interface RelatedArticle {
  title: string;
  slug: string;
  reading_time: string;
}

interface Props {
  article: Article;
  related: RelatedArticle[];
  /** Server-rendered markdown body (see ArticleBody.tsx). */
  body: React.ReactNode;
}

// ─── Heading ToC Item ─────────────────────────────────────────────────────

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

// ─── Progress Bar ──────────────────────────────────────────────────────────

function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const el = document.documentElement;
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px]">
      <div
        className="h-full bg-cyan transition-[width] duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ─── Table of Contents ────────────────────────────────────────────────────

function TableOfContents({ headings }: { headings: HeadingItem[] }) {
  const h2s = headings.filter((h) => h.level === 2);
  if (h2s.length < 2) return null;

  return (
    <nav className="glass-card rounded-xl p-5 sm:p-6 mb-10 border border-border/50">
      <h2 className="text-xs font-mono uppercase tracking-widest text-cyan mb-4">
        On this page
      </h2>
      <ul className="space-y-2">
        {h2s.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className="text-sm text-muted-foreground hover:text-cyan transition-colors duration-200 block py-0.5"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ─── FAQ Section ──────────────────────────────────────────────────────────
// (PortraitFigure / ArticleImageBlock moved to article-media.tsx; the answer
// reveal below is a plain conditional render now — the framer-motion height
// animation cost an entire animation library on every article page)

function FaqSection({ faq }: { faq: ArticleFaq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (faq.length === 0) return null;

  return (
    <div className="mt-14">
      <Separator className="bg-border/50 mb-8" />
      <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {faq.map((item, i) => (
          <div
            key={i}
            className="glass-card rounded-xl border border-border/50 overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-start justify-between gap-3 p-4 sm:p-5 text-left"
            >
              <span className="text-sm sm:text-base font-medium text-foreground leading-snug">
                {item.question}
              </span>
              <ChevronUp
                className={`size-4 shrink-0 mt-0.5 text-muted-foreground transition-transform duration-200 ${
                  openIndex === i ? "" : "rotate-180"
                }`}
              />
            </button>
            {openIndex === i && (
              <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Share Buttons ────────────────────────────────────────────────────────

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = (typeof window !== 'undefined' ? window.location.origin : '') + `/articles/${slug}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground mr-1">
        <Share2 className="size-3.5 inline mr-1" />
        Share
      </span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center size-8 rounded-lg border border-border/50 hover:border-cyan/30 hover:bg-cyan/5 transition-all text-muted-foreground hover:text-cyan"
        aria-label="Share on X"
      >
        <svg className="size-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center size-8 rounded-lg border border-border/50 hover:border-cyan/30 hover:bg-cyan/5 transition-all text-muted-foreground hover:text-cyan"
        aria-label="Share on LinkedIn"
      >
        <svg className="size-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      </a>
      <button
        onClick={copyLink}
        className="inline-flex items-center justify-center size-8 rounded-lg border border-border/50 hover:border-cyan/30 hover:bg-cyan/5 transition-all text-muted-foreground hover:text-cyan"
        aria-label="Copy link"
      >
        {copied ? (
          <CheckCircle2 className="size-3.5 text-neon" />
        ) : (
          <LinkIcon className="size-3.5" />
        )}
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────

export default function ArticlePageClient({ article, related, body }: Props) {
  const { frontmatter, headings } = article;
  const meta = CLUSTER_META[frontmatter.cluster] || CLUSTER_META.Beginner;

  // Hero image for the article header slot (body images live in ArticleBody)
  const heroImage = frontmatter.images.find((i) => i.position === "hero");
  const clusterImg = getClusterImage(frontmatter.cluster);

  return (
    <div className="relative">
      <ProgressBar />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="size-3.5" />
          <Link href={meta.href} className="hover:text-foreground transition-colors">{meta.label}</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground/60 truncate max-w-[200px]">{frontmatter.title}</span>
        </div>

        <article>
          {/* Cluster badge */}
          <span className="text-section-label">{meta.label.toUpperCase()}</span>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight mb-4 mt-4">
            {frontmatter.title}
          </h1>

          {/* Meta row: byline over publication line — the person under the masthead */}
          <div className="mb-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground/80">
                Edited by{" "}
                <Link href={frontmatter.author_bio_link} className="hover:text-cyan transition-colors">
                  {frontmatter.author}
                </Link>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                {/* T00:00:00 forces local-time parsing on BOTH server and
                    client (date-only ISO parses as UTC midnight otherwise),
                    so negative-UTC-offset visitors no longer see a shifted
                    day + hydration error. Same pattern as hero.tsx. */}
                {new Date(`${frontmatter.published_date}T00:00:00`).toLocaleDateString("en-KE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {frontmatter.reading_time}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              DataCentre254 &middot; An Elmac Communications Ltd publication
            </p>
          </div>

          {/* Share buttons */}
          <div className="mb-8">
            <ShareButtons title={frontmatter.title} slug={frontmatter.slug} />
          </div>

          <Separator className="bg-border/50 mb-0" />

          {/* Hero image, article's own, or the cluster photograph as fallback */}
          {heroImage ? (
            <ArticleImageBlock image={heroImage} />
          ) : (
            <figure className="mb-10">
              <div className="img-frame relative aspect-[16/9]">
                <Image
                  src={clusterImg.src}
                  alt={clusterImg.alt}
                  fill
                  priority
                  sizes="(max-width: 896px) 100vw, 896px"
                  className="object-cover"
                />
              </div>
            </figure>
          )}

          {/* Table of Contents */}
          <TableOfContents headings={headings} />

          {/* Listen (device-side text-to-speech) */}
          <ListenBar targetId="article-body" slug={frontmatter.slug} />

          {/* Article Body — server-rendered by ArticleBody (RSC slot) */}
          {body}

          {/* Newsletter CTA, highest-intent moment: reader just finished */}
          <SubscribeCompact source={`article:${frontmatter.slug}`} />

          {/* Internal links section */}
          {frontmatter.internal_links && frontmatter.internal_links.length > 0 && (
            <div className="mt-14">
              <Separator className="bg-border/50 mb-8" />
              <h2 className="text-lg font-semibold text-foreground mb-4">Continue Exploring</h2>
              <div className="flex flex-wrap gap-3">
                {frontmatter.internal_links.map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-sm text-cyan underline hover:underline underline-offset-4"
                  >
                    <ChevronRight className="size-3" />
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* External Sources */}
          {frontmatter.external_sources && frontmatter.external_sources.length > 0 && (
            <div className="mt-10">
              <h3 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-3">
                References
              </h3>
              <ul className="space-y-1.5">
                {frontmatter.external_sources.map((src, i) => (
                  <li key={i}>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-cyan transition-colors"
                    >
                      {src.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FAQ Section */}
          <FaqSection faq={frontmatter.faq || []} />

          {/* Related Articles */}
          {related.length > 0 && (
            <div className="mt-14">
              <Separator className="bg-border/50 mb-8" />
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="size-5 text-cyan" />
                <h2 className="text-lg font-semibold text-foreground">Related Articles</h2>
              </div>
              <div className="space-y-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/articles/${r.slug}`}
                    className="block glass-card glass-card-hover rounded-xl p-4 border border-border/50 hover:border-cyan/30 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-cyan transition-colors">
                        {r.title}
                      </h3>
                      <span className="text-xs text-muted-foreground shrink-0 font-mono">{r.reading_time}</span>
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
        </article>
      </div>
    </div>
  );
}
