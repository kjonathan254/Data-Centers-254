# DC254 System Audit — 2026-10-07

**Scope**: full-stack technical audit of data-centers-254.vercel.app (platform, build, edge, SEO, content infrastructure) plus the commissioned homepage hero rotation.
**Method**: production probes (curl against the live edge), full local production build on the updated dependency set, code review of config/components, dependency audit via the lockfile, sitemap-wide crawl check (184 URLs), image-pipeline probes with browser `Accept` headers.
**Baseline**: builds on the 2026-09-24 external audit (Task 61) and the 2026-09-28 security + performance batch (Task 62). This pass verifies those remediations still hold and looks for what changed since.

---

## 1. Verified healthy (evidence from today's probes)

| Area | Evidence |
| --- | --- |
| Wire weight | Homepage 39.5 KB, article 27.5 KB, directory 17.5 KB, map 31.6 KB compressed (brotli). Lean for content pages. |
| Image pipeline | Zero raw `<img>` tags site-wide; everything flows through `next/image`. With a real browser `Accept` header the hero serves as webp at 119 KB vs 174 KB source (31% saving from the optimizer). Homepage and article heroes both render with `priority` (LCP protected). |
| Security headers | CSP enforced with `report-uri /api/csp-report` tripwire, HSTS preload (2-year max-age), X-Frame-Options SAMEORIGIN, nosniff, Referrer-Policy, Permissions-Policy all present on every response. |
| Analytics privacy | GA4 + Clarity load only behind the consent gate; Vercel Analytics (no cookies) also present. CSP policy matches the documented third-party set exactly. |
| SEO infrastructure | sitemap.xml: **184/184 URLs return 200**, all **107 articles** present (auto-derived from `content/articles/`). robots.txt carries the Sitemap line and disallows `/api/`. RSS feed at `/feed.xml` with `<link rel="alternate">` autodiscovery. Canonicals, OG and Twitter cards verified. |
| Structured data | Organization + WebSite (with SearchAction) JSON-LD in the root layout; articles emit Article + ImageObject schema. |
| Resilience | `not-found.tsx` + `error.tsx` boundaries; 107 build-time bare-slug redirects (self-healing guessed URLs) plus curated 308 recovery redirects; PWA offline page + service worker (build-generated). |
| API surface | Chat endpoint rate-limited per client IP; `/api/` excluded from crawling; CSP report endpoint acts as a permanent regression tripwire. |
| Fonts | Self-hosted via `next/font` (Geist), consistent with `font-src 'self'`. |
| Redirect health | All redirects intact in the Next 16.4.0 build log: 107 bare-slug generated, zero collisions skipped. |

## 2. Findings and actions

### F1 — Next.js remote-code-execution advisory (CRITICAL) — FIXED TODAY
`npm audit` flagged the Next.js `next/og` ImageResponse RCE advisory on the then-installed 16.3.3. **Exploitability on DC254: none** — no file in `src/` or `scripts/` imports `next/og` or `ImageResponse`; all OG images are pre-generated static files by `scripts/generate_og_images.mjs` at build time. Fixed anyway (defense in depth, and the advisory flags every future scan): `next` 16.3.3 → **16.4.0** (semver-compatible, `package.json` ranges untouched). Full local production build passes.

### F2 — sharp librsvg CVE-2026-96889 (HIGH) — FIXED TODAY
sharp (used by the OG-image build script) carried a vulnerable librsvg. Exposure was build-time-only (processing our own SVGs, never user input). Fixed: sharp 0.35.4 → **0.35.5**. `source-map-js` also updated in the same pass.

### F3 — Static assets revalidate on every view (MEDIUM) — RECOMMENDED, not applied
`public/images/*` and `/og/*` are served with `cache-control: public, max-age=0, must-revalidate`, so every browser revalidates every image on every visit (304 round-trips add latency to repeat views). Recommended rule in `next.config.ts` `headers()`:

```ts
{
  source: "/images/:path*",
  headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
},
{
  source: "/og/:path*",
  headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
},
```

One day of freshness is safe even though filenames are descriptive (not content-hashed): if an image is ever replaced, the old copy ages out within 24 h. Not applied today because it changes caching behaviour — awaiting editor go-ahead.

### F4 — Remaining dependency advisories (accepted risk, documented)
After the fix: **production dependencies carry 4 moderate advisories, zero high, zero critical.** The dev-side residue centres on the gray-matter → js-yaml chain (also used by our own validators). gray-matter parses only our own 107 trusted content files at build time; no user-supplied YAML is ever parsed. The only semver-compatible fix would be a forced major bump that risks breaking frontmatter parsing for all 107 articles. Decision: **accept and monitor** — revisit if a patched gray-matter lands.

### F5 — AVIF not served (LOW) — RECOMMENDED
The image optimizer returns webp to browsers today; an AVIF-only `Accept` probe fell back to jpeg. Next 16 can serve AVIF (`images.formats: ["image/avif", "image/webp"]`), typically another 20-30% off image weight. Worth a canary pass on visual quality before adopting.

### F6 — Trust surface detail (LOW, editor decision)
Organization JSON-LD and contact points use a gmail address. A domain-branded address (e.g. hello@…) would strengthen E-E-A-T signals. Also noted: no `global-error.tsx` (root-layout-level failures fall back to the platform error page; `error.tsx` covers everything else). Nice-to-have.

## 3. Implemented today alongside the audit (editor commission)

**Hero image rotation.** The homepage hero now rotates daily through a curated cast of **seven real photographs already published on the platform** (no AI-generated shots, per the standing real-images directive):

1. Server-hall corridor (the original hero)
2. Engineer at the rack aisle
3. Nairobi data-centre server hall
4. Nairobi night skyline (KICC)
5. Mombasa port (cable landfall)
6. Red-lit equipment aisle
7. Data-centre power room (UPS)

Design decisions, deliberately conservative:

- **Deterministic, not random**: the pick is the calendar day in EAT modulo the cast, so every visitor that day sees the same hero, the edge cache stays coherent, and repeat visitors see variety across the week.
- **Zero client JS**: still a server component; the rotation is computed at render, no layout shift, no image-swap flash.
- **LCP untouched**: the selected image still renders with `priority` and fills the viewport exactly as before.
- **Route revalidation**: the homepage now exports `revalidate = 86_400`, so the edge re-renders at most once per day and each new day's pick is baked in without a deploy.

## 4. Suggested next improvements (menu, highest impact first)

| # | Item | Impact | Effort |
| --- | --- | --- | --- |
| 1 | Static image cache headers (F3) | Faster repeat visits site-wide | ~20 lines, one commit |
| 2 | AVIF canary (F5) | ~20-30% further image-weight cut | small, needs visual QA |
| 3 | Domain email on contact surfaces (F6) | Trust / E-E-A-T | editor decision + setup |
| 4 | `global-error.tsx` | Brand-consistent worst-case error page | ~40 lines |
| 5 | Vercel Speed Insights on key routes | Real-user LCP/INP evidence for future audits | small |
| 6 | Quarterly re-run of this audit | Keeps the platform posture current | 1 session, reuse this doc's probes |

## 5. Probe appendix (reproducible)

```bash
# headers / caching
curl -sI https://data-centers-254.vercel.app/ | grep -iE "security|cache|csp"
# image negotiation (browser-realistic)
curl -s -o /dev/null -w "%{http_code} %{size_download}B %{content_type}\n" \
  -H "Accept: image/avif,image/webp,image/*" \
  "https://data-centers-254.vercel.app/_next/image?url=%2Fimages%2Fhero-server-hall.webp&w=1920&q=75"
# sitemap-wide 200 check + article coverage
# (scripts in the engineering workspace: sitemap_probe_20261007.sh)
npm audit --package-lock-only --omit=dev
npm run build   # must stay green on the patched dependency set
```
