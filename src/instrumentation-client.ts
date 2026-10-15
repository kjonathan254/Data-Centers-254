// Client-side Sentry initialisation — Next.js bundles this automatically
// (instrumentation-client convention); no <Script> tag or layout change needed.
//
// Inert until NEXT_PUBLIC_SENTRY_DSN is defined at build time: events are
// dropped silently, so shipping this before the Sentry project exists is safe.
import * as Sentry from "@sentry/nextjs";

// Session Replay is consent-gated exactly like GA4 and Clarity (Kenya DPA 2019
// / GDPR posture in components/consent-gate.tsx): it records only for visitors
// who explicitly accepted analytics. The choice is re-read from localStorage at
// SDK init (this file runs before React mounts) and honoured mid-session via
// the events the consent gate dispatches. Error monitoring itself stays
// un-gated — it is operational telemetry, not analytics.
const CONSENT_KEY = "dc_consent";

function analyticsConsentGranted(): boolean {
  try {
    return window.localStorage.getItem(CONSENT_KEY) === "1";
  } catch {
    // Storage unavailable (private mode) — treat as not consented.
    return false;
  }
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // NEXT_PUBLIC_* is load-bearing here: only NEXT_PUBLIC_* vars are inlined
  // into client bundles, so SENTRY_ENVIRONMENT/VERCEL_ENV would both be
  // undefined in the browser and every client event would be tagged
  // "development" even in production. Vercel sets NEXT_PUBLIC_SENTRY_ENVIRONMENT
  // per target (production/preview/development); local dev falls through.
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? "development",
  tracesSampleRate: 1.0,
  // sendDefaultPii deliberately left at its default (false).
  // Browser events are POSTed to our own origin (/monitoring) and proxied to
  // Sentry server-side by src/app/monitoring/route.ts. Two wins:
  //  - the enforced CSP stays untouched (tunnel traffic is connect-src 'self')
  //  - ad-blockers that filter *.ingest.sentry.io can't eat the events
  tunnel: "/monitoring",
  integrations: analyticsConsentGranted()
    ? [
        // Session Replay: DOM text is captured, input values are masked by
        // default and request/response bodies are never recorded. The
        // compression worker runs from a blob: URL — hence worker-src in the
        // CSP (next.config.ts).
        Sentry.replayIntegration(),
      ]
    : [],
  // Session Replay sampling (production values, verified end-to-end at 1.0 on
  // 2026-10-15 — replay 887744c8… in project data-centers-254): 10% of
  // consented sessions, and 100% of consented sessions that hit a client
  // error, permanently.
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// Consent granted after this page had already loaded: attach Replay to the
// live session (Sentry's documented lazy-consent recipe via addIntegration).
// Guarded so a double dispatch or a consent-tooling bug can never break the
// page.
window.addEventListener("dc254:consent-granted", () => {
  try {
    const client = Sentry.getClient();
    if (!client || client.getIntegrationByName("Replay")) return;
    if (!analyticsConsentGranted()) return;
    client.addIntegration(Sentry.replayIntegration());
  } catch {
    // Consent tooling must never break the page.
  }
});

// Consent withdrawn mid-session: stop recording immediately (withdrawal must
// be as effective as granting). New sessions won't record because the
// init-time check re-reads the revoked value.
window.addEventListener("dc254:consent-reset", () => {
  try {
    const integration = Sentry.getClient()?.getIntegrationByName(
      "Replay"
    ) as unknown as { _replay?: { stop?: () => void } } | undefined;
    integration?._replay?.stop?.();
  } catch {
    // best effort only
  }
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
