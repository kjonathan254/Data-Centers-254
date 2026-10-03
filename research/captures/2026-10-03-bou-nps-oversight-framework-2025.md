---
captured_at: 2026-10-03T15:00:00+03:00
source_url: https://bou.or.ug/uploads/Revised_BOU_National_Payment_Systems_Oversight_Framework_2025_698b3e9745.pdf
final_url: https://bou.or.ug/uploads/Revised_BOU_National_Payment_Systems_Oversight_Framework_2025_698b3e9745.pdf
title: "Revised Bank of Uganda National Payment Systems Oversight Framework 2025 (22pp PDF, bou.or.ug uploads)"
tool: agent-browser (BoU site is a JS SPA - page_reader got shell only; rendered /financial_infrastructure_innovation and extracted upload links) + curl direct (200, 384KB)
http_status: 200
tier: 1
claims: []
status: capture-pending # becomes verified ONLY after an editor reads and confirms content
note: Task 76 Hunt A (editor 2026-10-03 "proceed on the still open" - BoU instrument hunt from Task 74d lead-flag). IMPORTANT NEGATIVE RESULT: this T1 BoU instrument contains NO in-country hosting / data-location / encryption-infrastructure clause (keyword scan: host 0, in-country 0, data centre 0, server 0, outsourcing 1 - about oversight access to outsourced-operations info, not hosting location). The BoU requirement claimed in the NEC statement (DevTel capture 2026-10-03-devtel-nec-uganda-bou-hosting-lead.md) remains UNCITED to any instrument. This capture preserves the search work product and rules out the most likely candidate.
---

# Context: the hunt (2026-10-03, agent)

- TARGET: the BoU instrument behind "new regulatory requirements from the
  Bank of Uganda, which require encryption systems and security
  infrastructure remain hosted within national borders" (NEC Africa key
  account manager Geoffrey Karanja, statement ~29-30 Sep 2026; echoed by
  Developing Telecoms 2 Oct, ITWeb Africa 29 Sep, TechReview Africa 30 Sep,
  Telecompaper 29 Sep - all vendor-attributed, none citing an instrument
  name, circular number or date).
- METHOD: 8 free web searches (trigram variants incl. "hardware security
  modules" + "Bank of Uganda" + hosted in Uganda); BoU site is a JS SPA
  (curl + page_reader both get an empty shell) -> agent-browser rendered
  /supervision and /financial_infrastructure_innovation; extracted all
  /uploads/ links; downloaded and full-text scanned the most likely
  instrument (this Framework) plus checked the NPS Act 2020 / NPS
  Regulations 2021 FAQ listing.
- ELIMINATED this pass: Revised NPS Oversight Framework 2025 (no hosting
  clause - see scan below); FI Corporate Governance Regulations 2024/2025
  and MFI Agent Banking Regulations 2025 (listed on /supervision; governance
  scope, not ICT hosting); Sandbox Framework June 2021 (admissions pathway);
  NPS Act 2020/Regs 2021 FAQ (listing seen; full Regs text NOT yet captured -
  next best candidate); press echoes of the NEC statement (same release, no
  instrument detail beyond the DevTel capture).

# Framework key verbatim extracts (for the UG payments-infrastructure record)

## Oversight scope (verbatim)

- "System operators will need to provide data and information to enable
  continuous monitoring of adherence to regulations and policies. Key
  sources of information include, but are not limited to, official system
  documents and records, periodic returns, regular or ad-hoc reports,
  internal reports from Board meetings and internal auditors, on-site visits
  and inspections, information on operations outsourced to third parties and
  dialogue with the Board, management, or participants."
- "The PFMI incorporates standards for both FMI risk management and the
  regulator/overseer's conduct of oversight. Adoption of the PFMI requires
  observance of the standards in both respects. As such, the BoU will
  undertake periodic assessments of its own fulfilment of the regulatory,
  supervisory and oversight responsibilities."

## Licensing/approval framing (verbatim)

- "Cross-border money transfer/remittance services: Inbound or outbound
  remittances, delivered in the local currency. This requires prior
  approval/licence by the Bank of Uganda."
- Trade repository: "an entity that maintains a centralised electronic
  record (database) of transaction data."

## NEGATIVE-RESULT SCAN (keyword counts over full extracted text, 22pp)

- "host": 0 | "in-country"/"in country": 0 | "data centre"/"data center": 0
  | "server": 0 | "located within": 0 | "jurisdiction": 2 (generic usage:
  domestic transfer definition; PFMI Principle 1 all-jurisdictions clause)
  | "outsourc": 1 (oversight access to info on outsourced operations, NOT a
  hosting-location obligation).

# Triage analysis (agent, 2026-10-03)

- DISPOSITION: T1 reference capture with a negative finding. NOT the
  instrument behind the NEC claim; registered to (a) preserve the elimination,
  (b) give the UG payments-infrastructure landscape its oversight anchor
  (PFMI adoption is DC-adjacent context: system operators must give BoU
  oversight access incl. outsourced operations).
- DO NOT register a claim from this capture; the UG data-localisation
  lead-flag from Task 74d REMAINS OPEN, instrument uncited.
- NEXT STEPS for the instrument hunt (in order of expected yield):
  (1) NPS Regulations 2021 full text via ULII (statutory instrument under
  the NPS Act 2020 - likely outsourcing/subcontracting approval clauses);
  (2) Financial Institutions Act statutory instruments list 2024-2026 (any
  new ICT/computing-facilities regs; BoU /supervision Acts & Regulations
  section is tabbed in the SPA - enumerate the tabs with agent-browser);
  (3) BoU quarterly supervision reports / annual report mention of new
  cybersecurity or ICT directives (the softpower.ug Dec 2022 story title
  "Bank of Uganda Tasks Banks to Pay Close Attention..." suggests a Dec 2022
  cybersecurity push - hunt that URL again with correct slug);
  (4) direct inquiry: BoU press office / bankofuganda.zohodesk.com portal
  (vendor claims of a central-bank hosting mandate deserve a verification
  ask regardless).
- FOUR-BASELINE DISCIPLINE: nothing numeric; n/a.
- VERDICT: reference capture, negative result + next steps. Claims: none.
- COST: zero credits (web_search x8 free, page_reader x2 free, agent-browser
  local, curl direct PDF).
