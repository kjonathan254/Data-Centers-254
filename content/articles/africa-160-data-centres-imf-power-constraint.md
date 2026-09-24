---
title: "Why Africa Only Hosts 5.5% of the World's Data Centres"
slug: "africa-160-data-centres-imf-power-constraint"
meta_description: "The IMF counts about 160 data centres in Africa: 5.5% of the global total. We read the report: electricity is the constraint and Kenya is the test case."
primary_keyword: "data centres in Africa"
secondary_keywords:
  - "Africa data centre count"
  - "160 data centres Africa"
  - "IMF AI Sub-Saharan Africa report"
  - "data centre power supply Africa"
  - "Kenya geothermal data centres"
author: "Kevin Jonathan Otieno"
author_bio_link: "/about"
published_date: "2026-09-24"
updated_date: "2026-09-24"
category: "AI & Infrastructure"
cluster: "Infrastructure"
og_image: "/images/africa-dc-map.webp"
reading_time: "9 min"
images:
  - src: "/images/africa-dc-map.webp"
    alt: "Map of African data centre markets"
    caption: "Africa hosts about 160 data centres, roughly 5.5% of the world's installations, and nearly half of the region's fleet sits in just three countries"
    position: "hero"
  - src: "/images/diagram-power-chain-grid-to-gpu.webp"
    alt: "Labelled diagram of the power chain from grid to GPU rack"
    caption: "A data centre inherits the grid it sits on. In Sub-Saharan Africa, that inheritance is decided upstream of the rack: generation, transmission and reliability come first"
    position: "diagram"
  - src: "/images/hv-power-transformer-bay.webp"
    alt: "High-voltage power transformer bay at a substation"
    caption: "78% of firms in Sub-Saharan Africa report routine power outages, and the average outage bill is 8.4% of annual sales, the background against which every data centre investment is priced"
    position: "inline"
  - src: "/images/kenya-geothermal-plant-olkaria.webp"
    alt: "Olkaria geothermal power plant in Kenya's Rift Valley"
    caption: "Kenya generates more than 90% of its electricity from renewables. The IMF's anchor-tenant thesis says compute demand of the right structure can make grids like this bankable"
    position: "inline"
internal_links:
  - text: "why Kenya's data centre market estimates disagree"
    href: "/articles/why-kenya-data-centre-market-estimates-disagree"
  - text: "Microsoft and G42's suspended $1 billion Kenya campus"
    href: "/articles/microsoft-g42-kenya-data-centre"
  - text: "the Olkaria geothermal corridor"
    href: "/articles/olkaria-geothermal-data-centre-corridor"
  - text: "geothermal energy for Kenyan data centres"
    href: "/articles/geothermal-energy-kenya-data-centres"
  - text: "Kenya's grid reliability record"
    href: "/articles/kenya-power-reliability-data-centres"
  - text: "Ethiopia's plan to export power to Kenya"
    href: "/articles/ethiopia-power-exports-kenya-data-centres"
  - text: "how East African data centre regulation compares"
    href: "/articles/africa-data-centre-regulation-compared"
  - text: "Kenya's data centre tax incentives"
    href: "/articles/tax-incentives-data-centre-investment-kenya"
  - text: "DC254 Policy Intelligence console"
    href: "/policy/intelligence"
  - text: "DC254 data centre directory"
    href: "/directory"
external_sources:
  - title: "IMF, Unlocking the Potential: AI in Sub-Saharan Africa (Departmental Paper 2026/013, eLibrary full text)"
    url: "https://www.elibrary.imf.org/view/journals/087/2026/013/article-A001-en.xml"
  - title: "IMF, Unlocking the Potential: AI in Sub-Saharan Africa (PDF)"
    url: "https://www.imf.org/-/media/files/publications/dp/2026/english/upaiea.pdf"
  - title: "ThinkGeoEnergy: Kenya suspends plans for Microsoft's geothermal-powered data centre (8 May 2026)"
    url: "https://www.thinkgeoenergy.com/kenya-suspends-plans-for-microsofts-geothermal-powered-data-centre/"
faq:
  - question: "How many data centres does Africa have?"
    answer: "About 160, according to the IMF's 2026 departmental paper on AI in Sub-Saharan Africa, which puts the continent at roughly 5.5% of global data centre installations. The concentration is extreme: nearly half of Sub-Saharan Africa's data centres are located in South Africa, Nigeria and Kenya. Note that installation counts and capacity shares tell different stories: industry estimates put Africa's share of global multi-tenant capacity below 1%, because African facilities are typically much smaller than those in mature markets."
  - question: "Why does Africa have so few data centres?"
    answer: "The IMF's diagnosis puts electricity reliability first. Around half the region's population lacks reliable power, 78% of firms report routine outages costing 8.4% of annual sales on average, and in the three countries hosting the most data centres (Nigeria, Kenya and South Africa), 86%, 65% and 63% of firms respectively own or share a generator. Add smaller and more fragmented markets, higher perceived risk and tight financing (African AI ventures raised about $2.2 billion in 2024), and the investment case for large-scale compute is structurally harder than demand alone suggests."
  - question: "What does the IMF say AI could add to Sub-Saharan Africa's economy?"
    answer: "Under current conditions, the IMF estimates AI lifts the region's productivity by just 0.2% cumulatively over the next decade, about 0.4% of GDP once AI-related capital accumulation is included. Under a high-adoption scenario in which power, connectivity, skills and sector coverage improve, productivity gains rise to about 2.1% and the GDP effect to 4.0% over the decade, equivalent to nearly half a percentage point of annual growth. The IMF is explicit that the high-adoption case is policy-contingent, not an automatic upside."
  - question: "Can data centres help fix Africa's power grids instead of straining them?"
    answer: "The IMF argues they can, under the right structure. Data centres offer massive, predictable, long-term energy demand that can function as an industrial anchor tenant, making large-scale generation and grid expansion bankable for private investors, with spillover access for surrounding communities. Whether anchor demand adds grid capacity or simply diverts existing supply depends on how power purchase agreements and grid extension mandates are structured. Kenya is the test case: over 90% renewable generation, geothermal endowment, and the suspended Microsoft/G42 campus as proof that structure, not resource, is the binding constraint."
canonical_url: "https://data-centers-254.vercel.app/articles/africa-160-data-centres-imf-power-constraint"
---

The International Monetary Fund has published one of the most quotable infrastructure statistics of the year, and it is travelling fast through African policy circles: Africa hosts only about 160 data centres, or about 5.5 percent of global installations. The line comes from "Unlocking the Potential: AI in Sub-Saharan Africa", a 2026 IMF departmental paper (Departmental Paper 2026/013) that we have read in full, and it lands with particular force in East Africa, where nearly every serious data centre conversation now starts with power prices and ends with power reliability.

But the number doing the rounds on social media and in op-eds is doing less work than the report behind it. The paper's real contribution is not the count: it is the diagnosis of *why* the count is what it is, and a carefully argued thesis that the constraint is not demand, not capital in the abstract, and not African appetite for cloud services. It is electricity: its reliability, its price structure, and whether the region's grids can treat a data centre as a customer worth building for. That reframing matters for investors, operators and policymakers across Kenya, Uganda, Rwanda and Tanzania, because it moves the conversation from "when will Africa get its hyperscale moment" to "what has to be true about the grid first".

## Where the IMF's 160 comes from

The full sentence, from the paper's section on AI infrastructure, reads: "compute capacity remains modest relative to global demand for AI infrastructure, with Africa hosting only about 160 data centers or about 5.5 percent of global installations (Kakindé 2025)". The figure is drawn from market research the IMF cites rather than an IMF census, and the paper immediately adds the geography that matters: "nearly half of Sub-Saharan Africa's data centers located in South Africa, Nigeria, and Kenya", citing two additional research sources for that concentration.

Two cautions belong next to any use of the number. First, installations are not capacity: African facilities are on the whole smaller than those in mature markets, which is why industry bodies have long put Africa's share of global multi-tenant capacity below 1% even while installation counts suggest 5.5%. Both statements are true, and the gap between them is itself a finding: the region's fleet is broad but shallow. Second, any count of "data centres" is sensitive to definition: does a single-room enterprise server facility count alongside a 30MW campus? This is the same measurement swamp we documented in [why Kenya's data centre market estimates disagree](/articles/why-kenya-data-centre-market-estimates-disagree): six research firms produced market values from $266 million to $606 million for the same country, largely on definitional differences. The IMF's 160 deserves respect as an order of magnitude, not a census.

## The constraint is electricity, not demand

![Labelled diagram of the power chain from grid to GPU rack](/images/diagram-power-chain-grid-to-gpu.webp)

The demand side, the IMF concedes, is not the problem. Global technology firms are expanding cloud and AI infrastructure across the continent, and the paper catalogues the commitments: Microsoft and G42's announced $1 billion green data centre campus in Kenya, Cassava Technologies and NVIDIA's $700 million deal to deploy 12,000 GPUs across South Africa, Nigeria, Kenya, Egypt and Morocco, a $100 million IFC commitment to Raxio's expansion, plus over $300 million from Huawei and a $2 billion Tencent cloud investment. Capital is circling. Venture funding for African AI ventures still declined to about $2.2 billion in 2024, with 84% of flows going to just four markets (Egypt, Kenya, Nigeria and South Africa), which tells you how thin the margin of investability is.

![High-voltage power transformer bay at a substation](/images/hv-power-transformer-bay.webp)

The supply side is where the paper is unsparing. Around half the region's population does not have reliable power; of the roughly 670 million people worldwide without electricity access, 85% live in Sub-Saharan Africa. Seventy-eight percent of firms in the region report routine outages, with average losses of 8.4% of annual sales against a 5.2% global average. Generator ownership (the market's own verdict on grid reliability) is widespread precisely where the data centres are: 86% of Nigerian firms own or share a generator, and 65% and 63% do so in Kenya and South Africa respectively. The arithmetic gets sharper as compute scales. Data centres already drew about 1.5% of global electricity in 2024, headed towards roughly 3% by 2030 on the IEA's base case, and even a modest scenario in which Sub-Saharan Africa holds just 0.5% of global AI data centre capacity by 2035 implies additional demand equal to about 10% of the region's entire 2023 installed generation capacity.

The growth stakes of fixing this are the report's headline. Under current conditions, the IMF estimates AI adds just 0.2% to the region's productivity cumulatively over the next decade, about 0.4% of GDP once AI-related capital accumulation is counted. Under a high-adoption scenario, with power, connectivity, skills and agricultural-sector coverage improved, productivity gains rise to roughly 2.1% and the GDP effect to 4.0% over the decade. The paper is explicit that this upside "should not be read as an automatic upside case": it is policy-contingent, start to finish.

## Anchor tenants: the IMF's most useful idea for Kenya

![Olkaria geothermal power plant in Kenya's Rift Valley](/images/kenya-geothermal-plant-olkaria.webp)

The paper's most constructive passage is easy to miss. Data centres, it argues, need not be a burden on weak grids: their "massive, predictable, and long-term energy requirements" can function as an industrial anchor tenant whose demand makes large-scale generation and grid expansion bankable for private investors, potentially extending electricity access to surrounding communities as a spillover. The catch is structure: whether anchor demand "catalyzes net additions to grid capacity or simply diverts existing supply" depends on how power purchase agreements and grid extension mandates are structured.

Kenya is the natural laboratory, and the paper treats it as such. With over 90% of electricity generation from renewable sources, Kenya is positioning its geothermal endowment as a competitive advantage for green compute, the logic behind [the Olkaria geothermal corridor](/articles/olkaria-geothermal-data-centre-corridor) and the broader case for [geothermal energy in Kenyan data centres](/articles/geothermal-energy-kenya-data-centres). The IMF notes the announced Microsoft/G42 Naivasha campus was designed to draw power directly from geothermal generation.

Here our own tracking sharpens the IMF's point. The IMF's evidence base cites that campus as a live $1 billion, 100MW commitment. As we documented, Kenya formally suspended the plan in May 2026 after concerns that the project would need about a third of the country's roughly 3,000MW installed capacity, and after Treasury never approved the funding concept note. [The full story of the Microsoft and G42 stall](/articles/microsoft-g42-kenya-data-centre) is a study in structure failing before physics does. The suspension is not a rebuttal of the anchor-tenant thesis; it is the thesis, stated negatively. The resource was never the binding constraint. The power purchase structure, the financing guarantees and the public-approval pathway were. The same lesson travels north: [Ethiopia's plan to export 400MW to Kenya](/articles/ethiopia-power-exports-kenya-data-centres) only pays off for compute if the trading and contracting structures move with the megawatts. Regionally, the G7-endorsed Africa Green Compute Coalition, linking UNDP, private sector and African governments, is the first institutional attempt to operationalise the anchor-tenant link between renewable developers and digital infrastructure investors.

## What it means for East Africa

The IMF is blunt about distribution. Even under the high-adoption scenario, near-term gains accrue first to "early-mover economies and urban hubs with stronger electricity, connectivity, and compute capacity", specifically the areas where data centres and cloud infrastructure are already concentrated: South Africa, Nigeria and Kenya. Economies with weaker infrastructure risk becoming "increasingly dependent on externally hosted services", importing AI capability rather than hosting it. For Uganda, Rwanda and Tanzania, that is the strategic warning: the gap between hosting compute and renting it compounds.

The region's counter-move is not a single headline project but the unglamorous accumulation of the things the IMF lists as complements: grid reliability, high-capacity connectivity, and rules that make long-term power contracts enforceable. Kenya's grid reliability record and its tax incentive framework for data centre investment are exactly the kind of policy levers the paper's scenarios turn on, and they are precisely the instruments we audit claim by claim in our [East Africa regulation comparison](/articles/africa-data-centre-regulation-compared) and in the [DC254 Policy Intelligence console](/policy/intelligence), where 50 of 56 policy claims across Kenya, Uganda, Rwanda and Tanzania are now verified against captured primary sources. The physical build-out is tracked the same way: our [data centre directory](/directory) follows 31 facilities and 18 operators across the four markets, so the region's response to the IMF's diagnosis can be measured, not guessed.

## The number to watch

The IMF's framing deserves the last word, because it converts a discouraging statistic into a working agenda: "The lower estimate is not a verdict on AI's potential but a diagnostic of today's constraints." There is even historical precedent for what happens when the constraints fall: the submarine cable waves that connected Africa's coasts boosted employment between 4% and 10% in connected areas, a reminder that infrastructure and outcomes move together when the underlying economics are fixed.

So watch the boring numbers, not the headline ones. Watch the megawatts that reach financial close with a data centre anchor attached, the power purchase agreements that fund new generation rather than re-cutting old supply, and the grid extension mandates that decide whether communities around a campus get power or just the campus does. The day an East African data centre is the reason a new geothermal unit was built, not the reason an existing one was fully booked, the 160 starts moving, and this region will be able to say it fixed the constraint rather than rented around it.
