---
title: "Kenya Has the Steam. So Where Are the AI Data Centres?"
slug: "olkaria-geothermal-ai-data-centre-race"
meta_description: "Microsoft chose Olkaria's geothermal steam for a 100 MW AI campus in 2024. Two years on, the deal is stalled. The contract, the wires and the grid headroom explain why."
primary_keyword: "Olkaria geothermal data centre"
secondary_keywords:
  - "Kenya AI data centre"
  - "Microsoft G42 Olkaria"
  - "geothermal power for data centres"
  - "Kenya data centre pipeline"
  - "enhanced geothermal Fervo Google"
author: "Kevin Jonathan Otieno"
author_bio_link: "/about"
published_date: "2026-10-16"
updated_date: "2026-10-16"
category: "Energy"
cluster: "Energy"
og_image: "/images/kenya-geothermal-plant-olkaria.webp"
reading_time: "7 min"
images:
  - src: "/images/kenya-geothermal-plant-olkaria.webp"
    alt: "Steam rising from wells at the Olkaria geothermal field in Kenya's Rift Valley"
    caption: "Olkaria's steam field has powered Kenya for four decades. The AI campus it was meant to host is still an announcement."
    position: hero
  - src: "/images/kenya-transmission-towers-riftvalley.webp"
    alt: "High voltage transmission towers crossing the Rift Valley toward Nairobi"
    caption: "Steam becomes compute only after the wires carry it. Transmission, not geology, is where Kenya's AI campus deal stalled."
    position: "section-break"
  - src: "/images/diagram-power-chain-grid-to-gpu.webp"
    alt: "Diagram tracing the power chain from grid generation to GPU racks"
    caption: "Every data centre sits at the end of a chain: generation, transmission, a contract, and a connection. AI scale loads stress every link at once."
    position: "diagram"
internal_links:
  - text: "Microsoft and G42's Kenya project"
    href: "/articles/microsoft-g42-kenya-data-centre"
  - text: "how Kenya's grid actually runs"
    href: "/articles/kenya-power-infrastructure-data-centres"
  - text: "AI data centres across East Africa"
    href: "/articles/ai-data-centres-east-africa"
  - text: "where submarine cables land in Kenya"
    href: "/articles/submarine-cables-landing-mombasa"
external_sources:
  - title: "Microsoft and G42 announce $1 billion digital ecosystem initiative for Kenya (22 May 2024)"
    url: "https://news.microsoft.com/source/2024/05/22/microsoft-and-g42-announce-1-billion-comprehensive-digital-ecosystem-initiative-for-kenya/"
  - title: "Semafor: Energy shortfall problem scuppers Kenya's $1B Microsoft data center (6 May 2026)"
    url: "https://www.semafor.com/article/05/06/2026/energy-shortfall-problem-scuppers-kenyas-1b-microsoft-data-center"
  - title: "Fervo Energy declares commercial operation at Cape Station (1 October 2026)"
    url: "https://fervoenergy.com/fervo-energy-declares-commercial-operation-at-cape-station-ahead-of-schedule-leading-the-race-for-next-generation-geothermal-energy/"
  - title: "EPRA Energy & Petroleum Statistics Report, June 2025"
    url: "https://www.epra.go.ke/sites/default/files/2025-09/Statistics-Report-June-2025-Web.pdf"
  - title: "Data Center Dynamics: Microsoft and G42 to build geothermal-powered data center in Kenya"
    url: "https://www.datacenterdynamics.com/en/news/microsoft-and-g42-to-build-geothermal-powered-data-center-in-kenya/"
faq:
  - question: "Does Kenya have enough geothermal power for AI data centres?"
    answer: "On the resource side, yes. Kenya's installed geothermal fleet stood at 943.7 MW at the end of 2023 and geothermal supplied 39.51 percent of the country's electricity in the year to June 2025, the largest single source in the mix. The Ministry of Energy's long-standing estimate puts Rift Valley potential at about 10,000 MW. The binding constraints sit elsewhere: transmission capacity, grid headroom, and a bankable contract structure for hyperscale loads."
  - question: "Why did the Microsoft and G42 Olkaria data centre stall?"
    answer: "Two reasons dominate the reporting. First, the contract: by May 2026, Reuters reporting carried by Bloomberg described negotiations stalling over requests for guaranteed annual capacity payments. Second, the scale: Semafor reported in May 2026 that the national grid could not absorb a single 100 MW AI load without risking supply elsewhere, a point President Ruto made publicly. DC254's directory still carries the campus as Early Stage."
  - question: "How much data centre capacity is actually live in Kenya today?"
    answer: "Twenty operational facilities carry a published in-service IT load of 10.5 MW, with designed capacity at those live sites of 42.9 MW. Another 230 MW sits in the announced pipeline, of which 77 MW is under construction across three projects. One 100 MW AI campus would have been close to ten times the entire verified live load."
  - question: "What is enhanced geothermal, and how does it differ from Olkaria's?"
    answer: "Enhanced geothermal systems such as Fervo's drill horizontal wells into hot rock and engineer their own reservoir, where Olkaria uses a natural hydrothermal field that has produced steam for decades. The geology differs; the commercial lesson transfers anyway. Fervo's growth came from long-term fixed-price contracts with creditworthy buyers in standard block sizes, which is exactly what Kenya's stalled campus lacked."
---

On 22 May 2024, Microsoft and Dubai-based G42 announced a $1 billion digital ecosystem package for Kenya. Its centrepiece was a data centre campus at Olkaria, in the Rift Valley, designed to run entirely on geothermal power, starting with a 100 MW first phase. The site choice was the whole pitch: Olkaria sits on one of the world's most productive geothermal fields, and geothermal generates through the night, which is precisely what an AI compute floor needs.

Two years later, the campus is still an announcement. Semafor reported in May 2026 that the project was unlikely to go ahead as designed, and quoted President William Ruto saying that to switch on a data centre of that size, Kenya would need to shut off power for half the country. In October 2026, Kenyan outlets reported that Microsoft plans to close parts of its Africa Development Centre in Nairobi, with roughly 400 jobs affected. The steam, meanwhile, keeps flowing.

The gap between those two facts is the most instructive case study in African digital infrastructure right now. It shows where Kenya's AI data-centre race actually stands, and the lesson has less to do with geology than most commentary assumes.

## What the verified tracker actually shows

DC254's directory tracks 31 facilities and projects across Kenya and the region. The verified numbers are small. Twenty Kenya facilities are operational, with a published in-service IT load of 10.5 MW. Designed capacity at those live sites totals 42.9 MW. A further 230 MW sits in the announced pipeline, of which 77 MW is genuinely under construction at three projects: iXAfrica's NBOX1.2 (18 MW), Africa Data Centres' Nairobi 2 (15 MW), and Nxtra by Airtel at Tatu City (44 MW).

Now hold one figure against another. The Microsoft-G42 first phase alone was 100 MW, close to ten times the country's entire verified live load. Kenya's installed generation capacity is roughly 3,000 MW. A single AI campus at full build would have been one of the largest individual loads on the grid, announced into a market whose whole operating fleet is a rounding error next to it.

That scale gap frames everything else in this story. Kenya's data centre market is real, growing, and verified down to the megawatt. It is a fleet of tens of megawatts, and the AI race is being contested in hundreds.

## The steam was ready on day one

Kenya's geothermal credentials are among the strongest outside Iceland and the United States. The installed fleet stood at 943.7 MW at the end of 2023, according to the regulator EPRA, and geothermal supplied 39.51 percent of the country's electricity in the year to June 2025, the largest single source in the mix. Olkaria V alone contributes 172 MW. KenGen, the state generator, is completing Olkaria VII, an addition in the 80 MW class, and the Ministry of Energy's long-standing estimate puts the Rift Valley's total potential at about 10,000 MW.

None of that was ever in doubt. The resource could credibly support the campus. What Kenya could not put on the table in 2024 was a completed path from steam to a powered, contracted data hall, and that path runs through parts of the system the headlines rarely mention.

## Where the deal actually stalled

The reporting chain is consistent. By May 2026, Reuters reporting carried by Bloomberg described negotiations stalling over requests for guaranteed annual capacity payments: the developer side wanted the government to commit to paying for a fixed amount of capacity every year, whether or not the computing load ever materialised. [The directory record for the project](/directory/microsoft-g42-ai-dc) carries that attribution, with a caveat that the outlets share an upstream source. Semafor's reporting added the system problem: the grid could not take a single 100 MW AI load without putting supply elsewhere at risk.

Read the two together and the shape of the problem is specific. Kenya can permit generation and drill steam. What it lacked was a bankable contract structure for a hyperscale customer, and grid headroom in the right place. A campus at Olkaria would also depend on transmission into Nairobi's metro network, where [the country's connectivity concentrates](/articles/kenya-power-infrastructure-data-centres): the KIXP peering point alone carries 144 member networks and 2,985 Gbps of connected port capacity, and the submarine systems that land in Mombasa ride terrestrial fibre to reach it.

Power is one input in that stack. The Olkaria deal had to clear every input at once, and it had to do so as a single bespoke negotiation with a state utility in the middle.

## What Utah did differently

The useful comparison sits outside Africa, at Fervo Energy in the United States, a company that was running a 3.5 MW pilot in Nevada in 2023. Fervo drills horizontal wells into hot rock, an approach called enhanced geothermal, and its first commercial project fed Google's data centres directly. Nevada regulators approved a 115 MW Clean Transition Tariff for the technology in 2025. In June 2024, Fervo signed 15-year power purchase agreements totalling 320 MW with utility Southern California Edison for its Cape Station project in Utah. In 2026, Google signed a 396 MW PPA with Fervo, the largest corporate geothermal deal on record. On 1 October 2026, the first 33 MW block at Cape Station reached commercial operation.

Look at what made that progression financeable, because it is all commercial. Google contracted directly with the generator, at a fixed price, over a long term, in block sizes a single PPA could carry. Standard blocks meant each financing closed on its own merits, and the drilling could be scheduled like a factory. Three years after a 3.5 MW pilot, the approach is delivering a 33 MW block and holding contracts for hundreds more.

Kenya's steam is at least Fervo's equal; the Rift is a proven hydrothermal field, not an engineered one. What the Rift did not have was a counterparty structure anyone could underwrite.

## What would turn announcements into live load

Kenya's pipeline records share one honest gap: the tracker can show a megawatt figure and a status, and almost no project publishes where it stands on power procurement. Announced, contracted, under construction and commissioned are different stages with different risk, and the announced figure of 230 MW says nothing about how much of it has a signed path to power. That distinction is exactly what the [tracker](/tracker) now stages explicitly, project by project.

Two moves would shift the market up that ladder. The first is modular procurement: 33 MW blocks that one contract can carry, rather than a 100 MW campus that needs the Treasury in the room. The 77 MW under construction at three Nairobi projects shows Kenyan operators already build this way when the financing is standard. The second is a contract design Kenya is willing to defend. The capacity-payment dispute taught both sides where the other's limits sit, and the next attempt has to answer it, whether through direct corporate PPAs, behind-the-meter generation at the plant, or a reformed structure through the single buyer. The steam can carry any of those models. It has been carrying Kenya's grid for four decades.

## What to watch

Three markers will tell you whether Kenya converts steam into compute. Watch [the Olkaria campus record](/articles/microsoft-g42-kenya-data-centre): if it moves from Early Stage to a signed structure, the contract question has an answer. Watch Olkaria VII's commissioning and the transmission work that accompanies it, because grid headroom is bought down wire by wire, not by press release. And watch the 77 MW under construction: if those three projects commission on schedule, Kenya's next negotiation starts from roughly a doubled live base, and the arithmetic that scared everyone in May 2026 looks different.

The Fervo clock is running in parallel. Cape Station's remaining Phase I blocks are due within months, and Google's 396 MW contract holds options beyond it. Kenya's next hyperscale negotiation will be judged by the same standard that Fervo just met: a price, a term, and a block size a bank can underwrite.
