import { NextRequest, NextResponse } from "next/server";
import { rateLimit, clientIp } from "@/lib/rate-limit";

/**
 * POST /api/csp-report — Content-Security-Policy violation collector.
 *
 * Audit remediation #8: the site ships `Content-Security-Policy-Report-Only`
 * (see next.config.ts) while we observe what a real policy would block. Every
 * modern browser POSTs a violation JSON here via the policy's `report-uri`
 * directive. After a clean observation window the header flips from
 * -Report-Only to enforced, and this endpoint becomes the regression tripwire.
 *
 * Privacy posture (mirrors the rest of the API):
 *  - rate limited (10/min per IP) so the endpoint can't be abused as a log-spam
 *    amplifier;
 *  - only the PATH of the reporting document is logged, never its query string,
 *    and no reporter IP is logged;
 *  - bodies over 4 KB are dropped unread — real CSP reports are a few hundred
 *    bytes;
 *  - parsing is defensive: anything malformed is silently discarded with 204.
 *
 * Browsers send report-uri payloads as {"csp-report": {...}}; the newer
 * report-to API nests under "body". Both are accepted.
 */
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if ((await rateLimit("csp-report", ip, 10, 60_000)).limited) {
    return new NextResponse(null, { status: 429 });
  }

  try {
    const raw = await req.text();
    if (raw.length > 4_096) return new NextResponse(null, { status: 204 });

    const parsed = JSON.parse(raw) as Record<string, Record<string, unknown>>;
    const report = parsed["csp-report"] ?? parsed["body"];
    if (!report || typeof report !== "object") {
      return new NextResponse(null, { status: 204 });
    }

    // Path only — strip query/hash so no caller-controlled string beyond the
    // route name ever reaches logs.
    const docUri = typeof report["document-uri"] === "string" ? report["document-uri"] : "";
    let docPath = "<unknown>";
    try {
      docPath = new URL(docUri).pathname || "/";
    } catch {
      /* keep placeholder */
    }
    const directive =
      typeof report["violated-directive"] === "string"
        ? report["violated-directive"]
        : typeof report["effectiveDirective"] === "string"
          ? report["effectiveDirective"]
          : "<unknown>";
    const blocked =
      typeof report["blocked-uri"] === "string" ? report["blocked-uri"].slice(0, 120) : "";

    // Single line, bounded, no raw report echo.
    console.log(`[csp-report] path=${docPath} directive=${directive} blocked=${blocked}`);
  } catch {
    // Malformed body — not worth a 400 round trip; browsers treat 2xx as delivered.
  }

  return new NextResponse(null, { status: 204 });
}
