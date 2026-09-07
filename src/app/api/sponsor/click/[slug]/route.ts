import { NextRequest, NextResponse } from 'next/server';
import { trackSponsorClick } from '@/lib/newsletter-store';

/**
 * Sponsor click-through tracker.
 *
 * Newsletter sponsor links point here: /api/sponsor/click/{slug}?to={url}
 * We count the click per sponsor slug, then 302 to the real destination.
 * The tally per slug is what goes into the monthly sponsor report — the
 * thing that keeps sponsors renewing.
 *
 * `to` is restricted to https to prevent this becoming an open redirect.
 */

function safeTarget(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:') return null;
    return url.toString();
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = (searchParams.get('s') || 'generic').slice(0, 40);
  const target = safeTarget(searchParams.get('to'));

  if (!target) {
    return NextResponse.json({ error: 'Invalid target' }, { status: 400 });
  }

  try {
    const clicks = await trackSponsorClick(slug);
    console.log(`[sponsor-click] ${slug} -> ${clicks} total`);
  } catch (err) {
    // never block the redirect on a tracking failure
    console.error('[sponsor-click] tracking failed:', err);
  }

  return NextResponse.redirect(target, {
    status: 302,
    headers: { 'Cache-Control': 'no-store' },
  });
}
