# DC254 Intelligence Monitor

System documentation for the Apify-powered collection layer (Task 142, first
operational 2026-10-14). The editor's brief: move DC254 from manual searching
to a systematic digital-infrastructure intelligence operation, where Apify
collects raw material, AI organizes it, and humans verify it before anything
touches the platform. Apify is not the intelligence; it is the collection layer.

## Design invariants (non-negotiable)

1. **Separation.** Raw collection (`intelligence/raw/`) is never coupled to the
   live directory (`src/data/`). Nothing auto-publishes. Nothing auto-edits a
   verified record. A human reviewer stands between every finding and every
   dataset, tracker or article change.
2. **Evidence rules carry over.** An announcement is not operational status.
   Advertised jobs are not proof of a skills shortage. AI confidence scores are
   not proof. Missing records are not proof of absence. Announced vs financed
   vs commissioned vs operational stays layered, exactly as everywhere else.
3. **0 credits.** Runs stay on the Apify free plan allowance (USD 5/month,
   included). The 2026-10-14 pilot cost USD 0.018 for 4 SERP pages
   (PAY_PER_EVENT, ~USD 0.0045/page). No paid plan, no residential proxies,
   no scheduled spend without editor approval. Record the cost of every run
   (the runner saves a `.run-meta.json` sidecar; usage also visible via
   `GET /v2/actor-runs/{id}` -> `usageTotalUsd`).
4. **Token hygiene.** `APIFY_TOKEN` lives in the environment only. It is never
   committed, never printed, never stored in the repo or the chat transcript.
   If a token ever leaks, rotate it at
   https://console.apify.com/settings/integrations.
5. **Respect sources.** No login, CAPTCHA or paywall bypass. Official pages
   are crawled only within approved domains and page limits. Personal data is
   collected only when publicly advertised (e.g. a job posting) and only what
   the research needs.

## The four streams

| Stream       | Watches                                                     | Review questions                                   |
| ------------ | ----------------------------------------------------------- | -------------------------------------------------- |
| facility     | Operators, developers, projects: new sites, construction, capacity, status changes | Did any verified record's status actually change? |
| connectivity | Submarine cables, fibre, IXPs, cloud regions, network expansions | Ready-for-service vs announced; map/tracker source candidates |
| workforce    | Job ads, skills, qualifications, courses, certifications    | What do employers actually ask for (advertised demand)? |
| policy       | Regulation, licensing, energy policy, tenders, consultations | Any decision after a consultation window closes? |

All streams share one evidence-register schema
(`intelligence/evidence-record.schema.json`) and one classification vocabulary
(`intelligence/taxonomy.json`) so a facility announcement can be linked to a
power requirement or a workforce question without treating claims as
interchangeable.

## Pipeline

```
Public sources
  -> Apify actor run (small, logged, costed)          [Collected]
  -> scripts/task142_ingest_apify.py                  [AI analysed]
       flatten -> classify (rule-based keywords)
       -> dedupe (normalized URL) -> stamp UNREVIEWED
  -> intelligence/queue/*.json                        [Human reviewed]
  -> editor approves specific changes                 [Approved for use]
  -> normal verification + validation + review flow
       (src/data or content changes go through the
       standard gates; nothing skips them)
```

Stage rules: records start `UNREVIEWED` and keep original wording alongside
any classification. Reviewers set `corroborated` / `disputed` / `rejected` /
`expired` after opening the source. Approved findings enter the platform only
through the normal verified-change process. Corrections and rejections stay
traceable in the change_history field.

## Collection procedure (per run)

1. Define the queries (small by design; 4 queries x 1 SERP page is a proven
   USD-0.02-class run).
2. Run `scripts/task142_apify_run.py run --out intelligence/raw/<date>-<name>.json
   --query "..." [--query "..."]`. The script polls, saves the verbatim dataset
   and a run-metadata sidecar, and never writes outside `intelligence/raw/`.
3. Run `scripts/task142_ingest_apify.py intelligence/raw/<file>.json --out
   intelligence/queue/<date>-<name>.json`. It validates every record against
   the schema rules and writes `scripts/task142-ingest-report.json`.
4. Skim and produce a brief under `intelligence/briefs/` (see
   `2026-10-14-pilot-brief.md` for the format: items, why it matters, what is
   verified vs uncertain, potential changes for review, duplicates/conflicts,
   cost and limitations).
5. Hand the review queue to the editor. Only approved items move on.

## Actor evaluation rule (before adding any new actor)

Pick actors by evidence, not name or popularity: inspect supported sources,
input/output schema, pricing model, per-result charges, proxy requirements and
reviews in the Store (discoverable via the MCP server's search-actors /
fetch-actor-details tools in a desktop client, or `GET /v2/store` in the API).
Prefer the documented `apify/*` actors (`google-search-scraper`,
`rag-web-browser`, `web-fetch`) plus one job-specific actor only after it is
tested against Kenyan listings. Avoid overlapping actors that collect the same
material without adding value.

## What the monitor must never do

- Overwrite `src/data/directory/current.json` or any tracker constant directly.
- Publish or draft public-facing text automatically.
- Treat a SERP snippet as the publisher's page.
- Treat an announcement as a facility status change.
- Treat job-ad volume as a national shortage measure.
- Increase spend, add schedules, or add paid actors without explicit approval.

## First-month goals (proposed, not guaranteed)

- A repeatable collection workflow with documented cost per run (done for the
  search-discovery layer; page-level crawls next, domain-limited).
- One structured evidence register across the four streams (schema live).
- A first weekly briefing reviewed by the editor.
- A human-review queue with the first corroborated/rejected verdicts recorded.
- A recommendation on which stream to automate first.
