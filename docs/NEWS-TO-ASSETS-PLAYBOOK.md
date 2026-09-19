# News-to-Assets Playbook

**One page. Owner: Kevin Jonathan Otieno. Companion to docs/RESEARCH-VERIFICATION-STANDARDS.md (v1.0).**

## The principle

News is an input, not the product. A story that runs and dies is an expense;
a story that updates a durable asset compounds. The site's value is the
directory, the trackers, the maps and the research views, articles are how
new information reaches them.

## The rule

**No event is "covered" until its durable assets are updated.** An article
alone is incomplete work. Work an event down its checklist row before
closing it.

## Event → asset checklist

| Event | Article | Directory record | Tracker | Map / infra | Newsletter | Research |
|---|---|---|---|---|---|---|
| Facility launch / expansion | news piece + explainer update | status, capacity, `lastVerified` moved | pipeline stage move | pin verified | next brief | note for quarterly report |
| Cable ready-for-service | news piece + counting rule check | landing-station entry if new | - | cable layer + homepage stat strip (auto) | next brief | cable table refresh |
| Power tariff / generation change | energy explainer update | - | - | - | next brief | power view refresh |
| Regulatory decision (CA, ODPC, ministry, county) | policy piece | - | - | - | next brief | policy view refresh |
| Cloud / AI compute expansion | AI cluster piece | `aiReady` / capacity fields | - | - | next brief | AI compute view |
| Deal, M&A, funding | market piece | operator record | scoreboard row | - | next brief | - |
| Closure / failure / outage reported | news piece, dated | status + divergence note if claims conflict | pipeline move | pin removed | next brief | - |

A dash means "not applicable", it never means "skipped silently".

## Workflow per event

1. **Capture** the claim with its source and date the day it lands (log in
   the working notes file, one line).
2. **Verify** before writing: run the claim through the verification chain
   (claim → source → date verified → independent check). Single-source
   claims publish at Medium confidence at best, with the source named.
3. **Publish** the article: dated, sources listed, confidence stated,
   validator clean (`python3 scripts/article_validator.py`).
4. **Within 48 hours**: update every applicable asset in the checklist row.
   Directory rows get their `lastVerified` month moved only when re-verified
   against sources, not because an article exists.
5. **Log** material changes in `src/lib/corrections-data.ts` (feeds both
   /corrections and /methodology), and correct course in public if an
   earlier published figure was wrong.
6. **Brief**: the next DC254 Brief edition carries the event in one line
   with a link.

## Definition of done

- [ ] Article published, sources and confidence level stated
- [ ] Every applicable checklist-row asset updated
- [ ] `lastVerified` moved on every directory row actually re-verified
- [ ] Correction/update log entry appended if material
- [ ] Validator, lint and build green (CI enforces on push)

## Cadence anchors

- **Directory**: monthly status sweep, quarterly full re-verification.
  The validator warns in CI when any record's `lastVerified` passes six
  months, staleness is a build failure waiting to happen, not a surprise.
- **CI**: weekly full validation sweep (Monday 06:17 UTC) plus every push
  and pull request (`.github/workflows/ci.yml`).
