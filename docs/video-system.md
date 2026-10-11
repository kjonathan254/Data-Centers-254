# DC254 Motion System (Remotion video pipeline)

Status: OPERATIONAL (first production use 12 Oct 2026 - Monday careers pack).

## What it is

A data-driven video template system built on Remotion 4 (React -> MP4), rendered
locally with headless Chrome. Content lives in JSON; animation code is reusable.
Zero paid APIs, zero credits. Design tokens are extracted from the site theme
(near-black `#020304` background, single cyan accent `#00D2D3`, Geist/Geist Mono -
the same family the website uses), so every video is brand-exact by construction.

## Where things live

- Project (workspace-side, not committed to keep the repo lean):
  `/home/z/my-project/dc254-video/` - see its `README.md` for full usage.
- Content configs: `src/content/monday-careers.json` (video) and
  `src/content/careers-carousel.json` (10-slide LinkedIn carousel).
- Scene components: `src/scenes/` - `hook`, `power`, `network`, `skills`,
  `statistic`, `closing`. Add a new type in `src/MondayCareers.tsx` SceneSwitch.
- Kenya map: real 37-point border polygon (`src/kenya.ts`, generated from the
  open world.geo.json dataset) with subsea-cable and fibre animations.

## First production pack (Monday 12 Oct 2026)

"The People Behind Kenya's Data Centres":

- 40s vertical video (1080x1920, 30fps, H.264, silent by design) -
  "Who keeps Kenya's data centres running?" - rack hook, power chain
  (grid -> UPS -> generators -> racks + cooling), Kenya network map
  (subsea landings -> Mombasa -> fibre -> Nairobi), skills grid, careers CTA.
- Cover still + 10-slide carousel (1080x1350).
- Post-copy: LinkedIn caption, X copy, execution notes.

Delivered via the drop folder: `public/drop/monday-careers-20261012/`
(pack lifecycle: remove after editor download confirmation; regeneration takes
one command from the workspace project).

## Governance rules baked into the system

1. Source policy: `statistic` scenes require `source` + `sourceDate`; without
   them the scene renders "SOURCE REQUIRED - DO NOT PUBLISH UNVERIFIED".
2. No invented people/footage: v1 is pure motion graphics (nothing human
   depicted). Real footage later must be licensed and depict Kenyan/African
   facilities and professionals - scenes accept a `footage` slot for this.
3. Careers link verified (HTTP 200) on the pack date; skills trend framed as an
   industry observation, not a measured claim.

## Format library (planned reuse)

| Format                   | Scene recipe                              | Status |
| ------------------------ | ----------------------------------------- | ------ |
| Careers Behind the Cloud | hook + role scenes + closing (this pack)  | SHIPPED |
| DC254 Explains           | hook + explainer scenes + closing         | ready   |
| DC254 Numbers            | statistic scenes (source-enforced)        | ready   |
| Inside the Map           | KenyaMap-centric scenes                   | ready   |
| The Rack Report (video)  | headline scenes + statistic + closing     | ready   |

## Reproducing / extending

```bash
cd /home/z/my-project/dc254-video
npm run studio            # preview
npm run render:careers    # re-render the careers video
npm run render:carousel   # re-render all 10 slides
```

New video = new content JSON + `--props` on render. See the project README for
the scene-type field reference, safe-zone notes (LinkedIn vs Reels/Shorts) and
the Remotion licensing note (free up to 3 team members).
