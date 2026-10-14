# DC254 Intelligence Monitor — Freshness & Timeliness Pass

**Task 143 (confirmed scope) | 14 October 2026 | Reviewer: Super Z (editor verification authority granted same day)**

Editor directives executed in this pass: Task 143 scope confirmed ("3 okay");
verification authority granted ("You have the authority to make the right decision
that serves the platform"); Microsoft/ADC directive: "Use both Microsoft has been
laying people the ADC engineers are leaving their offices, if we don't have the
correct facts just bin it."

## 1. Microsoft ADC Nairobi closure — verdict: facts HOLD, both angles retained

The story survives the "bin it if the facts fail" test, with one material precision
upgrade. Eight-plus independent outlets converge on the core event: staff at the
Nairobi Africa Development Centre (Dunhill Towers, Westlands) were informed on
Monday 12 October 2026 that the centre closes, with roughly 400 roles at risk.
Page-level fetches performed 14 October: Business Insider Africa (full body),
Kenyans.co.ke (og:description), WeeTracker (og:description). URL liveness: WeeTracker,
Kenya Times and Kenyans.co.ke return 200; Tuko (403) and Reuters (401) are bot-blocks
verified live via search snippets, not dead links.

The precision upgrade: Microsoft has now responded on record. Its response — obtained
by CIO Africa and tech-ish, carried by Business Insider Africa on 13 October —
acknowledges "proposed changes affecting its engineering operations in Kenya" and
says the company "will continue operating in the country and supporting customers".
It neither confirms nor denies the closure and gives no headcount or dates. The brief's
item 1 was therefore refined, not binned and not upgraded: status stays REPORTED, with
the Microsoft acknowledgement now part of the record. The ~400 figure is attributed to
staff reports and media (WeeTracker "nearly 400"; Kenyans.co.ke 400–500), never to
Microsoft. Two framing corrections were applied to the earlier brief text: the US$100M
figure is the launch investment target (five years, up to 500 engineers across Nairobi
and Lagos), not a spent sum; and the government-engagement detail is now documented —
CS William Kabogo met a Microsoft delegation led by Jeff Bullwinkel (VP, Deputy General
Council, Corporate) on 12 October, publicly stressing "retaining local talent,
protecting jobs at Microsoft's Nairobi engineering centre and sustaining investor
confidence". One conflicting social snippet claiming the closure affects only Nigerian
operations was recorded and outweighed by the direct Nairobi reporting. The stalled
US$1B G42 campus record and the 27-facility directory snapshot are unaffected: the ADC
is a software-engineering hub, a different asset class.

Evidence-register action: ingested as `dc254-workforce-20261014-001` (workforce topic,
corroborated, page-level evidence, status caveat encoded in the record). The editor's
"engineers are leaving their offices" observation matches the staff-account reporting
and feeds the brief's second editorial angle — whether talent released by Microsoft
(ADC) and Oracle is absorbed by local operators, hyperscale DC teams, or the postings
the workforce pipeline tracks.

## 2. KDEAP SPN timeliness — verdict: deadline stands (10:00 EAT, 29 Oct 2026)

The Specific Procurement Notice trail now has two official-adjacent anchors: PS John
Tanui's LinkedIn post references the SPN explicitly, and his Facebook post states the
deadline ("Bids close at 10:00 a.m. EAT on 29 October 2026") with the tender-documents
pointer to icta.go.ke/tenders. ITWeb (16 Sep) independently covers the World Bank-backed
tender. Direct fetch of icta.go.ke failed at connection level from this sandbox in all
variants (same egress-block class as au-pida.org and EPRA recorded in the pilot report);
no Apify token was available in this session (rotation still pending), so no proxy fetch
was attempted. The brief's standing instruction — re-verify against ICTA records on
publish day — remains mandatory. Freshness notes appended to both queue records
(`dc254-policy-20261013-001/-002`); ids and verdicts unchanged.

## 3. CA standalone DC licence timeliness — verdict: still PROPOSED as of 14 Oct

No adoption notice was found in the 14-day search window. The newest coverage of the
standalone data-centre licence framework remains the 8–10 September proposal set (CA's
own announcement posts, TechAfrica News, ITWeb, Connecting Africa, Developing Telecoms).
The CA market-structure page notes only the April 2026 Unified Licensing Framework
baseline. The brief's item 4 (PROPOSED; final framework / effective date / transitional
arrangements as the next evidence that matters) is confirmed current. The concurrent
CA Satellite Frequency Licensing Framework consultation (comments due 6 Nov per
TechTrendsKE) is secondary-sourced: the ca.go.ke primary page returns a JS-challenge
interstitial to this egress, consistent with the bot-gated class; treat the primary
page as human-browser-verification required.

## 4. iXAfrica restricted-crawl evaluation — verdict: crawl-permitted (with standard politeness)

robots.txt fetched 14 October: `User-agent: *` disallows only `/wp-admin/` and the site
publishes a sitemap. Job postings (the Workforce Watch seed target, e.g. the careers
posting already corroborated in the pilot) are crawl-permitted by the machine-readable
policy. Conditions for compliant collection: respect robots.txt dynamically, identify
the collector, throttle politely, re-check robots.txt per run, and review site terms on
the first collection run for any stricter contractual restriction. No restriction was
found that would bar the Workforce Watch design as documented.

## 5. NIF editorial angle — verdict: closed, reporting test validated

Searches for a named ICT or data-centre allocation within the National Infrastructure
Fund found none. The first named NIF-funded project is the JKIA expansion (proceeds of
the Kenya Pipeline IPO enter the fund first); the parliamentary record lists highways,
railways, airports and seaports as the national-infrastructure classes; digital
infrastructure appears in the CEO's demand framing (eligibility language), never as a
named allocation. The brief's angle "where is the public capital actually going?" is
therefore published as a question with a documented honest answer so far — transport
assets first — and its reporting test (no implied DC funding until a specific allocation
or eligible project is documented) is validated, not weakened.

## 6. Cost and session ledger

- Spend: USD 0.00 Apify (no token in environment; rotation still pending), 0 credits.
- All verification via free web search + direct page fetches; raw artifacts under
  workspace `tmp/task143-freshness/` (search JSON + fetched HTML).
- Queue after this pass: 37 records — 10 corroborated / 27 UNREVIEWED
  (`scripts/task143-freshness-review.json`).
- Morning brief markdown amended in the same news cycle (item 1 refinement, sources
  16–18, watchlist) and PDF regenerated from the persisted build scripts.
