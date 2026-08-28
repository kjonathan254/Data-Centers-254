---
title: "What Is a Data Centre SLA? Understanding Uptime Guarantees"
slug: data-centre-sla-uptime-guarantees
meta_description: "Learn what a data centre Service Level Agreement (SLA) is, how uptime guarantees like 99.9% and 99.999% translate to real downtime, and what Kenyan operators actually commit to in their contracts."
primary_keyword: "data centre SLA"
secondary_keywords:
  - "uptime guarantee data centre"
  - "service level agreement Kenya"
  - "data centre SLA tiers"
  - "colocation SLA Kenya"
  - "data centre service credits"
author: "Kevin Jonathan Onyango Otieno"
author_bio_link: "/about"
published_date: "2026-08-28"
updated_date: "2026-08-28"
category: Beginner Guides
cluster: Beginner
og_image: "/images/og-default.png"
reading_time: "14 min"
images:
  - src: "/images/dc-servers-racks.png"
    alt: "Server racks inside a Kenyan data centre with monitoring systems"
    caption: "Data centre SLAs define the contractual obligations for keeping infrastructure like these racks operational."
    position: "hero"
  - src: "/images/dc-power-systems.webp"
    alt: "Redundant power systems in a colocation facility"
    caption: "Power redundancy directly impacts the uptime SLA a data centre can realistically guarantee."
    position: "section-break"
  - src: "/images/racks-cabling.webp"
    alt: "Structured cabling and network infrastructure in a data centre"
    caption: "Network availability SLAs depend on the quality of cabling, switching, and upstream carrier diversity."
    position: "inline"
  - src: "/images/dc-business-investment.png"
    alt: "Business professionals reviewing data centre contracts"
    caption: "Evaluating an SLA carefully before signing can save your business from costly surprises down the line."
    position: "infographic"
internal_links:
  - text: "data centre tier ratings explained"
    href: "/articles/data-centre-tier-ratings-explained"
  - text: "UPS and backup power in Kenyan data centres"
    href: "/articles/ups-backup-power-kenyan-data-centres"
  - text: "colocation in Kenya"
    href: "/articles/what-is-colocation-kenya"
external_sources:
  - title: "Uptime Institute Tier Standard Topology"
    url: "https://uptimeinstitute.com/tier-standard-topology"
  - title: "Service Level Agreements Best Practices Guide ITIL"
    url: "https://www.axelos.com/certifications/itil-service-management"
faq:
  - question: "What does 99.99% uptime actually mean in practice?"
    answer: "99.99% uptime means your service can experience no more than 52.6 minutes of unplanned downtime in an entire year. For most Kenyan businesses running e-commerce or SaaS platforms, this is generally considered an excellent standard. However, it is important to check whether the SLA covers scheduled maintenance windows, which some operators exclude from their calculations."
  - question: "Can I negotiate a better SLA with a Kenyan data centre provider?"
    answer: "Yes, especially if you are committing significant rack space or a multi-year contract. Larger customers regularly negotiate custom SLA terms around response times, reporting frequency, and service credit percentages. Start by asking for their standard SLA document, then identify the gaps between their offering and your business requirements."
  - question: "What happens if a data centre breaches its SLA?"
    answer: "Typically, you are entitled to service credits — a percentage refund on your monthly colocation fee for the month in which the breach occurred. Most providers offer 10% to 100% credit depending on the severity and duration of the outage. However, service credits rarely compensate for your actual business losses such as lost revenue, reputational damage, or regulatory penalties."
  - question: "Do Kenyan data centres actually meet their published uptime SLAs?"
    answer: "The major operators — Africa Data Centres, PAIX, Liquid Intelligent Technologies, and IXAfrica — generally meet or exceed their published SLAs, particularly for power and cooling. However, Kenya's national grid (Kenya Power) still experiences occasional outages, which is why robust on-site power infrastructure is critical. Always ask prospective providers for their historical SLA performance reports before signing."
  - question: "Is a 99.999% uptime SLA realistic for a Kenyan data centre?"
    answer: 'Genuine 99.999% (five nines) uptime is extremely demanding — it allows only 5.26 minutes of downtime per year. Very few facilities globally achieve this, and it typically requires a Tier IV design with 2N redundancy. In Kenya, some operators may market five nines but the contractual SLA may be lower. Always distinguish between marketing language and the legally binding commitment in your contract.'
canonical_url: "https://datacentre254.com/articles/data-centre-sla-uptime-guarantees"
---

## What Exactly Is a Data Centre SLA?

A **Service Level Agreement (SLA)** is a formal contract between a data centre operator and its customer that defines the minimum standards of service the operator promises to deliver. Think of it as a written guarantee: if the facility fails to keep the lights on, keep your servers cool, or respond when you need help, the SLA spells out exactly what consequences follow.

![Server racks inside a Kenyan data centre with monitoring systems](/images/dc-servers-racks.png)

For any business placing IT equipment in a [colocation facility in Kenya](/articles/what-is-colocation-kenya), the SLA is arguably the single most important document you will sign. It transforms vague marketing promises like "we never go down" into measurable, enforceable commitments. Without a solid SLA, you have no contractual recourse when things go wrong — and in the data centre world, things eventually do.

According to the [Uptime Institute](https://uptimeinstitute.com/tier-standard-topology), the global authority on data centre reliability, SLAs should be directly tied to the facility's design topology and operational practices. A well-crafted SLA protects both parties: the customer gets assurance, and the operator gets clear boundaries around their obligations.

## Why SLAs Matter for Your Business

Imagine running a fintech application serving M-Pesa integrations from a Nairobi facility. Every minute of downtime means failed transactions, frustrated customers, and potential regulatory scrutiny from the Central Bank of Kenya. An SLA is not just a technical document — it is a business continuity tool.

**The core reasons SLAs matter include:**

- **Financial protection:** Service credits provide partial compensation when the operator fails to meet agreed standards.
- **Accountability:** Defined metrics give you a clear basis to evaluate whether the provider is delivering value.
- **Planning certainty:** Knowing your guaranteed uptime helps you design your own disaster recovery and high-availability architectures.
- **Vendor comparison:** Standardised SLA metrics let you objectively compare providers like Africa Data Centres, PAIX, Liquid, and IXAfrica.

## Key SLA Metrics Explained

### Uptime Percentage: The Numbers That Matter

Uptime is the headline metric of any data centre SLA. It represents the percentage of time in a given period that the facility's critical systems — power, cooling, and network — are fully operational. Here is what the common tiers actually mean in terms of **annual unplanned downtime**:

| Uptime Tier | Downtime Per Year | Downtime Per Month | Typical Use Case |
|---|---|---|---|
| **99.0%** (Two nines) | 3 days, 15 hours | 7 hours, 18 minutes | Development and testing environments |
| **99.9%** (Three nines) | 8 hours, 46 minutes | 43 minutes, 50 seconds | Standard business applications |
| **99.99%** (Four nines) | 52 minutes, 36 seconds | 4 minutes, 23 seconds | Mission-critical workloads, fintech, e-commerce |
| **99.999%** (Five nines) | 5 minutes, 16 seconds | 26 seconds | Ultra-critical systems, telecoms core, trading platforms |

The jump from three nines to four nines is where most serious businesses draw the line. For a Kenyan e-commerce company processing thousands of orders daily, 8 hours and 46 minutes of annual downtime could mean millions of shillings in lost revenue. Four nines — less than an hour per year — is a far more comfortable target.

### Power Usage Effectiveness (PUE) Guarantees

Some advanced SLAs now include **PUE commitments**, promising that the facility will operate within a certain energy efficiency range. A PUE of 1.5 means that for every 1 kW of power delivered to your IT equipment, the facility uses 1.5 kW total (including cooling and overhead). Lower PUE values indicate better efficiency, which directly impacts your power costs — a critical factor given Kenya Power's commercial tariff structures.

### Temperature and Humidity Ranges

**ASHRAE-recommended** operating ranges are the industry baseline. Most SLAs guarantee that the cold aisle temperature will remain between **18°C and 27°C**, with relative humidity between **20% and 80%**. In Kenya, where ambient temperatures in Nairobi average 18–25°C but Mombasa can exceed 32°C, the cooling SLA is especially important for coastal facilities.

### Response Times: Remote Hands and Smart Hands

**Remote hands** refers to basic physical tasks — checking server status lights, rebooting equipment, connecting cables. **Smart hands** involves more skilled work — OS-level troubleshooting, hardware replacement, configuration changes. A typical SLA might guarantee:

- **Remote hands response:** 15 minutes or less
- **Smart hands response:** 30 minutes to 2 hours depending on complexity

For Kenyan operators, response time SLAs are particularly important because many customers manage their infrastructure remotely from other African markets or from overseas.

### Ticket Resolution Times

Beyond initial response, SLAs should define **resolution timeframes** for different severity levels:

- **Critical (P1):** Complete service outage — target resolution within 1–4 hours
- **High (P2):** Major degradation — target resolution within 4–8 hours
- **Medium (P3):** Minor issue with workaround available — target resolution within 24 hours
- **Low (P4):** General enquiry or cosmetic issue — target resolution within 72 hours

### Network Availability

For [understanding data centre tier ratings](/articles/data-centre-tier-ratings-explained) and their associated network SLAs, the guarantee typically covers carrier diversity, latency to major internet exchange points like the **Kenya Internet Exchange Point (KIXP)**, and bandwidth throughput. Most Kenyan colocation providers guarantee **99.9% to 99.99% network availability**.

![Redundant power systems in a colocation facility](/images/dc-power-systems.webp)

## How SLAs Relate to Data Centre Tier Ratings

The [Uptime Institute Tier Standard](https://uptimeinstitute.com/tier-standard-topology) provides a useful framework for understanding what level of SLA a facility can realistically support:

### Tier I — Basic Capacity (No Meaningful SLA)
Tier I facilities have no redundancy. A single power feed, a single cooling path, and no backup systems mean that any component failure causes an outage. These facilities typically cannot offer any meaningful uptime SLA. In Kenya, very few commercial colocation providers operate at Tier I.

### Tier II — Redundant Capacity Components
Tier II adds redundant components (like an extra UPS or chiller) but still relies on a single distribution path. SLAs here typically hover around **99.5% to 99.9%**. Suitable for non-critical workloads.

### Tier III — Concurrently Maintainable (N+1)
Tier III is the sweet spot for most commercial data centres. With N+1 redundancy, any single component can fail or be taken offline for maintenance without affecting operations. These facilities typically guarantee **99.982% to 99.99% uptime**. In Kenya, operators like **Africa Data Centres** (their Nairobi facilities) and **IXAfrica** design to Tier III standards and publish SLAs in this range.

### Tier IV — Fault Tolerant (2N)
Tier IV provides fully redundant, independent distribution paths. Even during maintenance, a complete failure of one path will not cause downtime. These facilities can credibly guarantee **99.995% or higher uptime**. Africa Data Centres' premium facilities and some Liquid Intelligent Technologies campuses in South Africa target Tier IV, though genuine Tier IV design in East Africa remains relatively rare.

## SLA Enforcement: Service Credits and Their Limits

### How Service Credits Work

Service credits are the primary enforcement mechanism in most data centre SLAs. When the operator fails to meet a committed metric, the customer receives a credit against their monthly invoice. A typical service credit structure looks like this:

| SLA Breach | Service Credit | Example (KES 500,000/month) |
|---|---|---|
| Below 99.9% uptime | 10% of monthly fee | KES 50,000 credit |
| Below 99.5% uptime | 25% of monthly fee | KES 125,000 credit |
| Below 99.0% uptime | 50% of monthly fee | KES 250,000 credit |
| Below 95.0% uptime | 100% of monthly fee | KES 500,000 credit |

### The Critical Limitation of Service Credits

Here is the uncomfortable truth that every SLA signer must understand: **service credits almost never cover your actual business losses.** If a four-hour outage costs your fintech platform KES 10 million in failed transactions, a 25% service credit on a KES 500,000 colocation bill gives you just KES 125,000 back. That is a 1.25% recovery of your actual loss.

This is not a flaw in the SLA — it is the standard industry model worldwide. Service credits are designed as a **contractual incentive**, not an insurance policy. For true loss protection, you need separate business interruption insurance.

### Dispute Resolution

Most SLAs include a dispute resolution clause specifying that disagreements about SLA performance must be raised within **30 to 60 days** of the alleged breach, often requiring the operator's own monitoring data as evidence. This makes independent monitoring on your side essential.

## Kenya-Specific SLA Considerations

### What Kenyan Operators Actually Publish

The major Kenyan data centre operators each take a different approach to their published SLAs:

- **Africa Data Centres** (East Africa's largest operator, with facilities in Nairobi): Typically guarantees **99.99% uptime** for power and cooling across their Tier III+ facilities. Their SLA also covers remote hands response within 15 minutes.

- **PAIX (Pan-African Internet Exchange):** Historically offered **99.9% uptime** guarantees with a focus on network-centric SLAs, given their peering and interconnection heritage.

- **Liquid Intelligent Technologies:** Offers SLAs in the **99.9% to 99.99% range** depending on the facility and service tier, leveraging their fibre backbone across East Africa.

- **IXAfrica:** Kenya's newest hyperscale-ready carrier-neutral facility, targeting **99.99%+ uptime** with a strong emphasis on PUE efficiency and sustainability metrics in their SLA.

### The Power Reliability Challenge

![Structured cabling and network infrastructure in a data centre](/images/racks-cabling.webp)

Kenya's power infrastructure has improved significantly, but [UPS and backup power systems remain critical](/articles/ups-backup-power-kenyan-data-centres) for SLA compliance. Kenya Power's grid reliability in Nairobi has improved with underground cabling projects, but regional variations persist. A data centre in Mombasa may face different grid challenges than one in Nairobi's Industrial Area.

The reality is that no Kenyan data centre can meet a 99.99% SLA on grid power alone. Robust battery UPS systems (typically with 10–15 minutes of autonomy) combined with diesel generators (with 24–48 hours of fuel storage) are the minimum for any credible SLA. When evaluating a provider, ask specifically about:

- Generator start time and load transfer time
- On-site fuel storage capacity
- Automatic Transfer Switch (ATS) reliability testing frequency
- Historical grid failure events and how the facility responded

### Evaluating a Kenyan Colocation SLA

When choosing a provider, go beyond the headline uptime number. A practical evaluation checklist includes:

1. **Read the exclusions.** Does the SLA exclude scheduled maintenance? Force majeure events? Third-party carrier failures?
2. **Verify the metrics.** Is uptime measured at the facility level or at your cabinet/rack level?
3. **Check reporting.** Does the provider offer real-time monitoring dashboards and monthly SLA performance reports?
4. **Review the credit structure.** Are the credit percentages meaningful, or are they capped at levels that make claims impractical?
5. **Ask for history.** Request 12 months of actual SLA performance data, not just the contractual targets.

## Marketing Claims vs. Contractual Obligations

One of the most important distinctions in the SLA world is the gap between what a provider **markets** and what they **contractually commit to**. A data centre's website might boldly state "99.999% uptime" in large type, but the actual SLA document buried in the contract appendix may guarantee only 99.9%.

This is not unique to Kenya — it is a global industry practice. However, it is especially important to watch for in a rapidly growing market like East Africa, where competition is driving aggressive marketing. Here is how to protect yourself:

- **Always request the full SLA document before signing.** Do not rely on sales collateral or website claims.
- **Identify the legally binding metrics.** The only numbers that matter are the ones in the signed contract with financial penalties attached.
- **Look for weasel words.** Phrases like "target," "aim," or "design intent" are not guarantees.
- **Cross-reference with the ITIL framework.** The [ITIL service management best practices](https://www.axelos.com/certifications/itil-service-management) provide a useful benchmark for evaluating whether an SLA is comprehensive and professionally structured.

![Business professionals reviewing data centre contracts](/images/dc-business-investment.png)

## What to Negotiate in Your SLA

If you are a serious colocation customer committing multiple racks or a private cage, you should negotiate several SLA elements:

### Custom Uptime Targets

Standard SLAs are designed for the average customer. If your workloads demand higher availability, negotiate for a four-nines or five-nines commitment — but expect to pay a premium for it.

### Reporting Requirements

Insist on **monthly SLA performance reports** with detailed metrics covering power availability, cooling performance, network uptime, and ticket response times. Some Kenyan operators provide real-time dashboards through customer portals; negotiate for API access if you want to integrate this data into your own monitoring systems.

### Response Time Guarantees

If your team is not physically present at the facility, remote hands and smart hands response times are critical. Negotiate for guaranteed response times with financial penalties if the provider misses them.

### Exit Clauses

Ensure your SLA or master services agreement includes a clear **exit clause** that allows you to terminate the contract without penalty if the provider repeatedly fails to meet SLA commitments. A common threshold is three SLA breaches within any 12-month period.

### Maintenance Windows

Scheduled maintenance is a common SLA exclusion. Negotiate for maintenance windows that fall outside your peak business hours — for example, 02:00–06:00 EAT on Sundays — and ensure the provider gives adequate advance notice (typically 7 to 14 days).

## SLA Tier Comparison: At a Glance

| Feature | Basic (99.9%) | Standard (99.99%) | Premium (99.999%) |
|---|---|---|---|
| **Annual downtime allowance** | ~8 hrs 46 min | ~52 minutes | ~5 minutes |
| **Typical Tier rating** | Tier II | Tier III (N+1) | Tier IV (2N) |
| **Power redundancy** | N+1 components | N+1 distribution | 2N independent paths |
| **Cooling redundancy** | Single path | Concurrently maintainable | Fault tolerant |
| **Service credit (per breach)** | 10% of monthly fee | 10–25% of monthly fee | 25–100% of monthly fee |
| **Remote hands response** | 30 minutes | 15 minutes | 10 minutes or less |
| **SLA reporting** | Quarterly | Monthly | Real-time + monthly |
| **Typical Kenyan providers** | Smaller facilities | Africa Data Centres, IXAfrica, Liquid | Rare — premium suites only |

## Final Thoughts

A data centre SLA is your primary contractual safeguard when entrusting your IT infrastructure to a third-party facility. In the Kenyan market, where the data centre industry is maturing rapidly and operators are competing intensely, SLAs are becoming more generous — but also more complex. The key is to look beyond the headline uptime percentage and understand the full picture: what metrics are covered, what exclusions apply, how enforcement works, and whether the contract reflects reality or marketing aspiration.

Before signing any colocation agreement in Kenya, invest time in reviewing the SLA thoroughly. Request historical performance data, negotiate where possible, and ensure you have independent monitoring in place. The strength of your SLA today determines the resilience of your business tomorrow.

---

## Frequently Asked Questions

### What does 99.99% uptime actually mean in practice?

99.99% uptime means your service can experience no more than 52.6 minutes of unplanned downtime in an entire year. For most Kenyan businesses running e-commerce or SaaS platforms, this is generally considered an excellent standard. However, it is important to check whether the SLA covers scheduled maintenance windows, which some operators exclude from their calculations.

### Can I negotiate a better SLA with a Kenyan data centre provider?

Yes, especially if you are committing significant rack space or a multi-year contract. Larger customers regularly negotiate custom SLA terms around response times, reporting frequency, and service credit percentages. Start by asking for their standard SLA document, then identify the gaps between their offering and your business requirements.

### What happens if a data centre breaches its SLA?

Typically, you are entitled to service credits — a percentage refund on your monthly colocation fee for the month in which the breach occurred. Most providers offer 10% to 100% credit depending on the severity and duration of the outage. However, service credits rarely compensate for your actual business losses such as lost revenue, reputational damage, or regulatory penalties.

### Do Kenyan data centres actually meet their published uptime SLAs?

The major operators — Africa Data Centres, PAIX, Liquid Intelligent Technologies, and IXAfrica — generally meet or exceed their published SLAs, particularly for power and cooling. However, Kenya's national grid (Kenya Power) still experiences occasional outages, which is why robust on-site power infrastructure is critical. Always ask prospective providers for their historical SLA performance reports before signing.

### Is a 99.999% uptime SLA realistic for a Kenyan data centre?

Genuine 99.999% ("five nines") uptime is extremely demanding — it allows only 5.26 minutes of downtime per year. Very few facilities globally achieve this, and it typically requires a Tier IV design with 2N redundancy. In Kenya, some operators may market "five nines" but the contractual SLA may be lower. Always distinguish between marketing language and the legally binding commitment in your contract.
