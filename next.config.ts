import type { NextConfig } from "next";

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
