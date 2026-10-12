# DC254 Numbers + Inside the Map — video pack (2026-10-12)

Two Remotion videos animating verified DC254 directory figures, produced
with the config-driven motion system (workspace `dc254-video/`). Every
material figure carries its source and verification date on screen —
enforced in code: a `statistic` scene without `source` + `sourceDate`
renders a "SOURCE REQUIRED — DO NOT PUBLISH UNVERIFIED" flag instead.

## Files

| File | What it is |
|---|---|
| `dc254-numbers.mp4` | 41 s · 1080x1920 · five verified figures, each with source + date: 27 verified facilities (20 operational) · 10.5 MW published in-service IT load (of 42.9 MW designed) · 230 MW announced pipeline (272.9 MW total tracked) · 448 PeeringDB network connections · 7 of 10 subsea cables in service |
| `inside-the-map.mp4` | 40 s · 1080x1920 · the physical path: seven named subsea cables landing at Mombasa (with RFS years) -> terrestrial fibre -> Nairobi connectivity hubs -> facilities; KIXP quantified (144 networks, 2,985 Gbps, 1.3 Tbps peak) and 13 operational Nairobi facilities |
| `preview-*.png` | QA stills from the frame-by-frame check (12 frames inspected in total) |
| `content/*.json` | The exact content configs that rendered both videos (re-renderable) |
| `post-copy.txt` | Ready-to-post LinkedIn + X copy with sources and editor notes |

## Verified figures ledger (as rendered)

| Figure | Label (canonical, site-stats.ts) | Source | Verified |
|---|---|---|---|
| 27 | Verified facilities in Kenya (20 operational) | DC254 directory · 2026-Q3 dataset | Oct 2026 |
| 10.5 MW | Published in-service IT load, operational Kenya | DC254 directory · 2026-Q3 dataset | Oct 2026 |
| 42.9 MW | Live designed capacity, operational Kenya (in-card context) | DC254 directory · 2026-Q3 dataset | Oct 2026 |
| 230 MW | Announced pipeline (UC + committed + early stage) | DC254 directory · 2026-Q3 dataset | Oct 2026 |
| 272.9 MW | Total tracked supply, all stages (in-card context) | DC254 directory · 2026-Q3 dataset | Oct 2026 |
| 448 | Networks connected across the 20 operational facilities (per-facility PeeringDB counts summed; ADC NBO1 = 122) | PeeringDB via DC254 directory | Oct 2026 |
| 7 / 10 | Subsea cables in service at Kenyan landings / systems tracked | DC254 cable tracker | Sep 2026 |
| 144 | Member networks at KIXP (2,985 Gbps port capacity) | PeeringDB · KIXP profile | Oct 2026 |
| 1.3 Tbps | KIXP historic peak | TESPOK (25 Jun 2024) | cited in validated explainer |
| 13 / 4 | Operational facilities in Nairobi / Mombasa | DC254 directory · 2026-Q3 dataset | Oct 2026 |

Not claimed anywhere: market size, revenue, utilisation, jobs, salaries,
shortage numbers — those are not in the verified dataset.

## Visual rules honoured

- Backgrounds are real images from the repo (`public/images/` -> motion
  workspace `public/footage/`), chosen to match each card's subject
  (campus aerial for facilities, server hall for IT load, cranes for
  pipeline, patch panels for connections, cable landing for cables).
- The two map scenes keep the animated schematic clean (no photo behind
  the map) for legibility; the map outline is generated from the open
  johan/world.geo.json dataset and node positions are real coordinates.
- All people shown: Kenyan/African (library rule). No invented logos,
  routes, capacities or locations; Daraja/LuLu excluded from the on-screen
  in-service count and named only in the source policy.

## Re-render

```bash
cd dc254-video   # workspace copy of this system
npx remotion render Video out/dc254-numbers.mp4   --props src/content/dc254-numbers.json
npx remotion render Video out/inside-the-map.mp4  --props src/content/inside-the-map.json
```

Spend: 0 credits (local headless Chrome + bundled compositor).
