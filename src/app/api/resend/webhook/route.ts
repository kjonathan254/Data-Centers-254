import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { scrubSubscriber } from '@/lib/newsletter-store';

/**
 * Resend webhook receiver: keeps the local store honest when mail bounces
 * hard or a recipient flags the briefing as spam. Bounced (permanent) and
 * complained recipients are erased from the subscription record via the
 * same scrub path as manual unsubscribe - no personal details retained.
 *
 * Signature verification (Svix scheme, what Resend uses):
 *   signed content = "{svix-id}.{svix-timestamp}.{raw body}"
 *   expected       = HMAC-SHA256(base64decode(secret without "whsec_"), ...)
 *   headers        = svix-id, svix-timestamp, svix-signature ("v1,<b64> ...")
 * Timestamps outside a 5-minute tolerance are rejected (replay defence).
 *
 * Environment variables:
 *   RESEND_WEBHOOK_SECRET  (required in production; without it the endpoint
 *                           refuses unverified calls - configure in the
 *                           Resend dashboard for events email.bounced and
 *                           email.complained)
 */

const TIMESTAMP_TOLERANCE_SECONDS = 5 * 60;

const ERASURE_EVENTS = new Set([
  'email.bounced', // hard bounces only; soft bounces retry on their own
  'email.complained',
]);

function extractRecipient(data: unknown): string | null {
  if (typeof data !== 'object' || data === null) return null;
  const to = (data as { to?: unknown }).to;
  const raw = Array.isArray(to) ? to[0] : to;
  if (typeof raw !== 'string' || !raw.trim()) return null;
  // "Name <user@host>" -> "user@host"
  const angled = raw.match(/<([^>]+)>/);
  const candidate = (angled ? angled[1] : raw).trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate) ? candidate : null;
}

function signatureIsValid(
  id: string | null,
  timestamp: string | null,
  signatureHeader: string | null,
  body: string
): boolean {
  if (!id || !timestamp || !signatureHeader) return false;
  const secretRaw = process.env.RESEND_WEBHOOK_SECRET;
  if (!secretRaw) return false;

  const tsSeconds = Number(timestamp);
  if (!Number.isFinite(tsSeconds)) return false;
  const skew = Math.abs(Date.now() / 1000 - tsSeconds);
  if (skew > TIMESTAMP_TOLERANCE_SECONDS) return false;

  let key: Buffer;
  try {
    key = Buffer.from(secretRaw.replace(/^whsec_/, ''), 'base64');
  } catch {
    return false;
  }
  if (key.length === 0) return false;

  const expected = createHmac('sha256', key)
    .update(`${id}.${timestamp}.${body}`)
    .digest('base64');
  const expectedBuf = Buffer.from(expected);

  return signatureHeader
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean)
    .some((part) => {
      const [version, hash] = part.split(',');
      if (version !== 'v1' || !hash) return false;
      const given = Buffer.from(hash);
      if (given.length !== expectedBuf.length) return false;
      return timingSafeEqual(given, expectedBuf);
    });
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  await rateLimit('resend-webhook', ip, 30, 60_000);

  const body = await req.text();

  if (!signatureIsValid(
    req.headers.get('svix-id'),
    req.headers.get('svix-timestamp'),
    req.headers.get('svix-signature'),
    body
  )) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
  }

  let event: { type?: string; data?: unknown };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  if (event.type && ERASURE_EVENTS.has(event.type)) {
    const email = extractRecipient(event.data);
    if (email) {
      try {
        await scrubSubscriber(email);
      } catch (err) {
        // Acknowledge anyway so Resend does not retry-storm; the record
        // stays until the next event arrives (scrub is idempotent).
        console.error(
          '[resend-webhook] scrub failed:',
          err instanceof Error ? err.message : err
        );
      }
    }
  }

  // Everything else (delivered, opened, clicked, soft bounce, ...) is
  // acknowledged but not acted on - our store tracks consent, not engagement.
  return NextResponse.json({ received: true }, { status: 200 });
}
