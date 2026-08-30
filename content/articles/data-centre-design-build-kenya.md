---
title: 'Data Centre Design and Build Process in Kenya: A Complete Guide'
slug: data-centre-design-build-kenya
meta_description: Learn the full data centre design and build process in Kenya — from
  site selection and feasibility studies to MEP design, construction, commissioning
  and handover, covering Kenya Power grid connection, NEMA EIA requirements, KEBS
  standards and Nairobi County building approvals.
primary_keyword: data centre design and build Kenya
secondary_keywords:
- data centre construction Kenya
- KEBS standards data centres
- NEMA environmental impact assessment data centre
- Kenya Power grid connection data centre
- data centre site selection Kenya
author: Kevin Jonathan Onyango Otieno
author_bio_link: /about
published_date: '2026-08-28'
updated_date: '2026-08-28'
category: Infrastructure
cluster: Infrastructure
og_image: /images/dc-gpu-cluster-5.webp
reading_time: "12 min"
images:
- src: /images/whats-inside-ai-data-center-wide.webp
  alt: Server racks inside a modern Kenyan data centre facility
  caption: Modern server rack installation during the fit-out phase of a Kenyan data
    centre build
  position: hero
- src: /images/dc-switchgear.webp
  alt: Electrical power distribution systems in a data centre
  caption: Power distribution infrastructure is a critical design element in any Kenyan
    data centre build
  position: section-break
- src: /images/dc-chillers-roof-3.webp
  alt: Data centre cooling systems including CRAC units and chilled water piping
  caption: Cooling system installation during the MEP phase of data centre construction
  position: inline
internal_links:
- text: Data Centre Tier Ratings Explained
  href: /articles/data-centre-tier-ratings-explained
- text: Kenya Power Infrastructure Data Centres
  href: /articles/kenya-power-infrastructure-data-centres
- text: Data Centre Due Diligence Kenya
  href: /articles/data-centre-due-diligence-kenya
external_sources:
- title: Kenya Bureau of Standards (KEBS) — Building and Construction Standards
  url: https://www.kebs.org
- title: National Environment Management Authority (NEMA) — EIA Guidelines
  url: https://www.nema.go.ke
faq:
- question: How long does it take to build a data centre in Kenya from site selection
    to commissioning?
  answer: The typical timeline ranges from 18 to 36 months depending on the facility's
    scale and tier classification. A Tier II or Tier III facility of 1–5 MW in Nairobi
    generally takes 18–24 months, while larger hyperscale deployments by operators
    like Africa Data Centres or Liquid Intelligent Technologies can extend to 30–36
    months. The site selection and feasibility phase alone can consume 3–6 months,
    especially when securing Kenya Power high-voltage grid connections and NEMA environmental
    impact assessment approvals. Delays in Nairobi County building plan approvals
    and imported equipment lead times for specialised MEP components can add further
    months to the schedule.
- question: What KEBS standards apply to data centre construction in Kenya?
  answer: Several KEBS standards are relevant to data centre builds. KS ISO/IEC 27001
    governs information security management in facility design. KEBS also references
    international standards such as KS EN 50173 for structured cabling, KS IEC 60364
    for electrical installations in buildings, and fire safety standards under KS
    CP 15 and the Kenya Fire Safety Act. For structural integrity, KS 641 (Code of
    Practice for Use of Concrete) and KS 02-300 (structural steel) apply. Data centre
    operators targeting Tier III certification also design against the Uptime Institute's
    Tier Standard Topology, which is adopted by reference in many Kenyan build specifications,
    though KEBS does not yet have a dedicated data centre construction standard.
- question: What is the Kenya Power grid connection process for a data centre?
  answer: Data centres typically require dedicated high-voltage connections (33 kV
    or 132 kV) from Kenya Power. The process involves submitting a formal application
    to KPLC with load projections, single-line diagrams, and site plans. KPLC then
    conducts a system study to confirm grid capacity at the proposed location. For
    facilities drawing over 1 MW, KPLC may require the developer to fund nearby substation
    upgrades or dedicated transmission lines. The connection agreement, metering setup,
    and commissioning of the supply typically take 6–12 months. Dual-feed redundancy
    is essential for Tier III facilities, requiring two independent power feeds from
    separate KPLC substations. The cost of grid connection can range from KES 50 million
    to over KES 500 million depending on proximity to existing high-voltage infrastructure.
- question: Does a data centre project in Kenya require an Environmental Impact Assessment?
  answer: Yes. Under Kenya's Environmental Management and Coordination Act (EMCA)
    1999, data centre projects fall under the category of large commercial and industrial
    developments that require an Environmental Impact Assessment (EIA) by NEMA-accredited
    lead experts. The EIA process includes a project brief submission, scoping report,
    full EIA study, and public participation with affected communities. NEMA evaluates
    impacts on air quality (from backup diesel generators), noise pollution, water
    consumption, wastewater discharge, and electromagnetic fields. For facilities
    within Nairobi or its metropolitan area, additional county-level environmental
    approvals may apply. The EIA licence is typically a prerequisite for obtaining
    Nairobi County building plan approvals, making it a critical-path item in the
    project schedule.
- question: Who are the main data centre design and build contractors operating in
    Kenya?
  answer: The Kenyan data centre construction ecosystem includes a mix of international
    specialists and local firms. Global data centre design firms such as Eaton, Schneider
    Electric, and Vertiv provide MEP design and equipment. For construction, firms
    like CPB Contractors (involved with Africa Data Centres), China Wu Yi, and local
    contractors including Gathoni & Partners, Spencon, and Interconsult have participated
    in data centre builds. Specialist MEP contractors handle the critical power and
    cooling installations. The ecosystem also includes commissioning agents, [data
    centre tier certification consultants](/articles/data-centre-tier-ratings-explained),
    and project management firms. As demand grows, more Kenyan engineering firms are
    building in-house data centre capabilities, though highly specialised roles like
    raised-floor installation, hot-aisle containment fabrication, and precision air-conditioning
    commissioning still rely partly on imported expertise.
canonical_url: https://data-centers-254.vercel.app/articles/data-centre-design-build-kenya
---


## Introduction: Why Data Centre Design and Build Matters in Kenya

Kenya's digital economy is expanding at a pace that demands robust, locally-built data centre infrastructure. With the government's Digital Economy Blueprint, the growing presence of hyperscale cloud providers, and increasing enterprise demand for [colocation services in Kenya](/articles/colocation-data-centre-kenya), the country is witnessing a data centre construction boom. But building a data centre is far more complex than constructing a standard commercial building — it requires specialised knowledge of power systems, cooling, structural engineering, and regulatory compliance specific to the Kenyan context.

This guide walks through every stage of the data centre design and build process in Kenya, from initial site selection through to commissioning and handover.

![Server racks inside a modern Kenyan data centre facility](/images/whats-inside-ai-data-center-wide.webp)
*Modern server rack installation during the fit-out phase of a Kenyan data centre build*

## Phase 1: Site Selection Criteria in Kenya

Choosing the right location is the single most consequential decision in any data centre project. In Kenya, site selection must balance multiple technical, regulatory, and commercial factors.

### Power Availability and Grid Proximity

**Reliable power access is non-negotiable.** Kenya Power (KPLC) operates the national grid, and data centre operators must evaluate proximity to high-voltage substations. Facilities in Nairobi's Industrial Area and along Mombasa Road benefit from relative grid stability, while locations further from the central transmission network may require costly dedicated lines. The [Kenya power infrastructure for data centres](/articles/kenya-power-infrastructure-data-centres) varies significantly across regions, with Nairobi enjoying the most robust supply.

Dual-grid feeds from independent KPLC substations are essential for any facility targeting **Tier III or higher** classification. Operators must also evaluate the feasibility of on-site backup power, including diesel generator fuel storage and increasingly, solar and battery energy storage systems.

### Fibre Connectivity and Network Proximity

A data centre without diverse fibre connectivity has limited value. Kenyan site selection must confirm proximity to multiple fibre duct routes from operators such as Liquid Intelligent Technologies, Safaricom, Telkom Kenya, Jamii Telecommunications, and the Kenya Data Centres backbone. Proximity to submarine cable landing stations in Mombasa — particularly the EASSy, Seacom, and TiGS cable systems — is critical for facilities serving international traffic.

### Flood Zones, Seismic Considerations, and Terrain

**Kenya is not typically associated with major seismic activity**, but the Kenya Geological Survey has identified moderate seismic risk zones, particularly along the Rift Valley. The USGS seismic hazard maps for East Africa indicate that Nairobi falls within a low-to-moderate risk zone, but structural design must still comply with seismic loading requirements under the Kenyan building code.

Flood risk is more immediate. Nairobi has experienced severe flooding events — notably in April 2024 when widespread floods displaced thousands and damaged infrastructure. Data centre sites must be evaluated against flood plain maps from the Ministry of Water and Irrigation, and the building's plinth level should be raised above historical flood lines. Mombasa's coastal locations face additional tidal surge and sea-level rise considerations.

### Land Ownership, Zoning, and Title Verification

Land due diligence is critical in Kenya. The [data centre due diligence process](/articles/data-centre-due-diligence-kenya) should include verification of title deeds at the Ministry of Lands, confirmation that the land use zoning permits commercial or industrial development, and a search for any encumbrances or caveats. In Nairobi County, data centre developments typically fall under commercial or special-use zoning categories, and the county's physical planning department must approve the proposed use.

## Phase 2: Feasibility Studies

Before committing significant capital, developers must conduct thorough feasibility studies covering technical, financial, regulatory, and market dimensions.

### Technical Feasibility

This involves detailed assessments of power capacity (available kVA from KPLC and upgrade requirements), cooling feasibility (ambient temperature profiles, water availability for chillers), and structural load-bearing capacity of the site. For facilities in Nairobi, where average temperatures range from 13°C to 28°C, **free cooling opportunities** exist for much of the year, significantly improving Power Usage Effectiveness (PUE).

### Market and Financial Feasibility

Developers must evaluate demand for colocation, hyperscale, or hybrid cloud services in the target market. The [Kenya data centre market outlook for 2025–2030](/articles/kenya-data-centre-market-outlook-2025-2030) projects significant growth driven by cloud adoption, 5G rollout, and AI workloads. Financial modelling should account for KPLC power tariffs (currently ranging from KES 12–25 per kWh for large commercial users), construction costs in Kenya (typically USD 800–1,500 per kW of IT load for Tier III), and expected revenue per rack or per kW.

## Phase 3: Design Phases

### Conceptual Design

The conceptual design phase establishes the facility's overall scope, target tier classification, capacity (in kW or MW), and architectural approach. Key decisions at this stage include whether to build a purpose-built facility or retrofit an existing commercial building — operators like **Africa Data Centres** and **PAIX** (Pan-African Internet Exchange) have taken both approaches in Kenya.

The conceptual design produces initial floor plans, block layouts showing white space, electrical rooms, mechanical plant rooms, and support areas. It also defines the **resilience strategy** — N+1, 2N, or N+2 redundancy for critical systems.

### Detailed Design

The detailed design phase translates the concept into construction-ready documentation. This includes:

- **Architectural drawings** compliant with Nairobi County building codes and [data centre tier rating requirements](/articles/data-centre-tier-ratings-explained)
- **Structural engineering** calculations for raised floors, heavy equipment (UPS systems, generators, chillers), and seismic loads
- **Electrical engineering** designs covering utility feeds, switchgear, UPS systems, power distribution units (PDUs), generator systems, and earthing/grounding
- **Mechanical engineering** designs for precision cooling, chilled water systems, air handling units, and ductwork

![Electrical power distribution systems in a data centre](/images/dc-switchgear.webp)
*Power distribution infrastructure is a critical design element in any Kenyan data centre build*

### MEP Design: The Most Critical Discipline

**Mechanical, Electrical, and Plumbing (MEP) design is the heart of data centre construction.** In the Kenyan context, MEP design faces unique challenges:

- **Power quality**: Despite improvements, Kenya's grid can experience voltage fluctuations. The MEP design must incorporate robust power conditioning, automatic voltage regulators, and UPS systems with sufficient battery runtime (typically 10–15 minutes) to bridge until generator startup.
- **Cooling efficiency**: Nairobi's mild highland climate allows for economiser-based cooling for 6–8 months annually, but design must also handle hot season peaks. Water-cooled systems face water scarcity challenges in some Nairobi locations.
- **Fire suppression**: Kenya's fire safety regulations, enforced through the Kenya Fire Brigade Act and Nairobi County by-laws, typically require gas-based fire suppression (Novec 1230 or FM-200) in the white space, complemented by wet sprinkler systems in non-critical areas.

## Phase 4: Construction Considerations Specific to Kenya

### Materials Availability and Import Logistics

Many specialised data centre materials are not manufactured in Kenya and must be imported. This includes raised-floor panels, hot-aisle/cold-aisle containment systems, precision air-conditioning units, UPS systems, and automatic transfer switches (ATS). Lead times from manufacturers in Europe, China, and South Africa can range from 8 to 16 weeks, and **import duties and VAT (16%)** must be factored into project budgets.

Standard construction materials — concrete, steel reinforcement, structural steel, and electrical cable — are readily available from Kenyan suppliers, though quality must be verified against **KEBS standards**. The [Kenya Bureau of Standards](https://www.kebs.org) certifies materials including cement (KS 02-542), steel reinforcement (KS 574), and electrical cables (KS IEC 60227).

### The Contractor Ecosystem

Kenya's construction industry includes both large established firms and specialised subcontractors. For data centre projects, the contracting strategy typically involves a main contractor for civil and structural works, with specialist subcontractors for MEP installation. Finding contractors with specific data centre experience remains a challenge — while many firms have built industrial and commercial facilities, the precision requirements of data centre construction (tolerances for raised floors, cable routing, piping alignment) demand additional supervision and quality assurance.

### Regulatory Compliance During Construction

**Nairobi County building approvals** require submission of architectural plans, structural calculations, and MEP drawings to the County's Department of Urban Planning. The approval process can take 2–6 months. During construction, county inspectors verify compliance at foundation, superstructure, and finishing stages.

The [National Environment Management Authority (NEMA)](https://www.nema.go.ke) requires that the approved EIA conditions are adhered to throughout construction. This includes dust control, noise management, stormwater management, and waste disposal protocols.

## Phase 5: Commissioning Process

Commissioning is the systematic process of verifying that all installed systems perform as designed. In data centre construction, commissioning is arguably the most critical quality assurance step.

### Integrated Systems Testing (IST)

The commissioning process culminates in **Integrated Systems Testing (IST)**, which simulates real-world failure scenarios. This includes:

- **Utility failure simulation**: Confirming that UPS systems pick up load within milliseconds and that generators start and assume full load within the specified timeframe (typically 30–60 seconds)
- **Cooling failure simulation**: Verifying that the facility can maintain acceptable temperatures during a cooling system outage using thermal mass and emergency ventilation
- **Fire suppression testing**: Confirming detection, alarm, and suppression system activation sequences

### Commissioning in the Kenyan Context

Commissioning in Kenya requires coordination with KPLC for utility switch-over testing. KPLC engineers must participate in the synchronisation and load-transfer tests for dual-grid feeds. The **commissioning agent** (typically an independent third party) must verify that all systems meet the design intent, the specified tier requirements, and applicable Kenyan standards.

![Data centre cooling systems including CRAC units and chilled water piping](/images/dc-chillers-roof-3.webp)
*Cooling system installation during the MEP phase of data centre construction*

## Phase 6: Handover and Operations Transition

The handover phase transfers the completed facility from the construction team to the operations team. This involves:

- **As-built documentation**: Complete sets of drawings, manuals, and test certificates
- **Training**: Operations staff training on all installed systems
- **Warranty management**: Establishing warranty tracking for all equipment and construction elements
- **Ongoing maintenance planning**: Development of preventive maintenance schedules aligned with manufacturer recommendations and tier requirements

Operators like **Liquid Intelligent Technologies**, which operates multiple facilities across East Africa, have developed mature operations transition processes. **Africa Data Centres**, a Cassava Technologies subsidiary, has invested heavily in building local operations teams to manage their growing Kenyan portfolio.

## Key Kenyan Regulatory Bodies in the Build Process

| Regulatory Body | Role in Data Centre Build |
|---|---|
| Nairobi County | Building plan approvals, occupation certificates, zoning compliance |
| NEMA | Environmental Impact Assessment licence, construction environmental monitoring |
| Kenya Power (KPLC) | Grid connection agreements, high-voltage supply design, metering |
| KEBS | Materials standards certification, electrical equipment safety |
| Kenya Fire Brigade | Fire safety plan approval, fire suppression system inspection |
| Communications Authority of Kenya (CA) | Licensing for carrier-grade facilities |
| National Construction Authority (NCA) | Contractor registration, construction quality oversight |

## Conclusion: Building Kenya's Digital Future

The data centre design and build process in Kenya is complex but increasingly well-understood as the local industry matures. From site selection through commissioning, each phase requires careful attention to both international best practices and Kenya-specific regulatory, environmental, and infrastructure realities. As demand for digital infrastructure continues to grow — driven by cloud adoption, AI workloads, and Kenya's position as East Africa's technology hub — the construction pipeline is expected to accelerate. For developers and investors, understanding this build process is essential for delivering facilities that meet the performance, reliability, and compliance standards that modern digital services demand.

## Frequently Asked Questions

### How long does it take to build a data centre in Kenya from site selection to commissioning?

The typical timeline ranges from 18 to 36 months depending on the facility's scale and tier classification. A Tier II or Tier III facility of 1–5 MW in Nairobi generally takes 18–24 months, while larger hyperscale deployments by operators like Africa Data Centres or Liquid Intelligent Technologies can extend to 30–36 months. The site selection and feasibility phase alone can consume 3–6 months, especially when securing Kenya Power high-voltage grid connections and NEMA environmental impact assessment approvals. Delays in Nairobi County building plan approvals and imported equipment lead times for specialised MEP components can add further months to the schedule.

### What KEBS standards apply to data centre construction in Kenya?

Several KEBS standards are relevant to data centre builds. KS ISO/IEC 27001 governs information security management in facility design. KEBS also references international standards such as KS EN 50173 for structured cabling, KS IEC 60364 for electrical installations in buildings, and fire safety standards under KS CP 15 and the Kenya Fire Safety Act. For structural integrity, KS 641 (Code of Practice for Use of Concrete) and KS 02-300 (structural steel) apply. Data centre operators targeting Tier III certification also design against the Uptime Institute's Tier Standard Topology, which is adopted by reference in many Kenyan build specifications, though KEBS does not yet have a dedicated data centre construction standard.

### What is the Kenya Power grid connection process for a data centre?

Data centres typically require dedicated high-voltage connections (33 kV or 132 kV) from Kenya Power. The process involves submitting a formal application to KPLC with load projections, single-line diagrams, and site plans. KPLC then conducts a system study to confirm grid capacity at the proposed location. For facilities drawing over 1 MW, KPLC may require the developer to fund nearby substation upgrades or dedicated transmission lines. The connection agreement, metering setup, and commissioning of the supply typically take 6–12 months. Dual-feed redundancy is essential for Tier III facilities, requiring two independent power feeds from separate KPLC substations. The cost of grid connection can range from KES 50 million to over KES 500 million depending on proximity to existing high-voltage infrastructure.

### Does a data centre project in Kenya require an Environmental Impact Assessment?

Yes. Under Kenya's Environmental Management and Coordination Act (EMCA) 1999, data centre projects fall under the category of large commercial and industrial developments that require an Environmental Impact Assessment (EIA) by NEMA-accredited lead experts. The EIA process includes a project brief submission, scoping report, full EIA study, and public participation with affected communities. NEMA evaluates impacts on air quality (from backup diesel generators), noise pollution, water consumption, wastewater discharge, and electromagnetic fields. For facilities within Nairobi or its metropolitan area, additional county-level environmental approvals may apply. The EIA licence is typically a prerequisite for obtaining Nairobi County building plan approvals, making it a critical-path item in the project schedule.

### Who are the main data centre design and build contractors operating in Kenya?

The Kenyan data centre construction ecosystem includes a mix of international specialists and local firms. Global data centre design firms such as Eaton, Schneider Electric, and Vertiv provide MEP design and equipment. For construction, firms like CPB Contractors (involved with Africa Data Centres), China Wu Yi, and local contractors including Gathoni & Partners, Spencon, and Interconsult have participated in data centre builds. Specialist MEP contractors handle the critical power and cooling installations. The ecosystem also includes commissioning agents, [data centre tier certification consultants](/articles/data-centre-tier-ratings-explained), and project management firms. As demand grows, more Kenyan engineering firms are building in-house data centre capabilities, though highly specialised roles like raised-floor installation, hot-aisle containment fabrication, and precision air-conditioning commissioning still rely partly on imported expertise.
