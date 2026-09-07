import { NextRequest, NextResponse } from 'next/server';
import { saveExportInterest } from '@/lib/newsletter-store';

/**
 * Pre-checkout capture for the Premium Market Data Export
 * (/data-exports). Records the email + which export the visitor wants so
 * launch notifications and invoice requests have a real list behind them.
 * Storage follows @/lib/newsletter-store (Upstash when configured).
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KINDS = new Set(['q4-2026-snapshot', 'invoice-request', 'notify-only']);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const email =
      typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const kind =
      typeof body?.kind === 'string' && KINDS.has(body.kind)
        ? body.kind
        : 'notify-only';

    if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Enter a valid email address' },
        { status: 400 }
      );
    }

    // Honeypot — pretend success, record nothing.
    if (typeof body?.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ message: 'Noted' }, { status: 201 });
    }

    const created = await saveExportInterest(email, kind);
    return NextResponse.json(
      { message: created ? 'Noted' : 'Already on the list' },
      { status: created ? 201 : 200 }
    );
  } catch (err) {
    console.error('[export-interest] error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Try again.' },
      { status: 500 }
    );
  }
}
