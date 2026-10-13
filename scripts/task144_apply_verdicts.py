#!/usr/bin/env python3
"""Task 144: apply page-level verification verdicts to the evidence register.

Editor directive (2026-10-14): "Do both and then research and draft an Article
on this its the latest ... https://lnkd.in/p/dbQq5bbp".

What this script does (evidence-backed, documented, ids retained):
1. dc254-policy-20261013-002 (LinkedIn SPN lead): CORROBORATED after the post
   page itself was fetched in full. Corrections documented:
   - the SERP-derived title "Kenya Digital Infrastructure Acceleration Project"
     is a mis-expansion; the post body states Kenya DIGITAL ECONOMY Acceleration
     Project (KDEAP). Topic fixed policy -> connectivity (id retained).
   - claims about Konza Data Centre / Disaster Recovery previously attributed to
     this lead were SERP snippet contamination and are NOT in the post.
2. dc254-policy-20261013-001 (Facebook mirror of the same announcement):
   CORROBORATED via the author's LinkedIn twin post (same wording) + ICTA
   open-tenders page + trade press. Facebook page itself not fetched from this
   egress (noted). Same topic fix, claims corrected to the twin text.
3. NEW record dc254-connectivity-20261014-001 (announcement): the 13 Oct 2026
   pre-bid session / KSh 13 billion announcement, corroborated by two PS posts,
   ICTA tenders page, People Daily, ITWeb Africa, W.Media.

No published platform content is modified by this script (nothing verified a
tracker change; the terrestrial-backbone story is carried by the new article).
"""

import json
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
QUEUE = REPO / "intelligence" / "queue" / "2026-10-14-pilot.json"
REPORT = REPO / "scripts" / "task144-review-report.json"
REVIEWER = "Super Z (agent, editor authority 2026-10-14)"


def li_activity_date(activity_id: int) -> str:
    """LinkedIn activity IDs encode epoch-ms in the top 41 bits (id >> 22)."""
    ms = activity_id >> 22
    dt = datetime.fromtimestamp(ms / 1000, tz=timezone.utc)
    return dt.strftime("%Y-%m-%d")


NOW = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

# ---------------------------------------------------------------- record 002
REC002_TITLE_FIXED = (
    "KDEAP framework tender invitation: national backbone, cross-border and "
    "metropolitan links (PS official LinkedIn post, SPN announcement)"
)
REC002_CLAIMS = [
    "Through the Kenya Digital Economy Acceleration Project, the ICT Authority invites eligible private-sector partners to participate in a three-year framework for: National backbone links; Cross-border and metropolitan links.",
    "Bids close at 10:00 a.m. EAT on 29 October 2026.",
    "We call upon qualified local and international infrastructure providers to participate in this competitive procurement and partner with us in building a connected, resilient and inclusive digital Kenya.",
]
REC002_EXCERPT = (
    "Through the Kenya Digital Economy Acceleration Project, the ICT Authority "
    "invites eligible private-sector partners to participate in a three-year "
    "framework for: National backbone links; Cross-border and metropolitan links."
)
REC002_NOTES = (
    "Search-result lead only: snippet is Google-rendered text, not the publisher page. "
    "SERP position 5; source query '\"data centre\" Kenya announcement October 2026'. "
    "REVIEW 2026-10-14T20:40:00Z (Task 143): official SPN not located from that egress; kept UNREVIEWED. "
    "REVIEW {now} (Task 144): post page fetched in FULL via og:description (page-level, not snippet). "
    "VERDICT corroborated. CORRECTIONS (documented, id retained): (1) SERP-derived title 'Kenya Digital "
    "Infrastructure Acceleration Project' is a mis-expansion - the post body states Kenya DIGITAL ECONOMY "
    "Acceleration Project (KDEAP); title fixed accordingly. (2) 'Konza Data Centre' / 'Disaster Recovery' "
    "claims previously associated with this lead were Google snippet contamination and are NOT present in "
    "the post text. (3) topic policy -> connectivity. Corroboration: ICTA open-tenders page (advert "
    "'Framework agreement for extending national backbone & cross border links', Lot 1 + Lot 2, published "
    "15 Sep 2026), ITWeb Africa (16 Sep 2026), Telecompaper (17 Sep 2026), PS pre-bid post 13 Oct 2026. "
    "The pilot 'bids close 29 Oct' claim is CONFIRMED (10:00 a.m. EAT). Tender-document link in post "
    "(lnkd.in/dMNg8U68) not resolved to a final URL from this egress; document of record = ICTA tenders "
    "page. published_at derived from LinkedIn activity ID timestamp (approximate)."
).format(now=NOW)

# ---------------------------------------------------------------- record 001
REC001_CLAIMS = [
    "A major opportunity to extend Kenya's digital infrastructure and accelerate universal connectivity is now open.",
    "Through the Kenya Digital Economy Acceleration Project, the ICT Authority invites eligible private-sector partners to participate in a three-year framework for national backbone links and cross-border and metropolitan links.",
    "Bids close at 10:00 a.m. EAT on 29 October 2026.",
]
REC001_EXCERPT = (
    "A major opportunity to extend Kenya's digital infrastructure and accelerate "
    "universal connectivity is now open."
)
REC001_NOTES_APPEND = (
    " REVIEW {now} (Task 144): VERDICT corroborated via the author's LinkedIn twin post of the same "
    "announcement (activity 7505707320652345344, fetched in full) plus the ICTA open-tenders page and "
    "trade press (ITWeb Africa 16 Sep, Telecompaper 17 Sep). CORRECTIONS (documented): (1) earlier "
    "claims_extracted about onboarding government services in the Konza Data Centre and the Disaster "
    "Recovery operationalisation were Google snippet contamination - that text is NOT in this post; "
    "claims replaced with the twin-post verbatim text. (2) topic policy -> connectivity (id retained). "
    "The Facebook page itself was not fetched from this egress; verification rests on the LinkedIn twin "
    "and ICTA. The post's 'bids close 10:00 a.m. EAT on 29 October 2026' claim is CONFIRMED."
).format(now=NOW)

# ---------------------------------------------------------------- new record
NEW_RECORD = {
    "record_id": "dc254-connectivity-20261014-001",
    "topic": "connectivity",
    "record_type": "announcement",
    "title": (
        "KSh 13 billion catalytic funding announced at KDEAP backbone pre-bid "
        "session (at least 27,000 km, Multi-Round Reverse Auction)"
    ),
    "organisation": "State Department for ICT and the Digital Economy / ICT Authority (recorded via official LinkedIn post of PS Eng. John Kipchumba Tanui)",
    "country": "Kenya",
    "location": "Nairobi (pre-bid session, per post)",
    "source_url": "https://www.linkedin.com/posts/johntanui_digitalsuperhighway-kdeap-digitaleconomy-ugcPost-7515689951108292609-He6k",
    "published_at": None,  # filled at runtime from activity id
    "collected_at": NOW,
    "event_date": "2026-10-13",
    "claims_extracted": [
        "The Government is making available KSh 13 billion to catalyse matching private investment and deliver at least 27,000 km of backbone, middle-mile and cross-border fibre.",
        "Public support will be allocated competitively through a Multi-Round Reverse Auction (MRRA) to mobilise matching private capital.",
        "Since 2022, the private sector has added 24,000 km of fibre and the public sector 17,000 km.",
        "The Communications Authority's April-June 2026 report records 88M mobile subscriptions, 54.9M mobile broadband and 54M mobile money subscriptions; fixed internet connections reached 2.84 million by June 2026, up 32.4 percent, including 1.57 million fibre connections (up 29.7 percent); submarine cables and cross-border links give Kenya approximately 28.95 Tbps of international bandwidth.",
        "Ambition: over eight million fixed broadband connections.",
        "Also present at the pre-bid session was the CEO of the ICT Authority, Mr. Jesse Maruti (per the post).",
    ],
    "evidence_excerpt": (
        "The Government is making available KSh 13 billion to catalyse matching "
        "private investment and deliver at least 27,000 km of backbone, "
        "middle-mile and cross-border fibre - closing connectivity gaps, "
        "strengthening resilience and making it cheaper to connect homes, "
        "businesses and public institutions."
    ),
    "verification_status": "corroborated",
    "confidence_notes": (
        "Post page fetched in FULL 14 Oct 2026 via og:description (page-level capture, "
        "intelligence/raw/2026-10-14-page-ps-tanui-prebid.txt). Corroboration: People Daily 13 Oct 2026 "
        "(KSh13B, 27,000 km, 24,000/17,000 km split; byline Kenneth Mwenda, JSON-LD captured), W.Media "
        "13 Oct 2026 (US$100M equivalence; 28.95 Tbps attributed to the PS), ICTA open-tenders page "
        "(advert published 15 Sep 2026), ITWeb Africa / Telecompaper (framework structure), CA own "
        "communications for 2.84M fixed / 1.57M fibre (+32.4% / +29.7%), The Tech Hut for 87.99M SIM "
        "subscriptions June 2026. FIGURES ATTRIBUTED TO THE POST AND STILL SINGLE-SOURCE: KSh 13 billion "
        "envelope, 27,000 km target, MRRA mechanism, 54.9M mobile broadband, 54M mobile money, 8M fixed "
        "broadband ambition. Fixed-internet figures independently corroborated. Editorial outcome: "
        "DC254 article /articles/kenya-kdeap-fibre-backbone-tender published 14 Oct 2026 (editor-directed). "
        "published_at derived from LinkedIn activity ID timestamp (approximate)."
    ),
    "reviewed_by": REVIEWER,
    "last_checked_at": NOW,
    "change_history": [],
    "provenance": {
        "runId": "manual-review",
        "actor": "z-ai page_reader + curl og:description",
        "queryTerm": "editor directive (lnkd.in/p/dbQq5bbp)",
        "serpPosition": None,
        "displayedUrl": "",
    },
}


def main() -> None:
    q = json.loads(QUEUE.read_text(encoding="utf-8"))
    recs = q["records"]
    by_id = {r["record_id"]: r for r in recs}
    changes = []

    # --- record 002 -----------------------------------------------------
    r = by_id["dc254-policy-20261013-002"]
    old_title = r["title"]
    r["title"] = REC002_TITLE_FIXED
    r["topic"] = "connectivity"
    r["claims_extracted"] = REC002_CLAIMS
    r["evidence_excerpt"] = REC002_EXCERPT
    r["verification_status"] = "corroborated"
    r["reviewed_by"] = REVIEWER
    r["last_checked_at"] = NOW
    r["published_at"] = li_activity_date(7505707320652345344)
    r["event_date"] = r["published_at"]
    r["confidence_notes"] = (
        r["confidence_notes"].split(" REVIEW 2026-10-14T20:40:00Z")[0] + REC002_NOTES
    )
    r["change_history"].append(
        {
            "at": NOW,
            "what": (
                "Task 144 page-level verification: corroborated; title mis-expansion fixed "
                f"(was '{old_title}'); snippet-contamination claims removed; topic fix policy->connectivity"
            ),
        }
    )
    changes.append({"record_id": r["record_id"], "verdict": "corroborated", "corrections": ["title", "claims", "topic"]})

    # --- record 001 -----------------------------------------------------
    r = by_id["dc254-policy-20261013-001"]
    r["topic"] = "connectivity"
    r["claims_extracted"] = REC001_CLAIMS
    r["evidence_excerpt"] = REC001_EXCERPT
    r["verification_status"] = "corroborated"
    r["reviewed_by"] = REVIEWER
    r["last_checked_at"] = NOW
    r["confidence_notes"] += REC001_NOTES_APPEND
    r["change_history"].append(
        {
            "at": NOW,
            "what": "Task 144 verification via LinkedIn twin post + ICTA tenders page: corroborated; snippet-contamination claims (Konza DC / Disaster Recovery) removed; topic fix policy->connectivity",
        }
    )
    changes.append({"record_id": r["record_id"], "verdict": "corroborated", "corrections": ["claims", "topic"]})

    # --- new record ------------------------------------------------------
    NEW_RECORD["published_at"] = li_activity_date(7515689951108292609)
    NEW_RECORD["change_history"].append(
        {"at": NOW, "what": "created during Task 144 editor-directed research pass (PS post fetched in full)"}
    )
    recs.append(NEW_RECORD)
    changes.append({"record_id": NEW_RECORD["record_id"], "verdict": "corroborated (new record)", "corrections": []})

    QUEUE.write_text(json.dumps(q, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")

    from collections import Counter

    report = {
        "task": "144",
        "applied_at": NOW,
        "queue": str(QUEUE.relative_to(REPO)),
        "records_total": len(recs),
        "status_counts": dict(Counter(r["verification_status"] for r in recs)),
        "changes": changes,
        "editorial_outcome": (
            "Article content/articles/kenya-kdeap-fibre-backbone-tender.md published "
            "(editor-directed), plus PS post image public/images/ps-tanui-kdeap-prebid.webp "
            "(800x533, from the official LinkedIn post, attributed in caption)."
        ),
    }
    REPORT.write_text(json.dumps(report, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=1, ensure_ascii=False))


if __name__ == "__main__":
    main()
