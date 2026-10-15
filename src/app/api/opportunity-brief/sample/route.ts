import { NextRequest, NextResponse } from "next/server";
import { incrCounter } from "@/lib/opportunity-brief-store";

/**
 * GET /api/opportunity-brief/sample
 *
 * Counting redirect to the redacted sample PDF. Gives the product funnel a
 * real "sample downloads" metric without personal data: an aggregate
 * Upstash counter only (ob:sample:views), same pattern as the sponsor click
 * tallies - no cookies, no IPs stored, no consent-gate interaction.
 *
 * Fail-open by design: if Redis hiccups the visitor still gets the PDF and
 * only the metric loses one increment, the opposite trade-off from the
 * enquiry route (which must be fail-closed because it holds buyer PII).
 */

const SAMPLE_PATH = "/reports/dc254-opportunity-brief-sample-redacted.pdf";

export async function GET(req: NextRequest) {
  try {
    await incrCounter("ob:sample:views");
  } catch (err) {
    console.warn(
      "[ob-sample] view counter unavailable, serving PDF anyway:",
      err instanceof Error ? err.message : err
    );
  }
  const url = new URL(SAMPLE_PATH, req.url);
  return NextResponse.redirect(url, {
    status: 302,
    headers: { "Cache-Control": "no-store" },
  });
}
