import { NextRequest, NextResponse } from 'next/server';
import { trackSponsorClick } from '@/lib/newsletter-store';

/**
 * Sponsor click-through tracker.
 *
 * Newsletter sponsor links point here: /api/sponsor/click/{slug}?to={url}
 * We count the click per sponsor slug, then 302 to the real destination.
 * The tally per slug is what goes into the monthly sponsor report, the
 * thing that keeps sponsors renewing.
 *
 * Destination policy (security audit remediation — this endpoint used to
 * accept ANY https: URL, which made it an open redirect: attackers could
 * launder phishing links through the trusted DC254 domain, e.g.
 * /api/sponsor/click/x?to=https://attacker.example, and pollute the very
 * click metrics the endpoint exists to collect).
 *
 * A target is accepted only when ALL of these hold:
 *   1. it is https,
 *   2. it carries no userinfo (user:pass@host),
 *   3. its hostname is same-origin, OR appears in the SPONSOR_ALLOWED_HOSTS
 *      env var (comma-separated hostnames, e.g. "sponsor.example.com,partner.co.ke").
 *
 * With no SPONSOR_ALLOWED_HOSTS configured the endpoint is same-origin only,
 * so external sponsor redirects are disabled until a sponsor is actually
 * signed. To onboard one: add their domain to SPONSOR_ALLOWED_HOSTS in
 * Vercel → Project Settings → Environment Variables and redeploy.
 * Rejected attempts are logged (destination HOST only, never the full URL
 * or query) so abuse is visible in server logs without retaining payloads.
 */

const ALLOWED_HOSTS = new Set(
  (process.env.SPONSOR_ALLOWED_HOSTS ?? '')
    .split(',')
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean)
);

function safeTarget(raw: string | null, origin: string): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:') return null;
    if (url.username || url.password) return null;

    const host = url.hostname.toLowerCase();
    let selfHost = '';
    try {
      selfHost = new URL(origin).hostname.toLowerCase();
    } catch {
      selfHost = '';
    }
    if (host !== selfHost && !ALLOWED_HOSTS.has(host)) return null;

    return url.toString();
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const slug = (searchParams.get('s') || 'generic').slice(0, 40);
  const target = safeTarget(searchParams.get('to'), origin);

  if (!target) {
    let rejectedHost = '';
    try {
      rejectedHost = new URL(searchParams.get('to') ?? '').hostname.slice(0, 100);
    } catch {
      rejectedHost = '(unparseable)';
    }
    console.warn(
      `[sponsor-click] rejected redirect target host="${rejectedHost}" slug="${slug}"`
    );
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
