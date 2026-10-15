# Runbook: Upstash REST token rotation

**Owner action · ~10 minutes · no code changes required**

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
| pending | First rotation | this runbook, step 5 output |
