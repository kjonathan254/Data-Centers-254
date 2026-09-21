#!/usr/bin/env python3
"""Evidence Engine v0.2 - source fetcher for the 11-facility pilot.

Fetches candidate evidence sources (operator deep pages, the PeeringDB
registry API, press articles) plus Tier-4 discovery searches, and saves
extracted text to research/evidence_v02/ for honest excerpt curation.

Tier-4 rule (editorial hierarchy): aggregators/search may DISCOVER a source;
they never establish a claim. Excerpts stored in the claims DB must come from
Tier 1-3 documents fetched here, verbatim.
"""
import os
import re
import html
import json
import time
import urllib.request

OUT = "/home/z/my-project/dc254/research/evidence_v02"
os.makedirs(OUT, exist_ok=True)

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")

# slug -> list of (label, url). Homepages double as link discovery for deep pages.
FETCHES = {
    "adc-nbo1": [("adc-nairobi-page", "https://www.africadatacentres.com/nairobi/")],
    "adc-kigali": [
        ("adc-kigali-page", "https://www.africadatacentres.com/kigali/"),
        ("adc-home-discovery", "https://www.africadatacentres.com/"),
        ("cassava-home-discovery", "https://www.cassavatechnologies.com/"),
    ],
    "icolo-nbo1": [
        ("icolo-nairobi-page", "https://www.icolo.io/locations/nairobi/"),
        ("icolo-home-discovery", "https://www.icolo.io/"),
    ],
    "icolo-nbo2": [
        ("icolo-nairobi-page", "https://www.icolo.io/locations/nairobi/"),
        ("allafrica-nbo2-story", "https://allafrica.com/stories/202609080028.html"),
    ],
    "icolo-mba1": [("icolo-mombasa-page", "https://www.icolo.io/locations/mombasa/")],
    "icolo-mba2": [("icolo-mombasa-page", "https://www.icolo.io/locations/mombasa/")],
    "paix-nairobi": [("paix-kenya-page", "https://paix.io/datacentres/kenya/")],
    "nxtra-tatu-city": [
        ("nxtra-home-discovery", "https://www.nxtra.africa/"),
        ("tatucity-home-discovery", "https://tatucity.com/"),
        ("ddg-nxtra-tatu", "https://html.duckduckgo.com/html/?q=Nxtra+Airtel+Tatu+City+data+centre+Nairobi"),
    ],
    "seacom-mombasa-cls": [
        ("seacom-home-discovery", "https://www.seacom.mu/"),
        ("ddg-seacom-mombasa", "https://html.duckduckgo.com/html/?q=SEACOM+Mombasa+cable+landing+station+data+centre"),
    ],
    "raxio-kampala-ug1": [
        ("raxio-home-discovery", "https://www.raxiogroup.com/"),
        ("raxio-kampala-guess", "https://www.raxiogroup.com/locations/kampala/"),
        ("ddg-raxio-kampala", "https://html.duckduckgo.com/html/?q=Raxio+Kampala+UG1+data+centre+launch"),
    ],
    "ixafrica-nbox1": [
        ("ixafrica-home-discovery", "https://ixafrica.co.ke/"),
        ("ddg-ixafrica-nbox1", "https://html.duckduckgo.com/html/?q=iXAfrica+NBOX1+hyperscale+data+centre+Nairobi"),
    ],
    "peeringdb-registry": [
        ("pdb-api-batch", "https://www.peeringdb.com/api/fac?id__in=1964,14166,5019,10232,7995,1648,6448,13572"),
    ],
}

KEYWORDS = re.compile(
    r"(MW|megawatt|rack|Tier|colocation|colo|hyperscale|carrier.neutral|capacity|"
    r"Nairobi|Kampala|Kigali|Mombasa|Tatu|launch|opened|inaugurat|commissioned|"
    r"landing|submarine|fibre|fiber|renewable|solar|geothermal|UG1|KGL1|NBO|NBA|MBA|NBOX)",
    re.I,
)


def fetch(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    with urllib.request.urlopen(req, timeout=45) as r:
        return r.status, r.geturl(), r.read()


def to_text(raw: bytes) -> str:
    try:
        s = raw.decode("utf-8", errors="ignore")
    except Exception:
        s = str(raw)
    s = re.sub(r"<script[\s\S]*?</script>|<style[\s\S]*?</style>", " ", s, flags=re.I)
    s = html.unescape(re.sub(r"<[^>]+>", " ", s))
    return re.sub(r"[ \t\r\f\v]+", " ", s)


def main():
    manifest = {}
    for slug, targets in FETCHES.items():
        for label, url in targets:
            t0 = time.time()
            try:
                status, final, raw = fetch(url)
                body = raw.decode("utf-8", errors="ignore")
                if "json" in url or url.startswith("https://www.peeringdb.com/api"):
                    text = body[:12000]
                else:
                    text = to_text(raw)
                # keyword windows (skip for discovery pages / json)
                windows = []
                if not url.startswith("https://html.duckduckgo.com") and "peeringdb.com/api" not in url:
                    for m in KEYWORDS.finditer(text):
                        a, b = max(0, m.start() - 180), min(len(text), m.end() + 180)
                        seg = text[a:b].strip()
                        if seg not in windows:
                            windows.append(seg)
                        if len(windows) >= 14:
                            break
                # candidate deep links (discovery pages)
                links = []
                if "discovery" in label or "ddg" in label:
                    hrefs = re.findall(r'href="([^"#]+)"', body)
                    pat = re.compile(
                        r"(nairobi|kampala|kigali|mombasa|tatu|ug1|kgl1|nbo|mba|nbox|data[-_ ]?cent)",
                        re.I,
                    )
                    seen = set()
                    for h in hrefs:
                        if h.startswith("http") and pat.search(h) and h not in seen:
                            seen.add(h)
                            links.append(h)
                        if len(links) >= 25:
                            break
                fname = f"{slug}__{label}.txt"
                with open(os.path.join(OUT, fname), "w", encoding="utf-8") as f:
                    f.write(f"url: {url}\nfinal: {final}\nstatus: {status}\nretrieved: 2026-09-22\nbytes: {len(raw)}\n\n")
                    if links:
                        f.write("== candidate links ==\n" + "\n".join(links) + "\n\n")
                    for i, w in enumerate(windows):
                        f.write(f"== window {i+1} ==\n{w}\n\n")
                    if not windows and not links:
                        f.write("== head ==\n" + text[:3000] + "\n")
                manifest[f"{slug}/{label}"] = {"status": status, "bytes": len(raw), "file": fname, "ms": int((time.time() - t0) * 1000)}
                print(f"[{status}] {slug}/{label} {len(raw)}B {int((time.time()-t0)*1000)}ms")
            except Exception as e:  # noqa: BLE001
                manifest[f"{slug}/{label}"] = {"status": "error", "error": str(e)[:120]}
                print(f"[ERR] {slug}/{label}: {str(e)[:100]}")
            time.sleep(1.0)
    with open(os.path.join(OUT, "manifest.json"), "w") as f:
        json.dump(manifest, f, indent=1)
    print("done:", len(manifest), "fetches")


if __name__ == "__main__":
    main()
