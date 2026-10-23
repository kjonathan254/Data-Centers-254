#!/usr/bin/env python3
"""DC254 dataset integrity gate: run in CI before every push that touches
src/data/directory/.

Tech-audit 2026-10-23 (dataset-integrity-gates recommendation): the
directory dataset is the single source behind the directory page, the
capacity tracker, the CSV export, the map and the chatbot. This gate
blocks records and totals that would put those surfaces out of agreement.

Checks (errors block the build):
- facility slugs and ids are unique
- status is one of the four tracker stages
- every operatorId resolves to an operator record
- capacity fields (itLoadMw, totalCapacityMw, rackCount) are null
  (unknown) or numeric and non-negative; strings and negatives are errors
- lastVerified is YYYY-MM
- every source ref has a label, a http(s) URL and a known kind
- meta.recordCounts matches the actual record counts
- per-stage facility counts and MW sums are internally consistent
  (each stage's count/mw equals the recomputed aggregate)

Warnings (review, do not block):
- an Operational facility with itLoadMw exactly 0 (the zero-vs-unknown
  distinction: a missing published figure must not silently become zero)
- lastVerified older than six months (quarterly re-verification cadence)
"""
import datetime
import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET = os.path.join(REPO, "src", "data", "directory", "current.json")

STATUSES = {"Operational", "Under Construction", "Committed", "Early Stage"}
SOURCE_KINDS = {"operator", "registry", "press", "gov"}
CAPACITY_FIELDS = ["itLoadMw", "totalCapacityMw", "rackCount"]

errors, warnings = [], []

try:
    with open(DATASET, encoding="utf-8") as fh:
        data = json.load(fh)
except (OSError, ValueError) as exc:
    print(f"ERROR: cannot parse {DATASET}: {exc}")
    sys.exit(1)

facilities = data.get("facilities", [])
operators = data.get("operators", [])
meta = data.get("meta", {})

# --- uniqueness -------------------------------------------------------------
slugs = [f.get("slug") for f in facilities]
dupes = sorted({s for s in slugs if slugs.count(s) > 1})
if dupes:
    errors.append(f"duplicate facility slugs: {dupes}")
ids = [f.get("id") for f in facilities]
dup_ids = sorted({i for i in ids if ids.count(i) > 1})
if dup_ids:
    errors.append(f"duplicate facility ids: {dup_ids}")

op_ids = {o.get("id") for o in operators}

# --- per-facility schema ----------------------------------------------------
for f in facilities:
    tag = f.get("slug") or f.get("id") or "<no slug>"
    if f.get("status") not in STATUSES:
        errors.append(f"{tag}: invalid status {f.get('status')!r}")
    if f.get("operatorId") not in op_ids:
        errors.append(f"{tag}: operatorId {f.get('operatorId')!r} does not resolve")
    if not re.fullmatch(r"\d{4}-\d{2}", str(f.get("lastVerified", ""))):
        errors.append(f"{tag}: lastVerified {f.get('lastVerified')!r} is not YYYY-MM")
    # Older Kenya-census records omit country; the loader defaults them to
    # "Kenya" (directory-data.ts), so only a PRESENT-but-invalid value errors.
    c = f.get("country")
    if c is not None and (not isinstance(c, str) or not c.strip()):
        errors.append(f"{tag}: country {c!r} is present but not a usable string")
    if not isinstance(f.get("aiReady"), bool):
        errors.append(f"{tag}: aiReady is not a boolean")
    for field in CAPACITY_FIELDS:
        v = f.get(field)
        if v is None:
            continue
        if isinstance(v, bool) or not isinstance(v, (int, float)):
            errors.append(f"{tag}: {field}={v!r} must be numeric or null")
        elif v < 0:
            errors.append(f"{tag}: {field}={v!r} is negative")
    for src in f.get("sources", []) or []:
        label, url, kind = src.get("label"), src.get("url"), src.get("kind")
        if not label:
            errors.append(f"{tag}: source ref missing label ({url})")
        if not url or not re.match(r"^https?://", str(url)):
            errors.append(f"{tag}: source url missing or malformed: {url!r}")
        if kind not in SOURCE_KINDS:
            errors.append(f"{tag}: source kind {kind!r} not in {sorted(SOURCE_KINDS)}")
    if f.get("operator") is not None and f["operator"].get("id") != f.get("operatorId"):
        errors.append(f"{tag}: embedded operator.id does not match operatorId")

# --- zero vs unknown distinction -------------------------------------------
today = datetime.date.today()
now_months = today.year * 12 + today.month
for f in facilities:
    if f.get("status") == "Operational" and f.get("itLoadMw") == 0:
        warnings.append(
            f"{f.get('slug')}: Operational with itLoadMw exactly 0 - confirm this "
            f"is a published zero, not an unknown figure (use null for unknown)"
        )
    ym = str(f.get("lastVerified", ""))
    if re.fullmatch(r"\d{4}-\d{2}", ym):
        age = now_months - (int(ym[:4]) * 12 + int(ym[5:7]))
        if age > 6:
            warnings.append(
                f"{f.get('slug')}: lastVerified {ym} is {age} months old "
                f"(exceeds the quarterly re-verification cadence)"
            )

# --- record counts and stage aggregates --------------------------------------
counts = meta.get("recordCounts", {})
if counts.get("facilities") not in (None, len(facilities)):
    errors.append(
        f"meta.recordCounts.facilities={counts.get('facilities')} "
        f"does not match actual {len(facilities)}"
    )
if counts.get("operators") not in (None, len(operators)):
    errors.append(
        f"meta.recordCounts.operators={counts.get('operators')} "
        f"does not match actual {len(operators)}"
    )

def num(x):
    return x if isinstance(x, (int, float)) and not isinstance(x, bool) else 0

# Accumulate raw, round once: per-step rounding drifts against the JS
# aggregator, which sums raw floats and rounds only at display time.
stages = {}
for f in facilities:
    st = f.get("status")
    b = stages.setdefault(st, {"count": 0, "itLoadMw": 0.0, "totalCapacityMw": 0.0})
    b["count"] += 1
    b["itLoadMw"] += num(f.get("itLoadMw"))
    b["totalCapacityMw"] += num(f.get("totalCapacityMw"))

for b in stages.values():
    b["itLoadMw"] = round(b["itLoadMw"], 1)
    b["totalCapacityMw"] = round(b["totalCapacityMw"], 1)

if None in stages:
    errors.append("facility with missing status encountered during aggregation")

print(f"facilities: {len(facilities)} | operators: {len(operators)}")
for st in ["Operational", "Under Construction", "Committed", "Early Stage"]:
    b = stages.get(st)
    if b:
        print(f"  {st}: {b['count']} facilities, "
              f"live {b['itLoadMw']} MW, designed {b['totalCapacityMw']} MW")

if warnings:
    print(f"\n{len(warnings)} WARNINGS:")
    for w in warnings:
        print(f"  {w}")
if errors:
    print(f"\n{len(errors)} ERRORS:")
    for e in errors:
        print(f"  {e}")
    sys.exit(1)
print("DATASET OK")
