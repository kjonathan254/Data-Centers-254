import type { NextConfig } from "next";
import { existsSync, readdirSync } from "fs";
import { join } from "path";

/**
 * Bare-slug safety net: people (and bots) guess article URLs without the
 * /articles/ segment — /gpu-cloud-infrastructure-kenya instead of
 * /articles/gpu-cloud-infrastructure-kenya — and hit a 404. One permanent
 * redirect per real article slug auto-heals those links and consolidates any
 * stray crawl equity into the canonical page.
 *
 * Generated from content/articles/ at build time, so new articles are covered
 * with zero manual steps. Two guard rails:
 *  - a slug is skipped if it collides with a real top-level route (any
 *    src/app segment or public/ entry), so /directory, /policy, /reports etc.
 *    can never be shadowed — config redirects are checked before filesystem
 *    routes, which makes the collision guard load-bearing;
 *  - only clean lowercase slugs pass (no dots, no odd characters).
 */
function articleSlugRedirects() {
  const root = process.cwd();
  const articlesDir = join(root, "content", "articles");
  if (!existsSync(articlesDir)) return [];

  const slugs = readdirSync(articlesDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
    .filter((s) => /^[a-z0-9-]+$/.test(s));

  const reserved = new Set<string>([
    "api", "_next", "_vercel", "articles", "favicon.ico", "robots.txt",
    "sitemap.xml", "sw.js", "offline", "index",
  ]);
  for (const dir of ["src/app", "public"]) {
    const p = join(root, dir);
    if (existsSync(p)) {
      for (const e of readdirSync(p)) {
        reserved.add(e.includes(".") ? e.replace(/\.[^.]+$/, "") : e);
      }
    }
  }

  const redirects: { source: string; destination: string; permanent: boolean }[] = [];
  const skipped: string[] = [];
  for (const slug of slugs) {
    if (reserved.has(slug)) {
      skipped.push(slug);
      continue;
    }
    redirects.push({
      source: `/${slug}`,
      destination: `/articles/${slug}`,
      permanent: true,
    });
  }
  console.log(
    `next.config: ${redirects.length} bare-slug -> /articles/ redirects` +
      (skipped.length ? `, skipped collisions: ${skipped.join(", ")}` : "")
  );
  return redirects;
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Audit remediation #8 — CSP stage 2: ENFORCED (flipped from report-only
  // after codebase-wide verification: no iframes, no external scripts/fonts/
  // CDNs, no client-side external fetches, no eval/importScripts; GA4 is the
  // only third party and is fully covered below).
  //
  // What this policy does for the site: even if an article, dependency or
  // comment ever tried to inject malicious content, the browser refuses to
  // load scripts from anywhere but this site + Google's tag manager, blocks
  // Flash/Java-style plugin objects, stops the page being framed by other
  // sites, and stops forms silently submitting visitor data elsewhere.
  //
  // Violations (i.e. anything blocked) are still POSTed to /api/csp-report
  // as a permanent regression tripwire. If a future feature needs a new
  // origin (video embeds, CDN fonts...), add it to the matching directive
  // here — the tripwire report will name the exact directive.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "media-src 'self' blob:",
      "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
      "report-uri /api/csp-report",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // /index was a duplicate of /directory — permanently redirect legacy links
      { source: "/index", destination: "/directory", permanent: true },
      // /internet was an orphaned duplicate of the Internet & Connectivity hub
      // at /infrastructure (both listed cluster="Internet"). 308 so any legacy
      // links and crawl equity flow to the single, nav-linked hub.
      { source: "/internet", destination: "/infrastructure", permanent: true },
      // /news surfaces never existed as pages — send crawled links to real homes
      { source: "/news", destination: "/tracker", permanent: true },
      {
        source: "/news/kenya-data-centre-licensing-framework",
        destination: "/articles/kenya-data-centre-licensing-framework",
        permanent: true,
      },
      // Auto-heal guessed article URLs: /<slug> -> /articles/<slug>
      ...articleSlugRedirects(),
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
