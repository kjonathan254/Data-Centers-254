#!/usr/bin/env python3
"""
Fix canonical_url in all article frontmatter:
  datacentre254.com → data-centers-254.vercel.app

Also fixes any hardcoded datacentre254.com links in article body text
that should be relative or point to the Vercel domain.
"""
import os
import re

ARTICLES_DIR = "/home/z/my-project/content/articles"
OLD_DOMAIN = "datacentre254.com"
NEW_DOMAIN = "data-centers-254.vercel.app"

changed_files = []

for fname in sorted(os.listdir(ARTICLES_DIR)):
    if not fname.endswith(".md"):
        continue
    fpath = os.path.join(ARTICLES_DIR, fname)
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    new_content = content.replace(f"https://{OLD_DOMAIN}", f"https://{NEW_DOMAIN}")
    # Also catch any http:// variant or bare domain references
    new_content = new_content.replace(f"http://{OLD_DOMAIN}", f"https://{NEW_DOMAIN}")

    if new_content != content:
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(new_content)
        changed_files.append(fname)

print(f"Updated {len(changed_files)} files:")
for f in changed_files:
    print(f"  - {f}")
