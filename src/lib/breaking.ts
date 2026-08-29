/**
 * ─── BREAKING NEWS BANNER — ROTATE HERE ─────────────────────────────────
 *
 * When a Google Alert surfaces a relevant data centre story, update this
 * ONE item. It feeds the slim strip under the homepage hero.
 *
 * Fields:
 *   label    chip text on the left (e.g. "Breaking", "New analysis")
 *   title    ONE line summarising the story (keep under ~110 chars)
 *   href     path to the DC254 article covering the story
 *   dateText short display date (e.g. "27 Aug 2026")
 *
 * To take the strip down (no current story), set breakingNews to null:
 *   export const breakingNews: BreakingItem | null = null;
 */
export interface BreakingItem {
  label: string;
  title: string;
  href: string;
  dateText: string;
}

export const breakingNews: BreakingItem | null = {
  label: "Breaking",
  title:
    "MTN and Dubai investor Tarek Al Ashram launch Africa Data Hub — 150 MW of AI data centres planned for Nigeria and South Africa",
  href: "/articles/mtn-africa-data-hub-ai-data-centres",
  dateText: "27 Aug 2026",
};
