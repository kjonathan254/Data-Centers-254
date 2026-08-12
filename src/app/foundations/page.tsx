import { db } from "@/lib/db";
import FoundationsClient from "./FoundationsClient";
import type { Metadata } from "next";

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
  const articles = await db.article.findMany({
    where: { isFoundational: true },
    orderBy: { foundationalOrder: "asc" },
    include: {
      _count: { select: { claims: true } },
    },
  });

  const publishedCount = articles.filter((a) => a.status === "Published").length;

  return (
    <FoundationsClient
      articles={articles.map((a) => ({
        foundationalOrder: a.foundationalOrder,
        title: a.title,
        slug: a.slug,
        tlDr: a.tlDr,
        cluster: a.cluster,
        status: a.status,
        readingTimeMin: a.readingTimeMin,
        lastVerified: a.lastVerified,
        claimCount: a._count.claims,
      }))}
      phases={phases}
      publishedCount={publishedCount}
      total={articles.length}
    />
  );
}
