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
            "title": "What Is a Data Centre?",
            "slug": "what-is-a-data-centre",
            "tlDr": "A data centre is a specialised building packed with computers that store, process, and distribute the data behind every app, website, and mobile money transaction you use.",
            "description": "A plain-language introduction to what data centres are, what they look like, and why they matter to everyday Kenyans.",
            "content": """## A Building Full of Computers

Think of a data centre as a very large, very organised version of a computer lab. Instead of a few desktops on desks, you have thousands of powerful computers stacked in metal cabinets inside a highly secure facility. These facilities exist to store, process, and serve the data that powers the digital services you rely on every day.

## What Does It Actually Do?

Every time you open Safaricom's M-Pesa menu, stream a YouTube video, or check your email, a request travels from your phone to a data centre somewhere. The computers inside that building look up your account, find the right video, or fetch your messages, and send the result back \u2014 all in a fraction of a second.

## What Does One Look Like?

A typical data centre has rows of tall metal racks holding servers. Thick bundles of cables run under raised floors. Powerful air-conditioning systems keep the room cool because all those machines generate enormous heat. Backup diesel generators sit outside, ready to kick in if Kenya Power has an outage.

## Why Should You Care?

Kenya is building more data centres every year, particularly around Nairobi. Safaricom, Liquid Intelligent Technologies, and international firms like Amazon and Microsoft all operate or plan facilities here. Understanding what a data centre is helps you see the invisible infrastructure behind your everyday digital life.""",
            "readingTimeMin": 4,
            "sortOrder": 1,
            "claims": [
                {
                    "claim": "Kenya has over 20 operational data centres as of 2024, concentrated mainly in Nairobi.",
                    "source": "Various industry reports and Africa Data Centres publications",
                    "confidence": "Medium",
                    "notes": "Exact count varies by definition (enterprise vs carrier vs hyperscale)."
                },
                {
                    "claim": "Safaricom operates its own data centres in Nairobi to support M-Pesa and voice services.",
                    "source": "Safaricom annual reports",
                    "confidence": "High"
                },
                {
                    "claim": "A single large data centre can consume as much electricity as a small Kenyan town.",
                    "source": "IEA data centre energy reports",
                    "confidence": "Medium",
                    "notes": "Depends heavily on size class; hyperscale facilities approach this level."
                }
            ]
        },
        {
            "title": "How Does a Data Centre Work?",
            "slug": "how-does-a-data-centre-work",
            "tlDr": "A data centre works by receiving your digital requests over the internet, processing them on powerful servers, and sending responses back \u2014 all while keeping everything cool, powered, and secure.",
            "description": "A step-by-step walkthrough of what happens inside a data centre from the moment you tap your phone screen to the moment you get a response.",
            "content": """## Your Request Enters the Building

Imagine you open your banking app to check your balance. Your phone sends a tiny message over the internet \u2014 through cell towers, fibre-optic cables, and network switches \u2014 until it reaches the data centre where your bank keeps its servers. The building's network equipment receives this message first, like a receptionist at the front desk.

## Servers Do the Thinking

Once inside, your request is routed to the right server. A server is just a computer without a screen or keyboard \u2014 it sits on a rack and does calculations all day. It looks up your account in a database, calculates your current balance, and prepares a response. For M-Pesa transactions, this happens tens of thousands of times per second across Safaricom's data centres.

## Keeping Everything Running

Data centres need three things to keep working: power, cooling, and security. If Kenya Power goes down, batteries take over instantly, then diesel generators fire up. Cooling systems \u2014 sometimes using outside air in Nairobi's mild climate \u2014 prevent servers from overheating. Security guards, cameras, and biometric locks protect the physical facility, while firewalls and encryption protect the data.

## The Response Travels Back

The server sends its response through the same network path in reverse. Within milliseconds, your phone displays your balance. This entire journey happens so fast you never notice it.""",
            "readingTimeMin": 5,
            "sortOrder": 2,
            "claims": [
                {
                    "claim": "Most data centres in Nairobi rely on a combination of grid power from Kenya Power, UPS batteries, and diesel generators for redundancy.",
                    "source": "Industry best practices and Kenya Power grid reliability data",
                    "confidence": "High"
                },
                {
                    "claim": "Nairobi's altitude and climate allow some facilities to use free cooling (outside air) for part of the year, reducing energy costs.",
                    "source": "Liquid Intelligent Technologies and Africa Data Centres technical publications",
                    "confidence": "Medium",
                    "notes": "Effectiveness depends on specific facility design and location within Nairobi."
                }
            ]
        },
        {
            "title": "Where Is Your Data Stored?",
            "slug": "where-is-your-data-stored",
            "tlDr": "Your data is stored on servers inside data centres, which could be in Nairobi, elsewhere in Africa, or overseas \u2014 and companies decide based on laws, speed, and cost.",
            "description": "Explains the physical locations where your photos, messages, and financial records actually live, with a focus on Kenyan and African data residency.",
            "content": """## It Lives on a Hard Drive Somewhere

When you save a photo to Google Drive or send money via M-Pesa, that data is written onto a physical storage device \u2014 usually a solid-state drive or hard disk \u2014 inside a server. That server sits in a rack, inside a data centre, somewhere in the world. Your data has a real, physical home.

## Data in Kenya

A lot of your data might be closer than you think. Safaricom stores M-Pesa transaction data in data centres within Kenya, partly because Kenyan banking regulations require it. The Kenya Revenue Authority also requires certain financial records to be kept within the country. Banks like KCB, Equity, and Co-operative Bank maintain servers in Nairobi-area facilities.

## Data That Leaves Kenya

Not everything stays local. When you use WhatsApp, your messages are encrypted and stored on Facebook's servers, which are mostly outside Africa. Your Gmail messages live in Google data centres that could be in the US, Europe, or Asia. Many Kenyan startups host their applications on AWS (Amazon) or Azure (Microsoft), which have no local data centres \u2014 meaning your data crosses undersea cables to reach them.

## Why Location Matters

Where your data is stored affects three things: speed (closer is faster), legal jurisdiction (different countries have different privacy laws), and resilience (having copies in different locations protects against disasters). The concept of data sovereignty \u2014 keeping citizen data within national borders \u2014 is a growing discussion across Africa.

## The Future Is Local

Amazon Web Services plans to open a data centre in South Africa, and Microsoft has already launched Azure regions there. As more infrastructure comes to the continent, more Kenyan data will stay closer to home.""",
            "readingTimeMin": 5,
            "sortOrder": 3,
            "claims": [
                {
                    "claim": "Safaricom stores M-Pesa transaction data within Kenya due to regulatory requirements under the Central Bank of Kenya.",
                    "source": "CBK guidelines on mobile money services",
                    "confidence": "High"
                },
                {
                    "claim": "Most WhatsApp messages from Kenyan users are stored on servers outside the African continent.",
                    "source": "Meta's transparency reports and data centre locations",
                    "confidence": "High"
                },
                {
                    "claim": "Kenya does not yet have a comprehensive data protection law requiring all citizen data to be stored domestically.",
                    "source": "Kenya Data Protection Act 2019 analysis",
                    "confidence": "Medium",
                    "notes": "The 2019 Act exists but does not mandate strict data localisation for all sectors."
                }
            ]
        },
        {
            "title": "What Happens to Your M-Pesa Data?",
            "slug": "what-happens-to-your-m-pesa-data",
            "tlDr": "Every M-Pesa transaction creates a digital record stored in Safaricom's Kenyan data centres, protected by encryption, regulated by the Central Bank, and kept for years.",
            "description": "Traces the journey of a single M-Pesa transaction from your phone to Safaricom's servers and explains what happens to that data afterward.",
            "content": """## From Your Phone to the Server

When you send Ksh 1,000 to a friend via M-Pesa, your phone sends an encrypted message to Safaricom's systems. This message travels through the mobile network to a data centre \u2014 likely one of Safaricom's facilities in Nairobi. A server there validates your PIN, checks your balance, debits your account, credits your friend, and sends confirmation messages to both phones. This takes about 2-3 seconds.

## What Gets Stored

Safaricom records every transaction: the amount, the sender, the recipient, the time, and the agent or till number involved. This data is stored in databases inside Safaricom's data centres. Transaction records are not deleted quickly \u2014 they are kept for at least seven years under Central Bank of Kenya regulations, similar to how banks keep your statements.

## Who Can See It?

Your M-Pesa data is protected by encryption and access controls. Safaricom employees cannot casually browse your transaction history. However, the data can be shared in specific circumstances: law enforcement with a court order, the Central Bank for regulatory oversight, and for fraud prevention. Think of it like your bank records \u2014 private, but not invisible to authorities.

## How It Is Protected

Safaricom invests heavily in cybersecurity: firewalls, intrusion detection systems, and encrypted storage. Their data centres have physical security too \u2014 guards, cameras, and access cards. The company is regularly audited to ensure compliance with CBK standards and the Kenya Data Protection Act.

## Why This Matters

Over 30 million Kenyans use M-Pesa. That means millions of financial records are created daily. Understanding how this data is stored and protected helps you make informed decisions about your digital financial life.""",
            "readingTimeMin": 5,
            "sortOrder": 4,
            "claims": [
                {
                    "claim": "Safaricom processes over 1 billion M-Pesa transactions per month as of recent reports.",
                    "source": "Safaricom annual financial reports",
                    "confidence": "High"
                },
                {
                    "claim": "Mobile money transaction records in Kenya must be retained for a minimum of seven years under Central Bank of Kenya regulations.",
                    "source": "CBK Prudential Guidelines and National Payment System regulations",
                    "confidence": "High"
                },
                {
                    "claim": "Safaricom's data centres storing M-Pesa data are located within Kenya.",
                    "source": "Safaricom corporate disclosures and CBK requirements",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "What Happens When You Send a WhatsApp Message?",
            "slug": "what-happens-when-you-send-a-whatsapp-message",
            "tlDr": "When you send a WhatsApp message, your phone encrypts it, sends it through Safaricom's network and undersea cables to Meta's servers abroad, which route it to your recipient's phone \u2014 all in under a second.",
            "description": "A behind-the-scenes look at the technical journey a WhatsApp message takes from a phone in Nairobi to a friend across town or across the world.",
            "content": """## Your Phone Locks the Message

Before your WhatsApp message even leaves your phone, it is encrypted using end-to-end encryption. This means only you and the recipient can read it \u2014 not Safaricom, not WhatsApp (Meta), and not anyone in between. Think of it as putting your letter in a locked box where only the recipient has the key.

## Across the Mobile Network

Your encrypted message travels from your phone to the nearest cell tower, then through Safaricom's core network infrastructure. Safaricom acts like the postal service \u2014 they deliver the package but cannot open it. The signal then enters an internet exchange point, likely the Kenya Internet Exchange Point (KIXP) in Nairobi.

## Under the Sea

If the message is going to someone whose phone is connected to a server in another country, the data travels through undersea fibre-optic cables. Kenya is connected to the world through several submarine cables landing at the coast in Mombasa \u2014 cables like SEACOM, TEAMS, and EASSy. These cables carry your message across the ocean floor at the speed of light.

## Meta's Data Centres

Your message reaches one of Meta's data centres, likely in the United States or Europe. The server there looks up which device your recipient is using and forwards the message. The response travels back through the same path in reverse.

## The Full Trip

The entire journey \u2014 encrypt, tower, network, undersea cable, foreign data centre, and back \u2014 happens in less than a second for local messages, and a few seconds for international ones. It is a remarkable feat of engineering that most people never think about.

## What Gets Stored

WhatsApp stores your messages on your device and on the recipient's device. Meta's servers only temporarily hold messages until they are delivered. If a message cannot be delivered immediately, it waits on the server for up to 30 days. Meta does not read the content because of end-to-end encryption.""",
            "readingTimeMin": 6,
            "sortOrder": 5,
            "claims": [
                {
                    "claim": "WhatsApp uses end-to-end encryption by default for all personal messages, meaning not even Meta can read the content.",
                    "source": "WhatsApp security whitepaper and Meta documentation",
                    "confidence": "High"
                },
                {
                    "claim": "Kenya is connected to the global internet through multiple submarine fibre-optic cables landing in Mombasa.",
                    "source": "Communications Authority of Kenya and submarine cable operator data",
                    "confidence": "High"
                },
                {
                    "claim": "Undelivered WhatsApp messages are stored on Meta's servers for up to 30 days before being deleted.",
                    "source": "WhatsApp FAQ and Meta's data retention policies",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "What Is Cloud Computing?",
            "slug": "what-is-cloud-computing",
            "tlDr": "Cloud computing means renting computers and storage over the internet instead of buying and maintaining your own, and it powers everything from your Gmail to Kenyan banking apps.",
            "description": "A beginner-friendly explanation of cloud computing with Kenyan examples showing how it affects everyday life and local businesses.",
            "content": """## Renting Instead of Buying

Imagine you need a matatu for one trip. You do not buy a whole matatu \u2014 you pay a fare and ride. Cloud computing works the same way. Instead of buying expensive servers for your business, you rent computing power and storage from companies like Amazon (AWS), Microsoft (Azure), or Google (GCP). You pay only for what you use.

## What Does \"the Cloud\" Actually Mean?

\"The cloud\" is just someone else's data centre. When you store photos on Google Photos, those photos live on hard drives in a Google data centre. When a Kenyan startup builds an app, they likely run it on servers in an AWS or Azure data centre. The word \"cloud\" makes it sound magical, but it is very real computers in very real buildings.

## Cloud in Everyday Kenyan Life

You already use the cloud daily. Gmail, Google Drive, and YouTube run on Google Cloud. Microsoft 365 runs on Azure. Many Kenyan banks use cloud services to run their mobile banking apps. Even the government's e-Citizen platform relies on cloud infrastructure.

## Why Kenyan Businesses Love It

Before cloud computing, a Kenyan company had to buy servers, find a cool room to put them in, hire IT staff, and pay Kenya Power for constant electricity. With the cloud, they skip all of that. A startup in Nairobi can launch an app in minutes using cloud services, and scale up during busy periods without buying extra hardware.

## Challenges in Kenya

Cloud computing is not perfect for everyone. Internet outages can make cloud services unreachable. Paying in foreign currency (dollars) for AWS or Azure can be expensive when the shilling weakens. Data sovereignty concerns mean some organisations prefer local data centres. And not all areas of Kenya have reliable enough internet for cloud-dependent tools.""",
            "readingTimeMin": 5,
            "sortOrder": 6,
            "claims": [
                {
                    "claim": "Many Kenyan banks and fintech companies use cloud services from AWS, Azure, or local providers.",
                    "source": "Industry reports from AWS, Microsoft, and local cloud providers",
                    "confidence": "High"
                },
                {
                    "claim": "Paying for cloud services in US dollars creates cost challenges for Kenyan businesses when the shilling depreciates.",
                    "source": "Kenyan tech industry commentary and exchange rate data",
                    "confidence": "Medium",
                    "notes": "Some providers now offer local currency billing to mitigate this."
                },
                {
                    "claim": "Microsoft Azure has launched a cloud region in South Africa, its first on the African continent.",
                    "source": "Microsoft Azure official announcements",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "What Is a Server?",
            "slug": "what-is-a-server",
            "tlDr": "A server is a computer that provides services to other computers over a network \u2014 it is the machine that actually does the work whenever you browse a website, send an email, or check your M-Pesa balance.",
            "description": "Explains what a server is in simple terms, how it differs from your laptop, and why servers are essential to every digital service Kenyans use.",
            "content": """## A Computer That Serves Others

A server is simply a computer that exists to serve other computers. When you open your banking app, your phone asks a server for your balance. When you search Google, a server finds the results and sends them back. Servers are the workhorses of the internet — they spend all day answering requests from phones, laptops, and other devices.

## How Is It Different From Your Laptop?

Physically, a server looks different. It has no screen, no keyboard, and no mouse. It is designed to slide into a rack in a data centre, stacked on top of other servers. It is built for reliability — it runs 24 hours a day, 7 days a week, often for years without being turned off. Your laptop might last 3-5 years; a good server can run for 5-10 years continuously.

## Types of Servers

There are many kinds. A web server sends web pages to your browser. A database server stores and retrieves data (like your M-Pesa transaction history). A file server stores documents. An email server handles your messages. In a large organisation like Safaricom, there are thousands of different servers, each specialised for a specific job.

## Servers in Kenya

Safaricom runs thousands of servers across its data centres in Nairobi to support M-Pesa, voice calls, and mobile data. Kenyan banks each operate their own server infrastructure. Even government ministries run servers for systems like e-Citizen and iTax. The Kenya Revenue Authority, for example, needs powerful database servers to handle tax returns from millions of Kenyans every year.

## A Simple Analogy

Think of a restaurant. You are the customer (your phone). The kitchen is the server. You place an order (send a request), the kitchen prepares your food (processes the data), and serves it to you (sends the response). The kitchen never comes to your table \u2014 it stays in one place, ready to serve many customers at once.""",
            "readingTimeMin": 5,
            "sortOrder": 7,
            "claims": [
                {
                    "claim": "Safaricom runs thousands of servers across its data centres in Nairobi.",
                    "source": "Safaricom infrastructure disclosures and industry estimates",
                    "confidence": "High"
                },
                {
                    "claim": "A typical enterprise server is designed to run continuously for 5-10 years.",
                    "source": "Server manufacturer specifications (Dell, HP, Lenovo)",
                    "confidence": "High"
                },
                {
                    "claim": "The Kenya Revenue Authority uses database servers to process millions of tax returns annually.",
                    "source": "KRA annual reports and iTax system descriptions",
                    "confidence": "Medium",
                    "notes": "Exact server count is not publicly disclosed."
                }
            ]
        },
        {
            "title": "What Is a Data Centre Rack?",
            "slug": "what-is-a-data-centre-rack",
            "tlDr": "A data centre rack is a tall metal frame that holds servers, switches, and cables in an organised way — think of it as a filing cabinet for computers.",
            "description": "Explains what a rack is, why data centres use them, and how they help organise thousands of servers efficiently.",
            "content": """## The Filing Cabinet of Computing

If a data centre is a library, then each rack is a single bookshelf. A rack is a tall metal frame — typically about 2 metres tall and less than a metre wide — that holds servers, network switches, storage devices, and cables in a neat, organised way. Without racks, data centres would be chaotic tangles of equipment.

## How It Is Organised

A standard rack has numbered slots called "U" (rack units). Each U is about 4.4 centimetres tall. A typical server takes up 1U or 2U of space. A full rack can hold 40-42U of equipment. In a major facility like Africa Data Centres in Nairobi, you might see hundreds of racks lined up in rows, each one buzzing with activity.

## What Goes Inside

At the top, you usually find network switches that connect the servers to the internet. In the middle, you find the actual servers doing the computing. At the bottom, you often find larger storage devices or backup systems. Thick bundles of cables run up and down the sides, connecting everything together.

## Why Racks Matter

Racks make it possible to pack enormous computing power into a small space. A single rack of modern servers can do more computing than an entire university computer lab from 15 years ago. They also make maintenance easier — technicians can slide a server out like a drawer to repair or replace it without disturbing the others.

## Cooling and Power

Each rack generates significant heat and draws serious power. Cold air is blown in from the front, and hot air is exhausted out the back. Modern racks in well-designed data centres have sensors that monitor temperature at different heights, and automated systems adjust cooling as needed. The power draw of a single fully loaded rack can exceed 10 kilowatts — enough to power several Kenyan households.""",
            "readingTimeMin": 4,
            "sortOrder": 8,
            "claims": [
                {
                    "claim": "A standard data centre rack is 42U tall, which equals roughly 1.87 metres.",
                    "source": "Industry standard (EIA-310)",
                    "confidence": "High"
                },
                {
                    "claim": "A single fully loaded rack of modern servers can consume over 10 kilowatts of power.",
                    "source": "Data centre engineering guidelines and equipment specifications",
                    "confidence": "Medium",
                    "notes": "Power density varies by equipment generation; high-density GPU racks can exceed 30kW."
                },
                {
                    "claim": "Africa Data Centres operates large rack-based facilities in Nairobi.",
                    "source": "Africa Data Centres corporate website and press releases",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "What Is Colocation?",
            "slug": "what-is-colocation",
            "tlDr": "Colocation is when a business rents space in someone else's data centre to house its own servers, sharing the building's power, cooling, and security.",
            "description": "Explains how colocation works, why Kenyan businesses use it, and how it differs from owning a data centre or using the cloud.",
            "content": """## Renting a Seat in Someone Else's Data Centre

Imagine you have a valuable car but no garage at home. You rent a parking space in a secure, well-lit facility with guards and cameras. Colocation (or "colo") works the same way for businesses. A company buys its own servers but rents space in a professional data centre instead of building its own facility.

## What You Get

When you colocate, you rent rack space in an established data centre. The facility provides reliable power (with backup generators), cooling, physical security, and internet connectivity. You provide the servers and the software. It is like renting a kiosk in a mall — the mall gives you electricity, security, and foot traffic, while you run your own shop.

## Why Kenyan Companies Use Colocation

Building a data centre from scratch is extremely expensive — hundreds of millions of shillings for a small one. Most Kenyan businesses cannot justify that investment. Instead, they put their servers in a colocation facility run by companies like Liquid Intelligent Technologies, Africa Data Centres, or Safaricom. This gives them enterprise-grade infrastructure without the capital cost.

## Colocation vs Cloud

Colocation is different from cloud computing. With colocation, you own the hardware. With cloud computing, you rent the hardware too. Colocation gives you more control and can be cheaper if you already own equipment. Cloud gives you more flexibility and no hardware headaches. Some Kenyan businesses use a mix of both.

## Who Uses Colocation in Kenya?

Banks, insurance companies, internet service providers, and large enterprises are the main users. A mid-sized bank might rent several racks in a Nairobi colocation facility to house its core banking servers. Mobile network operators also colocate equipment in each other's facilities for redundancy.""",
            "readingTimeMin": 5,
            "sortOrder": 9,
            "claims": [
                {
                    "claim": "Building a small enterprise data centre in Nairobi can cost hundreds of millions of Kenyan shillings.",
                    "source": "Construction cost estimates and data centre build cost reports",
                    "confidence": "Medium",
                    "notes": "Costs vary widely depending on size, tier level, and equipment choices."
                },
                {
                    "claim": "Liquid Intelligent Technologies and Africa Data Centres offer colocation services in Nairobi.",
                    "source": "Company websites and service offerings",
                    "confidence": "High"
                },
                {
                    "claim": "Colocation gives businesses more control over their hardware than cloud computing does.",
                    "source": "Industry analysis and comparison resources",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "What Is a Hyperscale Data Centre?",
            "slug": "what-is-a-hyperscale-data-centre",
            "tlDr": "A hyperscale data centre is a massive facility — often covering several football fields — built by tech giants like Amazon, Google, and Microsoft to serve billions of users worldwide.",
            "description": "Explains what makes hyperscale data centres different from ordinary ones, which companies build them, and whether Kenya will get one.",
            "content": """## Bigger Than Big

A typical enterprise data centre might fill a large room. A hyperscale data centre fills several buildings on a campus that could cover 10 or more football fields. These are the largest computing facilities ever built, owned by companies like Amazon, Google, Microsoft, Meta, and Apple. Each one can contain hundreds of thousands of servers.

## What Makes It Different

Hyperscale data centres are not just bigger versions of regular data centres — they are fundamentally different in how they operate. They use custom-designed hardware and software. Servers are treated as interchangeable parts: if one fails, the system automatically routes work to another, and a technician replaces it later. This is called "hyperscale computing" — the ability to scale up massively by simply adding more identical components.

## Who Builds Them

Amazon Web Services (AWS), Google Cloud, and Microsoft Azure operate hundreds of hyperscale data centres globally. Meta builds them to support Facebook, Instagram, and WhatsApp. As of 2024, there are roughly 1,000 hyperscale data centres worldwide, with hundreds more planned.

## The Kenya Connection

No hyperscale data centre has been built in Kenya yet. The closest are in South Africa, where Microsoft Azure launched Africa's first hyperscale cloud region. Kenya's appeal is growing thanks to its submarine cable connections through Mombasa, a growing tech ecosystem in Nairobi, and demand from East African businesses. Several companies have expressed interest, but no firm construction announcements have been made for Kenya specifically.

## Why It Matters

When a hyperscale data centre opens in a country, it brings significant benefits: faster internet services for local users, tech jobs, and economic investment. But it also raises questions about energy consumption, land use, and data sovereignty. Kenya will need to weigh these factors as it positions itself as a regional digital hub.""",
            "readingTimeMin": 5,
            "sortOrder": 10,
            "claims": [
                {
                    "claim": "There are roughly 1,000 hyperscale data centres worldwide as of 2024.",
                    "source": "Synergy Research Group data centre market reports",
                    "confidence": "High"
                },
                {
                    "claim": "Microsoft Azure launched its first cloud region in Africa (South Africa) in 2019.",
                    "source": "Microsoft Azure official announcements",
                    "confidence": "High"
                },
                {
                    "claim": "No hyperscale data centre has been built in Kenya as of 2024.",
                    "source": "Industry tracking by Structure Research and Africa Data Centres Association",
                    "confidence": "High"
                }
            ]
        },
    ]

    print(f"Seeding {len(articles)} beginner articles...")

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
            "Beginner",
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
