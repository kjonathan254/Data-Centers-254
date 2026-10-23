#!/usr/bin/env python3
"""Release check: does production actually serve the dataset in the repo?

Tech-audit 2026-10-23 ("verify the deployed data" recommendation): a merged
commit is not proof that the live directory, tracker and CSV reflect the
same data. This script compares the local dataset against the deployed
surfaces and exits non-zero on any disagreement.

Usage:
  python3 scripts/verify_production_data.py
  BASE_URL=https://data-centers-254.vercel.app python3 scripts/verify_production_data.py
  python3 scripts/verify_production_data.py https://staging-url.example
"""
import csv
import io
import json
import os
import sys
import urllib.request

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET = os.path.join(REPO, "src", "data", "directory", "current.json")
DEFAULT_BASE = "https://data-centers-254.vercel.app"

base = (sys.argv[1] if len(sys.argv) > 1 else os.environ.get("BASE_URL", DEFAULT_BASE)).rstrip("/")

with open(DATASET, encoding="utf-8") as fh:
    local = json.load(fh)
local_by_slug = {f["slug"]: f for f in local["facilities"]}

def fetch(path: str) -> bytes:
    req = urllib.request.Request(base + path, headers={"User-Agent": "DC254-release-check"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()

errors = []

# --- live API vs local dataset ----------------------------------------------
try:
    live = json.loads(fetch("/api/directory"))
except Exception as exc:
    print(f"FATAL: /api/directory unreachable at {base}: {exc}")
    sys.exit(1)

live_by_slug = {f["slug"]: f for f in live.get("facilities", [])}
print(f"local: {len(local_by_slug)} facilities | live API: {len(live_by_slug)}")

for slug in sorted(set(local_by_slug) | set(live_by_slug)):
    a, b = local_by_slug.get(slug), live_by_slug.get(slug)
    if not a:
        errors.append(f"{slug}: live-only facility not in dataset")
        continue
    if not b:
        errors.append(f"{slug}: dataset facility missing from live API")
        continue
    for field in ("status", "itLoadMw", "totalCapacityMw", "lastVerified"):
        if a.get(field) != b.get(field):
            errors.append(f"{slug}: {field} dataset={a.get(field)!r} live={b.get(field)!r}")

# --- live CSV vs local dataset ----------------------------------------------
try:
    rows = list(csv.DictReader(io.StringIO(fetch("/api/directory/csv").decode("utf-8-sig"))))
except Exception as exc:
    print(f"FATAL: /api/directory/csv unreachable or unparseable: {exc}")
    sys.exit(1)

csv_by_slug = {r["slug"]: r for r in rows}
print(f"live CSV: {len(rows)} rows")
if len(rows) != len(local_by_slug):
    errors.append(f"CSV row count {len(rows)} != dataset count {len(local_by_slug)}")
for slug, f in local_by_slug.items():
    r = csv_by_slug.get(slug)
    if not r:
        errors.append(f"{slug}: missing from live CSV")
    elif r.get("status") != f.get("status"):
        errors.append(f"{slug}: CSV status {r.get('status')!r} != dataset {f.get('status')!r}")

print()
if errors:
    print(f"{len(errors)} MISMATCHES between the repo dataset and {base}:")
    for e in errors:
        print(f"  {e}")
    sys.exit(1)
print(f"PRODUCTION IN SYNC with {base}")
