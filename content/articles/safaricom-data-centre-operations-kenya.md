---
title: "Safaricom Data Centres: Powering M-Pesa, 5G, and Kenya's Digital Economy"
slug: "safaricom-data-centre-operations-kenya"
meta_description: "Safaricom operates Kenya's most critical data centre, supporting M-Pesa, mobile network infrastructure, and enterprise cloud services. Now partnering with Microsoft and G42 on a planned $1 billion AI facility."
primary_keyword: "Safaricom data centre"
secondary_keywords:
  - "Safaricom M-Pesa infrastructure"
  - "Safaricom cloud services"
  - "Microsoft G42 Kenya data centre"
  - "Safaricom 5G infrastructure"
  - "enterprise data centre Kenya"
author: "Kevin Jonathan Onyango Otieno"
author_bio_link: "/about"
published_date: "2026-08-29"
updated_date: "2026-08-29"
category: "Operators"
cluster: "Kenya"
og_image: "/images/nairobi-westlands.webp"
reading_time: "13 min"
images:
  - src: "/images/dc-server-chip-3.webp"
    alt:  "CPU seated in a motherboard socket"
    caption: "Safaricom's data centre infrastructure underpins M-Pesa and Kenya's mobile network"
    position: "hero"
  - src: "/images/dc-challenges.webp"
    alt:  "Transmission tower beside a commercial high-rise"
    caption: "Safaricom's Waiyaki Way facility is a cornerstone of Nairobi's digital infrastructure"
    position: "section-break"
  - src: "/images/diagram-telecom-mast-anatomy.webp"
    alt:  "Labelled anatomy of a telecommunications mast"
    caption: "From panel antennas to GPS timing and feeder cables, every element on a mast exists to keep mobile traffic flowing toward the core — and M-Pesa never sleeps."
    position: "diagram"

internal_links:
  - text: "data centre directory"
    href: "/directory"
  - text: "Kenya power infrastructure"
    href: "/articles/kenya-power-infrastructure-data-centres"
  - text: "AI data centres in East Africa"
    href: "/articles/ai-data-centres-east-africa"
external_sources:
  - title: "Safaricom Annual Report"
    url: "https://safaricom.co.ke/about/media-center/annual-reports"
  - title: "Safaricom Official Website"
    url: "https://safaricom.co.ke"
faq:
  - question: "Does Safaricom offer colocation services?"
    answer: "Safaricom's data centre is primarily for internal use, supporting M-Pesa, mobile network core, and Safaricom Cloud services. It is not carrier-neutral and does not actively market third-party colocation, unlike iXAfrica or Africa Data Centres."
  - question: "What is the Microsoft-G42 partnership with Safaricom?"
    answer: "In 2024, Microsoft and UAE-based G42 announced a $1 billion AI data centre project in Kenya, with Safaricom named as the local partner. The facility would be the largest single foreign direct investment in Kenya's digital infrastructure. However, the project is currently stalled due to grid power capacity constraints, as Kenya Power cannot deliver the required 100+ MW at a single site."
canonical_url: "https://data-centers-254.vercel.app/articles/safaricom-data-centre-operations-kenya"
---

Safaricom is not a data centre company. It is Kenya's largest telecommunications operator, serving over 30 million mobile subscribers and generating revenue exceeding KES 300 billion annually. Yet within its portfolio sits what is arguably the single most critical data centre in East Africa: a Tier III facility on Waiyaki Way in Nairobi that processes over KES 20 trillion in M-Pesa transactions each year, hosts the core of Kenya's 4G and 5G mobile networks, and underpins an expanding portfolio of enterprise cloud services. No other data centre in the region carries this level of systemic importance to a national economy.

![CPU seated in a motherboard socket](/images/dc-server-chip-3.webp)

This profile examines Safaricom's data centre operations, the workloads they support, the company's role in Kenya's emerging AI infrastructure ecosystem, and how its facility strategy differs fundamentally from the carrier-neutral operators entering the Kenyan market.

## Safaricom's Position in Kenya's Digital Ecosystem

To understand Safaricom's data centre strategy, you must first understand what Safaricom is. The company is a vertically integrated telecommunications and digital services provider with a market share of approximately 65% among Kenya's mobile subscribers. Its M-Pesa mobile money platform alone processes transactions equivalent to roughly half of Kenya's GDP, making it not just a commercial service but a piece of national critical infrastructure comparable to the payment rails of a central bank.

Safaricom's business has evolved significantly beyond voice and SMS. The company now operates across mobile voice and data, M-Pesa financial services, enterprise and cloud services (Safaricom Cloud), fixed-line broadband, and a growing fibre-to-the-home segment. Each of these business lines generates substantial compute, storage, and network infrastructure demands that must be served from within Kenya, both for latency reasons and to comply with data localisation requirements under Kenya's Data Protection Act.

This is the fundamental difference between Safaricom and a carrier-neutral colocation provider like iXAfrica or Africa Data Centres. Those companies build facilities and sell capacity to multiple tenants. Safaricom builds facilities to serve its own workload first and foremost. Its data centre exists because its business requires it, not because operating data centres is the business itself.

## The Waiyaki Way Data Centre: Specifications and Role

Safaricom's primary data centre facility is located along Waiyaki Way in Nairobi's Westlands area. The facility holds a Tier III certification from the Uptime Institute, meaning it is designed to be concurrently maintainable with no single points of failure in the power and cooling distribution paths. This is the same reliability standard that major enterprise customers expect from commercial colocation providers, and Safaricom has invested in meeting it because the cost of downtime to M-Pesa alone would be measured in billions of shillings per hour.

Key specifications of the Waiyaki Way facility include:

- **Tier classification:** Tier III (Uptime Institute certified)
- **IT power capacity:** approximately 1.5 MW
- **Rack capacity:** approximately 120 racks
- **Cooling:** precision air conditioning with N+1 redundancy
- **Power backup:** diesel generators with on-site fuel storage, UPS systems for seamless switchover
- **Connectivity:** direct access to Safaricom's extensive terrestrial fibre backbone
- **Security:** multi-layered physical security including biometric access controls, CCTV surveillance, and on-site security personnel

At 1.5 MW and 120 racks, the Waiyaki Way facility is modest by comparison to the hyperscale facilities being developed by iXAfrica (targeting 16 MW across its campus) or Africa Data Centres (planning 30 MW at its Mzansi campus). But raw capacity is not the metric that matters here. What matters is the criticality of the workloads running inside those 120 racks.

![Transmission tower beside a commercial high-rise](/images/dc-challenges.webp)

## Workloads: M-Pesa, Mobile Network Core, and Enterprise Cloud

The Waiyaki Way data centre supports three primary workload categories, each of which would justify a dedicated facility on its own.

![Labelled anatomy of a telecommunications mast](/images/diagram-telecom-mast-anatomy.webp)

### M-Pesa Transaction Processing

M-Pesa is the dominant mobile money platform in Kenya, with over 51 million active customers across seven countries. In Kenya alone, the platform processes transactions valued at more than KES 20 trillion annually. Every single one of those transactions requires real-time authentication, ledger updates, and settlement processing. The M-Pesa platform runs on a distributed architecture, but the core transaction processing and database layers are housed within Safaricom's Waiyaki Way facility.

The physical closeness of those systems is what makes the service feel instant. When a subscriber checks a balance or sends money, the request travels from the handset to the network core and into the Waiyaki Way facility, and a response comes back before the person holding the phone has registered a delay. The figure sometimes quoted — that a full M-Pesa round trip completes in under two seconds — is an estimate, not a published specification: Safaricom does not release a formal USSD latency service-level target, so DC254 derives this range from reported USSD session behaviour and typical transaction throughput during peak periods. Treat it as an order-of-magnitude answer to the question "how fast is fast enough to move half of Kenya's GDP" rather than an audited number. Our methodology page explains how estimates like this are handled and labelled, and how they differ from the verified figures in the DC Directory.

The reliability requirements are extraordinary. M-Pesa operates effectively as Kenya's primary payments infrastructure. A prolonged outage would not just inconvenience Safaricom's customers; it would halt commerce across the country, from informal sector traders in Nairobi's markets to salary disbursements for millions of employed Kenyans. This is why Safaricom has invested in Tier III redundancy and maintains robust disaster recovery capabilities, including secondary sites that can assume the primary processing role in the event of a facility-level failure.

### Mobile Network Core: 4G LTE and 5G

Safaricom's mobile network core, the intelligence layer that manages subscriber authentication, session control, policy enforcement, and handover between cell sites, runs from the Waiyaki Way data centre. With over 4,000 base stations across Kenya and an expanding 5G footprint that now covers parts of Nairobi, Mombasa, and Kisumu, the network core must process millions of signalling messages and bearer sessions every second.

The 5G rollout has added new demands on the facility. 5G network functions, particularly in the core network, are increasingly containerised and deployed using cloud-native architectures. This has driven Safaricom to modernise its data centre infrastructure to support Kubernetes orchestration, software-defined networking, and distributed storage systems that were not part of the original facility design. The transition from traditional 3G/4G network functions running on dedicated hardware to virtualised and containerised network functions is a multi-year programme that touches every layer of the data centre stack.

### Safaricom Cloud and Enterprise Services

Safaricom has been building an enterprise services business that directly competes with global cloud providers and local IT companies. Safaricom Cloud offers infrastructure-as-a-service, platform-as-a-service, and software-as-a-service products to Kenyan enterprises, with the value proposition of local data residency, low latency, and integration with Safaricom's network infrastructure.

Enterprise customers using Safaricom Cloud benefit from data localisation, a requirement under the Kenya Data Protection Act for certain categories of personal data. Hosting workloads within Safaricom's facility, rather than routing them to cloud regions in South Africa or Europe, reduces latency for local users and ensures regulatory compliance. Key enterprise customers include banks, county governments, and large corporations that need local infrastructure with the reliability guarantees that only a Tier III facility can provide.

## Not Carrier-Neutral: A Deliberate Strategic Choice

One of the most important distinctions about Safaricom's data centre is what it is not: it is not carrier-neutral. Unlike iXAfrica, Africa Data Centres, or Wingu Africa, Safaricom's facility does not operate Meet-Me Rooms where multiple telecom operators, internet service providers, and cloud platforms interconnect. There is no open access policy for third-party networks. You cannot, as an independent enterprise, purchase rack space and bring your own connectivity.

This is a deliberate strategic choice, not an oversight. Safaricom's data centre exists to serve Safaricom's workloads. Opening the facility to competing network operators or cloud providers would create conflicts of interest and potential security concerns, particularly given the sensitivity of the M-Pesa platform and the mobile network core. The company has no commercial incentive to help competitors or third parties interconnect within its facility.

For enterprises that require carrier-neutral colocation with access to multiple network providers, the commercial data centre operators in Nairobi remain the appropriate choice. Safaricom's facility serves a different function: it is the private backbone of Kenya's most important digital services company.

## The Microsoft-G42 AI Data Centre Partnership

In May 2024, Microsoft and United Arab Emirates-based technology group G42 announced a landmark $1 billion investment to build a state-of-the-art AI data centre in Kenya. The announcement, made during a visit by UAE President Sheikh Mohamed bin Zayed Al Nahyan to Nairobi, named Safaricom as the local partner for the project. It would be the largest single foreign direct investment in Kenya's digital infrastructure.

The proposed facility was designed to provide AI compute capacity to serve not just Kenya but the broader East African region. G42, which has emerged as a significant player in AI infrastructure globally, would bring technical expertise and investment capital. Microsoft would provide Azure AI services and cloud integration. Safaricom would contribute its local market position, regulatory relationships, fibre infrastructure, and operational capabilities within Kenya.

### Why the Project Is Stalled

As of mid-2026, the project has not broken ground. The primary bottleneck is power. The proposed AI data centre would require in excess of 100 MW of dedicated power capacity, a demand that Kenya Power and Lighting Company (KPLC) is currently unable to deliver to a single site. While Kenya has an installed generation capacity of over 3,000 MW, the transmission and distribution infrastructure is not designed to deliver concentrated loads of this magnitude to a single customer at a single location.

This power constraint is not unique to the Microsoft-G42 project. It is the single most significant barrier to hyperscale data centre development in Kenya. Our analysis of [Kenya's power infrastructure as it relates to data centres](/articles/kenya-power-infrastructure-data-centres) covers this challenge in detail. The constraint affects every operator and prospective investor in the Kenyan market, but it is particularly acute for AI-scale facilities that require power densities an order of magnitude higher than traditional enterprise data centres.

Possible pathways forward include dedicated transmission lines from geothermal plants in the Rift Valley, on-site renewable generation with battery storage, or siting the facility where the grid can accommodate high-density loads. Each option involves significant capital, permitting, and timelines measured in years.

### Safaricom's Role as Local Partner

Safaricom's selection as the local partner for the Microsoft-G42 project reflects its unique position in the Kenyan market. No other company in East Africa combines Safaricom's regulatory relationships, existing fibre infrastructure spanning thousands of kilometres, enterprise customer base, and experience operating mission-critical data centre infrastructure.

Even with the project stalled, the partnership signals a strategic direction for Safaricom. The company is positioning itself not merely as a telecom operator with a data centre, but as a infrastructure platform company capable of hosting and enabling the next generation of AI workloads in East Africa. If the power challenges are resolved, Safaricom would transition from operating a single 1.5 MW facility to having access to and operational involvement in what could be the largest AI computing platform on the African continent.

## Safaricom's Data Centre Strategy Within the Broader Enterprise Business

Safaricom's enterprise business has become an increasingly important revenue stream, and data centre infrastructure is central to this strategy. The company's Enterprise business unit serves large corporations, government agencies, and SMEs with a portfolio that includes managed IT services, cloud computing, cybersecurity, and connectivity solutions.

The data centre underpins this entire enterprise offering. Safaricom Cloud competes with global providers by offering local hosting, data residency, and integration with Safaricom's network. Enterprise customers that purchase MPLS circuits, SD-WAN solutions, or dedicated internet access from Safaricom can have their compute workloads hosted within the same ecosystem, simplifying procurement, support, and fault management.

The enterprise strategy also extends to managed hosting and application management services. Safaricom hosts applications for banks, insurance companies, and government agencies within its data centre, managing the infrastructure layer so that customers can focus on their applications. This is a higher-margin business than raw connectivity, and it directly leverages the data centre investment that Safaricom has already made.

## Future Plans and Expansion

Safaricom has not publicly announced plans for additional data centre facilities beyond Waiyaki Way. However, several factors suggest expansion is likely, even without the Microsoft-G42 partnership in its original form.

The growth of M-Pesa across seven countries will continue driving demand for compute and storage. New product features such as savings accounts, lending products, and merchant payments all require additional infrastructure. The 5G rollout will further strain the network core as coverage expands beyond initial urban deployments and session volumes increase. While edge computing can offload some processing, core network functions will remain centralised.

The enterprise cloud business is also growing as Kenyan enterprises move workloads to local platforms, driven by data protection regulations and latency requirements. The AI compute opportunity, whether through the Microsoft-G42 partnership or other arrangements, represents a potential step change in scale. Safaricom's existing data centre expertise and market position make it a natural partner for any hyperscale infrastructure investment in Kenya.

## How Safaricom Compares to Other Kenyan Data Centre Operators

Understanding Safaricom's data centre operations requires situating them within the broader Kenyan market. The following comparison highlights the key differences:

- **Safaricom (Waiyaki Way):** Approximately 1.5 MW, 120 racks, Tier III, non-neutral, serves internal workloads (M-Pesa, network core, enterprise cloud). The most critical facility in the country by workload importance, but not the largest by capacity.

- **iXAfrica (Mombasa Road):** 4.5 MW operational, targeting 16 MW campus, carrier-neutral, AI-ready densities up to 50 kW per rack. Serves cloud providers, enterprises, and satellite operators. The largest and most advanced commercial facility in the region.

- **Africa Data Centres (Sameer Business Park and Mzansi):** Multiple facilities in Nairobi, carrier-neutral, part of the Pan-African REMCO platform. Focuses on enterprise colocation and hyperscale customers.

- **Wingu Africa (Various Nairobi locations):** Smaller-scale carrier-neutral facilities focused on enterprise and SME colocation.

Safaricom's facility is unique in this landscape. It is not competing for third-party colocation customers. It is not marketing itself to hyperscale cloud providers. It exists because Safaricom's business demands it, and its value to the Kenyan economy is measured not in rack prices or megawatts sold, but in the continuity of M-Pesa, the reliability of the mobile network, and the availability of local cloud services for Kenyan enterprises.

## Conclusion

Safaricom's data centre on Waiyaki Way is the hidden engine of Kenya's digital economy. It does not appear in carrier-neutral interconnection rankings or commercial colocation market reports, yet it processes more financial value and serves more end users than any other facility in East Africa. The workloads it supports, from M-Pesa transactions to 5G network core functions, are so fundamental to Kenya's economic activity that its reliability is effectively a matter of national importance.

Looking ahead, Safaricom's data centre strategy is at an inflection point. The Microsoft-G42 partnership, if it overcomes power constraints, would transform the company's role from infrastructure operator to infrastructure platform partner at a scale that would reshape the entire East African data centre market. Even without that partnership, the growth of M-Pesa, the expansion of 5G, and the increasing demand for local cloud services will require Safaricom to expand its data centre footprint in the coming years.

For organisations exploring the [data centre directory](/directory) to understand Kenya's infrastructure landscape, Safaricom's facility represents a critical but distinctive asset: a purpose-built, non-commercial facility that is simultaneously the most important data centre in the country and the one least accessible to the open market.

---

*Data Centre 254 provides independent analysis of Kenya's data centre industry. For a broader view of the market, read our analysis of [Kenya's power infrastructure challenges](/articles/kenya-power-infrastructure-data-centres) and our outlook on [AI data centres in East Africa](/articles/ai-data-centres-east-africa).*
