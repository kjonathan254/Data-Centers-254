# Capture: CA Kenya Data Centre Licensing - Tier-1 Source Hunt

- **Capture ID**: 2026-09-24-ca-ke-dc-licensing-t1-source-hunt
- **Date**: 2026-09-24
- **Tier target**: T1 (regulator instrument) - NOT YET CAPTURED
- **Status**: capture-pending
- **Claims**: [] (no claim upgrades proposed from this hunt)
- **Editor gate**: machine capture is evidence, never verification

## Target documents (advisor plan, editor-endorsed)

1. **Proposed Licensing Framework for Data Centres** (consultation document) - the T1 anchor
   for the 8 September 2026 proposal already registered as KE-LC-C3 (verified on T2+T3).
2. **Revised Telecommunications Market Structure** (gazetted 6 March 2026) - T1 basis of
   KE-LC-C2 (NFP-Tier 2 is the current co-location licensing category). Gazette/legal-notice
   text would upgrade the claim's CDH T2 foundation.
3. **Transitional provisions** document - advisor reports it identifies "Licensing of Data
   Centres" as a change involving NFP Tier 1 and Tier 2, tied to publication of the revised
   market structure. Existence consistent with CDH T2 alert; document not yet seen by DC254.

## What today's hunt established

- **Consultation existence re-confirmed** (search-result snippets, host-level only):
  www.ca.go.ke "Open Consultations" - "The Authority therefore invites stakeholders and the
  public to submit comments on the proposed licensing framework for colocation data centre
  operations in..." ; digitalpolicyalert.org record dated 8 Sep 2026; itweb.africa (8 Sep),
  dig.watch (8 Sep), connectingafrica.com (10 Sep), wearetech.africa, eastleighvoice.co.ke
  (8 Sep), africabusinesscommunities.com (10 Sep). Snippets corroborate our held T2/T3 chain
  but NO URLs were captured (search layer returned host-only addresses) - recorded as leads,
  not sources, per the no-unverifiable-URL rule.
- **www.ca.go.ke is live but interstitial-bot-walled**: curl of / and
  /index.php/media-centre/open-consultations returns HTTP 200, ~12 KB "One moment,
  please..." challenge shell with a 5-second reload loop; zero document links in HTML.
  This upgrades the r13 capture note ("JS-blocked") to a verified diagnosis.
- **Wayback Machine unreachable from workspace** (web.archive.org + archive.org CDX both
  time out, HTTP 000) - no snapshot fallback available from here.
- **DuckDuckGo HTML and Bing organic results bot-walled** from this environment.
- **Context.dev key MISSING from .env.local**: only FIRECRAWL_API_KEY present after the
  workspace rollback; the Context.dev key transited chat previously and is on the
  rotation list (standing rule 12). A FRESH ROTATED key is required before Context.dev
  scrape can run (scripts/contextdev_capture.mjs auto-writes the capture file with
  provenance front matter; ~1 credit per born-digital PDF).

## Evidence already held (no upgrade needed for the core claim)

- cdh-ke-tmt-alert-2026 (T2, captured) - Revised Market Structure gazetted 6 Mar 2026;
  ULF Annex III names NFP-Tier 2; CA notice of 8 Sep 2026.
- techafricanews-ke-dc-licence (T3, captured) - corroborates notice + 30-day window.
- wmedia-ke-dc-licence (T3, captured) - reproduces the CA notice verbatim (rationale,
  coverage, sole source for fee schedule + 2027/2028 FY implementation timing).

## Unblock paths (in order)

1. Editor supplies a fresh CONTEXT_DEV_API_KEY in .env.local (rotated - old key transited
   chat), then: `node scripts/contextdev_capture.mjs "<ca.go.ke consultation URL>" --tier 1`
   (URL to be taken from the CA Open Consultations page once rendered).
2. Direct acquisition: the editor's planned letter to CA (submissions channel:
   datacentres@ca.go.ke) requests the framework documentation - regulator-supplied copies
   are T1 and come with provenance by definition.
3. Kenya Law / Kenya Gazette route for the Revised Market Structure legal notice
   (kenyalaw.org is curl-open per the 2026-09-23 capture) - independent of CA's wall.

## Timing

Consultation window: 30 days from 8 September 2026 - closes on or about 8 October 2026.
Capture should precede the deadline so DC254's explainer can support a submission.

## Upgrade path

None proposed. On T1 capture: register the advisor's claim skeleton (what is licensed,
licence classes, eligibility, fees, duration, compliance, transitional arrangements) as
individual claims with statement-level citations; fees claim KE-LC-C4 upgrades from
partially-verified if the notice/gazette confirms the schedule.
