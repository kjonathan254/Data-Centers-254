// Sentry server-side initialisation (Node runtime) — imported by
// src/instrumentation.ts, which Next.js loads once per server process.
//
// Inert until NEXT_PUBLIC_SENTRY_DSN exists in the environment: the SDK
// initialises fine without a DSN and silently drops every event, so this
// file is safe to deploy before the Sentry project is created.
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment:
    process.env.SENTRY_ENVIRONMENT ?? process.env.VERCEL_ENV ?? "development",
  // 100% of requests traced — DC254 traffic is small and the Developer plan
  // quota is 10M spans/month. Tune down here if that ever changes.
  tracesSampleRate: 1.0,
  // sendDefaultPii deliberately left at its default (false): no cookies, no
  // user IPs, no request bodies leave the server.
});
