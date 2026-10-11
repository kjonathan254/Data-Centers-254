# 2026-W42 Remotion Video Brief — one reusable template, four day configs (+ explainers)

Mandate (editor, 2026-10-12): each day of the W42 series gets its own
actually-rendered MP4 — as was done for the Monday copy — plus explainer
variants where feasible. A video may only be reported as rendered when the MP4
exists on disk and is ffprobe-verified. Local rendering only (0-credit rule).

## Shared template (data-driven, one pipeline, four configs)
- 1080×1920 portrait, 30fps, 30–45s, silent-readable captions (feeds autoplay
  muted).
- Palette: deep navy base, restrained cyan accent; DC254 logo top or footer.
- Font: Noto Sans family (matches site); max 2 lines per caption card.
- Component chain: Opening hook → Photo/text scene → Animated statistic →
  Network map → Skills/explainer card → Source+date footer → Closing CTA
  (careers page).
- Every number renders with its source + date. No source → omit or "unverified".
- Photos: Kenyan/African people only, matched to scene content. No invented
  facilities, no fabricated statistics, no implied company endorsements.

## Beat sheet (35s reference — configs override copy/stats/imagery)
- 00–04s hook
- 04–12s power / cooling
- 12–22s network & operations
- 22–30s people / skills
- 30–35s closing line + careers CTA

## Per-day configs
1. `mon-people` — opener. Hook: the people behind uptime. Closing line: "Kenya
   needs digital infrastructure. It also needs the people who know how to run
   it." + careers CTA.
2. `tue-gap` — "Kenya is building data centres. Who will run them?" Optional
   funnel visual (four exposure tiers → where Kenya sits → pathways as ladder).
   Gap presented as a question. CTA: share your hiring experience.
3. `wed-pathways` — six micro-cards (power / cooling / network / cloud /
   security / ops), one line each on what the work is. CTA: careers page.
4. `fri-partnership` — four partnership cards (workforce research / mentorship /
   practical exposure / training partnerships). CTA: partner with DC254.

## Explainers (as feasible)
- 1920×1080 landscape, 60–90s, caption-led (no TTS dependency), same config
  data.
- Priority: `wed-pathways` (evergreen search value) → `tue-gap` →
  `mon-people` → `fri-partnership`.

## Build & acceptance
- Remotion project scaffolded at first production use (per simplicity-first);
  render via local `npx remotion render` (Chrome headless already verified in
  environment).
- Acceptance per video: MP4 exists; ffprobe confirms expected duration,
  resolution, fps; non-trivial file size; visual spot-check of 2–3 frames;
  source/date footer legible.
- NEVER report "rendered" without the file on disk. Never ship unverified stats.
