# DC254 Workforce Week pack - Parts 1-3 (13-16 Oct 2026)

Follows Monday's locked opener "The People Behind Kenya's Data Centres" (12 Oct).
Monday introduced the people; the next posts explore the talent pipeline the
industry needs. One visual identity throughout: DC254 dark theme, cyan accent,
real Kenyan/African imagery on every slide.

Pack contents:
- tuesday/    Part 1 "The gap" - 10-slide evidence-led carousel (1080x1350 PNG
              + LinkedIn document PDF) + post-copy.md + 35s main video
              (kenya-is-building-data-centres-who-will-run-them.mp4) + 64s
              explainer (the-gap-explained-60s.mp4)
- wednesday/  Part 2 "The pathways" - 10-slide career-pathway carousel
              (1080x1350 PNG + LinkedIn document PDF) + post-copy.md + 39s
              main video (there-is-no-single-data-centre-career.mp4) + 71s
              explainer (six-pathways-explained-70s.mp4)
- thursday/   Lightweight practical-exposure text post + post-copy.md + 15s
              clip (data-centres-run-on-practice.mp4)
- friday/     Part 3 "The partnership" - 1080x1350 LinkedIn graphic +
              1200x675 X graphic + post-copy.md + 29s main video
              (the-talent-pipeline-is-a-partnership.mp4) + 58s explainer
              (the-partnership-explained-60s.mp4)
- images/     Per-day image subfolders (copied from the site's licensed library)

All seven videos: 1080x1920 vertical, 30fps, H.264, silent by design with
on-screen captions, rendered locally by the DC254 Remotion motion system
(zero spend). Same visual identity as Monday's careers video.

## Editorial safeguards (non-negotiable, all packs)

- Skills-gap claims are presented as open questions and observation framing.
  No shortage numbers are invented anywhere in the series.
- Every statistic traces to DC254, State of Kenyan Data Centres 2026:
  27 tracked facilities, 20 operational, 42.9 MW built capacity, 10.5 MW
  published live IT load, 230 MW pipeline (77 under construction / 53 committed /
  100 early stage). The series exists to collect workforce evidence, not to
  publish opinions about the gap.
- Careers link https://data-centers-254.vercel.app/careers and contact link
  https://data-centers-254.vercel.app/contact verified live (HTTP 200) on the
  pack date, 12 Oct 2026.
- X copy verified at or under 280 characters per post (279/276/275/280).

## Imagery rule compliance

Every person shown is Kenyan or African. Rejected during review:
- site-visit-power-hall-kenya.webp (mixed international delegation)
- moringa-ixafrica-training-signing.webp (non-African signatory in frame)
- nbo2-launch-ribbon-cutting.webp (mixed executive group)
- racks-cabling.webp (non-African person in background)
- dc-networking.webp (background infographic with large English labels)

## Regeneration

    python3 /home/z/my-project/scripts/shot_workforce_week_20261012.py

Renders all 22 graphic assets from the three HTML files with built-in overflow QA and
emits both LinkedIn document PDFs. Local Chromium only, zero spend.

Videos (one command each, from the workspace motion project):

    cd /home/z/my-project/dc254-video
    npm run render:tuesday   && npm run render:explain:tuesday
    npm run render:wednesday && npm run render:explain:wednesday
    npm run render:thursday
    npm run render:friday    && npm run render:explain:friday

Content lives in src/content/*.json (and src/content/explainers/); animation code
is shared. statistic scenes enforce source+date (they render a DO-NOT-PUBLISH flag
without one); question/pathway/partnership scenes carry no numbers at all.

## Schedule

| Day | Date | Asset | Video | Primary CTA |
|-----|------|-------|-------|-------------|
| Tue | 13 Oct | Evidence carousel (10 slides) | 35s main + 64s explainer | Which skills are hardest to develop or recruit for? |
| Wed | 14 Oct | Pathways carousel (10 slides) | 39s main + 71s explainer | Which career pathway should DC254 explain next? |
| Thu | 15 Oct | Text post | 15s clip | Offer practical exposure (operators) |
| Fri | 16 Oct | Partnership graphic + post | 29s main + 58s explainer | Contact DC254 for workforce partnerships |

By Friday the series moves from introducing the workforce to inviting the
institutions and companies that will develop it, collecting first-hand evidence
along the way for a future DC254 workforce briefing.
