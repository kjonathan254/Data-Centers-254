# DC254 Workforce Week pack - Parts 1-3 (13-16 Oct 2026)

Follows Monday's locked opener "The People Behind Kenya's Data Centres" (12 Oct).
Monday introduced the people; the next posts explore the talent pipeline the
industry needs. One visual identity throughout: DC254 dark theme, cyan accent,
real Kenyan/African imagery on every slide.

Pack contents:
- tuesday/    Part 1 "The gap" - 10-slide evidence-led carousel (1080x1350 PNG
              + LinkedIn document PDF) + post-copy.md
- wednesday/  Part 2 "The pathways" - 10-slide career-pathway carousel
              (1080x1350 PNG + LinkedIn document PDF) + post-copy.md
- thursday/   Lightweight practical-exposure text post + post-copy.md
- friday/     Part 3 "The partnership" - 1080x1350 LinkedIn graphic +
              1200x675 X graphic + post-copy.md
- images/     Per-day image subfolders (copied from the site's licensed library)

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

Renders all 22 assets from the three HTML files with built-in overflow QA and
emits both LinkedIn document PDFs. Local Chromium only, zero spend.

## Schedule

| Day | Date | Asset | Primary CTA |
|-----|------|-------|-------------|
| Tue | 13 Oct | Evidence carousel (10 slides) | Which skills are hardest to develop or recruit for? |
| Wed | 14 Oct | Pathways carousel (10 slides) | Which career pathway should DC254 explain next? |
| Thu | 15 Oct | Text post | Offer practical exposure (operators) |
| Fri | 16 Oct | Partnership graphic + post | Contact DC254 for workforce partnerships |

By Friday the series moves from introducing the workforce to inviting the
institutions and companies that will develop it, collecting first-hand evidence
along the way for a future DC254 workforce briefing.
