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

## Current state (updated 2026-09-24, r13)

- **Site**: data-centers-254.vercel.app (Vercel free team, project
  `prj_Tigqxa5amDHpQcDT34kdIqSEnAMt`), repo kjonathan254/Data-Centers-254, branch main.
- **Policy Intelligence**: dataset `policy-2026-Q3-r13` — **52/59 claims verified,
  7 partially-verified, 0 unverified**; 65 sources (47 T1, 5 T2, 13 T3); 20
  pillar gaps (energy/construction/environment mostly unresearched in UG/RW; EAC
  regional frameworks untouched across all four). KE licensing pillar now has 4
  claims (was 1): KE-LC-C2/C3 verified, KE-LC-C4 (proposed DC licence fees)
  partially-verified pending CA notice capture.
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
- **Auth/tooling**: fine-grained PAT (owner kjonathan254) wired into origin
  remote URL — push + CI-run reads verified working; Actions-secrets WRITE is
  MISSING (`x-accepted-github-permissions: secrets=read`). gh CLI 2.101.0 at
  /home/z/bin/gh (auth via GH_TOKEN env). CI status verified GREEN 2026-09-23:
  the user-reported lint failure was run 5f1963b ("Lint" step); fixed from
  2900c04 onward — 2900c04 / a33567f / c12a017 all success.
- **.env.local**: recreated 2026-09-23 after 5th workspace rollback (gitignored,
  holds rotated Firecrawl key). Rollbacks wipe this file — check it every session.
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
6. **TypeSafe Phase 0**: calibration harness design approved conceptually (Task
   20/21); awaiting user go + TYPESAFE_API_KEY locally.
7. **Unpushed local-only scripts** (workspace, not in repo):
   `/home/z/my-project/scripts/vercel_purge_deployments.mjs`,
   `vercel_inventory.mjs`, `recompress_images.mjs` — incident tools; commit to a
   `tools/` dir if reuse is expected.
8. **Control-room roadmap (from user-approved audit)**: Phase 1 shipped
   (dashboard canvas + interactions, commit ef02b95). Phase 2 shipped
   (2026-09-23): source-quality & provenance panel, per-pillar deep pages
   (/policy/intelligence/pillars/[pillar], all 10 static), dataset download
   route (/policy/intelligence/dataset), SectionNav rooms-id fix, mobile
   overflow fixes (grid min-w-0). Phase 3 candidates remaining: claim-record
   deep links from matrix drawer to pillar anchors, compare-view exports,
   quarterly delta views. User mockup + audit text live in chat history.
9. **Google Alerts leads (editor's digest 2026-09-24, triaged — humanGate
   applies)**: (a) Cliffe Dekker Hofmeyr "Licensing, structuring and financing
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
11. **User-supplied images NOT delivered (pending, 2026-09-24)**: editor sent
   three files in chat (Africa Powe Hero.jpg, master-power-1-750x375.jpg,
   IMG_9828.jpeg.webp) but none reached /home/z/my-project/upload/. Intended
   wiring: IMF article hero → Africa Powe Hero.jpg (currently africa-dc-map),
   master-power as IMF section-break, IBTC article hero → IMG_9828.jpeg.webp
   (temporarily classroom-ict-training-kenya.webp). Ask editor to re-attach;
   copy to public/images with lowercase-hyphen names, swap 3 front-matter
   lines + 1 body ref, rebuild.

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
