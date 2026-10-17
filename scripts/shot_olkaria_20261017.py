#!/usr/bin/env python3
"""Shot the Olkaria article revision infographics (editor revision round, 2026-10-17; repo copy, paths repo-relative).

Three frames from one HTML file:
  #scale 1200x1300  the MW ladder with per-figure basis (verified/announced/reported/grid)
  #fervo 1200x1290  Fervo milestone ladder with status chips (delivered/signed/funded/plan)
  #terms 1200x1420  EGS vs conventional hydrothermal, terms decoded for new readers

QA built in: per-frame overflow + spill check. PNG -> webp (quality 85) straight into
public/images/ with house diagram-* naming. Fails exit 1 on any overflow.
"""
import os
import sys
from PIL import Image
from playwright.sync_api import sync_playwright

HTML = "file:///home/z/my-project/Data-Centers-254/scripts/olkaria-visuals/olkaria-article-visuals.html"
TMP = "/home/z/my-project/Data-Centers-254/scripts/olkaria-visuals"
PUB = "/home/z/my-project/Data-Centers-254/public/images"
FRAMES = {
    "scale": "diagram-olkaria-scale-gap",
    "fervo": "diagram-fervo-milestones",
    "terms": "diagram-egs-vs-hydrothermal",
}

fail = False
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    page.goto(HTML)
    page.wait_for_timeout(700)
    for sid, name in FRAMES.items():
        el = page.locator(f"#{sid}")
        qa = el.evaluate(
            """(el) => {
                const r = {sh: el.scrollHeight, ch: el.clientHeight,
                           sw: el.scrollWidth, cw: el.clientWidth};
                let spill = [];
                el.querySelectorAll('*').forEach(e => {
                    const b = e.getBoundingClientRect();
                    const f = el.getBoundingClientRect();
                    if (b.bottom > f.bottom + 1 || b.right > f.right + 1)
                        spill.push(e.tagName + '.' + (e.className || ''));
                });
                r.spill = spill.slice(0, 5);
                return r;
            }"""
        )
        over_v = qa["sh"] > qa["ch"] + 2
        over_h = qa["sw"] > qa["cw"] + 2
        status = "OK " if not (over_v or over_h or qa["spill"]) else "OVERFLOW"
        if status != "OK ":
            fail = True
        print(f"  [{status}] {sid} sh={qa['sh']}/{qa['ch']} sw={qa['sw']}/{qa['cw']}"
              f" spill={qa['spill']}")
        el.screenshot(path=f"{TMP}/{name}.png")
        img = Image.open(f"{TMP}/{name}.png").convert("RGB")
        out = f"{PUB}/{name}.webp"
        img.save(out, "WEBP", quality=85, method=6)
        print(f"         -> {out} ({os.path.getsize(out) // 1024} KB,"
              f" {img.width}x{img.height})")
    browser.close()

print("RESULT:", "FAIL" if fail else "ALL OK")
sys.exit(1 if fail else 0)
