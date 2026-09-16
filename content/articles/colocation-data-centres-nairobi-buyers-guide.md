---
title: "Colocation Data Centres in Nairobi: A Buyer's Guide"
slug: "colocation-data-centres-nairobi-buyers-guide"
meta_description: "How to lease rack space in a Nairobi data centre: what Tier III means, which facilities are operational, what to check, and the questions to ask before signing."
primary_keyword: "colocation data center nairobi"
secondary_keywords:
  - "tier iii data center kenya"
  - "server rack space leasing nairobi"
  - "carrier neutral data centres kenya"
  - "colocation providers nairobi"
author: "Kevin Jonathan Otieno"
author_bio_link: "/about"
published_date: "2026-09-16"
new: false
updated_date: "2026-09-16"
category: "Data Centres"
cluster: "Kenya"
og_image: "/images/hero-dc-nairobi.webp"
reading_time: "9 min"
images:
  - src: "/images/hero-dc-nairobi.webp"
    alt: "Server hall of a Nairobi data centre with rows of racks"
    caption: "A Nairobi server hall. Colocation means renting a slot in a room like this one: your hardware, the operator's building, power, cooling and security"
    position: "hero"
  - src: "/images/dc-biometric-access.webp"
    alt: "A person using a biometric fingerprint access reader"
    caption: "Security is layered in a serious facility: biometric readers, cameras and guarded corridors before anyone reaches a rack"
    position: "inline"
  - src: "/images/dc-ups-batteries.webp"
    alt: "UPS battery strings inside a data centre power room"
    caption: "UPS batteries bridge the gap the instant grid power stumbles, before generators spin up. Redundancy like this is what the Tier label is really about"
    position: "section-break"
  - src: "/images/racks-cabling.webp"
    alt: "Server racks with neatly organised cabling"
    caption: "A tidy rack is a fast rack: clean cabling means fewer mistakes, easier upgrades and quicker repairs"
    position: "inline"
  - src: "/images/diagram-server-rack-42u.webp"
    alt: "Diagram of a standard 42U server rack layout"
    caption: "Rack space is sold in U, a standard height unit. This diagram shows how a full rack fills up with servers, switches and power strips"
    position: "section-break"
internal_links:
  - text: "what colocation means in Kenya"
    href: "/articles/what-is-colocation-kenya"
  - text: "what Tier ratings actually measure"
    href: "/articles/data-centre-tier-ratings-explained"
  - text: "Africa Data Centres' operations in Kenya"
    href: "/articles/africa-data-centres-kenya-operations"
  - text: "Digital Realty's NBO2 launch"
    href: "/articles/digital-realty-nbo2-launch-nairobi"
  - text: "VPS hosting paid with M-Pesa if a full rack is too big"
    href: "/articles/vps-hosting-kenya-mpesa-payment"
external_sources:
  - title: "Africa Data Centres, NBO1 Nairobi Data Centre page (fetched 16 Sep 2026; Sameer Business Park, Block A, Mombasa Road address)"
    url: "https://www.africadatacentres.com/"
  - title: "PeeringDB, Africa Data Centres Nairobi NBO1 entry (26 Sep 2025; Sameer Business Park, Mombasa Road)"
    url: "https://www.peeringdb.com/"
  - title: "ET Datacenters, Digital Realty Opens 6.4MW Nairobi Two Data Centre (10 Sep 2026)"
    url: "http://datacenters.economictimes.indiatimes.com/news/cloud-colocation-connectivity/digital-realty-opens-6-4mw-nairobi-two-data-centre/133994519"
  - title: "Capital FM (via allAfrica), New NBO2 Data Centre Strengthens Kenya's Bid to Become East Africa's Digital Hub (7 Sep 2026)"
    url: "https://allafrica.com/stories/202609080028.html"
  - title: "iXAfrica, Putting Kenya on the Map as a Data Centre Leader (fetched 16 Sep 2026; NBOX1 campus 22.5MW design capacity)"
    url: "https://ixafrica.co.ke/"
  - title: "Uptime Institute, Tier Standard (Tier III concurrent maintainability and uptime definitions)"
    url: "https://uptimeinstitute.com/tier-standard/"
faq:
  - question: "What is colocation in simple terms?"
    answer: "Colocation (colocation data centre hosting) means renting space, power, cooling and security inside a professional data centre while keeping ownership of your own servers. The operator provides the building and the infrastructure; you provide and manage the machines. It is the middle ground between running servers in your office and renting fully managed cloud servers."
  - question: "How much does colocation cost in Nairobi?"
    answer: "Kenyan operators rarely publish colocation prices, so expect to request a quote. Pricing is usually quoted per rack per month, or per kilowatt of power reserved, with cross-connects and remote hands billed separately. As a sizing rule, a half rack suits a small business with a handful of servers, while growing companies typically start at a full rack or a private cage. Get quotes from at least three Nairobi facilities and compare what is included, because two similar-sounding quotes can cover very different things."
  - question: "What does Tier III mean, and do I need it?"
    answer: "Tier III is a Uptime Institute rating describing a facility built for concurrent maintainability, which means any part of the power or cooling system can be taken out for maintenance without switching your servers off. Tier III facilities are designed for about 99.982 percent uptime, which works out to roughly one hour of downtime per year. Most serious Nairobi facilities are built to this standard. If your systems must stay online through business hours, Tier III or better is the sensible floor."
  - question: "What does carrier neutral mean, and why does it matter?"
    answer: "A carrier neutral data centre is one that does not force you to buy internet or network services from the facility's owner. Instead, many internet providers and networks install their equipment in the same building, and you connect to whichever you choose. This matters because competition lowers prices, multiple providers mean your connection survives one provider's outage, and networks that meet inside the building exchange traffic faster. In Nairobi this shows up as internet exchange points sitting inside facilities, keeping local traffic local."
  - question: "Can I start with less than one full rack?"
    answer: "Yes. Most operators sell from a quarter rack or half rack upwards, and some offer single-server hosting. A quarter rack is a small locked slice of one cabinet, enough for two to five servers. That said, if you only need one or two virtual machines rather than physical servers, a Nairobi VPS is cheaper and easier to start with; move into colocation when you need your own hardware, more control, or steady workloads that make owning the machine economical."
canonical_url: "https://data-centers-254.vercel.app/articles/colocation-data-centres-nairobi-buyers-guide"
---

Somewhere in your office there is a metal cupboard humming with servers. It is too hot in that corner, the power fails on the wrong afternoons, and the only person who knows how to restart the machine is on leave. Colocation is the grown-up version of that cupboard: you keep your servers, but they live in a professional building whose entire job is power, cooling, security and connectivity. Nairobi now has several such buildings to choose from, which is good news, and choosing between them is the hard part.

This guide walks the decision in plain English: what exactly you are renting, what the Tier label means, which Nairobi facilities are operational as of September 2026, and a checklist of questions to ask before you sign anything. If you are completely new to the concept, start with our explainer on [what colocation means in Kenya](/articles/what-is-colocation-kenya), then come back here for the buying part.

![Server hall of a Nairobi data centre with rows of racks](/images/hero-dc-nairobi.webp)

## What you are actually renting

Strip away the jargon and a colocation deal has four ingredients. First, space: measured in racks or U. A rack is a standard cabinet, and a U (one rack unit) is a slice of that cabinet about 4.4 centimetres tall. A typical full rack offers 42U, and servers are built to stack into those slots like wide books on a shelf. Second, power: delivered per rack or per kilowatt, backed by batteries and generators so a grid failure becomes a non-event. Third, cooling: the machines shed heat constantly, and the facility's chillers and airflow systems fight that battle so you never see it. Fourth, connectivity: fast links to the internet and, crucially, to other networks in the same building.

Everything else in the contract, security, fire suppression, access control, support staff, exists to protect those four ingredients. Understanding this split matters because prices are quoted differently by different operators: some bill per rack per month, some per kilowatt of reserved power, and the add-ons (extra power, extra connections, hands-on support) are where totals quietly grow.

![A person using a biometric fingerprint access reader](/images/dc-biometric-access.webp)

## The Tier label, decoded

Every facility brochure says Tier III, so it is worth knowing what the word is actually promising. The rating comes from the Uptime Institute, an independent body, and it grades how fault-tolerant a building's infrastructure is. Our full guide to [what Tier ratings actually measure](/articles/data-centre-tier-ratings-explained) covers all four levels, but the practical summary is this.

Tier III means concurrent maintainability: any component of the power or cooling chain can be taken out for maintenance without your servers going dark. The facility is engineered for roughly 99.982 percent uptime, which is about one hour of downtime a year. The mechanism behind that promise is redundancy, spelled N+1 in the brochures: one more unit than strictly needed, so a failing battery string, chiller or generator is a maintenance ticket rather than an outage. A [UPS](/articles/ups-backup-power-kenyan-data-centres) (uninterruptible power supply, a room of batteries) bridges the milliseconds between a grid failure and the generators picking up the load.

Tier II promises less and Tier IV promises more, with more redundancy and fault tolerance than III. For most Kenyan enterprises, Tier III is the sensible floor: it matches the reliability of the systems most businesses actually run, without paying for Tier IV's industrial-grade extras.

![UPS battery strings inside a data centre power room](/images/dc-ups-batteries.webp)

## Who is actually open in Nairobi right now

Numbers first, then names. Kenya's data centre market is small by global standards but concentrated in Nairobi, and the facilities below are operational as of 16 September 2026, per our directory's verification process, which tracks 27 facilities across the country.

**Africa Data Centres NBO1** sits at Sameer Business Park, Block A, Mombasa Road, an address confirmed by Africa Data Centres' own site and by PeeringDB's independent listing (September 2025). It is the most densely connected data centre building in Kenya, with four internet exchanges on site, meaning local traffic can be exchanged inside the building rather than detouring abroad. We profile the operator in our piece on [Africa Data Centres' operations in Kenya](/articles/africa-data-centres-kenya-operations). The same group, together with Digital Realty, launched the new **NBO2** facility in September 2026, with about 6.4MW of commissioned capacity reported by trade press (ET Datacenters, 10 September 2026; more in our [NBO2 launch](/articles/digital-realty-nbo2-launch-nairobi) analysis).

**iXAfrica NBOX1** is the large Nairobi campus marketing itself as East Africa's first hyperscale, carrier-neutral, AI-ready data centre, with an overall design capacity the operator puts at 22.5MW (iXAfrica, fetched 16 September 2026). Design capacity means what the campus is built to reach, not what is switched on today, so ask what is live when you tour.

**iColo Nairobi One**, part of Digital Realty, and **PAIX Data Centres'** Nairobi facility round out the commercial options, alongside earlier-generation facilities and the Kenyatta University-based academic node. Our directory pages carry the per-facility detail, including [ADC NBO1](/directory/africa-dc-nairobi-1) and [iColo NBO1](/directory/icolo-nbo1).

One caution on names you may see in the market: **Raxio**, a pan-African operator, has announced Kenya as a target market, but as of 16 September 2026 no opened Nairobi facility is verifiable from primary sources, so treat anything implying it is open today with care. We unpack that situation separately in [Raxio vs Africa Data Centres in Kenya](/articles/raxio-vs-africa-data-centres-kenya-comparison).

![Server racks with neatly organised cabling](/images/racks-cabling.webp)

## The questions that actually matter

Brochures grade themselves, so bring your own test. These are the questions that separate a serious facility from a shiny one, and the answers should be specific enough to check.

**Power, twice over.** Ask how many independent power paths reach your rack, how many generators sit behind the building, how long the fuel lasts at full load, and when the UPS batteries were last load-tested. The answers should sound routine to them and clear to you.

**Cooling, honestly sized.** Ask the maximum kilowatts your rack can draw before cooling becomes a problem. AI-ready claims mean little if your three servers will share air with a rack running hot next door.

**Connectivity, counted.** Ask which internet providers and exchange points are physically in the building, and what a cross-connect (a cable from your rack to another network in the same facility) costs per month. Carrier neutrality is only real if several providers are genuinely on site.

**Security, walked.** Ask for the full journey a visitor takes from the front door to your rack: mantrap, ID checks, biometric readers, cameras, escort rules. Then ask when it was last audited or certified.

**Support, in writing.** Ask what remote hands (technicians who act on your behalf) includes, what it costs, and the response-time promise in the service level agreement. A facility is only as good as the 2 a.m. answer to a dead power supply.

![Diagram of a standard 42U server rack layout](/images/diagram-server-rack-42u.webp)

## Sizing the decision: rack, cage, or neither?

Three honest paths exist for a Kenyan organisation outgrowing the office cupboard:

1. **Colocation, starting small.** A quarter or half rack, two to five servers. Monthly cost sits in the range you will discover by quoting, since Kenyan operators rarely publish prices.
2. **A private cage or suite.** This makes sense when you own many machines and need physical separation from other tenants.
3. **Staying out of hardware entirely.** If your actual need is one or two virtual machines, a [Nairobi VPS paid with M-Pesa](/articles/vps-hosting-kenya-mpesa-payment) is cheaper and faster to start, and nothing is lost by beginning there.

The economics tip toward colocation when machines are numerous, workloads run around the clock, or compliance rules demand that you control the hardware. Kenya's data protection regime, discussed in our [GPU cloud in Kenya](/articles/gpu-cloud-infrastructure-kenya) guide, is one reason some enterprises prefer physical control of the boxes holding personal data. The economics tip away from colocation when workloads are light, bursty, or experimental, because idle racks earn nobody anything.

Nairobi's colocation market has never offered more choice than it does in late 2026: a densely connected veteran on Mombasa Road, a hyperscale-grade campus, a freshly launched NBO2, and focused boutique operators. That competition is good for buyers. Do the site visits, ask the five questions, compare three quotes line by line, and the right facility tends to announce itself.

## Frequently asked questions

### What is colocation in simple terms?

Colocation (colocation data centre hosting) means renting space, power, cooling and security inside a professional data centre while keeping ownership of your own servers. The operator provides the building and the infrastructure; you provide and manage the machines. It is the middle ground between running servers in your office and renting fully managed cloud servers.

### How much does colocation cost in Nairobi?

Kenyan operators rarely publish colocation prices, so expect to request a quote. Pricing is usually quoted per rack per month, or per kilowatt of power reserved, with cross-connects and remote hands billed separately. As a sizing rule, a half rack suits a small business with a handful of servers, while growing companies typically start at a full rack or a private cage. Get quotes from at least three Nairobi facilities and compare what is included, because two similar-sounding quotes can cover very different things.

### What does Tier III mean, and do I need it?

Tier III is a Uptime Institute rating describing a facility built for concurrent maintainability, which means any part of the power or cooling system can be taken out for maintenance without switching your servers off. Tier III facilities are designed for about 99.982 percent uptime, which works out to roughly one hour of downtime per year. Most serious Nairobi facilities are built to this standard. If your systems must stay online through business hours, Tier III or better is the sensible floor.

### What does carrier neutral mean, and why does it matter?

A carrier neutral data centre is one that does not force you to buy internet or network services from the facility's owner. Instead, many internet providers and networks install their equipment in the same building, and you connect to whichever you choose. This matters because competition lowers prices, multiple providers mean your connection survives one provider's outage, and networks that meet inside the building exchange traffic faster. In Nairobi this shows up as internet exchange points sitting inside facilities, keeping local traffic local.

### Can I start with less than one full rack?

Yes. Most operators sell from a quarter rack or half rack upwards, and some offer single-server hosting. A quarter rack is a small locked slice of one cabinet, enough for two to five servers. That said, if you only need one or two virtual machines rather than physical servers, a Nairobi VPS is cheaper and easier to start with; move into colocation when you need your own hardware, more control, or steady workloads that make owning the machine economical.
