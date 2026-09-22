#!/usr/bin/env python3
"""Evidence v0.2 editorial review - round 4.

The iColo deep pages fetched for MBA1/MBA2 turned out to contain the exact
facility-level wording (location, colocation, rack counts). Apply the same
treatment to NBO2 (never fetched: /location/nbo2/) and run Bing WEB-search
RSS (format=rss works for web search too) for the last gaps:
Nxtra Tatu City T1 announcement, SEACOM Mombasa landing corroborator,
iXAfrica NBOX1 4.5MW independent 2025 report.
"""
import json
import os
import re
import sys
import time
import urllib.parse

sys.path.insert(0, "/home/z/my-project/dc254/scripts")
from evidence_v02_fetch import OUT, fetch  # noqa:E402
from evidence_v02_review_fetch import save_doc  # noqa:E402
from evidence_v02_review_fetch3 import decode_bing_link, BAD_PAT  # noqa:E402

DIRECT = [
    ("icolo-nbo2", "icolo-nbo2-page", "https://www.icolo.io/location/nbo2/"),
    ("icolo-nbo2", "icolo-nbo2-page-alt", "https://icolo.io/location/nbo2/"),
    ("seacom-mombasa-cls", "press-bbc-2009",
     "http://news.bbc.co.uk/2/hi/africa/8117240.stm"),
    ("nxtra-tatu-city", "kna-nxtra-retry",
     "https://www.kenyanews.go.ke/airtel-kenya-to-put-up-sh15-5bn-data-centre-at-tatu-city/"),
]

WEB_RSS = [
    ("nxtra-tatu-city", "Nxtra Airtel Tatu City data centre groundbreaking Kenya"),
    ("nxtra-tatu-city", "Tatu City data centre 44 MW Airtel"),
    ("seacom-mombasa-cls", "SEACOM cable landing station Mombasa Kenya"),
    ("ixafrica-nbox1", "iXAfrica NBOX1 Nairobi hyperscale 4.5MW"),
]


def web_rss_items(query: str):
    url = ("https://www.bing.com/search?q=" + urllib.parse.quote(query)
           + "&format=rss&setmkt=en-KE&setlang=en&count=15")
    try:
        status, final, raw = fetch(url)
    except Exception as e:  # noqa: BLE001
        print(f"  [ERR] webrss '{query}': {str(e)[:80]}")
        return []
    body = raw.decode("utf-8", "ignore")
    out = []
    for it in re.findall(r"<item>(.*?)</item>", body, re.S)[:12]:
        t = re.search(r"<title>(.*?)</title>", it)
        l = re.search(r"<link>(.*?)</link>", it)
        d = re.search(r"<description>(.*?)</description>", it)
        if t and l:
            out.append((t.group(1), decode_bing_link(l.group(1).replace("&amp;", "&")),
                        d.group(1) if d else ""))
    return out


def main():
    manifest_path = os.path.join(OUT, "manifest.json")
    with open(manifest_path, encoding="utf-8") as f:
        manifest = json.load(f)

    for slug, label, url in DIRECT:
        t0 = time.time()
        try:
            status, final, raw = fetch(url)
            fname = save_doc(slug, label, url, status, final, raw, "page")
            manifest[f"{slug}/{label}"] = {
                "status": status, "bytes": len(raw), "file": fname,
                "ms": int((time.time() - t0) * 1000), "round": "editorial-review-4",
            }
            print(f"[{status}] {slug}/{label} {len(raw)}B")
        except Exception as e:  # noqa: BLE001
            manifest[f"{slug}/{label}"] = {
                "status": "error", "error": str(e)[:120], "round": "editorial-review-4",
            }
            print(f"[ERR] {slug}/{label}: {str(e)[:90]}")
        time.sleep(1.0)

    plan = []
    for slug, query in WEB_RSS:
        items = web_rss_items(query)
        print(f"webrss '{query}': {len(items)} items")
        got = 0
        for title, link, desc in items:
            if got >= 3:
                break
            if BAD_PAT.search(link) or not link.startswith("http"):
                continue
            plan.append((slug, f"press-r4-{got+1}", link, title, desc))
            got += 1

    for slug, label, link, title, desc in plan:
        t0 = time.time()
        try:
            status, final, raw = fetch(link)
            fname = save_doc(slug, label, link, status, final, raw, "page")
            manifest[f"{slug}/{label}"] = {
                "status": status, "bytes": len(raw), "file": fname,
                "ms": int((time.time() - t0) * 1000), "round": "editorial-review-4",
                "url": link, "title": title[:120],
            }
            print(f"[{status}] {slug}/{label} {len(raw)}B :: {title[:64]}")
        except Exception as e:  # noqa: BLE001
            manifest[f"{slug}/{label}"] = {
                "status": "error", "error": str(e)[:120], "round": "editorial-review-4",
                "url": link,
            }
            print(f"[ERR] {slug}/{label}: {str(e)[:80]} :: {link[:70]}")
        time.sleep(1.0)

    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=1)
    print("done")


if __name__ == "__main__":
    main()
