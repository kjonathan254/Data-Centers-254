import { getFacilities } from "@/lib/directory-data";
import { SITE_URL } from "@/lib/site";

/**
 * Full directory as CSV — the "free, no signup wall" data export.
 * Prerendered at build time (force-static) so it stays in sync with
 * src/lib/directory-data.ts and costs nothing to serve.
 */

export const dynamic = "force-static";
export const revalidate = false;

function csvCell(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  const s = String(value);
  // Quote when the cell contains comma, quote or newline; double embedded quotes.
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function GET() {
  const facilities = getFacilities();

  const header = [
    "name",
    "slug",
    "operator",
    "operator_type",
    "status",
    "city",
    "region",
    "address",
    "it_load_mw",
    "total_capacity_mw",
    "rack_count",
    "tier_rating",
    "facility_type",
    "ai_ready",
    "opened_date",
    "expansion_date",
    "cooling_type",
    "power_source",
    "renewable_claim",
    "notable",
    "last_verified",
    "data_confidence",
    "data_source",
    "directory_url",
  ];

  const rows = facilities.map((f) =>
    [
      f.name,
      f.slug,
      f.operator.name,
      f.operator.type,
      f.status,
      f.city,
      f.region,
      f.address,
      f.itLoadMw,
      f.totalCapacityMw,
      f.rackCount,
      f.tierRating,
      f.facilityType,
      f.aiReady ? "true" : "false",
      f.openedDate,
      f.expansionDate,
      f.coolingType,
      f.powerSource,
      f.renewableClaim,
      f.notable,
      f.lastVerified,
      f.dataConfidence,
      f.dataSource,
      `${SITE_URL}/directory/${f.slug}`,
    ]
      .map(csvCell)
      .join(",")
  );

  const csv = "\uFEFF" + header.join(",") + "\n" + rows.join("\n") + "\n";

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="dc254-kenya-data-centre-directory.csv"',
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
