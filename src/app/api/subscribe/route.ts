import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

/**
 * Newsletter subscription endpoint.
 *
 * Stores subscribers as contacts in Resend (https://resend.com) — no database,
 * no filesystem writes. Works on serverless platforms (Vercel) where the
 * filesystem is read-only.
 *
 * Environment variables:
 *   RESEND_API_KEY     (required)  API key from the Resend dashboard
 *   RESEND_SEGMENT_ID  (optional)  Segment/Audience ID to add contacts to.
 *                                  Create one under Dashboard → Contacts → Segments.
 *
 * Subscribers appear in the Resend dashboard under Contacts.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_SOURCE_LENGTH = 60;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function sanitizeSource(raw: unknown): string {
  if (typeof raw !== 'string') return 'homepage';
  return raw.replace(/[<>]/g, '').trim().substring(0, MAX_SOURCE_LENGTH) || 'homepage';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;
    const source = sanitizeSource(body?.source);

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    if (normalized.length > MAX_EMAIL_LENGTH || !EMAIL_REGEX.test(normalized)) {
      return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 });
    }

    const resend = getResendClient();
    if (!resend) {
      console.error(
        `[subscribe] RESEND_API_KEY is not configured — subscriber not saved (${normalized}, source: ${source}).`
      );
      return NextResponse.json(
        { error: 'Newsletter service is not configured. Please try again later.' },
        { status: 503 }
      );
    }

    // Optional segment (formerly "Audience") to group newsletter contacts.
    const segmentId = process.env.RESEND_SEGMENT_ID || process.env.RESEND_AUDIENCE_ID;
    const payload = {
      email: normalized,
      unsubscribed: false,
      ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
    };

    const { data, error } = await resend.contacts.create(payload);

    if (error) {
      const message = (error.message || '').toLowerCase();
      // Duplicate signups are fine — treat as idempotent success.
      if (message.includes('already exists') || message.includes('duplicate')) {
        return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
      }
      console.error('[subscribe] Resend API error:', error);
      return NextResponse.json({ error: 'Something went wrong. Try again.' }, { status: 502 });
    }

    console.log(`[subscribe] New subscriber: ${normalized} (source: ${source}, id: ${data?.id})`);
    return NextResponse.json({ message: 'Subscribed' }, { status: 201 });
  } catch (err) {
    console.error('[subscribe] Unexpected error:', err);
    return NextResponse.json({ error: 'Something went wrong. Try again.' }, { status: 500 });
  }
}
