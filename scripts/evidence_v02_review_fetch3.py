#!/usr/bin/env python3
"""Evidence v0.2 editorial review - round 3.

Round-1/2 lesson: Bing News RSS <link> values are apiclick.aspx redirect
wrappers; the real article URL sits url-encoded inside them. Decode first,
then fetch. Also: retry GlobeNewswire with a longer timeout and try the
Digital Realty newsroom for the official NBO2 release.
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

REVIEW_DATE = "2026-09-22"

RSS = [
    ("nxtra-tatu-city", "Nxtra Tatu City data centre July 2027"),
    ("nxtra-tatu-city", "Tatu City Airtel Nxtra 44 MW data centre groundbreaking"),
    ("seacom-mombasa-cls", "SEACOM Mombasa cable landing station"),
    ("seacom-mombasa-cls", "SEACOM cable system Kenya go live"),
    ("ixafrica-nbox1", "iXAfrica NBOX1 data centre Nairobi"),
]

DIRECT = [
    ("icolo-nbo2", "dr-newsroom",
     "https://www.digitalrealty.com/about/newsroom"),
    ("icolo-nbo2", "dr-globenewswire-release-retry",
     "https://www.globenewswire.com/news-release/2026/09/07/3142797/0/en/Digital-Realty-Opens-Nairobi-Two-Data-Center-in-Kenya.html"),
]


def decode_bing_link(link: str) -> str:
    """Extract the real article URL from a bing apiclick.aspx wrapper."""
    m = re.search(r"[?&]url=(https?%3a%2f%2f[^&]+)", link, re.I)
    if m:
        return urllib.parse.unquote(m.group(1))
    return link


def rss_items(query: str):
    url = ("https://www.bing.com/news/search?q=" + urllib.parse.quote(query)
           + "&format=rss&setmkt=en-KE&setlang=en")
    try:
        status, final, raw = fetch(url)
    except Exception as e:  # noqa: BLE001
        print(f"  [ERR] rss '{query}': {str(e)[:80]}")
        return []
    body = raw.decode("utf-8", "ignore")
    out = []
    for it in re.findall(r"<item>(.*?)</item>", body, re.S)[:8]:
        t = re.search(r"<title>(.*?)</title>", it)
        l = re.search(r"<link>(.*?)</link>", it)
        p = re.search(r"<pubDate>(.*?)</pubDate>", it)
        if t and l:
            real = decode_bing_link(l.group(1).replace("&amp;", "&"))
            out.append((t.group(1), real, p.group(1) if p else ""))
    return out


BAD_PAT = re.compile(
    r"bing\.com|finance|msn\.com/en-ww|news\.google|facebook|twitter|x\.com"
    r"|youtube|linkedin", re.I)


def main():
    manifest_path = os.path.join(OUT, "manifest.json")
    with open(manifest_path, encoding="utf-8") as f:
        manifest = json.load(f)

    # 1) direct targets
    for slug, label, url in DIRECT:
        t0 = time.time()
        try:
            status, final, raw = fetch(url)
            fname = save_doc(slug, label, url, status, final, raw, "page")
            manifest[f"{slug}/{label}"] = {
                "status": status, "bytes": len(raw), "file": fname,
                "ms": int((time.time() - t0) * 1000), "round": "editorial-review-3",
            }
            print(f"[{status}] {slug}/{label} {len(raw)}B")
        except Exception as e:  # noqa: BLE001
            manifest[f"{slug}/{label}"] = {
                "status": "error", "error": str(e)[:120], "round": "editorial-review-3",
            }
            print(f"[ERR] {slug}/{label}: {str(e)[:90]}")
        time.sleep(1.0)

    # 2) RSS discovery with decoded links
    plan = []
    for slug, query in RSS:
        items = rss_items(query)
        print(f"rss '{query}': {len(items)} items")
        got = 0
        for title, link, pub in items:
            if got >= 2:
                break
            if BAD_PAT.search(link):
                continue
            if not re.search(r"^https?://", link):
                continue
            plan.append((slug, f"press-r3-{got+1}", link, title, pub))
            got += 1

    for slug, label, link, title, pub in plan:
        t0 = time.time()
        try:
            status, final, raw = fetch(link)
            fname = save_doc(slug, label, link, status, final, raw, "page")
            manifest[f"{slug}/{label}"] = {
                "status": status, "bytes": len(raw), "file": fname,
                "ms": int((time.time() - t0) * 1000), "round": "editorial-review-3",
                "url": link, "title": title[:120], "pubDate": pub,
            }
            print(f"[{status}] {slug}/{label} {len(raw)}B :: {title[:64]}")
        except Exception as e:  # noqa: BLE001
            manifest[f"{slug}/{label}"] = {
                "status": "error", "error": str(e)[:120], "round": "editorial-review-3",
                "url": link,
            }
            print(f"[ERR] {slug}/{label}: {str(e)[:90]} :: {link[:70]}")
        time.sleep(1.0)

    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=1)
    print("done")


if __name__ == "__main__":
    main()
