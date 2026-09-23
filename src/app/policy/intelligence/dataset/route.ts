import { getPolicyDataset } from "@/lib/policy";

/**
 * Dataset download endpoint (Control Room Phase 2).
 *
 * Serves the full policy evidence dataset as a JSON file download. Reads
 * through the same typed loader as the dashboard, so what the page renders
 * and what the file contains can never diverge.
 *
 * Fully static-friendly: no request-time dynamic APIs, so Next prerenders
 * this response and Vercel serves it from the edge cache.
 */

const FILE_NAME = "policy-claims-2026-Q3.json";

export function GET() {
  const body = JSON.stringify(getPolicyDataset(), null, 2);
  return new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${FILE_NAME}"`,
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
