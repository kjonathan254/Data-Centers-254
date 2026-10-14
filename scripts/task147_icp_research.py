#!/usr/bin/env python3
"""Task 147 - First-Dollar GTM: ICP prospect research (free channels only).

Runs a web_search battery to NAME real candidate clients (vendors, operators,
buyers, recruiters, event venues) with why-now evidence. Output is a JSON
bundle saved workspace-side; every downstream prospect record enters the
pipeline UNREVIEWED per intelligence/README.md house rules.

Usage: python3 scripts/task147_icp_research.py
Output: /home/z/my-project/tmp/task147/icp_research.json
"""

import json
import os
import subprocess

OUT_DIR = "/home/z/my-project/tmp/task147"
OUT = os.path.join(OUT_DIR, "icp_research.json")

QUERIES = [
    # ICP-1: vendors / integrators selling into DC buildouts
    ("icp1-vendor", "data centre solutions company Kenya UPS cooling installation"),
    ("icp1-vendor", "Atlancis Technologies Kenya data centre solutions"),
    ("icp1-vendor", "Vertiv partner Kenya data centre power cooling"),
    ("icp1-vendor", "Schneider Electric APC data centre partner Kenya"),
    ("icp1-vendor", "data centre construction contractor Kenya firm"),
    ("icp1-vendor", "precision air conditioning data centre supplier Nairobi"),
    # ICP-2: operators (validate against directory; find HQ contact channels)
    ("icp2-operator", "Africa Data Centres Nairobi NBO2 expansion 2026"),
    ("icp2-operator", "iXAfrica data centre Nairobi expansion NBOX2 Tilisi"),
    # ICP-3: buyers of intelligence (consultancies, investors)
    ("icp3-analyst", "Africa data centre investment advisory consultancy Nairobi"),
    ("icp3-analyst", "private equity data centre Africa market entry Kenya"),
    # ICP-4: enterprises that need colo/DR (the audience vendors want to reach)
    ("icp4-enterprise", "Kenya bank disaster recovery colocation data centre"),
    # ICP-5: recruiters (Microsoft ADC dislocation angle)
    ("icp5-recruiter", "tech recruitment agency Nairobi data centre engineers"),
    ("icp5-recruiter", "Microsoft Africa Development Centre Kenya engineers leaving jobs"),
    # ICP-6: KDEAP / donor ecosystem bidders (deadline 29 Oct 2026)
    ("icp6-kdeap", "KDEAP Kenya Digital Economy Acceleration Project ICT Authority"),
    # Events (venue-based prospecting)
    ("events", "data centre cloud summit Nairobi Africa 2026 conference"),
    # Local cloud/hosting (potential Radar subscribers too)
    ("icp1-vendor", "Kenya local cloud hosting provider company Angani"),
]


def search(q: str, num: int = 6):
    p = subprocess.run(
        ["z-ai", "function", "-n", "web_search",
         "-a", json.dumps({"query": q, "num": num}),
         "-o", "/tmp/task147_search.json"],
        capture_output=True, timeout=60)
    if p.returncode != 0:
        return [{"error": p.stderr.decode()[:200]}]
    d = json.load(open("/tmp/task147_search.json"))
    items = d if isinstance(d, list) else d.get("results", [])
    out = []
    for i in items:
        out.append({
            "title": i.get("name") or i.get("title", ""),
            "url": i.get("url") or i.get("link", ""),
            "snippet": (i.get("snippet") or i.get("content", ""))[:300],
            "host": i.get("host_name", ""),
        })
    return out


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    bundle = []
    for tag, q in QUERIES:
        print(f"[{tag}] {q}")
        res = search(q)
        print(f"   -> {len(res)} results")
        bundle.append({"tag": tag, "query": q, "results": res})
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(bundle, f, ensure_ascii=False, indent=1)
    print("saved:", OUT)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
