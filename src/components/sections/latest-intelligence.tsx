import { getLatestArticles } from "@/lib/articles";
import LatestIntelligenceInner from "./latest-intelligence-inner";

/**
 * Latest intelligence — picks the most recent articles but spreads them
 * across distinct clusters, so the three homepage cards never show the
 * same topic (or the same photograph) three times in a row.
 */
export default function LatestIntelligence() {
  const latest = getLatestArticles(24); // fresh pool, newest first

  const picked: typeof latest = [];
  const seenClusters = new Set<string>();

  // First pass: newest article per cluster
  for (const a of latest) {
    if (picked.length >= 3) break;
    if (seenClusters.has(a.frontmatter.cluster)) continue;
    seenClusters.add(a.frontmatter.cluster);
    picked.push(a);
  }
  // Second pass: fill any remainder from the newest leftovers
  for (const a of latest) {
    if (picked.length >= 3) break;
    if (picked.includes(a)) continue;
    picked.push(a);
  }

  const articles = picked.slice(0, 3).map((a) => ({
    id: a.frontmatter.slug,
    title: a.frontmatter.title,
    slug: a.frontmatter.slug,
    tlDr: a.frontmatter.meta_description,
    cluster: a.frontmatter.cluster,
    readingTimeMin: parseInt(a.frontmatter.reading_time) || null,
  }));

  return <LatestIntelligenceInner articles={articles} />;
}
