#!/usr/bin/env python3
"""
Freeze the current directory dataset into a quarterly snapshot.

Snapshots are the audit's Phase 2 mechanism for a cuttable history: the
live file (current.json) keeps moving; each quarter gets an immutable
copy under snapshots/<quarter>.json that reports and dataset bundles
reference forever after.

Run: python3 scripts/snapshot_directory.py [YYYY-QN]   (default: 2026-Q3)
"""
import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CURRENT = os.path.join(REPO, "src", "data", "directory", "current.json")
SNAP_DIR = os.path.join(REPO, "src", "data", "directory", "snapshots")


def main() -> int:
    quarter = sys.argv[1] if len(sys.argv) > 1 else "2026-Q3"
    if not re.fullmatch(r"\d{4}-Q[1-4]", quarter):
        print(f"ERROR: quarter '{quarter}' must look like 2026-Q3")
        return 1

    with open(CURRENT, encoding="utf-8") as fh:
        data = json.load(fh)

    slugs = [f["slug"] for f in data["facilities"]]
    if len(slugs) != len(set(slugs)):
        dupes = {s for s in slugs if slugs.count(s) > 1}
        print(f"ERROR: duplicate facility slugs in current.json: {dupes}")
        return 1
    bad = [f["slug"] for f in data["facilities"] if not re.fullmatch(r"\d{4}-\d{2}", f["lastVerified"])]
    if bad:
        print(f"ERROR: records with malformed lastVerified (expect YYYY-MM): {bad}")
        return 1

    snapshot = {
        "meta": dict(data["meta"]),
        "snapshotOf": quarter,
        "takenAt": "2026-09-19",
        "recordCounts": {
            "facilities": len(data["facilities"]),
            "operators": len(data["operators"]),
        },
        "operators": data["operators"],
        "facilities": data["facilities"],
    }

    os.makedirs(SNAP_DIR, exist_ok=True)
    out = os.path.join(SNAP_DIR, f"{quarter}.json")
    with open(out, "w", encoding="utf-8") as fh:
        json.dump(snapshot, fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    print(f"wrote {out}: {snapshot['recordCounts']['facilities']} facilities, "
          f"{snapshot['recordCounts']['operators']} operators")
    return 0


if __name__ == "__main__":
    sys.exit(main())
