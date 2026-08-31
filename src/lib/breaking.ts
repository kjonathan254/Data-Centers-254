/**
 * ─── BREAKING NEWS BANNER — ROTATE HERE ─────────────────────────────────
 *
 * When a Google Alert surfaces a relevant data centre story, update this
 * ONE item. It feeds the slim strip under the homepage hero.
 *
 * Fields:
 *   label       chip text on the left (e.g. "Breaking", "New analysis")
 *   title       ONE line summarising the story (keep under ~110 chars)
 *   href        path to the DC254 article covering the story
 *   dateText    short display date (e.g. "31 Aug 2026")
 *   publishedAt ISO date the story broke — drives the 72-hour expiry
 *   serious     set true ONLY for market-defining stories (licensing
 *               changes, a major facility energising) that may stay up
 *               past the 72-hour window
 *
 * EDITORIAL RULE: breaking news decays. A story leaves the bar
 * automatically 72 hours after publishedAt unless serious is true.
 * After that, the story keeps visibility through the green "New" badge
 * and freshness sorting in listings instead — rotate in the next alert.
 *
 * To take the strip down (no current story), set breakingNews to null:
 *   export const breakingNews: BreakingItem | null = null;
 *
 * Note: expiry is evaluated at build time; redeploy to clear an expired
 * story (every push rebuilds, so routine publishing handles this).
 */
export interface BreakingItem {
  label: string;
  title: string;
  href: string;
  dateText: string;
  publishedAt: string;
  serious?: boolean;
}

/** Breaking items expire after 72 hours unless flagged serious. */
const BREAKING_TTL_HOURS = 72;

export const breakingNews: BreakingItem | null = {
  label: "Breaking",
  title:
    "MTN formally confirms Africa Data Hub partnership — Bayobab joins as shareholder, platform targets AI-ready capacity across Africa",
  href: "/articles/mtn-africa-data-hub-ai-data-centres",
  dateText: "31 Aug 2026",
  publishedAt: "2026-08-31",
};

/**
 * The single item the homepage should show, or null when the current
 * story has outlived its window. Use this instead of reading
 * breakingNews directly so the TTL rule is always applied.
 */
export function getActiveBreakingNews(now: Date = new Date()): BreakingItem | null {
  if (!breakingNews) return null;
  if (breakingNews.serious) return breakingNews;
  const ageHours =
    (now.getTime() - new Date(breakingNews.publishedAt).getTime()) / 3_600_000;
  return ageHours <= BREAKING_TTL_HOURS ? breakingNews : null;
}
