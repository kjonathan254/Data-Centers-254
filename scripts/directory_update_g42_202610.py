#!/usr/bin/env python3
"""
Task 75: apply the editor-authorized Task 74 proposal - enrich directory
record id 7 (Microsoft-G42 AI Data Centre) divergenceNote with the
capacity-payment negotiation mechanism + "by May 2026" dating.

Editor authorization (2026-10-03, chat): "Update the directory" - standing
rule 8 (task-specific chat authorization, r11/r13/r17 precedent). The
authorization text is recorded in the commit message.

Evidence: research/captures/2026-10-03-wef-africa-ai-infrastructure-who-pays.md
and research/captures/2026-10-03-elephant-grid-inside-the-grid.md (both T2,
both echo ONE Reuters-citing-Bloomberg chain - common-upstream caveat is
carried inside the note wording). Capture file headers stay capture-pending
per repo precedent (status flip lives in the dataset, and the directory has
no captureStatus field; the note text itself carries the attribution).

Scope guard: ONLY record id '7' fields {divergenceNote, lastVerified,
dataSource} change; everything else must be byte-identical after re-dump.

Run: python3 scripts/directory_update_g42_202610.py
"""
import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CURRENT = os.path.join(REPO, "src", "data", "directory", "current.json")

OLD_NOTE = (
    "No site has been confirmed (Nairobi vs Olkaria), and reporting indicates "
    "the project stalled on grid power constraints, Kenya Power cannot "
    "currently deliver the required 100+ MW at a single site. Treat the "
    "100 MW figure as an announcement, not a pipeline."
)

NEW_NOTE = (
    "No site has been confirmed (Nairobi vs Olkaria), and reporting indicates "
    "the project stalled on grid power constraints, Kenya Power cannot "
    "currently deliver the required 100+ MW at a single site. By May 2026, "
    "negotiations had also stalled over requests for guaranteed annual "
    "capacity payments, with the project's scale and power requirements "
    "still under discussion; Kenyan officials said talks were continuing. "
    "Attribution: Reuters via Bloomberg, as echoed by WEF (2026-10) and "
    "The Elephant (2026-10-02); both articles draw on the same reporting "
    "chain, so this is corroborated reportage, not two independent "
    "confirmations. Treat the 100 MW figure as an announcement, not a "
    "pipeline."
)

NEW_LAST_VERIFIED = "2026-10"

OLD_DATA_SOURCE = "Semafor, Tom's Hardware, Business Daily"
NEW_DATA_SOURCE = (
    "Semafor, Tom's Hardware, Business Daily; WEF analysis and The Elephant "
    "(Oct 2026), echoing Reuters via Bloomberg"
)


def main() -> int:
    with open(CURRENT, encoding="utf-8") as fh:
        raw_before = fh.read()
    data = json.loads(raw_before)

    matches = [f for f in data["facilities"] if f["id"] == "7"]
    if len(matches) != 1:
        print(f"ERROR: expected exactly one facility with id '7', found {len(matches)}")
        return 1
    rec = matches[0]
    if rec["name"] != "Microsoft\u2013G42 AI Data Centre":
        print(f"ERROR: id 7 is not the Microsoft-G42 record (got: {rec['name']!r})")
        return 1
    if rec["divergenceNote"] != OLD_NOTE:
        print("ERROR: divergenceNote does not match the expected pre-edit text; aborting")
        print(f"  actual: {rec['divergenceNote']!r}")
        return 1
    if rec["dataSource"] != OLD_DATA_SOURCE:
        print(f"ERROR: dataSource does not match expected: {rec['dataSource']!r}")
        return 1

    rec["divergenceNote"] = NEW_NOTE
    rec["lastVerified"] = NEW_LAST_VERIFIED
    rec["dataSource"] = NEW_DATA_SOURCE

    # House byte-stable serialization (same pattern as policy dataset)
    out = json.dumps(data, indent=2, ensure_ascii=False) + "\n"

    # Scope guard: re-dump the original and diff structures - only the three
    # touched fields on id 7 may differ.
    original = json.loads(raw_before)
    orig7 = [f for f in original["facilities"] if f["id"] == "7"][0]
    changed = []
    for f_new, f_old in zip(data["facilities"], original["facilities"]):
        for key in f_new:
            if f_new[key] != f_old.get(key):
                changed.append((f_new["id"], key))
    expected = {("7", "divergenceNote"), ("7", "lastVerified"), ("7", "dataSource")}
    if set(changed) != expected or len(changed) != len(expected):
        print(f"ERROR: unexpected field changes: {changed}")
        return 1

    # lastVerified format gate (mirrors snapshot_directory.py)
    if not re.fullmatch(r"\d{4}-\d{2}", rec["lastVerified"]):
        print("ERROR: malformed lastVerified")
        return 1

    with open(CURRENT, "w", encoding="utf-8") as fh:
        fh.write(out)

    # Post-write verification
    with open(CURRENT, encoding="utf-8") as fh:
        check = json.load(fh)
    rec2 = [f for f in check["facilities"] if f["id"] == "7"][0]
    ok = (
        rec2["divergenceNote"] == NEW_NOTE
        and rec2["lastVerified"] == "2026-10"
        and rec2["dataSource"] == NEW_DATA_SOURCE
        and len(check["facilities"]) == 31
        and len(check["operators"]) == 18
    )
    print("POST-WRITE:", "OK" if ok else "MISMATCH")
    print("recordCounts:", check["meta"]["recordCounts"])
    print("diff scope:", changed)
    print("NEW NOTE:", rec2["divergenceNote"][:200], "...")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
