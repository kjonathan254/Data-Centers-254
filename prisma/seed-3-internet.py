import sqlite3
import sys

import os
DB_PATH = os.path.join(os.path.dirname(__file__), "dev.db")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def new_id(cur):
    row = cur.execute("SELECT lower(hex(randomblob(8)))").fetchone()
    return row[0]


def main():
    conn = get_connection()
    cur = conn.cursor()

    articles = [
        {
            "title": "How the Internet Gets to Kenya",
            "slug": "how-the-internet-gets-to-kenya",
            "tlDr": "The internet reaches Kenya through undersea fibre-optic cables that land at Mombasa, travel overland to Nairobi, and then fan out to data centres, internet exchanges, and ultimately your phone or laptop.",
            "description": "A beginner-friendly walkthrough of the physical path data takes from global internet backbones to a user in Nairobi, covering submarine cables, landing stations, terrestrial fibre, and last-mile connections.",
            "content": """## From the Rest of the World to Mombasa

The internet is not some abstract cloud floating above us. It is a vast physical network of cables, mostly made of glass fibre, stretching across continents and ocean floors. For Kenya, the journey begins thousands of kilometres away in data centres and internet hubs in Europe, the Middle East, and Asia. From these hubs, massive undersea fibre-optic cables snake along the ocean floor, crossing the Indian Ocean until they arrive at landing stations on the Kenyan coast near Mombasa.

## Landing Stations at the Coast

Mombasa is the gateway. Four major submarine cables come ashore here: TEAMS, EASSy, SEA-ME-WE 5, and DARE1. Each cable terminates at a landing station where specialised equipment converts light signals back into electrical data. These stations are typically located in secured beachfront facilities operated by the cable owners or their Kenyan partners. The Kenyan government has designated specific cable landing zones to protect these critical pieces of infrastructure.

## The Long Haul Inland

From Mombasa, data travels overland on terrestrial fibre-optic cables that run alongside roads, railways, and power lines all the way to Nairobi. This journey of roughly 500 kilometres takes just a few milliseconds. Multiple operators maintain parallel routes for redundancy. The Kenya Information and Communications Authority tracks these networks, which are operated by companies like Telkom Kenya, Safaricom, Liquid Intelligent Technologies, and the Kenya Electricity Transmission Company under its fibre licensing arrangements.

## Arriving in Nairobi's Data Centres

Once data reaches Nairobi, it enters data centres where internet service providers, content companies, and cloud providers have their equipment. Major facilities run by Africa Data Centres, iXAfrica, PAIX, and others house the servers and switches that deliver websites, streaming video, and mobile money services to millions of users. The Kenya Internet Exchange Point (KIXP), located in Nairobi, allows these different operators to exchange traffic directly without routing it back through Mombasa and out to the wider internet.

## The Last Mile to You

The final stretch depends on how you connect. If you are on mobile data, a cell tower near you receives the signal from a base station controller that is linked by microwave or fibre to your operator's core network in Nairobi. If you are on home fibre, a cable runs from your router to a neighbourhood aggregation point, then to the operator's metropolitan network, and finally to the data centre where the content you requested lives. Either way, every web page you load has travelled through this chain: submarine cable, landing station, terrestrial fibre, data centre, and last-mile network.""",
            "readingTimeMin": 6,
            "sortOrder": 1,
            "claims": [
                {
                    "claim": "Four major submarine cables land at Kenya's coast near Mombasa: TEAMS, EASSy, SEA-ME-WE 5, and DARE1.",
                    "source": "Kenya Information and Communications Authority and cable operator disclosures",
                    "confidence": "High"
                },
                {
                    "claim": "Terrestrial fibre runs approximately 500 kilometres from Mombasa landing stations to Nairobi data centres.",
                    "source": "Telkom Kenya and Liquid Intelligent Technologies network maps",
                    "confidence": "High"
                },
                {
                    "claim": "The Kenya Internet Exchange Point (KIXP) in Nairobi allows local operators to exchange traffic directly without routing through submarine cables.",
                    "source": "TESPOK (Telecommunications Service Providers Association of Kenya)",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "Kenya's Submarine Cables Explained",
            "slug": "kenyas-submarine-cables-explained",
            "tlDr": "Kenya connects to the world through four submarine cables: TEAMS (2009), EASSy (2010), SEA-ME-WE 5 (2010), and DARE1 (2022), each with different owners, capacities, and routes across the Indian Ocean.",
            "description": "A detailed look at each of the four undersea fibre-optic cables that land at Kenya's coast, covering their history, ownership, capacity, and the routes they follow across the ocean floor.",
            "content": """## Why Submarine Cables Matter

Before 2009, Kenya relied entirely on satellite links for international internet connectivity. Satellite is slow, expensive, and has high latency because signals must travel 36,000 kilometres to a geostationary orbit and back. When submarine cables arrived, everything changed. International bandwidth costs plummeted, speeds increased dramatically, and Kenya's internet economy took off. Today, four cables serve the country, each with a different story.

## TEAMS (The East African Marine System)

TEAMS was the first submarine cable to land in Kenya, going live in 2009. It was a joint venture between the Kenyan government and the Emirates Telecommunications Establishment (Etisalat, now e&). The cable runs from Fujairah in the United Arab Emirates, down the Red Sea and along the East African coast to Mombasa. TEAMS initially offered around 1.2 terabits per second of capacity and was later upgraded. The Kenyan government held a significant stake through the now-defunct Telkom Kenya. TEAMS proved that submarine cables could transform an economy, and its arrival was a landmark moment for the region.

## EASSy (Eastern Africa Submarine Cable System)

EASSy went live in 2010 and is owned by a consortium of telecom operators across Africa and beyond. The cable runs from South Africa up the east coast of Africa, landing at multiple countries including Kenya, before heading north to Djibouti and connecting onward to Europe via other cable systems. EASSy's consortium ownership model means that many African telecom companies hold shares, giving them direct access to capacity. The cable provides substantial bandwidth, typically cited in the range of several terabits per second, and serves more coastal countries than any other single cable in the region.

## SEA-ME-WE 5 (South East Asia-Middle East-Western Europe 5)

SEA-ME-WE 5 is part of a long-running series of cables connecting Southeast Asia, the Middle East, and Western Europe. It reached Mombasa around 2010 and is owned by an international consortium of major telecom operators from countries along the route, including China Telecom, France Telecom, and others. Unlike TEAMS and EASSy, which focus primarily on Africa, SEA-ME-WE 5 connects Kenya into a much larger global backbone stretching from Singapore through India, the Middle East, and around to Europe. This gives Kenyan internet users a direct high-capacity path to Asian and European internet hubs.

## DARE1 (Djibouti Africa Regional Express 1)

DARE1 is the newest cable serving Kenya, landing in 2022. It is owned by a consortium including Djibouti Telecom and other regional partners, with the Kenyan landing managed through local operators. DARE1 runs from Djibouti down to Mombasa and provides additional capacity specifically designed to serve the growing data centre and cloud market in East Africa. Its arrival was timely, coming just as Kenya's data centre industry was expanding rapidly with new facilities from Africa Data Centres, iXAfrica, and others. DARE1 adds redundancy and capacity that helps keep Kenya's international connectivity competitive.

## Why Four Cables Is Not Enough

Each additional cable reduces the risk of a total outage and increases competition among operators, which pushes down prices. However, industry analysts regularly warn that East Africa needs more cable diversity, particularly routes that avoid congested choke points in the Red Sea and Suez Canal area. New cable projects continue to be announced, ensuring that Kenya's connectivity will keep improving.""",
            "readingTimeMin": 7,
            "sortOrder": 2,
            "claims": [
                {
                    "claim": "TEAMS was the first submarine cable to land in Kenya in 2009, a joint venture between the Kenyan government and Etisalat (now e&), running from Fujairah, UAE to Mombasa.",
                    "source": "Kenyan government and Etisalat disclosures",
                    "confidence": "High"
                },
                {
                    "claim": "EASSy, operational since 2010, is owned by a consortium of African and international telecom operators and runs from South Africa along the east coast of Africa to Djibouti.",
                    "source": "EASSy consortium and WIOCC documentation",
                    "confidence": "High"
                },
                {
                    "claim": "DARE1 landed in Kenya in 2022, adding capacity for the growing East African data centre and cloud market.",
                    "source": "Djibouti Telecom and regional operator announcements",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "What Is KIXP?",
            "slug": "what-is-kixp",
            "tlDr": "KIXP is the Kenya Internet Exchange Point, operated by TESPOK, where local internet service providers connect directly to each other so that Kenyan web traffic stays in Kenya rather than travelling through submarine cables and back.",
            "description": "An explanation of what an Internet Exchange Point is, how KIXP works, who operates it, and why keeping local traffic local matters for speed, cost, and reliability.",
            "content": """## The Problem with Sending Traffic Overseas

Imagine you are in Nairobi using Safaricom mobile data and you send an email to a friend who uses Airtel. Without an internet exchange point, your email might travel from Safaricom's network in Nairobi, down a terrestrial fibre to Mombasa, out through a submarine cable to a data centre in Europe, and then back through another cable to Airtel's network in Nairobi. That round trip of thousands of kilometres adds latency, wastes expensive international bandwidth, and makes services slower than they need to be. KIXP was built to solve exactly this problem.

## What an Internet Exchange Point Does

An Internet Exchange Point (IXP) is a facility where multiple internet service providers and network operators physically connect their networks together. Instead of routing traffic through international links, two operators that are both present at the IXP can send data directly to each other across a local switch. The result is dramatically lower latency, reduced bandwidth costs, and better performance for local users. IXPs are a fundamental building block of the internet in every country that has one.

## KIXP: Kenya's Exchange Point

The Kenya Internet Exchange Point (KIXP) was established in the early 2000s and is operated by TESPOK, the Telecommunications Service Providers Association of Kenya. TESPOK is an industry body that brings together ISPs, telecom operators, content providers, and other stakeholders in the Kenyan internet ecosystem. KIXP is located in Nairobi, where most of the country's network operators and data centres are concentrated. At KIXP, operators like Safaricom, Telkom Kenya, Airtel, Liquid Intelligent Technologies, and many smaller ISPs all connect their networks.

## Why KIXP Matters for Kenya

KIXP's impact is significant. By keeping local traffic local, it reduces the load on Kenya's submarine cables, freeing up international capacity for traffic that genuinely needs to go overseas. This reduces costs for operators and ultimately for consumers. It also means that services like M-Pesa, local banking apps, government portals, and Kenyan news websites load faster because they do not need to transit through an international link. KIXP also attracts content providers. When companies like Google, Netflix, or Microsoft see a well-functioning IXP with many connected networks, they are more likely to place servers and caches in the country, further improving the local internet experience.

## Peering at KIXP

Operators connect to KIXP through peering agreements. Most participants use bilateral peering, where two operators agree to exchange traffic directly. Others use a route server, which automates the process. The technical details involve the Border Gateway Protocol (BGP), which is the routing language of the internet. KIXP provides the physical infrastructure: high-capacity switches, rack space, power, and cooling. Operators bring their own routers and connect with fibre or copper links. TESPOK manages the facility and sets the peering policies that all participants agree to follow.""",
            "readingTimeMin": 7,
            "sortOrder": 3,
            "claims": [
                {
                    "claim": "KIXP is operated by TESPOK (Telecommunications Service Providers Association of Kenya) and is located in Nairobi.",
                    "source": "TESPOK official website and public disclosures",
                    "confidence": "High"
                },
                {
                    "claim": "KIXP enables local internet service providers to exchange traffic directly within Kenya, avoiding unnecessary routing through submarine cables.",
                    "source": "Internet Society (ISOC) and Packet Clearing House IXP documentation",
                    "confidence": "High"
                },
                {
                    "claim": "Major operators connected to KIXP include Safaricom, Telkom Kenya, Airtel, and Liquid Intelligent Technologies.",
                    "source": "TESPOK member list and KIXP peering statistics",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "What Is Internet Peering?",
            "slug": "what-is-internet-peering",
            "tlDr": "Internet peering is when two networks agree to connect directly and exchange traffic without going through a third party. It makes the internet faster, cheaper, and more efficient for everyone involved.",
            "description": "A plain-language explanation of internet peering, how it differs from transit, why networks peer, and how peering works in practice at internet exchange points.",
            "content": """## The Internet Is a Network of Networks

The internet is not a single network. It is made up of thousands of separate networks, called Autonomous Systems, each operated by a different company or organisation. Safaricom runs one network, Google runs another, Telkom Kenya runs another, and so on. For these networks to work together as one internet, they need ways to connect and exchange traffic. That process of connecting and exchanging traffic is called peering.

## Transit versus Peering

There are two main ways networks connect. The first is transit, where a smaller network pays a larger one to carry its traffic to the rest of the internet. Think of it like paying a courier to deliver your packages anywhere in the world. The larger network charges for this service because it provides access to destinations the smaller network cannot reach directly. The second is peering, where two networks agree to connect directly and exchange traffic for free or at cost. Peering is like two neighbours agreeing to share a driveway so neither has to drive around the block to reach the other's house.

## Why Networks Agree to Peer

Peering makes economic sense for both sides. When two networks peer, they save money by not having to buy transit from a third party. They also reduce latency because traffic takes a shorter, more direct path. For networks with lots of traffic going between them, peering can save significant amounts of money and improve the experience for their customers. This is why large content providers like Google, Netflix, and Microsoft peer extensively at internet exchange points around the world.

## Where Peering Happens

Peering typically happens at internet exchange points (IXPs) like KIXP in Nairobi. An IXP provides a physical location where multiple networks can connect their routers to a shared switching fabric. When two networks peer, they configure their routers using the Border Gateway Protocol (BGP) to announce which IP addresses they can reach and accept announcements from the other network. This process is usually managed by network engineers from both sides and can take anywhere from a few days to a few weeks to set up.

## Peering in Kenya

In Kenya, peering is most visible at KIXP, where operators like Safaricom, Airtel, Telkom Kenya, Liquid Intelligent Technologies, and content providers interconnect. When a Safaricom customer visits a website hosted on a server in a Nairobi data centre that connects through Airtel's network, the traffic stays at KIXP rather than traveling internationally. This is peering in action. The more networks that peer at KIXP, the more local traffic stays local, making the internet faster and cheaper for everyone in Kenya.""",
            "readingTimeMin": 6,
            "sortOrder": 4,
            "claims": [
                {
                    "claim": "Peering allows two networks to exchange traffic directly without paying a transit provider, reducing both cost and latency.",
                    "source": "Internet Society (ISOC) peering guides and documentation",
                    "confidence": "High"
                },
                {
                    "claim": "Peering arrangements use the Border Gateway Protocol (BGP) to exchange routing information between connected networks.",
                    "source": "IETF RFC 4271 (BGP-4 specification) and networking textbooks",
                    "confidence": "High"
                },
                {
                    "claim": "KIXP enables peering among Kenyan operators including Safaricom, Airtel, Telkom Kenya, and Liquid Intelligent Technologies.",
                    "source": "TESPOK public peering statistics",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "Why Data Centres Need Fibre",
            "slug": "why-data-centres-need-fibre",
            "tlDr": "Data centres depend on fibre-optic connectivity to function. Without high-capacity, low-latency fibre links connecting them to submarine cables, internet exchanges, and end users, the servers inside are effectively isolated.",
            "description": "Explains why fibre-optic connectivity is the single most critical infrastructure requirement for data centres, covering capacity, latency, redundancy, and the real-world consequences of poor connectivity.",
            "content": """## A Data Centre Is Useless Without Connectivity

A data centre full of powerful servers is like a warehouse full of goods with no roads leading to it. The servers can process data, store information, and run applications, but if they cannot communicate with the outside world quickly and reliably, they serve no purpose. Fibre-optic connectivity is the road system that makes data centres useful. It is not an optional add-on; it is the reason data centres exist where they do.

## Speed and Capacity

Fibre-optic cables carry data as pulses of light through strands of glass. They can move enormous amounts of data over long distances with minimal signal loss. A single pair of fibres can carry hundreds of terabits per second using modern multiplexing techniques. For a data centre in Nairobi that needs to serve millions of internet users, stream video content, and host cloud applications, this capacity is essential. Copper cables and microwave links simply cannot match fibre for bandwidth, especially over the distances involved between landing stations and data centres.

## Latency Matters

Beyond raw capacity, fibre delivers low latency. When you stream a video on Netflix in Nairobi, every millisecond counts. If your request has to travel through a slow or congested link, you experience buffering and poor video quality. Fibre-optic connections between data centres, internet exchange points, and submarine cable landing stations keep round-trip times low, which means faster page loads, smoother video streaming, and more responsive applications. In financial services, where Kenyan banks execute trades and process M-Pesa transactions, low latency is not just about convenience but about accuracy and competitiveness.

## Redundancy Through Multiple Fibre Paths

No single fibre cable is completely safe from being cut. Backhoes dig into buried cables, fires damage aerial lines, and construction work accidentally severs underground ducts. This is why serious data centres insist on being connected by multiple independent fibre paths. In Kenya, the major data centres in Nairobi typically have connections from at least two different fibre operators, each running separate routes to the coast and to other domestic destinations. If one fibre route is cut, traffic automatically reroutes through the other, keeping services online.

## Real Examples in Kenya

Africa Data Centres' facility in Nairobi connects to multiple terrestrial fibre providers, ensuring it has diverse paths to the TEAMS, EASSy, SEA-ME-WE 5, and DARE1 submarine cables at Mombasa. iXAfrica's carrier-neutral model specifically emphasises connectivity diversity, giving customers the ability to choose from multiple fibre providers and connect to KIXP on-site. Without this fibre infrastructure, these data centres could not serve the Kenyan banks, mobile operators, and international content providers that depend on them.""",
            "readingTimeMin": 6,
            "sortOrder": 5,
            "claims": [
                {
                    "claim": "Major Nairobi data centres connect to multiple terrestrial fibre providers for redundancy against cable cuts.",
                    "source": "Africa Data Centres and iXAfrica facility disclosures",
                    "confidence": "High"
                },
                {
                    "claim": "A single pair of fibre-optic strands can carry hundreds of terabits per second using modern multiplexing techniques.",
                    "source": "ITU and optical networking industry standards",
                    "confidence": "High"
                },
                {
                    "claim": "Low-latency fibre connectivity between data centres, IXPs, and submarine cable landing stations is critical for financial services including M-Pesa transaction processing.",
                    "source": "Safaricom infrastructure disclosures and banking industry reports",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "What Is a CDN?",
            "slug": "what-is-a-cdn",
            "tlDr": "A Content Delivery Network (CDN) is a system of servers placed in multiple locations that stores copies of popular content closer to users, making websites, videos, and downloads load faster for everyone.",
            "description": "A clear explanation of how CDNs work, why companies like Netflix and YouTube use them, and how CDN nodes in Kenyan data centres speed up the internet for local users.",
            "content": """## The Problem CDNs Solve

Imagine a popular YouTube video that millions of people want to watch. If the video file is stored on a single server in California, every viewer worldwide must connect to that one server. Viewers in Kenya would experience long loading times because the data has to travel from California through multiple submarine cables and terrestrial networks before reaching them. A Content Delivery Network solves this by copying the video to servers that are geographically closer to viewers, so Kenyan users can load it from a local server instead of one thousands of kilometres away.

## How CDNs Work

A CDN consists of dozens or hundreds of servers placed in data centres around the world. When you request a webpage or video, the CDN's routing system directs you to the nearest server that has a copy of that content. This is called caching. The CDN constantly updates its cached copies to reflect the latest version of the content. Companies like Akamai, Cloudflare, Fastly, and Limelight operate large global CDNs that serve millions of websites and applications. Many large companies like Netflix and Google also run their own private CDNs alongside or instead of public CDN services.

## Netflix and YouTube in Kenya

Netflix operates its own CDN called Open Connect. Netflix places servers, called caching appliances, directly inside internet service provider networks and data centres around the world. When Netflix places a caching appliance in a Nairobi data centre, Kenyan Netflix subscribers can stream House of Cards or local content from that local server rather than from a server in Europe or South Africa. YouTube does something similar through Google's global cache infrastructure. When a Kenyan user watches a popular YouTube video, it is likely being served from a Google cache node located in or near a Kenyan data centre.

## Why CDNs Need Data Centres

CDN servers need to live somewhere, and that somewhere is data centres. CDN nodes require reliable power, cooling, physical security, and, crucially, high-capacity fibre connectivity to the internet backbone and to local networks. In Kenya, the presence of modern carrier-neutral data centres like those run by Africa Data Centres, iXAfrica, and PAIX makes it practical for CDN operators to place nodes in the country. The better the data centre infrastructure, the more attractive Kenya becomes as a location for CDN investment.

## The Impact on Kenyan Users

When CDNs have a local presence in Kenya, the benefits are immediate. Web pages load faster, video streams buffer less, and software downloads complete quicker. This is not just about convenience. Faster load times mean businesses can run more complex web applications, schools can access educational video content without frustrating delays, and the overall experience of using the internet in Kenya becomes comparable to that in countries with more mature internet infrastructure.""",
            "readingTimeMin": 6,
            "sortOrder": 6,
            "claims": [
                {
                    "claim": "Netflix operates its own CDN called Open Connect, placing caching appliances directly inside ISP networks and data centres.",
                    "source": "Netflix Open Connect documentation and peering policy",
                    "confidence": "High"
                },
                {
                    "claim": "CDN nodes require data centre facilities with reliable power, cooling, and high-capacity fibre connectivity.",
                    "source": "Akamai, Cloudflare, and industry infrastructure documentation",
                    "confidence": "High"
                },
                {
                    "claim": "Local CDN presence in Kenya reduces latency for video streaming and web content, improving the user experience.",
                    "source": "ISOC and regional internet performance studies",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "Why Netflix Needs Data Centres",
            "slug": "why-netflix-needs-data-centres",
            "tlDr": "Netflix relies on a global network of data centres and caching servers to deliver high-quality streaming video to millions of subscribers, and placing these servers closer to users in places like Kenya is essential for a good viewing experience.",
            "description": "Explains how Netflix's technical infrastructure works, from its core data centres to its Open Connect CDN, and why having servers in Kenyan data centres matters for local subscribers.",
            "content": """## Netflix Is a Data Centre Company

Netflix is often thought of as an entertainment company, but at its core it is an infrastructure company that moves enormous amounts of data. Netflix streams to over 260 million subscribers worldwide, and at peak hours it can account for a significant percentage of all internet traffic in a given country. Supporting this scale requires a sophisticated global infrastructure of data centres, content delivery systems, and peering arrangements that is every bit as complex as the infrastructure of any major cloud provider.

## Core Data Centres and Content Encoding

Netflix's journey starts in its core data centres, primarily located in the United States. This is where Netflix stores its entire library of movies and TV shows. When new content is added, it is encoded into multiple formats and resolutions, from standard definition up to 4K and HDR, to suit different devices and connection speeds. This encoding and storage happens in massive data centre facilities with thousands of servers and petabytes of storage. The result is a library that can be delivered efficiently to any device, anywhere in the world.

## Open Connect: Netflix's Private CDN

To get content from its core data centres to viewers around the world, Netflix uses a system called Open Connect. Netflix builds and deploys its own caching servers, known as Open Connect Appliances (OCAs), and places them directly inside internet service provider networks and data centres in over 190 countries. These appliances store copies of the most popular Netflix content locally. When a subscriber in Nairobi clicks play, the video streams from an OCA located in or near a Kenyan data centre rather than from a server in the United States. This dramatically reduces load times and improves streaming quality.

## Why Local Placement Matters in Kenya

Kenyan internet users typically connect through submarine cables to international destinations, which adds latency. If every Netflix stream had to come from the US or Europe, buffering would be frequent and the experience would be poor. By placing OCAs in Kenyan data centres that have good connectivity to local ISPs and to KIXP, Netflix ensures that the most popular titles are available locally with minimal latency. This is only possible because Kenya has suitable data centre facilities with reliable power, cooling, and diverse fibre connectivity.

## Peering and Bandwidth

Netflix also relies on peering agreements to keep costs manageable. Rather than paying for expensive transit through international carriers, Netflix peers directly with ISPs at internet exchange points like KIXP. This means Netflix traffic can flow directly from its caching servers to ISP networks without paying intermediaries, making it economically viable for Netflix to serve Kenyan subscribers even though the market is smaller than those in the US or Europe.""",
            "readingTimeMin": 6,
            "sortOrder": 7,
            "claims": [
                {
                    "claim": "Netflix operates Open Connect Appliances in over 190 countries, placing caching servers directly inside ISP networks and data centres.",
                    "source": "Netflix Open Connect documentation and public deployment maps",
                    "confidence": "High"
                },
                {
                    "claim": "Netflix's core content storage and encoding happens in large data centre facilities primarily located in the United States.",
                    "source": "Netflix technology blog and engineering presentations",
                    "confidence": "High"
                },
                {
                    "claim": "Netflix uses internet exchange point peering, such as at KIXP, to deliver content directly to local ISPs without paying transit providers.",
                    "source": "Netflix peering policy and TESPOK peering records",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "Why Google Needs Data Centres",
            "slug": "why-google-needs-data-centres",
            "tlDr": "Google operates one of the world's largest data centre footprints to support Search, YouTube, Gmail, Google Cloud, and Android, and the availability of local data centre infrastructure in Kenya directly affects the performance of these services.",
            "description": "Explains Google's global data centre strategy, its regional edge presence, and how having infrastructure in or near Kenya improves services like Search, YouTube, and Google Cloud for East African users.",
            "content": """## The Scale of Google's Infrastructure

Google runs one of the largest and most sophisticated data centre networks on the planet. Its infrastructure supports Search, YouTube, Gmail, Google Cloud Platform, Google Maps, Android app stores, and dozens of other services used by billions of people. Google does not disclose the exact number of its data centres, but industry estimates put the number at over 30 major facilities spread across North America, Europe, Asia, and South America. Each facility can contain tens of thousands of servers, massive cooling systems, and its own power substation.

## How Google Uses Data Centres

Every Google search you perform, every YouTube video you watch, and every email you send through Gmail is processed and stored in Google's data centres. Google's search index alone is petabytes in size and is replicated across multiple facilities for redundancy and speed. When you search from Kenya, your query typically goes to the nearest Google data centre that can serve it. The closer that data centre is to you, the faster the results appear. This is why Google has invested in building data centres and edge caching nodes in regions around the world.

## Regional Presence and Edge Caching

While Google's largest data centres are in the US and Europe, the company also deploys smaller facilities called edge nodes or cache clusters in many countries. These edge nodes store copies of the most frequently accessed content, such as popular YouTube videos, cached search results, and static assets for Google services. In Africa, Google has invested in infrastructure in South Africa, with caching nodes deployed in several countries including Kenya. These nodes are typically hosted in local data centres or in Google-controlled facilities and connect to local ISPs through peering arrangements.

## Impact on Kenyan Users

For a Google user in Nairobi, the experience depends heavily on how close Google's infrastructure is. A YouTube video served from a local cache node loads quickly, while one that must be fetched from a data centre in Europe takes longer. Google Search results appear faster when they come from a nearby cache. Google Cloud Platform customers in Kenya experience lower latency when Google has regional infrastructure. The improvement in Kenyan internet performance over the past decade is partly due to Google and other content providers placing caching infrastructure in local data centres.

## Google Cloud in Africa

Google Cloud Platform has expanded its African presence, with a cloud region in South Africa that serves the broader continent. Kenyan businesses using Google Cloud for their applications benefit from this regional presence, though the distance between Johannesburg and Nairobi still adds latency compared to a hypothetical future Kenyan cloud region. As Kenya's data centre industry matures, there is ongoing speculation about whether major cloud providers might establish a more local presence.""",
            "readingTimeMin": 6,
            "sortOrder": 8,
            "claims": [
                {
                    "claim": "Google operates over 30 major data centre facilities worldwide, with additional edge caching nodes in many countries.",
                    "source": "Google public disclosures and data centre community estimates",
                    "confidence": "High"
                },
                {
                    "claim": "Google Cloud Platform has a cloud region in South Africa that serves the broader African continent, including Kenya.",
                    "source": "Google Cloud region documentation",
                    "confidence": "High"
                },
                {
                    "claim": "Google deploys YouTube and Search caching nodes in local data centres across Africa to reduce latency for regional users.",
                    "source": "Google infrastructure blog and regional peering announcements",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "Why Cloud Services Need Local Infrastructure",
            "slug": "why-cloud-services-need-local-infrastructure",
            "tlDr": "Cloud services from providers like AWS, Microsoft Azure, and Google Cloud perform better and are more reliable when they have infrastructure close to their users, which is why the quality of local data centres and connectivity in Kenya matters for the country's cloud economy.",
            "description": "Explains why cloud providers need local or regional infrastructure, how latency and data sovereignty affect cloud service quality, and what Kenya's growing data centre industry means for local cloud adoption.",
            "content": """## The Cloud Is Not in the Sky

The term cloud computing is convenient but misleading. The cloud is actually a vast network of data centres owned and operated by companies like Amazon Web Services (AWS), Microsoft Azure, Google Cloud, and others. When a Kenyan business runs its accounting software on AWS, its data is stored on servers in a physical data centre somewhere in the world. The distance between that data centre and the business's users has a direct impact on how well the service performs.

## Latency: The Distance Penalty

Every kilometre between a user and a cloud server adds a small but measurable delay, called latency. Light travels through fibre at roughly 200 kilometres per millisecond. A round trip from Nairobi to a data centre in Frankfurt, Germany is roughly 12,000 kilometres, adding at least 60 milliseconds of pure propagation delay, plus processing time at each hop along the way. For many applications this delay is acceptable, but for real-time applications like video conferencing, online gaming, financial trading, or interactive web applications, it can be a serious problem. Local infrastructure eliminates this distance penalty.

## Data Sovereignty and Compliance

Many countries have laws that require certain types of data to be stored within their borders. Kenya's Data Protection Act, modelled on the European GDPR, places requirements on how personal data is handled, and many organisations prefer or are required to keep data within the country or at least within the East African region. If Kenyan banks, hospitals, or government agencies store their data in US-based data centres, they may face compliance risks. Having local or regional cloud infrastructure makes it easier for these organisations to adopt cloud services while meeting their legal obligations.

## What Local Infrastructure Looks Like

For cloud providers, local infrastructure can mean different things. A full cloud region, like AWS has in South Africa (Cape Town), is a major investment with multiple data centres offering the full range of cloud services. A smaller presence might be an edge location for content delivery or a Direct Connect point that gives customers a dedicated link to a distant cloud region. In Kenya, cloud providers work through local data centre operators, placing equipment in facilities run by Africa Data Centres, Liquid Intelligent Technologies, or iXAfrica, and connecting to local networks through KIXP and peering arrangements.

## The Growing Opportunity

Kenya's data centre industry is positioning the country as a regional cloud hub. As more Kenyan businesses migrate to the cloud, the demand for local infrastructure grows. Banks running core banking on cloud platforms, government agencies digitising services, and tech startups building applications all benefit from having cloud infrastructure closer to their users. The continued development of Kenyan data centres and submarine cable connectivity is directly linked to the country's ability to participate in the global cloud economy.""",
            "readingTimeMin": 6,
            "sortOrder": 9,
            "claims": [
                {
                    "claim": "A round trip from Nairobi to a Frankfurt data centre adds at least 60 milliseconds of propagation delay, plus processing overhead at each hop.",
                    "source": "Network latency calculations based on fibre-optic speed of light propagation",
                    "confidence": "High"
                },
                {
                    "claim": "AWS operates a full cloud region in Cape Town, South Africa, serving the broader African continent including Kenya.",
                    "source": "AWS regional infrastructure documentation",
                    "confidence": "High"
                },
                {
                    "claim": "Kenya's Data Protection Act places requirements on personal data handling that influence cloud infrastructure decisions for local organisations.",
                    "source": "Kenya Data Protection Act 2019 and Office of the Data Protection Commissioner guidance",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "What Happens When a Submarine Cable Breaks?",
            "slug": "what-happens-when-a-submarine-cable-breaks",
            "tlDr": "When a submarine cable is damaged, internet traffic reroutes through other cables, but speeds can slow significantly. Kenya has experienced real cable breaks that caused noticeable disruptions, highlighting why cable diversity matters.",
            "description": "Explains what causes submarine cable breaks, what happens to internet traffic when one occurs, real incidents that affected Kenya, and why having multiple cables is essential for resilience.",
            "content": """## Cables Get Cut More Often Than You Think

Submarine cables are remarkably reliable, but they do get damaged. The most common cause is human activity: fishing trawlers dragging anchors or nets across the sea floor, ships dropping anchor in cable zones, and underwater construction or dredging. Natural causes include underwater landslides, earthquakes, and strong ocean currents that expose cables on the seabed. The International Cable Protection Committee estimates that there are over 100 cable faults worldwide each year, though most are repaired within weeks.

## What Happens to Internet Traffic

When a submarine cable breaks, the internet does not go dark. Traffic that was flowing through the damaged cable is rerouted through other available cables. This is possible because the internet is designed to be resilient, with multiple paths between any two points. However, rerouting has consequences. The remaining cables must carry the extra load, which can lead to congestion and slower speeds for everyone. Latency may increase as traffic takes longer alternative routes. In the worst case, if multiple cables are damaged simultaneously or if a country has very few cables, the rerouted traffic may exceed available capacity and some services become unreachable.

## Real Incidents Affecting Kenya

Kenya has experienced several notable cable disruptions. In March 2012, the SEACOM cable experienced a fault that affected connectivity across East Africa for several days. The TEAMS cable has suffered multiple outages, including a significant incident in 2012 when the cable was damaged near the Kenyan coast. In 2020, the SEA-ME-WE 4 cable, which serves nearby regions, experienced a major outage that caused significant disruption across East Africa and the Middle East. More recently, in early 2024, damage to cables in the Red Sea raised alarms about the vulnerability of the submarine cable routes that serve East Africa. Each of these incidents caused measurable slowdowns for Kenyan internet users.

## The Repair Process

Repairing a submarine cable is a complex and expensive operation. First, the cable operator must identify the approximate location of the fault using signal analysis. Then a specialised cable repair vessel is dispatched. These ships carry remotely operated vehicles (ROVs) that can dive to the ocean floor, locate the damaged section, and either splice in a new segment or repair the break. The repair process can take anywhere from a few days to several weeks, depending on the water depth, weather conditions, and how quickly a repair vessel can reach the site.

## Why Diversity Is Kenya's Best Defence

The most effective defence against cable breaks is having multiple independent cables. With four submarine cables serving Kenya (TEAMS, EASSy, SEA-ME-WE 5, and DARE1), traffic can usually be rerouted when one is damaged. However, not all cables follow completely independent routes. Some share similar paths near the coast or in the Red Sea, which means a single event could potentially damage more than one cable. This is why ongoing investment in new cable routes, such as the 2Africa cable which is expected to serve the region, is so important for Kenya's internet resilience.""",
            "readingTimeMin": 7,
            "sortOrder": 10,
            "claims": [
                {
                    "claim": "The International Cable Protection Committee estimates over 100 submarine cable faults occur worldwide each year.",
                    "source": "International Cable Protection Committee (ICPC) annual fault reports",
                    "confidence": "High"
                },
                {
                    "claim": "In early 2024, damage to submarine cables in the Red Sea raised concerns about connectivity vulnerabilities for East Africa.",
                    "source": "Major news outlets including Reuters and BBC reporting on Red Sea cable incidents",
                    "confidence": "High"
                },
                {
                    "claim": "Submarine cable repairs use specialised vessels with remotely operated vehicles (ROVs) and can take from days to weeks to complete.",
                    "source": "Submarine cable industry repair documentation and operator reports",
                    "confidence": "High"
                }
            ]
        },
    ]

    print(f"Seeding {len(articles)} Internet articles...")

    article_sql = """INSERT OR IGNORE INTO Article (id, title, slug, tlDr, description, cluster, content, readingTimeMin, sortOrder, status, lastVerified, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))"""

    claim_sql = """INSERT OR IGNORE INTO ArticleClaim (id, claim, source, sourceTitle, confidence, notes, articleId, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))"""

    total_claims = 0
    for i, art in enumerate(articles, 1):
        art_id = new_id(cur)
        last_verified = "2025-01-01"

        cur.execute(article_sql, (
            art_id,
            art["title"],
            art["slug"],
            art["tlDr"],
            art["description"],
            "Internet",
            art["content"],
            art["readingTimeMin"],
            art["sortOrder"],
            "Published",
            last_verified,
        ))

        if cur.rowcount == 0:
            print(f"  [{i}/{len(articles)}] SKIPPED (already exists): {art['title']}")
            continue

        print(f"  [{i}/{len(articles)}] Inserted: {art['title']}")

        for j, clm in enumerate(art["claims"], 1):
            claim_id = new_id(cur)
            cur.execute(claim_sql, (
                claim_id,
                clm["claim"],
                clm.get("source"),
                clm.get("sourceTitle"),
                clm.get("confidence", "Medium"),
                clm.get("notes"),
                art_id,
            ))
            total_claims += 1

    conn.commit()
    print(f"\nDone. Inserted articles and {total_claims} claims.")
    conn.close()


if __name__ == "__main__":
    main()
