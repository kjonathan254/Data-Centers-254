# DataCentre254 Research & Verification Standard

**Internal working document · v1.0 · 18 September 2026 · Owner: Kevin Jonathan Otieno**

This is the Phase 0 foundation artifact. Every person (or tool) researching,
writing, or updating anything for DataCentre254 works to this standard. The
public-facing summary of it ships inside every Rack Report ("Editor's Note")
and on /methodology.

---

## 1. Editorial mission

One sentence: **be the default, citable source for Kenya data centre facts.**
We publish fewer, stronger pieces. We would rather verify one number than
aggregate ten unverified ones.

## 2. Geographic scope

Kenya is the core beat. East Africa is in scope when Kenya-connected
(submarine cables landing at Mombasa, regional operators expanding into
Nairobi, power and policy with cross-border effect). Continental and global
stories are in scope only through their Kenya angle.

## 3. Sectors covered

Data centres (colocation, hyperscale, edge) · power and energy for digital
infrastructure · connectivity (subsea, terrestrial fibre, IXPs) · cloud and
AI compute · investment and deals · policy and regulation (CA, ODPC, ICT
ministry, county level where it touches builds).

## 4. Source standard

- **Every fact carries its source and publication date.** In text, not
  footnotes buried at the bottom: `(Reuters, 16 September 2026)`.
- Acceptable sources, in order of trust: (1) regulator/operator filings and
  disclosures, (2) dated reporting from named outlets, (3) trade press,
  (4) conference statements **only when attributed on the record**.
- Single-source numbers above ~$100M or ~50MW are tagged in copy as
  reported/announced, never stated as settled fact. Flag them in the
  research log for a second source.
- Press releases are leads, not sources: verify against independent
  reporting or primary filings before use.
- No AI-generated imagery. No synthetic quotes. No anonymous "sources say"
  without on-record anchoring.

## 5. Verification methodology

- **Announced is not open.** A plan is labelled a plan until there is a
  signed contract, financing close, commissioning certificate, or live
  service. Headline figure and status ship in the same breath.
- **Confidence tiers** for every facility record in the directory:
  `High` (two+ independent sources or primary disclosure),
  `Medium` (single credible dated source), `Low` (reported, unconfirmed).
  Where the UI shows verification, it must reflect the tier — never render
  `Low` as a blanket "Verified" badge.
- **Verification dates, not vibes.** `lastVerified` is the month a human
  re-checked the claim, and it is re-checked at least every 6 months.
- **Naming discipline.** Before publishing any facility name, check for
  collisions in the directory (e.g. Africa Data Centres "NBO2" vs iColo
  "Nairobi Two (NBO2)"). Ambiguity is resolved explicitly in copy.
- **Corrections are non-negotiable.** Errors are corrected openly and
  quickly, with the fix dated. A correction beats a deletion. Zero
  outstanding corrections is a standing KPI.
- Prefer being early-and-right over being first. If we cannot verify, we say
  what we know, what we do not, and what would settle it.

## 6. Core data fields (facility records)

Facility name · operator · location · status (announced / under construction
/ commissioned / live) · capacity in MW (with "design" vs "commissioned"
distinction) · tier when verified · power detail · connectivity detail ·
ownership · source list with dates · confidence tier · lastVerified month.

## 7. Naming convention

`Operator + Site + City` internally (e.g. `raxio-nairobi-1`); public names
follow the operator's own branding, with disambiguation on first mention
where collisions exist. Slugs are lowercase, hyphenated, stable once
published (301 before any slug change).

## 8. Internal research log

Every research session appends to the shared worklog: date, what was
checked, sources with dates, what changed, what remains open. If it is not
in the log, it did not happen.

---

*Adopted 18 September 2026. This standard is versioned; changes are dated in
the worklog. The Rack Report and the directory are audited against this
document, not against memory.*
