import sqlite3
import os
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "dev.db")


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
            "title": "Kenya's Data Centre Licensing Framework: What NFP-T1 and NFP-T2 Mean for the Industry",
            "slug": "kenya-data-centre-licensing-framework-nfp-t1-nfp-t2",
            "tlDr": "The Communications Authority has brought commercial data centres under the NFP-T1 and NFP-T2 telecoms licensing tiers for the first time, with fees from KES 800,000 annually for pure-play operators.",
            "description": "A deep dive into Kenya's Revised Telecommunications Market Structure (2026), which for the first time formally regulates commercial data centres under NFP-T1 and NFP-T2 licences.",
            "cluster": "Kenya",
            "status": "Published",
            "content": """## The Regulatory Shift

On 6 March 2026, Communications Authority of Kenya Director General **David Mugonyi** signed a notice in the Kenya Gazette that would fundamentally alter how data centres operate in the country. Gazette Notice No. 3335 gave formal effect to the **Revised Telecommunications Market Structure**, a document that, for the first time in Kenya's regulatory history, expressly brought commercial data centres within the telecommunications licensing framework. The revised structure took effect thirty days after publication, meaning that by early April 2026, every commercial data centre operator in Kenya needed to understand exactly where they fit within the new regime.

The change is not cosmetic. Under the previous Unified Licensing Framework (ULF), which had governed Kenya's telecoms sector since 2021, data centre operators occupied an ambiguous space. They were not explicitly categorised in any licence class, which meant that licensing was often determined on a case-by-case basis depending on how a given operator's activities mapped onto existing categories. This created uncertainty for investors, inconsistent treatment for operators, and a regulatory gap that the Authority has now moved decisively to close.

The implications are significant not just for the roughly nineteen operational data centres scattered across Nairobi and Mombasa, but for the billions of shillings in planned investment that Kenya's digital infrastructure sector is hoping to attract. Microsoft's stalled one-billion-dollar AI data centre project, the expansion of Africa Data Centres and iXAfrica facilities, and the government's own National Digital Superhighway Programme all exist within a regulatory environment that has now, for the first time, been explicitly defined.

## Why Data Centres Became Too Critical to Leave Unlicensed

The CA's decision did not emerge from a vacuum. It was the product of a formal public consultation process that began with a consultation paper published in December 2024. In that paper, the Authority articulated a clear rationale: data centres have evolved from simple server rooms into critical national infrastructure, and the regulatory framework needed to evolve accordingly.

The Authority wrote that **given that the facility owner in the second type of data centre arrangement significantly influences data accessibility, it is necessary to bring these arrangements within the licensing framework to protect users' data access rights.** This language is telling. The CA was not merely tidying up its licence categories; it was asserting that data centres, by virtue of the role they play in mediating access to digital services, are functionally equivalent to communications infrastructure providers like tower companies and fibre operators.

The real-world urgency of this position was demonstrated just weeks later, in June 2026, when a power outage at the Huduma Kenya data centre in Nakuru brought government services to a halt nationwide. Huduma Centres across all forty-seven counties went offline simultaneously, affecting millions of citizens who rely on these centres for identity documents, business registrations, and a range of essential government services. The incident was a stark reminder that data centre failures are no longer theoretical risks confined to the technology sector; they are events with immediate, tangible consequences for public administration and economic activity.

The CA's reasoning drew a direct parallel with communications tower companies, which have long been regulated as Network Facilities Providers despite operating what is, in many respects, passive infrastructure. A data centre, the Authority effectively argued, is to the digital economy what a communications tower is to the mobile network: the physical layer without which everything above it ceases to function. The regulatory alignment, in the CA's view, was long overdue.

## NFP-T1 and NFP-T2: How the Licence Structure Works

The Revised Telecommunications Market Structure did not create a standalone data centre licence. Instead, it placed data centre operations within the existing Network Facilities Provider licence framework, specifically under **NFP-Tier 2 (NFP-T2)** as the primary licensing route, with **NFP-Tier 1 (NFP-T1)** available for operators who also require nationwide infrastructure and spectrum rights. This modular approach is consistent with the CA's longstanding technology-neutral licensing philosophy, which avoids creating narrow, technology-specific licences in favour of broader, activity-based categories that can accommodate technological evolution without requiring constant regulatory revision.

The distinction between the two tiers is substantial and has direct financial implications for operators. NFP-T2 is the primary licence for pure-play data centre operators. It permits the establishment and operation of commercial data centres on a countrywide basis, with infrastructure deployed incrementally, county by county. The initial licence fee is KES 15 million for a fifteen-year term, with annual operating fees set at 0.4% of Annual Gross Turnover or KES 800,000, whichever is higher. For a new entrant building a single facility, this is the most cost-effective and operationally straightforward path to compliance.

NFP-T1, by contrast, is designed for large integrated operators with nationwide reach. It is the only licence tier that permits exclusive nationwide spectrum reservation from day one, making it suitable for operators who need both data centre capacity and their own transmission infrastructure. The licence fee is KES 15 million for a standard fifteen-year term, or KES 45 million for an optional twenty-five-year term that provides greater investment certainty for capital-intensive deployments. The annual operating fee is significantly higher: 0.4% of Annual Gross Turnover or KES 4 million, whichever is higher. This reflects the broader scope of infrastructure and spectrum rights that the licence confers.

It is worth noting that during the consultation process, the CA had initially proposed placing data centres under the NFP-T3 category, which covers limited geographic areas. Industry stakeholders pushed back, arguing that data centres inherently serve a national or regional function and that confining them to a county-level licence would be impractical. The Authority accepted this reasoning, and the final framework places data centres under the two highest infrastructure tiers. For entities that already hold an NFP-T2 licence, the updated structure grants the right to establish commercial data centres without needing any additional licence, which simplifies compliance for existing operators.

## Kenya's Data Centre Landscape: The Numbers

As of mid-2026, Kenya is home to **nineteen operational data centres**: fifteen in Nairobi and four in Mombasa. The coastal facilities are strategically positioned near submarine cable landing stations, which give Kenya its competitive advantage as an East African connectivity hub. Nairobi, meanwhile, serves as the primary market for domestic and regional enterprise demand, hosting the largest concentration of carrier-neutral colocation facilities in the region.

The market's total IT power capacity stood at approximately **15 megawatts in 2025**, a figure that is projected to reach **25 megawatts by 2030**, representing a compound annual growth rate of 10.76% according to Mordor Intelligence. In monetary terms, the Kenya data centre market was valued at **USD 266 million in 2025** and is forecast to reach **USD 805 million by 2031**, growing at 20.27% annually according to ResearchAndMarkets. These are not marginal numbers. They represent one of the fastest-growing data centre markets on the African continent, driven by a convergence of factors including submarine cable connectivity, a growing fintech ecosystem, government digitisation programmes, and increasing cloud adoption across East and Central Africa.

The key players operating in this space include Africa Data Centres (a Liquid Intelligent Technologies company), which operates multiple facilities including a significant presence along Mombasa Road; iXAfrica Data Centres, which has developed East Africa's first hyper-scale, AI-ready facility at NBOX1.1 with a 4.5 megawatt IT load; and various government-owned facilities that support public sector digital services. Safaricom and Telkom Kenya also operate data centre infrastructure to support their telecommunications and enterprise services businesses.

## The Power Constraint: Why Licensing Is Necessary but Not Sufficient

While the regulatory framework has taken a significant step forward, the single largest obstacle to data centre growth in Kenya remains the power supply. This is not a hypothetical concern. In May 2026, Microsoft and G42's planned one-billion-dollar AI data centre project — which would have been the largest single foreign direct investment in Kenya's digital infrastructure — stalled after it became clear that the national grid could not reliably deliver the power capacity the facility required. Government officials reportedly indicated that meeting the project's energy demands would require rationing power to other consumers, a politically untenable proposition.

The power challenge is multi-dimensional. Kenya's electricity generation capacity, while substantial relative to many African peers, is concentrated in geothermal and hydroelectric sources that are geographically fixed. Data centre demand, by contrast, is concentrated in Nairobi and its environs, creating transmission bottlenecks. The country's total installed generation capacity stands at approximately 3,500 megawatts, but the Microsoft project alone was reported to require several hundred megawatts — a demand that would represent a significant share of the national grid's firm capacity.

The Huduma Kenya outage in June 2026 further illustrated the power reliability challenge. A single power supply failure at one data centre in Nakuru was sufficient to disrupt government services across the entire country. This is not a resilience problem that can be solved by licensing alone; it requires investment in backup power systems, redundant power feeds, and ultimately, the diversification and expansion of Kenya's electricity generation and distribution infrastructure.

## Other Notable Changes in the Revised Structure

The revised market structure introduced changes beyond data centre licensing that are relevant to the broader digital infrastructure ecosystem. The CA created a new **Landing Rights Authorisation (LRA)**, a separate licence category for entities that transmit telecommunications signals into Kenya via submarine cables or satellite. Previously, landing rights were bundled within the International Gateway Systems and Services (IGSS) licence, which created a barrier for entities that wanted to land infrastructure in Kenya without taking on the full scope of an IGSS licence. The separation is a strategic move designed to make it easier for international submarine cable operators to establish a presence in Kenya and to position the country as a gateway for landlocked East African nations.

The Authority also expanded the scope of the NFP-T3 licence, which previously covered a single county, to cover up to three counties. A new **Micro Network and Services Provider (MNSP)** licence was introduced for operators serving limited areas from residential estates up to county level, covering voice, data, and internet services. This category is partly aimed at curbing illegal service providers operating in residential areas while also promoting competition and lowering costs for consumers in underserved areas.

## What This Means for Operators and Investors

For existing data centre operators, the immediate practical impact is that they need to ensure they hold the appropriate NFP licence category. Operators already licensed under NFP-T2 can establish commercial data centres without additional authorisation. Those operating under other licence classes, or those without any licence, need to assess their activities against the new framework and take steps to comply.

For prospective investors, particularly international operators evaluating East African market entry, the framework provides a degree of predictability that was previously absent. The licence fees, while not trivial, are within the range that would be expected for a market of Kenya's size and strategic importance. The fifteen-year licence term provides sufficient runway for return on investment, and the optional twenty-five-year NFP-T1 term accommodates the longest infrastructure investment cycles. The annual operating fee structure, based on a percentage of gross turnover with a minimum floor, aligns the Authority's revenue with operator success rather than penalising operators during their growth phase.

The broader policy trajectory is encouraging. Kenya has progressively liberalised its ICT investment framework: the removal of the thirty percent local shareholding requirement for ICT licensees, the introduction of Special Economic Zones with customs and tax relief on ICT equipment, and now the formal licensing of data centres all signal a deliberate strategy to position the country as a premier destination for digital infrastructure investment in Africa.""",
            "readingTimeMin": 12,
            "lastVerified": "2026-08",
            "dataSource": "Communications Authority of Kenya, Gazette Notice No. 3335; Bowmans; McKay Advocates; O'Bang Law; Mordor Intelligence; ResearchAndMarkets",
            "sortOrder": 0,
            "isFoundational": False,
            "claims": [
                {
                    "claim": "Gazette Notice No. 3335 of 6 March 2026 gave effect to the Revised Telecommunications Market Structure, formally bringing commercial data centres under NFP-T1 and NFP-T2 licensing.",
                    "source": "https://www.ca.go.ke/sites/default/files/2026-06/Revised%20Telecommunications%20Market%20Structure-June%202026.pdf",
                    "sourceTitle": "Communications Authority of Kenya, Revised Telecommunications Market Structure (June 2026)",
                    "verifiedDate": "2026-08",
                    "confidence": "High"
                },
                {
                    "claim": "The NFP-T2 licence for data centres costs KES 15 million initially (15-year term) with annual fees of 0.4% of Annual Gross Turnover or KES 800,000, whichever is higher.",
                    "source": "https://www.ca.go.ke/sites/default/files/2026-06/Revised%20Telecommunications%20Market%20Structure-June%202026.pdf",
                    "sourceTitle": "CA Revised Telecommunications Market Structure (June 2026)",
                    "verifiedDate": "2026-08",
                    "confidence": "High"
                },
                {
                    "claim": "The NFP-T1 licence offers an optional 25-year term at KES 45 million, with annual fees of 0.4% of AGT or KES 4 million, whichever is higher.",
                    "source": "https://bowmanslaw.com/insights/kenya-revised-telecommunications-market-structure-formal-recognition-of-data-centres-as-a-regulated-activity",
                    "sourceTitle": "Bowmans, Kenya: Revised Telecommunications Market Structure (2026)",
                    "verifiedDate": "2026-08",
                    "confidence": "High"
                },
                {
                    "claim": "Kenya has 19 operational data centres: 15 in Nairobi and 4 in Mombasa.",
                    "source": "https://www.mordorintelligence.com/industry-reports/kenya-data-center-market",
                    "sourceTitle": "Mordor Intelligence, Kenya Data Center Market Report (2025)",
                    "verifiedDate": "2026-08",
                    "confidence": "High"
                },
                {
                    "claim": "Kenya's data centre market was valued at USD 266 million in 2025 and is projected to reach USD 805 million by 2031, growing at 20.27% CAGR.",
                    "source": "https://www.globenewswire.com/news-release/2026/03/11/3253597/28124/en/kenya-data-center-investment-and-growth-analysis-report-2026.html",
                    "sourceTitle": "ResearchAndMarkets, Kenya Data Center Investment and Growth Analysis Report 2026 (March 2026)",
                    "verifiedDate": "2026-08",
                    "confidence": "High"
                },
                {
                    "claim": "Kenya's data centre IT power capacity was 15 MW in 2025, projected to reach 25 MW by 2030 at 10.76% CAGR.",
                    "source": "https://www.mordorintelligence.com/industry-reports/kenya-data-center-market",
                    "sourceTitle": "Mordor Intelligence, Kenya Data Center Market Report (2025)",
                    "verifiedDate": "2026-08",
                    "confidence": "High"
                },
                {
                    "claim": "The Microsoft-G42 $1 billion AI data centre project stalled in May 2026 due to insufficient national grid power capacity.",
                    "source": "https://www.semafor.com/article/05/06/2026/energy-shortfall-problem-scuppers-kenyas-1b-microsoft-data-center",
                    "sourceTitle": "Semafor, Energy shortfall scuppers Kenya's $1B Microsoft data center (May 2026)",
                    "verifiedDate": "2026-08",
                    "confidence": "High"
                },
                {
                    "claim": "A power outage at the Huduma Kenya data centre in Nakuru on 15 June 2026 halted government services nationwide.",
                    "source": "https://techweez.com/2026/06/15/huduma-centre-services-halted",
                    "sourceTitle": "Techweez, Huduma Centre Services Halted After Data Center Loses Power (June 2026)",
                    "verifiedDate": "2026-08",
                    "confidence": "High"
                },
                {
                    "claim": "The CA initially proposed placing data centres under NFP-T3 but moved them to NFP-T1/NFP-T2 after industry stakeholder pushback.",
                    "source": "https://obang.law/communications-authoritys-revised-telecommunications-market-structure-2026",
                    "sourceTitle": "O'Bang Law, Communications Authority's Revised Telecommunications Market Structure 2026 (April 2026)",
                    "verifiedDate": "2026-08",
                    "confidence": "Medium",
                    "notes": "O'Bang Law and the LinkedIn analysis by a regulatory specialist confirm NFP-T3 was the initial proposal. The CA's own consultation paper referenced the NFP-T3 route. The final Gazette notice placed DCs under NFP-T1 and NFP-T2."
                },
                {
                    "claim": "A new Landing Rights Authorisation (LRA) licence was created, separating landing rights from the IGSS licence.",
                    "source": "https://obang.law/communications-authoritys-revised-telecommunications-market-structure-2026",
                    "sourceTitle": "O'Bang Law, Revised Telecommunications Market Structure 2026",
                    "verifiedDate": "2026-08",
                    "confidence": "High"
                }
            ]
        }
    ]

    for article in articles:
        aid = new_id(cur)
        cur.execute("""
            INSERT INTO Article (id, title, slug, tlDr, description, cluster, status, content, readingTimeMin, lastVerified, dataSource, sortOrder, isFoundational, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        """, (
            aid,
            article["title"],
            article["slug"],
            article["tlDr"],
            article["description"],
            article["cluster"],
            article["status"],
            article["content"],
            article["readingTimeMin"],
            article["lastVerified"],
            article["dataSource"],
            article["sortOrder"],
            0 if article["isFoundational"] else 0,
        ))

        for claim in article.get("claims", []):
            cid = new_id(cur)
            cur.execute("""
                INSERT INTO ArticleClaim (id, claim, source, sourceTitle, verifiedDate, confidence, notes, articleId, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            """, (
                cid,
                claim["claim"],
                claim["source"],
                claim.get("sourceTitle"),
                claim.get("verifiedDate"),
                claim["confidence"],
                claim.get("notes"),
                aid,
            ))

    conn.commit()
    print(f"Seeded {len(articles)} article(s) with claims.")
    conn.close()


if __name__ == "__main__":
    main()
