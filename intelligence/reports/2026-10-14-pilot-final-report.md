# DC254 Intelligence Monitor - Pilot Final Report

**Tasks 142-143 | 14 October 2026 | Status: delivered**

This is the closing record for the Intelligence Monitor pilot authorized by the
editor on 14 October 2026 ("Authority granted continue on the tasks above and
deliver the final report"). It covers Task 142 (build + first collection) and
Task 143 (verification pass, platform updates, final report). A formatted PDF
version accompanies this record at `/home/z/my-project/download/`.

## 1. Executive summary

The editor's brief asked DC254 to move from manual searching to a systematic,
evidence-led intelligence operation, using Apify as the collection layer with a
human review queue between collection and everything DC254 publishes. Over two
sessions the platform now has exactly that: a working four-stream collection
pipeline (facilities, connectivity, workforce, policy), a common evidence
register with a controlled taxonomy, a first review pass with 14 verdicts
applied, two evidence-backed platform updates, and a fully documented cost base
of USD 0.056 for the entire pilot. Nothing unverified entered the directory;
every changed line on the site carries its evidence chain. The single most
important structural outcome is that DC254 can now run repeatable, small,
costed collections on demand, and every record they produce lands in a review
queue rather than in the live dataset.

## 2. What was built (Task 142)

| Component | Path | Purpose |
| --- | --- | --- |
| Collection runner | `scripts/task142_apify_run.py` | Token via env only, async run + poll, verbatim raw + run-meta sidecar |
| Ingest/normalizer | `scripts/task142_ingest_apify.py` | Rule-based classification, URL dedupe, UNREVIEWED stamping, schema validation |
| Evidence schema | `intelligence/evidence-record.schema.json` | Common record fields + topic-specific fields |
| Taxonomy | `intelligence/taxonomy.json` | 5 topics, 7 role categories with auditable keywords |
| Review workspace | `intelligence/` (raw/queue/briefs/reports) | Collected -> analysed -> reviewed -> approved pipeline |
| System documentation | `docs/intelligence-monitor.md` | Invariants, streams, actor evaluation rule, never-list |

Design invariants held throughout: collection is never coupled to `src/data/`;
records start UNREVIEWED; announcements are not operational status; job ads are
not a shortage measure; UNKNOWN is used rather than fabrication; the Apify
token lives only in the process environment and was never written to the repo
(`rg "apify_api_"` over the tree returns zero hits).

## 3. Collection results

Two Google Search Results Scraper runs (4 queries each, first SERP page,
10 results per query) plus one page-level fetch batch:

- **Pilot discovery** (run `EYJrixtPCxsEDAnS2`, 13/14 Oct): 35 organic results
  -> 34 deduplicated records: workforce 11, policy 10, connectivity 8,
  facility 5.
- **Verification search** (run `RIrOYtA0Pp9AfQo27`, 14 Oct): targeted queries
  for the KDIAP procurement notice, the CA licence decision, and the
  iXAfrica-Oracle cloud region; results used as leads for page fetches.
- **Page fetches** (apify/web-fetch, 6 targets): 5 succeeded, 1 failed
  (au-pida.org blocks datacenter IPs from both this sandbox and Apify egress).

Actor lessons recorded: google-search-scraper takes `queries` as one
newline-joined string; rag-web-browser requires a `query` field and ignored a
bare `urls` list (one misconfigured run, USD 0.012, kept in the ledger for
honesty); web-fetch takes a single `url` per run at ~USD 0.0016 per fetch.

## 4. Verification results (Task 143 review pass)

14 verdicts applied on 14 October 2026; 20 records remain UNREVIEWED with
review-trail notes; 1 new record created; 1 topic misclassification corrected
(workforce -> connectivity, documented in change history). Verdicts:

| Finding | Verdict | Evidence |
| --- | --- | --- |
| iXAfrica "IT Intern - Data Centre Operations" posting | Corroborated, EXPIRED | Official careers page fetched; states "Expired on: Mar 15, 2026" |
| Skills requested by that employer | Extracted verbatim | 32-item skill list (Linux, Python, Ansible, Terraform, K8s, ELK, Wazuh, CIS hardening, Android); GitHub portfolio mandatory |
| iXAfrica to host Oracle cloud region | Corroborated with caveat | DCD 27 Jan 2026 confirms host-partner announcement; Oracle's own regions page (fetched 14 Oct) lists Kenya as "Coming soon", NOT live |
| WIOCC US$300M announcement | Corroborated | WIOCC's own page dates it 3 September 2026, matching the house record (announced 3 Sep, captured 10 Oct); WIOCC Kenya Ltd subsidiary confirmed |
| AMACO $1.5B approval-seeking item | Corroborated, no news | Matches the house announced-not-built record; no new milestone found |
| KDIAP tender "closes 29 October" | UNVERIFIED | Two targeted searches found no official SPN; social posts only; do not publish the deadline |
| CA data-centre licence decision | None found | CA adopted licence conditions for OTHER categories (Gazette Notice No. 12181, 14 Jul 2026); the standalone DC licence outcome remains open |
| PIDA Juba-Nairobi prospectus | Fetch failed | au-pida.org unreachable from both egresses; manual review required |

The headline analytical nugget from the workforce stream: a data-centre
operations internship in Nairobi demanding heavy automation and DevOps skills
(Python/Bash/Ansible/Terraform/Kubernetes), a security toolchain, and a
mandatory GitHub portfolio. One verified record is not a trend, and the record
is expired, but it is exactly the kind of primary evidence the Workforce Watch
design called for, captured verbatim with its source.

## 5. Platform changes applied

1. `/tracker/licensing` note (Standalone Data Centre licence, proposed):
   appended a dated follow-up line - no finalisation decision located as of
   14 October 2026; the CA did adopt licence conditions for other categories
   under the revised market structure (Gazette Notice No. 12181, 14 July 2026).
   Evidence: Digital Policy Alert event page fetched 14 Oct
   (`intelligence/raw/2026-10-14-page-dpa.json`).
2. `docs/newsletter/issue-004-prep.md` candidate 3 (WIOCC US$300M): added a
   primary-source corroboration paragraph with the fetched-page evidence and
   the exact Issue 003 dating (announced 3 Sep 2026, captured 10 Oct 2026).
3. Review queue: verdicts recorded in
   `intelligence/queue/2026-10-14-pilot.json` with change history preserved;
   review report at `scripts/task143-review-report.json`.

Nothing else changed. The directory (31 records), the tracker figures, and all
published content are untouched, because no collected item verified a change to
them. Two dated follow-ups now exist precisely so the next check can measure
movement (licence decision; first Oracle region status flip).

## 6. Cost report

10 Apify runs, total **USD 0.05607** (free-plan allowance USD 5/month; the
entire pilot consumed about 1.1 percent of one month's included usage):

| Run | Actor | Purpose | Result | USD |
| --- | --- | --- | --- | --- |
| EYJrixtPCxsEDAnS2 | google-search-scraper | Pilot discovery, 4 queries | 35 organic | 0.01805 |
| RIrOYtA0Pp9AfQo27 | google-search-scraper | Verification search, 4 queries | leads | 0.01805 |
| oAue8ha6xwlWQBBmg | rag-web-browser | Misconfigured input (lesson) | discarded | 0.01212 |
| WinqQM23AAVItKndR | web-fetch | iXAfrica job posting | captured | 0.00155 |
| e55Zca5URnKaLvHeX | web-fetch | WIOCC regional presence | captured | 0.00155 |
| Nf64g7bOI82GnvZFq | web-fetch | Oracle regions page | captured | 0.00155 |
| UuJjGv94EFjJm1AVx | web-fetch | Digital Policy Alert event | captured | 0.00155 |
| BoP72UdYda5iPqEVP | web-fetch | DCD article | captured | 0.00155 |
| ElSpkq6rPgf5HuWyM | web-fetch | PIDA prospectus (failed) | blocked | 0.00005 |
| sENWMG4KU6lflcfsa | web-fetch | PIDA retry (failed) | blocked | 0.00005 |

At measured rates, a full four-query discovery run plus a six-page fetch batch
costs about USD 0.03; the free allowance covers roughly 160 such cycles per
month. No paid plan, no residential proxies, no schedules.

## 7. Limitations and evidence gaps

Collection operates on first SERP pages only, in English, from one search
provider, with unknown regional personalization; snippets are Google-rendered
text rather than publisher pages, which is why every lead requires a page-level
review before use. Three source classes resisted automation this pass:
EPRA (egress-blocked, known class), au-pida.org (datacenter-IP block), and
LinkedIn/Facebook post bodies (login-walled by design and deliberately not
bypassed). The KDIAP procurement notice could not be located from this egress,
so the 29 October closing claim stays unverified. The Kenya Law gazette URL for
Notice 12181 has not been captured yet. Finally, the queue holds 29 records
that remain UNREVIEWED, several of which (LinkedIn "106 jobs" aggregate, the
AfricaDCA talent-shortage piece, legal guides) are context material rather than
dataset candidates.

## 8. Recommendations and next 30 days

1. **Rotate the Apify token** shared in chat (editor-side; the current one was
   never stored in the repo but appeared in conversation).
2. **Locate the KDIAP Specific Procurement Notice** on World Bank or ministry
   portals before the reported 29 October closing date; a verified capture
   would make a dated policy-intel item.
3. **Capture Kenya Gazette Notice No. 12181** (Kenya Law) as the official
   anchor for the licensing-tracker follow-up note.
4. **Workforce Watch expansion**: monthly small runs on the same four queries
   plus direct crawls of approved employer careers pages only; build the first
   skills-frequency table once 10+ verified official postings exist; keep
   advertised-demand framing (never shortage claims).
5. **Re-check two trigger points monthly**: Oracle Kenya region status
   ("Coming soon" as of 14 Oct) and the CA licence decision; both are dated
   follow-ups where movement is the story.
6. **Actor evaluation** for a job-specific scraper only after the free-layer
   approach stops yielding official postings; decide schedules only after two
   clean weekly cycles.
7. **Questions worth putting to employers and educators** (from the pilot's
   evidence so far): are automation/DevOps skills now baseline expectations for
   DC operations entry roles in Nairobi; which certifications do Kenyan
   operators actually request; what share of DC-adjacent roles are posted on
   aggregators versus official career pages.

Success measures for the next cycle: at least two weekly briefs produced from
scheduled-free runs, 10+ verified official workforce records, both trigger
points re-checked with dated outcomes, and a decision on which stream justifies
recurring automation first - with the review queue still the only path to the
published platform.
