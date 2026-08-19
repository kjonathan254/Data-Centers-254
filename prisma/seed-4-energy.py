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
            "title": "How Much Electricity Does a Data Centre Use?",
            "slug": "how-much-electricity-does-a-data-centre-use",
            "tlDr": "A single large data centre can consume as much electricity as a mid-sized Kenyan town. Globally, data centres use about 1-2% of all electricity generated, and that figure is rising fast as AI workloads expand.",
            "description": "Explains how data centre electricity consumption is measured, from watts per rack to megawatts per facility, and puts global and Kenyan figures in context.",
            "content": """## From Watts to Megawatts

When people talk about data centre power, the numbers can feel abstract. A single server rack might draw 5 to 10 kilowatts. A small facility with 50 racks could need 500 kilowatts. But modern hyperscale data centres — the kind built by Google, Microsoft, and Amazon — routinely draw 100 to 500 megawatts. That is the same order of magnitude as the electricity demand of a Kenyan county town like Nakuru or Eldoret.

## The Global Picture

The International Energy Agency estimates that data centres consumed roughly 220-340 terawatt-hours of electricity in 2023, about 1-2% of global demand. This has been rising steadily, driven by cloud computing, streaming video, and increasingly by artificial intelligence training and inference. The IEA projects that by 2026, data centre electricity use could reach 800-1,050 TWh, which would be comparable to the entire electricity consumption of Japan.

## Kenya's Data Centre Power

Kenya's commercial data centres today are relatively small by global standards. A typical Tier III facility in Nairobi might use 2-5 megawatts. Africa Data Centres' campus in Nairobi is designed for up to 10 MW. For context, Kenya's total installed generation capacity is around 3,000 MW. So even a 10 MW facility would represent less than half a percent of the national total. However, the proposed Microsoft-G42 project at Olkaria was planned for 100 MW — a very different scale that would have represented over 3% of Kenya's total generation capacity.

## Why the Numbers Keep Growing

Every time you stream a video, send a WhatsApp message, or query ChatGPT, a data centre somewhere does work. AI is the biggest new driver: training a single large language model can consume thousands of megawatt-hours. A ChatGPT search query is estimated to use roughly 10 times more electricity than a traditional Google search. As Kenya attracts more cloud and AI investment, understanding these numbers is not optional — it is essential for national planning.

## Measuring Efficiency: PUE

The industry uses a metric called Power Usage Effectiveness (PUE) to measure how efficiently a facility turns electricity into useful computing. PUE is calculated as total facility power divided by IT equipment power. A PUE of 1.0 would mean every watt goes to computing. In practice, most facilities operate between 1.2 and 1.8 because of cooling, lighting, and power distribution losses. Kenya's mild highland climate gives facilities here a natural advantage: they can use outside air for cooling much of the year, pushing PUE closer to 1.2 and saving significant electricity.""",
            "readingTimeMin": 6,
            "sortOrder": 1,
            "claims": [
                {
                    "claim": "Globally, data centres consumed roughly 220-340 terawatt-hours of electricity in 2023, about 1-2% of global demand, with projections reaching 800-1,050 TWh by 2026.",
                    "source": "International Energy Agency (IEA), Data Centres and Data Transmission Networks, 2024",
                    "sourceTitle": "IEA Data Centres and Data Transmission Networks Report 2024",
                    "confidence": "High"
                },
                {
                    "claim": "A ChatGPT search query uses roughly 10 times more electricity than a traditional Google search.",
                    "source": "EPRI (Electric Power Research Institute) and University of Washington research estimates",
                    "sourceTitle": "EPRI AI Energy Consumption Estimates",
                    "confidence": "Medium"
                },
                {
                    "claim": "Kenya's total installed generation capacity is approximately 3,000 MW, and the proposed Microsoft-G42 Olkaria project was planned for 100 MW.",
                    "source": "Kenya National Bureau of Statistics, EPRA, and Microsoft-G42 MOU announcements",
                    "sourceTitle": "EPRA Annual Report and Microsoft-G42 Partnership Announcement",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "Why Data Centres Need So Much Power",
            "slug": "why-data-centres-need-so-much-power",
            "tlDr": "Data centres need massive amounts of electricity because thousands of servers run 24/7, and keeping those servers cool can double the power bill. Understanding where the power goes is the first step to managing it.",
            "description": "Breaks down the components of data centre power consumption — servers, cooling, power distribution, and networking — and explains why each one matters.",
            "content": """## It Is Not Just the Servers

When most people picture a data centre, they imagine rows of blinking servers. Servers are indeed the heart of a data centre, and they consume the majority of the electricity — typically 40-60% of total facility power. But they are not the whole story. The remaining power goes to cooling systems, power distribution equipment (uninterruptible power supplies, transformers, and wiring losses), and networking gear like switches and routers.

## Servers: Always On, Always Working

Modern servers are powerful but power-hungry. A typical rack server draws 300-500 watts. A single rack holding 40 servers can draw 12-20 kilowatts. A large facility with 1,000 racks could need 12-20 megawatts just for the servers. And unlike an office computer that goes to sleep at night, data centre servers run around the clock because their users are in different time zones or because the workloads — like AI training or database replication — never stop.

## Cooling: The Hidden Cost

All that computing generates heat. If a server gets too hot, it slows down or fails. So data centres must remove heat continuously. In a hot climate, this can be extremely energy-intensive. Traditional air conditioning might use as much electricity as the servers themselves, giving a PUE of 2.0 or worse. Kenya's advantage is its climate: Nairobi sits at 1,795 metres above sea level with average temperatures around 19°C, and Olkaria is even cooler at roughly 2,000 metres. This means facilities in Kenya can use free air cooling for much of the year, dramatically reducing cooling energy.

## Power Distribution Losses

Electricity from the grid is not delivered perfectly. Transformers convert voltage levels, UPS systems maintain clean power and provide backup, and every cable and connection loses a small amount of energy. A well-designed facility might lose 5-10% of incoming power before it reaches the servers. This is why the PUE metric includes all facility power, not just what the servers use.

## Networking Equipment

Switches, routers, and optical transceivers also consume electricity. In a hyperscale facility, networking gear can account for 10-15% of total IT power. As data centres handle more AI traffic — which requires moving massive datasets between servers — the networking load grows. Kenya Power's grid must be reliable enough to handle these continuous, high-quality power demands.""",
            "readingTimeMin": 6,
            "sortOrder": 2,
            "claims": [
                {
                    "claim": "Servers typically account for 40-60% of a data centre's total power consumption, with cooling, power distribution, and networking making up the rest.",
                    "source": "Uptime Institute, Data Centre Industry Survey",
                    "sourceTitle": "Uptime Institute Global Data Centre Survey",
                    "confidence": "High"
                },
                {
                    "claim": "Nairobi's altitude of 1,795 metres and average temperature of 19°C allow data centres to use free air cooling for much of the year, reducing cooling energy significantly.",
                    "source": "Kenya Meteorological Department climate data and Uptime Institute cooling guidelines",
                    "sourceTitle": "Kenya Meteorological Department Historical Climate Data",
                    "confidence": "High"
                },
                {
                    "claim": "A well-designed data centre may lose 5-10% of incoming electricity to power distribution losses before it reaches servers.",
                    "source": "The Green Grid and Uptime Institute technical publications",
                    "sourceTitle": "The Green Grid PUE White Paper",
                    "confidence": "Medium"
                }
            ]
        },
        {
            "title": "Can Kenya's Geothermal Energy Power AI?",
            "slug": "can-kenyas-geothermal-energy-power-ai",
            "tlDr": "Kenya sits on one of the world's richest geothermal resources, with over 800 MW installed at Olkaria alone. This makes it one of the few places on Earth where AI data centres could run almost entirely on clean, baseload geothermal power.",
            "description": "Explains what geothermal energy is, describes Kenya's geothermal resources at Olkaria, and assesses whether this resource is sufficient and suitable to power AI data centres.",
            "content": """## What Is Geothermal Energy?

Geothermal energy is heat from the Earth's interior. In places where magma or hot rocks lie close to the surface, underground water gets superheated and rises to the surface as steam or hot water. Engineers drill wells into these geothermal reservoirs and use the steam to drive turbines that generate electricity. Unlike solar and wind, geothermal is available 24 hours a day, 365 days a year, making it ideal for baseload power — the minimum amount of electricity a grid must supply at all times.

## Olkaria: Kenya's Geothermal Crown Jewel

Kenya's geothermal resources are concentrated in the Great Rift Valley, with the Olkaria field in Naivasha being the most developed. Olkaria is located about 120 kilometres northwest of Nairobi, at an elevation of roughly 2,000 metres. The Kenya Electricity Generating Company (KENGEN) operates the majority of Olkaria's wells and power plants, with a total installed capacity exceeding 800 MW. Olkaria is the largest geothermal complex in Africa and one of the largest in the world.

## Why Geothermal Is Perfect for Data Centres

Data centres need power that is available around the clock. Solar only works during the day. Wind is intermittent. Geothermal, however, provides steady baseload power with a capacity factor above 90%, meaning the plants produce electricity almost all the time. This reliability is exactly what data centre operators demand. Additionally, geothermal electricity has a very low carbon footprint — comparable to wind and solar — which helps companies meet their sustainability commitments.

## The Microsoft-G42 Vision

In 2024, Microsoft and UAE-based AI firm G42 announced plans to build a 100 MW geothermal-powered data centre at Olkaria. The idea was compelling: an AI facility running on clean, reliable geothermal energy, leveraging Kenya's natural advantage. However, the project has reportedly stalled, with political changes in the United States and shifting priorities at Microsoft contributing to delays. The episode illustrates both the promise and the uncertainty of Kenya's ambitions in this space.

## Scale Considerations

Kenya's current geothermal installed capacity is about 800-900 MW out of a total national capacity of roughly 3,000 MW. A single 100 MW AI data centre would consume about 10-12% of Kenya's entire geothermal output. Multiple such facilities would require significant expansion of geothermal drilling and generation. The Kenya Electricity Regulatory Authority (EPRA) and KENGEN would need to coordinate closely to ensure that adding large data centre loads does not compromise supply to existing consumers.""",
            "readingTimeMin": 7,
            "sortOrder": 3,
            "claims": [
                {
                    "claim": "Kenya has over 800 MW of installed geothermal capacity at Olkaria, making it the largest geothermal complex in Africa.",
                    "source": "KENGEN annual reports and EPRA data",
                    "sourceTitle": "KENGEN Annual Report and EPRA Generation Statistics",
                    "confidence": "High"
                },
                {
                    "claim": "Microsoft and G42 announced plans for a 100 MW geothermal-powered data centre at Olkaria in 2024, but the project has reportedly stalled.",
                    "source": "Microsoft and G42 press releases, Reuters reporting",
                    "sourceTitle": "Microsoft-G42 Partnership Announcement and Reuters Follow-Up Reports",
                    "confidence": "High"
                },
                {
                    "claim": "Geothermal energy has a capacity factor above 90%, making it one of the most reliable sources of baseload renewable electricity.",
                    "source": "International Renewable Energy Agency (IRENA) and KENGEN operational data",
                    "sourceTitle": "IRENA Geothermal Power Statistics",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "Data Centres and Kenya's Electricity Grid",
            "slug": "data-centres-and-kenyas-electricity-grid",
            "tlDr": "Kenya's electricity grid is roughly 90% renewable, one of the greenest in the world. But adding large data centres requires careful planning around grid capacity, transmission infrastructure, and the balance between geothermal, hydro, wind, and solar.",
            "description": "Provides an overview of Kenya's electricity grid — its generation mix, key institutions, and infrastructure — and examines how data centres fit into this picture.",
            "content": """## A Remarkably Green Grid

Kenya's electricity grid is approximately 90% renewable, one of the highest proportions in the world. The mix is dominated by geothermal energy (around 45% of generation), followed by hydropower (about 30%), wind (roughly 10%), and solar. Fossil fuels — mainly diesel and heavy fuel oil used in emergency plants — make up the remaining 10%. This clean grid is a major selling point for attracting data centre investment, because companies like Google and Microsoft have pledged to run on 100% clean energy.

## The Key Institutions

Kenya's electricity sector involves several key institutions. KENGEN is the primary electricity generator, responsible for most of the country's geothermal and hydro plants. Kenya Power (KPLC) is the national transmission and distribution utility — it buys power from generators and sells it to consumers. The Energy and Petroleum Regulatory Authority (EPRA) sets tariffs, issues licences, and oversees the sector. The Ministry of Energy provides policy direction. For a data centre operator, dealing with these institutions is part of the cost of doing business.

## Grid Capacity and Constraints

Kenya's total installed generation capacity is approximately 3,000 MW, but peak demand is only about 2,000 MW, leaving a margin of roughly 1,000 MW. This headroom is important because it means there is theoretical capacity for new loads. However, generation capacity is not the same as deliverable capacity. Transmission bottlenecks, especially on lines serving areas outside Nairobi, can limit how much power can actually be delivered to a new facility. The Olkaria geothermal field, for example, has abundant generation but limited transmission capacity connecting it to high-demand areas.

## The Role of Power Purchase Agreements

Large consumers like data centres typically negotiate Power Purchase Agreements (PPAs) directly with generators like KENGEN, rather than buying through Kenya Power's standard tariff. PPAs can offer more competitive rates and greater supply certainty, but they require EPRA approval and long-term commitments. The Microsoft-G42 deal reportedly involved a direct PPA with KENGEN for geothermal power from Olkaria.

## What Could Go Wrong

Adding a 100 MW data centre load to a grid with 1,000 MW of headroom sounds manageable, but it is not that simple. Data centres demand extremely reliable power — often 99.999% availability. Kenya's grid, while improving, still experiences outages and frequency instability. This is why large data centres always build their own backup systems, typically diesel generators that can run the entire facility for days if needed.""",
            "readingTimeMin": 7,
            "sortOrder": 4,
            "claims": [
                {
                    "claim": "Kenya's electricity grid is approximately 90% renewable, with geothermal contributing about 45%, hydro about 30%, and wind and solar making up the remainder.",
                    "source": "EPRA and Kenya National Bureau of Statistics",
                    "sourceTitle": "EPRA Annual Report on Kenya's Energy Sector",
                    "confidence": "High"
                },
                {
                    "claim": "Kenya's total installed generation capacity is approximately 3,000 MW with peak demand of about 2,000 MW, leaving roughly 1,000 MW of headroom.",
                    "source": "EPRA and Kenya Power generation and demand statistics",
                    "sourceTitle": "EPRA National Electricity Supply Industry Statistics",
                    "confidence": "High"
                },
                {
                    "claim": "Large data centres typically negotiate Power Purchase Agreements (PPAs) directly with generators like KENGEN, requiring EPRA approval.",
                    "source": "EPRA licensing framework and industry practice",
                    "sourceTitle": "EPRA Licensing and Tariff Guidelines",
                    "confidence": "Medium"
                }
            ]
        },
        {
            "title": "What Would a 100 MW Data Centre Mean for Kenya?",
            "slug": "what-would-a-100-mw-data-centre-mean-for-kenya",
            "tlDr": "A 100 MW data centre would consume about 3% of Kenya's total generation capacity and roughly 5% of its peak demand. That is a significant single load — comparable to a small county's entire electricity consumption — and it would reshape grid planning.",
            "description": "Puts a 100 MW data centre in concrete Kenyan terms: what fraction of the grid it represents, how it compares to other large consumers, and what it means for infrastructure planning.",
            "content": """## 100 MW in Plain Numbers

Kenya's total installed generation capacity is roughly 3,000 MW. A 100 MW data centre would represent about 3.3% of that total. Against peak demand of roughly 2,000 MW, it would be about 5%. To put it differently, a single 100 MW facility would use more electricity than many entire Kenyan counties. Nakuru County, for instance, has a peak demand well below 100 MW. This is not a small factory plugging into the grid — it is a major new load category.

## Who Uses 100 MW?

In Kenya, the largest single electricity consumers are industrial facilities: cement factories, steel mills, and large mining operations. A 100 MW data centre would rival or exceed the consumption of any single industrial customer in the country. Globally, very few data centres reach this scale. Most are in the 10-50 MW range. A 100 MW facility would be a Tier III or Tier IV hyperscale campus, likely with multiple buildings, thousands of server racks, and its own dedicated substation.

## Grid Impact

Adding 100 MW to a grid with 1,000 MW of headroom sounds feasible, but the quality of that headroom matters. Not all generation is available all the time. Hydro depends on rainfall patterns. Wind is seasonal. Only geothermal and thermal plants provide firm capacity. So the effective firm capacity margin is smaller than the headline 1,000 MW figure. KENGEN and EPRA would need to ensure that the grid can reliably serve this load without affecting other consumers, especially during dry seasons when hydro output drops.

## Economic Benefits

Despite the challenges, a 100 MW data centre would bring substantial economic benefits. Construction would create hundreds of jobs. The facility itself would employ dozens of skilled technicians and engineers. Kenya Power would collect significant revenue from power sales. KENGEN would gain a major anchor customer for its geothermal output. The government would collect taxes and levies. The data centre would also attract ancillary businesses — fibre providers, maintenance contractors, and cloud services companies.

## The Infrastructure Bill

A 100 MW data centre is not just a building with servers. It needs a dedicated high-voltage connection to the grid, typically 132 kV or higher. It needs multiple fibre-optic links for redundancy. It needs water for cooling and fire suppression. It needs road access for heavy equipment deliveries. In short, it needs infrastructure that may not exist at the chosen site and that someone — the developer, the government, or both — must pay for. The Olkaria site, for instance, would require significant transmission upgrades to deliver 100 MW reliably.

## The Question of Fairness

One concern that arises is whether a single large data centre consumer could crowd out ordinary Kenyans. If KENGEN diverts geothermal output to a data centre, does that mean less power for homes and businesses? This is a legitimate concern, and it is why EPRA's regulatory oversight is critical. Any major PPA must be evaluated for its impact on national energy security and equitable access.""",
            "readingTimeMin": 7,
            "sortOrder": 5,
            "claims": [
                {
                    "claim": "A 100 MW data centre would represent about 3.3% of Kenya's total installed generation capacity of roughly 3,000 MW and about 5% of peak demand of roughly 2,000 MW.",
                    "source": "EPRA generation statistics and Kenya Power demand data",
                    "sourceTitle": "EPRA Annual Report and Kenya Power Supply Report",
                    "confidence": "High"
                },
                {
                    "claim": "A 100 MW facility would rival or exceed the electricity consumption of any single industrial customer currently in Kenya.",
                    "source": "Kenya Power major customer disclosures and industrial sector analysis",
                    "sourceTitle": "Kenya Power Largest Power Consumers Data",
                    "confidence": "Medium"
                },
                {
                    "claim": "A 100 MW data centre would typically require a dedicated high-voltage grid connection of 132 kV or higher and multiple fibre-optic links.",
                    "source": "IEEE data centre power standards and Kenya Power grid code",
                    "sourceTitle": "IEEE Data Centre Power Standards and Kenya Power Grid Code",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "What Would a 1 GW Data Centre Mean?",
            "slug": "what-would-a-1-gw-data-centre-mean",
            "tlDr": "A 1 gigawatt data centre would consume one-third of Kenya's entire generation capacity. No single facility of this scale has been proposed for Kenya, but it illustrates the extreme energy demands of AI and why national energy planning must account for them.",
            "description": "Explores the theoretical implications of a 1 GW data centre for a country with 3,000 MW of total capacity, putting AI's energy appetite into stark perspective.",
            "content": """## One Gigawatt: Grasping the Scale

One gigawatt is 1,000 megawatts. For a country with roughly 3,000 MW of total installed generation capacity, a 1 GW data centre would consume about one-third of the entire national supply. This is not a realistic near-term prospect for Kenya, but it is a useful thought experiment because multiple technology companies have announced plans for campuses in this range globally. understanding the scale helps explain why AI energy demand is becoming a geopolitical issue.

## Who Is Building at This Scale?

The largest data centre campuses in the world are approaching this scale. Microsoft has discussed multi-gigawatt build-outs. Amazon Web Services has announced facilities that could exceed 1 GW when fully built out. These are not single buildings but sprawling campuses with dozens of data halls spread across hundreds of acres. They require their own electrical substations, water treatment plants, and road networks.

## What 1 GW Means for Kenya's Grid

If a 1 GW data centre were built in Kenya, the implications would be profound. The facility alone would use more electricity than Kenya's entire geothermal fleet produces. It would require either massive new generation capacity — meaning new geothermal wells, new wind farms, new solar parks — or it would divert power from existing consumers. Kenya Power's entire distribution network would need upgrades to handle this load. New transmission lines, substations, and grid-scale storage would all be necessary.

## The AI Connection

The reason 1 GW facilities are being discussed at all is artificial intelligence. Training large language models and running AI inference at scale requires enormous computing resources, and each server consumes significant power. As AI capabilities grow and adoption spreads, the largest tech companies anticipate needing gigawatt-scale campuses to meet demand. This is the energy dimension of the AI revolution that rarely makes headlines.

## Why This Matters for Kenya

Kenya will almost certainly not host a 1 GW data centre in the next decade. But the trend toward larger facilities is real, and Kenya's green grid makes it an attractive destination for smaller but still significant facilities in the 50-200 MW range. If Kenya positions itself well, it could capture a meaningful share of the data centre investment flowing into emerging markets. If it does not, it will watch other countries — Morocco, South Africa, Nigeria — take that opportunity instead.

## Lessons from the Numbers

The gap between a 100 MW facility and a 1 GW facility is not just ten times more servers. It is a fundamentally different class of infrastructure. A 100 MW facility can plug into an existing grid with targeted upgrades. A 1 GW facility requires a new power plant or two. This distinction is crucial for Kenyan policymakers and planners to understand as they develop the country's digital infrastructure strategy.""",
            "readingTimeMin": 7,
            "sortOrder": 6,
            "claims": [
                {
                    "claim": "A 1 GW data centre would consume about one-third of Kenya's total installed generation capacity of roughly 3,000 MW.",
                    "source": "EPRA generation statistics and industry analysis",
                    "sourceTitle": "EPRA National Electricity Supply Industry Statistics",
                    "confidence": "High"
                },
                {
                    "claim": "Multiple technology companies including Microsoft and Amazon Web Services have announced plans for data centre campuses approaching or exceeding 1 GW.",
                    "source": "Company announcements and data centre industry publications",
                    "sourceTitle": "Microsoft and AWS Infrastructure Investment Announcements",
                    "confidence": "High"
                },
                {
                    "claim": "Kenya's geothermal fleet produces roughly 800-900 MW, meaning a 1 GW data centre would exceed the output of all Kenyan geothermal plants combined.",
                    "source": "KENGEN generation data and EPRA statistics",
                    "sourceTitle": "KENGEN Generation Capacity Report",
                    "confidence": "High"
                }
            ]
        },
        {
            "title": "Why Data Centres Need Backup Generators",
            "slug": "why-data-centres-need-backup-generators",
            "tlDr": "Even on Kenya's relatively reliable grid, data centres need diesel generators that can take over within seconds of a power outage. It is not distrust of Kenya Power — it is an absolute requirement for the 99.999% uptime that modern digital services demand.",
            "description": "Explains why every serious data centre has diesel backup generators, how they work, and what they mean for Kenya's data centre ambitions.",
            "content": """## The Uptime Requirement

Data centres are built to provide continuous service. The industry standard for enterprise-class facilities is 99.999% availability, also known as "five nines." That allows for just 5.26 minutes of unplanned downtime per year. No electricity grid in the world — not even in Norway or Switzerland — can guarantee that level of reliability. So every serious data centre has its own backup power systems.

## How Backup Power Works

The backup power chain in a data centre works in stages. First, batteries or flywheels (called UPS systems) bridge the gap between a grid outage and generator startup — typically 10 to 30 seconds. Then diesel generators start up and begin supplying power. A well-maintained generator can go from zero to full load in under a minute. Most facilities have enough diesel fuel stored on site to run for 24 to 72 hours, and contracts with fuel suppliers for continuous resupply during extended outages.

## How Many Generators?

A facility needs enough generators to power the entire IT load plus cooling. For a 10 MW data centre, this might mean four or five 2.5-3 MW generators, with at least one extra for redundancy (the "N+1" principle). A 100 MW facility would need a generator farm with dozens of units. These generators are massive — each one can be the size of a shipping container — and they require their own fuel storage, cooling systems, and exhaust management.

## Environmental Trade-offs

Here is the paradox: a data centre powered by 100% geothermal electricity will still have diesel generators on site. When the grid fails and the generators run, the facility is no longer running on clean energy. In Kenya, where the grid is about 90% renewable, this is a real trade-off. The longer a grid outage lasts, the more diesel is burned. This is one reason why grid reliability matters so much for green data centre claims.

## Kenya's Grid and Generator Dependence

Kenya Power has made significant progress in reducing outages over the past decade, but the grid is not yet at the reliability level that major data centre operators require. Scheduled maintenance outages, weather-related faults, and equipment failures still occur. A data centre in Nairobi might need to run on generators several times a month, even if only for short periods. At Olkaria, where the data centre would be close to the generation source, outages might be less frequent, but transmission faults between Olkaria and the facility would still trigger generator startup.

## The Cost of Reliability

Backup generators are expensive to buy, install, and maintain. A single 2.5 MW diesel generator can cost over USD 500,000. Fuel costs during outages add up. Regular testing and maintenance are mandatory. For a Kenyan data centre operator, these costs are part of the price of meeting international uptime standards. There is no shortcut — you cannot claim Tier III or Tier IV reliability without robust backup power.""",
            "readingTimeMin": 7,
            "sortOrder": 7,
            "claims": [
                {
                    "claim": "Enterprise-class data centres target 99.999% availability, allowing just 5.26 minutes of unplanned downtime per year, which no grid in the world can guarantee without on-site backup.",
                    "source": "Uptime Institute Tier Standard",
                    "sourceTitle": "Uptime Institute Tier Standard: Topology",
                    "confidence": "High"
                },
                {
                    "claim": "A 10 MW data centre typically requires four to five diesel generators of 2.5-3 MW each, plus redundancy, with 24-72 hours of on-site fuel storage.",
                    "source": "Data centre engineering standards and industry practice",
                    "sourceTitle": "TIA-942 Data Centre Infrastructure Standards",
                    "confidence": "Medium"
                },
                {
                    "claim": "A single 2.5 MW diesel generator for data centre backup can cost over USD 500,000 to purchase and install.",
                    "source": "Data centre construction cost benchmarks",
                    "sourceTitle": "Turner & Townsend Data Centre Cost Guide",
                    "confidence": "Medium"
                }
            ]
        },
        {
            "title": "Data Centres and Renewable Energy",
            "slug": "data-centres-and-renewable-energy",
            "tlDr": "The world's biggest tech companies have pledged to run their data centres on 100% renewable energy. Kenya's 90% green grid makes it a natural fit — but matching supply and demand around the clock is harder than it sounds.",
            "description": "Examines the global trend of data centres switching to renewable energy and analyses how Kenya's existing green grid positions it in this market.",
            "content": """## The Corporate Pledge

Google, Microsoft, Amazon, and Meta have all committed to running their data centres on 100% renewable energy, typically with a target date between 2025 and 2030. These are not vague aspirations — they are backed by billions of dollars in renewable energy investments, including solar farms, wind parks, and power purchase agreements around the world. For these companies, the question is not whether to go green but how fast they can get there.

## What 100% Renewable Actually Means

In practice, "100% renewable" rarely means that every watt flowing into a data centre comes from a wind turbine or solar panel at that exact moment. Instead, companies use a combination of direct supply (on-site solar or dedicated wind farms connected to the same grid), renewable energy certificates (RECs), and PPAs with renewable generators. The idea is to match their annual electricity consumption with an equivalent amount of renewable generation somewhere on the same grid. Critics argue this is accounting, not physics, but it is the prevailing industry standard.

## Kenya's Natural Advantage

Kenya is in a unique position because its grid is already about 90% renewable. A data centre that buys power from Kenya Power is, by default, buying mostly clean electricity — geothermal, hydro, wind, and solar. This is a massive advantage over countries like South Africa (which relies heavily on coal) or Nigeria (which depends on gas and diesel). In Kenya, a data centre operator does not need to build a separate solar farm to make a credible green claim. The grid does the work.

## The Intermittency Challenge

However, Kenya's renewable mix is not without challenges. Hydropower fluctuates with rainfall. Wind is strongest in the evenings and weakest during the day. Solar, obviously, only generates during daylight hours. When a data centre needs firm 24/7 power, it needs geothermal or thermal backup. This is why Kenya's geothermal resources are so strategically important — they provide the reliable baseload that anchors the renewable grid and gives data centre operators the consistency they require.

## Corporate Power Purchase Agreements

For maximum credibility, large data centre operators prefer to sign direct PPAs with renewable generators. In Kenya, this would mean a direct agreement with KENGEN for geothermal power from Olkaria. The Microsoft-G42 deal reportedly took this approach. Direct PPAs give the data centre operator price certainty, supply security, and a clean energy story that is easy to verify. They also provide revenue certainty for the generator, enabling investment in new capacity.

## The Road Ahead

As global tech companies look for clean energy locations to build AI data centres, Kenya's green grid is one of its strongest competitive advantages. But maintaining and expanding this advantage requires continued investment in geothermal drilling, grid infrastructure, and regulatory frameworks that support direct PPAs. If Kenya can deliver on the promise of its green grid, it could become the default location for environmentally conscious data centre investment in Africa.""",
            "readingTimeMin": 7,
            "sortOrder": 8,
            "claims": [
                {
                    "claim": "Google, Microsoft, Amazon, and Meta have all committed to running their data centres on 100% renewable energy with target dates between 2025 and 2030.",
                    "source": "Corporate sustainability reports and RE100 commitments",
                    "sourceTitle": "RE100 Member Commitments and Corporate Sustainability Reports",
                    "confidence": "High"
                },
                {
                    "claim": "Kenya's grid is approximately 90% renewable, giving data centre operators a default green power supply without needing to build separate renewable generation.",
                    "source": "EPRA and Kenya National Bureau of Statistics",
                    "sourceTitle": "EPRA Annual Report on Kenya's Energy Sector",
                    "confidence": "High"
                },
                {
                    "claim": "Direct PPAs with KENGEN for geothermal power from Olkaria offer data centre operators price certainty, supply security, and a verifiable clean energy story.",
                    "source": "EPRA licensing framework and industry analysis",
                    "sourceTitle": "EPRA Licensing and Tariff Guidelines",
                    "confidence": "Medium"
                }
            ]
        },
        {
            "title": "AI and Kenya's Future Electricity Demand",
            "slug": "ai-and-kenyas-future-electricity-demand",
            "tlDr": "Artificial intelligence could dramatically increase Kenya's electricity demand. A single ChatGPT search uses about 10 times more energy than a Google search, and as AI adoption grows, Kenya must plan for a future where data centres are major power consumers.",
            "description": "Analyses how the growth of artificial intelligence — both globally and within Kenya — could reshape the country's electricity demand profile over the next decade.",
            "content": """## The AI Energy Multiplier

Artificial intelligence is far more energy-intensive than traditional computing. Research estimates suggest that a single ChatGPT search query uses roughly 10 times more electricity than a conventional Google search. Training a large language model can consume thousands of megawatt-hours — equivalent to the annual electricity use of hundreds of Kenyan households. As AI becomes embedded in more services — customer service chatbots, image generation, code assistants, medical diagnostics — the cumulative energy demand will grow rapidly.

## Kenya's Current Demand Profile

Kenya's electricity peak demand is approximately 2,000 MW, serving about 9 million connected customers. Demand has been growing at 4-6% per year, driven by industrial expansion, rural electrification, and economic growth. The government's goal is to connect many more households and businesses, which will push demand higher. Against this baseline, adding large AI data centres would represent an entirely new demand category.

## How Much Could AI Add?

If Kenya were to attract a single 100 MW AI data centre, that would add 5% to current peak demand. If it attracted three or four such facilities over the next decade — which is not impossible given the global race for AI infrastructure — the total could reach 300-400 MW, adding 15-20% to peak demand. This would require significant new generation investment, primarily in geothermal, which is Kenya's most scalable firm renewable resource.

## The Positive Scenario

In a positive scenario, AI data centres drive investment in Kenya's energy sector. New geothermal wells are drilled. Grid infrastructure is upgraded. Kenya Power's revenue base grows. The country develops expertise in operating and maintaining advanced data centres. Kenya becomes known as Africa's premier green computing destination. The data centre industry becomes a significant source of export earnings, as foreign companies pay for computing done on Kenyan soil.

## The Risk Scenario

In a negative scenario, AI data centres strain the grid without adequate preparation. Power is diverted from homes and businesses. Electricity tariffs rise. The promised jobs and investment do not materialise because the project stalls — as the Microsoft-G42 experience has shown. Kenya is left with upgraded infrastructure that benefits a single foreign company rather than the broader economy.

## Planning for the Future

The key to a positive outcome is proactive planning. KENGEN needs to expand geothermal capacity. EPRA needs a clear framework for large consumer PPAs. Kenya Power needs to upgrade transmission and distribution infrastructure. The Ministry of Energy needs a national strategy that positions data centres as a pillar of economic policy, not a sideline. And Kenyans need to understand the trade-offs: clean, well-paying tech jobs and export revenue in exchange for significant electricity resources.""",
            "readingTimeMin": 7,
            "sortOrder": 9,
            "claims": [
                {
                    "claim": "A single ChatGPT search query uses roughly 10 times more electricity than a conventional Google search.",
                    "source": "EPRI (Electric Power Research Institute) and University of Washington research",
                    "sourceTitle": "EPRI AI Energy Consumption Estimates",
                    "confidence": "Medium"
                },
                {
                    "claim": "Kenya's electricity peak demand is approximately 2,000 MW and has been growing at 4-6% per year.",
                    "source": "Kenya Power and EPRA demand statistics",
                    "sourceTitle": "Kenya Power Annual Supply Report and EPRA Statistics",
                    "confidence": "High"
                },
                {
                    "claim": "Three to four 100 MW AI data centres would add 15-20% to Kenya's current peak demand, requiring significant new geothermal generation investment.",
                    "source": "Analysis based on EPRA demand data and industry projections",
                    "sourceTitle": "EPRA National Energy Projections",
                    "confidence": "Medium"
                }
            ]
        },
        {
            "title": "Can Kenya Become Africa's Green Data Centre Hub?",
            "slug": "can-kenya-become-africas-green-data-centre-hub",
            "tlDr": "Kenya has the green grid, the geothermal resources, and the strategic location to become Africa's top destination for sustainable data centres. But turning potential into reality requires investment in grid infrastructure, regulatory reform, and political consistency.",
            "description": "Weighs Kenya's advantages and challenges in competing to become the leading green data centre destination in Africa.",
            "content": """## The Case for Kenya

Kenya has several genuine advantages in the competition for data centre investment. Its grid is approximately 90% renewable — the greenest in Africa and one of the greenest in the world. It has abundant geothermal resources at Olkaria that provide reliable baseload power. Its climate, especially in the Rift Valley and highlands, allows for efficient cooling. It has a growing tech ecosystem, a well-educated workforce, and relatively good connectivity through multiple undersea cables landing at Mombasa. It is also English-speaking, which matters for international operators.

## The Competition

Kenya is not the only African country pursuing data centre investment. South Africa has a larger economy, more existing data centre capacity, and deeper capital markets. Morocco is positioning itself as a gateway between Europe and Africa, with solar energy and submarine cable connectivity. Nigeria has the continent's largest population and economy, and is investing heavily in power infrastructure. Egypt offers a large domestic market and proximity to European and Middle Eastern networks. Each of these countries has its own pitch.

## What Kenya Needs to Do

To win, Kenya needs to address several gaps. First, grid reliability must improve. International data centre operators expect 99.999% power availability, and while backup generators fill the gap, excessive grid outages increase costs and complicate green energy claims. Second, Kenya needs a transparent and efficient regulatory framework for large power consumers. The current PPA approval process can be slow and opaque. Third, Kenya needs to invest in grid infrastructure, especially transmission lines from geothermal fields to potential data centre sites. Fourth, it needs political consistency — the Microsoft-G42 experience showed how a change in political winds can stall a major project.

## The Geothermal Moat

Kenya's strongest competitive moat is geothermal energy. No other African country has anything close to Kenya's geothermal capacity. Geothermal provides the reliable, 24/7, low-carbon power that data centre operators desperately want. If Kenya can demonstrate that it can deliver geothermal power at scale and at competitive prices through direct PPAs, it will have an offer that no other African country can easily match.

## The Workforce Question

Data centres need skilled workers: electrical engineers, HVAC technicians, network engineers, and facility managers. Kenya's universities produce thousands of engineering graduates each year, but specific data centre training programmes are limited. Building a local talent pipeline — through partnerships between universities, technical colleges, and data centre operators — would strengthen Kenya's value proposition and create high-quality jobs for Kenyans.

## A Realistic Timeline

Becoming Africa's green data centre hub will not happen overnight. It requires a decade of consistent policy, infrastructure investment, and successful project execution. The first milestone is landing one or two major international data centre projects and demonstrating that Kenya can deliver on its promise. The Microsoft-G42 project, if it revives, could be that milestone. If not, Kenya must find another anchor investor willing to take the first step. The potential is real, but potential alone does not win markets — execution does.""",
            "readingTimeMin": 7,
            "sortOrder": 10,
            "claims": [
                {
                    "claim": "Kenya's grid is approximately 90% renewable, making it the greenest in Africa and one of the greenest in the world, a major competitive advantage for data centre investment.",
                    "source": "EPRA and International Energy Agency data",
                    "sourceTitle": "EPRA Annual Report and IEA Africa Energy Outlook",
                    "confidence": "High"
                },
                {
                    "claim": "South Africa, Morocco, Nigeria, and Egypt are Kenya's main competitors for data centre investment in Africa, each with distinct advantages.",
                    "source": "Africa Data Centres Association and industry analysis",
                    "sourceTitle": "Africa Data Centres Association Market Report",
                    "confidence": "Medium"
                },
                {
                    "claim": "Kenya's geothermal capacity of over 800 MW at Olkaria represents a competitive moat that no other African country can easily match for reliable, 24/7, low-carbon data centre power.",
                    "source": "KENGEN data and IRENA geothermal statistics",
                    "sourceTitle": "KENGEN Annual Report and IRENA Geothermal Database",
                    "confidence": "High"
                }
            ]
        }
    ]

    print(f"Seeding {len(articles)} Energy articles...")

    article_count = 0
    claim_count = 0

    for i, art in enumerate(articles, 1):
        article_id = new_id(cur)

        cur.execute("""
            INSERT OR IGNORE INTO Article (id, title, slug, tlDr, description, cluster, status, content, readingTimeMin, sortOrder, updatedAt)
            VALUES (?, ?, ?, ?, ?, 'Energy', 'Published', ?, ?, ?, datetime('now'))
        """, (
            article_id,
            art["title"],
            art["slug"],
            art["tlDr"],
            art["description"],
            art["content"],
            art["readingTimeMin"],
            art["sortOrder"],
        ))

        if cur.rowcount == 0:
            print(f"  [{i}/{len(articles)}] SKIP (already exists): {art['title']}")
            continue

        article_count += 1
        print(f"  [{i}/{len(articles)}] INSERTED: {art['title']}")

        # Fetch the actual row id (in case IGNORE inserted nothing)
        row = cur.execute("SELECT id FROM Article WHERE slug = ?", (art["slug"],)).fetchone()
        if not row:
            print(f"    WARNING: Could not find article after insert for slug: {art['slug']}")
            continue

        actual_article_id = row[0]

        for claim in art.get("claims", []):
            claim_id = new_id(cur)
            cur.execute("""
                INSERT OR IGNORE INTO ArticleClaim (id, claim, source, sourceTitle, confidence, notes, articleId, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
            """, (
                claim_id,
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
    print(f"\nDone. Inserted {article_count} articles and {claim_count} claims.")


if __name__ == '__main__':
    main()
