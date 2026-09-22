import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { getFacilities, getMarketSnapshot } from "@/lib/directory-data";
import { latestCorrectionDate } from "@/lib/corrections-data";
import { SITE_URL } from "@/lib/site";

/**
 * SEO audit remediation — deterministic lastModified.
 *
 * This file used to stamp `new Date()` on the homepage, every static route
 * and every facility profile at generation time. That told search engines
 * "everything changed" on every deploy, which degrades the freshness signal
 * until crawlers stop trusting it. All dates are now derived from real,
 * deterministic editorial sources:
 *
 *  - contentDate  — newest article updated_date (homepage + cluster hubs +
 *                   article-adjacent pages only move when content moves);
 *  - verifiedDate — the directory's own lastVerified month (facility profiles,
 *                   directory/tracker/compare, map, methodology, FAQ — the
 *                   pages that quote the verification stamp);
 *  - fixedDate    — rarely-changing legal/about pages get a stable date that
 *                   only needs a manual bump when their content actually changes.
 */

/** "2026-09" -> Date("2026-09-01"); null when absent/invalid. */
function monthToDate(month: string): Date | null {
  if (!/^\d{4}-\d{2}$/.test(month)) return null;
  const d = new Date(`${month}-01T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  const articles = getAllArticles();
  const newestArticle = articles
    .map((a) => a.frontmatter.updated_date)
    .sort()
    .at(-1);
  const contentDate = new Date(
    `${newestArticle ?? "2026-09-01"}T00:00:00Z`
  );

  const verifiedDate =
    monthToDate(getMarketSnapshot().lastVerified) ?? contentDate;
  const fixedDate = new Date("2026-09-18T00:00:00Z");
  // Corrections page moves only when a correction lands, so it dates from
  // the newest log entry, not from deploy time.
  const latestCorrection = latestCorrectionDate();
  const correctionsDate = latestCorrection
    ? new Date(`${latestCorrection}T00:00:00Z`)
    : fixedDate;

  // Static routes, all real, working pages. Each entry carries the date of
  // the editorial source that actually drives the page.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: contentDate, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/directory`, lastModified: verifiedDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/tracker`, lastModified: verifiedDate, changeFrequency: "weekly", priority: 0.8 },
    // Market tracker sub-pages (Phase 2): cables, power tariffs, licensing.
    // Dated from their own verified month in market-trackers.ts (Sep 2026).
    { url: `${baseUrl}/tracker/cables`, lastModified: verifiedDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/tracker/power`, lastModified: verifiedDate, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/tracker/licensing`, lastModified: verifiedDate, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/directory/compare`, lastModified: verifiedDate, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/chat`, lastModified: contentDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/methodology`, lastModified: verifiedDate, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/faq`, lastModified: verifiedDate, changeFrequency: "monthly", priority: 0.6 },
    // Cluster landing pages (article listings)
    { url: `${baseUrl}/articles`, lastModified: contentDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/beginners`, lastModified: contentDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/kenya`, lastModified: contentDate, changeFrequency: "weekly", priority: 0.8 },
    // NOTE: /internet intentionally absent, 308-redirected to /infrastructure
    { url: `${baseUrl}/policy`, lastModified: contentDate, changeFrequency: "weekly", priority: 0.8 },
    // Policy Intelligence dashboard — dated from the policy dataset's editorial
    // review date (humanGate rulings), not from deploy time.
    { url: `${baseUrl}/policy/intelligence`, lastModified: new Date("2026-09-22T00:00:00Z"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/energy`, lastModified: contentDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/careers`, lastModified: contentDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/ai`, lastModified: contentDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/infrastructure`, lastModified: contentDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/infrastructure/map`, lastModified: verifiedDate, changeFrequency: "monthly", priority: 0.7 },
    // Knowledge Base hub, was missing from the sitemap entirely
    { url: `${baseUrl}/data-centres`, lastModified: contentDate, changeFrequency: "weekly", priority: 0.8 },
    // Content pages
    { url: `${baseUrl}/foundations`, lastModified: contentDate, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/research`, lastModified: contentDate, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/research/state-of-kenyan-data-centres-2026`, lastModified: verifiedDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/research/state-of-the-market-2026-q3`, lastModified: new Date("2026-09-19T00:00:00Z"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/glossary`, lastModified: contentDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/glossary/kiswahili`, lastModified: contentDate, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/about`, lastModified: fixedDate, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: fixedDate, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/data-exports`, lastModified: fixedDate, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/rack-report`, lastModified: contentDate, changeFrequency: "weekly", priority: 0.9 },
    // /search is deliberately noindexed (internal search tool, empty state
    // without JS), so it must not be listed in the sitemap: a sitemap entry
    // would contradict the noindex and confuse crawlers.
    // Trust & legal pages
    { url: `${baseUrl}/privacy`, lastModified: fixedDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: fixedDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/editorial-policy`, lastModified: fixedDate, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/corrections`, lastModified: correctionsDate, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/advertise`, lastModified: fixedDate, changeFrequency: "monthly", priority: 0.5 },
  ];

  // File-based article routes
  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${baseUrl}/articles/${a.frontmatter.slug}`,
    lastModified: new Date(a.frontmatter.updated_date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Per-facility profile pages (SEO landers) — each carries its own verified
  // month so a facility only reports freshness when its row was re-verified.
  const facilityRoutes: MetadataRoute.Sitemap = getFacilities().map((f) => ({
    url: `${baseUrl}/directory/${f.slug}`,
    lastModified: monthToDate(f.lastVerified) ?? verifiedDate,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...articleRoutes, ...facilityRoutes];
}
