# DC254 Market Signal — Network Concentration Carousel (9 Oct 2026)

Campaign: **Beyond Tier Ratings: Where Are Kenya's Data-Centre Networks Concentrated?**
Format: 7-slide LinkedIn carousel (1080×1350) + single-image X route
Assets: carousel PNGs 01–07, LinkedIn document PDF (one page per slide), HTML source

## Verification record (do not publish without this)

- Figures carried: DC254 directory dataset `current.json` Q3 2026 (`peeringdbNetworks` / `peeringdbIxs`, lastVerified 2026-09). These are the same numbers readers see on the site directory.
- Metric definition: **unique networks registered at the facility in PeeringDB (network-reported)** — `netfac`, status=ok, deduplicated by ASN (row count = unique ASN count at every facility checked). IXs = internet exchanges with a recorded presence on site (`ixfac`, status=ok).
- Live re-check 9 Oct 2026 (all 14 Kenyan facilities on PeeringDB, status=ok): ranking **unchanged** in both snapshots.

| # | Facility | Dataset (Sep 2026) | Live (9 Oct 2026) | Drift |
|---|---|---|---|---|
| 1 | Africa Data Centres Nairobi 1 (fac 1964) | 122 / 4 IX | 127 / 4 IX | +5 nets |
| 2 | iColo Mombasa One (fac 5019) | 94 / 3 | 94 / 3 | none |
| 3 | iColo Nairobi One (fac 6448) | 62 / 4 | 62 / 3 | −1 IX (ixFabric presence no longer listed) |
| 4 | iXAfrica NBOX1 (fac 13572) | 44 / 3 | 43 / 3 | −1 net |
| 5 | iColo Mombasa Two (fac 10232) | 40 / 3 | 40 / 3 | none |
| 6 | PAIX Nairobi (fac 7995) | 37 / 3 | 38 / 3 | +1 net |

- **RANKING CORRECTION vs the draft brief:** the draft listed PAIX Nairobi (37) at #5. The dataset and the live sweep both place **iColo Mombasa Two (40)** at #5; PAIX is #6 (shown on slide 3 as the muted cut-line). This is a material correction — the copy below uses the verified five.
- Q4 dataset-sync queue (for the editor, not for publication): ADC NBO1 122→127, NBOX1 44→43, PAIX 37→38, iColo NBO1 IXs 4→3; plus one facility found on PeeringDB not yet tracked: "Icolo" (fac 14812, Nairobi, 3 nets — likely iColo NBO3 or a duplicate entry; needs manual triage before adding).

## LinkedIn caption (carousel document post)

**In Kenya's data-centre market, the most important number may not be the Tier label.**

It may be the number of networks registered inside the building.

DC254's verified directory (Q3 2026), re-checked against PeeringDB this week, ranks Kenya's five most networked facilities:

1. **Africa Data Centres Nairobi 1** — 122 networks, 4 internet exchanges
2. **iColo Mombasa One** — 94 networks, 3 internet exchanges
3. **iColo Nairobi One** — 62 networks, 4 internet exchanges
4. **iXAfrica NBOX1** — 44 networks, 3 internet exchanges
5. **iColo Mombasa Two** — 40 networks, 3 internet exchanges

(Just outside the five: PAIX Nairobi, 37 networks.)

Why does this matter? Because interconnection affects how easily customers can connect to carriers, reach internet exchanges, route toward cloud providers, keep local traffic local and build redundant network paths.

Certification still matters. So do power, cooling, security and resilience. Tier ratings and network presence answer different questions — and buyers need both.

Mombasa brings the international routes. Nairobi concentrates the networks, facilities and enterprise demand.

*Networks = unique networks registered at each facility in PeeringDB (network-reported). Verified September 2026; rankings re-confirmed 9 October 2026.*

Explore every facility, operator, status, capacity, network count and verification date in the DC254 directory:
https://data-centers-254.vercel.app/directory

#DataCentres #DigitalInfrastructure #Kenya #Connectivity #CloudComputing

## X post (primary — 390 chars, requires X Premium)

In Kenya's data-centre market, networks may tell you more than the Tier label.

Top 5 by networks registered in PeeringDB (DC254 verified dataset):

- ADC Nairobi 1 — 122
- iColo Mombasa One — 94
- iColo Nairobi One — 62
- iXAfrica NBOX1 — 44
- iColo Mombasa Two — 40

Mombasa is the gateway. Nairobi is the cluster.

data-centers-254.vercel.app/directory

#DataCentres #Kenya #Connectivity

## X post (strict-280 variant — 274 chars, fits a standard account)

Networks can say more than the Tier label.

Most networked in Kenya (DC254 dataset):

ADC Nairobi 1 — 122
iColo Mombasa One — 94
iColo NBO1 — 62
iXAfrica NBOX1 — 44
iColo Mombasa Two — 40

Mombasa is the gateway. Nairobi is the cluster.
data-centers-254.vercel.app/directory

## Alt text

- **Carousel (document post):** "Seven-slide DC254 carousel ranking Kenya's five most networked data-centre facilities: Africa Data Centres Nairobi 1 at 122 registered networks, iColo Mombasa One at 94, iColo Nairobi One at 62, iXAfrica NBOX1 at 44 and iColo Mombasa Two at 40, with an explainer on why interconnection is a different measure from Tier certification."
- **X single image (use carousel-01-the-question.png):** "Dark DC254 cover slide over a photograph of a Nairobi data-centre hall: Beyond Tier Ratings — Where Are Kenya's Data-Centre Networks Concentrated?"

## Posting plan (EAT)

- LinkedIn carousel (document post of the PDF, not the PNGs): Friday 07:30–09:00 EAT. If Friday morning is missed, hold for Monday same window — the dataset dates keep it evergreen for weeks.
- X: Friday 12:00–13:00 EAT, one visual route per post (cover PNG or a 2×2 mini-grid made from slides 1+3+4+7; do not post the 7 PNGs individually).
- First comment on both: link the infrastructure map (data-centers-254.vercel.app/infrastructure/map) to route the geography readers.
- OG note: the directory link card uses the site's own OG image; the carousel PDF travels the numbers independently of the link card.

## House rules carried from previous packs

- Do not hand-edit the PNGs or PDF; regenerate from the HTML source via scripts/shot_network_signal_20261009.py so figures stay dataset-tied.
- Figures are dataset-exact to `src/data/directory/current.json` Q3 2026. Any future refresh starts from the dataset, not from this pack.
- /drop mirror is a TEMPORARY delivery route: delete from the repo after the editor confirms download.
