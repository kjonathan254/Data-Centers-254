#!/usr/bin/env python3
"""Konza PPP article: convert the 5 owner-uploaded signing/infrastructure
photos (repo root, added via GitHub web upload) into public/images/*.webp,
then remove the loose originals from git.

Mapping (verified visually 2026-10-24):
  HVUrZqoWsAAy_4h.jpg                 -> konza-ppp-signing-exchange.webp  (2 officials, documents up)
  HVUraOGWoAEUmFw.jpg                 -> konza-ppp-signing-handshake.webp (handshake over agreement)
  HVUrasEWkAEuckr.jpg                 -> konza-ppp-signing-group.webp     (7-person group photo)
  Konza's National Data Centre...jpg  -> konza-national-dc-render.webp    (facility building)
  proposed expansion sits...jpg       -> konza-technopolis-aerial.webp    (Technopolis aerial)

Idempotent: skips conversion when target exists.
"""
import subprocess
import sys
from pathlib import Path

from PIL import Image

ROOT = Path("/home/z/my-project/Data-Centers-254")
PUB = ROOT / "public" / "images"

JOBS = [
    ("HVUrZqoWsAAy_4h.jpg", "konza-ppp-signing-exchange.webp"),
    ("HVUraOGWoAEUmFw.jpg", "konza-ppp-signing-handshake.webp"),
    ("HVUrasEWkAEuckr.jpg", "konza-ppp-signing-group.webp"),
    ("Konza\u2019s National Data Centre is the focus .jpg", "konza-national-dc-render.webp"),
    ("proposed expansion sits within Konza\u2019s wider amb.jpg", "konza-technopolis-aerial.webp"),
]

MAX_W = 1600
QUALITY = 85


def convert(src: Path, dst: Path) -> None:
    im = Image.open(src)
    if im.mode in ("RGBA", "P", "LA"):
        im = im.convert("RGB")
    w, h = im.size
    if w > MAX_W:
        im = im.resize((MAX_W, round(h * MAX_W / w)), Image.LANCZOS)
    im.save(dst, "WEBP", quality=QUALITY, method=6)
    print(f"{dst.name}: {w}x{h} -> {im.size[0]}x{im.size[1]}, {dst.stat().st_size // 1024} KB")


def main() -> int:
    failures = []
    for src_name, dst_name in JOBS:
        src, dst = ROOT / src_name, PUB / dst_name
        if dst.exists():
            print(f"exists, skip: {dst_name}")
            continue
        if not src.exists():
            failures.append(f"missing source: {src_name}")
            continue
        convert(src, dst)

    if failures:
        print("\n".join(failures))
        return 1

    # drop the loose originals from git (files stay on disk untouched)
    tracked = subprocess.run(
        ["git", "ls-files"], cwd=ROOT, capture_output=True, text=True
    ).stdout.splitlines()
    for src_name, _ in JOBS:
        if src_name in tracked:
            subprocess.run(["git", "rm", "--quiet", "--", src_name], cwd=ROOT, check=True)
            print(f"git rm: {src_name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
