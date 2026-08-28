---
title: "Fire Suppression Systems in Kenyan Data Centres"
slug: "fire-suppression-systems-kenyan-data-centres"
meta_description: "An in-depth guide to fire detection and suppression systems for data centres in Kenya, covering clean agents, VESDA, regulatory requirements, and real facility installations."
primary_keyword: "fire suppression systems Kenyan data centres"
secondary_keywords:
  - "clean agent fire suppression Kenya"
  - "VESDA detection data centre"
  - "FM-200 Novec 1230 comparison"
  - "Kenya fire safety regulations data centre"
  - "NFPA 75 data centre fire protection"
author: "Kevin Jonathan Onyango Otieno"
author_bio_link: "/about"
published_date: "2026-08-28"
updated_date: "2026-08-28"
category: "Infrastructure"
cluster: "Infrastructure"
og_image: "/images/og-default.png"
reading_time: "20 min"
images:
  - src: "/images/dc-servers-racks.png"
    alt: "Server racks inside a Kenyan data centre hall equipped with fire suppression infrastructure"
    caption: "Modern Kenyan data centres integrate fire suppression into every zone of the white space"
    position: "hero"
  - src: "/images/dc-power-systems.webp"
    alt: "Fire suppression gas cylinders and control panels in a data centre mechanical room"
    caption: "Clean agent gas storage cylinders and control panels form the core of a data centre fire suppression system"
    position: "section-break"
  - src: "/images/dc-security.webp"
    alt: "Integrated safety and security monitoring systems in a data centre control room"
    caption: "Fire detection and suppression systems are integrated into centralised building management and security monitoring"
    position: "inline"
internal_links:
  - text: "data centre security explained"
    href: "/articles/data-centre-security-explained"
  - text: "data centre design and construction"
    href: "/articles/data-centre-design-build-kenya"
  - text: "building codes for data centres in Kenya"
    href: "/articles/building-codes-data-centres-kenya"
external_sources:
  - title: "NFPA 75: Standard for the Fire Protection of Information Technology Equipment"
    url: "https://www.nfpa.org/75"
  - title: "Kigali Amendment to the Montreal Protocol — UNEP"
    url: "https://www.unep.org/montreal-protocol/kigali-amendment"
faq:
  - question: "Why don't Kenyan data centres use water sprinklers in the server hall?"
    answer: "Traditional water sprinklers cause catastrophic damage to electronic equipment even when they successfully suppress a fire. A sprinkler discharge can destroy servers, storage arrays, and networking gear far beyond the area of the original fire, resulting in data loss and extended downtime. Clean agent systems suppress fires without leaving residue or causing water damage. Most Kenyan Tier III facilities use clean agents in the white space and may have pre-action dry pipe sprinklers in non-critical areas like corridors and offices as a secondary measure."
  - question: "What is the difference between FM-200 and Novec 1230?"
    answer: "FM-200 (HFC-227ea) and Novec 1230 (FK-5-1-12) are both clean agent fire suppressants, but they differ significantly. FM-200 has a Global Warming Potential (GWP) of approximately 3,220 and is being phased down under the Kigali Amendment to the Montreal Protocol. Novec 1230 has a GWP of less than 1, an atmospheric lifetime of just 5 days, and is not subject to phase-down schedules. Novec 1230 also has a wider safety margin — it can be used at higher concentrations relative to its NOAEL (No Observed Adverse Effect Level). For new Kenyan data centre builds, Novec 1230 is increasingly the preferred choice despite its higher upfront cost."
  - question: "How does VESDA smoke detection work and why is it preferred?"
    answer: "VESDA (Very Early Smoke Detection Apparatus) is an aspirating smoke detection system that continuously draws air samples through a network of piping installed in the ceiling void and under the raised floor. A central laser-based detector analyses these samples for microscopic smoke particles, detecting fires at the incipient stage — often before visible smoke or flame appears. In a data centre context, VESDA provides critical early warning that allows operators to investigate and potentially resolve issues (such as an overheating power supply) before a fire suppression discharge is triggered. This early detection capability is why VESDA is standard in Kenyan Tier III and above facilities."
  - question: "What do Kenyan insurers require for data centre fire protection?"
    answer: "Kenyan insurance companies underwriting data centre risks typically require: certified fire suppression systems with annual inspection certificates, VESDA or equivalent early warning detection, maintained fire extinguishers at designated points, fire-rated compartmentalisation between the white space and other building areas, emergency evacuation plans approved by a fire safety officer, and compliance with the Kenya Fire Brigade Act and relevant county by-laws. Insurers may also mandate NFPA 75 or NFPA 76 compliance as a policy condition. Failure to maintain these systems can result in policy voidance or significantly higher premiums."
  - question: "How much does a clean agent fire suppression system cost in Kenya?"
    answer: "A complete clean agent fire suppression system for a Kenyan data centre typically costs between KES 40 million and KES 150 million or more, depending on the size of the protected area, the agent selected (Novec 1230 is approximately 30–50% more expensive than FM-200), and the complexity of the detection and control systems. This is 5 to 10 times more expensive than a conventional water sprinkler system. However, when weighed against the potential loss of equipment valued at hundreds of millions of shillings — and the reputational damage from a major outage — clean agent systems are considered essential for any facility housing customer infrastructure."
canonical_url: "https://datacentre254.com/articles/fire-suppression-systems-kenyan-data-centres"
---

![Server racks inside a Kenyan data centre hall equipped with fire suppression infrastructure](/images/dc-servers-racks.png)

Fire protection in a data centre is fundamentally different from fire protection in an ordinary commercial building. The very systems designed to suppress fires in offices and warehouses — primarily water-based — can cause more damage than the fire itself when deployed among servers, storage arrays, and network switches. For Kenyan data centre operators, designing and maintaining an appropriate fire suppression system is both a technical imperative and a regulatory and insurance requirement. This guide covers the full spectrum of **fire suppression systems in Kenyan data centres**, from detection technologies to clean agent chemistries and the regulatory landscape.

## Why Water Sprinklers Are Problematic in Data Centres

Traditional wet-pipe sprinkler systems are the default fire protection method in most Kenyan commercial buildings under the Kenya Fire Brigade Act and county by-laws. However, in a data centre environment, water is arguably as dangerous as fire:

- **Equipment destruction:** Even a brief sprinkler discharge can destroy servers, SANs, and network switches. Water conducts electricity, so energised equipment hit by sprinklers can short-circuit catastrophically
- **Corrosion and contamination:** Water from sprinkler systems often carries rust, pipe scale, and chemical additives that accelerate corrosion of electronic contacts
- **Collateral damage:** A single sprinkler head typically discharges 15–25 litres per minute. In a data hall with hundreds of millions of shillings in customer equipment, the financial exposure is immense
- **Extended downtime:** Water-damaged equipment requires thorough drying, cleaning, and often complete replacement. Recovery timelines can stretch from weeks to months

For these reasons, Kenyan data centres use **pre-action dry pipe sprinklers** (which only fill with water after detection confirms an actual fire) in non-critical areas like corridors, offices, and electrical rooms, and **clean agent suppression systems** in the white space and critical infrastructure areas.

## Clean Agent Fire Suppression Systems

### FM-200 (HFC-227ea)

**FM-200** has been the most widely deployed clean agent in Kenyan data centres over the past two decades. It works by absorbing heat from the fire, interrupting the combustion chain reaction. Key characteristics:

- **Concentration:** Typically designed at 7–8.6% by volume for Class A (ordinary combustibles) and Class C (electrical) fires
- **Discharge time:** 10 seconds or less to reach design concentration
- **Hold time:** Minimum 10 minutes to prevent re-ignition
- **Safety:** NOAEL (No Observed Adverse Effect Level) is 9%, providing a reasonable safety margin at design concentrations
- **Environmental concern:** FM-200 has a **GWP of approximately 3,220** and an atmospheric lifetime of about 34 years. While it has zero Ozone Depletion Potential (ODP), its high GWP places it under phase-down schedules

Africa Data Centres' Nairobi facility and several banking data centres in the city initially deployed FM-200 systems. However, the phase-down trajectory under the **Kigali Amendment** to the Montreal Protocol is driving a transition to newer alternatives.

### Novec 1230 (FK-5-1-12)

**Novec 1230**, manufactured by 3M (now part of Solvay), is increasingly the agent of choice for new Kenyan data centre builds:

- **Concentration:** Designed at 4.2–5.9% for typical data centre hazards
- **GWP:** Less than 1 — essentially equivalent to carbon dioxide
- **Atmospheric lifetime:** Approximately 5 days — it breaks down rapidly in the lower atmosphere
- **Safety:** NOAEL is 10%, well above typical design concentrations, making it the safest clean agent available
- **Storage:** Liquid at room temperature, requiring smaller storage cylinders compared to gaseous agents

**IXAfrica**, Nairobi's newer carrier-neutral data centre, has specified Novec 1230 for its white space fire protection, positioning itself as environmentally responsible while meeting the stringent fire protection requirements of international colocation customers.

### Inergen (IG-541)

**Inergen** is an inert gas blend of 52% nitrogen, 40% argon, and 8% carbon dioxide. It suppresses fire by reducing oxygen concentration to approximately 12.5% — below the level that supports combustion but above the level that sustains human life (the CO2 component helps the body absorb the reduced oxygen):

- **Concentration:** Typically 34–42% by total room volume — significantly higher than chemical agents
- **Environmental impact:** Zero ODP, zero GWP — entirely composed of atmospheric gases
- **Storage:** Requires high-pressure cylinders (200 or 300 bar), demanding significant structural considerations for cylinder storage rooms
- **Cost:** High cylinder count and pressure requirements make Inergen systems more expensive to install than FM-200 or Novec 1230

Inergen is less commonly deployed in Kenyan data centres due to the high-pressure storage requirements, but it remains an option for facilities that prioritise zero environmental impact above all other considerations.

![Fire suppression gas cylinders and control panels in a data centre mechanical room](/images/dc-power-systems.webp)

## Environmental Impact and the Kigali Amendment

The **Kigali Amendment to the Montreal Protocol**, which Kenya ratified in 2017, mandates the phasedown of hydrofluorocarbons (HFCs) — the chemical family that includes FM-200. Under this agreement, developing countries (including Kenya) must begin reducing HFC consumption from 2024, with a target of 80% reduction by 2045.

For Kenyan data centre operators, this has practical implications:

- **FM-200 supply constraints:** As HFC production is curtailed globally, the cost and availability of FM-200 for refills and new installations will become increasingly problematic
- **Transition planning:** Facilities currently using FM-200 need to plan for system replacement or conversion to Novec 1230 or inert gas alternatives within the next 10–15 years
- **Environmental credentials:** Multinational tenants and sustainability-conscious customers increasingly prefer facilities using low-GWP agents, making Novec 1230 a competitive differentiator

Kenya's National Environment Management Authority (**NEMA**) oversees the implementation of the Kigali Amendment domestically and requires facilities using ozone-depleting or high-GWP substances to maintain detailed inventory records and submit annual reports.

## Fire Detection Systems

### VESDA (Very Early Smoke Detection Apparatus)

**VESDA** by Xtralis (now part of Honeywell) is the industry standard for early warning smoke detection in data centres. The system works by:

1. Drawing air continuously through a network of **PVC or ABS sampling pipes** installed in the ceiling void, under the raised floor, and at cabinet level
2. Passing air samples through a **laser-based detection chamber** that identifies microscopic smoke particles (as small as 0.0015 microns)
3. Analysing particle density and reporting alarm levels: **Alert**, **Action**, and **Fire**

The value of VESDA lies in its **aspirating detection** capability — it can detect fires at the smouldering stage, often minutes or hours before conventional point detectors would trigger. This early warning allows operators to investigate potential issues (such as an overheating UPS battery or a failing power supply) and take corrective action **before** the fire suppression system discharges.

In Kenyan facilities, VESDA is deployed in the white space, electrical rooms housing UPS systems and switchgear, and generator rooms. Africa Data Centres' Nairobi campus uses VESDA with multiple detection zones, each independently addressable to the Building Management System (BMS).

### Beam Detectors

**Infrared beam detectors** project a beam of infrared light across the data hall from a transmitter to a receiver. Smoke particles that enter the beam path scatter or absorb the infrared light, triggering an alarm. Beam detectors are useful in large, open data halls where installing point detectors on the ceiling would require extensive wiring and could obstruct airflow.

### Multi-Criteria Detectors

**Multi-criteria detectors** combine multiple sensing technologies — typically smoke, heat, and sometimes carbon monoxide — in a single device. They are programmed to require confirmation from more than one sensor before triggering an alarm, significantly reducing false alarm rates. These are increasingly used in Kenyan data centre support areas (offices, meeting rooms, corridors).

## Regulatory Framework for Fire Protection in Kenya

### Kenya Fire Brigade Act (Cap 211)

The **Kenya Fire Brigade Act** is the primary national legislation governing fire safety. It establishes the powers of fire authorities and requires building owners to maintain fire safety measures. While the Act predates modern data centres, its provisions apply to all buildings, including technology facilities.

### County Fire By-Laws

**Nairobi City County** and **Mombasa County** each enforce their own fire safety by-laws that supplement national legislation. Key requirements for data centres include:

- **Fire-rated compartmentalisation:** Minimum 2-hour fire-rated barriers between the data hall and adjacent spaces
- **Fire detection and alarm systems:** Addressable fire alarm systems with central monitoring
- **Emergency exits:** Minimum two independent means of egress from the data hall
- **Fire extinguishers:** CO2 and clean agent portable extinguishers at designated points (water and foam extinguishers must NOT be used on electrical equipment)
- **Fire safety officer:** Facilities above a certain size must employ or retain a qualified fire safety officer

### NEMA Requirements

The **National Environment Management Authority** requires data centres to:

- Register any ozone-depleting substances or high-GWP substances used in fire suppression systems
- Submit annual inventory reports
- Develop and maintain an **Environmental Management Plan** that includes fire emergency response procedures
- Ensure that fire suppression agents are handled and disposed of in accordance with the Montreal Protocol and its amendments

### Insurance Company Requirements

Kenyan insurers underwriting data centre risks — including **Kenya Reinsurance Corporation (Kenya Re)**, **Jubilee Insurance**, **UAP Old Mutual**, and **CIC Insurance** — typically impose fire protection requirements that often exceed minimum regulatory standards. Common insurance stipulations include:

- Clean agent fire suppression in all areas housing electronic equipment
- VESDA or equivalent early warning detection
- Annual system testing and certification by a licensed fire protection contractor
- Fire-rated construction meeting minimum hourly ratings
- Documented evacuation procedures and fire drill records
- Compliance with NFPA 75 or equivalent international standards

Failure to maintain these systems can result in **policy voidance**, premium surcharges of 25–100%, or denial of claims following a fire incident.

## System Design Considerations

### Zoning

Effective fire suppression design divides the data centre into **protection zones**, each with independent detection and suppression capability. Typical zoning includes:

- **White space zones:** Individual data halls or sections of halls, each treated as a separate suppression zone
- **Electrical rooms:** UPS rooms, switchgear rooms, and battery rooms each have dedicated systems
- **Mechanical rooms:** Chiller plants, cooling towers, and HVAC equipment rooms
- **Support areas:** Corridors, offices, and meeting rooms typically use conventional fire detection with pre-action sprinklers

### Total Flooding vs Local Application

**Total flooding** — the standard approach in data centre white spaces — involves filling the entire protected zone with the fire suppression agent to the design concentration. This requires the room to be reasonably well-sealed to prevent agent escape. **Local application** directs agent only at the specific hazard area and is generally used for smaller, contained risks.

Kenyan Tier III data centres use **total flooding** for the white space. Sealing integrity is verified during commissioning using a **door fan test** (also called a blower door test) that measures the room's leakage rate and calculates the required agent quantity to compensate for leakage during the hold time.

### Hold Times and Evacuation

Clean agent systems are designed to maintain the design concentration for a minimum **hold time of 10 minutes** — sufficient to ensure the fire is fully suppressed and will not re-ignite when ventilation is restored. During this period:

- **Pre-discharge alarms** (typically 30 seconds) warn personnel to evacuate the protected zone
- **Abort switches** at all exits allow authorised personnel to cancel a discharge if investigation reveals a false alarm
- **Access control integration** ensures fire doors unlock automatically during a fire event

Kenyan facilities are required to conduct **quarterly fire drills** and maintain evacuation plans that have been reviewed and approved by a qualified fire safety officer.

### Integration with Building Management Systems

Modern Kenyan data centres integrate fire detection and suppression into their **Building Management System (BMS)**, which provides:

- Centralised monitoring of all detection zones
- Automated sequences: detection → alarm → pre-discharge warning → agent discharge → HVAC shutdown → notification
- Event logging for compliance auditing and insurance documentation
- Integration with [data centre security explained](/articles/data-centre-security-explained) systems for coordinated emergency response

![Integrated safety and security monitoring systems in a data centre control room](/images/dc-security.webp)

## Cost Implications

| **System Type**             | **Approx. Cost (KES)** | **Pros**                                     | **Cons**                                      |
|-----------------------------|------------------------|----------------------------------------------|-----------------------------------------------|
| Wet-pipe sprinklers         | 3M – 8M               | Low cost, simple, well understood            | Destroys equipment, not suitable for white space |
| Pre-action dry pipe         | 8M – 15M              | Water damage limited to confirmed fires      | Still uses water, slower response              |
| FM-200 clean agent          | 40M – 100M            | Fast, effective, no residue                  | High GWP, phase-down underway                  |
| Novec 1230 clean agent      | 50M – 150M            | Near-zero GWP, excellent safety profile      | Highest upfront cost                           |
| Inergen (IG-541)            | 60M – 180M            | Zero environmental impact, inert gases       | High-pressure storage, many cylinders needed   |

These costs include agent, cylinders, piping, nozzles, detection systems, control panels, and installation. **Annual maintenance** typically adds 5–10% of the initial system cost.

## Maintenance and Inspection Schedules

Fire suppression systems require rigorous ongoing maintenance to remain effective:

### Monthly
- Visual inspection of all detection devices and control panels
- Verification that abort switches and manual release stations are unobstructed
- Check that all zone indicator lights and alarms are functional

### Quarterly
- Test a representative sample of detection devices (typically 25% per quarter, rotating to achieve 100% annually)
- Inspect cylinder pressures and weights
- Verify door seals and room integrity for total flooding zones
- Conduct fire drills and review evacuation procedures

### Annually
- Full system test by a **licensed fire protection contractor** registered with the Kenya Fire Brigade
- Cylinder hydrostatic testing (typically every 5–10 years depending on agent type)
- Recalibration of VESDA detectors
- Review and update fire safety documentation
- Submit inspection certificates to insurers and NEMA as required

### Special Inspections
- After any system discharge, the entire system must be inspected, recharged, and re-certified before returning to service
- After any structural modifications to the protected space (changes to walls, ceilings, or penetrations) that could affect room integrity
- After changes to the [data centre design and construction](/articles/data-centre-design-build-kenya) layout that alter the protected volume or hazard classification

## Comparison to International Standards

### NFPA 75 and NFPA 76

The **National Fire Protection Association (NFPA)** publishes two standards directly relevant to data centre fire protection:

- **NFPA 75: Standard for the Fire Protection of Information Technology Equipment** — covers fire protection for IT equipment areas within buildings
- **NFPA 76: Standard for the Fire Protection of Telecommunications Facilities** — covers telecommunications equipment and infrastructure

While NFPA standards are American, they are widely referenced in Kenyan data centre specifications, particularly by multinational operators and their insurers. Key NFPA 75 requirements that Kenyan facilities adopt include:

- Automatic fire detection throughout the IT equipment area
- Fire suppression appropriate for the protected hazard (clean agents for electronic equipment)
- Compartmentalisation with fire-resistant barriers
- Emergency power-off capability as a last-resort fire control measure
- Documentation of all fire protection systems and maintenance records

### EN 54

The **EN 54** family of European standards covers fire detection and fire alarm systems. EN 54-compliant equipment is increasingly available in the Kenyan market through European distributors. Facilities with European investment or serving European clients may specify EN 54 compliance for detection systems.

## Real Installations in Kenyan Facilities

### Africa Data Centres — Nairobi
Africa Data Centres' flagship Nairobi campus deploys a **zoned clean agent system** (FM-200, with plans to transition to Novec 1230) protecting the white space, complemented by VESDA aspirating detection throughout. The facility maintains dedicated fire suppression cylinder rooms with structural reinforcement and climate control. Annual inspections are conducted by a licensed contractor with certificates provided to all colocation tenants and insurers.

### IXAfrica — Nairobi
As a newer build, **IXAfrica** specified Novec 1230 from the outset, aligning with international best practices for environmental sustainability. The facility uses a multi-zone VESDA system with addressable detection integrated into a centralised BMS. Fire-rated compartmentalisation between the white space and support areas exceeds 2-hour ratings.

### PAIX Nairobi
The **Pan African Internet Exchange** facility, serving as a critical interconnection hub, employs clean agent suppression in its equipment halls and pre-action sprinklers in support areas. Given its role as a peering and interconnection point, even brief fire-related outages would have wide-ranging connectivity impacts across East Africa.

## Frequently Asked Questions

### Why don't Kenyan data centres use water sprinklers in the server hall?

Traditional water sprinklers cause catastrophic damage to electronic equipment even when they successfully suppress a fire. A sprinkler discharge can destroy servers, storage arrays, and networking gear far beyond the area of the original fire, resulting in data loss and extended downtime. Clean agent systems suppress fires without leaving residue or causing water damage. Most Kenyan Tier III facilities use clean agents in the white space and may have pre-action dry pipe sprinklers in non-critical areas like corridors and offices as a secondary measure.

### What is the difference between FM-200 and Novec 1230?

FM-200 (HFC-227ea) and Novec 1230 (FK-5-1-12) are both clean agent fire suppressants, but they differ significantly. FM-200 has a Global Warming Potential (GWP) of approximately 3,220 and is being phased down under the Kigali Amendment to the Montreal Protocol. Novec 1230 has a GWP of less than 1, an atmospheric lifetime of just 5 days, and is not subject to phase-down schedules. Novec 1230 also has a wider safety margin — it can be used at higher concentrations relative to its NOAEL (No Observed Adverse Effect Level). For new Kenyan data centre builds, Novec 1230 is increasingly the preferred choice despite its higher upfront cost.

### How does VESDA smoke detection work and why is it preferred?

VESDA (Very Early Smoke Detection Apparatus) is an aspirating smoke detection system that continuously draws air samples through a network of piping installed in the ceiling void and under the raised floor. A central laser-based detector analyses these samples for microscopic smoke particles, detecting fires at the incipient stage — often before visible smoke or flame appears. In a data centre context, VESDA provides critical early warning that allows operators to investigate and potentially resolve issues (such as an overheating power supply) before a fire suppression discharge is triggered. This early detection capability is why VESDA is standard in Kenyan Tier III and above facilities.

### What do Kenyan insurers require for data centre fire protection?

Kenyan insurance companies underwriting data centre risks typically require: certified fire suppression systems with annual inspection certificates, VESDA or equivalent early warning detection, maintained fire extinguishers at designated points, fire-rated compartmentalisation between the white space and other building areas, emergency evacuation plans approved by a fire safety officer, and compliance with the Kenya Fire Brigade Act and relevant county by-laws. Insurers may also mandate NFPA 75 or NFPA 76 compliance as a policy condition. Failure to maintain these systems can result in policy voidance or significantly higher premiums.

### How much does a clean agent fire suppression system cost in Kenya?

A complete clean agent fire suppression system for a Kenyan data centre typically costs between KES 40 million and KES 150 million or more, depending on the size of the protected area, the agent selected (Novec 1230 is approximately 30–50% more expensive than FM-200), and the complexity of the detection and control systems. This is 5 to 10 times more expensive than a conventional water sprinkler system. However, when weighed against the potential loss of equipment valued at hundreds of millions of shillings — and the reputational damage from a major outage — clean agent systems are considered essential for any facility housing customer infrastructure.

*For authoritative guidance on data centre fire protection standards, refer to the [NFPA 75: Standard for the Fire Protection of Information Technology Equipment](https://www.nfpa.org/75) and the [Kigali Amendment to the Montreal Protocol](https://www.unep.org/montreal-protocol/kigali-amendment) for environmental phase-down schedules affecting HFC-based suppression agents.*
