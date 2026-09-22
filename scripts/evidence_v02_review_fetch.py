#!/usr/bin/env python3
"""Evidence Engine v0.2 - editorial review round fetches.

The editor's claim-by-claim review (2026-09-22) cites primary sources that the
original sweep did not capture verbatim. This script fetches exactly those, so
every newly approved claim stores a verbatim excerpt from a Tier 1-3 document:

  NBO2   : Digital Realty GlobeNewswire launch release (6.4 MW), Digital Realty
           NBO2 facility listing (Langata S Rd & LRC Rd, 3,600 m2, 2N/N+2)
  UG1    : raxiogroup.com/data-centres/uganda/ (1.5 MW, 400 racks, Namanve)
  NXTRA  : Tatu City / Airtel Nxtra announcement (44 MW, 2 x 22 MW phases)
  SEACOM : landing-point documentation (TeleGeography cable record / regulator)
  NBOX1  : independent 2025 launch reports corroborating 4.5 MW IT load

Saves extracted text under research/evidence_v02/ next to the earlier sweeps.
"""
import json
import os
import re
import sys
import time
import urllib.parse

sys.path.insert(0, "/home/z/my-project/dc254/scripts")
from evidence_v02_fetch import OUT, fetch, to_text  # noqa: E402

REVIEW_DATE = "2026-09-22"

# (slug, label, url)
TARGETS = [
    # NBO2 - Digital Realty launch release (official press release = Tier 1)
    ("icolo-nbo2", "dr-globenewswire-release",
     "https://www.globenewswire.com/news-release/2026/09/07/3142797/0/en/Digital-Realty-Opens-Nairobi-Two-Data-Center-in-Kenya.html"),
    ("icolo-nbo2", "dr-globenewswire-search",
     "https://www.globenewswire.com/en/search/keyword/Digital%2520Realty%2520Nairobi"),
    ("icolo-nbo2", "bing-dr-nbo2-release",
     "https://www.bing.com/news/search?q=" + urllib.parse.quote("Digital Realty Nairobi Two Data Center 6.4 megawatt")
     + "&format=rss&setmkt=en-KE&setlang=en"),
    ("icolo-nbo2", "dr-nbo2-listing",
     "https://www.digitalrealty.com/data-centers/nairobi/nbo2"),
    ("icolo-nbo2", "dr-africa-listing",
     "https://www.digitalrealty.com/data-centers/africa"),
    # Raxio UG1 - official facility page (Tier 1)
    ("raxio-kampala-ug1", "raxio-uganda-page",
     "https://www.raxiogroup.com/data-centres/uganda/"),
    ("raxio-kampala-ug1", "raxio-uganda-page2",
     "https://www.raxiogroup.com/data-centres/uganda"),
    # Nxtra Tatu City - Tatu City official announcement + Airtel Africa release
    ("nxtra-tatu-city", "tatucity-news-search",
     "https://tatucity.com/?s=Nxtra"),
    ("nxtra-tatu-city", "bing-nxtra-tatu",
     "https://www.bing.com/news/search?q=" + urllib.parse.quote("Nxtra Airtel Tatu City 44 MW data centre")
     + "&format=rss&setmkt=en-KE&setlang=en"),
    ("nxtra-tatu-city", "airtel-africa-news",
     "https://www.airtelafrica.com/media/press-releases"),
    # SEACOM - landing-point documentation
    ("seacom-mombasa-cls", "telegeography-seacom",
     "https://www.submarinecablemap.com/api/v3/cable/seacom.json"),
    ("seacom-mombasa-cls", "telegeography-seacom-page",
     "https://www.submarinecablemap.com/submarine-cable/seacom"),
    ("seacom-mombasa-cls", "seacom-network-page",
     "https://www.seacom.mu/what-we-do/our-network"),
    # iXAfrica NBOX1 - independent 2025 launch reports
    ("ixafrica-nbox1", "bing-nbox1-launch",
     "https://www.bing.com/news/search?q=" + urllib.parse.quote("iXAfrica NBOX1 hyperscale Nairobi launch 4.5MW")
     + "&format=rss&setmkt=en-KE&setlang=en"),
    # ADC NBO1 - older data sheet context (Tier 1 operator document)
    ("adc-nbo1", "adc-nairobi-2026-check",
     "https://www.africadatacentres.com/nairobi/"),
]


def save_doc(slug: str, label: str, url: str, status, final, raw: bytes,
             kind: str = "page") -> str:
    """Persist a fetched document in the evidence_v02 research directory."""
    body = raw.decode("utf-8", errors="ignore")
    if kind == "json":
        text = body[:12000]
        windows = []
    elif kind == "rss":
        text = body
        windows = []
    else:
        text = to_text(raw)
        windows = []
        for m in re.finditer(
                r"(6\.4|6\.5|MW|megawatt|rack|Tier III|colocation|carrier|capacity|"
                r"Namanve|Kampala|Tatu|44|22 MW|landing|Mombasa|Karen|Langata|"
                r"ISO 27001|PCI|N\+2|2N|1\.5|400|opened|launch)",
                text, re.I):
            a, b = max(0, m.start() - 200), min(len(text), m.end() + 200)
            seg = text[a:b].strip()
            if seg not in windows:
                windows.append(seg)
            if len(windows) >= 18:
                break
    fname = f"{slug}__{label}.txt"
    with open(os.path.join(OUT, fname), "w", encoding="utf-8") as f:
        f.write(f"url: {url}\nfinal: {final}\nstatus: {status}\n"
                f"retrieved: {REVIEW_DATE}\nbytes: {len(raw)}\n\n")
        for i, w in enumerate(windows):
            f.write(f"== window {i+1} ==\n{w}\n\n")
        if not windows:
            f.write("== head ==\n" + text[:4000] + "\n")
    return fname


def bing_items(url: str):
    """Yield (title, link, pubDate) from a Bing News RSS page."""
    try:
        status, final, raw = fetch(url)
    except Exception as e:  # noqa: BLE001
        print(f"  [ERR] bing: {str(e)[:90]}")
        return []
    body = raw.decode("utf-8", "ignore")
    items = []
    for it in re.findall(r"<item>(.*?)</item>", body, re.S)[:6]:
        t = re.search(r"<title>(.*?)</title>", it)
        l = re.search(r"<link>(.*?)</link>", it)
        p = re.search(r"<pubDate>(.*?)</pubDate>", it)
        if t and l:
            items.append((t.group(1), l.group(1), p.group(1) if p else ""))
    return items


def main():
    manifest_path = os.path.join(OUT, "manifest.json")
    manifest = {}
    if os.path.exists(manifest_path):
        with open(manifest_path, encoding="utf-8") as f:
            manifest = json.load(f)

    for slug, label, url in TARGETS:
        kind = ("json" if ".json" in url
                else "rss" if "bing.com/news" in url or "format=rss" in url
                else "page")
        t0 = time.time()
        try:
            status, final, raw = fetch(url)
            fname = save_doc(slug, label, url, status, final, raw, kind)
            manifest[f"{slug}/{label}"] = {
                "status": status, "bytes": len(raw), "file": fname,
                "ms": int((time.time() - t0) * 1000), "round": "editorial-review",
            }
            print(f"[{status}] {slug}/{label} {len(raw)}B")
        except Exception as e:  # noqa: BLE001
            manifest[f"{slug}/{label}"] = {
                "status": "error", "error": str(e)[:120], "round": "editorial-review",
            }
            print(f"[ERR] {slug}/{label}: {str(e)[:100]}")
        time.sleep(1.0)

    # Bing News RSS discovery: follow the top items for the round-2 fetches
    follow = []
    for slug, label, url in TARGETS:
        if "bing" not in label:
            continue
        items = bing_items(url)
        print(f"bing {slug}: {len(items)} items")
        for i, (title, link, pub) in enumerate(items[:3]):
            follow.append((slug, f"press-bing{i+1}", link, title, pub))

    for slug, label, link, title, pub in follow:
        t0 = time.time()
        try:
            status, final, raw = fetch(link)
            fname = save_doc(slug, label, link, status, final, raw, "page")
            manifest[f"{slug}/{label}"] = {
                "status": status, "bytes": len(raw), "file": fname,
                "ms": int((time.time() - t0) * 1000), "round": "editorial-review",
                "title": title[:120], "pubDate": pub,
            }
            print(f"[{status}] {slug}/{label} {len(raw)}B :: {title[:70]}")
        except Exception as e:  # noqa: BLE001
            manifest[f"{slug}/{label}"] = {
                "status": "error", "error": str(e)[:120], "round": "editorial-review",
            }
            print(f"[ERR] {slug}/{label}: {str(e)[:90]}")
        time.sleep(1.0)

    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=1)
    print("done")


if __name__ == "__main__":
    main()
