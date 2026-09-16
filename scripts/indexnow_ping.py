#!/usr/bin/env python3
"""IndexNow ping for Bing/Yandex/Seznam (DC254).

Usage:
  python3 scripts/indexnow_ping.py                      # ping every URL in the live sitemap
  python3 scripts/indexnow_ping.py /articles/foo /bar   # ping specific paths only

Protocol: https://www.indexnow.org/documentation
The key file public/<key>.txt is deployed with the site; Bing fetches it to
verify ownership. Responses: 200/202 accepted, 400 bad request, 403 key not
valid (key file not reachable yet), 422 URLs don't belong to the host,
429 too many requests.
"""
import json
import sys
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET

HOST = "data-centers-254.vercel.app"
BASE = f"https://{HOST}"
KEY = "42ceac901e1b7b7f38fc8bbef59bc19d"
KEY_LOCATION = f"{BASE}/{KEY}.txt"
ENDPOINT = "https://api.indexnow.org/IndexNow"


def sitemap_urls() -> list[str]:
    with urllib.request.urlopen(f"{BASE}/sitemap.xml", timeout=30) as r:
        tree = ET.fromstring(r.read())
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    return [loc.text for loc in tree.findall(".//s:loc", ns)]


def ping(urls: list[str]) -> int:
    payload = json.dumps({
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls,
    }).encode()
    req = urllib.request.Request(
        ENDPOINT,
        data=payload,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            print(f"[OK] HTTP {r.status} for {len(urls)} URLs")
            return r.status
    except urllib.error.HTTPError as e:
        print(f"[FAIL] HTTP {e.code} ({e.reason}) for {len(urls)} URLs")
        print(e.read().decode(errors="replace")[:300])
        return e.code


def main() -> None:
    if len(sys.argv) > 1:
        urls = [
            u if u.startswith("http") else f"{BASE}{urllib.parse.quote(u)}"
            for u in sys.argv[1:]
        ]
    else:
        urls = sitemap_urls()
    print(f"Pinging IndexNow with {len(urls)} URLs from {HOST}")
    # single batch is fine up to 10,000 URLs; chunk defensively anyway
    status = 0
    for i in range(0, len(urls), 100):
        status = ping(urls[i : i + 100]) or status
    sys.exit(0 if status in (200, 202) else 1)


if __name__ == "__main__":
    main()
