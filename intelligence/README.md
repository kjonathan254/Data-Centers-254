# DC254 Intelligence Monitor - Evidence Register

Internal collection-and-review workspace for the DC254 Intelligence Monitor
(Task 142). This directory is NOT part of the shipped site. Nothing here is
published, imported by `src/`, or coupled to the live directory.

## What this is

Apify collects public web material (search results, pages, listings). Scripts
in `scripts/` normalize that material into evidence records. A human reviewer
decides what, if anything, enters DC254's verified datasets, trackers or
articles. Collection never writes to `src/data/` directly.

## Review pipeline (four stages)

1. `Collected` - raw material saved verbatim under `raw/` with a run-metadata
   sidecar. No claim in it is treated as verified.
2. `AI analysed` - `scripts/task142_ingest_apify.py` flattens, classifies
   (topics per `taxonomy.json`), deduplicates and stamps every record
   `UNREVIEWED`. Keyword classification is rule-based and auditable.
3. `Human reviewed` - a reviewer opens the original URL, checks the claim,
   and sets `verification_status` accordingly (`corroborated`, `disputed`,
   `rejected`, `expired`).
4. `Approved for use` - only approved records may inform dataset changes,
   trackers, articles or The Rack Report. Rejected records stay traceable.

## Status legend (`verification_status`)

| Value         | Meaning                                            |
| ------------- | -------------------------------------------------- |
| UNREVIEWED    | Collected, never checked by a human (initial state) |
| corroborated  | Source opened and claim checked out                 |
| disputed      | Source conflicts with other evidence                |
| rejected      | Claim not supported by the source                   |
| expired       | Was valid when collected; source now stale/gone     |

## Layout

| Path                        | Purpose                                        |
| --------------------------- | ---------------------------------------------- |
| `raw/`                      | Verbatim Apify dataset exports + run metadata  |
| `queue/`                    | Normalized evidence records awaiting review    |
| `briefs/`                   | Daily/weekly intelligence briefs (drafts)      |
| `evidence-record.schema.json` | Common record schema (all topics)            |
| `taxonomy.json`             | Topics, role categories, skills taxonomy       |

## Hard rules

- Every new record starts `UNREVIEWED`. AI confidence is not proof.
- An announcement is not operational status. A job ad is not a skills
  shortage. A missing record is not proof something does not exist.
- Never fabricate fields; use `UNKNOWN`.
- Preserve original wording alongside any classification.
- Respect site terms, privacy obligations and access controls. No login,
  CAPTCHA or paywall bypass.
- No automated publishing, outreach, directory edits or paid-plan spend
  without explicit editor approval.
- The Apify token lives in the `APIFY_TOKEN` environment variable only.
  It is never committed, printed or stored in this repository.

## Running

```bash
# 1. Collect (small by design; ~USD 0.005 per SERP page as of 2026-10-14)
APIFY_TOKEN='...' python3 scripts/task142_apify_run.py run \
  --out intelligence/raw/<date>-<name>.json \
  --query "query 1" --query "query 2"

# 2. Normalize into the review queue
python3 scripts/task142_ingest_apify.py \
  intelligence/raw/<date>-<name>.json \
  --out intelligence/queue/<date>-<name>.json

# 3. A human reviews queue records; approved findings only then touch
#    src/data/, content/ or docs/newsletter/ through the normal
#    verification + validation + review process.
```
