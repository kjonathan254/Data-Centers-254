#!/usr/bin/env python3
"""Figure gate for the Olkaria geothermal AI data-centre race article.

Recreated 2026-10-17 for the editor revision round (the 2026-10-16 original
was lost with its sandbox). Gates:
  1. Independent recompute of every dataset-derived figure straight from
     src/data/directory/current.json (no shared code with the site build).
  2. Figure allowlist: every load-bearing number must appear in the article.
  3. Conflation guards: the corrected 100 MW vs ~1,000 MW ambiguity must not
     reappear (guards the editor's Priority 1 fix).
  4. Frontmatter integrity: 6 images with existing files, source panel,
     updated_date, no em dashes (belt-and-braces with article_validator).

Exit 0 only when every gate passes.
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "content/articles/olkaria-geothermal-ai-data-centre-race.md")
DATA = os.path.join(ROOT, "src/data/directory/current.json")

fail = []

def check(label, ok, detail=""):
    print(f"  [{'OK' if ok else 'FAIL'}] {label}{(' | ' + detail) if detail and not ok else ''}")
    if not ok:
        fail.append(label)

# ---------- 1. dataset recompute ----------
print("DATASET RECOMPUTE (src/data/directory/current.json)")
raw = json.load(open(DATA))
recs = raw.get("records", raw.get("facilities", []))
check("31 tracked facilities region-wide", len(recs) == 31, f"got {len(recs)}")

kenya = [r for r in recs if "County" in (r.get("region") or "")]
op = [r for r in kenya if r.get("status") == "Operational"]
check("20 operational Kenya facilities", len(op) == 20, f"got {len(op)}")

live_sum = sum(r["itLoadMw"] for r in op if r.get("itLoadMw") is not None)
check("live IT load 10.45 raw -> 10.5 published", abs(live_sum - 10.45) < 0.001, f"got {live_sum}")

des_sum = sum(r["totalCapacityMw"] for r in op if r.get("totalCapacityMw") is not None)
check("designed at operational sites 42.9", abs(des_sum - 42.9) < 0.001, f"got {des_sum}")

uc = [r for r in kenya if r.get("status") == "Under Construction"]
uc_mw = sum(r.get("totalCapacityMw") or 0 for r in uc)
uc_expect = {"iXAfrica NBOX1.2": 18, "Africa Data Centres Nairobi 2 (planned expansion)": 15,
             "Nxtra by Airtel Tatu City": 44}
check("3 under-construction projects, 77 MW total",
      len(uc) == 3 and abs(uc_mw - 77) < 0.001
      and all(abs((r.get("totalCapacityMw") or 0) - v) < 0.001 for r in uc
              for v in [uc_expect.get(r["name"], r.get("totalCapacityMw") or -1)]),
      f"got {[(r['name'], r.get('totalCapacityMw')) for r in uc]}")

com = [r for r in kenya if r.get("status") == "Committed"]
com_mw = sum(r.get("totalCapacityMw") or 0 for r in com)
g42 = next(r for r in kenya if "Microsoft" in r["name"])
check("committed 53 MW; early-stage G42 record carries announced 100 MW",
      abs(com_mw - 53) < 0.001 and (g42.get("totalCapacityMw") or 0) == 100
      and g42.get("status") == "Early Stage")

pipeline = uc_mw + com_mw + sum(r.get("totalCapacityMw") or 0 for r in kenya
                                if r.get("status") == "Early Stage")
check("pipeline 230 MW (77 UC + 53 committed + 100 early)", abs(pipeline - 230) < 0.001,
      f"got {pipeline}")

# ---------- 2/3. article gates ----------
print("ARTICLE FIGURES + CONFLATION GUARDS")
body = open(ART).read()
md_body = body.split("---", 2)[2]

required = [
    "$1 billion", "22 May 2024", "100 MW", "1,000 MW", "3,000 MW", "2,439 MW",
    "60 MW", "943.7 MW", "39.51", "10,000 MW", "172 MW", "80 MW",
    "144 member networks", "2,985 Gbps", "3.5 MW", "15-year", "320 MW",
    "115 MW", "$421 million", "396 MW", "33 MW", "1 January 2027",
    "400 MW", "1 GW", "400 jobs", "Kenyans.co.ke", "Business Daily",
    "Semafor", "30 September", "2,985 Gbps",
]
for fig in required:
    check(f"figure/source present: {fig}", fig in md_body)

forbidden = [
    "single 100 MW AI load",           # the old 100/1,000 conflation
    "data centre of that size",        # ambiguous Ruto reference
    "grid could not absorb a single",
]
for phrase in forbidden:
    check(f"conflation guard absent: '{phrase}'", phrase not in md_body)

# every MW figure must carry its basis somewhere on first use: hard to parse,
# so gate the three critical attributions explicitly
check("100 MW attributed to announced first phase",
      "announced first phase" in md_body and "100 MW first phase" in md_body)
check("~1,000 MW attributed to Ruto/Semafor requirement",
      "Semafor" in md_body and "a third of the country" in md_body)
check("1,000 MW growth attributed to Kenyan press",
      "Kenyans.co.ke, 22 August 2026" in md_body
      and "Business Daily, 10 September 2026" in md_body)

# ---------- 4. frontmatter integrity ----------
print("FRONTMATTER INTEGRITY")
imgs = re.findall(r' - src: "(/images/[^"]+)"', body)
check("6 images declared", len(imgs) == 6, f"got {len(imgs)}")
missing = [p for p in imgs if not os.path.exists(os.path.join(ROOT, "public", p.lstrip("/")))]
check("all image files exist", not missing, f"missing {missing}")
diagrams = re.findall(r'position: "diagram"', body)
check("4 diagram-position visuals (power chain + 3 new infographics)", len(diagrams) == 4, f"got {len(diagrams)}")
n_src = len(re.findall(r"^\s*- title:", body[body.find("external_sources"):body.find("faq:")], re.M))
check("9 external sources", n_src == 9, f"got {n_src}")
check("updated_date 2026-10-17", 'updated_date: "2026-10-17"' in body)
check("no em/en dashes in body", "—" not in body and "–" not in body)
check("hero og image set", 'og_image: "/images/kenya-geothermal-plant-olkaria.webp"' in body)

print()
if fail:
    print(f"RESULT: FAIL ({len(fail)} gates): {fail}")
    sys.exit(1)
print("RESULT: ALL OK")
