# Kenya, Explained in 60 Seconds — from submarine cable to your phone

A 60-second, layman-friendly 3D explainer mapping Kenya's digital infrastructure:
the moment international submarine cables land in Mombasa → the national fibre
backbone up to Nairobi → data centres and the internet exchange → mobile towers
in the last mile → the phone in your hand.

Built with **Remotion + React Three Fiber** (true 3D camera inside the video
pipeline), narrated with TTS and a procedurally generated ambient bed.

**v2 — Marble edition:** the five "ground level" beats now cut to photorealistic
3D worlds generated with **Worldlabs Marble** (`marble-1.1`, text-to-world):
the undersea cable on the seabed, the Mombasa landing at golden hour, a Nairobi
data-centre aisle, a cell tower over the city at dusk, and the M-Pesa tap on a
phone in hand. The stylised map flight remains the connective spine — a
"THE JOURNEY" chip (Kenya silhouette + route + you-are-here stage) keeps
orientation during every world cut. Marble worlds are rendered as equirect
panoramas on an inverted sphere with an animated virtual camera
(`src/scenes/WorldScene.tsx` + calibrated shots in `src/scenes/worldShots.ts`);
world assets live in `public/worlds/*.jpg` (panoramas, ~600 KB each; Marble
world ids in `work/dc254/marble/ops.json` if regenerating).

**Output:** `out/kenya-infrastructure-marble.mp4` — 1280×720, 30 fps, 60s,
h264+aac.

## The journey (8 beats, audio-driven timing)

| # | Beat | What you see | VO |
|---|------|--------------|-----|
| 0 | The question | Ocean + Kenya silhouette | Where does the internet on your phone actually come from? |
| 1 | The cables | 7 labelled cable systems converge on Mombasa | Under the Indian Ocean… |
| 2 | The landing | Mombasa landing station | …where the internet comes ashore |
| 3 | The backbone | Mombasa→Nairobi route + NOFBI spurs | Five hundred kilometres inland |
| 4 | The data centre | Nairobi racks light up, KIXP | Your apps close to home |
| 5 | The last mile | Towers ring across the country | Kisumu, Garissa, the mast nearest you |
| 6 | Your phone | Phone with M-Pesa/call/video tiles | Every tap makes the trip in a blink |
| 7 | Outro | End card over the full map | Cable, coast, city, cloud — DC254 |

Beat boundaries are **generated from the measured voiceover durations**
(`scripts/build_beatmap.mjs` → `src/beatmap.ts`) so picture and narration can
never drift apart. Edit the script → regenerate → re-render.

## Data accuracy

- Cable systems, landings and service status come from DC254's own sourced
  tracker (`src/lib/market-trackers.ts` in the site repo): TEAMS (2009),
  SEACOM (2009), EASSy (2010), LION2 (2012), DARE1 (2020), PEACE (2022),
  2Africa (2022) — all in service, all landing on Kenya's coast at Mombasa.
- Country outline: geoBoundaries gbOpen KEN ADM0 (simplified ~700 points).
- Backbone path follows the Mombasa–Voi–Mtito Andei–Nairobi highway corridor;
  spurs approximate NOFBI routes to border towns. Simplified for legibility.
- No invented statistics; the "≈500 km" line is the well-documented
  Mombasa–Nairobi fibre distance.

## Regenerate everything

```bash
npm install

# 1. narration (8 segments, z-ai TTS, voice kazi @1.4)
z-ai tts -i "<seg text from src/beatmap.ts SCRIPT>" -o public/audio/segments/segN.wav --voice kazi --speed 1.4

# 2. beat map from measured durations (+ optional seg8 estimate override)
node scripts/build_beatmap.mjs

# 3. ambient bed (numpy) and final mix (ffmpeg)
python3 scripts/make_bed.py
python3 scripts/mix_audio.py

# 4. render
npx remotion render KeMapFlight out/kenya-infrastructure-marble.mp4
```

Headless rendering uses the `swangle` (SwiftShader) GL renderer — see
`remotion.config.ts`. Verified on a 2-core CPU box: ~5 min for 1800 frames.

## Files

- `src/geo/kenya-data.json` — simplified border + projected city coordinates (1 unit = 1°)
- `src/geo/kenya.ts` — cables, backbone, spurs, city definitions
- `src/scenes/Map3D.tsx` — the 3D scene: land, cables, landing station,
  backbone, data centre, towers, phone, camera rig
- `src/ui/Overlay.tsx` — DOM layer: projected 3D labels, captions, brand,
  progress, hook title, end card
- `src/beatmap.ts` — GENERATED beat boundaries + captions + script
- `public/audio/` — segments, bed, final mix
