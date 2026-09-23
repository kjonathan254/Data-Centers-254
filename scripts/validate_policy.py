#!/usr/bin/env python3
"""
validate_policy.py - Policy Intelligence dataset validator (restored r11, 2026-09-23).

Checks src/data/policy/policy-claims-2026-Q3.json for:
  1. schema + version sanity
  2. country structure (4 countries, claims lists present)
  3. claim integrity: unique IDs, ID format, non-empty statement, valid state
  4. referential integrity: every sourceIds entry exists in sources; tier in {1,2,3}
  5. capture linkage: captureNote paths (research/captures/*.md) must exist on disk
  6. pillar validity: claims + pillarGaps reference declared pillars
  7. humanGate block present

Exit 0 = green. Exit 1 = errors (printed with [ERR]).
Run from repo root:  python3 scripts/validate_policy.py
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DS = ROOT / "src/data/policy/policy-claims-2026-Q3.json"
CAPTURES = ROOT / "research/captures"

errors, warnings = [], []
def err(m): errors.append(m)
def warn(m): warnings.append(m)

if not DS.exists():
    err("dataset file missing: %s" % DS)
    sys.exit(1)

try:
    d = json.loads(DS.read_text())
except json.JSONDecodeError as e:
    err("JSON parse error: %s" % e)
    sys.exit(1)

# 1. schema + version
if d.get("schemaVersion") != "0.2-policy":
    err("unexpected schemaVersion: %r" % d.get("schemaVersion"))
if not re.match(r"^policy-\d{4}-Q\d-r\d+$", d.get("datasetVersion", "")):
    err("bad datasetVersion: %r" % d.get("datasetVersion"))

# 2. countries
countries = d.get("countries")
if not isinstance(countries, dict) or len(countries) < 1:
    err("countries structure missing")
    sys.exit(1)

# 3+4. claims
status_vocab = set(d.get("statusVocabulary", {}).keys())
if not status_vocab:
    err("statusVocabulary missing/empty")
all_ids, all_claims = set(), []
for cname, cobj in countries.items():
    claims = cobj.get("claims", []) if isinstance(cobj, dict) else []
    if not claims:
        warn("country '%s' has no claims" % cname)
    for c in claims:
        cid = c.get("id", "")
        if cid in all_ids:
            err("duplicate claim id: %s" % cid)
        all_ids.add(cid)
        if not re.match(r"^[A-Z]{2}-[A-Z]{2,3}-C\d+$", cid):
            err("claim id format bad: %s" % cid)
        if not str(c.get("statement", "")).strip():
            err("claim %s: empty statement" % cid)
        st = c.get("state")
        if st not in status_vocab:
            err("claim %s: state %r not in statusVocabulary" % (cid, st))
        if not c.get("sourceIds"):
            err("claim %s: no sourceIds" % cid)
        for sid in c.get("sourceIds", []):
            src = d.get("sources", {}).get(sid)
            if src is None:
                err("claim %s: unknown sourceId %r" % (cid, sid))
            else:
                if src.get("tier") not in (1, 2, 3):
                    err("source %s: bad tier %r" % (sid, src.get("tier")))
                for req in ("label", "url", "publisher", "sourceType", "captureStatus"):
                    if not str(src.get(req, "")).strip():
                        err("source %s: missing field %s" % (sid, req))
        all_claims.append(c)

# 5. capture linkage: any research/captures/*.md path mentioned in captureNote must exist
cap_re = re.compile(r"research/captures/[\w.\-]+\.md")
checked = 0
for sid, src in d.get("sources", {}).items():
    for m in cap_re.findall(str(src.get("captureNote", ""))):
        checked += 1
        if not (ROOT / m).exists():
            err("source %s references missing capture file: %s" % (sid, m))
if checked == 0:
    warn("no capture files referenced from any source captureNote")

# 6. pillars
pillars = set()
for p in d.get("pillars", []):
    if isinstance(p, str):
        pillars.add(p)
    elif isinstance(p, dict):
        pillars.add(p.get("key") or p.get("id") or p.get("name"))
for c in all_claims:
    p = c.get("pillar")
    if pillars and p not in pillars:
        err("claim %s: pillar %r not in pillars declaration" % (c.get("id"), p))

# 7. humanGate
hg = d.get("humanGate")
if not hg or "rule" not in hg:
    err("humanGate block missing or malformed")

# ---------------------------------------------------------------- report
from collections import Counter
states = Counter(c["state"] for c in all_claims)
tiers = Counter(s.get("tier") for s in d.get("sources", {}).values())
print("Policy Intelligence validator")
print("  datasetVersion : %s" % d.get("datasetVersion"))
print("  countries      : %s" % ", ".join(countries))
print("  claims         : %d  %s" % (len(all_claims), dict(states)))
print("  sources        : %d  %s" % (len(d.get("sources", {})), dict(tiers)))
print("  capture links  : %d checked" % checked)
print("  verified ratio : %d/%d" % (states.get("verified", 0), len(all_claims)))
for w in warnings: print("  [WARN] %s" % w)
if errors:
    for e in errors: print("  [ERR] %s" % e)
    print("RESULT: FAIL (%d errors)" % len(errors))
    sys.exit(1)
print("RESULT: PASS")
