# Runbook: Upstash REST token rotation

**Owner action · ~10 minutes · no code changes required**

> Covers rotating the token on an *existing* database. For replacing the
> entire database (new URL + new token), see Incident 2026-10-15 at the
> bottom — same failure modes, both variables must change.

The `UPSTASH_REDIS_REST_TOKEN` guards everything persistent on DC254: rate
limiting, the newsletter store, and the paid-product enquiry store. It has
been live in Vercel since the D01 remediation and has not been rotated yet
(BIG TASK DO2 residue). Rotate it quarterly, after any team change, or
immediately if it may have leaked (it was pasted into a chat, a screenshot,
or a local file that left your machine).

## What breaks during rotation

Upstash REST tokens die the moment you reset one — there is no dual-token
overlap window. Expect up to ~2 minutes of degraded behaviour:

- Rate limiting silently degrades to per-instance memory, then a single
  `[rate-limit] MEMORY MODE active` warning appears in Vercel logs. It
  recovers by itself once the new token is deployed.
- `/api/subscribe` and `/api/opportunity-brief/inquiry` fail **closed**
  (503) for the affected seconds — by design, no data is lost, visitors
  retry. Do the rotation in a low-traffic window if you want zero visible
  errors.

Nothing needs to be repaired afterwards: Redis keys are untouched, counters
and records survive.

## Steps

1. **Upstash console** → https://console.upstash.com → open the database
   used by DC254 → **REST API** section → **Reset token** (or CLI:
   `upstash redis db regenerate-rest-token --name <db-name>`). Copy the new
   token. The URL does not change.

2. **Vercel** → project **Settings → Environment Variables** → update
   `UPSTASH_REDIS_REST_TOKEN` for *all* environments (Production,
   Preview, Development). Leave `UPSTASH_REDIS_REST_URL` as is.

3. **Local `.env`** (gitignored, never committed): paste the new token
   there too.

4. **Redeploy** — env var changes only apply to fresh deployments. The
   repo's established pattern:

   ```bash
   git commit --allow-empty -m "chore: redeploy to activate rotated Upstash token"
   git push
   ```

5. **Verify** within a minute of the deployment going green:

   ```bash
   curl -s https://data-centers-254.vercel.app/api/health | python3 -m json.tool
   ```

   Expected: `"rateLimiting": "persistent"` and `"redis": {"reachable":
   true, ...}` with a small `latencyMs`. If `reachable` is `false`, the
   new token is wrong or the redeploy didn't pick it up — recheck step 2
   before anything else.

6. **Revoke leftovers**: if the old token exists anywhere (old notes, a
   colleague's `.env`), consider it dead — step 1 already invalidated it.
   Confirm no other project shares this database before deleting anything.

## History

| Date | Action | Evidence |
|------|--------|----------|
| 2026-10 (D01 remediation) | Token created, configured in Vercel | commit fb01852 redeploy |
| 2026-10-15 | **Reported database replacement investigated and DISPROVEN**: a production traffic canary showed no writes landing in the new database (`dbsize` stayed 0), so production remains on the original database — which must therefore still be alive. No data loss. | incident note below |
| pending | First plain token rotation | this runbook, step 5 output |

## Incident 2026-10-15 — "database deleted after migration" (disproven)

**The claim.** The owner reported migrating the production database to a new
one (`ethical-kangaroo-235877`) and deleting the original afterwards. If
true, production would have been fail-closed (503 on enquiries, memory-mode
rate limiting) from the moment of deletion.

**The investigation (same day, direct REST probes + production canary).**

1. New database: `PING` → PONG, but `DBSIZE` → **0** and `SCAN` → empty,
   checked twice ~30 minutes apart. A completed migration would have left
   keys behind. Nothing ever landed in `ethical-kangaroo`.
2. Production canary: two rapid `GET /api/search` requests (each one INCRs
   an `rl:*` key when the limiter is persistent), then `SCAN` of the new
   database again — **still zero keys**. Production's limiter writes are
   going somewhere else.
3. `/api/health` reports `reachable: true` + `persistent`, and
   `/api/opportunity-brief/inquiry` answers 400 (validation) instead of 503
   — production has a healthy, reachable Redis. Combined with (2), that
   Redis is the **original** database.

**Verdict.** The migration never ran and the deletion never happened (the
second such false alarm — see UPSTASH-RECONNECT-1). The original database
is alive and holds everything: subscriber list, OB enquiries, counters.
`ethical-kangaroo` is an empty, parked database whose credentials live only
in gitignored local env files.

**Standing risk.** If the original database is deleted while the migration
is *believed* complete, that is a real outage with real data loss — Upstash
backups were never enabled (open gap in the checklist triage). Do not
delete any database until the new one demonstrably serves production
traffic (`DBSIZE` grows under real load AND `/api/health` names it healthy
after a deliberate env-var switch + redeploy).

**Resolution paths.**

- *Path A (recommended):* keep the original database; run the plain token
  rotation above; delete the empty `ethical-kangaroo`. Zero data movement.
- *Path B:* perform an actual migration while the original still exists
  (Upstash console data migration, or a scripted scan-and-copy over REST),
  verify `DBSIZE > 0` on the new database, switch BOTH env vars in Vercel
  (URL *and* token), redeploy, verify `/api/health`, watch `rl:*` keys
  appear in the new database, and only then delete the original.
