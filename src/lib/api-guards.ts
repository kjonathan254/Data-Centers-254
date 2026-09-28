import type { NextRequest } from "next/server";

/**
 * Shared API route guards (security-audit remediation batch).
 *
 * Same-origin enforcement for state-changing POST routes: cross-site form
 * posts (text/plain trick) and third-party fetch() calls carry a mismatching
 * Origin / Sec-Fetch-Site header, so we can reject them cheaply before any
 * rate-limit spend or vendor call happens. Non-browser clients (curl,
 * server-to-server webhooks) send neither header and stay covered by their
 * endpoint rate limiters instead.
 */

/** True when the request is same-origin/same-site, or not browser-verifiable. */
export function isSameOriginRequest(req: NextRequest): boolean {
  // Modern browsers always set Sec-Fetch-Site on cross-site POSTs.
  const site = req.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "same-site" && site !== "none") {
    return false;
  }

  const origin = req.headers.get("origin");
  if (!origin) return true; // not a CORS-governed request (curl, webhooks)

  try {
    const originHost = new URL(origin).host;
    const host = req.headers.get("host");
    return !!host && originHost === host;
  } catch {
    return false; // malformed Origin can never be trusted
  }
}

/** Standard 403 response for failed origin checks. */
export function originRejectedResponse(): Response {
  return Response.json(
    { error: "Cross-origin requests are not allowed" },
    { status: 403 }
  );
}

/**
 * Race a promise against a wall-clock timeout. The loser's timer is always
 * cleared; a timed-out underlying request may still complete server-side but
 * the caller treats it as failed (fail-closed posture).
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label = "operation"
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
