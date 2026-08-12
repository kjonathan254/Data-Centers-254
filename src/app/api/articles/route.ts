import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const cluster = searchParams.get('cluster');
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;

  try {
    // Single article by slug
    if (slug) {
      const article = await db.article.findUnique({
        where: { slug },
        include: { claims: { orderBy: { createdAt: 'asc' } } },
      });
      if (!article || article.status !== 'Published') {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }
      return NextResponse.json(article);
    }

    // Articles by cluster
    if (cluster) {
      const articles = await db.article.findMany({
        where: { cluster, status: 'Published' },
        orderBy: { sortOrder: 'asc' },
        take: limit,
        select: {
          id: true, title: true, slug: true, tlDr: true, description: true,
          cluster: true, readingTimeMin: true, lastVerified: true, createdAt: true,
        },
      });
      return NextResponse.json(articles);
    }

    // All published articles
    const articles = await db.article.findMany({
      where: { status: 'Published' },
      orderBy: [{ cluster: 'asc' }, { sortOrder: 'asc' }],
      take: limit,
      select: {
        id: true, title: true, slug: true, tlDr: true, description: true,
        cluster: true, readingTimeMin: true, lastVerified: true, createdAt: true,
      },
    });

    const clusters = await db.article.groupBy({
      by: ['cluster'],
      where: { status: 'Published' },
      _count: { cluster: true },
    });

    return NextResponse.json({ articles, clusters });
  } catch (error) {
    console.error('Articles API error:', error);
    return NextResponse.json(
      { articles: [], clusters: [], error: 'Database temporarily unavailable' },
      { status: 503 }
    );
  }
}
