---
title: "Nigeria's Payment Data Mandate: Lessons for Kenya"
slug: nigeria-data-localisation-kenya-data-centres
meta_description: "Nigeria's central bank ordered all payment transaction data hosted onshore by January 2027. What it did to data centre demand, and the lessons for Kenya."
primary_keyword: "Nigeria data localisation directive"
secondary_keywords:
  - "CBN payment data localisation"
  - "Nigeria payment data January 2027"
  - "Kenya data localisation CBK"
  - "data centre demand regulation Nigeria"
author: "Kevin Jonathan Otieno"
author_bio_link: "/about"
published_date: "2026-11-06"
updated_date: "2026-11-06"
category: "Policy"
cluster: "Policy"
og_image: "/images/dc-policy-regulation.webp"
reading_time: "10 min"
images:
  - src: "/images/dc-policy-regulation.webp"
    alt: "Regulatory framework documents on a desk representing central bank data rules"
    caption: "A regulator with a deadline is the fastest demand signal a data centre market can receive. Nigeria's payment data rule turns local capacity into a legal requirement from January 2027"
    position: "hero"
  - src: "/images/dc-business-investment.webp"
    alt: "Investment discussions around data centre infrastructure growth"
    caption: "Nigeria's localisation deadline is pulling capital into Lagos facilities: Equinix, Nxtra and Kasi Cloud are all building toward the January 2027 compliance date"
    position: "section-break"
  - src: "/images/constitution-of-kenya-2010.webp"
    alt: "The Constitution of Kenya 2010, foundation of the country's data protection framework"
    caption: "Kenya's Data Protection Act 2019 takes a sovereignty approach rather than blanket localisation: cross-border transfers are conditional, not banned"
    position: "inline"
internal_links:
  - text: "Kenya's data sovereignty and localisation framework"
    href: "/articles/kenya-data-sovereignty-localisation"
  - text: "the Kenya Data Protection Act and data centres"
    href: "/articles/kenya-data-protection-act-data-centres"
  - text: "how African data centre regulation compares"
    href: "/articles/africa-data-centre-regulation-compared"
  - text: "what Kenyan data centre power costs mean for operators"
    href: "/articles/kenya-data-centre-power-costs-world-bank"
  - text: "the data centre tracker"
    href: "/tracker"
external_sources:
  - title: "Central Bank of Nigeria, Circular on Market Structure Requirements, Data Localisation, Ultimate Beneficial Ownership Disclosure, and Systemic Oversight Measures in the Nigeria Payments System (15 June 2026)"
    url: "https://www.cbn.gov.ng/Out/2026/CCD/CIRCULAR%20ON%20INTRODUCTION%20OF%20MARKET%20STRUCTURE%20REQUIREMENTS,%20DATA%20LOCALISATION,%20ULTIMATE%20BENEFICIAL%20OWNERSHIP%20DISCLOSURE,%20AND%20SYSTEMIC%20OVERSIGHT%20MEASURES%20IN%20THE%20NIGERIA%20PAYMENTS%20SYSTEM.pdf"
  - title: "TVC News, CBN Data Localisation Directive Triggers Multi-Billion Naira Infrastructure Push (30 October 2026)"
    url: "https://www.tvcnews.tv/cbn-data-localisation-directive-triggers-multi-billion-naira-infrastructure-push/"
  - title: "Nairametrics, CBN data localization rule: only 59% of banks, fintechs ready for January deadline (29 October 2026)"
    url: "https://nairametrics.com/2026/10/29/cbn-data-localization-rule-only-59-of-banks-fintechs-ready-for-january-deadline/"
  - title: "Guardian Nigeria, CBN insists on local data hosting as 59% of firms set for 2027 migration (29 October 2026)"
    url: "https://guardian.ng/business-services/cbn-insists-on-local-data-hosting-as-59-of-firms-set-for-2027-migration/"
  - title: "Capacity Media, Nigeria's payment data must stay onshore by January 2027: Here's what that means for data centres (10 August 2026)"
    url: "https://capacityglobal.com/news/nigerias-payment-data-must-stay-onshore"
  - title: "Kenya Data Protection Act, 2019, Kenya Law"
    url: "https://kenyalaw.org/kl/fileadmin/pdfdownloads/Acts/2019/DataProtectionAct2019.pdf"
faq:
  - question: "What did the Central Bank of Nigeria order?"
    answer: "Circular PSS/DIR/PUB/CIR/001/004, issued on 15 June 2026, requires all payment transaction data generated within Nigeria to be stored and managed within Nigeria, in accordance with applicable Nigerian data protection laws. Full compliance is required with effect from 1 January 2027. It applies to deposit money banks, microfinance banks, mobile money operators, payment solution providers and other payments ecosystem participants."
  - question: "Does Kenya require data localisation?"
    answer: "Not as a blanket rule. The Data Protection Act 2019 (Sections 48 to 50) allows cross-border transfers to jurisdictions with adequate protection or under appropriate safeguards such as contractual clauses or consent. Sector rules are tighter: Central Bank of Kenya guidelines require banks, microfinance institutions and payment service providers to host core banking data, customer financial records and transaction data on servers located in Kenya."
  - question: "Can Nigerian institutions keep backups or analytics copies offshore?"
    answer: "Compliance analyses, including PwC's, say no. Hosting a primary database in Nigeria does not demonstrate compliance if backups, disaster-recovery replicas, analytics extracts, logs, test environments or third-party copies of payment transaction data remain offshore. Institutions are expected to produce data-flow maps, hosting inventories and certified evidence of the repatriation or deletion of offshore copies."
  - question: "What would a Kenyan equivalent of the CBN directive look like?"
    answer: "A Central Bank of Kenya circular naming payment transaction data specifically, setting a public compliance deadline and expecting documented evidence of onshore residency, in the style of Nigeria's PSS/DIR/PUB/CIR/001/004. Kenya's current requirements for financial institutions sit in prudential guidance without a comparable public deadline. What to watch: CBK guidance updates, Office of the Data Protection Commissioner determinations on Section 48 transfers, and government procurement rules for hosted workloads."
canonical_url: "https://data-centers-254.vercel.app/articles/nigeria-data-localisation-kenya-data-centres"
---

On 15 June 2026, the Central Bank of Nigeria issued circular PSS/DIR/PUB/CIR/001/004, signed by the Director of its Payments System Supervision Department, Dr Rakiya Yusuf. The instruction is one sentence long in substance: payment transaction data generated within Nigeria must be stored and managed within Nigeria, in accordance with applicable Nigerian data protection laws and regulations. Full compliance is required with effect from 1 January 2027, and the circular reaches deposit money banks, microfinance banks, mobile money operators, payment solution providers and other participants in the payments ecosystem. For an industry built on offshore hosting and global cloud contracts, that is not a compliance tweak. It is a deadline that converts local data centre capacity from a commercial preference into a legal requirement, and it is the clearest natural experiment Africa has yet produced in regulation-driven data centre demand. Kenya, whose own rules take a very different shape, should read the results carefully.

## What the Central Bank of Nigeria Actually Ordered

The circular requires that payment transaction data generated in Nigeria be stored and managed within Nigeria, in line with the Nigeria Data Protection Act 2023 and related regulation. The idea is not new. NITDA's Guidelines for Nigerian Content Development already restrict the offshore hosting of sovereign data, and the NDPA's cross-border transfer regime already conditions international transfers on adequacy or safeguards. What the circular adds is specificity and force: a named data category, payments transactions, a named universe of regulated institutions, and a public deadline with no transition path announced.

The practical effect is well captured by Capacity Media's analysis: a standard contractual clause can still support a lawful international transfer under the NDPA, but it can no longer substitute for actual data residency. From January 2027, location is the requirement, not the paperwork around it. That distinction matters for every cloud contract, card scheme arrangement and outsourcing agreement a Nigerian financial institution signed in the era when safeguards were enough.

## What Compliance Actually Takes

The compliance industry's read is more demanding than the circular's one-line rule suggests. PwC's impact evaluation makes the point that hosting a primary database in Nigeria does not, on its own, demonstrate compliance: an institution may still be non-compliant if backups, disaster-recovery replicas, analytics extracts, logs, test environments or third-party copies of payment transaction data remain offshore. Demonstrating compliance to the CBN is expected to require a technical evidence pack: data-flow and data-lineage maps, inventories of confirmed hosting locations, cloud configuration logs, and certified evidence of the repatriation or deletion of offshore copies. PwC also carries a warning for the architecture stage: moving both primary and recovery environments into Nigeria without redesigning them could reduce geographic separation and increase exposure to a common failure.

KPMG's industry assessment identifies six readiness gaps Nigerian operators must close to host financial-sector workloads: infrastructure resilience (power, cooling and network redundancy), security and compliance maturity, capacity and scalability, disaster recovery and business continuity, operational excellence, and specialised skills. The scale of what has to move explains why. Nigeria's NIBSS instant payment platform processed a record 11.2 billion transactions in 2024, up 120 percent between 2022 and 2024, per figures highlighted by KPMG. CBN figures cited by industry analysts put total electronic payment volumes at 16.3 billion in 2021, 38.7 billion in 2023 and a projection above 60 billion for 2026. Regulations mandate a five-year retention period for customer and transaction records. Every one of those records now has to live on Nigerian soil, in facilities built for financial-grade uptime. Readiness, meanwhile, is running behind the deadline: industry surveys reported by Nairametrics and Guardian Nigeria in October 2026 put only 59 percent of banks and fintechs as ready for the January 2027 migration.

## What It Did to Data Centre Demand

The infrastructure response arrived faster than most demand forecasts do, because a deadline does what a forecast cannot: it removes the option of waiting. Equinix is opening its 22 million dollar LG3 facility in Lagos, the first phase of a 100 million dollar African expansion plan. Airtel's Nxtra subsidiary has broken ground on a 38 megawatt hyperscale campus at Eko Atlantic in Lagos, a build reported at 120 million dollars. Kasi Cloud, backed in part by Nigeria's sovereign wealth fund, commissioned what it calls West Africa's first hyperscale-ready, AI-capable campus in Lekki in May 2026, with plans to scale to 100 megawatts. Lagos state has set a target of tripling the city's data centre capacity to more than 250 megawatts by 2030. Against the continent's roughly 360 megawatts of live capacity reported by the Africa Data Centres Association, these are material additions concentrated in one city, pulled forward by one circular.

![Investment discussions around data centre infrastructure growth](/images/dc-business-investment.webp)

The constraint should sound familiar to Kenyan readers: power. Nigeria's national electricity generation has hovered between 3,000 and 4,000 megawatts, and energy costs for data centre operators reportedly rose more than 64 percent in the first half of 2026. The World Bank's November 2026 diagnosis of Kenya's power costs is, on this axis, a regional story: [delivered power cost is the constraint that decides which markets get built for](/articles/kenya-data-centre-power-costs-world-bank), and a localisation mandate without affordable firm power turns a demand signal into a cost spiral. PwC adds a distributional warning that matters for policymakers everywhere: fintechs and smaller operators reliant on global cloud providers face a capital outlay their balance sheets may not absorb, which can strengthen better-funded incumbents even as it grows the market.

## Kenya's Rulebook, by Contrast

Kenya's framework starts from a different premise. The Data Protection Act 2019 does not impose blanket localisation. Sections 48 to 50 allow cross-border transfers to jurisdictions offering adequate protection or where appropriate safeguards exist, such as binding corporate rules, contractual clauses or the data subject's informed consent. Our [explainer on Kenya's data sovereignty and localisation framework](/articles/kenya-data-sovereignty-localisation) calls this a sovereignty approach rather than a localisation mandate, and [the Act's specific implications for data centres](/articles/kenya-data-protection-act-data-centres) follow from that choice.

Sector regulation is where Kenya's version of the CBN directive already half-exists. Central Bank of Kenya guidelines require financial institutions, including banks, microfinance institutions and payment service providers, to host core banking data, customer financial records and transaction data on servers located within Kenya, with supervisory notification requirements attached. The difference from Nigeria is one of form and force. Kenya's requirement lives in prudential guidance, applied through supervision, without a named public deadline, a named data category or the compliance-evidence culture Nigeria's circular has created overnight. Nigeria's approach also draws the physical-versus-operational distinction that Forbes Africa's November 2026 feature emphasised: where data sits is only half of sovereignty, and who controls and processes it is the other half.

![The Constitution of Kenya 2010, foundation of the country's data protection framework](/images/constitution-of-kenya-2010.webp)

## Will Kenya Follow?

No Kenyan equivalent of the CBN circular has been announced, and nothing in this article should be read as predicting one. But the question is now live in a way it was not in June. The Nigerian precedent shows what a Kenyan version would look like: a CBK circular naming payment transaction data specifically, setting a compliance deadline and expecting documented evidence of onshore residency. The triggers to watch are CBK guidance updates, determinations by the Office of the Data Protection Commissioner on Section 48 transfer disputes, and government procurement rules for hosted public workloads. Our [comparison of African data centre regulation](/articles/africa-data-centre-regulation-compared) tracks exactly this kind of divergence.

The strategic logic is worth stating plainly. Kenya's data centre pipeline, the [facilities our tracker separates into live, under-construction and proposed](/tracker), is built on demand faith: AI ambitions, hub positioning, regional connectivity. Nigeria demonstrates that regulation is the fastest instrument for converting that kind of pipeline into commissioned capacity, because it gives every bank, fintech and mobile money operator a legal reason to sign a colocation contract this year rather than next. The counterweight is the one the World Bank documented: a demand mandate layered on expensive delivered power raises costs instead of capacity. Kenya does not need to copy the instrument to learn the lesson, but it should be honest about the trade it would be making.

## What Operators and Buyers Should Take From It

For operators, the Nigerian readiness-gap list is a checklist for any market: power, cooling and network redundancy for mission-critical financial workloads, security and audit maturity, disaster recovery that survives being moved, and the operational discipline to prove all of it. For enterprise buyers and fintechs in Kenya, the useful export is the due-diligence discipline: data-flow maps, hosting inventories, offshore-copy registers and clear recovery architecture are questions worth asking of any [colocation provider in Nairobi](/articles/colocation-pricing-kenya-explained), not only when a regulator demands them. And for policymakers, Nigeria's experiment offers both the upside, visible capital from Equinix, Nxtra and Kasi Cloud, and the risks, from fintech cost burdens to resilience design failures. Demand certainty is the cheapest subsidy a data centre market can give itself. Power cost is what decides whether that certainty turns into buildings.

Sources: Central Bank of Nigeria (circular PSS/DIR/PUB/CIR/001/004, 15 June 2026, localisation requirement and 1 January 2027 deadline); TVC News (30 October 2026, circular details and signatory, PwC and KPMG impact evaluations, NIBSS transaction figures, five-year retention rule); Nairametrics and Guardian Nigeria (29 October 2026, 59 percent readiness survey); Capacity Media (10 August 2026, compliance mechanics, Equinix/Nxtra/Kasi Cloud/Lagos capacity figures, power constraint); Forbes Africa (4 November 2026, ADCA capacity figures); Kenya Law (Data Protection Act 2019). NITDA guidelines and NDPA context reflect the public text of those instruments. Kenya-side requirements reflect DC254's existing verified coverage of the Data Protection Act and CBK guidelines. Facts verified 6 November 2026.
