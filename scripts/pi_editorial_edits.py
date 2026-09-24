#!/usr/bin/env python3
r"""
Task 56 - Policy Intelligence editorial revision (editor review 2026-09-24).
Two replacements whose old_str contains non-ASCII chars (division sign,
em dash) - done in Python because tool-based edits write \uXXXX escapes
literally (house lesson from Task 53b).

R1: hero Info tooltip - retitle "Coverage =" to verification-rate wording.
R2: Method & governance - visually bold the "editorial approval is not
    factual certainty" distinction (editor: "I would bold that distinction").
Idempotent: exits 0 without changes if new strings already present.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

R1_OLD = 'title="Coverage = verified claims \u00f7 audited claims. Structured gaps are unresearched pillars \u2014 excluded from the denominator, never counted as findings."'
R1_NEW = 'title="Verification rate = verified claims / claims entered in the dataset. Structured gaps are unresearched pillars: excluded from the denominator, never counted as findings."'

R2_OLD = "Editorial approval is a\n                  publication decision \u2014 it is not a statement that every claim is fully verified."
R2_NEW = '<strong className="font-semibold text-slate-100">Editorial approval is a\n                  publication decision \u2014 it is not a statement that every claim is fully\n                  verified.</strong>'

JOBS = [
    (ROOT / "src/app/policy/intelligence/control-room.tsx", R1_OLD, R1_NEW),
    (ROOT / "src/app/policy/intelligence/page.tsx", R2_OLD, R2_NEW),
]

def main() -> int:
    ok = True
    for path, old, new in JOBS:
        text = path.read_text(encoding="utf-8")
        if new in text:
            print(f"SKIP  {path.name}: replacement already present")
            continue
        n = text.count(old)
        if n != 1:
            print(f"FAIL  {path.name}: expected exactly 1 occurrence of old string, found {n}")
            ok = False
            continue
        path.write_text(text.replace(old, new), encoding="utf-8")
        print(f"OK    {path.name}: applied replacement")
    return 0 if ok else 1

if __name__ == "__main__":
    raise SystemExit(main())
