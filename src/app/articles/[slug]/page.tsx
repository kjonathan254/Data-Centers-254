import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  getArticleBySlug,
  getAllSlugs,
  getRelatedArticles,
} from "@/lib/articles";
import { CLUSTER_META } from "@/lib/cluster-meta";
import { siteUrl } from "@/lib/site";
import { notFound } from "next/navigation";
import ArticlePageClient from "./ArticlePageClient";

// ─── Static Generation ──────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// ─── Metadata ────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const { frontmatter: fm } = article;
  const url = siteUrl(`/articles/${fm.slug}`);
  const canonical = fm.canonical_url || url;

  return {
    title: fm.title,
    description: fm.meta_description,
    keywords: [fm.primary_keyword, ...fm.secondary_keywords],
    authors: [{ name: fm.author, url: siteUrl(fm.author_bio_link) }],
    alternates: { canonical },
    openGraph: {
      title: fm.title,
      description: fm.meta_description,
      siteName: "Data Centre 254",
      type: "article",
      locale: "en_KE",
      url,
      images: fm.og_image ? [{ url: fm.og_image, width: 1200, height: 630, alt: fm.title }] : undefined,
      publishedTime: fm.published_date,
      modifiedTime: fm.updated_date,
      authors: [fm.author],
      section: fm.cluster,
      tags: fm.secondary_keywords.slice(0, 5),
    },
    twitter: {
      card: "summary_large_image",
      title: fm.title,
      description: fm.meta_description,
      images: fm.og_image ? [fm.og_image] : undefined,
    },
  };
}

// ─── Page ────────────────────────────────────────────────────────────────

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const { frontmatter: fm } = article;
  const related = getRelatedArticles(fm.slug, fm.cluster, 5).map((a) => ({
    title: a.frontmatter.title,
    slug: a.frontmatter.slug,
    reading_time: a.frontmatter.reading_time,
  }));

  const clusterMeta = CLUSTER_META[fm.cluster] || CLUSTER_META.Beginner;
  const articleUrl = siteUrl(`/articles/${fm.slug}`);

  // ─── JSON-LD: Article ──────────────────────────────────────────────
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: fm.title,
    description: fm.meta_description,
    url: articleUrl,
    datePublished: fm.published_date,
    dateModified: fm.updated_date,
    author: {
      "@type": "Person",
      name: fm.author,
      url: siteUrl(fm.author_bio_link),
    },
    publisher: {
      "@type": "Organization",
      name: "Data Centre 254",
      url: siteUrl(),
      logo: {
        "@type": "ImageObject",
        url: siteUrl("/logo.png"),
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    articleSection: fm.cluster,
    keywords: [fm.primary_keyword, ...fm.secondary_keywords].join(", "),
    image: fm.og_image ? siteUrl(fm.og_image) : undefined,
  };

  // ─── JSON-LD: FAQPage ──────────────────────────────────────────────
  let faqLd: object | null = null;
  if (fm.faq && fm.faq.length > 0) {
    faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: fm.faq.map((q) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: { "@type": "Answer", text: q.answer },
      })),
    };
  }

  // ─── JSON-LD: Breadcrumb ────────────────────────────────────────────
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
      { "@type": "ListItem", position: 2, name: clusterMeta.label, item: siteUrl(clusterMeta.href) },
      { "@type": "ListItem", position: 3, name: fm.title, item: articleUrl },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
        {faqLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
        )}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        <ArticlePageClient article={article} related={related} />
      </main>
      <Footer />
    </div>
  );
}
