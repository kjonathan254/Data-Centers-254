#!/usr/bin/env python3
"""Task 142 - DC254 Intelligence Monitor: normalize Apify raw output into
the evidence-record review queue.

House rules encoded here:
  - Every record is stamped UNREVIEWED. This script never writes to src/data/.
  - Country is only set on explicit evidence in the result itself
    (never from query scope alone). Otherwise UNKNOWN.
  - Organisation is recorded honestly as "domain: <host>" when only the
    domain is evidenced. Owner identity is a review task, not an assumption.
  - Original source wording (title + snippet) is preserved verbatim in
    claims_extracted / evidence_excerpt alongside any classification.
  - UNKNOWN is used for unavailable fields. Nothing is fabricated.

Usage:
  python3 scripts/task142_ingest_apify.py intelligence/raw/FILE.json [FILE2...] \
      --out intelligence/queue/NAME.json
"""

import argparse
import json
import os
import re
import sys
import time
from urllib.parse import urlparse

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TAXONOMY = json.load(open(os.path.join(REPO, "intelligence", "taxonomy.json")))

TOPIC_RULES = [
    ("workforce", ["job", "vacancy", "hiring", "careers", "recruitment", "intern",
                   "salary", "cv", "curriculum vitae", "apprenticeship",
                   "join our team", "graduate trainee"]),
    ("policy", ["tender", "procurement", "epra", "regulation", "regulatory",
                "licensing", "licence", "license", "communications authority",
                "ministry", "public participation", "consultation", "tariff",
                "data protection"]),
    ("connectivity", ["submarine", "fibre", "fiber", "ixp", "internet exchange",
                      "peering", "landing station", "bandwidth", "backbone",
                      "cloud region", "terrestrial cable"]),
    ("facility", ["data centre", "data center", "colocation", "colo facility",
                  "ai hub", "megawatt", "groundbreak", "tier certified",
                  "data-centre campus", "dc campus"]),
]

COUNTRY_RE = re.compile(r"\bkenya|kenyan|nairobi|mombasa|kisumu|nakuru|\.ke(/|$|\b)", re.I)

STATUSES = {"UNREVIEWED", "corroborated", "disputed", "rejected", "expired"}
TOPICS = set(TAXONOMY["topics"].keys())
REQUIRED = ["record_id", "topic", "record_type", "title", "source_url",
            "collected_at", "claims_extracted", "verification_status",
            "last_checked_at"]


def classify_topic(text: str) -> str:
    low = text.lower()
    for topic, kws in TOPIC_RULES:
        for kw in kws:
            if kw in low:
                return topic
    return "market"


def classify_role(text: str) -> str:
    low = text.lower()
    for cat, spec in TAXONOMY["role_categories"].items():
        if cat == "unclassified":
            continue
        for kw in spec["keywords"]:
            if kw in low:
                return cat
    return "unclassified"


def domain_of(url: str) -> str:
    host = urlparse(url).netloc
    return host[4:] if host.startswith("www.") else host


def normalize_url(url: str) -> str:
    u = urlparse(url)
    keep = [p for p in u.query.split("&")
            if p and not p.split("=")[0].lower() in
            {"utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"}]
    return f"{u.scheme}://{u.netloc}{u.path}" + (f"?{'&'.join(keep)}" if keep else "")


def validate(rec: dict) -> None:
    missing = [k for k in REQUIRED if k not in rec]
    if missing:
        raise ValueError(f"{rec.get('record_id', '?')}: missing {missing}")
    if rec["verification_status"] not in STATUSES:
        raise ValueError(f"{rec['record_id']}: bad status {rec['verification_status']}")
    if rec["topic"] not in TOPICS:
        raise ValueError(f"{rec['record_id']}: bad topic {rec['topic']}")
    if not re.match(r"^dc254-[a-z]+-\d{8}-\d{3,}$", rec["record_id"]):
        raise ValueError(f"{rec['record_id']}: bad id format")
    if not isinstance(rec["claims_extracted"], list) or not rec["claims_extracted"]:
        raise ValueError(f"{rec['record_id']}: claims_extracted must be non-empty list")
    if rec["reviewed_by"] is not None:
        raise ValueError(f"{rec['record_id']}: fresh records must have reviewed_by null")


def ingest_file(path: str, collected_at: str) -> tuple[list, list, list]:
    raw = json.load(open(path, encoding="utf-8"))
    meta_path = path.replace(".json", ".run-meta.json")
    run_meta = {}
    if os.path.exists(meta_path):
        run_meta = json.load(open(meta_path, encoding="utf-8"))
    run_id = run_meta.get("runId", "unknown")
    actor = run_meta.get("actor", "unknown")

    records, dupes = [], []
    for item in raw:
        query = (item.get("searchQuery") or {}).get("term", "") \
            if isinstance(item.get("searchQuery"), dict) else str(item.get("searchQuery", ""))
        for res in item.get("organicResults") or []:
            url = res.get("url") or ""
            if not url:
                continue
            title = (res.get("title") or "").strip()
            desc = (res.get("description") or "").strip()
            if not title and not desc:
                continue
            norm = normalize_url(url)
            if any(r["source_url"] == norm for r in records):
                dupes.append(norm)
                continue
            text = " ".join([title, desc, query])
            topic = classify_topic(text)
            rec = {
                "record_id": "PENDING",
                "topic": topic,
                "record_type": "search-result",
                "title": title or desc[:120],
                "organisation": f"domain: {domain_of(url)}",
                "country": "Kenya" if COUNTRY_RE.search(" ".join([title, desc, url])) else "UNKNOWN",
                "location": "UNKNOWN",
                "source_url": norm,
                "published_at": "UNKNOWN",
                "collected_at": collected_at,
                "event_date": "UNKNOWN",
                "claims_extracted": [desc or title],
                "evidence_excerpt": desc or title,
                "verification_status": "UNREVIEWED",
                "confidence_notes": (
                    "Search-result lead only: snippet is Google-rendered text, not the "
                    "publisher page. SERP position "
                    f"{res.get('position', 'n/a')}; source query '{query}'; "
                    f"SERP date label '{res.get('displayedUrl', 'n/a')}' unverified. "
                    "Organisation recorded as domain only; owner identity unverified. "
                    "Open the source_url and confirm before any use."
                ),
                "reviewed_by": None,
                "last_checked_at": collected_at,
                "change_history": [{"at": collected_at,
                                    "what": f"created from Apify run {run_id} ({actor})"}],
                "provenance": {
                    "runId": run_id,
                    "actor": actor,
                    "queryTerm": query,
                    "serpPosition": res.get("position"),
                    "displayedUrl": res.get("displayedUrl", ""),
                },
            }
            if topic == "workforce":
                rec["topic_fields"] = {
                    "role_category": classify_role(text),
                    "skills_required": [],
                    "qualifications_required": [],
                    "experience_required": "UNKNOWN",
                    "employment_type": "UNKNOWN",
                }
            records.append(rec)

    date = collected_at[:10].replace("-", "")
    by_topic_count = {}
    for r in records:
        t = r["topic"]
        by_topic_count[t] = by_topic_count.get(t, 0) + 1
        r["record_id"] = f"dc254-{t}-{date}-{by_topic_count[t]:03d}"
        validate(r)
    return records, dupes, [run_id]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("inputs", nargs="+")
    ap.add_argument("--out", required=True)
    ap.add_argument("--collected-at", default=None)
    args = ap.parse_args()
    collected_at = args.collected_at or time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

    all_records, all_dupes, run_ids = [], [], []
    for path in args.inputs:
        recs, dupes, rids = ingest_file(path, collected_at)
        seen = {r["source_url"] for r in all_records}
        for r in recs:
            if r["source_url"] in seen:
                all_dupes.append(r["source_url"])
                continue
            seen.add(r["source_url"])
            all_records.append(r)
        run_ids.extend(rids)
        print(f"  {path}: {len(recs)} records, {len(dupes)} in-file dupes")

    os.makedirs(os.path.dirname(args.out) or ".", exist_ok=True)
    out = {
        "generatedAt": collected_at,
        "runIds": sorted(set(run_ids)),
        "recordCount": len(all_records),
        "records": all_records,
    }
    json.dump(out, open(args.out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    topics = {}
    for r in all_records:
        topics[r["topic"]] = topics.get(r["topic"], 0) + 1
    report = {
        "generatedAt": collected_at,
        "inputs": args.inputs,
        "runIds": sorted(set(run_ids)),
        "recordsIn": len(all_records) + len(all_dupes),
        "recordsOut": len(all_records),
        "dupesRemoved": len(all_dupes),
        "dupes": all_dupes,
        "topicCounts": topics,
    }
    report_path = os.path.join(REPO, "scripts", "task142-ingest-report.json")
    json.dump(report, open(report_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    print("records:", len(all_records), "| topics:", topics,
          "| dupes removed:", len(all_dupes))
    print("queue:", args.out)
    print("report:", report_path)
    return 0


if __name__ == "__main__":
    sys.exit(main())
