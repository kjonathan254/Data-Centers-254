#!/usr/bin/env python3
"""
Task 76 Hunt B completion: upgrade directory record id 7 (Microsoft-G42)
divergenceNote attribution from "echoes of echoes" to the on-disk Reuters
wire copy (11 May 2026, syndicated via MyJoyOnline, reporting Bloomberg News
10 May 2026) - capture research/captures/2026-10-03-myjoyonline-reuters-g42-payment-demands.md.

Editor authorization (2026-10-03, chat): "On the still open, proceed. You
have authority to proceed, all updates you will make should ensure the site
becomes better or improves it" - standing rule 8; "the direct Reuters/
Bloomberg capture" was an explicitly listed open item.

Scope guard: ONLY record id '7' fields {divergenceNote, dataSource} change.
lastVerified stays 2026-10 (no re-verification cycle needed - this IS the
verification event of this month).

Run: python3 scripts/directory_update_g42_reuters.py
"""
import json
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CURRENT = os.path.join(REPO, "src", "data", "directory", "current.json")

OLD_NOTE = (
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

NEW_NOTE = (
    "No site has been confirmed (Nairobi vs Olkaria), and reporting indicates "
    "the project stalled on grid power constraints, Kenya Power cannot "
    "currently deliver the required 100+ MW at a single site. By May 2026, "
    "negotiations had also stalled over requests for guaranteed annual "
    "capacity payments: Microsoft and G42 asked the Kenyan government to "
    "commit to paying for a certain amount of capacity annually, and talks "
    "broke down when it could not provide the guarantees at the level "
    "requested; a scale-back of the project was flagged as possible "
    "(Bloomberg News, 10 May 2026, as reported in a Reuters wire of 11 May "
    "2026, captured by DC254; Reuters could not verify the Bloomberg "
    "report). Kenya's position: the project 'is not failed or withdrawn' "
    "(Information Ministry principal secretary John Tanui) and scale and "
    "power requirements remain under discussion. Treat the 100 MW figure as "
    "an announcement, not a pipeline."
)

OLD_DATA_SOURCE = (
    "Semafor, Tom's Hardware, Business Daily; WEF analysis and The Elephant "
    "(Oct 2026), echoing Reuters via Bloomberg"
)
NEW_DATA_SOURCE = (
    "Semafor, Tom's Hardware, Business Daily; Bloomberg via Reuters wire "
    "(May 2026, wire copy captured by DC254); WEF and The Elephant (Oct 2026)"
)


def main() -> int:
    with open(CURRENT, encoding="utf-8") as fh:
        raw_before = fh.read()
    data = json.loads(raw_before)

    matches = [f for f in data["facilities"] if f["id"] == "7"]
    if len(matches) != 1:
        print(f"ERROR: expected exactly one facility id '7', found {len(matches)}")
        return 1
    rec = matches[0]
    if rec["name"] != "Microsoft\u2013G42 AI Data Centre":
        print(f"ERROR: id 7 is not Microsoft-G42: {rec['name']!r}")
        return 1
    if rec["divergenceNote"] != OLD_NOTE:
        print("ERROR: divergenceNote pre-edit text mismatch; aborting")
        print(f"  actual: {rec['divergenceNote']!r}")
        return 1
    if rec["dataSource"] != OLD_DATA_SOURCE:
        print(f"ERROR: dataSource pre-edit mismatch: {rec['dataSource']!r}")
        return 1

    rec["divergenceNote"] = NEW_NOTE
    rec["dataSource"] = NEW_DATA_SOURCE

    original = json.loads(raw_before)
    changed = []
    for f_new, f_old in zip(data["facilities"], original["facilities"]):
        for key in f_new:
            if f_new[key] != f_old.get(key):
                changed.append((f_new["id"], key))
    expected = {("7", "divergenceNote"), ("7", "dataSource")}
    if set(changed) != expected or len(changed) != len(expected):
        print(f"ERROR: unexpected field changes: {changed}")
        return 1

    out = json.dumps(data, indent=2, ensure_ascii=False) + "\n"
    with open(CURRENT, "w", encoding="utf-8") as fh:
        fh.write(out)

    with open(CURRENT, encoding="utf-8") as fh:
        check = json.load(fh)
    rec2 = [f for f in check["facilities"] if f["id"] == "7"][0]
    ok = (
        rec2["divergenceNote"] == NEW_NOTE
        and rec2["dataSource"] == NEW_DATA_SOURCE
        and rec2["lastVerified"] == "2026-10"
        and rec2["status"] == "Early Stage"
        and rec2["totalCapacityMw"] == 100
        and len(check["facilities"]) == 31
    )
    print("POST-WRITE:", "OK" if ok else "MISMATCH")
    print("diff scope:", changed)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
