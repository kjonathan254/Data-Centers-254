import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { scrubSubscriber } from '@/lib/newsletter-store';
import { verifyActionToken } from '@/lib/subscribe-tokens';
import { removeContactFromAudience } from '@/lib/resend-audience';

/**
 * One-click unsubscribe endpoint. The link is signed and long-lived
 * (issued in the confirmation email and embeddable in every broadcast).
 *
 * Unsubscribing erases the personal details of the subscription record
 * (email, role, company, source) exactly as the privacy policy promises -
 * only an anonymised tombstone keyed by email hash remains so the same
 * address is not double-counted. The Resend audience contact is removed
 * on a best-effort basis.
 *
 * The response is deliberately generic: unknown/expired/valid tokens all
 * land on the same page, no enumeration.
 */

const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;

export async function GET(req: NextRequest) {
  const ip = clientIp(req);
  if ((await rateLimit('unsubscribe', ip, RATE_LIMIT, WINDOW_MS)).limited) {
    return NextResponse.redirect(new URL('/subscribe/invalid', req.url), 302);
  }

  const parsed = verifyActionToken(
    req.nextUrl.searchParams.get('token'),
    'unsubscribe'
  );
  if (!parsed) {
    return NextResponse.redirect(new URL('/subscribe/invalid', req.url), 302);
  }

  try {
    const scrubbed = await scrubSubscriber(parsed.email);
    if (scrubbed) {
      await removeContactFromAudience(parsed.email);
    }
  } catch (err) {
    console.error(
      '[unsubscribe] failed:',
      err instanceof Error ? err.message : err
    );
    return NextResponse.redirect(new URL('/subscribe/invalid', req.url), 302);
  }

  return NextResponse.redirect(new URL('/subscribe/unsubscribed', req.url), 302);
}
