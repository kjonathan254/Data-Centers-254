#!/usr/bin/env python3
"""
Task 122: apply the editor-authorized ADC Nairobi 2 reclassification.

Editor authorization (2026-10-21, chat): "Just update the site with the new
update" - standing rule 8 (task-specific chat authorization, r11/r13/r17
precedent, G42 Task 75 precedent). The authorization text goes in the commit
message.

Change: directory record id '3' (africa-dc-nairobi-2) reclassified
Under Construction -> Committed. Evidence chain (researched 2026-10-21):
- Dec 1 2022 DCD announcement: expand Sameer by up to an additional 15 MW,
  phase 1 = 5 MW "due live 2024"; Cassava PR: "build will be completed in
  the first half of 2024".
- Jan 20 2023 groundbreaking at Sameer Business Park (KTN/Standard,
  Telecompaper, TechMoran).
- No go-live announcement ever followed. ADC's own website (c) 2026 lists
  only NBO1 under Nairobi ("available site capacity 7.5 MW"); the Baxtel
  register shows ADC Nairobi = 1 operational (7.5 MW), Construction 0,
  Planned 0 (both re-checked 21 Oct 2026).
- Company reaffirmation Aug 2026 via Capacity (13 Aug 2026): building a
  second Nairobi facility "with up to 20MW", land for a third facility,
  >$200m total Kenya investment - company statement, no timeline. ADC's
  2024 capex evidence sits in South Africa ($108.9m facility, CPT1
  doubling). Leadership churn: Adil El Youssefi CEO (Mar 2025), Dan Kwach
  exit (Nov 2025).

Repo rule: "a plan is labelled a plan until there is a signed contract,
financing close, commissioning certificate, or live service." Structures
going up are no longer evidenced, so Under Construction fails its own
definition ("Financed, build underway"); the Aug 2026 company reaffirmation
keeps the project above Early Stage ("Announced intent"). Committed
("Land or funding secured, pre-build") is the honest bucket.

Scope guard: ONLY record id '3' fields {status, description, notable,
divergenceNote, dataSource, lastVerified} change; dataConfidence stays
Medium; everything else must be byte-identical after re-dump. Snapshot,
2026-Q3 bundle and evidence files untouched per G42 Task 75 precedent
(quarterly release artifacts; change flows into the Q4 sync).

Run: python3 scripts/directory_update_adc2_202610.py
"""
import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CURRENT = os.path.join(REPO, "src", "data", "directory", "current.json")

OLD_STATUS = "Under Construction"
OLD_DESCRIPTION = (
    "Announced second Nairobi facility at the Sameer Business Park campus, "
    "groundbreaking January 2023, first phase from 5 MW scaling toward an "
    "additional 15 MW."
)
OLD_NOTABLE = (
    "Announced November 2021 (two further Nairobi facilities, the second up "
    "to 20 MW) with a $200m+ commitment; Sameer expansion broke ground "
    "January 2023."
)
OLD_DIVERGENCE = (
    "ADC's own website lists only NBO1 under Nairobi, this expansion does "
    "not yet appear as an operating facility, and no completion date has "
    "been published. Capacity shown is the announced plan, not a confirmed "
    "as-built figure."
)
OLD_DATA_SOURCE = "ADC press releases via DataCenterDynamics"

NEW_STATUS = "Committed"
NEW_DESCRIPTION = (
    "Second Nairobi facility at the Sameer Business Park campus, announced "
    "December 2022 and groundbreaking January 2023 for up to an additional "
    "15 MW. The original H1 2024 completion target passed with no go-live "
    "announced; reclassified from Under Construction to Committed in "
    "October 2026 pending visible build progress."
)
NEW_NOTABLE = (
    "Announced November 2021 (two further Nairobi facilities, the second up "
    "to 20 MW) with a $200m+ commitment; Sameer expansion broke ground "
    "January 2023. Company reaffirmation, August 2026: ADC says it is "
    "building a second Nairobi facility of up to 20 MW, has begun securing "
    "land for a third, and puts total Kenya investment above $200m (company "
    "statement via Capacity, 13 Aug 2026)."
)
NEW_DIVERGENCE = (
    "No completion has been announced and no go-live is evidenced: the "
    "original H1 2024 target passed, ADC's own website still lists only NBO1 "
    "(7.5 MW available site capacity) under Nairobi, and the Baxtel register "
    "shows no ADC construction or planned projects in Nairobi (both "
    "re-checked October 2026). The capacity figure is the announced plan - "
    "up to an additional 15 MW per Cassava (December 2022), while later "
    "company framing cites up to 20 MW for the second facility (Capacity, "
    "August 2026); both are ADC statements, not as-built facts. Reclassified "
    "Under Construction to Committed on 2026-10; a dated commissioning "
    "announcement or an operator site update would settle it."
)
NEW_DATA_SOURCE = (
    "ADC press releases via DataCenterDynamics; Capacity (13 Aug 2026) on "
    "the $200m Kenya programme; ADC website and Baxtel register re-checked "
    "Oct 2026"
)
NEW_LAST_VERIFIED = "2026-10"


def main() -> int:
    with open(CURRENT, encoding="utf-8") as fh:
        raw_before = fh.read()
    data = json.loads(raw_before)

    matches = [f for f in data["facilities"] if f["id"] == "3"]
    if len(matches) != 1:
        print(f"ERROR: expected exactly one facility with id '3', found {len(matches)}")
        return 1
    rec = matches[0]
    if rec["name"] != "Africa Data Centres Nairobi 2 (planned expansion)":
        print(f"ERROR: id 3 is not the ADC Nairobi 2 record (got: {rec['name']!r})")
        return 1
    pre = {
        "status": OLD_STATUS,
        "description": OLD_DESCRIPTION,
        "notable": OLD_NOTABLE,
        "divergenceNote": OLD_DIVERGENCE,
        "dataSource": OLD_DATA_SOURCE,
        "lastVerified": "2026-09",
    }
    for key, expected in pre.items():
        if rec[key] != expected:
            # Idempotency: if the record already carries the new state, run
            # post-write verification and exit OK instead of aborting.
            already = (
                rec["status"] == NEW_STATUS
                and rec["description"] == NEW_DESCRIPTION
                and rec["notable"] == NEW_NOTABLE
                and rec["divergenceNote"] == NEW_DIVERGENCE
                and rec["dataSource"] == NEW_DATA_SOURCE
                and rec["lastVerified"] == NEW_LAST_VERIFIED
            )
            if already and key == "status":
                print("ALREADY APPLIED - running post-write verification only")
                with open(CURRENT, encoding="utf-8") as fh:
                    check = json.load(fh)
                rec2 = [f for f in check["facilities"] if f["id"] == "3"][0]
                kenya = [f for f in check["facilities"]
                         if f.get("country", "Kenya") == "Kenya"]

                def bucket2(status):
                    rows = [f for f in kenya if f["status"] == status]
                    return len(rows), round(sum(f.get("totalCapacityMw") or 0 for f in rows), 1)

                ok2 = (
                    len(check["facilities"]) == 31
                    and len(check["operators"]) == 18
                    and bucket2("Under Construction") == (2, 62.0)
                    and bucket2("Committed") == (2, 68.0)
                    and bucket2("Operational") == (20, 42.9)
                    and bucket2("Early Stage") == (3, 100.0)
                )
                print("POST-WRITE:", "OK" if ok2 else "MISMATCH")
                print("diff scope: pre-applied state verified")
                return 0 if ok2 else 1
            print(f"ERROR: {key} does not match the expected pre-edit text; aborting")
            print(f"  actual: {rec[key]!r}")
            return 1

    rec["status"] = NEW_STATUS
    rec["description"] = NEW_DESCRIPTION
    rec["notable"] = NEW_NOTABLE
    rec["divergenceNote"] = NEW_DIVERGENCE
    rec["dataSource"] = NEW_DATA_SOURCE
    rec["lastVerified"] = NEW_LAST_VERIFIED

    # House byte-stable serialization (same pattern as G42 Task 75)
    out = json.dumps(data, indent=2, ensure_ascii=False) + "\n"

    # Scope guard: re-dump the original and diff structures - only the six
    # touched fields on id 3 may differ.
    original = json.loads(raw_before)
    changed = []
    for f_new, f_old in zip(data["facilities"], original["facilities"]):
        for key in f_new:
            if f_new[key] != f_old.get(key):
                changed.append((f_new["id"], key))
    expected = {
        ("3", "status"),
        ("3", "description"),
        ("3", "notable"),
        ("3", "divergenceNote"),
        ("3", "dataSource"),
        ("3", "lastVerified"),
    }
    if set(changed) != expected or len(changed) != len(expected):
        print(f"ERROR: unexpected field changes: {changed}")
        return 1

    # lastVerified format gate (mirrors snapshot_directory.py)
    if not re.fullmatch(r"\d{4}-\d{2}", rec["lastVerified"]):
        print("ERROR: malformed lastVerified")
        return 1

    with open(CURRENT, "w", encoding="utf-8") as fh:
        fh.write(out)

    # Post-write verification: record integrity + Kenya bucket arithmetic
    with open(CURRENT, encoding="utf-8") as fh:
        check = json.load(fh)
    rec2 = [f for f in check["facilities"] if f["id"] == "3"][0]
    # Mirror directory-data.ts facilityCountry(): older Kenya-census records
    # predate the country field and default to "Kenya".
    kenya = [f for f in check["facilities"] if f.get("country", "Kenya") == "Kenya"]

    def bucket(status):
        rows = [f for f in kenya if f["status"] == status]
        return len(rows), round(sum(f.get("totalCapacityMw") or 0 for f in rows), 1)

    uc_n, uc_mw = bucket("Under Construction")
    com_n, com_mw = bucket("Committed")
    op_n, op_mw = bucket("Operational")
    early_n, early_mw = bucket("Early Stage")

    ok = (
        rec2["status"] == "Committed"
        and rec2["lastVerified"] == "2026-10"
        and rec2["dataConfidence"] == "Medium"
        and len(check["facilities"]) == 31
        and len(check["operators"]) == 18
        and (uc_n, uc_mw) == (2, 62.0)
        and (com_n, com_mw) == (2, 68.0)
        and (op_n, op_mw) == (20, 42.9)
        and (early_n, early_mw) == (3, 100.0)
    )
    print("POST-WRITE:", "OK" if ok else "MISMATCH")
    print("recordCounts:", check["meta"]["recordCounts"])
    print(f"Kenya buckets: op {op_n}/{op_mw} MW, uc {uc_n}/{uc_mw} MW, "
          f"committed {com_n}/{com_mw} MW, early {early_n}/{early_mw} MW")
    print("diff scope:", sorted(changed))
    print("NEW STATUS:", rec2["status"])
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
