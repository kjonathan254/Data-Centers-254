---
title: "AI Data Centres in East Africa: Why Kenya Is Positioned to Lead"
slug: "ai-data-centres-east-africa"
meta_description: "AI requires massive compute infrastructure close to users. East Africa's submarine cables, geothermal energy, and growing digital economy make Kenya the natural hub for AI data centres on the continent."
primary_keyword: "AI data centres East Africa"
secondary_keywords:
  - "AI infrastructure Kenya"
  - "GPU data centre Africa"
  - "hyperscale data centre Kenya"
  - "AI compute Africa"
  - "Microsoft G42 Kenya data centre"
author: "Kevin Jonathan Onyango Otieno"
author_bio_link: "/about"
published_date: "2026-08-27"
updated_date: "2026-08-27"
category: "AI & Cloud"
cluster: "AI"
og_image: "/images/ai-gpu-servers.png"
reading_time: "11 min"
images:
  - src: "/images/ai-gpu-servers.png"
    alt: "GPU servers for AI training in a data centre"
    caption: "AI training requires dense GPU clusters that consume 5-10x more power than standard servers"
    position: "hero"
  - src: "/images/dc-switchgear-2.webp"
    alt: "Data centre power systems"
    caption: "AI data centres need significantly more power than traditional facilities, making Kenya's geothermal advantage critical"
    position: "section-break"
  - src: "/images/dc-gpu-cluster-2.webp"
    alt: "Data centre facility in Nairobi"
    caption: "Nairobi is emerging as East Africa's AI infrastructure hub, attracting investment from global tech companies"
    position: "infographic"
  - src: "/images/dc-chillers-roof.webp"
    alt: "Data centre cooling systems"
    caption: "GPU clusters generate extreme heat, requiring advanced liquid cooling systems that add to power demand"
    position: "inline"
  - src: "/images/dc-gpu-cluster-2-wide.webp"
    alt: "Nairobi skyline at dusk"
    caption: "Kenya's growing digital ecosystem provides the talent and market demand that makes AI infrastructure investment viable"
    position: "inline"
internal_links:
  - text: "Kenya power and data centres"
    href: "/articles/kenya-power-infrastructure-data-centres"
  - text: "submarine cables landing in Mombasa"
    href: "/articles/submarine-cables-landing-mombasa"
  - text: "Kenya data centre licensing"
    href: "/articles/kenya-data-centre-licensing-framework"
external_sources:
  - title: "Microsoft and G42 Kenya AI Partnership"
    url: "https://www.microsoft.com/en-us/ai"
  - title: "Google AI in Africa Initiative"
    url: "https://www.google.com/africa/"
faq:
  - question: "Why do AI data centres need to be close to users?"
    answer: "AI applications like real-time language processing, computer vision, and recommendation systems require low latency. Every millisecond of round-trip delay degrades the user experience. A data centre in Nairobi serves East African users with 20-30ms latency versus 150-200ms from Europe."
  - question: "How much power does an AI data centre need?"
    answer: "AI training clusters are extremely power-intensive. A single GPU server can draw 10-15 kilowatts, compared to 0.5-1 kilowatt for a standard server. A facility with 1,000 GPUs needs 10-15 megawatts just for the compute, plus cooling and overhead. The largest planned AI facilities globally exceed 1 gigawatt."
  - question: "What happened to the Microsoft-G42 data centre in Kenya?"
    answer: "The USD 1 billion Microsoft-G42 AI data centre project stalled in May 2026 because Kenya's national grid could not reliably deliver the several hundred megawatts the facility required. The project has not been formally cancelled but has no clear timeline."
  - question: "Does Kenya have the talent for AI data centre operations?"
    answer: "Kenya produces thousands of STEM graduates annually and has a growing tech ecosystem. However, AI-specific infrastructure skills (GPU cluster management, high-performance networking, ML operations) are still developing. International operators typically bring in initial expertise while building local capacity."
  - question: "What makes Kenya attractive compared to South Africa or Nigeria?"
    answer: "Kenya has three structural advantages: geothermal energy (clean, baseload, cheaper than coal or gas), submarine cable connectivity (8+ cables in Mombasa), and its position as a gateway for landlocked East African nations with 300M+ people. South Africa has more established data centre infrastructure but relies on coal for power."
canonical_url: "https://data-centers-254.vercel.app/articles/ai-data-centres-east-africa"
---

![GPU servers for AI training in a data centre](/images/ai-gpu-servers.png)

## Why AI Needs a New Class of Data Centre in Africa

Generative AI has fundamentally changed what data centres must deliver. The shift from serving web pages and databases to running large language models, computer vision pipelines, and inference workloads has created demand for a completely different tier of infrastructure. Standard enterprise data centres built for colocation and cloud hosting cannot meet the power density, cooling requirements, or network fabric that AI workloads demand.

A typical GPU server housing eight NVIDIA H100 or equivalent accelerators draws between 10 and 15 kilowatts under load. Rack densities in AI facilities routinely exceed 40-80 kW per rack, compared to 5-10 kW in a conventional data centre. This is not an incremental upgrade. It is a generational shift in facility design, power delivery, and thermal management.

For African markets, this creates both a challenge and an opportunity. The challenge is that very few facilities on the continent can currently support these densities. The opportunity is that demand for AI inference at the edge, close to the 1.4 billion users on the continent, will require purpose-built GPU infrastructure. Relying on European or American data centres for every AI inference call introduces 150-250 milliseconds of round-trip latency, which is unacceptable for real-time applications in healthcare diagnostics, financial services, agricultural analytics, and language translation.

East Africa, and Kenya specifically, is structurally positioned to become the primary hub for this infrastructure on the continent. The reasons are not speculative. They are grounded in energy geology, submarine cable topology, and regional market economics.

## What Makes an AI Data Centre Different

Before assessing East Africa's readiness, it is important to understand the specific technical requirements that distinguish an AI data centre from a traditional facility.

**Power density.** AI training and inference clusters require 5-10x the power per square metre compared to standard enterprise colocation. A 1,000-GPU facility needs 10-15 MW for compute alone, with another 30-40% needed for cooling and supporting infrastructure. Total facility power often exceeds 20 MW for a mid-scale deployment.

**Cooling.** GPU clusters generate extraordinary heat. Traditional air cooling becomes ineffective above 30 kW per rack. AI facilities increasingly rely on direct-to-chip liquid cooling or immersion cooling, which require specialised piping, coolant distribution units, and heat rejection systems. This adds capital cost but dramatically improves power usage effectiveness (PUE).

**Network fabric.** AI training across multiple GPUs requires high-bandwidth, low-latency interconnects such as NVIDIA InfiniBand or RoCE over Ethernet. These networks operate at 400 Gbps and above, with microsecond-level switching. The internal network of an AI data centre is as critical as its external connectivity.

**Resilience.** AI training jobs can run for weeks or months. An interruption mid-training wastes millions of dollars in compute time. AI data centres require N+1 or 2N redundancy on power and cooling, with robust on-site generation and energy storage.

![Data centre power systems](/images/dc-switchgear-2.webp)

## The Scale of AI Compute Demand in Africa

Africa's AI market is projected to exceed USD 20 billion by 2030, driven by adoption in financial services, agriculture, healthcare, and government services. Mobile money platforms like M-Pesa process over 30 million transactions daily in Kenya alone, and fraud detection, credit scoring, and customer service automation are increasingly AI-driven.

Nigerian fintechs process hundreds of millions of mobile money transactions monthly. Ethiopian and Rwandan governments are deploying AI for agricultural extension services and public health monitoring. South African mining companies use computer vision for safety and efficiency. Across the continent, the common constraint is not the application layer but the compute layer.

Currently, the vast majority of AI inference for African users is served from data centres in Europe (Amsterdam, London, Frankfurt) or the Middle East (Dubai, Abu Dhabi). This architecture has three critical limitations. First, latency. Round-trip times of 150-200ms degrade real-time applications. Second, cost. Bandwidth from Africa to Europe is improving but remains more expensive than intra-continental traffic. Third, data sovereignty. Several African nations are enacting or considering data localisation requirements that will mandate on-shore processing of citizen data.

These factors create a clear and growing demand for AI compute capacity located within Africa, serving African users, and compliant with African data regulations.

## Why East Africa Specifically

East Africa has a combination of structural advantages that no other region on the continent can match for AI data centre development.

**Geothermal energy.** Kenya sits on the East African Rift, one of the world's most geothermally active zones. The Olkaria geothermal complex alone generates over 800 MW, and Kenya's total installed geothermal capacity exceeds 1,000 MW, the largest in Africa and among the top 10 globally. Geothermal power is baseload, meaning it runs 24 hours a day regardless of weather, unlike solar or wind. It is also among the cheapest sources of electricity in Africa, with generation costs of USD 0.07-0.09 per kWh.

![Data centre cooling systems](/images/dc-chillers-roof.webp)

For AI data centres, which consume power continuously and care deeply about cost predictability, geothermal is the ideal energy source. A GPU cluster running a three-month training job needs guaranteed, affordable power around the clock. Geothermal provides exactly that.

**Submarine cable connectivity.** Mombasa is the landing point for at least eight submarine cable systems, including EASSy, Seacom, TEAMS, DARE1, and others. This gives Kenya more international bandwidth capacity than any other country in East or Central Africa. Combined with the [submarine cables landing in Mombasa](/articles/submarine-cables-landing-mombasa), Kenya has established itself as the region's internet gateway.

For AI data centres, this connectivity serves two purposes. It provides low-latency links to global AI model repositories, cloud platforms, and research networks. It also enables Kenya-based facilities to serve as regional hubs, connecting to landlocked neighbours via terrestrial fibre through Uganda, Rwanda, Burundi, eastern DRC, South Sudan, and Ethiopia.

**Market position.** Kenya's tech ecosystem, often called "Silicon Savannah," is the most mature in East Africa. Nairobi hosts the African headquarters of Google, Microsoft, Amazon Web Services, and numerous global tech companies. The country has over 600 tech startups, a robust mobile money ecosystem, and a growing AI research community at institutions like the University of Nairobi, Strathmore University, and the Kenya School of Government.

![Data centre facility in Nairobi](/images/dc-gpu-cluster-2.webp)

## Kenya vs. Other African Markets for AI Infrastructure

To understand Kenya's positioning, it is useful to compare it against the other two markets most frequently cited for data centre investment in Africa.

| Factor | Kenya | South Africa | Nigeria |
|--------|-------|-------------|---------|
| **Primary energy source** | Geothermal (baseload, clean) | Coal (baseload, high emissions) | Natural gas / hydro (mixed reliability) |
| **Grid reliability** | Moderate; improving with geothermal expansion | Moderate; load shedding historically common | Low; chronic generation deficit |
| **Electricity cost (USD/kWh)** | 0.07-0.09 (geothermal) | 0.08-0.12 | 0.10-0.15 |
| **Submarine cables** | 8+ systems in Mombasa | 6+ systems (multiple landing points) | 5+ systems (Lagos) |
| **Regional market reach** | 300M+ (East & Horn of Africa) | 200M+ (Southern Africa, limited by distance) | 400M+ (West Africa, but fragmented) |
| **Existing data centre capacity** | ~30 MW (growing rapidly) | ~200 MW (most mature in Africa) | ~50 MW (growing) |
| **Data sovereignty momentum** | Moderate; East African Community framework developing | Advanced; POPIA enacted | Emerging; NDPR in effect |
| **AI ecosystem maturity** | Growing; Microsoft, Google presence | Established; most AI startups on continent | Emerging; large developer community |
| **Key risk** | Grid capacity for very large facilities | Power cost and carbon intensity | Power reliability and security |

South Africa has the most developed data centre market in Africa, with established operators like Africa Data Centres, Teraco, and DCX. However, its reliance on coal-fired power creates both cost and sustainability challenges for energy-intensive AI workloads. Nigeria has the largest population and a massive developer community, but its power grid remains unreliable, forcing data centre operators to depend heavily on diesel generation, which is expensive and environmentally problematic.

Kenya occupies a middle ground that is increasingly favourable for AI-specific infrastructure. It has less existing data centre capacity than South Africa, which means less legacy infrastructure to work around. Its geothermal resource is genuinely world-class and directly aligned with the 24/7 high-power demands of AI compute.

![Nairobi skyline at dusk](/images/dc-gpu-cluster-2-wide.webp)

## The Microsoft-G42 Lesson: Power Is the Constraint

In May 2024, Microsoft and UAE-based AI company G42 announced a USD 1 billion investment to build a state-of-the-art AI data centre in Kenya, as part of a broader partnership that included [Microsoft and G42's Kenya AI initiative](https://www.microsoft.com/en-us/ai). The announcement was widely celebrated as a landmark moment for African technology infrastructure.

By May 2026, the project had stalled. Reporting from multiple sources indicated that Kenya's national grid, operated by Kenya Power and Lighting Company (KPLC), could not reliably deliver the several hundred megawatts the facility required. The [Kenya power and data centres](/articles/kenya-power-infrastructure-data-centres) dynamic is the single most important factor determining whether large-scale AI infrastructure can be deployed in the country.

This outcome is not a failure of vision or of Kenya's potential. It is a specific, solvable infrastructure gap. The national grid's total installed capacity is approximately 3,500 MW, with peak demand around 2,200 MW. Allocating 200-500 MW to a single data centre customer, while maintaining supply to existing industrial, commercial, and residential users, requires deliberate grid expansion and potentially dedicated transmission infrastructure.

The lesson is clear: AI data centres in Kenya will not be built at hyperscale until power delivery is guaranteed. The geothermal resource exists. The demand exists. The connectivity exists. What must catch up is the grid's ability to deliver that power to a specific facility with the reliability and redundancy that a USD 1 billion investment requires.

## What Needs to Happen Next

For Kenya to actualise its position as East Africa's AI data centre hub, four things must happen in parallel.

**Dedicated power infrastructure.** Large AI data centre operators will not rely solely on the national grid. The model that works is a hybrid approach: dedicated geothermal generation capacity, either owned by the data centre operator or through a power purchase agreement (PPA) with a geothermal producer like KenGen or an independent power producer (IPP), supplemented by grid connection for redundancy. The [Google AI in Africa initiative](https://www.google.com/africa/) has signalled interest in supporting renewable energy infrastructure on the continent, and similar corporate PPAs could underwrite new geothermal development.

**Regulatory streamlining.** The [Kenya data centre licensing](/articles/kenya-data-centre-licensing-framework) framework must evolve to accommodate the unique characteristics of AI facilities, which may not fit neatly into existing categories for telecommunications facilities or commercial buildings. Fast-tracking approvals for facilities that meet specific power, connectivity, and security standards would reduce the time from investment decision to operational deployment.

**Talent development.** Kenya's universities and technical institutions need to develop specialised programmes in high-performance computing infrastructure, GPU cluster management, AI operations (MLOps), and data centre facility engineering. Partnerships between global operators and local institutions, modelled on the Microsoft ADC programme or Google's Career Certificates, could build the workforce needed to operate these facilities.

**Regional fibre expansion.** Kenya's terrestrial fibre backbone to Uganda, Rwanda, and beyond needs continued investment to ensure that AI inference served from Nairobi reaches users across the East African Community with sub-30ms latency. The Eastern Africa Backbone System (EABS) and other regional initiatives are progressing but require accelerated deployment to match the pace of AI adoption.

## The Bottom Line

AI is not a trend that will pass. It is a fundamental restructuring of how software is built, deployed, and consumed. Every industry in Africa, from mobile banking to agriculture to government services, will increasingly depend on AI capabilities that require local compute infrastructure. The question is not whether AI data centres will be built in East Africa, but where and when.

Kenya has the strongest structural case: geothermal baseload power, unmatched submarine cable connectivity in the region, a growing tech ecosystem, and a strategic geographic position. The Microsoft-G42 experience shows that power delivery, not power availability, is the binding constraint. Solving that problem, through dedicated generation capacity and grid investment, will unlock billions of dollars in AI infrastructure investment.

The window is open. Kenya's competitors are not standing still. South Africa is leveraging its first-mover advantage, and Nigeria is aggressively courting data centre investment. But neither has Kenya's combination of clean baseload energy and strategic connectivity. If Kenya's power infrastructure can close the gap in the next three to five years, the country will not just participate in Africa's AI infrastructure buildout. It will lead it.
