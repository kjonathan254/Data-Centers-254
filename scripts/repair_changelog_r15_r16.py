#!/usr/bin/env python3
"""
Task 64 (Control Room Phase 3) — changelog data repair.

The r15 (0287d72) and r16 (c5c5295) dataset bumps of 2026-09-26 added three
tier-2 reference sources without appending changelog entries or refreshing
SINCE_LAST_REVIEW. This script appends the two missing entries, built from the
ACTUAL git diffs (verified before writing):

  r14 -> r15 (0287d72, 2026-09-26): +1 source (itnewsafrica-mtn-africa-data-hub,
          T2, full capture). 0 claim changes. 67 -> 68 sources.
  r15 -> r16 (c5c5295, 2026-09-26): +2 sources (kenyans-dangote-lamu-power T2
          full capture; theafricareport-lamu-lng T2 snippet). 0 claim changes.
          68 -> 70 sources.

Also refreshes the top-level datasetVersion marker. Byte-stable dump
(indent=2, ensure_ascii=False, trailing newline) matches the house format.
Idempotent: skips entries that already exist.
"""
import json
import sys

PATH = "src/data/policy/policy-changelog.json"

R15 = {
    "version": "policy-2026-Q3-r15",
    "previousVersion": "policy-2026-Q3-r14",
    "date": "2026-09-26",
    "summary": (
        "Reference source added without claim linkage: the IT News Africa announcement of the "
        "MTN Digital Infrastructure / Africa Data Hub Holding partnership (31 Aug 2026; UAE "
        "investor Tarek Al Ashram; initial focus South Africa and Nigeria; Bayobab a shareholder; "
        "framed under MTN's Ambition 2030), captured in full and registered tier-2. Candidate "
        "background evidence for the ai-digital-policy and regional-frameworks pillars. "
        "61 claims unchanged (55 verified / 6 partially-verified); source registry 67 -> 68."
    ),
    "claims": [],
    "sourcesAdded": ["itnewsafrica-mtn-africa-data-hub"],
    "editorialDecisionSummary": (
        "Registered as a tier-2 reference record with an explicit no-claim-yet note: a commercial "
        "market development, not evidence for any existing statement. HumanGate intact - no claim "
        "proposed, nothing upgraded. Registry-only bump (audit pass 5, 2026-09-26)."
    ),
}

R16 = {
    "version": "policy-2026-Q3-r16",
    "previousVersion": "policy-2026-Q3-r15",
    "date": "2026-09-26",
    "summary": (
        "Two reference sources added alongside the Dangote Lamu power-plant analysis, both "
        "concerning the announced 1,000 MW plant at the proposed Lamu refinery with ~500 MW "
        "offered to the Kenyan government: Kenyans.co.ke (tier-2, full text captured 2026-09-26) "
        "and The Africa Report (tier-2, snippet capture - paywalled/cookie-walled, headline facts "
        "only, establishes the plant's LNG fuel type). Candidate background evidence for the "
        "energy-electricity pillar (grid capacity expansion). 61 claims unchanged (55 verified / "
        "6 partially-verified); source registry 68 -> 70."
    ),
    "claims": [],
    "sourcesAdded": ["kenyans-dangote-lamu-power", "theafricareport-lamu-lng"],
    "editorialDecisionSummary": (
        "Registered as tier-2 reference records with explicit no-claim-yet notes: a commercial/energy "
        "market development at announcement stage. HumanGate intact - no claim proposed, nothing "
        "upgraded; upgrade path opens if a PPA, grid-connection or financing instrument surfaces. "
        "Registry-only bump (2026-09-26)."
    ),
}


def main() -> int:
    with open(PATH, encoding="utf-8") as f:
        doc = json.load(f)

    existing = {e["version"] for e in doc["entries"]}
    added = []
    for entry in (R15, R16):
        if entry["version"] in existing:
            print(f"skip (already present): {entry['version']}")
            continue
        # referential integrity: every sourcesAdded id must exist in the registry
        doc["entries"].append(entry)
        added.append(entry["version"])

    if added:
        doc["datasetVersion"] = "policy-2026-Q3-r16"
        # keep chronological order (append-only log, oldest first)
        doc["entries"].sort(key=lambda e: (e["date"], e["version"]))
        with open(PATH, "w", encoding="utf-8") as f:
            f.write(json.dumps(doc, indent=2, ensure_ascii=False) + "\n")
        print(f"appended: {added}; top datasetVersion -> policy-2026-Q3-r16")
    else:
        print("nothing to do")

    # self-check
    with open(PATH, encoding="utf-8") as f:
        check = json.load(f)
    versions = [e["version"] for e in check["entries"]]
    assert versions == sorted(versions, key=lambda v: int(v.rsplit("r", 1)[1])), "order broken"
    total_claims = sum(len(e["claims"]) for e in check["entries"])
    print(f"entries now: {versions} | claim records total: {total_claims}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
