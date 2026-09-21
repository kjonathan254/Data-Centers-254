#!/usr/bin/env python3
"""Evidence Engine v0.2 - round 3: decode Bing redirect links, fetch the
Tier 1-3 target documents behind them."""
import re
import sys
import time
import json
import base64
import urllib.parse

sys.path.insert(0, "/home/z/my-project/dc254/scripts")
from evidence_v02_fetch import OUT, UA, fetch, to_text, KEYWORDS  # noqa: E402

QUERIES = {
    "seacom-mombasa-cls": "SEACOM Mombasa cable landing station data centre",
    "nxtra-tatu-city": "Nxtra Airtel Tatu City Nairobi data centre",
    "raxio-kampala-ug1": "Raxio Kampala UG1 data centre launch",
    "paix-nairobi": "PAIX Nairobi data centre Kenya",
    "adc-kigali": "Africa Data Centres Kigali KGL1 launch",
    "ixafrica-nbox1": "ixAfrica NBOX1 hyperscale data centre Nairobi",
    "icolo-nbo2": "iColo NBO2 Nairobi data centre Digital Realty",
    "adc-nbo1": "Africa Data Centres Nairobi NBO1",
}

# domains we accept as fetch targets (Tier 1-3 candidates)
ACCEPT = re.compile(
    r"(datacenterdynamics\.com|capacitymedia\.com|allafrica\.com|africadatacentres\.com|"
    r"cassavatechnologies\.com|raxio[a-z]*\.|seacom|paix\.|ixafrica\.|nxtra\.|airtel\.|"
    r"tatucity\.com|digitalrealty\.com|icolo\.io|businessdailyafrica\.com|standardmedia\.co\.ke|"
    r"nation\.africa|techpoint\.africa|techcabal\.com|connectingafrica\.com|itnewsafrica\.com|"
    r"datacenterhawk\.com|structurecomms\.com|africanmarkets\.com|edgekenya\.com)",
    re.I,
)


def decode_bing(ck_url: str) -> str | None:
    ck_url = ck_url.replace("&amp;", "&")
    m = re.search(r"[?&]u=a1([^&]+)", ck_url)
    if not m:
        m2 = re.search(r"[?&]u=([^&]+)", ck_url)
        if not m2:
            return None
        raw = m2.group(1)
    else:
        raw = m.group(1)
    try:
        pad = raw + "=" * (-len(raw) % 4)
        return base64.urlsafe_b64decode(pad).decode("utf-8", errors="ignore")
    except Exception:
        return None


def grab_windows(url, text):
    windows = []
    for m in KEYWORDS.finditer(text):
        a, b = max(0, m.start() - 220), min(len(text), m.end() + 220)
        seg = text[a:b].strip()
        if seg not in windows:
            windows.append(seg)
        if len(windows) >= 10:
            break
    return windows


def save_doc(slug, label, url, status, final, raw):
    text = to_text(raw)
    windows = grab_windows(url, text)
    fname = f"{slug}__{label}.txt"
    with open(f"{OUT}/{fname}", "w", encoding="utf-8") as f:
        f.write(f"url: {url}\nfinal: {final}\nstatus: {status}\nretrieved: 2026-09-22\nbytes: {len(raw)}\n\n")
        for i, w in enumerate(windows):
            f.write(f"== window {i+1} ==\n{w}\n\n")
        if not windows:
            f.write("== head ==\n" + text[:2200] + "\n")
    print(f"   saved {fname} ({len(raw)}B, {len(windows)} windows)")


def main():
    targets = {}
    for slug, q in QUERIES.items():
        url = "https://www.bing.com/search?q=" + urllib.parse.quote(q) + "&count=15"
        try:
            _, _, raw = fetch(url)
            body = raw.decode("utf-8", errors="ignore")
            cks = re.findall(r'href="(https://www\.bing\.com/ck/a\?[^"]+)"', body)
            decoded = []
            for c in cks:
                real = decode_bing(c)
                if (real and real.startswith("http") and ACCEPT.search(real)
                        and "bing.com" not in real and real not in decoded):
                    decoded.append(real)
            targets[slug] = decoded[:6]
            print(f"{slug}: {len(decoded[:6])} targets")
            for t in decoded[:6]:
                print("   ", t[:110])
        except Exception as e:  # noqa: BLE001
            print(f"{slug}: SERP error {str(e)[:80]}")
        time.sleep(1.0)
    with open(f"{OUT}/round3_targets.json", "w") as f:
        json.dump(targets, f, indent=1)
    # fetch each target
    for slug, urls in targets.items():
        for i, u in enumerate(urls):
            label = f"doc{i+1}-" + re.sub(r"[^a-z0-9]+", "-", u.lower())[:40].strip("-")
            try:
                status, final, raw = fetch(u)
                if status == 200 and len(raw) > 5000:
                    save_doc(slug, label, u, status, final, raw)
                else:
                    print(f"   skip [{status}] {u[:90]} ({len(raw)}B)")
            except Exception as e:  # noqa: BLE001
                print(f"   ERR {u[:90]}: {str(e)[:80]}")
            time.sleep(1.0)


if __name__ == "__main__":
    main()
