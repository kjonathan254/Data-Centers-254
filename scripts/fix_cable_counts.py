#!/usr/bin/env python3
"""
16 Sep 2026: Cable register correction sweep.

Verified facts (sources + dates):
- 2Africa: Kenya segment RFS June 2024 (Airtel Africa activation; DCD 14 Jun 2024,
  Capacity 13 Jun 2024, SubmarineNetworks 17 Jun 2024); core system completed
  17 Nov 2025 (engineering.fb.com). Lands Mtwapa + Mombasa (Wikipedia landing list).
- EIG (Europe India Gateway): RFS Feb 2011, landings Bude/Sesimbra/Gibraltar/
  Marseille/Monaco/Tripoli/Alexandria/Jeddah/Djibouti/Muscat/Fujairah/Mumbai.
  NO Kenya landing (Wikipedia landing list; TeleGeography owners list, Sep 2026).
  REMOVED from register.
- Africa-1: landed Mombasa before Nov 2024 (Telecom Egypt IR 6 Nov 2024: Ras
  Ghareb is third landing after Karachi and Mombasa). RFS not confirmed ->
  live: false.
- DARE1: in service since early February 2021 (SubmarineNetworks 1 Apr 2021;
  telkom.co.ke "ready for service in 2021").
- LION2: ready for service April 2012 (SubmarineNetworks; Fierce Network 16 Apr 2012).
- PEACE: landed Mombasa Mar 2022 (Telkom/PEACE announcement).
- Daraja: announced Oct 2025, Safaricom host, in development (DCD 31 Oct 2025).

Net: SEVEN live systems (SEACOM, TEAMS, EASSy, LION2, DARE1, PEACE, 2Africa),
Africa-1 landed pending service, Daraja in development. Nine systems total.
"""
import re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
TODAY = "2026-09-16"

def rep(path, old, new, count=1):
    p = ROOT / path
    t = p.read_text(encoding="utf-8")
    n = t.count(old)
    if n != count:
        print(f"[FAIL] {path}: expected {count} match(es), found {n} for: {old[:70]!r}")
        sys.exit(1)
    t = t.replace(old, new)
    p.write_text(t, encoding="utf-8")
    print(f"[OK]   {path}: {old[:58]!r} -> updated")

def bump_updated(path):
    p = ROOT / path
    t = p.read_text(encoding="utf-8")
    t2, n = re.subn(r'(updated_date: ")[\d-]+(")', rf"\g<1>{TODAY}\g<2>", t, count=1)
    if n != 1:
        print(f"[FAIL] {path}: updated_date not bumped")
        sys.exit(1)
    p.write_text(t2, encoding="utf-8")
    print(f"[OK]   {path}: updated_date -> {TODAY}")

# ── 1. Homepage stat ─────────────────────────────────────────────────────────
rep("src/components/sections/the-scale.tsx",
    'value: "6",\n      label: "Active submarine cables",\n      note: "SEACOM, TEAMS, EASSy, LION2, DARE1 and PEACE land in Mombasa, a 7th (Meta\'s Daraja) is in development.",',
    'value: "7",\n      label: "Active submarine cables",\n      note: "SEACOM, TEAMS, EASSy, LION2, DARE1, PEACE and 2Africa land on the Kenyan coast, with Africa-1 landed and Daraja in development.",')

# ── 2. FAQ page ──────────────────────────────────────────────────────────────
rep("src/app/faq/page.tsx",
    'a: "Six international submarine cable systems are live in Kenya (SEACOM, TEAMS, EASSy, LION2, DARE1 and PEACE) all landing on the coast at Mombasa. A seventh, Meta\'s Daraja, is in development. This concentration is both Kenya\'s strength and its single point of failure: nearly all of the country\'s international bandwidth rides cables that meet at the same shoreline.",',
    'a: "Seven international submarine cable systems are live in Kenya (SEACOM, TEAMS, EASSy, LION2, DARE1, PEACE and 2Africa), landing on the Kenyan coast at Mombasa and Mtwapa. Africa-1 landed at Mombasa in 2024 and awaits full service, and Meta\'s Daraja is in development. This concentration is both Kenya\'s strength and its single point of failure: nearly all of the country\'s international bandwidth rides cables that meet at the same shoreline.",')

# ── 3. Chatbot intents (dynamic count) ───────────────────────────────────────
rep("src/lib/chatbot/intents.ts",
    "reply: `Six submarine cable systems are live at the Mombasa landing station,",
    "reply: `${live.length} submarine cable systems are live on the Kenyan coast,")

# ── 4. Chatbot knowledge ─────────────────────────────────────────────────────
rep("src/lib/chatbot/knowledge.ts",
    'a: "Six international submarine cable systems are live in Kenya (SEACOM, TEAMS, EASSy, LION2, DARE1 and PEACE) all landing on the coast at Mombasa. A seventh, Meta\'s Daraja, is in development. This concentration is both Kenya\'s strength and its single point of failure.",',
    'a: "Seven international submarine cable systems are live in Kenya (SEACOM, TEAMS, EASSy, LION2, DARE1, PEACE and 2Africa), landing on the Kenyan coast at Mombasa and Mtwapa. Africa-1 landed at Mombasa in 2024 and awaits full service, and Meta\'s Daraja is in development. This concentration is both Kenya\'s strength and its single point of failure.",')

# ── 5. Glossary ──────────────────────────────────────────────────────────────
rep("src/lib/glossary-data.ts",
    "A fibre optic cable laid on the ocean floor carrying intercontinental internet traffic. Six active cables land in Mombasa.",
    "A fibre optic cable laid on the ocean floor carrying intercontinental internet traffic. Seven active cables land on the Kenyan coast.")
rep("src/lib/glossary-data.ts",
    "with six active cables: SEACOM (2009), TEAMS (2009), EASSy (2010), LION2 (2013), DARE1 (2022), and PEACE (2022), and a seventh (Meta\u2019s Daraja cable) in development.",
    "with seven active cables: SEACOM (2009), TEAMS (2009), EASSy (2010), LION2 (2012), DARE1 (2021), PEACE (2022) and 2Africa (2024), plus Africa-1 (landed 2024, service pending) and Meta\u2019s Daraja cable (in development).")

# ── 6. Map register ──────────────────────────────────────────────────────────
rep("src/lib/map-data.ts",
    '{ id: "dare1", name: "DARE1", year: 2015, live: true,',
    '{ id: "dare1", name: "DARE1", year: 2021, live: true,')
rep("src/lib/map-data.ts",
    '  { id: "eig", name: "EIG", year: 2011, live: true, designTbps: null, note: "Europe\u2013India Gateway; Kenya share undisclosed", waypoints: [[-3.982, 39.728], [-1.20, 41.70], [0.60, 42.35]], label: "EIG \u00b7 landed Mombasa" },\n',
    "")
rep("src/lib/map-data.ts",
    'note: "Largest submarine cable system ever built (180 Tbps system design); Kenya share undisclosed"',
    'note: "Largest submarine cable system ever built (180 Tbps system design); Kenya segment RFS June 2024 via Airtel, core system completed November 2025"')
rep("src/lib/map-data.ts",
    '  { id: "daraja", name: "Daraja", year: 2026, live: false,',
    '  { id: "africa1", name: "Africa-1", year: 2024, live: false, designTbps: null, note: "Telecom Egypt-led consortium; landed Mombasa 2024, ready-for-service not yet announced", waypoints: [[-3.982, 39.74], [-1.0, 41.9], [1.4, 42.35]], label: "Africa-1 \u00b7 landed, service pending" },\n  { id: "daraja", name: "Daraja", year: 2026, live: false,')

# ── 7. Map page copy ─────────────────────────────────────────────────────────
rep("src/app/infrastructure/map/page.tsx",
    "Interactive map of every data centre in Kenya, plus the eight submarine cables landing at the coast and the fibre backbone of East Africa.",
    "Interactive map of every data centre in Kenya, plus the nine submarine cable systems at the coast (seven live) and the fibre backbone of East Africa.")
rep("src/app/infrastructure/map/page.tsx",
    "Zoom from East Africa to the Nairobi cluster: 26 facilities, eight subsea cables, the fibre routes connecting them, and the continental PIDA project layer.",
    "Zoom from East Africa to the Nairobi cluster: 27 facilities, nine subsea cable systems (seven live), the fibre routes connecting them, and the continental PIDA project layer.")
rep("src/app/infrastructure/map/page.tsx",
    "26 facilities, eight submarine cables, and the fibre backbone, zoom from East Africa down to the Nairobi cluster.",
    "27 facilities, nine submarine cable systems (seven live), and the fibre backbone, zoom from East Africa down to the Nairobi cluster.")

# ── 8. East Africa map intro ─────────────────────────────────────────────────
rep("src/components/east-africa-infrastructure-map.tsx",
    "Twenty-six facilities, eight submarine cables, and the fibre backbone that connects them,",
    "Twenty-seven facilities, nine submarine cable systems (seven live), and the fibre backbone that connects them,")

# ── 9. llms.txt stale route ──────────────────────────────────────────────────
rep("public/llms.txt",
    "https://data-centers-254.vercel.app/internet",
    "https://data-centers-254.vercel.app/infrastructure")

# ── 10. Canonical cable article ──────────────────────────────────────────────
rep("content/articles/submarine-cables-landing-mombasa.md",
    'meta_description: "Mombasa is East Africa\'s submarine cable hub: at least 8 major undersea cables land here, connecting Kenya to Europe, Asia, and Africa."',
    'meta_description: "Mombasa is East Africa\'s submarine cable hub: seven live undersea cable systems land here, connecting Kenya to Europe, Asia, and Africa."')
rep("content/articles/submarine-cables-landing-mombasa.md",
    'answer: "At least 8 major submarine cables currently land in Mombasa, including TEAMS, EASSy, SEACOM, DARE, and the newer 2Africa and Africa-1 systems. This makes Mombasa the most connected coastal city in East and Central Africa."',
    'answer: "Seven live submarine cable systems land in Mombasa (TEAMS, SEACOM, EASSy, LION2, DARE1, PEACE and 2Africa), with Africa-1 landed and awaiting full service. This makes Mombasa the most connected coastal city in East and Central Africa."')
rep("content/articles/submarine-cables-landing-mombasa.md",
    "At least eight major submarine cable systems land at stations along the Mombasa coast, making this city",
    "Seven live submarine cable systems land at stations along the Mombasa coast, with two more landed or in development, making this city")
rep("content/articles/submarine-cables-landing-mombasa.md",
    "- **DARE** (2022), The Djibouti Africa Regional Express, connecting Djibouti to Mombasa and on to South Africa. Designed to provide diversity and redundancy for landlocked East African nations.\n\n- **2Africa** (2024), One of the largest subsea cable projects globally, built by a consortium led by Meta. 2Africa lands in Mombasa and delivers 180 Tbps of design capacity, dwarfing all previous cables.\n\n- **Africa-1** (2025), A China Telecom-led cable connecting Africa to Asia via the Indian Ocean. Adds further capacity and route diversity.",
    "- **LION2** (2012), The Lower Indian Ocean Network 2, an Orange-led cable linking Mombasa to Madagascar and R\u00e9union. Ready for service since April 2012.\n\n- **DARE1** (2021), The Djibouti Africa Regional Express, in service since February 2021 and connecting Djibouti, Mogadishu and Mombasa. Designed to provide diversity and redundancy for landlocked East African nations.\n\n- **2Africa** (2024), One of the largest subsea cable projects globally, built by a consortium led by Meta. Its Kenya segment went live in June 2024, it lands at Mombasa and Mtwapa, and it delivers 180 Tbps of design capacity, dwarfing all previous cables.\n\n- **Africa-1** (landed 2024), A Telecom Egypt-led consortium cable connecting Africa to Asia via the Indian Ocean, with landings in Mombasa, Karachi and Egypt. The cable has come ashore at Mombasa but its ready-for-service date has not been announced, so DC254 does not count it among the live systems yet.")
rep("content/articles/submarine-cables-landing-mombasa.md",
    "The cumulative design capacity of these systems exceeds 300 Tbps",
    "The cumulative design capacity of the live systems approaches 300 Tbps")
rep("content/articles/submarine-cables-landing-mombasa.md",
    'external_sources:\n  - title: "Africa-1 Submarine Cable System"\n    url: "https://www.africa-1.africa/"',
    'external_sources:\n  - title: "Africa-1 Submarine Cable System"\n    url: "https://www.africa-1.africa/"\n  - title: "DataCenterDynamics: 2Africa cable goes live between South Africa and Kenya (14 June 2024)"\n    url: "https://www.datacenterdynamics.com/en/news/2024-06-14/2africa-cable-goes-live-between-south-africa-and-kenya/"\n  - title: "Meta Engineering: Announcing the Completion of the Core 2Africa System (17 November 2025)"\n    url: "https://engineering.fb.com/"\n  - title: "SubmarineNetworks: DARE-1 Cable Ready for Service (1 April 2021)"\n    url: "https://www.submarinenetworks.com/"')

# ── 11. Berbera article ──────────────────────────────────────────────────────
rep("content/articles/berbera-northern-route-kenya-fibre-redundancy.md",
    'answer: "Eight major submarine cable systems land in Mombasa and are live as of September 2026: SEACOM, TEAMS, EASSy, DARE1, EIG, LION2, PEACE and 2Africa, per the DC254 verified register. A ninth system, Daraja (Salalah to Mombasa, hosted by Safaricom), was announced in October 2025 and is in development. Mombasa is the most connected coastal city in East and Central Africa."',
    'answer: "Seven major submarine cable systems are live in Kenya as of September 2026: SEACOM, TEAMS, EASSy, LION2, DARE1, PEACE and 2Africa, per the DC254 verified register. Africa-1 landed at Mombasa in 2024 and awaits full service, and Daraja (Salalah to Mombasa, hosted by Safaricom) was announced in October 2025 and is in development. Mombasa is the most connected coastal city in East and Central Africa."')
rep("content/articles/berbera-northern-route-kenya-fibre-redundancy.md",
    "Start with what Kenya actually has. Eight major submarine systems land at Mombasa and are live as of September 2026, per the [DC254 verified register](/articles/submarine-cables-landing-mombasa): SEACOM, TEAMS, EASSy, DARE1, EIG, LION2, PEACE and 2Africa, with a ninth (Daraja, Salalah to Mombasa, hosted by Safaricom) announced in October 2025 and in development.",
    "Start with what Kenya actually has. Seven major submarine systems are live on the Kenyan coast as of September 2026, per the [DC254 verified register](/articles/submarine-cables-landing-mombasa): SEACOM, TEAMS, EASSy, LION2, DARE1, PEACE and 2Africa, with Africa-1 landed at Mombasa in 2024 pending full service and Daraja (Salalah to Mombasa, hosted by Safaricom) announced in October 2025 and in development.")
rep("content/articles/berbera-northern-route-kenya-fibre-redundancy.md",
    'caption: "Kenya\'s eight live submarine systems all enter at Mombasa, which makes the search for physically diverse alternatives a national, not just commercial, question"',
    'caption: "Kenya\'s seven live submarine systems all enter near Mombasa, which makes the search for physically diverse alternatives a national, not just commercial, question"')
rep("content/articles/berbera-northern-route-kenya-fibre-redundancy.md",
    "Mombasa has eight live systems, a mature landing-station ecosystem",
    "Mombasa has seven live systems, a mature landing-station ecosystem")
rep("content/articles/berbera-northern-route-kenya-fibre-redundancy.md",
    "Cable register (eight live systems plus Daraja in development, DARE1 route detail, Daraja announcement October 2025) from the DC254 verified map register, last updated September 2026. Facts verified 16 September 2026.",
    "Cable register (seven live systems, Africa-1 landed pending service, Daraja in development, DARE1 route detail, Daraja announcement October 2025) from the DC254 verified map register, corrected 16 September 2026 after verification showed EIG never landed in Kenya. Facts verified 16 September 2026.")

# ── 12. Fibre networks article ───────────────────────────────────────────────
rep("content/articles/fibre-optic-networks-kenya-data-centres.md",
    "Kenya has eight live submarine cable systems as of September 2026: SEACOM, TEAMS, EASSy, DARE1, EIG, LION2, PEACE, and 2Africa, with a ninth (Daraja) in development.",
    "Kenya has seven live submarine cable systems as of September 2026: SEACOM, TEAMS, EASSy, LION2, DARE1, PEACE, and 2Africa, with Africa-1 landed at Mombasa in 2024 pending full service and Daraja in development.")

# ── 13. Cluster article ──────────────────────────────────────────────────────
rep("content/articles/why-data-centres-cluster-nairobi-mombasa.md",
    'caption: "SEACOM, TEAMS, EASSy, EIG, LION2, DARE1 and PEACE converge on Mombasa, joined since 2024 by 2Africa, with Daraja due in 2026, the chokepoint of Kenya\'s internet"',
    'caption: "Seven live systems, from SEACOM and TEAMS to PEACE and 2Africa, converge on the Mombasa coast, the chokepoint of Kenya\'s internet"')
rep("content/articles/why-data-centres-cluster-nairobi-mombasa.md",
    'First, eight submarine cable systems make landfall on the Mombasa coast (SEACOM, TEAMS, EASSy, EIG, LION2, DARE1, PEACE, and 2Africa), with Meta\'s Daraja scheduled to join them in 2026, so international bandwidth is cheapest and most reliable near the landing stations.',
    'First, seven live submarine cable systems make landfall on the Kenyan coast (SEACOM, TEAMS, EASSy, LION2, DARE1, PEACE, and 2Africa), with Africa-1 landed at Mombasa and Meta\'s Daraja in development, so international bandwidth is cheapest and most reliable near the landing stations.')
rep("content/articles/why-data-centres-cluster-nairobi-mombasa.md",
    "Eight submarine cable systems now land on or near the Mombasa coast: SEACOM, TEAMS, EASSy, EIG, LION2, DARE1, PEACE, and 2Africa, the 37,000 km consortium system live in Kenya since 2024 and fully completed in November 2025. A ninth, Meta's Daraja, a 4,108 km Oman-to-Mombasa route with Safaricom as landing partner, is scheduled for service in 2026 (Business Daily, September 14, 2026).",
    "Seven live submarine cable systems now land on or near the Mombasa coast: SEACOM, TEAMS, EASSy, LION2, DARE1, PEACE, and 2Africa, the 45,000 km consortium system live in Kenya since June 2024 and fully completed in November 2025. Africa-1 landed at Mombasa in 2024 and awaits full service, and Meta's Daraja, a 4,108 km Oman-to-Mombasa route with Safaricom as landing partner, is in development (announced October 2025; Business Daily, September 14, 2026).")
rep("content/articles/why-data-centres-cluster-nairobi-mombasa.md",
    "Eight submarine cable systems land on the Mombasa coast (SEACOM, TEAMS, EASSy, EIG, LION2, DARE1, PEACE, and 2Africa), with Meta's Daraja scheduled to join them in 2026, making international bandwidth cheapest near the landing stations.",
    "Seven live submarine cable systems land on the Kenyan coast (SEACOM, TEAMS, EASSy, LION2, DARE1, PEACE, and 2Africa), with Africa-1 landed at Mombasa and Meta's Daraja in development, making international bandwidth cheapest near the landing stations.")

# ── 14. Market numbers article ───────────────────────────────────────────────
rep("content/articles/kenya-data-centre-market-numbers.md",
    'answer: "Eight live cable systems land at Mombasa, SEACOM and TEAMS (2009), EASSy (2010), EIG (2011), LION2 (2012), DARE1 (2015), PEACE (2022) and 2Africa (2024, the largest cable system ever built), with the Meta-backed Daraja cable in development and scheduled for service in 2026 (Business Daily, 14 September 2026)."',
    'answer: "Seven live cable systems land on the Kenyan coast: SEACOM and TEAMS (2009), EASSy (2010), LION2 (2012), DARE1 (2021), PEACE (2022) and 2Africa (2024, the largest cable system ever built). Africa-1 landed at Mombasa in 2024 and awaits full service, and the Meta-backed Daraja cable is in development (Business Daily, 14 September 2026)."')
rep("content/articles/kenya-data-centre-market-numbers.md",
    "eight live cable systems land at Mombasa (SEACOM and TEAMS from 2009, EASSy, EIG, LION2, DARE1, PEACE and 2Africa, the largest cable system ever built), with the Meta-backed Daraja cable, hosted by Safaricom, in development.",
    "seven live cable systems land on the Kenyan coast (SEACOM and TEAMS from 2009, EASSy, LION2, DARE1, PEACE and 2Africa, the largest cable system ever built), with Africa-1 landed and awaiting service, and the Meta-backed Daraja cable, hosted by Safaricom, in development.")

# ── 15. Amaco article ────────────────────────────────────────────────────────
rep("content/articles/amaco-hercules-mombasa-ai-data-centre.md",
    "Eight submarine cable systems make landfall on its coast (SEACOM, TEAMS, EASSy, EIG, LION2, DARE1, PEACE and 2Africa), with Meta's Daraja scheduled to join them in 2026, and",
    "Seven live submarine cable systems make landfall on its coast (SEACOM, TEAMS, EASSy, LION2, DARE1, PEACE and 2Africa), with Africa-1 landed and Meta's Daraja in development, and")

# ── 16. LuLu article ─────────────────────────────────────────────────────────
rep("content/articles/kenya-lulu-coastal-cable-system.md",
    "Kenya's eight international cable systems land in the Mombasa area",
    "Kenya's seven live international cable systems land in the Mombasa area")

# ── 17. AI east africa article ───────────────────────────────────────────────
rep("content/articles/ai-data-centres-east-africa.md",
    "Mombasa is the landing point for at least eight submarine cable systems, including EASSy, Seacom, TEAMS, DARE1, and others.",
    "Mombasa is the landing point for seven live submarine cable systems, including EASSy, Seacom, TEAMS, DARE1 and 2Africa, with Africa-1 landed and Daraja in development.")

# ── 18. PIDA article ─────────────────────────────────────────────────────────
rep("content/articles/kenya-pida-infrastructure-pipeline.md",
    "where eight submarine cables already surface.",
    "where seven live submarine cable systems surface (nine in total).")

# ── 19. Paratus article ──────────────────────────────────────────────────────
rep("content/articles/paratus-g2m-fibre-route-live.md",
    "(six live cable systems land at Mombasa, from SEACOM and TEAMS to the 16 Tbps PEACE route)",
    "(seven live cable systems land on the Kenyan coast, from SEACOM and TEAMS to the 16 Tbps PEACE route)")
rep("content/articles/paratus-g2m-fibre-route-live.md",
    "shows seven cable systems (six live, Daraja in development) converging on one coastal bottleneck.",
    "shows nine cable systems (seven live, with Africa-1 landed and Daraja in development) converging on one coastal bottleneck.")

# ── Bump updated_date on refreshed articles ──────────────────────────────────
for f in [
    "content/articles/submarine-cables-landing-mombasa.md",
    "content/articles/berbera-northern-route-kenya-fibre-redundancy.md",
    "content/articles/fibre-optic-networks-kenya-data-centres.md",
    "content/articles/why-data-centres-cluster-nairobi-mombasa.md",
    "content/articles/kenya-data-centre-market-numbers.md",
    "content/articles/amaco-hercules-mombasa-ai-data-centre.md",
    "content/articles/kenya-lulu-coastal-cable-system.md",
    "content/articles/ai-data-centres-east-africa.md",
    "content/articles/kenya-pida-infrastructure-pipeline.md",
    "content/articles/paratus-g2m-fibre-route-live.md",
]:
    bump_updated(f)

print("\nALL CABLE COUNT FIXES APPLIED")
