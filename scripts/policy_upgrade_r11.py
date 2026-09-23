#!/usr/bin/env python3
"""
policy_upgrade_r11.py - Editor-delegated claim upgrades from the 2026-09-23 capture batch.

humanGate note: the editor (DataCentre254 owner) delegated this upgrade on 2026-09-23
("you have authority to decide best way forward, draft the claim-upgrade diffs").
Every change below cites captured Tier-1 text; captures themselves stay status:
capture-pending at file level until final editorial sign-off.

Upgrades applied:
  KE-TX-C2  partially-verified -> verified      (SEZ Act 2015 consolidated, s.35)
  KE-TX-C4  partially-verified -> verified      (EPZ Act Cap 517, Part VIII s.32)
  RW-AI-C1  partially-verified -> verified      (ICT SSP 2024-2029 full text)
  UG-TX-C1  stays partially-verified            (Code+Free Zones Act captured; 10-yr
                                                 holiday lives in Income Tax Act, not yet captured)

Run from repo root:  python3 scripts/policy_upgrade_r11.py
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DS = ROOT / "src/data/policy/policy-claims-2026-Q3.json"

raw = DS.read_text()
d = json.loads(raw)
orig = raw  # for change detection

R = "2026-09-23"
SUFFIX = f" | r11 upgrade (editor-delegated {R}): "

# ---------------------------------------------------------------- new sources
NEW_SOURCES = {
    "kenyalaw-sez-act-2015": {
        "label": "Special Economic Zones Act (No. 16 of 2015), consolidated text eng@2024-12-27 (Kenya Law)",
        "tier": 1,
        "captureStatus": "captured",
        "retrievedDate": R,
        "url": "https://new.kenyalaw.org/akn/ke/act/2015/16/eng@2024-12-27",
        "publisher": "new.kenyalaw.org (National Council for Law Reporting)",
        "sourceType": "Official statute text (consolidated)",
        "captureNote": f"Full consolidated text captured {R} (research/captures/2026-09-23-new-kenyalaw-org-akn-ke-act-2015-16-eng-2024-12-27.md). Part VI s.35 incentives; amendment history cited inline.",
    },
    "kenyalaw-epz-act-cap517": {
        "label": "Export Processing Zones Act (No. 12 of 1990; Cap 517), consolidated text eng@2023-07-01 (Kenya Law)",
        "tier": 1,
        "captureStatus": "captured",
        "retrievedDate": R,
        "url": "https://new.kenyalaw.org/akn/ke/act/1990/12/eng@2023-07-01",
        "publisher": "new.kenyalaw.org (National Council for Law Reporting)",
        "sourceType": "Official statute text (consolidated)",
        "captureNote": f"Full consolidated text captured {R} (research/captures/2026-09-23-new-kenyalaw-org-akn-ke-act-1990-12-eng-2023-07-01.md). Part VIII benefits incl. 10-year income tax exemption (s.32(c)).",
    },
    "ulii-investment-code-2019": {
        "label": "Investment Code Act, 2019 (Act 6 of 2019; Chapter 74) (ULII)",
        "tier": 1,
        "captureStatus": "captured",
        "retrievedDate": R,
        "url": "https://ulii.org/akn/ug/act/2019/6/eng@2019-03-29/source",
        "publisher": "ulii.org (Uganda Legal Information Institute)",
        "sourceType": "Official statute text (PDF)",
        "captureNote": f"Full Act text captured {R} (research/captures/2026-09-23-ulii-org-akn-ug-act-2019-6-eng-2019-03-29-source.md). s.12 incentive qualification incl. 80 percent export criterion; s.13 certificate of incentives. HTML page is a JS shell - PDF source used.",
    },
    "ulii-free-zones-act-2014": {
        "label": "Free Zones Act, 2014 (Act 5 of 2014) (ULII)",
        "tier": 1,
        "captureStatus": "captured",
        "retrievedDate": R,
        "url": "https://ulii.org/akn/ug/act/2014/5/eng@2014-04-25/source",
        "publisher": "ulii.org (Uganda Legal Information Institute)",
        "sourceType": "Official statute text (PDF)",
        "captureNote": f"Full Act text (as at 25 Apr 2014) captured {R} (research/captures/2026-09-23-ulii-org-akn-ug-act-2014-5-eng-2014-04-25-source.md). s.48 exemptions on EPZ imported inputs. No 10-year income tax holiday in this instrument.",
    },
    "minict-ssp-2024-2029-pdf": {
        "label": "ICT Sector Strategic Plan 2024-2029 (MINICT, Rwanda)",
        "tier": 1,
        "captureStatus": "captured",
        "retrievedDate": R,
        "url": "https://www.minict.gov.rw/index.php?eID=dumpFile&t=f&f=130180&token=5eaf01e5021aa23cb56ae6c37abcad7729534c7b",
        "publisher": "minict.gov.rw (Ministry of ICT and Innovation, Rwanda)",
        "sourceType": "Official strategy document (PDF)",
        "captureNote": f"Full SSP text captured {R} (research/captures/2026-09-23-minict-gov-rw-index-php.md). SRMP II pillar alignment verbatim; data-centre actions incl. EUCL industrial-tariff categorisation.",
    },
}

added = [k for k in NEW_SOURCES if k not in d["sources"]]
d["sources"].update(NEW_SOURCES)

# ---------------------------------------------------------------- claim upgrades
CLAIMS = {c["id"]: c for co in d["countries"].values() for c in co.get("claims", [])}

def upgrade(cid, new_state, add_sources, note_addendum):
    c = CLAIMS[cid]
    before_state = c["state"]
    for s in add_sources:
        if s not in c["sourceIds"]:
            c["sourceIds"].append(s)
    c["note"] = (c.get("note", "") + SUFFIX + note_addendum).strip()
    if new_state:
        c["state"] = new_state
    print("%-10s %-19s -> %-19s (+%d sources)" % (
        cid, before_state, c["state"], len(add_sources)))

upgrade("KE-TX-C2", "verified", ["kenyalaw-sez-act-2015"],
    "SEZ Act 2015 consolidated text (T1, Kenya Law) captured: s.35(1) grants licensed SEZ "
    "enterprises/developers/operators tax incentives as specified in the respective tax laws; "
    "s.35(2) enumerates exemptions (stamp duty, county advertisement/business-service fees, "
    "specified licences); s.35(5) limits incentives and tax benefits to ten years from licence "
    "issuance. Amendment history (Acts 38/2016 s.67, 4/2023 s.101, 20/2024 s.33) is cited inline "
    "in the consolidated text, reconciling the Bowmans amendment notes. Specific CIT rate rests "
    "in the Income Tax Act (rate-level capture optional; regime claim now T1-anchored).")

upgrade("KE-TX-C4", "verified", ["kenyalaw-epz-act-cap517"],
    "EPZ Act (Cap 517; No. 12 of 1990) consolidated text (T1) captured: Part VIII s.32 - exemption "
    "from income tax for the first ten years from date of first sale as an EPZ enterprise, with the "
    "rate limited to 25% for the ten years following; duty and VAT exemptions on EPZ imports "
    "(machinery, spare parts, raw materials, intermediate goods, construction materials); withholding "
    "tax exemption on non-resident payments during the holiday; licence grant conditioned on "
    "producing goods or services for export. Snippet-grade specifics (10-year holiday, duty/VAT "
    "relief) now confirmed verbatim in the statute.")

upgrade("RW-AI-C1", "verified", ["minict-ssp-2024-2029-pdf"],
    "SSP 2024-2029 full text (T1 PDF, minict.gov.rw) captured: 'The SSP is based on three "
    "foundational pillars from SRMP II: Digital Business, Digital Citizen, and Digital Government'; "
    "alignment passage names NST2 (2024/25-2028/29), SRMP II (2024-2028), DTS (2020-2030), Vision "
    "2050, AU Agenda 2063 and SDGs. SSP additionally evidences data-centre-specific policy content: "
    "planned EUCL framework to categorise data centres under industrial tariffs (electricity-cost "
    "halving rationale), 50% hosting-price reduction at the National Data Center, 2023 data-centre "
    "and cloud service directives, and an explicit action to 'Invest in building and upgrading "
    "secure data centers'.")

upgrade("UG-TX-C1", None, ["ulii-investment-code-2019", "ulii-free-zones-act-2014"],
    "Investment Code Act 2019 (T1, ULII) captured: s.12 sets incentive qualification (minimum "
    "capital, Schedule 2 priority areas, 80% export criterion, 60% citizen employment), s.13 "
    "provides the Authority's certificate of incentives, and the Uganda Free Zones Authority is "
    "named in s.4 definitions. Free Zones Act 2014 s.48 (T1) confirms exemptions from taxes and "
    "duties on EPZ imported inputs. However, neither captured instrument contains the 10-year "
    "income tax holiday: the Code defers to 'qualifications for incentives set out in any other "
    "law' and the captured Free Zones Act is the 2014 original. The holiday (T3: PwC tax summaries "
    "confirm availability to 80%+ exporters) lives in the Income Tax Act as amended - claim remains "
    "partially-verified pending that instrument's capture.")

# ---------------------------------------------------------------- metadata
d["datasetVersion"] = "policy-2026-Q3-r11"
d["generatedAt"] = R

out = json.dumps(d, indent=2, ensure_ascii=False) + "\n"
DS.write_text(out)

from collections import Counter
states = Counter(c["state"] for co in d["countries"].values() for c in co.get("claims", []))
print()
print("sources: %d (+%d new)" % (len(d["sources"]), len(added)))
print("states:", dict(states))
print("datasetVersion ->", d["datasetVersion"])
