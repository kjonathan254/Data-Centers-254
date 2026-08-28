import { getAllArticles } from "@/lib/articles";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const articles = getAllArticles().slice(0, 50);
  const self = siteUrl("/feed.xml");

  const items = articles
    .map((a) => {
      const url = siteUrl(`/articles/${a.frontmatter.slug}`);
      const pubDate = new Date(a.frontmatter.published_date).toUTCString();
      return `    <item>
      <title>${escapeXml(a.frontmatter.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(a.frontmatter.meta_description)}</description>
      <category>${escapeXml(a.frontmatter.category)}</category>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Data Centre 254</title>
    <link>${siteUrl()}</link>
    <description>Inside Kenya's digital infrastructure — data centres, connectivity, power, and AI. Research and explainers from DC254.</description>
    <language>en-ke</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${self}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
