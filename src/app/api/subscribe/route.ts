import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import {
  upsertSubscriber,
  storageBackend,
  type SubscriberRole,
} from '@/lib/newsletter-store';

/**
 * Newsletter subscription endpoint ("The Rack Report").
 *
 * Storage is layered so signups never die just because a vendor key is
 * missing:
 *   1. ALWAYS persisted via @/lib/newsletter-store (Upstash Redis when
 *      UPSTASH_REDIS_REST_URL/TOKEN are set; in-memory fallback otherwise).
 *      This store keeps the role segmentation the /advertise media kit
 *      reports on — previously a missing RESEND_API_KEY meant the signup
 *      was lost entirely (hard 503).
 *   2. When RESEND_API_KEY is configured, the contact is also pushed to the
 *      Resend audience (idempotent on duplicates).
 *
 * Environment variables:
 *   RESEND_API_KEY      (optional)  enables the Resend audience sync
 *   RESEND_SEGMENT_ID   (optional)  Segment/Audience ID for the newsletter
 *   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN  (optional)
 *                                   persistent storage; memory otherwise
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

/** Never log a full subscriber address — PII belongs out of logs. */
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "<redacted>";
  return `${local.slice(0, 2)}***@${domain.slice(0, 2)}***`;
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

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

    // Honeypot — bots fill every field. Pretend success, record nothing.
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ message: 'Subscribed' }, { status: 201 });
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

    // 1. Our store of record — role segmentation + persistence.
    let created = false;
    try {
      const result = await upsertSubscriber({
        email: normalized,
        role,
        companyType,
        source,
        status: 'unverified',
      });
      created = result.created;
    } catch (storeErr) {
      console.error('[subscribe] store failed:', storeErr);
      // A store outage is not the visitor's problem — still try Resend.
    }

    // 2. Resend audience sync (optional).
    const resend = getResendClient();
    if (resend) {
      try {
        const segmentId = process.env.RESEND_SEGMENT_ID || process.env.RESEND_AUDIENCE_ID;
        const payload = {
          email: normalized,
          unsubscribed: false,
          ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
        };
        const { error } = await resend.contacts.create(payload);
        if (error) {
          const message = (error.message || '').toLowerCase();
          if (!message.includes('already exists') && !message.includes('duplicate')) {
            console.error('[subscribe] Resend API error:', error);
          }
        }
      } catch (resendErr) {
        console.error('[subscribe] Resend sync failed:', resendErr);
      }
    } else {
      console.log(
        `[subscribe] stored (${storageBackend()}, no RESEND_API_KEY): ${maskEmail(normalized)} role=${role} source=${source}`
      );
    }

    if (!created) {
      return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
    }
    return NextResponse.json({ message: 'Subscribed' }, { status: 201 });
  } catch (err) {
    console.error('[subscribe] Unexpected error:', err);
    return NextResponse.json({ error: 'Something went wrong. Try again.' }, { status: 500 });
  }
}
