# Issue 003 Policy Watch — prep notes (working document, not the issue)

**Issue:** The Rack Report 003, due Monday 2 November 2026, 06:00 EAT (monthly,
first Monday). This file pre-loads the Policy Watch section with the one story
already fully evidenced: the CA standalone data-centre licence consultation
(claim KE-LC-C3), whose 30-day comment window closes on or about **Thursday
8 October 2026**.

**Status of this file:** editorial prep. Every figure below is already T1-
captured; nothing here is published until the issue itself is written and the
editor signs off. The post-window outcome is a REQUIRED re-verification step
before Issue 003 ships (see "Before Issue 003" checklist).

---

## The story (as verified to date)

On **8 September 2026** the Communications Authority of Kenya published a
public notice opening a **30-day comment window** on a proposal to introduce a
**standalone data centre licence category** for co-location data centre
operators — replacing the current Network Facilities Provider–Tier 2
treatment. The window closes on or about **8 October 2026** (the notice counts
"thirty (30) days from the date of publication"; no calendar date is printed
on the page).

**Rationale (CA's own words, via the captured instrument):** "provide
regulatory clarity, enhance visibility over data centre operations, support
investment in digital infrastructure, and align Kenya's framework with
proportionate approaches adopted in comparable jurisdictions."

**Scope:** "entities that provide colocation data centre services, including
the attendant supporting services."

**Basis (CDH legal analysis):** co-location operators provide hosting, power,
cooling and storage infrastructure rather than telecommunications services,
so NFP-tier treatment fits poorly.

**Submission channels (per the captured page, unchanged 24 Sep → 6 Oct):**
- Post/hand delivery: Director General, CA, P.O. Box 14448-00800, Nairobi
- Electronic form: forms.cloud.microsoft/r/uB4Z5GktUB
- Email: datacentres@ca.go.ke
- Instrument: "Public Consultation on Data Centres September 2026" PDF on
  ca.go.ke

**Single-source detail (w.media, T3):** implementation planned for the
2027/2028 financial year — keep attributed, never state unattributed.

## Verification trail (all on disk)

| Date | Artifact | What it established |
|------|----------|---------------------|
| 2026-09-24 | research/captures/2026-09-24-ca-go-ke-open-consultations.md | T1: instrument text held in full (r14 upgrade); page carries the notice + channels |
| 2026-10-04 | research/captures/2026-10-04-ca-go-ke-open-consultations.md | T1 re-verification pre-Issue 002: still listed open |
| 2026-10-06 | research/captures/2026-10-06-ca-go-ke-open-consultations.md | T1 window-close probe: STILL LISTED OPEN two days before close; unchanged language/channels; no outcome published |
| registry | src/data/policy/policy-claims-2026-Q3.json → sources.ca-open-consultations-2026 | retrievedDate synced to 2026-10-06; KE-LC-C3 note carries the re-verification trail |

Claim state: KE-LC-C3 **verified** (r13/r14 chain, two independent
corroborating sources + instrument on disk). The re-verification captures sit
capture-pending per standing humanGate — the fact they re-confirm is already
verified; an outcome would be a NEW fact requiring fresh registration.

## Issue 003 framing (draft language — not final)

The window on Kenya's first standalone data-centre licence closed this month
(on or about 8 October). What Issue 003 should report — and what we cannot
report until the CA moves: whether the Authority signalled any change between
proposal and decision (scope, fees, timeline), and what the licence would mean
for the 20 operational facilities already tracked (the map's own register).

Angles worth one paragraph each, only if evidenced by the outcome:
1. **The licence map fact**: every co-location facility in the directory
   (operational or pipeline) becomes a licensing counterparty — the directory
   is the natural cross-reference.
2. **Timeline honesty**: w.media's 2027/28 FY implementation detail stays
   attributed; if the CA's decision notice contradicts it, the divergence goes
   in the note.
3. **Comparative frame**: Kenya joins a small group of African states with a
   DC-specific licence class — do not name others without captures.

## Before Issue 003 (REQUIRED checklist)

1. **Post-window probe (late Oct, 1 credit):** re-capture
   ca.go.ke/open-consultations. Outcomes to look for: consultation entry
   removed (window closed), a decision/outcome notice, a gazette supplement,
   or an extension notice. ca.go.ke route note: the clean URL
   /open-consultations works via Context.dev; /index.php/ paths stay
   JS-challenge-walled.
2. **Search for the outcome document** (web_search xN, free): "CA Kenya data
   centre licence decision October 2026", "Communications Authority data
   centre licensing gazette", sweeps of TESPOK/industry association responses.
3. **If an outcome exists:** register it as a new capture + likely a new claim
   (KE-LC-C4) per the r11-r14 precedent; update this file's framing; only then
   write the section.
4. **If no outcome:** the honest line is "the window closed on [date]; the
   Authority had not published a decision as we verified on [date]" — never
   speculate about internal CA timelines.
5. Editor humanGate on the final Policy Watch text, per standing protocol.

## Related open items (not part of this section)

- KE-LC-C3 re-verification captures (10-04, 10-06) remain capture-pending
  until the editor reads them — standing humanGate.
- Africa-1 RFS watch: one call moves the live cable count 7 → 8; Issue 002
  and the 6 Oct carousel both pre-position this.
- Regional IXP figures (TIX/UIXP/RINEX/ET-IXP) on the map carry unverified
  old "peak" numbers — follow-up T1 pass via ISOC Pulse per-IXP pages.
