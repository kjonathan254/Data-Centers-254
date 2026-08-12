import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// One-time setup: publish all draft articles
// DELETE THIS after running
export async function POST() {
  try {
    const result = await db.article.updateMany({
      where: { status: 'Draft' },
      data: { status: 'Published' },
    });
    return NextResponse.json({
      published: result.count,
      message: `Published ${result.count} articles`,
    });
  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }
}
