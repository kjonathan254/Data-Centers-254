# Vibe-coded launch checklist — DC254 triage (2026-10-15)

Editor pasted the ~150-item "everything a vibe-coded app needs before it's
real" checklist with the instruction *"Implement or check what can make our
site better"*. DC254 is a content + intelligence platform on Vercel (git as
CMS, Upstash Redis), not a multi-tenant SaaS, so a large slice of the
checklist does not apply. This document records the three-way triage with
evidence, so the reasoning survives outside any single session.

Verdict: **the trust-critical slice was already shipped and is now test-
pinned; what remains is owner-gated console work, not code.**

## 1. Already shipped (verified, with evidence)

| Checklist area | DC254 implementation | Evidence |
|---|---|---|
| Input validation / sanitization | Email regex, enum allow-lists, `<>` stripping, length caps, 12 KB body limit on POST routes | `src/app/api/subscribe/route.ts`, `src/app/api/opportunity-brief/inquiry/route.ts`, `src/lib/opportunity-brief.ts` |
| Rate limiting (per-IP, global) | Upstash fixed-window INCR+PEXPIRE, per-route buckets + global proxy limiter, 429s; memory fallback with a one-time visible warning | `src/lib/rate-limit.ts` |
| Client-IP trust (anti-spoof) | `clientIp` trusts only `x-real-ip`, falls back to rightmost XFF (audit S01) | `src/lib/rate-limit.ts` + tests |
| CSRF / cross-site POSTs | `isSameOriginRequest` guard before any limiter/store/vendor spend | `src/lib/api-guards.ts` |
| Bot mitigation | Honeypot fields returning fake success | subscribe + OB inquiry routes |
| Auth-token hygiene (analogous) | HMAC-SHA256 signed, expiring, single-purpose double opt-in links; timing-safe compare | `src/lib/subscribe-tokens.ts` + tests |
| Fail-closed storage | OB enquiries refuse (503) without Upstash — no silent memory loss; subscribe parks the record then fails closed on email-stack gaps in production | `src/lib/opportunity-brief-store.ts`, subscribe route |
| Data retention / erasure (GDPR-style) | 60-day auto-erase TTL on unverified signups, PERSIST on confirm, anonymised tombstone + counter decrement on unsubscribe/erasure | `src/lib/newsletter-store.ts` + `tests/newsletter-store.test.ts` (D02 pinning) |
| Degradation visibility (no silent fallback) | `warnMemoryMode` structured log + live Redis PING surfaced at `/api/health` (audit P0-6) | `src/app/api/health/route.ts` |
| Security headers | CSP enforced with report sink (`/api/csp-report`), HSTS preload — verified live 2026-10-15 | `next.config`, systems audit |
| Secrets out of the repo | `.env.example` documents every runtime var; verified complete this session (all `process.env.*` in `src/` map to it) | `.env.example` |
| Security contact | RFC 9116 `security.txt` at `/.well-known/security.txt` | commit cb6eede |
| Health / self-check | `/api/health` (email stack booleans, limiting mode, Redis probe), `/api/chat/health` (LLM wiring states) | route sources |
| Uptime monitoring | GitHub Actions external probe with startup-failure guard | `.github/workflows/uptime-monitor.yml`, `scripts/uptime_probe.py` |
| Tests in CI | `npm test` step in the build job (audit O02); vitest 48/48 across 5 files incl. the new route-level lifecycle E2E suite; tsc + eslint gates | `.github/workflows/ci.yml`, `tests/` |
| Privacy promises ↔ code | Retention behaviours mechanically pinned by tests so policy and code cannot drift | `tests/newsletter-store.test.ts` |
| Error/empty states (UX) | not-found, error, offline pages; generic non-enumerating verify/unsubscribe responses | `src/app/*` |
| AI chatbot guardrails | Grounded answers, zod caps, numeric guardrail, provider fail-over chain, TTS route limits | `src/lib/chatbot/*` |

## 2. Not applicable to DC254

Multi-tenant SaaS machinery with no surface here: MFA/SSO/SAML/SCIM, tenant
isolation, IDOR (no cross-tenant records exist), RBAC/roles, billing &
proration & dunning & tax, PCI (no card data; payments deliberately
deferred), DB migration/rollback tooling (git-as-CMS + KV store), background
job queues, app-side cron, IaC/Terraform, feature-flag system, canary
deploys (Vercel instant rollback covers the need), on-call rotations.

AI-specific items largely collapse into what exists: prompt-injection
surface is small (Jibu is retrieval-grounded, no tool execution); spend caps
unnecessary on free-tier providers; model-degradation chain already built
(Groq → NVIDIA → HF).

## 3. Remaining gaps (mostly owner-gated)

1. **Upstash token rotation** — runbook now at
   `docs/runbooks/upstash-token-rotation.md`; ~10 min owner action in the
   Upstash console + Vercel, verify via `/api/health`.
2. **Error tracking (Sentry-class)** — needs an account + DSN; Vercel log
   drain is the current state. Unblocks: grouped errors instead of raw logs.
3. **Custom domain** — owner decision; also unlocks a verified Resend FROM
   domain (deliverability for the briefing + contact form).
4. **Upstash backup + restore drill** — enable scheduled backups in the
   Upstash console, then rehearse one restore (a backup that has never been
   restored is a hope, not a backup). Second runbook candidate.
5. **Cost alerts** — both consoles (Upstash budget alert, Vercel spend
   notification) are toggles; no code. Guards against runaway-loop bills.
6. **Browser-level E2E (Playwright)** — the subscribe lifecycle is now
   covered at route level (`tests/subscribe-flow.e2e.test.ts`, 11 tests);
   true browser E2E is a heavier dependency decision, worth it only if
   form UX regressions become a pattern.
7. **CWV field data + a11y audit** — needs real traffic (RUM); post-launch
   item, not pre-launch.
8. **Public status page** — optional polish; the external uptime probe
   already detects and records outages.

## 4. Session changes from this triage

- `tests/subscribe-flow.e2e.test.ts` — closes the DO2 residue "E2E tests
  for subscribe flow": full lifecycle (signup → confirm → unsubscribe with
  PII erasure → resubscribe counted once), forged/wrong-action/expired
  token rejection, cross-origin 403, honeypot, 400 validation, per-IP 429,
  production fail-closed 503.
- `docs/runbooks/upstash-token-rotation.md` — first operations runbook;
  starts the runbook habit the checklist asks for.
- Env var audit: no strays found; `.env.example` already complete.
