#!/usr/bin/env python3
"""Evidence Engine v0.2 - validator.

Enforces the written rules in src/lib/evidence/config.ts:
  - schema integrity (schema version, claim types, tiers, excerpts, no em dash)
  - every claim's sources resolve; every source URL/excerpt present
  - every facility slug exists in current.json
  - state re-derivation matches the stored AI-proposed state
  - ledger entries correspond 1:1 with claims
  - human gate: no claim is publicly approved without reviewedBy/reviewedAt

Exit code 1 on any error. Also prints the editorial review worklist.
"""
import json
import os
import sys
from collections import Counter

REPO = "/home/z/my-project/dc254"
CLAIMS_PATH = os.path.join(REPO, "src/data/directory/claims-2026-Q3.json")
LEDGER_PATH = os.path.join(REPO, "src/data/directory/evidence-ledger.json")
CURRENT_PATH = os.path.join(REPO, "src/data/directory/current.json")

CLAIM_TYPES = {
    "identity", "operator", "facility_type", "location", "status",
    "capacity", "connectivity", "power", "sustainability",
}
CORE = {"identity", "operator", "facility_type", "location"}
TIER_TRACE = {1: 0.9, 2: 0.75, 3: 0.6, 4: 0.15}
STATES = {"verified", "review", "unsupported", "unverified"}


def derive_state(sources, investigated=True):
    if not sources:
        return "unsupported" if investigated else "unverified"
    tiers = [s["tier"] for s in sources]
    pubs = [s["publisher"] for s in sources]
    has_anchor = any(t <= 2 for t in tiers)
    distinct_corr = any(
        tiers[i] <= 3 and pubs[i] != pubs[j]
        for i in range(len(tiers)) for j in range(len(tiers)) if i != j
    )
    if has_anchor and distinct_corr:
        return "verified"
    if any(t <= 3 for t in tiers):
        return "review"
    return "unsupported" if investigated else "unverified"


def facility_state(claims):
    core = [c for c in claims if c["type"] in CORE]
    if not core:
        return "unverified"
    if any(c["state"] == "unsupported" for c in core):
        return "unsupported"
    if all(c["state"] == "verified" for c in core):
        return "verified"
    return "review"


def main():
    errors = []
    doc = json.load(open(CLAIMS_PATH, encoding="utf-8"))
    ledger = json.load(open(LEDGER_PATH, encoding="utf-8"))
    current = json.load(open(CURRENT_PATH, encoding="utf-8"))
    known_slugs = {f["slug"] for f in current["facilities"]}
    names = {f["slug"]: f["name"] for f in current["facilities"]}

    if doc.get("schemaVersion") != "0.2":
        errors.append(f"schemaVersion {doc.get('schemaVersion')} != 0.2")

    sources = doc["sources"]
    for sid, s in sources.items():
        if s["tier"] not in TIER_TRACE:
            errors.append(f"source {sid}: bad tier {s['tier']}")
        if s["tier"] == 4:
            errors.append(f"source {sid}: tier-4 sources must not enter the claims DB")
        if not s.get("url", "").startswith("http"):
            errors.append(f"source {sid}: bad url")
        if not s.get("excerpt", "").strip():
            errors.append(f"source {sid}: empty excerpt")
        if "\u2014" in s.get("excerpt", "") or "\u2013" in s.get("excerpt", ""):
            errors.append(f"source {sid}: dash character in excerpt (house rule)")
        if not s.get("retrievedDate"):
            errors.append(f"source {sid}: missing retrievedDate")

    claim_ids = []
    state_changes = Counter()
    facility_states = {}
    for slug, fac in doc["facilities"].items():
        if slug not in known_slugs:
            errors.append(f"facility slug unknown in current.json: {slug}")
            continue
        for c in fac["claims"]:
            cid = c["id"]
            claim_ids.append(cid)
            if c["type"] not in CLAIM_TYPES:
                errors.append(f"{cid}: bad claim type {c['type']}")
            if c["state"] not in STATES:
                errors.append(f"{cid}: bad state {c['state']}")
            for sidx in c["sourceIds"]:
                if sidx not in sources:
                    errors.append(f"{cid}: unknown source {sidx}")
            resolved = [sources[s] for s in c["sourceIds"] if s in sources]
            expected = derive_state(resolved)
            if expected != c["state"]:
                errors.append(f"{cid}: state {c['state']} but rule derives {expected}")
            if c["humanReview"] not in ("pending", "approved", "rejected"):
                errors.append(f"{cid}: bad humanReview {c['humanReview']}")
            if c["humanReview"] == "approved" and not (c.get("reviewedBy") and c.get("reviewedAt")):
                errors.append(f"{cid}: approved without reviewer/reviewedAt (human gate)")
            state_changes[c["state"]] += 1
        facility_states[slug] = facility_state(fac["claims"])

    if len(claim_ids) != len(set(claim_ids)):
        dupes = [c for c, n in Counter(claim_ids).items() if n > 1]
        errors.append(f"duplicate claim ids: {dupes}")

    ledger_claims = {e["claimId"] for e in ledger["entries"]}
    if ledger_claims != set(claim_ids):
        missing = set(claim_ids) - ledger_claims
        extra = ledger_claims - set(claim_ids)
        if missing:
            errors.append(f"ledger missing entries for: {sorted(missing)}")
        if extra:
            errors.append(f"ledger has stale entries: {sorted(extra)}")
    for e in ledger["entries"]:
        if e.get("facilitySlug") not in names:
            errors.append(f"ledger entry {e.get('claimId')}: unknown facility slug")

    if errors:
        print(f"VALIDATION FAILED ({len(errors)} errors):")
        for e in errors:
            print("  -", e)
        return 1

    n_claims = len(claim_ids)
    print(f"claims-2026-Q3.json OK: {n_claims} claims, {len(sources)} sources, "
          f"{len(doc['facilities'])} pilot facilities")
    print("proposed states:", dict(state_changes))
    print("facility-level proposed states:")
    for slug, st in facility_states.items():
        print(f"  {st:12} {names[slug]}")

    print("\n=== EDITORIAL REVIEW WORKLIST (human gate) ===")
    print("All 62 claims await your approve/reject. Highest-attention claims:")
    for slug, fac in doc["facilities"].items():
        flagged = [c for c in fac["claims"] if c["state"] == "unsupported" or c.get("note")]
        if not flagged:
            continue
        for c in flagged:
            tag = "UNSUPPORTED" if c["state"] == "unsupported" else "NOTE"
            print(f"  [{tag}] {names[slug]} :: {c['statement']}")
            if c.get("note"):
                print(f"            {c['note']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
