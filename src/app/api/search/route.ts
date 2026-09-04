import { NextRequest, NextResponse } from "next/server";
import { getAllArticles } from "@/lib/articles";
import { getFacilities } from "@/lib/directory-data";

export async function GET(req: NextRequest) {
  // Cap the query: search scans every article's full text in memory, so an
  // unbounded needle turns a cheap GET into a CPU amplifier.
  const raw = req.nextUrl.searchParams.get("q")?.trim()?.toLowerCase() ?? "";
  const q = raw.slice(0, 100);
  if (!q || q.length < 2) {
    return NextResponse.json({ articles: [], facilities: [] });
  }

  // Search articles
  const allArticles = getAllArticles();
  const articles = allArticles
    .filter(
      (a) =>
        a.frontmatter.title.toLowerCase().includes(q) ||
        a.frontmatter.meta_description.toLowerCase().includes(q) ||
        a.frontmatter.primary_keyword.toLowerCase().includes(q) ||
        a.frontmatter.secondary_keywords.some((k) => k.toLowerCase().includes(q)) ||
        a.content.toLowerCase().includes(q)
    )
    .slice(0, 20)
    .map((a) => ({
      title: a.frontmatter.title,
      slug: a.frontmatter.slug,
      tlDr: a.frontmatter.meta_description,
      description: a.frontmatter.meta_description,
      cluster: a.frontmatter.cluster,
      readingTimeMin: parseInt(a.frontmatter.reading_time) || null,
      lastVerified: a.frontmatter.updated_date,
    }));

  // Search facilities
  const allFacilities = getFacilities();
  const facilities = allFacilities
    .filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.city.toLowerCase().includes(q) ||
        (f.facilityType || "").toLowerCase().includes(q) ||
        (f.tierRating || "").toLowerCase().includes(q) ||
        (f.notable || "").toLowerCase().includes(q) ||
        f.operator.name.toLowerCase().includes(q)
    )
    .slice(0, 10)
    .map((f) => ({
      name: f.name,
      slug: f.slug,
      city: f.city,
      status: f.status,
      itLoadMw: f.itLoadMw,
      tierRating: f.tierRating,
      facilityType: f.facilityType,
      notable: f.notable,
      operator: { name: f.operator.name },
      connectivityProviders: f.connectivityFacility.map((cf) => ({ provider: { name: cf.provider.name } })),
    }));

  return NextResponse.json({ articles, facilities });
}
