#!/usr/bin/env python3
"""Task 129 survey: count + categorize arbitrary text-size runs and contrast-risky classes.

Byte-safe: reads files directly, no shell mangling. Outputs a JSON + human summary.
"""
import re
import json
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path("/home/z/my-project/Data-Centers-254")
SRC = ROOT / "src"

# Arbitrary font-size runs: text-[9px], text-[10.5px], text-[11px] etc.
SIZE_RE = re.compile(r"text-\[(\d+(?:\.\d+)?)px\]")
# Other arbitrary size-ish runs worth knowing about (rem-based, leading)
REM_RE = re.compile(r"text-\[(\d+(?:\.\d+)?)rem\]")

# Contrast-risky utilities (opacity-fraction text colors + arbitrary hex text colors)
OPACITY_RE = re.compile(r"(text-(?:foreground|background|muted-foreground|primary|teal|accent|white|black|destructive|ring|card|popover|border|input)(?:-[a-z]+)?/\d+)")
HEX_RE = re.compile(r"text-\[#[0-9a-fA-F]{3,8}\]")

size_counter = Counter()
size_files = defaultdict(list)  # size -> [(file, count)]
rem_counter = Counter()
opacity_counter = Counter()
opacity_files = defaultdict(list)
hex_counter = Counter()
total_runs = 0
per_file_total = Counter()

for path in sorted(SRC.rglob("*.tsx")):
    text = path.read_text(encoding="utf-8")
    rel = str(path.relative_to(ROOT))
    counts = Counter(m.group(1) for m in SIZE_RE.finditer(text))
    if counts:
        n = sum(counts.values())
        total_runs += n
        per_file_total[rel] += n
        for size, c in counts.items():
            size_counter[size] += c
            size_files[size].append((rel, c))
    for m in REM_RE.finditer(text):
        rem_counter[m.group(1)] += 1
    ops = Counter(m.group(1) for m in OPACITY_RE.finditer(text))
    if ops:
        n = sum(ops.values())
        per_file_total[rel] += n
        for cls, c in ops.items():
            opacity_counter[cls] += c
            opacity_files[cls].append((rel, c))
    for m in HEX_RE.finditer(text):
        hex_counter[m.group(0)] += 1
        per_file_total[rel] += 1

print("=== ARBITRARY px FONT-SIZE RUNS ===")
print(f"TOTAL px runs: {total_runs}")
for size in sorted(size_counter, key=lambda s: float(s)):
    print(f"  text-[{size}px]: {size_counter[size]}  across {len(size_files[size])} files")

print("\n=== rem-based runs ===")
for r, c in sorted(rem_counter.items()):
    print(f"  text-[{r}rem]: {c}")

print("\n=== OPACITY-FRACTION TEXT CLASSES (contrast risk) ===")
for cls, c in sorted(opacity_counter.items(), key=lambda kv: -kv[1]):
    print(f"  {cls}: {c} across {len(opacity_files[cls])} files")

print("\n=== ARBITRARY HEX TEXT COLORS ===")
for cls, c in sorted(hex_counter.items(), key=lambda kv: -kv[1]):
    print(f"  {cls}: {c}")

print("\n=== TOP 25 FILES BY ARBITRARY-RUN COUNT ===")
for f, c in sorted(per_file_total.items(), key=lambda kv: -kv[1])[:25]:
    print(f"  {c:4d}  {f}")

# dump JSON for the migration script
out = {
    "total_px_runs": total_runs,
    "by_size": {s: size_counter[s] for s in sorted(size_counter, key=lambda x: float(x))},
    "files": {f: c for f, c in sorted(per_file_total.items(), key=lambda kv: -kv[1])},
}
(ROOT / "research").mkdir(exist_ok=True)
(ROOT / "research" / "task129_text_scale_survey.json").write_text(json.dumps(out, indent=2))
print("\nJSON -> research/task129_text_scale_survey.json")
