# Tech Debt Audit — Data-Centers-254

Generated: 2026-10-11 (repeat-run mode: first run)
Protocol: tech-debt-audit skill (9 dimensions, file:line-cited, no padding)
Scope: full repo — src/ (app, components, lib), scripts/, content pipeline, config. ~38.5k LOC TS/TSX/Python.

## Executive summary

- 10 dead component files removed this session (7 section components + 3 shadcn/ui files) plus the orphaned `@radix-ui/react-accordion` dependency — all verified unused by import-graph sweep and `tsc --noEmit` after removal.
- JSON-LD hardening shipped: all 15 structured-data sites now serialize through `src/lib/jsonld.ts` `safeJsonLd()` (escapes `</script>` breakout); previously raw `JSON.stringify` at every site.
- Zero-test repo remediated: vitest + 13 smoke tests now cover the three trust-boundary libs (`subscribe-tokens`, `rate-limit`, `jsonld`).
- `.env.example` was missing 7 variables that code actually reads — documented now.
- `npm audit` reports 9 advisories (5 high, 4 moderate); every one is transitive and either dev-only or gated behind trusted input — details in F003; nothing fixable without breaking changes.
- No `as any`, no `@ts-ignore`, `tsc --noEmit` clean, eslint clean, no TODO/FIXME markers, no dangerouslySetInnerHTML beyond JSON-LD + static init scripts.
- God files exist (5 files >550 LOC) but are cohesive; extraction targets named in F006, not urgent.
- scripts/ holds 49 files, roughly a third one-off editorial generators — evidence trail, documented rather than deleted.

## Architectural mental model

DC254 is a static-first Next.js 16 App Router publication platform with no database. Content lives in `content/articles/*.md` (109 files, gray-matter frontmatter parsed by `src/lib/articles.ts` at build/render time) and versioned JSON datasets (`src/data/directory/current.json`, policy claims, market trackers in `src/lib/*-data.ts`). Pages are server-rendered; interactivity is confined to island components (directory filters, cable explorer, map, Jibu chatbot, search). The API surface (11 route groups under `src/app/api/`) handles newsletter/contact (Resend), the chatbot LLM chain (Groq → NVIDIA → HuggingFace fail-over), search, and security endpoints (CSP tripwire, health, sponsor-click allowlist) — all guarded by a shared rate limiter (`src/lib/rate-limit.ts`) with Upstash-persistent and in-memory modes. Security posture is unusually deliberate for a small team: enforced CSP with violation reporting, double opt-in HMAC tokens, Svix-verified webhooks, sponsor host allowlist. The build pipeline (`npm run build`) runs three generators (PWA prebuild, OG images, now llms-full.txt) before `next build`. Editorial integrity is enforced by four Python gates in `scripts/` (article_validator, audit_assets, audit_links, plus policy/jsonld validators), run per article and per session.

This model matches the README's claims; no drift found between documented and actual architecture.

## Findings

| ID | Category | File:Line | Severity | Effort | Description | Recommendation |
|----|----------|-----------|----------|--------|-------------|----------------|
| F001 | Architectural decay (dead code) | src/components/sections/breaking-news-bar.tsx:1; careers-section.tsx:1; latest-news-banner.tsx:1; read-the-library.tsx:1 (+ read-the-library-inner.tsx, only importer is its dead parent); what-is-dc.tsx:1; who-we-help.tsx:1; src/components/ui/accordion.tsx:1; card.tsx:1; dialog.tsx:1 | Medium | S | 10 files with zero importers anywhere in src/ (verified by import-statement sweep incl. dynamic imports; ui/dialog's Radix dep is still needed by ui/sheet.tsx:4 but the wrapper file itself is dead). ~1,900 LOC of dead weight that still lints, still builds, and still misleads navigation. | ✅ DONE this session — files deleted; see commit history. |
| F002 | Dependency debt | package.json:14 (pre-fix) | Low | S | `@radix-ui/react-accordion` depended on solely by the dead ui/accordion.tsx. | ✅ DONE — `npm uninstall @radix-ui/react-accordion`; `@radix-ui/react-dialog` retained (ui/sheet.tsx:4 imports it directly). |
| F003 | Dependency & config debt | node_modules/braces (via eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch); node_modules/sprintf-js (via gray-matter → js-yaml 3 → argparse) | Medium | L | npm audit: 5 high (braces ReDoS chain) + 4 moderate (sprintf-js). The high chain sits entirely under `eslint-config-next` (devDependency — never ships to production, never parses user input). The moderate chain sits under `gray-matter`, which is a runtime dependency but only ever parses repo-local editorial markdown at build time (src/lib/articles.ts:22 `matter(raw)`), never user input. `npm audit fix --force` would downgrade eslint-config-next to 14.x (breaking) and gray-matter to 2.x (breaking). | Accept with documented rationale (both chains unreachable by attacker-controlled input in production). Re-check when eslint-config-next or gray-matter ship non-breaking majors. Do not `audit fix --force`. |
| F004 | Config debt (env sprawl) | .env.example vs src/lib/chatbot/llm.ts:168-175, src/lib/resend-audience.ts:47, src/app/api/chat/tts/route.ts | Medium | S | 7 variables read by code were absent from .env.example: CHAT_LLM_API_KEY / CHAT_LLM_BASE_URL / CHAT_LLM_MODEL / HUGGINGFACE_MODEL / CHAT_TTS_MODEL (all legacy aliases in the Jibu provider chain), RESEND_AUDIENCE_ID (alias of RESEND_SEGMENT_ID), plus editor-side CONTEXT_DEV_API_KEY and FIRECRAWL_API_KEY (scripts/ only). A future operator auditing envs against the template would miss them. | ✅ DONE — all 7 documented in .env.example with alias relationships explained. |
| F005 | Test debt | package.json:5-11 (scripts had no test entry); src/lib/subscribe-tokens.ts; src/lib/rate-limit.ts; src/lib/jsonld.ts | High | M | Zero tests, zero test runner, zero coverage tooling — while the repo ships HMAC token signing, a two-backend rate limiter, webhook verification, and a multi-provider LLM chain. The four Python content gates and eslint/tsc cover content and types, but no runtime behavior was ever executed by CI. | ✅ STARTED — vitest installed, `npm test` wired, 13 smoke tests over subscribe-tokens (round-trip, wrong-action, tamper, expiry, prod fail-closed), rate-limit memory backend (limit→429, window reset, bucket/client isolation, XFF parsing), safeJsonLd (breakout escape, validity, clean-passthrough). Next increments when needed: subscribe/route.ts handler tests with mocked Resend, llm.ts provider fail-over with mocked fetch. |
| F006 | Architectural decay (god files) | src/app/policy/intelligence/control-room.tsx (1,149 LOC); src/components/east-africa-infrastructure-map.tsx (992); src/app/policy/intelligence/matrix-console.tsx (890); src/components/tracker/cable-explorer.tsx (695); src/lib/chatbot/intents.ts (662) | Medium | M–L | Five files exceed 550 LOC. Read before judging: control-room and matrix-console are one cohesive console UI whose sections share a single selection state — splitting would thread props through a new boundary for no behavior win. cable-explorer and the EA map mix static geo/cable datasets with rendering logic; the datasets are the extractable part. intents.ts is a flat rule table — length is data, not complexity. | Leave the console pair intact (cohesive, sectioned, documented at top). Scoped extractions if touched again: (a) EA map: move the hardcoded country/metro coordinate tables into src/lib/map-data.ts (already exists for this purpose); (b) cable-explorer: same for its cable-brand color/datum constants; (c) intents.ts: no action. |
| F007 | Consistency rot (scripts/) | scripts/evidence_v02_fetch.py…fetch6.py, evidence_v02_review_fetch.py…fetch4.py, fix_aws_gap4.py, fix_badge_flag_gpu_gap7.py, bump_r14.py, policy_upgrade_r13.py:1, policy_upgrade_r17.py:1, directory_update_g42_202610.py, directory_update_g42_reuters.py, convert_uploaded_images.py vs convert_uploaded_images_20261007.py, plus stray artifacts bd_somaliland.html, fetch_src.sh | Low | M | 49 files, of which ~15 are dated one-off editorial generators (evidence/tracker update passes). They are historical evidence of the editorial verification trail referenced from AGENT_CONTEXT chronology; some interlink by exact path. Deleting would break the audit trail; moving would break cross-references for no runtime benefit (nothing in src/ imports scripts/). | Leave in place. If the folder keeps growing past ~60 files, introduce scripts/archive/ and bulk-move one-off passes in a single documented commit (update AGENT_CONTEXT references in the same commit). |
| F008 | Security hygiene (defense-in-depth) | src/app/articles/[slug]/page.tsx:145-149; src/app/directory/page.tsx:121; src/app/directory/[facility]/page.tsx:207; src/app/tracker/page.tsx:201; src/app/tracker/{power,cables,licensing}/page.tsx:53-56; src/app/faq/page.tsx:131; src/app/glossary/page.tsx:58; src/app/glossary/kiswahili/page.tsx:129; src/app/research/state-of-the-market-2026-q3/page.tsx:87 | Medium | S | 15 JSON-LD sites embedded `JSON.stringify(...)` directly into dangerouslySetInnerHTML. JSON.stringify does not escape `<`, so any frontmatter string containing `</script>` (e.g. a title pasted from an HTML source page) would terminate the JSON-LD block early and inject script into server-rendered HTML. Data is editorial/trusted so not externally exploitable — but it was one bad paste away from stored XSS. | ✅ DONE — new `src/lib/jsonld.ts` `safeJsonLd()` (escapes `<`, U+2028, U+2029) used at all 15 sites; covered by tests. |
| F009 | Error handling & observability | src/app/api/subscribe/route.ts:246; src/app/api/contact/route.ts:132 (and 20 sibling `{ error }` sites) | — | — | Nothing material. Error shape is consistent (`{ error: string }` × 20 sites), rate limiting is applied in all 11 API route groups, and console.* usage (21 sites) is confined to server-side API routes + error.tsx where Vercel log drains capture it — correct for serverless. | Nothing to do. |
| F010 | Type & contract debt | rg "as any|@ts-ignore|@ts-expect-error|@ts-nocheck" → 0 hits; `tsc --noEmit` → 0 errors | — | — | Nothing material. Zod is present (zod ^3.23.8) for trust-boundary validation. | Nothing to do. |
| F011 | Documentation drift | README "SEO" section vs src/app/llms + public/llms.txt; README structure tree vs src/ | Low | S | README accurately describes SEO surface, stack, and structure. One gap: llms.txt was documented but llms-full.txt (the spec's expanded sibling) 404'd in production — a promised artifact that didn't exist. | ✅ DONE — scripts/generate_llms_full.mjs now produces public/llms-full.txt at build (1.45 MB, 109 articles, deterministic), wired into `npm run build`, cache headers added (next.config.ts), artifact gitignored per the public/og/ convention. |
| F012 | Performance hygiene | next.config.ts:132-136 (image variant trimming already shipped); src/components/ListenBar.tsx (551 LOC, client component on article pages) | Low | — | No N+1 (no DB), no sync-in-async on hot paths, images already tuned (Task 92). ListenBar is the heaviest per-article client component but is audio-only and lazily exercised; splitting it is not justified by any observed cost. | Monitor via Vercel Analytics; no action. |

## Top 5 "if you fix nothing else, fix these"

1. **F008 — safeJsonLd at all JSON-LD sites** ✅ done this session. The only finding that converted a latent stored-XSS path (via editorial input) into a non-issue.
2. **F005 — first runtime tests** ✅ seeded this session. The subscribe-token lifecycle and rate limiter gate real production actions; they must never regress silently. Next increment: handler-level tests for /api/subscribe with a mocked Resend client.
3. **F001/F002 — dead code + orphaned dep** ✅ done. Small in isolation, but dead components on a solo-maintained repo are how regressions breed (someone edits the "live" copy of a duplicated section).
4. **F004 — env template truth** ✅ done. The Jibu provider chain activates purely on env presence; undocumented aliases make fail-over behavior opaque to the next operator.
5. **F003 — npm audit acceptance, in writing.** The remaining advisories are unfixable without breaking changes and unreachable in production. The action item is *documented acceptance + re-check on next major*, which this file now records.

## Quick wins

- [x] F001 delete 10 dead component files (S, Medium)
- [x] F002 drop @radix-ui/react-accordion (S, Low)
- [x] F004 document 7 env vars (S, Medium)
- [x] F008 safeJsonLd helper + 15-site swap (S, Medium)
- [x] F011 generate llms-full.txt at build + cache headers (S, Low)
- [x] F005 vitest + `npm test` + 13 smoke tests (M, High)
- [x] Wire `npm test` into CI alongside eslint + build — done in .github/workflows/ci.yml (audit O02, CI run e353825 green)

## Things that look bad but are actually fine

- **`window.history.replaceState` in three components** (src/components/tracker/cable-explorer.tsx:311, src/components/east-africa-infrastructure-map.tsx:426, src/app/search/SearchClient.tsx:125): Google's 2026 spam policy on back-button hijacking targets *defeating the Back button* (pushState spam, forced redirects). These are filter-state URL syncs on user action — standard practice, no navigation interception. Left alone deliberately.
- **CSP `script-src 'unsafe-inline'`** (next.config.ts:102): documented compromise for the Next.js inline bootstrap; everything else is locked to self + two analytics origins, violations report to /api/csp-report. Tightening via nonces is possible but was already assessed and deferred as the only remaining CSP compromise in the 2026-10-11 security audit.
- **Zero `as any` but heavy `Record<string, ...>` use in datasets**: the JSON datasets are versioned, quarterly-snapshotted editorial artifacts validated by the Python gates; typing their internals more strictly would duplicate the validator logic in TypeScript for no runtime gain.
- **console.* in API routes** (21 sites): server-side structured-enough logging on Vercel; a logging framework would be ceremony for a site this size.
- **11 sitemap entries hardcoded to editorial dates** (src/app/sitemap.ts:78,90,129): deliberate anti-churn policy documented inline at sitemap.ts:8-24 — "everything changed on every deploy" was the bug; deterministic staleness is the fix.
- **Two consent-gate inline scripts** (src/components/consent-gate.tsx:61,72): static, keyless GA4/Clarity bootstrap strings — no dynamic interpolation, no injection surface.
- **git history contains a scraped Google Maps key** (redacted in 5f456b7): upstream public-by-design exposure of a third party's own key; history rewrite declined on proportionality (documented in the security audit, 2026-10-11).

## Open questions for the maintainer

1. **scripts/ archive policy (F007):** keep the one-off editorial generators in place as an evidence trail, or introduce scripts/archive/ at the next natural boundary (~60 files)? Currently leaning "leave".
2. **CI test wiring:** add `npm test` to the Vercel/CI pipeline? The tests are local-runnable now; CI wiring was not touched this session because the CI config is owned by Vercel defaults.
3. **Handler-level test depth:** are /api/subscribe and /api/contact worth handler tests with mocked Resend, or do the lib-level smoke tests plus production rate limits suffice at current traffic?
4. **God-file extractions (F006a/b):** worth doing the next time those two components are touched for feature work, not before — confirm or overrule.
5. **llms-full.txt footprint:** 1.45 MB static file, CDN-cached, regenerated on every build. If origin-transfer ever becomes a concern again (Task 92 history), the file can be split per-cluster — flagging the tradeoff now.

*No findings were padded; categories with nothing material say so (F009, F010, F012).*

## Repeat run — 2026-10-11 (post-IndexNow implementation, Task 115)

Method: 9-dimension re-sweep with the new code in tree, plus live verification of the prior dispositions. This run doubles as the Karpathy-guidelines benchmark (see AGENT_CONTEXT.md, Task 115): every new line was written under the four rules, and the benchmark evidence is cited per rule there.

### Prior findings F001-F012 — dispositions hold

Re-verified: the 10 dead-code files remain deleted (zero importers re-checked on the current tree); `.env.example` still documents all 7 vars; vitest 13/13 still green; safeJsonLd still wired at all 15 JSON-LD sites; llms-full.txt still generated at build and served with cache headers (live probe 200). No finding regressed.

### New findings from this run: none material

The IndexNow implementation (commit 026a095) was audited as if it were foreign code, per the protocol:

- **No new dependencies.** package.json diff is the `indexnow` npm-script line only; the script uses Node built-ins (`fetch`, `node:fs`, `node:path`).
- **Net LOC negative:** +78 (scripts/indexnow_submit.mjs) −83 (scripts/indexnow_ping.py removed) −1 (my own duplicate key file removed before commit).
- **Robustness dimension:** key discovery fails loud when the public/ hex-named key file count ≠ 1 (verified live: exit 1 with two files present); HTTP failures exit 1 and print the response body; submission state persists only after a 2xx so a failed run retries the same URLs (no silent skip).
- **Duplication dimension — one micro-finding, fixed in the same commit:** the repo had TWO IndexNow paths after 026a095's predecessor work (c1e590a, 2026-09-16) added a manual-only full-sitemap pinger (`indexnow_ping.py`, never referenced anywhere, resubmitted all URLs on every run). Consolidated to one automated, lastmod-diffed path; the superseded script is removed.
- **Configuration-drift dimension:** `.indexnow-state.json` is committed (reviewable diffs, survives ephemeral CI runners), state commits carry `[skip ci]` to avoid pointless CI runs; no gitignore changes.

### Blocker recorded (not debt, editor action)

The deploy-triggered workflow (`.github/workflows/indexnow.yml`, staged in the workspace at pending/indexnow.workflow.yml) cannot be pushed: the current Personal Access Token lacks the `workflow` scope, which GitHub enforces for any commit touching workflows. **RESOLVED same day:** the editor supplied a token with Contents + Workflows write; the workflow shipped in commit 2818699 (CI double-green) and now fires on production `deployment_status: success`. The in-session `npm run indexnow` step remains as belt-and-braces. Residual nicety, not debt: the token lacks Actions write, so CLI dispatch 403s — editor-side UI dispatch or an Actions-permission grant covers manual runs.

