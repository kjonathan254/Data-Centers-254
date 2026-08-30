---
title: "Fibre Optic Networks Powering Kenya's Data Centres: Liquid Telecom, Safaricom, and the Last Mile"
slug: "fibre-optic-networks-kenya-data-centres"
meta_description: "Kenya's 15,000+ km of fibre optic cable connects data centres to the world. Explore the operators, pricing, redundancy strategies, and last-mile challenges that determine how fast and reliable your data centre connectivity really is."
primary_keyword: "fibre optic networks Kenya"
secondary_keywords:
  - "Kenya fibre optic providers"
  - "data centre connectivity Kenya"
  - "NOFBI Kenya"
  - "Liquid Intelligent Technologies Kenya"
  - "Safaricom fibre network"
author: "Kevin Jonathan Onyango Otieno"
author_bio_link: "/about"
published_date: "2026-08-28"
updated_date: "2026-08-28"
category: "Connectivity"
cluster: "Internet"
og_image: "/images/dc-fibre-optics.webp"
reading_time: "13 min"
images:
  - src: "/images/dc-fibre-optics.webp"
    alt: "Network switching and fibre optic termination equipment inside a data centre"
    caption: "Every data centre depends on multiple fibre connections from different providers to ensure redundancy — a single fibre cut should never take a facility offline"
    position: "hero"
  - src: "/images/mombasa-cable-landing-3.webp"
    alt: "Structured fibre optic cabling in a data centre"
    caption: "Structured cabling within a data centre connects every rack to network aggregation points, which then connect to external fibre providers via diverse routes"
    position: "section-break"
  - src: "/images/mombasa-cable-landing-2.webp"
    alt: "East Africa fibre and submarine cable infrastructure map"
    caption: "Kenya's fibre network connects to four submarine cable systems landing in Mombasa, providing redundancy and multiple routing options to Europe, Asia, and the Middle East"
    position: "infographic"
  - src: "/images/whats-inside-ai-data-center.webp"
    alt: "Server racks in a connected data centre"
    caption: "Without reliable fibre connectivity, even the most powerful servers are unreachable — connectivity is as important as power and cooling"
    position: "inline"
  - src: "/images/diagram-microwave-data-link.webp"
    alt: "Diagram of a long distance microwave data link between two sites 50 kilometres apart"
    caption: "Where fibre has not yet reached, licensed microwave links moving around 1 Gbps over a 50 km hop remain a practical backhaul bridge."
    position: "diagram"

internal_links:
  - text: "submarine cables landing in Mombasa"
    href: "/articles/submarine-cables-landing-mombasa"
  - text: "KIXP Internet Exchange Point"
    href: "/articles/kixp-internet-exchange-point-kenya"
  - text: "Kenya infrastructure overview"
    href: "/infrastructure"
external_sources:
  - title: "Communications Authority of Kenya - Sector Statistics"
    url: "https://www.ca.go.ke/category/sector-statistics/"
  - title: "Liquid Intelligent Technologies"
    url: "https://www.liquid.tech/"
faq:
  - question: "How much fibre optic cable is in Kenya?"
    answer: "Kenya has an estimated 15,000 to 20,000 kilometres of fibre optic cable, including the National Optic Fibre Backbone Infrastructure (NOFBI), operator-owned backbone networks, and metropolitan fibre in major towns. The four major operators — Liquid Intelligent Technologies, Safaricom, Telkom Kenya, and Jamii Telecommunications — collectively account for over 80% of the total."
  - question: "Who are the main fibre providers for data centres in Nairobi?"
    answer: "The dominant fibre providers serving Nairobi data centres are Liquid Intelligent Technologies (formerly Liquid Telecom), Safaricom, Telkom Kenya, and Jamii Telecommunications. Most carrier-neutral data centres have connections from at least two of these providers, plus direct connections to submarine cable landing stations in Mombasa."
  - question: "What is NOFBI and does it serve data centres?"
    answer: "NOFBI (National Optic Fibre Backbone Infrastructure) is the government-owned fibre network built by the Kenya Information and Communications Authority. It connects all 47 county headquarters and links to submarine cable stations. While primarily designed for government and educational institutions, NOFBI provides an additional redundancy path that some data centres can access through peering arrangements."
  - question: "How much does a dedicated fibre link to a data centre cost in Kenya?"
    answer: "A dedicated 1Gbps fibre connection from a Nairobi data centre to an office in the city centre typically costs KES 80,000 to KES 200,000 per month, depending on the provider, contract length, and whether it includes redundancy. Cross-country links to Mombasa or other towns are more expensive. Dark fibre (unlit fibre that the customer manages) is available from some providers for long-term leases."
  - question: "Why do data centres need multiple fibre providers?"
    answer: "Redundancy. If a single provider's fibre is cut — whether by road construction, accidental damage, or equipment failure — traffic must automatically reroute through an alternative path. Carrier-neutral data centres typically require connections from at least two independent providers entering the building via different physical routes, ensuring that no single incident can isolate the facility from the internet."
canonical_url: "https://data-centers-254.vercel.app/articles/fibre-optic-networks-kenya-data-centres"
---

A data centre without fibre connectivity is a warehouse full of expensive computers that nobody can reach. Every transaction on M-Pesa, every query to a bank's application, every page load on a Kenyan government website — all of it travels over fibre optic cables that connect data centres to users, to each other, and to the global internet. Kenya's fibre optic network is the circulatory system of its digital economy, and understanding how it works, who operates it, and where the weaknesses are, is essential for anyone investing in or depending on digital infrastructure.

![Network switching and fibre optic termination equipment inside a data centre](/images/dc-fibre-optics.webp)

Kenya has built one of the most extensive fibre networks in sub-Saharan Africa over the past two decades. The combination of submarine cable landing stations in Mombasa, a competitive operator landscape, and government investment through the National Optic Fibre Backbone Infrastructure has created a network that reaches all 47 counties and connects to the global internet through multiple redundant paths. But coverage is uneven, pricing is opaque, and the "last mile" — the final connection from the fibre backbone to the actual data centre or office building — remains the most expensive and problematic part of the chain.

## The Major Fibre Operators in Kenya

Kenya's fibre market is dominated by four operators, each with distinct strengths, network footprints, and strategic positions. Understanding who they are and what they own is the first step to understanding data centre connectivity.

### Liquid Intelligent Technologies

Liquid Intelligent Technologies, formerly Liquid Telecom, is the largest fibre operator in Kenya by route kilometres. The company, now part of the Cassava Technologies group (which also owns Africa Data Centres), has built a pan-African fibre network spanning over 100,000 kilometres across more than 20 countries. In Kenya, Liquid's network connects Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, and most major towns, with multiple redundant rings around Nairobi for metro connectivity.

Liquid's strategic advantage for data centre connectivity is vertical integration. Because the same parent company owns Africa Data Centres, Liquid can offer bundled connectivity and colocation packages that are difficult for competitors to match on price. A customer placing servers in an Africa Data Centres facility can get connectivity, colocation, and managed services from a single vendor, with SLAs that span the entire stack. This integration also means Liquid's fibre routes are optimised for data centre-to-data-centre traffic, not just for connecting enterprise branch offices.

### Safaricom

Safaricom is Kenya's largest telecom operator by revenue and subscriber base, and its fibre network is extensive, particularly in Nairobi, Mombasa, and the corridors connecting major towns. Safaricom's fibre strategy has historically focused on serving its own needs — connecting base stations, enterprise clients, and its own data centres — but the company has increasingly offered wholesale fibre to third-party data centres and enterprises.

Safaricom's unique advantage is its mobile network. The company operates the largest 4G and 5G network in Kenya, and many data centre customers want connectivity that spans both fixed fibre and mobile networks. Safaricom can offer integrated solutions that include dedicated fibre links, mobile backhaul, and even direct interconnection with the M-Pesa platform — a compelling proposition for financial services companies.

![Structured fibre optic cabling in a data centre](/images/mombasa-cable-landing-3.webp)

### Telkom Kenya

Telkom Kenya, majority-owned by the Helios Investment Partners-led consortium (now rebranded as Jamhuri Holdings), operates a significant fibre network that includes the former Kenya Telkom backbone inherited from the privatisation era. Telkom's network is particularly strong in Nairobi's central business district and along the Mombasa Road corridor where most data centres are concentrated.

Telkom's competitive position is built on pricing and its role as an alternative to Safaricom and Liquid. For data centre operators, having Telkom as a second or third fibre provider is important for redundancy — it ensures that traffic can reroute if the primary provider has an outage, and it provides negotiating leverage on pricing.

### Jamii Telecommunications (Wananchi Group)

Jamii Telecommunications, part of the Wananchi Group, operates fibre networks primarily in Nairobi's residential and commercial areas. The company's Waba fibre-to-the-home service has made it a significant player in the last-mile market, and it also provides enterprise and data centre connectivity. Jamii's advantage is its metro footprint in areas like Westlands, Kilimani, and Karen — neighbourhoods with high concentrations of businesses that need data centre connectivity.

## How Fibre Reaches a Data Centre

The path from a user's phone or laptop to a server inside a data centre involves multiple segments of fibre, each managed by different entities, each with different reliability characteristics and cost structures. Understanding this path is critical for understanding data centre connectivity.

### Submarine Cables to Landing Stations

The journey begins (or ends) at the submarine cable landing stations in Mombasa. Kenya has four operational submarine cable systems: SEACOM, TEAMS, EASSy, and DARE1. Each cable lands at dedicated stations along the Mombasa coast and connects to terrestrial fibre networks that carry traffic inland to Nairobi, where the data centres are. The [submarine cables themselves](/articles/submarine-cables-landing-mombasa) provide Kenya's connection to the global internet — to Europe, Asia, the Middle East, and the rest of Africa.

### Long-Haul Backbone: Mombasa to Nairobi

From the landing stations, traffic travels over long-haul fibre to Nairobi. This 500-kilometre route is one of the most critical infrastructure segments in Kenya's digital economy. Multiple operators have built parallel fibre routes between Mombasa and Nairobi, and most follow the Mombasa-Nairobi highway corridor. The diversity of routes is important — a single fibre cut along this corridor could potentially degrade connectivity for the entire country if all operators' cables followed the same physical path, which is why regulators encourage route diversity.

### Metro Fibre: Nairobi Distribution

Once traffic reaches Nairobi, it is distributed over metropolitan fibre networks to individual data centres, offices, and base stations. Nairobi's metro fibre network is the densest in East Africa, with multiple concentric rings providing redundancy. Major data centre clusters along Mombasa Road, in Westlands, and in Sameer Business Park are served by multiple fibre providers, each entering the buildings through different ducts and manholes to ensure physical route diversity.

### In-Building Fibre and Cross-Connects

The final segment is inside the data centre itself. Fibre from external providers terminates in a meet-me room (MMR) or carrier room, where patch panels allow connections to be made between providers and customers. A "cross-connect" is a physical cable (often a short fibre patch cord) that connects a customer's rack or cage to a specific provider's network. Cross-connects are how customers choose which networks they connect to, and they are typically provisioned within 24–48 hours in a well-managed facility.

![East Africa fibre and submarine cable infrastructure map](/images/mombasa-cable-landing-2.webp)

## Redundancy: The Most Critical Requirement

For data centre operators and their customers, fibre redundancy is not optional — it is the single most important connectivity requirement. A data centre with a single fibre connection is a single point of failure, regardless of how reliable that connection is on a day-to-day basis.

The standard requirement for a carrier-neutral colocation facility is at least two independent fibre connections from different providers, entering the building through different physical routes. This means the cables should not share the same trench, the same manhole, or the same conduit — if a construction crew digs up one road and cuts a fibre, the other connection should be unaffected.

Beyond dual entry, larger facilities aim for three or more diverse fibre paths. This provides additional resilience against multiple simultaneous failures and also enables traffic engineering — routing different types of traffic (e.g., latency-sensitive financial transactions vs. bulk data transfers) over different paths based on their characteristics.

## The National Optic Fibre Backbone Infrastructure (NOFBI)

The Kenyan government has invested heavily in fibre through the National Optic Fibre Backbone Infrastructure programme. NOFBI was designed to connect all 47 county headquarters and major government institutions, providing a backbone that government agencies, schools, and hospitals could use for connectivity.

NOFBI's relationship with commercial data centres is indirect but relevant. The network provides an alternative path for traffic, particularly in areas where commercial operators have not invested. In some cases, data centres in smaller towns (like Kisumu or Nakuru) may access NOFBI through peering arrangements, though the government network is not designed or priced for commercial data centre use. There have been periodic discussions about making NOFFI available to commercial operators on a wholesale basis, which could significantly reduce connectivity costs in underserved areas.

## Pricing and Cost Structures

Fibre connectivity pricing in Kenya is complex and often opaque. The market lacks the transparent pricing that characterises more mature markets like South Africa or Europe, and pricing varies significantly based on the customer's size, contract length, and negotiating leverage.

For data centre connectivity, the key pricing models are dedicated internet access (DIA), where the customer gets a committed bandwidth with symmetrical upload and download speeds; point-to-point links, which connect two specific locations (e.g., a bank's headquarters to its disaster recovery site in a data centre); and peering/transit, where the data centre connects to internet exchange points and upstream providers for global reach.

A 1Gbps dedicated internet connection in Nairobi typically costs between KES 80,000 and KES 200,000 per month. 10Gbps connections range from KES 400,000 to KES 1.2 million per month, with significant volume discounts available for larger commitments. These prices have fallen substantially over the past five years — a 1Gbps connection that cost KES 300,000 in 2020 can now be had for under KES 100,000 — but they remain higher than equivalent connections in South Africa or Egypt, reflecting Kenya's smaller market and the costs of serving a geographically dispersed customer base.

## Challenges and Gaps

Despite the progress, Kenya's fibre infrastructure faces significant challenges. Last-mile connectivity — the final segment from the backbone to the customer's premises — remains the most expensive part of the chain, often accounting for 40–60% of the total cost of a connectivity service. Getting fibre into older buildings in Nairobi's CBD, where building managements may charge access fees or where physical duct space is limited, can be prohibitively expensive.

Right-of-way challenges persist. Despite regulations requiring utility companies to coordinate and share duct space, fibre deployments are frequently delayed by county government permits, road construction, and disputes with other utility operators. These delays increase costs and slow the expansion of connectivity to new areas.

![Server racks in a connected data centre](/images/whats-inside-ai-data-center.webp)

Rural and peri-urban areas remain underserved. While NOFBI has connected county headquarters, the last-mile from county towns to individual facilities, schools, and businesses is often still missing. This matters for data centres because edge computing — placing smaller data processing facilities closer to end users — requires fibre connectivity in locations that currently lack it.

## The Future: 5G Backhaul, Edge, and New Submarine Cables

Looking ahead, several trends will shape Kenya's fibre infrastructure. 5G deployment by Safaricom, Airtel, and others will require massive fibre backhaul — every 5G base station needs a fibre connection, and the density of 5G cells means far more fibre endpoints than 4G required. This will drive further investment in metro fibre networks.

![Diagram of a long distance microwave data link between two sites 50 kilometres apart](/images/diagram-microwave-data-link.webp)

Edge computing, where smaller data processing facilities are placed in towns and neighbourhoods rather than centralised in Nairobi, will require fibre connectivity in new locations. As applications like autonomous vehicles, remote surgery, and real-time AI inference demand lower latency than a 500-kilometre round trip to Nairobi can provide, edge facilities in Mombasa, Kisumu, and other towns will become necessary.

New submarine cable systems, including 2Africa (Meta-backed) and Equiano (Google-backed, landing in South Africa but with branching units that could serve East Africa), will add further capacity and resilience. More capacity means lower per-megabit costs, which will eventually flow through to data centre connectivity pricing.

Kenya's fibre network is the foundation on which its entire digital economy is built. For data centre operators, the quality, diversity, and cost of fibre connectivity is a primary differentiator — and for customers choosing between facilities, it should be one of the first questions asked.