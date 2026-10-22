#!/usr/bin/env python3
"""DC254 public-surface check: PHP CMS signatures on *.go.ke homepages.

Method: plain HTTPS GET to each homepage, look only at response headers
(Server, X-Powered-By) and page body markers (wp-content, Drupal, Joomla,
generator meta). No exploitation, no login attempts, no scans of paths,
no fingerprinting beyond what any visitor's browser already receives.
SSL verification disabled because several government hosts serve broken
or self-chained TLS chains; we are reading signatures, not trusting them.
"""
import concurrent.futures
import json
import re
import urllib3
import urllib.request
import ssl

urllib3.disable_warnings()

DOMAINS = [
    "president.go.ke",
    "statehouse.go.ke",
    "ict.go.ke",
    "icta.go.ke",
    "treasury.go.ke",
    "health.go.ke",
    "kra.go.ke",
    "immigration.go.ke",
    "ecitizen.go.ke",
    "konza.go.ke",
    "mombasa.go.ke",
    "education.go.ke",
    "police.go.ke",
    "judiciary.go.ke",
    "kenya.go.ke",
]

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
TIMEOUT = 15

MARKERS = [
    ("WordPress", r"wp-content|wp-includes|wp-json"),
    ("Drupal", r"Drupal\.|/sites/default/files|drupal"),
    ("Joomla", r"/media/jui/|Joomla!|/components/com_"),
    ("generator meta", r'<meta[^>]+name="generator"[^>]+content="([^"]+)"'),
]


def probe(domain):
    rec = {"domain": domain, "status": None, "server": None,
           "x_powered_by": None, "signatures": [], "generator": None,
           "error": None}
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    for scheme in ("https", "http"):
        try:
            req = urllib.request.Request(
                f"{scheme}://{domain}/", headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=TIMEOUT, context=ctx) as r:
                body = r.read(300_000).decode("utf-8", "replace")
                rec["status"] = r.status
                rec["server"] = r.headers.get("Server")
                rec["x_powered_by"] = r.headers.get("X-Powered-By")
                break
        except urllib.error.HTTPError as e:
            rec["status"] = e.code
            rec["server"] = e.headers.get("Server") if e.headers else None
            rec["x_powered_by"] = e.headers.get("X-Powered-By") if e.headers else None
            if scheme == "http":
                rec["error"] = f"HTTP {e.code}"
            break
        except Exception as e:
            if scheme == "http":
                rec["error"] = type(e).__name__
    # body markers only if we got HTML
    if rec["status"] == 200:
        for name, pat in MARKERS:
            m = re.search(pat, body, re.I)
            if m:
                rec["signatures"].append(name)
                if name == "generator meta":
                    rec["generator"] = m.group(1)
    elif rec["status"] is not None:
        rec["error"] = f"HTTP {rec['status']}"
    return rec


def main():
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as ex:
        results = list(ex.map(probe, DOMAINS))

    for r in results:
        sig = ", ".join(dict.fromkeys(r["signatures"])) or "-"
        gen = f" (generator: {r['generator']})" if r["generator"] else ""
        powered = f" | X-Powered-By: {r['x_powered_by']}" if r["x_powered_by"] else ""
        print(f"{r['domain']:24} {str(r['status']):>4}  sig: {sig}{gen}"
              f" | Server: {r['server']}{powered}  {r['error'] or ''}")

    out = "govke_probe_results_20261022.json"
    with open(out, "w") as fh:
        json.dump({"date": "2026-10-22", "domains": DOMAINS,
                   "results": results}, fh, indent=2)
    print(f"\nsaved: {out}")
    reachable = [r for r in results if r["status"] == 200]
    php_sig = [r for r in results if r["signatures"]]
    print(f"reachable: {len(reachable)}/{len(results)}; "
          f"with PHP CMS signatures: {len(php_sig)}")


if __name__ == "__main__":
    main()
