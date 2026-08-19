import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter (resets per deployment on Vercel serverless)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT = 60; // requests per window
const WINDOW_MS = 60_000; // 1 minute window

function getRateLimitKey(req: NextRequest): string {
  // Use CF-Connecting-IP (Cloudflare/Vercel) or fallback to X-Forwarded-For
  const ip =
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';
  return ip;
}

export function middleware(req: NextRequest) {
  // Only rate-limit API routes (except the root /api health check)
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith('/api/') || pathname === '/api') {
    return NextResponse.next();
  }

  const key = getRateLimitKey(req);
  const now = Date.now();

  let entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    rateLimitMap.set(key, entry);
  }

  entry.count++;

  const remaining = Math.max(0, RATE_LIMIT - entry.count);
  const resetAt = Math.ceil(entry.resetAt / 1000);

  const res = NextResponse.next();
  res.headers.set('X-RateLimit-Limit', String(RATE_LIMIT));
  res.headers.set('X-RateLimit-Remaining', String(remaining));
  res.headers.set('X-RateLimit-Reset', String(resetAt));

  if (entry.count > RATE_LIMIT) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((entry.resetAt - now) / 1000)),
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
