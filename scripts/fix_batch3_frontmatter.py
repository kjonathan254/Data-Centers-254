#!/usr/bin/env python3
"""Fix frontmatter issues in Batch 3 articles:
1. internal_links: bare URLs -> {text, href} objects; {text, url} -> {text, href}
2. reading_time: number -> "X min" string
3. image position: invalid values -> valid ones (hero, section-break, inline)
"""

import re
import yaml
import sys
from pathlib import Path

VALID_POSITIONS = {"hero", "section-break", "inline", "infographic", "comparison"}

# Mapping of invalid positions to valid ones
POSITION_MAP = {
    "after-intro": "hero",
    "after-introduction": "hero",
    "after_introduction": "hero",
    "mid-article": "section-break",
    "mid_article": "section-break",
    "section-break": "section-break",
    "before-conclusion": "inline",
    "before-commissioning": "inline",
    "before-comparison": "inline",
    "near_end": "inline",
    "after-entry-level": "section-break",
    "after-mid-level": "section-break",
    "after-senior-level": "inline",
    "after-infrastructure": "section-break",
    "after-networking": "section-break",
    "after-power-cooling": "inline",
}

BATCH3_SLUGS = [
    "data-centre-design-build-kenya",
    "data-centre-interconnection-peering-kenya",
    "kenya-data-sovereignty-localisation",
    "building-codes-data-centres-kenya",
    "career-progression-african-data-centres",
    "data-centre-certifications-kenya",
    "ai-model-training-kenya-use-cases",
    "kenya-digital-economy-data-centre-demand",
    "what-is-hyperscale-data-centre",
    "ups-backup-power-kenyan-data-centres",
]

ARTICLES_DIR = Path("/home/z/my-project/content/articles")


def slug_to_text(slug_path: str) -> str:
    """Convert /articles/some-slug to readable text."""
    slug = slug_path.replace("/articles/", "").replace("-", " ").title()
    return slug


def fix_internal_links(links):
    """Fix internal_links to be {text, href} objects."""
    fixed = []
    for link in links:
        if isinstance(link, str):
            fixed.append({"text": slug_to_text(link), "href": link})
        elif isinstance(link, dict):
            text = link.get("text", "")
            # Handle both 'url' and 'href' keys
            href = link.get("href") or link.get("url", "")
            if not text:
                text = slug_to_text(href)
            fixed.append({"text": text, "href": href})
    return fixed


def fix_reading_time(rt):
    """Fix reading_time to be 'X min' string."""
    if isinstance(rt, int):
        return f"{rt} min"
    if isinstance(rt, str):
        # If it's just a number as string
        if rt.strip().isdigit():
            return f"{rt.strip()} min"
        # If it already has 'min'
        if "min" in rt.lower():
            return rt
        return f"{rt} min"
    return str(rt)


def fix_image_positions(images):
    """Fix image positions to valid values."""
    fixed = []
    for img in images:
        pos = img.get("position", "inline")
        if pos in VALID_POSITIONS:
            fixed.append(img)
        elif pos in POSITION_MAP:
            img["position"] = POSITION_MAP[pos]
            fixed.append(img)
        else:
            img["position"] = "inline"
            fixed.append(img)
    return fixed


def process_article(filepath: Path):
    with open(filepath, "r") as f:
        content = f.read()

    # Parse frontmatter
    if not content.startswith("---"):
        print(f"  SKIP: No frontmatter found")
        return False

    parts = content.split("---", 2)
    if len(parts) < 3:
        print(f"  SKIP: Malformed frontmatter")
        return False

    fm_str = parts[1]
    body = parts[2]
    
    # Strip leading newline from body
    if body.startswith("\n"):
        body = body[1:]

    try:
        fm = yaml.safe_load(fm_str)
    except yaml.YAMLError as e:
        print(f"  ERROR: YAML parse error: {e}")
        return False

    changed = False

    # Fix internal_links
    if "internal_links" in fm:
        old_links = fm["internal_links"]
        new_links = fix_internal_links(old_links)
        if new_links != old_links:
            fm["internal_links"] = new_links
            changed = True
            print(f"  Fixed internal_links: {len(old_links)} items")

    # Fix reading_time
    if "reading_time" in fm:
        old_rt = fm["reading_time"]
        new_rt = fix_reading_time(old_rt)
        if new_rt != old_rt:
            fm["reading_time"] = new_rt
            changed = True
            print(f"  Fixed reading_time: {old_rt!r} -> {new_rt!r}")

    # Fix image positions
    if "images" in fm:
        old_imgs = fm["images"]
        new_imgs = fix_image_positions(old_imgs)
        if new_imgs != old_imgs:
            fm["images"] = new_imgs
            changed = True
            print(f"  Fixed image positions")

    if not changed:
        print(f"  OK: No fixes needed")
        return False

    # Rebuild file
    new_fm_str = yaml.dump(fm, default_flow_style=False, allow_unicode=True, sort_keys=False)
    # Ensure strings are quoted properly
    new_fm_str = re.sub(r"^reading_time: (.+)$", lambda m: f'reading_time: "{m.group(1)}"' if '"' not in m.group(1) else f'reading_time: {m.group(1)}', new_fm_str, flags=re.MULTILINE)
    
    new_content = f"---\n{new_fm_str}---\n\n{body}"
    
    with open(filepath, "w") as f:
        f.write(new_content)
    
    print(f"  SAVED")
    return True


def main():
    fixed_count = 0
    for slug in BATCH3_SLUGS:
        filepath = ARTICLES_DIR / f"{slug}.md"
        if not filepath.exists():
            print(f"MISSING: {filepath}")
            continue
        print(f"Processing: {slug}")
        if process_article(filepath):
            fixed_count += 1
    print(f"\nFixed {fixed_count}/{len(BATCH3_SLUGS)} articles")


if __name__ == "__main__":
    main()