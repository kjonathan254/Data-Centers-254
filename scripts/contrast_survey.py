#!/usr/bin/env python3
"""Task 129: full contrast-risk survey — raw palette text classes + opacity fractions + hex.
Also computes WCAG ratios for every candidate fg/bg pair using oklch/hex -> sRGB math.
"""
import re
import json
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path("/home/z/my-project/Data-Centers-254")
SRC = ROOT / "src"

# ---------- color math (self-contained, no deps) ----------
def oklch_to_srgb(L, C, H):
    import math
    hr = math.radians(H)
    a = C * math.cos(hr)
    b = C * math.sin(hr)
    l_ = L + 0.3963377774 * a + 0.2158037573 * b
    m_ = L - 0.1055613458 * a - 0.0638541728 * b
    s_ = L - 0.0894841775 * a - 1.2914855480 * b
    l_, m_, s_ = l_**3, m_**3, s_**3
    r = +4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_
    g = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_
    bl = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_
    def gamma(u):
        u = max(0.0, min(1.0, u))
        return 12.92 * u if u <= 0.0031308 else 1.055 * (u ** (1 / 2.4)) - 0.055
    return gamma(r), gamma(g), gamma(bl)

def hex_to_srgb(hx):
    hx = hx.lstrip("#")
    if len(hx) == 3:
        hx = "".join(c * 2 for c in hx)
    return tuple(int(hx[i : i + 2], 16) / 255 for i in (0, 2, 4))

def lum(rgb):
    def f(c):
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (f(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def ratio(fg, bg):
    l1, l2 = sorted((lum(fg), lum(bg)), reverse=True)
    return (l1 + 0.05) / (l2 + 0.05)

def blend(fg_rgb, alpha, bg_rgb):
    return tuple(f * alpha + b * (1 - alpha) for f, b in zip(fg_rgb, bg_rgb))

# tokens from globals.css (single dark theme)
BG = oklch_to_srgb(0.08, 0.005, 260)      # --background
CARD = oklch_to_srgb(0.12, 0.008, 260)    # --card
SURFACE = oklch_to_srgb(0.14, 0.01, 260)  # --surface
SECONDARY = oklch_to_srgb(0.18, 0.012, 260)
ACCENT = oklch_to_srgb(0.22, 0.015, 260)
FG = oklch_to_srgb(0.93, 0.01, 260)
MUTED_FG = oklch_to_srgb(0.65, 0.02, 260)
PRIMARY = oklch_to_srgb(0.78, 0.14, 195)  # cyan
WHITE = (1, 1, 1)

NAMED = {
    "white": WHITE, "black": (0, 0, 0),
    "foreground": FG, "muted-foreground": MUTED_FG, "primary": PRIMARY,
}

def parse_oklch(s):
    m = re.match(r"oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)", s)
    return oklch_to_srgb(float(m.group(1)), float(m.group(2)), float(m.group(3)))

print("=== TOKEN BASELINE (AA small-text floor 4.5:1) ===")
for name, bg in [("background", BG), ("card", CARD), ("surface", SURFACE), ("secondary", SECONDARY), ("accent", ACCENT)]:
    for tn, tc in [("foreground", FG), ("muted-foreground", MUTED_FG), ("primary", PRIMARY)]:
        print(f"  {tn} on {name:11s}: {ratio(tc, bg):5.2f}:1")

print("\n=== OPACITY-FRACTION effective ratios (worst-case bg = card 0.12) ===")
for base_name, base in [("foreground", FG), ("muted-foreground", MUTED_FG), ("white", WHITE)]:
    for a in (0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8, 0.9):
        eff = blend(base, a, CARD)
        print(f"  {base_name}/{int(a*100)} on card: {ratio(eff, CARD):5.2f}:1   on background: {ratio(blend(base, a, BG), BG):5.2f}:1")

# tailwind slate/gray scale (v4 oklch) — approximate via hex equivalents
SLATE = {
    "slate-300": hex_to_srgb("cbd5e1"), "slate-400": hex_to_srgb("94a3b8"),
    "slate-500": hex_to_srgb("64748b"), "slate-600": hex_to_srgb("475569"),
    "gray-300": hex_to_srgb("d1d5db"), "gray-400": hex_to_srgb("9ca3af"),
    "gray-500": hex_to_srgb("6b7280"), "gray-600": hex_to_srgb("4b5563"),
    "zinc-300": hex_to_srgb("d4d4d8"), "zinc-400": hex_to_srgb("a1a1aa"),
    "zinc-500": hex_to_srgb("71717a"), "zinc-600": hex_to_srgb("52525b"),
}
print("\n=== RAW PALETTE TEXT ON DARK BACKGROUNDS (survey + ratio) ===")
PALETTE_RE = re.compile(r"\btext-(slate|gray|zinc|neutral|stone)-(\d{2,3})\b")
pal_counter = Counter()
pal_files = defaultdict(set)
for path in sorted(SRC.rglob("*.tsx")):
    text = path.read_text(encoding="utf-8")
    rel = str(path.relative_to(ROOT))
    for m in PALETTE_RE.finditer(text):
        cls = f"{m.group(1)}-{m.group(2)}"
        pal_counter[cls] += 1
        pal_files[cls].add(rel)
for cls, c in sorted(pal_counter.items(), key=lambda kv: -kv[1]):
    shade = cls.split("-")[1]
    rgb = SLATE.get(cls)
    r_bg = f"{ratio(rgb, BG):.2f}" if rgb else "?"
    r_card = f"{ratio(rgb, CARD):.2f}" if rgb else "?"
    print(f"  {cls:12s}: {c:3d} runs, {len(pal_files[cls]):2d} files | on bg {r_bg}:1, on card {r_card}:1")

# hex text colors — where?
print("\n=== HEX TEXT RUNS ===")
HEX_RE = re.compile(r"text-\[(#[0-9a-fA-F]{3,8})\]")
for path in sorted(SRC.rglob("*.tsx")):
    text = path.read_text(encoding="utf-8")
    for m in HEX_RE.finditer(text):
        hx = m.group(1)
        rel = str(path.relative_to(ROOT))
        rgb = hex_to_srgb(hx)
        print(f"  {hx} in {rel}: on bg {ratio(rgb, BG):.2f}:1 on card {ratio(rgb, CARD):.2f}:1")

# where do the sub-12px runs pair with palette/opacity colors? join analysis
print("\n=== SIZE + COLOR PAIRING (sub-12px runs by color class) ===")
SIZE_RE = re.compile(r"text-\[(?:9|10|11)px\][^\"']*?")
combined = Counter()
CLS_RE = re.compile(r"text-\[(?:9|10|11)px\][^\"]*")
for path in sorted(SRC.rglob("*.tsx")):
    text = path.read_text(encoding="utf-8")
    for m in CLS_RE.finditer(text):
        seg = m.group(0)
        pm = PALETTE_RE.search(seg)
        om = re.search(r"text-(?:muted-foreground|foreground|white)/(\d+)", seg)
        key = pm.group(0) if pm else (f"opacity /{om.group(1)}" if om else "token/other")
        combined[key] += 1
for k, c in sorted(combined.items(), key=lambda kv: -kv[1]):
    print(f"  {k}: {c}")
