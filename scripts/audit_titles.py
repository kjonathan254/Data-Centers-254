#!/usr/bin/env python3
"""Title audit for DC254: renders every page's <title> the way Next.js
would (article = absolute frontmatter title, everything else = "%s | DC254")
and flags anything Google would truncate (>60 chars) or that buries its
primary keyword. Facility titles replay the guard already in
directory/[facility]/page.tsx."""
import os, re, json

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(REPO, "content", "articles")
SUF = " | DC254"

rows = []  # (kind, slug, rendered_title, len, flags)

# ── 1. Articles: rendered title is the bare frontmatter title (absolute) ──
for fn in sorted(os.listdir(ART)):
    if not fn.endswith(".md"):
        continue
    with open(os.path.join(ART, fn), encoding="utf-8") as f:
        head = f.read(4000)
    m = re.search(r'^title:\s*"([^"]+)"', head, re.M) or re.search(r"^title:\s*'([^']+)'", head, re.M) or re.search(r"^title:\s*(.+)$", head, re.M)
    if not m:
        rows.append(("article", fn[:-3], "?? NO TITLE ??", 0, "PARSE_FAIL"))
        continue
    t = m.group(1)
    flags = []
    if len(t) > 60:
        flags.append("LONG")
    # keyword buried: primary keyword should ideally appear early; crude check
    if len(t) > 60 and t.find(":") > 55:
        flags.append("COLON_BURIED")
    rows.append(("article", fn[:-3], t, len(t), ",".join(flags)))

# ── 2. Facilities: replay the existing guard ──
dd = os.path.join(REPO, "src", "lib", "directory-data.ts")
with open(dd, encoding="utf-8") as f:
    src = f.read()
# facility objects: name: ... slug: ... city: (city is a bare quoted string)
fac_re = re.compile(r'name:\s*"([^"]+)",\s*\n\s*slug:\s*"([^"]+)",[\s\S]{0,900}?city:\s*"([^"]+)",', re.M)
count = 0
for m in fac_re.finditer(src):
    name, slug, city = m.group(1), m.group(2), m.group(3)
    if slug not in src.split("const facilities")[1][:200000]:
        pass
    full = f"{name}, {city}"
    base = full if len(full) + len(SUF) <= 60 else name
    t = base + SUF
    flags = []
    if len(t) > 60:
        flags.append("LONG")
    rows.append(("facility", slug, t, len(t), ",".join(flags)))
    count += 1
print(f"# facilities parsed: {count}")

# ── 3. Static pages: pull title strings out of page.tsx / layout.tsx ──
import glob
APP = os.path.join(REPO, "src", "app")
seen_default = False
for fp in sorted(glob.glob(os.path.join(APP, "**", "*.tsx"), recursive=True)):
    rel = os.path.relpath(fp, APP)
    if not rel.endswith(("page.tsx", "layout.tsx")):
        continue
    with open(fp, encoding="utf-8") as f:
        code = f.read()
    # match: default: "...", absolute: "...", or title: "..."
    hits = re.findall(r'title:\s*(?:\{[^}]*?)?(?:default|absolute)?:\s*"([^"]+)"', code)
    hits += re.findall(r'title:\s*"([^"]+)"', code)
    hits = list(dict.fromkeys(h for h in hits if h.strip()))
    for h in hits:
        if "DC254" in h and rel == "layout.tsx" and not seen_default:
            # root default + template handled separately
            rows.append(("static", rel, h, len(h), ""))
            seen_default = True
            continue
        rendered = h if ("DC254" in h or rel == "layout.tsx") else h + SUF
        flags = []
        if len(rendered) > 60:
            flags.append("LONG")
        rows.append(("static", rel, rendered, len(rendered), ",".join(flags)))

# ── report ──
art_long = [r for r in rows if r[0] == "article" and r[4]]
fac_long = [r for r in rows if r[0] == "facility" and r[4]]
sta_long = [r for r in rows if r[0] == "static" and "LONG" in r[4]]
print(f"# articles total: {sum(1 for r in rows if r[0]=='article')}, long: {len(art_long)}")
print(f"# facilities total: {sum(1 for r in rows if r[0]=='facility')}, long: {len(fac_long)}")
print(f"# static hits total: {sum(1 for r in rows if r[0]=='static')}, long: {len(sta_long)}")
print()
print("== TOP 15 LONGEST ARTICLE TITLES ==")
for r in sorted([r for r in rows if r[0] == "article"], key=lambda x: -x[3])[:15]:
    print(f"{r[3]:3d}  {r[2]}")
if fac_long:
    print()
    print("== LONG FACILITY TITLES (rendered) ==")
    for r in fac_long:
        print(f"{r[3]:3d}  {r[2]}")
print()
print("== STATIC PAGE TITLES (rendered) ==")
for r in rows:
    if r[0] == "static":
        mark = " <<LONG" if "LONG" in r[4] else ""
        print(f"{r[3]:3d}  {r[1]}  ::  {r[2]}{mark}")
print()
print("== ARTICLE TITLES 50-60 (fine, context) ==")
n = sum(1 for r in rows if r[0] == "article" and 50 < r[3] <= 60)
print(f"# {n}")
print()
print("== ARTICLE TITLES < 30 (maybe too thin, context) ==")
for r in rows:
    if r[0] == "article" and r[3] < 30:
        print(f"{r[3]:3d}  {r[2]}")
