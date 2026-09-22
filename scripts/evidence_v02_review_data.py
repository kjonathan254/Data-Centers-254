#!/usr/bin/env python3
"""Edit tables for the 2026-09-22 editorial review of Evidence Engine v0.2.

The editor performed a claim-by-claim human review of all 11 pilot facilities
against primary sources (official operator pages, tech-spec PDFs, Digital
Realty press releases, current iColo/Digital Realty sites, Raxio official page
+ specs, ADC Nairobi page + older data sheet, X posts, market briefs).

Principles applied (editor's words):
  - Primary sources take precedence.
  - The claim remains the unit of truth.
  - Unsupported means "insufficient evidence to publish as verified",
    not "false".

Data notes:
  - Every excerpt below is verbatim from a document fetched into
    research/evidence_v02/ (see manifest.json, rounds: editorial-review*).
  - House rule: no em dash / en dash anywhere in excerpts.
  - editorState is set ONLY where the editor's determination (based on
    primary sources they checked directly) diverges from the rule-derived
    state. The rule-derived `state` field is never overwritten, so the
    audit trail stays intact.
"""

REVIEW_DATE = "2026-09-22"
REVIEWER = "Editor, DataCentre254"
REVIEWER_LEDGER = "Editor, DataCentre254 (human primary-source review)"

CAPTURE_PENDING = (
    "The editor verified this directly against primary documentation "
    "(2026-09-22 editorial review); the underlying document is not yet "
    "captured in this evidence store, so the rule-derived state stays as "
    "the internal signal. Upgrade-in-place follows automatically once the "
    "document is fetched and cited."
)

# ─── New sources (verbatim excerpts from fetched documents) ───────────────

NEW_SOURCES = {
    "press-etcio-nbo2": {
        "label": "ETCIO Data Centers: Digital Realty opens 6.4MW Nairobi Two Data Centre",
        "url": "https://datacenters.economictimes.indiatimes.com/news/cloud-colocation-connectivity/digital-realty-opens-6-4mw-nairobi-two-data-centre/133994519",
        "tier": 3,
        "publisher": "datacenters.economictimes.indiatimes.com",
        "sourceType": "Specialist data-centre publication",
        "publishedDate": None,
        "retrievedDate": REVIEW_DATE,
        "excerpt": ("Digital Realty has commissioned its 6.4-megawatt (MW) "
                    "Nairobi Two (NBO2) data centre in Karen, Kenya, marking a "
                    "significant expansion of its Nairobi campus"),
    },
    "adc-nairobi-location": {
        "label": "Africa Data Centres Nairobi page (location section)",
        "url": "https://www.africadatacentres.com/nairobi/",
        "tier": 1,
        "publisher": "africadatacentres.com",
        "sourceType": "Operator website",
        "publishedDate": None,
        "retrievedDate": REVIEW_DATE,
        "excerpt": ("More about NBO1 Nairobi Data Centre Located at Sameer "
                    "Industrial Park"),
    },
    "raxio-uganda-page": {
        "label": "Raxio Group official Raxio Uganda (UG1) facility page",
        "url": "https://www.raxiogroup.com/data-centres/uganda",
        "tier": 1,
        "publisher": "raxiogroup.com",
        "sourceType": "Operator website",
        "publishedDate": None,
        "retrievedDate": REVIEW_DATE,
        "excerpt": ("Strategically located in Namanve Industrial Park, our "
                    "state-of-the-art facility is designed to meet the growing "
                    "needs of businesses and organisations across East Africa. "
                    "The data centre is located 15km from Kampala CBD within "
                    "the Namanve Industrial Park along the Kampala-Jinja "
                    "Highway"),
    },
    "raxio-uganda-keyfacts": {
        "label": "Raxio Uganda (UG1) official key facts and specs",
        "url": "https://www.raxiogroup.com/data-centres/uganda",
        "tier": 1,
        "publisher": "raxiogroup.com",
        "sourceType": "Operator website (facility specifications)",
        "publishedDate": None,
        "retrievedDate": REVIEW_DATE,
        "excerpt": ("UG1 Key Facts Tier III Certified 400 Racks 1,000 m2 "
                    "1.5 MW IT Power 7 Security Layers Colocation Cross "
                    "Connect 24/7 Support Fibre Solutions"),
    },
}

# Excerpt upgrades for sources already in the store (same document, stronger
# verbatim quote now that the editorial review identified the load-bearing text).
EXCERPT_UPGRADES = {
    "ixafrica-home": ("NBOX1.1: 4.5MW IT Load 780 Racks | 2.25MW Ready "
                      "40 kW available per rack NBOX1.2: 18MW IT Load 3,744 Racks"),
    "adc-nairobi-page": ("4 Data halls certified Uptime Institute Tier 3 "
                         "facility which is unique in East Africa Data Centre "
                         "Nairobi, Kenya Available site capacity 7.5 MW"),
    "icolo-mba1-page": ("Miritini is currently home to MBA1 which has been "
                        "operational since 2017. The Miritini campus will "
                        "expand in future to have 3 data centers occupying "
                        "18,000 square metres with a total IT load of 13 MW "
                        "and a total rack capacity of 1,800."),
    "icolo-mba2-page": ("Situated in Nyali, our second facility in the Kenyan "
                        "coastal town was launched in 2022. Hosting up to 600 "
                        "customer racks, MBA2 is part of our expansion plans "
                        "in East Africa with its proximity to subsea cable "
                        "landing points in Mombasa"),
    "press-independent-raxio": ("Raxio Data Centre, Uganda's first "
                                "carrier-grade, Tier III certified carrier "
                                "and cloud-neutral data centre, on Tuesday "
                                "launched Uganda's Data Centre Landscape 2025 "
                                "report. The function was at the heart of "
                                "Namanve Industrial Park, in Kampala"),
}

# ─── Claim edits: claimId -> partial update ────────────────────────────────
# "statement" replaces the claim statement; "note" replaces the note;
# "addSources" appends source ids; "editorState" sets the editor's state.

CLAIM_EDITS = {
    # ── iXAfrica NBOX1 : Unchanged, VERIFIED ──────────────────────────────
    "NBOX1-C1": {"note": "Editor review 2026-09-22: confirmed against the "
                         "official iXAfrica campus specs and site."},
    "NBOX1-C2": {"note": "Editor review 2026-09-22: confirmed against the "
                         "official iXAfrica campus specs and site."},
    "NBOX1-C3": {"note": "Editor review 2026-09-22: hyperscale, "
                         "carrier-neutral, AI-ready positioning confirmed "
                         "against the official site. Superlatives (first and "
                         "largest) remain marketing language, not verified "
                         "fact."},
    "NBOX1-C4": {"note": "Editor review 2026-09-22: Mombasa Road / Cabanas "
                         "location confirmed against the official site and "
                         "registry."},
    "NBOX1-C5": {"note": "Editor review 2026-09-22: NBOX1.1 live at 4.5 MW "
                         "per the official campus specs; operational status "
                         "consistent with independent 2025 launch reports."},
    "NBOX1-C6": {
        "statement": ("NBOX1.1 is live at 4.5 MW of IT load with 780 racks; "
                      "the NBOX1.2 expansion adds 18 MW and 3,744 racks."),
        "note": "Operator-stated figures, verbatim on the official campus "
                "specs (NBOX1.1: 4.5MW IT Load, 780 Racks; NBOX1.2: 18MW IT "
                "Load, 3,744 Racks). " + CAPTURE_PENDING,
        "editorState": "verified",
    },

    # ── iColo NBO1 : Unchanged, clean operator page ───────────────────────
    "NBONBO1-C1": {"note": "Editor review 2026-09-22: icolo.io/location/nbo1/ "
                           "states NBO1 launched September 2019 in Karen; "
                           "clean primary source."},
    "NBONBO1-C2": {"note": "Editor review 2026-09-22: confirmed on the "
                           "operator facility page (iColo, now Digital "
                           "Realty)."},
    "NBONBO1-C3": {"note": "Editor review 2026-09-22: carrier-neutral "
                           "colocation plus teleport, per the operator page; "
                           "tech-spec PDF and connectivity lists align."},
    "NBONBO1-C4": {"note": "Editor review 2026-09-22: Karen location stated "
                           "verbatim on the operator facility page."},
    "NBONBO1-C5": {"note": "Editor review 2026-09-22: launched September 2019 "
                           "per the operator page; 280 racks and 624 sqm of "
                           "customer space stated on the same page."},

    # ── PAIX Nairobi : Unchanged, VERIFIED ────────────────────────────────
    "PAIX-C1": {"note": "Editor review 2026-09-22: paix.io/kenya confirms "
                        "NBO-1 in Britam Tower, Upper Hill."},
    "PAIX-C2": {"note": "Editor review 2026-09-22: confirmed on the operator "
                        "Kenya page."},
    "PAIX-C3": {"note": "Editor review 2026-09-22: carrier/cloud-neutral "
                        "colocation per the operator page; PeeringDB "
                        "consistent."},
    "PAIX-C4": {"note": "Editor review 2026-09-22: Britam Tower, Upper Hill "
                        "confirmed on the operator page and registry."},
    "PAIX-C5": {"note": "Editor review 2026-09-22: operational per the live "
                        "operator page and active registry record (38 "
                        "networks)."},
    "PAIX-C6": {"note": "Directory tracks 1.5 MW (launch-era specification). "
                        "No public source in the 2026-09-22 sweep documents "
                        "the figure; retained as an operator-stated launch "
                        "spec, not a verified number. Editor review did not "
                        "overturn this."},

    # ── ADC NBO1 : core VERIFIED, peripheral numbers under review ─────────
    "ADCNBO1-C1": {"note": "Editor review 2026-09-22: identity supported; "
                           "facility solidly verified."},
    "ADCNBO1-C2": {"note": "Editor review 2026-09-22: operator supported."},
    "ADCNBO1-C3": {"note": "Editor review 2026-09-22: carrier-neutral "
                           "colocation classification supported."},
    "ADCNBO1-C4": {
        "statement": ("NBO1 is located at Sameer Industrial/Business Park, "
                      "Mombasa Road, Nairobi."),
        "addSources": ["adc-nairobi-location"],
        "note": "Operator's current page says 'Located at Sameer Industrial "
                "Park'; the registry says 'Sameer Business Park'. Same "
                "complex; both wordings recorded.",
    },
    "ADCNBO1-C5": {"note": "Editor review 2026-09-22: operational status "
                           "supported (operator lists NBO1 in its live "
                           "footprint; active registry record with 126 "
                           "networks)."},
    "ADCNBO1-C6": {
        "statement": ("Operator states NBO1 has available site capacity of "
                      "7.5 MW."),
        "addSources": ["adc-nairobi-page"],
        "note": ("Operator's own current wording on africadatacentres.com "
                 "('Available site capacity 7.5 MW'). An older 2021 operator "
                 "data sheet cited lower client IT load (about 2.7 MW plus "
                 "planned expansion), showing the figures evolved. Exact "
                 "current sold/available IT load, precise hall counts and "
                 "any expansion beyond the 7.5 MW site figure stay under "
                 "individual review, per the editor's action."),
    },

    # ── iColo/Digital Realty NBO2 : VERIFIED, capacity 6.4 MW ─────────────
    "NBONBO2-C1": {"note": "Editor review 2026-09-22: opened 7 September "
                           "2026; multiple independent launch reports "
                           "corroborate."},
    "NBONBO2-C2": {"note": "Editor review 2026-09-22: Digital Realty "
                           "rebranding confirmed in the launch coverage and "
                           "operator material."},
    "NBONBO2-C3": {"note": "Digital Realty's site listing describes "
                           "carrier-neutral colocation (editor review, "
                           "2026-09-22); the fetched press and registry "
                           "documents describe the facility without the word "
                           "'colocation'. " + CAPTURE_PENDING},
    "NBONBO2-C4": {
        "statement": ("NBO2 is located in Karen, Nairobi, on the Digital "
                      "Realty campus about 300 m from NBO1."),
        "addSources": ["press-etcio-nbo2"],
        "note": "Launch coverage places NBO2 in Karen; the Digital Realty "
                "listing gives the Langata South Road & LRC Road junction "
                "(editor review). The directory's earlier street detail "
                "(Bogani East Road) is retained on the record but rests on "
                "earlier collection.",
    },
    "NBONBO2-C5": {"note": "Editor review 2026-09-22: operational (opened 7 "
                           "September 2026); corroborated by launch coverage "
                           "and the live operator listing."},
    "NBONBO2-C6": {
        "statement": ("NBO2 has a capacity of 6.4 MW (Digital Realty launch "
                      "announcement, 7 September 2026); earlier operator "
                      "material cited 6.5 MW."),
        "addSources": ["press-etcio-nbo2"],
        "note": ("All launch coverage states 6.4 MW; the editor verified "
                 "Digital Realty's official GlobeNewswire release (7 Sep "
                 "2026) stating the 6.4-megawatt Nairobi Two Data Center. "
                 "The earlier iColo X post (January 2026, pre-launch) cited "
                 "6.5 MW IT load; recorded as a pre-launch discrepancy "
                 "rather than silently overwritten, per the editor's "
                 "action. The directory record now carries 6.4 MW."),
    },

    # ── iColo MBA1 : core VERIFIED, 13 MW is campus total ─────────────────
    "MBAMBA1-C1": {"note": "Editor review 2026-09-22: operator page states "
                           "'Miritini is currently home to MBA1'."},
    "MBAMBA1-C2": {"note": "Editor review 2026-09-22: confirmed on the "
                           "operator page (iColo, now Digital Realty)."},
    "MBAMBA1-C3": {"note": "Operator page: 'Colocate your business-critical "
                           "equipment in MBA1'. Editor review 2026-09-22 "
                           "confirms colocation classification."},
    "MBAMBA1-C4": {
        "addSources": ["icolo-mba1-page"],
        "note": "Operator page states 'Miritini is currently home to MBA1' "
                "(the earlier note that the operator page does not state "
                "the area was wrong; the verbatim text is in the store).",
    },
    "MBAMBA1-C5": {"note": "Operator page: 'operational since 2017'. Editor "
                           "review 2026-09-22 confirms."},
    "MBAMBA1-C6": {
        "statement": ("The Miritini campus is planned to reach 13 MW of "
                      "total IT load and 1,800 racks across three data "
                      "centres; MBA1 itself is documented at 250 racks and "
                      "580 sqm of customer space."),
        "note": ("Operator page wording is explicit: 13 MW is the planned "
                 "campus total (3 data centres), not an MBA1-only figure. "
                 "Per the editor's action, the 'MBA1 = 13 MW' attribution "
                 "is removed; the qualified campus claim is what the "
                 "directory now carries. MBA1's own live IT load (0.9 MW "
                 "per the iColo homepage, earlier collection) was not "
                 "re-confirmed in this sweep."),
    },

    # ── iColo MBA2 : Unchanged, VERIFIED ──────────────────────────────────
    "MBAMBA2-C1": {"note": "Editor review 2026-09-22: confirmed on the "
                           "operator page."},
    "MBAMBA2-C2": {"note": "Editor review 2026-09-22: confirmed (iColo, now "
                           "Digital Realty)."},
    "MBAMBA2-C3": {"note": "Operator page: 'Colocate your business-critical "
                           "equipment in MBA2'. Editor review 2026-09-22 "
                           "confirms colocation classification."},
    "MBAMBA2-C4": {
        "addSources": ["icolo-mba2-page"],
        "note": "Operator page states 'Situated in Nyali' (the earlier note "
                "that the operator page does not state the area was wrong; "
                "the verbatim text is in the store).",
    },
    "MBAMBA2-C5": {"note": "Operator page: 'launched in 2022'. Editor review "
                           "2026-09-22 confirms."},
    "MBAMBA2-C6": {
        "note": "Operator-stated ('Hosting up to 600 customer racks'; '600 "
                "Racks' key facts), verbatim on the operator page. " + CAPTURE_PENDING,
        "editorState": "verified",
    },

    # ── SEACOM Mombasa CLS : VERIFIED for existence and type ──────────────
    "SEACOM-C1": {
        "note": "Editor review 2026-09-22: SEACOM documentation, "
                "landing-point lists and independent cable maps confirm the "
                "Mombasa CLS. " + CAPTURE_PENDING,
        "editorState": "verified",
    },
    "SEACOM-C2": {
        "note": "Editor review 2026-09-22: the registry names the operator "
                "as SEACOM Limited; SEACOM documentation confirms. " + CAPTURE_PENDING,
        "editorState": "verified",
    },
    "SEACOM-C3": {
        "note": "Editor review 2026-09-22: cable landing station role "
                "confirmed via SEACOM documentation and independent cable "
                "maps. " + CAPTURE_PENDING,
        "editorState": "verified",
    },
    "SEACOM-C4": {
        "statement": "The SEACOM Mombasa cable landing station is located in Mombasa, Kenya.",
        "note": "City-level location is part of the editor-verified "
                "existence finding (landing-point lists and cable maps). "
                "The street-level address (Swahili Cultural Centre, per the "
                "registry) remains a separate, not-yet-corroborated claim, "
                "per the editor: exact address and full ancillary specs are "
                "separate claims. " + CAPTURE_PENDING,
        "editorState": "verified",
    },
    "SEACOM-C5": {
        "note": "The editor's verification covers existence and type of the "
                "landing station; an explicit in-service statement has not "
                "been captured, so operational status stays at Review. The "
                "registry record has been active since 2013 with 31 "
                "networks.",
    },

    # ── Nxtra by Airtel Tatu City : VERIFIED as under-construction project ─
    "NXTRA-C1": {
        "note": "Editor review 2026-09-22: Airtel/Nxtra and Tatu City "
                "announcements, the September 2025 groundbreaking and "
                "government participation confirm the project. " + CAPTURE_PENDING,
        "editorState": "verified",
    },
    "NXTRA-C2": {
        "note": "Editor review 2026-09-22: the announcements name Nxtra by "
                "Airtel (Airtel Kenya) as the developer-operator. " + CAPTURE_PENDING,
        "editorState": "verified",
    },
    "NXTRA-C3": {
        "statement": ("The Tatu City facility is planned as a large-scale "
                      "(hyperscale) campus of 44 MW across two 22 MW phases."),
        "note": "Editor review 2026-09-22: 44 MW in two 22 MW phases is the "
                "figure in the Airtel/Nxtra and Tatu City announcements, "
                "corroborated by multiple independent reports. " + CAPTURE_PENDING,
        "editorState": "verified",
    },
    "NXTRA-C4": {
        "statement": "The facility is located at Tatu City, near Ruiru, Kiambu County.",
        "note": "Tatu City location confirmed by the editor against the "
                "announcements; street-level detail (Eastern Bypass) rests "
                "on the directory's earlier collection. " + CAPTURE_PENDING,
        "editorState": "verified",
    },
    "NXTRA-C5": {
        "note": "Editor review 2026-09-22: under construction, "
                "groundbreaking September 2025, revised completion target "
                "July 2027, corroborated by multiple independent reports. "
                "Explicitly not operational. " + CAPTURE_PENDING,
        "editorState": "verified",
    },
    "NXTRA-C6": {
        "statement": ("The facility's planned capacity is 44 MW across two "
                      "22 MW phases."),
        "note": "Editor review 2026-09-22: the 44 MW planned figure is in "
                "the developer announcements and is corroborated by "
                "independent reporting; recorded as planned capacity for a "
                "project, not an operational figure. " + CAPTURE_PENDING,
        "editorState": "verified",
    },

    # ── Raxio Kampala UG1 : VERIFIED, strengthened ────────────────────────
    "RAXIO-C1": {
        "addSources": ["raxio-uganda-page"],
        "note": "Editor review 2026-09-22: official facility page live at "
                "raxiogroup.com/data-centres/uganda (the earlier sweep hit a "
                "block; the page fetches fine).",
    },
    "RAXIO-C2": {
        "addSources": ["raxio-uganda-page"],
        "note": "Editor review 2026-09-22: the official page is Raxio "
                "Uganda's own facility page with downloadable tech specs.",
    },
    "RAXIO-C3": {
        "addSources": ["raxio-uganda-keyfacts", "press-independent-raxio"],
        "note": "Official key facts state 'Colocation'; the independent "
                "press coverage says 'carrier and cloud-neutral data "
                "centre'. Editor review 2026-09-22 confirms.",
    },
    "RAXIO-C4": {
        "addSources": ["raxio-uganda-page"],
        "note": "Official page: 'located 15km from Kampala CBD within the "
                "Namanve Industrial Park along the Kampala-Jinja Highway'.",
    },
    "RAXIO-C5": {
        "addSources": ["raxio-uganda-page"],
        "note": "Official page presents the live facility (key facts, "
                "security, connectivity); press describes functions hosted "
                "at the operating facility. Editor review 2026-09-22 "
                "confirms operational status.",
    },
    "RAXIO-C6": {
        "statement": ("UG1 provides 1.5 MW of IT power, up to 400 racks and "
                      "1,000 m2 of white space at full build."),
        "addSources": ["raxio-uganda-keyfacts"],
        "note": "Official key facts verbatim: 'Tier III Certified 400 Racks "
                "1,000 m2 1.5 MW IT Power'. Editor review 2026-09-22 also "
                "cites the downloadable tech specs and independent "
                "corroboration (PeeringDB, Equity Bank migration reporting, "
                "DataCenterMap). " + CAPTURE_PENDING,
        "editorState": "verified",
    },

    # ── ADC Kigali KGL1 : UNSUPPORTED, hold ───────────────────────────────
    "KGL1-C1": {"note": "Editor review 2026-09-22: no material change. The "
                        "2026-09-22 negative sweep stands: no dedicated "
                        "current ADC facility page, no completion or go-live "
                        "announcement in primary or secondary sweeps."},
    "KGL1-C2": {"note": "Editor review 2026-09-22: no material change."},
    "KGL1-C3": {"note": "Editor review 2026-09-22: no material change."},
    "KGL1-C4": {"note": "Editor review 2026-09-22: no material change."},
    "KGL1-C5": {"note": "Editor review 2026-09-22: no material change. The "
                        "2022 plan (2 MW, groundbreaking Q1 2023) and "
                        "aggregator listings are not sufficient to publish "
                        "any stage claim as verified."},
}

# Facility-level investigation notes (editor hold wording etc.)
INVESTIGATION_NOTES = {
    "africa-data-centres-kigali-kgl1": (
        "Editor decision, 2026-09-22: DataCentre254 currently lacks "
        "sufficient authoritative evidence to verify an operational (or "
        "completed) Africa Data Centres facility identified as KGL1 in "
        "Kigali. Held as Unsupported; non-existence is NOT asserted. The "
        "record stays on hold pending a primary source (a new ADC facility "
        "page, a completion notice, or independent confirmation). PAIX has "
        "a separately documented Kigali presence."
    ),
    "seacom-mombasa-cls": (
        "Editor decision, 2026-09-22: verification covers the existence and "
        "type of the SEACOM Mombasa cable landing station; exact address "
        "and full ancillary specifications remain separate claims. SEACOM's "
        "site is a JS-rendered shell and TeleGeography's map is "
        "client-rendered, so the operator documentation, landing-point "
        "lists and cable maps the editor checked are not yet captured as "
        "store documents (follow-up fetch)."
    ),
    "nxtra-tatu-city": (
        "Editor decision, 2026-09-22: verified as an under-construction "
        "project (groundbreaking September 2025, 44 MW across two 22 MW "
        "phases, revised target July 2027, explicitly not operational). The "
        "Airtel/Nxtra and Tatu City announcement texts were checked by the "
        "editor but are not yet captured in this store (Nxtra's site "
        "returned HTTP 525; Tatu City search is bot-gated); follow-up fetch "
        "pending."
    ),
}

# ─── Directory record (current.json) edits ────────────────────────────────
# slug -> dict of field updates. "notableAppend" appends to the notable text.

RECORD_EDITS = {
    "ixafrica-nbox1": {
        "totalCapacityMw": 22.5,
        "notableAppend": ("Official campus specs (retrieved 22 September "
                          "2026): NBOX1.1 live at 4.5 MW with 780 racks; "
                          "NBOX1.2 adds 18 MW with 3,744 racks, for a campus "
                          "design of 22.5 MW."),
    },
    "icolo-nbo2": {
        "totalCapacityMw": 6.4,
        "openedDate": "2026",
        "notableAppend": ("Capacity is 6.4 MW per Digital Realty's launch "
                          "announcement (7 September 2026); an earlier iColo "
                          "X post (January 2026) and Developing Telecoms "
                          "(August 2024) cited 6.5 MW IT load, recorded as a "
                          "pre-launch discrepancy. Digital Realty's listing "
                          "places NBO2 on the Karen campus about 300 m from "
                          "NBO1."),
    },
    "icolo-mba1": {
        "totalCapacityMw": None,
        "notableAppend": ("Correction (22 September 2026): the 13 MW figure "
                          "is the planned Miritini campus total (three data "
                          "centres, 1,800 racks), not an MBA1-only figure; "
                          "MBA1 itself is documented at 250 racks and 580 "
                          "sqm of customer space."),
    },
    "raxio-kampala-ug1": {
        "totalCapacityMw": 1.5,
        "notableAppend": ("Official facility page (retrieved 22 September "
                          "2026) states 1.5 MW IT power, 1,000 m2 of white "
                          "space, Tier III certification and carrier-neutral "
                          "operation with 15 connectivity providers, 15 km "
                          "from Kampala CBD along the Kampala-Jinja Highway."),
    },
    "africa-data-centres-kigali-kgl1": {
        "notableReplace": {
            "old": "No ready-for-service announcement has been located as of 19 September 2026.",
            "new": ("No ready-for-service announcement has been located as "
                    "of 22 September 2026; the 22 Sep editorial review holds "
                    "the record as Unsupported pending a primary source."),
        },
    },
}
