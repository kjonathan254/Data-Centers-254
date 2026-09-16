---
title: "Disaster Recovery for Kenyan Businesses: A Playbook"
slug: "disaster-recovery-business-continuity-kenya"
meta_description: "Cable cuts, grid trips and floods are normal Kenyan events. A practical disaster recovery and business continuity playbook built for Kenyan conditions, not textbook ones."
primary_keyword: "disaster recovery Kenya"
secondary_keywords:
  - "business continuity Kenya"
  - "DR site Nairobi"
  - "RTO RPO explained"
  - "Kenya internet outage"
  - "colocation disaster recovery"
  - "CBK business continuity"
author: "Kevin Jonathan Otieno"
author_bio_link: "/about"
published_date: "2026-09-16"
updated_date: "2026-09-16"
category: "Infrastructure"
cluster: "Kenya"
og_image: "/images/ups-switchgear-power-room.webp"
reading_time: "11 min"
images:
  - src: "/images/ups-switchgear-power-room.webp"
    alt: "UPS units and switchgear in a data centre power room"
    caption: "Disaster recovery is decided in rooms like this long before any disaster: what rides through, what switches over, and who gets called at 2am"
    position: "hero"
  - src: "/images/submarine-cables-map.webp"
    alt: "Map of submarine cables serving the East African coast"
    caption: "In May 2024, damaged undersea cables slowed or cut connectivity across East Africa for weeks. A Kenyan continuity plan that assumes one cable is a plan for downtime"
    position: "inline"
  - src: "/images/kenya-wind-turbines-4.webp"
    alt: "Wind turbines and transmission infrastructure in Kenya"
    caption: "Grid trips are a Kenyan normal, not an anomaly. The facilities that shrug at them bought redundancy early and test it more often than the grid fails"
    position: "section-break"
internal_links:
  - text: "what SLA uptime numbers actually guarantee"
    href: "/articles/data-centre-sla-uptime-guarantees"
  - text: "why UPS and backup power design matters"
    href: "/articles/ups-backup-power-kenyan-data-centres"
  - text: "how Starlink fits as a diverse backup link"
    href: "/articles/starlink-kenya-data-centres-backup-link"
  - text: "choosing between Nairobi and Mombasa for sites"
    href: "/articles/nairobi-vs-mombasa-data-centre-locations"
  - text: "the Data Protection Act duties when systems fail"
    href: "/articles/kenya-data-protection-act-data-centres"
external_sources:
  - title: "Internet Society, 2024 East Africa Submarine Cable Outage Report (23 Jul 2024)"
    url: "https://www.internetsociety.org/resources/doc/2024/2024-east-africa-submarine-cable-outage-report/"
  - title: "Citizen Digital, Internet disruption: Why Kenyans may have to wait longer (14 May 2024; businesses triggering business continuity processes after cable cuts)"
    url: "https://citizen.digital/"
  - title: "BBC News, Africa's internet vulnerability and how to fix it (14 May 2024)"
    url: "https://www.bbc.com/news/world-africa-69002429"
  - title: "Central Bank of Kenya, Prudential guideline on business continuity management for institutions licensed under the Banking Act (January 2008)"
    url: "https://www.centralbank.go.ke/"
  - title: "Bowmans, Navigating data breaches in Kenya under the Kenyan data protection law (23 Jan 2024; notification duties that survive a disaster)"
    url: "https://bowmanslaw.com/insights/navigating-data-breaches-in-kenya-under-the-kenyan-data-protection-law/"
faq:
  - question: "What is the difference between disaster recovery and business continuity?"
    answer: "Business continuity is the whole plan for keeping the business running through a disruption, including people, premises, suppliers and processes. Disaster recovery is the technology slice of it: restoring systems, data and connectivity after an incident. A Kenyan shop with a generator, a second internet provider and a printed manual for taking orders on paper has business continuity; the same shop's nightly offsite backup is its disaster recovery."
  - question: "What are RTO and RPO in plain terms?"
    answer: "RTO, recovery time objective, is how long you can afford to be down before the damage outruns the business: it is the clock on your recovery. RPO, recovery point objective, is how much data you can afford to lose, measured backwards from the moment of failure: an RPO of one hour means you must be taking data copies at least hourly. Every DR design decision, and most of its cost, flows from those two numbers."
  - question: "What disruptions should a Kenyan continuity plan actually expect?"
    answer: "The documented normal: undersea cable damage that degraded East African connectivity for weeks in 2024, fibre cuts on land as construction and weather take out routes, grid trips and load management, flooding that hits both power and roads, and cyber incidents including the national-scale DDoS attacks of July 2023. A good Kenyan plan assumes any two of these can overlap, because eventually they will."
  - question: "Do Kenyan regulations require business continuity planning?"
    answer: "For financial institutions, yes in practical terms: the Central Bank of Kenya has required business continuity management for banks under the Banking Act since its January 2008 prudential guideline, and its ICT risk guidance expects tested recovery arrangements. Separately, the Data Protection Act 2019 imposes breach notification duties that a disaster can trigger, because a fire or flood that exposes personal data is still a notifiable event. Other sectors follow the same patterns through their own regulators and insurers."
  - question: "Where should a Kenyan business put its DR site?"
    answer: "The practical rule is separation by failure domain, not just distance. A Nairobi business that picks another Nairobi building survives a building loss but not a metro fibre event; adding a Mombasa site, or a second provider in a different network and power domain, covers the wider failures. Cloud and colocation both work as DR sites; what matters is diverse power, diverse connectivity and a tested path to fail over."
canonical_url: "https://data-centers-254.vercel.app/articles/disaster-recovery-business-continuity-kenya"
---

Every Kenyan business has a disaster recovery story it did not choose. The May 2024 undersea cable cuts slowed or severed East Africa's connectivity for weeks and forced businesses to activate continuity plans as a routine rather than an exception (Citizen Digital, 14 May 2024; Internet Society, 23 July 2024). The July 2023 DDoS attacks took government portals offline at national scale. Fibre cuts, grid trips and floods arrive with the seasons. None of this is unusual, and that is precisely the point: in Kenya, disruption is not a tail risk, it is a scheduled guest, and the businesses that survive it treat continuity as engineering rather than paperwork.

This playbook is built for those conditions. It covers the two numbers that decide everything, the failure modes Kenya actually produces, the design patterns that answer them, and the testing discipline that separates a plan from a wish.

![UPS units and switchgear in a data centre power room](/images/ups-switchgear-power-room.webp)

## Start with two numbers, not a product

Everything in DR pricing and design flows from two questions the business must answer honestly before talking to any vendor.

**RTO: how long can you be down?** The recovery time objective is the clock. A market payment platform may have an RTO measured in minutes; an internal HR system may tolerate days. Write the number down per system, because "all systems are critical" is the answer that makes every solution unaffordable.

**RPO: how much data can you lose?** The recovery point objective is measured backwards from failure. An RPO of zero means synchronous replication, expensive and distance-limited. An RPO of 24 hours means nightly backups, cheap and fragile. Most Kenyan SMEs discover they have an implicit RPO of "whenever the backup last ran", which is a hope, not a number.

The cost curve is brutal and clarifying: recovering in minutes costs orders of magnitude more than recovering in hours. The professional move is tiering: payment systems get near-zero RTO and RPO, customer databases get an hour, email gets a day. Nobody can afford uniform perfection, and nobody needs it.

## The Kenyan failure catalogue

Design for the failures that actually happen here, and they cluster into four families.

**Connectivity.** The 2024 cable cuts were the national lesson: multiple undersea systems were damaged and East African connectivity degraded for weeks (BBC, 14 May 2024). On land, fibre cuts from roadworks, theft and weather are chronic. The design answer is diversity that is genuinely diverse: two providers over different physical routes, ideally with a non-terrestrial backup such as satellite for management traffic, because two providers sharing one fibre duct share one backhoe.

**Power.** Grid trips and load management are a Kenyan normal. Facilities answer with the classic chain, UPS ride-through, generators, fuel contracts, and businesses answer by hosting in facilities whose redundancy they can audit rather than running their own server rooms. The grid is not the enemy; single-path dependence is.

**Facility and environment.** Fire, flood, cooling failure, building access loss. This is what Tier ratings and SLAs price in: concurrent maintainability means the facility can lose a component and keep running while it is fixed. Our [SLA article](/articles/data-centre-sla-uptime-guarantees) decodes what the nines actually buy.

**Cyber.** The July 2023 national attacks proved that a flood of junk traffic can degrade services that millions depend on, and ransomware remains the scenario that turns backups into the whole company. Continuity planning and security are the same discipline wearing different badges; the DR site that was never tested is exactly the one ransomware will find unprepared.

![Map of submarine cables serving the East African coast](/images/submarine-cables-map.webp)

## The four patterns that work in Kenya

**Pattern one: backup, done honestly.** Nightly copies, offsite, immutable where possible, restored monthly on a schedule. This covers RPOs of a day and RTOs of days. It is the floor, not the plan, but it is also the pattern that saved every business whose ransomware story had a happy ending.

**Pattern two: warm DR in a colocation facility.** Replicate the critical systems to a second site, in a facility with Tier III power and a different network footprint, and keep them warm: data current, capacity reserved, failover rehearsed. For a Kenyan enterprise this is the sweet spot: Nairobi colocation with a DR footprint in Mombasa, or two providers in separate power and network domains, converts the cable-cut and grid-trip scenarios from crisis to inconvenience.

**Pattern three: cloud as the disaster site.** Replicate to a cloud region (today, that means outside Kenya for most providers) and accept the latency and data-residency conversation that follows. The cloud pattern shines for elastic recovery: if the DR load only runs during failures, you pay for it only when it runs. Our [cloud comparison](/articles/cloud-services-kenya-compared) covers the trade-offs.

**Pattern four: multi-site production.** The bank pattern: run actively in two locations, each able to carry the other, with data synchronously or near-synchronously replicated. Maximum cost, minimum drama. It is the pattern the CBK's continuity expectations effectively push financial institutions toward, and the reason Nairobi-Mombasa and Nairobi-Kampala pairs appear in regional architecture diagrams.

![Wind turbines and transmission infrastructure in Kenya](/images/kenya-wind-turbines-4.webp)

## The testing discipline

An untested DR plan is a document that lies to you. The professional cadence in Kenyan practice looks like this.

**Monthly:** restore something from backup, rotating systems, and measure how long it took against the RTO. **Quarterly:** a tabletop walkthrough of one scenario, cable cut, ransomware, building loss, with the actual people who would respond. **Annually:** a live failover of a real system to the DR site, with users on it, during business hours, accepting the risk that the test itself may cause a small outage, because that risk is the cheapest tuition you will ever pay. **After every real incident:** a written review that updates the plan, because every disaster is a free audit if you let it be.

Add the human layer that no diagram shows: printed call trees that work when the phone network is degraded, out-of-band access to the DR site that does not ride the production network, and wallets with fuel money, because continuity is sometimes a person with a diesel receipt.

## The compliance tail

Two Kenyan legal hooks attach to all of this. Financial institutions carry the Central Bank of Kenya's business continuity expectations, in place since the January 2008 prudential guideline and extended through ICT risk guidance. And the Data Protection Act follows you into disasters: a flood that soaks a server room, or a fire that scatters records, can be a notifiable personal data breach, with the same duties as a cyber intrusion (Bowmans, 23 January 2024). The DR plan should therefore include a notification step, because the regulator's clock starts at discovery, not at recovery.

The final word belongs to the numbers. Kenya's internet will be cut again, the grid will trip again, and the cables will break again in somebody's anchorage. The businesses that meet those events calmly will be the ones that picked two honest numbers, built to them, and rehearsed until failover was boring. Boring, in disaster recovery, is the whole prize.
