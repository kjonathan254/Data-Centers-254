# DC254 Motion System (Remotion video pipeline)

Status: OPERATIONAL (first production use 12 Oct 2026 - Monday careers pack;
expanded 12 Oct 2026 - one video per Workforce Week post, 7 renders).

## What it is

A data-driven video template system built on Remotion 4 (React -> MP4), rendered
locally with headless Chrome. Content lives in JSON; animation code is reusable.
Zero paid APIs, zero credits. Design tokens are extracted from the site theme
(near-black `#020304` background, single cyan accent `#00D2D3`, Geist/Geist Mono -
the same family the website uses), so every video is brand-exact by construction.

## Where things live

- Project (workspace-side, not committed to keep the repo lean):
  `/home/z/my-project/dc254-video/` - see its `README.md` for full usage.
- Video content configs: `src/content/*.json` - monday-careers (video),
  tuesday-gap, wednesday-pathways, thursday-practice, friday-partnership, plus
  `src/content/explainers/` for the three long-form cuts.
- Scene components: `src/scenes/` - `hook`, `power`, `network`, `skills`,
  `statistic`, `question`, `pathway`, `partnership`, `closing`. The generic
  `Video` composition renders any config via `--props`.
- Carousels: `src/content/careers-carousel.json` (10-slide LinkedIn set) and the
  HTML/PDF pipeline behind the Tuesday/Wednesday decks.
- Kenya map: real 37-point border polygon (`src/kenya.ts`, generated from the
  open world.geo.json dataset) with subsea-cable and fibre animations.

## Production packs

Monday 12 Oct 2026 - "The People Behind Kenya's Data Centres": 40s vertical
video ("Who keeps Kenya's data centres running?" - rack hook, power chain,
Kenya network map, skills grid, careers CTA), cover still + 10-slide carousel,
post-copy. Delivered via `public/drop/monday-careers-20261012/`.

Workforce Week 13-16 Oct 2026 - one video per post, seven renders in one batch:

| Day | File in drop | Length | Story |
| --- | --- | --- | --- |
| Tue | kenya-is-building-data-centres-who-will-run-them.mp4 | 35s | tracked build-out (3 sourced stats) -> open question -> careers CTA |
| Tue | the-gap-explained-60s.mp4 | 64s | evidence briefing: 3 stats + 4 extra beats incl. evidence streams |
| Wed | there-is-no-single-data-centre-career.mp4 | 39s | six pathway cards + vote CTA |
| Wed | six-pathways-explained-70s.mp4 | 71s | six pathways, slower + "four honest ways in" + floor habits |
| Thu | data-centres-run-on-practice.mp4 | 15s | practical-exposure clip + contact CTA |
| Fri | the-talent-pipeline-is-a-partnership.mp4 | 29s | three-node model -> observation -> contact CTA |
| Fri | the-partnership-explained-60s.mp4 | 58s | week recap + partnership modes + invitation |

Delivered via `public/drop/workforce-week-20261013-16/<day>/`.

## Governance rules baked into the system

1. Source policy: `statistic` scenes require `source` + `sourceDate`; without
   them the scene renders "SOURCE REQUIRED - DO NOT PUBLISH UNVERIFIED".
   All Tuesday statistics trace to DC254, State of Kenyan Data Centres 2026.
2. Question scenes keep claims open: the skills gap is rendered as a question
   with explicit "observation, not measurement" framing - never a measured fact.
3. `pathway` and `partnership` scenes carry no numbers at all; the three-node
   partnership model is labelled a framing on screen.
4. No invented people/footage: v1 is pure motion graphics (nothing human
   depicted). Real footage later must be licensed and depict Kenyan/African
   facilities and professionals - scenes accept a `footage` slot for this.
5. Careers and contact links verified (HTTP 200) on the pack date.

## Format library

| Format                   | Scene recipe                              | Status |
| ------------------------ | ----------------------------------------- | ------ |
| Careers Behind the Cloud | hook + role scenes + closing              | SHIPPED |
| DC254 Explains           | hook + question/pathway/partnership + closing | SHIPPED (3 explainers) |
| DC254 Numbers            | statistic scenes (source-enforced)        | SHIPPED (Tuesday pack) |
| Inside the Map           | KenyaMap-centric scenes                   | ready   |
| The Rack Report (video)  | headline scenes + statistic + closing     | ready   |

## Reproducing / extending

```bash
cd /home/z/my-project/dc254-video
npm run studio               # preview
npm run render:careers       # Monday video
npm run render:tuesday       # + render:explain:tuesday
npm run render:wednesday     # + render:explain:wednesday
npm run render:thursday
npm run render:friday        # + render:explain:friday
npm run render:carousel      # 10-slide careers carousel
```

New video = new content JSON + `--props` on the `Video` composition. Scene
durations are summed automatically. See the project README for the scene-type
field reference, safe-zone notes (LinkedIn vs Reels/Shorts) and the Remotion
licensing note (free up to 3 team members).
