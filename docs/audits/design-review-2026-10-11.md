# DC254 Full Design Review — 11 October 2026

**Scope:** every public route archetype on the production site (data-centers-254.vercel.app), desktop 1440x900 and mobile 390x844. Method: full-page browser captures of 21 routes plus a scripted objective sweep (28 route-passes) checking broken images, horizontal overflow, missing alt text, unscrollable wide tables, heading-order skips, and unsafe `target="_blank"` links. Follow-up code-tracing on every hit. This review complements the 11 October a11y checklist pass (Task 112: WCAG contrast tokens, touch targets, alts) — it covers what a checklist cannot see: routing behavior, service-worker interaction, heading structure across components, and asset reproducibility.

---

## Findings and disposition

### F1 · HIGH · Service worker masks 404s and redirects with "You're offline" — FIXED

**Evidence:** with the service worker active (second navigation onward), a request for a nonexistent URL (`/subscribe`, 404) rendered the precached /offline page ("You're offline. No connection right now.") instead of the styled not-found page. A request for `/news` (a healthy permanent 308 to `/tracker`) rendered the same offline page even though the server and a direct `fetch()` both handle it fine. Confirmed in code: `networkFirstPage` in `scripts/sw-template.js` treated every non-OK response as "server error" and fell back to the offline page — the comment even said "5xx/404".

**Why it matters:** a reader following a stale or mistyped link is told their connection is down, which is false; the real 404 page (which suggests next steps) never shows; and a future server incident would be visually indistinguishable from a reader-side network problem. First-time visitors were unaffected (the worker activates after the first navigation), which is why this survived earlier audits.

**Fix (one function):** re-fetch by URL with an explicit `redirect: "follow"` Request (preserving the navigation's accept headers) so healthy redirects resolve; pass client-error responses (400-499, 429 excepted) straight through, uncached, so the app's own 404 renders; keep the cached-copy-then-offline fallback strictly for 5xx/429 and true network failure. Resilience intent unchanged; only the false-masking paths removed.

### F2 · MEDIUM · /directory had two H1s (and a heading-order skip) — FIXED

**Evidence:** live page rendered `<h1>Kenya Data Centre Directory</h1>` (page template) and `<h1>Every data centre in one place.</h1>` (shared directory section) — a violation of the house one-H1-per-page SEO rule. The facility cards' H3s followed without an intervening H2, which the sweep flagged as a heading-order skip.

**Fix:** the section heading in `src/components/sections/directory.tsx` demoted H1 -> H2 (class `h-display` untouched, zero visual change). The section renders only on /directory (home uses the search-band variant), so no cross-page effect. Heading order becomes H1 -> H2 -> H3.

### F3 · MEDIUM · /search had two H1s — FIXED

**Evidence:** an sr-only `<h1>Search DC254</h1>` in the page plus a visible `<h1>Find What You Need</h1>` in `SearchClient.tsx`.

**Fix:** the visible heading demoted to H2 with identical classes; the sr-only H1 remains the page's single H1.

### F4 · PROCESS DEBT · Rack Report print HTML was unreproducible — FIXED

**Evidence:** the Issue 003 print HTML and its build scripts lived only in a session workspace (`tmp/`, outside the repo). The PDF shipped, but the layout that produced it could not be rebuilt after the session ended. Issue 004 would have started from archaeology.

**Fix:** committed to the repo — `docs/newsletter/templates/rack-report-print-template.html` (the proven Issue 001/002 layout plus the Issue 003-lineage optional blocks: cover/inline photo slots, CSS bar charts, data tables with status colour-coding, all placeholder-tokenized with a fill-in workflow in the header) and `scripts/build_rack_report_pdf.py` (Playwright A4 render + optional ghostscript /ebook compression, the Issue 003 lineage trick). Smoke-tested end-to-end: 78 tokens filled, 6-page A4 PDF rendered. The compile path for Issue 004 (2 November) is now a fill-and-render job documented in `docs/newsletter/issue-004-prep.md`.

---

## Notes (observed, no change warranted now)

- **Hero tertiary CTA legibility.** "Read the 2026 Market Report" sits over the bright port photo's right side and can dip in contrast depending on scroll state. The hero scrim covers the primary and secondary CTAs well. Watch on the next hero image swap; a local text-shadow or scrim extension is the one-line remedy if it ever reads badly on real devices.
- **Bottom overlay stacking.** Cookie banner (bottom left), PWA install card (bottom right) and the chat FAB can share the viewport on a first visit. Each is independently dismissible and none blocks content; noting for the next PWA prompt review (e.g., suppress the install card while the cookie banner is up).
- **Screenshot dark-image artifacts are not defects.** Full-page captures and canvas luminance probes read below-the-fold `next/image` assets as black because they are lazy-decoded; visually confirmed rendering is correct (home news cards, /kenya image walls). Any future automated audit should scroll-and-settle before measuring.

## Verified clean (no action)

- 0 broken images, 0 missing alt attributes, 0 horizontal-overflow routes, 0 unscrollable wide tables, 0 `target="_blank"` links missing `noopener` across 28 route-passes (desktop + mobile).
- `/subscribe` returning 404 and `/news` 308-redirecting to `/tracker` are correct by design (no inbound links to either; redirect declared in `next.config.ts`).
- Contrast pairs, touch targets, alt coverage and reduced-motion were WCAG-audited on 11 October (Task 112) and are unchanged here except where fixed above.
- Heading order on all other routes: clean.

## Post-fix verification (production, after deploy)

1. /directory and /search each expose exactly one H1 (browser count).
2. With the service worker active, `/subscribe` renders the styled not-found page and `/news` lands on tracker content — not the offline page.
3. `article_validator` (109), `validate_policy`, `validate_jsonld`, `audit_assets` all green; CI double-green.
