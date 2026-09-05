---
title: "Data Centre Cooling Systems: How Servers Stay Cool in Kenya"
slug: "data-centre-cooling-systems-explained"
meta_description: "Cooling accounts for up to 40% of a data centre's total energy use. From CRAC units to liquid cooling, here is how data centres in Kenya keep servers at optimal temperature."
primary_keyword: "data centre cooling systems"
secondary_keywords:
  - "data centre cooling Kenya"
  - "CRAC unit"
  - "liquid cooling data centre"
  - "free cooling data centre"
  - "PUE cooling efficiency"
author: "Kevin Jonathan Onyango Otieno"
author_bio_link: "/about"
published_date: "2026-08-27"
updated_date: "2026-08-27"
category: "Data Centres"
cluster: "Beginner"
og_image: "/images/dc-cooling-crac.webp"
reading_time: "10 min"
images:
  - src: "/images/dc-cooling.webp"
    alt: "Data centre cooling systems"
    caption: "Precision air conditioning and cooling systems are the second-largest energy consumer in any data centre"
    position: "hero"
  - src: "/images/dc-switchgear-2.webp"
    alt:  "Electrical switchgear hall"
    caption: "Power and cooling are the two largest energy consumers — together they determine a facility's PUE"
    position: "section-break"
  - src: "/images/racks-cabling.webp"
    alt:  "Structured cabling connecting server racks"
    caption: "Hot aisle and cold aisle containment improves cooling efficiency by preventing hot and cold air from mixing"
    position: "infographic"
  - src: "/images/whats-inside-ai-data-center.webp"
    alt:  "Cutaway infographic of an AI data centre's systems"
    caption: "Modern high-density servers generate significantly more heat than older equipment, requiring more sophisticated cooling"
    position: "inline"
  - src: "/images/dc-cooling-crac-2.webp"
    alt:  "Data centre cooling and power distribution equipment"
    caption: "Cooling efficiency directly impacts a data centre's carbon footprint and operating costs"
    position: "inline"
  - src: "/images/diagram-dc-rack-overview.webp"
    alt:  "Illustrated overview of data centre rack components and airflow"
    caption: "Rack layouts are planned around cooling: CRAC units push cold air to the front of every rack while hot exhaust returns to the room for conditioning."
    position: "diagram"

internal_links:
  - text: "what is a data centre"
    href: "/articles/what-is-a-data-centre"
  - text: "Kenya power and data centres"
    href: "/articles/kenya-power-infrastructure-data-centres"
  - text: "data centre tier ratings"
    href: "/articles/data-centre-tier-ratings-explained"
external_sources:
  - title: "ASHRAE Data Centre Cooling Guidelines"
    url: "https://www.ashrae.org/"
  - title: "Schneider Electric Data Centre Efficiency"
    url: "https://www.se.com/ww/en/work/products-services/offerings/data-centers/"
faq:
  - question: "Why do data centres get so hot?"
    answer: "Servers convert most of the electricity they consume into heat. A single rack drawing 10 kilowatts produces as much heat as ten 1-kilowatt space heaters running simultaneously. Without active cooling, temperatures would exceed 50°C within minutes, causing servers to throttle performance or shut down to prevent damage."
  - question: "What is PUE and how does cooling affect it?"
    answer: "PUE (Power Usage Effectiveness) is the ratio of total facility power to IT power. A PUE of 1.5 means for every 1 watt used by servers, 0.5 watts go to overhead including cooling. The global average PUE is approximately 1.58. Cooling is typically the largest component of overhead, so improving cooling efficiency is the primary way to reduce PUE."
  - question: "What is hot aisle/cold aisle containment?"
    answer: "Hot aisle/cold aisle containment is a layout technique where server racks are arranged in alternating rows with cold air supplied from one side and hot air exhausted from the other. Physical barriers (doors, curtains, or rigid enclosures) prevent the hot and cold air streams from mixing, dramatically improving cooling efficiency."
  - question: "Is liquid cooling better than air cooling?"
    answer: "For high-density deployments (above 20 kW per rack), liquid cooling is significantly more efficient than air. Liquid transfers heat 1,000x more effectively than air, allowing denser computing. However, liquid cooling is more complex, expensive, and requires specialised equipment. Most Kenyan facilities still use air cooling."
  - question: "Can Kenya's climate help with cooling?"
    answer: "Kenya's temperate climate in Nairobi (average 20-25°C) is favourable for free cooling — using outside air to cool the data centre without running compressors. This can significantly reduce cooling energy costs for parts of the year, especially at night and during cooler months."
canonical_url: "https://data-centers-254.vercel.app/articles/data-centre-cooling-systems-explained"
---

![Data centre cooling systems](/images/dc-cooling.webp)
*Precision air conditioning and cooling systems are the second-largest energy consumer in any data centre*

Every server running inside a [what is a data centre](/articles/what-is-a-data-centre) is essentially a controlled heat source. Processors, memory modules, power supplies, and storage drives all convert electrical energy into thermal energy as a byproduct of computation. The fundamental challenge of data centre operations is removing that heat fast enough to keep hardware within safe operating ranges — typically 18–27°C as defined by [ASHRAE Data Centre Cooling Guidelines](https://www.ashrae.org/).

Cooling is not optional infrastructure. It is the system that determines whether a facility can reliably operate at all. This article breaks down every major cooling technology used in data centres today, explains how each affects Power Usage Effectiveness, and examines what Kenyan operators are deploying given local climate conditions and grid realities.

## Why Cooling Is the Second-Largest Energy Consumer

In a typical data centre, IT equipment accounts for roughly 50–60% of total electricity consumption. Cooling systems consume another 30–40%. The remaining 10–15% covers lighting, security, and ancillary systems. That makes cooling the single largest overhead category and the primary lever for improving operational efficiency.

The relationship between cooling and overall efficiency is measured through PUE. A facility with a PUE of 2.0 spends exactly as much on cooling and other overhead as it does on actual computing. A facility with a PUE of 1.2 directs only 20% of its total power to non-IT loads — and the majority of that 20% is cooling. Every 0.1 improvement in PUE translates to meaningful cost savings at scale.

![Electrical switchgear hall](/images/dc-switchgear-2.webp)
*Power and cooling are the two largest energy consumers — together they determine a facility's PUE*

Understanding the [Kenya power and data centres](/articles/kenya-power-infrastructure-data-centres) landscape is critical here. Kenya's electricity tariffs are among the highest in East Africa, so cooling inefficiency directly erodes the commercial viability of any colocation or hyperscale facility operating in Nairobi, Mombasa, or elsewhere in the country.

## How Do Data Centre Cooling Systems Work?

All data centre cooling systems perform the same basic function: absorb heat from IT equipment and reject it outside the facility. The differences lie in the medium used to transfer heat (air, water, or refrigerant), the mechanism driving the transfer (fans, pumps, compressors, or natural convection), and the level of precision in temperature and humidity control.

The cooling chain typically works in stages. First, heat is captured at the server level — either by air flowing over heat sinks or by cold plates or immersion fluid in direct contact with components. That heat is then transported to a heat rejection system (chiller, cooling tower, or dry cooler) which transfers it to the external environment. Each stage in this chain introduces energy consumption and potential points of failure.

## The Six Major Cooling Types Compared

| Cooling Type | How It Works | Typical PUE Impact | Best For | Complexity | Cost |
|---|---|---|---|---|---|
| **CRAC/CRAH (Precision Air)** | Chilled air blown under raised floor or through ducts into server intakes | 1.5 – 1.8 | Low to medium density (5–15 kW/rack) | Low | Low–Medium |
| **Free Cooling (Air-Side)** | Outside air filtered and ducted directly into the white space when ambient conditions allow | 1.2 – 1.5 | Temperate climates, medium density | Low–Medium | Low |
| **Free Cooling (Water-Side)** | Cooling towers or dry coolers use cool ambient air to chill water without compressors | 1.2 – 1.4 | Most climates, medium to high density | Medium | Medium |
| **Rear-Door Heat Exchangers** | Passive or active heat exchangers mounted on the back of racks, cooling exhaust air | 1.3 – 1.5 | High-density retrofit (15–30 kW/rack) | Medium | Medium |
| **Direct Liquid Cooling** | Cold plates or direct-to-chip cooling loops circulate chilled water to CPUs and GPUs | 1.1 – 1.3 | Very high density (30–100+ kW/rack) | High | High |
| **Immersion Cooling** | Entire servers submerged in dielectric fluid that absorbs and carries away heat | 1.03 – 1.1 | Extreme density (50–100+ kW/rack), HPC, AI | Very High | Very High |

Each technology occupies a specific niche based on rack power density, climate, and budget. Most commercial colocation facilities in sub-Saharan Africa rely on precision air cooling with some form of free cooling supplement.

![Cutaway infographic of an AI data centre's systems](/images/whats-inside-ai-data-center.webp)
*Modern high-density servers generate significantly more heat than older equipment, requiring more sophisticated cooling*

## CRAC and CRAH Units: The Industry Standard

Computer Room Air Conditioning (CRAC) units and Computer Room Air Handler (CRAH) units are the most widely deployed cooling systems in data centres worldwide, and Kenya is no exception. Both deliver conditioned air to the white space, but they differ in how they produce cold air.

![Illustrated overview of data centre rack components and airflow](/images/diagram-dc-rack-overview.webp)

A CRAC unit contains its own refrigeration cycle — compressor, condenser, and evaporator — similar to a split-system air conditioner but with far tighter temperature and humidity control. It can operate independently, which makes it straightforward to deploy. However, the onboard compressor makes it less energy-efficient than alternatives that separate the cooling production from the air delivery.

A CRAH unit, by contrast, does not have a compressor. It receives chilled water from a central chiller plant and uses a coil and fan to transfer that cooling to the data centre air. Because the chiller plant can be optimised separately — and because water transfers heat far more efficiently than refrigerant in small distributed units — CRAH-based systems generally achieve better PUE than CRAC-based systems in facilities above 500 kW of IT load.

Most [data centre tier ratings](/articles/data-centre-tier-ratings-explained) at Tier II and above in East Africa use CRAH units fed by centralised chiller plants with N+1 or 2N redundancy. This provides the reliability and precision that enterprise and hyperscale customers demand.

## Hot Aisle and Cold Aisle Containment

Regardless of whether a facility uses CRAC or CRAH units, the arrangement of airflow within the white space has an enormous impact on cooling effectiveness. Without containment, the cold air supplied to servers mixes with the hot exhaust air before it reaches the intakes. This mixing forces cooling systems to work harder and supply more air than would otherwise be necessary.

![Structured cabling connecting server racks](/images/server-rack-patch-cabling.webp)
*Hot aisle and cold aisle containment improves cooling efficiency by preventing hot and cold air from mixing*

Hot aisle/cold aisle containment solves this problem by physically separating the two air streams. Server racks are arranged in alternating rows. Cold air is delivered to the front of the racks (the cold aisle), and hot exhaust air is collected from the rear (the hot aisle). Doors, plastic curtains, or rigid enclosures seal the aisles to prevent recirculation.

The results are significant. Facilities that implement containment typically see a 10–25% reduction in cooling energy consumption. Supply air temperature can be raised (because it is not diluted by hot air), which allows chillers to operate more efficiently or free cooling to be used for more hours per year. In Nairobi's climate, containment combined with elevated supply temperatures can enable air-side economiser operation for a substantial portion of the year.

## Free Cooling: Leveraging Kenya's Climate

Free cooling is not a single technology but a design philosophy: use the external environment as a heat sink whenever possible, and only run mechanical refrigeration when ambient conditions make it unavoidable. There are two main approaches.

Air-side economisers draw outside air through filters and directly into the data centre white space when the outside temperature and humidity fall within acceptable ranges. This is the simplest and cheapest form of free cooling, but it requires robust filtration to prevent dust, pollen, and pollutants from entering the white space — a real concern in Nairobi and other urban African environments.

Water-side economisers use cooling towers or dry coolers to chill the water loop without engaging the chiller compressors. Because water is a much better heat transfer medium than air, water-side economisers can operate effectively at higher ambient temperatures than air-side systems. In Nairobi, where average temperatures range from 20–25°C and nighttime temperatures regularly drop below 18°C, water-side free cooling can displace mechanical cooling for a significant number of hours annually.

The [Schneider Electric Data Centre Efficiency](https://www.se.com/ww/en/work/products-services/offerings/data-centers/) research indicates that facilities in climates similar to Nairobi's can achieve free cooling for 40–60% of annual operating hours using water-side economisers. This is one of the strongest operational advantages Kenyan data centres have over facilities in hotter climates like Lagos or Dubai.

## Liquid Cooling: The Future of High-Density Computing

As server power densities increase — driven by GPU-intensive AI workloads, high-performance computing, and converged infrastructure — air cooling is reaching its practical limits. Moving air is inherently inefficient because air has very low heat capacity compared to liquids. Water, for example, transfers heat roughly 1,000 times more effectively than air by volume.

Direct liquid cooling circulates chilled water through cold plates mounted directly on processors and other high-heat components. The water absorbs heat at the component level and carries it away to a heat rejection system. This approach can handle rack densities of 30–100 kW or more, far beyond what air cooling can manage without enormous airflow volumes.

Immersion cooling takes this further by submerging entire server boards in a dielectric (non-conductive) fluid. The fluid absorbs heat from all components simultaneously and is then circulated through a heat exchanger. Immersion cooling achieves some of the lowest PUE values in the industry — often below 1.1 — because nearly all heat is captured directly with minimal thermal resistance.

While liquid cooling is still rare in Kenyan data centres today, the rapid growth of cloud computing, AI, and edge computing in East Africa is likely to drive adoption over the next five to ten years. Facilities that plan for liquid cooling infrastructure during initial construction — including floor load capacity, piping routes, and heat rejection systems — will be better positioned to serve high-density customers.

## Rear-Door Heat Exchangers: A Practical Middle Ground

For facilities with existing air-cooled infrastructure that need to support higher density racks without a complete cooling overhaul, rear-door heat exchangers (RDHx) offer a compelling solution. These units mount directly on the back of standard server racks and contain a cooling coil connected to a chilled water loop.

As hot exhaust air leaves the servers, it passes through the RDHx coil and is cooled before it enters the room. This means the heat is captured and removed at the rack level, before it can contribute to overall room heat load. Active RDHx units include fans to assist airflow, while passive units rely on the server fans alone.

Rear-door heat exchangers are particularly attractive for colocation facilities in Kenya because they can be deployed rack-by-rack as customer density increases, without requiring changes to the room-level cooling infrastructure. This incremental deployment model matches the growth patterns of East African data centres, where demand builds gradually rather than in large hyperscale jumps.

## Humidity Control: The Overlooked Cooling Challenge

Temperature is not the only environmental parameter that matters. ASHRAE recommends maintaining relative humidity between 20% and 80% in the data centre (with a tighter 40–60% range preferred for optimal equipment longevity). Air that is too dry increases the risk of electrostatic discharge. Air that is too humid risks condensation on cold surfaces and corrosion of circuit boards.

In Nairobi, the main humidity challenge is seasonal variation. During the long rains (March–May) and short rains (October–December), humidity can rise significantly, requiring dehumidification. During drier months, humidification may be needed. Both processes consume energy. Modern CRAC and CRAH units integrate humidification and dehumidification, but these functions must be carefully controlled to avoid wasting energy fighting against ambient conditions that could otherwise be tolerated within ASHRAE's wider allowable range.

## What Cooling Systems Are Used in Kenyan Data Centres?

The data centre market in Kenya is anchored by facilities in Nairobi, with additional presence in Mombasa. The major operators — including Africa Data Centres, PAIX (now part of Liquid Intelligent Technologies), and several carrier-neutral colocation providers — predominantly use precision air cooling with CRAH units fed by centralised chiller plants.

Most Tier III facilities in Nairobi deploy N+1 or 2N chiller configurations with water-side economiser capability. This gives them the redundancy required by their [data centre tier ratings](/articles/data-centre-tier-ratings-explained) while also allowing them to leverage Nairobi's favourable climate for free cooling during cooler periods. Raised floors with perforated tiles remain the standard air delivery method, supplemented by hot aisle containment in more recently built or upgraded halls.

Air-side free cooling is less common in Kenya's urban centres due to air quality concerns. Nairobi's dust levels, combined with seasonal pollution from vehicles and industry, make direct air-side economisers risky without very high-efficiency filtration systems, which themselves add pressure drop and fan energy. Water-side economisers avoid this issue entirely because the external air only contacts the cooling tower water, not the data centre air supply.

Liquid cooling and immersion cooling are not yet mainstream in Kenyan facilities, but several operators are evaluating these technologies as they prepare for anticipated demand from AI and high-performance computing workloads. The modular data centre containers that some providers deploy to regional markets outside Nairobi are also beginning to incorporate direct liquid cooling options.

## Cooling Efficiency and PUE: The Numbers That Matter

PUE remains the industry's primary metric for cooling efficiency, and understanding the relationship between cooling technology and PUE is essential for both operators and customers.

A facility using only CRAC units with no containment and no free cooling will typically achieve a PUE of 1.8–2.0. Adding hot aisle containment might bring that down to 1.6–1.7. Upgrading to a CRAH system with water-side economisers and containment can achieve PUE values of 1.4–1.5. The most efficient facilities globally — using liquid cooling, free cooling, and advanced containment — operate at PUE values below 1.2.

![Data centre cooling and power distribution equipment](/images/dc-cooling-crac-2.webp)
*Cooling efficiency directly impacts a data centre's carbon footprint and operating costs*

For Kenyan operators, the economics are stark. At commercial electricity rates in Kenya, every 0.1 improvement in PUE on a 1 MW facility translates to approximately KES 15–20 million in annual energy savings. Over a 10–15 year facility lifecycle, the cumulative savings from cooling efficiency investments easily justify the upfront capital expenditure.

## The Path Forward for Cooling in East Africa

Cooling technology in Kenyan data centres is evolving along three parallel tracks. First, existing air-cooled facilities are being optimised through better containment, elevated supply temperatures, and maximised free cooling hours. Second, new constructions are incorporating infrastructure that supports future liquid cooling deployment. Third, operators are investing in real-time monitoring and AI-driven cooling management systems that dynamically adjust cooling capacity to match actual IT load, eliminating the waste of overcooling.

Nairobi's altitude (approximately 1,795 metres above sea level) and temperate climate are genuine competitive advantages for data centre operations. The thinner, cooler air at altitude improves both natural heat dissipation and cooling tower efficiency. Combined with Kenya's growing renewable energy portfolio — particularly geothermal and wind power — the country has the foundational conditions to develop some of the most operationally efficient data centres on the continent.

The operators that will lead this market are those that treat cooling not as a cost to be minimised but as a system to be engineered for maximum performance per watt. In a region where electricity is expensive and demand for digital infrastructure is growing rapidly, cooling efficiency is not just an operational concern — it is a strategic imperative.

---

**External sources:**
- [ASHRAE Data Centre Cooling Guidelines](https://www.ashrae.org/)
- [Schneider Electric Data Centre Efficiency](https://www.se.com/ww/en/work/products-services/offerings/data-centers/)
