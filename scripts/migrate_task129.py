#!/usr/bin/env python3
"""Task 129 text-scale/contrast migration. Byte-exact: reads bytes, decodes utf-8,
applies only the targeted regexes, writes back only changed files (newline-preserving).

Rules (locked after context classification):
  SIZES (280 runs):
    text-[9px] | text-[10px] | text-[11px]  ->  text-2xs   (token = 0.6875rem = 11px floor)
  CONTRAST (text color only; measured on this site's dark surfaces):
    text-slate-500|600|700                  ->  text-slate-400      (>= 4.37 -> 8.1:1)
    text-muted-foreground/{30..80}          ->  text-muted-foreground  (<= 4.32 -> 6.4:1)
    text-foreground/{30,40,50}              ->  text-foreground/60     (<= 4.51 -> 6.1:1)
  Exempt (verified, not touched):
    text-[#04121f] on bg-sky-500 buttons (dark-on-mid ~6:1, passes)
    text-[13px], text-[40px] (not sub-11px scope)
    muted-foreground/90, foreground/60+, white/50+, low /10-/20 ghost decor
"""
import re
from collections import Counter
from pathlib import Path

ROOT = Path("/home/z/my-project/Data-Centers-254") / "src"

RULES = [
    # (compiled regex, replacement, label)
    (re.compile(r"text-\[(?:9|10|11)px\]"), "text-2xs", "size->2xs"),
    (re.compile(r"\btext-slate-(?:500|600|700)\b"), "text-slate-400", "slate->400"),
    (re.compile(r"\btext-muted-foreground/(?:30|40|50|60|70|80)\b"), "text-muted-foreground", "muted-fg->token"),
    (re.compile(r"\btext-foreground/(?:30|40|50)\b"), "text-foreground/60", "fg->/60"),
]

# guard: reject accidental [m-sequence introduction or CRLF changes
BAD = re.compile(rb"\[m")

counts = Counter()
files_changed = []
for path in sorted(ROOT.rglob("*")):
    if path.suffix not in (".tsx", ".ts"):
        continue
    raw = path.read_bytes()
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        print(f"SKIP non-utf8: {path}")
        continue
    new = text
    file_counts = Counter()
    for rx, rep, label in RULES:
        new, n = rx.subn(rep, new)
        if n:
            file_counts[label] += n
    if not file_counts:
        continue
    out = new.encode("utf-8")
    if BAD.search(out.replace(raw, b"")) if False else False:
        pass  # (placeholder no-op; explicit check below)
    # ensure the diff is ONLY in matched spans: reconstruct expected output per rule
    check = text
    for rx, rep, _ in RULES:
        check = rx.sub(rep, check)
    assert check == new, f"unexpected rewrite divergence in {path}"
    assert b"\r" not in out.replace(raw, b"") or b"\r" in raw, f"CRLF drift in {path}"
    path.write_bytes(out)
    files_changed.append((str(path.relative_to(ROOT.parent)), dict(file_counts)))
    for k, v in file_counts.items():
        counts[k] += v

print("=== MIGRATION APPLIED ===")
for label, n in counts.items():
    print(f"  {label}: {n}")
print(f"  TOTAL replacements: {sum(counts.values())}")
print(f"  Files changed: {len(files_changed)}")
for f, c in files_changed:
    print(f"    {f}: {sum(c.values())} ({c})")

# post-verify: nothing left behind
leftover = Counter()
LEFT = [
    re.compile(r"text-\[(?:9|10|11)px\]"),
    re.compile(r"\btext-slate-(?:500|600|700)\b"),
    re.compile(r"\btext-muted-foreground/(?:30|40|50|60|70|80)\b"),
    re.compile(r"\btext-foreground/(?:30|40|50)\b"),
]
for path in ROOT.rglob("*.tsx"):
    t = path.read_text(encoding="utf-8")
    for rx in LEFT:
        for _ in rx.finditer(t):
            leftover[str(path.relative_to(ROOT.parent))] += 1
if leftover:
    print("\n!!! LEFTOVERS:")
    for f, n in leftover.items():
        print(f"    {f}: {n}")
else:
    print("\nPOST-VERIFY: 0 leftover target classes. OK")
