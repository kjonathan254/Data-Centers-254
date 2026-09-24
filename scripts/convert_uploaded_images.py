#!/usr/bin/env python3
"""Task 53b: convert editor-uploaded images (repo root) into public/images/ webp.

Wiring plan (thread 11, AGENT_CONTEXT.md):
  Africa Powe Hero.jpg        -> public/images/africa-power-hero.webp          (IMF article HERO)
  IMG_9828.jpeg.webp          -> public/images/datacloud-africa-nairobi-2026.webp (IBTC article HERO)
  master-power-1-750x375.jpg  -> public/images/dc-power-technicians-training.webp (IBTC inline)

Idempotent: safe to re-run; exits 0 when all three targets exist and are valid WEBP.
"""
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / "public" / "images"

JOBS = [
    # (source at repo root, target filename in public/images/, webp quality)
    ("Africa Powe Hero.jpg", "africa-power-hero.webp", 88),
    ("IMG_9828.jpeg.webp", "datacloud-africa-nairobi-2026.webp", None),  # already webp: copy
    ("master-power-1-750x375.jpg", "dc-power-technicians-training.webp", 88),
]


def main() -> int:
    PUB.mkdir(parents=True, exist_ok=True)
    failures = []
    for src_name, dst_name, quality in JOBS:
        src = ROOT / src_name
        dst = PUB / dst_name
        try:
            if not dst.exists():
                if quality is None:
                    # already webp: straight copy, no re-encode
                    dst.write_bytes(src.read_bytes())
                else:
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
    print("All three hero images in place.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
