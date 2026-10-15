// Next.js instrumentation hook — loaded once per server process by the
// App Router. `onRequestError` funnels every unhandled server error (route
// handlers, server components, server actions) into Sentry without touching
// a single route file.
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  } else {
    await import("./sentry.server.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
