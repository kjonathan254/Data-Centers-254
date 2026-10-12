#!/usr/bin/env python3
"""Task 130: pre-crop the Nairobi skyline photo to its tower band (the source
photo's lower half is Wilson Airport hangars/planes - unusable for the OG card).
Output: research/og-assets/skyline-band.jpg"""
from pathlib import Path
from PIL import Image

SRC = Path("/home/z/my-project/Data-Centers-254/public/images/nairobi-skyline-night-kicc.webp")
OUT = Path("/home/z/my-project/Data-Centers-254/research/og-assets/skyline-band.jpg")
OUT.parent.mkdir(parents=True, exist_ok=True)

im = Image.open(SRC).convert("RGB")
w, h = im.size  # 1920x1294
# towers occupy roughly y 30..640 incl. tree line; keep a little sky headroom
band = im.crop((0, 20, w, 660))  # 1920x640
# flip horizontally so the tall spire tower lands on the card's open RIGHT
# side (under the network constellation) instead of behind the headline text
band = band.transpose(Image.FLIP_LEFT_RIGHT)
band.save(OUT, "JPEG", quality=88)
print("saved", OUT, band.size)
