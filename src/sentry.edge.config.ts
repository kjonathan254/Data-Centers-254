// Sentry Edge runtime initialisation — imported by src/instrumentation.ts
// for middleware/edge requests.
//
// Inert until NEXT_PUBLIC_SENTRY_DSN exists in the environment: the SDK
// initialises fine without a DSN and silently drops every event.
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment:
    process.env.SENTRY_ENVIRONMENT ?? process.env.VERCEL_ENV ?? "development",
  tracesSampleRate: 1.0,
  // sendDefaultPii deliberately left at its default (false): no cookies, no
  // user IPs, no request bodies leave the edge runtime.
});
