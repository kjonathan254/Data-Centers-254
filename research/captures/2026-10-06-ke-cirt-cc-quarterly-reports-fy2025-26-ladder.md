---
captured_at: 2026-10-06T18:20:00Z
source_url: https://ke-cirt.go.ke/quarterly-reports/
final_url: https://ke-cirt.go.ke/wp-content/uploads/
title: "National KE-CIRT/CC Quarterly Cyber Security Reports (T1 PDF series): FY 2025/26 quarter-by-quarter threat ladder that sums to the announced 11.1 billion, plus CSOC/CII regulatory context"
tool: curl (ke-cirt.go.ke direct fetch, no challenge) + pdftotext extraction of five official bulletins
http_status: 200
tier: 1
claims: []
status: capture-pending # becomes verified ONLY after an editor reads and confirms content
note: Resolves the RECONCILIATION FLAG filed in research/captures/2026-10-06-ca-linkedin-ke-cirt-fy2025-26-annual-cyber-threats.md - the annual 11.1 billion IS the sum of the four quarterly bulletins (spike quarter Oct-Dec 2025 at +441.27% explains the apparent mismatch with the flat quarterly run-rate). PDFs archived in sandbox tmp/ (2.0-2.9 MB each); zero Context.dev credits spent (ke-cirt.go.ke serves 200 to curl, unlike ca.go.ke).
---

## What this capture resolves

The 6 Oct 2026 CA LinkedIn announcement (11.1 billion detected threats, FY
2025/26, +29.0% YoY; 83.1 million advisories, +60.8% YoY) could not be
reconciled with the site's quarterly series at capture time: Q3 2025 (Jul-Sep,
the FIRST quarter of FY 2025/26) was 842 million, and four quarters at that
run-rate totals ~3.4 billion, not 11.1 billion.

Resolution: the KE-CIRT/CC quarterly series is EXTREMELY spiky, and the annual
figure is the sum of the four quarterly bulletins. Full T1 ladder below,
extracted from the regulator's own PDFs (ke-cirt.go.ke hosts the complete
series; ca.go.ke remains challenge-blocked for curl but ke-cirt.go.ke does
not challenge).

## Source documents (all T1, PDF, fetched 2026-10-06)

Quarterly reports index: https://ke-cirt.go.ke/quarterly-reports/

1. Q4 FY2024/25 (Apr-Jun 2025): .../uploads/2025/07/2024-25-Q4-Cyber-Security-Report.pdf (20pp)
2. Q1 FY2025/26 (Jul-Sep 2025): .../uploads/2025/10/2025-26-Q1-Cyber-Security-Report.pdf (20pp)
3. Q2 FY2025/26 (Oct-Dec 2025): .../uploads/2026/01/2025-26-Q2-Cyber-Security-Report.pdf
4. Q3 FY2025/26 (Jan-Mar 2026): .../uploads/2026/04/2025-26-Q3-Cyber-Security-Report.pdf (42pp; listed
   on the index page? NOT YET - the index ends at the 2026/01 Q2 file; the Q3
   and Q4 PDFs were located by URL pattern extrapolation and both return 200)
5. Q4 FY2025/26 (Apr-Jun 2026): .../uploads/2026/07/2025-26-Q4-Cyber-Security-Report.pdf (20pp)

## The FY 2025/26 threat ladder (verbatim stat blocks, pdftotext)

Each bulletin carries a "Cyber Threat Roundup Landscape" stat block titled
"Total Cyber Threats Detected":

- Q1 Jul-Sep 2025: **842,320,667** (an 81.64% DECREASE from Apr-Jun 2025)
- Q2 Oct-Dec 2025: **4,559,229,985** (a 441.27% INCREASE - the spike quarter)
- Q3 Jan-Mar 2026: **3,367,113,840** (a 26.15% decrease)
- Q4 Apr-Jun 2026: **2,355,938,192** (a 30.03% decrease)
- SUM: 842,320,667 + 4,559,229,985 + 3,367,113,840 + 2,355,938,192 =
  **11,124,602,684** = the announced "11.1 billion". (kenyans.co.ke printed
  11,124,632,684; the regulator's own four stat blocks sum to ...602,684 -
  a 30,000 difference in their piece, use the T1 sum or the rounded 11.1B.)

Prior-year anchor, Q4 FY2024/25 (Apr-Jun 2025): **4,586,682,277**
(an 80.70% increase from Jan-Mar 2025). Consistency check: announced +29.0%
YoY implies FY 2024/25 total = 11,124,602,684 / 1.29 = 8,623,xxx,xxx ≈ 8.62
billion, matching the secondary figure in circulation (8.62B).

## Advisories ladder (FY 2025/26 announced total: 83.1 million, +60.8%)

- Q4 FY2024/25 (Apr-Jun 2025): "over 17 million" (17,253,1xx per Q1 report
  fragment; rounded 17M)
- Q1 FY2025/26: "over 19 million" (+15% vs previous)
- Q2 FY2025/26: **21,815,814** (+9%)
- Q3 FY2025/26: **20,581,754** (-5%)
- Q4 FY2025/26: **20,748,489** (+0.81%)
- Sum ≈ 82.9-83.1M depending on the exact Q1 value (announced: 83.1M, +60.8%
  vs FY 2024/25 ≈ 51.7M derived). The LinkedIn commenter's "20.7 million
  advisories" = the Q4 FY2025/26 quarterly figure (20,748,489), NOT annual.

## Q4 FY2025/26 category breakdown (Apr-Jun 2026, verbatim from the landscape chart)

- System Attacks: 2,254,287,819 (the bulk of the quarter's 2.36B)
- Malware Attacks: 58,997,257
- Brute Force Attacks: 24,243,919
- Web Application Attacks: 17,406,495 (+43.68% vs previous quarter; "targeted
  at the critical information infrastructure sector. Government systems and
  Internet Service Providers (ISPs) constituted the primary targets")
- Distributed Denial of Service Attacks: 819,325
- Mobile Application Attacks: 183,377

Report attributes the threat volume "largely [to] inadequate system patching,
insufficient user awareness of phishing and other social engineering attacks,
and the increasing exploitation of AI technologies by malicious actors".

## Regulatory / infrastructure context (verbatim from Q4 FY2025/26 bulletin)

"Following the enactment of the Computer Misuse and Cybercrime (Critical
Information Infrastructure and Cybercrime Management) Regulations in 2024,
the role of the Authority has been enhanced to include the establishment and
operation of the Cyber Security Operations Centre (CSOC) for the ICT and
Telecommunications Sector."

The National KE-CIRT/CC "detects, prevents and responds to various cyber
threats targeted at the country on a 24/7 basis" (ke-cirt.go.ke front page).

## Consequences for the site

1. Task 83 reconciliation flag: RESOLVED. The LinkedIn annual figure and the
   site's quarterly series are the same accounting; no correction needed to
   any existing article (842M/840M/1.1B figures all stand).
2. The editor's commissioned article ("What does 11.1 billion cyber threats
   mean for digital infrastructure?") can carry the full ladder with exact
   T1 sourcing: announcement + four bulletins + the spike quarter narrative.
3. The freshness upgrade for the three security articles (Task 83
   disposition) is now unblocked: the FY figure can be added WITH its basis.
