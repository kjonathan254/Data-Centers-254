export interface GlossaryTerm {
  term: string;
  short: string;
  definition: string;
  category: string;
  relatedTerms?: string[];
  relatedArticles?: { text: string; href: string }[];
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Data Centre",
    short: "A specialised building or room housing computer servers, storage, and networking equipment that processes, stores, and distributes data.",
    definition:
      "A data centre is a purpose-built facility that houses IT equipment — servers, storage systems, and network switches — in a controlled environment. Key systems include precision cooling (maintaining 18–27°C), uninterruptible power supplies (UPS), backup generators, fire suppression, and physical security. Data centres range from small server rooms to hyperscale campuses spanning hundreds of thousands of square metres. In Kenya, facilities like iXAfrica in Nairobi and Africa Data Centres’ facilities form the core of the country’s digital infrastructure, supporting everything from M-Pesa transactions to government services and streaming platforms.",
    category: "Fundamentals",
    relatedTerms: ["Tier Rating", "Colocation", "Hyperscale", "IT Load"],
    relatedArticles: [
      { text: "What is a data centre?", href: "/articles/what-is-a-data-centre" },
      { text: "Kenya’s data centre market outlook", href: "/articles/kenya-data-centre-market-outlook-2025-2030" },
    ],
  },
  {
    term: "Tier Rating",
    short: "A classification system (Tier I–IV) that rates a data centre’s reliability and redundancy, defined by the Uptime Institute.",
    definition:
      "The Uptime Institute’s Tier Classification System evaluates data centre infrastructure redundancy and availability. Tier I is basic (no redundancy, ~99.671% availability), Tier II adds redundant components (N+1, ~99.741%), Tier III adds dual-powered equipment and concurrent maintainability (~99.982%), and Tier IV adds fault tolerance with 2N or greater redundancy (~99.995%). Most Kenyan facilities target Tier III, which allows any component to be removed for maintenance without disrupting operations. iXAfrica’s Nairobi campus is designed to Tier III standards, making it suitable for enterprise and cloud workloads.",
    category: "Standards",
    relatedTerms: ["Redundancy", "Uptime SLA", "Data Centre"],
    relatedArticles: [
      { text: "Data centre tier ratings explained", href: "/articles/data-centre-tier-ratings-explained" },
      { text: "SLA and uptime guarantees", href: "/articles/data-centre-sla-uptime-guarantees" },
    ],
  },
  {
    term: "Colocation",
    short: "A service where multiple organisations rent space (racks, cages, or private suites) in a shared data centre facility.",
    definition:
      "Colocation (often shortened to ‘colo’) is a data centre service model where businesses rent physical space — from a single rack unit to a private suite — in a third-party facility. The colocation provider supplies the building, power, cooling, security, and network connectivity, while the customer supplies and manages their own servers and equipment. This is the dominant model in Kenya’s commercial data centre market. Companies like iXAfrica, Africa Data Centres, and Liquid Intelligent Technologies offer colocation services in Nairobi, allowing banks, telcos, and cloud providers to house equipment without building their own facilities.",
    category: "Services",
    relatedTerms: ["Data Centre", "Carrier-Neutral", "Cross-Connect", "Rack Unit"],
    relatedArticles: [
      { text: "What is colocation in Kenya?", href: "/articles/what-is-colocation-kenya" },
      { text: "Colocation data centres in Kenya", href: "/articles/colocation-data-centre-kenya" },
    ],
  },
  {
    term: "Hyperscale Data Centre",
    short: "A massive data centre operated by a single company (like Google, Microsoft, or AWS), typically exceeding 5,000 servers and 10 MW of IT load.",
    definition:
      "Hyperscale data centres are enormous facilities designed and operated by large technology companies — Amazon Web Services, Microsoft Azure, Google Cloud, Meta, and others. They typically exceed 10 MW of IT load and house tens of thousands of servers in a highly automated, efficiently designed layout. Hyperscale facilities are characterised by standardised building designs, heavy use of automation, and very low PUE (often below 1.2). In Africa, Microsoft and G42’s joint venture has announced plans for hyperscale capacity in Kenya, which would be a first for East Africa and a major milestone for the region’s cloud ecosystem.",
    category: "Infrastructure",
    relatedTerms: ["Data Centre", "PUE", "IT Load", "Edge Computing"],
    relatedArticles: [
      { text: "What is a hyperscale data centre?", href: "/articles/what-is-hyperscale-data-centre" },
      { text: "AI data centres in East Africa", href: "/articles/ai-data-centres-east-africa" },
    ],
  },
  {
    term: "PUE (Power Usage Effectiveness)",
    short: "The ratio of total facility power to IT equipment power. A PUE of 1.0 means all power goes to computing; the lower the better.",
    definition:
      "PUE is the most widely used metric for data centre energy efficiency, calculated by dividing total facility power (IT equipment plus cooling, lighting, and overhead) by IT equipment power alone. A perfect PUE of 1.0 would mean every watt goes directly to computing. The global average is around 1.58; modern hyperscale facilities achieve below 1.2. Kenyan data centres benefit from the country’s cool high-altitude climate (Nairobi is at 1,795m) and abundant geothermal energy, which can help achieve lower PUE values. A facility running on Kenya’s 75%+ renewable grid also has a significantly lower carbon footprint than diesel-dependent facilities in other African markets.",
    category: "Energy",
    relatedTerms: ["IT Load", "Data Centre", "Hyperscale"],
    relatedArticles: [
      { text: "PUE explained", href: "/articles/data-centre-pue-power-usage-effectiveness" },
      { text: "Geothermal energy for Kenyan data centres", href: "/articles/geothermal-energy-kenya-data-centres" },
    ],
  },
  {
    term: "Uptime SLA",
    short: "A contractual guarantee of availability, typically expressed as a percentage. ‘Five nines’ (99.999%) allows only 5.26 minutes of downtime per year.",
    definition:
      "An uptime Service Level Agreement (SLA) is a contract between a data centre provider and its customer guaranteeing a minimum level of availability. The most common tiers are 99.9% (‘three nines’, allowing ~8.76 hours of downtime per year), 99.99% (‘four nines’, ~52.6 minutes), and 99.999% (‘five nines’, ~5.26 minutes). SLAs are backed by the facility’s infrastructure redundancy — a Tier III facility can realistically commit to 99.99%, while true five-nines requires Tier IV fault-tolerant design. In Kenya, enterprise customers (banks, telcos, government) typically require 99.99% or higher, which drives the design standards for commercial facilities.",
    category: "Standards",
    relatedTerms: ["Tier Rating", "Redundancy"],
    relatedArticles: [
      { text: "SLA and uptime guarantees", href: "/articles/data-centre-sla-uptime-guarantees" },
      { text: "Data centre tier ratings", href: "/articles/data-centre-tier-ratings-explained" },
    ],
  },
  {
    term: "Submarine Cable",
    short: "A fibre optic cable laid on the ocean floor carrying intercontinental internet traffic. Six active cables land in Mombasa.",
    definition:
      "Submarine cables are fibre optic communication cables laid on the seabed, carrying the vast majority of intercontinental internet traffic. They are typically 17–25mm in diameter and can carry tens of terabits per second. Kenya’s coastal city of Mombasa is the submarine cable gateway for East Africa, with six active cables: SEACOM (2009), TEAMS (2009), EASSy (2010), LION2 (2013), DARE1 (2022), and PEACE (2022), and a seventh — Meta’s Daraja cable — in development. These cables connect Kenya to Europe, Asia, South Africa, and the rest of the world, providing the international bandwidth that makes the country’s digital economy possible.",
    category: "Connectivity",
    relatedTerms: ["Latency", "Bandwidth", "Fibre Optic"],
    relatedArticles: [
      { text: "Submarine cables landing in Mombasa", href: "/articles/submarine-cables-landing-mombasa" },
      { text: "Kenya internet speeds and data centres", href: "/articles/kenya-internet-speeds-data-centres" },
    ],
  },
  {
    term: "Internet Exchange Point (IXP)",
    short: "A facility where networks interconnect directly to exchange traffic locally, reducing latency and cost. Kenya’s is KIXP.",
    definition:
      "An Internet Exchange Point (IXP) is a physical facility where internet service providers, content providers, and enterprises interconnect their networks and exchange traffic directly, rather than routing it through international links. This localises traffic, reducing latency and cost. Kenya’s IXP — the Kenya Internet Exchange Point (KIXP), operated by the Internet Society — is one of Africa’s most successful, handling significant volumes of local traffic. Without KIXP, a WhatsApp message between two Safaricom users in Nairobi might route through Mombasa and onto a submarine cable before returning. With KIXP, it stays local, reducing round-trip time from ~100ms to under 5ms.",
    category: "Connectivity",
    relatedTerms: ["Peering", "Submarine Cable", "Latency"],
    relatedArticles: [
      { text: "KIXP explained", href: "/articles/kixp-internet-exchange-point-kenya" },
      { text: "Internet speeds and data centres", href: "/articles/kenya-internet-speeds-data-centres" },
    ],
  },
  {
    term: "Peering",
    short: "The direct interconnection of two networks to exchange traffic without a third-party intermediary, typically done at an IXP.",
    definition:
      "Peering is a voluntary, reciprocal arrangement between two networks to exchange traffic directly. It can be public (at an IXP like KIXP) or private (a direct link between two parties). Peering reduces costs by bypassing transit providers, and reduces latency by keeping traffic local. In Kenya, peering at KIXP means that a user accessing a local bank’s website or a streaming service with local caches doesn’t need to traverse international links. For data centres, being connected to an IXP is a major selling point — it means tenants can peer with dozens of networks from a single facility. Carrier-neutral data centres that host IXP presence points are particularly valuable.",
    category: "Connectivity",
    relatedTerms: ["Internet Exchange Point", "Carrier-Neutral", "Bandwidth"],
    relatedArticles: [
      { text: "KIXP explained", href: "/articles/kixp-internet-exchange-point-kenya" },
      { text: "Interconnection and peering in Kenya", href: "/articles/data-centre-interconnection-peering-kenya" },
    ],
  },
  {
    term: "Edge Computing",
    short: "Processing data closer to the user or data source, rather than in a centralised data centre, to reduce latency.",
    definition:
      "Edge computing refers to processing data at or near the source of data generation, rather than sending it to a centralised data centre or cloud. This reduces latency (critical for real-time applications like autonomous vehicles, IoT, and financial trading) and reduces bandwidth costs. Edge infrastructure ranges from micro data centres at cell towers to larger facilities in smaller cities. In East Africa, edge computing is gaining relevance as 5G networks roll out and IoT adoption grows. For Kenya, edge nodes in Mombasa, Kisumu, or Nakuru could serve local demand without routing through Nairobi, while still connecting to the core data centre ecosystem in the capital.",
    category: "Infrastructure",
    relatedTerms: ["Hyperscale", "Latency", "Data Centre"],
    relatedArticles: [
      { text: "Edge computing in East Africa", href: "/articles/edge-computing-east-africa" },
      { text: "5G networks and data centre demand", href: "/articles/5g-networks-data-centre-demand-kenya" },
    ],
  },
  {
    term: "CDN (Content Delivery Network)",
    short: "A geographically distributed network of servers that delivers web content to users from the nearest location, reducing load times.",
    definition:
      "A Content Delivery Network (CDN) caches and serves web content — images, video, web pages, APIs — from servers located close to end users. Instead of every request travelling to an origin server (which might be in Europe or the US), the CDN serves a cached copy from a nearby ‘edge’ server. Major CDN providers like Cloudflare, Akamai, and Fastly have points of presence (PoPs) in Nairobi or nearby regions. For Kenyan users, CDNs are why Netflix streams smoothly, Google searches feel fast, and news sites load quickly. Data centres with CDN presence attract other tenants because CDN-connected facilities offer lower latency for popular internet services.",
    category: "Connectivity",
    relatedTerms: ["Edge Computing", "Latency", "Peering"],
    relatedArticles: [
      { text: "Edge computing in East Africa", href: "/articles/edge-computing-east-africa" },
      { text: "Interconnection and peering", href: "/articles/data-centre-interconnection-peering-kenya" },
    ],
  },
  {
    term: "IT Load",
    short: "The amount of power consumed by the IT equipment (servers, storage, network) in a data centre, measured in kilowatts (kW) or megawatts (MW).",
    definition:
      "IT load refers to the electrical power drawn by the actual computing equipment in a data centre — servers, storage arrays, switches, and routers. It excludes power used for cooling, lighting, and other facility overhead. IT load is the primary capacity metric for data centres: a facility rated at 2 MW IT load can support a specific number of server racks (typically 5–15 kW per rack). Kenyan data centres range from sub-1 MW facilities to iXAfrica’s planned 16 MW campus. IT load capacity determines how many tenants a facility can support and what types of workloads it can handle — AI/GPU computing requires significantly higher power per rack than standard enterprise servers.",
    category: "Infrastructure",
    relatedTerms: ["PUE", "Rack Unit", "Data Centre"],
    relatedArticles: [
      { text: "What is a data centre?", href: "/articles/what-is-a-data-centre" },
      { text: "GPU computing in Kenya", href: "/articles/gpu-computing-kenya-ai-needs-data-centres" },
    ],
  },
  {
    term: "Redundancy",
    short: "Duplication of critical components (power, cooling, network) so that a single failure does not cause an outage. Expressed as N+1, 2N, etc.",
    definition:
      "Redundancy in data centres means having backup systems that can take over if a primary system fails. The most common schemes are N+1 (one backup for each component), N+2 (two backups), and 2N (fully duplicated independent systems). For example, N+1 power means if one UPS unit fails, the remaining units can handle the full load. 2N means there are two completely independent power paths from utility to server. Redundancy is a key factor in Tier Ratings and directly impacts uptime SLAs. Kenyan data centres typically implement N+1 or 2N redundancy for critical systems, often including on-site diesel generators that can run for 24–72 hours during grid outages.",
    category: "Standards",
    relatedTerms: ["Tier Rating", "Uptime SLA", "UPS"],
    relatedArticles: [
      { text: "Tier ratings explained", href: "/articles/data-centre-tier-ratings-explained" },
      { text: "UPS and backup power in Kenya", href: "/articles/ups-backup-power-kenyan-data-centres" },
    ],
  },
  {
    term: "Carrier-Neutral",
    short: "A data centre that allows tenants to choose from multiple network providers, fostering competition and preventing vendor lock-in.",
    definition:
      "A carrier-neutral data centre provides access to multiple telecommunications providers and network operators, giving tenants the freedom to choose and switch between carriers. This contrasts with carrier-specific facilities (like a telco’s own data centre) where tenants may be limited to that provider’s network services. Carrier neutrality is a key selling point for commercial colocation because it drives down connectivity costs through competition, improves redundancy through diverse network paths, and enables direct peering with other networks. In Kenya, iXAfrica and Africa Data Centres position themselves as carrier-neutral, offering connectivity from Safaricom, Telkom, Liquid, and international carriers.",
    category: "Services",
    relatedTerms: ["Colocation", "Peering", "Cross-Connect"],
    relatedArticles: [
      { text: "What is colocation in Kenya?", href: "/articles/what-is-colocation-kenya" },
      { text: "Interconnection and peering", href: "/articles/data-centre-interconnection-peering-kenya" },
    ],
  },
  {
    term: "Rack Unit (U)",
    short: "A standard unit of measure for server rack height. 1U equals 44.45mm (1.75 inches). A standard full-height rack is 42U.",
    definition:
      "A Rack Unit (U) is the standard unit for measuring vertical space in server racks and equipment. One U equals 44.45mm or 1.75 inches. Standard equipment sizes include 1U (a thin server or switch), 2U (a larger server), and 4U (a storage array or high-performance server). A standard 42U rack is about two metres tall and is the most common rack size in data centres. In colocation, customers typically rent space by the rack or partial rack (e.g., a quarter rack = ~10U). Kenyan colocation providers price by the U or by the kW of IT load, whichever is higher. Understanding rack density is important because AI and GPU workloads are driving demand for higher-power racks (20–40 kW per rack vs. the traditional 5–10 kW).",
    category: "Fundamentals",
    relatedTerms: ["Colocation", "IT Load"],
    relatedArticles: [
      { text: "What is a server?", href: "/articles/what-is-a-server" },
      { text: "What is colocation in Kenya?", href: "/articles/what-is-colocation-kenya" },
    ],
  },
  {
    term: "Latency",
    short: "The time it takes for a data packet to travel from source to destination, measured in milliseconds (ms). Lower is better.",
    definition:
      "Latency is the time delay between sending a request and receiving a response, measured in milliseconds. It’s influenced by the physical distance data travels, the number of network hops, and processing time at each hop. For context: a local network has sub-1ms latency, a Nairobi-to-Nairobi connection via KIXP is 1–5ms, Nairobi-to-Europe via submarine cable is 100–150ms, and satellite links (like Starlink) add 20–40ms. Low latency matters for real-time applications: video calls, online gaming, financial trading, and cloud computing. This is why having data centres in Nairobi matters — it means Kenyan users can access services with sub-10ms latency instead of 100ms+ if the nearest server were in Europe.",
    category: "Connectivity",
    relatedTerms: ["Submarine Cable", "Internet Exchange Point", "CDN", "Edge Computing"],
    relatedArticles: [
      { text: "Kenya internet speeds and data centres", href: "/articles/kenya-internet-speeds-data-centres" },
      { text: "Edge computing in East Africa", href: "/articles/edge-computing-east-africa" },
    ],
  },
  {
    term: "Fibre Optic",
    short: "Hair-thin glass or plastic cables that transmit data as light pulses, offering far higher bandwidth and lower latency than copper.",
    definition:
      "Fibre optic cables use pulses of light transmitted through thin strands of glass or plastic to carry data. They offer dramatically higher bandwidth (terabits per second over a single cable) and lower latency compared to copper cables. Fibre is the backbone of both long-haul connectivity (submarine cables, terrestrial backbone networks) and last-mile connections to data centres. In Kenya, fibre networks connect Mombasa’s cable landing stations to Nairobi’s data centres (about 500km), and urban fibre networks distribute connectivity within cities. Major fibre providers include Liquid Intelligent Technologies, Telkom Kenya, and the Kenya Information and Communications Authority’s open-access fibre infrastructure.",
    category: "Connectivity",
    relatedTerms: ["Submarine Cable", "Bandwidth", "Latency"],
    relatedArticles: [
      { text: "Fibre optic networks in Kenya", href: "/articles/fibre-optic-networks-kenya-data-centres" },
      { text: "Submarine cables in Mombasa", href: "/articles/submarine-cables-landing-mombasa" },
    ],
  },
  {
    term: "UPS (Uninterruptible Power Supply)",
    short: "A battery-based system that provides immediate backup power when the main grid fails, bridging the gap until generators start.",
    definition:
      "A UPS is an electrical device that provides emergency power to IT equipment when the main power supply fails. It uses batteries to deliver power instantly (within milliseconds), preventing equipment shutdown during power transitions. UPS systems are the first line of defence in a data centre’s power chain: utility power → UPS → generator (if the outage persists). Modern data centres use modular UPS systems for scalability and N+1 redundancy. In Kenya, where grid reliability has improved but outages still occur, UPS systems are critical. They typically provide 10–15 minutes of runtime — enough for diesel generators to start and assume the load. Kenyan data centres like iXAfrica and Africa Data Centres maintain N+1 or 2N UPS configurations with battery monitoring and automatic transfer switches.",
    category: "Infrastructure",
    relatedTerms: ["Redundancy", "IT Load"],
    relatedArticles: [
      { text: "UPS and backup power in Kenyan data centres", href: "/articles/ups-backup-power-kenyan-data-centres" },
      { text: "Kenya’s power infrastructure", href: "/articles/kenya-power-infrastructure-data-centres" },
    ],
  },
];

export const glossaryCategories = [
  "Fundamentals",
  "Standards",
  "Services",
  "Infrastructure",
  "Energy",
  "Connectivity",
] as const;

export type GlossaryCategory = (typeof glossaryCategories)[number];
