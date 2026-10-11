# The Rack Report · Issue 003

**DC254 · Monday 13 October 2026 · Master editorial copy (source of truth for PDF + email editions)**

**Theme: Who Powers Kenya's Data Centres, and Who Is Telling Us?**

Numbering note (editor, 11 October 2026): this is the October edition; November's edition becomes Issue 004 (Monday 2 November 2026, 06:00 EAT). Issues are numbered and never skipped.

---

## 01 · THE HEADLINE

### Kenya's data centres run on one utility and a wall of backup generation. The renewable story still belongs to the grid, not the operators.

October delivered the ownership news Kenya's market has been waiting for: Digital Realty formally launched iColo's Nairobi Two on 7 September and transitioned the iColo brand to Digital Realty in Kenya, putting a global hyperscale operator's name on locally operating facilities. WIOCC Group secured US$300 million from Africa Finance Corporation and Vision Invest with data-centre capacity a stated priority. But while the ownership story moved, this month's quieter finding is about electricity. DC254 re-checked the power record for all 27 facilities and projects tracked in Kenya, field by field, source by source. Every single record starts from Kenya Power. Fourteen of the 27 disclose on-site backup generation alongside the grid. Only three carry any renewable-energy claim at all, and none of them is an operator-disclosed renewable power purchase agreement. Kenya's grid draws over 90% of its electricity from renewable sources, stated as a generation mix and not a guarantee of site-specific power delivery. That is the grid's achievement. As of 11 October 2026, no operator in this directory has put their own name on a renewable supply claim.

*Sources: DC254 directory, 31 records (27 Kenya, 4 East Africa), re-verified 11 October 2026; Digital Realty launch PR 7 September 2026, captured 10 October 2026; WIOCC Group announcement 3 September 2026, captured 10 October 2026*

## 02 · BY THE NUMBERS

### The verified board, and the power ledger behind it

**27** — facilities and projects tracked in Kenya (31 records including 4 East Africa reference records)

**20** — operational

**10.5 MW** — verified live IT load, published by 8 of the 20 operational facilities

**42.9 MW** — designed capacity across the operational fleet

**230 MW** — announced pipeline: 77 MW under construction, 53 MW committed, 100 MW early stage

**7** — submarine cable systems in service at Mombasa

**The power ledger, as disclosed** (how the 27 Kenyan records describe their electricity supply):

- Grid supply plus on-site backup generation — **14**
- Grid supply only, utility service stated — **6** (plus 1 grid connection recorded as planned)
- Redundancy-first configurations (2N power, dedicated infrastructure) — **3**
- Other disclosed configuration — **1**
- Power arrangement not disclosed — **2**

**Source confidence behind the power record:** High 7 · Medium 15 · Low 5. A High rating means the figure or description is confirmed by the operator's own materials plus an independent register. A Low rating means the public record is thin, and we say so rather than pad it.

*Sources: DC254 directory, re-verified 11 October 2026; operator disclosures and registries as recorded per facility*

## 03 · INFRASTRUCTURE INTELLIGENCE

### The UPS is being reinvented. Kenyan buyers should be asking what that means for their next hall.

The uninterruptible power supply has long been the quiet heart of the data centre power train, and it is also, per Uptime Institute's Annual Outage Analysis 2026 as reported by Data Center Knowledge, the leading cause of power-related outages: UPS failures account for 39% of power incidents, ahead of transfer switches (34%) and generators (28%). The AI era is forcing a rethink of the device itself. Hyperscale operators are moving toward rack-level battery backup inside Open Compute Project designs, 800 V DC distribution for AI factories, and campus-scale battery storage configured as a UPS alternative. Dell'Oro projects solid-state transformers will begin weighing on UPS demand from 2029. The one-line summary that matters for a renewables-heavy grid like Kenya's: the job is flipping from protecting the IT load from the grid to protecting the grid from the IT load.

**Four power-train architectures, one table:**

| Architecture | What it is | Status | What it means for buyers |
|---|---|---|---|
| Centralized UPS + diesel | Today's standard in Kenya and most markets | Installed base, evolving | Still the right baseline for colocation and enterprise loads |
| Rack-level BBU / OCP DC | Batteries in the rack, hyperscale DC designs | Deployed at hyperscalers | Relevant if AI-grade densities arrive; ask about DC-readiness |
| BESS as UPS alternative | Campus-scale battery storage replacing UPS role | First partnerships (2025), early | Watch electrical-room design and battery chemistry choices |
| Solid-state transformers | Power conversion without the legacy UPS role | Dell'Oro: demand impact from 2029 | A horizon item, not a procurement decision today |

Kenya's own fleet continues to run conventional designs, and no Kenyan operator has announced an 800 V DC or BBU-based facility. Treat these as global trends to monitor, not local deployments. The practical step is in how new halls are specified: ask vendors about lithium iron phosphate options, BESS-ready electrical rooms and higher-voltage DC readiness. Regionally, WIOCC Group's US$300 million investment (Africa Finance Corporation and Vision Invest, announced 3 September 2026) names data-centre capacity as a stated priority for the same sub-Saharan market.

Read the full analysis: data-centers-254.vercel.app/articles/ups-backup-power-kenyan-data-centres

*Sources: Uptime Institute Annual Outage Analysis 2026 as reported by Data Center Knowledge (6 October 2026), captured and verified 11 October 2026; Dell'Oro Group, 19 August 2026; DC254 directory, re-verified 11 October 2026*

## 04 · INSIDE THE MAP

### Seven live cables, and one RFS call that still has not come

DC254 currently tracks 10 submarine cable systems, with 7 in service: TEAMS and SEACOM (2009), EASSy (2010), LION2 (2012), DARE1 (2021), PEACE (2022) and 2Africa (2024). The count has not moved since 2024. Africa-1 has landed at Mombasa but has not announced ready for service, so it is not counted as live. Daraja, the Meta-backed cable hosted by Safaricom from Salalah to Mombasa, is announced. LuLu, the proposed 500 km coastal diversity route from Mombasa towards Lamu, is planned. One RFS announcement changes Kenya's live cable count for the first time since 2024, and this issue's power investigation is the mirror image of that waiting game: connectivity diversifies at the coast while the power story at the rack row remains a single utility plus diesel.

Explore the map: data-centers-254.vercel.app/infrastructure/map

*Sources: DC254 cable tracker, verified monthly; operator and consortium disclosures*

## 05 · POLICY WATCH

### The window closed. The decision has not arrived.

The Communications Authority of Kenya's consultation on the proposed standalone data-centre licensing framework closed on or about 8 October, thirty days from the 8 September publication. As of 11 October 2026, the Authority's consultation page still lists the proposal and DC254 has found no decision document, gazette supplement or outcome notice. The independent briefing circuit reaches the same position: the proposal remains on the regulator's consultation page, the current consultation status is unclear, and contacting the CA for the outcome is the named next action. The question that outlasts the deadline is unchanged: will the final framework create materially different regulatory positions between existing NFP and ASP licence holders, who can currently keep operating data centres without taking the new licence, and new entrants? We surface the question; we do not pretend to know the answer before the Authority does.

*Sources: Communications Authority of Kenya, consultation published 8 September 2026, page re-verified 11 October 2026; DC254 capture 24 September 2026; outcome sweeps 10 October 2026 found no decision document*

## 06 · WHAT WE'RE WATCHING

**WATCH 01 · The licensing decision.** The window is closed and the decision is now overdue rather than pending. Any outcome document moves the whole directory's licensing picture.

**WATCH 02 · Africa-1 ready for service.** One announcement moves Kenya's live cable count from 7 to 8 for the first time since 2024.

**WATCH 03 · The power-disclosure precedent.** Whether any Kenyan operator becomes the first to publish a renewable supply agreement or a live load figure. The directory has 27 chances a quarter to move this number.

## 07 · FROM DC254

**This issue's investigation is now on the record.** The full source-linked comparison behind the power ledger, all 27 Kenyan records with their disclosed power arrangements, renewable claims and source-confidence ratings, is published in this edition and mirrored in the directory's data. Every row carries its source-confidence rating, and the row-level source registers live in the directory's data.

**Access digital intelligence.** Explore the latest DC254 research, directory and infrastructure maps at data-centers-254.vercel.app/research. The deep reads behind this issue: Kenya Data-Centre Boom: What Should Operators Disclose? and UPS Systems and Backup Power for Kenyan Data Centres (updated October 2026).

---

## EDITOR'S NOTE

**Verification standard.** Every figure in The Rack Report carries its source and publication date, and we do not publish numbers we cannot trace to an operator, regulator or dated news report. Where plans are announced but not yet contracted, we say so in the same breath as the headline figure, because the difference between a plan and a project is where infrastructure stories go to hide. This issue's figures were re-verified against the DC254 dataset on 11 October 2026. The Uptime Institute outage percentages are cited as reported by Data Center Knowledge; the Dell'Oro solid-state transformer timeline is confirmed on Dell'Oro's own announcement of 19 August 2026.

**Corrections and tips.** Spotted something wrong or know something we should verify? DC254 corrects errors openly and quickly. Reach the newsroom through the contact page at data-centers-254.vercel.app, or reply to any edition of this briefing by email.

**Masthead.** Published by DataCentre254, Kenya's open data centre directory and intelligence library. An Elmac Communications Ltd publication. Written and edited by Kevin Jonathan Otieno. The Rack Report accepts one sponsor per issue, always clearly labelled, with audience numbers published live and never inflated.

---

## LINKEDIN POST COPY · Inside the Infrastructure (October)

We re-checked the power record for all 27 data centres and projects tracked in Kenya. One utility appears in every single record: Kenya Power. 14 of 27 disclose on-site backup generation. Only 3 records carry any renewable-energy claim at all, and none is an operator-disclosed renewable power purchase agreement.

Kenya's grid draws over 90% of its electricity from renewable sources. That is the grid's achievement, stated as a generation mix. The operators' own claims stop short of naming their supply.

Why it matters: the licensing window at the Communications Authority just closed, AI-era power trains are being redesigned globally, and the operators who can document their electricity story first will be the ones buyers, financiers and regulators trust first.

The full source-linked comparison, all 27 records with sources and confidence ratings, is in The Rack Report Issue 003: data-centers-254.vercel.app/rack-report

#DataCentres #Kenya #DigitalInfrastructure #Energy

---

*Compiled from reporting current to 11 October 2026. Sources dated in text. Figures re-verified 11 October 2026.*
