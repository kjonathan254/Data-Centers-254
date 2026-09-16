#!/usr/bin/env python3
"""Task 42: validate JSON-LD blocks on key prerendered pages.
Parses every application/ld+json script from the built HTML and checks
the @type-specific required fields Google's Rich Results test cares
about (structural validity, not eligibility for rich snippets)."""
import glob, json, os, re, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(REPO, ".next", "server", "app")

PAGES = {
    "home": "index.html" if os.path.exists(os.path.join(APP, "index.html")) else "page.html",
    "article": "articles/5g-networks-data-centre-demand-kenya.html",
    "article-licensing": "articles/kenya-data-centre-licensing-framework.html",
    "facility": "directory/ixafrica-nbox1.html",
    "faq": "faq.html",
    "policy-hub": "policy.html",
    "compare": "directory/compare.html",
}

ld_re = re.compile(
    r'<script type="application/ld\+json"[^>]*>(.*?)</script>', re.S
)
REQUIRED = {
    "Organization": ["name", "url"],
    "WebSite": ["name", "url"],
    "Article": ["headline", "author", "datePublished"],
    "FAQPage": ["mainEntity"],
    "BreadcrumbList": ["itemListElement"],
    "Person": ["name"],
    "NewsArticle": ["headline", "author", "datePublished"],
}
fails = 0
for label, rel in PAGES.items():
    p = os.path.join(APP, rel)
    if not os.path.exists(p):
        print(f"[SKIP] {label}: {rel} not prerendered")
        continue
    html = open(p, encoding="utf-8").read()
    blocks = ld_re.findall(html)
    if not blocks:
        print(f"[FAIL] {label}: no JSON-LD found")
        fails += 1
        continue
    for i, b in enumerate(blocks, 1):
        try:
            data = json.loads(b)
        except json.JSONDecodeError as e:
            print(f"[FAIL] {label} block {i}: invalid JSON: {e}")
            fails += 1
            continue
        t = data.get("@type", "?")
        missing = [k for k in REQUIRED.get(t, []) if k not in data]
        status = "FAIL" if missing else "OK"
        if missing:
            fails += 1
        print(f"[{status}] {label} block {i}: {t}"
              + (f" missing={missing}" if missing else ""))
        # article byline check: author name should be the FULL name now
        if t in ("Article", "NewsArticle"):
            name = data.get("author", {}).get("name", "")
            ok = name == "Kevin Jonathan Onyango Otieno"
            print(f"       author: {name!r} {'OK' if ok else 'MISMATCH'}")
            if not ok:
                fails += 1
print(f"\n{'ALL OK' if fails == 0 else f'{fails} FAILURES'}")
sys.exit(1 if fails else 0)
