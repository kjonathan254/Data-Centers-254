#!/usr/bin/env python3
"""DC254 title shortening pass (Task 41).

Two fixes:
1. Static pages hardcode " | Data Centre 254" inside openGraph/twitter
   title strings. Next.js ALSO applies the root template "%s | DC254"
   to those strings (verified live: og:title rendered double-branded,
   e.g. FAQ og:title = 61 chars, compare = 65). Strip the hardcoded
   suffix so the template brands each social title exactly once.
2. 21 article frontmatter titles sat at 57-59 chars. All under the 60
   hard limit but with no pixel headroom (Google truncates ~580px).
   Trim each to <=55 while keeping every keyword front-loaded.
   H1/og/JSON-LD all derive from fm.title, so they shorten together.
   No cross-file references to the old strings exist (checked).
"""
import os, re, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ── 1. Strip hardcoded suffix in static page metadata ────────────────────
STRIP = re.compile(r'(title:\s*"[^"]*?)\s*\|\s*Data Centre 254"')
changed_files, n_subs = [], 0
for root, _dirs, files in os.walk(os.path.join(REPO, "src", "app")):
    for fn in files:
        if not fn.endswith(".tsx"):
            continue
        p = os.path.join(root, fn)
        with open(p, encoding="utf-8") as f:
            code = f.read()
        new, n = STRIP.subn(r'\1"', code)
        if n:
            with open(p, "w", encoding="utf-8") as f:
                f.write(new)
            changed_files.append(f"{os.path.relpath(p, REPO)} ({n})")
            n_subs += n
print(f"[1] stripped hardcoded '| Data Centre 254' from {n_subs} title strings "
      f"in {len(changed_files)} files:")
for c in sorted(changed_files):
    print(f"      {c}")

# ── 2. Article title rewrites ────────────────────────────────────────────
REWRITES = [
    ("5G Networks and Their Impact on Data Centre Demand in Kenya",
     "5G Networks and Data Centre Demand in Kenya"),
    ("AI Ethics and Governance for Data Centres and Tech in Kenya",
     "AI Ethics and Governance for Data Centres in Kenya"),
    ("Data Centre Cooling Systems: How Servers Stay Cool in Kenya",
     "Data Centre Cooling: How Servers Stay Cool in Kenya"),
    ("Fibre Networks Powering Kenya's Data Centres: The Last Mile",
     "Fibre Networks and Kenya's Data Centre Last Mile"),
    ("Large Language Models in Kenya: Adoption and Infrastructure",
     "Large Language Models in Kenya: Adoption and Compute"),
    ("What Is a Data Centre? A Plain-Language Guide for Beginners",
     "What Is a Data Centre? A Plain-Language Guide"),
    ("What Is a Server? The Machines That Power Everything Online",
     "What Is a Server? The Machines Powering the Internet"),
    ("What Is a Data Centre SLA? Understanding Uptime Guarantees",
     "What Is a Data Centre SLA? Uptime Guarantees"),
    ("Kenya ICT Policy Framework and Data Centre Industry Impact",
     "Kenya ICT Policy and Data Centre Industry Impact"),
    ("Safaricom Data Centres: M-Pesa, 5G and the Digital Economy",
     "Safaricom Data Centres: M-Pesa, 5G, Digital Economy"),
    ("Women in Data Centres: Growing Kenya's Technical Workforce",
     "Women in Data Centres: Kenya's Technical Workforce"),
    ("Amaco's Mombasa AI Data Centre: A Power Plant That Floats",
     "Amaco's Mombasa AI Data Centre: A Floating Power Plant"),
    ("Data Centre Cabling Standards and Best Practices in Kenya",
     "Data Centre Cabling Standards and Practices in Kenya"),
    ("Digital Realty Launches NBO2: The 'Gateway' Claim, Tested",
     "Digital Realty's NBO2: The 'Gateway' Claim, Tested"),
    ("Europe's Playbook for Africa's Digital Edge: Kenya's Part",
     "Europe's Digital Playbook for Africa: Kenya's Part"),
    ("Geothermal Power for Kenya's Data Centres: Rift Advantage",
     "Geothermal for Kenya's Data Centres: Rift Advantage"),
    ("CA Opens Consultation on a Standalone Data Centre Licence",
     "CA Consultation: Standalone Data Centre Licence"),
    ("Kenya Data Sovereignty and Data Localisation Requirements",
     "Kenya Data Sovereignty and Data Localisation"),
    ("Kenya Internet Speeds and What They Mean for Data Centres",
     "Kenya Internet Speeds: What They Mean for Data Centres"),
    ("Konza Technopolis and the Future of Data Centres in Kenya",
     "Konza Technopolis and Kenya's Data Centre Future"),
    ("Raxio vs Africa Data Centres in Kenya: What's Real (2026)",
     "Raxio vs Africa Data Centres in Kenya: What's Real"),
]
ART = os.path.join(REPO, "content", "articles")
done, fail = [], []
for old, new in REWRITES:
    if len(new) > 55:
        fail.append(f"new title too long ({len(new)}): {new}")
    hits = 0
    for fn in sorted(os.listdir(ART)):
        if not fn.endswith(".md"):
            continue
        p = os.path.join(ART, fn)
        with open(p, encoding="utf-8") as f:
            txt = f.read()
        needle = f'title: "{old}"'
        if needle in txt:
            txt = txt.replace(needle, f'title: "{new}"', 1)
            with open(p, "w", encoding="utf-8") as f:
                f.write(txt)
            hits += 1
            done.append(f"{fn[:-3]}: {len(old)} -> {len(new)}  {new}")
            break  # exact old title can only live in one frontmatter
    if hits == 0:
        fail.append(f"NOT FOUND in any frontmatter: {old}")

print(f"\n[2] article titles rewritten: {len(done)}/{len(REWRITES)}")
for d in done:
    print(f"      {d}")
if fail:
    print("\n[FAILURES]")
    for f_ in fail:
        print(f"      {f_}")
    sys.exit(1)
print("\nOK")
