import { getLatestArticles } from "@/lib/articles";
import LatestIntelligenceInner from "./latest-intelligence-inner";

export default function LatestIntelligence() {
  const articles = getLatestArticles(3).map((a) => ({
    id: a.frontmatter.slug,
    title: a.frontmatter.title,
    slug: a.frontmatter.slug,
    tlDr: a.frontmatter.meta_description,
    cluster: a.frontmatter.cluster,
    readingTimeMin: parseInt(a.frontmatter.reading_time) || null,
  }));

  return <LatestIntelligenceInner articles={articles} />;
}
