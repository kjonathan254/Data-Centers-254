# DC254 NAPKIN - curated runbook

> Continuously curated distillation of recurring, load-bearing guidance (adopted from
> the "napkin" skill pattern, 2026-10-11). This is NOT a session log - AGENT_CONTEXT.md
> keeps the chronology. Keep only what a future session must know in its first minute.
> Every category: max 10 items. Prune anything superseded. Update in the same commit
> as the change that invalidates an item.

## 1. Verification & evidence (non-negotiable)

- Every published claim traces to a T1 (primary) source on file in `research/captures/`; captures start `capture-pending` and flip `verified` ONLY after editor read or explicit delegation.
- Paywalled data keeps its attribution chain: Uptime Institute outage numbers are cited "as reported by Data Center Knowledge" (DCK), never as first-hand Uptime figures.
- Kenya renewables line is ALWAYS "over 90% of electricity from renewable sources" (generation-mix framing) + explicit delivery/last-mile disclaimer.
- No Kenyan facility/operator claims may be attached to global-scope material (e.g., AI-era UPS architecture = global trend; say so explicitly).
- Numbers in articles are re-verified against `src/data/current.json` on publish day (verify_*.py pattern), not copied from stale drafts.

## 2. Editorial style (house rules)

- No em dashes anywhere. No "------End------" markers. FAQ section in every feature article (frontmatter `faq` + on-page H2/H3).
- Title budget ~52-60 chars; meta description ~150-160. Internal links: register new hub links (e.g., compute-hub) in the same commit.
- updated_date bumps on substantive refresh only; reading_time updates alongside.
- Humanizer pass (skills/humanizer) on drafted copy: kill AI tells, keep the facts. House voice: Nairobi-published, engineer-to-engineer, no hype.

## 3. Pipeline & gates (every content commit)

- Gates before push: `article_validator.py` (ALL OK) -> `validate_policy.py` (PASS) -> `validate_jsonld.py` (ALL OK) -> `audit_assets.py` (images exist) -> `audit_links.py` -> `npm run lint` -> `npm run build`.
- Preflight: local may be behind origin/main (parallel sessions) - fetch/ff-merge BEFORE committing; re-verify KPIs post-merge.
- After push: verify CI double-green via authenticated REST (Content validation + Lint and build), then probe production URLs (200 + SSR content spot-check).
- PDFs: print-HTML -> Playwright -> ghostscript /ebook (target <1MB); Rack Report design lineage = RR#1/#2/#3 template (cover + photos + CSS bar charts + tables).
- README article-count references update with every new article (both spots).

## 4. Cadence & deliverables

- Rack Report: WEEKLY Monday. Issue 003 = October edition (published 13 Oct 2026). Issue 004 = Mon 2 Nov 2026. Cadence doc is the source of truth.
- Friday: DC254 Intelligence flagship. Wednesday: investigation day feeding Friday.
- Every RR issue: master copy in docs/newsletter/, PDF to public/reports/, /rack-report archive block updated (featured/past/next slots), sample-issue link points at latest.
- Social packs: platform-exact dimensions (banner-design skill), LinkedIn post copy saved in the master doc for the editor to post.

## 5. Ops & security

- Secrets live ONLY in gitignored .env.local (mode 600): GH_TOKEN, CONTEXT_DEV_API_KEY. Never commit, never echo, never put tokens in URLs that get logged.
- Context.dev is pay-per-use: prefer free paths (curl, web-search skill) first; report every session's credit spend in AGENT_CONTEXT.
- ca.go.ke blocks curl AND headless fetches - CA consultations go through Context.dev (1 credit per capture) and are capture-pending like everything else.
- Remote push uses credential helper reading .env.local (no token in remote URL). If pushes fail: check GH_TOKEN expired -> ask editor to rotate.
- Repo is PUBLIC: every tracked file is world-readable - audit new files with that lens.
