#!/usr/bin/env python3
"""Evidence Engine v0.2 - round 5: Bing News RSS (direct article URLs),
PAIX Kenya page, iColo location sitemap resolution, Nxtra sitemap review."""
import re
import sys
import time
import urllib.parse

sys.path.insert(0, "/home/z/my-project/dc254/scripts")
from evidence_v02_fetch import OUT, fetch, to_text, KEYWORDS  # noqa: E402
from evidence_v02_fetch4 import save_doc  # noqa: E402

QUERIES = {
    "adc-nbo1": "Africa Data Centres Nairobi data centre",
    "adc-kigali": "Africa Data Centres Kigali data centre",
    "icolo-nbo1": "iColo Nairobi One data centre",
    "icolo-nbo2": "iColo NBO2 Nairobi Digital Realty",
    "icolo-mba1": "iColo Mombasa data centre",
    "icolo-mba2": "iColo Mombasa Two data centre",
    "paix-nairobi": "PAIX Nairobi Kenya internet exchange",
    "nxtra-tatu-city": "Nxtra Airtel Kenya data centre",
    "seacom-mombasa-cls": "SEACOM Mombasa cable landing station",
    "raxio-kampala-ug1": "Raxio Kampala Uganda data centre",
    "ixafrica-nbox1": "ixAfrica NBOX1 hyperscale Nairobi",
}


def bing_news(slug, query, max_docs=2):
    url = ("https://www.bing.com/news/search?q=" + urllib.parse.quote(query)
           + "&format=rss")
    _, _, raw = fetch(url)
    b = raw.decode("utf-8", "ignore")
    items = re.findall(r"<item>(.*?)</item>", b, re.S)
    n = 0
    for it in items:
        if n >= max_docs:
            break
        link = re.search(r"<link>(.*?)</link>", it)
        pub = re.search(r"<pubDate>(.*?)</pubDate>", it)
        if not link:
            continue
        m = re.search(r"[?&]url=([^&]+)", link.group(1))
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
                print(f"    skip small {dom}")
        except Exception as e:  # noqa: BLE001
            print(f"    ERR {dom}: {str(e)[:70]}")
        time.sleep(0.8)


def main():
    print("-- bing news press --")
    for slug, q in QUERIES.items():
        try:
            print(f"{slug}:")
            bing_news(slug, q)
        except Exception as e:  # noqa: BLE001
            print(f"  ERR {str(e)[:80]}")
        time.sleep(0.6)
    print("-- paix kenya page --")
    try:
        _, _, raw = fetch("https://www.paix.io/kenya")
        text = to_text(raw)
        wins = []
        for m in KEYWORDS.finditer(text):
            a, b = max(0, m.start() - 240), min(len(text), m.end() + 240)
            s = text[a:b].strip()
            if s not in wins:
                wins.append(s)
            if len(wins) >= 12:
                break
        with open(f"{OUT}/paix-nairobi__paix-kenya-page.txt", "w", encoding="utf-8") as f:
            f.write(f"url: https://www.paix.io/kenya\nstatus: 200\nretrieved: 2026-09-22\nbytes: {len(raw)}\n\n")
            for i, w in enumerate(wins):
                f.write(f"== window {i+1} ==\n{w}\n\n")
        print(f"saved paix kenya page ({len(wins)} windows)")
    except Exception as e:  # noqa: BLE001
        print(f"paix ERR {str(e)[:80]}")
    print("-- icolo location sitemap --")
    try:
        _, _, raw = fetch("https://www.icolo.io/wp-sitemap-posts-location-1.xml")
        locs = re.findall(r"<loc>([^<]+)</loc>", raw.decode("utf-8", "ignore"))
        print("locations:", locs)
        with open(f"{OUT}/icolo-nbo2__icolo-location-urls.txt", "w") as f:
            f.write("\n".join(locs))
        for loc in locs:
            if re.search(r"nbo2|nbo-2|nairobi-two", loc, re.I):
                print("  fetching NBO2 page:", loc)
                _, _, raw2 = fetch(loc)
                text = to_text(raw2)
                with open(f"{OUT}/icolo-nbo2__icolo-nbo2-page.txt", "w", encoding="utf-8") as f:
                    f.write(f"url: {loc}\nstatus: 200\nretrieved: 2026-09-22\nbytes: {len(raw2)}\n\n")
                    wins = []
                    for m in KEYWORDS.finditer(text):
                        a, b = max(0, m.start() - 240), min(len(text), m.end() + 240)
                        s = text[a:b].strip()
                        if s not in wins:
                            wins.append(s)
                        if len(wins) >= 12:
                            break
                    for i, w in enumerate(wins):
                        f.write(f"== window {i+1} ==\n{w}\n\n")
                print(f"  saved ({len(wins)} windows)")
    except Exception as e:  # noqa: BLE001
        print(f"icolo ERR {str(e)[:80]}")


if __name__ == "__main__":
    main()
