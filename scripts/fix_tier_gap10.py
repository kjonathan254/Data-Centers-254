#!/usr/bin/env python3
"""Gap 10 (Tier IV / tier ratings) verification pass, 16 Sep 2026.
Verified facts:
- EADC (now Africa Data Centres) first Tier III Design certification in
  central/eastern Africa, May 2017 (DataCenterDynamics 18 May 2017)
- Raxio: all facilities Uptime Tier III certified, group policy (raxiogroup.com)
- No Kenyan facility on Uptime's issued-awards register at Tier IV (checked
  uptimeinstitute.com awards pages, 16 Sep 2026)
"""
import re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
F = "content/articles/data-centre-tier-ratings-explained.md"

def rep(old, new, count=1):
    p = ROOT / F
    t = p.read_text(encoding="utf-8")
    n = t.count(old)
    if n != count:
        print(f"[FAIL] {n} matches (want {count}): {old[:70]!r}"); sys.exit(1)
    p.write_text(t.replace(old, new), encoding="utf-8")
    print(f"[OK] {old[:58]!r}")

# 1. Frontmatter FAQ: sharpen with dated, verified facts
rep(
'answer: "Most commercial data centres in Nairobi target Tier III certification. iXAfrica NBOX1.1 is designed to Tier III standards. Africa Data Centres\' facilities also target Tier III. Smaller enterprise data centres operated by telecom companies may be Tier II or uncertified."',
'answer: "Most commercial data centres in Nairobi target Tier III. Africa Data Centres\' East Africa Data Centre was the first facility in central and eastern Africa to earn Uptime Institute Tier III Design certification (May 2017), iXAfrica NBOX1 is designed to Tier III standards, and Raxio certifies all of its facilities to Uptime Tier III as a group policy. Smaller enterprise data centres operated by telecom companies may be Tier II or uncertified. As of September 2026, no Kenyan facility has announced Uptime Tier IV certification."')

# 2. Tier III section: dated certification history
rep(
"This is the minimum requirement for most enterprise contracts, banking regulations, and cloud service level agreements. In Kenya, iXAfrica NBOX1.1, Africa Data Centres' Nairobi facilities, and several other commercial operators design to this standard.",
"This is the minimum requirement for most enterprise contracts, banking regulations, and cloud service level agreements. In Kenya, iXAfrica NBOX1, Africa Data Centres' Nairobi facilities, and several other commercial operators design to this standard. The certification history starts earlier than most people think: East Africa Data Centre, now operated by Africa Data Centres, became the first facility in central and eastern Africa to earn Uptime Tier III Design certification in May 2017, and Raxio applies Uptime Tier III certification across its facilities as a group-wide policy.")

# 3. New Kenya-specific Tier IV section (the gap target)
rep(
"Very few facilities in Africa have achieved Tier IV certification. The cost premium over Tier III is substantial, typically 25-40% higher construction cost and 15-25% higher operating cost. For most Kenyan use cases, Tier III provides more than adequate reliability.",
"""Very few facilities in Africa have achieved Tier IV certification. The cost premium over Tier III is substantial, typically 25-40% higher construction cost and 15-25% higher operating cost. For most Kenyan use cases, Tier III provides more than adequate reliability.

## Does Kenya Have a Tier IV Data Centre?

As of September 2026, no data centre in Kenya has announced Uptime Institute Tier IV certification, and DC254 has found no Kenyan facility at Tier IV on the Uptime Institute's issued-awards register. The strongest independently verified reliability claims in the Kenyan market sit at Tier III: East Africa Data Centre (now operated by Africa Data Centres) earned the first Tier III Design certification in central and eastern Africa in May 2017, Raxio applies Uptime Tier III certification across its facilities, and iXAfrica's NBOX1 campus is designed to Tier III standards.

That is not a gap Kenya needs to apologise for. Tier IV exists for workloads where a momentary blip is unacceptable, such as high-frequency trading platforms or hospital life-support systems, and it carries the cost premium described above. Kenya's rational benchmark is Tier III reliability paired with the country's green, low-cost geothermal grid, which is exactly the combination most local operators sell. If your workload genuinely needs fault tolerance, the practical routes are software-level redundancy spread across two independent Tier III facilities (the approach hyperscalers use globally), or waiting for a verified Tier IV announcement. Whenever any operator claims a tier, ask for the Uptime certificate number and check it against the [official register](https://uptimeinstitute.com/resources/research-and-reports/tier-certification-list) rather than the brochure, and see [our Nairobi colocation buyer's guide](/articles/colocation-data-centres-nairobi-buyers-guide) for the questions that actually matter in a lease.""")

# 4. Internal links
rep(
'  - text: "Kenya data centre directory"\n    href: "/directory"',
'  - text: "Nairobi colocation buyer\'s guide"\n    href: "/articles/colocation-data-centres-nairobi-buyers-guide"\n  - text: "Kenya data centre directory"\n    href: "/directory"')

# 5. Sources
rep(
'  - title: "Schneider Electric Data Centre Reference Designs"\n    url: "https://www.se.com/ww/en/work/products-services/offerings/data-centers/"',
'''  - title: "Schneider Electric Data Centre Reference Designs"
    url: "https://www.se.com/ww/en/work/products-services/offerings/data-centers/"
  - title: "DataCenterDynamics: East Africa Data Centre obtains Tier III certification (18 May 2017)"
    url: "https://www.datacenterdynamics.com/en/news/eadc-obtains-tier-iii-certification/"
  - title: "Uptime Institute: List of Tier-Certified Data Centers (checked 16 September 2026)"
    url: "https://uptimeinstitute.com/resources/research-and-reports/tier-certification-list"
  - title: "Raxio Group: all facilities Uptime Institute Tier III Certified (fetched 16 September 2026)"
    url: "https://www.raxiogroup.com/"''')

# 6. updated_date
p = ROOT / F
t = p.read_text(encoding="utf-8")
t2, n = re.subn(r'(updated_date: ")[\d-]+(")', r"\g<1>2026-09-16\g<2>", t, count=1)
assert n == 1
p.write_text(t2, encoding="utf-8")
print("[OK] updated_date -> 2026-09-16")
print("TIER PASS COMPLETE")
