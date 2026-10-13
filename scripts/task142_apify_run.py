#!/usr/bin/env python3
"""Task 142 - DC254 Intelligence Monitor: minimal Apify collection runner.

House rules encoded here:
  - APIFY_TOKEN comes from the environment ONLY. Never printed, never saved.
  - Collection is SMALL by default (few queries x 1 page x 10 results).
  - Raw dataset output is saved verbatim under intelligence/raw/ with a run
    metadata sidecar; nothing in this script writes to the live directory.
  - Every record produced downstream must enter the review queue as
    UNREVIEWED (see intelligence/README.md and docs/intelligence-monitor.md).

Usage:
  python3 scripts/task142_apify_run.py check
  python3 scripts/task142_apify_run.py run \
      --actor apify~google-search-scraper \
      --out intelligence/raw/2026-10-14-pilot-news.json \
      --query "data centre Kenya announcement October 2026" [...]
"""

import argparse
import json
import os
import sys
import time
import urllib.parse
import urllib.request

API = "https://api.apify.com/v2"


def _url(path: str, **params) -> str:
    params["token"] = os.environ["APIFY_TOKEN"]
    return f"{API}{path}?{urllib.parse.urlencode(params)}"


def _get(url: str, timeout: int = 60):
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))


def _post_json(url: str, payload: dict, timeout: int = 60):
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url, data=data, method="POST",
        headers={"Content-Type": "application/json", "Accept": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))


def cmd_check() -> int:
    d = _get(_url("/users/me"))["data"]
    plan = d.get("plan") or {}
    print("username:", d.get("username"))
    print("plan:", plan.get("nickname"))
    print("token OK: True")
    return 0


def cmd_run(args) -> int:
    if args.input_json:
        run_input = json.loads(args.input_json)
    else:
        if not args.queries:
            print("ERROR: at least one --query required (or use --input-json)",
                  file=sys.stderr)
            return 2
        run_input = {
            # google-search-scraper expects queries as ONE newline-separated string
            "queries": "\n".join(args.queries),
            "resultsPerPage": args.results_per_page,
            "maxPages": args.max_pages,
        }
    started = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    run = _post_json(_url(f"/acts/{args.actor}/runs"), run_input)["data"]
    run_id = run["id"]
    print("run started:", run_id)

    deadline = time.time() + args.timeout
    status = run.get("status", "READY")
    while status not in ("SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"):
        if time.time() > deadline:
            print(f"ERROR: timed out after {args.timeout}s (run {run_id} still {status})",
                  file=sys.stderr)
            return 3
        time.sleep(5)
        run = _get(_url(f"/actor-runs/{run_id}"))["data"]
        status = run.get("status")
        print("  status:", status)

    if status != "SUCCEEDED":
        print(f"ERROR: run {run_id} ended {status}", file=sys.stderr)
        return 4

    dataset_id = run["defaultDatasetId"]
    items = _get(_url(f"/datasets/{dataset_id}/items", clean="true", format="json"))

    os.makedirs(os.path.dirname(args.out) or ".", exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=1)

    finished = run.get("finishedAt", "")
    usage_fields = {
        k: v for k, v in run.items()
        if ("sage" in k or k in ("pricingInfo", "stats")) and v is not None
    }
    meta = {
        "runId": run_id,
        "actor": args.actor,
        "status": status,
        "startedAt": run.get("startedAt", started),
        "finishedAt": finished,
        "input": run_input,
        "itemsCollected": len(items),
        "usage": usage_fields,
    }
    meta_path = args.out.replace(".json", ".run-meta.json")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=1)

    print("items:", len(items))
    print("saved:", args.out)
    print("meta :", meta_path)
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description="DC254 Intelligence Monitor - Apify runner")
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("check")
    r = sub.add_parser("run")
    r.add_argument("--actor", default="apify~google-search-scraper")
    r.add_argument("--out", required=True)
    r.add_argument("--query", dest="queries", action="append", default=[])
    r.add_argument("--input-json", default=None,
                   help="Raw actor input JSON (overrides query-based google-search input)")
    r.add_argument("--results-per-page", type=int, default=10)
    r.add_argument("--max-pages", type=int, default=1)
    r.add_argument("--timeout", type=int, default=300)
    args = ap.parse_args()
    if "APIFY_TOKEN" not in os.environ:
        print("ERROR: APIFY_TOKEN not set in environment", file=sys.stderr)
        return 2
    return cmd_check() if args.cmd == "check" else cmd_run(args)


if __name__ == "__main__":
    sys.exit(main())
