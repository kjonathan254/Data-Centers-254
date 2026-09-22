#!/usr/bin/env python3
"""Evidence v0.2 editorial review - round 2: resolve real URLs behind Bing
redirects and fetch the remaining primary sources (GlobeNewswire NBO2 release,
SEACOM Mombasa landing press, Tatu City Nxtra announcement, NBOX1 2025 launch
reports)."""
import os
import re
import sys
import time
import urllib.parse

sys.path.insert(0, "/home/z/my-project/dc254/scripts")
from evidence_v02_fetch import OUT, fetch, to_text  # noqa:E402
from evidence_v02_review_fetch import save_doc  # noqa:E402

REVIEW_DATE = "2026-09-22"

DIRECT = [
    # NBO2: real press article behind bing redirect 1 (ETCIO Data Centers)
    ("icolo-nbo2", "press-etcio-nbo2",
     "https://datacenters.economictimes.indiatimes.com/news/cloud-colocation-connectivity/digital-realty-opens-6-4mw-nairobi-two-data-centre/133994519"),
    ("icolo-nbo2", "press-dcd-nbo2",
     "https://www.datacenterdynamics.com/en/news/digital-realty-opens-64mw-nairobi-two-data-centre-in-kenya/"),
    # SEACOM: go-live / landing press
    ("seacom-mombasa-cls", "press-itweb-seacom-live",
     "https://itweb.africa/content/seacom.2009"),
    ("seacom-mombasa-cls", "ddg-seacom-landing",
     "https://html.duckduckgo.com/html/?q=SEACOM+cable+goes+live+Mombasa+landing+station+2009"),
    # Tatu City official announcement (Sep 2025 groundbreaking)
    ("nxtra-tatu-city", "ddg-tatu-city-nxtra",
     "https://html.duckduckgo.com/html/?q=Tatu+City+Nxtra+Airtel+groundbreaking+44+MW+data+centre"),
    ("nxtra-tatu-city", "press-kna-nxtra",
     "https://www.kenyanews.go.ke/airtel-kenya-to-put-up-sh15-5bn-data-centre-at-tatu-city/"),
    # NBOX1: independent 2025 launch reports with 4.5 MW
    ("ixafrica-nbox1", "ddg-nbox1-4mw",
     "https://html.duckduckgo.com/html/?q=iXAfrica+NBOX1+opens+hyperscale+data+centre+Nairobi+4.5MW+2025"),
    ("ixafrica-nbox1", "press-dcd-nbox1",
     "https://www.datacenterdynamics.com/en/news/ixafrica-opens-45mw-nbox1-data-centre-in-nairobi-kenya/"),
    # GlobeNewswire release discovery (web search, not news rss)
    ("icolo-nbo2", "ddg-globenewswire-nbo2",
     "https://html.duckduckgo.com/html/?q=globenewswire+Digital+Realty+Nairobi+Two+6.4-megawatt"),
]


def ddg_links(url: str, pat: str, n: int = 5):
    """Return first n result links from a DDG html page matching pat."""
    try:
        status, final, raw = fetch(url)
    except Exception as e:  # noqa: BLE001
        print(f"  [ERR] ddg: {str(e)[:80]}")
        return []
    body = raw.decode("utf-8", "ignore")
    hrefs = re.findall(r'uddg=([^&"]+)', body)
    out, seen = [], set()
    for h in hrefs:
        link = urllib.parse.unquote(h)
        if link in seen or not link.startswith("http"):
            continue
        if re.search(pat, link, re.I):
            seen.add(link)
            out.append(link)
        if len(out) >= n:
            break
    return out


def main():
    manifest_path = os.path.join(OUT, "manifest.json")
    import json
    with open(manifest_path, encoding="utf-8") as f:
        manifest = json.load(f)

    for slug, label, url in DIRECT:
        t0 = time.time()
        try:
            status, final, raw = fetch(url)
            fname = save_doc(slug, label, url, status, final, raw, "page")
            manifest[f"{slug}/{label}"] = {
                "status": status, "bytes": len(raw), "file": fname,
                "ms": int((time.time() - t0) * 1000), "round": "editorial-review-2",
            }
            print(f"[{status}] {slug}/{label} {len(raw)}B")
        except Exception as e:  # noqa: BLE001
            manifest[f"{slug}/{label}"] = {
                "status": "error", "error": str(e)[:120], "round": "editorial-review-2",
            }
            print(f"[ERR] {slug}/{label}: {str(e)[:90]}")
        time.sleep(1.0)

    # Follow promising DDG hits
    follows = []
    for slug, label in [
        ("seacom-mombasa-cls", "ddg-seacom-landing"),
        ("nxtra-tatu-city", "ddg-tatu-city-nxtra"),
        ("ixafrica-nbox1", "ddg-nbox1-4mw"),
        ("icolo-nbo2", "ddg-globenewswire-nbo2"),
    ]:
        url = dict((s + "|" + l, u) for s, l, u in DIRECT)[slug + "|" + label]
        pat = (r"seacom\.mu|itweb|standardmedia|nation\.africa|businessdailyafrica"
               if "seacom" in label else
               r"tatucity\.com|airtel|kenyanews|nxtra"
               if "tatu" in label else
               r"ixafrica|datacenterdynamics|techtrends|techpoint|itweb|capacitymedia"
               if "nbox1" in label else
               r"globenewswire|digitalrealty")
        links = ddg_links(url, pat)
        print(f"{slug} follow candidates: {len(links)}")
        for i, link in enumerate(links[:2]):
            follows.append((slug, f"{label}-hit{i+1}", link))

    for slug, label, link in follows:
        t0 = time.time()
        try:
            status, final, raw = fetch(link)
            fname = save_doc(slug, label, link, status, final, raw, "page")
            manifest[f"{slug}/{label}"] = {
                "status": status, "bytes": len(raw), "file": fname,
                "ms": int((time.time() - t0) * 1000), "round": "editorial-review-2",
                "url": link,
            }
            print(f"[{status}] {slug}/{label} {len(raw)}B :: {link[:80]}")
        except Exception as e:  # noqa: BLE001
            manifest[f"{slug}/{label}"] = {
                "status": "error", "error": str(e)[:120], "round": "editorial-review-2",
            }
            print(f"[ERR] {slug}/{label}: {str(e)[:90]}")
        time.sleep(1.0)

    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=1)
    print("done")


if __name__ == "__main__":
    main()
