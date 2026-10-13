#!/usr/bin/env python3
"""Task 143 - apply review verdicts to the 2026-10-14 pilot queue.

Review authority: editor granted continuation authority 2026-10-14 ("Authority
granted continue on the tasks above"). Verdicts below were reached by opening
sources fetched via Apify web-fetch on 14 Oct 2026 (raw files under
intelligence/raw/2026-10-14-page-*.json). Records without an opened source stay
UNREVIEWED and only gain review-trail notes. Nothing here touches src/data
except the separately-committed licensing tracker note (market-trackers.ts),
whose evidence chain is documented in the final report.
"""

import json
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QUEUE = os.path.join(REPO, "intelligence", "queue", "2026-10-14-pilot.json")
REPORT = os.path.join(REPO, "scripts", "task143-review-report.json")
CHECKED = "2026-10-14T20:40:00Z"
REVIEWER = "Super Z (agent, editor authority 2026-10-14)"

IX_JOBS = "Linux administration, Python, Bash, Ansible, Terraform, Prometheus, Grafana, Netdata, Zabbix, Docker, Kubernetes (K3s/K8s), Helm, Jenkins, GitLab CI, Drone CI, ELK Stack (Elasticsearch/Logstash/Kibana), Graylog, Loki + Promtail, Wazuh, Security Onion, OpenVAS, Nmap, Trivy, Fail2Ban, Suricata, CIS Benchmark hardening, Git workflows, TCP/IP networking (DNS/DHCP/subnetting/routing), virtualisation (VMware/KVM/Proxmox), Android development (Kotlin/Java), REST API integration, SIEM monitoring, vulnerability scanning"
IX_QUALS = "Degree in Computer Science / IT / Network Engineering / Software Engineering (enrolled or recently completed); Active GitHub account with 2+ original documented projects (mandatory for consideration); Android development experience (Kotlin preferred)"

VERDICTS = {
    "dc254-workforce-20261013-001": {
        "status": "corroborated",
        "note": "Official iXAfrica careers page fetched 14 Oct 2026 confirms this advertisement verbatim (title, 6-month paid internship, Nairobi, on-site). The official page itself states 'Expired on: Mar 15, 2026', so this is evidence of advertised demand in early 2026, NOT current demand.",
    },
    "dc254-workforce-20261013-002": {
        "status": "corroborated",
        "note": "Official page opened and fully captured 14 Oct 2026 (intelligence/raw/2026-10-14-page-ixafrica-job.json). Posting states 'Expired on: Mar 15, 2026'. Role titled Data Centre Operations but skill set is heavily automation/DevOps + security + Android development; GitHub portfolio mandatory. First fully-verified official-employer record of the Workforce Watch pilot.",
        "topic_fields": {
            "role_category": "cloud-it-operations",
            "skills_required": [s.strip() for s in IX_JOBS.split(",")],
            "qualifications_required": IX_QUALS,
            "experience_required": "Currently enrolled or recently completed (student/graduate)",
            "employment_type": "Internship (6 months, paid, on-site)",
        },
    },
    "dc254-workforce-20261013-006": {
        "status": "UNREVIEWED",
        "note": "Reviews a DIFFERENT iXAfrica role (Operations Team Leader). Not independently opened this pass; check iXAfrica careers page for an equivalent official posting before any use.",
    },
    "dc254-workforce-20261013-009": {
        "status": "corroborated",
        "topic": "connectivity",
        "topic_fix_note": "topic corrected workforce->connectivity (cloud-region item misclassified by keyword rules); record_id retained for traceability",
        "note": "Corroborated with a material caveat: DCD (27 Jan 2026) confirms iXAfrica announced as host partner for Oracle's OCI Nairobi region (first announced 2024). Oracle's official public-cloud-regions page fetched 14 Oct 2026 lists Kenya as 'Coming soon' - NOT live. 'Kenya's first public cloud region' is company/press framing, not a DC254-verified operational status.",
    },
    "dc254-facility-20261013-001": {
        "status": "corroborated",
        "note": "Item matches the house record exactly: US$1.5B AMACO proposal first reported 17 Aug 2026 (Business Daily), GE Vernova cooperation 10 Sep 2026, permitting phase; no NEW milestone (approval actually filed or granted) found in this item. Hercules/AMACO remains proposed and outside the 27-record directory.",
    },
    "dc254-facility-20261013-004": {
        "status": "UNREVIEWED",
        "note": "Al Jazeera piece; publication date visible in URL (2026/8/24) but page not opened this pass. Candidate research thread (water use), not a dataset change.",
    },
    "dc254-policy-20261013-001": {
        "status": "UNREVIEWED",
        "note": "Verification search 14 Oct 2026 (two targeted queries incl. exact-phrase 'Specific Procurement Notice'): NO official KDIAP SPN located from this egress - only this LinkedIn post and the related Facebook post. The 'bids close 29 October' claim remains UNVERIFIED against a primary document. Do not publish the deadline until the official notice is located on World Bank or ministry portals.",
    },
    "dc254-policy-20261013-002": {
        "status": "UNREVIEWED",
        "note": "Same verdict as 20261013-001: official SPN not located 14 Oct; LinkedIn post is a lead, not the document of record.",
    },
    "dc254-policy-20261013-003": {
        "status": "UNREVIEWED",
        "note": "Follow-up check 14 Oct 2026: no data-centre licence decision located. CA adopted licence conditions for OTHER categories under the revised market structure (Gazette Notice No. 12181, 14 Jul 2026, via Digital Policy Alert). Consultation outcome for the standalone DC licence remains open. Tracker note updated accordingly.",
    },
    "dc254-policy-20261013-008": {
        "status": "UNREVIEWED",
        "note": "Same follow-up check as 20261013-003: no DC licence finalisation found as of 14 Oct 2026.",
    },
    "dc254-policy-20261013-004": {
        "status": "UNREVIEWED",
        "note": "EPRA domain is egress-blocked from this sandbox (known class, Task 140 precedent); no conclusion drawn from this result.",
    },
    "dc254-connectivity-20261013-003": {
        "status": "UNREVIEWED",
        "note": "Fetch FAILED from both the sandbox and Apify datacenter egress (14 Oct 2026); au-pida.org appears to block datacenter IPs. Manual review in a browser required before use as a map/tracker source.",
    },
    "dc254-connectivity-20261013-004": {
        "status": "corroborated",
        "note": "wioccgroup.net/regional-presence fetched 14 Oct 2026: confirms the US$300M investment announcement dated 3 September 2026 (AFC + Vision Invest) - exactly matching the house record (Issue 003: announced 3 Sep, captured 10 Oct). Page confirms WIOCC Kenya Limited subsidiary and 'initiatives in DRC and Kenya currently in progress'. Strong primary-source corroboration for RR004 candidate 3.",
    },
    "dc254-connectivity-20261013-006": {
        "status": "UNREVIEWED",
        "note": "Google four subsea connectivity hubs: global trend monitor; East Africa relevance unconfirmed. File under global watch unless a Nairobi touchpoint is verified.",
    },
}

NEW_RECORD = {
    "record_id": "dc254-policy-20261014-001",
    "topic": "policy",
    "record_type": "announcement",
    "title": "CA adopted licence conditions for public communications access centres and communications equipment vendors (Gazette Notice No. 12181)",
    "organisation": "Communications Authority of Kenya (recorded via Digital Policy Alert)",
    "country": "Kenya",
    "location": "UNKNOWN",
    "source_url": "https://digitalpolicyalert.org/event/42990-communications-authority-of-kenya-adopted-licence-conditions-for-public-communications-access-centres-and-communications-equipment-vendors",
    "published_at": "2026-07-14",
    "collected_at": CHECKED,
    "event_date": "2026-07-14",
    "claims_extracted": [
        "On 14 July 2026, the Communications Authority of Kenya adopted licence conditions for 2 licence categories under the Kenya Information and Communications Act (Cap. 411A), as part of the revised telecommunications market structure.",
        "Kenya Gazette Notice No. 12181 (National Council for Law Reporting, official) is cited as the source document.",
    ],
    "evidence_excerpt": "On 14 July 2026, the Communications Authority of Kenya (CA) adopted licence conditions for 2 licence categories under the Kenya Information and Communications Act (Cap. 411A), as part of the revised telecommunications market structure.",
    "verification_status": "corroborated",
    "confidence_notes": "DPA event page fetched 14 Oct 2026 (intelligence/raw/2026-10-14-page-dpa.json). Relevant to /tracker/licensing as evidence the revised-market-structure rollout is progressing through 2026. It is NOT a data-centre licence decision: the categories are public communications access centres and communications equipment vendors. Kenya Law gazette URL not yet captured - locate before citing the gazette directly.",
    "reviewed_by": REVIEWER,
    "last_checked_at": CHECKED,
    "change_history": [
        {"at": CHECKED, "what": "created during Task 143 review pass (Digital Policy Alert page opened)"}
    ],
    "provenance": {"runId": "manual-review", "actor": "apify~web-fetch", "queryTerm": "CA licence follow-up", "serpPosition": None, "displayedUrl": ""},
}


def main() -> int:
    q = json.load(open(QUEUE, encoding="utf-8"))
    records = q["records"]
    applied, still_unreviewed = 0, 0
    for r in records:
        v = VERDICTS.get(r["record_id"])
        if not v:
            still_unreviewed += 1
            continue
        r["verification_status"] = v["status"]
        if "topic" in v:
            r["topic"] = v["topic"]
        if "topic_fields" in v:
            r["topic_fields"] = v["topic_fields"]
        if "topic_fix_note" in v:
            r["confidence_notes"] = r["confidence_notes"] + " TOPIC FIX: " + v["topic_fix_note"]
        r["confidence_notes"] = r["confidence_notes"] + " REVIEW " + CHECKED + ": " + v["note"]
        if v["status"] != "UNREVIEWED":
            r["reviewed_by"] = REVIEWER
        r["last_checked_at"] = CHECKED
        r["change_history"].append({"at": CHECKED, "what": "review verdict " + v["status"] + " applied (Task 143)"})
        applied += 1

    records.append(NEW_RECORD)
    q["recordCount"] = len(records)
    q["reviewedAt"] = CHECKED
    q["reviewer"] = REVIEWER

    json.dump(q, open(QUEUE, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    counts = {}
    for r in records:
        counts[r["verification_status"]] = counts.get(r["verification_status"], 0) + 1
    report = {
        "checkedAt": CHECKED,
        "verdictsApplied": applied,
        "stillUnreviewed": still_unreviewed,
        "newRecords": 1,
        "topicFixes": 1,
        "statusCounts": counts,
        "sourcesOpened": [
            "intelligence/raw/2026-10-14-page-ixafrica-job.json",
            "intelligence/raw/2026-10-14-page-oracle.json",
            "intelligence/raw/2026-10-14-page-wiocc.json",
            "intelligence/raw/2026-10-14-page-dpa.json",
            "intelligence/raw/2026-10-14-page-dcd.json",
        ],
        "fetchFailures": ["au-pida.org/prospectus/project.php?id=18 (datacenter-IP block suspected)"],
    }
    json.dump(report, open(REPORT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("verdicts applied:", applied, "| still UNREVIEWED:", still_unreviewed,
          "| new records: 1 | status:", counts)
    print("queue:", QUEUE)
    print("report:", REPORT)
    return 0


if __name__ == "__main__":
    sys.exit(main())
