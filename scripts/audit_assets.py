#!/usr/bin/env python3
"""Audit: verify every image referenced in article frontmatter + key lib data exists in public/."""
import os, re, sys, json, glob

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(REPO, "content", "articles")
PUB = os.path.join(REPO, "public")
issues = []

def exists(p):
    return os.path.isfile(os.path.join(PUB, p.lstrip("/")))

for fp in sorted(glob.glob(os.path.join(ART, "*.md"))):
    slug = os.path.basename(fp)[:-3]
    txt = open(fp, encoding="utf-8").read()
    # frontmatter only
    fm = txt.split("---", 2)[1] if txt.startswith("---") else ""
    # og_image
    m = re.search(r"^og_image:\s*\"?([^\"\n]+)\"?", fm, re.M)
    if m and not exists(m.group(1).strip()):
        issues.append(f"{slug}: og_image missing {m.group(1).strip()}")
    # images block srcs
    for sm in re.finditer(r"src:\s*\"([^\"]+)\"", fm):
        u = sm.group(1)
        if u.startswith("/") and not exists(u):
            issues.append(f"{slug}: image missing {u}")

# lib data referenced images (imagery.ts, image-focus, portrait-images, directory)
for lib in ["src/lib/imagery.ts", "src/lib/image-focus.ts", "src/lib/portrait-images.ts",
            "src/lib/directory-data.ts", "src/lib/market-trackers.ts", "src/lib/map-data.ts"]:
    path = os.path.join(REPO, lib)
    if not os.path.isfile(path):
        continue
    txt = open(path, encoding="utf-8").read()
    for m in re.finditer(r"[\"'](/images/[^\"']+\.(?:webp|png|jpg|jpeg|svg))[\"']", txt):
        if not exists(m.group(1)):
            issues.append(f"{lib}: missing {m.group(1)}")

# directory data JSON image fields
for jf in glob.glob(os.path.join(REPO, "src/data/**/*.json"), recursive=True):
    try:
        txt = open(jf, encoding="utf-8").read()
    except Exception:
        continue
    for m in re.finditer(r"[\"'](/images/[^\"']+\.(?:webp|png|jpg|jpeg|svg))[\"']", txt):
        if not exists(m.group(1)):
            issues.append(f"{os.path.relpath(jf, REPO)}: missing {m.group(1)}")

print(f"public/ contains {sum(len(f) for _,_,f in os.walk(PUB))} files")
if issues:
    print(f"\n{len(issues)} MISSING ASSETS:")
    for i in issues:
        print(" -", i)
    sys.exit(1)
print("ALL REFERENCED IMAGES EXIST")
