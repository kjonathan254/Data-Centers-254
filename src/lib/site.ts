/**
 * Central site URL utility.
 * Switch the domain in one place via NEXT_PUBLIC_SITE_URL.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://data-centers-254.vercel.app";

export function siteUrl(path = ""): string {
  const base = SITE_URL.replace(/\/$/, "");
  return `${base}${path}`;
}
