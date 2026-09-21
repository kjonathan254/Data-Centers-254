#!/usr/bin/env python3
"""Evidence Engine v0.2 - claims DB builder for the 11-facility pilot.

Assembles src/data/directory/claims-2026-Q3.json (facility -> claims ->
tiered sources with verbatim excerpts) and the initial evidence ledger.

Excerpts are VERBATIM strings captured from documents fetched on
2026-09-22 by scripts/evidence_v02_fetch*.py (see research/evidence_v02/).
The deterministic state rule mirrors src/lib/evidence/config.ts and is
re-checked by scripts/evidence_v02_validate.py.

Assessment method on this run: rule-tier-v0.2 (deterministic). TypeSafe/Jev
per-claim scoring layers on when TYPESAFE_API_KEY is configured.
"""
import json
import os

REPO = "/home/z/my-project/dc254"
RETRIEVED = "2026-09-22"
METHOD = "rule-tier-v0.2"

# ─── Sources (tier, publisher = distinct-organisation key) ────────────────

SOURCES = {
    # Tier 1 - operator official pages (verbatim excerpts from fetched HTML)
    "icolo-home": {
        "label": "iColo (Digital Realty) official site",
        "url": "https://www.icolo.io/",
        "tier": 1, "publisher": "icolo.io", "sourceType": "Operator website",
        "publishedDate": None,
        "excerpt": "iColo (now Digital Realty) - Carrier Neutral Data Centers in Africa",
    },
    "icolo-nbo1-page": {
        "label": "iColo Nairobi One facility page",
        "url": "https://www.icolo.io/location/nbo1/",
        "tier": 1, "publisher": "icolo.io", "sourceType": "Operator website",
        "publishedDate": None,
        "excerpt": "NBO1 launched in September 2019 as the first truly carrier-neutral data center in Nairobi. Strategically located in Karen",
    },
    "icolo-mba1-page": {
        "label": "iColo Mombasa One facility page",
        "url": "https://www.icolo.io/location/mba1/",
        "tier": 1, "publisher": "icolo.io", "sourceType": "Operator website",
        "publishedDate": None,
        "excerpt": "Mombasa One - iColo (now Digital Realty)",
    },
    "icolo-mba2-page": {
        "label": "iColo Mombasa Two facility page",
        "url": "https://www.icolo.io/location/mba2/",
        "tier": 1, "publisher": "icolo.io", "sourceType": "Operator website",
        "publishedDate": None,
        "excerpt": "launched in 2022. Hosting up to 600 customer racks, MBA2 is part of our expansion plans in East Africa",
    },
    "paix-kenya-page": {
        "label": "PAIX Kenya (NBO-1) facility page",
        "url": "https://www.paix.io/kenya",
        "tier": 1, "publisher": "paix.io", "sourceType": "Operator website",
        "publishedDate": None,
        "excerpt": "Data Centre Nairobi | PAIX NBO-1 Colocation in Upper Hill",
    },
    "ixafrica-home": {
        "label": "iXAfrica official site",
        "url": "https://ixafrica.co.ke/",
        "tier": 1, "publisher": "ixafrica.co.ke", "sourceType": "Operator website",
        "publishedDate": None,
        "excerpt": "NBOX1.1: 4.5MW IT Load MW Ready 40 kW available per rack NBOX1.2: 18MW IT Load",
    },
    "adc-nairobi-page": {
        "label": "Africa Data Centres Nairobi page",
        "url": "https://www.africadatacentres.com/nairobi/",
        "tier": 1, "publisher": "africadatacentres.com", "sourceType": "Operator website",
        "publishedDate": None,
        "excerpt": "Pan-African Footprint JHB1 Midrand JHB2 Samrand CPT1 Cape Town NBO1 Nairobi LOS1 Lagos",
    },
    # Tier 2 - PeeringDB facility registry (independent industry registry)
    "pdb-1964": {
        "label": "PeeringDB facility record #1964 (ADC NBO1)",
        "url": "https://www.peeringdb.com/fac/1964",
        "tier": 2, "publisher": "peeringdb.com", "sourceType": "Industry registry (PeeringDB)",
        "publishedDate": "2014-10-22",
        "excerpt": "PeeringDB record: name \"Africa Data Centres, Nairobi NBO1, Kenya\"; address1 \"Sameer Business Park\"; Nairobi, Kenya; 126 networks present; record created 2014-10-22; notes: \"Africa Data Centres own and operate carrier, cloud and exchange neutral data centers across the African continent\"",
    },
    "pdb-6448": {
        "label": "PeeringDB facility record #6448 (iColo NBO1)",
        "url": "https://www.peeringdb.com/fac/6448",
        "tier": 2, "publisher": "peeringdb.com", "sourceType": "Industry registry (PeeringDB)",
        "publishedDate": "2019-03-11",
        "excerpt": "PeeringDB record: name \"icolo.io Nairobi One (NBO1)\"; Karen, Kenya; 62 networks present; record created 2019-03-11",
    },
    "pdb-14166": {
        "label": "PeeringDB facility record #14166 (iColo NBO2)",
        "url": "https://www.peeringdb.com/fac/14166",
        "tier": 2, "publisher": "peeringdb.com", "sourceType": "Industry registry (PeeringDB)",
        "publishedDate": "2023-10-15",
        "excerpt": "PeeringDB record: name \"icolo.io Nairobi Two (NBO2)\"; Karen, Kenya; 3 networks present; record created 2023-10-15",
    },
    "pdb-5019": {
        "label": "PeeringDB facility record #5019 (iColo MBA1)",
        "url": "https://www.peeringdb.com/fac/5019",
        "tier": 2, "publisher": "peeringdb.com", "sourceType": "Industry registry (PeeringDB)",
        "publishedDate": "2018-03-05",
        "excerpt": "PeeringDB record: name \"icolo.io Mombasa One (MBA1)\"; Miritini, Kenya; 94 networks present; record created 2018-03-05",
    },
    "pdb-10232": {
        "label": "PeeringDB facility record #10232 (iColo MBA2)",
        "url": "https://www.peeringdb.com/fac/10232",
        "tier": 2, "publisher": "peeringdb.com", "sourceType": "Industry registry (PeeringDB)",
        "publishedDate": "2021-03-04",
        "excerpt": "PeeringDB record: name \"icolo.io Mombasa Two (MBA2)\"; Nyali, Kenya; 40 networks present; record created 2021-03-04",
    },
    "pdb-7995": {
        "label": "PeeringDB facility record #7995 (PAIX Nairobi)",
        "url": "https://www.peeringdb.com/fac/7995",
        "tier": 2, "publisher": "peeringdb.com", "sourceType": "Industry registry (PeeringDB)",
        "publishedDate": "2020-01-15",
        "excerpt": "PeeringDB record: name \"PAIX Nairobi\"; address1 \"Britam Tower\"; Nairobi, Kenya; 38 networks present; record created 2020-01-15",
    },
    "pdb-13572": {
        "label": "PeeringDB facility record #13572 (iXAfrica NBOX1)",
        "url": "https://www.peeringdb.com/fac/13572",
        "tier": 2, "publisher": "peeringdb.com", "sourceType": "Industry registry (PeeringDB)",
        "publishedDate": "2023-04-14",
        "excerpt": "PeeringDB record: name \"iXAfrica NBOX1 (Nairobi X One)\"; address1 \"Cabanas, Mombasa Road.\"; Nairobi, Kenya; 43 networks present; record created 2023-04-14; notes: \"Award winning iXAfrica Data Centres in Nairobi, Kenya is East Africa's First and Largest Hyper-scale Carrier-neutral\"",
    },
    "pdb-1648": {
        "label": "PeeringDB facility record #1648 (SEACOM Mombasa CLS)",
        "url": "https://www.peeringdb.com/fac/1648",
        "tier": 2, "publisher": "peeringdb.com", "sourceType": "Industry registry (PeeringDB)",
        "publishedDate": "2013-10-01",
        "excerpt": "PeeringDB record: name \"SEACOM Mombasa CLS\"; org \"SEACOM Limited\"; address1 \"Swahili Cultural Centre\"; Mombasa, Kenya; 31 networks present; record created 2013-10-01",
    },
    # Tier 3 - reputable press (dated articles, verbatim excerpts)
    "press-techafrica-nbo2": {
        "label": "tech.africa: Digital Realty opens NBO2 and retires the iColo brand",
        "url": "https://tech.africa/digital-realty-nbo2-nairobi/",
        "tier": 3, "publisher": "tech.africa", "sourceType": "Specialist technology publication",
        "publishedDate": "2026-09-07",
        "excerpt": "The ribbon-cutting at NBO2 in Nairobi on 7 September 2026 ... Nairobi, Kenya, gained 6.4 megawatts (MW) of data centre capacity on 7 September 2026, and lost a brand on the same day. Digital Realty, the American data centre operator that trades o[n iColo]",
    },
    "press-techtrendske-nbo2": {
        "label": "TechTrendsKE: NBO2 data centre launches in Nairobi",
        "url": "https://techtrendske.co.ke/2026/09/07/nbo2-data-centre-nairobi/",
        "tier": 3, "publisher": "techtrendske.co.ke", "sourceType": "Kenyan technology publication",
        "publishedDate": "2026-09-07",
        "excerpt": "NBO2 data centre launches in Nairobi ... NBO2 data centre launch deepens Kenya's push to become East Africa's digital gateway",
    },
    "press-allafrica-nbo2": {
        "label": "allAfrica: NBO2 Data Centre Strengthens Kenya's Bid to Become East Africa's Digital Hub",
        "url": "https://allafrica.com/stories/202609080028.html",
        "tier": 3, "publisher": "allafrica.com", "sourceType": "News organisation (pan-African)",
        "publishedDate": "2026-09-08",
        "excerpt": "NBO2 data centre in Nairobi, expanding infrastructure needed to support artificial intelligence, cloud computing, financial technology and regional digital connectivity",
    },
    "press-itweb-nbo2": {
        "label": "ITWeb Africa: Digital Realty opens 6.4MW Nairobi data centre",
        "url": "https://itweb.africa/article/digital-realty-opens-64mw-nairobi-data-centre/KA3WwMdzPgLvrydZ",
        "tier": 3, "publisher": "itweb.africa", "sourceType": "African technology publication",
        "publishedDate": "2026-09-08",
        "excerpt": "Digital Realty opens 6.4MW Nairobi data centre ... Speaking at the facility's commissioning, John Tanui, Kenya's ICT and Digital Economy p[ermanent secretary]",
    },
    "press-telecompaper-nxtra": {
        "label": "Telecompaper: Airtel Kenya pushes Nxtra data centre launch in Tatu City to July 2027",
        "url": "https://www.telecompaper.com/news/airtel-kenya-pushes-nxtra-data-centre-launch-in-tatu-city-to-july-2027-from-q1--1579056",
        "tier": 3, "publisher": "telecompaper.com", "sourceType": "Telecoms trade publication",
        "publishedDate": None,
        "excerpt": "Airtel Kenya has set a new completion target of July 2027 for its Nxtra data centre in Tatu City, revising its timeline from the initial first quarter 2027 goal announced when construction broke ground",
    },
    "press-independent-raxio": {
        "label": "The Independent (Uganda): Raxio Data Centre primed for Uganda's cloud computing, digital needs",
        "url": "https://www.independent.co.ug/raxio-data-centre-primed-for-all-ugandas-cloud-computing-digital-needs/",
        "tier": 3, "publisher": "independent.co.ug", "sourceType": "Ugandan news organisation",
        "publishedDate": None,
        "excerpt": "The function was at the heart of Namanve Industrial Park, in Kampala, where Raxio Uganda is ideally located along key fibr[e] ... the recent decision by International Finance Corporation (IFC), a member of the World Bank Group, to back Raxio's record $100 million investment",
    },
}

TIER_TRACE = {1: 0.9, 2: 0.75, 3: 0.6, 4: 0.15}


def derive_state(source_ids, investigated=True):
    """Deterministic rule (mirrors src/lib/evidence/config.ts):
    verified  : >=1 source tier<=2 AND >=1 further source from a DIFFERENT org, tier<=3
    review    : investigated, >=1 source tier<=3, threshold unmet
    unsupported: investigated, no usable evidence (tier-4 only or none)"""
    if not source_ids:
        return "unsupported" if investigated else "unverified"
    tiers = [SOURCES[s]["tier"] for s in source_ids]
    pubs = [SOURCES[s]["publisher"] for s in source_ids]
    has_anchor = any(t <= 2 for t in tiers)
    distinct_corroborator = any(
        t <= 3 and pubs[i] != pubs[j]
        for i, t in enumerate(tiers) for j in range(len(tiers)) if i != j
    )
    usable = any(t <= 3 for t in tiers)
    if has_anchor and distinct_corroborator:
        return "verified"
    if usable:
        return "review"
    return "unsupported" if investigated else "unverified"


def assess(source_ids):
    if not source_ids:
        return {"method": METHOD, "traceability": 0.0, "independence": 0.0, "composite": 0.0,
                "rationale": "No usable evidence located in the 2026-09-22 sweep."}
    tiers = [SOURCES[s]["tier"] for s in source_ids]
    pubs = [SOURCES[s]["publisher"] for s in source_ids]
    trace = max(TIER_TRACE[t] for t in tiers)
    distinct = len(set(pubs))
    indep = 0.9 if distinct >= 2 else 0.4
    tier_list = "/".join(f"T{t}" for t in sorted(tiers))
    state = derive_state(source_ids)
    rationale = f"Sources {tier_list} ({', '.join(sorted(set(pubs)))}); {distinct} distinct organisation(s); rule -> {state}."
    return {"method": METHOD, "traceability": round(trace, 2), "independence": indep,
            "composite": round(min(trace, indep), 2), "rationale": rationale}


def C(cid, ctype, statement, sources, note=None):
    return {"id": cid, "type": ctype, "statement": statement, "sourceIds": sources,
            "note": note, "state": derive_state(sources), "humanReview": "pending",
            "reviewedBy": None, "reviewedAt": None, "assessment": assess(sources)}


FACILITIES = {
    "ixafrica-nbox1": {
        "claims": [
            C("NBOX1-C1", "identity", "iXAfrica operates the NBOX1 (Nairobi X One) data centre facility in Nairobi.", ["ixafrica-home", "pdb-13572"]),
            C("NBOX1-C2", "operator", "iXAfrica Data Centres is the operator of NBOX1.", ["ixafrica-home", "pdb-13572"]),
            C("NBOX1-C3", "facility_type", "NBOX1 is positioned as a hyperscale, carrier-neutral, AI-ready facility.", ["ixafrica-home", "pdb-13572"]),
            C("NBOX1-C4", "location", "NBOX1 is located at Cabanas, Mombasa Road, Nairobi.", ["ixafrica-home", "pdb-13572"]),
            C("NBOX1-C5", "status", "NBOX1 is operational.", ["ixafrica-home", "pdb-13572"],
              "Operator site live and registry shows 43 connected networks, but no explicit in-service statement was captured; treat as near-verified."),
            C("NBOX1-C6", "capacity", "NBOX1.1 provides 4.5MW of IT load; the NBOX1.2 expansion adds 18MW.", ["ixafrica-home"],
              "Operator-stated; no independent MW corroboration located. Directory tracks 5MW total / 4.5MW live IT load for phase 1."),
        ],
    },
    "africa-dc-nairobi-1": {
        "claims": [
            C("ADCNBO1-C1", "identity", "Africa Data Centres operates the NBO1 data centre facility in Nairobi.", ["adc-nairobi-page", "pdb-1964"]),
            C("ADCNBO1-C2", "operator", "Africa Data Centres is the operator of NBO1.", ["adc-nairobi-page", "pdb-1964"]),
            C("ADCNBO1-C3", "facility_type", "NBO1 is a carrier-neutral colocation facility.", ["adc-nairobi-page", "pdb-1964"]),
            C("ADCNBO1-C4", "location", "NBO1 is located at Sameer Business Park, Mombasa Road, Nairobi.", ["pdb-1964"],
              "Registry confirms Sameer Business Park; the operator page fetched does not state the street address."),
            C("ADCNBO1-C5", "status", "NBO1 is operational.", ["adc-nairobi-page", "pdb-1964"],
              "Operator lists NBO1 in its live footprint and the registry record is active with 126 networks; no explicit in-service statement captured."),
            C("ADCNBO1-C6", "capacity", "NBO1's 7.5MW total capacity is publicly documented.", [],
              "Directory states 7.5MW; no public source located in the sweep documents this figure. Claim-specific source needed."),
        ],
    },
    "icolo-nbo1": {
        "claims": [
            C("NBONBO1-C1", "identity", "iColo operates the Nairobi One (NBO1) data centre in Nairobi.", ["icolo-nbo1-page", "pdb-6448"]),
            C("NBONBO1-C2", "operator", "NBO1 is operated by iColo, now part of Digital Realty.", ["icolo-nbo1-page", "pdb-6448"]),
            C("NBONBO1-C3", "facility_type", "NBO1 is a carrier-neutral colocation data centre.", ["icolo-nbo1-page", "pdb-6448"]),
            C("NBONBO1-C4", "location", "NBO1 is located in Karen, Nairobi.", ["icolo-nbo1-page", "pdb-6448"]),
            C("NBONBO1-C5", "status", "NBO1 launched in September 2019 and is operational.", ["icolo-nbo1-page", "pdb-6448"]),
        ],
    },
    "icolo-nbo2": {
        "claims": [
            C("NBONBO2-C1", "identity", "Digital Realty (formerly iColo) opened the NBO2 data centre in Nairobi on 7 September 2026.", ["pdb-14166", "press-techafrica-nbo2", "press-techtrendske-nbo2", "press-itweb-nbo2"]),
            C("NBONBO2-C2", "operator", "NBO2 is operated by Digital Realty, which has retired the iColo brand.", ["pdb-14166", "press-techafrica-nbo2", "press-itweb-nbo2"]),
            C("NBONBO2-C3", "facility_type", "NBO2 operates as a colocation facility.", ["pdb-14166", "press-techafrica-nbo2"],
              "Gathered sources describe it as a data centre but none states 'colocation' explicitly; registry listing implies it."),
            C("NBONBO2-C4", "location", "NBO2 is located in Karen (Bogani East Road), Nairobi.", ["pdb-14166"],
              "Registry places NBO2 in Karen; the street address rests on the directory's earlier collection."),
            C("NBONBO2-C5", "status", "NBO2 opened on 7 September 2026 and is operational.", ["pdb-14166", "press-techafrica-nbo2", "press-itweb-nbo2"]),
            C("NBONBO2-C6", "capacity", "NBO2's capacity is 6.4MW.", ["press-techafrica-nbo2", "press-itweb-nbo2"],
              "DIVERGENCE: two press sources state 6.4MW; the directory record says 6.5MW. Review the directory figure against a Digital Realty primary source."),
        ],
    },
    "icolo-mba1": {
        "claims": [
            C("MBAMBA1-C1", "identity", "iColo operates the Mombasa One (MBA1) data centre in Mombasa.", ["icolo-mba1-page", "pdb-5019"]),
            C("MBAMBA1-C2", "operator", "MBA1 is operated by iColo, now part of Digital Realty.", ["icolo-mba1-page", "pdb-5019"]),
            C("MBAMBA1-C3", "facility_type", "MBA1 operates as a colocation facility.", ["icolo-mba1-page", "pdb-5019"],
              "Registry listing implies colocation; no gathered source states the type explicitly."),
            C("MBAMBA1-C4", "location", "MBA1 is located in Miritini, Mombasa.", ["pdb-5019"],
              "Registry confirms Miritini; the operator page fetched does not state the area."),
            C("MBAMBA1-C5", "status", "MBA1 is operational.", ["icolo-mba1-page", "pdb-5019"],
              "Registry active with 94 networks and operator page live; no explicit in-service statement captured."),
            C("MBAMBA1-C6", "capacity", "MBA1's 13MW total capacity is publicly documented.", [],
              "DIVERGENCE RISK: directory states 13MW total / 0.9MW live IT load, but no public source located documents 13MW. Verify against an iColo/Digital Realty primary source."),
        ],
    },
    "icolo-mba2": {
        "claims": [
            C("MBAMBA2-C1", "identity", "iColo operates the Mombasa Two (MBA2) data centre in Mombasa.", ["icolo-mba2-page", "pdb-10232"]),
            C("MBAMBA2-C2", "operator", "MBA2 is operated by iColo, now part of Digital Realty.", ["icolo-mba2-page", "pdb-10232"]),
            C("MBAMBA2-C3", "facility_type", "MBA2 operates as a colocation facility.", ["icolo-mba2-page", "pdb-10232"],
              "Operator page cites hosting up to 600 customer racks; no source states 'colocation' verbatim."),
            C("MBAMBA2-C4", "location", "MBA2 is located in Nyali, Mombasa.", ["pdb-10232"],
              "Registry confirms Nyali; the operator page fetched does not state the area."),
            C("MBAMBA2-C5", "status", "MBA2 launched in 2022 and is operational.", ["icolo-mba2-page", "pdb-10232"]),
            C("MBAMBA2-C6", "capacity", "MBA2 hosts up to 600 customer racks.", ["icolo-mba2-page"],
              "Operator-stated rack figure; directory tracks 1.75MW live IT load."),
        ],
    },
    "paix-nairobi": {
        "claims": [
            C("PAIX-C1", "identity", "PAIX Data Centres operates the NBO-1 data centre in Nairobi.", ["paix-kenya-page", "pdb-7995"]),
            C("PAIX-C2", "operator", "PAIX Data Centres is the operator of NBO-1.", ["paix-kenya-page", "pdb-7995"]),
            C("PAIX-C3", "facility_type", "NBO-1 operates as a colocation facility.", ["paix-kenya-page", "pdb-7995"]),
            C("PAIX-C4", "location", "NBO-1 is located in Britam Tower, Upper Hill, Nairobi.", ["paix-kenya-page", "pdb-7995"]),
            C("PAIX-C5", "status", "NBO-1 is operational.", ["paix-kenya-page", "pdb-7995"],
              "Registry active with 38 networks; no explicit in-service statement captured."),
            C("PAIX-C6", "capacity", "NBO-1's 1.5MW total capacity is publicly documented.", [],
              "Directory states 1.5MW; no public source located documents this figure."),
        ],
    },
    "nxtra-tatu-city": {
        "claims": [
            C("NXTRA-C1", "identity", "Nxtra by Airtel is building a data centre at Tatu City, Kenya.", ["press-telecompaper-nxtra"]),
            C("NXTRA-C2", "operator", "The Tatu City facility is operated by Nxtra by Airtel (Airtel Kenya).", ["press-telecompaper-nxtra"]),
            C("NXTRA-C3", "facility_type", "The Tatu City facility is positioned as a large-scale (hyperscale) facility.", [],
              "Directory states Hyperscale with 44MW planned; no gathered source documents the positioning or figure."),
            C("NXTRA-C4", "location", "The facility is located at Tatu City, Eastern Bypass, Ruiru.", ["press-telecompaper-nxtra"],
              "Press confirms Tatu City; the street-level detail rests on the directory's earlier collection."),
            C("NXTRA-C5", "status", "The facility is under construction with completion targeted for July 2027.", ["press-telecompaper-nxtra"],
              "Consistent with the directory's Under Construction status."),
            C("NXTRA-C6", "capacity", "The facility's 44MW planned capacity is publicly documented.", [],
              "Directory states 44MW; not found in the sweep. Claim-specific source needed."),
        ],
    },
    "seacom-mombasa-cls": {
        "claims": [
            C("SEACOM-C1", "identity", "SEACOM operates the Mombasa cable landing station.", ["pdb-1648"],
              "Operator site is a JS-rendered shell (no static content); registry is currently the only usable source."),
            C("SEACOM-C2", "operator", "The Mombasa CLS is operated by SEACOM Limited.", ["pdb-1648"]),
            C("SEACOM-C3", "facility_type", "The facility's primary role is submarine cable termination (cable landing station).", ["pdb-1648"],
              "The registry record name states 'CLS'; no operator or press source gathered states it in prose."),
            C("SEACOM-C4", "location", "The CLS sits at the Swahili Cultural Centre site, Mombasa.", ["pdb-1648"]),
            C("SEACOM-C5", "status", "The CLS is operational.", ["pdb-1648"],
              "Registry active since 2013 with 31 networks; no explicit in-service statement captured."),
        ],
    },
    "raxio-kampala-ug1": {
        "claims": [
            C("RAXIO-C1", "identity", "Raxio operates the UG1 data centre at Namanve, Kampala, Uganda.", ["press-independent-raxio"]),
            C("RAXIO-C2", "operator", "UG1 is operated by Raxio Data Centres (Raxio Uganda).", ["press-independent-raxio"]),
            C("RAXIO-C3", "facility_type", "UG1 operates as a colocation facility.", [],
              "No gathered source states the type explicitly; directory says Colocation. Operator site blocked the sweep (HTTP 403)."),
            C("RAXIO-C4", "location", "UG1 is located in Namanve Industrial Park (Kampala Industrial and Business Park), Kampala.", ["press-independent-raxio"]),
            C("RAXIO-C5", "status", "UG1 is operational.", ["press-independent-raxio"],
              "Press describes recent functions hosted at the operating facility; no explicit in-service date captured."),
        ],
    },
    "africa-data-centres-kigali-kgl1": {
        "claims": [
            C("KGL1-C1", "identity", "Africa Data Centres operates the KGL1 data centre in Kigali, Rwanda.", [],
              "NEGATIVE SWEEP (2026-09-22): the ADC site carries no Kigali page (wp-json search returns only Lagos), no PeeringDB record exists, and no relevant press was located. Weakest record in the directory; editor to decide: claim-specific source or delist."),
            C("KGL1-C2", "operator", "KGL1 is operated by Africa Data Centres (Cassava Technologies).", [],
              "No public source located in the sweep."),
            C("KGL1-C3", "facility_type", "KGL1 operates as a colocation facility.", [],
              "No public source located in the sweep."),
            C("KGL1-C4", "location", "KGL1 is located in Kigali, Rwanda.", [],
              "No public source located in the sweep."),
            C("KGL1-C5", "status", "KGL1 is under construction with 2MW planned capacity.", [],
              "No public source located in the sweep documents the stage or the 2MW figure."),
        ],
    },
}


def main():
    current = json.load(open(os.path.join(REPO, "src/data/directory/current.json")))
    known = {f["slug"]: f for f in current["facilities"]}
    missing = [s for s in FACILITIES if s not in known]
    if missing:
        raise SystemExit(f"claims reference unknown facility slugs: {missing}")

    claims_doc = {
        "schemaVersion": "0.2",
        "datasetVersion": "2026-Q3",
        "generatedAt": "2026-09-22",
        "assessmentMethod": METHOD,
        "humanGate": "Public states reflect editorially approved claims only (humanReview = approved).",
        "sources": {
            sid: {
                "label": s["label"], "url": s["url"], "tier": s["tier"],
                "publisher": s["publisher"], "sourceType": s["sourceType"],
                "publishedDate": s["publishedDate"], "retrievedDate": RETRIEVED,
                "excerpt": s["excerpt"],
            } for sid, s in SOURCES.items()
        },
        "facilities": {
            slug: {
                "investigatedAt": RETRIEVED,
                "investigationNote": spec.get("note"),
                "claims": spec["claims"],
            } for slug, spec in FACILITIES.items()
        },
    }
    out = os.path.join(REPO, "src/data/directory/claims-2026-Q3.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(claims_doc, f, indent=2, ensure_ascii=False)
        f.write("\n")

    # Initial ledger: one entry per assessed claim (AI-assisted, pending human)
    ledger = []
    from v01_bands import V01_BAND  # local map of v0.1 facility bands
    for slug, spec in FACILITIES.items():
        for c in spec["claims"]:
            ledger.append({
                "date": RETRIEVED,
                "facility": known[slug]["name"],
                "facilitySlug": slug,
                "claimId": c["id"],
                "claim": c["statement"],
                "previousStatus": V01_BAND.get(slug, "unverified"),
                "newStatus": c["state"],
                "evidenceAdded": [SOURCES[s]["label"] for s in c["sourceIds"]] or ["none located in sweep"],
                "reviewedBy": "Evidence Engine v0.2 (AI-assisted, rule-tier-v0.2) - awaiting editorial approval",
                "reason": c["assessment"]["rationale"],
            })
    lout = os.path.join(REPO, "src/data/directory/evidence-ledger.json")
    with open(lout, "w", encoding="utf-8") as f:
        json.dump({"version": 1, "created": RETRIEVED, "entries": ledger}, f, indent=2, ensure_ascii=False)
        f.write("\n")

    # summary
    from collections import Counter
    states = Counter(c["state"] for spec in FACILITIES.values() for c in spec["claims"])
    print(f"claims: {sum(len(s['claims']) for s in FACILITIES.values())} across {len(FACILITIES)} facilities")
    print("states:", dict(states))
    print(f"sources: {len(SOURCES)}")
    print(f"wrote {out}")
    print(f"wrote {lout} ({len(ledger)} entries)")


if __name__ == "__main__":
    main()
