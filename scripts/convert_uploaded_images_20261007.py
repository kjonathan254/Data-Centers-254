#!/usr/bin/env python3
"""Task 85 (2026-10-07): convert editor-uploaded images (repo root) into
public/images/ webp for the flagship cyber-infrastructure article revision.

Editor uploaded 12 JPGs via GitHub web (commit 976ad82). Five are used in
content/articles/kenya-11-billion-cyber-threats-data-centres.md:

  Hero.jpg                        -> dc-engineer-rack-aisle.webp          (HERO + og_image)
  Screenshot_20261007-083832_...  -> fibre-patch-panel-technician.webp    (inline, detection chain)
  Screenshot_20261007-083953_...  -> dc-aisle-red-status-lighting.webp    (inline, threat volume)
  Screenshot_20261007-084054_...  -> dc-cooling-plant-pipes.webp          (section break, physical plant)
  Screenshot_20261007-084115_...  -> dc-ups-power-room.webp               (inline, demand signal)

NOT used (and deleted from the root in the same commit):
  "Cybersecurity illustration .jpg" (visible "SOC NIGERIA / LAGOS, NIGERIA"
  branding - unusable on a Kenya-focused site), 084008, 084013, 084048,
  084101, 084109 (redundant near-duplicates), 084126 (site already carries
  real Atlancis photography: atlancis-nairobi-datacentre-hall.webp).

Idempotent: safe to re-run; exits 0 when all five targets exist and are
valid WEBP.
"""
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / "public" / "images"

JOBS = [
    # (source at repo root, target filename in public/images/, webp quality)
    ("Hero.jpg", "dc-engineer-rack-aisle.webp", 88),
    ("Screenshot_20261007-083832_ChatGPT.jpg", "fibre-patch-panel-technician.webp", 88),
    ("Screenshot_20261007-083953_ChatGPT.jpg", "dc-aisle-red-status-lighting.webp", 88),
    ("Screenshot_20261007-084054_ChatGPT.jpg", "dc-cooling-plant-pipes.webp", 88),
    ("Screenshot_20261007-084115_ChatGPT.jpg", "dc-ups-power-room.webp", 88),
]


def main() -> int:
    PUB.mkdir(parents=True, exist_ok=True)
    failures = []
    for src_name, dst_name, quality in JOBS:
        src = ROOT / src_name
        dst = PUB / dst_name
        try:
            if not dst.exists():
                im = Image.open(src)
                if im.mode in ("RGBA", "P", "LA"):
                    im = im.convert("RGBA")
                else:
                    im = im.convert("RGB")
                im.save(dst, "WEBP", quality=quality, method=6)
            # verify whatever is on disk
            with Image.open(dst) as check:
                fmt, size = check.format, check.size
            kb = dst.stat().st_size // 1024
            if fmt != "WEBP":
                failures.append(f"{dst_name}: format {fmt}, expected WEBP")
                continue
            print(f"OK {src_name!r} -> public/images/{dst_name} {size[0]}x{size[1]} {kb} KB")
        except Exception as exc:  # noqa: BLE001
            failures.append(f"{src_name}: {exc}")

    if failures:
        print("FAILURES:")
        for f in failures:
            print(" -", f)
        return 1
    print("All five article images in place.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
