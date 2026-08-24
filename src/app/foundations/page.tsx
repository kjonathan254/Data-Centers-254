import { db } from "@/lib/db";
import FoundationsClient from "./FoundationsClient";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Foundations — DC254",
  description:
    "The 12 foundational articles that will launch DC254 Brief — Kenya's digital infrastructure explained.",
};

const phases = [
  { name: "Foundations", range: [1, 6] as const, description: "The core concepts. What these things are and how they work." },
  { name: "Kenya", range: [7, 10] as const, description: "How Kenya's digital infrastructure is structured and why it matters." },
  { name: "Infrastructure", range: [11, 12] as const, description: "The systems that make data centres possible." },
];

export default async function FoundationsPage() {
  let articles: Array<{
    foundationalOrder: number | null;
    title: string;
    slug: string;
    tlDr: string | null;
    cluster: string;
    status: string;
    readingTimeMin: number | null;
    lastVerified: string | null;
    claimCount: number;
  }> = [];
  let publishedCount = 0;

  try {
    const dbArticles = await db.article.findMany({
      where: { isFoundational: true },
      orderBy: { foundationalOrder: "asc" },
      include: { _count: { select: { claims: true } } },
    });
    articles = dbArticles.map((a) => ({
      foundationalOrder: a.foundationalOrder,
      title: a.title,
      slug: a.slug,
      tlDr: a.tlDr,
      cluster: a.cluster,
      status: a.status,
      readingTimeMin: a.readingTimeMin,
      lastVerified: a.lastVerified,
      claimCount: a._count.claims,
    }));
    publishedCount = articles.filter((a) => a.status === "Published").length;
  } catch {
    // Database unavailable — show empty state
  }

  return (
    <FoundationsClient
      articles={articles}
      phases={phases}
      publishedCount={publishedCount}
      total={articles.length}
    />
  );
}
