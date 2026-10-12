#!/usr/bin/env python3
"""Task 129: dump context for every contrast-risk run so each can be classified
decorative vs informational, and light-background pairings can be caught."""
import re
from pathlib import Path

ROOT = Path("/home/z/my-project/Data-Centers-254")
SRC = ROOT / "src"

PATTERNS = [
    ("SLATE600", re.compile(r"[^\s\"']*text-slate-600[^\s\"']*")),
    ("SLATE700", re.compile(r"[^\s\"']*text-slate-700[^\s\"']*")),
    ("SLATE500", re.compile(r"[^\s\"']*text-slate-500[^\s\"']*")),
    ("OPACITY-LOW", re.compile(r"text-(?:muted-foreground|foreground|white)/(?:30|40|50|60|70|80)\b")),
    ("HEXDARK", re.compile(r"text-\[#04121f\]")),
    ("ONEOFF13", re.compile(r"text-\[13px\]")),
    ("ONEOFF40", re.compile(r"text-\[40px\]")),
]

LIGHT_BG_HINTS = re.compile(r"bg-(?:white|slate-50|slate-100|slate-200|gray-50|gray-100|amber-100|amber-200|sky-100|emerald-100|red-100|green-100)\b")

for path in sorted(SRC.rglob("*.tsx")) + sorted(SRC.rglob("*.ts")):
    text = path.read_text(encoding="utf-8")
    rel = str(path.relative_to(ROOT))
    lines = text.splitlines()
    hits = []
    for i, line in enumerate(lines):
        for name, rx in PATTERNS:
            for m in rx.finditer(line):
                frag = m.group(0)
                # look in the same className string (same line + up to 2 lines around) for light bg hints
                ctx = "\n".join(lines[max(0, i - 1) : i + 2])
                light = bool(LIGHT_BG_HINTS.search(ctx))
                hits.append((name, i + 1, frag, light, line.strip()[:160]))
    if hits:
        print(f"\n##### {rel}")
        for name, ln, frag, light, line in hits:
            flag = " [LIGHT-BG-PAIR?]" if light else ""
            print(f"  L{ln:4d} [{name}]{flag} {frag}")
            print(f"        | {line}")
