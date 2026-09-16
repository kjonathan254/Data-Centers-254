#!/usr/bin/env python3
"""Gap 6 (KIXP peering) verification pass, 16 Sep 2026.
New verified facts with sources:
- ISOC (24 Jun 2020): KIXP peak 1 Gbps (2012) -> 19 Gbps (2020)
- TESPOK (25 Jun 2024): historic peak 1.3 Tbps
- iXAfrica press release (10 Dec 2024): KIXP peering node partnership
- PeeringDB (Apr 2026 snapshot): 142 peers, 158 connections, 3.0 Tbps capacity
- CA sector statistics Q3 2025/26 (reported 19 Jun 2026): 84.1M active mobile
  subscriptions, 62.6M mobile broadband
"""
import re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
F = "content/articles/kixp-internet-exchange-point-kenya.md"

def rep(old, new, count=1):
    p = ROOT / F
    t = p.read_text(encoding="utf-8")
    n = t.count(old)
    if n != count:
        print(f"[FAIL] {n} matches (want {count}) for: {old[:70]!r}"); sys.exit(1)
    p.write_text(t.replace(old, new), encoding="utf-8")
    print(f"[OK] {old[:60]!r}")

def faq_block(old_q, new_a):
    """Update a frontmatter FAQ answer that repeats as a body FAQ."""
    rep(old_q, new_a)

# 1. Growth paragraph: fix the wrong 2018 claim + stale 100 Gbps
rep(
"By 2012, KIXP was handling over 1 Gbps of traffic. By 2018, it had crossed 30 Gbps. Today, peak traffic exceeds 100 Gbps, with over 60 connected members.",
"By 2012, KIXP was handling over 1 Gbps of peak traffic, and the Internet Society measured 19 Gbps by 2020, with the exchange's cost savings to members quadrupling over the previous decade. The curve then steepened dramatically: TESPOK announced a historic peak of 1.3 Tbps in June 2024, and by April 2026 PeeringDB listed KIXP Nairobi with 142 peering networks, 158 connections and 3 Tbps of connected port capacity. Each local cache a network installs compounds the effect, because cached content pulls more traffic onto the exchange.")

# 2. Frontmatter FAQ traffic answer
rep(
'answer: "KIXP handles over 100 Gbps of peak traffic, making it one of the largest IXPs in East Africa. The volume has grown significantly as more content providers and cloud services establish local presence."',
'answer: "KIXP\u0027s peak traffic reached a historic 1.3 Tbps in June 2024 (TESPOK), and by April 2026 PeeringDB listed 142 peering networks with 3 Tbps of connected capacity, making KIXP one of the largest internet exchange points in East Africa. Growth has accelerated as content providers, cloud platforms and now AI workloads establish local presence."')

# 3. Body FAQ (same wording as frontmatter, appears twice -> use the body copy)
rep(
"KIXP handles over 100 Gbps of peak traffic, making it one of the largest IXPs in East Africa. The volume has grown significantly as more content providers and cloud services establish local presence.",
"KIXP\u0027s peak traffic reached a historic 1.3 Tbps in June 2024 (TESPOK), and by April 2026 PeeringDB listed 142 peering networks with 3 Tbps of connected capacity, making KIXP one of the largest internet exchange points in East Africa. Growth has accelerated as content providers, cloud platforms and now AI workloads establish local presence.")

# 4. Technical infrastructure: add the December 2024 iXAfrica node
rep(
"KIXP operates multiple switching platforms across two or more data centre facilities in Nairobi to ensure redundancy.",
"KIXP operates multiple switching platforms across carrier-neutral data centre facilities in Nairobi to ensure redundancy, and in December 2024 it announced a peering node partnership with iXAfrica Data Centers, extending the exchange into one of the facilities where cloud and AI workloads are now hosted.")

# 5. Comparison section: fix stale NAPAfrica/IXPN framing
rep(
"South Africa's NAPAfrica, based in Johannesburg and Cape Town, handles significantly more traffic (over 1 Tbps at peak) due to the country's larger economy and more developed hosting sector. Nigeria's IXPN, based in Lagos and Abuja, handles comparable volumes to KIXP. But on a per-capita basis, Kenya's peering ecosystem punches above its weight.",
"South Africa's NAPAfrica, based in Johannesburg and Cape Town, handles several times KIXP's volume due to the country's larger economy and more developed hosting sector, though KIXP's 1.3 Tbps peak now puts it in the same terabit class as the biggest African exchanges. Nigeria's IXPN, based in Lagos and Abuja, has grown rapidly on similar dynamics. But on a per-capita basis, Kenya's peering ecosystem punches above its weight.")

# 6. Closing section: update CA subscriber stats
rep(
"Kenya's internet user base continues to grow. The Communications Authority of Kenya reports over 25 million internet subscribers as of 2025, with mobile internet penetration exceeding 60%.",
"Kenya's internet user base continues to grow. The Communications Authority of Kenya counted 84.1 million active mobile subscriptions and 62.6 million mobile broadband subscriptions in the third quarter of the 2025/26 financial year, with mobile broadband uptake still climbing quarter on quarter.")

# 7. Sources
rep(
'external_sources:\n  - title: "Internet Society - Internet Exchange Points"\n    url: "https://www.internetsociety.org/resources/deploying-internet-exchange-points/"\n  - title: "KIXP - Kenya Internet Exchange Point"\n    url: "https://www.kixp.or.ke/"',
'external_sources:\n  - title: "Internet Society - Internet Exchange Points"\n    url: "https://www.internetsociety.org/resources/deploying-internet-exchange-points/"\n  - title: "KIXP - Kenya Internet Exchange Point"\n    url: "https://www.kixp.or.ke/"\n  - title: "Internet Society: Anchoring the African Internet Ecosystem (24 June 2020, KIXP 1 Gbps 2012 to 19 Gbps 2020)"\n    url: "https://www.internetsociety.org/resources/deploy360/2020/anchoring-the-african-internet-ecosystem/"\n  - title: "TESPOK: KIXP historic peak of 1.3 Tbps (25 June 2024)"\n    url: "https://www.facebook.com/tespokkenya/"\n  - title: "iXAfrica press release: KIXP peering node partnership (10 December 2024)"\n    url: "https://ixafrica.co.ke/"\n  - title: "PeeringDB: KIXP Nairobi exchange profile (April 2026 snapshot)"\n    url: "https://www.peeringdb.com/ix/240"\n  - title: "Communications Authority of Kenya sector statistics, Q3 2025/26 (reported 19 June 2026)"\n    url: "https://www.ca.go.ke/"')

# 8. updated_date
p = ROOT / F
t = p.read_text(encoding="utf-8")
t2, n = re.subn(r'(updated_date: ")[\d-]+(")', r"\g<1>2026-09-16\g<2>", t, count=1)
assert n == 1
p.write_text(t2, encoding="utf-8")
print("[OK] updated_date -> 2026-09-16")
print("KIXP PASS COMPLETE")
