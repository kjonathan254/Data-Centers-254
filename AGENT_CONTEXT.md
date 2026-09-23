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

## Current state (updated 2026-09-23, r11)

- **Site**: data-centers-254.vercel.app (Vercel free team, project
  `prj_Tigqxa5amDHpQcDT34kdIqSEnAMt`), repo kjonathan254/Data-Centers-254, branch main.
- **Policy Intelligence**: dataset `policy-2026-Q3-r11` — **49/56 claims verified,
  7 partially-verified, 0 unverified**; 60 sources (47 T1); 20 pillar gaps
  (energy/construction/environment mostly unresearched in UG/RW; EAC regional
  frameworks untouched across all four).
- **Validator**: `python3 scripts/validate_policy.py` → PASS (schema, referential
  integrity, capture-linkage on disk, pillar checks, verified ratio).
- **Evidence pipeline**: `scripts/firecrawl_search.mjs` (discovery) →
  `scripts/firecrawl_capture.mjs <url> --tier N --claims <IDs>` (writes
  `research/captures/<date>-<slug>.md`, front matter locks capture-pending) →
  editor review → `scripts/policy_upgrade_rNN.py` (programmatic, byte-stable JSON
  dump indent=2 ensure_ascii=False + trailing newline) → validator → push.
- **Monitoring**: `scripts/firecrawl_monitor.mjs` + weekly GitHub Actions cron
  (`.github/workflows/evidence-monitor.yml`, Mon 06:00 UTC). Job fails on content
  drift. Requires repo secret `FIRECRAWL_API_KEY` (owner must add; see Open threads).
- **Firecrawl credits**: free tier was exhausted 2026-09-23 by the capture session
  (~60 calls; HTTP 402 at end of day). Weekly monitor needs refills or a paid plan.
- **Vercel storage**: resolved (retention policy + image diet 13.6→6.5MB per
  snapshot). User should have revoked the Vercel token shared in chat (vcp_1Bve…).
- **Next.js env**: `TYPESAFE_API_KEY` exists in Vercel production (inert — no code
  reads it yet; TypeSafe Phase 0 calibration awaiting user go + local key).

## Open threads

1. **Repo secret**: user adds `FIRECRAWL_API_KEY` at Settings → Secrets and
   variables → Actions so the weekly drift monitor can run.
2. **UG-TX-C1** (only weakened remaining tax claim): 10-year income tax holiday
   awaits Uganda Income Tax Act (Cap 340, as amended) capture — Free Zones Act
   2014 + Investment Code 2019 already captured (T1).
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

## Tooling quick reference

- Search: `node scripts/firecrawl_search.mjs "<query>"` (prints numbered candidates)
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
