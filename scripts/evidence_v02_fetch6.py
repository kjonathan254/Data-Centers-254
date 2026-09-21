#!/usr/bin/env python3
"""Evidence Engine v0.2 - round 6: targeted press fetches (known URL +
spaced Bing News queries for the facilities still lacking Tier-3)."""
import re
import sys
import time
import urllib.parse

sys.path.insert(0, "/home/z/my-project/dc254/scripts")
from evidence_v02_fetch import OUT, fetch  # noqa: E402
from evidence_v02_fetch4 import save_doc  # noqa: E402

KNOWN = [
    ("raxio-kampala-ug1", "press-independent-co-ug",
     "https://www.independent.co.ug/raxio-data-centre-primed-for-all-ugandas-cloud-computing-digital-needs/"),
]

SPACED = [
    ("nxtra-tatu-city", "Nxtra Airtel Tatu City Nairobi data centre"),
    ("seacom-mombasa-cls", "SEACOM Mombasa cable landing station"),
    ("adc-kigali", "Africa Data Centres Kigali Rwanda"),
    ("ixafrica-nbox1", "ixAfrica NBOX1 Nairobi"),
    ("icolo-nbo2", "iColo NBO2 Nairobi"),
]


def bing_news_one(slug, query, max_docs=2):
    url = ("https://www.bing.com/news/search?q=" + urllib.parse.quote(query)
           + "&format=rss&setmkt=en-KE&setlang=en")
    _, _, raw = fetch(url)
    b = raw.decode("utf-8", "ignore")
    items = re.findall(r"<item>(.*?)</item>", b, re.S)
    print(f"  {slug}: {len(items)} items")
    n = 0
    for it in items:
        if n >= max_docs:
            break
        link = re.search(r"<link>(.*?)</link>", it)
        pub = re.search(r"<pubDate>(.*?)</pubDate>", it)
        if not link:
            continue
        m = re.search(r"[?&]url=([^&]+)", link.group(1).replace("&amp;", "&"))
        if not m:
            continue
        real = urllib.parse.unquote(m.group(1))
        if not real.startswith("http") or "bing.com" in real:
            continue
        dom = re.sub(r"https?://(www\.)?", "", real).split("/")[0]
        label = f"press-{re.sub(r'[^a-z0-9]+', '-', dom)}"
        try:
            _, _, raw2 = fetch(real)
            if len(raw2) > 4000:
                save_doc(slug, label, real, raw2, pub.group(1) if pub else None)
                n += 1
            else:
                print(f"    skip small {dom} ({len(raw2)}B)")
        except Exception as e:  # noqa: BLE001
            print(f"    ERR {dom}: {str(e)[:70]}")
        time.sleep(1.2)


def main():
    print("-- known URLs --")
    for slug, label, url in KNOWN:
        try:
            _, _, raw = fetch(url)
            if len(raw) > 4000:
                save_doc(slug, label, url, raw)
            else:
                print(f"  skip {url[:70]} ({len(raw)}B)")
        except Exception as e:  # noqa: BLE001
            print(f"  ERR {str(e)[:80]}")
    print("-- spaced bing news --")
    for slug, q in SPACED:
        try:
            bing_news_one(slug, q)
        except Exception as e:  # noqa: BLE001
            print(f"  ERR {slug}: {str(e)[:80]}")
        time.sleep(3.0)


if __name__ == "__main__":
    main()
