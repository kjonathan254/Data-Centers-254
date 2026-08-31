---
title: "What Is Colocation? How to Rent Space in a Kenyan Data Centre"
slug: "what-is-colocation-kenya"
meta_description: "Colocation lets you rent space, power, cooling, and connectivity in a professional data centre instead of building your own. Learn how colocation works in Kenya, what it costs, and how to choose the right provider."
primary_keyword: "colocation Kenya"
secondary_keywords:
  - "what is colocation"
  - "data centre rental Kenya"
  - "rack space Kenya"
  - "colocation pricing Kenya"
  - "how to choose data centre Kenya"
author: "Kevin Jonathan Onyango Otieno"
author_bio_link: "/about"
published_date: "2026-08-28"
updated_date: "2026-08-28"
category: "Data Centres"
cluster: "Beginner"
og_image: "/images/nairobi-skyline-night-kicc.webp"
reading_time: "11 min"
images:
  - src: "/images/dc-servers-racks.webp"
    alt:  "Blue-lit server racks in a data hall"
    caption: "In a colocation facility, you own the servers and storage — you are renting the physical space, power, cooling, and connectivity that keeps them running"
    position: "hero"
  - src: "/images/mombasa-cable-landing-3.webp"
    alt:  "Submarine cable landing supported by orange buoys in the surf"
    caption: "Colocation providers handle the physical infrastructure including cabling, while customers manage their own equipment and software"
    position: "section-break"
  - src: "/images/nairobi-skyline-night-kicc.webp"
    alt:  "KICC tower and the Nairobi skyline at night"
    caption: "Kenya's colocation market concentrates in Nairobi, with Mombasa emerging."
    position: "inline"
  - src: "/images/dc-security-camera.webp"
    alt:  "Security cameras monitoring a colocation facility"
    caption: "Professional security including biometric access, CCTV, and 24/7 monitoring is included in colocation pricing — something that would be prohibitively expensive to replicate in-house"
    position: "inline"
internal_links:
  - text: "what a data centre is"
    href: "/articles/what-is-a-data-centre"
  - text: "data centre tier ratings"
    href: "/articles/data-centre-tier-ratings-explained"
  - text: "Kenya data centre directory"
    href: "/directory"
external_sources:
  - title: "iXAfrica"
    url: "https://www.ixafrica.com/"
  - title: "Africa Data Centres"
    url: "https://www.africadatacentres.com/"
faq:
  - question: "What is the difference between colocation and cloud?"
    answer: "In colocation, you own and manage the physical servers — you are renting the space, power, cooling, and connectivity to house them. In cloud computing (AWS, Azure, Google Cloud), you rent virtual resources and do not own any physical hardware. Colocation gives you full control over your hardware and data, while cloud gives you flexibility and no hardware management. Many organisations use both."
  - question: "How much does a rack cost in a Kenyan data centre?"
    answer: "A full rack (42U) in a Tier III Kenyan data centre typically costs KES 60,000 to KES 120,000 per month, depending on power allocation (typically 5-10kW per rack), the provider, and contract length. Half-racks and quarter-racks are available for smaller deployments at proportionally lower costs but higher per-unit rates."
  - question: "Can I visit my servers in a colocation facility?"
    answer: "Yes. All reputable colocation facilities allow customers to visit their equipment during business hours, subject to security procedures. Visitors must be pre-registered, present identification, and are typically escorted to their equipment. Some facilities offer 24/7 access with appropriate security clearance. For tasks that do not require a physical visit, most facilities offer remote hands services where on-site staff perform basic tasks on your behalf."
  - question: "What is carrier neutrality and why does it matter?"
    answer: "A carrier-neutral data centre allows multiple network providers to connect to the facility, giving customers the freedom to choose their own connectivity provider(s) and to connect to multiple networks. This prevents vendor lock-in, enables competitive pricing, and allows customers to optimise their connectivity for performance, cost, and redundancy. Non-neutral facilities (typically owned by a single telecom) may only connect to that operator's network."
  - question: "What happens if there is a power outage at the colocation facility?"
    answer: "Professional colocation facilities have multiple layers of power backup. When grid power fails, UPS (uninterruptible power supply) systems provide instant battery power for 10-30 seconds while diesel generators start automatically. Generators can run for days with on-site fuel storage. The facility's redundant power design (N+1 or 2N) means a single component failure never causes downtime. Your servers should never experience a power interruption."
canonical_url: "https://data-centers-254.vercel.app/articles/what-is-colocation-kenya"
---

Imagine you run a growing technology company in Nairobi. You have ten servers humming in a converted storeroom in your office, connected to a single Safaricom fibre line, protected by a consumer-grade UPS that would last maybe 15 minutes during a power cut, and cooled by the building's air conditioning system that was designed for humans, not for machines that generate heat 24 hours a day. Every time there is a power blip, your IT team holds their breath. Every time the building management switches off the AC at night to save power, your server room temperature creeps up. Every time your single internet connection drops, your entire business goes offline.

![Blue-lit server racks in a data hall](/images/dc-servers-racks.webp)

This is the problem that colocation solves. Instead of housing your servers in an inadequate, improvised space, you rent space in a purpose-built data centre that provides professional-grade power, cooling, connectivity, and security. Your servers sit in a facility designed specifically for them — with redundant power supplies, precision cooling, multiple fibre connections from different providers, biometric access control, 24/7 security cameras, and fire suppression systems. You own the servers and the data on them. You manage the software and applications. But the physical infrastructure — the building, the power, the cooling, the connectivity — is provided by the colocation operator.

Colocation is one of the oldest and most fundamental services in the data centre industry. It is the service that launched companies like Equinix, Digital Realty, and Teraco into multi-billion-dollar global businesses. And it is a service that is growing rapidly in Kenya as more organisations recognise the limitations of running their own server rooms.

## How Colocation Works

Colocation is, at its core, a real estate and infrastructure service. The colocation provider builds and operates a data centre facility, and then rents space within that facility to multiple customers. The key principle is that multiple unrelated customers share the same physical facility, but their equipment, data, and network traffic are completely separated.

### Space Units

Colocation space is typically sold in three units. A **rack** (also called a cabinet) is the standard unit — a metal frame approximately 600mm wide, 1,070mm deep, and 2 metres tall, with 42 vertical slots (called "U" for rack units) for mounting equipment. A standard 1U server is about 44mm tall, so a full rack can hold 42 1U servers (in practice, fewer because servers need airflow space). A **half-rack** provides 21U of space, and a **quarter-rack** provides approximately 10U.

For larger deployments, customers can rent a **cage** — a wire mesh enclosure within the data centre that provides additional physical security and privacy. Cages are typically used by customers who need 10 or more racks. For the largest customers, some facilities offer **private suites** — essentially a room within the data centre that only that customer can access.

### Power

Colocation pricing is closely tied to power allocation. Each rack comes with a specific power allocation, typically measured in kilowatts (kW). A standard rack allocation in Kenya is 4–6kW, which is sufficient for 10–20 modern servers. High-density racks, needed for GPU servers or dense compute platforms, may require 10–20kW per rack, which costs more because of the additional cooling and power distribution infrastructure required.

![Submarine cable landing supported by orange buoys in the surf](/images/mombasa-cable-landing-3.webp)

Power is delivered to the rack through power distribution units (PDUs) that are part of the facility's infrastructure. Most colocation racks are equipped with dual PDUs, each connected to a separate power path (A and B feeds), so that a failure in one power path does not affect the other. Servers with dual power supplies can connect to both PDUs, providing power redundancy at the server level.

### Cooling

Colocation facilities maintain strict environmental conditions: temperature typically between 18–27°C and humidity between 20–80% relative humidity, in accordance with ASHRAE guidelines. Precision air conditioning systems — computer room air conditioning (CRAC) units or computer room air handling (CRAH) units — maintain these conditions continuously. In Nairobi's moderate climate, some facilities use free cooling (drawing in outside air when conditions permit) to reduce energy consumption, as explained in [our cooling systems guide](/articles/data-centre-cooling-systems-explained).

### Connectivity

One of the most important features of a carrier-neutral colocation facility is connectivity choice. In a carrier-neutral facility, multiple network providers — Safaricom, Liquid Intelligent Technologies, Telkom Kenya, Jamii Telecommunications, and others — have equipment in the facility's meet-me room. Customers can connect to any or all of these providers, choosing based on price, performance, redundancy, or specific service requirements. This is fundamentally different from a non-neutral facility (like a telecom-owned data centre) where you can only connect to that operator's network.

## Colocation in Kenya: The Market

Kenya's colocation market is served by several providers, each with different strengths and market positions.

### iXAfrica

iXAfrica operates the NBOX1 and NBOX1.1 facilities along Mombasa Road in Nairobi. NBOX1 opened in 2023 as a purpose-built, carrier-neutral colocation facility designed to Tier III standards. It offers retail colocation (individual racks and half-racks) and wholesale colocation (dedicated rooms or cages for large customers). iXAfrica's facility is notable for its focus on sustainability and is designed to achieve low PUE values, leveraging Nairobi's climate for free cooling.

![KICC tower and the Nairobi skyline at night](/images/nairobi-skyline-night-kicc.webp)

### Africa Data Centres

Africa Data Centres, part of the Cassava Technologies group, operates multiple facilities in Nairobi including the Sameer Business Park and Westlands sites. As Africa's largest colocation provider by footprint, ADC brings scale and standardised processes to the Kenyan market. Their integration with Liquid Intelligent Technologies' fibre network provides connectivity advantages, and their pan-African presence allows customers to deploy in multiple African countries through a single provider relationship.

### Safaricom

Safaricom's data centres primarily serve the company's own needs — mobile network infrastructure, M-Pesa processing, and enterprise cloud services. However, Safaricom also offers colocation to enterprise customers, particularly those who want an integrated solution combining colocation with connectivity (Safaricom fibre and mobile) and cloud services. Safaricom's facilities are not carrier-neutral — customers primarily connect to Safaricom's network — which is a limitation for customers who want multi-provider connectivity.

## Pricing in the Kenyan Market

Colocation pricing in Kenya varies by provider, space unit, power allocation, and contract terms. Here are indicative ranges based on current market rates.

**Full rack (42U, 4-6kW)**: KES 60,000–120,000 per month. This typically includes the rack space, power allocation, basic cooling, 24/7 access, and shared internet connectivity (a base bandwidth allocation). Additional charges apply for extra power, cross-connects to specific providers, remote hands services, and premium support.

**Half rack (21U, 2-3kW)**: KES 35,000–70,000 per month. Per-unit pricing is higher than a full rack (you pay a small premium for the smaller commitment), but the total cost is lower, making it accessible to smaller organisations.

**Quarter rack (10U, 1-2kW)**: KES 20,000–45,000 per month. Best suited for small businesses or organisations with just a few servers that need professional infrastructure.

**Dedicated cage (10+ racks)**: KES 50,000–90,000 per rack per month. Volume discounts apply for larger deployments, and pricing is typically negotiated individually.

These prices are competitive by African standards, roughly 20–30% lower than equivalent colocation in Lagos and comparable to mid-tier facilities in Johannesburg. The main additional costs to budget for are cross-connect fees (KES 5,000–15,000 one-time per connection), remote hands charges (KES 2,000–5,000 per incident), and excess power charges if you exceed your allocated power.

![Security cameras monitoring a colocation facility](/images/dc-security-camera.webp)

## Choosing a Provider: What to Look For

Selecting a colocation provider is a significant decision — your servers, your data, and potentially your entire business operation will depend on that provider's facility. Here are the key factors to evaluate.

**Carrier neutrality**: Can you connect to multiple network providers? This is non-negotiable for most enterprise customers. Ask which providers have equipment in the meet-me room and whether there are any restrictions on connectivity.

**Tier rating**: What tier of reliability does the facility target? Tier III (N+1 redundancy on power and cooling) is the minimum for enterprise workloads. Some facilities claim tier ratings without independent certification — ask whether the facility has been certified by the Uptime Institute or another recognised body.

**Security**: What physical security measures are in place? Biometric access, 24/7 CCTV, mantraps, on-site security personnel, and individual rack locking should all be standard. Ask about the facility's security certifications and whether they have ISO 27001.

**Power**: What is the power availability and reliability? Ask about the facility's total power capacity, the utilisation level (how much is already committed to existing customers), the generator fuel storage duration, and whether the facility has dedicated Kenya Power feeders.

**SLA**: What does the Service Level Agreement guarantee? A professional colocation SLA should guarantee 99.99% or better uptime, with financial credits if the facility fails to meet this target. Read the SLA carefully — some providers exclude scheduled maintenance, force majeure events, or customer-caused outages from the SLA calculation.

Colocation is not the right choice for every organisation. Small businesses with just one or two servers may be better served by cloud services. Organisations that do not want to manage any hardware at all should look at managed hosting or cloud. But for organisations that need control over their hardware, have compliance requirements that mandate data location, or have workloads that are not cost-effective to run in the cloud, colocation remains the most practical and cost-effective option in Kenya's growing data centre market.