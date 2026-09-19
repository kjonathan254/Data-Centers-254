#!/usr/bin/env python3
"""DC254 article validator: run before every push that touches content/.
Checks every content/articles/*.md for:
- required frontmatter fields, slug == filename
- author == "Kevin Jonathan Otieno"
- rendered title <= 56 chars, meta_description 100..170 chars
- ISO dates, published <= updated
- og_image and every images[].src exists in public/
- image positions are valid enum values
- frontmatter internal_links + body markdown links resolve
  (article slugs, hub routes, /directory[/slug])
- no em dash (house rule)
- FAQ >= 2, external_sources >= 1, body >= 800 words
- decorative separator lines in body (full-line dashes/equals; markdown
  table delimiter rows are fine and not flagged)
- README stats cross-check: article and cluster counts claimed in README
  must match the content directory
"""
import os, re, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(REPO, "content", "articles")
APP = os.path.join(REPO, "src", "app")
PUB = os.path.join(REPO, "public")

VALID_POSITIONS = {"hero", "section-break", "inline", "infographic", "comparison", "diagram"}
REQUIRED = ["title", "slug", "meta_description", "primary_keyword", "secondary_keywords",
            "author", "author_bio_link", "published_date", "updated_date", "category",
            "cluster", "og_image", "reading_time", "images", "internal_links",
            "external_sources", "faq"]

# static routes that internal links may legally point at
STATIC_ROUTES = set()
for root, _dirs, files in os.walk(APP):
    rel = os.path.relpath(root, APP)
    if os.path.basename(root) and os.path.exists(os.path.join(root, "page.tsx")):
        p = "" if rel == "." else "/" + rel.replace(os.sep, "/")
        STATIC_ROUTES.add(p)

article_slugs = {fn[:-3] for fn in os.listdir(ART) if fn.endswith(".md")}
facility_slugs = set()
dd = open(os.path.join(REPO, "src", "lib", "directory-data.ts"), encoding="utf-8").read()
m = re.search(r"const facilities[\s\S]*", dd)
for fm in re.finditer(r'slug:\s*"([^"]+)"', m.group(0) if m else ""):
    facility_slugs.add(fm.group(1))

def resolve(href):
    base = href.rstrip("/") or "/"
    if base in STATIC_ROUTES or base in ("/", "/directory", "/about", "/articles"):
        return True
    if href.startswith("/articles/"):
        return href[10:] in article_slugs
    if href.startswith("/directory/"):
        return href[11:] in facility_slugs
    return False

errors, warnings = [], []

# cluster names actually in use (for the README cross-check)
cluster_names = set()
for fn in sorted(os.listdir(ART)):
    if not fn.endswith(".md"):
        continue
    path = os.path.join(ART, fn)
    raw = open(path, encoding="utf-8").read()
    parts = raw.split("---", 2)
    if len(parts) < 3:
        errors.append(f"{fn}: cannot split frontmatter")
        continue
    fm_raw, body = parts[1], parts[2]

    def fm_val(key):
        m = re.search(rf'^{key}:\s*(.+)$', fm_raw, re.M)
        if not m:
            return None
        v = m.group(1).strip()
        if len(v) >= 2 and v[0] == v[-1] and v[0] in ('"', "'"):
            v = v[1:-1]
        return v.strip()

    slug = fm_val("slug")
    title = fm_val("title") or ""
    meta = fm_val("meta_description") or ""
    author = fm_val("author") or ""

    for key in REQUIRED:
        if key not in fm_raw:
            errors.append(f"{fn}: missing frontmatter key {key}")
    if slug != fn[:-3]:
        errors.append(f"{fn}: slug '{slug}' != filename")
    if len(title) > 56:
        errors.append(f"{fn}: title {len(title)} > 56: {title}")
    if not (100 <= len(meta) <= 170):
        errors.append(f"{fn}: meta_description {len(meta)} chars")
    if author != "Kevin Jonathan Otieno":
        errors.append(f"{fn}: author '{author}'")
    for k in ("published_date", "updated_date"):
        v = fm_val(k) or ""
        if not re.match(r"^\d{4}-\d{2}-\d{2}$", v):
            errors.append(f"{fn}: {k} not ISO: {v}")
    if fm_val("published_date") and fm_val("published_date") > fm_val("updated_date"):
        errors.append(f"{fn}: published > updated")

    for img in re.findall(r'src:\s*"([^"]+)"', fm_raw):
        if not os.path.exists(os.path.join(REPO, "public" + img)):
            errors.append(f"{fn}: image missing {img}")
    for pos in re.findall(r'position:\s*"([^"]+)"', fm_raw):
        if pos not in VALID_POSITIONS:
            errors.append(f"{fn}: bad image position {pos}")
    if fm_val("og_image") and not os.path.exists(os.path.join(REPO, "public" + fm_val("og_image"))):
        errors.append(f"{fn}: og_image missing {fm_val('og_image')}")

    links = re.findall(r'href:\s*"([^"]+)"', fm_raw)
    links += re.findall(r'\]\((/[^)#]+)\)', body)
    for href in links:
        if href.startswith(("http", "/images/", "/feed", "/sitemap", "/api/")):
            continue
        if href.startswith("/articles/") and "#" in href:
            href = href.split("#")[0]
        if not resolve(href):
            errors.append(f"{fn}: broken link {href}")

    if "\u2014" in raw:
        errors.append(f"{fn}: em dash found")
    n_faq = len(re.findall(r'^\s*- question:', fm_raw, re.M))
    if n_faq < 2:
        errors.append(f"{fn}: only {n_faq} FAQ questions")
    n_src = len(re.findall(r'^\s*- title:', fm_raw, re.M))
    if n_src < 1:
        errors.append(f"{fn}: no external sources")
    words = len(re.sub(r'\s+', ' ', body).split())
    if words < 800:
        errors.append(f"{fn}: body only {words} words")
    # decorative separators: a line made only of dashes/equals. Markdown
    # table delimiter rows start with '|' so they are not matched.
    if re.search(r"^-{8,}[ \t]*$", body, re.M):
        warnings.append(f"{fn}: decorative dash separator line (use proper markdown)")
    if re.search(r"^={5,}[ \t]*$", body, re.M):
        warnings.append(f"{fn}: decorative equals separator line (use proper markdown)")

    fm_cluster = re.search(r'^cluster:\s*"?([^"\n]+)"?\s*$', fm_raw, re.M)
    if fm_cluster:
        cluster_names.add(fm_cluster.group(1).strip())

# README stats cross-check: claimed counts must match the content directory
readme_path = os.path.join(REPO, "README.md")
readme = open(readme_path, encoding="utf-8").read()
n_articles = len(article_slugs)
for m in re.finditer(r"(\d+)\+?\s+Articles", readme):
    if int(m.group(1)) != n_articles:
        warnings.append(
            f"README: claims {m.group(1)} articles, actual {n_articles} (update README.md)"
        )
for m in re.finditer(r"(\d+)\+?\s+markdown articles", readme):
    if int(m.group(1)) != n_articles:
        warnings.append(
            f"README: claims {m.group(1)} markdown articles, actual {n_articles} (update README.md)"
        )
for m in re.finditer(r"(\d+)\s+clusters?", readme):
    if int(m.group(1)) != len(cluster_names):
        warnings.append(
            f"README: claims {m.group(1)} clusters, actual {len(cluster_names)}: "
            f"{sorted(cluster_names)} (update README.md)"
        )

print(f"articles checked: {len(article_slugs)}")
print(f"clusters: {len(cluster_names)}")
if warnings:
    print(f"\n{len(warnings)} WARNINGS:")
    for w in warnings:
        print(f"  {w}")
if errors:
    print(f"\n{len(errors)} ERRORS:")
    for e in errors:
        print(f"  {e}")
    sys.exit(1)
print("ALL OK")
