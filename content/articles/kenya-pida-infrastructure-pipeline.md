---
title: "Kenya on the Continental Pipeline: What the African Infrastructure Database Says About the Country's Next Decade"
slug: "kenya-pida-infrastructure-pipeline"
meta_description: "We queried AUDA-NEPAD's African Infrastructure Database API: Kenya has 186 registered projects worth ~$172bn across transport, energy, water and ICT — including a $395m Mombasa data centre hub. Here is what the registry reveals, and its limits."
primary_keyword: "PIDA projects Kenya"
secondary_keywords:
  - "African Infrastructure Database"
  - "AUDA-NEPAD infrastructure projects Kenya"
  - "PIDA PAP 2 Kenya"
  - "Mombasa data centre PIDA"
  - "Africa infrastructure development pipeline"
author: "Kevin Jonathan Onyango Otieno"
author_bio_link: "/about"
published_date: "2026-09-08"
updated_date: "2026-09-08"
category: "Policy"
cluster: "Policy"
og_image: "/images/dc-policy-regulation.webp"
reading_time: "10 min"
images:
  - src: "/images/dc-policy-regulation.webp"
    alt: "Continental infrastructure policy and project registry"
    caption: "Kenya's infrastructure future is registered in a continental database most investors have never queried"
    position: "hero"
  - src: "/images/kenya-transmission-pylons.webp"
    alt: "Transmission pylons crossing the Kenyan landscape"
    caption: "The ZTK interconnector's Kenyan section — a $50m registry entry that matters to every data centre power contract"
    position: "section-break"
internal_links:
  - text: "the infrastructure map with the PIDA layer"
    href: "/infrastructure/map"
  - text: "our data methodology"
    href: "/methodology"
  - text: "the EU-Kenya Digital Dialogue"
    href: "/articles/eu-africa-digital-cooperation-kenya"
  - text: "why Kenya's grid constrains hyperscale projects"
    href: "/articles/kenya-power-infrastructure-data-centres"
external_sources:
  - title: "African Infrastructure Database (AUDA-NEPAD) — Kenya country projects API (fetched 8 September 2026)"
    url: "https://aid.nepad.org/aid/public/api/country-projects.php?country=Kenya"
  - title: "PIDA — Programme for Infrastructure Development in Africa (AUDA-NEPAD)"
    url: "https://www.nepad.org/programme/programme-infrastructure-development-africa-pida"
  - title: "TeleGeography Submarine Cable Map — DARE1"
    url: "https://www.submarinecablemap.com"
faq:
  - question: "What is the African Infrastructure Database?"
    answer: "The African Infrastructure Database (AID), maintained by AUDA-NEPAD (the African Union's development agency), is the continental registry of infrastructure development projects — the data backbone of the Programme for Infrastructure Development in Africa (PIDA). Its public API exposes country-level project records with sector, status, capex, coordinates and programme codes. Kenya's registry holds 186 projects totalling roughly $172 billion in registered capex."
  - question: "What PIDA data centre projects are registered for Kenya?"
    answer: "The most significant is 'Transborder Submarine Fiber PoPs, Regional Smart Hub Facility and Data Centre' (PIDA I.02.30.05) — a $395 million, EAC/IGAD-coordinated regional smart hub with data centre capacity at Mombasa, structured as a PPP under PIDA PAP 2. Other Kenyan ICT entries include the Juba–Nairobi fibre link (Kenyan segment operational), the Garissa–Kismayo and Nairobi–Mogadishu cross-border fibre links, and the registry record for the DARE1 submarine cable."
  - question: "Can I count PIDA registry entries as built infrastructure?"
    answer: "No. A registry entry is a project preparation — sometimes at feasibility or structuring stage — registered by a sponsoring authority. Statuses like 'Active' mean the project is in the continental pipeline, not that construction is underway. That is why DC254 keeps the PIDA layer visually and numerically separate from the DC Directory: registry entries are never counted in capacity figures."
---

There is a database that knows what Africa intends to build over the next decade, and
almost nobody in the Kenyan data centre conversation has ever queried it. The
**African Infrastructure Database (AID)** — maintained by AUDA-NEPAD, the African
Union's development agency — is the continental registry behind the Programme for
Infrastructure Development in Africa (PIDA). It tracks every serious
cross-border infrastructure project on the continent: ports, railways, power pools,
pipelines, water systems and, crucially for our beat, the digital layer. Its public
API is open, keyed, and — as of 8 September 2026, when we pulled Kenya's records —
browsable from right here on DC254.

What we found reframes Kenya's infrastructure story in two directions at once. The
registry confirms Kenya as the corridor economy of East Africa: the
Mombasa–Nairobi spine appears again and again in continental-scale projects. And it
contains a project most Kenyan data centre coverage has never mentioned: a **$395
million regional smart hub with data centre capacity, registered at Mombasa**, being
developed as a public-private partnership under PIDA's second Priority Action Plan
(PAP 2).

![Continental infrastructure registry](/images/dc-policy-regulation.webp)

## The headline numbers

Kenya's registry holds **186 projects with roughly US$172 billion in registered
capex across four sectors** — transport, energy, water and ICT — as of our 8
September 2026 fetch. The public endpoint serves the first 100 records per request;
within that slice, transport dominates (42 projects, including the continental
flagship: the $19.2 billion Mombasa–Nairobi–Malaba–Kampala–Kigali standard-gauge
railway programme), followed by water (41) and energy (12), with **five ICT-sector
projects**. Status labels are registry-speak: 89 of the 100 carried "Active", nine
"Completed", two unlabelled.

The completed list is a reminder of what "infrastructure" means at continental
scale: the **$5 billion Mombasa–Nairobi SGR section**, the Nairobi Southern Bypass,
the Mombasa Port new container terminal, the Malaba one-stop border post. These are
the corridors and gateways that every Kenyan data centre's diesel, turbines, and
fibre drums travel on — and they are the context investors mean when they call Kenya
"the logistics hub of East Africa".

## The ICT projects: Kenya's registered digital pipeline

Five ICT projects appear in the served slice, and they sketch a coherent strategy:
Kenya as the digital gateway for its landlocked and coastal neighbours.

**The flagship: "Transborder Submarine Fiber PoPs, Regional Smart Hub Facility and
Data Centre" (PIDA I.02.30.05, US$395 million, Active).** Registered at Mombasa —
the coordinates land in the Miritini area, home to Digital Realty's MBA1, the
most interconnected building on the Kenyan coast — the project is coordinated by
the EAC and IGAD under the IGAD Regional Infrastructure Masterplan and is being
advanced as a PPP under PIDA PAP 2, serving six countries (Kenya, Uganda,
Tanzania, South Sudan, Somalia, Ethiopia). Read carefully: this is a *project
preparation*, at Project Structuring stage as of the 2024 milestone — not a
construction site. But a continental registry explicitly reserving data centre
capacity at Mombasa, in a PPP wrapper with six-country backing, is a signal of
institutional intent that no local market report captures. If it proceeds, it
would stack regional data centre demand directly onto the cable-landing geography
where eight submarine cables already surface.

**The Juba–Nairobi Fiber Optic Link (PIDA I.02.30.06, US$45 million).** The
Kenyan segment — roughly 700 km, part of the national NOFBI fibre backbone — is
already operational. The South Sudanese side has been delayed by security and
financing; the registry notes the August 2023 Ruto–Kiir memorandum that revived
it. For Nairobi's data centre operators, this is landlocked-demand plumbing:
every kilometre of completed South Sudanese fibre is a new customer for Kenyan
colocation and transit.

**Two Somalia cross-border links: Garissa–Kismayo and Nairobi–Mogadishu**, each
with a point of presence at the Somali end, registered without capex figures.
These are the northern extension of the same strategy — Kenyan fibre and Kenyan
hubs anchoring neighbouring markets' connectivity.

**The DARE1 registry record** — the Djibouti Africa Regional Express submarine
cable (4,763 km, landings including Mombasa) — which carries a useful lesson in
data quality: the registry's summary cites a **60 Tbit/s system design**, while
the conservative per-landing figure we carry on our cable layer is 0.96 Tbit/s.
Both derive from the cable's documentation at different moments and scopes; we
publish the divergence rather than silently picking one, and cross-check against
TeleGeography's live map before making capacity claims.

## The power entry that matters to every data centre

One energy registry entry deserves special attention from our readers: the **ZTK
Transmission Interconnector, Kenya section (PIDA E.02.03.02, US$50 million,
Active)** — the Kenyan segment of the Zambia–Tanzania–Kenya 400 kV interconnector,
Kenya's bridge into the Southern African Power Pool via the Eastern Africa Power
Pool. Why does a transmission line belong in data centre coverage? Because the
binding constraint on Kenyan digital infrastructure is not demand, land, or
capital — it is the grid's ability to deliver tens of megawatts to a single site,
the exact problem that has the Microsoft–G42 Olkaria project reported paused since
May 2026. Interconnectors turn a national grid with a ~2.3% reserve margin into a
regional one that can trade surpluses and shortfalls; every megawatt of traded
capacity is a megawatt of data centre demand that becomes servable. Registry
entries like ZTK are the unglamorous plumbing behind every "Kenya is open for AI"
headline.

The same logic runs in reverse: the **LAPSSET corridor projects** (the $3 billion
crude pipeline entry, the $13.5 billion railway) and the SGR programme define
where coastal power, fibre and logistics will thicken over the next decade. Data
centre siting in Kenya is corridor-adjacent by history — Mombasa Road exists
because the highway and the fibre do — and the registry shows where the next
thickening happens.

## How to use a registry responsibly

The PIDA layer is now live on [our infrastructure map](/infrastructure/map) —
violet diamonds, separate from the facility markers — with the full project table
beneath. Three rules govern how we use this data, and how you should:

**First, a registry entry is not a facility.** "Active" in registry-speak means
the project is in the continental pipeline — it may be at feasibility,
structuring, or financing stage. The Mombasa smart hub's 2024 milestone was
*Project Structuring*. Counting registry entries as built infrastructure is how
continental "Africa's data centre boom" listicles end up doubling capacity that
exists only in project documents. Our [DC Directory](/directory) and the PIDA
layer are deliberately separate datasets that never share a sum.

**Second, registry numbers are the registrant's own.** Capex, capacity, and
coordinates are published as registered, without independent verification — the
DARE1 divergence above is the live example. We republish them dated and attributed,
not confirmed. Where a registry claim can be checked against an independent source
(PeeringDB, operator pages, cable maps), we note the comparison.

**Third, the gaps are informative.** Kenya's registry holds 186 projects, but only
five in ICT — a ratio that itself tells a story about where continental attention
sits versus where Kenya's private digital investment actually flows. The market
briefs and private capital documents we cover elsewhere (the Xalam/D4D Hub
briefing, the EU–Kenya Digital Dialogue) describe a digital economy that the
continental registry barely sketches. Reading both together — the public pipeline
and the verified market — is the closest thing this sector has to a full picture.

The API is public and keyed; our fetches are dated and repeatable. Expect this
layer to be refreshed with each quarterly directory pass, and expect the same
discipline here that governs everything else on this site: named sources, fetch
dates, divergences published.
