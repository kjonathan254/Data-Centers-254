import { NextResponse } from 'next/server';
import { persistentLimitingActive } from '@/lib/rate-limit';

/**
 * Deployment self-check for operators (the site owner, not the public).
 *
 * Answers the one question that used to require opening Vercel logs:
 * "why does the signup form say the email service is unavailable?"
 * The subscribe/contact routes fail closed with a 503 whenever any of the
 * email-stack variables is missing, so this endpoint reports PRESENCE ONLY -
 * boolean checks, never values - for each variable that must be configured
 * in Vercel → Settings → Environment Variables:
 *
 *   RESEND_API_KEY      sends the double opt-in + contact emails
 *   RESEND_FROM_EMAIL   verified sender, e.g. "The Rack Report <news@your-domain>"
 *   SUBSCRIBE_SECRET    >= 32 chars, signs verify/unsubscribe links
 *
 * After adding or changing any of these, REDEPLOY - env vars only take
 * effect on a fresh deployment. Then this page should read
 * emailStack.configured: true and the forms will work immediately.
 */

export const dynamic = 'force-dynamic';

export async function GET() {
  const resendKey = Boolean(process.env.RESEND_API_KEY);
  const fromEmail = Boolean(process.env.RESEND_FROM_EMAIL);
  const rawSecret = process.env.SUBSCRIBE_SECRET;
  const secretOk = Boolean(rawSecret && rawSecret.trim().length >= 32);

  return NextResponse.json(
    {
      ok: true,
      time: new Date().toISOString(),
      emailStack: {
        configured: resendKey && fromEmail && secretOk,
        resendApiKey: resendKey,
        resendFromEmail: fromEmail,
        subscribeSecret: secretOk,
      },
      rateLimiting: persistentLimitingActive() ? 'persistent' : 'memory',
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
