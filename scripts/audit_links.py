#!/usr/bin/env python3
"""Audit: hardcoded internal hrefs in src/** pointing to non-existent routes."""
import os, re, glob, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(REPO, "src", "app")

# 1. Build the set of valid routes: app dirs with page.tsx + dynamic markers
valid = set()
for root, dirs, files in os.walk(APP):
    if "page.tsx" in files or "route.ts" in files:
        rel = os.path.relpath(root, APP)
        if rel == ".":
            valid.add("/")
        else:
            valid.add("/" + rel.replace(os.sep, "/"))

# 2. Article slugs
arts = {"/articles/" + os.path.basename(p)[:-3]
        for p in glob.glob(os.path.join(REPO, "content", "articles", "*.md"))}

# 3. Non-article data-driven routes (best-effort manual list from lib)
EXTRA = {"/directory", "/tracker", "/search", "/feed.xml", "/sitemap.xml", "/robots.txt",
         "/manifest.json", "/offline", "/api/chat", "/api/subscribe"}
# dynamic segments like /articles/[slug] handled by articles set; directory/[slug]?
dynamic_ok = re.compile(r"^/(directory|articles|data-centres|energy|policy|news|ai|kenya|infrastructure|research|foundations|beginners|glossary)(/|$)")

ALLOW_PREFIX = ("/articles/", "/directory/")

missing = {}
for globpat in ["src/**/*.tsx", "src/**/*.ts"]:
    for fp in glob.glob(os.path.join(REPO, globpat), recursive=True):
        if "node_modules" in fp:
            continue
        txt = open(fp, encoding="utf-8").read()
        for m in re.finditer(r"""(?:href|redirect|push)\s*[:=]?\s*[\"'](\/[a-z0-9\-/_#]*)[\"']""", txt):
            u = m.group(1).split("#")[0].rstrip("/") or "/"
            if u in valid or u in arts or u in EXTRA:
                continue
            if u.startswith(ALLOW_PREFIX):
                continue  # data-driven; deeper check happens at runtime
            rel = os.path.relpath(fp, REPO)
            missing.setdefault(u, []).append(rel)

if missing:
    print(f"{len(missing)} suspicious hardcoded hrefs:")
    for u, files in sorted(missing.items()):
        print(f"  {u}  <- {', '.join(sorted(set(files))[:3])}")
else:
    print("ALL HARDCODED HREFS RESOLVE")
