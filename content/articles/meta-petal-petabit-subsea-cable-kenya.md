---
title: "Meta's Petal Cable: 1 Pbps and What It Means for Kenya"
slug: "meta-petal-petabit-subsea-cable-kenya"
meta_description: "Meta's Petal cable will carry 1 petabit per second across the Atlantic by 2029. It doesn't land in Africa: here's why it still changes Kenya's connectivity math."
primary_keyword: "Meta Petal cable"
secondary_keywords:
  - "petabit submarine cable"
  - "Petal subsea cable Kenya"
  - "transatlantic cable capacity"
  - "multi-core fibre submarine cable"
  - "East Africa submarine cables"
author: "Kevin Jonathan Otieno"
author_bio_link: "/about"
published_date: "2026-09-22"
updated_date: "2026-09-22"
category: "Connectivity"
cluster: "Internet"
og_image: "/images/meta-petal-announcement-header.jpg"
reading_time: "8 min"
images:
  - src: "/images/meta-petal-announcement-header.jpg"
    alt: "Meta's announcement artwork for Petal, a first-of-its-kind transoceanic subsea cable"
    caption: "Meta's announcement artwork for Petal, the first subsea cable built to deliver petabit capacity across an ocean. Image: Meta Newsroom"
    position: "hero"
  - src: "/images/meta-petal-transatlantic-step-changes.gif"
    alt: "Animated chart of Meta's transatlantic cable capacity step-changes, from Marea to Petal"
    caption: "Meta's transatlantic step-changes, one block = Marea's 192 Tbps: Marea 192 Tbps (2018), Amitié 384 Tbps (2023), Anjana 557 Tbps (2025), Petal 1,056 Tbps (2029). Courtesy of Meta"
    position: "diagram"
  - src: "/images/meta-petal-two-core-fibre.mp4"
    alt: "Meta animation of the transition from single-core to two-core submarine fibre, showing two transmission cores inside one fibre strand"
    caption: "The technology behind Petal's leap: two transmission cores inside the same fibre, doubling capacity without doubling the physical plant. Courtesy of Meta"
    position: "diagram"
  - src: "/images/meta-petal-route-map.gif"
    alt: "Animated map of Meta's transatlantic cable routes between the United States and France"
    caption: "Meta's transatlantic systems on one map: Marea (2018, 8 fibre pairs), Amitié (2023, 16), Anjana (2025, 24) and Petal (2029), whose 24 two-core pairs carry the equivalent of 48. Courtesy of Meta"
    position: "diagram"
  - src: "/images/submarine-cable-diver.webp"
    alt: "Diver inspecting a submarine cable on the seabed"
    caption: "Subsea cables carry roughly 99% of intercontinental traffic, the physical layer every Kenyan app, payment and stream rides on"
    position: "inline"
  - src: "/images/mombasa-cable-landing-3.webp"
    alt: "Cable landing infrastructure on the Kenyan coast at Mombasa"
    caption: "Petal will never touch Kenya's coast. What lands here, and the trunk capacity riding above it, is the real Kenya story."
    position: "inline"
internal_links:
  - text: "seven submarine cables land in Mombasa"
    href: "/articles/submarine-cables-landing-mombasa"
  - text: "Kenya's terrestrial fibre networks"
    href: "/articles/fibre-optic-networks-kenya-data-centres"
  - text: "Kenya Internet Exchange Point"
    href: "/articles/kixp-internet-exchange-point-kenya"
  - text: "Berbera northern route fibre redundancy"
    href: "/articles/berbera-northern-route-kenya-fibre-redundancy"
  - text: "Kenya data centre directory"
    href: "/directory"
external_sources:
  - title: "Meta Newsroom: Announcing Petal, a First-of-its-Kind Transoceanic Subsea Cable (21 September 2026)"
    url: "https://about.fb.com/news/2026/09/announcing-petal-meta-petabit-transoceanic-cable/"
  - title: "Meta Engineering Blog (two-core fibre deep-dive)"
    url: "https://engineering.fb.com/"
  - title: "Google Cloud Blog: Announcing Sol transatlantic cable (9 July 2025)"
    url: "https://cloud.google.com/blog/products/infrastructure/announcing-sol-transatlantic-cable"
  - title: "SubmarineNetworks: Meta Unveils 50,000km Waterworth Subsea Cable Project (18 February 2025)"
    url: "https://www.submarinenetworks.com/"
  - title: "DataCenterDynamics: 2Africa cable goes live between South Africa and Kenya (14 June 2024)"
    url: "https://www.datacenterdynamics.com/en/news/2024-06-14/2africa-cable-goes-live-between-south-africa-and-kenya/"
faq:
  - question: "Does Meta's Petal cable land in Kenya or anywhere in Africa?"
    answer: "No. Petal connects the United States and France across roughly 7,000 km of Atlantic, with Orange handling the French landing. Meta's Africa-relevant systems are 2Africa, which has been live at Mombasa and Mtwapa since June 2024, and Project Waterworth, a planned 50,000 km system touching South Africa. Petal matters to Kenya as transit context and as a technology benchmark, not as a landing point."
  - question: "What is petabit capacity, and how big is 1 petabit per second?"
    answer: "A petabit is 1,000 terabits per second. Petal's 1 Pb/s design capacity is roughly 5.5 times the 180 Tbps design capacity of 2Africa, the largest system serving Kenya today. Meta's own framing: that is about the network capacity required for 75% of the world's population to stream music at the same time."
  - question: "How is Petal different from 2Africa?"
    answer: "They do different jobs. 2Africa is a regional access system: about 180 Tbps of design capacity spread across many African landing points, built to connect countries like Kenya directly. Petal is a transoceanic trunk: one 7,000 km US-France span carrying 1 Pb/s between two of the world's largest internet hubs. Trunks concentrate enormous capacity between major hubs; access systems distribute it across regions."
  - question: "When will Petal be in service?"
    answer: "Meta expects Petal to be in service in 2029. For Kenya, the nearer-term connectivity news remains at Mombasa: Africa-1 has landed and is awaiting full service, which would take the region's live cable count to eight."
canonical_url: "https://data-centers-254.vercel.app/articles/meta-petal-petabit-subsea-cable-kenya"
---

On 21 September 2026, Meta announced Petal, the first subsea cable built to deliver petabit capacity (1,000 terabits per second) across an ocean. The system will span roughly 7,000 km between the United States and France, and Meta says it doubles the capacity of today's most advanced transoceanic cables, making it the largest single generational jump in transoceanic capacity ever deployed. Construction brings together NEC as the subsea system specialist, Sumitomo Electric Industries as the fibre supplier, and Orange, which will land the system on France's Atlantic coast. Meta expects Petal to be in service in 2029.

So let's deal with the obvious question first, because credibility depends on it: Petal does not land in Kenya, and it does not land anywhere in Africa. It is a transatlantic trunk between two of the world's densest internet hubs. But dismissing it as irrelevant to East Africa would be a mistake, for three reasons that have nothing to do with hype: a transit path that ends in America, a capital pattern Meta has already applied to Kenya once, and a fibre technology that will eventually reshape what African cable systems can carry.

## What Meta actually announced

The headline number is capacity. Where traditional transoceanic cables carry terabits per second, Petal is designed to deliver 1 petabit per second, by Meta's own illustration, roughly the network capacity required for 75% of the world's population to stream music at the same time. That is not an incremental upgrade; it is the largest generational increase in transoceanic capacity of any system, ever, according to Meta. For context, 2Africa, the Meta-led consortium system that has been live at Mombasa and Mtwapa since June 2024, carries a design capacity of 180 Tbps. Petal is more than five times that on a single span a fraction of the length.

![Animated chart of Meta's transatlantic cable capacity step-changes](/images/meta-petal-transatlantic-step-changes.gif)

The engineering story behind the number matters just as much. Petal will be the first cable to deploy multi-core fibre technology at transoceanic distances, carrying traffic in two separate cores inside the same cable. The practical consequence: twice the data without a proportional increase in fibre, physical materials, or power. Meta points to its engineering blog for the technical deep-dive, but the headline is simple: the industry has found a way to multiply capacity per cable rather than laying more of them. It is also worth reading Petal as what it really is: a story about the stack that carries AI, cloud and digital services, where compute demand fills data centres, data centres fill networks, and networks ride subsea cables between continents. Petal is the bottom of that stack getting a generational upgrade.

![Meta animation of the transition from single-core to two-core fibre](/images/meta-petal-two-core-fibre.mp4)

## Petal does not land in Africa: here's why it still matters to Kenya

**First, the transit path.** Nearly all Kenyan traffic headed for the Americas already rides a two-part journey: north from Mombasa across one of the [seven live cable systems](/articles/submarine-cables-landing-mombasa) to Europe, then west across the Atlantic to the United States. Petal upgrades the second half of that journey. The far end of Kenya's route to the Americas is being rebuilt a full capacity generation ahead of demand, which is what keeps end-to-end performance stable as video, cloud and AI workloads grow. Petal is not capacity Kenyan operators can buy (hyperscaler cables largely serve their own internal traffic), but its arrival is the clearest signal of where the trunk layer above East Africa is heading.

![Animated map of Meta's transatlantic cable routes between the United States and France](/images/meta-petal-route-map.gif)

**Second, the capital pattern.** Petal is Meta's 20th-plus subsea investment, following Project Waterworth, a planned 50,000 km system announced in 2025 to connect the US, India, Brazil and South Africa. Google made the same transatlantic move in July 2025 with Sol, linking the US, Bermuda, the Azores and Spain. The pattern is consistent: hyperscalers fund cable generations where their compute demand sits. Meta has already applied that logic to Kenya once, by leading the 2Africa consortium to Mombasa. Every announcement like Petal makes the next hyperscaler decision about African routes more likely, not less.

![Diver inspecting a submarine cable on the seabed](/images/submarine-cable-diver.webp)

**Third, the technology benchmark.** The two-core fibre that makes Petal possible is the same technology direction that will eventually reach regional systems. Today Kenya's aggregate international bandwidth exceeds 20 Tbps of lit capacity, served by seven live systems at Mombasa. When multi-core designs mature into commercially deployable regional systems, the arithmetic changes: operators could multiply capacity on existing routes without new beach landings, new permits, or new marine surveys. That is a future-looking consequence, not a present fact, but it is exactly the kind of shift that determines whether Mombasa's infrastructure keeps pace with [Kenya's data centre build-out](/directory).

## What this changes at Mombasa: nothing, yet

It is worth stating plainly what Petal does not do. It does not add redundancy to East Africa's Indian Ocean corridor, where the live-system count and route diversity through Mombasa remain the region's real resilience story. It does not change Africa-1's status (landed and awaiting full service), which remains the most consequential near-term cable development for Kenya. And it does not alter the terrestrial picture, where the [fibre routes connecting Mombasa's landing stations to Nairobi's data centres](/articles/fibre-optic-networks-kenya-data-centres), and the peering at the [Kenya Internet Exchange Point](/articles/kixp-internet-exchange-point-kenya) that keeps local traffic local, still determine most of the latency Kenyan users actually experience. The [Berbera northern route](/articles/berbera-northern-route-kenya-fibre-redundancy), for operators diversifying beyond the Mombasa corridor, is likewise unaffected.

![Cable landing infrastructure on the Kenyan coast at Mombasa](/images/mombasa-cable-landing-3.webp)

That honesty is the point. The global cable market now moves in hyperscaler generations, and African readers deserve coverage that distinguishes between systems that touch their shores and systems that shape their transit prices. Petal is firmly the second category: a benchmark to plan against, not a landing to celebrate.

## What to watch next

Three markers will tell Kenyan infrastructure watchers whether Petal's announcement is a turning point or a headline. Watch 2029: if Petal enters service on schedule with its stated capacity, the transatlantic trunk layer doubles, and the per-bit economics of Kenya-to-Americas transit improve at the margin as upstream markets densify. Watch Africa-1's full-service launch at Mombasa, which would take the region from seven live systems to eight and is the closest, most tangible cable development on Kenya's horizon. And watch the fibre technology itself: the moment any consortium announces multi-core designs for an African route, whether a 2Africa successor or a new regional system, the Petal benchmark will have arrived on our shores.

---

Meta's Petal cable is a transatlantic story with a Kenyan tail. The system itself will never touch Mombasa's waters, but the capital, technology and capacity trajectory it represents will shape every cable decision that does, and for a region whose digital economy is growing faster than its lit bandwidth, that trajectory is the news.
