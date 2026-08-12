import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ articles: [], facilities: [] });
  }

  // Search articles by title, description, tlDr, and content
  const articles = await db.article.findMany({
    where: {
      status: "Published",
      OR: [
        { title: { contains: q } },
        { description: { contains: q } },
        { tlDr: { contains: q } },
        { content: { contains: q } },
      ],
    },
    select: {
      title: true,
      slug: true,
      tlDr: true,
      description: true,
      cluster: true,
      readingTimeMin: true,
      lastVerified: true,
    },
    take: 20,
    orderBy: { sortOrder: "asc" },
  });

  // Search facilities by name, operator name, city, type
  const facilities = await db.facility.findMany({
    where: {
      OR: [
        { name: { contains: q } },
        { city: { contains: q } },
        { facilityType: { contains: q } },
        { tierRating: { contains: q } },
        { notable: { contains: q } },
        { operator: { name: { contains: q } } },
        { connectivityProviders: {
          some: {
            provider: { name: { contains: q } },
          },
        } },
        { certifications: {
          some: {
            certification: { name: { contains: q } },
          },
        } },
      ],
    },
    select: {
      name: true,
      slug: true,
      city: true,
      status: true,
      itLoadMw: true,
      tierRating: true,
      facilityType: true,
      notable: true,
      operator: { select: { name: true } },
      connectivityProviders: {
        select: { provider: { select: { name: true } } },
        take: 3,
      },
    },
    take: 10,
  });

  return NextResponse.json({ articles, facilities });
}
