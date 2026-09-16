#!/usr/bin/env python3
"""Fresh gap-audit evidence run: SERP snapshots for candidate Kenya DC queries."""
import json, subprocess, time

QUERIES = [
    # candidate gap: Microsoft/G42 Kenya mega-project
    "microsoft g42 kenya data centre investment east africa cloud region",
    # candidate gap: colocation pricing
    "data centre colocation pricing cost Nairobi Kenya per rack",
    # candidate gap: Starlink angle
    "Starlink Kenya internet impact infrastructure 2026",
    # candidate gap: hyperscaler cloud region status
    "AWS Azure Google cloud region Africa Kenya when 2026",
    # candidate gap: salary data for careers cluster
    "data centre jobs salary Kenya network technician engineer",
    # candidate gap: DR / business continuity
    "disaster recovery business continuity Kenya data centre hosting",
    # candidate gap: shared/web hosting funnel
    "web hosting Kenya best providers 2026",
    # candidate gap: regional comparison
    "data centres Uganda Tanzania Rwanda east africa comparison",
    # check existing ranking: market numbers
    "kenya data centre market size 2026",
    # check existing ranking: tier ratings
    "tier iii tier iv data centre kenya certified",
]

out = {}
for q in QUERIES:
    for attempt in range(3):
        try:
            subprocess.run(
                ["z-ai", "function", "-n", "web_search",
                 "-a", json.dumps({"query": q, "num": 8}),
                 "-o", "/tmp/gap_tmp.json"],
                capture_output=True, timeout=60, check=True)
            d = json.load(open("/tmp/gap_tmp.json"))
            items = d if isinstance(d, list) else d.get("results", [])
            out[q] = [{
                "host": i.get("host_name", ""),
                "url": i.get("url", "")[:120],
                "title": i.get("name", "")[:110],
            } for i in items]
            print(f"DONE  {q[:70]}")
            break
        except Exception:
            if attempt < 2:
                time.sleep(8)
            else:
                out[q] = []
                print(f"FAIL  {q[:70]}")
    time.sleep(2.5)

json.dump(out, open("/home/z/my-project/data-centers-audit/research/gap_audit_serps_2026-09-16.json", "w"), indent=1)
print("saved -> research/gap_audit_serps_2026-09-16.json")
