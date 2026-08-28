---
title: "Data Centre Due Diligence in Kenya: A Checklist for Enterprise Customers"
slug: "data-centre-due-diligence-kenya"
meta_description: "Choosing a Kenyan data centre requires rigorous evaluation of power, cooling, connectivity, security, and compliance. This due diligence checklist covers every factor a bank, telco, or enterprise should assess before signing a contract."
primary_keyword: "data centre due diligence Kenya"
secondary_keywords:
  - "how to choose data centre Kenya"
  - "data centre evaluation checklist"
  - "colocation assessment Kenya"
  - "data centre SLA Kenya"
  - "data centre site visit guide"
author: "Kevin Jonathan Onyango Otieno"
author_bio_link: "/about"
published_date: "2026-08-28"
updated_date: "2026-08-28"
category: "Business Guide"
cluster: "Kenya"
og_image: "/images/og-default.png"
reading_time: "14 min"
images:
  - src: "/images/dc-servers-racks.png"
    alt: "Server racks during a data centre site visit"
    caption: "A site visit should include a thorough inspection of the white space, power rooms, cooling plant, and security systems — not just the lobby and meeting rooms"
    position: "hero"
  - src: "/images/dc-security.webp"
    alt: "Security systems assessment during due diligence"
    caption: "Physical security is one of the most visible differentiators between facilities — look for biometric access, mantraps, CCTV coverage, and security staffing levels"
    position: "section-break"
  - src: "/images/dc-power-systems.webp"
    alt: "Power infrastructure inspection"
    caption: "Ask to see the generator room, UPS systems, and switchgear — the power infrastructure is too important to evaluate only through a sales presentation"
    position: "inline"
  - src: "/images/dc-networking.webp"
    alt: "Network and connectivity evaluation"
    caption: "Verify which network providers have equipment in the meet-me room and whether diverse fibre entry routes are in place"
    position: "inline"
internal_links:
  - text: "data centre security explained"
    href: "/articles/data-centre-security-explained"
  - text: "data centre tier ratings"
    href: "/articles/data-centre-tier-ratings-explained"
  - text: "data centre directory"
    href: "/directory"
external_sources:
  - title: "Uptime Institute - Site Verification"
    url: "https://uptimeinstitute.com/"
  - title: "ISO 27001 Certification"
    url: "https://www.iso.org/isoiec-27001-information-security.html"
faq:
  - question: "What is data centre due diligence?"
    answer: "Data centre due diligence is the systematic evaluation of a facility before committing to place your equipment and data there. It covers physical infrastructure (power, cooling, building), connectivity, security, compliance, financial stability, and contractual terms. For enterprise customers in Kenya — banks, telcos, government agencies — due diligence is often required by regulators, auditors, or board governance policies."
  - question: "How long does a proper due diligence process take?"
    answer: "A thorough due diligence process typically takes 4-8 weeks for a standard colocation deployment. This includes issuing a detailed questionnaire (RFP/RFI), reviewing the responses, conducting one or more site visits, reviewing contracts and SLAs, obtaining legal and technical reviews, and negotiating final terms. For large deployments (100+ racks or dedicated suites), the process can take 3-6 months."
  - question: "Should I hire a consultant for data centre due diligence?"
    answer: "For most organisations, hiring a specialised data centre consultant is recommended for significant deployments. The cost of a consultant (typically KES 500,000-2,000,000 depending on scope) is small relative to the total cost of a multi-year colocation contract (KES 10-100+ million). A consultant brings expertise that most IT teams lack and can identify issues that non-specialists would miss."
  - question: "What are the most common red flags in Kenyan data centres?"
    answer: "Common red flags include: reluctance to allow a thorough site visit (especially the power and cooling plant rooms), vague or non-specific SLAs, inability to demonstrate actual uptime data, single fibre entry (no route diversity), generators that cannot support full load for extended periods, and staffing levels that seem too low for 24/7 operations. Also watch for facilities that claim Tier III certification but cannot produce a Uptime Institute certificate."
  - question: "What should I look for during a site visit?"
    answer: "Request access to the white space (server rooms), electrical rooms (generators, UPS, switchgear), cooling plant rooms (chillers, cooling towers), and the meet-me room (where network providers connect). Check for: cable management and labelling, temperature and humidity readings, signs of water damage or corrosion, generator fuel storage capacity, the condition and age of UPS batteries, whether the raised floor is clean and well-maintained, and whether security procedures are actually followed (not just stated)."
canonical_url: "https://data-centers-254.vercel.app/articles/data-centre-due-diligence-kenya"
---

Choosing a data centre is one of the most consequential infrastructure decisions a Kenyan organisation will make. Your servers, your data, and your customers' trust will reside in that facility for years. A bad choice — unreliable power, inadequate security, poor connectivity, or an operator in financial difficulty — can result in outages, data breaches, regulatory penalties, and reputational damage that far exceed the cost of the colocation contract itself. Due diligence is the process that prevents these outcomes.

![Server racks during a data centre site visit](/images/dc-servers-racks.png)

This guide provides a practical due diligence framework specifically designed for the Kenyan market. It covers every factor that an enterprise customer — a bank, a telecom company, a government agency, or a large corporate — should evaluate before placing equipment in a Kenyan data centre. While some of these factors are universal, others are specific to Kenya's infrastructure environment, regulatory context, and market dynamics.

## Phase 1: Pre-qualification

Before investing time in detailed due diligence, narrow the field to facilities that meet your basic requirements. This pre-qualification phase eliminates facilities that cannot serve your needs regardless of how well they perform in other areas.

### Location and Accessibility

Determine whether the facility's physical location works for your operations. If your IT team needs regular physical access to equipment, the facility should be within a reasonable distance of your office. For organisations in Nairobi's CBD, the Mombasa Road corridor is a 20–40 minute drive. For organisations in Westlands, a facility on Mombasa Road is less convenient than one in Westlands or Parklands.

Consider accessibility during different times of day and in different conditions. Nairobi traffic is notoriously heavy during rush hours, and a facility that takes 20 minutes to reach at midday may take 90 minutes at 5 PM. If you need 24/7 access for emergency work, can your team reach the facility at any hour? Is there adequate parking? Is the surrounding area safe for staff travelling at night?

### Capacity Availability

Confirm that the facility has the capacity you need, both now and for the foreseeable future. A facility that is 90% full may not be able to accommodate your growth. Ask about total capacity (racks, power, cooling), current utilisation, and expansion plans. A facility with expansion land or the ability to add power capacity is more future-proof than one that is already at its limits.

### Carrier Neutrality

If you need to connect to multiple network providers, confirm that the facility is carrier-neutral. Ask which providers have equipment in the meet-me room. A facility that only connects to one or two providers limits your connectivity options and negotiating leverage.

## Phase 2: Technical Evaluation

The technical evaluation is the most detailed phase of due diligence. It assesses the physical infrastructure that determines whether the facility can reliably house your equipment.

### Power Infrastructure

Power is the single most important technical factor. Evaluate the following elements in detail.

**Utility supply**: What is the facility's grid connection? Is it served by a dedicated Kenya Power feeder (preferred) or a shared feeder? What voltage level (11kV, 33kV)? What is the contracted demand? Has the facility experienced any grid outages in the past 12 months, and if so, how long and how frequently?

**Generators**: How many diesel generators are installed? What is their total capacity relative to the facility's IT load? The industry standard is N+1 (one spare generator) at minimum. How much fuel is stored on-site, and how long can the generators run at full load? The minimum standard for enterprise use is 24 hours of fuel storage; 48–72 hours is preferred. Are there contracts for emergency fuel delivery?

![Security systems assessment during due diligence](/images/dc-security.webp)

**UPS systems**: What UPS technology is used (online double-conversion is the standard for enterprise facilities)? What is the battery runtime? The minimum is 10–15 minutes — enough time for generators to start and synchronise. Are the UPS systems redundant (N+1 or 2N)? What is the age and condition of the batteries?

**Power distribution**: How is power distributed from the utility entry point to the racks? Look for redundant power paths (A and B feeds) to each rack. Ask about the power distribution unit (PDU) topology and whether each rack has dual PDUs on separate power paths.

### Cooling Infrastructure

Cooling is the second most critical technical factor.

**Cooling capacity**: What is the total cooling capacity, and how does it compare to the current and planned IT load? Cooling should have the same or greater redundancy as power (N+1 minimum).

**Cooling technology**: What type of cooling system is used? Precision air conditioning (CRAC/CRAH) is standard. Does the facility use free cooling (outside air) to reduce energy consumption? Nairobi's climate allows free cooling for significant portions of the year, and facilities that take advantage of this have lower operating costs and PUE values.

**Environmental monitoring**: Are temperature and humidity monitored continuously throughout the white space? Ask to see the building management system (BMS) and verify that sensors are placed at multiple points (not just at the return air of cooling units, but at rack inlets and hot aisles).

### Connectivity

Connectivity evaluation focuses on diversity and redundancy.

**Fibre entry diversity**: How many independent fibre routes enter the building? A single route creates a single point of failure — a road construction project could sever the only fibre connection and isolate the facility. Look for at least two physically diverse entry routes.

**Meet-me room**: Visit the meet-me room. Which network providers have equipment present? Is the room well-organised, with proper cable management and labelling? Is there space for additional providers?

**Cross-connect process**: How quickly can cross-connects be provisioned? What are the costs? Are there restrictions on which providers you can connect to?

![Power infrastructure inspection](/images/dc-power-systems.webp)

## Phase 3: Security Evaluation

Security evaluation covers both physical and cybersecurity. [Our security guide](/articles/data-centre-security-explained) covers the details; here we focus on what to verify during due diligence.

### Physical Security

Walk the security perimeter. Are all access points controlled? Are CCTV cameras covering all approaches, not just the main entrance? Ask about camera retention period (90 days minimum) and whether footage is monitored in real-time or recorded for later review.

Experience the access control process. Request a visitor badge and walk through the process. Does it include biometric verification? Are there mantraps? Is access logged? A facility that makes it easy for you to walk in unchallenged is not adequately secured.

Ask about security staffing levels. How many security personnel are on-site at different times of day? Are they employed directly by the data centre operator or by a security contractor? What training do they receive?

### Compliance and Certifications

Request copies of all certifications. ISO 27001 (information security management) is the most relevant for most customers. SOC 2 Type II reports, while more common in North American markets, are increasingly expected by international organisations. If the facility claims a Tier rating, verify whether it is self-declared or certified by the Uptime Institute. Self-declared Tier ratings carry less weight than independent certification.

## Phase 4: Business and Contractual Evaluation

The business evaluation assesses the operator's financial stability, the contract terms, and the SLA.

### Financial Stability

A data centre operator in financial difficulty may cut corners on maintenance, staffing, or investment — all of which affect the reliability of your service. Request financial information or, for privately held companies, assess indicators of financial health: customer base (diverse or dependent on one or two large customers), investment in facility maintenance and upgrades, staff retention, and payment history with suppliers (if you can assess this indirectly).

### Service Level Agreement

The SLA is the contractual backbone of the colocation relationship. Evaluate it carefully.

**Uptime guarantee**: What uptime percentage is guaranteed? For enterprise use, 99.99% (approximately 52 minutes of downtime per year) is the standard. 99.9% (8.7 hours per year) may be acceptable for non-critical workloads. Anything below 99.9% is insufficient for enterprise use.

**Service credits**: What financial compensation is provided if the SLA is not met? Are service credits applied automatically or only upon customer request? Are there caps on total service credits that limit your effective compensation?

**Exclusions**: What is excluded from the SLA? Scheduled maintenance, force majeure events, and customer-caused outages are commonly excluded. Read the exclusions carefully — some SLAs exclude so much that the guarantee is effectively meaningless.

![Network and connectivity evaluation](/images/dc-networking.webp)

### Contract Terms

Review contract duration, renewal terms, and termination conditions. Most enterprise colocation contracts are 3–5 years. Ensure that termination for cause is clearly defined and that you can exit the contract if the operator fails to meet material obligations. Consider whether the contract includes annual price escalation and, if so, whether the escalation is reasonable and predictable.

## Phase 5: The Site Visit

The site visit is where due diligence becomes real. Do not accept a guided tour that shows only the lobby, a meeting room, and a glass-walled viewing corridor into the white space. A proper site visit should include access to the white space, the electrical rooms, the cooling plant, and the meet-me room.

During the visit, observe the condition of the infrastructure. Are cable trays organised and labelled, or are cables hanging loosely? Is the white space clean and free of debris? Are floor tiles properly seated? Do the generators and UPS systems appear well-maintained? Is the cooling plant operating quietly and smoothly, or are there unusual noises or vibrations?

Talk to the operations staff, not just the sales team. The operations team's knowledge and professionalism are better indicators of day-to-day facility quality than any sales presentation. Ask them about recent incidents, how they handle maintenance, and what their biggest operational challenges are.

Due diligence is not a formality — it is the process that separates a good data centre decision from a costly mistake. In Kenya's growing but still developing market, the variation between facilities is significant, and the effort invested in thorough due diligence will pay for itself many times over the life of the contract.