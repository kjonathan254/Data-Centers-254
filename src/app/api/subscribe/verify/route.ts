import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { getSubscriber, markSubscriber } from '@/lib/newsletter-store';
import { verifyActionToken } from '@/lib/subscribe-tokens';
import {
  addContactToAudience,
  getResendClient,
} from '@/lib/resend-audience';

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

/**
 * Welcome email, sent once, right after the address is verified. This is
 * the relationship-opener: what the briefing is, when it lands, and where
 * the subscriber should start on the site. Best-effort by design - a
 * welcome-mail failure must never fail the verification itself.
 */
function welcomeEmailHtml(): string {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#0b1e3c;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;color:#e6edf5;">
    <p style="font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#7dd3fc;margin:0 0 8px;">Data Centre 254</p>
    <h1 style="font-size:22px;margin:0 0 16px;color:#ffffff;">Welcome to The Rack Report</h1>
    <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
      Thanks for subscribing. Once a month, DC254 will send you a concise
      briefing on what changed across Kenya and East Africa's digital
      infrastructure, landing on the first Monday of the month.
    </p>
    <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
      You can expect coverage of data centres, capacity, operators, subsea
      cables, connectivity, power, regulation, AI projects and major
      infrastructure deals. Every claim carries its source and its date.
    </p>
    <p style="font-size:15px;line-height:1.6;margin:0 0 24px;">
      Start with the <a href="__SITE__/directory" style="color:#7dd3fc;">DC Directory</a>
      and the <a href="__SITE__/methodology" style="color:#7dd3fc;">Data Methodology</a>
      to see how we track and verify the market.
    </p>
    <p style="font-size:15px;line-height:1.6;color:#9fb1c7;margin:0;">
      \u2014 Kevin<br>DC254 \u00b7 An Elmac Communications Ltd publication
    </p>
  </div>
</body></html>`;
}

async function sendWelcomeEmail(email: string, origin: string): Promise<void> {
  const resend = getResendClient();
  const from = process.env.RESEND_FROM_EMAIL;
  if (!resend || !from) return; // email stack unconfigured: skip silently
  try {
    const { error } = await resend.emails.send({
      from,
      to: email,
      subject: 'Welcome to The Rack Report',
      html: welcomeEmailHtml().replaceAll('__SITE__', origin),
    });
    if (error) {
      console.error('[subscribe-verify] welcome email rejected:', error.message ?? error);
    }
  } catch (err) {
    console.error(
      '[subscribe-verify] welcome email threw:',
      err instanceof Error ? err.message : err
    );
  }
}

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
      // Relationship opener. Best-effort: never blocks verification.
      await sendWelcomeEmail(parsed.email, req.nextUrl.origin);
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
