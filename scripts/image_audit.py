#!/usr/bin/env python3
"""DC254 image audit: dimensions, usage counts, gaps. Outputs a needs-action list."""
import re, glob, os, json
from PIL import Image

ROOT = "/home/z/my-project/data-centers-audit/repo"
IMG_DIR = os.path.join(ROOT, "public", "images")

# 1. inventory + dimensions
imgs = {}
for f in sorted(os.listdir(IMG_DIR)):
    if not f.lower().endswith((".webp", ".png", ".jpg", ".jpeg", ".avif")):
        continue
    fp = os.path.join(IMG_DIR, f)
    try:
        with Image.open(fp) as im:
            w, h = im.size
        imgs[f] = {"w": w, "h": h, "bytes": os.path.getsize(fp)}
    except Exception as e:
        imgs[f] = {"w": 0, "h": 0, "bytes": 0, "err": str(e)}

# 2. references: content md + src code + other config surfaces
refs = {}
def scan(paths, glob_pat):
    for fp in glob.glob(paths, recursive=True):
        try:
            txt = open(fp, encoding="utf-8", errors="replace").read()
        except Exception:
            continue
        for m in re.findall(r"/images/([A-Za-z0-9_.-]+\.(?:webp|png|jpe?g|avif))", txt):
            refs.setdefault(m, set()).add(os.path.relpath(fp, ROOT))

scan(os.path.join(ROOT, "content", "**", "*.md"), None)
for pat in ("src/**/*.tsx", "src/**/*.ts", "*.ts"):
    scan(os.path.join(ROOT, pat), None)
scan(os.path.join(ROOT, "public", "llms.txt"), None)

# 3. article og_image coverage
missing_og = []
for fp in sorted(glob.glob(os.path.join(ROOT, "content", "articles", "*.md"))):
    head = open(fp, encoding="utf-8", errors="replace").read(2500)
    if not re.search(r'^og_image:\s*["\']?\S+["\']?\s*$', head, re.M):
        missing_og.append(os.path.basename(fp)[:-3])

# 4. classify
unused = sorted(f for f in imgs if f not in refs)
lowres = sorted(f for f, d in imgs.items() if d["w"] and d["w"] < 800)
thin_usage = sorted(f for f, s in refs.items() if f in imgs and len(s) == 1 and f in lowres)

print(f"images total: {len(imgs)}   referenced: {len(refs)}   never referenced: {len(unused)}")
print(f"articles missing og_image: {len(missing_og)}")
print()
print("== NEVER REFERENCED (deploy pool for new articles) ==")
for f in unused:
    d = imgs[f]
    print(f"  {f[:52]:52} {d['w']}x{d['h']}  {d['bytes']//1024}KB")
print()
print("== LOW-RES (<800px wide) ==")
for f in lowres:
    d = imgs[f]
    u = ",".join(sorted(refs.get(f, []))[:3]) or "UNUSED"
    print(f"  {f[:52]:52} {d['w']}x{d['h']}  used in: {u[:60]}")
print()
if missing_og:
    print("== ARTICLES MISSING OG IMAGE ==")
    for s in missing_og:
        print("  ", s)

json.dump({"imgs": imgs, "refs": {k: sorted(v) for k, v in refs.items()},
           "unused": unused, "lowres": lowres, "missing_og": missing_og},
          open("/home/z/my-project/data-centers-audit/research/image_audit_2026-09-16.json", "w"), indent=1)
