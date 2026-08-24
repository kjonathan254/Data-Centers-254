import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ArticlePageClient from "./ArticlePageClient";

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>;
}

const clusterKeywords: Record<string, string[]> = {
  Beginner: ["what is a data centre", "how do data centres work", "cloud computing explained", "server rack", "colocation", "hyperscale"],
  Kenya: ["data centres Kenya", "iXAfrica", "Africa Data Centres", "Nairobi data centre", "Kenya DC market", "hyperscale Kenya"],
  Internet: ["subsea cables Kenya", "KIXP", "internet peering", "CDN Kenya", "submarine cables Mombasa", "TEAMS cable"],
  Energy: ["data centre power", "PUE", "geothermal data centre", "Kenya electricity grid", "renewable energy", "AI power consumption"],
  Careers: ["data centre jobs Kenya", "CDCP certification", "data centre careers", "colocation business", "DCIM", "facility manager"],
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await db.article.findUnique({
      where: { slug },
      select: { title: true, description: true, metaTitle: true, metaDescription: true, cluster: true, updatedAt: true, createdAt: true },
    });
    if (!article) return {};

    const title = article.metaTitle || article.title;
    const description = article.metaDescription || article.description || undefined;
    const url = `https://datacentre254.com/articles/${slug}`;

    return {
      title, description,
      keywords: clusterKeywords[article.cluster] || [],
      authors: [{ name: "Kevin Jonathan Otieno", url: "https://datacentre254.com/about" }],
      alternates: { canonical: url },
      openGraph: { title, description, siteName: "Data Centre 254", type: "article", locale: "en_KE", url, publishedTime: article.createdAt.toISOString(), modifiedTime: article.updatedAt.toISOString(), authors: ["Kevin Jonathan Otieno"], section: article.cluster, tags: clusterKeywords[article.cluster]?.slice(0, 5) },
      twitter: { card: "summary_large_image", title, description },
    };
  } catch {
    return {};
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;

  let articleJson: any = null;
  let relatedJson: any[] = [];
  let cluster = "Kenya";

  try {
    const article = await db.article.findUnique({
      where: { slug },
      include: { claims: { orderBy: { createdAt: "asc" } } },
    });
    if (!article || article.status !== "Published") notFound();

    const related = await db.article.findMany({
      where: { cluster: article.cluster, status: "Published", id: { not: article.id } },
      orderBy: { sortOrder: "asc" }, take: 5,
      select: { title: true, slug: true, tlDr: true, readingTimeMin: true },
    });

    articleJson = JSON.parse(JSON.stringify(article));
    relatedJson = JSON.parse(JSON.stringify(related));
    cluster = article.cluster;
  } catch {
    notFound();
  }

  const articleLd = {
    "@context": "https://schema.org", "@type": "Article",
    headline: articleJson.title, description: articleJson.description || undefined,
    url: `https://datacentre254.com/articles/${articleJson.slug}`,
    datePublished: articleJson.createdAt, dateModified: articleJson.updatedAt,
    author: { "@type": "Person", name: "Kevin Jonathan Otieno", url: "https://datacentre254.com/about", jobTitle: "Founder & Researcher" },
    publisher: { "@type": "Organization", name: "Data Centre 254", url: "https://datacentre254.com", logo: "https://datacentre254.com/logo.png" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://datacentre254.com/articles/${articleJson.slug}` },
    articleSection: cluster,
  };

  const clusterSlug = cluster.toLowerCase();
  const breadcrumbLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://datacentre254.com" },
      { "@type": "ListItem", position: 2, name: cluster, item: `https://datacentre254.com/${clusterSlug}` },
      { "@type": "ListItem", position: 3, name: articleJson.title, item: `https://datacentre254.com/articles/${articleJson.slug}` },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        <ArticlePageClient article={articleJson} related={relatedJson} cluster={cluster} />
      </main>
      <Footer />
    </div>
  );
}
