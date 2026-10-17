# Runbook — Email sending domain (Resend + RESEND_FROM_EMAIL)

Status 2026-10-16: **stopgap active**. `RESEND_FROM_EMAIL` is set in Vercel to
`The Rack Report <onboarding@resend.dev>` so the owner can self-test the full
double-opt-in flow. **Public signups do not work in this state** — Resend only
delivers from `onboarding@resend.dev` to the Resend account's own email
address. Everything below turns the funnel fully public.

## Why this matters

- `/api/subscribe` fails closed without `RESEND_FROM_EMAIL` (verified in code,
  `src/app/subscribe/route.ts` → `sendConfirmationEmail` returns `config-missing`).
- `/api/health` reports `emailStack.configured` — after the stopgap it reads
  `true`, but that only means "env present", **not** "public funnel works".
- The Rack Report is the platform's growth engine; this is the fix order from
  the 2026-10-16 audit (N01 + C01).

## Steps (phone-doable, ~45–60 min)

1. **Buy the domain** at your registrar of choice (e.g. `datacentre254.co.ke`
   or `.com`). KeNIC `.co.ke` registrars: Truehost, Sasahost, HostPoa, etc.
2. **Attach it in Vercel**: Dashboard → DC254 project → Settings → Domains →
   Add. Accept the suggested DNS records (apex `A 76.76.21.21` or ALIAS/CNAME
   per registrar capabilities). Update `NEXT_PUBLIC_SITE_URL` in Vercel env to
   the new domain and redeploy — canonicals, sitemap, OG URLs, JSON-LD all
   follow that single var.
3. **Verify the domain in Resend**: Dashboard → Domains → Add domain
   (e.g. `news.your-domain` as a subdomain for sending isolation) → Resend
   shows DNS records: SPF (`resend._domainkey` TXT), DKIM (2 CNAMES), DMARC is
   your own policy record. Add these at the registrar, click Verify.
4. **Set the real sender** in Vercel env:
   `RESEND_FROM_EMAIL` = `The Rack Report <news@your-domain>` → redeploy.
5. **Test with a real address** (not the account owner's):
   - `/subscribe` → confirmation email arrives, inbox not spam (check Gmail
     "Show original" → SPF/DKIM/DMARC all pass).
   - Click verify link → `/subscribe/verified` renders, Upstash key stored.
   - Unsubscribe link → `/subscribe/unsubscribed`, key removed.
6. **Update the checker**: after step 4, `/api/health` must show
   `emailStack.configured: true` and `resendFromEmail: true`.

## Verification one-liner

```bash
curl -s https://<your-domain>/api/health | python3 -m json.tool
# expect: "emailStack": { "configured": true, "resendFromEmail": true, ... }
```

## Rollback / fallback

- If the domain is delayed: leave the stopgap in place; the funnel stays
  owner-test-only. Do **not** delete `RESEND_FROM_EMAIL` — that reverts to
  fail-closed (no verification emails at all).
- If deliverability is poor after setup: check the domain's DMARC record and
  warm up volume (Resend dashboard → Logs shows bounces/complaints).

## Related

- `docs/audits/site-audit-followup-2026-10-16.md` — findings N01 (funnel down), C01 (no domain), N02.
- Resend docs: Domain verification (SPF/DKIM), "Can I send emails to any address from onboarding@resend.dev?" (no — account owner only).
