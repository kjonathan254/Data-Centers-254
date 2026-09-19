import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { getSubscriber, markSubscriber } from '@/lib/newsletter-store';
import { verifyActionToken } from '@/lib/subscribe-tokens';
import { addContactToAudience } from '@/lib/resend-audience';

/**
 * Double opt-in confirmation endpoint. The visitor clicks the signed link
 * from the confirmation email; only here does the address become `verified`
 * in our store and get pushed to the Resend audience.
 *
 * The response is deliberately generic for every outcome (bad token,
 * expired, unknown address, already verified): the same redirect, no
 * enumeration of who is or is not subscribed.
 */

const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;

export async function GET(req: NextRequest) {
  const ip = clientIp(req);
  if ((await rateLimit('subscribe-verify', ip, RATE_LIMIT, WINDOW_MS)).limited) {
    return NextResponse.redirect(new URL('/subscribe/invalid', req.url), 302);
  }

  const parsed = verifyActionToken(
    req.nextUrl.searchParams.get('token'),
    'verify'
  );
  if (!parsed) {
    return NextResponse.redirect(new URL('/subscribe/invalid', req.url), 302);
  }

  try {
    const record = await getSubscriber(parsed.email);
    if (record && record.status === 'unverified') {
      await markSubscriber(parsed.email, 'verified');
      // First contact with the mailing-list vendor happens only now,
      // after the address owner explicitly confirmed.
      await addContactToAudience(parsed.email);
    }
  } catch (err) {
    console.error(
      '[subscribe-verify] failed:',
      err instanceof Error ? err.message : err
    );
    // Storage hiccup: send the visitor to a neutral page rather than
    // leaking internals; the token stays valid to retry.
    return NextResponse.redirect(new URL('/subscribe/invalid', req.url), 302);
  }

  return NextResponse.redirect(new URL('/subscribe/verified', req.url), 302);
}
