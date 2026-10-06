---
captured_at: 2026-10-06T06:12:01Z
source_url: https://www.peeringdb.com/api/ix/236
final_url: https://www.peeringdb.com/api/ix/236
title: "PeeringDB: KIXP - Nairobi (ix 236) + ISOC Pulse IXP Tracker (ixp/144) + dead-host evidence for kixp.or.ke"
tool: curl (PeeringDB public API, JSON) + platform page_reader (ISOC Pulse, JS-rendered) + curl/DNS probes
http_status: 200 (PeeringDB API)
tier: 1
claims: []
status: capture-pending # becomes verified ONLY after an editor reads and confirms content
note: T1 check commissioned by editor 2026-10-06 ("the peering article's stale KIXP figures (70 members/150 Gbps vs the map's 140/2.9 Tbps) needs a T1 check before I touch it"). Resolution: PeeringDB carries MEMBER COUNT and PORT CAPACITY but no traffic stat; the map's "2.9 Tbps peak traffic" label conflates PeeringDB cumulative port capacity with measured peak traffic.
---

## What this capture resolves

The site carried three conflicting KIXP figure sets:

1. `content/articles/data-centre-interconnection-peering-kenya.md` (2026-08-28):
   "over 70 connected members", "peak traffic volumes exceeding 150 Gbps" —
   cited to https://www.kixp.or.ke (now a dead link, see evidence C below).
2. `src/lib/map-data.ts` since commit 234b216 (2026-09-08):
   `KIXP = { members: 140, peakGbps: 2900 }`, rendered on map surfaces as
   "~2.9 Tbps peak traffic" — with NO source cited in the commit message
   ("map-data: EIG + 2Africa cables added; KIXP 140 members / ~2.9 Tbps").
   Commit history: the pre-234b216 constant was `members: 85, peakGbps: 25`.
3. Tuesday 2026-10-06 carousel + social pack (from the map): "140 KIXP member
   networks, ~2.9 Tbps peak traffic".

## Evidence A — PeeringDB live API (T1, fetched 2026-10-06T06:0xZ via curl)

GET https://www.peeringdb.com/api/ix/236 (KIXP - Nairobi, Kenya Internet
Exchange Point - Nairobi):

- org: "Technology Service Providers of Kenya - TESPOK" (org_id 15670),
  org website http://www.tespok.co.ke
- net_count: **144** (member networks)
- fac_count: 4 (present at 4 facilities)
- city: Nairobi, country: KE, media: Ethernet, proto_ipv6: True
- created: 2010-12-11T00:00:00Z
- notes: "https://www.tespok.co.ke/" (org notes also state the Mombasa IXP
  sits at iColo MBA1)
- NO traffic field exists anywhere in the PeeringDB ix record — PeeringDB
  does not carry measured traffic.

## Evidence B — ISOC Pulse IXP Tracker, KIXP Nairobi (T1-grade aggregator,
synced from PeeringDB October 2026, page_reader capture 2026-10-06)

Source page: https://pulse.internetsociety.org/en/ixp-tracker/ixp/144/
(title "IXP Tracker - Kenya Internet Exchange Point - Nairobi - KIXP -
Nairobi"; links back to https://www.peeringdb.com/ix/236)

Verbatim extracts:

- "Data last updated October 2026"
- "Capacity at this IXP | **2,985 Gbps** | Cumulative port speeds of all IXP
  members. This shows the potential maximum traffic that can be exchanged at
  this IXP at one time."  <-- CAPACITY, explicitly NOT measured traffic
- "Members of this IXP | **143** | ASNs (autonomous systems)"
- "Members using RPKI | 109 / 143"
- "Last sync from PeeringDB: October 2026"
- Countries of registration: Kenya 93, USA 14, South Africa 9, Mauritius 5,
  Hong Kong 5, Uganda 4, South Sudan 2, UK 2, Singapore/Tanzania/Canada/
  Côte d'Ivoire/Belgium/Spain/Israel/Switzerland/Rwanda 1 each
- Network types: NSP 47, Cable/DSL/ISP 44, Unknown 21, Content 11,
  Network Services 6, Enterprise 6, Non-Profit 4, Educational/Research 3,
  Route Server 1

ISOC Pulse Kenya country page
(https://pulse.internetsociety.org/en/ixp-tracker/country/KE/, same capture):

- 5 IXPs listed in PeeringDB for Kenya (Asteroid Nairobi, KIXP-Mombasa,
  KIXP - Nairobi, LINX Mombasa, LINX Nairobi), "Last updated October 2026"
- "89% of networks are either members of IXPs themselves, or they are
  customers of IXP members" (of 225 active networks in Kenya)
- "40% of the 1000 most-visited websites in Kenya can be accessed through an
  in-country server or cache"

## Evidence C — kixp.or.ke is unreachable / the article's cited link is dead
(probes 2026-10-06)

- DNS: `www.kixp.or.ke` = NXDOMAIN (local resolver AND JINA reader service:
  "Domain 'www.kixp.or.ke' could not be resolved"). The article's external
  source link and both in-body links point at the www host — dead.
- DNS: apex `kixp.or.ke` resolves to 196.6.220.14 (same Kenyan block as
  www.tespok.co.ke = 196.6.220.16) but connection refused/unreachable:
  curl HTTPS and HTTP both HTTP 000; JINA headless: "net::ERR_ADDRESS_UNREACHABLE".
  The exchange's own website is down or firewalled to non-Kenyan networks.
- Wayback (web.archive.org) unreachable from this sandbox — archive capture
  of the site's last published stats NOT obtained (follow-up).

## Evidence D — TESPOK "KIXP Statistics" page is an empty shell

https://www.tespok.co.ke/?page_id=6299 (fetched 2026-10-06, curl 200):
page titled "KIXP Statistics" exists but the body contains navigation and
contact blocks only — NO figures published. KIXP's figures are therefore
currently publishable ONLY via PeeringDB/ISOC Pulse or TESPOK press statements.

## Evidence E — corroboration (T2/T3, not independent measurement)

- Lineserve (kenyan host, marketing pages, 2026): "PeeringDB records 141
  peer netw[orks]" — consistent with the 143–144 October 2026 PeeringDB range.
- tech.africa 2026-06-03 "Kenya's KIXP interconnects two Mombasa data
  centres": "KIXP's two Mombasa points of presence, at ICOLO data centres in
  Miritini and Nyali, are now interconnected. Source: TESPOK / KIXP."
- techafricanews 2025-08-18: KIXP coastal PoP at iColo Mombasa.

## Analysis and editorial conclusion

1. MEMBER COUNT: PeeringDB net_count 144 (live API, 2026-10-06); Pulse shows
   143 ASNs (its October sync) + 1 route server in the type breakdown.
   "144 member networks (PeeringDB, October 2026)" is the defensible exact
   figure; "over 140" is the defensible loose figure. The article's "over 70"
   (2025) and the pre-Sept map value (85) are both stale.
2. THE "2.9 Tbps" NUMBER: the only current, citable ~2.9–3 Tbps figure is
   PeeringDB/Pulse **cumulative member port capacity (2,985 Gbps)**, which
   Pulse explicitly describes as "the potential maximum traffic". The map's
   label "peak traffic ~2.9 Tbps" is a CAPACITY/TRAFFIC CONFLATION introduced
   in commit 234b216 (2026-09-08) with no cited source. Plausibility check:
   NAPAfrica — Africa's largest IXP — reported peak volumes around/above
   2 Tbps; KIXP at 2.9 Tbps of measured traffic would exceed it, which no
   news source reports. Conclusion: relabel to capacity.
3. MEASURED PEAK TRAFFIC: NO current T1 exists (KIXP site down, TESPOK stats
   page empty, PeeringDB carries no traffic, Euro-IX IXPDB entry not
   retrievable today). The article's "peak traffic exceeding 150 Gbps"
   (as of 2025, dead link) is the last published traffic-ish figure but is
   now UNVERIFIABLE. Honest fix: stop quoting a measured-traffic number;
   use PeeringDB capacity + member count, and note KIXP's own statistics
   page is currently offline.
4. The 2026-10-06 carousel/social pack inherited the map's mislabel
   ("140 KIXP member networks, ~2.9 Tbps peak traffic") and must be
   regenerated alongside this fix.

## Consequential edits authorized by the editor's commission (site-betterment,
standing authorization 2026-10-03)

- src/lib/map-data.ts: KIXP members 140 -> 144; peakGbps 2900 -> capacityGbps
  2985; wording on all render surfaces "peak traffic" -> "connected capacity".
- Peering article FAQ + History + NAPAfrica comparison + external_sources +
  updated_date.
- chatbot knowledge.ts KIXP card.
- verify_two_cities_20261006.py + carousel slide 2/5 + social pack copy.
- Regional IXPs (TIX/UIXP/RINEX/ET-IXP) still carry unverified old
  "peak" figures — flagged for a follow-up T1 pass (Pulse per-IXP pages),
  NOT edited in this pass.
