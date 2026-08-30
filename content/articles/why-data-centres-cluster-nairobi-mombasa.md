---
title: "Why Kenya's Data Centres Cluster in Nairobi and Mombasa — And Why Nowhere Else"
slug: "why-data-centres-cluster-nairobi-mombasa"
meta_description: "13 of Kenya's 14 tracked data centre facilities sit in just two cities. The explanation comes down to three forces: where subsea cables land, where the grid is strongest, and where demand actually lives. An investigation into the geography of Kenya's digital infrastructure."
primary_keyword: "why data centres cluster in Nairobi and Mombasa"
secondary_keywords:
  - "Kenya data centre locations"
  - "data centres Nairobi Mombasa"
  - "submarine cable landing Mombasa"
  - "geothermal power data centres Kenya"
  - "data centre geography Kenya"
  - "edge computing Kenya towns"
author: "Kevin Jonathan Onyango Otieno"
author_bio_link: "/about"
published_date: "2026-08-30"
updated_date: "2026-08-30"
category: "Market Analysis"
cluster: "Kenya"
og_image: "/images/mombasa-cable-landing-2.webp"
reading_time: "9 min"
images:
  - src: "/images/mombasa-cable-landing.webp"
    alt: "Submarine cable landing infrastructure on the Kenyan coast at Mombasa"
    caption: "Every international byte entering or leaving Kenya passes through a handful of landing stations on this coastline"
    position: "hero"
  - src: "/images/submarine-cables-map.webp"
    alt: "Map of submarine cables making landfall on the East African coast at Mombasa"
    caption: "SEACOM, TEAMS, EASSy, LION2, DARE1 and PEACE all converge on Mombasa — the chokepoint of Kenya's internet"
    position: "infographic"
  - src: "/images/kenya-transmission-pylons.webp"
    alt: "High-voltage transmission pylons crossing Kenyan countryside toward Nairobi"
    caption: "High-voltage transmission lines move geothermal power from the Rift Valley toward the Nairobi load centre"
    position: "section-break"
  - src: "/images/nairobi-westlands.webp"
    alt: "Westlands commercial district in Nairobi, where much of Kenya's enterprise demand is concentrated"
    caption: "Banks, telcos, and cloud customers cluster within a few kilometres of each other in Nairobi"
    position: "section-break"
  - src: "/images/kenya-geothermal-map.webp"
    alt: "Map of Kenya's geothermal power sites in the Rift Valley, including Olkaria"
    caption: "Kenya's geothermal belt sits in the Rift Valley, roughly 100 km from Nairobi — close enough to power a data centre industry, too far to power one anywhere else"
    position: "infographic"
internal_links:
  - text: "how submarine cables land in Mombasa"
    href: "/articles/submarine-cables-landing-mombasa"
  - text: "Nairobi vs Mombasa as data centre locations"
    href: "/articles/nairobi-vs-mombasa-data-centre-locations"
  - text: "Kenya's power infrastructure for data centres"
    href: "/articles/kenya-power-infrastructure-data-centres"
  - text: "the geothermal advantage"
    href: "/articles/geothermal-energy-kenya-data-centres"
  - text: "edge computing in East Africa"
    href: "/articles/edge-computing-east-africa"
  - text: "the DC Directory"
    href: "/directory"
external_sources:
  - title: "TeleGeography Submarine Cable Map — cables landing in Kenya"
    url: "https://www.submarinecablemap.com"
  - title: "Communications Authority of Kenya — licensing and market statistics"
    url: "https://ca.go.ke"
  - title: "Kenya Power — annual reports and transmission statistics"
    url: "https://www.kplc.co.ke"
  - title: "Konza Technopolis Development Authority"
    url: "https://konzacity.go.ke"
faq:
  - question: "Why are Kenya's data centres concentrated in Nairobi and Mombasa?"
    answer: "Three forces explain the concentration. First, all six of Kenya's active submarine cables make landfall on the Mombasa coast, so international bandwidth is cheapest and most reliable near the landing stations. Second, the national grid's strongest transmission corridors run from the Rift Valley geothermal belt into Nairobi, making large blocks of dependable power easiest to secure there. Third, the demand — banks, telcos, government systems, cloud on-ramps and the KIXP internet exchange — is concentrated in Nairobi. Data centres follow cables, power, and customers, and in Kenya all three point to the same two cities."
  - question: "Could a data centre be built in Kisumu, Nakuru, or Eldoret?"
    answer: "Technically yes — nothing stops a small edge facility from being built in any Kenyan town with grid power and fibre backhaul. What those towns lack is the combination that makes larger facilities economic: direct access to multiple fibre routes, high-capacity grid connections with reliable supply, dense enterprise demand, and the specialised workforce data centres require. Until one of those factors changes locally, facilities in upcountry towns will remain small edge sites rather than full data centres."
  - question: "Does Mombasa's cable access make it a better data centre location than Nairobi?"
    answer: "Not by itself. Mombasa's advantage is proximity to the submarine cable landing stations, which matters most for international transit and content delivery. But the city hosts only one of Kenya's tracked facilities, because the demand that fills data centres — enterprise IT, fintech, government workloads — sits in Nairobi, and Nairobi is already served by fibre routes that carry traffic to and from the coast. Mombasa is strategically important for connectivity and disaster-recovery sites, while Nairobi remains where capacity is actually consumed."
  - question: "What would it take for data centres to spread beyond Kenya's two cities?"
    answer: "The most likely catalysts are: a solved power constraint, such as the dedicated geothermal supply discussed for the Microsoft–G42 project, which would prove hyperscale loads can be sited next to generation rather than demand; continued expansion of the national transmission grid; and the growth of edge computing, which pushes small, modular facilities out to regional towns to serve local 4G and 5G traffic. County-level investment incentives and data centre building codes could also tilt decisions, but power and demand remain the decisive factors."
canonical_url: "https://data-centers-254.vercel.app/articles/why-data-centres-cluster-nairobi-mombasa"
---

Ask where Kenya's data centres are and the honest answer fits in two words: Nairobi, Mombasa. The DC254 directory currently tracks 14 facilities across the country — and 13 of them sit in Nairobi, including one announced project that has yet to break ground. Exactly one, Africa Data Centres' coastal site, operates in Mombasa. No facility exists in Kisumu, Nakuru, Eldoret, or any of Kenya's other major towns. For a country of roughly 55 million people and an economy that runs on mobile money, that is a strikingly narrow geographic footprint, and it is not an accident.

This concentration is usually presented as a statistic. It is more useful to treat it as a story about three forces that decide where digital infrastructure gets built: where the international cables come ashore, where the power grid can actually deliver large blocks of electricity dependably, and where the customers with money to spend on computing are located. In Kenya, all three forces point at the same two cities — and until at least one of them changes direction, the map is unlikely to look much different. This article examines each force in turn, then asks what it would take for a third city to appear on Kenya's data centre map.

## First, the facts: 14 facilities, two cities

Start with what the verified data actually shows. Of the 14 facilities in the DC254 directory, 13 are located in Nairobi County — from hyperscale halls along Mombasa Road like iXAfrica NBOX1 and the Africa Data Centres campus, to enterprise and telecom facilities in Westlands such as Safaricom's Waiyaki Way data centre, to smaller colocation rooms scattered through the industrial area. One facility, Africa Data Centres Mombasa, operates in Mombasa County near the submarine cable landing stations. The combined operational IT load of these facilities is roughly 14 megawatts (DC254 database) — modest by global standards, and almost entirely consumed within Nairobi's metropolitan economy.

Two clarifications matter before going further. First, "two cities" is slightly generous to Mombasa: Nairobi holds the overwhelming majority of capacity, and Mombasa's single facility is small — around half a megawatt of IT load, Tier II, primarily useful because of where it stands rather than how much it holds. Second, announced projects complicate the picture but do not change it. The Microsoft–G42 joint venture, nominally a $1 billion facility, remains at announcement stage and is expected to site near Nairobi or the Olkaria geothermal fields — either way, still within the same power-and-demand corridor this article describes.

## Force 1: The cables land in Mombasa

Kenya's connection to the global internet is physical, and it arrives on the ocean floor. Six active submarine cable systems — SEACOM, TEAMS, EASSy, LION2, DARE1, and PEACE — make landfall on or near the Mombasa coast, with a seventh, Meta's Daraja, in development (Verified). Every international phone call, every Netflix stream cached locally, every cloud query routed to a European or American region travels through one of a handful of landing stations on that coastline. The economics follow the infrastructure: bandwidth is cheapest and most dependable within reach of the landing stations, because backhauling traffic hundreds of kilometres inland before it reaches the world adds cost, complexity, and a failure point.

![Map of submarine cables making landfall on the East African coast at Mombasa](/images/submarine-cables-map.webp)

This explains why Mombasa matters at all in the data centre story. Africa Data Centres' coastal facility exists primarily because of its location — a disaster-recovery and low-latency transit site near the landing stations, letting operators and carriers peer directly with the cables without depending on the corridor to Nairobi. It is a facility whose value comes from geography rather than scale. The same logic explains why the landing stations themselves, which are technically small data facilities, cluster along a few kilometres of coast: the cables come ashore at specific beaches determined by the seabed route, and the buildings must follow.

But cable access alone does not make a data centre market. If it did, Mombasa would tower over Nairobi. In practice, the coast hosts a tiny share of Kenya's capacity because cables are an input, not a demand source — and the demand lives 500 kilometres up the road, in a capital that already has fibre corridors connecting it to the landing stations.

## Force 2: The power sits between the Rift Valley and Nairobi

The second force is electricity, and here Kenya's geography produces an unusual advantage with a narrow focus. The country's electricity mix is one of the greenest on Earth — geothermal, hydro, and wind supply the large majority of generation — but the single most important source for data centres is geothermal, and nearly all of it comes from one place: the Rift Valley belt that runs through Olkaria, Naivasha, and adjacent fields. Kenya's geothermal capacity is concentrated within roughly 100 kilometres of Nairobi, and the transmission corridors that move that power feed, above all, the Nairobi metropolitan load centre.

![High-voltage transmission pylons crossing Kenyan countryside toward Nairobi](/images/kenya-transmission-pylons.webp)

For a data centre operator, this matters because compute facilities are essentially power-conversion machines: they take grid electricity and turn it into heat and computation, continuously, at a scale measured in megawatts. Kenya's roughly 14 MW of installed data centre IT load sounds small, but the next wave is not — the Microsoft–G42 project alone has been discussed at a scale of 100 megawatts, and its reported stalling illustrates the point precisely: Kenya Power cannot currently deliver that magnitude of power at a single site within the existing grid's comfortable limits. Large data centres go where large, dependable power can be contracted, and in Kenya that means sites with good transmission access — overwhelmingly the corridor between the geothermal fields and Nairobi.

The consequence is subtle but important: Kenya's green power advantage is real, and it is a genuine marketing asset for attracting AI and cloud investment. But because that power is generated in the Rift Valley and consumed in Nairobi, the advantage accrues to a specific corridor rather than to the whole country. A town without a strong transmission connection to the grid sits far from the advantage no matter how green the national statistics are.


![Map of Kenya's geothermal power sites in the Rift Valley, including Olkaria](/images/kenya-geothermal-map.webp)


## Force 3: The demand lives in Nairobi

The third force is the least technical and the most decisive: the customers are in Nairobi. Kenya's banking sector, its fintech and mobile money platforms, its largest telco, its government systems, its insurance and retail groups, and the growing community of cloud-consuming enterprises are all headquartered within a few square kilometres of each other. Nairobi is also where the Kenya Internet Exchange Point (KIXP) sits, allowing local networks to swap traffic directly instead of paying to haul it to Europe and back. Data centres are real estate for computing, and like all real estate they command a premium where their tenants cluster.

![Westlands commercial district in Nairobi, where much of Kenya's enterprise demand is concentrated](/images/nairobi-westlands.webp)

The demand concentration is self-reinforcing. Banks put their systems in Nairobi facilities because latency to their branches and customers is low and their operations teams are nearby. Cloud and content platforms deploy caches and regions in Nairobi because that is where the users are. Startups build on local cloud because their enterprise customers are there. Each decision deepens the pool of interconnection, skills, and spare capacity in the capital, which in turn makes the next facility more likely to be built there. Mombasa's port economy and coastal businesses generate real IT demand, but not enough of the right kind — dense, always-on, compliance-driven workloads — to anchor a facility ecosystem on the same scale.

There is also a skills dimension that is easy to underestimate. Running a Tier III facility requires a small cadre of specialised engineers — electrical, mechanical, network, and facilities specialists — who are scarce anywhere in the world. Nairobi's universities, telcos, and existing facilities have created the only meaningful pool of this talent in the country. A new facility in a town without that pool either relocates the staff at cost or staffs thinly and accepts operational risk that no operator selling uptime guarantees will take.

## Why not Kisumu, Nakuru, or Eldoret?

None of this means a data centre cannot be built elsewhere in Kenya. It means the economics currently do not favour it, and it is worth being precise about why. Kisumu, the western region's largest city, sits far from both the cable landing points and the geothermal corridor, served by transmission lines and fibre routes that pass through rather than concentrate there. Nakuru and Eldoret sit closer to the Rift Valley power belt, but neither has yet attracted the dense enterprise demand that fills halls — their local economies, while significant, do not host the banks, telco cores, and government workloads that justify dedicated facilities. In each case, at least one of the three forces is missing, and usually two.

What upcountry towns do attract — and will increasingly attract — is edge infrastructure: small, often prefabricated sites that cache content and terminate 4G and 5G traffic close to users, linked back to the core facilities in Nairobi. Edge sites need a fraction of the power and staff of a real data centre, which makes them viable in towns where full facilities are not. The realistic near-term map of Kenyan compute, then, is not "a data centre in every county" but a two-tier structure: core capacity in Nairobi with a transit node in Mombasa, and a growing dusting of edge sites across regional towns.

## What would change the map

Maps like this one change when one of the underlying forces moves. The most discussed possibility is power: if a project of the Microsoft–G42 scale secures dedicated geothermal supply at Olkaria, it would establish that Kenya can site hyperscale compute next to generation rather than next to demand — a genuinely new pattern for the country, and one that could, over a decade, pull subsequent investment toward the Rift Valley. Konza Technopolis, the planned smart city southeast of Nairobi, represents a second path: a purpose-built district with modern power and fibre provisioned in advance, effectively manufacturing the conditions that elsewhere emerged organically. Both remain promises rather than operating reality, and both sit within or beside the existing corridor rather than beyond it.

The quieter transformation is the growth of edge computing, which does not move the core facilities but steadily extends the infrastructure footprint outward. And regulatory choices — county investment incentives, data centre provisions in building codes, or localisation requirements that force government workloads into specific regions — could nudge decisions at the margin. But the honest baseline is this: cables, power, and demand all currently agree on Nairobi and Mombasa, and infrastructure geography changes slowly. The two-city map is not a failure of ambition; it is the rational response to where Kenya's inputs actually are.

## Frequently asked questions

### Why are Kenya's data centres concentrated in Nairobi and Mombasa?

Because all three forces that decide data centre locations point the same way. The six active submarine cables land on the Mombasa coast, making international bandwidth cheapest near the landing stations. The grid's strongest corridors carry geothermal power from the Rift Valley into Nairobi, where large blocks of dependable electricity are easiest to contract. And the demand — banks, telcos, fintech, government systems, and the KIXP exchange — is concentrated in the capital. Facilities follow inputs and customers, and in Kenya both point to the same two cities.

### Could a data centre be built in Kisumu, Nakuru, or Eldoret?

A small edge facility, yes — any town with grid power and fibre backhaul can host one. What those towns lack is the combination that makes larger facilities economic: multiple fibre routes, high-capacity dependable grid connections, dense enterprise demand, and the specialised workforce that Tier III operations require. Without a change in one of those factors, upcountry sites will remain edge deployments rather than full data centres.

### Does Mombasa's cable access make it better than Nairobi for data centres?

Not by itself. Proximity to the landing stations matters most for international transit and disaster recovery, which is precisely the niche Africa Data Centres' Mombasa facility occupies. But cables are an input, not a demand source — the workloads that fill data centres sit in Nairobi, which is already connected to the coast by fibre. Mombasa is strategically important for connectivity; Nairobi is where capacity is consumed.

### What would it take for data centres to spread beyond the two cities?

The most likely catalysts, in order: a solved power constraint — dedicated geothermal supply proving that hyperscale loads can sit next to generation rather than demand; continued transmission grid expansion; and the growth of edge computing pushing modular facilities into regional towns. Purpose-built districts like Konza and county-level incentives could accelerate the shift, but power and demand remain the decisive variables.
