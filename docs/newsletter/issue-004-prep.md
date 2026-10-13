# Issue 004 prep notes (working document, not the issue)

**Issue:** The Rack Report 004, the November edition, due **Monday 2 November 2026, 06:00 EAT** (monthly, first Monday; numbering ruling of 11 October 2026: Issue 003 is the October edition, so November's edition is 004). The following slot is Issue 005, Monday 7 December 2026.

**Status of this file:** editorial prep. Nothing here is published until the issue itself is written and the editor signs off. Items are candidates, each carrying its verification state; the issue ships only with figures re-verified in send week.

**Compile path (new, committed):** `docs/newsletter/templates/rack-report-print-template.html` (Issue 001/002/003 design lineage, placeholder tokens + optional photo/bar-chart/table blocks) rendered with `scripts/build_rack_report_pdf.py [--compress]`. The Issue 003 print HTML lived only in a session workspace and was lost with it; the template now closes that gap. Smoke-tested 11 October 2026 (78 tokens, 6-page A4 render verified).

---

## Candidate stream (each item: what it is, verification state, what would promote it)

### 1. CA standalone data-centre licence outcome (likely Policy Watch centerpiece)

The 30-day comment window on the proposed standalone licence category closed on or about **8 October 2026**. As verified 10 and 11 October (three free web-search sweeps), **no decision document exists yet**. The full evidence base lives in `docs/newsletter/issue-003-policy-watch-prep.md` (claim KE-LC-C3, r13/r14 chain, instrument on disk).

What would promote this to the centerpiece: the **late-October post-window probe** (Context.dev, 1 credit, budgeted in the prep doc) looking for: consultation entry removed, a decision/outcome notice, a gazette supplement, or an extension notice. If an outcome exists, register it as a new capture and likely a new claim (KE-LC-C4) per the r11-r14 precedent, then write the section. If not, the honest line is "the window closed on [date]; the Authority had not published a decision as we verified on [date]" — never speculate about internal CA timelines.

Cross-links ready: the disclosure framework article (`content/articles/kenya-data-centres-what-operators-should-disclose.md`) and the NFP/ASP carve-out question RR002 surfaced.

### 2. Africa-1 RFS watch (cable count 7 -> 8)

Africa-1 has landed at Mombasa without announcing ready for service. One RFS call moves the live cable count for the first time since 2024 (2Africa, 2024). RR002 and RR003 both pre-position this; the cable tracker verifies monthly. Promoted by: an operator or consortium RFS announcement, or a tracker re-verification finding service live.

### 3. WIOCC US$300M (AFC + Vision Invest) — registration decision due this cycle

T1 capture verified 10 October 2026 (`research/captures/2026-10-10-wiocc-300m-afc-vision-invest.md`): SSA instrument, data-centre capacity a stated priority. Registration as a reference record was deferred from the Issue 003 cycle to this one. Standing rule: the $300M stays independent of the US DFC $155M instrument (already covered in `content/articles/us-dfc-wiocc-155m-kenya-digital-infrastructure.md`); never sum without verified transaction structures.

### 4. People and market signals (captures on request)

From the Google Alerts triage (Task 102, 10 October): Cassava Technologies rehiring Dan Kwach (ex-Africa Data Centres MD East Africa) for its AI data-centre push, and Access Partnership / AfriTrade Group's approvals practice commentary (the 15 September CA-licence market commentary already feeds the disclosure article). Neither has a T1 capture yet; both need one before any RR004 paragraph.

### 5. Power ledger follow-through

Issue 003 published the 27-row source-linked power ledger (grid+backup 14, grid-only 6, redundancy-first 3, other 1, undisclosed 2; confidence High 7 / Medium 15 / Low 5). RR004 reports movement: any operator newly disclosing a PPA, renewable share or backup configuration changes the buckets, and that movement is itself the story the disclosure article argues for.

**Editor's 13 Oct morning-briefing triage (added 13 Oct):** the briefing's editorial recommendation — is power the decisive constraint on Kenya's AI ambitions? — proposes exactly this frame as a three-model comparison: grid-connected vs dedicated generation (Hercules is the case study, `content/articles/amaco-hercules-mombasa-ai-data-centre.md`) vs renewable-backed supply (Issue 003's finding stands: 0 operator-disclosed renewable PPAs as of 11 Oct). Suggested headline on file: "Kenya's AI Data-Centre Race: Who Can Secure the Power?". Verification state: all four briefing news items probed 13 Oct — sources live (AMD IR, FTI, WIOCC 200; TechTrends unreachable from this egress but covered by our own deeper article + Business Daily/Construction Review corroboration); 3 of 4 were already on site; no new Kenyan facility or capacity figure, so NO directory changes. What would promote: the same movement signals as the ledger (PPA/backup disclosures), plus any Hercules financing/equipment milestone.

### 6. DCK topic-gap explainers (pre-issue publishing candidates)

Logged in the Task 108 DCK sweep as genuine topic gaps: N+1 cooling as a failure domain, and zinc whiskers in server rooms. Either could ship as an explainer before the November send and be linked from Infrastructure Intelligence, on the RR003 pattern (UPS AI-era refresh shipped first, the issue carried the table).

### 7. Standing queues (checked every issue)

- **Q4 dataset-sync queue:** drift table lives in the offline social-pack copy; refresh `src/data/directory/current.json` re-verifications in send week.
- **3-article freshness queue:** standing AGENT_CONTEXT item.
- **Corrections log:** check `src/lib/corrections-data.ts` for any material figure changes before send.
- **iColo -> Digital Realty naming:** full rename awaits site-level rebrand evidence; watch for it this month.

### 8. The agent fleet is a data-centre tenant (Tech Desk panel candidate, added 11 Oct)

A viral architecture blueprint ("Grok Bot", X thread by @monokern, 20 Aug — triaged batch 4 in `skills/SKILL-STACK-2026-10-11.md`) pitches 24/7 autonomous agent teams running on dedicated cloud VMs: persistent browsers, cron routines, VM rebuild cycles. The demand-side infrastructure story writes itself: always-on agents are baseline compute tenants that never sleep, and that load lands in facilities like the 27 in the DC254 directory. The strongest, fully verifiable version of the panel is first-person: DC254 itself runs a small agent fleet (IndexNow submission automation, CI content gates, committed state files) — what it does while the editor sleeps, what it costs (0 credits), and what generalised agent fleets would mean for African colocation demand.

Verification state and hard caveat: the product claims in the thread are UNVERIFIED (x.com blocks unauthenticated probes at 0 credits); the panel must present the architecture pattern, attribute product claims to the thread, and ground every number in DC254's own repo/directory. Promoted by: editor confirms the panel for RR004; otherwise it can ship as a DCK explainer pre-issue on the RR003 pattern.

### 9. AMD Helion rack-scale agentic AI compute (global trend monitor, added 13 Oct)

AMD released Helion 12 October 2026 (T1: `https://ir.amd.com/news-events/press-releases/detail/1301/introducing-amd-helion-agentic-ai-compute-at-rack-scale`, probed HTTP 200 13 Oct): open rack-scale design for agentic AI workloads, CPU-only and combined CPU/GPU configurations, air- and liquid-cooling options, partner configurations planned for November 2026 availability. Fits the RR003 pattern of covering global hardware shifts as trends to monitor (800 V DC / BBU note: "no Kenyan operator has announced" — same honest line applies: no African deployment evidence). Editorial use: feeds the AI-ready physical-requirements explainer thread (rack density, cooling, power delivery) and pairs with the power three-model frame in candidate 5. Verification state: T1 verified; no capacity/price figures asserted by DC254. What would promote: a named African deployment, or editor folds it into the AI-ready explainer.

---

## Before Issue 004 (REQUIRED checklist)

1. **Late-Oct post-window probe (1 credit, budgeted):** re-capture ca.go.ke/open-consultations per the Issue 003 prep doc route note (clean URL works via Context.dev; /index.php/ paths stay JS-challenge-walled).
2. **Free outcome sweeps (web_search xN):** "CA Kenya data centre licence decision October 2026", gazette terms, TESPOK / industry association responses.
3. **Outcome handling:** if an outcome exists, new capture + likely KE-LC-C4 registration, update framing, only then write the section; if not, the dated honest line.
4. **Send-week figure re-verification** against `src/data/directory/current.json` (27 Kenya records / 20 operational / 10.5 MW published live x8 / 42.9 MW designed / 230 MW pipeline / 7 cables) and the cable tracker.
5. **Editor humanGate** on the final Policy Watch text and the issue's headline finding, per standing protocol.
6. **Compile:** fill the committed template from the issue master doc (`docs/newsletter/rack-report-issue-004.md`), render with `scripts/build_rack_report_pdf.py`, ghostscript-compress, commit the PDF to `public/reports/rack-report-issue-4.pdf`.
7. **Archive block:** /rack-report updated (004 featured LATEST, 003+002+001 PAST, 005 next-issue slot for Monday 7 December 2026), sample-issue link moved to 004.
8. **Gates + CI:** article_validator, validate_policy, validate_jsonld, audit_assets, double-green CI, production byte-probe of the new PDF.
