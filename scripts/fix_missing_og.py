#!/usr/bin/env python3
"""Generate 1200x630 og crops for the 5 articles missing og_image, from the
unused high-res pool, then wire the frontmatter."""
import re, os
from PIL import Image

ROOT = "/home/z/my-project/data-centers-audit/repo"
OG_W, OG_H = 1200, 630
RATIO = OG_W / OG_H

ASSIGN = {
    "ai-model-training-kenya-use-cases": "dc-server-chip-4-wide.webp",
    "career-progression-african-data-centres": "dc-woman-engineer-racks.webp",
    "data-centre-design-build-kenya": "dc-switchgear-2.webp",
    "kenya-data-sovereignty-localisation": "constitution-of-kenya-2010.webp",
    "kenya-digital-economy-data-centre-demand": "nairobi-sunset.webp",
}

for slug, src in ASSIGN.items():
    src_p = os.path.join(ROOT, "public", "images", src)
    im = Image.open(src_p).convert("RGB")
    w, h = im.size
    # center crop to 1.905:1
    if w / h > RATIO:
        new_w = int(h * RATIO)
        box = ((w - new_w) // 2, 0, (w - new_w) // 2 + new_w, h)
    else:
        new_h = int(w / RATIO)
        top = (h - new_h) // 3  # bias slightly above center for skylines/sky
        box = (0, top, w, top + new_h)
    im = im.crop(box)
    if im.width > OG_W:
        im = im.resize((OG_W, OG_H), Image.LANCZOS)
    out_name = f"og-{slug}.webp"
    out_p = os.path.join(ROOT, "public", "images", out_name)
    im.save(out_p, "WEBP", quality=82, method=6)
    print(f"[OK] {out_name}  {im.width}x{im.height}  from {src}")

    # wire frontmatter (only if og_image missing)
    md_p = os.path.join(ROOT, "content", "articles", f"{slug}.md")
    txt = open(md_p, encoding="utf-8").read()
    if re.search(r'^og_image:', txt, re.M):
        print(f"[SKIP] {slug} already has og_image")
        continue
    txt, n = re.subn(r'^(og_image:)\s*""\s*$', rf'\1 "/images/{out_name}"', txt, count=1, flags=re.M)
    if n == 0:
        # no empty og_image line: insert before reading_time or after cluster
        txt, n = re.subn(r'^(reading_time:)', rf'og_image: "/images/{out_name}"\n\1', txt, count=1, flags=re.M)
    if n == 0:
        print(f"[FAIL] could not wire {slug}"); continue
    open(md_p, "w", encoding="utf-8").write(txt)
    print(f"[OK] frontmatter wired: {slug}")
