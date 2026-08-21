import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ARTICLE_META, ARTICLE_CONTENT } from "./content";
import ArticleStaticClient from "./ArticleStaticClient";

const url = `https://datacentre254.com/news/${ARTICLE_META.slug}`;

export const metadata: Metadata = {
  title: ARTICLE_META.title,
  description: ARTICLE_META.subtitle,
  keywords: [
    "data centres Kenya", "NFP-T1", "NFP-T2", "Communications Authority",
    "licensing framework", "telecoms licence", "Kenya data centre market",
    "CA Kenya", "Gazette Notice 3335", "Network Facilities Provider",
  ],
  authors: [{ name: ARTICLE_META.author, url: "https://datacentre254.com/about" }],
  alternates: { canonical: url },
  openGraph: {
    title: ARTICLE_META.title,
    description: ARTICLE_META.subtitle,
    siteName: "Data Centre 254",
    type: "article",
    locale: "en_KE",
    url,
    publishedTime: ARTICLE_META.publishedDate,
    modifiedTime: ARTICLE_META.publishedDate,
    authors: [ARTICLE_META.author],
    section: ARTICLE_META.cluster,
  },
  twitter: {
    card: "summary_large_image",
    title: ARTICLE_META.title,
    description: ARTICLE_META.subtitle,
  },
};

export default function KenyaDCLicensingArticle() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Article JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: ARTICLE_META.title,
              description: ARTICLE_META.subtitle,
              url,
              datePublished: ARTICLE_META.publishedDate,
              dateModified: ARTICLE_META.publishedDate,
              author: {
                "@type": "Organization",
                name: "Data Centre 254",
                url: "https://datacentre254.com",
              },
              publisher: {
                "@type": "Organization",
                name: "Data Centre 254",
                url: "https://datacentre254.com",
                logo: "https://datacentre254.com/logo.png",
              },
              mainEntityOfPage: { "@type": "WebPage", "@id": url },
              articleSection: ARTICLE_META.cluster,
            }),
          }}
        />
        {/* BreadcrumbList JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://datacentre254.com" },
                { "@type": "ListItem", position: 2, name: "Kenya", item: "https://datacentre254.com/ai" },
                { "@type": "ListItem", position: 3, name: ARTICLE_META.title, item: url },
              ],
            }),
          }}
        />
        <ArticleStaticClient
          title={ARTICLE_META.title}
          subtitle={ARTICLE_META.subtitle}
          tlDr={ARTICLE_META.tlDr}
          content={ARTICLE_CONTENT}
          readingTimeMin={ARTICLE_META.readingTimeMin}
          publishedDate={ARTICLE_META.publishedDate}
          author={ARTICLE_META.author}
          cluster={ARTICLE_META.cluster}
          slug={ARTICLE_META.slug}
        />
      </main>
      <Footer />
    </div>
  );
}
