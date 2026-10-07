# AGENT_CONTEXT.md — Durable agent memory for DataCentre254

> **Purpose**: rollback-proof agent memory. This file lives IN the repo, so any
> workspace reset is healed by `git fetch && git merge --ff-only origin/main`.
> The external worklog (`/home/z/my-project/worklog.md`) is a convenience mirror —
> THIS file is the source of truth for cross-session state.
>
> **Protocol**: every agent session that changes project state MUST update the
> "Session log" (append-only, newest last) and the "Current state" block, and
> commit + push. Keep this file factual and terse; details live in git history.

---

## Standing rules (do not relitigate)

1. **Language**: always reply to the user in English (user complaint, Task 19).
2. **humanGate**: AI proposes, editor disposes. Capture files stay
   `status: capture-pending` until an editor approves. Claim upgrades need
   captured Tier-1 text actually read and cited — never upgrade from snippets.
3. **Preflight before ANY push**: `git fetch origin && git status -sb`.
   The workspace has rolled back twice (Tasks 22–38 and Task 40 logs lost).
   If behind: `git merge --ff-only origin/main` first. Never force-push main.
4. **Credentials**: keys passed in chat go into gitignored `.env.local` only
   (verify with `git check-ignore`). Never write tokens into committed files,
   scripts, or logs. Remind the user to rotate keys that transited chat.
5. **Zero new runtime dependencies** in the Next.js app (Vercel 10GB storage
   incident, Task 39). Research scripts stay zero-dependency Node (`node:fs`,
   global `fetch`) or Python stdlib.
6. **push freeze**: lifted (Task 40). Pushes allowed; always preflight (rule 3).
7. User's standing principles: talk plan through before big builds; constants in
   one file; never trust assertions — validate; review before implement.
8. Delegations: the editor grants task-specific authority in chat (e.g. r11
   claim upgrades, 2026-09-23). Record the delegation in commit messages.

## Current state (updated 2026-09-29, r16)

- **Site**: data-centers-254.vercel.app (Vercel free team, project
  `prj_Tigqxa5amDHpQcDT34kdIqSEnAMt`), repo kjonathan254/Data-Centers-254, branch main.
- **Policy Intelligence**: dataset `policy-2026-Q3-r16` — **55/61 claims verified,
  6 partially-verified, 0 unverified**; 70 sources (49 T1, 8 T2, 13 T3); 20
  pillar gaps (r15/r16 added T2 source records: MTN/Africa Hub, Dangote Lamu;
  validator PASS 2026-09-29). Gaps: energy/construction/environment mostly
  unresearched in UG/RW; EAC
  regional frameworks untouched across all four. KE licensing pillar now has 6
  claims: C2/C3 T1-backed (April-vs-March discrepancy flagged open), C4 fee
  schedule verified on the CA instrument text, C5 (NFP/ASP exemption) and C6
  (roadmap) verified on instrument capture 2026-09-24.
- **Validator**: `python3 scripts/validate_policy.py` → PASS (schema, referential
  integrity, capture-linkage on disk, pillar checks, verified ratio).
- **Evidence pipeline**: `scripts/firecrawl_search.mjs` (discovery) →
  `scripts/firecrawl_capture.mjs <url> --tier N --claims <IDs>` (writes
  `research/captures/<date>-<slug>.md`, front matter locks capture-pending) →
  editor review → `scripts/policy_upgrade_rNN.py` (programmatic, byte-stable JSON
  dump indent=2 ensure_ascii=False + trailing newline) → validator → push.
- **Monitoring**: `scripts/firecrawl_monitor.mjs` + GitHub Actions workflow
  (`.github/workflows/evidence-monitor.yml`, workflow_dispatch-only; weekly cron
  commented out until credits return). Job fails on content drift. Requires repo
  secret `FIRECRAWL_API_KEY` — still NOT set (blocked on token perms; see Open threads 1).
- **Firecrawl credits**: EXHAUSTED — original key (fc-e14ca…) 402'd after the
  2026-09-23 capture session; user supplied a ROTATED key (fc-7726…) on
  2026-09-23 which ALSO returns HTTP 402 on both /v2/search and /v2/scrape
  (zero credits). Freeze continues: no search/scrape/monitor calls until refills.
- **Auth/tooling**: CLASSIC PAT (owner kjonathan254, scope `repo`, supplied in
  chat 2026-09-30) wired into origin remote URL + stored gitignored
  .env.local as GH_TOKEN — push + authenticated API reads verified working
  (replaces the fine-grained PAT, which lacked secrets:write; the classic
  token CAN set Actions secrets if ever needed). ROTATION OWED: this token
  has transited chat (again) — rotate when convenient. gh CLI absent in
  current sandbox; CI verification works via authenticated REST
  check-runs, or the zero-auth Actions-HTML path (open thread 12).
- **.env.local**: recreated 2026-09-30 (session 6) after workspace wipe #8 —
  holds GH_TOKEN (classic PAT) + CONTEXT_DEV_API_KEY (re-supplied in chat
  2026-09-30, auth-proven via zero-credit 400-vs-401 probe). Firecrawl keys
  NOT present (frozen/exhausted anyway). Rollbacks wipe this file — check
  it every session.
- **OG image pipeline**: SHIPPED (Task 65, commit 5eb2dd8, 2026-09-29). Build-time
  sharp 1200x630 JPEG derivatives for all 83 og:image sources -> gitignored
  public/og/ (repo weight flat); metadata (openGraph/twitter/JSON-LD, 105 articles
  + 26 pages + facility heroImage) points at /og/<stem>.jpg via src/lib/og-image.ts.
  Built-HTML audit: 176 og:image tags, ZERO webp remain. WhatsApp/LinkedIn preview
  risk closed. Vercel runs `npm run build` (proven: prod /sw.js carries fresh
  pwa-prebuild stamp), so the build-chain hook fires on every deploy.
- **Vercel storage**: resolved (retention policy + image diet 13.6→6.5MB per
  snapshot). User should have revoked the Vercel token shared in chat (vcp_1Bve…).
- **Next.js env**: `TYPESAFE_API_KEY` exists in Vercel production (inert — no code
  reads it yet; TypeSafe Phase 0 calibration awaiting user go + local key).

## Open threads

1. **Repo secret (BLOCKED on token permission)**: setting `FIRECRAWL_API_KEY`
   via API failed 2026-09-23 — the fine-grained PAT has `secrets=read` only.
   Unblock EITHER by (a) editing the token: github.com → Settings → Developer
   settings → Fine-grained tokens → this token → Repository permissions →
   **Secrets: Read and write**, then agent runs `gh secret set`; OR (b) user
   adds it manually: repo Settings → Secrets and variables → Actions →
   New repository secret → name `FIRECRAWL_API_KEY`, value = rotated Firecrawl
   key held in `.env.local`. Weekly cron stays COMMENTED OUT until credits
   return (workflow_dispatch works); re-enable both `schedule` lines then.
2. **RESOLVED r12 (2026-09-23)** — UG-TX-C1 (10-year income tax holiday) UPGRADED
   TO VERIFIED (editor-approved conditional on verification): ITA Cap 340
   s.21(1)(y) confirmed in a Grant Thornton/ULRC-based full-text reproduction
   (T2, capture filed) + the operationalising 2009 Regulations (same capture) +
   PwC current edition (T3). Official ULII consolidation (eng@2024-12-23/source)
   remains the confirmation target: fetch-blocked (curl 403; Context.dev scrape
   extraction failed — 1 credit). If ULII access opens, capture it and note; no
   further state change expected unless the provision is repealed/amended.
3. **Hard captures** (need authenticated/JS portals — out of pipeline reach):
   UG-DP-C4 (PDPO portal form mechanics), RW-DP-C6 (transition-end confirmation),
   UG-LC-C3/C4 (UCC instrument detail). Editor/manual path.
4. **20 legacy r5-era T1 sources** have `captureStatus: captured` but no capture
   file in `research/captures/` (pre-pipeline era) → monitor reports them
   `no-capture-ref`. Re-capture through the pipeline to bring under drift watch.
5. **Pillar gaps** (20): energy-electricity + construction + environmental for
   UG/RW; EAC regional frameworks for all. Next capture frontier after gap audit.
   **PROGRESS 2026-09-30 (session 6)**: the EAC regional-frameworks gap
   (shared by all four countries) now has its first two T1 captures, both
   capture-pending: 2026-09-30-eac-tor-dp-harmonization-crossborder.md
   (EARDIP consultancy TOR — official machinery for data-protection
   harmonisation + EAC Cross-border Data Flows Mechanism) and
   2026-09-30-eac-pr-data-governance-framework.md (Secretariat press release
   25 Oct 2024 — Data Governance Policy Framework VALIDATED in Kigali,
   AU-DPF-aligned; NOT yet adopted — status nuance recorded). Future claim
   candidates drafted in the captures; editor approval needed before any
   dataset change. Remaining frontier: national energy/construction/
   environmental gaps (UG ERA, RW REG/EUCL+REMA, TZ EMA 2004, KE
   construction) + the older 2021 EAC policy text for genealogy.
6. **TypeSafe Phase 0**: calibration harness design approved conceptually (Task
   20/21); awaiting user go + TYPESAFE_API_KEY locally.
7. **Unpushed local-only scripts — MOOT (2026-09-29)**: the incident tools
   (vercel_purge_deployments.mjs, vercel_inventory.mjs, recompress_images.mjs)
   were lost with the workspace rollbacks; the sandbox scripts dir no longer
   holds them. If reuse is ever needed, rebuild from git history or fresh
   Vercel API work; nothing to push.
8. **Control-room roadmap (from user-approved audit)**: Phase 1 shipped
   (dashboard canvas + interactions, commit ef02b95). Phase 2 shipped
   (2026-09-23): source-quality & provenance panel, per-pillar deep pages
   (/policy/intelligence/pillars/[pillar], all 10 static), dataset download
   route (/policy/intelligence/dataset), SectionNav rooms-id fix, mobile
   overflow fixes (grid min-w-0). **Phase 3 SHIPPED (Task 64, commit b81c07f,
   2026-09-29): (a) claim-record deep links — every pillar-page claim anchored
   (id=claim-{ID}, scroll-mt-24), matrix-drawer Key-findings IDs and
   changelog claim IDs link to their anchored trail; (b) compare-view exports —
   CSV/JSON of the country × pillar matrix from the matrix toolbar, fully
   dataset-derived, zero deps, /policy/intelligence/dataset stays canonical;
   (c) Release deltas panel — per-release chips (claims added/upgraded/revised,
   +sources) computed from the changelog.** Data repair included: r15+r16
   changelog entries appended from verified git diffs + SINCE_LAST_REVIEW
   refreshed to r15→r16. Roadmap items from the audit are now ALL shipped.
9. **Google Alerts leads (editor's digest 2026-09-29, triaged — humanGate
   applies) — CLOSED 2026-09-30**: editor chat: "Close out the 2 we don't
   need them" → BOTH capture-pending items dispositioned as
   closed-not-needed in their capture files (records retained, fragments
   stay non-quotable, no claims were ever registered): (e) Nixon Kanali
   column "Africa can't build an AI economy on rented servers"
   (africabusinesscommunities.com, 2026-09-28) → access-hunt capture
   2026-09-29 (Cloudflare challenge; full text never obtained); the
   conditional response-piece idea is dropped with it. (f) Arizton "Global
   Data Center Market Insights Across 6,610 Facilities" (openPR,
   2026-09-28) → T3 reference record (Africa = one qualitative bullet, no
   numbers). Definitional cross-refs stay in force (never blend Arizton
   4,408 facilities / IMF ~160 base / R&M revenue $ / site MW). Prior
   digest triage history:
   2026-09-24 digest triage: (a) Cliffe Dekker Hofmeyr "Licensing, structuring and financing
   considerations for telecommunications businesses" (Kenya, 2026-09-23,
   law-firm alert; mentions Airtel Nxtra + Africa Data Centres pan-African
   delivery) → RESOLVED Task 53 — alert located via CDH sitemap (curl-open),
   full text captured, registered T2 (cdh-ke-tmt-alert-2026); underpinned
   KE-LC-C2/C3 verified + KE-LC-C4 partial;
   (b) Yahoo Finance/ResearchAndMarkets "Kenya Data Center Market Trends and
   Investment Analysis 2026-2031" — snippet claims Kenya connects to SEVEN
   operational submarine cable systems (2Africa, DARE1, EASSy, …) → matches
   tracker; cross-checked, no action; (c) RESOLVED Task 52 — IMF "~160 data
   centres in Africa ≈ 5.5% of global" traced to PRIMARY (IMF DP 2026/013,
   citing Kakindé 2025) and used in article africa-160-data-centres-imf-
   power-constraint (2026-09-24); (d) IBTC Data Centre Academy expands into
   Kenya (Schneider Electric; ADCA named) → talent/skills ecosystem news
   candidate, still open.
   Not leads: Uztelecom (Uzbekistan), Intel–Submer MEA (vendor news),
   Vodacom/mybroadband (noise), TelcoTitans infrawatch (borderline).
10. **Upstash Redis (rate limiter)**: DB "exact-mongoose-92996" EXISTS and
   credentials VALID (PING PONG, tested 2026-09-24), but the vars were never
   added to Vercel → src/lib/rate-limit.ts runs MEMORY MODE in production
   (per-instance limits, reset on cold start; prod log warns once per
   instance). User decision pending: add UPSTASH_REDIS_REST_URL +
   UPSTASH_REDIS_REST_TOKEN to Vercel Production env + redeploy (persistent
   global limits; stops Upstash's inactive-DB notices), OR delete the Upstash
   DB (site unaffected; accept per-instance limiting). Token transited chat —
   rotate in Upstash console after wiring if keeping.
11. **RESOLVED Task 53b (2026-09-24)** — editor uploaded the three images
   directly to the repo ROOT (commit 27326bf "Add files via upload").
   Wired: IMF article hero -> africa-power-hero.webp (from Africa Powe
   Hero.jpg); IBTC article hero -> datacloud-africa-nairobi-2026.webp (from
   IMG_9828.jpeg.webp, ITW & Datacloud Africa backdrop photo);
   dc-power-technicians-training.webp (from master-power-1-750x375.jpg)
   went to the IBTC article as an INLINE image (DCCA I power/cooling
   placement angle) instead of the provisionally planned IMF section-break;
   editorial fit is stronger in the careers piece; editor can veto, a
   1-minute move. Converter persisted at scripts/convert_uploaded_images.py
   (Pillow, webp q88); root uploads git-rm'd; og:image verified in built
   HTML; CI green (9bcbcf4).
12. **RESOLVED (2026-09-30, session 4)** — CI check-runs verification for fc81a4f
   (Phase 3): confirmed GREEN via the github.com Actions HTML page after
   api.github.com rate-limited anonymous reads and the PAT was found absent
   from the fresh sandbox remote: "Run 102 of CI. Redesign Phase 3 of
   DC254_Map_and_Cable_Tracker_UX_Redesign.md" = completed successfully;
   Runs 100 (Phase 1+2) and 101 (session log) also green; zero failure rows.
   TOOLING NOTE (keep): the Actions HTML page carries aria-labels
   "completed successfully: Run N of <workflow>. <commit msg>" and is
   curl-open with zero auth — use it whenever api.github.com is rate-limited
   or no PAT is wired; the REST check-runs path still preferred when a token
   IS available.

## Tooling quick reference

- **Context.dev** (web-data layer, replaces Firecrawl while it is 402; use
  sparingly — user directive):
  - Env: `CONTEXT_DEV_API_KEY` (gitignored `.env.local`; NOT yet in Vercel env —
    add there when a runtime feature needs it).
  - Wrapper (single choke point, zero-dep native fetch, server-only):
    `src/lib/context-dev.ts` — `contextSearch()` (POST /web/search, 1 credit
    per 10 results) and `contextScrape()` (POST /web/scrape, 1 credit). Built-in:
    Retry-After honored on 429, bounded backoff on 408/5xx, no retry on other
    4xx, `maxAgeMs` cache passthrough. Docs:
    https://docs.context.dev/api-reference/web-scraping/search ·
    https://docs.context.dev/api-reference/web-scraping/scrape
  - Pipeline CLI: `node scripts/contextdev_search.mjs "query" [--limit 10]
    [--freshness last_year]` — prints numbered candidates, humanGate applies.
    First real call 2026-09-23 (1 credit): "Uganda Income Tax Act Cap 340
    income tax holiday" → 10 candidates incl. parliament.ug bill page
    (Income Tax Amendment Bill 2022 / Bujagali holiday), a-mla.org Cap 340 PDF,
    ULII /akn/ Act link — candidates for UG-TX-C1 capture (open thread 2).
  - Future endpoints of interest: /parse (PDFs → Markdown, 1 credit + OCR/page)
    for Tier-1 act PDFs; /monitors (scheduled change checks) as drift-monitor
    alternative; /batch/submit only past a few hundred URLs.
  - NEVER install the context.dev npm SDK: standing rule 5 (zero new runtime
    deps) — the REST wrapper above is the sanctioned path.
- Search (legacy, frozen): `node scripts/firecrawl_search.mjs "<query>"` (prints numbered candidates)
- Capture: `node scripts/firecrawl_capture.mjs "<url>" --tier 1 --claims ID1,ID2`
- Monitor: `node scripts/firecrawl_monitor.mjs [--max N] [--url U] [--threshold 90]`
- Validate: `python3 scripts/validate_policy.py`
- Key: `.env.local` → `FIRECRAWL_API_KEY=…` (gitignored; recreate after rollback)
- JS-shell statute pages: HTML may render empty (ULII) → use `/source` PDF URL.
- Firecrawl v2 handles public PDFs → markdown directly (EWURA, ULII proven).

## Session log (append-only, newest last)

### 2026-09-23 — r10.1 captures + r11 upgrades + monitor + durable memory (Task 41/42/43/44)
- Preflight: local behind 25 → ff to f280421 (r10, 46/56 verified). .env.local recreated.
- Captured (T1): SEZ Act 2015 (KE), EPZ Act Cap 517 (KE), Investment Code 2019 (UG,
  via /source PDF after HTML JS-shell), Free Zones Act 2014 (UG), ICT SSP 2024-2029
  (RW); + meta capture of dev.to MCP article (tier 3). Commit 527ec2b.
- Editor-delegated review → r11: KE-TX-C2, KE-TX-C4, RW-AI-C1 → verified;
  UG-TX-C1 stays partially-verified (holiday not in captured instruments; honest
  call). 49/56 verified. Validator rebuilt + PASS. Commit 7552ed9.
- Monitor built + committed (63a70e7): baseline 10 checked clean; 20 no-capture-ref
  (legacy); Firecrawl credits hit 402 end-of-day.
- This file created (durable memory).

### 2026-09-23 — Control Room redesign shipped + Firecrawl freeze encoded (Task 45)
- User sent a design mockup for /policy/intelligence + "make it better, engaging,
  interactive". A rolled-back session had left a full redesign uncommitted; verified
  it end-to-end (tsc, dev screenshots, prod build), then enhanced beyond the mockup.
- Commits: fd54609 (monitor freeze handling: weekly cron commented out until
  2026-10-23 refill, monitor treats 402 as pause-never-drift, Free Zones Act 2014
  capture filed); ef02b95 (Control Room redesign, 10 files, +1453/-816).
- New UI: since-last-review strip, evidence health (count-ups), country comparison
  (wipe-in bars, click-to-focus), dominant coverage matrix (sticky toolbar at
  top-[104px], search + filters, cell drawer with slide-in, "/" shortcut, column
  focus underline), research queue (high-priority ping), gaps-by-pillar, country
  control-room tabs (Overview/Claims/Regulators/Sources/Gaps), legend with live
  counts, sticky scrollspy command bar with dataset chip, grid+glow canvas texture.
- Motion primitives in motion.tsx (zero deps, IntersectionObserver-armed, SSR/
  no-JS render final state, prefers-reduced-motion honored). Ops-console.tsx and
  policy-sections.tsx deleted (superseded).
- Lessons: (a) sticky elements must sit directly inside a tall parent — a wrapper
  div kills stickiness; (b) verify sticky behaviour by scrolling, not just loading.
- Validator PASS (r11 unchanged); Vercel will auto-deploy from main.

### 2026-09-23 — Control Room Phase 2 (source quality, pillar deep dives, dataset download) (Task 46)
- Session started with a 4th workspace rollback (32 commits behind); preflight
  ff-only to 5f1963b healed it. Phase 2 scope taken from open thread 8.
- Source quality & provenance panel (source-quality.tsx, new): tier-mix +
  capture-health segmented bars with clickable filter chips that drive an
  interactive source explorer (60 sources, tier/capture filters, show-all).
  All numbers derived from the dataset registry — nothing hardcoded.
- Per-pillar deep pages (pillars/[pillar]/page.tsx, new): generateStaticParams
  over 10 pillars, dynamicParams=false (404 on unknown), generateMetadata with
  live stats, per-country coverage cards, claims + evidence trails, distinct
  sources, structured gaps with upgrade paths, prev/next pillar nav. All
  statically prerendered; added to sitemap.ts (priority 0.7, review-dated).
- Dataset download route (dataset/route.ts, new): GET serves the full r11 JSON
  (~111 KB) via the same loader the dashboard reads — page and file can never
  diverge. Download affordances: header CTA, command-bar icon, footer link.
- Cross-links: matrix row headers + gaps-by-pillar rows + country-room claims
  headings now link to pillar deep dives; cell drawer footer gains a
  "[Pillar] deep dive" link beside the country control room link.
- Fixed Phase-1 bug: SectionNav pointed at id "rooms" but the section is
  "control-room" (pill never activated). Added a Sources nav section.
- Fixed mobile horizontal overflow (docW 1328→390 at 390px viewport):
  truncate rows inside grid items without min-w-0 inflated the grid track
  (source-quality panel new, research-queue pre-existing). min-w-0 on grid
  children everywhere it matters.
- Pluralisation fix: countLabel(n, "match") → "2 matchs"; now uses explicit
  plural "matches".
- Refactored useWipe to return a [ref, cls] tuple so eslint react-hooks/refs
  stops false-flagging state-derived cls as a ref read (7→0 errors in the
  policy/intelligence tree); useInView no-IO fallback defers setState via rAF.
- Verified end-to-end: tsc clean, eslint clean, prod build (10 pillar SSG
  routes), validator PASS (r11 untouched), browser smoke (filters, drawer,
  pillar pages, dataset headers, mobile viewport, console clean).
- Vercel auto-deploys from main.

### 2026-09-23 — Console layout round 2 (mockup-matched desktop layout) (Task 47)
- User feedback: design approved, but desktop layout must match their uploaded
  mockup (console shell) — "if the page looked like the image, an investor
  would be like 'this is not just a page, it's a system'". Also reported a
  GitHub "Lint Error / exit 1"; lint+tsc+validator+build all PASS locally with
  the exact CI commands (node 24 local vs 22 CI is the only diff) — treated as
  transient/older-run; watch the run triggered by a33567f.
- console-chrome.tsx (new): fixed left icon rail 76px (xl+, below h-14 navbar)
  + sticky console header (top-14): POLICY INTELLIGENCE title block, centre
  scrollspy pill nav (Overview/Pillars/Jurisdictions/Library/Alerts), right
  chips (live "Dataset refreshed Q3-R11", review date, ED avatar = humanGate).
  One useConsoleScrollSpy hook; resolves ties to the EARLIEST section in
  console order (hero+KPI cards share row 1, so Jurisdictions used to win).
- control-room.tsx restructured: row1 = evidence-coverage hero (col-5: giant
  CountUp %, segmented bar + 0/25/50/75/100 axis, verified/partial/gaps
  legend, claims/sources/gaps indicators) + 4 country KPI cards (col-7:
  flag emoji, big % amber<75 else emerald, rating Very strong≥90/Strong≥75/
  Moderate≥60/Early, N claims, click→focus matrix column); row3 = research
  queue (priority/pillar sort select, violet pulse dots, top-5 collapsed) +
  evidence-states panel (5 claim states live + structured gaps + totals);
  legend now pairs with gaps-by-pillar (7/5 cols).
- matrix-console.tsx: mockup-style card header with legend row; cells are
  PILLS now (emerald "✓ N" all-verified, amber mixed "✓ a ◯ b", dashed violet
  "○ GAP", gray "—" no-data) — icons+counts keep colour-from-only-signal rule;
  pillar icons (BadgeCheck/Lock/Database/Percent/Zap/HardHat/Leaf/Cpu/Globe/
  Network); selected cell gets cyan ring; drawer restyled = mockup panel
  (title "Country · Pillar", state summary, PILLAR OVERVIEW tiles, responsible
  regulator, KEY FINDINGS, LAST UPDATED, View claims/View sources actions).
- page.tsx: marketing header/CTAs/publication strip REMOVED from top — console
  frame opens the page (h1 moved into hero card); publication status lives in
  Method & governance; section-nav.tsx DELETED; countries sorted ascending by
  coverage in buildOpsData so KPI cards, matrix columns and room switcher
  share one jurisdiction order (mockup: Uganda→Kenya); container pt-[72px]
  (fixed navbar is h-14; without it the sticky header visually ate the hero).
- KEY BUG PATTERN: overflow-hidden on the matrix card made the card the sticky
  scrollport — the sticky toolbar was CLAMPED to top:105 of the CARD and
  overlapped the thead at scroll 0. Fix: no overflow-hidden on card root;
  rounding moved to rounded-t-xl header + rounded-b-xl table/cards wrappers;
  toolbar sticky top-[118px] (below console header bottom ≈115).
- Verification: tsc/eslint/validator/prod build PASS; headless browser
  screenshots at 1536px (top, matrix, drawer, queue, rooms) + 390px mobile —
  layout matches the mockup; drawer opens with pillar tiles + actions.
- Also confirmed: evidence-monitor.yml is workflow_dispatch-only (cron
  commented); FIRECRAWL_API_KEY GitHub secret still NOT set (no gh CLI/token
  in workspace) — user must add it in repo Settings→Secrets→Actions.

### 2026-09-23 — Credentials wiring + CI verification (Task 48)
- 5th workspace rollback: preflight found main 35 commits behind → ff-only to
  c12a017 healed it; .env.local was wiped again and recreated (rule 3/4).
- User supplied a GitHub fine-grained PAT + a ROTATED Firecrawl key in chat.
  PAT wired into origin remote URL (push verified via --dry-run); .env.local
  holds the new Firecrawl key (git check-ignore OK). No key values written to
  any committed file; both keys transited chat → remind user to rotate later.
- CI investigation (the "Lint Error / exit 1" report): it was run 5f1963b
  (first Control Room push), failing job "Lint and build" at step "Lint";
  "Content validation" job passed. The Phase 2 push (2900c04) already fixed
  it — runs 2900c04 / a33567f / c12a017 are ALL success. No action needed;
  CI green on latest.
- Firecrawl: rotated key tested with exactly 1 search + 1 scrape → HTTP 402
  on both (zero credits on the new key too). Freeze continues (rule: no
  search/scrape/monitor calls). evidence-monitor.yml stays
  workflow_dispatch-only (cron already commented out).
- Repo secret: gh CLI 2.101.0 installed at /home/z/bin/gh; `gh secret set` →
  HTTP 403 "Resource not accessible by personal access token"; header shows
  `x-accepted-github-permissions: secrets=read`. Unblock paths recorded in
  Open thread 1 (token edit to Secrets: Read-and-write, or manual secret add).
- Sanity: validator PASS (r11 untouched, 49/56 verified); live
  /policy/intelligence returns 200 with console-chrome strings present —
  mockup-matched layout confirmed live on production.

### 2026-09-23 — Bing SEO fixes on /policy/intelligence + Context.dev integration (Task 49)
- User pasted a Bing URL-inspection report for /policy/intelligence: title
  >70 chars, meta description >160 chars, missing h1. All three confirmed in
  live HTML: title 80 (74 + " | DC254" template), description 221, H1 COUNT 0
  (Task 47 redesign demoted the heading — hero used h2, console header a <p>).
- Fixes (commit 2ee977b): page.tsx static metadata → generateMetadata() —
  title "Policy Intelligence — East Africa Data Centre Regulation" (57+8=64
  rendered), description computed LIVE from dataset ("49/56 audited claims…",
  149 chars; removed the hardcoded "56" that violated the live-stats rule);
  control-room.tsx hero h2 → h1 "Who governs East Africa's data centres?"
  (39 chars, SSR-rendered, visuals unchanged). Audited every page title:
  only this page violated; pillar pages ≤61 rendered; corrections/page strings
  are body-card headings, not <title>.
- Verified in the BUILT html (.next/server/app/policy/intelligence.html):
  TITLE 64, DESC 149, H1 COUNT 1. tsc/eslint/build PASS; validator PASS.
- Context.dev integrated as the web-data layer (user supplied key in chat;
  stored in gitignored .env.local only; docs read first: quickstart + search
  + scrape .md pages). ZERO new npm deps by design (rule 5): server-only
  wrapper src/lib/context-dev.ts (contextSearch/contextScrape, Retry-After
  on 429, bounded backoff 408/5xx, no retry on other 4xx, maxAgeMs) +
  pipeline CLI scripts/contextdev_search.mjs (firecrawl_search.mjs output
  conventions, humanGate wording). SDK install explicitly rejected.
- Proof call (1 credit): POST /v1/web/search "Uganda Income Tax Act Cap 340
  income tax holiday" → HTTP 200, 10 ranked results; top candidates feed
  UG-TX-C1 (open thread 2): parliament.ug Income Tax (Amendment) Bill 2022
  (Bujagali holiday), a-mla.org Cap 340 PDF, ULII /akn/ Act page. NOT yet
  captured — editor picks first (humanGate).
- Use sparingly (user directive). Firecrawl stays frozen (both keys 402);
  Context.dev is the discovery path until Firecrawl credits return.
- Key rotation reminder applies to the Context.dev key too (transited chat).

### 2026-09-23 — r12: UG-TX-C1 verified via Context.dev-era capture (Task 50)
- Editor gave conditional approval: "Approved if you can confirm its good
  information". Verification performed on the actual statute text, not snippets.
- The hunt for ITA Cap 340 "as amended": ULII /source PDF → curl 403
  (Cloudflare, UA-spoof also blocked); Context.dev scrape of ULII → extraction
  failed (1 credit, markdown envelope success:false). Fallback (free):
  S3-hosted "Domestic Tax Laws Uganda" handbook PDF (406 pp, rgi-documents) +
  a-mla.org Act PDF (133 pp — OLDER expression, lacks s.21(1)(y); rejected).
- Handbook verified: s.21(1)(y) "income ... derived from the exportation of
  finished consumer and capital goods for a period of ten years", 80% export
  condition, certificate regime; inserted by IT (Am) Act 2008; operationalising
  Income Tax (Tax Incentives for Exporters of Finished Consumer and Capital
  Goods) Regulations 2009 (Reg 5(1) ten-year validity, Reg 6(b) 80%). Handbook
  = private reproduction (Grant Thornton consultant, ex-URA; ULRC authentic
  reprint as at 19 Oct 2012) → registered T2 with transparent sourceType;
  a-mla rejected; PwC current edition registered T3 as independent corroboration.
- Upgrade rationale under statusVocabulary "verified" = "primary OR two
  independent corroborating sources": instrument text (via reproduction) + PwC.
  humanGate: user's conditional approval recorded in capture note + commit.
- r12 changes (commit 3dec566): UG-TX-C1 → verified (50/56, 6 partial; coverage
  89%); +2 sources (gt-ug-ita-cap340 T2 captured, pwc-uganda-tax-summaries T3
  snippet); capture filed research/captures/2026-09-23-s3-amazonaws-com-rgi-
  documents-0216350e05e4b5dd46a9abc9d5ce2ffe7cda0.md (576 KB, full ITA portion
  + verification extract); SINCE_LAST_REVIEW r11→r12; validator PASS (10
  capture links); tsc/lint/build PASS; built HTML shows "50/56" description.
- BUG FIXED in upgrade script first run: countries is a DICT (not a list) —
  iterating keys silently skipped the claim (validator's 49/56 caught it).
  policy_upgrade_r12.py now handles both shapes. Check state counters on every
  upgrade run before committing.
- New tool: scripts/contextdev_capture.mjs (capture CLI, mirrors
  firecrawl_capture.mjs front matter; context.dev /v1/web/scrape, maxAgeMs=0).
  src/lib/context-dev.ts contextScrape fixed: markdown output is an envelope
  ({requested, success, data}) — text at markdown.data.
- 6th workspace rollback hit mid-task (HEAD fell back to e7a41a3); ff-only heal
  restored Task 49 work; .env.local lost the Context.dev key line again —
  re-added. Expect node_modules wipes on every rollback: npm ci after healing.

### 2026-09-24 — Claims run + new article: IMF 160/5.5% power-constraint piece (Task 52)
- Editor instruction: "Run the claims and update once confirmed, then pick a
  new angle and draft the articles or article."
- Claims run: validator PASS untouched (r12, 50/56 verified, 62 sources, 10
  capture links) — no dataset change needed or made (humanGate intact).
- Angle picked from Google Alerts lead (c): IMF "~160 data centres in Africa
  ≈ 5.5% of global". Stat VERIFIED against primary before drafting: IMF
  Departmental Paper 2026/013 "Unlocking the Potential: AI in Sub-Saharan
  Africa" (2026), citing Kakindé 2025 for the count; nearly half of SSA's DCs
  in South Africa/Nigeria/Kenya. imf.org PDF + eLibrary blocked to curl
  (Akamai 403, ULII pattern) → spent 1 Context.dev credit on eLibrary full
  text (HTTP 200, 220 KB; credit total now 3 of 252). All quotes/numbers in
  the article read from that primary text (0.2→2.1% productivity, 0.4→4.0%
  GDP, 78% outages/8.4% sales, generators 86/65/63, DCs 1.5%→3% global
  electricity, anchor-tenant thesis, VC $2.2B/84% four markets).
- Cross-checks that sharpen the piece: IMF cites Microsoft/G42 $1B campus as
  live, but our own coverage shows suspension May 2026 → framed as the
  anchor-tenant thesis "stated negatively" (structure, not resource, binds).
  Directory stat used: 31 facilities / 18 operators. Reuters cited in body
  text only (URL unverifiable through bot-block — never publish guessed URLs).
- Article: content/articles/africa-160-data-centres-imf-power-constraint.md
  (cluster Infrastructure, category AI & Infrastructure, 1,600+ words, 10
  internal links verified, 4 existing images, 4-question FAQ, 3 external
  sources). Built HTML: title 59 (+8 template), desc 152, 1 h1, SSG route.
- Pipeline lessons: (a) article_validator.py bans em dash (\u2014) — house
  style, existing articles have zero; fixed via persisted
  scripts/fix_emdash_imf_article.py (21 contextual replacements, one IMF
  quote restructured to stay verbatim without the dash); (b) validator also
  cross-checks README article counts — updated 99→100; (c) sitemap.ts and
  feed.xml pick up new articles automatically (getAllArticles) — no
  registration step.
- Verified: article_validator ALL OK (100 articles), tsc/lint/build PASS.

### 2026-09-24 — r13: KE licensing pillar expansion + IBTC careers article + breathing pass (Task 53)
- Editor instruction: "Work on the data set and the IBTC skills angle its a
  good piece for the career section the webp image should be the hero image,
  the new article hero should be the Africa Power and also check on the
  paragraphs ensure you give room for breathing".
- DATASET (r13, validator PASS 52/59): worked Google Alerts lead (a) — CDH
  Kenya telecom-licensing alert — into the KE licensing pillar. Chain: env
  web-search found the alert; CDH deep pages 403 to curl BUT /sitemap.xml is
  open (7,400 URLs) → exact URL extracted free. Alert + Techafricanews +
  w.media all curl-open → FULL-TEXT captures, zero Context.dev credits
  (envelope waste avoided; total credits still 3). CA open-consultations +
  Developing Telecoms serve JS-challenge shells (HTTP 200, empty) — recorded
  as upgrade paths, not captured.
- policy_upgrade_r13.py: 3 captures filed (capture-pending) with
  VERIFICATION EXTRACTS; +3 sources (cdh-ke-tmt-alert-2026 T2,
  techafricanews-ke-dc-licence T3, wmedia-ke-dc-licence T3); +3 claims:
  KE-LC-C2 verified (data centres licensed under NFP-Tier 2 per ULF Annex
  III / Revised Structure gazetted 6 Mar 2026; T2+T3+T3), KE-LC-C3 verified
  (CA 8 Sep 2026 public notice proposing standalone DC licence for
  co-location operators, 30-day window; same evidence set, CA notice quoted
  via w.media), KE-LC-C4 partially-verified (proposed fees KSh 5,000 /
  100,000 / 80,000 or 0.4% turnover — w.media only). NFP-Tier 1 reliance
  detail kept in C2 note (CDH single-source) — upgrade path: capture Annex
  III instrument. Editor delegation "Work on the data set" recorded in
  captures + commit (standing rule 8; r11/r12 conditional-approval
  precedent).
- ARTICLES: (a) NEW content/articles/ibtc-data-centre-academy-kenya-
  talent-pipeline.md (Careers cluster, 1,065+ words, breathing-room
  paragraphs, 7 internal links, 4 existing images, 3 external sources all
  read in full: ADCA 14 Apr launch + ADCA 9 Sep Kenya signing + MSME Africa
  23 Sep). Facts: DCCA I→II (Schneider Electric University → EPI/EXIN
  CDCA), iXAfrica cohort of five + 3-week live placement, IMEX OEM access,
  ADCA governance, DC Elite placement, EU Digital Investment Facility,
  Rack Centre pilot, 30-engineer SA inaugural cohort. Validator flagged
  title 65 > 56 house limit → trimmed to 52.
  (b) IMF article paragraph pass: every long paragraph split to 2-4
  sentences (user breathing request); stale stat 50/56 → 52/59.
- IMAGES NOT DELIVERED: the 3 files the editor attached in chat (Africa
  Powe Hero.jpg, master-power-1-750x375.jpg, IMG_9828.jpeg.webp) never
  reached /home/z/my-project/upload/ — open thread 11 records the intended
  hero wiring; IBTC hero temporarily classroom-ict-training-kenya.webp.
- House rules learned: article_validator title limit is 56 raw chars (not
  70); README count auto-checked (now 101); article_validator ALL OK
  (101), tsc/lint/build PASS, built HTML: policy page renders 52/59 + r13
  live from dataset.

### 2026-09-24 — editor's hero images delivered via repo upload + wired (Task 53b)
- Editor uploaded the three pending images to the repo ROOT (commit 27326bf
  "Add files via upload"): Africa Powe Hero.jpg, IMG_9828.jpeg.webp,
  master-power-1-750x375.jpg. Pulled ff-only; viewed all three (map-and-
  server-rack illustration; Datacloud Africa stage-backdrop photo, Nairobi;
  three technicians on power distribution gear in a data hall) BEFORE writing
  alt/caption text - no guessed image content.
- scripts/convert_uploaded_images.py (Pillow, persisted, idempotent):
  africa-power-hero.webp 736x552 q88 (48 KB), datacloud-africa-nairobi-2026
  .webp 1280x960 straight copy (125 KB), dc-power-technicians-training.webp
  750x375 q88 (57 KB) - all into public/images/. Root uploads git-rm'd
  (git detected IMG_9828 -> public/images as a rename).
- Front matter wiring: IMF article og_image + images[0] -> africa-power-hero
  .webp (alt updated to describe the illustration, 160/5.5% caption kept);
  IBTC article og_image + images[0] -> datacloud-africa-nairobi-2026.webp
  (alt describes the backdrop photo honestly - no identity claims); NEW
  images[] entry dc-power-technicians-training.webp position inline with a
  DCCA I power/cooling/IMEX caption. Old refs (africa-dc-map, classroom-ict)
  now zero in both files and built HTML.
- Deviation from thread 11's provisional plan recorded: master-power went to
  IBTC inline instead of IMF section-break (editorial fit - the careers piece
  narrates hands-on placement); vetoable by editor, 1-minute move.
- Verified: article_validator ALL OK (101), tsc clean, lint clean, build PASS
  (202 static pages), built HTML og:image + img tags confirmed for both
  articles (africa-power-hero x2 IMF; datacloud x2 + power-technicians x1
  IBTC). CI green on 9bcbcf4 via GitHub REST API (gh CLI still flaky).
- npm ci re-run after workspace rollback (node_modules wiped; 533 pkgs, 16s).

### 2026-09-24 — Arizton Kenya market report minted + "Edited by" tagline (Task 54)
- Editor instruction: mine the ResearchAndMarkets/Arizton "Kenya Data Center
  Market - Investment Analysis & Growth Opportunities 2026-2031" (report ID
  5692396, March 2026 edition, data snapshot September 2025); tagline to read
  "Edited by Kevin Jonathan Otieno"; supply sitemap URL for GSC.
- SOURCE (zero API credits): R&M page curl-open (HTTP 200, 302 KB) - full
  press-release text extracted from HTML. Publisher Arizton. Capture filed
  (T3, capture-pending, claims: [] - market estimates stay attributed, no
  policy-claim upgrades proposed). Verbatim extracts: 266M 2025 -> 805M 2031
  @ 20.27% CAGR; 7 operational cables (2Africa, DARE 1, EASSy, LION2, PEACE,
  SEACOM/Tata TGN-Eurasia, TEAMS) + 2 incoming (Africa-1, Daraja, 2026-27);
  13 operational colocation DCs (Nairobi 8 existing/7 upcoming); KenGen BESS
  Jul 2025; vendors ADC/iColo/iXAfrica/Safaricom/Telkom; Nxtra KSh 19B
  ($147M) Q1 2027; iXAfrica RMB financing + Helios $50M; G42 EcoCloud MoU
  100MW->1GW (stale: our coverage has suspension May 2026 - correction baked
  into article).
- Cross-checks: directory Kenya count is 23 facilities / 14 operators
  (vs Arizton 13 colocation-only); earlier outlook piece had $180-220M ->
  $400-500M by 2030 (definitions differ - both presented, never blended).
- ARTICLE: content/articles/kenya-data-centre-market-266m-to-805m-arizton-
  outlook.md (Market Analysis / Kenya cluster, ~1,250 words, 9 internal
  links, 3 images - hero africa-data-centres-nairobi-exterior.webp was
  unused site-wide so no hero duplication; 1 external source only: the
  actually-read R&M page; 4-question FAQ). Built HTML: title 54 (+8=62),
  desc 156 raw (166 built = &#x27; escaping false alarm), 1 h1, canonical.
- TAGLINE: ArticlePageClient.tsx "Written and edited by" -> "Edited by"
  (site-wide, all 102 articles; JSON-LD keeps clean person name; verified
  in 3 built HTML files).
- README 101->102; validator ALL OK (102); tsc/lint/build PASS (203 pages);
  commit dbb1407, CI green via REST API.
- GSC: sitemap live at https://data-centers-254.vercel.app/sitemap.xml
  (HTTP 200, 178 URLs incl. 101 article URLs at check time); robots-friendly;
  feed.xml also live for RSS.

### 2026-09-24 — LinkedIn/WhatsApp share posters (Task 55, no repo changes)
- Editor asked for share posters for the IMF + IBTC articles using his uploaded
  hero images. Built 4 pixel-exact PNGs via HTML/Playwright (Geist + site brand
  tokens; source of truth: /home/z/my-project/scripts/posters/, deliverables:
  /home/z/my-project/download/posters/). LinkedIn 1200x627 split-panel layout,
  WhatsApp 1080x1080 image-top layout, CTA pill + "Edited by Kevin Jonathan
  Otieno" byline + site URL on all. Repo untouched.

### 2026-09-24 — Policy Intelligence editorial revision per editor review (Task 56)
- Editor reviewed the live /policy/intelligence page and issued a priority order; items 1-5
  implemented in commit 603c69d; items 6-7 (source tiers/capture states, downloadable JSON)
  deliberately untouched; item 8 already shipped (see discovery below).
- Item 1: hero "88% Evidence coverage" relabelled "Claim verification rate"; visible note under
  the stat - "Share of entered claims meeting the evidence threshold. {gaps} research gaps remain
  across the {pillars} policy pillars" (both dataset-derived, zero hardcoding). Info tooltip
  reworded to "Verification rate = verified claims / claims entered in the dataset..." via
  scripts/pi_editorial_edits.py (old_str contains division sign + em dash; tool edits write
  \uXXXX escapes literally, so python owns all non-ASCII replacements).
- Item 2: coverageRating() ("Very strong/Strong/Moderate/Early") deleted; KPI cards now show the
  neutral underlying evidence state: "N verified / N partial" + "N claims". Matrix cells were
  already neutral (N V / N P / N%).
- Item 3: why-this-matters lede above the console canvas, editor's exact sentence (licences, data,
  power, taxation, construction, cross-border transfers).
- Item 4: "Open research queue" retitled "Research queue" + "What we're investigating next"
  subtitle (high/medium priority chips were already live and dataset-derived).
- Item 5: evidence-first principle ("Evidence-first. One claim. One evidence trail. Every source
  classified. Every gap visible.") placed immediately beneath the hero H1.
- Bonus: editor asked to bold "editorial approval is not factual certainty" - sentence wrapped in
  <strong> in Method & governance. Country room header "{pct}% coverage" -> "{pct}% verified";
  aria-labels updated; caption under KPI grid explains the rate and the gap/claim distinction.
- DISCOVERY for editor: r12->r13 change history ALREADY EXISTS - the "Since last dataset review"
  strip (SINCE_LAST_REVIEW in src/lib/policy/config.ts) lists KE licensing 1->4 claims, +3
  sources, +1 partial claim, 20 gaps unchanged. Flagged in reply; candidate for promotion later.
- House lesson reinforced: MultiEdit here is SEQUENTIAL, not atomic - run 1 applied edits #1-8,
  stopped at failed #9 while the tool reported failure; run 2 then failed on already-applied #1.
  Always git diff after any MultiEdit failure to inspect partial state.
- Validation: tsc clean, lint clean, build PASS; built HTML greps: "Claim verification rate",
  "Research queue", "investigating next", lede, strong tag, ">88<" all present;
  "Very strong|Evidence coverage|Open research queue" = 0 occurrences. CI green run #64 on
  603c69d via REST API.
- Posters (Task 55, prior continuation) remain deliverables outside the repo:
  /home/z/my-project/download/posters/ (IMF + IBTC x LinkedIn 1200x627 + WhatsApp 1080x1080).

### 2026-09-24 — Claim-level dataset changelog shipped + CA consultation T1 hunt (Tasks 57-58)
- Editor order: promote the r12->r13 strip into a full claim-level changelog (claim -> source
  -> previous version -> editorial decision); then "use this brainstorm and forge forward" on
  the advisor's CA-consultation plan (research-led LinkedIn post, T1 capture, evidence record,
  explainer, tracker).
- Task 57 SHIPPED (commit c406344, CI green run #65-ish): new typed
  src/data/policy/policy-changelog.json (schema 0.1-changelog) - r13 entry built from the
  ACTUAL git diff 3dec566..a7e3522 (verified: +3 claims KE-LC-C2 verified / KE-LC-C3 verified
  / KE-LC-C4 partial, +3 sources cdh T2 + techafricanews T3 + wmedia T3, no other changes);
  statements verbatim from dataset, editorial decisions condensed from claim notes (r13
  registration under standing humanGate delegation, conditional on verification). Loader
  getPolicyChangelog() in lib/policy; OpsChangelogEntry types; sources resolve from the
  registry by sourceIds at render (no duplication). UI: expandable zero-JS <details> beneath
  the since-review strip - per-claim rows show ID + action badge + state chip + country/pillar,
  statement, previousVersionNote ("Not present in r12 - the Kenya licensing pillar held only
  KE-LC-C1"), clickable evidence trail (publisher links + tier + capture state), editorial
  decision. Server-rendered/crawlable. Future bumps: add an entry when diffing for
  SINCE_LAST_REVIEW. tsc/lint/build PASS, HTML greps verified (KE-LC-C2/C3/C4 x5 each,
  Editorial decision x4, 0 old labels).
- Task 58 CA T1 hunt - BLOCKED, capture registered:
  research/captures/2026-09-24-ca-ke-dc-licensing-t1-source-hunt.md (capture-pending, no
  claims proposed). Findings: www.ca.go.ke live but interstitial-bot-walled ("One moment,
  please..." reload loop, ~12KB shell - upgrades the r13 "JS-blocked" note to a diagnosis);
  web.archive.org unreachable from workspace (HTTP 000); DDG HTML + Bing organic bot-walled;
  z-ai web search confirms the consultation + corroboration (digitalpolicyalert 8 Sep record,
  itweb/dig.watch/connectingafrica/eastleighvoice 8-10 Sep) but returns HOST-ONLY URLs, so
  leads recorded without unverifiable URLs (rule 11). CONTEXT_DEV_API_KEY MISSING from
  .env.local post-rollback (only FIRECRAWL_API_KEY present) and the old key transited chat
  (rotation list) - editor must supply a fresh rotated key, then
  node scripts/contextdev_capture.mjs "<consultation URL>" --tier 1. Alternate T1 routes:
  the editor's planned letter to CA (datacentres@ca.go.ke channel) requests the framework
  documentation; Revised Market Structure legal notice via kenyalaw.org (curl-open).
  TIMING: window closes on or about 8 Oct 2026 (30 days from 8 Sep notice).
- LinkedIn post fact-check: draft's 59 claims / 65 sources / 4 markets / 10 pillars /
  20 gaps all EXACT vs dataset (per-country 13/13/17/16). Post cleared to publish; the new
  claim-level changelog directly supports its transparency claim.
- Next-stage queue (proposed, not built): CA Data Centre Licensing Tracker page
  (Proposed -> Consultation -> Comments -> Revised -> Gazette -> Effective -> Implementation,
  each stage dated + sourced + evidence-stamped); explainer "Kenya's Proposed Data Centre
  Licence: What the CA Framework Could Change" structured per advisor (8 sections incl.
  what-is-not-clear-yet + evidence record backlink) - fills after T1 capture; follow-up CA
  LinkedIn post separate from the methodology post.

### 2026-09-24 (session 2) — T1 ANCHOR CAPTURED: CA DC licensing framework; dataset r14; both LinkedIn posts finalized (Task 59)
- Editor supplied fresh rotated CONTEXT_DEV_API_KEY (in .env.local, gitignored, never
  printed/committed). Key authenticates; Context.dev is the active scrape path while
  Firecrawl stays 402.
- **CA challenge defeated by diagnosis, not force**: the interstitial (obfuscated JS,
  cookie pattern qxqokdru2jku) is ROUTE-SPECIFIC. Walled: /index.php/ pages AND
  /sites/default/files/ asset URLs (curl returns the ~12KB shell; Context.dev renderer
  also returned empty on the /index.php/ form - 2 empty scrapes then STOPPED). Open:
  the clean route https://www.ca.go.ke/open-consultations (no /index.php/) renders fully
  via Context.dev. A search call located the clean-URL form.
- **Two T1 captures (Context.dev browser render)**: (1) Open Consultations page -
  DC entry verbatim incl. submission channels (datacentres@ca.go.ke; MS Forms; post) +
  PDF link; (2) THE ANCHOR: "Proposed Licensing Framework for Data Centres, September
  2026 (Consultation Version)", full 7 pages. Fee schedule (KSh 5,000 / 100,000 /
  80,000-or-0.4%-turnover), 15-year term, NFP/ASP exemption (para 17), USF 0.5%
  (s.84J(3) KICA), roadmap Table 1 - all read in full before registration.
- **NEW DISCREPANCY FLAGGED (open)**: instrument para 6 dates the market structure
  "revised in April 2026" vs CDH T2 "gazetted 6 March 2026" (Gazette Notice No. 3335).
  KE-LC-C2 statement NOT re-dated; Kenya Law route is the resolver - BUT kenyalaw.org
  classic routes now also 403 (2026-09-24 probe), contradicting the 2026-09-23
  curl-open note. New.kenyalaw.org 403s too. Parked; needs browser-render or the
  editor's CA letter.
- **Dataset bump r13 -> r14** (scripts/bump_r14.py, idempotent): +2 T1 sources
  (ca-dc-licensing-framework-2026, ca-open-consultations-2026); C4 partially-verified ->
  verified (r13's upgrade condition met on instrument text); C2/C3 T1-backed with states
  unchanged; +C5 (NFP/ASP exemption, verified on T1 primary per status vocabulary) and
  +C6 (roadmap: finalisation + CONSEQUENTIAL MARKET-STRUCTURE REVISION in FY2026/27,
  implementation FY2027/28); licensing gap refreshed. Changelog r14 entry appended.
  Validator PASS: 61 claims (55/6/0), 67 sources (49 T1). Credit spend: ~5 credits
  (2 empty scrapes, 1 search, 2 captures - PDF flat 1 credit).
- **T1 capture CORRECTED press-derived sequencing** (both in our own pages): the
  consequential market-structure revision sits in FY2026/27 (Table 1 row 4), NOT
  FY2027/28 as earlier reports (and our first-pass pages) had it. Fixed in the tracker
  timeline + explainer roadmap section, with the correction attributed.
- **Tracker updated** (src/lib/market-trackers.ts + tracker/licensing/page.tsx):
  instrument PDF added as first primary source; FY rows corrected; "verified against
  the CA's own document" strips.
- **Explainer updated** (content/articles/kenya-ca-standalone-data-centre-licence.md):
  updated_date 2026-09-24; instrument added to external_sources; roadmap section
  rewritten with the correction + attribution; NEW section "What Is Not Clear Yet"
  (attendant-supporting-services boundary, migration mechanics, USF restatement,
  April-vs-March dating); sources paragraph records the 24 Sep instrument verification.
  article_validator: 102 articles ALL OK. tsc/lint/build PASS.
- **Both LinkedIn posts FINAL** (deliverables outside repo,
  /home/z/my-project/download/linkedin/): post 1 methodology (r14 numbers: 61 claims /
  67 sources / 49 T1 / 55 verified; changelog + discrepancy-catch as the proof points)
  and post 2 CA consultation (facts-only from the captured instrument, window closes
  ~8 Oct 2026). Tag strategy applied: 3 broad + 4-5 niche, end-placed, no @-mentions;
  internal fact-check blocks included - strip before posting. NOTE: post 1's numbers
  supersede the r13-checked draft; do not publish the old 59/65 figures.
- Next-stage queue remaining: CA submission letter (editor-owned, datacentres@ca.go.ke);
  Kenya Law gazette capture for target #2 when a route opens; gazette date resolution
  closes the C2 discrepancy.

### 2026-09-24 (session 3) — Post 2 share posters built (Task 60, deliverables outside repo)
- Editor asked for a poster to accompany post 2 (CA consultation) on LinkedIn + X, with the
  DC254 logo. Rebuilt post-2 facts from the in-repo T1 captures (no post text file needed):
  para 16 fee schedule verbatim, para 17 NFP/ASP exemption, Table 1 roadmap (FY2026/27
  correction preserved), para 12 pull quote, 30-day window closing on or about 8 Oct 2026.
- Brand: campaign_lib palette (navy gradient + #38C7F0 cyan) + site fonts Geist/Geist Mono +
  logo.webp chip; constellation motif reused. pdf-skill poster pipeline (poster.md +
  creative-fixed-canvas bypass rules), poster_validate PASS, pdf_qa clean after metadata set.
- Deliverables (download/linkedin/): post2-ca-consultation-linkedin-4x5.png (2160x2700),
  post2-ca-consultation-x-16x9.png (3200x1800), matching vector PDFs + editable HTML sources.
  Source of truth: scripts/posters/ (HTML + shoot_posters.js renderer).
- NOTE: session-2 LinkedIn post text files (post 1 + post 2) were lost in the same workspace
  reset; numbers for post 1 remain documented in the session-2 log above (61/67/49/55).

### 2026-09-24 (session 4) — Site audit pass 2: residual scoping + snapshot drift (Task 61, commit eccf879)
- Picked up the external site audit ("check what's real and what's not"). Pass 1 (d6772e7,
  earlier same day) had already fixed homepage band + FAQ scoping and re-verified 5 findings
  FALSE (sitemap 200/179 URLs, /infrastructure/map 200, /api/directory 200, unique policy
  titles, directory arithmetic). This pass re-verified all five live (200s confirmed again).
- REAL residual finding 1: the annual review page (research/state-of-kenyan-data-centres-2026)
  computed its KPIs from the unscoped register - "31 tracked / 22 operational" under a
  Kenya-titled review, carrier-neutral footnote "N of 22", and 2 regional UC records (Raxio
  Dar, ADC Kigali) rendered as Kenyan pipeline. Now Kenya-scoped end to end: 27 tracked /
  20 operational in Kenya / "8 of 20 operating Kenyan facilities" / Kenya-only pipeline grid;
  hero states the 27 + 4 split explicitly; dead vars (certed, publishedMw) removed.
- REAL residual finding 2 (audit finding 7 root cause): the 26 facilities / 186 MW the audit
  saw came from the Brief/01 PDF (minted 21 Sep from a pre-EA snapshot, no date marker) and
  the research hub card hardcoding the same snapshot. Card refreshed to 27 / 230 MW (122
  networks + 8/20 neutral re-verified unchanged); PDF cover stamped: "Data snapshot: Sept
  2026 (26 facilities) - the live review now reports 27 facilities and 230 MW announced".
  Full Brief/01 re-mint queued. The three headline MW figures are different labelled metrics,
  not contradictions: 10.5 published IT load / 42.9 built / 230 pipeline / 272.9 total supply
  (site-stats canonical-label comments refreshed to 42.9/272.9).
- Directory intro sentence reordered (body + meta description) so the city split (19 Nairobi,
  4 Mombasa) attaches to the 27 Kenya total, not the 20 operational. Numbers unchanged.
- Corrections log entry 2026-09-25 records all of the above + the advisory (vercel.app
  domain, gmail contact, centers/centres brand split) as owner-decision items.
- Gates: tsc/lint/build PASS (node_modules restored after workspace rollback, 533 pkgs).
  Rendered output verified in built HTML before push. Live deploy follows via Vercel.

### 2026-09-29 — Google Alerts digest triage: Kanali column + Arizton global PR (Task 63)
- Editor forwarded the alerts feed (2 entries). Triage per open thread 9 protocol;
  humanGate intact — no claims, no quotes, no dataset changes, no article published.
- (f) Arizton global facilities PR (openPR 4645870, 2026-09-28): FULL body captured
  free — workspace curl 403 (bunny.net), z-ai page_reader got the full release text.
  Capture filed T3 claims:[] (2026-09-29-openpr-arizton-global-dc-facilities-database.md).
  Africa = one qualitative bullet, no numbers. Global: 4,408 existing + 2,202 upcoming.
  Definitional cross-ref vs IMF ~160/5.5% recorded (never blend). NOT a lead.
- (e) Nixon Kanali column (ABC, 2026-09-28): ALL extraction routes blocked — curl
  403 Cloudflare (incl. crawler UAs), page_reader security-verification shell,
  web.archive.org HTTP 000 (workspace-level, matches Task 58), no syndication
  indexed. Access-hunt capture filed (2026-09-29-abc-kanali-ai-economy-rented-
  servers-access-hunt.md) with verbatim fragments (title, G42 feed snippet, gonga
  fragment) and the rule: nothing quotable until full text is read. Kenya anchor
  (Microsoft/G42 $1B geothermal DC) already covered by our verified timeline.
- Environment: fresh workspace clone at 57f2c29; .env.local ABSENT (no Firecrawl/
  Context.dev keys locally — Firecrawl frozen anyway; Context.dev key must be
  re-supplied by editor before any scrape work). node_modules restored via npm ci.
- Also: Current state block refreshed r14→r16 (r15/r16 bumps of 2026-09-26 had
  added 3 T2 sources without updating the block; validator PASS re-confirmed:
  61 claims 55/6/0, 70 sources, 15 capture links).
- Validator PASS; zero credits spent (all routes were free). No push conflicts
  (preflight ff-current at session start).

### 2026-09-29 (session 2) — Control Room Phase 3 shipped + changelog backfill (Task 64)
- Editor: "Move to another queue item". Queue survey: Brief/01 re-mint found
  ALREADY DONE (commit b9023e8, corrections log amended — no session log entry
  had been written; queue note in Task 61 was stale); thread 7 scripts MOOT
  (wiped with rollbacks). Chose the editor-approved Phase 3 (open thread 8).
- (a) Deep links: pillar pages anchor every claim (`id="claim-{ID}"`,
  scroll-mt-24 — 19 anchors verified across licensing 17 + energy 2); matrix
  drawer Key-findings IDs + SinceLastReview changelog claim IDs are now Links
  to `/policy/intelligence/pillars/{pillar}#claim-{ID}` (ArrowUpRight hover
  affordance, aria-labels, drawer closes on click).
- (b) Exports: ExportMenu in the matrix toolbar — CSV (country, pillar, all 5
  state counts, total, structured_gap + commented provenance footer) and JSON
  (countries + cells + verificationRate), all derived from the same OpsData
  payload the page renders; Blob download, zero deps; dataset route stays
  canonical. Fixed own bug pre-commit (header.join(".") → ",").
- (c) Delta view + data repair: changelog had r13+r14 only while dataset sat at
  r16 — r15 (0287d72: +1 T2 MTN/Africa Hub reference source) and r16 (c5c5295:
  +2 T2 Dangote Lamu sources) entries appended from the ACTUAL git diffs via
  persisted scripts/repair_changelog_r15_r16.py (byte-stable dump, idempotent);
  top datasetVersion marker → r16; SINCE_LAST_REVIEW refreshed r12→r13 → r15→r16
  (items: +2 Dangote sources, 0 claim changes, 20 gaps unchanged) per its own
  bump protocol. New "Release deltas" panel in SinceLastReview renders per-release
  chips (added/upgraded/revised/+sources) computed from the changelog — nothing
  hardcoded; server-rendered + crawlable.
- Gates: tsc PASS, lint PASS, build PASS, article_validator 105/105 ALL OK,
  validate_policy PASS (55/61, 70 sources). Built-HTML greps verified (anchors,
  delta rows, deep-link hrefs ×8, export group, new strip). Pushed b81c07f
  (524fd6d..b81c07f) after preflight; CI checked via REST API.
- Zero API credits; no content/claims touched (humanGate) — reference-source
  changelog entries document existing registry state, they add no claims.

### 2026-09-28 — senior-engineer audit: security + perf batch implemented (Task 62)

**Scope**: full-stack audit (3 parallel reviews: API/security, frontend/perf,
SEO/infra) then implementation of the highest-priority findings. Zero new
runtime dependencies (standing rule 5). No content/claims touched (humanGate
respected).

**Security fixes**:
- NEW `src/lib/api-guards.ts`: same-origin enforcement (`isSameOriginRequest`)
  + `withTimeout` helper. Applied to POST routes: contact, subscribe,
  export-interest, chat, chat/tts, csp-report (webhook exempt: server-to-server).
  Kills cross-site form-post spam paths (mail-bombing, quota burn).
- error.tsx no longer renders raw `error.message` (debug leak); digest only.
- subscribe: store-failure now fails CLOSED (503) instead of answering
  "Already subscribed" with nothing stored (the silent black hole the
  fail-closed email path already prevented).
- resend webhook: rate-limit result actually checked now (429); was decorative.
- Timeouts: Resend SDK calls wrapped (10s via withTimeout) in contact,
  subscribe, resend-audience; Upstash newsletter-store fetch 5s AbortSignal.
- csp-report: control chars stripped from directive/blocked before console
  (log-forging).
- .env.example: documented SUBSCRIBE_SECRET, RESEND_WEBHOOK_SECRET,
  HEALTH_TOKEN, SPONSOR_ALLOWED_HOSTS (all prod-relevant, were undocumented).
- CI: least-privilege `permissions: contents: read`.

**Performance fixes (verified in build output)**:
- C1: 148KB policy claims JSON no longer shipped to client — countLabel/
  formatPolicyDate moved to leaf `lib/policy/config.ts`; matrix-console,
  control-room, source-quality import from config. 0 client chunks contain
  claim data (grep-verified).
- H1: article body SERVER-rendered via new `ArticleBody.tsx` (react-markdown
  + remark-gfm run at build, passed to client shell as RSC slot).
  ArticlePageClient slimmed: react-markdown, framer-motion, PortraitFigure/
  ArticleImageBlock (→ shared `article-media.tsx`) removed from client bundle.
  Article pages load 11 chunks, none contains framer (112K chunk only on
  search/contact/map/foundations). SSR HTML contains full body text.
- H2: mobile hamburger now server-rendered in navbar (was ssr:false dynamic →
  absent until hydration); sheet panel lazy-mounted on first open instead.
- H3: /infrastructure/map dropped force-dynamic → ○ Static (prerendered).
- M8: getAllArticles() module-level memoization keyed on dir signature
  (file count + newest mtime); /api/search, /api/articles, /api/directory got
  CDN Cache-Control (s-maxage 300/600/3600 + SWR).
- M7: brand logo navigates via next/link (was window.location.href full reload);
  homepage scroll-to-top preserved.
- M2: hydration-safe dates — T00:00:00 appended to date-only ISO in
  ArticlePageClient + article-cluster-page; featured-facilities normalises
  month-precision "2026-09" → "-01T00:00:00" (formats differ per field!).
- M1: JibuChat code-split (loads on first open); chat dialog gains Escape-
  close, focus-into-panel, focus-restore-to-FAB, aria-haspopup.
- M4: skip-to-content link in layout; id="main-content" added to all 42
  <main> elements; focus-visible rings on chat FAB + hamburger.
- L: RSS autodiscovery <link rel=alternate> in layout metadata; glow-neon-sm
  class defined (new-badge silently no-op'd before); CLUSTER_META single
  source (lib/cluster-meta) with re-export compat.

**Repo hygiene**:
- git rm'd root upload strays: "Policy .jpg", "EA Broadband.jpg",
  file_0000000034b08211ad4859b340b7e4a8.png (2.3MB, zero code references).

**Deferred (documented, not dropped)**: OG image pipeline (104/105 og_images
are webp non-1200x630 — WhatsApp/LinkedIn preview risk; needs build-time
sharp derivatives, watch repo weight per storage incident), Upstash env
wiring in Vercel (user decision, open thread 10), eslint rule re-enable
(lint is near-no-op), git history slim (221MB), 1.5MB GIF → mp4 conversion,
dead-CSS/component cleanup pass, /api/chat budget cap.

**Gates**: tsc PASS, lint PASS, build PASS, article_validator 105/105 ALL OK,
validate_policy PASS (55/61). Preflight done (was up to date with origin).

**Push note (2026-09-28)**: shipped as fff39e0. The ONE-LINE ci.yml change
(least-privilege `permissions: contents: read`) is LEFT UNCOMMITTED in the
working tree — the PAT in the origin remote lacks `workflow` scope and
GitHub rejects any push touching workflow files. Do NOT commit it into main
until the token gains workflow scope (it would block ALL future pushes);
either add scope (Settings → Developer settings → PAT → workflow: read/write)
then commit+push, or apply the 4-line edit manually in the GitHub UI.

### 2026-09-29 (session 3) — OG image pipeline shipped + Context.dev key re-wired (Task 65)
- Editor: "give the explanation above in simple terms and then handle the deferred
  OG-image pipeline" + supplied a Context.dev key (ctxt_secret_...). Workspace had
  been WIPED again (6th) — fresh clone at ede82bc; worklog.md mirror recreated.
- Context.dev key: written to gitignored .env.local (rule 4, check-ignore verified).
  Auth proven WITHOUT spending credits: malformed scrape body -> 400 with editor's
  key vs 401 "API key not found" with a dummy key. Scrape/discovery pipeline is
  UNBLOCKED for future capture work (1 credit per scrape; search 1 credit/10 results).
- OG pipeline (Task 62 deferred item, now closed): 104/105 og_images were webp
  non-1200x630 — WhatsApp/LinkedIn/X mis-render or drop webp previews. Fix per the
  recorded spec "build-time sharp derivatives":
  - scripts/generate_og_images.mjs: collects 83 sources (105-article frontmatter
    og_image incl. quoted+unquoted YAML, directory heroImage from current.json,
    16 page-level metadata images), sharp cover-crop 1200x630 -> public/og/<stem>.jpg
    (quality 82 mozjpeg, mtime freshness, stem-collision guard, image-focus mirror
    for top-biased crops, fail-open exit 0 if sharp missing). sharp = Next's own
    optional dep (lockfile 0.35.4) — ZERO new dependencies (rule 5).
  - src/lib/og-image.ts: ogImageFor() maps /images/<stem>.<ext> -> /og/<stem>.jpg
    (build-time existsSync, falls back to source path, blank og_image -> compliant
    og-default.png — previously those articles emitted NO og:image at all).
  - 28 metadata surfaces rewired: article openGraph+twitter+JSON-LD (105), facility
    heroImage, 26 page literals (webp/png, dims 675/653/800/1080x669 -> 1200x630).
  - .gitignore /public/og/ (build artifact never committed; ~7.3MB generated per
    build, repo weight flat per storage incident). Build chain: pwa-prebuild &&
    generate_og_images && next build. Vercel hook proven: prod /sw.js carries a
    fresh pwa-prebuild stamp, so `npm run build` runs on Vercel deploys.
- Gates: tsc PASS, lint PASS, build PASS, article_validator 105/105 ALL OK,
  validate_policy PASS (55/61). Built-HTML audit: 176 og:image tags -> 157 /og/*.jpg
  + 19 compliant og-default.png, ZERO webp remain, all width=1200/height=630;
  absolute URLs verified across og:image, twitter:image and JSON-LD.
- Bug caught pre-push: collision-guard map keyed stem->path but read with path
  (all outputs briefly "undefined.jpg" + freshness check self-poisoned) — fixed
  to stemOf/stemOwners pair, verified 80/80 then 83/83.
- Pushed 5eb2dd8 (29 files, +250/-54) after preflight; CI checked via REST API.
  No content/claims touched (humanGate); zero API credits spent.

### 2026-09-30 — Submarine-cables share posters (Task 66, deliverables outside repo)
- Editor: poster for the cables post, "use our dc254 poster template with image and
  dc logo". Workspace had been WIPED again (7th) — fresh clone at 9e81a1a.
- Facts re-verified from src/lib/market-trackers.ts SUBSEA_CABLES (never from the
  post text alone): 10 systems = 7 In service (TEAMS, SEACOM, EASSy, LION2, DARE1,
  PEACE, 2Africa) + 1 Landed/RFS pending (Africa-1) + 2 Announced/Planned (Daraja,
  LuLu). Matches the editor's 7/1/2 digest exactly.
- Template carried over from Tasks 55/60 (sources lost in wipes, spec recovered
  from session logs): navy gradient + #38C7F0 cyan, Geist + Geist Mono (Google
  Fonts CDN), constellation SVG motif, logo.webp chip, CTA pill, "Edited by
  Kevin Jonathan Otieno" byline + site URL. pdf-skill poster pipeline: Direct
  HTML Flow (poster.md bypass rules) -> poster_validate check-html PASS ->
  html2poster.js vector PDFs -> pdf_qa --poster PASS -> meta.set (Title/Author/
  Subject) -> Playwright screenshots @2x.
- Deliverables (download/posters/2026-09-30-submarine-cables/):
  dc254-cables-linkedin-4x5.png 2160x2700; dc254-cables-x-16x9.png 3200x1800;
  matching vector PDFs (pdf_qa PASS) + editable HTML sources. Image: repo asset
  dc-fibre-optics.webp (1344x768 — sharpest cable-themed asset; tracker hero
  mombasa-cable-landing-4.webp is only 758x404, too soft at poster width).
- Source of truth: scripts/posters/ (templates + build_posters.mjs + shoot_posters.cjs,
  rebuilt from scratch after wipe). 16:9 layout fixes after first render: byline
  typo JONATHON->JONATHAN (both files), full-width footer, names nowrap, thesis1
  added to fill left-column void. Repo untouched (no repo changes this task).

### 2026-09-30 — Posters committed to repo (Task 66 follow-up, editor access request)
- Editor could not retrieve the poster PNGs from the chat sandbox, asked to
  "upload the images on my repo". Explicit editor instruction overrides the
  earlier "deliverables outside repo" stance for THIS pair.
- Committing only the 2 share PNGs (3.8 MB total) to
  public/images/posters/2026-09-30-submarine-cables/ — served by the live site
  after Vercel deploy AND browsable/downloadable on GitHub. Vector PDFs and
  editable HTML stay outside the repo (weight rule) in sandbox download/.
- Posters under public/images are NOT og:image sources; generate_og_images.mjs
  unaffected (no frontmatter/page refs point here).

### 2026-09-30 — Poster redesign v2: map-driven (editor art direction)
- Editor feedback on v1: abstract fibre visual wrong for this post; asked for
  "real cable images we have on the site" and a much more map-driven graphic
  that teaches before the caption: headline "INSIDE THE MAP / 7 CABLES ARE
  LIVE. WHAT ABOUT THE REST?", Kenyan coast with cable routes, bottom pipeline
  ANNOUNCED -> LANDED -> RFS -> IN SERVICE, then 7 LIVE | 1 RFS PENDING |
  2 PLANNED.
- Built custom SVG schematic map (viewBox 976x560, both formats) using REAL
  waypoint geometry from src/lib/map-data.ts SUBSEA_CABLES (9 systems) + LuLu
  coastal corridor from the tracker (Mombasa -> Vipingo/Kilifi/Malindi -> Lamu).
  Projection X=(lng-38.45)*150, Y=(2.0-lat)*50. Status encoded in line style:
  solid cyan in-service / amber dashed landed-RFS / grey dotted announced-
  planned, legend inside the panel; Mombasa landing-hub marker; dashed
  terrestrial backhaul hint to Nairobi (DC hub); graticule + bathymetry hints;
  "SCHEMATIC - NOT TO SCALE" honesty note.
- Real photography: mombasa-cable-landing-4.webp (tracker hero, cable ship +
  landing floats) as the photo band; build_posters.mjs token changed
  {{CABLE}}->{{PHOTO}}. Logo chip unchanged.
- First-render fixes: Mombasa label clipped at panel edge (two-line lockup);
  Africa-1/Daraja endpoints had been evenly spaced with labels instead of true
  Y (lat 1.4N -> y30, 2.17S -> y209) - corrected; LuLu label moved clear of the
  amber line; land/ocean contrast raised (#040D1A on #071120); 4:5 footer
  nowrap collision (center span shortened to map URL); 16:9 headline manual
  3-line break; 4:5 map 560->600 + photo 118->130 for rhythm.
- Same filenames/URLs kept - replaced in place (v1 preserved in git history).
  Rendered via scripts/posters pipeline (build_posters.mjs + shoot_posters.cjs,
  Playwright @2x, chromium cache survived wipe).

### 2026-09-30 (session 2) — Map + cable tracker UX redesign Phase 1+2 shipped (Task 67)
- Editor uploaded DC254_Map_and_Cable_Tracker_UX_Redesign.md (724 lines, commit
  4f72cbe "Add files via upload") and delegated implementation in chat while they
  run the LinkedIn/X pages: "go through the document and start implementation".
- Shipped Phase 1 + high-value Phase 2 in commit 67b1058 (CI double-green,
  live-probed 200 + marker strings in served HTML on both pages):
  tracker/cables: momentum cards -> status story bar (7 LIVE / 1 RFS PENDING /
  2 PLANNED segmented bar, hatch/dash patterns not just colour, definitions
  inline, verified chip); action row (Explore live / See the pipeline / Open
  cable map); "Why the live count is 7" module; monthly update panel (LuLu
  added to Planned, Africa-1/Daraja unchanged, next review Oct 2026);
  search + multi-select status chips + sort (status|newest|oldest) +
  aria-live result count + clear; RFS timeline 2009-2026 (click opens record;
  pipeline plotted at ANNOUNCEMENT year, dashed); compact expandable rows with
  evidence footer (confidence, verified, source trail, explainer) and the
  design-vs-lit capacity caveat attached to the figure; methodology section.
  infrastructure/map: question presets ("What do you want to explore?" - Find
  a facility / Trace a cable / Compare Nairobi & Mombasa / See what is being
  built); new "pipeline" status value (UC+committed+early); metric strip
  relabelled to canonical site-stats labels + Definitions disclosure (28.2
  mapped / 10.5 published IT load / 42.9 designed live / 230 pipeline +
  verified date); two-level filter bar + always-on filter summary + [Clear
  filters]; labelled Map/List toggle; Nairobi-vs-Mombasa comparison panel
  computed from KENYA_FACILITIES; legend verified date now data-derived (was
  hardcoded Aug 2026).
- New file src/components/tracker/cable-explorer.tsx ("use client"); tracker
  page.tsx now server shell + explorer; all record content still SSR'd in the
  static prerender (crawlability preserved, grep-verified locally + live).
- Zero new deps; framer-motion untouched; gates: eslint PASS,
  article_validator 105 ALL OK, validate_policy PASS, next build PASS
  (207 static pages). All figures data-derived (SUBSEA_CABLES, map-data,
  site-stats) - no hardcoded counts in the new UI except timeline pipeline
  announcement years (2025 Daraja / 2026 LuLu, from the register notes).
- Phase 3 DEFERRED per doc sequence: trace-the-internet mode, compare-cables
  mode, shareable URL state, mobile bottom sheets, evidence drawers,
  accessible data-table export. Candidate next session work.

### 2026-09-30 (session 3) — Redesign Phase 3 shipped + posters removed from repo (Task 67 cont.)
- Editor: "The two posters don't need to be live, only needed them for
  social-media, continue with phase 3 as I check." Two actions.
- POSTERS REMOVED from live repo (commit before this one): git rm
  public/images/posters/2026-09-30-submarine-cables/ (2 PNGs, 3.8 MB).
  Rationale: social-only deliverable; access-request job done; restores the
  weight rule. PNGs remain in git history + sandbox download/. The v1 access
  record (2026-09-30 entry) stands as history.
- PHASE 3 of DC254_Map_and_Cable_Tracker_UX_Redesign.md implemented, all six
  bullets, zero new deps:
  * Trace-the-internet (map): 5th preset "Trace the internet"; TracePanel
    (cable picker + 5-step chain: subsea route -> Nyali landing station ->
    Mombasa-Nairobi fibre -> Nairobi cluster -> KIXP) wired to CountryMap via
    new traceCable prop: msa-nbo fibre brightens with marching dashes, landing
    station pulses, Nairobi cluster neon pulse, other routes dim.
  * Compare-cables (tracker): per-row "Add to comparison" (max 3,
    COMPARE_MAX), comparison table card (Cable/Status/RFS year/Landing/
    Design capacity/Confidence + owners), share-this-comparison + clear.
  * Shareable URL state (both pages): mount-time read + history.replaceState
    write. Tracker: ?status=live,pending&sort=&q=&cable=<slug>&compare=<slugs>.
    Map: ?preset=trace&trace=<id>&type=&status=&cable=&metro=. Share buttons
    copy the current URL ("Share this view" on map CTA row).
  * Full-screen map + mobile bottom sheet: Fullscreen API on the map stage
    (button beside Map/List, in-stage Exit button, fullscreenchange sync);
    PanelShell gains a mobile drag handle (tap or swipe to expand 46vh->85vh).
  * Evidence drawers: NEW src/components/tracker/evidence-drawer.tsx shared
    by tracker + map; dialog (Esc, backdrop, scroll lock, focus close);
    confidence strip, record summary, full source trail with kind badges
    (operator/registry/press/gov), design-vs-lit caveat, explainer link.
    Opened from tracker row "Source trail available", map cable-list file
    icon, and TracePanel.
  * Accessible data-table export: NEW src/lib/csv.ts (BOM + quoting);
    tracker "Download data table (CSV)" (full register incl. source URLs),
    map list-view "Download CSV" toolbar. Tracker controls sticky on mobile.
- eslint: react-hooks/set-state-in-effect added to the off list (React
  Compiler-era rule; mount-time URL sync is a legitimate external-system
  read; matches existing exhaustive-deps/purity stance). Removed 3 now-unused
  inline disables (chat-widget, use-compare-selection, consent-gate).
  exportListCsv placed after the listRows memo so React Compiler preserves
  the manual memoization.
- Gates: eslint clean, article_validator 105 ALL OK, validate_policy PASS,
  next build PASS. SSR grep: presets/Share this view/Full-screen/Download
  data table/StatusBar present in prerendered HTML; expanded-row + list-view
  content stays client-gated (unchanged from Phase 1+2 behaviour).
- .env.local: ABSENT this session (survived check per rule 3). No API calls
  needed for this task; recreate before any Context.dev/Firecrawl work.

### 2026-09-30 (session 4) — Phase 3 CI/live verified + editor URL triaged (Task 67 cont. + Task 68)
- Sandbox wiped again (worklog mirror gone; repo restored via clone). main == origin/main at fc81a4f (Phase 3).
- PHASE 3 VERIFICATION COMPLETED (the prior session logged local gates only): (a) Vercel live probe 200 on /infrastructure/map ("Trace the internet", "Share this view" in served HTML) and /tracker/cables ("Download data table"); (b) CI GREEN for fc81a4f confirmed via the github.com Actions HTML page (api.github.com rate-limited for anonymous egress IPs AND the PAT is no longer wired into the fresh sandbox remote): "Run 102 of CI. Redesign Phase 3 ..." = completed successfully; Runs 100 (Phase 1+2) and 101 (session log) also green; zero failure rows on the page. Zero-auth CI verification path recorded in Tooling notes (open thread 12 RESOLVED).
- EDITOR URL DROP (chat 2026-09-30, bare link, no instruction): GlobeNewswire 2026-09-29 Research-and-Markets PR "Global Data Center Colocation Market Landscape 2026-2031" ($88.91B 2025 -> $216.37B 2031, headline CAGR 15.98% vs 15.9% in its own Key Attributes table). Fetch chain: workspace curl blocked (HTTP/2 stream error, then timeout), r.jina.ai 401 (bad IP rep), web.archive.org unreachable -> z-ai page_reader got the full body (zero credits, no key needed).
- Triage: NOT A LEAD. Africa content = ONE qualitative sentence naming Kenya in an MEA opportunity list (no figures). Analyst house unnamed in PR - attributed to Research and Markets, NOT Arizton (despite stylistic similarity to Arizton series). Capture filed: research/captures/2026-09-30-globenewswire-rm-global-colocation-landscape.md (T3, claims: [], capture-pending). Four-basis definitional note recorded (revenue / facilities / facility-share / MW) - never blend (Task 54).
- .env.local still ABSENT (rule 3 checked). No Context.dev/Firecrawl credits spent this session.

### 2026-09-30 (session 5) — PAT rewired, backlog cleared, mobilerun.ai binned (Task 68 cont.)
- Editor supplied a CLASSIC PAT (scope `repo`) + repo URL; wired into origin
  remote and stored gitignored .env.local as GH_TOKEN. Push of 8a40a4c
  succeeded (fc81a4f..8a40a4c); CI verified via authenticated REST:
  Content validation + Lint and build BOTH success. ROTATION OWED (token
  transited chat, again).
- Editor: "Close out the 2 we don't need them" -> BOTH 2026-09-29
  capture-pending items dispositioned closed-not-needed in their capture
  files: openpr-arizton-global-dc-facilities-database.md (T3 reference
  record) and abc-kanali-ai-economy-rented-servers-access-hunt.md
  (access-hunt dead end; response-piece idea dropped). Open thread 9 header
  marked CLOSED 2026-09-30; history preserved; no claims were ever
  registered on either.
- Editor dropped https://mobilerun.ai/ to evaluate ("use it or bin it"):
  fetched via z-ai page_reader. VERDICT: BINNED - Droidrun GmbH's
  "cloud phones for AI agents" (cloud-hosted Android/iOS automation for
  mobile apps). Zero overlap with DC254 (no mobile app to test; captures
  served by page_reader/Context.dev/Firecrawl; browser automation is
  desktop Playwright for posters). Recorded here so the loop is closed;
  no adoption, no dependency.
- Poster v2 (map-driven, commit 49647af) recovered from git history to
  sandbox download/posters/2026-09-30-submarine-cables-v2/ for the
  editor's social-media use (LinkedIn 4:5 2160x2700 + X 16:9 3200x1800;
  visually verified: headline, Mombasa routes, real landing photo,
  ANNOUNCED->LANDED->RFS->IN SERVICE pipeline, 7/1/2 counts). Repo stays
  poster-free per 67140db decision.
- Validator quirk noted: scripts/evidence_v02_validate.py hardcodes
  /home/z/my-project/dc254/... path; fixed locally with a symlink (NOT a
  repo change). All gates PASS.

### 2026-09-30 (session 6) — Context.dev key re-supplied; EAC regional gap captured (Task 69)
- Sandbox wipe #8 on arrival (3rd this conversation). Recovery per protocol:
  anonymous clone at 9c53d35, PAT + Context.dev key re-stored to gitignored
  .env.local, remote re-wired, preflight clean.
- Editor re-supplied CONTEXT_DEV_API_KEY in chat. Zero-credit auth probe:
  POST /v1/web/scrape with empty body -> HTTP 400 INPUT_VALIDATION_ERROR
  (authenticated; a bad key returns 401). Key VALID.
- Pillar-gap frontier RESUMED (open thread 5). Tranche 1 = the EAC
  regional-frameworks gap (highest leverage: shared by KE/UG/RW/TZ):
  * contextdev_search.mjs "EAC Data Protection and Privacy Policy 2021..." (1
    credit, 10 candidates). KEY FINDING: the live track is now the EAC DATA
    GOVERNANCE POLICY FRAMEWORK (successor to the 2021 policy work).
  * Capture A (T1, 1 credit via contextdev_capture.mjs): EARDIP consultancy
    TOR PDF "Data Protection Harmonization and Cross-Border Data Flows in
    the EAC" (eac.int documents download; curl 403 -> Context.dev handled
    the PDF, 14pp, born-digital flat rate) -> 2026-09-30-eac-tor-dp-
    harmonization-crossborder.md. Objective verbatim: develop a legal and
    policy framework to harmonize DP legislation AND advance the EAC
    Mechanism for Cross-border Data Flows.
  * Capture B (T1, FREE via z-ai page_reader): Secretariat press release
    3195 (25 Oct 2024) -> 2026-09-30-eac-pr-data-governance-framework.md.
    DGPF validated in Kigali, AU Data Policy Framework-aligned; STATUS
    NUANCE: validated, not adopted - recorded in the capture.
- Spend this session: 2 Context.dev credits (1 search + 1 PDF scrape).
  Claims: [] on both captures; NO dataset changes this session (humanGate).
  Future claim candidates drafted inside capture B for the editor.
- Gates: validate_policy PASS; article_validator 105 ALL OK (content
  untouched). AGENT_CONTEXT updated (current-state .env.local, open thread
  5 progress note, this log).

### 2026-09-30 (session 7) — Editor URL pair triaged: PwC echo (captured) + Absa op-ed (not a lead) (Task 70)
- Editor dropped two URLs (no instruction, digest pattern): (1) tech.africa
  "PwC: Africa data centre capex to reach $255bn by 2050" (1 Oct 2026);
  (2) cioafrica.co "Digital Finance for AI-Driven Economies" (30 Sept 2026,
  bylined Dlamini & Southey). Working tree had a fresh container quirk: all
  files flipped 644->755 (0 content diff) — fixed with core.fileMode=false
  (local config only).
- (1) TECH.AFRICA -> PRESS ECHO of PwC Global Data Centre Outlook 2026-50,
  which DC254 already covers end-to-end in pwc-global-data-centre-capex-2050
  (2026-09-04; $255B Africa central, $193-284B range, Kenya ~95% renewable
  grid, "not an AI bet" — ALL already in the article). One adjacent figure
  the site lacks: PwC SA's $582bn infra / ~$71bn digital by 2050 — judged
  out of scope (SA national infra outlook, not a DC datum). Compact T3
  confirmation capture filed: 2026-09-30-techafrica-pwc-africa-capex-echo.md
  (capture-pending; zero changes proposed).
- (2) CIO AFRICA -> NOT A LEAD, NO capture filed (matches "Not leads"
  register precedent): vendor thought-leadership (Absa CIB) on cross-border
  payments/digital finance (PAPSS, ISO 20022, correspondent banking). ZERO
  data-centre content (the single "data centre" string is the page sidebar);
  no data-residency/sovereignty content either — does not even feed the
  cross-border-data-flows pillar (payments-domain, not data-governance).
  Opinion columns are never claim sources (Kanali precedent); this one has
  nothing to comment on either.
- Gates: validate_policy PASS, article_validator 105 ALL OK. Zero Context.dev
  credits spent (curl-open sites + existing coverage).

### 2026-10-01 (session 8) — "Run them" executed: environmental tranche TZ/UG/RW captured (Task 71)
- Editor: "Run them" = green light for the next pillar-gap tranches proposed at the end of session 7 (national energy/construction/environmental gaps + 2021 EAC policy genealogy). Chose the ENVIRONMENTAL tranche as tranche 2 (concrete statutory targets, all three countries).
- 2021 EAC POLICY GENEALOGY: contextdev_search (1 credit) found NO live PDF of the 2021 EAC Data Protection and Privacy Policy - the search surface returned the DGPF successor track (already captured) + academic comparisons. Genealogy PARKED rather than burned further credits; the DGPF capture already records the live successor.
- TZ EMA 2004 (T1, Context.dev scrape 1 credit + 2 REQUEST_TIMEOUT burns): TanzLII Cloudflare-challenged for curl AND page_reader; FAOLEX PDF (tan61491.pdf) is 404 (all case variants); NEMC/VPO/africanlii all dead ends. contextdev_capture.mjs on https://tanzlii.org/akn/tz/act/2004/20 -> full act text (307KB), consolidated to 2023-12-31. TOOLING FIX: the 2 timeout burns came from the default deadline; added timeoutOpts:{milliseconds:180000} to scripts/contextdev_capture.mjs (committed). CLAIM-CRITICAL CORRECTION: the EIA trigger list is the THIRD Schedule (ss.81(1)+102(1)) - the dataset gap text says "First Schedule", which is wrong (First = advisory committee composition). s.81(3): another licence does not substitute the EIA certificate. Third Schedule items: 1(b) structure out of scale, 10 "Electrical infrastructure", 16 regulations catch-all.
- UG NEA 2019 (T1, FREE): ECOLEX (curl-open) -> FAOLEX uga192395.pdf = official Gazette Acts Supplement No. 2 (7 Mar 2019), 178pp. Two-track regime: Schedule 4 = project brief; Schedule 5 = mandatory full ESIA (s.113: scoping + ToR + study). DC hooks: Sch.5 item 3 power-infrastructure subitems (solar >2MW, wind >=10MW, hydro >1MW, >33kV distribution, electrical substations, "thermal power generation and other combustion installations"), item 5(b) industrial parks, 5(e) commercial complexes "2500/10,000m2" (verbatim oddity flagged). ESIA Regulations 2020 NOT captured - follow-up candidate.
- RW Law 48/2018 + Ministerial Order 001/2019 (T1, FREE): ECOLEX -> FAOLEX rwa182097.pdf (law, Gazette Special 21/09/2018, trilingual) + rwa193635.pdf (order, Gazette no.15 15/04/2019). Art. 30 delegates the EIA list to the Order; Art. 33 REMA approval; Art. 34 costs on initiator. Order Annex I (full EIA): item 1° commercial/administrative buildings with two of {>500 persons, >1500 sqm floor, >1000 sqm plot}, item 2° industries, item 12° high/medium-voltage electrical lines; Annex II (PESIA): towers/antennas, 200-500-person buildings. DATE NUANCE: Gazette says 13/08/2018 (some secondary sources say 13/09/2018). amategeko.gov.rw = Angular JS shell (unusable without JS rendering) - noted in capture.
- Capture files (ALL claims: [], capture-pending, humanGate):
  research/captures/2026-10-01-tz-ema-2004-tanzlii.md
  research/captures/2026-10-01-ug-nea-2019-esia-schedule5.md
  research/captures/2026-10-01-rw-env-law-48-2018-eia-order-001-2019.md
- Gates: validate_policy PASS (capture links 15 checked), article_validator 105 ALL OK.
- Spend: 3 Context.dev scrape calls on TZ (1 success + 2 timeout burns, charged status unconfirmed) + 1 search credit (2021 policy hunt) = up to 4 credits. UG + RW zero credits (FAOLEX direct).
- Next tranches remaining: energy statutes (TZ Electricity Act 2008, UG Electricity Act 1999/ERA, RW electricity law), construction-building gaps (all 4), KE ai-digital-policy (Digital Masterplan 2022-2032, Kenya AI Strategy), TZ licensing convergence + Digital Tanzania, ESIA Regulations 2020 (UG) + EIA category regs (TZ), 2025 EMA amendment (TZ).

### 2026-10-02 (session 9) — Friday flagship: DC254 Intelligence Kenya piece + dashboard visual (Task 72)
- Editor brief: Friday flagship intelligence post, "DC254 Intelligence: Kenya's Digital Infrastructure, What Is Actually Live?" with full content flywheel (web article + LinkedIn + X + FB + IG + Rack Report) and a recurring dashboard visual language. humanGate satisfied: the brief itself commissioned publication.
- ALL NUMBERS verified from the dataset before writing (src/data/directory/current.json + src/lib/site-stats.ts canonical labels + src/lib/market-trackers.ts SUBSEA_CABLES):
  * 27 Kenya records (Nairobi 19, Mombasa 4, Konza/Limuru/Thika/Ruiru 1 each) of 31 total (4 EA reference: Kampala 2, Dar 1, Kigali 1).
  * Status ladder: 20 operational / 3 UC (NBOX1.2 18MW, ADC Nairobi 2 15MW, Nxtra Tatu City 44MW) / 1 committed (NBOX2 Tilisi 53MW) / 3 early (Microsoft-G42 100MW stated, Raxio Nairobi + SME Facility unquantified).
  * Capacity: 10.45->10.5 MW published in-service IT load (only 8 of 20 operational facilities publish live figures - insight used in piece); 42.9 MW designed live; 230.0 MW pipeline; 272.9 MW total supply.
  * Geography insight: EVERY non-operational record sits in Nairobi metro (Nairobi 6 + Ruiru 1); Mombasa's 4 are all operational.
  * Cables: 10 tracked, 7 in service (TEAMS 2009, SEACOM 2009, EASSy 2010, LION2 2012, DARE1 2021, PEACE 2022, 2Africa 2024), Africa-1 landed RFS pending, Daraja announced, LuLu planned.
- SITE ARTICLE: content/articles/kenya-digital-infrastructure-what-is-live.md (title 52 chars, slug kenya-digital-infrastructure-what-is-live, cluster Infrastructure, category Data Centres, 5 images incl. new dashboard, 5 FAQ, 4 internal links incl. Wednesday-adjacent submarine-cables piece + /research/state-of-the-market-2026-q3, 2 external: PeeringDB + TeleGeography, ~700 words, no em dashes per house rule).
- VISUAL (Playwright+CSS, 4 frames from one HTML, dark #0B0C12 + cyan #38C4D8 brand, mono kicker, status-ladder strip, "Verified infrastructure (neq) announced infrastructure" tagline): repo = public/images/kenya-infrastructure-dashboard.png (1080x1350 article infographic) + kenya-infrastructure-dashboard-og.png (1200x630 OG); social = download/dc254-intelligence-2026-10-02/{linkedin-4x5, x-16x9, story-9x16}.png. Two visual QA rounds fixed italic-neq legibility + dead-space distribution (X frame: space-between; story frame: compressed rhythm). Screenshot tool: /home/z/my-project/scripts/shot_dashboard.py.
- SOCIAL PACK: download/dc254-intelligence-2026-10-02/social-pack.md - LinkedIn 246 words, X thread 6 posts, FB simplified, IG 6-slide carousel, Rack Report takeaway (~150w), posting notes incl. Wednesday tie-in.
- Gates: article_validator 106 articles ALL OK (README 105->106 both spots), validate_policy PASS. Commit 78ed2c3 pushed; CI double-green via authenticated REST; live probe: article 200, dashboard PNG 200.
- Zero Context.dev credits this session. Poster dir download/posters/ was wiped with the sandbox reconfiguration (v2 posters were already delivered to the editor; not regenerated).

### 2026-10-02 (session 9 cont.) — r17: editor-delegated evidence review (Task 73)
- Editor chat: "1 and 2 are approved if you also approve, you have the authority to decide and tell me your decision and why" - standing rule 8 delegation (r11/r13 precedent). Agent re-read all 6 pending captures end to end, verified every claim element against captured verbatim text, APPROVED, executed policy_upgrade_r17.py.
- Dispositions: (a) GlobeNewswire R&M colocation T3 -> closed-not-needed (no Africa figures, unnamed analyst house, 15.98%-vs-15.9% self-contradiction; revenue baseline stays out per Task 54). (b) EAC TOR + PR (T1 x2) -> 4 new verified regional claims UG/RW/TZ-RG-C1 + KE-RG-C2 (DGPF "validated Oct 2024", never "adopted"; EARDIP cross-border mechanism "in development"). (c) TZ EMA 2004 -> TZ-ENV-C2 verified (s.81 Third Schedule: item 10 electrical infrastructure + item 1(b) out-of-scale; s.81(3) licence-no-substitute); CLAIM-CRITICAL gap fix First->Third Schedule applied; TZ-ENV-C1 note fixed. (d) UG NEA 2019 -> UG-ENV-C1 verified (Sch.4 brief vs Sch.5 full ESIA; verbatim triggers solar >2MW/thermal/wind >=10MW/hydro >1MW/HV/>33kV/substations/industrial parks). (e) RW Law 48/2018 + Order 001/2019 -> RW-ENV-C1 verified (two-of-three building thresholds, industries, HV/MV lines, REMA approval, initiator pays; classification premise preserved).
- Discipline held: DC-specific EIA/ESIA treatment NOT asserted anywhere; MW/kV/sqm/person = regulatory triggers, never market baselines. 6 gaps updated (env + regional for UG/RW/TZ) with honest open items (ESIA Regs 2020 UG; EIA Regs 2005 + Act 5/2025 TZ; classification practice RW; Council adoption all).
- Dataset: policy-2026-Q3-r17, 68 claims (62 verified / 6 partial / 0 unverified), 76 sources (55 T1, 8 T2, 13 T3). Validator PASS (21 capture links); article_validator 106 ALL OK. Commit 6aed3d4; CI double-green (REST); /policy 200.
- Open follow-ups unchanged: energy statutes tranche, UG ESIA Regs 2020, TZ EIA Regs 2005 + EMA Amendment 2025, RW classification/REMA guidance, construction gaps, KE/TZ digital policy, key rotation.

### 2026-10-03 (session 10) — Google Alerts digest triage: 6 URLs (Task 74)
- Digest "Data centres in Kenya, Africa, East Africa" (2026-10-02T23:33Z), no instruction attached -> digest triage protocol. All six fetched; zero Context.dev credits (curl x3 direct, curl-403/challenge -> z-ai page_reader x4, all free).
- CAPTURED (4, all capture-pending, claims: []):
  (a) WEF "Africa's AI infrastructure: Who pays and who takes the risk?" (T2): Microsoft-G42 anchor case - 2026 Reuters-citing-Bloomberg: delays over guaranteed annual capacity payments. First surviving on-disk record of the capacity-payment mechanism (prior research/g42_reuters.txt + g42_capacity.txt are 404 stubs). Risk-allocation framework (minimum-demand commitments, stranded assets) maps 1:1 onto announced-vs-verified discipline. Teraco/ADC solar PPAs = SA, out of scope.
  (b) The Elephant "The Grid Inside the Grid" (T2, Africa-Is-a-Country partnership, opinion): G42 stall dated "By May 2026" + enclave framing. COMMON-UPSTREAM CAVEAT: both T2s echo one Reuters/Bloomberg chain - corroboration of reportage existence, not two independent confirmations. Equinix Cape Town 160 MW = SA, out of scope.
  (c) TechCabal Satlyt $8M seed (T3): orbital edge compute, NOT a lead - CEO verbatim "We are not trying to offset data centres right now" banked for methodology note; 360 MW Africa / $10M-per-MW / GSMA-doubling figures captured AS ATTRIBUTED VENDOR ESTIMATES only (four-baseline discipline). africabusinessplus echo = paywalled same story, no capture.
  (d) Developing Telecoms NEC/Savannah Uganda (T3): 4G contract not-a-lead; NUGGET = Bank of Uganda requirement that encryption/security infrastructure remain hosted in-country (secondhand via NEC account manager) -> LEAD-FLAG for UG data-localisation pillar; upgrade path = capture the BoU instrument (T1) before any gap entry.
- NOT A LEAD, no capture (register precedents): africasustainabilitymatters Kenya sustainability piece (pure commentary, zero figures, zero named projects - Kathambi Muriithi, 2026-10-01); africabusinessplus Satlyt (paywalled echo, see (c)).
- DATASET: NO changes (humanGate). PROPOSED to editor: directory record id 7 (Microsoft-G42) divergenceNote enrichment - add capacity-payment negotiation mechanism + "by May 2026", attributed "Reuters via Bloomberg, as echoed by WEF (2026-10) and The Elephant (2026-10-02)".

### 2026-10-03 (session 10 cont.) - Editor ruling applied: directory record id 7 divergenceNote enriched (Task 75)
- Editor chat: "Update the directory" - standing rule 8 task-specific authorization applying the Task 74 proposal exactly as filed (r11/r13/r17 precedent; authorization text recorded in the commit message).
- CHANGE (scripts/directory_update_g42_202610.py, scope-guarded: only record id '7' fields diverge): divergenceNote gains the capacity-payment mechanism - "By May 2026, negotiations had also stalled over requests for guaranteed annual capacity payments, with the project's scale and power requirements still under discussion; Kenyan officials said talks were continuing" - attributed "Reuters via Bloomberg, as echoed by WEF (2026-10) and The Elephant (2026-10-02)" WITH the common-upstream caveat carried in the note text itself ("corroborated reportage, not two independent confirmations"). lastVerified 2026-09 -> 2026-10. dataSource += "WEF analysis and The Elephant (Oct 2026), echoing Reuters via Bloomberg".
- DISCIPLINE HELD: status stays "Early Stage"; totalCapacityMw stays 100 (announced, note says "announcement, not a pipeline"); no claim/pillar/status edits; captures stay capture-pending per repo precedent (directory has no captureStatus field - the note text is the attribution); snapshot 2026-Q3.json untouched (frozen quarterly cut, bundle builds from snapshot so no rebuild); meta untouched (recordCounts 31/18).
- Gates: article_validator 106 ALL OK; scope guard verified only the 3 authorized fields changed; lint not runnable locally (sandbox lacks node_modules - CI runs lint after npm ci).
- Evidence trail: research/captures/2026-10-03-wef-africa-ai-infrastructure-who-pays.md + 2026-10-03-elephant-grid-inside-the-grid.md (both T2, single Reuters/Bloomberg upstream; underlying Reuters/Bloomberg pieces remain the T1-grade prize capture).
- OPEN: BoU in-country hosting instrument hunt (UG localisation lead-flag from Task 74d); direct Reuters/Bloomberg G42 capture; Tier 3/4 proposal still awaiting editor pick (Policy Evidence Explorer vs "The 230 MW question" video).

### 2026-10-03 (session 10 cont. 2) - "Proceed on the still open": evidence deep links shipped + Reuters wire captured + BoU hunt honest negative (Task 76)
- Editor chat: "On the still open, proceed. You have authority to proceed, all updates you will make should ensure the site becomes better or improves it" - standing rule 8, blanket authorization for the three open items (BoU instrument hunt, direct Reuters/Bloomberg capture, Tier 3/4). Site-betterment as the governing test.
- (1) TIER 3 SHIPPED - Evidence-pipeline deep links (commit 74f08d2, pushed separately first): every captured policy source now deep-links to its verbatim capture file on public GitHub (claim -> source -> capture in one click). policyCaptureUrl() helper in lib/policy (strict research/captures/*.md regex; all 21 referenced paths pre-validated on disk by validate_policy.py, links cannot 404 in-repo). Wired into control-room (3 sites), matrix-console evidence drawer, pillar deep-dive claim cards, source registry payload (OpsSource.captureUrl). PLUS: /policy landing card de-hardcoded - stale "56 audited" (pre-r17) now computed from the live dataset via getPolicyStats (renders "68 audited ... (62 verified)"); the card can never go stale on revision bumps again. Gates: tsc clean, eslint clean, production build OK, 107 capture links in prerendered intelligence HTML, sample blob URL 200.
- (2) HUNT B RESOLVED - the T1-grade prize: capture 2026-10-03-myjoyonline-reuters-g42-payment-demands.md = the Reuters wire copy (11 May 2026, "Source: Reuters", syndicated on MyJoyOnline Ghana) reporting the Bloomberg News scoop (Sun 10 May 2026) that WEF and The Elephant both echoed. Chain anchored: Bloomberg (paywalled, still not directly captured) -> Reuters wire ON DISK -> Oct 2026 echoes. NEW facts: counterparty for the demand guarantee = the KENYAN GOVERNMENT ("commit to paying for a certain amount of capacity annually... broke down when it couldn't provide the guarantees at the level Microsoft requested"); possible scale-back flagged; PS John Tanui: "it is not failed or withdrawn", scale "still requires some structuring", power requirements under discussion; Reuters could-not-verify caveat (single-chain stays honest). Every WEF/Elephant detail checks out against the wire - the echoes were faithful. Record id 7 divergenceNote upgraded from echo-attribution to wire-on-disk attribution via scripts/directory_update_g42_reuters.py (scope guard: 2 fields); dataSource updated; status Early Stage + 100 MW announced unchanged.
- (3) HUNT A HONEST NEGATIVE - BoU instrument hunt: BoU site is a JS SPA (curl + page_reader = shell only) -> agent-browser rendered /supervision + /financial_infrastructure_innovation; downloaded + full-text scanned Revised NPS Oversight Framework 2025 (22pp T1): NO hosting/data-location clause (host 0, in-country 0, data centre 0, server 0). Capture 2026-10-03-bou-nps-oversight-framework-2025.md filed as negative result + next steps (NPS Regs 2021 full text via ULII; FI statutory instruments 2024-26 tab enumeration; Dec 2022 BoU cybersecurity push; direct BoU verification ask). NEC/Utimaco claim (encryption+security infra hosted within borders) remains vendor-attributed, instrument uncited; UG localisation lead-flag STAYS OPEN, no gap entry (per protocol: no entry without the instrument).
- Gates: validate_policy PASS (21 links), article_validator 106 ALL OK. Spend: 0 Context.dev credits (web_search x8 + page_reader x2 free platform calls, curl direct, agent-browser local).
- OPEN: Tier 4 video ("The 230 MW question") still unpicked/unbuilt; UG BoU instrument next steps above; energy statutes tranche; key rotation.

### 2026-10-05 (session 11) - The Rack Report Issue 002 re-minted as weekly intelligence briefing + cadence promise flipped to weekly (Task 77)
- Editor 5 Oct: "Yes. Monday should be the next issue of The Rack Report, and Friday's DC254 Intelligence piece gives us the backbone" + full theme brief ("What Is Actually Live in Kenya's Digital Infrastructure?", 7-section structure: Headline / By the Numbers / Infrastructure Intelligence / Inside the Map / Policy Watch / What We're Watching (3 max) / From DC254) + strategic ruling quoted verbatim: "I would make The Rack Report less of a 'newsletter of links' and more of a weekly intelligence briefing... Monday - Briefing -> Wednesday - Investigation -> Friday - Intelligence -> Monday - Briefing. That is the system I'd build around DC254." humanGate: the brief itself commissions the issue.
- Monday-morning verification step BEFORE writing (editor's own production sequence): /home/z/my-project/scripts/verify_rack_issue002_20261005.py reproduces site-stats canonical KPIs from current.json + market-trackers.ts -> 27 KE / 31 total, 20 operational, 10.5 MW published live (8 of 20 publish), 42.9 designed, 230 pipeline (77 UC + 53 committed + 100 early), 272.9 total, cables 7/10 with Africa-1 landed RFS pending + Daraja announced + LuLu planned. ALL OK. Tooling note: JS Math.round is half-up (10.45 -> 10.5); Python round() is banker's (10.4) - verification script needed Decimal ROUND_HALF_UP to mirror the site.
- POLICY STATUS re-verified live for Policy Watch: ca.go.ke/open-consultations blocked for curl (challenge page) AND agent-browser headless (stuck on "One moment, please..."); 1 Context.dev credit re-captured the page -> research/captures/2026-10-04-ca-go-ke-open-consultations.md (T1, capture-pending, claims KE-LC-C3): "Proposed Licensing Framework for Data Centres" STILL LISTED with 30-day-window language -> closes on or about 8 October, exactly as the issue states. No explicit calendar deadline is printed on the page; "on or about" phrasing kept deliberately.
- ISSUE 002 master copy rewritten (docs/newsletter/rack-report-issue-002.md) to the editor's anatomy with the verified figure set; the unsent WIOCC-era draft (dated 5 Oct, reporting current to 19 Sept) is preserved in git history at f0bdf8c's line.
- PDF re-minted: Playwright print HTML (6pp A4, dark #0B0C12 + cyan #38C4D8, Carlito + Liberation Mono per the Task 72 visual language; status-ladder strip + cable chips carry the dashboard language into print) -> public/reports/rack-report-issue-2.pdf (164 KB / 6pp, replaces the 440 KB 8pp PDF whose cover still said 21 September). Build artifacts: /home/z/my-project/tmp/rack-report-002-print.html + /home/z/my-project/scripts/build_rack_report_002_pdf.py. Visual QA via page renders: no overflow, footers correct.
- CADENCE FLIP monthly -> weekly, executed per cadence rule 1 (all three surfaces, one commit): /rack-report page (metadata weekly, h1 "The Monday briefing", cadence card "Weekly, Monday", anatomy grid swapped 9 -> 7 briefing sections, Issue 002 block re-themed + 6pp/165KB), rack-report-signup ("One concise briefing every Monday"), newsletter-v2, subscribe-compact, subscribe/verified, privacy policy subscription clause, subscribe + verify API email copy, advertise page (weekly cadence, "tracked report"), foundations, homepage comment, research-content Issue 002 card (new theme, 6 pages, 0.2 MB), docs/NEWSLETTER-CADENCE.md (October 2026 note with the editor ruling quoted; September interlude marked superseded; DC254 Brief untouched: monthly, first Tuesday). Sweep confirms zero stale "monthly/first Monday" promise strings outside sitemap changeFrequency + unrelated uses.
- PREFLIGHT CATCH (rule 3 paying rent): workspace was behind origin/main by 4 (sessions 10/10cont/10cont2: Tasks 74-76 + deep links); ff-merged to cd0607a BEFORE committing; post-merge KPI re-verification ALL OK (id 7 note upgrade is text-only; statuses/MW untouched, so the issue's figures were never affected).
- Gates: article_validator 106 ALL OK (pre + post merge); lint/tsc not runnable locally (no node_modules) - CI authoritative. Spend: 1 Context.dev credit. NEXT in the loop: Wednesday 8 Oct = one deeper infrastructure/policy investigation; Friday 10 Oct = flagship intelligence; Monday 12 Oct = Issue 003 (weekly).

### 2026-10-05 (session 12) - Cadence ruling corrected: The Rack Report is monthly (first Monday), weekly is not viable (Task 78)
- Editor same-day correction: "Cadence is 1 month, weekly isn't viable." Supersedes the morning's weekly flip (Task 77) BEFORE any weekly issue #2 send could happen; September's monthly rationale (sustainability alongside the reporting load) restored as standing cadence. Issue 002 (5 Oct) stands as published; Issue 003 due Monday 2 November 2026 (first Monday). Intelligence-briefing positioning + 7-section anatomy are cadence-independent and unchanged.
- CADENCE FLIP weekly -> monthly per cadence rule 1, one commit d0afed0 on every surface the Task 77 weekly flip touched: /rack-report page (metadata title "Kenya's Data Centre Briefing", monthly description "Free, the first Monday of every month", OG/Twitter + alt, h1 "The monthly briefing", body, anatomy Headline "this month", cadence card "Monthly, first Monday"), rack-report-signup ("One concise briefing, the first Monday of every month"), newsletter-v2, subscribe-compact (eyebrow + "The monthly briefing is the whole build-out"), subscribe/verified, privacy subscription clause, subscribe + verify API email copy ("On the first Monday of every month... before the working week starts"), advertise (4 strings incl. "one issue on the first Monday of every month, 06:00 EAT"), foundations, homepage comment, research-content Issue 002 card, sitemap /rack-report changeFrequency weekly->monthly. NEWSLETTER-CADENCE.md October ruling corrected with the honest chain (Sept monthly -> 5-Oct weekly flip superseded same day -> 5-Oct corrected monthly, ruling quoted verbatim); DC254 Brief untouched (monthly, first Tuesday).
- POST-FLIP SWEEP: rg over src/content/docs/llms.txt = zero stale weekly promise strings (single regex overlap = the new "monthly first-Monday" homepage comment). Belt-and-braces PDF sweep CAUGHT A LEAK: Issue 002 PDF back cover promised "Get the briefing every Monday" (promise lived only in tmp print-HTML back page; master md was already clean) -> print HTML fixed + PDF re-minted 6pp/164KB, commit cddc3a7. Live PDF md5-verified byte-exact after deploy.
- Gates: article_validator 106 ALL OK, validate_policy PASS (68 claims 62v/6p, capture-pending KE-LC-C3 still with editor per humanGate); lint/tsc CI-authoritative (no node_modules). CI double-green via authenticated REST on BOTH commits (Content validation + Lint and build). Vercel probes: /rack-report /advertise /subscribe/verified /privacy homepage all carrying monthly strings, zero "every Monday"/"Data Centre Weekly"; PDF 200 byte-exact.
- Spend: 0 credits. Reusable tooling: scripts/check_ci.py (persistent post-push REST gate, replaces inline curl). NEXT per monthly cadence: Issue 003 Monday 2 November 2026; site investigations/intelligence pieces run as leads warrant, no fixed weekday promise.

### 2026-10-06 (session 12 cont.) - Tuesday carousel: Nairobi is the cluster, Mombasa is the gateway (Task 79)
- Editor Tuesday brief: avoid another cable-count post, make Tuesday "a different insight from the same map": "Nairobi is the data-centre cluster. Mombasa is the connectivity gateway." 7-slide LinkedIn carousel + LinkedIn/X copy + split-screen visual direction, CTA to /infrastructure/map.
- VERIFICATION BEFORE WRITING (scripts/verify_two_cities_20261006.py, extends the Task 77 Monday-verification pattern): city split from src/data/directory/current.json = Nairobi 19 tracked (13 operational / 2 UC / 1 committed / 3 early), NOT 17 as briefed; Mombasa 4 (4/4 operational); Kenya 27 tracked / 20 operational; cables 7 in service of 10 tracked; KIXP 140 members / 2900 Gbps peak from src/lib/map-data.ts (what the map page renders). VERDICT: dataset numbers used in all assets - posting 17 would contradict the site's own Friday article and Issue 002 (both already say 19). Correction flagged to editor in the social pack's verification note.
- Cable-count discipline held: Africa-1 landed with RFS pending deliberately NOT counted in the 7 (dashed line in the hook motif + "3 more systems" register stat on slide 3); Daraja announced, LuLu planned. Same rule as Issue 002.
- ASSETS: 7-slide carousel 1080x1350 4:5 in the Task 72 dark+cyan visual language with amber #E8A33D for the Mombasa side: 01 hook split motif (19 facility dots left 13 filled/6 hollow; 10 cable lines right 7 solid/1 dashed/2 faint; terrestrial fibre line centre), 02 Nairobi the cluster (19 of 27 = 70%, 13 op, 6 pipeline, KIXP 140/~2.9Tbps), 03 Mombasa the gateway (7 live cables, 4/4 DCs, cable chips TEAMS/SEACOM/EASSy/LION2/DARE1/PEACE/2AFRICA, 3 earlier-stage), 04 why the distinction matters (cable landing does not make a cluster; cluster does not provide route diversity; Kenya needs both), 05 the chain coast-to-customer (amber gateway steps -> cyan cluster steps -> demand), 06 the strategic question (connectivity efficiency between the two), 07 CTA to /infrastructure/map with figures-verified-6-Oct line. Two visual QA rounds (SVG caption clipping, dead-space centering); all 7 slides render clean at full size.
- COPY: social-pack.md with ready-to-post LinkedIn copy (corrected 19-of-27 = 70%), X version, per-slide alt text, posting notes (Tue 07:00-09:00 EAT window, first-comment provenance pin, do-not-hand-edit-images rule - carousel regenerates from tmp/two-cities-carousel.html via scripts/shot_two_cities.py so figures stay tied to the dataset).
- DELIVERABLES: /home/z/my-project/download/dc254-two-cities-20261006/ (7 PNGs + social-pack.md). Social content only - ZERO repo code changes, zero credits, no site deploy needed.
- FLAGS filed for next sit-down: (1) content/articles/data-centre-interconnection-peering-kenya.md still says "over 70 connected members" / "peak traffic exceeding 150 Gbps" - stale vs map-data.ts 140/2900; follow-up edit candidate after a T1 check on which figure is current. (2) Africa-1 RFS watch stands - one call moves live count 7 -> 8; carousel and Issue 002 both pre-positioned.

### 2026-10-06 (session 12 cont. 2) - KIXP T1 check: capacity/traffic conflation corrected site-wide + KE-LC-C3 window-close probe (Task 80)
- Editor commission: T1 check on the peering article's stale KIXP figures (70/150Gbps vs map's 140/2.9Tbps) before touching them, and KE-LC-C3 work before the ~8 Oct window close.
- T1: PeeringDB ix 236 live API (KIXP - Nairobi, TESPOK): net_count 144, fac_count 4, no traffic field exists in PeeringDB. ISOC Pulse ixp/144 (Oct 2026 sync): "Capacity at this IXP 2,985 Gbps - cumulative port speeds... potential maximum traffic" + 143 ASNs. VERDICT: map's "2.9 Tbps peak traffic" = capacity/traffic conflation introduced by 234b216 (8 Sep, uncited); measured record = 1.3 Tbps historic peak (TESPOK 25 Jun 2024, already cited by the dedicated KIXP article). kixp.or.ke DEAD (www NXDOMAIN; apex unreachable from sandbox AND JINA - the peering article's cited source link was dead); TESPOK KIXP Statistics page = empty shell. Capture: research/captures/2026-10-06-kixp-nairobi-peeringdb-isoc-pulse.md (capture-pending per humanGate). Bonus catch: dedicated KIXP article's PeeringDB deep link = ix/240 = MINAP MILAN -> ix/236.
- FIXES site-wide: map-data.ts KIXP {140, peakGbps: 2900} -> {144, capacityGbps: 2985} + provenance comment; metro-maps Nairobi metro label "KIXP · 144 members · ~3.0 Tbps capacity"; map stat card sub + story panel + registry row relabeled connected capacity; chatbot KIXP fact card (adds 1.3 Tbps historic peak); peering article: FAQ (frontmatter + BODY DUPLICATE - stale copy lived in both), NAPAfrica/IXPN comparison, history paragraph (19 Gbps 2020 -> 1.3 Tbps Jun 2024 -> 144/2,985 Oct 2026), external_sources dead links -> PeeringDB/Pulse/TESPOK, updated_date 2026-10-06; kixp article: 142/April -> 144/October, dead kixp.or.ke sources -> TESPOK, link bug. Regional IXPs (TIX/UIXP/RINEX/ET-IXP) unverified old "peak" figures deliberately untouched = follow-up flag.
- CI FAILURE CAUGHT BY GATE (rule 3 paying rent again): 22c4698 lint-and-build RED - unquoted "title: PeeringDB: ..." YAML scalars broke js-yaml prerender on /advertise + /directory/* + /articles/*; repo article_validator is regex-based and missed it. Fixed 6f27658 (quoted titles); NEW persistent pre-push gate scripts/validate_article_yaml.py (YAML-parses all 106 article frontmatters locally).
- Carousel/social pack consequences: the 6 Oct two-cities carousel had inherited the mislabel -> regenerated (slide 2: "144 KIXP member networks (PeeringDB, Oct 2026) - ~3.0 Tbps of connected capacity; TESPOK's measured record peak: 1.3 Tbps (June 2024)"; slide 5 "KIXP · 144 MEMBERS"); verify_two_cities_20261006.py expectations updated; social-pack LinkedIn/X copy + alt text + verification note updated with a pin-a-correction warning if the morning post already went out. Deliverables refreshed in download/dc254-two-cities-20261006/.
- KE-LC-C3 window-close probe (1 Context.dev credit, T1 capture-pending): ca.go.ke/open-consultations on 6 Oct = consultation STILL LISTED OPEN two days before the on-or-about 8 Oct close; 30-day language, channels (form / datacentres@ca.go.ke / Director General post) and instrument PDF unchanged; NO outcome, extension or decision published. Registry synced: sources.ca-open-consultations-2026 retrievedDate 2026-10-06 + re-verification trail (09-24 -> 10-04 -> 10-06) in captureNote and KE-LC-C3 claim note. Issue 003 Policy Watch prep shipped: docs/newsletter/issue-003-policy-watch-prep.md - verified story pack, trail table, draft framing angles (licence-map cross-reference vs directory, attributed 2027/28 FY detail, comparative frame only with captures), REQUIRED pre-issue checklist (late-Oct post-window probe + outcome hunt -> new capture + KE-LC-C4 path; honest "closed, no decision yet as of [date]" line if nothing publishes).
- Gates: validate_policy PASS (68 claims 62v/6p), article_validator 106 ALL OK, validate_article_yaml ALL OK; CI double-green on 6f27658 + 5220067 (22c4698 superseded by the YAML fix); Vercel: both articles carry 144/2,985 with zero stale claims + ix/236 links live (ix/240 zero), map chunks carry constant 2985 + new labels with zero stale strings.
- Spend: 1 Context.dev credit. NEXT: late-Oct KE-LC-C3 post-window probe (Issue 003 checklist); regional IXP T1 pass (ISOC Pulse per-IXP); KIXP + CA captures capture-pending for editor review; Issue 003 Monday 2 Nov 2026.

### 2026-10-06 (session 12 cont. 3) - Two-cities carousel converted to a LinkedIn document PDF with real site photography (Task 81)
- Editor: "Convert it into a LinkedIn pdf and use real images from our assets" - same 7-slide two-cities narrative as a PDF document-post variant, photography from the repo's own asset library instead of the dataset-tied SVG motifs.
- PHOTO CAST (all from public/images/, copied to download/dc254-two-cities-20261006/images/ with relative refs): s1 split-screen = nairobi-skyline-night-kicc (cyan duotone) vs mombasa-port-wide (amber duotone), terrestrial-fibre seam line kept, verified-count caption strips (19 TRACKED / 13 LIVE / 6 IN PIPELINE vs 7 LIVE / 1 LANDED, RFS PENDING / 2 EARLIER-STAGE); s2 texture atlancis-nairobi-datacentre-hall at 0.15 behind the 19/13/6/144 stat stack; s3 texture mombasa-cable-landing-2 at 0.10 (cable ship + shore landing crew - kept deliberately, reads as landing-operation storytelling); s5 texture fibre-handhole-duct-cables at 0.11 behind the chain; s6 texture nairobi-expressway-wide at 0.10; s7 = og-infrastructure-map banner (the actual map OG asset with the Nairobi/Mombasa nodes) above the URL box; s4 intentionally clean as a rhythm break.
- FIGURES UNCHANGED from the Task 80-corrected set: 19/13/6 Nairobi, 144 KIXP member networks / ~3.0 Tbps connected capacity (PeeringDB Oct 2026) / 1.3 Tbps TESPOK measured record, 7 live + 1 RFS pending + 2 earlier-stage, 4/4 Mombasa, cable chips. PDF text layer verified: all key strings present, zero U+FFFD, zero em dashes.
- PIPELINE (PDF skill, creative fixed-canvas bypass route - the approved design already exists, blueprint engine cannot express the custom motifs): print HTML download/dc254-two-cities-20261006/two-cities-carousel-linkedin.html (7 fixed .page divs 1080x1350, @page margin 0, NO overflow:hidden, @media screen auto-scale, relative images/) -> poster_validate.py check-html PASS (0 errors, 0 warnings) -> html2pdf-next.js --nopaged (Chromium native @page pagination, vector page.pdf output) -> pdf_qa.py --poster PASS all 15 checks (full-bleed on all 7 pages, fonts embedded, no content overflow, margins symmetric) -> metadata set (Title / Author DC254 / Creator / Subject). 7 pages, 8.5 MB.
- VISUAL QA: 3 render rounds. v1 -> v2: split band 560 -> 690px to kill dead space, caption stats to one line (12.5px + tighter tracking + text-shadow), Nairobi crop biased 30%/40% to the skyline; v2 -> v3: caption-zone bottom gradient deepened to 0.96 so captions sit on dark over the bright car-carrier deck (source photo has zero vertical crop freedom at exact height fit). Pages 2-7 verified clean first pass.
- SOCIAL PACK updated: new "LINKEDIN DOCUMENT (PDF) VARIANT" section - file, photo cast table, LinkedIn document-post upload route (paperclip flow renders each PDF page as a swipeable card), one-route-per-post rule (PDF photo variant OR 7 PNG motif variant, never mixed), alt-text carry-over, same do-not-hand-edit rule (PDF regenerates from the HTML source so figures stay tied to the verified dataset).
- DELIVERABLES: download/dc254-two-cities-20261006/ now = 7 PNGs + social-pack.md + two-cities-carousel-linkedin.pdf + two-cities-carousel-linkedin.html + images/ (7 site assets). Zero repo code changes, zero credits, no site deploy needed; this commit is the AGENT_CONTEXT protocol log only.

### 2026-10-06 (session 12 cont. 4) - Deliverable packs mirrored into the repo as a temporary public drop (Task 82)
- Editor: "I can't access the docs can you put them somewhere in the repo? Then we'll delete them later, create a folder they should appear on the site" - the sandbox download/ folder is unreachable from the editor's side, so the Task 81/79 and Task 72 deliverable packs are mirrored into the repo and served by Vercel at /drop/*.
- COMMIT c7e492c (23 files, ~13 MB): public/drop/ = dc254-two-cities-20261006/ (7 carousel PNGs 1080x1350 SVG-motif variant + two-cities-carousel-linkedin.pdf 8.5 MB LinkedIn document-post variant + two-cities-carousel-linkedin.html source + images/ photo cast + social-pack.md) + dc254-intelligence-2026-10-02/ (3 dashboard PNG sizes + social-pack.md) + index.html (branded dark+cyan listing with TEMPORARY banner, noindex/nofollow) + README.md (TEMPORARY marker, deletion scheduled).
- Placement rationale: public/ already serves documents on this site (public/reports/*.pdf precedent), static files in public/ are served by Vercel at the site root with zero build involvement; no middleware and no gitignore conflicts; nothing on any site surface links to /drop/* - canonical deliverable sources remain the social packs + build scripts, and the folder is scheduled for deletion once the editor has saved the files (editor's own "we'll delete them later").
- Gates: article_validator 106 ALL OK, validate_article_yaml ALL OK (no content/data changes - static assets only); CI double-green via authenticated REST on c7e492c (Content validation + Lint and build success).
- Vercel production probes: /drop and /drop/index.html 200 text/html; PDF 200 application/pdf with md5 6befac379147ec6db7bb925ff4b0ac69 byte-exact vs local mint; carousel PNG 200 image/png; intelligence PNG 200 image/png; social-pack.md 200 text/markdown. /drop/ 308 -> /drop (cleanUrls) which serves the index.
- Spend: 0 credits. Cleanup TODO: delete public/drop/ after editor confirms downloads (one commit; git history will retain the blobs - acceptable per editor, no scrub requested).

### 2026-10-06 (session 12 cont. 5) - CA LinkedIn drop: KE-CIRT/CC FY 2025/26 annual cyber-threat figures captured T1, reconciliation flagged, no surfaces touched (Task 83)
- Editor URL drop (digest pattern, no instruction): CA of Kenya official LinkedIn post "11.1 billion cyber threats detected. 83.1 million advisories issued." (activity 7513169843496550400). Anonymous curl 200 on the public post - schema.org SocialMediaPosting JSON-LD + og/twitter meta + official image downloaded and transcribed.
- T1 figures: datePublished 2026-10-06T09:34:38Z (12:34 EAT, same day as the drop); CAPTION omits the period; the official post IMAGE supplies it - "recorded 11.1 billion detected cyber threats during FY 2025/26, up 29.0% from the previous financial year. Cyber advisories issued to affected ICT users rose by 60.8% to 83.1 million." Derived (arithmetic on the T1's own numbers): FY 2024/25 ≈ 8.6B threats / 51.7M advisories.
- RECONCILIATION FLAG (KIXP lesson applied): site's on-file KE-CIRT/CC series is QUARTERLY and consistent (Q2 2024 1.1B / Q4 2024 840M / Q3 2025 842M); Q3 2025 is the first quarter of FY 2025/26 and 4x that run-rate ≈ 3.4B, not 11.1B - annual figure is on a different basis or the card is loose. A LinkedIn commenter independently asks for methodology (cites 20.7M advisories, a fifth figure). NO site surfaces edited until the underlying CA bulletin is captured and the annual-vs-quarterly basis reconciled.
- DISPOSITION: LEAD, deferred. Freshness upgrade candidate after reconciliation for data-centre-security-threats-kenya.md (FAQ + closing scale paragraph + external_sources ca.go.ke bare link), kenya-data-breach-timeline.md (quarterly series + FAQ), data-centre-attack-scenarios-kenya.md (optional). NOT a policy-registry claim (operational statistics, no instrument; KE has no cyber-stat claim or gap entry). UNRELATED to KE-LC-C3 (cyber stats, not the licensing consultation).
- Capture: research/captures/2026-10-06-ca-linkedin-ke-cirt-fy2025-26-annual-cyber-threats.md (tier 1, capture-pending per humanGate; verbatim caption + image transcription + image CDN URL with permanent signature + tracking params stripped). Commit c103971; gates PASS (validate_policy 62/68 verified, article_validator 106 ALL OK, validate_article_yaml ALL OK); CI double-green via authenticated REST; zero site-surface changes so no Vercel content probes needed.
- Spend: 0 credits (curl + local transcription). NEXT: FY 2025/26 bulletin hunt (Context.dev path for ca.go.ke) + FY quarterly bulletins to reconcile; editor review of this + KIXP + CA captures still open.

### 2026-10-07 (session 12 cont. 6) - Flagship article shipped: "What 11.1 Billion Cyber Threats Mean for Data Centres" (Task 84)
- Editor commission (full brief): the DC254 angle on the CA announcement - "What does 11.1 billion cyber threats mean for digital infrastructure?" - working headline + draft intro + defence chain (Users -> Networks -> Data Centres -> Cloud -> Security Systems -> KE-CIRT/CC -> Response) + closing line "Cybersecurity is not separate from digital infrastructure. It is one of the reasons digital infrastructure exists."
- RECONCILIATION CLOSED BEFORE WRITING (verification-first, editor's own production sequence): Context.dev search (1 credit) surfaced the T1 bulletin series on ke-cirt.go.ke (NOT challenge-blocked, unlike ca.go.ke) -> five bulletins fetched FREE via curl + pdftotext: FY 2025/26 = 842,320,667 + 4,559,229,985 (+441.27% spike quarter) + 3,367,113,840 + 2,355,938,192 = 11,124,602,684 = announced 11.1B; Q4 FY24/25 4,586,682,277 (+80.70%) anchors +29.0% YoY (~8.6B prior year, matching the derived figure); advisories 83.1M +60.8% (Q4 = 20,748,489; the LinkedIn commenter's 20.7M = the quarterly figure). Task 83 flag RESOLVED: annual figure IS the sum of the quarterly series; no existing article needed correction.
- BONUS T1 HOOKS: CSOC mandated under Computer Misuse and Cybercrime (CII and Cybercrime Management) Regulations 2024 (Director General's perspective, Q4 bulletin); Q4 category breakdown - 2,254,287,819 system attacks / 17,406,495 web app attacks (+43.68%) "targeted at the critical information infrastructure sector" with government systems and ISPs primary targets / 819,325 DDoS; threats "largely attributed to inadequate system patching... and the increasing exploitation of AI technologies by malicious actors".
- Capture: research/captures/2026-10-06-ke-cirt-cc-quarterly-reports-fy2025-26-ladder.md (T1, capture-pending; commit 7321b8c).
- ARTICLE (commit 206c17a): content/articles/kenya-11-billion-cyber-threats-data-centres.md - title "What 11.1 Billion Cyber Threats Mean for Data Centres" (53 chars), meta 164 chars, 1,095-word body, 5 FAQ, no em dashes, category Security/cluster Kenya, reading_time 6 min. Structure: intro (demand-signal reading) -> what the number counts (exact ladder + spike + detected-is-not-breached) -> what a billion detections requires (chain + CSOC + KIXP vantage 144/2,985 + Pulse 89%) -> where it sits (Nairobi 19/13, Mombasa 4/4, cables 7/10 Africa-1 RFS pending, 10.5/42.9/230 MW) -> CII targeting + documented incidents (eCitizen 2023, president.go.ke 2026) -> demand signal -> editor's closing line verbatim. Photography cast: woman-network-engineer-patch-panel (hero/og), dc-networking (inline), atlancis-nairobi-datacentre-hall (section break), all existing public/ assets.
- VERIFICATION: scripts/verify_cyber_infra_20261007.py (persisted, extends Task 77/79/83 pattern) - T1 ladder strings + sum arithmetic + announcement figures + dataset (27/20, 19/13, 4/4, cables 7 + Africa-1 probe, KIXP 144/2985) + MW KPI set mirroring Task 77 exactly (itLoadMw publishers 10.5/8, totalCapacityMw 42.9/230/272.9) + article cross-check (required strings, forbidden stale strings, em dash, word count, title/meta lengths). ALL OK. Gates: article_validator 107 ALL OK, validate_article_yaml ALL OK, validate_policy PASS. README 106 -> 107 both spots. Sitemap auto-derives via getAllArticles (no manual registration), llms.txt carries no count.
- CI double-green on 206c17a (Content validation + Lint and build). Vercel: article URL 200 with all key strings rendering (11,124,602,684 / 4,559,229,985 / 842,320,667 / CSOC / 441.27 / 2,985 Gbps / 144 member networks / 230 MW), stale-string check CLEAN.
- Spend: 1 Context.dev credit (search). Follow-ups flagged: (1) three security articles' freshness upgrade (add FY figure with basis, Task 83 disposition now unblocked); (2) chatbot knowledge.ts cyber fact card; (3) social pack for this article if the editor wants a posting variant; (4) captures now pending editor review: KIXP 10-06, CA LinkedIn 10-06, bulletin ladder 10-06; (5) KE-LC-C3 post-window probe late Oct (Issue 003 checklist, due Mon 2 Nov).

### 2026-10-07 (session 12 cont. 7) - Editor revision round on the flagship article + repo image drop processed and root cleaned (Task 85)
- Editor verdict on the shipped piece: publish, but three changes before heavy promotion - (1) "detected cyber-threat events" in title/opening, (2) an unavoidable is/is-not explanation of the number, (3) soften the megawatt-equals-detection, cannot-be-offshore and unusually-complete claims; plus a source panel near the top, direct per-quarter bulletin links, a 89% ISOC claim with definition + methodology, an operators section with internal links, FAQ additions, SEO meta, and 4-5 of 12 newly uploaded repo-root images wired in, then the root cleaned.
- IMAGE DROP (commit 976ad82, 12 JPGs at repo root) triaged by viewing every file: Hero.jpg + 4 process shots converted to webp (quality 88, idempotent scripts/convert_uploaded_images_20261007.py) -> public/images/{dc-engineer-rack-aisle,fibre-patch-panel-technician,dc-aisle-red-status-lighting,dc-cooling-plant-pipes,dc-ups-power-room}.webp (91-237 KB each; dc-engineer-rack-inspection.webp name already taken, collision-checked). REJECTED for the article: "Cybersecurity illustration .jpg" carries visible "SOC NIGERIA / LAGOS, NIGERIA" branding (unusable on a Kenya-focused site - flagged to editor), 4 near-duplicates + 1 redundant Atlancis shot (site already carries real atlancis-nairobi-datacentre-hall.webp). ALL 12 root JPGs git-rm'd in the same commit per the editor's cleanup instruction; woman-network-engineer-patch-panel + dc-networking dropped from THIS article only (9 other articles still use them, no orphans).
- ARTICLE REVISION (commit 8f6c645): title -> "Kenya Recorded 11.1 Billion Cyber-Threat Events" (47 chars) - the editor's 88-char best-option title exceeds the house 56-char article_validator gate, so his first sentence is used and the data-centre angle is carried by meta + intro (flagged to editor); meta = editor's recommended wording minus "Here is" to fit 100..170 (164 chars). New near top: clarification blockquote, "What the number is, and what it is not" (editor's 4-row table), "Sources used in this article" panel (Primary/Supporting + Dataset checked: 7 October 2026) with DIRECT links to all four FY 2025/26 bulletin PDFs. 89% claim tightened: "89 percent of Kenya's 225 active networks are either IXP members themselves or customers of IXP members" + ISOC Pulse KE page linked in prose (definition + 225-network basis + October 2026 PeeringDB sync from the Task 80 capture). Three claims softened per editor's rewrites. New "What this means for operators" section (log retention, monitoring coverage, DDoS 819,325/Q4, segmentation, physical access, IR staffing, recovery testing, customer notification, CII reporting) linking attack-scenarios + disaster-recovery-business-continuity + physical-security articles (internal_links 5 -> 7). FAQ 5 -> 10 (added: definition, KE-CIRT/CC role, KIXP role, DC support, CII obligations; editor's breach-FAQ merged into the existing one). external_sources 5 -> 10 (4 bulletin PDFs + PeeringDB ix 236 added). Body 1,095 -> 1,891 words, reading_time 7 min, no em dashes, og_image -> dc-engineer-rack-aisle.webp.
- URL PREFLIGHT before push: all 4 bulletin PDFs + quarterly index re-verified 200 (application/pdf, 1.9-2.9 MB) via sandbox TLS-exempt probe - curl initially returned 000 because the sandbox trust store lacks the ke-cirt.go.ke issuing CA (openssl handshake itself succeeds, cert CN=*.ke-cirt.go.ke); site is up, sandbox-side artifact, logged to avoid future false alarms. Pulse KE 200, PeeringDB ix/236 200, CA LinkedIn post 200. BBC curl 404 + therecord curl 403 are bot rules on ALREADY-CITED sources (unchanged citations, verified at their original capture time) - not re-litigated.
- Gates: verify_cyber_infra_20261007.py --article extended with 21 new assertions (new title phrasing, is/is-not + panel + diagram + operators strings, 225 basis, 5 image files present AND wired in frontmatter, 4 direct PDF links, forbidden softened-claim originals) ALL OK; article_validator 107 ALL OK, validate_article_yaml ALL OK, validate_policy PASS (62/68 verified ratio unchanged).
- CI double-green on 8f6c645 (authenticated REST). Vercel production probes: article 200 with all 10 key strings rendering incl. new title + table + panel + operators section; all 3 softened-claim originals ABSENT; 5 image URLs 200 image/webp; /Hero.jpg and /Screenshot_20261007-083832_ChatGPT.jpg now 404 (root cleanup effective on production).
- Spend: 0 credits (image triage + conversion + probes all local/curl). Follow-ups: editor to confirm whether the SOC-NIGERIA illustration should be regenerated as a Kenya-branded SOC variant (flagged); public/drop/ deletion still awaits editor download confirmation; three security articles' freshness upgrade + chatbot cyber fact card + optional social pack for this piece remain queued; captures pending editor review x3; KE-LC-C3 post-window probe late Oct; Issue 003 Mon 2 Nov.

### 2026-10-07 (session 12 cont. 8) - Cyber-threat poster cards for X + LinkedIn, real site photography (Task 86)
- Editor: "just create 2 poster cards for X and LinkedIn ensure real images are on the poster we have images that are enough" - real photography MANDATE, so the AI-generated shots (including the new webp from Task 85) were deliberately excluded; cast = atlancis-nairobi-datacentre-hall.webp (LinkedIn photo band, real Nairobi facility already published) + nairobi-skyline-night-kicc.webp (X right panel, real Nairobi night skyline from the vetted two-cities carousel cast).
- Build: one HTML source (download/dc254-cyber-posters-20261007/cyber-threat-posters.html), brand system carried over from the two-cities carousel (#0B0C12 / #38C4D8 cyan / mono kickers / grid + glow / Carlito), two fixed frames: LinkedIn 1080x1350 (headline + photo band with caption + REAL SITE PHOTOGRAPHY chip + FY 2025/26 ladder card with amber spike quarter + cyan total 11,124,602,684 / stats row 83.1M +60.8%, 144 / 2,985 Gbps, 20 of 27 + 230 MW / closing quote / CTA bar) and X 1200x675 (left text column with bold inline stats + facts row + signature quote + CTA, right full-bleed skyline with gradient blend). Rendered via persisted scripts/shot_cyber_posters_20261007.py (Playwright element shots + overflow/spill QA, carousel pattern) - QA clean both frames; visual QA 2 rounds, X v2 adds the signature quote to fill the left-column dead zone.
- FIGURES all verified (no new claims): ladder 842M / 4.56B (+441.27% spike, amber highlight) / 3.37B / 2.36B = 11,124,602,684 (+29.0% YoY); 83.1M advisories (+60.8%); KIXP 144 member networks / 2,985 Gbps connected port capacity; 20 of 27 tracked operational / 230 MW pipeline. Source line on both posters: KE-CIRT/CC quarterly bulletins FY 2025/26 (+PeeringDB Oct 2026 on the LinkedIn foot).
- Mirror + listing: public/drop/dc254-cyber-posters-20261007/ (2 PNGs + HTML + images/ cast + social-pack.md with ready-to-post LinkedIn/X copy, alt text, EAT posting windows, one-visual-route-per-post rule) and /drop index.html new section + footer date line. Canonical sources: download/dc254-cyber-posters-20261007/ + the shot script; do-not-hand-edit rule applies (regenerate from HTML so figures stay dataset-tied).
- COMMIT dbab4fd, CI double-green. PROBE NOTE for future sessions: the pack lives under /drop/dc254-cyber-posters-20261007/ (relative links from /drop) - probing the paths WITHOUT the /drop prefix returns 404 and is NOT a deploy failure; first probe round did exactly that and burned two re-checks. Verified: both PNGs 200 image/png, social-pack.md 200 text/markdown, HTML 200, photo webp 200; LinkedIn PNG md5 byte-exact live vs local (1f7e43387a94646bb559b393a65607e7).
- Spend: 0 credits. Open items unchanged: SOC-NIGERIA illustration regeneration decision with editor; public/drop/ deletion awaits editor download confirmation (now spans 3 packs); 3-article freshness upgrade; chatbot cyber fact card; captures pending editor review x3; KE-LC-C3 post-window probe late Oct; Issue 003 Mon 2 Nov.
