import FoundationsClient from "./FoundationsClient";
import type { Metadata } from "next";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Foundations — DC254",
  description:
    "The 12 foundational articles that will launch DC254 Brief — Kenya's digital infrastructure explained.",
  alternates: { canonical: "/foundations" },
  openGraph: {
    title: "Foundations | Data Centre 254",
    description:
      "The 12 foundational articles that will launch DC254 Brief — Kenya's digital infrastructure explained.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
    images: [{ url: "/images/og-default.png", width: 1152, height: 864, alt: "Data Centre 254 Foundations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Foundations | Data Centre 254",
    description: "The 12 foundational articles that will launch DC254 Brief.",
    images: ["/images/og-default.png"],
  },
};

const phases = [
  { name: "Foundations", range: [1, 6] as const, description: "The core concepts. What these things are and how they work." },
  { name: "Kenya", range: [7, 10] as const, description: "How Kenya's digital infrastructure is structured and why it matters." },
  { name: "Infrastructure", range: [11, 12] as const, description: "The systems that make data centres possible." },
];

export default function FoundationsPage() {
  const articles = getAllArticles().map((a) => ({
    foundationalOrder: null as number | null,
    title: a.frontmatter.title,
    slug: a.frontmatter.slug,
    tlDr: a.frontmatter.meta_description,
    cluster: a.frontmatter.cluster,
    status: "Published",
    readingTimeMin: parseInt(a.frontmatter.reading_time) || null,
    lastVerified: a.frontmatter.updated_date,
    claimCount: 0,
  }));

  const publishedCount = articles.length;

  return (
    <FoundationsClient
      articles={articles}
      phases={phases}
      publishedCount={publishedCount}
      total={articles.length}
    />
  );
}
