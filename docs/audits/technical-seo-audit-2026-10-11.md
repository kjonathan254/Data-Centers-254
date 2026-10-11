# Technical SEO Audit — data-centers-254.vercel.app

Date: 2026-10-11
Protocol: claude-seo `seo-technical` skill v2.4.2 (crawlability, indexability, security, URLs, mobile, CWV, structured data, JS rendering, IndexNow; AI-crawler signals recorded via `agentic_check`)
Tooling: claude-seo runtime probes (sitemap_discovery, agentic_check, agent_ux_check) + code-level verification against the live deployment.

## Technical Score: 83/100

Eight of nine categories measured. Core Web Vitals reported as *not measured* (no CrUX field data at current traffic; no PSI API key configured). IndexNow is the only failing category. All deductions are opportunity- or acceptance-class findings; zero critical, zero high.

## Category Breakdown

| Category | Status | Score | What was checked |
|----------|--------|-------|------------------|
| Crawlability | pass | 95/100 | robots.txt 200, RFC 9309-valid (allow `/`, disallow `/api/`), sitemap declared in robots + valid urlset (sitemap_discovery: 0 warnings), 186 URLs, noindex only on /search (documented, intentional), crawl depth ≤3 clicks for all articles, llms.txt Lighthouse-rules pass (2,941 B). Deduction: no named AI-crawler groups (info — falls through to `*`, which matches the platform's AI-visibility ambition), no Content-Signal line (optional). |
| Indexability | pass | 95/100 | Self-referencing canonicals site-wide with frontmatter `canonical_url` override support (articles/[slug]/page.tsx:35,42); single canonical host; thin-content guarded by article_validator; /articles hub server-renders all 109 article links (verified live); pagination n/a (single hub); hreflang n/a (single locale en_KE); sitemap lastmod deterministic from editorial sources (anti-churn policy documented in sitemap.ts:8-24). |
| Security | pass | 95/100 | HTTPS enforced; HSTS `max-age=63072000; includeSubDomains; preload` (live-verified); CSP enforced with report-uri tripwire (documented `unsafe-inline` compromise is the one deduction — nonce tightening already assessed and deferred); X-Frame-Options SAMEORIGIN, X-Content-Type-Options, Referrer-Policy, Permissions-Policy all live; no mixed content (self-hosted assets only); back-button hijacking: clean (3 `history.replaceState` sites are filter-state sync, not navigation interception). |
| URL Structure | pass | 95/100 | Descriptive hyphenated slugs; logical hierarchy (/articles/, /tracker/, /directory/, cluster hubs); permanent redirects for legacy/orphan paths with build-time bare-slug auto-heal + collision guard (next.config.ts:20-61); no redirect chains in config; no >100-char URLs; trailing-slash consistent. |
| Mobile & Page Experience | pass | 95/100 | Viewport meta; touch targets ≥44px (fixed 2026-10-11, commit 48aef59); no horizontal scroll (PeeringDB table fix, same commit); mobile/desktop parity — primary content server-rendered (agentic_check: 976 words in raw HTML, js_shell_marker false); no intrusive interstitials (consent-gate = standard legal dialog); key content immediately visible, not behind tabs. |
| Core Web Vitals | not measured | — | No CrUX field data at current traffic; PSI/CrUX API not configured. Lab proxies verified instead: homepage HTML 234 KB, article HTML 135 KB (both far under Googlebot's 2 MB HTML fetch limit with JSON-LD well inside it), image optimizer tuned (8+4 width grid, 1-day TTL floor), self-hosted Geist via next/font, static-first rendering. Recommendation: re-run with PSI API key or GSC CrUX when traffic qualifies. |
| Structured Data | pass | 95/100 | JSON-LD only (preferred format): Organization + WebSite + Article + FAQPage + BreadcrumbList + Dataset; repo gate `validate_jsonld` 109 OK per session; serialization hardened this session via safeJsonLd (all 15 sites; see TECH_DEBT_AUDIT.md F008). Deduction: none material. |
| JS Rendering | pass | 95/100 | SSR/SSG everywhere (Next.js App Router — the skill's preferred framework); interactive islands (directory filters, map, chat, search) are enhancements over server-rendered content; /search correctly noindexed for its empty-without-JS state; no dynamic rendering (correctly avoided); canonicals and robots directives all in initial HTML (Dec-2025 Google JS-SEO guidance satisfied). |
| IndexNow | fail | 0/100 | Not implemented. No /indexnow.txt key file, no submission endpoint. Affects Bing/Yandex/Naver freshness only (Google ignores IndexNow). |

## Critical Issues (fix immediately)

None.

## High Priority (fix within 1 week)

None.

## Medium Priority (fix within 1 month)

1. **IndexNow not implemented (0/100).** For a platform that publishes on a cadence (Rack Report monthly, articles weekly) and wants non-Google engine visibility, IndexNow is the cheapest win available: a static `/indexnow.txt` key file plus a submission call on deploy (Vercel deploy hook → api.indexnow.org with the changed URL list). Decision needed from editor on key storage (env var vs committed key file — the key is public-by-design, so a committed file is acceptable and simpler).
2. ~~**llms-full.txt 404**~~ — **FIXED this session**: `scripts/generate_llms_full.mjs` generates the full-corpus edition (1.45 MB, 109 articles, deterministic, no timestamps) at build; cache headers `max-age=86400, stale-while-revalidate=604800` added for both /llms.txt and /llms-full.txt; artifact gitignored per the public/og/ convention.

## Low Priority (backlog)

1. **Content-Signal line** (agentic_check P1 info): robots.txt declares no Content-Signal preference. Optional per the Cloudflare/IETF draft; Google states it does not act on it. Editorial decision — for DC254's AI-citable positioning, omitting it (current state) is coherent; revisit only if the editor wants a formal ai-train stance on record.
2. **Markdown content negotiation** (agentic_check P1 info): no `Accept: text/markdown` handling or .md siblings. llms-full.txt now covers the full-corpus use case; per-page markdown would add a route per 109 slugs for no confirmed consumer. Deferred until an agent ecosystem actually requests it.
3. **WebMCP tool registration** (agentic_check P2 info): W3C draft, WebKit-opposed; the site's forms (subscribe, contact) are simple and agent-navigable as-is. Revisit if the draft matures.
4. **Tracker page titles 61-64 chars** (audit_titles.py `<<LONG` flags): deliberate long-tail keyword titles (e.g. "Kenya Subsea Cable Tracker: Mombasa Landings & Pipeline | DC254"); truncation in SERPs cuts the brand suffix, not the keyword. Accepted as an editorial choice.
5. **Named AI-crawler robots groups**: none present; default-allow serves the AI-visibility strategy. Add named groups only if the editor ever wants selective blocking (e.g. GPTBot training opt-out) — the agentic_check output documents the per-crawler tradeoffs.

## AI-Readiness Snapshot (recorded during technical audit, full analysis in seo-agentic)

- P0 all pass: robots reachable, primary content server-rendered (976 words without JS), no search crawler blocked at root.
- agent_ux_check score 80/100: flagged "9 interactive nodes without accessible name" — investigated with a DOM-level audit under two name-computation variants (aria-label/labelledby/title/subtree-text): **zero unnamed interactive elements reproduce**. Assessed as a CDP-tree counting artifact (hidden chat/nav internals counted pre-layout). Monitoring; not actionable at DOM level.
- llms.txt pass; llms-full.txt now live at build; RSS autodiscovery link present; real 404 semantics (no catch-all 200).

## Verification log (this session)

- sitemap_discovery.py: robots-declared sitemap found, valid urlset, 0 warnings.
- agentic_check.py: 3 pass / 1 info at P0; 3 pass / 2 info at P1; llms.txt 200 text/plain; 404 probe returns real 404.
- agent_ux_check.py: score 80/100, single finding investigated and assessed as tool artifact (above).
- Live headers: all five security headers + HSTS preload confirmed on production homepage.
- robots.txt live: single `*` group, sitemap directive present.
- HTML size probes: homepage 239,772 B; sample article 138,464 B.
- /articles hub: 109 unique article hrefs in raw HTML.

---

## Repeat run — 2026-10-11 (post-implementation, Task 115)

Trigger: editor approved IndexNow ("IndexNow approved, re run the audit"). Full category re-sweep re-verified all pass categories unchanged; probes: robots 200, llms.txt 200, llms-full.txt 200 with cache headers, real-slug article 200, true-404 returns 404, sitemap 186 URLs.

### Audit-gap correction (recorded against the original run)

The original run scored IndexNow 0/100 as "not implemented". That was **wrong in part**: commit c1e590a (2026-09-16) had already deployed a key file (`/42ceac901e1b7b7f38fc8bbef59bc19d.txt`, live-verified 200 both runs) and a manual submission script (`scripts/indexnow_ping.py`). The original probe checked the literal `/indexnow.txt` path and the claim "no submission endpoint" did not sweep `scripts/`. Lesson recorded: probe the repo for key files and submission code, not just the conventional URL.

### IndexNow re-scored: 0/100 → 90/100

What now exists (all verified live this run):

- **Key file**: committed, public-by-design (editor-approved storage decision), served at the keyLocation URL — 200 with exact key content.
- **Submission**: `scripts/indexnow_submit.mjs` posts to `api.indexnow.org` (aggregator: Bing, Yandex, Seznam, Naver). Seed submission accepted: **186/186 URLs, HTTP 200 OK**. Immediate re-run: "nothing to submit (186 URLs unchanged)" — lastmod-diff state (`.indexnow-state.json`, committed) prevents resubmission spam and survives ephemeral runners.
- **Trigger**: `npm run indexnow` runs in-session after every push (session protocol step) — submissions are current. The remaining 10 points: the fully automated `deployment_status`-triggered GitHub workflow is written and staged but unpushable — the Personal Access Token lacks the `workflow` scope (GitHub rejects any commit touching `.github/workflows/`). Editor action required (grant scope or add the file via GitHub UI); until then the manual-in-session path carries the load.

### Updated score: 83/100 → 94/100

Formula from the table: (95×8 + 90)/9 = 94.4 → **94/100**. (The original's 83 was itself conservative against its own arithmetic — (95×8+0)/9 = 84 — kept as documented.) IndexNow moves from the only failing category to a passing one with a single named, editor-actionable deduction. Remaining ceiling to 100: IndexNow automation (10) — all other categories have no new deductions this run.

