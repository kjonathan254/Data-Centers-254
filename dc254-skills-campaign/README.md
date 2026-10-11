# DC254 Skills Campaign — W42 (Tue–Fri) production package

Campaign: Kenya's Data-Centre Skills Gap. Continuity: Monday introduced the
people ("Who keeps Kenya's data centres running?"); this package continues the
narrative Tuesday→Friday without repeating it.

## What's here
```
dc254-skills-campaign/
  research/evidence-register.md   <- claims, sources, confidence, publishability
  scripts/tuesday.md … friday.md  <- scene-by-scene scripts (approved copy)
  social-copy/tuesday.md … friday.md <- LinkedIn + X + poll + outreach + targets
  assets/PROVENANCE.md            <- image provenance + imagery-rule compliance
  remotion-project/               <- reusable config-driven Remotion system
  renders/{tuesday,wednesday,thursday,friday}/
  qa/qa-checks.md + qa/frames/    <- 12-point QA record + inspected frames
```

## Rendered assets (verified on disk, ffprobe + frame inspection)
- `renders/tuesday/dc254-tuesday-skills-gap-v1.mp4` — 42s, 9.7 MB
- `renders/wednesday/dc254-wednesday-career-pathways-v1.mp4` — 42s, 11.8 MB
- `renders/thursday/dc254-thursday-practical-exposure-v1.mp4` — 16s, 3.5 MB
- `renders/thursday/dc254-thursday-pathway-graphic.png` — 1080×1350 still
- `renders/friday/dc254-friday-talent-pipeline-v1.mp4` — 45s, 8.0 MB

All 1080×1920 (still: 1080×1350), 30fps, H.264, silent caption-led.

## Reuse instructions (future campaigns)
1. `cd dc254-skills-campaign/remotion-project`
2. Copy a config in `src/configs/` (content only — text, cards, steps, images,
   evidence footers; no animation code).
3. Register it in `src/Root.tsx` (composition id + fps + size).
4. `npx remotion render src/index.ts <id> <out.mp4>`
5. Static graphic: add a `kind: "flow"` scene and render `thursday-graphic`
   pattern via `npx remotion still src/index.ts <id> <out.png> --frame=0`.
Components available: hook / statement / role cards / flow diagram / CTA with
brand end card / evidence footer / progress bar / Ken-Burns backdrops.

## Rendering notes
- Local render only (0-credit rule). Chrome Headless Shell auto-installed to
  `node_modules/.remotion/`. If a fresh clone fails to find a browser:
  `npx remotion browser ensure`.
- Encoding: JPEG frames @ q90 → H.264 (Remotion default). ~10s per 42s video.

## Relationship to the workforce-week pack
A parallel production run (public/drop/workforce-week-20261013-16/, docs/video-system.md)
delivered its own render set: Monday careers video + carousel, Tue/Wed carousels +
LinkedIn PDFs, Friday graphics, and 7 videos (4 mains + 3 explainer cuts). The two
runs are independent executions of the same brief; both hold the editorial line.
EDITOR DECISION: pick a ship set per day. Uniquely complementary in THIS package:
the committed config-driven Remotion project source, the formal evidence register,
the QA frame archive, the Thursday 1080×1350 pathway graphic, the LinkedIn poll
specification, and the outreach message + 12-organisation target list.

## Human approvals required before anything goes live
See `qa/qa-checks.md` §approvals. Nothing has been published, sent or posted by
the agent.
