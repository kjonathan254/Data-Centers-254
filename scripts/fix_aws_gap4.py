#!/usr/bin/env python3
"""Gap 4 (AWS edge) verification pass, 16 Sep 2026.
New verified fact: AWS opened a Direct Connect location inside East African
Data Centres NBO1 near Nairobi on 3 September 2025 (AWS announcement).
Local Zone Nairobi already covered (locations page fetched 16 Sep 2026).
"""
import sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
F = "content/articles/reduce-cloud-latency-kenya.md"

def rep(old, new, count=1):
    p = ROOT / F
    t = p.read_text(encoding="utf-8")
    n = t.count(old)
    if n != count:
        print(f"[FAIL] {n} matches (want {count}): {old[:70]!r}"); sys.exit(1)
    p.write_text(t.replace(old, new), encoding="utf-8")
    print(f"[OK] {old[:58]!r}")

# 1. Fix-two section: add the Direct Connect fact
rep(
"If your workloads already run on AWS, this is the road of least change.",
"If your workloads already run on AWS, this is the road of least change. There is also a private pipe option: in September 2025 AWS opened a Direct Connect location inside East African Data Centres NBO1 near Nairobi (AWS announcement, 3 September 2025). Direct Connect is AWS's dedicated private link between your own equipment and AWS, bypassing the public internet entirely, which buys predictable latency and bandwidth for hybrid setups where part of the workload sits in Kenya and the rest in a full AWS region.")

# 2. FAQ (frontmatter + body): append Direct Connect
rep(
"AWS announced Nairobi among 32 new Local Zone metros in February 2022. For bigger workloads, the nearest full AWS regions remain outside Kenya, so many teams mix Local Zones or local hosts with a main region.",
"AWS announced Nairobi among 32 new Local Zone metros in February 2022. Since September 2025 there is also an AWS Direct Connect location inside East African Data Centres NBO1 near Nairobi, a private network pipe straight into AWS. For bigger workloads, the nearest full AWS regions remain outside Kenya, so many teams mix Local Zones, Direct Connect or local hosts with a main region.", count=2)

# 3. Source
rep(
'  - title: "Business Wire, AWS Announces Global Expansion of AWS Local Zones (16 Feb 2022; Nairobi among 32 new metros planned)"',
'  - title: "AWS Direct Connect announces new location in Nairobi, Kenya (3 September 2025; East African Data Centres NBO1)"\n    url: "https://aws.amazon.com/about-aws/whats-new/2025/09/aws-direct-connect-location-nairobi-kenya/"\n  - title: "Business Wire, AWS Announces Global Expansion of AWS Local Zones (16 Feb 2022; Nairobi among 32 new metros planned)"')

print("AWS EDGE PASS COMPLETE")
