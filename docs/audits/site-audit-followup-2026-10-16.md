# DC254 — Site Audit Follow-Up (Verification Run)

Date: 2026-10-16 | Auditor: Super Z (delta audit, 1 day after the baseline)
Baseline: `systems-audit-2026-10-15.md` (overall 7.3/10, 20 findings D01–X03)
Subject: https://data-centers-254.vercel.app · github.com/kjonathan254/Data-Centers-254 @ `f3aafe8` (origin/main, production-verified)

Method today: full `git fetch` + local sync to origin/main (the sandbox clone was 3 commits stale — first probe wrongly suggested the Jibu fix was missing; fetch disproved it), Vercel REST (deployments + env var names only), Upstash REST direct probe (PING/DBSIZE/KEYS), Sentry API (de.sentry.io region, issues + latest event), production chat API probe with the flagship question, 16-route status sweep, local `npm test`, dataset scan of `src/data/directory/current.json`, CI check-runs via the repo's `scripts/check_ci.py`. Everything below is verified unless labeled otherwise.

---

## A. What changed since yesterday's audit

Three commits shipped to production (all READY on Vercel, all 7/7 CI check-runs green):

| Commit | What it did |
|---|---|
| `d3917a4` | Session Replay sampling dropped to 10% for production after verified end-to-end |
| `5061aba` | Sentry gen_ai agent tracing + conversations for Jibu |
| `f3aafe8` | Jibu capacity honesty — biggest/compare rank live IT load vs designed capacity separately; no more "null MW" |

**Flagship regression check (production, live):** `POST /api/chat` "Which is the largest data centre?" now returns — *"By verified live IT load, iXAfrica NBOX1 leads the market at 4.5 MW, followed by iColo Mombasa Two (MBA2) at 1.75 MW… Africa Data Centres Nairobi 1 (NBO1) lists a designed capacity of 7.5 MW, but its live IT load isn't published, so it can't be ranked on verified load."* No `null MW` leak. The capacity-honesty contract holds in production.

---

## B. Yesterday's findings — disposition today

| ID | Was | Status today | Evidence |
|----|-----|--------------|----------|
| D01 | **Critical** — monetization data on ephemeral memory if Upstash unset | **RESOLVED** (the audit's #1 open question) | `/api/health`: `rateLimiting: "persistent"`, `redis.reachable: true` (231–252 ms). `UPSTASH_REDIS_REST_URL/TOKEN` set on all Vercel targets. Direct Upstash PING → PONG. |
| D02 | High — privacy claims undeliverable in memory mode | **Downgraded to Low** (was a corollary of D01) | Durable store now backs the retention claims; 60-day purge mechanics still worth a mechanical test later. |
| O01 | High — evidence-drift monitor paused | **OPEN** (deadline in 7 days) | `evidence-monitor.yml` schedule still commented; "Firecrawl credits exhausted 2026-09-23", refill due **2026-10-23**. |
| O02 | High — tests not wired into CI | **CLOSED** | `ci.yml:51` runs `npm test`; suite grew 13 → **72 tests / 7 files** (incl. 11 chatbot-intent honesty pins, chatbot tracing, subscribe e2e); all 72 pass locally (1.34 s). |
| O03 | High — no error tracking / no uptime monitor | **HALF CLOSED** | Sentry fully deployed (client+server+edge, Session Replay 10%, gen_ai tracing, `SENTRY_AUTH_TOKEN`-gated sourcemaps) and already caught a real error (see N02). **External uptime monitor still absent** — nothing known to ping `/api/health`. |
| S01 | High — spoofable XFF rate-limit keys | **CLOSED** | `rate-limit.ts` now prefers `x-real-ip` (Vercel-controlled) with documented rightmost-XFF rationale. |
| S02 | Med — CSP `script-src 'unsafe-inline'` | OPEN (accepted compromise) | Live header unchanged; per-route nonce plan stands for the next middleware touch. |
| S03 | Low — hand-rolled Svix HMAC | OPEN | Unchanged. |
| S04 | Med — GitHub PAT in local `.git/config` | OPEN | Remote URL still embeds the token (convenience push remote; rotation cadence installed). |
| S05 | Low — Google Maps key in history | OPEN (documented acceptance) | Unchanged. |
| D03 | Med — consent withdrawal hostile | **OPEN** | No "privacy settings" reset control found in components; still requires clearing browser storage. |
| C01 | High — vercel.app subdomain | **OPEN — priority raised** | Still on vercel.app. Now also **blocks the email fix** (N01): `onboarding@resend.dev` can only send to the account owner, so a verified sending domain is a prerequisite for a working newsletter. |
| B01 | **Critical** — zero paid-product surface | **PARTIALLY CLOSED** | `/opportunity-brief` is live (200, ~106 KB): positioning page + interest form; store is **Upstash-only by design (no memory fallback — good)**. Still no pricing/checkout. |
| B02 | Med — Launch List not offered | OPEN | Follows B01. |
| P01 | Low — 243 KB homepage | OPEN (unchanged) | 243,735 B raw today. |
| A01 | Med — visual accessibility unverified | OPEN | Not re-run; static signals remain good. |
| X01 | Low — title-like strings in homepage | OPEN (benign) | Unchanged. |
| X02 | Low — scripts/ sprawl | OPEN | Unchanged. |
| X03 | Low — `.env.example` sponsor comment wrong | **CLOSED** | Comment now reads "With nothing set the endpoint is same-origin only, which is the recommended default." — matches code. |

Scoreboard: **5 closed, 1 partially closed, 1 downgraded, 13 open** (of 20).

---

## C. New findings (today)

| ID | Severity | Finding | Evidence | Fix |
|----|----------|---------|----------|-----|
| **N01** | **High** — the growth engine is down | `RESEND_FROM_EMAIL` is **missing from Vercel env**. The subscribe route **fails closed**: `sendConfirmationEmail` returns `config-missing`, so no verification email is ever sent and the double-opt-in funnel cannot complete. The health endpoint self-reports it: `emailStack: {configured: false, resendApiKey: true, resendFromEmail: false, subscribeSecret: true}`. | Vercel env name list (no `RESEND_FROM_EMAIL`); `src/app/api/subscribe/route.ts:120-127`; live `/api/health`. | Add `RESEND_FROM_EMAIL` to Vercel env — but this **requires a verified sending domain in Resend**, which effectively requires C01 (custom domain). Sequence: domain → Resend domain + SPF/DKIM → set the var → redeploy → test one real signup. |
| **N02** | Medium | First real Sentry catch (also proof O03 works): **React Hydration Error** on `/articles/data-centre-careers-kenya` — "the server rendered HTML didn't match the client". 1 event, 1 user, Samsung Internet 30 / Android 10, release `f3aafe8`. | Sentry issue 154090917 (org `datacentre254`), latest event metadata. | Reproduce on that article (mobile UA); usual suspects: locale/timezone-dependent date rendering or invalid HTML nesting in the article template. Small fix, high dignity value with a paying prospect. |
| **N03** | Low | Dead Vercel env vars: `DATABASE_URL`, `DIRECT_URL`, `TYPESAFE_API_KEY`, `NEXT_PUBLIC_DC254_STACK_PROJECT_ID` — zero references in `src/`. `KV_REST_API_*`/`REDIS_URL` are also unread (code reads `UPSTASH_REDIS_REST_*`). | Env name list + repo-wide grep (0 hits). | Delete the scaffold leftovers; keep or delete the KV aliases deliberately (they confuse the next operator). |
| **N04** | Medium (product) | Capacity coverage gap: **13 of 31 facilities disclose no capacity at all — 12 of them "Operational"** (Safaricom Thika, Safaricom Red Hill, Telkom Milimani, Telkom Telephone House ×2, iColo NBO1, Konza NDC, SEACOM CLS, SimbaNET, Uganda NDC1, Raxio Nairobi, SME Facility). 23/31 lack live IT load. Jibu now says "capacity not disclosed" honestly; the directory rows still show gaps. Freshness is excellent: 30/31 records verified 2026-10. | Dataset scan (`scripts/audit_data_quality.py`). | Per-record research sprint (operator annual reports, press releases, PeeringDB); this is also exactly the raw material for the Power Readiness Tracker idea from the Morning Brief. |
| **N05** | Info | Upstash currently holds **zero durable keys** (DBSIZE 7 → 0 moments later = TTL'd rate-limit buckets only). No subscribers, no export-interest leads, no brief-interest records stored yet. Consistent with N01 — nothing has been collected, so nothing was lost. | Direct `DBSIZE` + `KEYS *` probe. | None. Re-check after N01 is fixed. |

---

## D. Yesterday's unknowns — answered today

| Yesterday's question | Answer |
|---|---|
| G1: Is Upstash actually configured in production? | **Yes** — persistent mode, reachable, ~230 ms. D01 collapses to a footnote exactly as predicted. |
| G3: Which identity sends The Rack Report? | **None can, right now** — `RESEND_FROM_EMAIL` unset; contact falls back to `onboarding@resend.dev`. See N01. |
| "No uptime/error monitoring" (O03) | Error monitoring: **now real and validated by a first catch**. Uptime: still nothing external pings `/api/health`. |
| Health endpoint opacity (`{"ok":true,"service":"jibu","full":false}` yesterday) | Health now self-diagnoses email stack, rate-limiting mode, and Redis reachability — D01-class questions are answerable with one curl forever. Nice upgrade. |

---

## E. Updated scores

| Section | Was | Now | Why |
|---|-----|-----|-----|
| Architecture & code | 8.5 | **8.5** | Unchanged; test suite 5.5× bigger. |
| Security | 8.0 | **8.5** | S01 closed; `unsafe-inline` remains. |
| Data | 6.0 | **8.0** | D01 resolved (durable backend live); N04 capacity gaps keep it from 9. |
| Performance | 8.0 | 8.0 | Unchanged. |
| PWA & offline | 8.5 | 8.5 | Unchanged. |
| UX & accessibility | 6.5 | 6.5 | D03 open; N02 hydration on one article. |
| Content & SEO | 9.0 | 9.0 | Sitemap 188 → 190 URLs; freshness current-month. |
| AI features | 8.5 | **9.5** | Capacity honesty verified in prod, 11 intent pins, gen_ai tracing, scrub guard on both paths. |
| Deployment & ops | 6.5 | **8.0** | O02 + error-tracking closed; O01 monitor still paused, no uptime ping. |
| Business & growth | 5.5 | **6.0** | B01 first slice live; **but N01 means the newsletter funnel — the actual growth engine — is down**; no payment path yet. |
| **OVERALL** | **7.3** | **8.0** | All three "stop the bleeding" engineering risks from yesterday (D01/O02/O03) are gone in one day. The remaining risk has moved from infrastructure to **revenue plumbing**. |

---

## F. Updated top-5 risks (next 30 days)

1. **The newsletter cannot accept subscribers (N01).** Every day on vercel.app without a verified sending domain, The Rack Report — the product the playbook says to sell first — cannot onboard anyone. Fix order: domain → Resend domain → env var → test signup.
2. **Evidence-drift monitor still paused (O01)** with the refill deadline 2026-10-23. Calendar it now; uncommenting two lines is staged and ready.
3. **A paying prospect hits the hydration error (N02)** on a careers article from a Samsung phone. Small, but it's exactly the class of bug Sentry exists for — fix it while the trail is warm.
4. **Interest capture with no transaction (B01 remainder).** /opportunity-brief collects interest (into a durable store now) but there is no price, sample, or payment link — the "sell first, build later" rule is still waiting for its page.
5. **No external uptime ping (O03 remainder).** Sentry sees client+server errors, but a full-region outage or a dead cron would go unnoticed. UptimeRobot on `/api/health` is 10 minutes.

---

## G. Quick wins (updated, each < 1 hour)

1. **Register/attach the custom domain, then add Resend sending domain + `RESEND_FROM_EMAIL`** (45–60 min total) — kills C01 *and* N01 in one move. Highest-leverage hour available.
2. **Calendar 2026-10-23: Firecrawl refill + re-enable evidence-monitor schedule** (5 min).
3. **Fix the careers-article hydration error** (30–60 min with the Sentry event as the guide).
4. **UptimeRobot free monitor on `/api/health`** (10 min).
5. **"Privacy settings" footer link** that clears `dc_consent` and re-shows the banner (20 min) — D03.
6. **Delete dead Vercel env vars** (5 min) — N03.
7. **Per-record capacity research for the 12 Operational no-capacity facilities** (the only "slow" win — but it converts directly into both directory quality and the Power Readiness Tracker product).

---

## H. Still not auditable from here

Visual accessibility (needs a rendered axe/Lighthouse pass), email deliverability specifics (inside Resend), field CWV (needs CrUX/RUM access), Vercel usage vs Hobby limits, ODPC registration status, GitHub branch-protection rules, Resend dashboard state (contacts, bounces). The Vercel env question from yesterday is closed — names are readable via API; **values never were and never should be**.

---

*Verification artifacts: git fetch (c926c55 → f3aafe8) + `npm test` 72/72; Vercel `/v6/deployments` (3 × READY, shas matched) and `/v9/.../env` (names only); Sentry API issues query + event 154090917 latest; live chat probe (flagship answer quoted); Upstash PING/DBSIZE/KEYS; 16-route status sweep (all 200/308-correct); dataset scan via `scripts/audit_data_quality.py`; CI check-runs 7/7 via `scripts/check_ci.py f3aafe8`; live header set (CSP/HSTS/permissions-policy unchanged from baseline); sitemap 190 `<loc>`; `.env.example` X03 re-read; rate-limit.ts and subscribe/route.ts code reads.*
