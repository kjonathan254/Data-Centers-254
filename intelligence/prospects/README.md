# DC254 Prospects (Task 147)

Working prospect lists for revenue outreach. NOT part of the shipped site.
Separate from `intelligence/queue/` (which tracks market evidence records).

## Files

- `2026-10-14-launch-list.csv` - 54 named organizations for the first-dollar
  outreach sequence (12 priority A / 18 B / 24 C; 43 from the Task 147
  research battery + 11 added from the Task 148 Apify sweep).

## Schema

| Column | Meaning |
| --- | --- |
| org | Company name (no individual person names) |
| category | What they do |
| icp | ICP bucket from docs/revenue/first-dollar-plan.md (icp1-vendor, icp2-operator, icp3-analyst, icp4-recruiter, events, icp6-kdeap, channel) |
| city | Primary location |
| why_now | The dated reason to contact them now |
| evidence_url | Public source for the why_now claim |
| contact_channel | Official channel to use (website contact page, LinkedIn, official channels) |
| role_to_target | Job role to address, not a named person |
| priority | A = first 20 sends, B = second wave, C = opportunistic |
| verification_status | UNREVIEWED until the editor checks the evidence URL |
| added | Date added |
| notes | Caveats, flags, candidate-record notes |

## Hard rules

1. Every row starts UNREVIEWED. The editor (or a delegated reviewer) confirms
   the evidence URL before priority-A sends go out.
2. Company-level business contacts only. No personal emails, no private
   numbers, no scraping of individuals (Kenya DPA 2019 discipline).
3. why_now claims follow house evidence wording: REPORTED vs CONFIRMED is
   carried into sales conversations exactly as written here.
4. Statuses update in place: SENT / REPLIED / CALL / SALE / NO with dated
   notes appended to the notes column.
5. New rows enter via a script (see scripts/task147_build_prospects.py as the
   pattern), never by hand-editing the CSV directly.
