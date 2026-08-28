---
title: "KIXP: How the Kenya Internet Exchange Point Keeps Traffic Local"
slug: "kixp-internet-exchange-point-kenya"
meta_description: "KIXP is the Kenya Internet Exchange Point. It keeps local internet traffic inside Kenya, reducing latency and costs. Here is how it works and why it matters."
primary_keyword: "KIXP Kenya"
secondary_keywords:
  - "internet exchange point Kenya"
  - "internet peering Nairobi"
  - "local internet traffic Kenya"
  - "KIXP members"
  - "internet peering Africa"
author: "Kevin Jonathan Onyango Otieno"
author_bio_link: "/about"
published_date: "2026-08-26"
updated_date: "2026-08-27"
category: "Connectivity"
cluster: "Internet"
og_image: "/images/dc-networking.webp"
reading_time: "10 min"
images:
  - src: "/images/dc-networking.webp"
    alt: "Data centre networking equipment"
    caption: "KIXP is physically located inside data centres in Nairobi where member networks interconnect"
    position: "hero"
  - src: "/images/africa-dc-map.webp"
    alt: "East Africa data centre and connectivity map"
    caption: "KIXP makes internet traffic between Kenyan users and Kenyan services stay local rather than routing through Europe"
    position: "section-break"
  - src: "/images/dc-servers-racks.png"
    alt: "Server racks in a Nairobi data centre"
    caption: "KIXP switching equipment is housed in carrier-neutral data centres alongside member networks' servers"
    position: "inline"
  - src: "/images/nairobi-skyline.webp"
    alt: "Nairobi skyline"
    caption: "Nairobi hosts KIXP and the majority of Kenya's data centres, creating a natural peering hub"
    position: "infographic"
  - src: "/images/racks-cabling.webp"
    alt: "Network cabling in a data centre"
    caption: "Every KIXP member connects their network to the exchange point via dedicated fibre or cross-connects"
    position: "inline"
internal_links:
  - text: "submarine cables landing in Mombasa"
    href: "/articles/submarine-cables-landing-mombasa"
  - text: "Kenya data centre directory"
    href: "/directory"
  - text: "what is a data centre"
    href: "/articles/what-is-a-data-centre"
external_sources:
  - title: "Internet Society - Internet Exchange Points"
    url: "https://www.internetsociety.org/resources/deploying-internet-exchange-points/"
  - title: "KIXP - Kenya Internet Exchange Point"
    url: "https://www.kixp.or.ke/"
faq:
  - question: "What is an Internet Exchange Point?"
    answer: "An IX is a facility where different networks connect directly to exchange traffic. Without an IX, traffic between two networks in the same city might route through Europe or South Africa. With an IX, it stays local — faster and cheaper."
  - question: "Who can connect to KIXP?"
    answer: "KIXP is open to any organisation that operates its own autonomous system (AS). This includes ISPs, mobile operators, content providers like Google and Netflix, cloud platforms, government networks, and educational institutions."
  - question: "How much traffic does KIXP handle?"
    answer: "KIXP handles over 100 Gbps of peak traffic, making it one of the largest IXPs in East Africa. The volume has grown significantly as more content providers and cloud services establish local presence."
  - question: "Does KIXP reduce internet costs for users?"
    answer: "Indirectly, yes. By keeping traffic local, ISPs avoid paying for international bandwidth on every local connection. This cost saving can be passed on to consumers. KIXP has been cited as a factor in Kenya's relatively affordable internet prices."
  - question: "What is peering vs transit?"
    answer: "Peering is a direct, typically free, exchange of traffic between two networks at an IX. Transit is when you pay another network to carry your traffic to destinations you cannot reach directly. Networks use a mix of both."
canonical_url: "https://data-centers-254.vercel.app/articles/kixp-internet-exchange-point-kenya"
---

![Data centre networking equipment](/images/dc-networking.webp)

Every time a Safaricom subscriber in Nairobi opens the Kenya Revenue Authority iTax portal, and every time an Airtel user in Mombasa streams a video hosted on Google's local cache, that traffic flows through KIXP — the Kenya Internet Exchange Point. KIXP is the single most important piece of internet infrastructure that most Kenyans have never heard of, and it fundamentally shapes how fast, how cheap, and how reliable the internet feels in Kenya.

KIXP is an Internet Exchange Point (IXP): a physical facility where different networks meet to swap traffic directly. Instead of every local data request detouring through an undersea cable to Europe and back, KIXP keeps that traffic inside Kenya. The result is lower latency, lower costs, and a more resilient internet for the entire country.

## How Does KIXP Actually Work?

At its core, KIXP is a high-speed Ethernet switch — technically, a set of redundant switching platforms — housed in [carrier-neutral data centres](/articles/what-is-a-data-centre) in Nairobi. Each member network runs a physical fibre connection from their own equipment to the KIXP switch. Using the Border Gateway Protocol (BGP), members advertise which IP addresses they can reach. When one member wants to send data to an IP address belonging to another member, the traffic goes straight across the switch rather than traveling through an upstream transit provider.

The mechanics are straightforward, but the economics are profound. Without KIXP, a Safaricom customer accessing a website hosted on Liquid Intelligent Technologies would send traffic from Safaricom's network, through a transit provider, often routed via the [submarine cables landing in Mombasa](/articles/submarine-cables-landing-mombasa) to a point of presence in Europe or the Middle East, and then back down to Liquid's network in Nairobi. That round trip adds 150 to 250 milliseconds of latency and consumes expensive international bandwidth on both ends.

With KIXP, the same traffic crosses a single Ethernet switch in Nairobi. Latency drops to under 5 milliseconds. No international bandwidth is consumed. Both networks save money, and the user gets a faster experience.

![East Africa data centre and connectivity map](/images/africa-dc-map.webp)

## The History of KIXP

KIXP was established in 2000 by the [Telecommunications Service Providers Association of Kenya (TESPOK)](https://www.kixp.or.ke/), making it one of the first IXPs in sub-Saharan Africa. At the time, Kenya's internet was served almost entirely through satellite links. International bandwidth cost upwards of USD 7,000 per megabit per second per month — a price that made any meaningful local internet ecosystem impossible.

The early years were difficult. KIXP's founding members had to overcome regulatory resistance from the then-monopoly operator, Kenya Posts and Telecommunications Corporation (KPTC), and later Telkom Kenya. There was no legal framework for internet peering, and the dominant incumbent had little incentive to share traffic locally when it was earning revenue carrying that same traffic internationally.

The breakthrough came with the liberalisation of Kenya's telecommunications sector in the mid-2000s. The Communications Commission of Kenya (now the Communications Authority of Kenya) issued new licensing frameworks that encouraged competition and infrastructure sharing. When TEAMS and SEACOM submarine cables landed in Mombasa in 2009–2010, international bandwidth prices collapsed. But paradoxically, this made KIXP *more* important, not less: cheaper international bandwidth meant more Kenyans came online, which meant more local content and services, which meant more traffic that benefited from local peering.

By 2012, KIXP was handling over 1 Gbps of traffic. By 2018, it had crossed 30 Gbps. Today, peak traffic exceeds 100 Gbps, with over 60 connected members.

## Who Connects to KIXP?

KIXP's membership has expanded far beyond traditional ISPs. The current member roster reflects the maturity of Kenya's internet ecosystem:

- **Mobile network operators**: Safaricom, Airtel Kenya, and Telkom Kenya all peer at KIXP. This means that a Safaricom user calling an Airtel number via WhatsApp stays entirely local.
- **Fixed and fibre ISPs**: Liquid Intelligent Technologies, Wananchi Group (Zuku), Poeple (PoA Internet!), AccessKenya, and dozens of smaller regional ISPs.
- **Content providers and CDNs**: Google, Netflix, Meta (Facebook and Instagram), and Cloudflare all maintain a presence at KIXP or connect through their local caching infrastructure. This is why YouTube and Netflix stream in high definition without buffering for most Kenyan users.
- **Government and education**: The Kenya Education Network (KENET), which connects universities and research institutions across the country, peers at KIXP. Government services hosted by the ICT Authority also exchange traffic locally.
- **Cloud and hosting providers**: Local and regional cloud providers connect at KIXP so that their customers' workloads communicate efficiently with other Kenyan networks.

![Server racks in a Nairobi data centre](/images/dc-servers-racks.png)

## Peering vs Transit: What Is the Difference?

Understanding KIXP requires understanding the distinction between peering and transit, because these two arrangements determine how most internet traffic flows — and how much it costs.

| Characteristic | Peering (at KIXP) | Transit (upstream provider) |
|---|---|---|
| **Cost** | Typically free (settlement-free) | Paid per Mbps or Gbps |
| **Scope** | Only reaches other peers at the same IX | Reaches the full global internet |
| **Traffic flow** | Direct, often single switch hop | Routed through one or more intermediate networks |
| **Latency** | Very low (1–5 ms within Nairobi) | Higher (depends on transit provider's path) |
| **Who uses it** | Networks exchanging local traffic | Networks needing global reach |
| **Example** | Safaricom ↔ Google cache at KIXP | Small ISP → Liquid → London → destination |

Most Kenyan networks use a combination. They peer at KIXP for local traffic — which, thanks to content caching, can represent 60–80% of total volume — and buy transit from an upstream provider for everything else. The more traffic a network can peer locally, the less transit it needs to purchase, and the lower its operating costs.

## Why KIXP Matters for Internet Costs in Kenya

Kenya has some of the most affordable mobile data prices in Africa. According to the Alliance for Affordable Internet (A4AI), 1 GB of mobile data in Kenya costs roughly 2–3% of monthly income at the national poverty line — well below the A4AI's affordability threshold of 2% for low-income groups (as measured at the median income level). KIXP is not the only reason, but it is a significant contributing factor.

Consider the arithmetic. If Safaricom handles 500 Gbps of total traffic during peak evening hours, and 70% of that traffic can be peered locally at KIXP (350 Gbps), then Safaricom only needs to purchase transit capacity for the remaining 150 Gbps. Without KIXP, that full 500 Gbps would need international transit. At current wholesale prices, the difference is tens of thousands of dollars per month — savings that directly affect consumer pricing.

KIXP also reduces the load on Kenya's international links. This is important for national resilience. The [submarine cables landing in Mombasa](/articles/submarine-cables-landing-mombasa) have finite capacity. During cable cuts — which happen several times a year — KIXP-local traffic is completely unaffected. Kenyans can still access local banking, government services, and locally cached content even when the country's connection to the global internet is degraded.

![Nairobi skyline](/images/nairobi-skyline.webp)

## KIXP's Technical Infrastructure

KIXP operates multiple switching platforms across two or more data centre facilities in Nairobi to ensure redundancy. The exchange uses a Layer 2 Ethernet fabric, meaning it operates at the data link layer. Members establish BGP sessions (typically over 10 Gigabit or 100 Gigabit Ethernet ports) to exchange routing information.

The technical specifications matter for reliability. KIXP's switching infrastructure is designed to deliver:

- **Redundancy**: Dual switches in separate data centres ensure that a single hardware failure does not disconnect members. Each member is encouraged to connect to both sites.
- **Low latency**: The entire switching fabric adds less than 1 millisecond of delay. Traffic between two members in the same data centre facility experiences sub-millisecond latency.
- **Scalability**: The current platform supports 100 Gigabit Ethernet ports, with the ability to upgrade to 400 Gigabit as demand grows.
- **Neutrality**: KIXP is operated by TESPOK on a non-profit basis. No member receives preferential treatment. The exchange does not sell transit — it only facilitates peering.

The physical locations of KIXP's switching equipment are within commercial data centres in Nairobi. You can find these and similar facilities in the [Kenya data centre directory](/directory). Members collocate their own routers and servers in these same facilities, or they run dedicated fibre from their own premises to the KIXP point of presence.

![Network cabling in a data centre](/images/racks-cabling.webp)

## The Role of Content Caching at KIXP

One of the most impactful developments at KIXP in the last decade has been the arrival of large content providers. Google installed a Global Cache node accessible via KIXP in the early 2010s. Netflix followed with its own Open Connect appliance. Meta, Cloudflare, and Akamai have all established local presence.

Content caching works by storing popular content — YouTube videos, Netflix shows, Facebook images, web assets — on servers physically located in or near KIXP. When a Kenyan user requests that content, it is served from the local cache rather than from a data centre in Europe or the US. Because the cache connects to KIXP, every member network can reach it with minimal latency and zero international bandwidth cost.

The effect on traffic patterns has been dramatic. Before content caching, the vast majority of traffic on Kenyan networks was outbound — Kenyan users pulling content from overseas. Today, thanks to caching and the growth of local digital services like M-Pesa, KENET, and government portals, a substantial and growing fraction of traffic is genuinely local in both directions.

## How Does KIXP Compare to Other African IXPs?

KIXP is frequently cited as a model for internet exchange development in Africa. According to the [Internet Society](https://www.internetsociety.org/resources/deploying-internet-exchange-points/), Kenya was among the first countries on the continent to establish a functional IXP, and its experience has informed IXP deployment strategies across the region.

South Africa's NAPAfrica, based in Johannesburg and Cape Town, handles significantly more traffic (over 1 Tbps at peak) due to the country's larger economy and more developed hosting sector. Nigeria's IXPN, based in Lagos and Abuja, handles comparable volumes to KIXP. But on a per-capita basis, Kenya's peering ecosystem punches above its weight. The combination of high mobile penetration, strong local content growth, and a competitive ISP market has driven KIXP's traffic to levels that countries with larger populations have struggled to match.

Rwanda's RINEX, Tanzania's TIX, and Uganda's UIXP have all benefited from lessons learned at KIXP. Regional interconnection between East African IXPs is an ongoing effort, with the goal of keeping intra-African traffic on the continent rather than routing through Europe.

## The Policy and Regulatory Environment

Kenya's regulatory framework has been broadly supportive of internet peering, though the relationship has not always been smooth. The Communications Authority of Kenya (CA) has not mandated peering — KIXP operates on a voluntary, bilateral peering model. Some policymakers have argued that mandatory peering would improve service quality, while the industry has generally preferred the current voluntary approach, arguing that it encourages investment and avoids the complexity of regulatory intervention.

Taxation of digital services is a related policy issue that indirectly affects KIXP. Kenya's Digital Services Tax, introduced in 2021, imposed a levy on income from services delivered over the internet. While the tax does not directly target peering, it affects the economics of content providers operating in Kenya and, by extension, the incentives for maintaining local caching infrastructure.

The Kenya Information and Communications (Amendment) Act, 2013 also has implications for internet infrastructure. The Act provides a framework for the sharing of telecommunications infrastructure, including ducts, towers, and fibre routes. This infrastructure sharing has lowered the cost for new ISPs to connect to KIXP by reducing the capital expenditure needed to build or lease last-mile fibre to the exchange point.

## What Are the Challenges Facing KIXP?

Despite its success, KIXP faces several challenges:

**Limited regional interconnection**. Traffic between Kenya and its neighbours — Uganda, Tanzania, Rwanda — often still routes through Europe. While there are efforts to establish cross-border peering, regulatory differences, commercial disputes, and the lack of direct fibre links between national IXPs remain obstacles.

**Concentration in Nairobi**. KIXP's infrastructure is concentrated in Nairobi. ISPs serving Mombasa, Kisumu, or coastal regions must backhaul traffic to Nairobi to peer, adding cost and latency. There have been discussions about establishing remote peering points or a secondary KIXP node in Mombasa, but no concrete plans have been implemented.

**Power costs**. Kenya's electricity tariffs, while lower than many African countries, have been rising. Data centres — including those hosting KIXP — are significant power consumers, and these costs are ultimately borne by members.

**Security concerns**. Like any critical internet infrastructure, KIXP is a potential target for cyberattacks. While the exchange itself is a Layer 2 facility and does not inspect application-layer traffic, BGP hijacking and route leaks from misconfigured members are ongoing risks that require constant monitoring.

## Frequently Asked Questions

**What is an Internet Exchange Point?**

An IX is a facility where different networks connect directly to exchange traffic. Without an IX, traffic between two networks in the same city might route through Europe or South Africa. With an IX, it stays local — faster and cheaper.

**Who can connect to KIXP?**

KIXP is open to any organisation that operates its own autonomous system (AS). This includes ISPs, mobile operators, content providers like Google and Netflix, cloud platforms, government networks, and educational institutions.

**How much traffic does KIXP handle?**

KIXP handles over 100 Gbps of peak traffic, making it one of the largest IXPs in East Africa. The volume has grown significantly as more content providers and cloud services establish local presence.

**Does KIXP reduce internet costs for users?**

Indirectly, yes. By keeping traffic local, ISPs avoid paying for international bandwidth on every local connection. This cost saving can be passed on to consumers. KIXP has been cited as a factor in Kenya's relatively affordable internet prices.

**What is peering vs transit?**

Peering is a direct, typically free, exchange of traffic between two networks at an IX. Transit is when you pay another network to carry your traffic to destinations you cannot reach directly. Networks use a mix of both.

## Why KIXP Will Become Even More Important

Kenya's internet user base continues to grow. The Communications Authority of Kenya reports over 25 million internet subscribers as of 2025, with mobile internet penetration exceeding 60%. The government's digital transformation agenda — which includes moving services online, expanding e-commerce, and developing smart city infrastructure — will generate enormous volumes of local traffic.

Cloud computing adoption among Kenyan enterprises is accelerating. As more businesses migrate workloads to cloud platforms with local points of presence, the traffic between those platforms and end users will flow through KIXP. The same applies to edge computing, 5G networks, and the Internet of Things — all of which generate traffic that benefits from local peering.

KIXP is not a glamorous technology. It does not make headlines the way a new submarine cable or a data centre grand opening does. But it is the quiet infrastructure that makes everything else work efficiently. Without KIXP, Kenya's internet would be slower, more expensive, and more fragile. With it, the country has built one of the most effective peering ecosystems on the African continent — and that foundation will support the next generation of Kenya's digital economy.