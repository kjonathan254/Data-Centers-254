#!/usr/bin/env python3
"""Poll GitHub Actions for the run matching a full commit SHA until it completes."""
import sys, time, json, urllib.request

SHA = sys.argv[1] if len(sys.argv) > 1 else ""
TOKEN = sys.argv[2] if len(sys.argv) > 2 else ""
REPO = "kjonathan254/Data-Centers-254"
API = f"https://api.github.com/repos/{REPO}/actions/runs?head_sha={SHA}"
HDRS = {"Authorization": f"token {TOKEN}", "Accept": "application/vnd.github+json",
        "User-Agent": "ci-watcher"}

def get(url):
    req = urllib.request.Request(url, headers=HDRS)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

run = None
for _ in range(12):  # up to ~2 min for the run to register
    data = get(API)
    if data.get("total_count", 0) > 0:
        run = data["workflow_runs"][0]
        break
    time.sleep(10)
if not run:
    print("NO_RUN_FOUND"); sys.exit(1)

print(f"Run {run['id']} ({run['name']}) registered, polling...")
while True:
    r = get(run["url"])
    status, conclusion = r["status"], r.get("conclusion")
    print(f"  status={status} conclusion={conclusion}", flush=True)
    if status == "completed":
        print("SUCCESS" if conclusion == "success" else f"FAILED ({conclusion})")
        sys.exit(0 if conclusion == "success" else 1)
    time.sleep(20)
