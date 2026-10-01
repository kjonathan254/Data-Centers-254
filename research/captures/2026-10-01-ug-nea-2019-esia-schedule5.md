---
captured_at: 2026-10-01T10:30:00Z
source_url: https://faolex.fao.org/docs/pdf/uga192395.pdf
final_url: https://faolex.fao.org/docs/pdf/uga192395.pdf
title: The National Environment Act, 2019 (Uganda, Act 5 of 2019) - Acts Supplement No. 2, Uganda Gazette No. 10 Vol. CXII, 7 March 2019 (178pp)
tool: curl direct download (FAOLEX PDF, no auth challenge); ECOLEX record LEX-FAOC192395 used as discovery path
http_status: 200
tier: 1
claims: []
status: capture-pending # becomes verified ONLY after an editor reads and confirms content
note: Uganda environmental gap - ESIA regime for large facilities. Official Gazette scan (UPPC print) of the full Act text via FAOLEX. Fills the UG environmental pillar gap ("NEMA requirements for large facilities, ESIA thresholds"). Captured text stored at sandbox tmp/ug_nea2019_full.txt (309KB pdftotext extraction); this capture file records the DC-relevant verbatim extracts + triage. NO claim upgrades proposed this session (humanGate).
---

# Uganda National Environment Act 2019 - ESIA regime verbatim extracts

## Document identity

- "ACTS SUPPLEMENT No. 2, 7th March, 2019 - to The Uganda Gazette No. 10, Volume CXII, dated 7th March, 2019. Printed by UPPC, Entebbe, by Order of the Government."
- "THE NATIONAL ENVIRONMENT ACT, 2019" (Act 5 of 2019). 178 pages, full printed Act.
- Discovery chain: ECOLEX search (curl-open) -> ECOLEX detail page LEX-FAOC192395 -> FAOLEX PDF uga192395.pdf (direct download, zero credits). ULII AKN page is Cloudflare-challenged from this workspace (both curl and z-ai page_reader get "Just a moment..." challenge shell).

## Key verbatim extracts (DC-relevant)

### Section 110 - Purpose and categorisation basis (p.91)

- "110. Purpose of environmental and social assessments. (1) The purpose of environmental and social assessments undertaken under this Act and regulations made under this Act is to evaluate environmental and social impacts, risks or other concerns of a given project or activity, taking into account the environmental principles set out in section 5(2)."
- "(2) The Authority shall categorise projects or activities under this Part, based on- (a) the nature and scale of the proposed project or activity; (b) the documented impacts of similar or related projects or activities previously undertaken in Uganda; and (c) the anticipated magnitude of the environmental, social, economic and cultural impacts of the proposed project or activity."

### Section 112 - Project-brief regime (Schedule 4 projects)

- "(1) A developer of a project set out in Schedule 4 to this Act shall undertake an environmental and social impact assessment by way of project brief."
- "(6) Where the Authority finds that the project in subsection (2) is likely to have significant adverse impacts on the environment or that the project brief does not disclose sufficient mitigation measures ..., the Authority may reject the project or may require the developer to undertake an environmental and social impact assessment."

### Section 113 - Full ESIA regime (Schedule 5 projects)

- "(1) A developer of a project set out in Schedule 5 shall- (a) conduct an environmental and social impact assessment by way of scoping; (b) prepare terms of reference for an environmental and social impact study; and (c) undertake an environmental and social impact study as prescribed by regulations."
- "(2) A developer of a project proposed to be located in or near the environmentally sensitive areas listed in Schedule 10 may be required to ..."

### Schedule 5 heading (p.155+)

- "SCHEDULE 5 - Sections 49(1) & (2), 113 (2) & (3), 176(1), 177(1), 126(2) & (3) and 181(2). PROJECTS FOR WHICH ENVIRONMENTAL AND SOCIAL IMPACT ASSESSMENTS ARE MANDATORY."

### Schedule 5 item 3 - power infrastructure (the closest DC-adjacent triggers)

- "3. Exploration and power generation, transmission and distribution infrastructure."
- "(a) Generation of power from solar PV power plants of more than 2 megawatts."
- "(c) Thermal power generation and other combustion installations."
- "(d) Wind power generation farms of a capacity of at least 10 megawatts."
- "(g) Hydro-power generation facilities; including dams with an installed capacity of more than 1 megawatt, or where conditions [apply]."
- "(h) High voltage electricity transmission lines."
- "(j) Electricity distribution lines of a voltage of more than 33kV or [similar threshold]."
- "(k) Electrical substations."

### Schedule 5 item 5 - buildings and parks

- "5. Housing and urban development."
- "(b) Establishment or expansion of development zones, industrial estates and industrial parks."
- "(e) Shopping centres and other commercial complexes covering a floor area of 2500/10,000m2 or more." [VERBATIM ODDITY: the printed Act uses the slash notation "2500/10,000m2"; the split of the two thresholds by context is defined, if at all, in the ESIA regulations - flag for editor, do not resolve editorially here.]
- "(f) Construction of warehouses."

# Triage analysis (agent, 2026-10-01)

- GAP SERVED: Uganda "environmental" pillar gap - "No claims researched yet (NEMA requirements for large facilities, ESIA thresholds)". This capture supplies the statutory thresholds from the primary instrument (Act 5/2019, official Gazette print).
- DC READ-ACROSS (analyst inference, not statute text): a data-centre campus is not a named category in Schedule 5. Its ESIA exposure arrives via (1) item 3 power-infrastructure subitems where the DC project includes its own substation / >33kV distribution / HV connection or captive generation ("thermal power generation and other combustion installations" can capture large genset arrays); (2) item 5(b) where sited inside an industrial/development zone; (3) item 5(e)/(f) floor-area or warehouse analogies are weaker and should not be asserted without the regulations. Any future claim must be framed on the named triggers, not on a "DCs require ESIA" generalisation.
- FOUR-BASELINE DISCIPLINE: the MW/kV numbers here are ESIA TRIGGER THRESHOLDS (regulatory), never capacity or market statistics. Do not mix with Arizton facility counts, R&M revenue, IMF shares or site MW.
- ARCHITECTURE NOTE: Act 5/2019 uses a two-track regime - Schedule 4 = project brief (lighter), Schedule 5 = full ESIA (scoping + ToR + study). NEMA (Authority) categorises (s.110(2)). Operational detail lives in the ESIA Regulations (2020), NOT yet captured - candidate follow-up capture for the same gap (would name Category 1/2 lists as applied in practice).
- COMPARISON vs gap expectedSources: gap text asked for "NEMA requirements ... ESIA thresholds" - DELIVERED by this capture at statute level; regulations-level detail remains open.
- VERDICT: reference capture for the UG environmental pillar. No future claim drafted yet (would be premature without the regulations + a real facility case); file claims only after editor sees this + the 2020 ESIA regulations capture.
- COST: zero Context.dev credits (FAOLEX direct download). tooling note: contextdev_capture.mjs gained timeoutOpts (180s) this session after 2 REQUEST_TIMEOUT burns on the TanzLII page.
