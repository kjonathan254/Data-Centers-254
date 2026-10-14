#!/usr/bin/env python3
"""Task 143 freshness pass: apply verification verdicts to the evidence register.

Editor directives (2026-10-14): verification authority granted ("You have the
authority to make the right decision that serves the platform"); Task 143 scope
confirmed ("3 okay"); Microsoft/ADC directive: "Use both Microsoft has been
laying people the ADC engineers are leaving their offices, if we don't have the
correct facts just bin it."

What this script does (evidence-backed, documented, ids stable):
1. NEW record dc254-workforce-20261014-001 (Microsoft ADC Nairobi closure):
   VERDICT corroborated. Facts hold across 8+ independent outlets; page-level
   fetches of Business Insider Africa, Kenyans.co.ke and WeeTracker carried
   og:description/title corroboration (2026-10-14). Microsoft's on-record
   response is recorded WITHIN the claim text with its own scope: acknowledges
   "proposed changes affecting its engineering operations in Kenya", will
   continue operating in Kenya, neither confirms nor denies closure, no
   headcount/dates. Closure claim itself remains staff-reported. Government
   engagement documented (CS Kabogo meeting, 12 Oct, Bullwinkel delegation).
   The US$100M figure is qualified as the launch investment target.
   If any element had failed verification the record would have been REJECTED
   and the brief item binned, per the editor's standing instruction.
2. Freshness review notes appended to dc254-policy-20261013-001 and -002
   (KDEAP SPN): PS Tanui posts re-surfaced 14 Oct with explicit "Specific
   Procurement Notice" reference and the 10:00 EAT 29 Oct deadline +
   icta.go.ke/tenders pointer; ICTA direct fetch is egress-blocked from this
   sandbox (connection-level, same class as au-pida.org/EPRA); publish-day
   re-verify instruction stands.
3. Freshness verdicts recorded for tracker-adjacent checks (no record exists /
   none needed): CA standalone DC licence still PROPOSED (no adoption notice
   found in 14-day window; proposal coverage unchanged since 8-10 Sep);
   CA satellite consultation primary page bot-gated from this egress (JS
   challenge), 6 Nov deadline per TechTrendsKE stands as secondary-sourced;
   iXAfrica robots.txt fetched: only /wp-admin/ disallowed -> job pages
   crawl-permitted for Workforce Watch (politeness rules apply).

No published platform content is modified by this script. The morning brief
markdown was amended in a separate commit (same news cycle, editor-approved
verification pass).
"""

import json
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
QUEUE = REPO / "intelligence" / "queue" / "2026-10-14-pilot.json"
REPORT = REPO / "scripts" / "task143-freshness-review.json"
REVIEWER = "Super Z (agent, editor verification authority 2026-10-14)"
NOW = "2026-10-14T12:40:00Z"

NEW_RECORD = {
    "record_id": "dc254-workforce-20261014-001",
    "topic": "workforce",
    "record_type": "news-report",
    "title": "Microsoft wind-down of Nairobi Africa Development Centre; government presses for job protection",
    "organisation": "Microsoft (Africa Development Centre, Nairobi); Ministry of ICT (Kenya)",
    "country": "Kenya",
    "location": "Dunhill Towers, Westlands, Nairobi",
    "source_url": "https://africa.businessinsider.com/local/markets/microsofts-nairobi-engineering-hub-faces-closure-as-kenya-moves-to-protect-jobs-at-us/kc3t7ge",
    "published_at": "2026-10-13",
    "collected_at": NOW,
    "event_date": "2026-10-12",
    "claims_extracted": [
        "Staff accounts (CIO Africa 12 Oct, tech-ish): Nairobi ADC employees were informed Monday 12 Oct 2026 that the centre closes; roles would end.",
        "About 400 roles at risk per staff reports and media (WeeTracker 'nearly 400'; Kenyans.co.ke 400-500). Reported figure, NOT a Microsoft number.",
        "Microsoft on-record response (obtained by CIO Africa and tech-ish, carried by Business Insider Africa 13 Oct): acknowledges 'proposed changes affecting its engineering operations in Kenya'; says it will continue operating in Kenya and supporting customers; neither confirms nor denies the closure; no headcount or dates given.",
        "CS William Kabogo met a Microsoft delegation led by Jeff Bullwinkel (VP, Deputy General Counsel, Corporate) on 12 Oct; public X statement stresses 'retaining local talent, protecting jobs at Microsoft's Nairobi engineering centre and sustaining investor confidence'; meeting also covered AI adoption in government, digitisation, cybersecurity, digital infrastructure, digital skills, and Microsoft support for the National AI Policy.",
        "Context: US$100M was the ADC launch investment target (five years, up to 500 engineers across Nairobi and Lagos), not a current valuation; second ADC site closure after Lagos (May 2024); ADC is a software-engineering hub, distinct from the stalled US$1B G42 campus (house record unchanged).",
        "Same reporting names Oracle's September Nairobi cuts and fresh Kenyan job adverts for DC technicians and AI infrastructure sales - reallocation signal for the workforce tracker.",
    ],
    "evidence_excerpt": (
        "Microsoft confirms proposed changes to Kenyan engineering operations as staff "
        "report a Nairobi hub closure plan and the government seeks to protect jobs "
        "(Business Insider Africa og:description, fetched 2026-10-14). Microsoft has "
        "acknowledged proposed changes affecting its engineering operations in Kenya. "
        "It says it will continue operating in the country and supporting customers. "
        "The company has not publicly specified the number of affected employees or "
        "when the changes would take effect."
    ),
    "verification_status": "corroborated",
    "confidence_notes": (
        "Editor directive 2026-10-14: verify the Microsoft/ADC story; use both angles "
        "(layoffs + engineers leaving); bin if the facts fail. Verification pass "
        f"{NOW} ({REVIEWER}): facts HOLD - kept, not binned. Evidence: 8+ independent "
        "outlets converge (WeeTracker, Tuko, TechCabal, Kenya Times, Kenyans.co.ke, "
        "TechAfrica News, Business Insider Africa, finalroundai; X/LinkedIn mirrors). "
        "Page-level fetches 2026-10-14: Business Insider Africa (og:description + full "
        "body: Microsoft response, Kabogo meeting, US$100M target qualification), "
        "Kenyans.co.ke 127805 (og:description, 400-500 range), WeeTracker (og:description, "
        "'nearly 400'; X/Oracle/Meta retreat context). URL checks: WeeTracker/Kenya "
        "Times/Kenyans 200; Tuko 403 and Reuters 401 are bot-blocks, not dead links. "
        "One conflicting social snippet (closure 'affects only West Africa/Nigeria ops') "
        "recorded and outweighed by direct Nairobi reporting; noted, not trusted. "
        "STATUS CAVEAT: the closure itself remains STAFF-REPORTED - Microsoft's on-record "
        "position acknowledges 'proposed changes' without confirming or denying; do not "
        "upgrade to CONFIRMED until Microsoft names headcount/dates or confirms closure. "
        "The G42 campus record and the 27-facility directory snapshot are NOT affected."
    ),
    "last_checked_at": NOW,
    "review_trail": [
        {
            "at": NOW,
            "actor": REVIEWER,
            "action": "created + corroborated (page-level: ABI full body; Kenyans.co.ke; WeeTracker)",
            "directive": "editor 2026-10-14: 'Use both ... if we don't have the correct facts just bin it'",
        }
    ],
}

KDEAP_NOTE = (
    "REVIEW {now} (Task 143 freshness): PS Tanui posts re-surfaced 14 Oct with an explicit "
    "'Specific Procurement Notice' reference (LinkedIn) and 'Bids close at 10:00 a.m. EAT on "
    "29 October 2026. Tender documents: icta.go.ke/tenders' (Facebook). Deadline therefore has "
    "two official-adjacent anchors (PS office posts) plus ITWeb (16 Sep). ICTA direct fetch is "
    "egress-blocked from this sandbox (connection-level failure, same class as au-pida.org / "
    "EPRA). The brief's standing instruction 're-verify against ICTA records on publish day' "
    "stands. No field changes."
).format(now=NOW)


def main():
    data = json.loads(QUEUE.read_text())
    recs = data["records"] if isinstance(data, dict) and "records" in data else data
    ids = {r["record_id"] for r in recs}
    changed = []

    # 1. new Microsoft/ADC record
    if NEW_RECORD["record_id"] not in ids:
        recs.append(NEW_RECORD)
        changed.append(NEW_RECORD["record_id"])

    # 2. freshness notes on the two KDEAP records
    for r in recs:
        if r["record_id"] in (
            "dc254-policy-20261013-001",
            "dc254-policy-20261013-002",
        ):
            notes = r.get("confidence_notes", "")
            if "Task 143 freshness" not in notes:
                r["confidence_notes"] = notes.rstrip() + " " + KDEAP_NOTE
                r["last_checked_at"] = NOW
                changed.append(r["record_id"] + " (freshness note)")

    if isinstance(data, dict) and "records" in data:
        data["records"] = recs
        data["last_updated"] = NOW
        QUEUE.write_text(json.dumps(data, indent=1, ensure_ascii=False) + "\n")
    else:
        QUEUE.write_text(json.dumps(recs, indent=1, ensure_ascii=False) + "\n")

    report = {
        "task": "Task 143 freshness pass (2026-10-14)",
        "checkedAt": NOW,
        "newRecords": 1,
        "recordsChanged": changed,
        "statusCounts": {},
        "verdicts": {
            "microsoft_adc_closure": {
                "record": "dc254-workforce-20261014-001",
                "verdict": "corroborated",
                "brief_item": "retained (editor: 'use both'); status stays REPORTED - Microsoft acknowledges 'proposed changes', closure unconfirmed",
                "key_evidence": [
                    "Business Insider Africa 13 Oct page fetch (Microsoft response + Kabogo meeting)",
                    "Kenyans.co.ke 13 Oct (400-500 range)",
                    "WeeTracker 13 Oct ('nearly 400', retreat context)",
                    "8+ independent outlets; Tuko/Reuters bot-blocks not dead links",
                ],
            },
            "kdeap_spn_timeliness": {
                "verdict": "deadline stands (10:00 EAT, 29 Oct 2026)",
                "basis": "PS posts re-surfaced with SPN reference + icta.go.ke/tenders pointer",
                "caveat": "icta.go.ke egress-blocked; publish-day re-verify stands",
            },
            "ca_dc_licence_timeliness": {
                "verdict": "still PROPOSED as of 14 Oct",
                "basis": "no adoption notice found; newest proposal coverage remains 8-10 Sep; CA market-structure page notes ULF (Apr 2026) only",
            },
            "ca_satellite_consultation": {
                "verdict": "secondary-sourced (TechTrendsKE), comments due 6 Nov",
                "caveat": "ca.go.ke primary page bot-gated from this egress (JS challenge)",
            },
            "ixafrica_crawl_evaluation": {
                "verdict": "crawl-permitted for Workforce Watch (robots.txt fetched 14 Oct)",
                "basis": "robots.txt disallows only /wp-admin/; sitemap published; standard politeness + site-terms check on first collection run",
            },
            "nif_editorial_angle": {
                "verdict": "angle closed: no documented ICT/data-centre-specific allocation",
                "basis": "first named NIF project = JKIA expansion (Citizen TV); parliament record lists highways/rail/airports/seaports; digital infrastructure remains CEO eligibility language, not a named allocation; reporting test validated",
            },
            "brief_source_urls": {
                "checked": 6,
                "ok_200": ["weetracker.com", "thekenyatimes.com", "kenyans.co.ke x2"],
                "bot_blocked": ["tuko.co.ke (403)", "reuters.com (401)"],
                "note": "bot-blocks verified live via search snippets, not dead links",
            },
        },
        "spend": {"apify_usd": 0.0, "notes": "no Apify token in env (rotation pending); all checks via free web search + direct fetches; 0 credits"},
    }
    # status counts after changes
    recs2 = json.loads(QUEUE.read_text())
    recs2 = recs2["records"] if isinstance(recs2, dict) and "records" in recs2 else recs2
    counts = {}
    for r in recs2:
        counts[r["verification_status"]] = counts.get(r["verification_status"], 0) + 1
    report["statusCounts"] = counts
    report["queueTotal"] = len(recs2)
    REPORT.write_text(json.dumps(report, indent=1, ensure_ascii=False) + "\n")
    print("changed:", changed)
    print("statusCounts:", counts, "total:", len(recs2))
    print("report:", REPORT)


if __name__ == "__main__":
    main()
