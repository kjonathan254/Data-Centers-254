/**
 * Server-side PostHog capture (posthog-node).
 *
 * Purpose: authoritative conversion + security events fired from API routes.
 * Client-side analytics (posthog-js) can be blocked by ad-blockers or the
 * consent gate; these server events are not, so dashboards built on them
 * always show true volumes.
 *
 * Privacy posture (Kenya DPA 2019):
 *  - No PII is captured. distinct_id is the constant "server" (events are
 *    aggregate counters, not user profiles). Never pass emails, names or
 *    message bodies into properties.
 *  - These events are operational logging of actions the visitor explicitly
 *    performed (subscribe / contact / sponsor click), equivalent to server
 *    logs, and are not gated behind the analytics consent banner.
 *
 * Safe no-op: if NEXT_PUBLIC_POSTHOG_KEY is absent (local dev, preview
 * without env), every helper returns silently. Fire-and-forget: capture()
 * on posthog-node queues and flushes on its own interval; failures never
 * propagate to the route handler.
 */

import { PostHog } from "posthog-node";

const INGEST_HOST = "https://us.i.posthog.com";

let client: PostHog | null = null;

function getClient(): PostHog | null {
  if (typeof window !== "undefined") return null; // server-only guard
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return null;
  if (!client) {
    client = new PostHog(key, {
      host: INGEST_HOST,
      // Small batches, frequent flushes: serverless instances are short-lived
      // and we do not want to hold events in memory waiting for volume.
      flushAt: 1,
      flushInterval: 5_000,
      // Never let analytics delay or break a route handler response.
      requestTimeout: 3_000,
    });
  }
  return client;
}

/**
 * Awaitable capture: sends the event and flushes before resolving. Use this
 * on conversion paths (subscribe / contact / sponsor) — serverless functions
 * can freeze right after the response is returned, so fire-and-forget sends
 * get lost. The cost is one POST to PostHog (~100ms), acceptable for rare,
 * high-value events.
 */
export async function captureServerEvent(
  event: string,
  properties?: Record<string, unknown>,
): Promise<void> {
  const ph = getClient();
  if (!ph) return;
  try {
    ph.capture({ event, distinctId: "server", properties });
    await ph.flush();
  } catch {
    // Analytics must never break a business route.
  }
}

/**
 * Fire-and-forget variant for high-volume best-effort telemetry (e.g. CSP
 * violations), where latency matters more than guaranteed delivery. The
 * durable record for those remains the server log line.
 */
export function captureServerEventAsync(
  event: string,
  properties?: Record<string, unknown>,
): void {
  const ph = getClient();
  if (!ph) return;
  try {
    ph.capture({ event, distinctId: "server", properties });
  } catch {
    // ignore
  }
}
