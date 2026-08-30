---
title: "What Is a Data Centre? A Plain-Language Guide for Beginners"
slug: "what-is-a-data-centre"
meta_description: "A data centre is a specialised building that houses thousands of computers processing, storing, and transmitting the data behind every app, website, and digital service you use."
primary_keyword: "what is a data centre"
secondary_keywords:
  - "how do data centres work"
  - "data centre components explained"
  - "types of data centres"
  - "data centre basics Kenya"
  - "server room vs data centre"
author: "Kevin Jonathan Onyango Otieno"
author_bio_link: "/about"
published_date: "2026-08-25"
updated_date: "2026-08-27"
category: "Data Centres"
cluster: "Beginner"
og_image: "/images/hero-server-hall.webp"
reading_time: "10 min"
images:
  - src: "/images/dc-servers-racks.png"
    alt: "Server racks inside a modern data centre"
    caption: "A single data centre can house thousands of servers in rows of racks, each processing and storing data 24 hours a day"
    position: "hero"
  - src: "/images/dc-power-systems.webp"
    alt: "Data centre power distribution systems"
    caption: "Power is the backbone of any data centre — UPS systems, generators, and PDUs ensure uninterrupted electricity supply"
    position: "section-break"
  - src: "/images/dc-cooling-crac-2.webp"
    alt: "Precision cooling systems inside a data centre"
    caption: "Cooling accounts for up to 40% of a data centre's total energy consumption"
    position: "inline"
  - src: "/images/mombasa-cable-landing.webp"
    alt: "Network cabling connecting server racks"
    caption: "Structured cabling connects thousands of servers to each other and to the outside internet via fibre optic links"
    position: "inline"
  - src: "/images/dc-biometric-access-4.webp"
    alt: "Data centre physical security systems"
    caption: "Tier III and IV facilities use biometric access, 24/7 CCTV, mantraps, and on-site security personnel"
    position: "inline"
  - src: "/images/diagram-network-rack-components.webp"
    alt: "Labelled diagram of network rack components from router to PDU"
    caption: "A standard network rack chains router, firewall, switches, servers, and UPS power backup into one complete signal flow — the building block of every data centre hall."
    position: "diagram"

internal_links:
  - text: "Kenya's data centre licensing framework"
    href: "/articles/kenya-data-centre-licensing-framework"
  - text: "data centre careers in Kenya"
    href: "/careers"
  - text: "energy challenges facing data centres"
    href: "/energy"
external_sources:
  - title: "Uptime Institute"
    url: "https://uptimeinstitute.com/"
  - title: "Schneider Electric Data Centre Reference Designs"
    url: "https://www.se.com/ww/en/work/products-services/offerings/data-centers/"
faq:
  - question: "What is the difference between a server room and a data centre?"
    answer: "A server room is a small, on-premises space — often a converted closet or office — that houses a handful of servers for one organisation. A data centre is a purpose-built or retrofitted facility designed to house hundreds or thousands of servers for multiple organisations, with redundant power, cooling, networking, and security systems that a server room cannot match."
  - question: "How many servers are in a typical data centre?"
    answer: "It varies enormously. A small colocation facility might host 200 to 500 servers. A hyperscale facility like those operated by Google, Microsoft, or Amazon can house 50,000 to 100,000+ servers. Kenya's largest facility, iXAfrica NBOX1.1, is designed to support significant capacity in its 4.5 megawatt IT load."
  - question: "Why are data centres important for Kenya?"
    answer: "Data centres are the physical infrastructure behind every digital service — M-Pesa, banking apps, government services like e-Citizen, streaming platforms, and cloud services. Without local data centres, every request would have to travel to Europe or South Africa, adding latency and cost. Kenya's data centres keep data local, improve speed, and attract foreign investment in the digital economy."
  - question: "What is a Tier III data centre?"
    answer: "Tier III means the facility has redundant power and cooling systems (N+1 minimum), so any single component can fail without causing downtime. It guarantees 99.982% availability — no more than 1.6 hours of downtime per year. Most commercial data centres in Nairobi target Tier III certification, which is the standard enterprises require."
  - question: "How much electricity does a data centre use?"
    answer: "A typical large data centre consumes 20 to 50 megawatts — comparable to a small town. Kenya's entire data centre industry currently uses about 15 megawatts of IT power, but this is expected to reach 25 megawatts by 2030. Power is the single biggest operating cost and the primary constraint on growth."
canonical_url: "https://data-centers-254.vercel.app/articles/what-is-a-data-centre"
---

A data centre is a specialised building — or purpose-designed space within a building — that houses thousands of networked computers called servers. These servers process, store, and transmit the data behind every app, website, streaming service, and digital payment system you use. When you send money on M-Pesa, search Google, or stream a YouTube video, a data centre is doing the work. Every single time.

Think of a data centre as a factory for data. Instead of assembling physical products, it processes information at massive scale, 24 hours a day, 365 days a year. The computers inside never sleep. The power never stops. The cooling never turns off. Everything about a data centre is designed for one purpose: to keep servers running reliably and efficiently, no matter what.

## The Core Components of a Data Centre

A data centre is far more than a room full of computers. It is an integrated system of interconnected infrastructure, each component depending on the others. Remove any one of these systems and the entire facility stops functioning.

![Labelled diagram of network rack components from router to PDU](/images/diagram-network-rack-components.webp)

### Servers and Storage

Servers are the heart of any data centre. A single modern rack (the metal frame that holds the equipment) can contain 40 to 80 servers stacked vertically. Each server is essentially a powerful computer without a screen or keyboard — it exists to process requests and store data. Large facilities contain hundreds of racks, meaning tens of thousands of individual servers. Storage systems, often arrays of hard drives or solid-state drives, hold the actual data — databases, files, images, videos, application code.

![Server racks inside a modern data centre](/images/dc-servers-racks.png)

### Power Systems

Data centres consume enormous amounts of electricity. A single rack might draw 5 to 10 kilowatts. A facility with 200 racks could need 1 to 2 megawatts just for the servers — before adding cooling and other systems. The power infrastructure includes utility feeds from the national grid, [uninterruptible power supplies (UPS)](/energy) that provide instant backup during outages, diesel generators for extended outages, and power distribution units (PDUs) that deliver clean, stable electricity to every rack.

![Data centre power distribution and backup systems](/images/dc-power-systems.webp)

### Cooling Systems

Servers generate heat — lots of it. A rack drawing 10 kilowatts produces as much heat as ten space heaters running continuously. If the temperature inside a server room rises above about 27 degrees Celsius, servers will throttle their performance or shut down entirely to prevent damage. Cooling systems, which can account for up to 40% of a facility's total energy consumption, use precision air conditioning (CRAC units), hot and cold aisle containment, and increasingly, liquid cooling to remove heat from the server environment.

![Precision cooling systems maintain optimal server temperatures](/images/dc-cooling-crac-2.webp)

### Networking

Data centres need to connect to the outside world. This happens through fibre optic cables — typically multiple redundant links from different providers — that connect to [internet exchange points](/infrastructure) like KIXP in Nairobi, and through submarine cables that link Kenya to the rest of the world. Inside the facility, structured cabling connects every server and storage system to switches and routers that direct traffic between them and to the outside internet.

![Network cabling connects thousands of servers to each other](/images/mombasa-cable-landing.webp)

### Security

Physical security is a critical differentiator. Enterprise data centres use multiple layers: perimeter fencing, 24/7 CCTV surveillance, biometric access control (fingerprint, iris, or facial recognition), mantraps (single-person entry portals), and on-site security personnel. The goal is to ensure that only authorised personnel can physically access the servers. This matters because the data stored inside — financial records, personal information, government databases — is valuable and sensitive.

![Data centre security includes biometrics, CCTV, and mantraps](/images/dc-biometric-access-4.webp)

## Types of Data Centres

Not all data centres are the same. The industry recognises several distinct types, each serving different purposes and operated by different kinds of organisations.

**Enterprise data centres** are owned and operated by a single organisation for its own use. Banks, telecom companies, and large government agencies typically run their own enterprise facilities. Safaricom and Telkom Kenya, for example, operate data centres to support their mobile network and enterprise services.

**Colocation data centres** (often shortened to "colo") are commercial facilities where multiple organisations rent space — from a single rack to a dedicated cage or private suite. The colocation provider supplies the power, cooling, networking, and physical security, while the customer provides and manages their own servers. [Africa Data Centres](/directory) and iXAfrica both operate significant colocation facilities in Nairobi.

**Hyperscale data centres** are massive facilities, typically 10,000 square metres or more, built by or for the world's largest cloud and internet companies — Google, Microsoft, Amazon Web Services, Meta. These facilities are designed for efficiency at enormous scale, often in locations where power is cheap and climate conditions reduce cooling costs. Kenya's planned iXAfrica NBOX1.1 is East Africa's first facility designed to hyperscale standards.

**Edge data centres** are smaller facilities located closer to end users, often in cities or neighbourhoods, designed to reduce latency for applications that require real-time response — things like autonomous vehicles, IoT systems, and 5G networks. While still emerging in Africa, edge computing is expected to grow as connectivity improves.

## Tier Ratings: Measuring Reliability

The Uptime Institute's Tier classification system is the industry standard for rating data centre reliability. It defines four levels of infrastructure redundancy:

- **Tier I (Basic)**: No redundancy. A single power or cooling failure can cause downtime. Suitable for small businesses with non-critical workloads.

- **Tier II (Redundant Components)**: Some redundant components (N+1), but still a single distribution path. Slightly better availability than Tier I.

- **Tier III (Concurrently Maintainable)**: Redundant power and cooling with multiple distribution paths. Any single component can be removed for maintenance without causing downtime. Guarantees 99.982% availability (maximum 1.6 hours downtime per year). This is the standard most commercial facilities in Nairobi target.

- **Tier IV (Fault Tolerant)**: Fully redundant with 2(N+1) or greater redundancy. Designed to withstand any single failure without impact. Guarantees 99.995% availability (maximum 26 minutes downtime per year). Only the most critical facilities — military, financial trading, healthcare — justify the cost of Tier IV.

## Why Data Centres Matter for Kenya

Kenya's economy is increasingly digital. M-Pesa processes transactions worth billions of shillings daily. Government services are moving online through e-Citizen and Huduma Centres. Banks, fintech companies, and mobile network operators all depend on data centre infrastructure to serve their customers. Without local data centres, every digital transaction in Kenya would have to be processed in a facility in Europe, South Africa, or the Middle East — adding hundreds of milliseconds of latency and significant cost.

Kenya also has a structural advantage. The [submarine cables landing in Mombasa](/infrastructure) give the country direct connectivity to Europe, Asia, and the rest of Africa. This makes Nairobi an attractive location for data centres serving not just Kenya, but the broader East and Central African market of over 300 million people.

The government's National Digital Superhighway Programme, the planned Microsoft-G42 AI data centre (currently stalled over power supply constraints), and the expansion of existing facilities by Africa Data Centres and iXAfrica all point to rapid growth. Understanding [Kenya's data centre licensing framework](/articles/kenya-data-centre-licensing-framework) is essential for anyone considering operating or investing in this space.

For those interested in working in this industry, [data centre careers in Kenya](/careers) span roles from facility engineers and network architects to cooling specialists and compliance managers — positions that most Kenyans have never heard of but that are critical to the country's digital future.
