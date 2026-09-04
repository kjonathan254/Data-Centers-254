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
  // Audit remediation #8 — CSP rollout stage 1 (report-only).
  //
  // Violations are POSTed to /api/csp-report (rate-limited, path-only logs)
  // and NOTHING is blocked yet, so this cannot break GA, the chat stack or
  // the PWA. Policy notes:
  //   script-src  — 'unsafe-inline' covers Next's hydration bootstrap + inline
  //                 JSON-LD + the inline GA4 init; googletagmanager serves
  //                 gtag.js. Vercel Analytics + the service worker are
  //                 same-origin.
  //   connect-src — GA4 beacons go to google-analytics.com /
  //                 analytics.google.com; everything else is same-origin API.
  //   img/media   — all imagery is local (data: covers Next blur placeholders).
  //
  // Stage 2 (after ~1 week of clean reports): rename the key to
  // "Content-Security-Policy" to enforce.
  {
    key: "Content-Security-Policy-Report-Only",
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
