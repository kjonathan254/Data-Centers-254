---
title: "Kenya Power and Data Centres: Why Electricity Is the Biggest Constraint"
slug: "kenya-power-infrastructure-data-centres"
meta_description: "Kenya's geothermal advantage makes it attractive for data centres, but grid reliability and transmission bottlenecks remain the single largest obstacle to growth."
primary_keyword: "Kenya data centre power"
secondary_keywords:
  - "geothermal data centre Kenya"
  - "data centre energy Africa"
  - "PUE data centre"
  - "Kenya electricity grid capacity"
  - "renewable energy data centres"
author: "Kevin Jonathan Onyango Otieno"
author_bio_link: "/about"
published_date: "2026-08-26"
updated_date: "2026-08-27"
category: "Energy"
cluster: "Energy"
og_image: "/images/kenya-transmission-pylons.webp"
reading_time: "12 min"
images:
  - src: "/images/dc-power-systems.webp"
    alt: "Data centre power distribution and backup systems"
    caption: "Power is the backbone of any data centre — UPS systems, generators, and PDUs ensure uninterrupted electricity supply"
    position: "hero"
  - src: "/images/dc-chillers-roof-3.webp"
    alt: "Data centre cooling systems in a modern facility"
    caption: "Cooling accounts for up to 40% of a data centre's total energy consumption, making efficient power supply critical"
    position: "section-break"
  - src: "/images/kenya-solar-farm.webp"
    alt: "Nairobi skyline at dusk"
    caption: "Nairobi's growing data centre industry requires significantly more power than Kenya's grid currently delivers to the city"
    position: "infographic"
  - src: "/images/dc-switchgear.webp"
    alt: "Server racks inside a modern data centre"
    caption: "A single rack can draw 5-10 kilowatts — a 200-rack facility needs 1-2 megawatts just for servers"
    position: "inline"
  - src: "/images/kenya-geothermal-plant-olkaria.webp"
    alt: "Data centre facility exterior in Nairobi"
    caption: "Kenya's data centre growth is constrained not by demand but by the available power supply to facilities"
    position: "inline"
  - src: "/images/diagram-power-chain-grid-to-gpu.webp"
    alt: "Diagram of data centre electrical infrastructure from the national grid to the GPU rack"
    caption: "Every AI workload depends on this chain holding together: generation, transmission, the substation, switchgear, UPS conditioning, and finally rack-level PDU distribution."
    position: "diagram"

internal_links:
  - text: "Kenya data centre licensing framework"
    href: "/articles/kenya-data-centre-licensing-framework"
  - text: "what is a data centre"
    href: "/articles/what-is-a-data-centre"
  - text: "submarine cables landing in Mombasa"
    href: "/articles/submarine-cables-landing-mombasa"
external_sources:
  - title: "Kenya Power and Lighting Company"
    url: "https://www.kplc.co.ke/"
  - title: "Geothermal Development Company of Kenya"
    url: "https://www.gdc.co.ke/"
faq:
  - question: "How much power does a data centre use?"
    answer: "A typical modern colocation facility in Kenya consumes 1-5 megawatts. A hyperscale facility like iXAfrica NBOX1.1 is designed for 4.5 megawatts of IT load. The planned Microsoft-G42 facility was projected to need several hundred megawatts — comparable to a small town."
  - question: "Why is geothermal energy important for Kenyan data centres?"
    answer: "Kenya generates about 45% of its electricity from geothermal sources in the Rift Valley, making it one of the world's largest geothermal producers. Geothermal provides consistent baseload power 24/7, unlike solar or wind which are intermittent. This makes Kenya uniquely positioned among African nations for green data centre operations."
  - question: "What is PUE and why does it matter?"
    answer: "PUE (Power Usage Effectiveness) measures how efficiently a data centre uses power. A PUE of 1.0 means all power goes to servers. A PUE of 1.5 means for every 1 watt used by servers, 0.5 watts go to cooling, lighting, and other overhead. The global average is approximately 1.58. Modern Kenyan facilities target 1.3-1.5."
  - question: "Why did the Microsoft data centre project stall?"
    answer: "The $1 billion Microsoft-G42 AI data centre project stalled in May 2026 because Kenya's national grid could not reliably deliver the hundreds of megawatts the facility required. Government officials indicated that meeting the demand would require rationing power to other consumers."
  - question: "Is Kenya's grid reliable enough for data centres?"
    answer: "Kenya's grid has improved significantly but still experiences outages. Data centres address this with N+1 or 2N redundancy: utility power plus UPS batteries for instant failover, plus diesel generators for extended outages. The Huduma Centre outage in June 2026 showed that not all facilities have adequate backup power."
canonical_url: "https://data-centers-254.vercel.app/articles/kenya-power-infrastructure-data-centres"
---

Kenya's data centre industry faces a paradox. The country has one of Africa's most attractive energy profiles — nearly 90% renewable electricity, dominated by geothermal from the Rift Valley — yet power supply is the single largest constraint on data centre growth. The stalled Microsoft-G42 one-billion-dollar AI data centre project made this painfully clear: you can have the best regulatory framework and the most strategic location, but if the grid cannot deliver the watts, the data centre cannot be built.

This is not a theoretical problem. Kenya's total installed generation capacity stands at approximately 3,500 megawatts, of which about 45% comes from geothermal sources. That sounds substantial until you consider that a single large-scale AI training facility can require 200-500 megawatts — a demand that would represent 5-15% of the entire national grid's firm capacity. The question is not whether Kenya has enough electricity in aggregate, but whether it can deliver sufficient, reliable power to the specific locations where data centres operate.

![Data centre power distribution and backup systems](/images/dc-power-systems.webp)

## Kenya's Energy Mix: The Geothermal Advantage

Kenya's electricity generation is one of the greenest in Africa. The energy mix is dominated by renewable sources: geothermal accounts for approximately 45% of installed capacity, hydroelectric for about 30%, wind for 5-8%, and solar a growing but still small share. Thermal (fossil fuel) generation fills the gaps during peak demand or when renewable output dips.

Geothermal is Kenya's strategic asset for data centres. Unlike solar and wind, geothermal power is available 24 hours a day, 365 days a year, with minimal seasonal variation. The Olkaria geothermal field in the Rift Valley produces over 800 megawatts, and the Geothermal Development Company (GDC) continues to develop new wells. For data centre operators evaluating African locations, Kenya's geothermal baseload offers something few other African nations can match: clean, consistent power without the intermittency that makes solar and wind unsuitable as primary data centre energy sources.

However, the geothermal resource is geographically fixed in the Rift Valley, approximately 100-150 km from Nairobi where data centre demand is concentrated. This creates a transmission bottleneck. The power exists, but moving it from generation source to load centre requires sufficient transmission infrastructure — and this is where the constraint becomes apparent.

## Understanding Data Centre Power Requirements

Data centres are extraordinary electricity consumers. To understand why power is the binding constraint, it helps to understand the scale of demand:

![Diagram of data centre electrical infrastructure from the national grid to the GPU rack](/images/diagram-power-chain-grid-to-gpu.webp)

- A single server rack typically draws 5-10 kilowatts
- A small colocation facility with 100 racks needs 0.5-1 megawatt of IT power
- A mid-size facility like Africa Data Centres Nairobi 1 (200 racks) needs 1-2 megawatts
- A hyperscale facility like iXAfrica NBOX1.1 (500 racks) needs 4-5 megawatts
- An AI training cluster can draw 50-100 megawatts in a single building
- The largest planned facilities globally exceed 1 gigawatt (1,000 megawatts)

But IT load is only part of the story. Data centres need additional power for cooling (removing the heat servers generate), lighting, security systems, and office space. The total facility power is measured by **PUE (Power Usage Effectiveness)**, defined as the ratio of total facility power to IT power. A PUE of 1.5 means for every 1 watt consumed by servers, 0.5 watts go to everything else. So a 5-megawatt IT load with a PUE of 1.5 requires 7.5 megawatts from the grid.

![Cooling systems consume significant power](/images/dc-chillers-roof-3.webp)

## The Transmission Bottleneck

Kenya's national grid is managed by Kenya Power and Lighting Company (KPLC), which operates the transmission and distribution network. While generation capacity has grown substantially, transmission infrastructure has not kept pace. Key challenges include:

**Insufficient transmission capacity to Nairobi.** The corridor from the Rift Valley geothermal fields to Nairobi carries the bulk of the country's power to its largest load centre. During peak demand periods, this corridor operates near its limits, and any disruption — a line fault, maintenance shutdown, or generation shortfall — can cause voltage instability or load shedding in Nairobi.

**Limited redundancy on critical paths.** A single transmission line failure can disconnect significant generation capacity from the grid. The system is resilient against small disruptions but vulnerable to simultaneous failures or large-scale events.

**Distribution constraints in data centre zones.** Even when the national grid has adequate power, delivering it to specific data centre locations along Mombasa Road and other Nairobi corridors requires sufficient local distribution infrastructure. Building new substations and feeders for large data centre loads can take 2-4 years.

The June 2026 Huduma Centre data centre outage in Nakuru demonstrated the practical consequences. A single power supply failure at one facility disrupted government services nationwide. While this was attributed to inadequate backup power at the facility, it highlighted the broader fragility of power supply to critical digital infrastructure.

![Nairobi needs more power for data centre growth](/images/kenya-solar-farm.webp)

## Why the Microsoft-G42 Project Stalled

The most prominent illustration of Kenya's power constraint is the stalled Microsoft and G42 AI data centre project. Announced in early 2026 with a projected investment of one billion dollars, the facility would have been the largest single foreign direct investment in Kenya's digital infrastructure and a powerful signal to the global tech industry that Kenya was open for serious AI infrastructure.

The project stalled in May 2026 when it became clear that the national grid could not reliably deliver the power the facility required. Reports indicated that meeting the project's energy demands would require rationing power to other consumers — a politically untenable proposition for any government. The project has not been formally cancelled, but there is no clear timeline for resolution.

This was a missed opportunity at multiple levels. The investment would have created thousands of construction and operational jobs, positioned Kenya as an AI hub for East Africa, and catalysed further investment in the power infrastructure that would benefit the entire economy. Instead, it became a cautionary tale about the gap between regulatory readiness and infrastructure readiness.

## Backup Power: The Last Line of Defence

Data centres do not rely solely on the grid. Every serious facility has a layered backup power architecture:

**Uninterruptible Power Supply (UPS)** — Battery systems that provide instantaneous power during the seconds between a grid outage and generator startup. UPS systems typically bridge 10-30 seconds, though larger installations can sustain several minutes. They also condition the power, smoothing voltage fluctuations and cleaning harmonic distortion.

**Diesel generators** — For extended outages, diesel generators can run for days or weeks, limited only by fuel supply. A typical large data centre has enough fuel on-site for 24-48 hours of operation, with contractual arrangements for refuelling during prolonged outages.

**Dual utility feeds** — Facilities connected to two independent power feeds from the grid can continue operating even if one feed fails. This is standard for Tier III and Tier IV data centres and is typically a licensing requirement.

The combination of these systems means that a well-designed data centre should never experience downtime due to power issues. The Huduma Centre outage suggests that not all facilities in Kenya meet this standard. For new operators entering the market, backup power is a significant capital cost — diesel generators, UPS systems, and automatic transfer switches can represent 10-15% of total facility cost.

![Server racks need consistent, clean power](/images/dc-switchgear.webp)

## The Path Forward

Solving Kenya's data centre power constraint requires action on multiple fronts:

**Transmission investment.** KPLC and the government need to accelerate investment in high-voltage transmission corridors, particularly from the Rift Valley to Nairobi and from Nairobi to data centre zones. This requires capital, planning approvals, and construction time — typically 3-5 years for major transmission lines.

**On-site generation.** Some data centre operators are exploring on-site power generation, including solar arrays and potentially small geothermal plants. While solar can offset some daytime load, it cannot provide 24/7 baseload power without enormous battery storage, which adds cost and complexity.

**Grid-scale storage.** Battery energy storage systems (BESS) can help manage peak demand and provide backup without diesel generators. Kenya's renewable-heavy grid makes storage particularly valuable for smoothing the output of variable sources.

**Dedicated power infrastructure.** For very large facilities (50+ megawatts), building a dedicated power connection — essentially a private transmission line from a generation source to the data centre — may be the most practical solution. This is what hyperscale operators typically do in other markets.

The policy environment is supportive. The [data centre licensing framework](/articles/kenya-data-centre-licensing-framework) provides regulatory clarity. The National Digital Superhighway Programme signals government commitment. But until the power constraint is addressed through tangible infrastructure investment, Kenya's data centre ambitions will remain capped by the available watts.

![Kenya's growth is constrained by power supply](/images/kenya-geothermal-plant-olkaria.webp)
