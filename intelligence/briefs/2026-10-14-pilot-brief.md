# DC254 Intelligence Brief - 2026-10-14 (pilot)

First Intelligence Monitor brief. Produced from one small Apify collection run
(run `EYJrixtPCxsEDAnS2`, actor `apify/google-search-scraper`, 4 queries x 1 SERP
page x 10 results, 34 deduplicated records). Collected 2026-10-13 ~21:35 UTC
(14 Oct Nairobi). Every item below is UNREVIEWED until a human opens the source.
Record IDs cite the UTC collection date (20261013); this brief uses Nairobi dates.

Cost: USD 0.018 (PAY_PER_EVENT, 4 search pages). Well inside the free plan's
USD 5 monthly allowance.

## Stream: Workforce (11 records)

1. iXAfrica official careers posting - "IT Intern - Data Centre Operations"
   (6-month paid internship, Nairobi).
   https://ixafrica.co.ke/?post_type=awsm_job_openings&p=6279
   Why it matters: an official employer career page, the top source priority in
   the Workforce Watch design. Also exists as social mirrors (records 001, 006);
   prefer the official page. Reviewer: open the posting, extract title, skills,
   qualifications, dates verbatim; confirm it is current.
2. LinkedIn aggregate: "106 Data Centre jobs in Kenya".
   https://ke.linkedin.com/jobs/data-centre-jobs
   Why it matters: a sample-size indicator for the workforce pilot, with heavy
   caveats. This is advertised-demand surface, NOT a count of unfilled positions,
   and includes non-data-centre roles. Never cite as a shortage measure.
3. iXAfrica + Oracle "Kenya's first public cloud region" item (africa24tv).
   Reviewer: cross-check against our existing cloud-region record before any
   use; "first public cloud region" is a claim by a third party, not DC254.
4. AfricaDCA "The Data Centre Talent Shortage" (industry association).
   Reviewer: useful as context for the workforce campaign; apply the house
   rule that industry commentary is not evidence of a national shortage.
5. Aggregators (Careerjet, MyJobMag, First Point Group SA) and a
   "Digital Infrastructure Modernization Framework" proposal (centpol.com).
   Reviewer: low priority; aggregators are discovery tools only.

## Stream: Policy and market (10 records)

1. "Kenya digital infrastructure tender bids close 29 October" (Facebook post)
   + "Kenya Digital Infrastructure Acceleration Project Invitation"
   (LinkedIn post by John Tanui, CBS).
   Why it matters: TIME-SENSITIVE. If a Kenya Digital Infrastructure
   Acceleration Project procurement really closes 29 Oct 2026, that is a
   dated policy-intel item. The Facebook/LinkedIn posts are NOT the document
   of record. Reviewer: locate the official Specific Procurement Notice on
   the World Bank or ministry portal before anything is written.
2. "Kenya's New Data-Centre Licence Tests Whether Critical-..." (LinkedIn Pulse)
   + "Kenya's data centre licensing framework is changing" (Facebook).
   Why it matters: connects to the CA licensing consultation already on
   /tracker/licensing (opened 8 Sep, comments due ~8 Oct per the tracker note).
   Reviewer: has the CA issued or finalised a data-centre licence framework?
   If yes, the licensing tracker needs an evidence-backed update.
3. EPRA homepage surfaced as a lead (egress-blocked domain for this sandbox,
   known class). Reviewer: no action from this result alone.
4. Legal/regulatory guides (Wamae Allen, HSF Kramer, ClydeCo) + AfricaDCA
   "Data Centres in Africa" PDF (Feb 2026). Reviewer: background library
   candidates for RESEARCH-VERIFICATION-STANDARDS-compliant citation.
5. Tender aggregators (kenyatenders, tendersontime). Low priority.

## Stream: Connectivity (8 records)

1. Juba-Nairobi Fiber Optic Link - PIDA Investment Prospectus (au-pida.org).
   Why it matters: this link is already drawn on our maps (PIDA hub label);
   the prospectus is a strong primary source candidate for the map/tracker
   source lists. Reviewer: compare prospectus status with our tracker state.
2. WIOCC regional-presence page (wioccgroup.net).
   Why it matters: WIOCC's US$300M facility is already an RR004 candidate
   with a 10 Oct T1 capture; this page is corroboration material.
3. "Kenya has launched a new submarine cable system" (Instagram mirror).
   Reviewer: identify the actual cable and date from a primary source before
   any use; mirrors are discovery only.
4. Google plans four subsea cable connectivity hubs (developingtelecoms).
   Reviewer: check whether any hub touches East Africa; else file as global
   trend monitor, not Kenya news.
5. Capacity media news index, iXAfrica connectivity page. Background.

## Stream: Facilities (5 records)

1. "Amaco seeks approval for $1.5 billion Kenya AI data centre" (thetechcapital).
   Why it matters: matches the house record (US$1.5B first reported 17 Aug 2026;
   GE Vernova cooperation 10 Sep; proposed, NOT in the 27-facility directory).
   Reviewer question that would move the story: does anything here show a NEW
   milestone (approval actually filed/granted) beyond the 17 Aug-10 Sep chain?
   No status change is claimed by this brief.
2. Al Jazeera (24 Aug 2026): "Can Kenya's AI ambitions coexist with Naivasha's
   water needs?" Why it matters: water use is an angle adjacent to our power
   ledger; candidate research thread, not a dataset change.
3. African Energy Week 2026 AI/data-centre platform (af.net mirror).
   Reviewer: event listing; low priority.
4. Digital Realty $80M Nairobi item (Instagram mirror) - likely retrospective
   coverage of icolo/ Digital Realty Nairobi. Reviewer: compare with existing
   icolo records before any use.
5. aihubfordevelopment.org events page. Background.

## Potential DC254 changes for human review (nothing applied)

- /tracker/licensing: check for post-consultation licence framework decision
  (would be an evidence-backed tracker update).
- Workforce pilot: add iXAfrica careers page as the first official-employer
  seed for Workforce Watch collection.
- Map/cables: consider PIDA prospectus as a source URL for the Juba-Nairobi link.
- RR004 candidate 3 (WIOCC): add regional-presence page as corroboration.

## Duplicates, conflicts, stale sources

- 1 in-file duplicate removed (same URL twice across queries); 0 cross-file.
- Social mirrors (Instagram/Facebook/X) appear for several stories; each is
  a lead to the underlying primary source, never citable itself.
- "106 jobs" (LinkedIn) vs small official-career yield: not a contradiction;
  different instruments (aggregate index vs verified official postings).
- Conflict check: no collected item contradicts the October 2026 dataset
  snapshot (27 facilities / 20 operational / 10.5 MW live / 42.9 MW designed
  / 230 MW pipeline).

## Coverage limitations

- 4 queries, first SERP page only, English only, one search provider.
- Google personalization/region bias unknown from this egress.
- Snippets are Google-rendered text, not publisher pages.
- Aggregators and social mirrors overweighted in SERPs by design of the
  platform; official sources need direct crawls (next step, limited to
  approved domains).
- No restricted or paywalled content was collected; no access controls bypassed.
