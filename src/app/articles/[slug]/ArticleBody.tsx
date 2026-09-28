import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import Image from "next/image";
import type { Article, ArticleImage } from "@/lib/articles";
import { PORTRAIT_IMAGE_DIMS } from "@/lib/portrait-images";
import { IMAGE_FOCUS } from "@/lib/image-focus";
import { ArticleImageBlock, PortraitFigure } from "./article-media";

/**
 * SERVER-rendered article body (perf audit H1).
 *
 * The markdown body used to be rendered inside ArticlePageClient ("use
 * client"), which shipped react-markdown + remark-gfm + the full raw
 * markdown to every visitor of every one of the 105 article pages and
 * re-parsed it at hydration. This module renders the exact same markup as
 * part of the server component tree; page.tsx passes the result into the
 * client shell as a `body` prop. Hydration cost of an article page drops by
 * the entire markdown parser, and the body is plain HTML in the SSR payload
 * (better for crawlers that don't run JS).
 */

function getMarkdownComponents(images: ArticleImage[], heroSrc?: string) {
  // Build a map of image src -> caption for rendering inline images from markdown
  const imageMap = new Map<string, ArticleImage>();
  for (const img of images) {
    if (img.position === "inline" || img.position === "section-break" || img.position === "infographic" || img.position === "diagram") {
      imageMap.set(img.src, img);
    }
  }

  return {
    h2: ({ children, ..._rest }: { children?: React.ReactNode; [key: string]: unknown }) => {
      const text = String(children).replace(/\*\*/g, "").trim();
      const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
      return (
        <h2 id={id} className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mt-14 mb-4 scroll-mt-24">
          {children}
        </h2>
      );
    },
    h3: ({ children, ..._rest }: { children?: React.ReactNode; [key: string]: unknown }) => (
      <h3 className="text-xl font-semibold text-foreground mt-10 mb-3 scroll-mt-24">
        {children}
      </h3>
    ),
    p: ({ children, ..._rest }: { children?: React.ReactNode; [key: string]: unknown }) => (
      <p className="mb-6 leading-relaxed">{children}</p>
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
    em: ({ children, ..._rest }: { children?: React.ReactNode; [key: string]: unknown }) => (
      <em className="text-foreground/90">{children}</em>
    ),
    ul: ({ children, ..._rest }: { children?: React.ReactNode; [key: string]: unknown }) => (
      <ul className="my-6 space-y-2">{children}</ul>
    ),
    ol: ({ children, ..._rest }: { children?: React.ReactNode; [key: string]: unknown }) => (
      <ol className="my-6 space-y-2 list-decimal list-inside">{children}</ol>
    ),
    li: ({ children, ..._rest }: { children?: React.ReactNode; [key: string]: unknown }) => (
      <li className="flex items-start gap-2">
        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan" />
        <span className="flex-1">{children}</span>
      </li>
    ),
    a: ({ href, children, ..._rest }: { href?: string; children?: React.ReactNode; [key: string]: unknown }) => {
      if (href && href.startsWith("/")) {
        return (
          <Link href={href} className="text-cyan underline hover:underline underline-offset-4">
            {children}
          </Link>
        );
      }
      return (
        <a href={href} className="text-cyan underline hover:underline underline-offset-4" target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
    code: ({ className, children, ..._rest }: { className?: string; children?: React.ReactNode; [key: string]: unknown }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className="text-cyan bg-cyan/10 px-1.5 py-0.5 rounded text-sm font-mono">
            {children}
          </code>
        );
      }
      return (
        <code className={`${className} block my-4 p-4 rounded-lg bg-surface overflow-x-auto text-sm`}>
          {children}
        </code>
      );
    },
    table: ({ children, ..._rest }: { children?: React.ReactNode; [key: string]: unknown }) => (
      <div className="my-8 overflow-x-auto rounded-xl border border-border/50 bg-card/30" role="region" aria-label="Data table" tabIndex={0}>
        <table className="w-full min-w-[560px] border-collapse text-sm">{children}</table>
      </div>
    ),
    thead: ({ children, ..._rest }: { children?: React.ReactNode; [key: string]: unknown }) => (
      <thead className="bg-surface">{children}</thead>
    ),
    tr: ({ children, ..._rest }: { children?: React.ReactNode; [key: string]: unknown }) => (
      <tr className="odd:bg-surface/40 transition-colors hover:bg-surface/70">{children}</tr>
    ),
    th: ({ children, ..._rest }: { children?: React.ReactNode; [key: string]: unknown }) => (
      <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-foreground text-xs uppercase tracking-wider">{children}</th>
    ),
    td: ({ children, ..._rest }: { children?: React.ReactNode; [key: string]: unknown }) => (
      <td className="px-4 py-3 align-top text-muted-foreground border-t border-border/30">{children}</td>
    ),
    // Render images from markdown as styled figure blocks
    img: ({ src, alt, ..._rest }: { src?: string; alt?: string; [key: string]: unknown }) => {
      if (!src) return null;
      // The hero image already renders at the top of the article, skip its
      // mid-body markdown references to avoid showing the same photo twice.
      if (heroSrc && src === heroSrc) return null;
      const matched = imageMap.get(src);
      if (matched) {
        return <ArticleImageBlock image={matched} />;
      }
      // Generic image without frontmatter mapping
      if (PORTRAIT_IMAGE_DIMS[src]) {
        return <PortraitFigure src={src} alt={alt || ""} caption={alt || undefined} />;
      }
      return (
        <figure className="my-8">
          <div className="relative overflow-hidden rounded-xl h-48 sm:h-64">
            <Image
              src={src}
              alt={alt || ""}
              fill
              className="object-cover"
              style={
                IMAGE_FOCUS[src]
                  ? { objectPosition: IMAGE_FOCUS[src] }
                  : undefined
              }
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
          {alt && <figcaption className="text-xs text-muted-foreground mt-2">{alt}</figcaption>}
        </figure>
      );
    },
  } as Components;
}

export default function ArticleBody({ article }: { article: Article }) {
  const { frontmatter, content } = article;
  const heroImage = frontmatter.images.find((i) => i.position === "hero");
  const bodyImages = frontmatter.images.filter((i) => i.position !== "hero");
  const mdComponents = getMarkdownComponents(bodyImages, heroImage?.src);

  return (
    <div id="article-body" className="space-y-6 text-base sm:text-lg leading-relaxed text-muted-foreground prose-max">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
