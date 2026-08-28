---
title: "Data Centre PUE Explained: Measuring and Improving Power Efficiency in Kenya"
slug: "data-centre-pue-power-usage-effectiveness"
meta_description: "Power Usage Effectiveness (PUE) is the key metric for data centre energy efficiency. Learn how PUE is calculated, what good and bad PUE values look like, and how Kenyan facilities can improve their efficiency."
primary_keyword: "data centre PUE"
secondary_keywords:
  - "power usage effectiveness"
  - "data centre energy efficiency"
  - "data centre power consumption Kenya"
  - "reduce data centre energy costs"
  - "green data centre metrics"
author: "Kevin Jonathan Onyango Otieno"
author_bio_link: "/about"
published_date: "2026-08-28"
updated_date: "2026-08-28"
category: "Energy Efficiency"
cluster: "Energy"
og_image: "/images/og-default.png"
reading_time: "11 min"
images:
  - src: "/images/dc-environment-sustainability.png"
    alt: "Data centre energy efficiency and sustainability"
    caption: "PUE is the most widely used metric for measuring how efficiently a data centre uses energy — a lower PUE means less waste and lower operating costs"
    position: "hero"
  - src: "/images/dc-cooling.webp"
    alt: "Cooling systems are the largest source of PUE overhead"
    caption: "Cooling accounts for the majority of PUE overhead in most data centres — improving cooling efficiency is the fastest path to a lower PUE"
    position: "section-break"
  - src: "/images/dc-power-systems.webp"
    alt: "Power monitoring and measurement for PUE calculation"
    caption: "Accurate PUE measurement requires power meters at multiple points: the utility entry, the UPS output, and at individual racks or PDUs"
    position: "inline"
  - src: "/images/dc-challenges.png"
    alt: "Challenges in optimising data centre energy efficiency"
    caption: "Older facilities face structural challenges in improving PUE — retrofitting hot/cold aisle containment or upgrading cooling systems can be expensive and disruptive"
    position: "inline"
internal_links:
  - text: "data centre cooling systems explained"
    href: "/articles/data-centre-cooling-systems-explained"
  - text: "solar power for data centres"
    href: "/articles/solar-power-data-centres-kenya"
  - text: "geothermal energy powering Kenya's data centres"
    href: "/articles/geothermal-energy-kenya-data-centres"
external_sources:
  - title: "The Green Grid - PUE"
    url: "https://www.thegreengrid.org/en/resources/library-and-references/white-papers/wp49-pue-a-comprehensive-examination-of-the-metric"
  - title: "Uptime Institute - PUE Survey"
    url: "https://uptimeinstitute.com/"
faq:
  - question: "What is a good PUE value?"
    answer: "A PUE of 1.0 is theoretically perfect (all power goes to IT equipment, nothing wasted). The global average for well-managed facilities is 1.5-1.7. Best-in-class facilities achieve 1.1-1.3. In Kenya, most facilities operate at 1.4-1.7. A PUE above 2.0 indicates significant inefficiency that should be investigated and addressed."
  - question: "How is PUE calculated?"
    answer: "PUE = Total Facility Power divided by IT Equipment Power. Total Facility Power includes everything: servers, storage, networking, cooling, lighting, and losses in power conversion. IT Equipment Power is the power consumed only by the computing equipment. A facility with 1MW of IT load and 0.5MW of cooling and overhead has a PUE of 1.5."
  - question: "Why is PUE important for Kenyan data centres?"
    answer: "PUE directly affects operating costs. A 1MW data centre with a PUE of 1.7 pays for 1.7MW of power from Kenya Power. Reducing PUE to 1.4 cuts the power bill by approximately 18%, saving KES 30-40 million per year. PUE also affects competitiveness — customers increasingly compare PUE values when choosing between facilities, and lower PUE is a sustainability credential."
  - question: "What is the difference between PUE and WUE?"
    answer: "PUE (Power Usage Effectiveness) measures energy efficiency. WUE (Water Usage Effectiveness) measures water efficiency — how many litres of water are used per kilowatt-hour of IT energy. WUE matters for facilities using evaporative cooling, which consumes water. PUE is the more widely used metric, but WUE is gaining attention as water scarcity becomes a concern in some data centre markets."
  - question: "Can PUE be gamed or misleading?"
    answer: "Yes. PUE can be misleading if not measured consistently. Common issues include measuring PUE only during cool periods (when cooling loads are lowest), excluding certain power-consuming systems from the calculation, or measuring IT power at the UPS output (which excludes power distribution losses). The Green Grid recommends measuring PUE continuously and reporting annual average PUE to prevent cherry-picking of favourable periods."
canonical_url: "https://data-centers-254.vercel.app/articles/data-centre-pue-power-usage-effectiveness"
---

If you run a data centre that consumes 1 megawatt of power for your servers but your total electricity bill is for 1.7 megawatts, you are spending 70% more on electricity than your IT equipment actually needs. The extra 0.7 megawatts is going to cooling, lighting, power conversion losses, and other overhead. This ratio — total power divided by IT power — is the Power Usage Effectiveness (PUE), and it is the single most important metric for understanding how efficiently a data centre uses energy.

![Data centre energy efficiency and sustainability](/images/dc-environment-sustainability.png)

PUE was developed by The Green Grid, an industry consortium, in 2007. It has become the universal language of data centre energy efficiency — used by operators to track their performance, by customers to compare facilities, by investors to assess operational quality, and by regulators to evaluate environmental impact. Understanding PUE is essential for anyone involved in data centres in Kenya, where power costs are a significant operating expense and where the renewable grid provides both an opportunity and a responsibility to use energy wisely.

## How PUE Is Calculated

The formula is simple:

**PUE = Total Facility Power / IT Equipment Power**

Total Facility Power is everything the facility draws from the grid (or from generators): servers, storage, network equipment, UPS systems, cooling equipment, lighting, security systems, and all other electrical loads. IT Equipment Power is only the power consumed by the computing equipment: servers, storage, and network devices that perform actual work for the facility's customers.

A PUE of 1.0 would mean that every watt drawn from the grid goes to IT equipment — zero overhead. This is physically impossible in practice, because some power must always be used for cooling, lighting, and power conversion losses. The theoretical minimum PUE depends on the climate and the cooling technology, but even in the most efficient facilities, PUE rarely drops below 1.05.

## What PUE Values Mean

### PUE 1.0–1.2: Exceptional

Facilities in this range are among the most efficient in the world. They typically use advanced cooling technologies (free cooling, liquid cooling, or both), operate in cool climates, and have been purpose-designed for efficiency. Google publishes average annual PUE values of approximately 1.10 for its newest facilities. In Kenya, achieving PUE below 1.2 is challenging but possible for new facilities that leverage Nairobi's climate for free cooling and use hot/cold aisle containment.

### PUE 1.2–1.5: Good

![Cooling systems are the largest source of PUE overhead](/images/dc-cooling.webp)

This is the range that well-designed and well-operated facilities in temperate climates achieve. In Kenya, newer facilities like iXAfrica's NBOX1 target this range. These facilities use a combination of free cooling and mechanical cooling, have good airflow management (hot/cold aisle containment or chimney cabinets), and use efficient power distribution equipment. Most new colocation facilities being built in Kenya should aim for this range.

### PUE 1.5–1.8: Average

This is the range where most existing Kenyan facilities operate. It reflects adequate but not optimised cooling, some airflow management inefficiencies, and power distribution equipment that is not the most efficient available. A PUE in this range is not bad — it is average — but it represents an opportunity for improvement. For a 2MW data centre, moving from PUE 1.7 to PUE 1.4 would save approximately KES 50–70 million per year in electricity costs.

### PUE Above 2.0: Inefficient

A PUE above 2.0 means that overhead (cooling, lighting, power losses) consumes more power than the IT equipment itself. This is typically found in older facilities, facilities in hot and humid climates without adequate cooling design, or facilities that have been poorly operated or maintained. In Kenya, some older enterprise data centres and poorly designed server rooms may fall into this range. A PUE above 2.0 should be investigated — the causes are usually identifiable and addressable.

## What Drives PUE in Kenyan Data Centres

### Cooling (The Biggest Factor)

Cooling is typically the largest single contributor to PUE overhead, accounting for 30–50% of total facility power in a facility without free cooling. In Nairobi's climate (average 18–25°C, moderate humidity), free cooling — using outside air to cool the data centre rather than mechanical refrigeration — can be used for significant portions of the year. Facilities that maximise free cooling achieve lower PUE values.

The [cooling systems guide](/articles/data-centre-cooling-systems-explained) covers the technologies in detail. For PUE optimisation, the key strategies are: maximise free cooling hours, implement hot/cold aisle containment to prevent mixing of hot and cold air, use variable-speed drives on cooling fans and pumps, and maintain cooling equipment to ensure peak efficiency.

### Power Distribution Losses

Power undergoes multiple conversions between the grid and the server. Each conversion — from the utility's high voltage to the facility's medium voltage, from medium voltage to the UPS input, from the UPS output to the PDU, and from the PDU to the server — involves some energy loss in the form of heat. Modern, high-efficiency transformers and UPS systems can minimise these losses, but they cannot be eliminated entirely.

The typical power chain efficiency in a Kenyan data centre is approximately 88–92%. This means that for every 100 watts drawn from the grid, only 88–92 watts reach the IT equipment, with 8–12 watts lost as heat in transformers, UPS systems, and PDUs. Choosing high-efficiency equipment (97%+ efficient transformers, 96%+ efficient UPS systems in eco-mode) can improve this significantly.

### Lighting and Other Loads

![Power monitoring and measurement for PUE calculation](/images/dc-power-systems.webp)

Lighting, security systems, office areas, and other miscellaneous loads typically account for 3–5% of total facility power. While individually small, these loads contribute to PUE. LED lighting, occupancy sensors, and efficient building management can minimise these loads. Some facilities have reduced lighting loads to negligible levels by using LED fixtures with occupancy sensors and by minimising the lit area (lighting only aisles where personnel are present).

## Measuring PUE Accurately

Accurate PUE measurement requires power metering at two points: the total facility power input (typically at the utility meter or generator output) and the IT equipment power (measured at the output of the facility's power distribution system, typically at the PDU level).

The challenge in Kenya is that many facilities lack the metering infrastructure needed for accurate, continuous PUE measurement. Without power meters at the right points, PUE must be estimated — and estimates can be significantly inaccurate. Investing in proper power metering (sub-meters at PDUs, branch circuit monitors, and a centralised monitoring system) is the first step in any PUE improvement programme.

The Green Grid recommends measuring PUE continuously and reporting the annual average. Measuring PUE only during favourable conditions (cool nights, mild weather) produces misleadingly good numbers. The annual average captures seasonal variations and provides a fair representation of the facility's efficiency.

## Strategies to Improve PUE in Kenya

### Hot/Cold Aisle Containment

Hot/cold aisle containment is the single most cost-effective PUE improvement for most existing facilities. By physically separating the cold air supply from the hot air exhaust — using doors, curtains, or ceiling panels — the cooling system delivers cold air more efficiently and does not waste energy cooling air that is already hot. Containment can reduce cooling energy by 10–25%, typically improving PUE by 0.1–0.3 points.

### Raise the Temperature

![Challenges in optimising data centre energy efficiency](/images/dc-challenges.png)

ASHRAE's recommended environmental range for data centres allows inlet temperatures up to 27°C (with appropriate humidity management). Many older facilities operate at 18–20°C, significantly cooler than necessary. Raising the set point by even 2–3 degrees reduces cooling energy consumption by 5–15%. In Nairobi's climate, operating at 24–26°C with appropriate containment allows more hours of free cooling and reduces mechanical cooling requirements.

### Optimise Free Cooling

Nairobi's climate allows free cooling for approximately 4,000–6,000 hours per year (depending on the specific temperature and humidity thresholds). Maximising these hours — through proper controls, appropriate set points, and well-maintained cooling equipment — is the most impactful PUE strategy for Kenyan facilities. Facilities that do not use free cooling at all are leaving significant efficiency gains on the table.

### Variable-Speed Drives

Cooling fans and pumps that run at fixed speed consume the same amount of energy regardless of the cooling demand. Variable-speed drives (VSDs) allow fans and pumps to slow down when cooling demand is low, reducing energy consumption proportionally. VSDs are a standard feature on modern cooling equipment but may be absent in older installations.

PUE is not just a metric — it is a management tool. By measuring PUE continuously, setting targets, and tracking improvement over time, data centre operators in Kenya can reduce their operating costs, improve their environmental credentials, and demonstrate to customers that they are operating efficiently. In a market where power costs are a significant competitive factor, PUE improvement is a direct path to better margins and stronger market positioning.
