---
title: UPS Systems and Backup Power for Kenyan Data Centres
slug: ups-backup-power-kenyan-data-centres
meta_description: A comprehensive guide to Uninterruptible Power Supply (UPS) systems
  in Kenyan data centres — covering types, battery technologies, sizing, redundancy,
  generators, and Kenya-specific challenges.
primary_keyword: UPS systems Kenya
secondary_keywords:
- data centre backup power Kenya
- diesel generators Kenyan data centres
- lithium-ion batteries data centres
- Kenya Power outages data centres
- N+1 UPS redundancy
author: Kevin Jonathan Onyango Otieno
author_bio_link: /about
published_date: '2026-08-28'
updated_date: '2026-08-28'
category: Energy & Power
cluster: Energy
og_image: /images/dc-power-systems.webp
reading_time: "14 min"
images:
- src: /images/dc-power-systems.webp
  alt: UPS systems and power distribution equipment in a data centre electrical room
  caption: UPS systems form the critical first line of defence against power interruptions
    in every data centre.
  position: hero
- src: /images/dc-ups-batteries-wide.webp
  alt: Server racks powered through redundant UPS and generator systems
  caption: Every server rack depends on clean, uninterrupted power delivered through
    UPS systems.
  position: section-break
- src: /images/kenya-transmission-pylons-5.webp
  alt: Sustainable energy and battery storage systems at a modern data centre
  caption: Lithium-ion batteries are rapidly replacing traditional lead-acid in new
    data centre builds across Africa.
  position: inline
- src: /images/diagram-server-rack-42u.webp
  alt:  "Labelled diagram of a 42U server rack"
  caption: "Inside a 42U rack: top-of-rack switch, cable management, PDUs, UPS battery modules, and blanking panels for airflow."
  position: section-break

internal_links:
- text: Kenya Power Infrastructure for Data Centres
  href: /articles/kenya-power-infrastructure-data-centres
- text: Kenya Power Tariffs for Data Centres
  href: /articles/kenya-power-tariffs-data-centres
- text: Data Centre PUE (Power Usage Effectiveness)
  href: /articles/data-centre-pue-power-usage-effectiveness
external_sources:
- title: Schneider Electric Data Centre UPS Systems Guide
  url: https://www.se.com/ww/en/work/campaigns/data-center-solutions/
- title: Uptime Institute Annual Outage Analysis
  url: https://uptimeinstitute.com/resources/research-and-reports
faq:
- question: How long should a UPS system run during a power outage in a Kenyan data
    centre?
  answer: A UPS system in a data centre is not designed for extended runtime. Its
    primary purpose is to 'bridge' the gap between a power failure and the start of
    diesel generators — typically 10 to 30 seconds. Some facilities design for 5 to
    15 minutes of UPS runtime to provide additional buffer for generator start-up
    and synchronisation. Extended runtime on batteries alone would require impractically
    large battery banks and is not the standard approach. The generator, not the UPS,
    provides long-term backup power.
- question: What is the difference between N+1 and 2N UPS redundancy?
  answer: N+1 redundancy means having one extra UPS module beyond what is required
    to support the full load. If you need 400 kW, an N+1 configuration might use four
    100 kW modules (three to carry the load, one as backup). If any single module
    fails, the remaining three can still support the full load. 2N redundancy is far
    more robust — it provides a fully duplicate, independent power path. You have
    two complete UPS systems, each capable of supporting 100% of the load independently.
    If the entire primary UPS system fails, the secondary takes over seamlessly. 2N
    is the standard for Tier III and Tier IV data centres and is what facilities like
    Africa Data Centres deploy in Kenya.
- question: Why are lithium-ion batteries gaining popularity in Kenyan data centres?
  answer: 'Lithium-ion batteries offer several advantages over traditional VRLA lead-acid
    batteries: they last 10 to 15 years compared to 5 to 7 years for lead-acid, they
    are roughly 40% smaller and lighter, they operate at higher temperatures (reducing
    cooling requirements), and they charge much faster. The main barrier has been
    cost — lithium-ion batteries are approximately 1.5 to 2 times more expensive upfront.
    However, the total cost of ownership over 10 to 15 years is increasingly competitive,
    especially when factoring in reduced replacement cycles, lower cooling costs,
    and smaller battery rooms. Newer facilities in Nairobi are increasingly specifying
    lithium-ion.'
- question: How much does a UPS system cost for a Kenyan data centre?
  answer: Costs vary enormously based on capacity and configuration. A 100 kVA online
    double-conversion UPS system from a tier-one manufacturer (Eaton, Schneider, Vertiv)
    costs approximately KES 8 to 15 million (USD 55,000 to 100,000) for the unit alone.
    Add battery cabinets, installation, switchgear, and commissioning, and a complete
    100 kVA UPS room can cost KES 15 to 25 million. For a larger facility — say 1
    MVA — with N+1 or 2N redundancy, the UPS infrastructure alone can range from KES
    120 million to KES 250 million or more. These figures include import duties, shipping,
    and local installation costs.
- question: What role do diesel generators play alongside UPS systems?
  answer: The UPS and generator work as a team. When utility power from Kenya Power
    fails, the UPS instantly takes over — it detects the interruption in under 4 milliseconds
    and begins supplying power from its batteries. Within 10 to 30 seconds, the automatic
    transfer switch (ATS) starts the diesel generator, lets it stabilise, and transfers
    the load from UPS batteries to generator power. The UPS continues to operate in
    'online' mode, conditioning the generator's power to ensure clean, stable electricity
    reaches the servers. The generator provides power for as long as the outage lasts
    — limited only by fuel supply. Most Kenyan data centres store 24 to 72 hours of
    diesel fuel on site.
canonical_url: https://data-centers-254.vercel.app/articles/ups-backup-power-kenyan-data-centres
---


## Why UPS Systems Are Critical in Kenyan Data Centres

In a data centre, even a **millisecond** of power interruption can crash servers, corrupt databases, and disrupt services for thousands of users. This is why an Uninterruptible Power Supply (UPS) system is the most critical piece of electrical infrastructure in any facility — and in Kenya, where [Kenya Power infrastructure](/articles/kenya-power-infrastructure-data-centres) presents unique challenges, the UPS is not a luxury but an absolute necessity.

![Data centre power distribution and backup systems](/images/dc-power-systems.webp)

A UPS system performs three essential functions. First, it **conditions the power** — smoothing out voltage fluctuations, filtering harmonics, and ensuring servers receive clean, stable electricity regardless of what comes from the grid. Second, it **bridges power gaps** — instantly supplying battery power during outages until backup generators start. Third, it **protects equipment** — shielding sensitive IT hardware from surges, spikes, and electrical noise that could cause premature failure.

In Kenya specifically, UPS systems must contend with several challenges that make them even more critical than in markets with highly stable grids.

### Kenya-Specific Power Challenges

**Kenya Power (KPLC) outages**: While KPLC has made meaningful improvements to grid reliability, unplanned outages remain common, particularly during the heavy rain seasons of March–May and October–December. Storms frequently bring down power lines and damage transformers, causing interruptions that can last from minutes to hours.

**Voltage fluctuations**: Many parts of Nairobi and other towns experience voltage sags and swells, particularly during peak demand periods (typically 6–10 PM). Industrial areas where data centres are often located can see voltage drop by 15–20% during heavy load periods.

**Frequency instability**: Kenya's grid frequency, which should ideally be stable at 50 Hz, can fluctuate during periods of generation-demand imbalance. While UPS systems with online double-conversion topology regenerate the power waveform, this constant conditioning adds to system wear and energy consumption.

**Momentary interruptions**: Brief interruptions lasting less than one second — caused by automatic reclosers on power lines — are common and can be devastating to IT equipment if not properly bridged by a UPS.

## Types of UPS Systems

Not all UPS systems are created equal. Understanding the three main topologies is essential for anyone evaluating data centre power infrastructure.

### Online Double-Conversion UPS

The **online double-conversion UPS** is the gold standard for data centres. It operates by continuously converting incoming AC power to DC (rectification), then converting it back to clean AC power (inversion). The IT load is always powered by this double-converted, perfectly clean power — the UPS is always "online" in the power path.

When a power failure occurs, the UPS seamlessly draws from its batteries without any transfer time, because the inverter is already running and simply changes its DC source from the rectifier to the batteries. This zero-transfer-time characteristic is why online double-conversion is the **only acceptable UPS topology for Tier III and Tier IV data centres**.

Every major Kenyan data centre — including Africa Data Centres' facilities along Mombasa Road, PAIX Nairobi and Mombasa, and Liquid Intelligent Technologies' facilities — uses online double-conversion UPS systems from manufacturers such as **Eaton, Schneider Electric (APC), and Vertiv**.

### Line-Interactive UPS

A **line-interactive UPS** monitors incoming power and can adjust voltage using an automatic voltage regulator (AVR) without switching to batteries. It only draws from batteries when the voltage goes outside the AVR's correction range.

While line-interactive systems are common in small office environments and network closets, they are **not suitable for data centre environments** because they have a transfer time of 2–10 milliseconds when switching to battery mode — fast enough for computers but potentially problematic for sensitive server equipment and storage arrays.

### Standby / Offline UPS

A **standby UPS** sits idle until a power failure is detected, at which point it switches to battery power. Transfer times range from 5–25 milliseconds, making them entirely unsuitable for data centre use. These are typically used for individual desktop computers and point-of-sale systems.

## Battery Technologies: VRLA vs Lithium-Ion

The choice of battery technology significantly impacts a UPS system's performance, lifespan, maintenance requirements, and total cost of ownership.

### VRLA (Valve-Regulated Lead-Acid) Batteries

VRLA batteries have been the traditional choice for data centre UPS systems for decades. They are sealed, maintenance-free (no water topping up required), and relatively affordable.

**Advantages:**
- Lower upfront cost — approximately KES 15,000 to 25,000 per 12V/100Ah unit
- Well-understood technology with established supply chains in Kenya
- Predictable performance and widespread manufacturer support

**Disadvantages:**
- Limited lifespan: 3 to 5 years in Nairobi's warm climate (vs. 7–10 years in cooler environments)
- Large footprint: VRLA battery rooms can occupy 20–30% of a data centre's ground floor
- Temperature sensitivity: every 8°C above 20°C halves battery life — a significant concern in Kenya where ambient temperatures regularly exceed 25°C
- Environmental concerns: lead-acid batteries contain hazardous materials and require careful disposal
- Weight: VRLA battery banks are extremely heavy, requiring reinforced flooring

### Lithium-Ion Batteries

Lithium-ion technology is rapidly gaining ground in African data centres. Major manufacturers including **Eaton, Schneider Electric, and Vertiv** now offer lithium-ion battery cabinets purpose-built for UPS applications.

**Advantages:**
- Extended lifespan: 10 to 15 years, roughly double that of VRLA in tropical climates
- Compact size: approximately 40% smaller and 60% lighter than equivalent VRLA banks
- Higher operating temperature tolerance: performs well up to 40°C, reducing cooling costs
- Faster charging: can recharge to 90% in under 2 hours
- Better cycling capability: handles more charge-discharge cycles without degradation

**Disadvantages:**
- Higher upfront cost: approximately KES 35,000 to 50,000 per equivalent unit — 1.5 to 2 times more expensive
- Thermal runaway risk: requires sophisticated battery management systems (BMS)
- Limited local supply: most lithium-ion UPS batteries must be imported, adding lead time and shipping costs
- Fewer local technicians with lithium-ion UPS maintenance expertise

**Cost comparison in KES:** A typical 100 kVA UPS system with 10 minutes of VRLA battery runtime might cost KES 10–12 million for the battery bank alone. The equivalent lithium-ion system might cost KES 16–20 million — but over a 12-year operational life, the lithium-ion system may actually be cheaper when you factor in one battery replacement cycle for VRLA (KES 10–12 million at year 5) versus none for lithium-ion.

## UPS Sizing and Redundancy

### How UPS Systems Are Sized

UPS sizing must account for the total IT load plus a safety margin. A properly sized UPS runs at **40–60% of its rated capacity** under normal conditions, leaving headroom for load growth and ensuring the system doesn't operate at maximum stress.

For example, if a data centre has a current IT load of 200 kW, the UPS system might be sized at 400–500 kVA (accounting for power factor). This allows for future expansion without requiring a UPS upgrade.

### Redundancy Configurations

![Electrical switchgear and UPS cabinets](/images/dc-ups-batteries-wide.webp)

**N+1 Redundancy**: Provides one additional UPS module beyond what is needed. If the facility needs 300 kW, an N+1 system might use four 100 kW modules — three carry the load, one is a hot standby. This is common in **Tier II and Tier III** facilities and provides protection against a single module failure.

**2N Redundancy**: Provides two fully independent, parallel power paths, each capable of supporting 100% of the load. This is the standard for **Tier III and Tier IV** data centres. Africa Data Centres' Nairobi facilities use 2N UPS configurations, meaning every server rack receives power from two completely independent UPS systems. If the entire primary UPS system fails — controllers, batteries, and all — the secondary system takes over without any interruption to the IT load.

**2(N+1) Redundancy**: An even higher level combining the principles of both approaches — two independent power paths, each with N+1 modules. This is reserved for the most critical facilities globally.

## Runtime Considerations: Bridging to Generator Start

A common misconception is that UPS batteries should power a data centre for hours. In reality, **UPS runtime in a data centre is typically designed for 10 to 30 minutes** — just enough to bridge the gap between a utility power failure and the start of diesel generators.

The sequence works as follows:

1. **Power failure detected** (0 milliseconds)
2. **UPS switches to battery power** (0–4 milliseconds for online double-conversion)
3. **Automatic Transfer Switch (ATS) signals generator start** (within 100 milliseconds)
4. **Diesel generator starts and stabilises** (10–30 seconds)
5. **ATS transfers load to generator** (after generator frequency and voltage are stable)
6. **UPS continues conditioning generator power** (ongoing)
7. **Generator runs until utility power is restored** (minutes to hours)

Designing for extended battery-only runtime (beyond 15–30 minutes) would require impractically large and expensive battery banks. It is far more cost-effective to invest in reliable, fast-starting generators.

## Diesel Generators: The Backbone of Kenyan DC Power Continuity

While the UPS handles the critical first seconds of a power failure, **diesel generators provide the long-term backup power** that keeps a data centre running through extended outages.

### Generator Sizing and Configuration

Kenyan data centres typically size their generators to support the **entire facility load** — not just the IT load, but also cooling systems, lighting, and security. A 5 MW IT load might require 7–8 MW of generator capacity when cooling and other systems are included.

Redundancy follows the same N+1 or 2N philosophy as UPS systems. A facility might have three 3 MW generators in an N+1 configuration, or four 3 MW generators in an N+2 configuration for additional resilience.

### Fuel Storage Requirements

Most Kenyan data centres store **24 to 72 hours** of diesel fuel on site. Africa Data Centres' facilities typically maintain 48-hour fuel reserves, with contractual agreements for emergency fuel delivery within 12 hours from suppliers such as **KenolKobil, TotalEnergies, and Rubis Energy**.

Fuel storage must comply with Kenya's environmental and fire safety regulations, including the **Environmental Management and Co-ordination Act (EMCA)** and the Kenya Bureau of Standards (KEBS) requirements for fuel tank installation.

### Alternative Generator Technologies

While diesel remains dominant, alternative approaches are emerging:

- **Biogas generators**: Companies like **Biogas International** and several pilot projects supported by the Kenya Renewable Energy Association (KEREA) are exploring biogas as a cleaner fuel source for backup power.
- **Natural gas**: The discovery of natural gas reserves in Kenya and the development of gas infrastructure could eventually support gas-fired backup generators, which produce fewer emissions than diesel.
- **AMEA Power and renewable hybrid systems**: AMEA Power's solar and wind investments in Kenya could eventually support hybrid power systems where renewables provide baseload power and batteries (rather than diesel generators) handle short-term backup.

## Automatic Transfer Switches (ATS)

The **Automatic Transfer Switch (ATS)** is the electrical device that manages the transition between utility power and generator power. It continuously monitors both power sources and can transfer the load within seconds when it detects a failure.

In a well-designed Kenyan data centre, the ATS operates in this sequence:

1. Monitors KPLC utility power voltage and frequency
2. Detects failure or unacceptable power quality
3. Sends start signal to diesel generator(s)
4. Waits for generator to stabilise (voltage and frequency within acceptable limits)
5. Transfers the load from utility to generator
6. Continues monitoring utility power
7. When utility power is restored and stable, transfers load back to utility
8. Allows generator to run for a cool-down period before shutting down

A properly maintained ATS is critical because it is the **coordination point** between the UPS, the generator, and the utility grid. ATS failures — rare but possible — can result in the UPS batteries depleting before the generator takes over.

## Maintenance and Testing Schedules

UPS and generator systems require rigorous, scheduled maintenance to ensure they perform when needed. According to the [Uptime Institute](https://uptimeinstitute.com/resources/research-and-reports), a significant percentage of data centre outages are caused by **preventable failures in power infrastructure**.

### UPS Maintenance
- **Weekly**: Visual inspection of UPS status indicators, battery voltage readings, and alarm logs
- **Monthly**: Battery impedance or conductance testing, thermal imaging of electrical connections, cleaning of air filters
- **Quarterly**: Full load bank testing (where possible), calibration of monitoring sensors, review of event logs
- **Annually**: Comprehensive preventive maintenance by the manufacturer or certified service provider, including firmware updates, capacitor inspection, and fan replacement
- **Battery replacement**: VRLA batteries every 3–5 years, lithium-ion batteries every 10–15 years

### Generator Maintenance
- **Weekly**: No-load exercise runs (10–15 minutes)
- **Monthly**: Loaded exercise runs (at least 30% of rated capacity for 30 minutes)
- **Quarterly**: Full load bank testing, fuel quality analysis, coolant system inspection
- **Annually**: Comprehensive service including oil changes, filter replacement, alternator testing, and fuel system cleaning
- **Fuel management**: Regular fuel polishing (removing water and contaminants from stored diesel), typically every 6–12 months

## Total Cost of Ownership

Understanding the [data centre PUE (Power Usage Effectiveness)](/articles/data-centre-pue-power-usage-effectiveness) is essential because the UPS system directly impacts energy efficiency. Online double-conversion UPS systems typically operate at 93–96% efficiency, meaning 4–7% of the power is lost as heat during the double-conversion process. This inefficiency directly increases PUE and [energy costs](/articles/kenya-power-tariffs-data-centres).

### TCO Breakdown for a 500 kVA UPS System (Over 10 Years)

| Cost Component | VRLA Battery System (KES) | Lithium-Ion System (KES) |
|---------------|---------------------------|------------------------|
| UPS units (500 kVA, N+1) | 45,000,000 | 45,000,000 |
| Initial batteries | 25,000,000 | 40,000,000 |
| Battery replacement (year 5) | 25,000,000 | — |
| Installation and commissioning | 12,000,000 | 12,000,000 |
| Maintenance (10 years) | 8,000,000 | 5,000,000 |
| Cooling for battery room (10 years) | 6,000,000 | 2,500,000 |
| **Total 10-year TCO** | **121,000,000** | **104,500,000** |

As this simplified model shows, the **lithium-ion system is approximately 14% cheaper over 10 years** despite its higher upfront cost — primarily because it avoids a mid-life battery replacement and requires less cooling.

![Sustainable energy and battery storage systems at a modern data centre](/images/kenya-transmission-pylons-5.webp)

## Real Installations in Kenyan Data Centres

**Africa Data Centres (Nairobi)**: Their facilities along Mombasa Road use Schneider Electric Galaxy VX online double-conversion UPS systems in 2N configurations, with both VRLA and increasingly lithium-ion battery options. Their UPS rooms are among the most advanced in East Africa, with real-time monitoring integrated into their building management system.

![Labelled diagram of a 42U server rack](/images/diagram-server-rack-42u.webp)

**PAIX (Nairobi and Mombasa)**: PAIX facilities use Eaton 9395 UPS systems with N+1 redundancy. Their Mombasa facility, located near the submarine cable landing stations, has particularly robust power systems given its coastal location where power quality can be more variable.

**Liquid Intelligent Technologies (Nairobi)**: Liquid's facilities deploy Vertiv Liebert EXL UPS systems with comprehensive battery monitoring. Their focus on energy efficiency has seen them pioneer advanced power management techniques in the Kenyan market.

## Frequently Asked Questions

### How long should a UPS system run during a power outage in a Kenyan data centre?

A UPS system in a data centre is not designed for extended runtime. Its primary purpose is to **bridge the gap** between a power failure and the start of diesel generators — typically **10 to 30 seconds**. Some facilities design for 5 to 15 minutes of UPS runtime to provide additional buffer for generator start-up and synchronisation. Extended runtime on batteries alone would require impractically large battery banks and is not the standard approach. The generator, not the UPS, provides long-term backup power.

### What is the difference between N+1 and 2N UPS redundancy?

N+1 redundancy means having one extra UPS module beyond what is required to support the full load. If you need 400 kW, an N+1 configuration might use four 100 kW modules (three to carry the load, one as backup). If any single module fails, the remaining three can still support the full load. 2N redundancy is far more robust — it provides a fully duplicate, independent power path. You have two complete UPS systems, each capable of supporting 100% of the load independently. If the entire primary UPS system fails, the secondary takes over seamlessly. **2N is the standard for Tier III and Tier IV data centres** and is what facilities like Africa Data Centres deploy in Kenya.

### Why are lithium-ion batteries gaining popularity in Kenyan data centres?

Lithium-ion batteries offer several advantages over traditional VRLA lead-acid batteries: they last **10 to 15 years** compared to 5 to 7 years for lead-acid, they are roughly 40% smaller and lighter, they operate at higher temperatures (reducing cooling requirements), and they charge much faster. The main barrier has been cost — lithium-ion batteries are approximately 1.5 to 2 times more expensive upfront. However, the total cost of ownership over 10 to 15 years is increasingly competitive, especially when factoring in reduced replacement cycles, lower cooling costs, and smaller battery rooms. Newer facilities in Nairobi are increasingly specifying lithium-ion.

### How much does a UPS system cost for a Kenyan data centre?

Costs vary enormously based on capacity and configuration. A 100 kVA online double-conversion UPS system from a tier-one manufacturer (Eaton, Schneider, Vertiv) costs approximately **KES 8 to 15 million** (USD 55,000 to 100,000) for the unit alone. Add battery cabinets, installation, switchgear, and commissioning, and a complete 100 kVA UPS room can cost KES 15 to 25 million. For a larger facility — say 1 MVA — with N+1 or 2N redundancy, the UPS infrastructure alone can range from KES 120 million to KES 250 million or more. These figures include import duties, shipping, and local installation costs.

### What role do diesel generators play alongside UPS systems?

The UPS and generator work as a team. When utility power from Kenya Power fails, the UPS instantly takes over — it detects the interruption in under 4 milliseconds and begins supplying power from its batteries. Within 10 to 30 seconds, the automatic transfer switch (ATS) starts the diesel generator, lets it stabilise, and transfers the load from UPS batteries to generator power. The UPS continues to operate in 'online' mode, conditioning the generator's power to ensure clean, stable electricity reaches the servers. The generator provides power for as long as the outage lasts — limited only by fuel supply. Most Kenyan data centres store **24 to 72 hours** of diesel fuel on site.
