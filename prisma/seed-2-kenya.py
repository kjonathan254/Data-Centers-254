import sqlite3
import sys

DB_PATH = "/home/z/my-project/db/custom.db"


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
            "title": "Kenya's Data Centre Industry Explained",
            "slug": "kenya-data-centre-industry-explained",
            "tlDr": "Kenya's data centre industry has grown from a handful of telecom facilities into a multi-operator market anchored in Nairobi, serving banks, mobile money platforms, and cloud providers across East Africa.",
            "description": "A comprehensive overview of Kenya's data centre industry: its history, current state, key players, and role in East Africa's digital economy.",
            "content": """## From Telecom Closets to a Regional Hub

Kenya's data centre story begins with the telecom boom of the 2000s. Safaricom, Telkom Kenya, and other operators built server rooms to run their networks. As mobile money, internet banking, and e-commerce grew, so did the need for proper data centre facilities. What started as small rooms with a few racks evolved into purpose-built facilities with megawatts of power and multiple connectivity providers.

## The Market Today

Kenya now has roughly 15 to 25 operational data centre facilities, depending on how you count them. The largest facilities are concentrated in Nairobi, with smaller enterprise sites spread across the country. The industry serves three main customer groups: banks and financial institutions that need secure locations for core banking systems, mobile network operators running their platforms, and cloud and content providers serving East African users.

## Key Operators in the Market

The Kenyan data centre landscape features a mix of local and international operators. Africa Data Centres, a subsidiary of the pan-African Remgro-backed group, operates a major facility in Nairobi. iXAfrica has built a carrier-neutral facility designed for colocation and interconnection. PAIX Data Centres, backed by the Pan-African Investment Company, runs facilities that host multiple carriers and enterprises. Safaricom operates its own data centres primarily for internal use, supporting M-Pesa and its enterprise services. Liquid Intelligent Technologies, formerly Liquid Telecom, also maintains a significant presence through its network of facilities across East Africa.

## Connectivity and Undersea Cables

Kenya's data centre industry benefits enormously from its position as a landing point for multiple undersea fibre-optic cables. The TEAMS, EASSy, SEACOM, and DARE cables all land at the Kenyan coast, giving Nairobi-based data centres direct access to global internet backbones. SEACOM, in particular, has invested in building terrestrial fibre networks linking Mombasa to Nairobi and beyond, creating a robust connectivity corridor that makes Kenyan data centres attractive for international content and cloud providers.

## Growth Drivers

Several factors are driving Kenya's data centre industry forward. The country's high mobile penetration, the success of M-Pesa and mobile banking, the growing adoption of cloud services by Kenyan businesses, and the government's push for digitalisation all create demand for local data centre capacity. Additionally, Kenya's relatively stable power supply compared to some neighbours, and its strategic location between the coast and the Great Lakes region, position it as a natural hub for serving the broader East African market.""",
            "readingTimeMin": 6,
            "sortOrder": 1,
            "claims": [
                {
                    "claim": "Kenya hosts 15 to 25 operational data centre facilities as of 2024, with the majority concentrated in Nairobi.",
                    "source": "Various industry reports including Africa Data Centres Association publications",
                    "confidence": "Medium",
                    "notes": "Exact count varies depending on whether enterprise server rooms and edge sites are included."
                },
                {
                    "claim": "Multiple undersea cables land at Kenya's coast, including TEAMS, EASSy, SEACOM, and DARE, providing direct international connectivity to Nairobi-based data centres.",
                    "source": "SEACOM and Kenya ICT Board infrastructure reports",
                    "confidence": "High"
                },
                {
                    "claim": "Africa Data Centres, iXAfrica, PAIX, Safaricom, and Liquid Intelligent Technologies are among the principal operators in Kenya's data centre market.",
                    "source": "Company disclosures and industry directories",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "Where Are Kenya's Data Centres?",
            "slug": "where-are-kenyas-data-centres",
            "tlDr": "Kenya's data centres are heavily concentrated in Nairobi and its surroundings, with the coast at Mombasa serving as the critical cable landing point that connects them to the world.",
            "description": "Maps out the geographic distribution of Kenya's data centres, explaining why Nairobi dominates and what role Mombasa and other towns play.",
            "content": """## Nairobi: The Undisputed Centre

Nairobi and its immediate environs host the overwhelming majority of Kenya's data centre capacity. The city's advantages are clear: it is the country's business capital, home to the headquarters of every major bank, telecom operator, and tech company. Most facilities cluster in industrial areas like Westlands, Muthaiga, and along Mombasa Road where land is more available and power infrastructure is relatively reliable. Kenya's main internet exchange point, the Kenya Internet Exchange Point (KIXP), is also in Nairobi, which creates a natural gravitational pull for data centre development.

## Mombasa: The Gateway

Mombasa does not host large data centres itself, but its role is indispensable. The coastal city is where undersea fibre-optic cables come ashore from the Indian Ocean. SEACOM, TEAMS, EASSy, and DARE all have landing stations in or near Mombasa. From these stations, terrestrial fibre runs inland to Nairobi, where the data centres sit. Some operators maintain small equipment rooms in Mombasa for regeneration and switching, but the heavy computing happens further inland.

## Other Towns and Edge Sites

Beyond Nairobi and Mombasa, Kenya has smaller data centre installations in towns like Kisumu, Nakuru, and Eldoret. These are typically owned by telecom operators or the government and serve as network aggregation points rather than commercial colocation facilities. Banks and county governments sometimes maintain small server rooms in these towns to support local operations, reducing latency for users who would otherwise have to connect back to Nairobi for every service.

## The Fibre Corridor

The Mombasa-Nairobi fibre corridor is the backbone of Kenya's data centre geography. Multiple operators run parallel fibre routes between the coast and the capital, sometimes along the standard gauge railway alignment and sometimes along the older road corridor. This redundancy means that even if one route is cut, data can still flow between landing stations and data centres. From Nairobi, fibre extends west to Uganda and Rwanda, north to Ethiopia, and south to Tanzania, making Kenyan data centres natural interchange points for regional traffic.

## Why Concentration Matters

The concentration of data centres in Nairobi is not accidental. It reflects economic logic: that is where the customers are, where the skilled workforce lives, and where connectivity is richest. However, this concentration also creates risks. A major power outage or disaster in Nairobi could affect a large share of Kenya's digital services, which is why operators build redundancy into their facilities and some are beginning to consider secondary sites outside the capital.""",
            "readingTimeMin": 6,
            "sortOrder": 2,
            "claims": [
                {
                    "claim": "Nairobi and its surroundings host the vast majority of Kenya's data centre capacity, with smaller installations in Kisumu, Nakuru, and Eldoret.",
                    "source": "Kenya ICT Board and operator facility disclosures",
                    "confidence": "High"
                },
                {
                    "claim": "The Kenya Internet Exchange Point (KIXP) is located in Nairobi and serves as a major peering hub attracting data centre development to the capital.",
                    "source": "KIXP and Telecommunications Service Providers Association of Kenya (TESPOK)",
                    "confidence": "High"
                },
                {
                    "claim": "SEACOM, TEAMS, EASSy, and DARE undersea cables all land at Kenya's coast near Mombasa.",
                    "source": "SEACOM infrastructure reports and Kenya Communications Authority records",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "Who Owns Kenya's Data Centres?",
            "slug": "who-owns-kenyas-data-centres",
            "tlDr": "Kenya's data centres are owned by a mix of pan-African operators like Africa Data Centres and Liquid Intelligent Technologies, local telecom giant Safaricom, and specialist colocation providers like iXAfrica and PAIX.",
            "description": "Breaks down the ownership landscape of Kenya's data centres by operator type, from telecom-owned to carrier-neutral facilities.",
            "content": """## Telecom-Backed Operators

Safaricom is the most significant telecom-owned data centre operator in Kenya. The company runs multiple facilities across Nairobi that primarily support its own services, including M-Pesa, voice, and mobile data. Safaricom's data centres are not generally open to third-party colocation customers, meaning they function as private enterprise facilities. Telkom Kenya, under its various owners over the years, has also maintained data centre capacity to support its network operations.

## Pan-African Data Centre Groups

Africa Data Centres, part of the Remgro-backed Liquid Intelligent Technologies group, operates major facilities in Nairobi as part of a larger network spanning South Africa, Egypt, Nigeria, and other African markets. Their model is to build large carrier-neutral facilities that host multiple customers, from telecom operators to cloud providers. Liquid Intelligent Technologies itself also maintains data centre assets in Kenya, leveraging its extensive terrestrial fibre network across East Africa.

## Specialist Colocation Providers

iXAfrica is a notable entrant in the Kenyan market, having built a purpose-designed carrier-neutral data centre in Nairobi. The facility is positioned for wholesale and retail colocation, targeting cloud providers, content delivery networks, and enterprises that want to connect to multiple carriers. PAIX Data Centres, backed by the Pan-African Investment Company, operates facilities in Nairobi and has positioned itself as a multi-tenant colocation provider hosting carriers, ISPs, and enterprise customers.

## Enterprise and Government Facilities

Beyond commercial operators, several organisations run their own data centres in Kenya. Major banks such as KCB, Equity Bank, and Co-operative Bank operate dedicated facilities to house their core banking systems. Government agencies maintain data centres to support e-government services, though the quality and capacity of these facilities varies significantly. The Kenya Revenue Authority and the National Treasury both run data processing infrastructure.

## Cloud and Content Providers

While Kenya does not yet host a hyperscale data centre from providers like AWS, Google, or Microsoft, several international content and cloud companies have a presence through PoP (point of presence) deployments or by leasing space in local facilities. These deployments help speed up services for Kenyan users even when the main computing happens overseas. SEACOM, for instance, operates PoPs in Nairobi that improve content delivery across the region.

## Emerging Players

The Kenyan market continues to attract new entrants. As demand for colocation, cloud, and interconnection grows, more operators are considering building capacity in Nairobi. The combination of Kenya's strong connectivity, growing digital economy, and position as an East African gateway makes it an attractive market for both established operators and new investors looking at Africa's data centre opportunity.""",
            "readingTimeMin": 6,
            "sortOrder": 3,
            "claims": [
                {
                    "claim": "Safaricom operates data centres in Kenya primarily for its own services including M-Pesa, rather than as open colocation facilities.",
                    "source": "Safaricom corporate disclosures and industry analysis",
                    "confidence": "High"
                },
                {
                    "claim": "Africa Data Centres operates carrier-neutral facilities in Nairobi as part of a pan-African network spanning multiple countries.",
                    "source": "Africa Data Centres official publications and Liquid Intelligent Technologies investor reports",
                    "confidence": "High"
                },
                {
                    "claim": "iXAfrica and PAIX are specialist colocation operators in Nairobi offering multi-tenant data centre services.",
                    "source": "iXAfrica and PAIX corporate websites and announcements",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "Kenya's Biggest Data Centres",
            "slug": "kenyas-biggest-data-centres",
            "tlDr": "Kenya's largest data centres include facilities run by Africa Data Centres, Liquid Intelligent Technologies, and PAIX in Nairobi, offering thousands of square metres of floor space and multiple megawatts of power capacity.",
            "description": "Profiles the largest data centre facilities in Kenya by capacity, floor space, and market significance.",
            "content": """## How Do We Measure Size?

Data centre size is measured in several ways: gross floor area, net white space (the actual room where server racks go), power capacity in megawatts, and the number of server racks a facility can accommodate. A large commercial data centre in Nairobi might offer 1,000 to 3,000 square metres of white space with 2 to 5 megawatts of power, which is significant by African standards though modest compared to hyperscale facilities in Europe or the US.

## Africa Data Centres Nairobi

Africa Data Centres operates one of the largest purpose-built data centre facilities in Nairobi. The campus offers carrier-neutral colocation with multiple connectivity providers, redundant power systems including UPS and diesel generators, and advanced cooling infrastructure. The facility is designed to Tier III standards, meaning it can maintain operations during planned maintenance without impacting customer services. Africa Data Centres has been expanding its Kenyan capacity in response to growing demand from cloud providers, financial institutions, and telecom operators.

## PAIX Data Centres Nairobi

PAIX operates multi-tenant data centre facilities in Nairobi that serve a range of customers from internet service providers to enterprise clients. The PAIX facilities are designed around carrier-neutral principles, allowing customers to choose their preferred connectivity provider. The company has invested in power redundancy and security systems to meet the requirements of financial sector clients who need reliable infrastructure for their core systems.

## iXAfrica Nairobi

iXAfrica has built a modern carrier-neutral data centre in Nairobi designed for colocation and interconnection. The facility emphasises connectivity density, offering access to multiple fibre providers and the KIXP internet exchange. iXAfrica's approach targets cloud and content providers looking for a well-connected Kenyan foothold, as well as enterprises that want to consolidate their IT infrastructure into a professional facility rather than maintaining their own server rooms.

## Safaricom's Facilities

While Safaricom does not publicly share detailed specifications of its data centres, the scale of M-Pesa processing, with billions of transactions monthly, requires substantial compute and storage infrastructure. Safaricom operates multiple data centre sites in Nairobi with significant power capacity and redundancy. These facilities are built to stringent standards given their importance to Kenya's financial system and the central role M-Pesa plays in the economy.

## Liquid Intelligent Technologies

Liquid Intelligent Technologies maintains data centre facilities in Nairobi as part of its broader East African operations. The company's advantage lies not just in the facilities themselves but in the extensive terrestrial fibre network that connects them to multiple countries. This makes Liquid's Nairobi facilities natural hubs for regional connectivity and content distribution.

## What "Big" Means in Kenya

It is worth noting that Kenya's biggest data centres are mid-sized by global standards. A typical large Nairobi facility might accommodate a few hundred to a thousand racks, compared to hyperscale campuses elsewhere that hold tens of thousands. However, for Kenya's current demand, these facilities are well-sized and growing steadily.""",
            "readingTimeMin": 7,
            "sortOrder": 4,
            "claims": [
                {
                    "claim": "Africa Data Centres operates one of the largest purpose-built data centre facilities in Nairobi, designed to Tier III standards.",
                    "source": "Africa Data Centres official website and industry reports",
                    "confidence": "High"
                },
                {
                    "claim": "Kenya's largest commercial data centres typically offer 1,000 to 3,000 square metres of white space with 2 to 5 megawatts of power capacity.",
                    "source": "Structure Research and Data Centre Dynamics African market reports",
                    "confidence": "Medium",
                    "notes": "Figures are approximate and vary by source and definition."
                },
                {
                    "claim": "Safaricom's data centre capacity is primarily dedicated to supporting M-Pesa processing and internal services rather than offered as commercial colocation.",
                    "source": "Safaricom investor presentations and industry analysis",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "Nairobi's Data Centre Ecosystem",
            "slug": "nairobis-data-centre-ecosystem",
            "tlDr": "Nairobi's data centre ecosystem is a network of interconnected facilities, fibre providers, internet exchange points, and enterprise customers that together form the digital backbone of Kenya and much of East Africa.",
            "description": "Explores how Nairobi's data centres, connectivity providers, and customers form an interconnected digital ecosystem.",
            "content": """## More Than Buildings

A data centre ecosystem is not just about the facilities themselves. It includes the fibre networks that connect them, the internet exchange points that allow networks to peer with each other, the power and cooling infrastructure that keeps them running, and the businesses and institutions that rely on them. Nairobi's ecosystem has matured significantly over the past decade, evolving from isolated telecom facilities into an interconnected digital infrastructure platform.

## The Connectivity Web

Nairobi's data centres are linked by a dense web of terrestrial fibre from multiple providers. Liquid Intelligent Technologies, Safaricom, Telkom Kenya, the Kenya Electricity Transmission Company (KETRACO) fibre, and others all run routes between data centre facilities and between Nairobi and the coast. This competition among fibre providers means data centre customers can choose from multiple paths for redundancy and price competition. The Kenya Internet Exchange Point, operated by TESPOK, allows networks to exchange traffic locally rather than routing it through international connections, reducing latency and costs.

## The Customer Base

Nairobi's data centres serve a diverse customer base. Banks and financial institutions are among the largest tenants, requiring secure and reliable facilities for core banking, mobile money, and trading systems. Government agencies house e-government platforms and databases. Mobile network operators run their switching and core network equipment. Tech companies and startups host their applications. Content providers and CDNs place caches to serve local users faster. International companies establishing East African operations often start by leasing space in a Nairobi data centre.

## Interconnection and Peering

One of the hallmarks of a mature data centre ecosystem is the ability for different networks and services to interconnect easily. Nairobi's carrier-neutral facilities, particularly those operated by Africa Data Centres, iXAfrica, and PAIX, are designed as meet-me points where multiple operators, cloud providers, and enterprises can cross-connect. This reduces the cost and complexity of connecting services and makes Nairobi an attractive location for companies that need to reach multiple East African markets from a single point.

## Power and Resilience

Power reliability remains a critical factor in Nairobi's ecosystem. Kenya Power supplies grid electricity to data centre facilities, supported by UPS systems and diesel generators for backup. The country's significant geothermal energy capacity, particularly from the Olkaria fields in the Rift Valley, provides a relatively clean baseload power source. Some operators are exploring direct power purchase agreements with renewable energy providers to reduce both costs and carbon footprint.

## The Workforce

Nairobi's data centre ecosystem also relies on a growing pool of skilled professionals. Network engineers, systems administrators, cooling and power specialists, and security personnel are needed to keep facilities running. Kenyan universities and technical colleges are producing increasing numbers of IT graduates, though specialised data centre training remains limited and many skills are developed on the job.

## Challenges Ahead

Despite its growth, Nairobi's ecosystem faces challenges. Power costs are high by regional standards, regulatory processes for new facilities can be slow, and competition from established hubs in South Africa and emerging ones in Nigeria means Nairobi must continue to improve its offering to attract investment.""",
            "readingTimeMin": 7,
            "sortOrder": 5,
            "claims": [
                {
                    "claim": "The Kenya Internet Exchange Point (KIXP), operated by TESPOK, enables local traffic peering in Nairobi, reducing latency and international bandwidth costs.",
                    "source": "TESPOK and KIXP published reports",
                    "confidence": "High"
                },
                {
                    "claim": "Kenya's geothermal energy capacity from Olkaria provides a relatively clean baseload power source for data centre operations.",
                    "source": "Kenya Electricity Generating Company (KenGen) and Geothermal Development Company reports",
                    "confidence": "High"
                },
                {
                    "claim": "Africa Data Centres, iXAfrica, and PAIX operate carrier-neutral facilities in Nairobi that serve as interconnection points for multiple operators.",
                    "source": "Operator websites and industry directories",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "Why Kenya Is Becoming an East African Data Centre Hub",
            "slug": "why-kenya-is-becoming-an-east-african-data-centre-hub",
            "tlDr": "Kenya's combination of undersea cable landing points, a growing digital economy, political stability, and central geographic position is making Nairobi the preferred data centre location for serving the broader East African market.",
            "description": "Analyses the strategic advantages that are positioning Kenya as the data centre hub of East Africa.",
            "content": """## Geography: Centrally Placed

Kenya sits at a strategic crossroads in East Africa. The country borders Uganda, Tanzania, South Sudan, Ethiopia, and Somalia, and its infrastructure connects to Rwanda, Burundi, and the Democratic Republic of Congo through terrestrial fibre networks. Nairobi is roughly equidistant from the Indian Ocean coast and the Great Lakes region, making it a natural interchange point for data flowing between coastal landing stations and landlocked inland markets. This geography is hard to replicate.

## Connectivity: Multiple Paths to the World

Kenya's status as a landing point for several undersea cables gives its data centres a connectivity advantage over inland countries. The SEACOM, TEAMS, EASSy, and DARE cables all land at the Kenyan coast, and multiple terrestrial fibre operators carry traffic from Mombasa to Nairobi. From Nairobi, regional fibre networks extend to Uganda, Rwanda, Tanzania, and beyond. This means a data centre in Nairobi can reach both global networks and regional markets without relying on transit through a neighbouring country.

## The Digital Economy

Kenya's digital economy is one of the most advanced in Africa. M-Pesa processes billions of dollars in transactions annually. Mobile penetration exceeds 90 percent. Internet usage is growing rapidly. The government has pushed digitisation through initiatives like e-Citizen, the Huduma digital service centres, and the digital literacy programme. Banks like KCB, Equity, and Co-operative Bank have invested heavily in digital banking platforms that need reliable local data centre capacity. All of this creates organic demand for data centre services.

## Political Stability and Governance

Compared to many of its neighbours, Kenya has maintained relative political stability and has developed regulatory frameworks that support digital infrastructure investment. The Communications Authority of Kenya regulates the sector, and while there are challenges, the overall environment is considered business-friendly for technology investment. Kenya's data protection legislation, while not perfect, provides a legal framework that gives international companies confidence to locate data and services in the country.

## Skilled Workforce

Nairobi is home to a growing technology workforce. The city has earned the nickname "Silicon Savannah" for its concentration of tech companies, incubators, and startups. While specialised data centre skills are still developing, Nairobi has a deep pool of IT and telecom professionals who can support data centre operations. Companies like Safaricom have trained thousands of engineers who understand mission-critical infrastructure.

## Infrastructure Beyond Data Centres

Kenya's data centre attractiveness is reinforced by supporting infrastructure. The Standard Gauge Railway connects Mombasa to Nairobi, facilitating the transport of heavy equipment needed for data centre construction. Jomo Kenyatta International Airport provides direct flights to major global hubs, making it easier for international engineers and executives to visit facilities. The country's road network, while imperfect, supports logistics for construction and operations.

## Competitive Pressure

Kenya is not alone in pursuing the East African hub position. Tanzania is investing in its own digital infrastructure, and Ethiopia has ambitious plans. However, Kenya's head start in connectivity, its established financial sector, and the network effects of its existing ecosystem give it a meaningful lead. Maintaining this position will require continued investment in power, connectivity, and regulatory improvement.""",
            "readingTimeMin": 7,
            "sortOrder": 6,
            "claims": [
                {
                    "claim": "Kenya is a landing point for at least four international undersea fibre-optic cables: SEACOM, TEAMS, EASSy, and DARE.",
                    "source": "SEACOM and Kenya Communications Authority records",
                    "confidence": "High"
                },
                {
                    "claim": "M-Pesa processes billions of dollars in transactions annually, creating substantial demand for local data centre infrastructure.",
                    "source": "Safaricom annual financial reports",
                    "confidence": "High"
                },
                {
                    "claim": "Kenya's mobile penetration exceeds 90 percent, driving digital service adoption and data centre demand.",
                    "source": "Communications Authority of Kenya quarterly sector reports",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "Why Mombasa Matters to Kenya's Digital Infrastructure",
            "slug": "why-mombasa-matters-to-kenyas-digital-infrastructure",
            "tlDr": "Mombasa is where Kenya's internet enters the country through undersea cable landing stations, making the coastal city the critical gateway between Kenya's data centres and the rest of the world.",
            "description": "Explains Mombasa's essential role as the cable landing gateway that connects Kenya's data centre ecosystem to global internet backbones.",
            "content": """## Where the Internet Arrives

Every time you load a website, stream a video, or make an international call in Kenya, there is a good chance the data travelled through Mombasa first. The coastal city is home to the landing stations where undersea fibre-optic cables emerge from the Indian Ocean and connect to Kenya's terrestrial networks. Without Mombasa, Kenya's data centres in Nairobi would have no direct link to the global internet. The city is the gateway through which virtually all of Kenya's international digital traffic flows.

## The Cable Landing Stations

Mombasa and its surrounding coastline host landing stations for multiple undersea cable systems. SEACOM, which went live in 2009, was one of the first privately funded submarine cables to land in East Africa, dramatically reducing bandwidth costs for Kenya and its neighbours. The TEAMS cable, a joint venture between the Kenyan government and Emirates Telecommunications, provides another major route. EASSy (Eastern Africa Submarine Cable System) connects East Africa to Europe and Asia via multiple landing points including Kenya. DARE (Digital Acceleration Resources for Everyone) adds further capacity and redundancy.

## The Terrestrial Link to Nairobi

From the landing stations, fibre-optic cables run approximately 500 kilometres inland to Nairobi, where they connect to data centre facilities and the KIXP internet exchange. Multiple operators run parallel routes for redundancy, so a single cable cut does not disconnect the country. Liquid Intelligent Technologies, Safaricom, Telkom Kenya, and others maintain terrestrial fibre between the coast and the capital. The journey from Mombasa to Nairobi takes data a few milliseconds, which is negligible for most applications.

## SEACOM's East African Role

SEACOM deserves special mention for its role in East African connectivity. Beyond the submarine cable itself, SEACOM has invested in terrestrial fibre networks and Points of Presence (PoPs) in Nairobi and other cities. These PoPs allow content providers and network operators to connect directly to SEACOM's network, improving performance for users across the region. SEACOM's investment has helped make Kenyan data centres more attractive by ensuring multiple high-capacity international routes are available.

## Why Redundancy Matters

Having multiple cables landing at Mombasa is crucial for resilience. Undersea cables can be damaged by ship anchors, underwater landslides, or natural disasters. When the TEAMS cable was damaged in 2012, Kenya's internet traffic was rerouted through SEACOM and other routes. The more independent cable paths available, the more resilient Kenya's connection to the global internet becomes. Data centre operators in Nairobi routinely design their connectivity with this in mind, subscribing to multiple international routes for failover.

## Economic Impact

Mombasa's role as a digital gateway has significant economic implications. Lower international bandwidth costs, enabled by competition among cable operators, have made internet access more affordable for Kenyans. Businesses can host services in Nairobi data centres knowing they have fast, reliable international connectivity. Content providers and cloud companies are more willing to establish a presence in Kenya when they know the connectivity is robust. All of this flows from the cables that land at Mombasa.

## Future Developments

New cable systems continue to be planned for the East African coast. As demand for bandwidth grows with increased video streaming, cloud computing, and AI workloads, additional capacity will be needed. Mombasa's established landing station infrastructure positions it well to accommodate new cables, and Kenya's data centres stand to benefit from each new connection.""",
            "readingTimeMin": 7,
            "sortOrder": 7,
            "claims": [
                {
                    "claim": "Mombasa hosts landing stations for the SEACOM, TEAMS, EASSy, and DARE undersea fibre-optic cable systems.",
                    "source": "SEACOM infrastructure reports and Kenya Communications Authority records",
                    "confidence": "High"
                },
                {
                    "claim": "SEACOM went live in 2009 and was among the first privately funded submarine cables to land in East Africa, significantly reducing bandwidth costs.",
                    "source": "SEACOM corporate history and World Bank connectivity reports",
                    "confidence": "High"
                },
                {
                    "claim": "Multiple terrestrial fibre operators maintain redundant routes between Mombasa landing stations and Nairobi data centres.",
                    "source": "Liquid Intelligent Technologies, Safaricom, and Telkom Kenya network disclosures",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "Kenya's Data Centre Market Explained",
            "slug": "kenyas-data-centre-market-explained",
            "tlDr": "Kenya's data centre market is growing steadily, driven by mobile money, digital banking, cloud adoption, and government digitisation, with demand increasingly shifting towards carrier-neutral colocation facilities.",
            "description": "Breaks down the dynamics of Kenya's data centre market including demand drivers, supply constraints, pricing trends, and competitive forces.",
            "content": """## Market Size and Growth

Kenya's data centre market is small by global standards but significant within East Africa. Analysts estimate the market generates tens of millions of dollars in annual revenue from colocation, managed hosting, and related services. Growth has been steady at double-digit rates over the past five years, driven by Kenya's expanding digital economy. The market is expected to continue growing as more Kenyan businesses migrate from on-premise servers to professional data centre environments, and as international providers establish East African operations.

## What Customers Are Buying

The primary demand for data centre services in Kenya comes from several segments. Financial institutions, including banks, insurance companies, and mobile money operators, are the largest spenders, requiring Tier III-equivalent facilities with high security and connectivity. Telecom operators need space for network equipment and core systems. Government agencies are increasing their data centre usage as e-government services expand. A growing segment is tech companies and enterprises adopting cloud and hybrid IT models that need local infrastructure to complement international cloud services.

## Colocation vs In-House

A significant trend in Kenya is the shift from enterprises running their own data centres to leasing space in professional colocation facilities. Banks and large companies historically built their own facilities, but the capital and operational costs of maintaining a modern data centre are substantial. Colocation providers like Africa Data Centres, iXAfrica, and PAIX offer shared infrastructure, including power, cooling, security, and connectivity, allowing customers to focus on their IT equipment rather than facility management.

## Pricing and Affordability

Data centre pricing in Kenya is higher than in established markets like South Africa, partly because of higher power costs, smaller scale, and the premium on specialised facilities. Power from Kenya Power is relatively expensive compared to South Africa's historically cheap (though increasingly troubled) grid. However, the total cost of using a Kenyan data centre can be competitive for East African businesses because it avoids the latency and data transfer costs of routing traffic to South Africa or further abroad.

## Power: The Persistent Challenge

Power is the single biggest operating cost for Kenyan data centres. While Kenya has significant geothermal capacity, grid power from Kenya Power is not cheap, and reliability varies. Data centre operators supplement grid power with UPS systems and diesel generators, adding capital and fuel costs. Some operators are exploring solar power and power purchase agreements with independent generators to reduce costs and increase sustainability. The power question is central to the competitiveness of Kenya's data centre market.

## Regulatory Environment

The Communications Authority of Kenya regulates the broader telecom and ICT sector, while the Kenya Data Protection Act 2019 governs how personal data is handled. Licensing requirements for data centre operators are relatively straightforward, though building permits and power connections can involve lengthy processes. The government's overall posture towards digital infrastructure is supportive, though specific policies favouring data centre investment could be strengthened.

## Competitive Landscape

Kenya's data centre market is competitive but not overcrowded. Africa Data Centres, iXAfrica, PAIX, and Liquid Intelligent Technologies compete for commercial colocation customers, while Safaricom and others operate primarily for their own needs. This competition benefits customers through better facilities, more connectivity options, and competitive pricing. As demand grows, the market is likely to attract additional operators, both regional and international.""",
            "readingTimeMin": 7,
            "sortOrder": 8,
            "claims": [
                {
                    "claim": "Kenya's data centre market has grown at double-digit rates over the past five years, driven by digital banking, mobile money, and cloud adoption.",
                    "source": "Structure Research and Data Centre Dynamics Africa market reports",
                    "confidence": "Medium",
                    "notes": "Growth rate figures vary by source and measurement methodology."
                },
                {
                    "claim": "Power from Kenya Power is one of the highest operating costs for data centre operators in Kenya, influencing overall market pricing.",
                    "source": "Kenya Power tariffs and operator cost disclosures",
                    "confidence": "High"
                },
                {
                    "claim": "Kenya's Data Protection Act 2019 governs personal data handling but does not impose strict data localisation requirements for all sectors.",
                    "source": "Kenya Data Protection Act 2019 and Office of the Data Protection Commissioner guidance",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "Kenya vs South Africa Data Centres",
            "slug": "kenya-vs-south-africa-data-centres",
            "tlDr": "South Africa has a larger and more mature data centre market with hyperscale cloud providers, but Kenya's geographic position, faster digital adoption, and role as an East African gateway give it distinct advantages in its region.",
            "description": "Compares Kenya and South Africa's data centre markets across size, infrastructure, connectivity, and strategic positioning.",
            "content": """## Scale: South Africa Leads

South Africa has by far the largest data centre market in sub-Saharan Africa. The country has attracted investment from hyperscale cloud providers: Microsoft Azure launched its first African cloud region in South Africa in 2019, Amazon Web Services opened a Cape Town region, and Google has established a cloud presence. South Africa's total data centre capacity dwarfs Kenya's, measured in both square metres of floor space and megawatts of power. Johannesburg and Cape Town are major hubs with multiple large commercial facilities.

## Connectivity: Different Strengths

South Africa's advantage lies in its longer history of undersea cable connectivity, with cables like SAT-3/WASC/SAFE, WACS, ACE, and others landing at multiple coastal points. Kenya's strength is its central East African position: it is the natural gateway for undersea cables serving landlocked countries like Uganda, Rwanda, Burundi, and South Sudan. A data centre in Nairobi can serve the broader East African region with lower latency than one in Johannesburg. South Africa is better connected to Europe and the Americas, while Kenya is better positioned to serve the East African interior.

## The Hyperscale Gap

The most significant difference is the presence of hyperscale cloud providers. South Africa hosts AWS, Microsoft Azure, and Google Cloud regions, meaning businesses can run workloads in-country with low latency. Kenya does not yet have a hyperscale cloud region, which means Kenyan businesses using AWS, Azure, or Google Cloud must connect to facilities in South Africa, Europe, or elsewhere. This adds latency and can increase costs, though it also creates an opportunity for local operators to build capacity that might one day attract hyperscale investment.

## Power Dynamics

Both countries face power challenges, but of different kinds. South Africa has historically had cheap electricity from Eskom's coal fleet, but load-shedding (planned blackouts) has become a severe problem, forcing data centre operators to rely heavily on generators and solar. Kenya's power is more expensive but more reliable, with geothermal providing a stable baseload. Kenya's power situation, while costly, is arguably more predictable for data centre operations than South Africa's ongoing grid crisis.

## Market Maturity

South Africa's data centre market is more mature, with a wider range of service providers, more sophisticated customers, and deeper capital markets to fund expansion. Kenya's market is younger and smaller but growing faster in percentage terms. South African operators like Africa Data Centres (originally a South African company) have expanded into Kenya, bringing expertise and standards, while Kenyan operators are developing local knowledge and relationships.

## Strategic Positioning

Kenya's positioning as an East African hub is arguably its strongest competitive advantage over South Africa. A data centre in Nairobi is better placed to serve Uganda, Tanzania, Rwanda, Ethiopia, and the DRC than one in Johannesburg, which is geographically distant from these markets. SEACOM and other operators have built terrestrial networks radiating from Kenya into these countries, reinforcing Nairobi's role as a regional interchange point.

## What Kenya Can Learn

Kenya can learn from South Africa's experience attracting hyperscale investment, particularly the importance of regulatory predictability, power reliability, and building a large enough talent pool. South Africa's experience also shows that power grid challenges can undermine even an established market, a lesson Kenya should heed as it develops its infrastructure.""",
            "readingTimeMin": 7,
            "sortOrder": 9,
            "claims": [
                {
                    "claim": "South Africa hosts AWS, Microsoft Azure, and Google Cloud regions, while Kenya does not yet have a hyperscale cloud region.",
                    "source": "AWS, Microsoft Azure, and Google Cloud official region listings",
                    "confidence": "High"
                },
                {
                    "claim": "Kenya's geothermal power provides more reliable baseload electricity for data centres compared to South Africa's coal-dependent grid affected by load-shedding.",
                    "source": "KenGen, Eskom, and industry power reliability assessments",
                    "confidence": "High",
                    "notes": "Kenya's power is more reliable but also more expensive per kilowatt-hour."
                },
                {
                    "claim": "Nairobi is geographically better positioned than Johannesburg to serve landlocked East African markets including Uganda, Rwanda, and South Sudan.",
                    "source": "Geographic analysis and SEACOM network maps",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "Kenya vs Nigeria Data Centres",
            "slug": "kenya-vs-nigeria-data-centres",
            "tlDr": "Nigeria has a larger population and bigger consumer market, but Kenya leads in connectivity density, mobile money adoption, and data centre maturity, giving Nairobi a stronger foundation for serving as a regional digital hub.",
            "description": "Compares Kenya and Nigeria's data centre markets, examining population size, connectivity, regulatory environment, and digital adoption patterns.",
            "content": """## Population vs Connectivity

Nigeria's population of over 200 million makes it Africa's largest market by far, a fact that naturally attracts data centre investment. Lagos, the commercial capital, has a growing data centre market with operators like MDXi (MainOne), Rack Centre, and others. Kenya, with roughly 55 million people, has a much smaller domestic market. However, Kenya has leveraged its smaller population into a stronger per-capita connectivity position. Kenya was one of the first African countries to connect to multiple undersea cables, and its internet bandwidth per person exceeds Nigeria's, giving Kenyan data centres a connectivity edge.

## Mobile Money Leadership

Kenya's M-Pesa is the global benchmark for mobile money, processing billions of dollars in transactions annually through Safaricom's data centre infrastructure. Nigeria has multiple mobile money platforms including Paga, OPay, and the mobile money services offered by MTN and Airtel, but the market is fragmented and the transaction volumes per operator are lower. This means Kenya's data centre demand from mobile money processing is more concentrated and significant than Nigeria's, at least on a per-operator basis.

## Data Centre Operator Landscape

Nigeria's commercial data centre market is anchored by MainOne (now part of Equinix through its Data Centre acquisition), which operates the MDXi facilities in Lagos, and Rack Centre, which was acquired by Actis. These are significant facilities by African standards. Kenya's market features Africa Data Centres, iXAfrica, PAIX, and Liquid Intelligent Technologies. Nigeria's facilities tend to be larger in absolute terms due to the bigger domestic market, but Kenya's are more strategically connected to the broader East African region.

## Power Challenges: Different Problems

Both countries face power difficulties, but the nature differs. Nigeria's national grid is notoriously unreliable, with frequent outages and limited generating capacity. Data centre operators in Lagos must rely almost entirely on their own generation, typically diesel and increasingly gas. Kenya's grid, while more reliable, is expensive. Kenya Power's tariffs are among the higher in Africa, which drives up data centre operating costs. Neither country has solved the power challenge, but Nigeria's is arguably more severe in terms of reliability while Kenya's is more about cost.

## Regulatory Environment

Kenya's regulatory environment for data centres is generally considered more predictable than Nigeria's. The Communications Authority of Kenya provides clear licensing frameworks, and the country's Data Protection Act 2019 gives companies legal certainty around data handling. Nigeria's regulatory landscape is more complex, with overlapping jurisdictions between the Nigerian Communications Commission (NCC), the National Information Technology Development Agency (NITDA), and other bodies. However, Nigeria's larger market means operators are willing to navigate the complexity.

## Regional Hub Potential

Kenya and Nigeria both aspire to be regional data centre hubs, but they serve different regions. Kenya's natural market is East Africa: Uganda, Tanzania, Rwanda, Ethiopia, and the Great Lakes region. Nigeria's market is West Africa: Ghana, Senegal, Côte d'Ivoire, and the broader Economic Community of West African States (ECOWAS) zone. Both regions have substantial populations and growing digital economies, and both Kenya and Nigeria are building the infrastructure to serve them.

## The Investment Race

Both countries are attracting data centre investment, but from different sources. Kenya benefits from its connectivity advantages and stable business environment, while Nigeria attracts investment through sheer market size. Equinix's acquisition of MainOne's data centres in Nigeria signals serious international interest. Kenya's challenge is to translate its connectivity and ecosystem advantages into the kind of large-scale investment that Nigeria's market size naturally attracts.""",
            "readingTimeMin": 7,
            "sortOrder": 10,
            "claims": [
                {
                    "claim": "Nigeria's population exceeds 200 million while Kenya's is approximately 55 million, giving Nigeria a much larger domestic data centre market.",
                    "source": "World Bank population data and national statistics bureaus",
                    "confidence": "High"
                },
                {
                    "claim": "Equinix acquired MainOne's data centre operations in Nigeria (MDXi Lagos), signalling international confidence in the Nigerian market.",
                    "source": "Equinix acquisition announcements and press releases",
                    "confidence": "High"
                },
                {
                    "claim": "Kenya has higher internet bandwidth per capita than Nigeria due to earlier and denser undersea cable connectivity.",
                    "source": "Internet World Stats and Communications Authority of Kenya vs Nigerian Communications Commission data",
                    "confidence": "Medium",
                    "notes": "Per-capita figures vary by year and measurement but Kenya generally leads."
                }
            ]
        },
    ]

    print(f"Seeding {len(articles)} Kenya articles...")

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
            "Kenya",
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
