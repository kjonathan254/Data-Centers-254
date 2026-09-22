#!/usr/bin/env python3
"""Apply the 2026-09-22 editorial review to the Evidence Engine v0.2 store.

  1. claims-2026-Q3.json : new sources, excerpt upgrades, claim statement/note
     updates, editorState overrides, human gate (all 62 claims approved by
     the editor), investigation notes, review metadata.
  2. evidence-ledger.json : append 62 review entries (append-only; the file's
     entry set stays 1:1 with claim ids as the validator requires).
  3. current.json : the directory record corrections the editor specified
     (NBO2 6.4 MW, MBA1 campus qualifier, iXAfrica campus design, UG1 specs,
     KGL1 hold wording).

Rule-derived claim states are NEVER overwritten: where the editor's
determination (checked directly against primary documents) diverges from the
derivation, the editorState field carries the decision and the rationale is
stored in the claim note and the ledger.
"""
import json
import sys

sys.path.insert(0, "/home/z/my-project/dc254/scripts")
from evidence_v02_review_data import (  # noqa: E402
    REVIEW_DATE, REVIEWER, REVIEWER_LEDGER,
    NEW_SOURCES, EXCERPT_UPGRADES, CLAIM_EDITS,
    INVESTIGATION_NOTES, RECORD_EDITS,
)

REPO = "/home/z/my-project/dc254"
CLAIMS_PATH = f"{REPO}/src/data/directory/claims-2026-Q3.json"
LEDGER_PATH = f"{REPO}/src/data/directory/evidence-ledger.json"
CURRENT_PATH = f"{REPO}/src/data/directory/current.json"

CORE = {"identity", "operator", "facility_type", "location"}


def rule_state(source_ids, sources):
    if not source_ids:
        return "unsupported"
    tiers = [sources[s]["tier"] for s in source_ids if s in sources]
    pubs = [sources[s]["publisher"] for s in source_ids if s in sources]
    has_anchor = any(t <= 2 for t in tiers)
    distinct = any(tiers[i] <= 3 and pubs[i] != pubs[j]
                   for i in range(len(tiers)) for j in range(len(tiers)) if i != j)
    if has_anchor and distinct:
        return "verified"
    if any(t <= 3 for t in tiers):
        return "review"
    return "unsupported"


def main():
    claims_doc = json.load(open(CLAIMS_PATH, encoding="utf-8"))
    ledger = json.load(open(LEDGER_PATH, encoding="utf-8"))
    current = json.load(open(CURRENT_PATH, encoding="utf-8"))
    sources = claims_doc["sources"]
    facilities = claims_doc["facilities"]
    fac_names = {f["slug"]: f["name"] for f in current["facilities"]}

    # ── 1. sources ────────────────────────────────────────────────────────
    for sid, s in NEW_SOURCES.items():
        if sid in sources:
            raise SystemExit(f"source id collision: {sid}")
        sources[sid] = s
    for sid, excerpt in EXCERPT_UPGRADES.items():
        assert sid in sources, sid
        sources[sid]["excerpt"] = excerpt
    print(f"sources: +{len(NEW_SOURCES)} new, {len(EXCERPT_UPGRADES)} excerpt upgrades")

    # ── 2. claims ─────────────────────────────────────────────────────────
    n_state_changes = 0
    n_editor_overrides = 0
    ledger_new = []
    for slug, fac in facilities.items():
        for c in fac["claims"]:
            cid = c["id"]
            edit = CLAIM_EDITS.get(cid)
            old_state = c["state"]
            old_statement = c["statement"]
            if edit is None:
                raise SystemExit(f"claim {cid} has no review decision")
            if "statement" in edit:
                c["statement"] = edit["statement"]
            if "note" in edit:
                c["note"] = edit["note"]
            for sid in edit.get("addSources", []):
                if sid not in c["sourceIds"]:
                    c["sourceIds"].append(sid)
            # rule-derived state re-computed (never hand-set)
            derived = rule_state(c["sourceIds"], sources)
            if derived != old_state:
                n_state_changes += 1
            c["state"] = derived
            # human gate
            c["humanReview"] = "approved"
            c["reviewedBy"] = REVIEWER
            c["reviewedAt"] = REVIEW_DATE
            # editor override where the determination diverges
            es = edit.get("editorState")
            if es is not None:
                c["editorState"] = es
                n_editor_overrides += 1
            elif "editorState" in c:
                del c["editorState"]
            # ledger entry (append-only review history)
            final_state = es or derived
            added_ids = edit.get("addSources", [])
            evidence_added = [sources[s]["label"] for s in added_ids]
            if not evidence_added:
                evidence_added = ["no new sources; editorial confirmation"]
            ledger_new.append({
                "date": REVIEW_DATE,
                "facility": fac_names[slug],
                "facilitySlug": slug,
                "claimId": cid,
                "claim": c["statement"],
                "previousStatus": old_state,
                "newStatus": final_state,
                "evidenceAdded": evidence_added,
                "reviewedBy": REVIEWER_LEDGER,
                "reason": (c["note"] or
                           "Editor claim-by-claim review against primary "
                           "sources; claim confirmed."),
            })
        if slug in INVESTIGATION_NOTES:
            fac["investigationNote"] = INVESTIGATION_NOTES[slug]
    print(f"claims: 62 reviewed, {n_state_changes} rule-state changes, "
          f"{n_editor_overrides} editorState overrides")

    # doc-level review metadata
    claims_doc["editorialReview"] = {
        "reviewedAt": REVIEW_DATE,
        "reviewedBy": REVIEWER,
        "scope": "all 11 pilot facilities, claim-by-claim",
        "method": ("human primary-source review (official operator pages, "
                   "tech-spec PDFs, Digital Realty launch release, ADC "
                   "Nairobi page, X posts, market briefs); primary sources "
                   "take precedence; the claim is the unit of truth"),
        "note": ("editorState is the editor's determination where it "
                 "diverges from the rule derivation; rule-derived states are "
                 "preserved for audit"),
    }

    # ── 3. ledger ─────────────────────────────────────────────────────────
    ledger["entries"].extend(ledger_new)
    ledger["lastReview"] = {
        "date": REVIEW_DATE,
        "reviewedBy": REVIEWER,
        "entriesAppended": len(ledger_new),
    }
    print(f"ledger: {len(ledger['entries'])} entries "
          f"(+{len(ledger_new)} review entries, append-only)")

    # ── 4. directory records ──────────────────────────────────────────────
    rec_by_slug = {f["slug"]: f for f in current["facilities"]}
    for slug, upd in RECORD_EDITS.items():
        rec = rec_by_slug[slug]
        for k, v in upd.items():
            if k == "notableAppend":
                rec["notable"] = (rec.get("notable") or "") + " " + v
            elif k == "notableReplace":
                old, new = upd["notableReplace"]["old"], upd["notableReplace"]["new"]
                if old not in (rec.get("notable") or ""):
                    raise SystemExit(f"notableReplace miss in {slug}: {old[:50]}")
                rec["notable"] = rec["notable"].replace(old, new)
            else:
                rec[k] = v
        print(f"record updated: {slug}")

    # ── save ──────────────────────────────────────────────────────────────
    json.dump(claims_doc, open(CLAIMS_PATH, "w", encoding="utf-8"),
              indent=2, ensure_ascii=False)
    open(CLAIMS_PATH, "a", encoding="utf-8").write("\n")
    json.dump(ledger, open(LEDGER_PATH, "w", encoding="utf-8"),
              indent=2, ensure_ascii=False)
    open(LEDGER_PATH, "a", encoding="utf-8").write("\n")
    json.dump(current, open(CURRENT_PATH, "w", encoding="utf-8"),
              indent=2, ensure_ascii=False)
    open(CURRENT_PATH, "a", encoding="utf-8").write("\n")

    # ── public-state preview (what the site will show) ────────────────────
    print("\n=== PUBLIC FACILITY STATES AFTER REVIEW ===")
    for slug, fac in facilities.items():
        core = [c for c in fac["claims"] if c["type"] in CORE]
        eff = [(c.get("editorState") or c["state"]) for c in core]
        if any(s == "unsupported" for s in eff):
            st = "unsupported"
        elif all(s == "verified" for s in eff):
            st = "verified"
        else:
            st = "review"
        print(f"  {st:12} {fac_names[slug]}")


if __name__ == "__main__":
    main()
