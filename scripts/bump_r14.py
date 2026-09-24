#!/usr/bin/env python3
"""
bump_r14.py - Dataset bump policy-2026-Q3-r13 -> policy-2026-Q3-r14
Trigger: T1 capture of the CA's "Proposed Licensing Framework for Data Centres"
(September 2026, Consultation Version) via Context.dev browser render, 2026-09-24.

HumanGate: standing editor delegation ("Work on the data set", 2026-09-24; user
approval "continue you are approved", 2026-09-24), conditional on verification -
T1 instrument text read in full from the capture before this bump was written.

Idempotent: safe to re-run. If the claims file is already at r14 the claim edits
are skipped; the changelog append is guarded against duplicates.

Actions:
  1. sources += ca-dc-licensing-framework-2026 (T1 instrument, captured)
                ca-open-consultations-2026     (T1 regulator page, captured)
  2. KE-LC-C2  updated: T1-backed (state unchanged); April-vs-March date
               discrepancy flagged in note, NOT reconciled
  3. KE-LC-C3  updated: T1-backed (state unchanged); rationale/scope verbatim
  4. KE-LC-C4  partially-verified -> verified (para 16 fee schedule verbatim;
               adds 15-year term + USF 0.5% in note)
  5. KE-LC-C5  added, verified: NFP/ASP exemption (para 17, T1 primary)
  6. KE-LC-C6  added, verified: FY2026/27 finalisation + FY2027/28 implementation
               roadmap (Table 1, T1 primary)
  7. Kenya licensing gap refreshed (final instrument + gazette still pending)
  8. changelog entry r14 appended
"""
import json, collections, pathlib

BASE = pathlib.Path("/home/z/my-project/dc254")
CLAIMS_F = BASE / "src/data/policy/policy-claims-2026-Q3.json"
CHANGELOG_F = BASE / "src/data/policy/policy-changelog.json"
TODAY = "2026-09-24"
R13, R14 = "policy-2026-Q3-r13", "policy-2026-Q3-r14"

d = json.load(open(CLAIMS_F), object_pairs_hook=collections.OrderedDict)
if d["datasetVersion"] == R13:
    # ---------- 1. sources ----------
    d["sources"]["ca-dc-licensing-framework-2026"] = collections.OrderedDict([
        ("label", "Communications Authority of Kenya - Proposed Licensing Framework for Data Centres, September 2026 (Consultation Version) - official consultation document"),
        ("url", "https://www.ca.go.ke/sites/default/files/2026-09/Public%20Consultation%20on%20Data%20Centres%20September%202026.pdf"),
        ("tier", 1),
        ("publisher", "Communications Authority of Kenya"),
        ("sourceType", "Regulator instrument (consultation document)"),
        ("publishedDate", "2026-09"),
        ("retrievedDate", TODAY),
        ("captureStatus", "captured"),
        ("captureNote", "Full 7-page consultation text captured via Context.dev browser render after direct curl returned the site's obfuscated JS challenge shell (the challenge walls /index.php/ pages AND /sites/default/files/ assets; the clean /open-consultations route is open). Capture file: research/captures/2026-09-24-ca-go-ke-sites-default-files-2026-09-Public-20Consultation-.md. Confirms verbatim: standalone DC licence proposal and NFP-T2 baseline; fee schedule (application KSh 5,000; initial KSh 100,000; annual operating KSh 80,000 or 0.4 percent of Annual Gross turnover, whichever is higher); 15-year licence term; NFP/ASP exemption; USF at 0.5 percent of Annual Gross Revenue per section 84J(3) KICA Cap 411A; roadmap FY2026/2027 finalisation, FY2027/2028 implementation. Cost: 1 Context.dev credit (born-digital PDF flat rate)."),
    ])
    d["sources"]["ca-open-consultations-2026"] = collections.OrderedDict([
        ("label", "Communications Authority of Kenya - Open Consultations page (regulator publication channel, data centres entry)"),
        ("url", "https://www.ca.go.ke/open-consultations"),
        ("tier", 1),
        ("publisher", "Communications Authority of Kenya"),
        ("sourceType", "Regulator website"),
        ("publishedDate", None),
        ("retrievedDate", TODAY),
        ("captureStatus", "captured"),
        ("captureNote", "Full page captured via Context.dev (clean-URL route bypasses the JS challenge that walls /index.php/ paths - diagnosis recorded 2026-09-24, upgrading the r13 'JS-blocked' note). Carries the data-centres consultation entry verbatim: 30-day comment window from publication; submission channels - post/hand delivery to the Director General (P.O. Box 14448-00800, Nairobi), electronic form (forms.cloud.microsoft/r/uB4Z5GktUB), email datacentres@ca.go.ke; links the framework PDF. Capture file: research/captures/2026-09-24-ca-go-ke-open-consultations.md."),
    ])

    # ---------- 2-4. claim updates ----------
    claims = d["countries"]["kenya"]["claims"]
    by_id = {c["id"]: c for c in claims}

    T1_BACKED = (
        " r14 T1 upgrade (2026-09-24): primary instrument text now held and read in full"
        " (ca-dc-licensing-framework-2026, captured via Context.dev after the ca.go.ke JS"
        " challenge was diagnosed as route-specific). Standing humanGate delegation applies"
        " (r11-r13 precedent)."
    )

    c2 = by_id["KE-LC-C2"]
    c2["sourceIds"] = list(dict.fromkeys(c2["sourceIds"] + ["ca-dc-licensing-framework-2026", "ca-open-consultations-2026"]))
    c2["note"] = (c2.get("note", "") + T1_BACKED +
        " Consultation document para 7 confirms verbatim: 'Under the current telecommunications"
        " market structure, co-location data centre operators are licensed under the Network"
        " Facilities Provider (NFP) - Tier 2 (NFP-T2) licence category.' DISCREPANCY FLAG (open,"
        " not reconciled): instrument para 6 dates the current market structure 'revised in"
        " April 2026' while the held T2 (CDH alert) says gazetted 6 March 2026 - possible"
        " gazette/revision date vs effective-date mismatch; Kenya Law gazette route open to"
        " resolve. Statement gazette date retained from T2 until the gazette text is captured.")

    c3 = by_id["KE-LC-C3"]
    c3["sourceIds"] = list(dict.fromkeys(c3["sourceIds"] + ["ca-dc-licensing-framework-2026", "ca-open-consultations-2026"]))
    c3["note"] = (c3.get("note", "") + T1_BACKED +
        " Instrument executive summary confirms verbatim: 'This consultation document proposes a"
        " standalone licence category for co-location data centre operators rather than placing"
        " co-location data centres under the Network Facilities Provider -Tier 2 licence"
        " category.' Scope confirmed: entities providing co-location data centre services"
        " 'including the attendant supporting services'. Rationale confirmed: regulatory"
        " visibility over critical digital infrastructure while avoiding over-application of NFP"
        " licensing requirements; competitive edge and investment attraction (paras 12-13). The"
        " regulator's own Open Consultations page (captured same day) carries the notice with"
        " submission channels and links the instrument.")

    c4 = by_id["KE-LC-C4"]
    c4["state"] = "verified"
    c4["sourceIds"] = list(dict.fromkeys(c4["sourceIds"] + ["ca-dc-licensing-framework-2026", "ca-open-consultations-2026"]))
    c4["note"] = ("r13 registration (editor instruction 'Work on the data set', 2026-09-24)." +
        T1_BACKED.replace(" r14 T1 upgrade", " r14 upgrade") +
        " Instrument para 16 confirms the schedule verbatim: 'Application fees - KShs.5,000;"
        " Initial fees - KShs.100,000; Annual Operating License fees - KShs. 80,000 or 0.4 per"
        " cent of the Annual Gross turnover, whichever is higher'; w.media T3 figures confirmed"
        " exact. Instrument additionally specifies licence term of 15 years (para 16(d)) and USF"
        " contribution at 0.5 percent of Annual Gross Revenue per section 84J(3) KICA Cap 411A"
        " (para 18) - held in note, not added to the statement scope. PROPOSAL-STAGE CAVEAT"
        " RETAINED: these are proposed fees tabled for consultation and may change before the"
        " framework is finalised (roadmap targets FY2026/2027 finalisation).")

    # ---------- 5-6. new claims ----------
    PILLAR = c3.get("pillar", "licensing")
    if "KE-LC-C5" not in by_id:
        claims.append(collections.OrderedDict([
            ("id", "KE-LC-C5"),
            ("pillar", PILLAR),
            ("state", "verified"),
            ("statement", "The CA's proposal permits entities that already hold Network Facilities Provider (NFP) or Application Service Provider (ASP) licences to establish and operate data centres without obtaining the proposed standalone data centre licence."),
            ("sourceIds", ["ca-dc-licensing-framework-2026"]),
            ("note", "r14 registration (2026-09-24, standing humanGate delegation, T1 read in full). Verified on the primary instrument alone per the status vocabulary ('primary or two independent corroborating sources'): para 17 verbatim - 'Entities that have Network Facility Provider (NFP) or Application Service Provider (ASP) licences shall be permitted to establish and operate data centres without the need for a data centre licence.' Scope note: the exemption is part of the consultation proposal, not yet enacted; it materially narrows who the standalone licence would bind (incumbent NFP/ASP holders establishing their own facilities)."),
        ]))
    if "KE-LC-C6" not in by_id:
        claims.append(collections.OrderedDict([
            ("id", "KE-LC-C6"),
            ("pillar", PILLAR),
            ("state", "verified"),
            ("statement", "The CA's proposed roadmap targets finalisation of the data centre licensing framework and a consequential revision of the telecommunications market structure in FY2026/2027, with implementation of the licensing framework in FY2027/2028."),
            ("sourceIds", ["ca-dc-licensing-framework-2026"]),
            ("note", "r14 registration (2026-09-24, standing humanGate delegation, T1 read in full). Verified on the primary instrument: para 19 + Table 1 rows 1-5 (framework FY2026/2027; public consultation FY2026/2027; finalisation FY2026/2027; consequential revision of the telecommunications market structure FY2026/2027; implementation FY2027/2028). Confirms the FY2027/2028 implementation timing previously held on w.media alone (T3, KE-LC-C4 note). The 'consequential revision' row corroborates that the market-structure change stripping NFP-T2 of data centres follows framework finalisation, not the consultation itself."),
        ]))

    # ---------- 7. gap refresh ----------
    for g in d["countries"]["kenya"]["pillarGaps"]:
        if g.get("pillar") == "licensing":
            g["gap"] = ("CA licensing instruments: the consultation-stage framework document is now CAPTURED (T1, 2026-09-24) but the final instrument is not yet issued - the roadmap targets framework finalisation and the consequential market-structure revision in FY2026/2027 with implementation FY2027/2028. The gazette/legal-notice text of the Revised Telecommunications Market Structure (KE-LC-C2's basis) remains uncaptured; the consultation document dates the revision 'April 2026' vs the CDH alert's 'gazetted 6 March 2026' - unresolved discrepancy.")
            g["expectedSources"] = [
                "Final CA data centre licensing framework (post-consultation instrument, FY2026/2027)",
                "Kenya Gazette / Kenya Law legal notice for the Revised Telecommunications Market Structure (March/April 2026)",
                "CA Knowledge Hub licence-class document (NFP/ASP class definitions)",
            ]
            g["upgradePath"] = ("Kenya Law route (kenyalaw.org curl-open; new.kenyalaw.org returned 403 2026-09-24) for the gazette notice to resolve the March/April discrepancy; request the final instrument via datacentres@ca.go.ke once issued; re-derive KE-LC-C2 on gazette text.")

    # ---------- version bump ----------
    by_id = {c["id"]: c for c in claims}  # refresh: C5/C6 appended above
    d["datasetVersion"] = R14
    d["generatedAt"] = TODAY
    open(CLAIMS_F, "w").write(json.dumps(d, indent=2, ensure_ascii=False) + "\n")
    print("claims file: r13 -> r14 applied")
else:
    print("claims file already at r14 - claim edits skipped")

# ---------- 8. changelog ----------
cl = json.load(open(CHANGELOG_F), object_pairs_hook=collections.OrderedDict)
assert cl["datasetVersion"] in (R13, R14), f"unexpected changelog version {cl['datasetVersion']}"
cl["datasetVersion"] = R14
if not any(e.get("version") == R14 for e in cl["entries"]):
    claims = d["countries"]["kenya"]["claims"]
    by_id = {c["id"]: c for c in claims}
    c2 = by_id["KE-LC-C2"]
    c3 = by_id["KE-LC-C3"]
    c4 = by_id["KE-LC-C4"]
    cl["entries"].append(collections.OrderedDict([
        ("version", R14),
        ("previousVersion", R13),
        ("date", TODAY),
        ("summary", "T1 anchor secured for the Kenya licensing pillar: the CA's 'Proposed Licensing Framework for Data Centres' (September 2026, Consultation Version) captured in full text via Context.dev browser render after the ca.go.ke obfuscated JS challenge was diagnosed as route-specific (clean /open-consultations route open; /index.php/ pages and /sites/default/files/ assets walled). KE-LC-C4 fee schedule upgraded partially-verified to verified on instrument text (para 16 verbatim; 15-year term and USF 0.5 percent noted); KE-LC-C2 and KE-LC-C3 upgraded to T1-backed with states unchanged; two new T1-verified claims registered (KE-LC-C5 NFP/ASP exemption; KE-LC-C6 implementation roadmap). Kenya licensing gap refreshed: final instrument and gazette notice still pending, March-vs-April market-structure date discrepancy flagged open. No existing claims were removed or weakened; 59 to 61 claims, 65 to 67 sources."),
        ("claims", [
            collections.OrderedDict([
                ("id", "KE-LC-C2"), ("country", "Kenya"), ("pillar", "licensing"),
                ("action", "updated"), ("previousState", "verified"), ("state", "verified"),
                ("previousVersionNote", "Held verified on T2+T3 corroboration (CDH alert, Techafricanews, w.media) since r13; instrument text uncaptured."),
                ("statement", c2["statement"]),
                ("sourceIds", c2["sourceIds"]),
                ("editorialDecision", "Upgraded to T1-backed 2026-09-24 under the standing humanGate delegation. Para 7 confirms the NFP-T2 baseline verbatim. The instrument's 'revised in April 2026' dating (para 6) conflicts with the held 'gazetted 6 March 2026' (CDH, T2); the discrepancy is flagged in the claim note and left open pending the Kenya Law gazette capture - statement deliberately NOT re-dated on a single conflicting line."),
            ]),
            collections.OrderedDict([
                ("id", "KE-LC-C3"), ("country", "Kenya"), ("pillar", "licensing"),
                ("action", "updated"), ("previousState", "verified"), ("state", "verified"),
                ("previousVersionNote", "Held verified on T2+T3 corroboration since r13; CA notice quoted only through trade press."),
                ("statement", c3["statement"]),
                ("sourceIds", c3["sourceIds"]),
                ("editorialDecision", "Upgraded to T1-backed 2026-09-24. The regulator's own consultation document and Open Consultations page are now held captures; executive-summary proposal language and the co-location-plus-supporting-services scope confirmed verbatim. Submission channels (datacentres@ca.go.ke, forms link, post) recorded in the source captureNote for the planned DC254 submission."),
            ]),
            collections.OrderedDict([
                ("id", "KE-LC-C4"), ("country", "Kenya"), ("pillar", "licensing"),
                ("action", "updated"), ("previousState", "partially-verified"), ("state", "verified"),
                ("previousVersionNote", "Single source (w.media T3 quoting the CA notice) since r13; explicitly held back pending instrument capture."),
                ("statement", c4["statement"]),
                ("sourceIds", c4["sourceIds"]),
                ("editorialDecision", "Upgraded partially-verified to verified 2026-09-24: instrument para 16 confirms every w.media figure exactly. The r13 upgrade condition ('fee claim upgrades if the notice/gazette confirms the schedule') is met on the consultation document itself. 15-year licence term and USF 0.5 percent added to the claim note only, keeping the statement scope stable. Proposal-stage caveat retained in the note."),
            ]),
            collections.OrderedDict([
                ("id", "KE-LC-C5"), ("country", "Kenya"), ("pillar", "licensing"),
                ("action", "added"), ("previousState", None), ("state", "verified"),
                ("previousVersionNote", "Not present in r13 - the r13 note held single-source NFP-Tier-1 reliance detail only; the exemption enters the dataset with the instrument capture."),
                ("statement", by_id["KE-LC-C5"]["statement"]),
                ("sourceIds", ["ca-dc-licensing-framework-2026"]),
                ("editorialDecision", "Registered r14 verified on the primary instrument alone (para 17 verbatim), per the status vocabulary's primary-source branch. Kept at proposal tense throughout ('The CA's proposal permits...') to avoid reading the consultation as enacted law."),
            ]),
            collections.OrderedDict([
                ("id", "KE-LC-C6"), ("country", "Kenya"), ("pillar", "licensing"),
                ("action", "added"), ("previousState", None), ("state", "verified"),
                ("previousVersionNote", "Not present in r13 - FY2027/2028 implementation timing existed only as a w.media sole-source detail inside the KE-LC-C4 note."),
                ("statement", by_id["KE-LC-C6"]["statement"]),
                ("sourceIds", ["ca-dc-licensing-framework-2026"]),
                ("editorialDecision", "Registered r14 verified on the primary instrument (para 19 + Table 1). Upgrades the w.media sole-source timing to instrument-confirmed and adds the FY2026/2027 consequential market-structure revision as a distinct fact, which the press coverage had not separated out."),
            ]),
        ]),
        ("sourcesAdded", ["ca-dc-licensing-framework-2026", "ca-open-consultations-2026"]),
        ("editorialDecisionSummary", "Standing humanGate delegation (editor instruction 'Work on the data set', 2026-09-24; user approval same day), conditional on verification: the T1 consultation text was read in full from the capture before registration. Machine capture is evidence, never verification - verification here is the full-text read against the r13 claim set. Capture front-matter status remains capture-pending per house convention; the claim layer carries the verified states. Credit spend: 1 Context.dev credit for the PDF (born-digital flat rate) plus the index-page capture; two challenge-walled fetch attempts returned empty and were stopped rather than retried blindly."),
    ]))
    open(CHANGELOG_F, "w").write(json.dumps(cl, indent=2, ensure_ascii=False) + "\n")
    print("changelog: r14 entry appended")
else:
    print("changelog: r14 entry already present - skipped")

print("R14 bump complete.")
print("datasetVersion:", d["datasetVersion"], "| claims:", len(claims), "| sources:", len(d["sources"]))
print("changelog entries:", len(cl["entries"]))
