# Security Hardening Runbook — 2026-11-05 audit

Source: full 6-phase security audit (Cloudflare security-audit-skill methodology), run
`dc254-audit-20261105-run1`, source ref `7155fae`. Report pack:
`download/dc254-security-audit/` (REPORT.md, FINDINGS-DETAIL.md, NEEDS-VALIDATION.md,
findings.json, coverage-ledger.json). 13 findings: 5 confirmed, 8 needs-validation.

## Applied in this commit (verified source fixes)

| # | Finding | Change |
|---|---|---|
| 1 | CONFIRMED low — /api/health serves operator diagnostics anonymously | `src/app/api/health/route.ts`: detailed payload now gated behind `HEALTH_TOKEN` (constant-time compare, fail-closed, Authorization-header only); anonymous callers get `{ok:true, service:'dc254'}`. `scripts/uptime_probe.py`: liveness-only when `HEALTH_TOKEN` absent on the runner, full invariants when present. |
| 2 | CONFIRMED low — Sentry tunnel unthrottled | `src/app/monitoring/route.ts`: per-IP `sentry-tunnel` bucket (20/min) + content-length precheck before buffering. |
| 3 | CONFIRMED medium — export-interest PII retained forever, undisclosed | `src/lib/newsletter-store.ts`: Lua write now sets a 180-day EXPIRE; new `deleteExportInterest()` erasure helper (idempotent, counter-consistent). `src/app/privacy/page.tsx`: capture disclosed in §2 and §4, retention in §6. |
| 4 | CONFIRMED low — push token in git argv + shell history | `scripts/auto_checkpoint.sh`: push now uses a one-shot credential helper (env-only); usage doc no longer shows the env-prefixed invocation. |
| 5 | CONFIRMED low — workspace snapshot in public history | `scripts/hooks/pre-commit`: blocks `skills/`, `db/`, `.zscripts/`, internal strategy docs from future commits + warns on secret-shaped filenames. History rewrite deliberately NOT done (no secrets/PII found — owner decision, see below). |
| 6 | LEAD — /articles/[slug] fs join without containment | `src/app/articles/[slug]/page.tsx`: `export const dynamicParams = false` (matches both sibling dynamic routes). `src/lib/articles.ts`: slug charset guard `^[a-z0-9-]+$` before the fs join. Safe regardless of the pending Next.js decoding question. |
| 7 | LEAD — ci.yml default GITHUB_TOKEN scope | `.github/workflows/ci.yml`: `permissions: contents: read` (matches the other six workflows). |
| 8 | LEAD — Resend audience contact survives erasure (3 paths) | `src/app/api/resend/webhook/route.ts` + `src/app/api/subscribe/unsubscribe/route.ts`: `removeContactFromAudience()` now called on every erasure path, unconditionally (documented idempotent). |
| 9 | LEAD — privacy wording vs mechanism | `src/app/privacy/page.tsx` §5: consent-withdrawal wording now matches actual behavior (next page load; Sentry replay stops immediately). |

## Owner actions required

1. **Rotate `DC254_PUSH_TOKEN`** (it may sit in `~/.bash_history`). Generate a new
   fine-grained token (contents: read+write on this repo only), then
   `git config credential.helper ''` locally and store it via `git credential approve`
   or a 0600 file you source — never on the command line.
2. **Create `HEALTH_TOKEN`** (random ≥32 chars): add it as a Vercel environment
   variable AND a GitHub Actions secret named `HEALTH_TOKEN`. Until the Actions secret
   exists, the uptime monitor runs liveness-only (it prints a notice per run).
3. **Install the pre-commit hook** in your main clone:
   `git config core.hooksPath scripts/hooks`
4. **Decide on the git-history snapshot** (commit `679f4b3`): verified no secrets, no
   PII (schema-only DB, placeholder docs). Options: (a) accept as-is — current default;
   (b) if the outreach/strategy docs are commercially sensitive, rewrite with
   `git filter-repo` and force-push, treating old clones as leaked.
5. **Verify the Sentry region claim** (`/privacy` §2/§4 say "hosted in the EU";
   `.env.example` templates a US-region DSN): check sentry.io → org `datacentre254` →
   project `data-centers-254` → Client Keys. Migrate the project to `eu` or correct the
   policy text — keep claim and config in lockstep.
6. **Probe the rate-limit header trust** (one curl session, zero LLM/TTS spend):
   baseline `curl -sD - -o /dev/null https://data-centers-254.vercel.app/api/chat/health`
   → note `x-ratelimit-remaining`; repeat with `-H 'X-Real-IP: 203.0.113.7'` and with a
   forged single-entry `X-Forwarded-For`. If the counter resets per forged header,
   apply the clientIp fix in `src/lib/rate-limit.ts:174-186` (rightmost-XFF-only).
7. **Residual leads** (full plans in NEEDS-VALIDATION.md): Upstash probe caching on
   /api/health, /ingest matcher extension, consent SDK-level stop, CI repo default
   permissions check, action SHA pinning (priority: repo-watch GH_PAT first).
8. **Restore global rate-limit enforcement** (found in post-deploy verification, 2026-11-05):
   production is running the fail-open memory fallback. Evidence: 30 concurrent POSTs to
   /monitoring (limit 20/min) and 70 concurrent /api/search GETs (limit 60/min) produced zero
   429s; a follow-up request reported `x-ratelimit-remaining: 40` — its instance had counted
   only ~20 of the 71 requests. Check Vercel runtime logs for
   `[rate-limit] MEMORY MODE active (…)` for the exact reason, then verify
   `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` in Vercel → **Production** scope
   (prime suspect: the token rotation was not mirrored into the Vercel env — see
   `docs/runbooks/upstash-token-rotation.md`). After redeploy, re-run the 70-request burst:
   expect 429s from #61 and `x-ratelimit-remaining: 0`.

## Verification

- Local: `python3 scripts/article_validator.py`, `python3 scripts/validate_dataset.py`,
  `bash -n` on changed shell scripts — run before push where node_modules is absent.
- CI (`npm run lint`, `npm test`, `npm run build`, `npm audit`) gates the push; the
  production smoke test (every 30 min) then verifies the live site.
- Post-deploy spot checks:
  - `curl -s https://data-centers-254.vercel.app/api/health` → `{"ok":true,"service":"dc254"}`
  - `curl -s -H "Authorization: Bearer $HEALTH_TOKEN" .../api/health` → full diagnostics
  - `curl -o /dev/null -w '%{http_code}' '.../articles/%2e%2e%2f%2e%2e%2fREADME'` → 404
  - `curl -o /dev/null -w '%{http_code}' '.../articles/kenya-data-centre-power-costs-world-bank'` → 200
