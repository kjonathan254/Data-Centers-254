# DC254 Two Cities Social Pack · Tuesday 6 October 2026

**Theme: Nairobi is the data-centre cluster. Mombasa is the connectivity gateway.**
**Assets: 7-slide LinkedIn carousel (1080x1350 4:5), this pack.**
**All figures verified 6 October 2026 against the dataset the site renders
(scripts/verify_two_cities_20261006.py): directory, cable tracker, map data.**

---

## VERIFICATION NOTE (read before posting)

Two figures in the original brief changed after verification:

- **Nairobi: 19 tracked data centres, not 17.** The dataset (directory, Q3 2026)
  carries 19 Nairobi records: 13 operational, 6 in the pipeline (2 under
  construction, 1 committed, 3 early stage). This also matches what the site
  already published on Friday ("Nairobi 19" in the What Is Actually Live
  article) and in Issue 002 - posting 17 today would contradict the site's own
  reporting from four days ago. The correction strengthens the angle: 19 of 27
  is 70% of everything tracked nationally.
- **KIXP: 144 member networks and ~2,985 Gbps of connected port capacity
  (PeeringDB, October 2026) - not "140 members / ~2.9 Tbps peak traffic".**
  The T1 check (PeeringDB live API + ISOC Pulse, 6 Oct 2026) showed the map's
  "2.9 Tbps peak traffic" label conflated PeeringDB's cumulative member port
  capacity with measured traffic. The measured record on file is a 1.3 Tbps
  historic peak (TESPOK, 25 June 2024). The site's map and both KIXP articles
  were corrected the same morning; this pack carries the verified numbers.

Everything else held exactly: Mombasa 4 (all 4 operational), Kenya 27 tracked /
20 operational, 7 cable systems in service.

Cable-count discipline preserved: Africa-1 is landed with RFS pending and is
deliberately NOT counted in the 7; Daraja is announced; LuLu is planned. The
carousel marks this honestly (dashed vs solid lines, separate register stat).

---

## LINKEDIN COPY (ready to post)

**Nairobi and Mombasa do different jobs in Kenya's digital infrastructure.**

Nairobi is the country's largest data-centre cluster, with **19 of the 27
facilities currently tracked by DC254** - 13 operational, and every project in
the pipeline sitting in the Nairobi metro.

Mombasa is Kenya's international connectivity gateway, with **four tracked data
centres - all four operational - and seven live subsea cable systems connected
to the coast**.

The distinction matters.

Mombasa brings international routes into the country. Nairobi concentrates data
centres, networks, enterprise demand and interconnection - 144 member networks
peer at KIXP (PeeringDB, October 2026), with roughly 3 Tbps of connected
capacity and a measured historic peak of 1.3 Tbps.

The infrastructure chain is:

**Subsea cables → Mombasa landing stations → terrestrial fibre → Nairobi
facilities → IXPs → businesses and users.**

Kenya's digital-infrastructure advantage depends on how well these two roles
work together.

Explore both cities on the DC254 infrastructure map:
https://data-centers-254.vercel.app/infrastructure/map

#DataCentres #Kenya #DigitalInfrastructure

---

## X VERSION (ready to post)

**Nairobi and Mombasa do different jobs in Kenya's digital infrastructure.**

Nairobi:
19 tracked data centres
144 KIXP member networks
~3 Tbps connected capacity (1.3 Tbps measured record peak)

Mombasa:
4 tracked data centres, all operational
7 live subsea cable systems
International connectivity gateway

The opportunity is in the connection between the two.

https://data-centers-254.vercel.app/infrastructure/map

---

## CAROUSEL SLIDES + ALT TEXT

| # | File | Slide | Alt text |
|---|------|-------|----------|
| 1 | carousel-01-hook.png | Hook: two centres of gravity, split motif (19 facility dots left, 10 cable lines right, fibre line centre) | Split graphic: Nairobi shown as a cluster of 19 dots on the left, Mombasa as 10 cable lines meeting a coastline on the right, joined by a terrestrial fibre line. Caption: Nairobi and Mombasa do different jobs in Kenya's digital infrastructure. |
| 2 | carousel-02-nairobi-cluster.png | Nairobi: the cluster | Nairobi: the infrastructure cluster. 19 tracked data centres of 27 nationally (70%), 13 operational, 6 in the pipeline, KIXP at 144 member networks with about 3 Tbps of connected capacity. |
| 3 | carousel-03-mombasa-gateway.png | Mombasa: the gateway | Mombasa: the international gateway. 7 live subsea cable systems (TEAMS, SEACOM, EASSy, LION2, DARE1, PEACE, 2Africa), 4 of 4 tracked data centres operational, 3 more systems at earlier stages. |
| 4 | carousel-04-why-it-matters.png | Why the distinction matters | A gateway is not a cluster, a cluster is not a gateway: a cable landing does not make a cluster, a cluster does not provide route diversity. Kenya needs both. |
| 5 | carousel-05-the-chain.png | The infrastructure chain | Chain from subsea cables to Mombasa landing stations, terrestrial fibre, Nairobi data centres, IXPs and connected networks, then businesses, cloud services and users. |
| 6 | carousel-06-strategic-question.png | The strategic question | How effectively can Kenya connect coastal cable capacity, terrestrial fibre, Nairobi facilities, IXPs and regional markets? The opportunity is the connection between the two. |
| 7 | carousel-07-explore-map.png | CTA | See both cities on the DC254 map: Nairobi 19 tracked DCs, Mombasa 7 live cables. data-centers-254.vercel.app/infrastructure/map |

---

## LINKEDIN DOCUMENT (PDF) VARIANT

**File: two-cities-carousel-linkedin.pdf** - 7 pages, 1080x1350 portrait,
8.5 MB, same copy and verified figures as the PNG pack.

Same narrative, different art direction: this variant uses real photography
from the site's own asset library instead of the dataset-tied SVG motifs:

| Page | Photo (repo asset) | Treatment |
|------|--------------------|-----------|
| 1 | nairobi-skyline-night-kicc.webp / mombasa-port-wide.webp | cyan / amber duotone split-screen, terrestrial-fibre seam line, verified counts in the caption strip |
| 2 | atlancis-nairobi-datacentre-hall.webp | low-opacity texture behind the 19 / 13 / 6 / 144 stat stack |
| 3 | mombasa-cable-landing-2.webp | low-opacity texture: cable ship + shore landing crew |
| 5 | fibre-handhole-duct-cables.webp | low-opacity fibre-corridor texture behind the chain |
| 6 | nairobi-expressway-wide.webp | low-opacity corridor texture behind the five questions |
| 7 | og-infrastructure-map.webp | the actual DC254 map banner above the URL box |

Posting notes for the PDF route:

- Upload the PDF directly as a LinkedIn **document post** (the paperclip /
  "add a document" flow). LinkedIn renders each PDF page as a swipeable card;
  no PNG upload needed in that case.
- Choose ONE route per post: PDF document post (photo variant) or the 7 PNGs
  (motif variant). Do not mix.
- The alt text in the table above still applies; for the photo variant, pages
  1-3 alt text can add "photo of the Nairobi skyline / Mombasa port".
- Source of truth: two-cities-carousel-linkedin.html + images/ in this folder.
  Same rule as the PNG carousel - do not edit numbers by hand; the PDF is
  regenerated from this HTML so figures stay tied to the verified dataset.

---

## POSTING NOTES

- **When:** Tuesday 6 October, 07:00-09:00 EAT (Nairobi morning scroll window).
- **Format:** either the PDF document post (section above) or upload the 7
  PNGs in order (LinkedIn renders 1080x1350 without cropping). Keep the
  caption in the post body, not only in images.
- **First comment:** pin a reply with the map link again plus one line:
  "Every figure is re-verified against the DC254 dataset before we post it.
  19 tracked in Nairobi, 144 networks at KIXP, 7 live at the coast, nothing
  counted before it is actually live."
- **Threading the series:** this follows Friday's What Is Actually Live
  article and Issue 002 without repeating either - no cable-count rehash. If
  asked for the numbers' provenance, point to /rack-report (Issue 002 PDF) and
  the map page.
- **Do not edit the numbers in the images by hand.** The carousel is regenerated
  from tmp/two-cities-carousel.html (scripts/shot_two_cities.py) so the figures
  stay tied to the verified dataset.

## FLAGS FOR THE NEXT SIT-DOWN

1. **RESOLVED same morning (6 Oct 2026):** the peering article's stale KIXP
   figures ("over 70 members / exceeding 150 Gbps") and the map's
   "2.9 Tbps peak traffic" mislabel - both corrected to PeeringDB October 2026
   (144 networks / 2,985 Gbps connected capacity) + TESPOK's 1.3 Tbps historic
   peak (June 2024). T1 capture: research/captures/2026-10-06-kixp-nairobi-peeringdb-isoc-pulse.md.
   NOTE: if this carousel was already posted with the earlier figures, pin a
   comment correction pointing at the corrected map + articles.
2. **Africa-1 watch item stands:** one RFS call changes the live count from 7
   to 8 - the carousel and Issue 002 both pre-position this.
3. **Regional IXPs (TIX/UIXP/RINEX/ET-IXP) still carry unverified old "peak"
   figures on the map's regional register** - follow-up T1 pass via ISOC Pulse
   per-IXP pages recommended.
