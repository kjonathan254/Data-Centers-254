#!/usr/bin/env python3
"""
policy_upgrade_r17.py - Evidence-capture promotion tranche (editor-delegated review, 2026-10-02).

Editor delegation in chat 2026-10-02: "1 and 2 are approved if you also approve,
you have the authority to decide and tell me your decision and why" - items 1 and 2
being (1) review of the six capture-pending files from Tasks 69-71 and (2) the TZ
EMA 2004 Third Schedule gap-text correction. Standing rule 8 (task-specific
authority in chat, r11/r13 precedent). The agent re-read all six captures end to
end, checked every proposed claim element against verbatim captured text, and
APPROVED with the following dispositions:

  A. GlobeNewswire R&M global colocation PR (T3) -> CLOSED, not needed.
     No Africa figures (one qualitative name-check sentence), underlying analyst
     house unnamed, internal CAGR inconsistency (15.98% headline vs 15.9% table),
     report paywalled. Revenue-basis market numbers stay OUT of the dataset per
     Task 54 four-baseline discipline. No source record, no claims. (Capture-file
     status flip done separately from this script.)

  B. EAC Secretariat pair (T1): DGPF validation PR (25 Oct 2024) + EARDIP TOR
     -> APPROVED. Four new verified regional-frameworks claims (one per country,
     KE-RG-C1 pattern of citing an EAC-wide instrument from each Partner State):
     UG-RG-C1, RW-RG-C1, TZ-RG-C1, KE-RG-C2. Status language locked to
     "validated October 2024", never "adopted". Cross-border Data Flows
     Mechanism framed as "in development" (the TOR documents the consultancy,
     not an adopted mechanism). Horizontal data-governance status claim, not a
     DC obligation.

  C. TZ EMA 2004 (T1, TanzLII consolidated 2023-12-31) -> APPROVED.
     CLAIM-CRITICAL CORRECTION applied to the dataset: the EIA trigger list is
     the THIRD Schedule (s.81(1), s.102(1)) - items 1(b) "any structure of a
     scale not in keeping with its surrounding" and 10 "Electrical
     infrastructure" - NOT the First Schedule (that is the National
     Environmental Advisory Committee composition, s.11(3)). New verified claim
     TZ-ENV-C2 records the s.81 regime incl. s.81(3) (licence does not
     substitute the EIA Certificate). TZ-ENV-C1's note fixed (it repeated the
     First Schedule error). DC-specific EIA treatment NOT asserted - the EIA
     Regulations' category lists remain the open gap; 2025 amendment (Act
     5/2025) flagged uncaptured.

  D. UG NEA 2019 (T1, official Gazette print via FAOLEX) -> APPROVED.
     New verified claim UG-ENV-C1 records the two-track regime (s.110-113:
     Schedule 4 project brief vs Schedule 5 full ESIA) with the verbatim
     Schedule 5 triggers (solar >2MW, thermal/combustion, wind >=10MW, hydro
     >1MW, HV lines, >33kV distribution, substations, industrial parks).
     Statute-level claim only; DC read-across deliberately not asserted; the
     "2500/10,000m2" printed oddity stays flagged, unresolved. ESIA Regulations
     2020 remain the open gap.

  E. RW Law 48/2018 + Ministerial Order 001/2019 (T1 x2, trilingual Gazette
     prints via FAOLEX) -> APPROVED. New verified claim RW-ENV-C1 (the drafted
     candidate, tightened): Annex I item 1 degrees two-of-three building
     thresholds (500 persons / 1500 sqm floor / 1000 sqm plot) on buildings
     classified commercial or administrative, item 12 degrees HV/MV electrical
     lines, REMA approval (Art. 33), initiator pays (Art. 34). Two-of-three
     structure and the building-classification premise preserved per the
     capture's own safeguard; DC classification question left open.

Net: 7 new claims, all verified (61 -> 68; verified 55 -> 62). 6 new T1 sources
(70 -> 76, T1 49 -> 55). 6 pillarGaps updated (UG/RW/TZ environmental +
regional-frameworks). datasetVersion r16 -> r17. Byte-stable JSON output:
json.dumps(indent=2, ensure_ascii=False) + "\\n".
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DS = ROOT / "src/data/policy/policy-claims-2026-Q3.json"

CAP_TZ = "research/captures/2026-10-01-tz-ema-2004-tanzlii.md"
CAP_UG = "research/captures/2026-10-01-ug-nea-2019-esia-schedule5.md"
CAP_RW = "research/captures/2026-10-01-rw-env-law-48-2018-eia-order-001-2019.md"
CAP_PR = "research/captures/2026-09-30-eac-pr-data-governance-framework.md"
CAP_TOR = "research/captures/2026-09-30-eac-tor-dp-harmonization-crossborder.md"

EAC_STATEMENT = (
    "The East African Community - of which {country} is a Partner State - "
    "validated a regional Data Governance Policy Framework at a Kigali "
    "stakeholder workshop in October 2024, to harmonise data protection, "
    "privacy and security standards across Partner States in alignment with "
    "the African Union Data Policy Framework (2022); a consultancy under the "
    "Eastern African Regional Digital Integration Project (EARDIP) is "
    "separately developing a draft legal instrument for an EAC Mechanism for "
    "Cross-border Data Flows."
)


def eac_note(country):
    return (
        "Reuses two T1 EAC Secretariat records captured once for the shared "
        "regional-frameworks gap: research/captures/2026-09-30-eac-pr-data-governance-framework.md "
        "(validation PR) + research/captures/2026-09-30-eac-tor-dp-harmonization-crossborder.md "
        "(EARDIP TOR). Status language: VALIDATED October 2024, never 'adopted' - the PR "
        "documents a validation workshop + roadmap, not Council adoption. Horizontal "
        "data-governance status claim, not a DC obligation. EAC-wide instrument cited from "
        "%s, same pattern as the CET claim (see KE-RG-C1)." % country
    )


def main():
    d = json.loads(DS.read_text(encoding="utf-8"))
    before = DS.read_text(encoding="utf-8")

    # ---------------------------------------------------------------- sources
    d["sources"]["tanzlii-ema-2004"] = {
        "label": "Tanzania National Environmental Management Act (EMA 2004, Cap. 191) - TanzLII consolidated text to 31 December 2023",
        "url": "https://tanzlii.org/en/akn/tz/act/2004/20/eng@2023-12-31",
        "tier": 1,
        "publisher": "TanzLII (Judiciary of Tanzania / Office of the Attorney General)",
        "sourceType": "National statute (full text captured, consolidated)",
        "publishedDate": "2023-12-31",
        "retrievedDate": "2026-10-01",
        "captureStatus": "captured",
        "captureNote": (
            "Full act text (307KB markdown incl. site chrome) via Context.dev scrape after "
            "timeoutOpts fix; TanzLII Cloudflare-blocked to both curl and page_reader. "
            "Capture: " + CAP_TZ
        ),
    }
    d["sources"]["ug-nea-2019-faolex"] = {
        "label": "Uganda National Environment Act, 2019 (Act 5 of 2019) - Acts Supplement No. 2 to the Uganda Gazette No. 10 Vol. CXII, 7 March 2019 (178pp)",
        "url": "https://faolex.fao.org/docs/pdf/uga192395.pdf",
        "tier": 1,
        "publisher": "Uganda Government Printer (UPPC) via FAOLEX",
        "sourceType": "National statute (official Gazette print, full text)",
        "publishedDate": "2019-03-07",
        "retrievedDate": "2026-10-01",
        "captureStatus": "captured",
        "captureNote": (
            "Direct PDF download via ECOLEX discovery (LEX-FAOC192395); zero retrieval "
            "credits (ULII Cloudflare-blocked). Capture: " + CAP_UG
        ),
    }
    d["sources"]["rw-env-law-48-2018-faolex"] = {
        "label": "Rwanda Law No. 48/2018 of 13/08/2018 on Environment - Official Gazette no. Special of 21/09/2018 (trilingual KIN/ENG/FRE)",
        "url": "https://faolex.fao.org/docs/pdf/rwa182097.pdf",
        "tier": 1,
        "publisher": "Republic of Rwanda, Official Gazette via FAOLEX",
        "sourceType": "National framework statute (official Gazette print, full text)",
        "publishedDate": "2018-08-13",
        "retrievedDate": "2026-10-01",
        "captureStatus": "captured",
        "captureNote": (
            "Direct PDF download via ECOLEX discovery (LEX-FAOC182097). Gazette print is the "
            "controlling record for the 13/08/2018 date (secondary sources citing 13/09/2018 "
            "are contradicted by it). Capture: " + CAP_RW
        ),
    }
    d["sources"]["rw-eia-order-001-2019-faolex"] = {
        "label": "Rwanda Ministerial Order No. 001/2019 of 15/04/2019 establishing the list of projects that must undergo environmental impact assessment - Official Gazette no. 15 of 15/04/2019 (trilingual)",
        "url": "https://faolex.fao.org/docs/pdf/rwa193635.pdf",
        "tier": 1,
        "publisher": "Republic of Rwanda, Official Gazette via FAOLEX",
        "sourceType": "Statutory order - EIA project list (official Gazette print, full text)",
        "publishedDate": "2019-04-15",
        "retrievedDate": "2026-10-01",
        "captureStatus": "captured",
        "captureNote": (
            "Direct PDF download via ECOLEX discovery (LEX-FAOC193635). Operative trigger list "
            "under Law 48/2018 Art. 30; supersedes Ministerial Order 001/2018. Capture: " + CAP_RW
        ),
    }
    d["sources"]["eac-dgpf-validation-pr"] = {
        "label": "EAC set to advance Data Governance and Protection with development of a regional Policy Framework - EAC Secretariat press release, 25 October 2024",
        "url": "https://www.eac.int/press-releases/3195-eac-set-to-advance-data-governance-and-protection-with-development-of-a-regional-policy-framework",
        "tier": 1,
        "publisher": "East African Community Secretariat",
        "sourceType": "Regional secretariat official record (validation workshop)",
        "publishedDate": "2024-10-25",
        "retrievedDate": "2026-09-30",
        "captureStatus": "captured",
        "captureNote": (
            "Full body via page reader (eac.int downloads 403 to curl). Documents VALIDATION "
            "(Kigali, 25 Oct 2024) + AU Data Policy Framework alignment - not Council adoption. "
            "Capture: " + CAP_PR
        ),
    }
    d["sources"]["eac-eardip-tor"] = {
        "label": "Terms of Reference: Data Protection Harmonization and Cross-Border Data Flows in the East African Community (EARDIP consultancy, 240 days) - EAC Secretariat",
        "url": "https://www.eac.int/documents?controller=download&task=download.file&file=950f748c-3321-4647-b8aa-0698ccaabc8b&name=TOR_CONSULTANCY%20SERVICE-%20TERMS%20OF%20REFERENCE%20FOR%20DATA%20PROTECTION%20HARMONIZATION%20AND%20CROSS-BORDER%20DATA%20FLOWS%20IN%20THE%20EAST%20AFRICAN%20COMMUNITY_FINAL.pdf",
        "tier": 1,
        "publisher": "East African Community Secretariat",
        "sourceType": "Regional procurement instrument (full text captured, 14pp)",
        "retrievedDate": "2026-09-30",
        "captureStatus": "captured",
        "captureNote": (
            "Full 14pp PDF via Context.dev scrape (curl 403 on eac.int). Documents the live "
            "machinery: stocktaking report, harmonization principles, Cross-border Data Flows "
            "Mechanism draft legal instrument, 8-month schedule. Capture: " + CAP_TOR
        ),
    }

    # ---------------------------------------------------------------- claims
    ug = d["countries"]["uganda"]["claims"]
    rw = d["countries"]["rwanda"]["claims"]
    tz = d["countries"]["tanzania"]["claims"]
    ke = d["countries"]["kenya"]["claims"]

    ug.append({
        "id": "UG-ENV-C1",
        "pillar": "environmental",
        "state": "verified",
        "statement": (
            "Uganda's National Environment Act 2019 (ss.110-113) runs a two-track "
            "environmental and social assessment regime: Schedule 4 projects proceed on a "
            "NEMA project brief, while Schedule 5 projects - explicitly including solar "
            "plants above 2 MW, thermal power generation and other combustion "
            "installations, wind farms of at least 10 MW, hydropower above 1 MW, "
            "high-voltage transmission lines, distribution lines above 33 kV, electrical "
            "substations, and industrial estates or development parks - require a full "
            "environmental and social impact assessment (scoping, terms of reference, study)."
        ),
        "sourceIds": ["ug-nea-2019-faolex"],
        "note": (
            "T1 official Gazette print (Acts Supplement No. 2, 7 Mar 2019, UPPC) via FAOLEX - "
            "research/captures/2026-10-01-ug-nea-2019-esia-schedule5.md. A data-centre campus is "
            "NOT a named Schedule 5 category; exposure arrives via the power-infrastructure "
            "subitems or industrial-park siting - read-across deliberately not asserted. Printed "
            "'2500/10,000m2' floor-area notation (Sch.5 item 5(e)) flagged verbatim, unresolved. "
            "ESIA Regulations 2020 uncaptured - operational Category lists remain the open gap "
            "(see pillarGaps). MW/kV figures are regulatory trigger thresholds, never market "
            "baselines (Task 54)."
        ),
    })
    ug.append({
        "id": "UG-RG-C1",
        "pillar": "regional-frameworks",
        "state": "verified",
        "statement": EAC_STATEMENT.format(country="Uganda"),
        "sourceIds": ["eac-dgpf-validation-pr", "eac-eardip-tor"],
        "note": eac_note("Uganda"),
    })

    rw.append({
        "id": "RW-ENV-C1",
        "pillar": "environmental",
        "state": "verified",
        "statement": (
            "Rwanda's Ministerial Order No. 001/2019 (under Law No. 48/2018 of 13/08/2018 on "
            "Environment, Arts. 30-34) subjects buildings classified as commercial or "
            "administrative that meet at least two of three thresholds (capacity above 500 "
            "people, floor area above 1,500 sqm, plot above 1,000 sqm), plus industries and "
            "high- and medium-voltage electrical lines, to full environmental impact "
            "assessment, approved by REMA, with consultancy costs borne by the project initiator."
        ),
        "sourceIds": ["rw-env-law-48-2018-faolex", "rw-eia-order-001-2019-faolex"],
        "note": (
            "T1 trilingual Official Gazette prints via FAOLEX - "
            "research/captures/2026-10-01-rw-env-law-48-2018-eia-order-001-2019.md. Two-of-three "
            "structure and the building-classification premise are claim-critical and preserved "
            "(not shortened to 'any large building requires EIA'); the 'publicly accessible "
            "facilities' phrasing in Annex I item 1 degrees leaves DC classification open - not "
            "resolved editorially. Order supersedes Ministerial Order 001/2018. sqm/person "
            "thresholds are regulatory triggers, never market baselines (Task 54)."
        ),
    })
    rw.append({
        "id": "RW-RG-C1",
        "pillar": "regional-frameworks",
        "state": "verified",
        "statement": EAC_STATEMENT.format(country="Rwanda"),
        "sourceIds": ["eac-dgpf-validation-pr", "eac-eardip-tor"],
        "note": eac_note("Rwanda"),
    })

    tz.append({
        "id": "TZ-ENV-C2",
        "pillar": "environmental",
        "state": "verified",
        "statement": (
            "Tanzania's Environmental Management Act 2004 (s.81) mandates an Environmental "
            "Impact Assessment, at the proponent's cost, for projects of a type specified in "
            "the Act's Third Schedule - which includes electrical infrastructure (item 10) and "
            "any structure of a scale not in keeping with its surroundings (item 1(b)) - and "
            "s.81(3) provides that a licence or permit under any other written law does not "
            "entitle a developer to proceed without an EIA Certificate issued under the Act."
        ),
        "sourceIds": ["tanzlii-ema-2004"],
        "note": (
            "T1 full act text (TanzLII, consolidated 2023-12-31) - "
            "research/captures/2026-10-01-tz-ema-2004-tanzlii.md. CLAIM-CRITICAL CORRECTION "
            "applied r17: the EIA trigger list is the THIRD Schedule (s.81(1), s.102(1)), not "
            "the First Schedule as the pre-r17 gap text and TZ-ENV-C1's note said (First = "
            "National Environmental Advisory Committee composition, s.11(3)). Does NOT assert "
            "that DCs require EIA: mandatory-vs-exempt categorisation runs through the EIA "
            "Regulations (uncaptured). Environmental Management (Amendment) Act 2025 (Act "
            "5/2025, TanzLII eng@2025-03-14) flagged uncaptured - currency re-check on capture. "
            "Threshold items are regulatory triggers, never market baselines (Task 54)."
        ),
    })
    tz.append({
        "id": "TZ-RG-C1",
        "pillar": "regional-frameworks",
        "state": "verified",
        "statement": EAC_STATEMENT.format(country="Tanzania"),
        "sourceIds": ["eac-dgpf-validation-pr", "eac-eardip-tor"],
        "note": eac_note("Tanzania"),
    })

    ke.append({
        "id": "KE-RG-C2",
        "pillar": "regional-frameworks",
        "state": "verified",
        "statement": EAC_STATEMENT.format(country="Kenya"),
        "sourceIds": ["eac-dgpf-validation-pr", "eac-eardip-tor"],
        "note": eac_note("Kenya"),
    })

    # ------------------------------------------------- TZ-ENV-C1 note fix
    for c in tz:
        if c["id"] == "TZ-ENV-C1":
            c["note"] = (
                "Regulator operations confirmed from official pages; the Environmental "
                "Management Act 2004 is now captured (T1, TanzLII consolidated 2023-12-31 - "
                "corrected r17: EIA triggers are the THIRD Schedule, see TZ-ENV-C2); the EIA "
                "Regulations' category lists (whether a DC-scale facility is mandatory) remain "
                "capture-pending. eia.nemc.or.tz portal is the operational entry point."
            )

    # ---------------------------------------------------------------- gaps
    def set_gap(country, pillar, gap, expectedSources, upgradePath):
        for g in d["countries"][country]["pillarGaps"]:
            if g["pillar"] == pillar:
                g["gap"] = gap
                g["expectedSources"] = expectedSources
                g["upgradePath"] = upgradePath
                return
        raise SystemExit("gap not found: %s/%s" % (country, pillar))

    REG_OPEN = (
        " Open: Council adoption status and national implementation records."
    )
    for country in ("uganda", "rwanda", "tanzania"):
        set_gap(
            country, "regional-frameworks",
            "EAC Data Governance Policy Framework validated Oct 2024 now verified from two T1 "
            "secretariat records (%s-RG-C1); Cross-border Data Flows Mechanism draft legal "
            "instrument in development under the EARDIP consultancy (TOR captured, 240-day "
            "schedule)." % country[:2].upper() + REG_OPEN,
            ["EAC Council of Ministers records",
             "EAC Mechanism for Cross-border Data Flows draft instrument"],
            "Monitor EAC Council outputs for adoption; capture the mechanism draft instrument "
            "when published.",
        )

    set_gap(
        "uganda", "environmental",
        "Statute level captured and verified (UG-ENV-C1): National Environment Act 2019 "
        "two-track regime with verbatim Schedule 5 ESIA triggers (power infrastructure, "
        "industrial parks). Still open: ESIA Regulations 2020 operational Category lists and "
        "NEMA guidance - whether a DC-scale campus is caught in practice unconfirmed.",
        ["Uganda ESIA Regulations, 2020",
         "National Environment Management Authority (NEMA) guidance"],
        "Capture ESIA Regulations 2020 (FAOLEX/ECOLEX mirror preferred; ULII Cloudflare-blocked) "
        "and check Category lists against DC-scale loads.",
    )
    set_gap(
        "rwanda", "environmental",
        "Statute level captured and verified (RW-ENV-C1): Law 48/2018 Arts. 30-34 + Ministerial "
        "Order 001/2019 Annex I/II trigger lists (two-of-three building thresholds, industries, "
        "HV/MV lines). Still open: whether a DC campus is caught (building-classification "
        "question under Annex I item 1 degrees) and REMA operational guidance.",
        ["Rwanda Environment Management Authority (REMA) guidance",
         "Rwanda Building Code 2019"],
        "Classification-practice check (commercial/administrative premise) + capture REMA EIA "
        "procedural guidance.",
    )
    set_gap(
        "tanzania", "environmental",
        "CORRECTED r17 per captured T1 text: the EMA 2004 EIA trigger list is the THIRD "
        "Schedule (s.81), not the First Schedule as previously recorded. Statute captured and "
        "verified (TZ-ENV-C2): triggers include electrical infrastructure (item 10) and "
        "out-of-scale structures (item 1(b)); s.81(3) licence does not substitute the EIA "
        "Certificate. Still open: EIA Regulations category lists (mandatory vs exempt) - "
        "whether DC-scale load is caught unconfirmed - and the 2025 EMA amendment text.",
        ["Environmental Management (EIA) Regulations 2005",
         "Environmental Management (Amendment) Act 2025 (Act No. 5 of 2025)",
         "eia.nemc.or.tz portal"],
        "Capture the EIA Regulations 2005 + Act 5/2025 (TanzLII eng@2025-03-14 flagged) and "
        "re-check s.81 / Third Schedule currency.",
    )

    # ---------------------------------------------------------------- meta
    d["datasetVersion"] = "policy-2026-Q3-r17"
    d["generatedAt"] = "2026-10-02"
    d["humanGate"].setdefault("rulings", {})["evidence-captures-2026-10-02"] = (
        "Editor delegation in chat 2026-10-02 ('1 and 2 are approved if you also approve, you "
        "have the authority to decide and tell me your decision and why'): agent re-read all "
        "six pending captures (GlobeNewswire R&M colocation T3; EAC TOR + PR T1; TZ EMA 2004; "
        "UG NEA 2019; RW Law 48/2018 + Order 001/2019) plus the TZ Schedule correction and "
        "approved with per-capture rationale - 5 evidence captures promoted onto T1 instrument "
        "text (7 new verified claims: UG-ENV-C1, RW-ENV-C1, TZ-ENV-C2, UG-RG-C1, RW-RG-C1, "
        "TZ-RG-C1, KE-RG-C2); GlobeNewswire closed not-needed (no Africa figures, unnamed "
        "analyst house, self-inconsistent CAGR; revenue baseline stays out per Task 54); TZ gap "
        "First->Third Schedule corrected on captured s.81 text. DC-specific EIA/ESIA treatment "
        "deliberately NOT asserted anywhere (regulations/classification open)."
    )

    # ---------------------------------------------------------------- dump
    out = json.dumps(d, indent=2, ensure_ascii=False) + "\n"
    DS.write_text(out, encoding="utf-8")

    # ---------------------------------------------------------------- report
    n_claims = sum(len(c["claims"]) for c in d["countries"].values())
    n_verified = sum(1 for c in d["countries"].values() for x in c["claims"] if x["state"] == "verified")
    n_sources = len(d["sources"])
    print("r17 upgrade applied:")
    print("  claims : 61 -> %d (verified 55 -> %d)" % (n_claims, n_verified))
    print("  sources: 70 -> %d" % n_sources)
    print("  version: %s | generatedAt %s" % (d["datasetVersion"], d["generatedAt"]))
    print("  byte-stable rewrite: %s" % (out != before))


if __name__ == "__main__":
    main()
