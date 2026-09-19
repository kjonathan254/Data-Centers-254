import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import {
  upsertSubscriber,
  type SubscriberRole,
  type SubscriberRecord,
} from '@/lib/newsletter-store';
import { signActionToken } from '@/lib/subscribe-tokens';
import {
  getResendClient,
  maskEmail,
} from '@/lib/resend-audience';

/**
 * Newsletter subscription endpoint ("The Rack Report") - double opt-in.
 *
 * Flow (privacy-first, Kenya DPA 2019 aligned):
 *   1. The signup is persisted via @/lib/newsletter-store as `unverified`.
 *      This store is always written (Upstash Redis when configured, in-memory
 *      fallback otherwise) so signups are never lost while a vendor key is
 *      missing.
 *   2. A confirmation email with a signed, expiring verification link is
 *      sent through Resend. NOTHING is pushed to the Resend audience here -
 *      the address only becomes a mailing-list contact after the link is
 *      followed (see /api/subscribe/verify).
 *   3. Re-signups of an unverified address re-send the confirmation email;
 *      verified addresses answer "Already subscribed".
 *
 * Environment variables:
 *   RESEND_API_KEY      (required for the confirmation email)
 *   RESEND_FROM_EMAIL   (required, e.g. "The Rack Report <news@example.com>";
 *                        the domain must be verified in Resend - onboarding@
 *                        resend.dev cannot deliver to arbitrary subscribers)
 *   SUBSCRIBE_SECRET    (required, >=32 chars; signs verify/unsubscribe links)
 *   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN  (optional, persistent
 *                        storage; memory otherwise)
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_SOURCE_LENGTH = 60;

// Anti-bombing: 10 signups per minute per IP (on top of the global proxy.ts
// limiter) so third-party addresses can't be mass-subscribed.
const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;

const VALID_ROLES = new Set([
  'operator',
  'leadership',
  'investor',
  'journalist',
  'vendor',
  'student',
  'other',
]);

type EmailSendResult = 'sent' | 'config-missing' | 'failed';

function sanitizeSource(raw: unknown): string {
  if (typeof raw !== 'string') return 'homepage';
  return raw.replace(/[<>]/g, '').trim().substring(0, MAX_SOURCE_LENGTH) || 'homepage';
}

function sanitizeRole(raw: unknown): SubscriberRole {
  const v = typeof raw === 'string' ? raw.toLowerCase().trim() : '';
  return (VALID_ROLES.has(v) ? v : 'other') as SubscriberRole;
}

function sanitizeCompany(raw: unknown): string {
  return typeof raw === 'string'
    ? raw.replace(/[<>]/g, '').trim().substring(0, 80)
    : '';
}

function confirmationEmailHtml(verifyUrl: string, unsubscribeUrl: string): string {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#0b1e3c;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;color:#e6edf5;">
    <p style="font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#7dd3fc;margin:0 0 8px;">Data Centre 254</p>
    <h1 style="font-size:22px;margin:0 0 16px;color:#ffffff;">Confirm your subscription</h1>
    <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
      You asked to subscribe to <strong>The Rack Report</strong> - Data Centre 254's
      weekly intelligence briefing on Kenya's data centres, connectivity, and power infrastructure.
    </p>
    <p style="font-size:15px;line-height:1.6;margin:0 0 24px;">
      Confirm it was you to start receiving the briefing:
    </p>
    <p style="margin:0 0 24px;">
      <a href="${verifyUrl}" style="display:inline-block;background:#0ea5e9;color:#04121f;font-weight:bold;padding:12px 24px;border-radius:8px;text-decoration:none;">Confirm my subscription</a>
    </p>
    <p style="font-size:13px;line-height:1.6;color:#9fb1c7;margin:0 0 8px;">
      This link expires in 7 days. If the button does not work, copy this address into your browser:<br>
      <span style="word-break:break-all;">${verifyUrl}</span>
    </p>
    <hr style="border:none;border-top:1px solid #1e3a5f;margin:24px 0;">
    <p style="font-size:12px;line-height:1.6;color:#9fb1c7;margin:0;">
      Did not request this? Ignore this email - nothing will be sent to you and no record beyond this request is kept.
      Change your mind any time: <a href="${unsubscribeUrl}" style="color:#7dd3fc;">unsubscribe instantly</a>.
    </p>
  </div>
</body></html>`;
}

/**
 * Send the confirmation email. Returns a tri-state so the route can fail
 * closed in production when the email stack is unconfigured, mirroring the
 * contact route's pattern.
 */
async function sendConfirmationEmail(
  email: string,
  origin: string
): Promise<EmailSendResult> {
  const resend = getResendClient();
  const verifyToken = signActionToken(email, 'verify');
  const unsubToken = signActionToken(email, 'unsubscribe', 365 * 24 * 3600);
  const from = process.env.RESEND_FROM_EMAIL;

  if (!resend || !verifyToken || !from) {
    console.error(
      '[subscribe] email stack unconfigured (need RESEND_API_KEY, RESEND_FROM_EMAIL, SUBSCRIBE_SECRET)'
    );
    return 'config-missing';
  }

  try {
    const { error } = await resend.emails.send({
      from,
      to: email,
      subject: 'Confirm your subscription to The Rack Report',
      html: confirmationEmailHtml(
        `${origin}/api/subscribe/verify?token=${verifyToken}`,
        `${origin}/api/subscribe/unsubscribe?token=${unsubToken}`
      ),
    });
    if (error) {
      console.error('[subscribe] confirmation email rejected:', error.message ?? error);
      return 'failed';
    }
    return 'sent';
  } catch (err) {
    console.error(
      '[subscribe] confirmation email threw:',
      err instanceof Error ? err.message : err
    );
    return 'failed';
  }
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if ((await rateLimit('subscribe', ip, RATE_LIMIT, WINDOW_MS)).limited) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a minute." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Honeypot, bots fill every field. Pretend success, record nothing.
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ message: 'Check your inbox to confirm your subscription' }, { status: 201 });
    }

    const { email } = body;
    const source = sanitizeSource(body?.source);
    const role = sanitizeRole(body?.role);
    const companyType = sanitizeCompany(body?.companyType);

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    if (normalized.length > MAX_EMAIL_LENGTH || !EMAIL_REGEX.test(normalized)) {
      return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 });
    }

    // 1. Our store of record: role segmentation + persistence, always
    //    unverified until the emailed link is followed.
    let record: SubscriberRecord | null = null;
    try {
      const result = await upsertSubscriber({
        email: normalized,
        role,
        companyType,
        source,
        status: 'unverified',
      });
      record = result.record;
    } catch (storeErr) {
      console.error('[subscribe] store failed:', storeErr);
    }

    // 2. Double opt-in: unverified (new or retrying) addresses get a
    //    confirmation email. No Resend audience write happens here.
    const needsConfirmation = record && record.status === 'unverified';
    if (needsConfirmation) {
      const sent = await sendConfirmationEmail(normalized, req.nextUrl.origin);
      if (sent !== 'sent') {
        if (process.env.NODE_ENV === 'production') {
          // Fail closed with a clear, retryable message - never a silent
          // black hole where no mail ever arrives.
          return NextResponse.json(
            { error: 'Email confirmation is temporarily unavailable. Please try again in a few minutes.' },
            { status: 503 }
          );
        }
        console.log(`[subscribe] dev mode: skipping confirmation email to ${maskEmail(normalized)}`);
      }
      const message = 'Check your inbox to confirm your subscription';
      return NextResponse.json({ message }, { status: 200 });
    }

    // 3. Already verified.
    return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
  } catch (err) {
    console.error('[subscribe] Unexpected error:', err);
    return NextResponse.json({ error: 'Something went wrong. Try again.' }, { status: 500 });
  }
}
