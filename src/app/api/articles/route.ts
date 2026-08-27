import { NextRequest, NextResponse } from 'next/server';
import {
  getAllArticles,
  getArticlesByCluster,
  getLatestArticles,
  getClusterSummaries,
} from '@/lib/articles';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cluster = searchParams.get('cluster');
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;

  try {
    // Articles by cluster
    if (cluster) {
      const articles = getArticlesByCluster(cluster)
        .slice(0, limit || 50)
        .map((a) => ({
          id: a.frontmatter.slug,
          title: a.frontmatter.title,
          slug: a.frontmatter.slug,
          tlDr: a.frontmatter.meta_description,
          description: a.frontmatter.meta_description,
          cluster: a.frontmatter.cluster,
          readingTimeMin: parseInt(a.frontmatter.reading_time) || null,
          lastVerified: a.frontmatter.updated_date,
          createdAt: a.frontmatter.published_date,
        }));
      return NextResponse.json(articles);
    }

    // All articles
    const all = getAllArticles();
    const articles = (limit ? all.slice(0, limit) : all).map((a) => ({
      id: a.frontmatter.slug,
      title: a.frontmatter.title,
      slug: a.frontmatter.slug,
      tlDr: a.frontmatter.meta_description,
      description: a.frontmatter.meta_description,
      cluster: a.frontmatter.cluster,
      readingTimeMin: parseInt(a.frontmatter.reading_time) || null,
      lastVerified: a.frontmatter.updated_date,
      createdAt: a.frontmatter.published_date,
    }));

    const clusters = getClusterSummaries().map((c) => ({
      cluster: c.cluster,
      _count: { cluster: c.count },
    }));

    return NextResponse.json({ articles, clusters });
  } catch (error) {
    console.error('Articles API error:', error);
    return NextResponse.json(
      { articles: [], clusters: [], error: 'Failed to load articles' },
      { status: 500 }
    );
  }
}
