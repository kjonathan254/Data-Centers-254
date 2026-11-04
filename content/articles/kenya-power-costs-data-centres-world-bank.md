---
title: "Kenya Data Centres Pay 17.5 Cents Per kWh. Here's Why"
slug: kenya-power-costs-data-centres-world-bank
meta_description: "Kenya's businesses pay 17.5 US cents per kWh, more than double Viet Nam. The World Bank links the gap to power sector governance. What it means for data centres."
primary_keyword: "Kenya power costs data centres"
secondary_keywords:
  - "Kenya electricity cost per kWh"
  - "data centre power costs Kenya"
  - "independent power producers Kenya IPPs"
  - "World Bank Kenya Economic Update 2026"
  - "colocation electricity pricing Kenya"
author: "Kevin Jonathan Otieno"
author_bio_link: "/about"
published_date: "2026-11-04"
updated_date: "2026-11-04"
category: "Power & Energy"
cluster: "Energy"
og_image: "/images/kenya-hv-substation-yard.webp"
reading_time: "9 min"
images:
  - src: "/images/kenya-hv-substation-yard.webp"
    alt: "High voltage substation yard with transformers and transmission equipment in Kenya"
    caption: "Every shilling of grid cost is contracted years before it reaches a meter, and the World Bank now argues governance inside those contracts is why Kenyan power is expensive"
    position: "hero"
  - src: "/images/hv-power-transformer-bay.webp"
    alt: "High voltage power transformer bay at an electrical installation"
    caption: "Power purchase agreements with independent power producers set the price base that Kenya Power passes through to business and industrial customers"
    position: "section-break"
  - src: "/images/diagram-power-chain-grid-to-gpu.webp"
    alt: "Diagram of the power chain from grid connection to GPU server racks"
    caption: "Grid price flows straight into data centre operating cost: a 1 MW IT load at a typical PUE draws 1.5 to 1.8 MW of facility power, every hour of every year"
    position: "inline"
  - src: "/images/kenya-geothermal-plant-olkaria.webp"
    alt: "Geothermal power plant at Olkaria in Kenya"
    caption: "The resource is not the problem: Kenya's grid runs on about 90 percent renewables with firm geothermal base load, which is exactly why the cost gap needs another explanation"
    position: "section-break"
internal_links:
  - text: "how Kenya Power tariffs are structured for data centres"
    href: "/articles/kenya-power-tariffs-data-centres"
  - text: "the Olkaria geothermal corridor buildout"
    href: "/articles/olkaria-geothermal-data-centre-corridor"
  - text: "Kenya's data centre pipeline beyond Nairobi"
    href: "/articles/kenya-data-centre-pipeline-110mw-beyond-nairobi"
  - text: "the race to power AI data centres in Kenya"
    href: "/articles/kenya-ai-data-centre-power-race"
external_sources:
  - title: "World Bank, Kenya Economic Update, Edition No. 34, November 2026: Special Focus on Governance Constraints to Economic Growth and Job Creation"
    url: "https://documents.worldbank.org/en/publication/documents-reports/documentdetail/099110226121518967"
  - title: "Global Petrol Prices, electricity prices (underlying data for the World Bank's Table 5 comparison)"
    url: "https://www.globalpetrolprices.com/electricity_prices/"
faq:
  - question: "How much does electricity cost for businesses in Kenya?"
    answer: "According to the World Bank's Kenya Economic Update published in November 2026, Kenyan businesses pay about 17.5 US cents per kWh, compared with 7.8 in Viet Nam, 10.9 in Morocco, 10.0 in South Africa and 11.8 in Uganda. Households pay about 22.0 US cents per kWh, more than double the Vietnamese household rate of 7.8."
  - question: "What did the World Bank say about Kenya's power purchase agreements?"
    answer: "The report's Box 6 on high-cost IPPs and conflicts of interest notes that the integrity of power purchase agreements has been investigated by the Presidency and the National Assembly, that some public officials involved in approving IPP projects were later employed by or owned relevant generation companies, and that limited transparency about beneficial ownership keeps the ultimate owners of many IPP contractors unknown."
  - question: "Why do power costs matter so much for data centres?"
    answer: "Electricity is the largest operating cost in a data centre, typically 30 to 40 percent of total opex, and facility power draw exceeds IT load because of cooling and conversion losses. A 1 MW IT load at a PUE of 1.5 to 1.8 consumes 1.5 to 1.8 MW of facility power continuously, so every cent per kWh compounds directly into colocation pricing and cloud rates."
  - question: "Would anti-corruption reforms lower Kenya's power prices?"
    answer: "The World Bank's modeling is economy-wide rather than a tariff forecast: moderate anti-corruption reforms could raise GDP by 8.7 percent by 2035 relative to a non-reform scenario, and stronger reforms by 22.3 percent, while reducing the debt-to-GDP ratio by up to 18 percent relative to the status quo. For power specifically, the report points to competitive PPA procurement and beneficial ownership transparency as the governance fixes that address high-cost contracts."
  - question: "Is Kenya still attractive for data centres despite high power costs?"
    answer: "The resource base remains a genuine advantage: the grid runs on roughly 90 percent renewable generation with firm geothermal capacity, and operators can negotiate dedicated supply arrangements and supplement with on-site generation. The World Bank's findings suggest the cost problem lies in procurement and contract governance rather than in the underlying electricity resource."
canonical_url: "https://data-centers-254.vercel.app/articles/kenya-power-costs-data-centres-world-bank"
---

Kenyan businesses pay about 17.5 US cents per kWh for electricity, according to the World Bank's Kenya Economic Update published on 3 November 2026, more than double the 7.8 cents Vietnamese businesses pay and close to 50 percent above Uganda's 11.8 cents. The same report, whose special focus is governance constraints to growth, goes further than previous editions: it devotes a dedicated box to high-cost independent power producers and conflicts of interest, arguing that the way power contracts have been procured and approved, not the underlying resource, explains much of the premium. For Kenya's data centre market, where electricity is the largest operating cost line, that diagnosis matters as much as the number itself.

## The Numbers Behind the Bill

The comparison comes from Table 5 of the report, using Global Petrol Prices data. The pattern holds across customer classes:

| Customer class | Kenya | Viet Nam | Morocco | South Africa | Uganda |
|---|---|---|---|---|---|
| Regular households | 22.0 | 7.8 | 11.9 | 19.8 | 17.2 |
| Businesses | 17.5 | 7.8 | 10.9 | 10.0 | 11.8 |

Two things stand out. First, Kenya is the most expensive of the five for both groups. Second, the countries Kenya is competing with for data centre investment, Morocco and South Africa among them, run grids that cost businesses 40 to 43 percent less per unit. When a colocation operator prices a Nairobi megawatt against a Casablanca or Johannesburg one, the tariff spread is the starting gap before land, cooling or financing enter the comparison. [How Kenya Power's tariffs are structured](/articles/kenya-power-tariffs-data-centres) explains where the metered number comes from; the World Bank's finding is about what sets that tariff base in the first place.

![High voltage power transformer bay at an electrical installation](/images/hv-power-transformer-bay.webp)

## What the World Bank Says Is Driving the Cost

Kenya's grid is built and run by four state companies: KenGen generates, the Geothermal Development Company develops steam fields, KETRACO transmits and Kenya Power distributes and bills, buying in from independent power producers along the way. The report does not dispute the sector's engineering. Its Box 6, titled "High-cost IPPs and conflicts of interest", argues the problem lives in the contracting:

- The integrity of power purchase agreements has been investigated by both the Presidency and the National Assembly.
- For several IPPs, public officials involved in approving the projects were later employed by, or owned, the relevant generation companies.
- Beneficial ownership of IPP contractors is largely opaque: when the Business Registration Service provided Parliament a list of IPP owners and shareholders, the majority were listed as foreign corporations, leaving the ultimate beneficial owners unknown.

The report also notes that competitive PPA procedures exist on paper but have not been consistently followed across successive procurement rounds. In other words, the premium in the tariff is read as the price of rent inside a small number of long-dated contracts, layered onto costs that pass through Kenya Power to every industrial meter. For a deeper technical treatment of the grid buildout that runs alongside this, [the Olkaria geothermal corridor](/articles/olkaria-geothermal-data-centre-corridor) covers the generation side.

![Diagram of the power chain from grid connection to GPU server racks](/images/diagram-power-chain-grid-to-gpu.webp)

## Why This Lands in Data Centre Economics

Power is the single largest operating cost in a data centre, typically 30 to 40 percent of total opex, and the meter runs harder than the IT load suggests: a 1 MW IT load at a power usage effectiveness of 1.5 to 1.8 draws 1.5 to 1.8 MW of facility power, continuously. Multiply the tariff gap by that draw and the arithmetic gets unforgiving. A 1 MW IT load at PUE 1.6 consumes about 14.0 GWh of electricity a year, so the 7.5-cent spread against South Africa's 10.0 cents works out to roughly 1.05 million dollars a year for every megawatt of IT load, before a single rack is sold. That is the spread that either compresses colocation margins or surfaces in Nairobi rack prices, and it is part of why every major Kenyan facility announcement leads with its power arrangement.

The frustration for operators is that Kenya's resource should be an edge, not a penalty. The grid runs on roughly 90 percent renewables with firm geothermal base load, the exact profile AI-capable facilities claim to want, and the 110 MW of pipeline capacity [beyond Nairobi](/articles/kenya-data-centre-pipeline-110mw-beyond-nairobi) is being sold on that sustainability story. The World Bank's diagnosis sharpens the point: the constraint is not the steam field, it is the contract that prices it.

![Geothermal power plant at Olkaria in Kenya](/images/kenya-geothermal-plant-olkaria.webp)

## What Reform Would and Would Not Change

People assume an anti-corruption report means cheaper power next quarter. It does not, and the report is careful about scope. Its modeling is economy-wide: moderate anti-corruption reforms could lift GDP by 8.7 percent by 2035 relative to a non-reform scenario, and stronger reforms by 22.3 percent, while reducing the debt-to-GDP ratio by up to 18 percent relative to the status quo, with up to 7.7 million people gaining more and better jobs and household consumption up to 27 percent above baseline. Those are demand-side numbers, not tariff forecasts, and Kenya's growth outlook of 5.2 percent in the first half of 2026, still below 5 percent over the medium term, gives the fiscal argument urgency. For power specifically, the identified fixes are competitive PPA procurement and beneficial ownership transparency, and both operate on contract timelines measured in years. What would count as progress, and what [the race to power Kenya's AI data centres](/articles/kenya-ai-data-centre-power-race) will price in: published beneficial ownership for new IPP bidders, competitive rounds replacing directly negotiated PPAs, and EPRA tariff reviews that visibly reflect a cheaper generation base.

## What DC254 Will Watch

1. **New PPA disclosures.** Whether future power purchase agreements publish counterparty beneficial ownership at signing, not after parliamentary inquiry.
2. **Procurement format.** The share of new capacity contracted through competitive rounds versus direct negotiation.
3. **EPRA review outcomes.** Whether the next tariff cycles pass through any generation-cost relief to industrial and business classes.
4. **Operator hedging.** How much new data centre capacity is paired with dedicated renewable PPAs or on-site generation, which bypasses part of the tariff base.
5. **The comparator gap.** The 17.5 versus 10.0 cents spread against South Africa, the number every investor deck in this market eventually has to answer.

The resource case for Kenyan data centres has never been the problem. What the World Bank added in November 2026 is an authoritative account of why the bill says otherwise, and a reform path whose proof will arrive one contract at a time.
