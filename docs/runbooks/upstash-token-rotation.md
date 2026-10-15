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
| 2026-10-15 | **Database replaced, not just the token**: owner migrated the original database to a new one (`ethical-kangaroo-235877`), then deleted the original. Both `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` rotated in one step | incident note below |
| pending | First plain token rotation | this runbook, step 5 output |

## Incident 2026-10-15 — database replaced instead of token reset

**What happened.** The owner ran a migration to a new Upstash database
(`ethical-kangaroo-235877`) and deleted the original database afterwards —
a legitimate migration path, but a step beyond what this runbook described
(the runbook's "Reset token" keeps the same database and URL). With both
URL and token dead, every production Redis path failed closed: OB enquiries
answered 503, subscribe degraded, rate limiting fell back to per-instance
memory with the one-time `MEMORY MODE active` warning. Nothing was silently
lost during the outage window — fail-closed did its job.

**Data status (verified by direct REST probe on the day).** The new database
reported `dbsize: 0` — the migration did not carry keys across (or the
source export step never completed before deletion). Consequences:

- Newsletter list: verified subscribers may be recoverable from the Resend
  segment/audience if `RESEND_SEGMENT_ID` was configured (double opt-in
  mirrors contacts there).
- `ob:enquiry:*` enquiry history and rate-limit counters: not present in
  the new database; Upstash backups were never enabled (vibe-checklist
  triage gap, still open), so unless an export exists outside Upstash these
  are unrecoverable.
- The fail-closed design means no *new* enquiries were accepted-and-dropped
  during the outage; visitors saw 503s instead.

**Recovery actions.** (1) Owner: check Upstash console for any automatic
snapshot/backup of the deleted database and raise an Upstash support ticket
if the data matters. (2) Reconcile the newsletter list from Resend. (3)
Enable Upstash backups on `ethical-kangaroo-235877` (owner toggle, still
pending from the checklist triage). (4) Production was re-pointed at the
new database by updating the Vercel env vars and redeploying — verify with
`/api/health` (`redis.reachable: true`, `rateLimiting: "persistent"`).
