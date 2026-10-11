# QA record — W42 skills campaign (12-point checklist)

Date: 2026-10-12. Method: ffprobe on every MP4 + frame extraction at multiple
timestamps + visual inspection of rendered files (not code or preview only).

## Renders (all verified on disk)
| File | Duration | Size | Probe |
|---|---|---|---|
| renders/tuesday/dc254-tuesday-skills-gap-v1.mp4 | 42.000s | 9.7 MB | 1080×1920, 30/1 fps, H.264 |
| renders/wednesday/dc254-wednesday-career-pathways-v1.mp4 | 42.000s | 11.8 MB | same spec |
| renders/thursday/dc254-thursday-practical-exposure-v1.mp4 | 16.000s | 3.5 MB | same spec |
| renders/friday/dc254-friday-talent-pipeline-v1.mp4 | 45.000s | 8.0 MB | same spec |
| renders/thursday/dc254-thursday-pathway-graphic.png | still | — | 1080×1350 |

## Checklist
1. Renders successful — YES (all five).
2. MP4s inspected, not just code — YES (13 extracted frames reviewed across all
   four videos; frames archived in qa/frames/).
3. Text size + phone safe margins — YES (96px side insets, 150px top, 220px
   bottom; brand mark top-left inside safe area; progress bar at edge).
4. Spelling/punctuation/place names — YES ("data centres" British spelling
   consistent; Nairobi/Kenya place names correct; no typos found in frames).
5. Narration/captions timing — N/A (silent, caption-led by design; no audio
   track, so no clipping possible; understandable without sound).
6. Footage/audio licensing — YES: all backgrounds from DC254's own published
   library (public/images, already used on the site); no third-party footage;
   no audio (no music licensing required).
7. Claims vs evidence register — YES (see research/evidence-register.md; only
   statistic is DC254's own 2026-Q3 dataset, self-sourced with footer).
8. URLs/CTA verified — YES (careers page HTTP 200 on 2026-10-12; email is
   editor-designated).
9. Four videos distinct — YES (gap question / six pathways / exposure flow /
   partnership invitation; no repeated message).
10. Closing screen + branding consistent — YES (identical end card system;
    logo-icon + DC254 wordmark + tagline + CTA; verified post-fix).
11. Broken animations/black frames — fixed: initial render had an EndCard
    mid-crossfade overlap defect (Friday t=43s); root cause was opacity
    crossfade over live CTA text; fix = solid background cut + content fade;
    all four re-rendered and re-inspected (fri-43-fixed.jpg, tue-38.4-fixed.jpg).
12. No placeholder/invented stats/unapproved logos — YES (only DC254 assets;
    Moringa–IXAfrica photo excluded; no third-party logos appear).

## Assets still requiring human approval before publication
- All four MP4s + Thursday graphic (editor review).
- All social copy (LinkedIn/X/poll/outreach message).
- Tagging lists (verify handles; no relationships implied).
- Outreach messages must NOT be sent by the agent — human review + send.

## Known limitations
- No voiceover (0-credit constraint; caption-led design compensates).
- Thursday video is 16s (concise supporting explainer per brief §8, which
  prioritised the graphic; full-length treatment reserved).
- remotion-skills folder absent from workspace skills/ (installed capability
  was re-created from npm; re-install of the skill pack recommended).
