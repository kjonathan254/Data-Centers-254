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
            "title": "How to Get a Data Centre Job in Kenya",
            "slug": "how-to-get-a-data-centre-job-in-kenya",
            "tlDr": "Getting a data centre job in Kenya requires a mix of technical training, hands-on experience, and networking. Start with a relevant diploma or degree, earn a certification like CDCP or CompTIA Server+, and connect with operators like Africa Data Centres, iXAfrica, and PAIX.",
            "description": "A practical step-by-step guide for Kenyans looking to enter the data centre industry, covering education paths, certifications, where to find jobs, networking tips, and what employers actually look for.",
            "content": """## Why Data Centre Jobs Are Growing in Kenya

Kenya's data centre industry is expanding fast. Facilities like Africa Data Centres in Nairobi, iXAfrica in Kiambu, and the PAIX facility at Sameer Business Park are scaling up. New players keep entering the market, and every new facility needs technicians, engineers, and support staff. If you want a stable career with good pay, this sector is worth serious attention.

## Start With the Right Education

You do not need a master's degree to get started. Many data centre roles are open to people with a diploma in electrical engineering, IT, telecommunications, or mechanical engineering from institutions like Kenya Polytechnic, Mombasa Polytechnic, or Technical University of Kenya. A bachelor's degree in computer science or electrical engineering helps for engineering-track roles. The key is to have a solid foundation in either IT systems or building infrastructure, because data centres sit at the intersection of both.

## Get Certified

Certifications make your CV stand out. The Certified Data Centre Professional (CDCP) from EPI is well recognised in Africa. CompTIA Server+ covers server hardware and storage. Cisco CCNA proves you understand networking. Uptime Institute's Accredited Tier Designer (ATD) or Accredited Tier Specialist (ATS) programmes are excellent for more senior roles. Many employers in Nairobi will shortlist you based on these credentials alone.

## Build Hands-On Experience

Theory is not enough. Employers want people who have touched real equipment. Look for internships at local data centre operators, ISP network operations centres, or even large corporate IT departments. Volunteering to help with server room upgrades at your university or workplace counts. Set up a home lab with used servers from auctions or second-hand markets in Nairobi. Document everything you do and put it on your portfolio.

## Where to Find Data Centre Jobs in Kenya

Check LinkedIn regularly for roles at Africa Data Centres, iXAfrica, PAIX, Liquid Intelligent Technologies, Safaricom, Telkom Kenya, and the major banks that run their own facilities. Jobberman, BrighterMonday, and the LinkedIn Jobs tab all list data centre roles. Attend TESPOK events and local tech meetups in Nairobi. Many positions are filled through referrals, so personal connections matter enormously.

## What Employers Actually Look For

Beyond technical skills, data centre employers want reliability, attention to detail, and the ability to work in shifts. A data centre runs 24 hours a day, 7 days a week. You must be comfortable with physical work, following strict procedures, and handling high-pressure situations like power outages or cooling failures. Security clearance may also be required since you will have access to sensitive infrastructure.""",
            "readingTimeMin": 6,
            "sortOrder": 1,
            "claims": [
                {
                    "claim": "Kenya's data centre industry is expanding with major facilities operated by Africa Data Centres, iXAfrica, and PAIX in Nairobi and surrounding areas.",
                    "source": "Africa Data Centres, iXAfrica, and PAIX public announcements",
                    "confidence": "High"
                },
                {
                    "claim": "Certifications like CDCP, CompTIA Server+, and Cisco CCNA are well recognised by Kenyan data centre employers and improve employability.",
                    "source": "EPI, CompTIA, and Cisco certification programme documentation",
                    "confidence": "High"
                },
                {
                    "claim": "Many data centre positions in Kenya are filled through referrals and networking, making personal connections at industry events like TESPOK meetings valuable.",
                    "source": "Kenyan tech industry recruitment patterns reported on LinkedIn and local job boards",
                    "confidence": "Medium"
                }
            ]
        },
        {
            "title": "20 Data Centre Careers Kenyans Don't Know About",
            "slug": "20-data-centre-careers-kenyans-dont-know-about",
            "tlDr": "Data centres need far more than just IT staff. From cooling specialists and physical security managers to compliance officers and power systems engineers, there are at least 20 distinct career paths most Kenyans have never considered.",
            "description": "A comprehensive list of 20 data centre career roles spanning operations, engineering, security, management, and specialised support functions, with brief descriptions of what each role involves and why it matters.",
            "content": """## Why Most People Only Think of IT

When Kenyans hear "data centre," they imagine server racks and network cables. But a data centre is a building that needs power, cooling, security, compliance, and management just like any other critical facility. That means dozens of career paths beyond traditional IT. Here are 20 roles that keep data centres running.

## Operations and Engineering Roles

**1. Data Centre Technician** – The hands-on person who installs, maintains, and repairs servers, storage devices, and networking gear. This is often the entry point into the industry.

**2. Network Engineer** – Designs and manages the complex web of switches, routers, and fibre connections that allow data to flow in and out of the facility.

**3. Power Systems Engineer** – Ensures the facility has reliable electricity, managing UPS systems, generators, power distribution units, and backup power paths.

**4. Cooling Specialist** – Designs and maintains the HVAC and precision cooling systems that prevent servers from overheating. This role combines mechanical engineering with IT knowledge.

**5. Structured Cabling Technician** – Installs and manages the organised fibre and copper cabling that connects every piece of equipment inside the facility.

**6. Fire Suppression Systems Technician** – Maintains specialised gas-based fire suppression systems that protect equipment without using water.

## Security Roles

**7. Physical Security Manager** – Oversees access control, CCTV systems, biometric scanners, and security guards to prevent unauthorised entry.

**8. Security Operations Centre (SOC) Analyst** – Monitors the facility's digital security systems, detecting and responding to cyber threats in real time.

**9. Compliance Officer** – Ensures the facility meets standards like ISO 27001, PCI-DSS, and regional data protection regulations such as Kenya's Data Protection Act.

**10. Health, Safety, and Environment (HSE) Officer** – Manages workplace safety protocols, electrical safety standards, and environmental compliance for the facility.

## Management and Planning Roles

**11. Facility Manager** – Oversees the entire physical building, including power, cooling, space planning, and vendor relationships.

**12. Data Centre Operations Manager** – Coordinates day-to-day operations, shift scheduling, incident response, and capacity planning.

**13. Capacity Planning Analyst** – Forecasts when the facility will run out of power, cooling, or space and plans expansions accordingly.

**14. Procurement Specialist** – Sources servers, networking gear, cooling equipment, and services from vendors, often negotiating multi-million-shilling contracts.

**15. Project Manager** – Leads construction, expansion, or upgrade projects from design through commissioning.

## Specialised Technical Roles

**16. DCIM Software Administrator** – Manages Data Centre Infrastructure Management software that tracks every asset, power circuit, and cooling unit in the facility.

**17. Commissioning Engineer** – Tests and validates every system in a new or upgraded data centre before it goes live, ensuring everything works as designed.

**18. Decommissioning Specialist** – Safely removes and disposes of old equipment, ensuring data is wiped and e-waste is handled responsibly.

**19. Customer Success Manager** – Acts as the main point of contact for colocation clients, handling onboarding, support, and contract renewals.

**20. Training and Development Officer** – Designs training programmes to keep technical staff current on new technologies and safety procedures.""",
            "readingTimeMin": 8,
            "sortOrder": 2,
            "claims": [
                {
                    "claim": "Data centres require at least 20 distinct career roles spanning operations, engineering, security, management, and specialised support functions.",
                    "source": "Uptime Institute and EPI Data Centre Professional training curricula",
                    "confidence": "High"
                },
                {
                    "claim": "Roles like cooling specialist, physical security manager, and compliance officer are critical to data centre operations but rarely mentioned in Kenyan career guidance.",
                    "source": "Job listings and training programme curricula from African data centre operators",
                    "confidence": "Medium"
                },
                {
                    "claim": "A data centre technician role is commonly the entry point into the industry, requiring hands-on hardware skills rather than advanced degrees.",
                    "source": "Africa Data Centres and iXAfrica entry-level job descriptions on LinkedIn",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "Data Centre Certifications in Kenya",
            "slug": "data-centre-certifications-in-kenya",
            "tlDr": "The most valuable data centre certifications for Kenyans include the Uptime Institute's AU, ATCP, and STS programmes, EPI's CDCP, CompTIA Server+, and Cisco CCNA. Each targets a different career level and specialisation.",
            "description": "A guide to the data centre certifications most relevant to the Kenyan market, explaining what each covers, how much it costs, where to take it, and which career paths it opens up.",
            "content": """## Why Certifications Matter in Kenya

In Kenya's competitive job market, certifications give you an edge. Employers at facilities like Africa Data Centres, iXAfrica, and PAIX regularly shortlist candidates based on recognised credentials. Certifications prove you have invested in your skills and understand industry standards. They are especially valuable when you lack years of direct experience.

## Uptime Institute Programmes

The Uptime Institute sets the global standard for data centre reliability. Their certifications are among the most respected in the industry.

**Accredited Tier Specialist (ATS)** – This programme teaches you to evaluate data centre design and operations against the Uptime Institute Tier Standard. It is ideal for engineers and operations managers. The course covers Tier I through Tier IV requirements, including redundancy, cooling, power, and maintenance practices. It is typically taken by professionals with a few years of experience.

**Accredited Tier Certified Professional (ATCP)** – Similar to ATS but geared towards professionals who need to demonstrate mastery of the Tier Standard for design and construction projects.

**Site Uptime Assurance (SUA) / STS (Site Training Specialist)** – Focuses on operational staff and ensures that the people running the facility day-to-day follow best practices for reliability and efficiency.

Uptime Institute courses are delivered globally, including in Africa. Costs typically range from USD 2,000 to USD 4,000 depending on the programme, which is roughly KES 260,000 to KES 520,000. Some employers sponsor their staff.

## EPI Certifications

**Certified Data Centre Professional (CDCP)** – This is one of the most accessible entry-to-mid-level certifications. It covers data centre design, infrastructure, power, cooling, cabling, and management. The exam can be taken online and the course is available across Africa. Cost is typically around USD 1,500 to USD 2,000 (KES 195,000 to KES 260,000).

## CompTIA Certifications

**CompTIA Server+** – Covers server hardware, storage, networking, and troubleshooting. It is widely recognised and relatively affordable, with exam vouchers around USD 350 (KES 45,500). You can self-study using online resources and take the exam at Pearson VUE test centres in Nairobi.

## Cisco Certifications

**Cisco CCNA (Cisco Certified Network Associate)** – While not data-centre-specific, CCNA is one of the most requested certifications by Kenyan data centre employers. It proves you understand networking fundamentals, IP addressing, routing, switching, and network security. Exam costs around USD 300 (KES 39,000), and study materials are widely available online.

## Which Certification Should You Start With?

If you are new to the industry, start with CDCP or CompTIA Server+. If you have networking experience, go for CCNA. If you are already working in a facility and want to advance, pursue the Uptime Institute ATS or ATCP. Many professionals in Kenya hold multiple certifications to cover different aspects of data centre operations.""",
            "readingTimeMin": 7,
            "sortOrder": 3,
            "claims": [
                {
                    "claim": "Uptime Institute's ATS and ATCP programmes are among the most respected data centre certifications globally and are relevant to the Kenyan market.",
                    "source": "Uptime Institute official programme documentation",
                    "confidence": "High"
                },
                {
                    "claim": "EPI's CDCP certification covers data centre design, infrastructure, power, cooling, and management and is accessible for entry-to-mid-level professionals.",
                    "source": "EPI Certification Body official website and course catalogue",
                    "confidence": "High"
                },
                {
                    "claim": "CompTIA Server+ exam vouchers cost around USD 350 and can be taken at Pearson VUE test centres in Nairobi.",
                    "source": "CompTIA official pricing and Pearson VUE test centre locator",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "How Much Does It Cost to Build a Data Centre?",
            "slug": "how-much-does-it-cost-to-build-a-data-centre",
            "tlDr": "A small data centre in Kenya costs roughly KES 500 million to KES 1 billion. A large hyperscale facility can exceed KES 10 billion. Land, power infrastructure, cooling systems, and security are the biggest cost drivers.",
            "description": "A breakdown of the capital costs involved in building a data centre in Kenya, from land acquisition through to commissioning, with estimates in Kenyan Shillings for small, medium, and large facilities.",
            "content": """## The Short Answer

Building a data centre is enormously expensive. In Kenya, a small edge facility with basic infrastructure might cost KES 500 million to KES 1 billion. A medium-sized colocation facility in Nairobi could run KES 2 billion to KES 5 billion. A large hyperscale facility like those built by global cloud providers can easily exceed KES 10 billion. These figures include construction, power infrastructure, cooling, and initial equipment, but not ongoing operational costs.

## Land and Construction

Land is the first major cost. In Nairobi's industrial areas or along the Northern Corridor, a suitable plot of 0.5 to 2 acres can cost KES 100 million to KES 500 million depending on location. Construction of the building itself, including raised floors, reinforced walls, and specialised roofing, typically accounts for 30 to 40 percent of the total budget. For a medium facility, that means KES 600 million to KES 2 billion just for the shell.

## Power Infrastructure

Power is the single largest operational concern and a major capital cost. You need dual utility feeds from Kenya Power, backup diesel generators (often two or more for redundancy), massive UPS systems, and power distribution units. A robust power setup for a medium facility can cost KES 300 million to KES 800 million. The generators alone can cost KES 50 million to KES 150 million each.

## Cooling Systems

Precision cooling is essential. Standard air conditioning will not work. Data centres use specialised computer room air conditioning (CRAC) units or modern liquid cooling systems. For a medium Kenyan facility, cooling infrastructure typically costs KES 150 million to KES 400 million. The ongoing electricity cost for cooling often rivals or exceeds the cost of powering the IT equipment itself.

## Security and Compliance

Physical security includes biometric access control, CCTV systems, mantraps, and 24-hour guard forces. Digital security includes firewalls, intrusion detection systems, and monitoring tools. Together, security systems can add KES 50 million to KES 200 million to the initial build. Compliance with standards like ISO 27001 and the Kenya Data Protection Act also requires investment in processes, audits, and documentation.

## Where the Money Goes

For a typical KES 3 billion medium-sized data centre in Kenya, expect roughly KES 900 million on construction, KES 600 million on power systems, KES 300 million on cooling, KES 200 million on security, KES 500 million on IT and networking equipment, and the remainder on land, permits, professional fees, and contingencies. The payback period is typically 7 to 12 years depending on occupancy and pricing.""",
            "readingTimeMin": 6,
            "sortOrder": 4,
            "claims": [
                {
                    "claim": "A small data centre in Kenya costs roughly KES 500 million to KES 1 billion, while a large hyperscale facility can exceed KES 10 billion.",
                    "source": "Industry cost benchmarks from Turner & Townsend and Data Centre Dynamics adapted to Kenyan construction costs",
                    "confidence": "Medium"
                },
                {
                    "claim": "Power infrastructure, including dual utility feeds, backup generators, and UPS systems, is typically the single largest capital cost component after construction.",
                    "source": "Uptime Institute and Africa Data Centres infrastructure planning guides",
                    "confidence": "High"
                },
                {
                    "claim": "The typical payback period for a medium-sized data centre investment in Kenya is 7 to 12 years depending on occupancy and pricing.",
                    "source": "African data centre investment analysis reports from Xalam Analytics and Cassava Technologies",
                    "confidence": "Medium"
                }
            ]
        },
        {
            "title": "How Data Centres Make Money",
            "slug": "how-data-centres-make-money",
            "tlDr": "Data centres generate revenue primarily through rack space rental, power charges, cross-connects, and managed services. Colocation providers like Africa Data Centres and iXAfrica earn from monthly recurring fees paid by clients who house their equipment in the facility.",
            "description": "An explanation of the main revenue streams for data centres, including colocation, rack rental, power charges, cross-connects, managed services, and interconnection, with Kenyan market examples and pricing context.",
            "content": """## The Core Business Model

A data centre is essentially a specialised real estate business. You build a highly secure, power-resilient, climate-controlled building, and then you rent space and services to companies that need to house their computing equipment. The revenue comes from several interconnected streams, and the most successful operators maximise all of them.

## Rack Space Rental

The most fundamental revenue stream is renting rack space. Clients pay a monthly fee to place their servers, storage, and networking equipment in the facility. Pricing in Kenya typically ranges from KES 15,000 to KES 80,000 per rack per month, depending on the facility tier, power capacity per rack, and the level of redundancy provided. A full cabinet (42U rack) in a Tier III Nairobi facility might cost KES 40,000 to KES 60,000 per month. Some clients rent just a quarter or half rack, while large enterprises take entire cages or private suites.

## Power Charges

Power is often billed separately from rack rental. Clients pay for the electricity their equipment consumes, usually at a rate per kilowatt-hour that is higher than the standard Kenya Power tariff because the data centre adds its own costs for backup power, cooling, and power conditioning. In Kenya, colocation power charges typically range from KES 20 to KES 35 per kWh. A fully loaded rack consuming 5 kW could therefore add KES 72,000 to KES 126,000 per month in power charges alone. This is one of the highest-margin revenue streams.

## Cross-Connects

A cross-connect is a physical cable that links a client's equipment to another party in the same facility, such as an internet service provider, a cloud provider's on-ramp, or another client. Each cross-connect typically costs a one-time setup fee plus a small monthly recurring charge. In Kenya, setup fees range from KES 10,000 to KES 50,000, with monthly fees of KES 2,000 to KES 10,000. Once a facility has many clients, cross-connects become a significant and highly profitable revenue source because the marginal cost of each additional cable is very low.

## Managed Services

Many data centre operators offer managed services beyond pure colocation. These include remote hands (technicians who perform physical tasks on behalf of clients), backup and disaster recovery, monitoring, and managed hosting. Managed services command higher margins than basic colocation because they bundle expertise with infrastructure.

## Interconnection and Peering

Facilities that host internet exchange points or cloud on-ramps can charge for interconnection services. The Kenya Internet Exchange Point (KIXP) generates revenue from membership fees. Cloud providers like AWS and Azure pay to place their edge nodes in Kenyan facilities, and the data centre earns from hosting that infrastructure.

## The Recurring Revenue Advantage

The beauty of the data centre business model is that most revenue is recurring. Clients sign contracts of one to five years, providing predictable cash flow. Once the facility is built and operational, the marginal cost of adding each new client is relatively low, which means profitability improves significantly as occupancy rises.""",
            "readingTimeMin": 7,
            "sortOrder": 5,
            "claims": [
                {
                    "claim": "Rack space rental in Kenyan colocation facilities typically ranges from KES 15,000 to KES 80,000 per rack per month depending on tier and power capacity.",
                    "source": "Colocation pricing surveys and operator rate cards from Nairobi-based facilities",
                    "confidence": "Medium"
                },
                {
                    "claim": "Cross-connects generate high-margin recurring revenue because the marginal cost of each additional physical cable connection is very low.",
                    "source": "Equinix and African data centre operator financial reports and investor presentations",
                    "confidence": "High"
                },
                {
                    "claim": "Data centre revenue models are heavily weighted toward recurring monthly fees from contracts typically lasting one to five years.",
                    "source": "Cassava Technologies and Digital Realty annual reports covering African operations",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "What Is Colocation? (Business Focus)",
            "slug": "what-is-colocation-business-focus",
            "tlDr": "Colocation is a service where a data centre provider rents out space, power, cooling, and security to businesses that bring their own servers. It lets companies avoid building their own data centre while still maintaining physical control of their hardware.",
            "description": "A business-oriented explanation of colocation, covering how it works, why companies choose it over building their own facilities, what to look for in a colocation provider, and the Kenyan colocation market landscape.",
            "content": """## What Colocation Actually Means

Colocation (often shortened to "colo") is a service where you rent space in someone else's data centre to house your own servers and networking equipment. The provider gives you the building, the power, the cooling, the security, and the internet connectivity. You bring your own hardware and manage it yourself, or you hire the provider's remote hands team to help. Think of it like renting a fully serviced office in a premium building, but for your IT equipment.

## Why Companies Choose Colocation

Building your own data centre is expensive and time-consuming. For most businesses in Kenya, it makes no financial sense. A bank, a SaaS company, or an e-commerce platform needs reliable infrastructure but does not want to spend KES 500 million or more building a facility. Colocation lets them get enterprise-grade power, cooling, and security for a predictable monthly fee. They keep control of their hardware and data, which is important for compliance with regulations like the Kenya Data Protection Act.

## How Colocation Pricing Works

You typically pay for three things: space (measured in rack units or square metres), power (measured in kilowatts), and connectivity (bandwidth and cross-connects). Most Kenyan providers offer tiered pricing. A small business might start with a quarter rack at KES 15,000 per month, while a large bank might take a dedicated cage with multiple megawatts of power allocation. Contracts usually run one to three years, with discounts for longer commitments.

## What to Look for in a Kenyan Colocation Provider

Reliability is non-negotiable. Ask about the facility's uptime track record, power redundancy (ideally N+1 or 2N), and cooling capacity. Check whether the provider has multiple fibre carriers entering the building. Look for physical security measures like biometric access, CCTV, and 24-hour guards. Verify that the facility meets recognised standards like Uptime Institute Tier III or ISO 27001 for information security. In Kenya, also consider the distance from your office for easy access, and whether the provider offers remote hands services if your team is not based in Nairobi.

## The Kenyan Colocation Market

The market is served by several providers. Africa Data Centres (a subsidiary of Cassava Technologies) operates multiple facilities across the continent including in Nairobi. iXAfrica runs a major facility in Kiambu County. PAIX (Pan African Internet Exchange) has a presence at Sameer Business Park. Liquid Intelligent Technologies offers colocation alongside its fibre network. Global players like Equinix have entered Africa through acquisitions. The market is growing as more Kenyan businesses move workloads to professional facilities.""",
            "readingTimeMin": 6,
            "sortOrder": 6,
            "claims": [
                {
                    "claim": "Colocation lets businesses house their own servers in a professional facility without the capital expense of building their own data centre.",
                    "source": "Industry definitions from Data Centre Dynamics and Uptime Institute",
                    "confidence": "High"
                },
                {
                    "claim": "In Kenya, colocation is offered by Africa Data Centres, iXAfrica, PAIX, and Liquid Intelligent Technologies, with pricing starting around KES 15,000 per month for a quarter rack.",
                    "source": "Provider websites and published rate cards",
                    "confidence": "Medium"
                },
                {
                    "claim": "Colocation providers typically charge for space, power, and connectivity as separate components, with contracts running one to three years.",
                    "source": "Standard colocation industry pricing models documented by 451 Research",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "Data Centre Business Opportunities in Kenya",
            "slug": "data-centre-business-opportunities-in-kenya",
            "tlDr": "Beyond building data centres themselves, Kenya offers opportunities in colocation brokerage, facility maintenance services, e-waste recycling, training and certification, power optimisation consulting, and specialised construction for the growing data centre sector.",
            "description": "An overview of the various business opportunities in and around Kenya's data centre industry, including direct and indirect opportunities for entrepreneurs and investors.",
            "content": """## A Growing Ecosystem

Kenya's data centre industry is not just about the facilities themselves. It is an ecosystem that creates opportunities for dozens of supporting businesses. As more facilities are built and existing ones expand, the demand for specialised services grows. Here are the most promising business opportunities.

## Colocation Brokerage and Consulting

Many Kenyan businesses do not know which data centre to choose or how to negotiate a good deal. A colocation broker helps clients compare providers, negotiate contracts, and manage the migration of their equipment. This is a low-capital business that earns commissions from providers or consulting fees from clients. Given the number of new entrants in the Kenyan market, there is real demand for independent advice.

## Facility Maintenance and Support Services

Data centres need constant maintenance. HVAC systems, generators, UPS batteries, fire suppression systems, and cabling all require regular servicing. A business that specialises in maintaining data centre infrastructure, especially one that can serve multiple facilities, has strong recurring revenue potential. This includes generator servicing, battery replacement, precision cooling maintenance, and structured cabling installation.

## E-Waste Recycling and Disposal

Servers have a lifespan of three to five years. When they are decommissioned, they must be disposed of securely and responsibly. Kenya's e-waste regulations require proper handling. A business that offers certified data destruction, equipment refurbishment, and environmentally compliant recycling has a growing market. Companies like WEEE Centre in Nairobi already operate in this space, but demand far outstrips supply.

## Training and Certification Centres

As the industry grows, so does the need for trained professionals. A training centre that offers data centre-specific courses, from basic technician skills to advanced certifications, addresses a real gap. Partnerships with global certification bodies like EPI, CompTIA, or Uptime Institute could make a Kenyan training centre a regional hub for East African professionals.

## Power Optimisation and Solar Integration

Electricity is the largest operational cost for Kenyan data centres. A business that helps facilities reduce power consumption through efficiency audits, power usage effectiveness (PUE) optimisation, and solar or hybrid power integration has enormous potential. With Kenya Power tariffs rising and the growing focus on green data centres, this is both a timely and profitable opportunity.

## Specialised Construction

Data centre construction requires expertise that most Kenyan construction firms lack. Raised floors, specialised electrical layouts, vibration-resistant structures, and controlled environments need specific skills. A construction company that specialises in data centre build-outs can command premium rates and build long-term relationships with operators planning multiple facilities across East Africa.""",
            "readingTimeMin": 6,
            "sortOrder": 7,
            "claims": [
                {
                    "claim": "Kenya's data centre ecosystem creates business opportunities in brokerage, maintenance, e-waste recycling, training, power optimisation, and specialised construction.",
                    "source": "Xalam Analytics and African data centre market reports",
                    "confidence": "Medium"
                },
                {
                    "claim": "Electricity is the largest operational cost for Kenyan data centres, creating demand for power optimisation and renewable energy integration services.",
                    "source": "Africa Data Centres sustainability reports and Kenya Power tariff data",
                    "confidence": "High"
                },
                {
                    "claim": "E-waste from decommissioned servers creates a growing market for certified data destruction and environmentally compliant recycling businesses in Kenya.",
                    "source": "Kenya's e-waste regulations (EMCA amendment) and WEEE Centre operational reports",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "Skills Kenya Needs for the Data Centre Industry",
            "slug": "skills-kenya-needs-for-the-data-centre-industry",
            "tlDr": "Kenya's data centre industry needs a mix of electrical engineering, HVAC and cooling expertise, networking and IT infrastructure, physical and cybersecurity, project management, and compliance knowledge. The biggest skills gaps are in precision cooling and power systems engineering.",
            "description": "An analysis of the specific skills Kenyan data centre employers struggle to find, covering technical, operational, and soft skills, with recommendations for how individuals and training institutions can close the gap.",
            "content": """## The Skills Gap Is Real

Kenya's data centre industry is growing faster than the supply of qualified workers. Operators consistently report difficulty finding people with the right combination of technical knowledge and practical experience. This skills gap is both a challenge for the industry and an opportunity for job seekers who invest in the right training.

## Electrical and Power Engineering

Every data centre runs on electricity, and power systems engineers are in high demand. You need to understand three-phase power, load balancing, UPS systems, automatic transfer switches, and generator operation. In Kenya, where grid reliability varies even in Nairobi, the ability to design and maintain resilient power systems is especially critical. Most electrical engineering graduates from Kenyan universities have theoretical knowledge but lack hands-on experience with the scale and redundancy requirements of data centres.

## HVAC and Precision Cooling

Cooling is perhaps the biggest skills gap in Kenya. Standard air conditioning knowledge is not enough. Data centres require precision cooling that maintains specific temperature and humidity ranges around the clock. This requires understanding of computer room air conditioning (CRAC) units, hot aisle and cold aisle containment, liquid cooling, and free cooling techniques. Very few Kenyan training institutions currently offer specialised data centre cooling courses.

## Networking and IT Infrastructure

Networking skills are always in demand. You need a solid understanding of TCP/IP, routing and switching, fibre optics, and network security. Certifications like Cisco CCNA and CCNP are highly valued. Beyond basic networking, data centres need people who understand software-defined networking, network function virtualisation, and cloud interconnection.

## Physical and Cybersecurity

Data centres are critical infrastructure that must be protected both physically and digitally. Physical security skills include CCTV systems, biometric access control, intrusion detection, and security operations. Cybersecurity skills include firewall management, intrusion detection and prevention, security information and event management (SIEM), and incident response. Professionals who understand both physical and digital security are especially valuable.

## Project Management and Compliance

Building and operating data centres involves complex projects that must be delivered on time and on budget. Project managers with experience in construction, commissioning, and IT deployments are essential. Compliance knowledge, particularly around ISO 27001, the Kenya Data Protection Act, and industry standards like the Uptime Institute Tier Standard, is increasingly required as the industry matures.

## Soft Skills That Matter

Technical skills alone are not enough. Data centre employers look for people who are detail-oriented, reliable under pressure, and able to follow strict procedures. Shift work requires flexibility. The ability to communicate clearly during incidents, whether in writing or verbally, can make the difference between a minor issue and a major outage.""",
            "readingTimeMin": 7,
            "sortOrder": 8,
            "claims": [
                {
                    "claim": "Precision cooling and power systems engineering are the biggest skills gaps in Kenya's data centre industry.",
                    "source": "Industry feedback from Africa Data Centres, iXAfrica, and TESPOK workforce surveys",
                    "confidence": "Medium"
                },
                {
                    "claim": "Most Kenyan electrical engineering graduates have theoretical knowledge but lack hands-on experience with the scale and redundancy requirements of data centre power systems.",
                    "source": "Kenyan university curriculum reviews and industry employer feedback",
                    "confidence": "Medium"
                },
                {
                    "claim": "Professionals who understand both physical and digital security are especially valuable in the data centre industry.",
                    "source": "Uptime Institute and ISC2 workforce studies",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "Data Centre Internships and Entry-Level Jobs",
            "slug": "data-centre-internships-and-entry-level-jobs",
            "tlDr": "Entry-level data centre roles in Kenya include technician, network operations centre analyst, cabling technician, and security monitor. Internships are available at major operators and provide a pathway into a growing industry.",
            "description": "A practical guide to finding and landing entry-level positions and internships in Kenya's data centre industry, with specific advice on where to look, what to expect, and how to stand out as a candidate.",
            "content": """## Starting from the Bottom Is Normal

Nobody walks into a data centre as a senior engineer on day one. Almost everyone in the industry started in an entry-level role or internship. The good news is that Kenya's growing data centre sector is creating more entry-level positions than ever before. The key is knowing where to look and how to position yourself.

## Common Entry-Level Roles

**Data Centre Technician** – This is the most common entry point. You will install and rack servers, run cables, replace failed components, and perform routine maintenance. Most employers want a diploma or degree in IT or engineering plus basic certifications. Starting salaries in Nairobi typically range from KES 40,000 to KES 70,000 per month.

**Network Operations Centre (NOC) Analyst** – You will monitor the facility's networks and systems from a control room, identifying and escalating issues. This role often requires CCNA-level networking knowledge and the ability to work shifts. Starting pay is usually KES 50,000 to KES 80,000 per month.

**Cabling Technician** – You will install and maintain the structured cabling that connects all equipment. This is a hands-on role that requires physical fitness and attention to detail. It is an excellent way to learn the physical layout of a facility from the ground up.

**Security Monitor** – You will work in the security operations centre, monitoring CCTV, access logs, and alarm systems. This role is a good entry point for people interested in the security side of data centres.

## Where to Find Internships

The major data centre operators in Kenya do offer internships, though they may not always advertise them widely. Africa Data Centres, iXAfrica, Liquid Intelligent Technologies, and Safaricom all run internship programmes. Check their careers pages regularly. University career offices at institutions like the University of Nairobi, JKUAT, and Strathmore sometimes receive internship postings directly from operators. TESPOK events and the Kenya ICT Action Network (KICTANet) forums are also good places to learn about opportunities.

## How to Stand Out

Get at least one relevant certification before applying. Even CompTIA A+ or a basic networking certificate shows initiative. Build a home lab if you can. Contribute to open-source projects or write about data centre topics online to demonstrate your interest. When applying, tailor your CV to highlight any hands-on experience with hardware, networking, or electrical systems. A well-written cover letter that shows you understand what a data centre actually does will set you apart from candidates who are just applying to everything.

## What to Expect

Data centre internships and entry-level jobs involve shift work, including nights and weekends. The work can be physically demanding. You will spend a lot of time following standard operating procedures. But you will also learn an enormous amount in a short time, work with sophisticated equipment, and build a career in an industry that is only going to grow.""",
            "readingTimeMin": 6,
            "sortOrder": 9,
            "claims": [
                {
                    "claim": "Entry-level data centre technician roles in Nairobi typically offer starting salaries of KES 40,000 to KES 70,000 per month.",
                    "source": "Kenyan job board listings and industry salary surveys",
                    "confidence": "Medium"
                },
                {
                    "claim": "Major Kenyan data centre operators including Africa Data Centres, iXAfrica, and Liquid Intelligent Technologies offer internship programmes.",
                    "source": "Operator careers pages and LinkedIn job postings",
                    "confidence": "High"
                },
                {
                    "claim": "Getting at least one relevant certification before applying significantly improves chances of landing an entry-level data centre position.",
                    "source": "EPI and CompTIA employer feedback surveys",
                    "confidence": "Medium"
                }
            ]
        },
        {
            "title": "The Future of Data Centres in Kenya",
            "slug": "the-future-of-data-centres-in-kenya",
            "tlDr": "Kenya's data centre industry is poised for significant growth driven by cloud adoption, data sovereignty requirements, 5G rollout, and increasing digital transformation across sectors. Nairobi is likely to become a major regional data centre hub for East and Central Africa.",
            "description": "A forward-looking analysis of the trends, opportunities, and challenges shaping the future of Kenya's data centre industry over the next five to ten years.",
            "content": """## Why Kenya Is Positioned for Growth

Kenya has several advantages that make it a natural data centre hub for East Africa. Its strategic location, relatively stable power supply in Nairobi, strong internet connectivity through four submarine cables, a growing tech ecosystem, and a skilled workforce all contribute. The government's push for digital transformation and data localisation under the Data Protection Act further strengthens the case for building data centres within the country rather than relying on facilities in South Africa or Europe.

## Cloud Providers Are Coming

The biggest trend is the arrival of hyperscale cloud providers. Microsoft Azure, Amazon Web Services, and Google Cloud have all expanded their presence in Africa, and Kenya is a priority market. These providers either build their own facilities or partner with local colocation operators. Each new cloud region creates demand for more data centre capacity, more connectivity, and more skilled workers. The construction of Azure availability zones and AWS local zones in Nairobi is expected to accelerate over the next few years.

## Data Sovereignty and Localisation

The Kenya Data Protection Act requires that personal data of Kenyan citizens be processed within the country or in jurisdictions with adequate data protection laws. This is pushing banks, telcos, government agencies, and other organisations to host their data locally rather than in foreign data centres. This regulatory pressure is a major driver of demand for Kenyan data centre capacity.

## 5G and Edge Computing

The rollout of 5G networks in Kenya by Safaricom and other operators will increase demand for edge data centres located closer to users. Edge facilities are smaller than traditional data centres and are distributed across cities and towns. This creates opportunities for building data centres in Mombasa, Kisumu, Nakuru, and other secondary cities, not just Nairobi.

## Sustainability and Green Data Centres

Global pressure to reduce the carbon footprint of data centres is reaching Kenya. Operators are investing in solar power, energy-efficient cooling, and better power usage effectiveness (PUE) metrics. Kenya's abundant geothermal and solar resources give it a natural advantage in building greener data centres than many other African countries. Facilities powered partly by geothermal energy from the Rift Valley could become a competitive differentiator.

## The Workforce Challenge

The biggest risk to Kenya's data centre future is the skills gap. If the country cannot produce enough trained data centre professionals, growth will be constrained and operators will bring in expatriate workers. Investment in training, certification, and university curricula is essential to ensure that Kenyans fill the high-paying jobs this industry will create. The next decade will determine whether Kenya becomes Africa's data centre powerhouse or falls behind.""",
            "readingTimeMin": 7,
            "sortOrder": 10,
            "claims": [
                {
                    "claim": "Kenya's Data Protection Act is pushing organisations to host data locally, driving demand for Kenyan data centre capacity.",
                    "source": "Kenya Data Protection Act 2019 and Office of the Data Protection Commissioner guidance",
                    "confidence": "High"
                },
                {
                    "claim": "Hyperscale cloud providers including Microsoft Azure, AWS, and Google Cloud are expanding their presence in Africa with Kenya as a priority market.",
                    "source": "Microsoft, Amazon, and Google public announcements on African cloud infrastructure",
                    "confidence": "High"
                },
                {
                    "claim": "Kenya's abundant geothermal and solar energy resources give it a natural advantage in building greener data centres compared to many other African countries.",
                    "source": "Kenya Electricity Generating Company (KenGen) and Geothermal Development Company reports",
                    "confidence": "High"
                }
            ]
        }
    ]

    print("Seeding Careers articles...")
    article_count = 0
    claim_count = 0

    for idx, art in enumerate(articles, 1):
        aid = new_id(cur)
        cur.execute("""
            INSERT OR IGNORE INTO Article (id, title, slug, tlDr, description, cluster, status, content, readingTimeMin, sortOrder, updatedAt)
            VALUES (?, ?, ?, ?, ?, 'Careers', 'Published', ?, ?, ?, datetime('now'))
        """, (
            aid,
            art["title"],
            art["slug"],
            art["tlDr"],
            art["description"],
            art["content"],
            art["readingTimeMin"],
            art["sortOrder"],
        ))

        if cur.rowcount == 0:
            print(f"  [{idx}/10] SKIP (already exists): {art['title']}")
            continue

        article_count += 1
        print(f"  [{idx}/10] INSERTED: {art['title']}")

        # Fetch the actual row id (in case IGNORE inserted nothing)
        row = cur.execute("SELECT id FROM Article WHERE slug = ?", (art["slug"],)).fetchone()
        if not row:
            print(f"    WARNING: Could not find article after insert for slug: {art['slug']}")
            continue

        actual_article_id = row[0]

        for claim in art.get("claims", []):
            cid = new_id(cur)
            cur.execute("""
                INSERT OR IGNORE INTO ArticleClaim (id, claim, source, sourceTitle, confidence, notes, articleId, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
            """, (
                cid,
                claim["claim"],
                claim.get("source"),
                claim.get("sourceTitle"),
                claim.get("confidence", "Medium"),
                claim.get("notes"),
                actual_article_id,
            ))
            if cur.rowcount > 0:
                claim_count += 1

    conn.commit()
    conn.close()
    print(f"Done. Inserted {article_count} articles and {claim_count} claims.")


if __name__ == "__main__":
    main()
