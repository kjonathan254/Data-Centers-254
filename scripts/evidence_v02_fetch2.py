#!/usr/bin/env python3
"""Evidence Engine v0.2 - round 2 fetches: discovered deep pages + Bing
discovery (Tier 4 for discovery only) + ADC wp-json content API."""
import re
import sys
import time
import json
import urllib.request
import urllib.parse

sys.path.insert(0, "/home/z/my-project/dc254/scripts")
from evidence_v02_fetch import OUT, UA, fetch, to_text, KEYWORDS  # noqa: E402,F401


def bing_urls(body: str, limit=12):
    hrefs = re.findall(r'<h2[^>]*><a[^>]+href="(http[^"]+)"', body)
    out, seen = [], set()
    for h in hrefs:
        h = h.split("&")[0] if "bing.com/ck/" not in h else h
        if h not in seen:
            seen.add(h)
            out.append(h)
    return out[:limit]


def run(slug, label, url, kind="page"):
    t0 = time.time()
    try:
        status, final, raw = fetch(url)
        body = raw.decode("utf-8", errors="ignore")
        fname = f"{slug}__{label}.txt"
        links = []
        if kind == "bing":
            links = bing_urls(body)
            text = to_text(raw)
        elif kind == "json":
            text = body[:16000]
        else:
            text = to_text(raw)
        windows = []
        if kind in ("page", "json"):
            for m in KEYWORDS.finditer(text):
                a, b = max(0, m.start() - 200), min(len(text), m.end() + 200)
                seg = text[a:b].strip()
                if seg not in windows:
                    windows.append(seg)
                if len(windows) >= 14:
                    break
        with open(f"{OUT}/{fname}", "w", encoding="utf-8") as f:
            f.write(f"url: {url}\nfinal: {final}\nstatus: {status}\nretrieved: 2026-09-22\nbytes: {len(raw)}\n\n")
            if links:
                f.write("== result links ==\n" + "\n".join(links) + "\n\n")
            for i, w in enumerate(windows):
                f.write(f"== window {i+1} ==\n{w}\n\n")
            if not windows and not links:
                f.write("== head ==\n" + text[:2500] + "\n")
        print(f"[{status}] {slug}/{label} {len(raw)}B links={len(links)} {int((time.time()-t0)*1000)}ms")
        return status, links
    except Exception as e:  # noqa: BLE001
        print(f"[ERR] {slug}/{label}: {str(e)[:100]}")
        return None, []


def main():
    all_links = {}
    # 1. iColo deep pages (pattern discovered from homepage)
    for tag in ("nbo1", "nbo2", "mba1", "mba2"):
        run(f"icolo-{tag}", f"icolo-{tag}-page", f"https://www.icolo.io/location/{tag}/")
    # 2. PAIX + Raxio + Nxtra homepage discovery
    run("paix-nairobi", "paix-home-discovery", "https://paix.io/")
    run("raxio-kampala-ug1", "raxio-home-discovery", "https://www.raxio.com/")
    run("nxtra-tatu-city", "nxtra-in-discovery", "https://www.nxtra.in/")
    # 3. ADC WordPress content API
    run("adc-kigali", "wpjson-kigali", "https://www.africadatacentres.com/wp-json/wp/v2/pages?search=kigali", kind="json")
    run("adc-nbo1", "wpjson-nairobi", "https://www.africadatacentres.com/wp-json/wp/v2/pages?search=nairobi", kind="json")
    # 4. Bing discovery (Tier 4 -> find Tier 1/3 documents)
    queries = {
        "seacom-mombasa-cls": "SEACOM Mombasa cable landing station data centre",
        "nxtra-tatu-city": "Nxtra Airtel Tatu City Nairobi data centre",
        "raxio-kampala-ug1": "Raxio Kampala UG1 data centre launch",
        "paix-nairobi": "PAIX Nairobi data centre Kenya",
        "adc-kigali": "Africa Data Centres Kigali KGL1 launch",
        "ixafrica-nbox1": "ixAfrica NBOX1 hyperscale data centre Nairobi",
        "icolo-nbo2": "iColo NBO2 Nairobi data centre Digital Realty",
        "adc-nbo1": "Africa Data Centres Nairobi NBO1",
    }
    for slug, q in queries.items():
        url = "https://www.bing.com/search?q=" + urllib.parse.quote(q)
        _, links = run(slug, "bing-" + re.sub(r"[^a-z0-9]+", "-", q.lower())[:30], url, kind="bing")
        all_links[slug] = links
        time.sleep(1.2)
    with open(f"{OUT}/round2_links.json", "w") as f:
        json.dump(all_links, f, indent=1)


if __name__ == "__main__":
    main()
