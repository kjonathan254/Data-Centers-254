#!/usr/bin/env python3
"""
DC254 production uptime probe (audit O03).

Called by .github/workflows/uptime-monitor.yml every 10 minutes. Exits 0 only
when production is up AND the operational invariants hold; a non-zero exit
fails the scheduled run, which sends the repository owner a GitHub
notification - the alerting channel that needs no extra accounts.

Invariants checked (single source of truth: the /api/health contract):
  ok == true                        the site answers
  rateLimiting == "persistent"      Redis env still wired in production;
                                    a silent flip to "memory" alerts
  emailStack.subscribeSecret true   newsletter double opt-in still signed
  redis.reachable is not False      the limiter's live PING still reaches
                                    Upstash (P0-6 degradation visibility)

Two attempts, 15 s apart, so a transient network blip does not page anyone.
"""

import json
import sys
import time
import urllib.request

HEALTH_URL = "https://data-centers-254.vercel.app/api/health"
ATTEMPTS = 2
RETRY_DELAY_S = 15
TIMEOUT_S = 20


def fetch_health() -> dict:
    url = f"{HEALTH_URL}?cb={int(time.time() * 1000)}"
    req = urllib.request.Request(url, headers={"User-Agent": "dc254-uptime/1.0"})
    with urllib.request.urlopen(req, timeout=TIMEOUT_S) as res:
        if res.status != 200:
            raise RuntimeError(f"HTTP {res.status}")
        return json.loads(res.read().decode())


def check(d: dict) -> list[str]:
    problems: list[str] = []
    if d.get("ok") is not True:
        problems.append("health ok != true")
    if d.get("rateLimiting") != "persistent":
        problems.append(f"rateLimiting degraded: {d.get('rateLimiting')!r}")
    email_stack = d.get("emailStack") or {}
    if email_stack.get("subscribeSecret") is not True:
        problems.append("subscribeSecret missing in production")
    redis = d.get("redis")
    if isinstance(redis, dict) and redis.get("reachable") is False:
        problems.append(f"Redis unreachable from runtime (latencyMs={redis.get('latencyMs')})")
    return problems


def main() -> int:
    last_error: str | None = None
    for attempt in range(1, ATTEMPTS + 1):
        try:
            data = fetch_health()
        except Exception as exc:  # noqa: BLE001 - probe must never crash uncleanly
            last_error = f"fetch failed: {exc}"
            print(f"attempt {attempt}: {last_error}", file=sys.stderr)
            if attempt < ATTEMPTS:
                time.sleep(RETRY_DELAY_S)
            continue

        problems = check(data)
        if not problems:
            print(f"uptime check passed | rateLimiting={data.get('rateLimiting')} | redis={data.get('redis')}")
            return 0
        last_error = "; ".join(problems)
        print(f"attempt {attempt}: HEALTH CHECK FAILED: {last_error}", file=sys.stderr)
        if attempt < ATTEMPTS:
            time.sleep(RETRY_DELAY_S)

    print(f"uptime probe FAILED after {ATTEMPTS} attempts: {last_error}", file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
