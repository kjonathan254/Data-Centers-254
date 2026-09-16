---
title: "Colocation Pricing in Kenya: What a Rack Costs"
slug: "colocation-pricing-kenya-explained"
meta_description: "How Kenyan colocation is priced: per rack, per kilowatt, retail versus wholesale, what drives the bill, and honest benchmark ranges to judge quotes against."
primary_keyword: "colocation pricing Kenya"
secondary_keywords:
  - "data centre cost Kenya"
  - "server colocation Nairobi price"
  - "rack rental Kenya"
  - "colocation rates per kW"
  - "hosting costs Nairobi"
  - "data centre opex Kenya"
author: "Kevin Jonathan Otieno"
author_bio_link: "/about"
published_date: "2026-09-16"
updated_date: "2026-09-16"
category: "Business Guide"
cluster: "Kenya"
og_image: "/images/diagram-server-rack-42u.webp"
reading_time: "10 min"
images:
  - src: "/images/diagram-server-rack-42u.webp"
    alt: "Labelled diagram of a 42U server rack with components"
    caption: "The 42U rack is colocation's unit of account. What you are really buying, though, is the guaranteed kilowatts behind it, and in Kenya that is where most of the money goes"
    position: "hero"
  - src: "/images/dc-servers-racks.webp"
    alt: "Server racks with status lights in a data hall"
    caption: "Two facilities with identical-looking racks can differ by half on your monthly bill. The difference hides in power inclusion, redundancy tier and cross-connect fees"
    position: "section-break"
internal_links:
  - text: "the full Nairobi colocation buyer's guide"
    href: "/articles/colocation-data-centres-nairobi-buyers-guide"
  - text: "what colocation is, in plain terms"
    href: "/articles/what-is-colocation-kenya"
  - text: "Kenya Power tariffs and how they hit data centre costs"
    href: "/articles/kenya-power-tariffs-data-centres"
  - text: "SLAs and what uptime guarantees really promise"
    href: "/articles/data-centre-sla-uptime-guarantees"
  - text: "VPS hosting paid by M-Pesa as the small end of the market"
    href: "/articles/vps-hosting-kenya-mpesa-payment"
external_sources:
  - title: "ServerMania, 2026 colocation costs and pricing overview (6 Jan 2026; full rack 3 to 5 kW at roughly USD 300 to 1,000 per month base)"
    url: "https://www.servermania.com/kb/articles/colocation-costs.htm"
  - title: "QuoteColo, Average cost per rack in a data center 2026 (27 Mar 2026; full racks USD 900 to 2,500 per month all-in by market)"
    url: "https://www.quotecolo.com/average-cost-per-rack-in-a-data-center/"
  - title: "DataCenterHawk, Colocation data center pricing: a 2026 beginner's guide (12 Feb 2026; per kW/month pricing model explained)"
    url: "https://www.datacenterhawk.com/blog/colocation-data-center-pricing-a-2026-beginners-guide"
  - title: "Databank, Understanding data center pricing models (8 Jun 2024; per rack unit, per kW, wholesale)"
    url: "https://www.databank.com/blog/understanding-data-center-pricing-models/"
faq:
  - question: "How much does one server rack cost per month in Nairobi colocation?"
    answer: "As an orientation range rather than a quote: internationally, a standard 3 to 5 kilowatt rack runs roughly USD 300 to 1,000 per month at the base before power, and about USD 900 to 2,500 all-in per month depending on market and redundancy tier. Nairobi pricing sits in the upper part of emerging-market ranges: Kenya's reliable Tier III power, cooling and security are real costs, and dollar-linked contracts reflect that. Treat any specific figure as a starting point for a conversation with the facility, not a price tag."
  - question: "Why is colocation priced per kilowatt rather than per rack?"
    answer: "Because power is the real product. A rack that draws 3 kilowatts and one that draws 15 kilowatts occupy identical floor space but consume wildly different cooling and redundancy. Pricing per committed kilowatt, typically a rate per kilowatt per month plus metered or included electricity, lets facilities charge for what each customer consumes. Per-rack and per-U pricing survive at the small end because they are easier to buy."
  - question: "What is actually included in a colocation bill?"
    answer: "Typically: rack space or committed power, cooling, the redundant electrical chain from utility through UPS to the rack, physical security and access, fire suppression, remote hands in defined quantities, and a cross-connect allowance. What varies hugely between contracts: how much electricity is included versus metered, cross-connect charges beyond the allowance, and escalations, the annual increase clause. The cheap headline rate with metered power and paid cross-connects is rarely the cheap contract."
  - question: "Is colocation in Kenya priced in dollars or shillings?"
    answer: "Frequently both in effect. Facilities buy equipment, and often power contracts, with dollar exposure, so enterprise colocation contracts are commonly dollar-linked even when invoiced in shillings. Smaller packages and retail customers are more often quoted in shillings. For a buyer, the currency question is really a budget-stability question: ask what your monthly bill does if the shilling moves ten percent."
  - question: "When does colocation beat cloud, and when does it not?"
    answer: "Colocation wins when workloads are steady, hardware is long-lived and control matters: a bank's core systems, a telco's network functions, AI inference on owned GPUs. Cloud wins when demand is spiky, global or experimental, where you would otherwise buy hardware that idles. Many Kenyan enterprises run both, colocation for the stable core, cloud for the edges, and the pricing logic in this article is exactly what decides where the line sits."
canonical_url: "https://data-centers-254.vercel.app/articles/colocation-pricing-kenya-explained"
---

Colocation pricing has a gift for hiding in plain sight. The headline rate is real, but it answers a question nobody actually asked. What a Kenyan business really wants to know is: what will this cost me per month, all-in, for the amount of computing I need, with the reliability I am being promised? Getting from the headline to the answer requires understanding four pricing models, three hidden cost centres, and the Kenyan specifics, power tariffs, dollar linkage, redundancy economics, that shape every quote you will receive in Nairobi or Mombasa.

This article is the pricing companion to our [Nairobi buyer's guide](/articles/colocation-data-centres-nairobi-buyers-guide). It explains how the industry charges, gives honest orientation ranges from published benchmarks, and shows where Kenyan costs depart from global ones.

![Labelled diagram of a 42U server rack with components](/images/diagram-server-rack-42u.webp)

## The four ways colocation is sold

**Per rack unit (per U).** The smallest unit of sale: you rent a slice of a rack, a 1U firewall, a 2U storage node, and the facility handles everything else. Per-U pricing is the retail end of the market and the natural first step for a Kenyan SME moving from an office server cupboard. It is simple, but it is also the most expensive per unit of capacity, because you are buying convenience in slices.

**Per rack.** A full rack, the classic 42U cabinet, is the standard mental unit, and published benchmarks keep it honest: internationally a standard 3 to 5 kilowatt rack runs roughly USD 300 to 1,000 per month at the base (ServerMania, 6 January 2026), and about USD 900 to 2,500 all-in per month depending on market, redundancy and what the price includes (QuoteColo, 27 March 2026). Nairobi quotes sit inside those global bands, tending toward the upper half because Tier III power infrastructure in Kenya is genuinely costly to build and run.

**Per kilowatt.** The enterprise language. You commit to a power draw, say 100 kilowatts across a cage, and pay a rate per kilowatt per month, with electricity either included or metered on top (DataCenterHawk, 12 February 2026). This is the model that reflects reality, because power is what the facility must provision in redundancy, cooling and UPS capacity. A buyer who understands the per-kilowatt quote can compare any two facilities on earth with one calculation.

**Wholesale.** Above a few hundred kilowatts, the conversation stops being about racks at all. Wholesale deals, powered shells or build-to-suit campuses, price megawatts and multi-year commitments. This is where Kenya's hyperscale conversations live, and where the grid's capacity limits, the same ones that stalled the Microsoft and G42 campus, shape what is even available.

## The three hidden cost centres

Whatever the model, three line items decide whether a contract is actually cheap.

**Electricity.** The biggest operational cost in any facility, typically 30 to 40 percent of opex. In Kenya, industrial consumers pay all-in effective rates in the range of KES 15 to 20 per kilowatt-hour once demand charges and levies are counted (see our [tariffs article](/articles/kenya-power-tariffs-data-centres) for the breakdown). When a quote includes power, you are buying that cost bundled and smoothed; when power is metered to you, the facility's efficiency, its PUE, becomes your bill. A facility at PUE 1.4 moves noticeably less of your electricity into cooling than one at 1.8, and over a year on a loaded rack, that difference is real money.

**Cross-connects.** The monthly fee for each cable between you and a carrier, a partner or another tenant. A single connection is trivial; a bank with eight network providers, a DR link and two cloud on-ramps is paying a meaningful recurring line item. Facilities in carrier-rich buildings price cross-connects with confidence because their ecosystem is the product; ask for the full schedule before you model your bill.

**Escalations and currency.** Kenyan enterprise contracts commonly carry annual escalation clauses and dollar linkage, because the facility's own costs, imported equipment, and often power contracts, move with the shilling. The question to ask is not "what does it cost today" but "what does the contract do at a ten percent currency move in year three".

![Server racks with status lights in a data hall](/images/dc-servers-racks.webp)

## What drives Nairobi prices above other markets

Kenya is not an expensive market by global standards, but it is priced above the cheapest emerging markets, and the reasons are legible. Building Tier III infrastructure, dual power paths, concurrent-maintainable cooling, N+1 or better on everything, costs the same imported capital whether the site is in Nairobi or Ohio, and Kenya's financing costs make the capital dearer. Reliable utility power at KES 15 to 20 per kilowatt-hour all-in is mid-range globally, not cheap, which is why geothermal economics matter so much to the country's data centre ambitions. And the market is still young: smaller absolute demand means facilities spread fixed costs over fewer racks than a Frankfurt operator does.

Against that, Kenya offers something the cheapest markets do not: actual interconnection. The carrier ecosystem, the exchange point and the cable landings mean a Nairobi facility is not just racks, it is the shortest path to East African users. Pricing a Nairobi rack against a Johannesburg or Lagos rack purely on rate-per-kilowatt misses that the Nairobi rack may carry a third of the network latency bill to reach regional customers.

## How to compare two quotes in fifteen minutes

Bring every quote down to the same three numbers and the marketing falls away.

**All-in monthly cost at your real load.** Not at the sales sheet's load, at what you will actually draw, including the metered power at the quoted rate. Ask the facility to model it; a good one will.

**Cost per included certainty.** What uptime does the SLA promise and what redundancy backs it? A 99.982 percent Tier III commitment with concurrent maintainability is a different product from a 99.9 percent best-effort room, and the price gap is the cheapest insurance a downtime-prone business can buy. Our [SLA article](/articles/data-centre-sla-uptime-guarantees) explains what the nines are worth.

**Total cost of change.** Cross-connects beyond allowance, remote hands rates, move-in fees, escalation percentages. Contracts are won and lost in this section, because it is where year two surprises live.

## The Kenyan ladder, from M-Pesa to megawatts

It helps to see colocation as one rung on a ladder the Kenyan market prices honestly. At the bottom, VPS and cloud slices rented monthly, sometimes paid by M-Pesa, are the retail cloud end. Above that, per-U and per-rack retail colocation. Above that, per-kilowatt enterprise cages. At the top, wholesale megawatts. A growing Kenyan business typically climbs that ladder: out of the office cupboard into per-U, into racks when hardware multiplies, into a cage when compliance and scale demand it. Each rung buys more control and more responsibility, and each is priced by the same underlying physics, kilowatts delivered without interruption.

The honest summary: colocation in Kenya is not cheap, because reliability is not cheap anywhere and Kenya's inputs are mid-priced. What it can be, if you read the contract like this article does, is predictable, and predictability is what a rack is actually for.
