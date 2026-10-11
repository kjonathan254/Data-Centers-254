---
captured_at: 2026-10-11T00:00:00.000Z
source_url: https://www.datacenterknowledge.com/uptime/the-ups-is-uninterruptible-by-design-its-future-is-not-
final_url: https://www.datacenterknowledge.com/uptime/the-ups-is-uninterruptible-by-design-its-future-is-not-
title: "The UPS Is Uninterruptible by Design. Its Future Is Not."
tool: curl -sSL (browser UA; resolved from the editor's lnkd.in shortlink via LinkedIn post 7513342397364494336 by Data Center Knowledge)
http_status: 200
tier: 1
claims: [no existing claim ID - NEW reference record; candidate evidence for UPS article refresh (ups-backup-power-kenyan-data-centres.md), Rack Report 003 Power Watch item, and datacenterknowledge.com as a standing monitoring source]
status: verified # editor delegated execution 11 Oct 2026: "Now that you have the right information decide the next step you have authority"; figures follow the attribution rule (Uptime 2026 split cited in article copy as "as reported by Data Center Knowledge"; Dell'Oro SST-2029 independently verbatim on delloro.com; FlexGen+Rosendin confirmed by independent outlets)
note: Trade-press analysis from Data Center Knowledge (Informa TechTarget), Andrew Donoghue, published 6 Oct 2026 (modified 7 Oct). Three load-bearing figures independently verified same day at zero credit: (1) Uptime Institute Annual Outage Analysis 2026 confirmed to exist (8th edition, published May 2026, intelligence.uptimeinstitute.com 11 May 2026; Uptime press release; third-party corroborations consistent - power remains the leading outage cause, UPS failures the leading power failure); the specific 39/34/28 split is quoted by DCK from the report, which is paywalled - keep attribution "Uptime 2026 as reported by DCK" unless the report itself is later obtained. (2) Dell'Oro SST quote VERBATIM on delloro.com own newsroom (19 Aug 2026): "Solid-state transformers are projected to weigh meaningfully on UPS demand beginning in 2029, initially focusing on large AI factories" - citable directly to Dell'Oro, stronger than via DCK. (3) FlexGen Power Systems + Rosendin BESS-as-UPS-alternative partnership confirmed by multiple independent outlets June 2025 (DCD 4 Jun, Smart Grid Observer 6 Jun - names Rosendin's "BESSUPS" design, Renewable Energy World 11 Jun, evertiq 16 Jun, bestmag 9 Jun). Editorial read: this is exactly the analysis-grade, named-analyst material DC254's regional trade-press sources rarely carry; treat DCK as a standing T1-adjacent analysis source alongside Uptime/Dell'Oro primaries.
---

## Verbatim evidence (from the 200-OK HTML; full raw copy held at scripts/dck_ups_article.html during this session)

Page H1:

> The UPS Is Uninterruptible by Design. Its Future Is Not.

Dek:

> From rack-level batteries to BESS and solid-state transformers, new power architectures are reshaping where and whether the UPS belongs in the data center.

JSON-LD: author Andrew Donoghue; datePublished 2026-10-06T09:00:00.000Z; dateModified 2026-10-07T15:00:47.770Z; publisher Informa TechTarget (Data Center Knowledge).

Key body passages (verbatim):

> According to the Uptime Institute's Annual Outage Analysis 2026, power-related issues caused more than one in five IT service outages reported over the past three years. Within those power-related incidents, UPS failures were the leading cause, accounting for 39%, ahead of transfer switch failures (34%) and generator failures (28%).

> The same Uptime Institute Intelligence research points to a fire risk from UPS batteries: "The frequency of major fires at data centers as] increased gradually in recent years, with lithium-ion batteries in UPS systems a clear contributing factor. [...]"

> The current push toward higher-voltage DC in so-called AI factories, such as 800 V DC architectures, is again challenging the UPS's role. The emergence of sidecar power cabinets extends the distributed approach already common among hyperscale cloud providers [...]

> Alex Cordovil, research director at Dell'Oro Group, noted that the ability of large training clusters to swing by tens of megawatts in seconds has effectively flipped the UPS's job. "It's now less about protecting the IT load from the grid and more about protecting the grid from the IT load," he said. "The UPS has been given a death sentence a few times, and every time it has come back in a new form."

> in 2025, BESS supplier FlexGen Power Systems and electrical contractor Rosendin announced a partnership to develop utility-scale BESS to support data centers without traditional UPS systems.

> "Solid-state transformers are projected to weigh meaningfully on UPS demand beginning in 2029, initially focusing on large AI factories that have largely moved away from UPS-based architectures," according to a recent Dell'Oro update.

> Other innovations that could influence the UPS's design and role include supercapacitor technology, which can absorb and release power in milliseconds, and new battery chemistries such as sodium-ion, nickel-zinc, and lithium iron phosphate (LFP).

> The UPS is unlikely to disappear from the data center power train any time soon, especially given the large installed base of legacy sites serving non-AI workloads.

Named sources in the article: Luka Grahek (Socomec, Data Center Event Budapest, 29 Sep 2026); Alex Cordovil (Dell'Oro Group); Pasi Taimela (FlexGen chief innovation officer); Matthew Williams (founder and CEO, Ionate - hybrid intelligent transformer).

## What this capture establishes

1. T1 trade-press record (Informa TechTarget's Data Center Knowledge) that AI-era power architectures are repositioning the UPS: rack-level BBUs / OCP DC architectures, 800 V DC AI-factory designs with sidecar power cabinets, BESS configured as UPS alternatives, and solid-state transformers from 2029 (Dell'Oro, independently verbatim-confirmed on delloro.com).
2. Fresh outage statistics attributed to Uptime Institute Annual Outage Analysis 2026: power-related issues >1 in 5 IT service outages over the past three years; within power incidents - UPS 39%, transfer switch 34%, generator 28%; plus a Li-ion UPS fire-risk finding.
3. A reframing directly relevant to renewables-heavy grids: "less about protecting the IT load from the grid and more about protecting the grid from the IT load" (Dell'Oro) - Kenya's 90%+ renewable generation mix sits squarely in this frame.
4. datacenterknowledge.com is a viable standing analysis source: named analysts, primary-report citations, and vendor claims that resolve to independent confirmations (all three spot-checks passed).

## What this capture does NOT establish

- The 39/34/28 percentages from the Uptime report itself (paywalled; DCK is the intermediary - use "as reported by Data Center Knowledge citing Uptime 2026" unless the report is obtained).
- Any Kenya or EAC facility, vendor deployment, or BESS project - the article is global in scope with zero Africa-specific content.
- That any operator will actually abandon centralized UPS (the article's own conclusion is evolution, not disappearance: "The UPS has been given a death sentence a few times, and every time it has come back in a new form").
- Dell'Oro's SST adoption timeline beyond the quoted forecast statement (a projection, not a deployment fact).

## Recommended routing (editor's call)

1. UPS article refresh (ups-backup-power-kenyan-data-centres.md, published 28 Aug, currently cites Uptime only generically and carries zero AI-era content): add an "AI-era" section - Uptime 2026 outage numbers (upgrades the article's vaguest paragraph), 800 V DC / BBU trend, BESS-as-UPS-alternative, SST 2029 horizon - anchored to Kenya (dynamic renewables-heavy grid, legacy centralized UPS + diesel installed base; update_date bump + re-verify figures at publish).
2. Rack Report 003 (Mon 2 Nov) Power Watch item: "protecting the grid from the IT load" framing + the SST 2029 timeline; pairs with the disclosure-analysis power indicator.
3. Register datacenterknowledge.com as a standing monitoring source (firecrawl monitor / alerts candidates): analysis-grade Uptime/Dell'Oro citations surface there ahead of regional trade press. Second capture already worth watching: the article's related links (hydrogen/fuel cells, power electronics vs generator run hours, AI grid stress).
4. New standalone article is NOT recommended now - the refresh covers the demand; a separate "is the UPS dead?" piece would cannibalise the existing primary_keyword position (UPS systems Kenya).
