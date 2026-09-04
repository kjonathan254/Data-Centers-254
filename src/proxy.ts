import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rate-limit';

// Global per-IP limiter for every /api route. Was per-instance in-memory only;
// since audit remediation #9 it upgrades to persistent/global automatically
// when Upstash Redis env vars are configured (see src/lib/rate-limit.ts).
const RATE_LIMIT = 60; // requests per window
const WINDOW_MS = 60_000; // 1 minute window

export async function proxy(req: NextRequest) {
  // Only rate-limit API routes (except the root /api health check)
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith('/api/') || pathname === '/api') {
    return NextResponse.next();
  }

  const key = clientIp(req);
  const verdict = await rateLimit('api', key, RATE_LIMIT, WINDOW_MS);
  const now = Date.now();

  const resetAt = Math.ceil(verdict.resetAt / 1000);

  const res = NextResponse.next();
  res.headers.set('X-RateLimit-Limit', String(RATE_LIMIT));
  res.headers.set('X-RateLimit-Remaining', String(verdict.remaining));
  res.headers.set('X-RateLimit-Reset', String(resetAt));

  if (verdict.limited) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.max(1, Math.ceil((verdict.resetAt - now) / 1000))),
          'X-RateLimit-Limit': String(RATE_LIMIT),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(resetAt),
        },
      }
    );
  }

  return res;
}

export const config = {
  matcher: '/api/:path*',
};
