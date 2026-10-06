---
captured_at: 2026-10-06T17:47:19Z
source_url: https://www.linkedin.com/posts/communications-authority-of-kenya_111-billion-cyber-threats-detected-831-activity-7513169843496550400-GP_g
final_url: https://www.linkedin.com/posts/communications-authority-of-kenya_111-billion-cyber-threats-detected-831-activity-7513169843496550400-GP_g
title: "Communications Authority of Kenya (official LinkedIn): KE-CIRT/CC FY 2025/26 - 11.1 billion detected cyber threats (+29.0% YoY), 83.1 million advisories (+60.8% YoY)"
tool: curl (anonymous fetch of public LinkedIn post; schema.org SocialMediaPosting JSON-LD + og/twitter meta) + official post image downloaded and transcribed
http_status: 200
tier: 1
claims: []
status: capture-pending # becomes verified ONLY after an editor reads and confirms content
note: Editor URL drop 2026-10-06 (digest pattern, no instruction). T1 first-party announcement by the regulator on its own channel, published the same day. NEW ANNUAL figure (FY 2025/26) on a different basis than the site's quarterly KE-CIRT/CC series - reconciliation flag inside; no site surfaces edited in this pass.
---

## What this capture is

The Communications Authority of Kenya (CA) published on its official LinkedIn
page (12:34 EAT, 6 October 2026) an announcement of the "latest National
KE-CIRT/CC figures": 11.1 billion detected cyber threats and 83.1 million
advisories. The caption alone omits the reporting period; the official post
image states it: **FY 2025/26** (Kenya's financial year, July 2025 to June
2026), with year-on-year percentages. This is a Tier-1 first-party source: the
regulator announcing its own team's statistics.

Post metadata (JSON-LD SocialMediaPosting block):

- @id / canonical: https://www.linkedin.com/posts/communications-authority-of-kenya_111-billion-cyber-threats-detected-831-activity-7513169843496550400-GP_g
- author: Communications Authority of Kenya (Organization, official page)
- datePublished: 2026-10-06T09:34:38.634Z (= 12:34 EAT)
- commentCount: 1; post image 1080x1350 JPEG
- Tracking params on the editor's shared URL (utm_source=share,
  utm_medium=member_android, rcm=ACoAABgvP-QBT9VYyV9vE1BHRi4M2w9_iST-SXE)
  stripped; canonical used throughout.

## Evidence A - full caption, verbatim (JSON-LD articleBody)

> "11.1 billion cyber threats detected. 83.1 million advisories issued.
> As Kenya's digital ecosystem continues to grow, so does the need for
> heightened cyber vigilance. The latest National KE-CIRT/CC figures
> underscore the importance of staying alert, reporting incidents and
> strengthening protection across the digital space.
> Stay informed"

The caption carries NO reporting period, NO YoY percentages, and NO
definition of what counts as a "detected" threat. The og:title /
og:description / twitter meta tags repeat the same text. The caption's
"Stay informed" tail corresponds to the www.ca.go.ke button on the image.

## Evidence B - official post image, verbatim transcription (load-bearing)

Image: https://media.licdn.com/dms/image/v2/D4D22AQH2vXZfyQMqwg/feedshare-image-high-res/B4DaEQkKLrK4AU-/0/1791279277048?e=2147483647&v=beta&t=NfCrDl_mjLRzs3TrSbRxoxaYGBRPSFblxTdn_zZpxvE
(signature expiry set to int64 max, effectively permanent). Local archive:
sandbox tmp/ca-cirt-post-image.png (SHA-relevant text transcribed below;
branded CA header, hero figure, quote block).

- Hero: "11.1B / Cyber threats detected"
- Subline: "11.1B cyber threats detected and 83.1M advisories issued"
- Section head: "Digital growth calls for continued cyber vigilance"
- "As Kenya's digital activity grows, cybersecurity remains essential."
- Quote block: "The National KE-CIRT/CC recorded **11.1 billion detected
  cyber threats during FY 2025/26**, up **29.0%** from the previous financial
  year. Cyber advisories issued to affected ICT users rose by **60.8%** to
  **83.1 million**."
- "These figures reinforce the need for continued awareness, reporting and
  protection across the digital ecosystem."
- Footer: www.ca.go.ke

Everything the caption omits, the image supplies: period (FY 2025/26), both
YoY deltas (29.0% / 60.8%), and the advisories definition ("issued to
affected ICT users").

## Derived context (arithmetic on the T1's own numbers, clearly derived)

- +29.0% YoY implies FY 2024/25 ≈ 8.6 billion detected threats
  (11.1 / 1.29 = 8.60).
- +60.8% YoY implies FY 2024/25 advisories ≈ 51.7 million
  (83.1 / 1.608 = 51.7).

## RECONCILIATION FLAG - do not mix into the site's quarterly series yet

The site's on-file KE-CIRT/CC series is QUARTERLY and internally consistent
(content/articles/kenya-data-breach-timeline.md, external_sources + FAQ +
body; also data-centre-security-threats-kenya.md and
data-centre-attack-scenarios-kenya.md):

- Q2 2024 (Apr-Jun 2024): over 1.1 billion threat events
- Q4 2024 (Oct-Dec 2024): over 840 million
- Q3 2025 (Jul-Sep 2025): ~842 million

Q3 2025 is the FIRST quarter of FY 2025/26. Four quarters at that run-rate
totals ~3.4 billion, not 11.1 billion. So the annual figure is on a
materially different basis from the quarterly series (detection-basis change,
aggregation change, or genuinely massive later-FY spikes), OR "11.1 billion"
is cumulative across multiple periods with "FY 2025/26" loose phrasing on the
card. The post alone cannot resolve this. The single LinkedIn comment on the
post (2026-10-06T15:08Z, user "ikPin™") independently asks for the
methodology and cites "20.7 million advisories" - a fifth figure not present
in the post. KIXP lesson (Task 80) applied: capture verbatim, label the
metric, publish nothing that forces unreconciled series together.

## Disposition - LEAD (freshness upgrade candidate, deferred pending reconciliation)

This is a genuine T1 freshness upgrade for the threat-scale framing on three
surfaces ONCE the underlying bulletin is captured and the annual-vs-quarterly
basis reconciled:

1. data-centre-security-threats-kenya.md - FAQ "How much cyberattack traffic
   does Kenya actually see?" (currently Q4 2024 + Q2 2024 quarterly) and the
   closing "Putting the layers together" scale paragraph; its external_sources
   entry cites bare https://www.ca.go.ke/ and could gain the canonical post
   URL as the announcement-of-record link.
2. kenya-data-breach-timeline.md - the quarterly-series paragraph and FAQ
   (would gain the FY 2025/26 annual line WITH its basis stated).
3. data-centre-attack-scenarios-kenya.md - "hundreds of millions of threat
   events per quarter" line stays quarterly-correct; annual figure optional.

NOT a policy-registry claim: the registry's cyber entries are institutional/
instrument facts (e.g. Rwanda NCSA); operational statistics like this belong
to article threat-scale framing. No KE cybersecurity gap entry exists to
upgrade.

NOT related to KE-LC-C3: this is cyber statistics, not the data-centre
licensing consultation; no Policy Watch interaction beyond the editor's
general CA-channel watch.

## Follow-up hunt (next session, before any article edit)

1. CA resource centre / annual report for FY 2025/26 KE-CIRT/CC statistics
   (the bulletin behind this post) - ca.go.ke is challenge-blocked for curl;
   the Context.dev scrape path is proven.
2. FY 2025/26 quarterly bulletins (Oct-Dec 2025, Jan-Mar 2026, Apr-Jun 2026)
   to reconcile against the ~842M Q3 2025 run-rate and identify the basis.
3. If CA publishes a methodology note or the bulletin contradicts the card,
   capture it and correct here before any surface edit.
