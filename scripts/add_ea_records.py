#!/usr/bin/env python3
"""
Append the first East Africa regional records to the versioned directory
dataset (src/data/directory/current.json).

Every record below was verified against public sources on 19 Sep 2026:
  - Raxio Kampala UG1:      raxiogroup.com launch release (25 May 2021),
                            DataCenterDynamics (26 May 2021), datacentermap.com
  - Uganda NDC (NITA-U):    nita.go.ug (market-study release, 19 Jun 2025),
                            The Independent Uganda (23 Feb 2026)
  - Raxio Dar es Salaam:    raxiogroup.com investment release (23 Mar 2022),
                            DataCenterDynamics (23 Mar 2022), Energy News
                            Network (13 Jul 2026: "expects to open this year")
  - ADC Kigali KGL1:        africadatacentres.com / Cassava announcement
                            (28 Nov 2022), DataCenterDynamics (28 Nov 2022)

Confidence grades follow docs/RESEARCH-VERIFICATION-STANDARDS.md. Records
carry `country` now; the loader defaults older (Kenya) records to Kenya.

Run: python3 scripts/add_ea_records.py
"""
import json
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(REPO, "src", "data", "directory", "current.json")

NEW_OPERATOR = {
    "id": "nita-u",
    "name": "National Information Technology Authority - Uganda (NITA-U)",
    "slug": "nita-u",
    "type": "Government",
    "parentCompany": "Government of Uganda",
    "hqCountry": "Uganda",
    "websiteUrl": "https://nita.go.ug",
}

NEW_FACILITIES = [
    {
        "id": "31",
        "name": "Raxio Kampala UG1",
        "slug": "raxio-kampala-ug1",
        "description": "Uganda's first enterprise-grade, Tier III certified carrier-neutral colocation data centre, in the Kampala Industrial and Business Park.",
        "status": "Operational",
        "address": "Kampala Industrial and Business Park (KIBP), Namanve",
        "city": "Kampala",
        "region": "Central Region",
        "country": "Uganda",
        "itLoadMw": None,
        "totalCapacityMw": None,
        "rackCount": 400,
        "tierRating": "III",
        "facilityType": "Colocation",
        "aiReady": False,
        "openedDate": "2021",
        "expansionDate": None,
        "coolingType": None,
        "powerSource": "Ugandan grid with on-site backup generation",
        "renewableClaim": None,
        "notable": "Launched 25 May 2021 as Uganda's first Tier III certified carrier-neutral facility, with colocation space for up to 400 racks at full build-out. Raxio Group's first operational site and the reference facility for Uganda's commercial colocation market.",
        "lastVerified": "2026-09",
        "dataSource": "Raxio Group launch release (25 May 2021); DataCenterDynamics (26 May 2021); datacentermap.com register",
        "dataConfidence": "High",
        "sources": [
            {"label": "Raxio Group, Raxio Uganda launch announcement (25 May 2021)", "url": "https://www.raxiogroup.com", "kind": "operator"},
            {"label": "DataCenterDynamics, Raxio opens Tier III data center in Uganda (26 May 2021)", "url": "https://www.datacenterdynamics.com", "kind": "press"},
            {"label": "datacentermap.com, Raxio Kampala UG1 facility register", "url": "https://www.datacentermap.com", "kind": "registry"},
        ],
        "carrierNeutral": True,
        "certNote": "Uptime Institute Tier III Certified as stated in the operator's launch materials; certification scope not independently re-checked.",
        "divergenceNote": "IT load and designed MW not published; rack capacity (400 at full build-out) is operator-stated. Live IT load deliberately left null rather than estimated.",
        "operatorId": "raxio",
        "connectivityFacility": [],
        "certifications": [],
    },
    {
        "id": "32",
        "name": "Uganda National Data Centre (NDC1)",
        "slug": "uganda-national-data-centre",
        "description": "Government of Uganda national data centre operated by NITA-U, providing hosting and DR services to government entities, with a second site in service and a third planned.",
        "status": "Operational",
        "address": None,
        "city": "Kampala",
        "region": "Central Region",
        "country": "Uganda",
        "itLoadMw": None,
        "totalCapacityMw": None,
        "rackCount": None,
        "tierRating": None,
        "facilityType": "Government / Enterprise",
        "aiReady": False,
        "openedDate": None,
        "expansionDate": None,
        "coolingType": None,
        "powerSource": None,
        "renewableClaim": None,
        "notable": "Operated by NITA-U for government workloads: hosting, DR and related services for ministries, agencies and local governments. A June 2025 NITA-U market study set the foundation for a third national data centre, confirming at least two sites already in service. Commercial colocation is not the facility's primary role.",
        "lastVerified": "2026-09",
        "dataSource": "NITA-U releases (19 Jun 2025 market study); The Independent Uganda (23 Feb 2026)",
        "dataConfidence": "Medium",
        "sources": [
            {"label": "NITA-U, Data Center Market Study Report launch (19 Jun 2025)", "url": "https://www.nita.go.ug", "kind": "gov"},
            {"label": "The Independent Uganda, NITA-U national data centre services coverage (23 Feb 2026)", "url": "https://www.independent.co.ug", "kind": "press"},
        ],
        "carrierNeutral": False,
        "certNote": None,
        "divergenceNote": "Capacity, tier level and opening year not published in the sources checked; included for completeness of the national picture, not as commercial supply. Treat all quantitative fields as unknown.",
        "operatorId": "nita-u",
        "connectivityFacility": [],
        "certifications": [],
    },
    {
        "id": "33",
        "name": "Raxio Dar es Salaam TZ1",
        "slug": "raxio-dar-es-salaam-tz1",
        "description": "Tanzania's first carrier-neutral Tier III colocation facility, under construction on Old Bagamoyo Road, Dar es Salaam.",
        "status": "Under Construction",
        "address": "Old Bagamoyo Road, Dar es Salaam",
        "city": "Dar es Salaam",
        "region": "Dar es Salaam",
        "country": "Tanzania",
        "itLoadMw": None,
        "totalCapacityMw": None,
        "rackCount": None,
        "tierRating": "III",
        "facilityType": "Colocation",
        "aiReady": False,
        "openedDate": None,
        "expansionDate": "2026",
        "coolingType": None,
        "powerSource": None,
        "renewableClaim": None,
        "notable": "Announced 23 March 2022 as a 'metro-edge', multi-megawatt colocation investment, with Master Power Technologies named for construction (Aug 2021). Commissioning was first flagged for 2024; as of July 2026 reporting the operator still 'expects to open' Tanzania's first carrier-neutral Tier III facility this year. IFC disclosures list Raxio's Tanzania build among its frontier-market data centre investments.",
        "lastVerified": "2026-09",
        "dataSource": "Raxio Group (23 Mar 2022); DataCenterDynamics (23 Mar 2022); Energy News Network (13 Jul 2026); IFC disclosure register",
        "dataConfidence": "Medium",
        "sources": [
            {"label": "Raxio Group, pan-African expansion into Dar es Salaam (23 Mar 2022)", "url": "https://www.raxiogroup.com", "kind": "operator"},
            {"label": "DataCenterDynamics, Raxio invests in building Tanzania data center (23 Mar 2022)", "url": "https://www.datacenterdynamics.com", "kind": "press"},
            {"label": "Energy News Network, Africa's newest anchor load is digital (13 Jul 2026)", "url": "https://energy-news-network.com", "kind": "press"},
            {"label": "IFC disclosure register, Raxio DC project documents", "url": "https://disclosures.ifc.org", "kind": "gov"},
        ],
        "carrierNeutral": True,
        "certNote": "Tier III stated as design intent ('poised to be the country's first carrier-neutral Tier III facility'); no constructed-facility certification on record yet.",
        "divergenceNote": "Opening-date divergence: commissioning flagged for 2024 in early coverage vs July 2026 reporting that the facility is still expected to open 'this year'. Capacity figures were never published; treat the multi-megawatt framing as operator intent, not a tracked MW figure.",
        "operatorId": "raxio",
        "connectivityFacility": [],
        "certifications": [],
    },
    {
        "id": "34",
        "name": "Africa Data Centres Kigali KGL1",
        "slug": "africa-data-centres-kigali-kgl1",
        "description": "Africa Data Centres' first Rwanda facility, announced November 2022 with 2 MW of IT load, in Kigali.",
        "status": "Under Construction",
        "address": None,
        "city": "Kigali",
        "region": "Kigali Province",
        "country": "Rwanda",
        "itLoadMw": None,
        "totalCapacityMw": 2,
        "rackCount": None,
        "tierRating": None,
        "facilityType": "Colocation",
        "aiReady": False,
        "openedDate": None,
        "expansionDate": None,
        "coolingType": None,
        "powerSource": None,
        "renewableClaim": None,
        "notable": "Announced 28 November 2022 by Africa Data Centres (a Cassava Technologies business) as its first facility in Rwanda: 2 MW of IT load, groundbreaking targeted for Q1 2023. Third-party registers (baxtel, inflect) list the site as KGL1 with roughly 2.5 MW of total power. No ready-for-service announcement has been located as of 19 September 2026.",
        "lastVerified": "2026-09",
        "dataSource": "Africa Data Centres / Cassava Technologies announcement (28 Nov 2022); DataCenterDynamics (28 Nov 2022); baxtel.com and inflect.com registers",
        "dataConfidence": "Medium",
        "sources": [
            {"label": "Africa Data Centres, first data centre in Kigali announcement (28 Nov 2022)", "url": "https://www.africadatacentres.com", "kind": "operator"},
            {"label": "Cassava Technologies, Africa Data Centres to build its first data centre in Kigali", "url": "https://www.cassavatechnologies.com", "kind": "operator"},
            {"label": "DataCenterDynamics, Africa Data Centres to build first data center in Kigali (28 Nov 2022)", "url": "https://www.datacenterdynamics.com", "kind": "press"},
        ],
        "carrierNeutral": True,
        "certNote": None,
        "divergenceNote": "Status divergence: announced with Q1 2023 groundbreaking and a 2 MW IT-load design, but no opening has been announced in the 3+ years since, and no independent confirmation of construction progress has been located. Staged as Under Construction on the strength of the operator announcement alone; revisit on any RFS news.",
        "operatorId": "africa-dc",
        "connectivityFacility": [],
        "certifications": [],
    },
]


def main() -> int:
    with open(DATA, encoding="utf-8") as fh:
        data = json.load(fh)

    op_ids = {o["id"] for o in data["operators"]}
    slugs = {f["slug"] for f in data["facilities"]}
    ids = {f["id"] for f in data["facilities"]}

    added_ops, added_facs = 0, 0
    if NEW_OPERATOR["id"] not in op_ids:
        data["operators"].append(NEW_OPERATOR)
        added_ops = 1

    for fac in NEW_FACILITIES:
        if fac["slug"] in slugs:
            print(f"skip (already present): {fac['slug']}")
            continue
        if fac["operatorId"] not in op_ids | {NEW_OPERATOR["id"]}:
            print(f"ERROR: unknown operatorId {fac['operatorId']} for {fac['slug']}")
            return 1
        if fac["id"] in ids:
            print(f"ERROR: duplicate facility id {fac['id']}")
            return 1
        data["facilities"].append(fac)
        slugs.add(fac["slug"])
        ids.add(fac["id"])
        added_facs += 1

    data["meta"]["recordCounts"] = {
        "facilities": len(data["facilities"]),
        "operators": len(data["operators"]),
    }
    if "Tanzania" not in data["meta"].get("scope", ""):
        pass  # scope text already mentions regional records

    with open(DATA, "w", encoding="utf-8") as fh:
        json.dump(data, fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    print(f"appended {added_ops} operator(s), {added_facs} facility(ies); "
          f"totals: {data['meta']['recordCounts']['facilities']} facilities, "
          f"{data['meta']['recordCounts']['operators']} operators")
    return 0


if __name__ == "__main__":
    sys.exit(main())
