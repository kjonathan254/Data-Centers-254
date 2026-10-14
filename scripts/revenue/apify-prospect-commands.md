# Apify scale-up batteries for DC254 revenue prospecting (Task 147)

READY-TO-RUN but BLOCKED on APIFY_TOKEN rotation (token not in env as of
2026-10-14; editor pastes it inline when available - never committed).

Uses the existing house runner `scripts/task142_apify_run.py`:
- APIFY_TOKEN from environment ONLY, never printed, never saved
- SMALL collections by default (few queries x 1 page x 10 results)
- Raw output saved verbatim under `intelligence/raw/` with run metadata
- Everything enters the review pipeline UNREVIEWED

## Battery 1 - tender and procurement watch (weekly, cheapest)

```bash
export APIFY_TOKEN=<paste-inline>
python3 scripts/task142_apify_run.py run \
  --actor apify~google-search-scraper \
  --out intelligence/raw/$(date +%F)-radar-tenders.json \
  --query "data centre tender Kenya 2026 ppra" \
  --query "KDEAP ICT Authority procurement 2026" \
  --query "UPS OR generator OR cooling tender Kenya ministry 2026" \
  --query "Kenya data centre RFP November 2026"
```

Estimated cost: well under USD 0.50 (4 queries x 1 page). Feeds the Radar
subscription product directly.

## Battery 2 - vendor discovery sweep (one-off at launch, then monthly)

```bash
python3 scripts/task142_apify_run.py run \
  --actor apify~google-search-scraper \
  --out intelligence/raw/$(date +%F)-radar-vendors.json \
  --query "data centre maintenance company Nairobi" \
  --query "fire suppression data centre Kenya company" \
  --query "structured cabling data centre Kenya firm" \
  --query "DCIM monitoring Kenya data centre supplier" \
  --query "generator dealer Kenya data centre Caterpillar Cummins"
```

Output feeds new rows into the prospect CSV via the
`scripts/task147_build_prospects.py` pattern (extend the script, keep rows
UNREVIEWED).

## Battery 3 - contact enrichment (only for priority-A rows)

```bash
python3 scripts/task142_apify_run.py run \
  --actor apify~website-content-crawler \
  --input-json '{"startUrls":[{"url":"https://atlancis.com"},{"url":"https://www.almirianetworks.co.ke"},{"url":"https://www.nuairtech.com"}],"maxCrawlDepth":1,"maxCrawlPages":9,"maxPagesPerCrawl":3}'
```

Crawl ONLY public contact pages of priority-A vendors. Extract the official
business contact channel (form, info@, office phone). No personal data.

## Battery 4 - job-post signal watch (weekly, Workforce Watch slice)

```bash
python3 scripts/task142_apify_run.py run \
  --actor apify~google-search-scraper \
  --out intelligence/raw/$(date +%F)-radar-jobs.json \
  --query "data centre technician job Nairobi 2026" \
  --query "facilities engineer data centre Kenya job" \
  --query "iXAfrica OR iColo OR \"Africa Data Centres\" careers"
```

A job post is not operational status (house rule), but it IS a spending
signal for recruiters (ICP-4) and a vendor-engagement signal for operators.

## House rules for all runs

1. Cost discipline: if a run would exceed ~USD 1.00 estimated, split it.
2. Check the free-plan balance first: `python3 scripts/task142_apify_run.py check`
3. Raw output verbatim to `intelligence/raw/`, never written to `src/`.
4. Prospect rows derived from runs start UNREVIEWED with the run URL as
   evidence.
5. Token rotation pending: the moment the new token arrives, run Battery 1
   and Battery 2 first (they feed the two sellable products directly).
