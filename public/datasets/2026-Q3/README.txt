DC254 Dataset Bundle - 2026-Q3 edition
=======================================
Publisher: Data Centre 254 (https://data-centers-254.vercel.app)
Snapshot of: 2026-Q3 (taken 2026-09-19)

WHAT THIS IS
The quarterly, frozen dataset behind DC254's State of the Market report:
31 facility records (18 operators) plus the subsea cable,
power tariff and licensing trackers. The live directory keeps moving at
/directory; this bundle is the citable edition for the quarter.

FILES
- facilities-2026-Q3.csv: Facility-level records: status, capacity, operator, verification date, confidence.
- operators-2026-Q3.csv: Operator records with parent company and HQ country.
- subsea-cables-2026-Q3.csv: Submarine cable systems at Kenyan landings: status, RFS, owners, sources.
- power-tariffs-2026-Q3.csv: Power tariff benchmarks with basis labels (published / DC254 estimate / reported).
- licensing-2026-Q3.csv: Licensing regimes: NFP-T2, proposed standalone licence, ODPC obligations.
- README.txt: Data dictionary, confidence grades and citation guidance.

CONFIDENCE GRADES
High   = operator-confirmed (primary operator page or announcement)
Medium = single-source or mixed evidence; the source is named per row
Low    = fragmentary; figures are estimates and treated as signals only

FIELD NOTES
- itLoadMw        : verified in-service IT load where the operator publishes it.
- totalCapacityMw : designed capacity (operational) or developer-announced
                    capacity (pipeline stages). These are never blended.
- carrierNeutral  : TRUE only where operator-stated or independently evidenced;
                    blank means unknown, not negative.
- lastVerified    : YYYY-MM month the record was last re-verified against
                    sources. A monthly sweep and quarterly full re-verification
                    are promised on /methodology.

CITATION
CC BY 4.0. Cite as: Data Centre 254, 'DC254 Dataset Bundle, 2026-Q3 edition', released <date>, https://data-centers-254.vercel.app/research/state-of-the-market-2026-q3.

CORRECTIONS
Found something wrong? Corrections are a product, not a scandal:
https://data-centers-254.vercel.app/corrections
