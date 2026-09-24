#!/usr/bin/env python3
"""
policy_upgrade_r13.py - Kenya licensing pillar expansion (KE-LC-C2/C3/C4).

Editor instruction 2026-09-24: "Work on the data set" - in response to the
agent's offer to work the CDH telecom-licensing alert (Google Alerts lead (a))
into the KE licensing pillar. Treated as humanGate delegation conditional on
verification (r11/r12 precedent); verification performed on full source text
fetched FREE via curl (zero Context.dev credits this session for the dataset
work) and documented in the three capture files filed with status
capture-pending.

Evidence (all read in full this session):
  - CDH Technology & Communications Alert, 23 Sep 2026 (T2, law-firm alert;
    Njeri Wagacha / Brian Macharia): Revised Telecommunications Market
    Structure gazetted 6 Mar 2026; ULF Annex III names NFP-Tier 2 as the
    category under which data centres are licensed; NFP-Tier 1 holders may
    establish commercial data centres without an additional licence; CA
    public notice of 8 Sep 2026 opened a 30-day comment window on a
    standalone data centre licence for co-location operators; draws on
    Airtel Nxtra (Tatu City), iXAfrica Nairobi One, Cassava/Africa Data
    Centres.
  - Techafricanews, 8 Sep 2026 (T3): confirms the proposal, the NFP-Tier 2
    baseline ("instead of regulating co-location data centres under the
    existing Network Facilities Provider-Tier 2 licence category") and the
    30-day submission window.
  - w.media, 11 Sep 2026 (T3, Brendyn Lotz): confirms NFP-T2 baseline,
    quotes the CA notice verbatim (rationale + coverage of "entities that
    provide colocation data centre services, including the attendant
    supporting services"), reports proposed fees (KSh 5,000 application /
    KSh 100,000 initial / KSh 80,000 or 0.4% of gross annual turnover p.a.
    whichever higher) and 2027/2028 FY implementation timing.

States applied:
  - KE-LC-C2 (NFP-T2 treatment) -> verified: T2 + two independent T3s.
  - KE-LC-C3 (8 Sep 2026 standalone-licence proposal + 30-day window) ->
    verified: same evidence set; CA notice quoted through w.media.
  - KE-LC-C4 (proposed fee schedule) -> partially-verified: w.media only;
    upgrade path = capture the CA notice itself (ca.go.ke JS-blocked
    2026-09-24).

Byte-stable JSON output: json.dumps(indent=2, ensure_ascii=False) + "\\n".
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DS = ROOT / "src/data/policy/policy-claims-2026-Q3.json"
CAPTURES = ROOT / "research/captures"

CDH_URL = ("https://www.cliffedekkerhofmeyr.com/en/news/publications/2026/Kenya/"
           "Technology-Communications/technology-and-communications-alert-23-september-"
           "Licensing-structuring-and-financing-considerations-for-telecommunications-businesses")
TAN_URL = "https://techafricanews.com/2026/09/08/kenya-proposes-standalone-licence-framework-data-centres/"
WM_URL = "https://w.media/kenyas-standalone-data-center-license-aims-to-lure-investment/"

CAP_CDH = "2026-09-24-cdh-ke-tmt-alert-licensing-structuring-financing.md"
CAP_TAN = "2026-09-24-techafricanews-ke-standalone-dc-licence.md"
CAP_WM = "2026-09-24-wmedia-ke-standalone-dc-licence.md"


def fm_lines(captured_at, url, title, tool, tier, claims, note):
    return [
        "---",
        f"captured_at: {captured_at}",
        f"source_url: {url}",
        f"final_url: {url}",
        f"title: {title}",
        f"tool: {tool}",
        "http_status: 200 (curl)",
        f"tier: {tier}",
        f"claims: [{', '.join(claims)}]",
        "status: capture-pending # becomes verified ONLY after an editor reads and confirms content",
        f"note: {note}",
        "---",
        "",
    ]


def write_capture(name, front, extract, body):
    md = "\n".join(front) + extract + "\n---\n\n# FULL SOURCE TEXT (captured)\n\n" + body.strip() + "\n"
    out = CAPTURES / name
    out.write_text(md, encoding="utf-8")
    print(f"capture written: research/captures/{name} ({out.stat().st_size/1024:.0f} KB)")


cdh_body = (ROOT / "scripts/tmp_cdh_body.txt").read_text(encoding="utf-8")
tan_body = (ROOT / "scripts/tmp_tan_body.txt").read_text(encoding="utf-8")
wm_body = (ROOT / "scripts/tmp_wm_body.txt").read_text(encoding="utf-8")

# ── 1. Capture files ────────────────────────────────────────────────────────
CDH_EXTRACT = """
## VERIFICATION EXTRACT (read and confirmed 2026-09-24)

Law-firm alert (T2; authors Njeri Wagacha, Partner, and Brian Macharia,
Associate; published 23 Sep 2026, 6 min read). Key statements, verbatim:

> "The most recent regulatory developments include the Revised
> Telecommunications Market Structure (Revised Structure) gazetted on
> 6 March 2026 and the Communications Authority of Kenya's (Authority)
> public notice issued on 8 September 2026 opening a 30-day comment window
> on its proposal to set up a licensing framework for data centres that
> would introduce a standalone data centre licence category, rather than
> continuing to regulate them under Network Facilities Provider - Tier 2."

> "Under the Authority's current Revised Telecommunications Market
> Structure gazetted on 6 March 2026, data centres are regulated under the
> Network Facilities Provider - Tier 2 category, while holders of a Network
> Facilities Provider - Tier 1 licence may rely on that existing
> infrastructure licence to operate a commercial data centre."

> "The Authority's power to licence telecommunications activity derives
> from section 24(1) of the Kenya Information and Communications Act,
> Chapter 411A of the Laws of Kenya, which prohibits operating a
> telecommunications system or providing telecommunications services
> without a valid licence. The Unified Licensing Framework (ULF) itself
> dates back to 2008..."

> "...the ULF Annex III licence table names Network Facilities Provider -
> Tier 2 as the category under which data centres are licensed."

> "The Authority's proposed replacement for this treatment would introduce
> a standalone data centre licence category for co-location operators, on
> the basis that they provide hosting, power, cooling and storage
> infrastructure rather than telecommunications services..."

Market context (from the same alert): structuring routes observed in recent
Kenyan projects - pan-African platform funded at group level vs standalone
Kenyan project company financed on a single-asset basis; land tenure, power
strategy and financing structure named as the main early decisions; draws on
Airtel Africa's Nxtra facility at Tatu City, iXAfrica's Nairobi One campus,
and Cassava Technologies' Africa Data Centres.

Note: this capture is a full-text copy of the alert body as rendered; the
CA's own public notice and the Revised Structure instrument remain
uncaptured (upgrade path for any element resting on this alert alone).
"""

write_capture(
    CAP_CDH,
    fm_lines(
        "2026-09-24T00:00:00Z", CDH_URL,
        "Licensing, structuring, and financing considerations for telecommunications businesses - Cliffe Dekker Hofmeyr (CDH)",
        "manual curl (no API credits); page rendered server-side, body text extracted from HTML",
        2, ["KE-LC-C2", "KE-LC-C3"],
        "Editor instruction 2026-09-24 'Work on the data set' (delegation conditional on verification, "
        "r11/r12 precedent). Full alert text captured free via curl; verification extract quotes the "
        "licensing passages verbatim.",
    ),
    CDH_EXTRACT,
    cdh_body,
)

TAN_EXTRACT = """
## VERIFICATION EXTRACT (read and confirmed 2026-09-24)

Trade press (T3; published 8 September 2026). Key statements, verbatim:

> "The Communications Authority of Kenya (CA) has proposed a standalone
> licensing framework for data centre operators as the regulator seeks to
> provide greater oversight and regulatory clarity for the country's
> growing digital infrastructure sector."

> "Under the proposed framework, the CA plans to introduce a dedicated
> Data Centre licence category instead of regulating co-location data
> centres under the existing Network Facilities Provider-Tier 2 licence
> category." [independent corroboration of the NFP-Tier 2 baseline]

> "As part of the process, the CA has invited stakeholders and members of
> the public to submit written comments on the proposed licensing framework
> for co-location data centre operations in Kenya. Submissions are expected
> within 30 days from the date of publication of the public notice."

Rationale reported: "enhance visibility over data centre operations, support
investment in digital infrastructure and provide a regulatory framework that
is proportionate to approaches adopted in comparable jurisdictions."
"""

write_capture(
    CAP_TAN,
    fm_lines(
        "2026-09-24T00:00:00Z", TAN_URL,
        "Kenya proposes standalone licence framework for data centres - TechAfrica News",
        "manual curl (no API credits)",
        3, ["KE-LC-C2", "KE-LC-C3"],
        "Editor instruction 2026-09-24 'Work on the data set' (delegation conditional on verification). "
        "Independent corroboration of the NFP-Tier 2 baseline and the 30-day comment window.",
    ),
    TAN_EXTRACT,
    tan_body,
)

WM_EXTRACT = """
## VERIFICATION EXTRACT (read and confirmed 2026-09-24)

Trade press (T3; Brendyn Lotz, published 11 September 2026). Key statements,
verbatim:

> "The Communications Authority of Kenya (CA) is proposing a standalone
> license category for colocation data center operators. As it stands,
> these operators are licensed under the Network Facilities Provider-Tier 2
> (NFP-T2) category, a mismatch as data centers don't provide
> telecommunications services to end users." [independent corroboration of
> the NFP-Tier 2 baseline]

Direct quote from the CA public notice (as reproduced by w.media):

> "The proposed approach is intended to provide regulatory clarity, enhance
> visibility over data centre operations, support investment in digital
> infrastructure, and align Kenya's framework with proportionate approaches
> adopted in comparable jurisdictions. The proposed license will cover
> entities that provide colocation data centre services, including the
> attendant supporting services," the CA said in a notice.

Proposed fee schedule (single-source, reported by w.media):

> "The CA has proposed a slew of regulatory fees including: a KSh 5,000
> (US$ 38.64) application fee, a KSh 100,000 (US$ 772.74) initial fee, and
> an annual operating fee of KSh 80,000 (US$ 618.19), or 0.4 percent of
> gross annual turnover, whichever is higher."

Timing (single-source): "Implementation of the framework is currently
planned for the 2027/2028 financial year."

The CA notice itself remains uncaptured (ca.go.ke open-consultations page
JS-blocked to curl 2026-09-24) - capturing it is the upgrade path for the
fee schedule and the implementation timing.
"""

write_capture(
    CAP_WM,
    fm_lines(
        "2026-09-24T00:00:00Z", WM_URL,
        "Kenya's standalone data center license aims to lure investment - w.media",
        "manual curl (no API credits)",
        3, ["KE-LC-C2", "KE-LC-C3", "KE-LC-C4"],
        "Editor instruction 2026-09-24 'Work on the data set' (delegation conditional on verification). "
        "Quotes the CA public notice verbatim; sole (T3) source for the proposed fee schedule (KE-LC-C4).",
    ),
    WM_EXTRACT,
    wm_body,
)

# ── 2. Dataset edits (byte-stable) ──────────────────────────────────────────
d = json.loads(DS.read_text(encoding="utf-8"))

assert d["datasetVersion"] == "policy-2026-Q3-r12", d["datasetVersion"]

d["sources"]["cdh-ke-tmt-alert-2026"] = {
    "label": "CDH Technology & Communications Alert: Licensing, structuring and financing considerations for telecommunications businesses (Kenya)",
    "tier": 2,
    "captureStatus": "captured",
    "retrievedDate": "2026-09-24",
    "publishedDate": "2026-09-23",
    "url": CDH_URL,
    "publisher": "Cliffe Dekker Hofmeyr (CDH)",
    "sourceType": "Law-firm client alert (Kenya Technology & Communications; authors Njeri Wagacha, Brian Macharia)",
    "captureNote": (
        "Full alert body captured 2026-09-24 via manual curl, zero API credits "
        "(research/captures/" + CAP_CDH + "). Confirms: Revised Telecommunications Market Structure "
        "gazetted 6 March 2026; ULF Annex III names NFP-Tier 2 as the data centre licensing category; "
        "NFP-Tier 1 holders may rely on that licence to operate a commercial data centre; CA public "
        "notice of 8 September 2026 opened a 30-day comment window on a standalone data centre licence "
        "for co-location operators (hosting, power, cooling and storage infrastructure rather than "
        "telecommunications services); market context from Airtel Nxtra (Tatu City), iXAfrica Nairobi "
        "One and Cassava/Africa Data Centres. Legal basis: KIC Act Cap 411A s.24(1); ULF dates to 2008."
    ),
}

d["sources"]["techafricanews-ke-dc-licence"] = {
    "label": "TechAfrica News: Kenya proposes standalone licence framework for data centres",
    "tier": 3,
    "captureStatus": "captured",
    "retrievedDate": "2026-09-24",
    "publishedDate": "2026-09-08",
    "url": TAN_URL,
    "publisher": "techafricanews.com",
    "sourceType": "Trade press report",
    "captureNote": (
        "Full article captured 2026-09-24 via manual curl (research/captures/" + CAP_TAN + "). "
        "Independently corroborates the NFP-Tier 2 baseline ('instead of regulating co-location data "
        "centres under the existing Network Facilities Provider-Tier 2 licence category'), the 8 Sep "
        "2026 public notice and the 30-day written-comment window (post/hand delivery to the Director "
        "General, CA)."
    ),
}

d["sources"]["wmedia-ke-dc-licence"] = {
    "label": "w.media: Kenya's standalone data center license aims to lure investment",
    "tier": 3,
    "captureStatus": "captured",
    "retrievedDate": "2026-09-24",
    "publishedDate": "2026-09-11",
    "url": WM_URL,
    "publisher": "w.media (Brendyn Lotz)",
    "sourceType": "Trade press report quoting the CA public notice",
    "captureNote": (
        "Full article captured 2026-09-24 via manual curl (research/captures/" + CAP_WM + "). "
        "Corroborates the NFP-Tier 2 baseline; reproduces the CA notice verbatim (rationale + coverage "
        "of 'entities that provide colocation data centre services, including the attendant supporting "
        "services'); sole source for the proposed fee schedule (KSh 5,000 application / KSh 100,000 "
        "initial / KSh 80,000 or 0.4% of gross annual turnover p.a. whichever higher) and for the "
        "2027/2028 FY implementation timing. CA notice itself JS-blocked - upgrade path."
    ),
}

new_claims = [
    {
        "id": "KE-LC-C2",
        "pillar": "licensing",
        "statement": (
            "Kenya's Unified Licensing Framework contains no data-centre-specific licence category: "
            "co-location data centres are licensed under the Network Facilities Provider - Tier 2 "
            "category of the Revised Telecommunications Market Structure (gazetted 6 March 2026)."
        ),
        "sourceIds": ["ca-licensing-procedures", "cdh-ke-tmt-alert-2026", "techafricanews-ke-dc-licence", "wmedia-ke-dc-licence"],
        "state": "verified",
        "note": (
            "r13 registration (editor instruction 'Work on the data set', 2026-09-24; humanGate "
            "delegation conditional on verification, r11/r12 precedent). Verified under 'two independent "
            "corroborating sources': CDH law-firm alert (T2) - 'the ULF Annex III licence table names "
            "Network Facilities Provider - Tier 2 as the category under which data centres are licensed'; "
            "Techafricanews (T3) - 'instead of regulating co-location data centres under the existing "
            "Network Facilities Provider-Tier 2 licence category'; w.media (T3) - 'As it stands, these "
            "operators are licensed under the Network Facilities Provider-Tier 2 (NFP-T2) category'. "
            "Single-source detail (CDH T2, upgrade path = capture the Annex III instrument): NFP-Tier 1 "
            "holders may rely on that nationwide infrastructure licence to operate a commercial data "
            "centre without an additional licence."
        ),
    },
    {
        "id": "KE-LC-C3",
        "pillar": "licensing",
        "statement": (
            "On 8 September 2026 the Communications Authority of Kenya published a public notice opening "
            "a 30-day comment window on a proposal to introduce a standalone data centre licence category "
            "for co-location data centre operators, replacing the Network Facilities Provider - Tier 2 "
            "treatment."
        ),
        "sourceIds": ["cdh-ke-tmt-alert-2026", "techafricanews-ke-dc-licence", "wmedia-ke-dc-licence"],
        "state": "verified",
        "note": (
            "r13 registration (same delegation). Verified under 'two independent corroborating sources' "
            "(T2 + two T3s). CA notice rationale quoted via w.media: 'provide regulatory clarity, enhance "
            "visibility over data centre operations, support investment in digital infrastructure, and "
            "align Kenya's framework with proportionate approaches adopted in comparable jurisdictions'. "
            "Coverage per the notice: 'entities that provide colocation data centre services, including "
            "the attendant supporting services'. Basis per CDH: co-location operators provide hosting, "
            "power, cooling and storage infrastructure rather than telecommunications services. "
            "Single-source detail (w.media): implementation planned for the 2027/2028 financial year. "
            "Upgrade path: capture the CA public notice itself (ca.go.ke open-consultations JS-blocked "
            "2026-09-24). Proposal-stage claim: may change or lapse during/after consultation."
        ),
    },
    {
        "id": "KE-LC-C4",
        "pillar": "licensing",
        "statement": (
            "The CA's proposed standalone data centre licence carries a proposed fee schedule: KSh 5,000 "
            "application fee, KSh 100,000 initial fee, and an annual operating fee of KSh 80,000 or 0.4 "
            "percent of gross annual turnover, whichever is higher."
        ),
        "sourceIds": ["wmedia-ke-dc-licence"],
        "state": "partially-verified",
        "note": (
            "r13 registration (same delegation). Single source (w.media T3, quoting the CA notice; US$ "
            "conversions at that article's rates). Remains partially-verified until the CA notice or "
            "gazette instrument is captured (ca.go.ke JS-blocked 2026-09-24); proposal-stage figures may "
            "change during consultation."
        ),
    },
]

ke = d["countries"]["kenya"] if isinstance(d["countries"], dict) else None
assert ke is not None, "countries shape changed"
existing = {c["id"] for c in ke["claims"]}
for nc in new_claims:
    assert nc["id"] not in existing, f"duplicate id {nc['id']}"
    ke["claims"].append(nc)

d["datasetVersion"] = "policy-2026-Q3-r13"
d["generatedAt"] = "2026-09-24"

DS.write_text(json.dumps(d, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

# ── 3. Sanity print ─────────────────────────────────────────────────────────
states = {}
for c in d["countries"].values():
    for cl in c.get("claims", []):
        states[cl["state"]] = states.get(cl["state"], 0) + 1
print("datasetVersion:", d["datasetVersion"])
print("claims by state:", states, "| sources:", len(d["sources"]))
ke_lic = [c for c in d["countries"]["kenya"]["claims"] if c["pillar"] == "licensing"]
print("KE licensing claims:", [c["id"] + ":" + c["state"] for c in ke_lic])
