# DC254 First-Dollar Plan (Task 147)

Date: 2026-10-14. Status: PLAN, editor approval required before pricing goes public.
Scope: who pays DC254, what they pay for, how we find them, how we sell, how the
first shilling lands. Built on assets that already exist in this repo.

---

## 1. The one-paragraph answer

DC254 is not a website business. It is a verified-intelligence business with a
website front door. The first dollar comes from the people who sell shovels in
the gold rush we already document every day: the vendors and integrators who
need to know who is building, tendering and expanding RIGHT NOW, and who today
have no Kenya-specific source for that signal. We sell them a one-off verified
prospect list at launch (USD 29), convert the best of them into a founding
subscription to the DC254 Radar (KES 3,500/month), and use the operator half of
our directory as the free-proof that makes the vendor pitch credible. The
outreach runs on WhatsApp and LinkedIn against a named 40+ prospect list
(`intelligence/prospects/2026-10-14-launch-list.csv`), 20 sends a day, starting
the day the editor approves pricing.

## 2. What we already own (assets audit)

| Asset | Where | Sellable as |
| --- | --- | --- |
| 27 Kenyan + 4 EAC facility records, evidence-tiered | `src/data/directory/current.json` | The Market Map (one-off data product) |
| 14 named operators with status discipline | same | Outreach map + future sponsorship base |
| Daily verified intelligence workflow (Task 142/143/146) | `intelligence/` | The Radar subscription engine |
| Morning Brief with 15+ sourced items | `docs/morning-briefs/` | Proof of rigor (free sample) |
| Rack Report magazine, Issue 004 due 2 Nov | `docs/newsletter/` | Sponsorship inventory (later) |
| Apify collection pipeline, small-run discipline | `scripts/task142_apify_run.py` | Scale-up prospecting (token pending rotation) |
| Live, SEO-indexed site with tracker + search | production | The credibility layer every pitch links to |

## 3. Who are the clients (ICP, ranked by speed to cash)

### ICP-1. Vendors and integrators selling into data centre buildouts (FIRST)

Who: companies that sell UPS, precision cooling, generators, fire suppression,
racks, structured cabling, DCIM, security and maintenance into Kenyan data
centres. Verified names already researched: Atlancis Technologies, Almiria
Networks, HubTech, Delta Energy Systems, iDeveloper Technologies, NuAir
Technologies, Universal Engineering Systems, Climate Evolution Africa, plus the
East Africa arms of the OEMs (Schneider Electric is publicly partnered with
iXAfrica on NBOX1).

Why they pay: Kenya's build pipeline is unusually legible to us and unusually
opaque to them. NBO2 launched at 6.4 MW (Sep 2026, Digital Realty/iColo
transition), iXAfrica NBOX1.2 (18 MW) is under construction, NBOX2 Tilisi
(53 MW) is committed, Nxtra Airtel is building at Tatu City, Raxio Nairobi is
early stage, and KDEAP procurement is live with a 29 Oct deadline. A vendor
who hears about the next tender a week late loses the deal. Our evidence
discipline (announced is not operational) is exactly the filter they lack.

What they buy first: the one-off launch list and then the Radar.

### ICP-2. Data centre operators (SECOND, softer entry)

Who: the 14 operators in our directory, ranked: iXAfrica (expanding),
iColo/Digital Realty (just launched NBO2, rebranding), Africa Data Centres
(NBO2 under construction), Raxio (early stage, building), PAIX, Liquid,
Safaricom, Telkom Kenya, Wananchi, SimbaNET, Septris, Global TS, SEACOM,
ICT Authority's SME facility.

Why they pay (eventually): tenant lead-gen, competitive monitoring, workforce
moves (Microsoft ADC wind-down, ~400 roles REPORTED, is reshaping the talent
market they hire from). Operators are slow buyers through procurement, so we
give them value first: they are already listed and we already verify their
news. The ask starts free (corrections, logo, profile claim), the upsell is a
sponsored listing later, once traffic is proven.

### ICP-3. Analysts, consultancies, investors (ONE-OFF DATA)

Who: Helios (majority owner of iXAfrica), Africa-focused PE and credit funds
(WIOCC raised up to USD 155M from DFC), market-research publishers (Credence
Research pegs Kenya DC market at USD 266M in 2025 growing to USD 805M by 2031),
the D4DHub/ECDPM brief authors. They buy the Market Map dataset once per
quarter. Slow, small, but high-ticket per sale and zero marginal cost.

### ICP-4. Recruiters and TA firms (NICHE, TIMELY)

Who: global DC recruiters active in Africa (DataX Connect, First Point Group,
LVI Associates, Airswift). Why now: the reported Microsoft ADC wind-down puts
hundreds of senior engineers into the market. A "DC Workforce Watch" slice of
the Radar is a wedge. Niche revenue, but the why-now is strongest this month.

### ICP-5. Event organisers (CHANNEL, not payers yet)

Datacloud Africa (Nairobi, co-located with ITW Africa), Africa Datacenters and
Cloud Days, Data Centre and Cloud Expo Africa, Connected Africa Summit, Global
Data Festival and KSEC (2-5 Jun 2026, Nairobi). Use exhibitor and speaker lists
as free prospecting pools and pitch Radar presence where sponsors gather.

Not clients yet: enterprises (banks, insurers). They are the audience vendors
want to reach; we monetise them indirectly and never spam them.

## 4. Products and pricing (draft, editor to confirm)

| Product | Buyer | Price (founding) | Then | Notes |
| --- | --- | --- | --- | --- |
| P0. Proof layer | everyone | FREE | FREE | Site, directory, morning brief, Radar Issue 000 sample |
| P1. Kenya DC Launch List (one-off) | ICP-1 vendors | USD 29 / KES 3,750 | USD 49 after first 20 buyers | 40+ named orgs, why-now evidence, contact channel, updated monthly for buyers |
| P2. DC254 Radar subscription | ICP-1, ICP-4 | KES 3,500/mo (approx USD 27) | KES 6,000/mo after first 10 subscribers | Weekly verified signal sheet: tenders, builds, expansions, jobs, workforce moves |
| P3. Sponsored listing / Rack Report slot | ICP-2 operators | KES 15,000/mo | market rate | Only after we can show real traffic numbers. Phase 2. |
| P4. Custom verification question | any | USD 50/question | case-by-case | We already do this daily for free; productise on request |

Payment rails (Kenya-first): M-Pesa (personal Pochi or business till while
formalising), Paystack Kenya for cards, Lemon Squeezy or Gumroad for
international card buyers of the Launch List. No payment infrastructure
spending before the first sale; hand-invoice the founding customers.

## 5. Why this order (the reasoning, honestly stated)

1. Vendors have budgets and urgency; operators have budgets but procurement;
   investors have money but no urgency. Speed-to-cash ranks in that order.
2. The Launch List is one day of formatting work on research already done. It
   is the cheapest credible thing we can sell this week.
3. The Radar turns the intelligence pipeline we already run (Tasks 142, 143,
   146) into a product instead of a cost centre.
4. Everything we send links to the live site, so marketing spend is zero. The
   site IS the brochure, the demo and the proof.
5. We never fake scale. Founding pricing is honest about being early, and the
   evidence tiering (REPORTED vs CONFIRMED) is the differentiator, not a bug.

## 6. How we find them (channels)

1. Our own directory (done): 14 operators, evidence-linked.
2. Free web research (done, Task 147 battery, 16 queries): vendors, recruiters,
   analysts, events, all in the CSV with source URLs.
3. Apify scale-up (ready, blocked on token rotation): the exact run configs sit
   in `scripts/revenue/apify-prospect-commands.md`, using the existing Task 142
   runner, small collections, house rules. Batteries: tender watch (PPRA,
   ICTA, KDEAP pages), vendor discovery (Google Search + Maps), contact
   enrichment (website-content-crawler on vendor contact pages), job-post
   signals.
4. Event exhibitor lists: Datacloud Africa, DC Expo Africa, Connected Africa,
   Global Data Festival. Free, public, fresh.
5. LinkedIn company pages and role targets: never scraped at scale; used
   manually for outreach targeting only.

## 7. The 7-day first-dollar sequence

- Day 1 (editor approval day): freeze pricing, set up M-Pesa + Paystack +
  Lemon Squeezy, publish the Launch List behind a paywall link (simple page or
  manual delivery), finalize Radar Issue 000 sample.
- Day 2: send the first 20 WhatsApp + LinkedIn outreach messages to priority-A
  vendors (see `outreach-kit.md` templates). Attach Radar Issue 000.
- Day 3: send the next 20 (priority-B vendors + recruiters). Follow up Day-2
  non-repliers with the 3-day nudge.
- Day 4: operator soft-touch wave (free profile-claim offer, no ask). Log
  every reply in the CSV status column.
- Day 5: first follow-up wave + close the first Launch List sale (target:
  1 of 40+ prospects at 2.5 percent minimum conversion is one sale by now).
- Day 6: deliver the Launch List to buyer(s), ask for a one-line testimonial.
- Day 7: review: sends, replies, objections. If reply rate is below 8 percent
  after 60 sends, rewrite the opener (kill criterion). If a reply turns into a
  Radar question, pitch founding subscription at KES 3,500.

Realistic first dollar: between day 2 and day 14. The one-off list is the
fastest yes (low ticket, instant deliverable); the Radar compounds after.

## 8. Metrics that matter (weekly, logged in the CSV)

sends, replies, calls/meetings, invoices, paid. Kill criteria: reply rate
below 8 percent after 60 sends means the opener or the ICP is wrong; refund
any buyer who says the list did not match its description. The 90-day picture:
10 Radar founders (approx USD 270/mo) plus 20 list sales (approx USD 580
one-off) plus 1-2 operator sponsorships is a plausible USD 800-1,200 month by
mid-January, before any P3/P4 upside.

## 9. Evidence discipline (house rules apply to sales too)

- Every prospect row starts UNREVIEWED with a source URL. Company-level
  business contacts only; no personal emails or private numbers, ever.
- Announced is not operational: any why-now claim in sales material cites the
  same evidence register standards as the tracker (REPORTED vs CONFIRMED
  wording carried into pitches).
- Nothing in this plan publishes until the editor approves pricing.
- The Nxtra Airtel Tatu City build (ict.go.ke, Sep 2025, East Africa's largest
  claim needs page-level verification) is flagged as a candidate queue record,
  not auto-ingested.

## 10. Files in this package

- `docs/revenue/first-dollar-plan.md` (this file)
- `docs/revenue/outreach-kit.md` (templates, cadence, objections)
- `docs/revenue/radar-issue-000-sample.md` (the attachable free sample)
- `intelligence/prospects/README.md` (schema + rules)
- `intelligence/prospects/2026-10-14-launch-list.csv` (the named list)
- `scripts/revenue/apify-prospect-commands.md` (scale-up, token rotation)
- `scripts/task147_icp_research.py` (the research battery, rerunnable)
