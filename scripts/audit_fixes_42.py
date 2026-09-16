#!/usr/bin/env python3
"""Task 42 fixes from the external SEO audit (2026-09-16).

1. og/twitter unification: on the 18 static pages whose social titles
   were previously "X | Data Centre 254" (stripped to bare "X" in Task
   41), set openGraph.title / twitter.title equal to the page's main
   descriptive <title> string. Site-wide convention becomes: SERP shows
   "Page | DC254" (non-article pages), every social card shows the full
   page title with siteName "Data Centre 254" rendered separately by the
   network. Same convention article and facility pages already follow.
2. Byline unification: all 84 article bylines + article JSON-LD author
   say "Kevin Jonathan Onyango Otieno"; 12 site-chrome/legal spots say
   "Kevin Jonathan Otieno". The full name is the entity anchor (E-E-A-T),
   so short form is upgraded everywhere. Plain replace is safe: the
   short string is not a substring of the full name.
"""
import os, re, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ── 1. og/twitter := main title on the 18 static pages ──────────────────
PAGES = [
    "about", "ai", "beginners", "careers", "contact", "data-centres",
    "directory/compare", "energy", "faq", "foundations", "glossary",
    "infrastructure/map", "infrastructure", "kenya", "policy", "research",
    "research/state-of-kenyan-data-centres-2026", "tracker",
]
title_re = re.compile(r'^(\s*)title:\s*"([^"]+)"(\s*,?\s*)$', re.M)
changed, noop = [], []
for rel in PAGES:
    p = os.path.join(REPO, "src", "app", rel, "page.tsx")
    with open(p, encoding="utf-8") as f:
        code = f.read()
    hits = title_re.findall(code)
    if not hits:
        noop.append(f"{rel}: no title strings found")
        continue
    main = max((h[1] for h in hits), key=len)
    others = sorted({h[1] for h in hits if h[1] != main})
    if not others:
        noop.append(f"{rel}: og/twitter already == main")
        continue
    for old in others:
        code = code.replace(f'title: "{old}"', f'title: "{main}"')
    with open(p, "w", encoding="utf-8") as f:
        f.write(code)
    changed.append(f"{rel}: og/twitter '{' | '.join(others)}' -> '{main}'")

print("[1] og/twitter unified to main descriptive title:")
for c in changed:
    print(f"      {c}")
for n in noop:
    print(f"      (noop) {n}")

# ── 2. Byline short -> full ──────────────────────────────────────────────
n_by = 0
for root, _dirs, files in os.walk(REPO):
    if "/.git" in root or "/node_modules" in root or "/.next" in root:
        continue
    for fn in files:
        if not fn.endswith((".tsx", ".ts", ".txt", ".md", ".json", ".xml")):
            continue
        p = os.path.join(root, fn)
        with open(p, encoding="utf-8") as f:
            txt = f.read()
        if "Kevin Jonathan Otieno" not in txt:
            continue
        new = txt.replace("Kevin Jonathan Otieno", "Kevin Jonathan Onyango Otieno")
        if new != txt:
            with open(p, "w", encoding="utf-8") as f:
                f.write(new)
            n_by += 1
            print(f"[2] byline unified: {os.path.relpath(p, REPO)}")
print(f"[2] {n_by} files updated")
print("OK")
