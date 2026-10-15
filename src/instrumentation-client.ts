// Client-side Sentry initialisation — Next.js bundles this automatically
// (instrumentation-client convention); no <Script> tag or layout change needed.
//
// Inert until NEXT_PUBLIC_SENTRY_DSN is defined at build time: events are
// dropped silently, so shipping this before the Sentry project exists is safe.
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment:
    process.env.SENTRY_ENVIRONMENT ?? process.env.VERCEL_ENV ?? "development",
  tracesSampleRate: 1.0,
  // sendDefaultPii deliberately left at its default (false).
  // Browser events are POSTed to our own origin (/monitoring) and proxied to
  // Sentry server-side by the withSentryConfig tunnelRoute option. Two wins:
  //  - the enforced CSP stays untouched (tunnel traffic is connect-src 'self')
  //  - ad-blockers that filter *.ingest.sentry.io can't eat the events
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
