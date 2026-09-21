#!/usr/bin/env python3
"""Evidence Engine v0.2 - round 4: Google News RSS press discovery + site
sitemaps for operator deep pages."""
import re
import sys
import time
import json
import html as ht
import urllib.parse

sys.path.insert(0, "/home/z/my-project/dc254/scripts")
from evidence_v02_fetch import OUT, fetch, to_text, KEYWORDS  # noqa: E402

GNEWS = {
    "adc-nbo1": "Africa Data Centres Nairobi NBO1 data centre",
    "adc-kigali": "Africa Data Centres Kigali data centre",
    "icolo-nbo1": "iColo Nairobi One data centre",
    "icolo-nbo2": "iColo NBO2 Nairobi data centre",
    "icolo-mba1": "iColo Mombasa data centre",
    "icolo-mba2": "iColo Mombasa Two MBA2 data centre",
    "paix-nairobi": "PAIX Nairobi internet exchange data centre",
    "nxtra-tatu-city": "Nxtra Airtel Kenya data centre Tatu City",
    "seacom-mombasa-cls": "SEACOM Mombasa cable landing",
    "raxio-kampala-ug1": "Raxio Kampala Uganda data centre",
    "ixafrica-nbox1": "ixAfrica NBOX1 Nairobi hyperscale",
}

SITEMAPS = [
    ("seacom-mombasa-cls", "seacom-robots", "https://www.seacom.mu/robots.txt"),
    ("paix-nairobi", "paix-sitemap", "https://paix.io/sitemap.xml"),
    ("raxio-kampala-ug1", "raxio-sitemap-http", "http://www.raxio.com/sitemap.xml"),
    ("nxtra-tatu-city", "nxtra-sitemap", "https://www.nxtra.in/sitemap.xml"),
    ("icolo-nbo2", "icolo-sitemap", "https://www.icolo.io/sitemap.xml"),
    ("adc-kigali", "adc-wpjson-nairobi-retry", "https://www.africadatacentres.com/wp-json/wp/v2/pages?search=nairobi"),
]


def gnews(query: str):
    url = ("https://news.google.com/rss/search?q=" + urllib.parse.quote(query)
           + "&hl=en-KE&gl=KE&ceid=KE:en")
    _, _, raw = fetch(url)
    b = raw.decode("utf-8", "ignore")
    items = re.findall(
        r"<item><title>(.*?)</title>.*?<link>(.*?)</link>.*?"
        r"<pubDate>(.*?)</pubDate>.*?<description>(.*?)</description>",
        b, re.S)
    out = []
    for title, link, pubdate, desc in items[:10]:
        m = re.search(r'href="(https?://[^"]+)"', ht.unescape(desc))
        real = m.group(1) if m else None
        out.append({"title": ht.unescape(title), "pubDate": pubdate,
                    "real": real, "glink": link})
    return out


def save_doc(slug, label, url, raw, pubdate=None):
    text = to_text(raw)
    windows = []
    for m in KEYWORDS.finditer(text):
        a, b = max(0, m.start() - 240), min(len(text), m.end() + 240)
        seg = text[a:b].strip()
        if seg not in windows:
            windows.append(seg)
        if len(windows) >= 10:
            break
    fname = f"{slug}__{label}.txt"
    with open(f"{OUT}/{fname}", "w", encoding="utf-8") as f:
        f.write(f"url: {url}\nstatus: 200\nretrieved: 2026-09-22\npublished: {pubdate or 'unknown'}\nbytes: {len(raw)}\n\n")
        for i, w in enumerate(windows):
            f.write(f"== window {i+1} ==\n{w}\n\n")
        if not windows:
            f.write("== head ==\n" + text[:2000] + "\n")
    print(f"    saved {fname} ({len(windows)} windows)")
    return fname


def main():
    # 1) Google News discovery -> fetch real press articles
    for slug, q in GNEWS.items():
        try:
            items = gnews(q)
            print(f"{slug}: {len(items)} news items")
            seen = set()
            n = 0
            for it in items:
                real = it["real"]
                if not real or real in seen:
                    continue
                seen.add(real)
                if n >= 2:
                    break
                dom = re.sub(r"https?://(www\.)?", "", real).split("/")[0]
                label = f"gnews-{re.sub(r'[^a-z0-9]+', '-', dom)}"
                try:
                    _, _, raw = fetch(real)
                    if len(raw) > 4000:
                        save_doc(slug, label, real, raw, it["pubDate"])
                        n += 1
                    else:
                        print(f"    skip small {dom} {len(raw)}B")
                except Exception as e:  # noqa: BLE001
                    print(f"    ERR {dom}: {str(e)[:70]}")
                time.sleep(0.8)
        except Exception as e:  # noqa: BLE001
            print(f"{slug}: gnews ERR {str(e)[:80]}")
        time.sleep(0.6)
    # 2) Sitemaps / retries
    print("\n-- sitemaps --")
    for slug, label, url in SITEMAPS:
        try:
            kind = "json" if "wp-json" in url else "page"
            _, _, raw = fetch(url)
            body = raw.decode("utf-8", "ignore")
            fname = f"{slug}__{label}.txt"
            with open(f"{OUT}/{fname}", "w", encoding="utf-8") as f:
                f.write(f"url: {url}\nstatus: 200\nretrieved: 2026-09-22\nbytes: {len(raw)}\n\n")
                if kind == "json":
                    f.write(body[:16000])
                else:
                    locs = re.findall(r"<loc>([^<]+)</loc>", body)
                    f.write("\n".join(locs[:200]) if locs else "== head ==\n" + body[:1500])
                    if not locs:
                        text = to_text(raw)
                        for m in KEYWORDS.finditer(text):
                            a, b = max(0, m.start() - 220), min(len(text), m.end() + 220)
                            f.write(f"\n\n== window ==\n{text[a:b].strip()}")
                            if f.getvalue().count("== window ==") >= 12:
                                break
            print(f"[200] {slug}/{label} ({len(raw)}B, {len(re.findall(r'<loc>', body)) if kind != 'json' else 'json'})")
        except Exception as e:  # noqa: BLE001
            print(f"[ERR] {slug}/{label}: {str(e)[:80]}")
        time.sleep(0.8)


if __name__ == "__main__":
    main()
