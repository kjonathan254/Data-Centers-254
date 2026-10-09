# External audit triage — data-centers-254.vercel.app

**Date:** 9 October 2026 · **Method:** every claim checked against the codebase (`src/`, `next.config.ts`) and the production site (curl probes with security-header and content-type inspection). 0 credits spent. No claims accepted from the audit text without verification.

**Verdict up front:** the external audit is directionally useful but systematically overstates gaps — it reviewed rendered pages only and could not see the server. **Roughly 60% of its technical checklist is already shipped and live**, including everything it listed as "could not verify". The genuinely valuable findings are a small set of presentation/consistency issues, which this triage prioritises.

---

## 1. Scoreboard: audit claims vs. verified reality

| # | Audit finding | Verdict | Evidence |
|---|---|---|---|
| 1 | "Enable HTTPS-only redirects and HSTS" | **Already live** | `strict-transport-security: max-age=63072000; includeSubDomains; preload` served on production (curl, 9 Oct 2026); Vercel enforces HTTPS |
| 2 | "Set security headers: CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame-ancestors" | **Already live** | All five served; CSP carries `frame-ancestors 'self'` + `report-uri /api/csp-report` (next.config.ts lines 64–160, verified on production) |
| 3 | "Add a robots.txt and XML sitemap" | **Already live** | `src/app/robots.ts` + `src/app/sitemap.ts`; production returns 200 for /robots.txt, /sitemap.xml, plus /feed.xml (RSS) |
| 4 | "Add canonical tags" | **Already live** | `metadata.alternates.canonical` pattern across pages (e.g. /rack-report) |
| 5 | "Add structured data: Organization, WebSite, Article, Dataset, FAQPage" | **~90% live** | Verified in src: Organization (layout + pages), WebSite (layout), Dataset + DataDownload (directory, tracker), BreadcrumbList-style ListItem (directory, articles), FAQPage (/faq). Only `Article` on article pages is unconfirmed — check, add if missing |
| 6 | "Dedicated record pages per facility" | **Already live** | `src/app/directory/[facility]/page.tsx`; /directory/ixafrica-nbox1 → 200 on production |
| 7 | "Directory filters: city, operator, status, type + sort" | **Already live** | directory.tsx: search, tab, status, operator, country, facilityType, sortBy (default live IT load), sortOrder, URL-synced state. Export exists as /data-exports + quarterly dataset bundle |
| 8 | "Sticky navigation" | **Already live** | navbar.tsx uses `fixed top-0 z-50`; items: Data Centres, Infrastructure, Map, AI, Energy, Policy, Careers, Research + quick links (Directory, Tracker, Compare, Ask Jibu) |
| 9 | "Methodology as a first-class page" | **Already live** | /methodology 200; also /editorial-policy, /corrections, /glossary, /faq — the trust stack exists |
| 10 | "Newsletter signup preference question (Investor/Operator/…)" | **Already live** | rack-report-signup.tsx has `select name="role"` with ROLES, aria-labelled, optional |
| 11 | "Preload only critical fonts" | **Already handled** | next/font (Geist) self-hosts and preloads automatically |
| 12 | "Pillar/landing pages for high-intent queries" | **Largely exists** | /data-centres, /kenya, /ai, /energy, /infrastructure, /policy are intent-cluster pages. 8 new pages (audit §8) would partly duplicate them — see §3 |
| 13 | Brand inconsistency (DC254 / Data Centre 254 / DataCentre254) | **Real — minor** | Counts in src: DC254 ×201 (70 files), "Data Centre 254" ×118 (48 files), DataCentre254 ×147 (14 files, mostly metadata/OG strings). Needs a ruled hierarchy + sweep, not a redesign |
| 14 | "Define AI-ready" | **Real — small** | "AI-ready" is used on cards/map but the English glossary has no entry (Kiswahili glossary and a FAQ correction reference it) |
| 15 | Capacity type not instantly readable on every card | **Partially real** | Site already separates live (10.5 MW published IT load) vs designed (42.9 MW) vs announced (230 MW) in stats/tabs, and the pipeline tab is stage-labelled. What's missing: an explicit per-card capacity-type chip (LIVE / DESIGNED / PLANNED / ANNOUNCED) so no MW figure can be misread in isolation |
| 16 | Per-record verification dates "inconsistent" | **Misread** | Per-record dating is correct behaviour — records are verified at different times and the dataset carries per-record verification. The fix is documentation (state the rule), not forced uniformity |
| 17 | Homepage "dense, competing CTAs" | **Partly unfair** | Hero already matches the audit's own recommended pattern: one line ("Inside Kenya's digital infrastructure."), sub-line, dataset-driven stat strip, primary CTAs. Density below the fold can be tuned, not rebuilt |
| 18 | Email-gated PDF download for the report | **Reject as default** | Conflicts with the platform's open-access positioning and the free Rack Report funnel. Keep report free; gating belongs to a future premium tier (editor's call) |
| 19 | Run Lighthouse / Search Console / accessibility audit | **Agreed — needs runtime** | Cannot run PSI/Lighthouse in this sandbox. Editor-side run recommended; we fix what it reports |

## 2. The real gaps, prioritised (all thesis-preserving)

**P1 — Consistency sweep (highest value per hour)**
1. Brand rule + sweep: DC254 = public brand everywhere; "Data Centre 254" = full/publication name (about, privacy, terms); DataCentre254 legacy strings in metadata/OG migrated to DC254.
2. English glossary entry for "AI-ready" (+ link from facility cards and map notes that use it).
3. `Article` JSON-LD on article pages if missing.
4. One-sentence capacity-vocabulary note rendered wherever MW figures appear (links to /glossary or /methodology definitions: live IT load / designed / planned / announced).

**P2 — Make verification scannable**
5. Capacity-type chip on directory cards + record pages: LIVE / DESIGNED / PLANNED / ANNOUNCED, text-labelled (colour never sole carrier).
6. "Verification rule" stated once on directory: "each record carries its own verification date; records verified at different times on purpose."
7. Open-discrepancies surface: the licensing-date conflict the audit found is already documented in the policy dataset — give it a visible home (section on /corrections or /methodology listing open discrepancies with dates), turning a weakness into the rigour proof it is.

**P3 — Product depth (directory as flagship)**
8. Saved views (Operational Nairobi / Under construction / Carrier-neutral / AI-ready) — cheap: URL-state presets of existing filters.
9. Per-record change history on record pages ("status changed / capacity revised / source added" — the dataset already carries verification trails; surface them).
10. Current-view CSV export button in the directory (bundle exists; per-view export is incremental).

**P4 — Growth**
11. Extend existing cluster pages (/data-centres, /kenya, /ai, /energy) with the audit's intent keywords instead of creating 8 new thin pages — avoids doorway-page risk and keeps every claim tied to the verified dataset.
12. Editor-side: run PageSpeed Insights + Search Console; we fix reported CWV/indexing items.
13. Rack Report welcome email pointing to methodology + latest issue (subscribe/verify API already exists).

**P5 — Deliberately deferred / editor's call**
14. Premium tier (full dataset, operator profiles) — strategic, not UX.
15. Public API — /data-exports + sitemap already cover machine access; formalise later.
16. Map layer toggles — map already carries facilities/cables/IXPs with legends and counts; layer UI only if usage data asks for it.

## 3. What we reject or modify, with reasons

- **Email-gating the report PDF (audit §6):** conflicts with the open-access thesis that differentiates the site. The report is a proof-of-rigour asset, not a lead magnet; the Rack Report already does permissioned retention properly.
- **8 new SEO landing pages (audit §8):** half of these intents are already served by cluster pages. New pages without new verified data = thin/doorway risk, the opposite of the evidence-brand. Extend existing pages instead.
- **Homepage rebuild (audit §2):** the hero already implements the recommended hierarchy. Churn risk > benefit; tune below the fold only.
- **"Consistent per-record dating" (forced uniformity):** would falsify the verification model. Document the rule instead.

## 4. 70 → 90 roadmap (grounded)

| Phase | Window | Contents | Expected lift |
|---|---|---|---|
| 1 | Week 1–2 | P1 (brand sweep, AI-ready, Article schema, capacity vocabulary note) + P2 (chips, verification rule, open-discrepancies surface) | Trust legibility — the audit's core complaint, resolved |
| 2 | Week 3–5 | P3 (saved views, record change history, per-view CSV) | Directory becomes a tool, not a list |
| 3 | Week 6–8 | P4 (cluster-page extensions, PSI/Search-Console fixes, welcome email) | Reach + measured performance |
| 4 | Q1 2027 | P5 decisions (premium tier, public API, map layers) | Strategic options only after 1–3 land |

Everything above reuses the existing verified dataset and evidence model. Nothing changes what a claim is, only how fast a reader can see it.
