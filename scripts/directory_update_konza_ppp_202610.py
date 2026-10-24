#!/usr/bin/env python3
"""Add the Konza Cloud Expansion PPP project to the DC254 directory dataset.

News basis (23 Oct 2026, TechAfrica News + PPP Directorate): the National
Treasury's PPP Project Facilitation Fund signed a project-preparation funding
agreement with KoTDA for the "Konza Cloud Expansion and Smart City Facilities"
PPP. This script:

1. adds a new Early Stage facility record (id 35) with gov + press source refs
2. appends the new article slug to the operating Konza National Data Centre
3. bumps meta.recordCounts.facilities 31 -> 32

Evidence standard: official tender/feasibility documents (gov) plus press
coverage. No capacity figures exist publicly, so MW/rack fields stay null
(zero-vs-unknown discipline). Run scripts/validate_dataset.py afterwards.
"""
import json
import sys
from pathlib import Path

DATASET = Path("/home/z/my-project/Data-Centers-254/src/data/directory/current.json")
NEW_SLUG = "konza-cloud-expansion-ppp"
ARTICLE_SLUG = "konza-ppp-data-centre-funding"

NEW_RECORD = {
    "id": "35",
    "name": "Konza Cloud Expansion and Smart City Facilities (PPP)",
    "slug": NEW_SLUG,
    "description": "PPP-structured expansion of the Konza National Data Centre, moving through Kenya's PPP pipeline: preparation funding signed October 2026, feasibility study November 2025, transaction advisor tender in progress.",
    "status": "Early Stage",
    "address": "Konza Technopolis, Machakos County",
    "city": "Konza",
    "region": "Machakos County",
    "itLoadMw": None,
    "totalCapacityMw": None,
    "rackCount": None,
    "tierRating": None,
    "facilityType": "Government",
    "aiReady": False,
    "openedDate": None,
    "expansionDate": None,
    "coolingType": None,
    "powerSource": "Konza Technopolis dedicated substation (planned)",
    "renewableClaim": None,
    "notable": "Kenya's PPP Project Facilitation Fund (National Treasury) signed a project-preparation funding agreement with KoTDA, reported 23 October 2026: transaction advisory, feasibility assessments and an investment and implementation framework for expanding the national data centre. A feasibility study report (Nov 2025) and a transaction advisor tender (pre-bid meeting 17 Mar 2026) precede the agreement. Services scoped in the feasibility documentation: SaaS, PaaS, IaaS and colocation. No capacity figure, contract value or construction timeline is public yet.",
    "lastVerified": "2026-10",
    "dataSource": "National Treasury PPP Directorate; Konza Technopolis; TechAfrica News",
    "dataConfidence": "Medium",
    "articleSlugs": [
        ARTICLE_SLUG,
        "konza-technopolis-data-centres-kenya",
        "kenya-data-centre-compute-hub-plan-explained",
    ],
    "operatorId": "kotda",
    "connectivityFacility": [],
    "certifications": [],
    "sources": [
        {
            "label": "National Treasury PPP Directorate, Transaction Advisory Services for the Konza Cloud Expansion and Smart City Facilities (tender documents)",
            "url": "https://pppkenya.go.ke/wp-content/uploads/2020/07/Updated-ADDENDUM-III-TRANSACTION-ADVISORY-SERVICES-FOR-THE-KONZA-CLOUD-EXPANSION-AND-SAMRT-CITY-FACILITIES.pdf",
            "kind": "gov",
        },
        {
            "label": "Konza Technopolis, Data Centre Cloud and Smart City Facility feasibility study report executive summary (Nov 2025)",
            "url": "https://konza.go.ke/wp-content/uploads/2026/04/6.-Annex-I-to-Addendum-II-Feasibility-study-Report-Nov-2025-EXECUTIVE-SUMMARY-Rev.pdf",
            "kind": "gov",
        },
        {
            "label": "TechAfrica News, Konza Technopolis secures funding agreement for data centre and smart city project (23 Oct 2026)",
            "url": "https://techafricanews.com/2026/10/23/kenyas-konza-technopolis-secures-funding-agreement-for-data-centre-and-smart-city-project/",
            "kind": "press",
        },
    ],
    "certNote": None,
    "divergenceNote": "Stage reflects project preparation only: no operator, no published capacity and no financial close exist yet. Stage would move to Committed on PPP contract signature and financing, to Under Construction on groundbreaking.",
}


def main() -> int:
    data = json.loads(DATASET.read_text(encoding="utf-8"))
    facilities = data["facilities"]

    slugs = [f["slug"] for f in facilities]
    if NEW_SLUG in slugs:
        print(f"already present: {NEW_SLUG} (idempotent exit)")
        return 0
    ids = [f["id"] for f in facilities]
    if NEW_RECORD["id"] in ids:
        print(f"ERROR: id {NEW_RECORD['id']} already used")
        return 1

    facilities.append(NEW_RECORD)

    # cross-link: operating facility gains the new article
    konza_dc = next(f for f in facilities if f["slug"] == "konza-national-dc")
    arts = konza_dc.setdefault("articleSlugs", [])
    if ARTICLE_SLUG not in arts:
        arts.append(ARTICLE_SLUG)

    # record counts
    counts = data.setdefault("meta", {}).setdefault("recordCounts", {})
    counts["facilities"] = len(facilities)
    counts["operators"] = len(data["operators"])

    DATASET.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    print(f"added {NEW_SLUG} (id {NEW_RECORD['id']}); facilities now {len(facilities)}")
    print(f"cross-linked article on konza-national-dc: {ARTICLE_SLUG}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
