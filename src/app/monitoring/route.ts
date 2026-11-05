import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";

// Sentry envelope tunnel (manual-setup pattern from Sentry's Next.js docs).
// The browser SDK POSTs envelopes to this same-origin path; the route forwards
// them to the project's ingest host. Two reasons this exists:
//  - browser traffic stays same-origin, so the enforced CSP keeps
//    connect-src 'self' and no *.ingest.*.sentry.io origin is ever allowed;
//  - ad-blockers that filter *.ingest.*.sentry.io can't eat the events.
//
// Why manual: `next build` does not materialise withSentryConfig's
// tunnelRoute handler under Turbopack (verified in production 2026-10-15 —
// POST /monitoring 404'd), so the route is defined here explicitly.
//
// Guard rails keep this from becoming an open relay: envelope content-type
// only, 1 MB cap, and the destination is always the configured project DSN
// host — never attacker-chosen.

const MAX_ENVELOPE_BYTES = 1_000_000;
const RATE_LIMIT = 20;
const WINDOW_MS = 60_000;

export async function POST(request: NextRequest) {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    return NextResponse.json({ error: "Sentry DSN not configured" }, { status: 500 });
  }

  // Security audit 2026-11-05 (finding monitoring:tunnel:unthrottled-vendor-relay):
  // this route lives outside the /api/* proxy matcher, so the global per-IP
  // limiter never applies. It converts anonymous requests into metered Sentry
  // ingest, so it carries its own bucket like every sibling spend endpoint.
  const limited = await rateLimit("sentry-tunnel", clientIp(request), RATE_LIMIT, WINDOW_MS);
  if (limited.limited) {
    return new NextResponse(null, {
      status: 429,
      headers: { "Retry-After": String(Math.ceil(WINDOW_MS / 1000)) },
    });
  }

  // Reject oversized bodies before buffering them.
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_ENVELOPE_BYTES) {
    return NextResponse.json({ error: "Envelope too large" }, { status: 413 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  // Three legitimate shapes, observed against the real SDK (2026-10-15):
  //  - text envelopes: text/plain (fetch's default for string bodies, chosen
  //    by the SDK because it is CORS-safelisted);
  //  - binary-serialized envelopes — compressed replay segments — go out with
  //    NO content-type header at all (fetch omits it for Uint8Array bodies);
  //  - hand-scripted callers: the canonical application/x-sentry-envelope.
  // Anything else is refused. The destination below is pinned to the
  // configured DSN — that, not this check, is the open-relay defence.
  const contentTypeAllowed =
    contentType.startsWith("text/plain") ||
    contentType.includes("application/x-sentry-envelope") ||
    contentType.length === 0;
  if (!contentTypeAllowed) {
    return NextResponse.json({ error: "Unexpected content type" }, { status: 415 });
  }

  const raw = await request.arrayBuffer();
  if (raw.byteLength > MAX_ENVELOPE_BYTES) {
    return NextResponse.json({ error: "Envelope too large" }, { status: 413 });
  }

  const url = new URL(dsn);
  const envelopeUrl = `https://${url.host}/api/${url.pathname.replace(/^\//, "")}/envelope/`;
  const upstream = await fetch(envelopeUrl, {
    method: "POST",
    body: raw,
    headers: {
      "Content-Type": "application/x-sentry-envelope",
      "X-Sentry-Auth": `Sentry sentry_version=7, sentry_key=${url.username}, sentry_client=sentry.javascript.nextjs/11.8.0`,
    },
  });

  // 200 keeps the SDK happy; anything else is surfaced so breakage is visible.
  return new NextResponse(null, { status: upstream.ok ? 200 : 502 });
}
