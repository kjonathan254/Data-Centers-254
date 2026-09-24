#!/usr/bin/env python3
"""
policy_upgrade_r12.py - UG-TX-C1 upgrade (editor-approved conditional on
verification, 2026-09-23).

Evidence verified this session:
  - Income Tax Act, Cap 340, s.21(1)(y) (inserted by IT (Am) Act 2008):
    10-year income tax exemption for income derived from the exportation of
    finished consumer and capital goods; 80% export condition (para (aa));
    prescribed conditions + certificate regime ((ab),(ac)).
  - Source: "Domestic Tax Laws Uganda" handbook full-text reproduction
    (Grant Thornton / former-URA consultant; ULRC authentic reprint as at
    19 Oct 2012; ModDate 2014) - T2 by provenance (non-official, transparent).
  - Operationalising SI in same capture: Income Tax (Tax Incentives for
    Exporters of Finished Consumer and Capital Goods) Regulations, 2009
    (made under s.21(1)(y) and s.164).
  - PwC Tax Summaries (current edition, T3): "A tax holiday of ten years is
    available to exporters who export at least 80% of their produce of
    finished goods" - independent corroboration.
  - Official ULII consolidation (eng@2024-12-23/source) fetch-blocked:
    curl 403 (Cloudflare) and Context.dev scrape extraction failed. Recorded.

Upgrade rationale: dataset statusVocabulary "verified" = "supported by
acceptable evidence (primary or two independent corroborating sources)".
Instrument text (via reproduction) + current independent commentary satisfy
the second arm. humanGate: AI proposes, editor approves - user approval was
explicit and conditional on verification ("Approved if you can confirm its
good information"); verification performed and documented in the capture.

Byte-stable JSON output: json.dumps(indent=2, ensure_ascii=False) + "\\n".
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DS = ROOT / "src/data/policy/policy-claims-2026-Q3.json"
SRC_TEXT = Path("/tmp/ug-ita-rgi.txt")  # pdftotext -layout of the S3 handbook PDF
CAPTURES = ROOT / "research/captures"

CAPTURE_FILE = "2026-09-23-s3-amazonaws-com-rgi-documents-0216350e05e4b5dd46a9abc9d5ce2ffe7cda0.md"
SOURCE_URL = "https://s3.amazonaws.com/rgi-documents/0216350e05e4b5dd46a9abc9d5ce2ffe7cda0610.pdf"

# ── 1. Capture file ─────────────────────────────────────────────────────────
ITA_PORTION_END = 13053  # line where "Value Added Tax Act Cap.349" section starts
text = SRC_TEXT.read_text(encoding="utf-8").split("\n")
ita_portion = "\n".join(text[:ITA_PORTION_END]).rstrip() + "\n"

verification_extract = """
## VERIFICATION EXTRACT (read and confirmed 2026-09-23)

Income Tax Act, Cap 340, s.21(1) paragraph (y) — exempt income (as reproduced
in this handbook, pp. 41–42; inserted by the Income Tax (Amendment) Act 2008):

> (y) the income of a person derived from the exportation of finished consumer
> and capital goods for a period of ten years, where the person –
>
> (i) in the case of a new investment, applies in writing to the Commissioner
> to be issued with a certificate of exemption at the beginning of his or her
> investment; or
>
> (ii) in the case of an existing investment, applies for a certificate from
> the Commissioner which is effective from 1st July 2007, and the person –
>
> (aa) exports at least 80% of his or her production of goods;
>
> (ab) has fulfilled such conditions as may be prescribed by Regulations made
> by the Minister; and
>
> (ac) has been issued with a certificate of exemption prescribed by the
> Commissioner.

Operationalising instrument (in this capture, Statutory Instruments section):
**Income Tax (Tax Incentives for Exporters of Finished Consumer and Capital
Goods) Regulations, 2009** (made under s.21(1)(y) and s.164) — Reg 5(1):
"a certificate of entitlement to exemption is valid for a period of ten years
starting from the date on which it is issued"; Reg 6(b): applicant must
"export at least eighty per cent (80%) of his or her production of finished
consumer goods and finished capital goods".

Provenance caveat (from the handbook's own Disclaimer): private reproduction
by a former URA employee / Grant Thornton consultant, "neither prepared by
Order of the Government of Uganda" nor a substitute for an official
publication; based on the Uganda Law Reform Commission reprint as at
19 October 2012. The official ULII consolidation
(https://ulii.org/akn/ug/act/1997/11/eng@2024-12-23/source) was
fetch-blocked at capture time (curl HTTP 403; Context.dev scrape extraction
failed). Independent current corroboration: PwC Tax Summaries
(https://taxsummaries.pwc.com/uganda/corporate/tax-credits-and-incentives):
"A tax holiday of ten years is available to exporters who export at least 80%
of their produce of finished goods, subject to certain conditions."
"""

fm = [
    "---",
    "captured_at: 2026-09-23T00:00:00Z  # manual capture (see tool line)",
    f"source_url: {SOURCE_URL}",
    f"final_url: {SOURCE_URL}",
    "title: The Income Tax Act, Cap. 340 (Domestic Tax Laws Uganda handbook reproduction)",
    "tool: manual curl download + pdftotext -layout local extraction (no API credits); "
    "ULII /source attempted via Context.dev scrape - extraction failed",
    "http_status: 200 (curl download of PDF)",
    "tier: 2",
    "claims: [UG-TX-C1]",
    "status: capture-pending # becomes verified ONLY after an editor reads and confirms content",
    "note: Editor gave conditional approval 2026-09-23 ('approved if you can confirm its good "
    "information'); verification performed: s.21(1)(y) ten-year holiday confirmed in reproduced "
    "statute text + 2009 SI + PwC current commentary. Full ITA portion of the handbook follows.",
    "---",
    "",
]
capture_md = "\n".join(fm) + verification_extract + "\n---\n\n# FULL ITA PORTION OF THE HANDBOOK (reproduction)\n\n" + ita_portion
out = CAPTURES / CAPTURE_FILE
out.write_text(capture_md, encoding="utf-8")
print(f"capture written: research/captures/{CAPTURE_FILE} ({out.stat().st_size/1024:.0f} KB)")

# ── 2. Dataset edits (byte-stable) ──────────────────────────────────────────
d = json.loads(DS.read_text(encoding="utf-8"))

d["sources"]["gt-ug-ita-cap340"] = {
    "label": "Income Tax Act, Cap 340 (Domestic Tax Laws Uganda handbook reproduction)",
    "tier": 2,
    "captureStatus": "captured",
    "retrievedDate": "2026-09-23",
    "url": SOURCE_URL,
    "publisher": "Grant Thornton Uganda consultant handbook (former-URA author; ULRC reprint-based)",
    "sourceType": "Full-text statute reproduction (non-official; ULRC authentic reprint as at 19 Oct 2012)",
    "captureNote": (
        "Full ITA portion captured 2026-09-23 (research/captures/" + CAPTURE_FILE + "). "
        "s.21(1)(y) (inserted by IT (Am) Act 2008): 10-year income tax exemption for income derived "
        "from the exportation of finished consumer and capital goods; 80% export condition (para (aa)); "
        "prescribed-conditions and certificate regime ((ab),(ac)). Operationalised by the Income Tax "
        "(Tax Incentives for Exporters of Finished Consumer and Capital Goods) Regulations 2009 "
        "(Reg 5(1) ten-year certificate validity; Reg 6(b) 80% export condition), included in the same "
        "capture. Official ULII consolidation (ulii.org/akn/ug/act/1997/11/eng@2024-12-23/source) "
        "fetch-blocked 2026-09-23 (curl 403; Context.dev scrape extraction failed) - captured via this "
        "reproduction; handbook disclaimer: private work, not a government publication."
    ),
}

d["sources"]["pwc-uganda-tax-summaries"] = {
    "label": "PwC Tax Summaries - Uganda corporate tax credits and incentives",
    "tier": 3,
    "captureStatus": "snippet",
    "retrievedDate": "2026-09-23",
    "url": "https://taxsummaries.pwc.com/uganda/corporate/tax-credits-and-incentives",
    "publisher": "taxsummaries.pwc.com (PwC)",
    "sourceType": "Reputable secondary (current-edition tax guide)",
    "captureNote": (
        "Snippet capture 2026-09-23 via Context.dev search result: 'A tax holiday of ten years is "
        "available to exporters who export at least 80% of their produce of finished goods, subject to "
        "certain conditions.' Current-edition corroboration of ITA Cap 340 s.21(1)(y)."
    ),
}

def iter_countries(d):
    # countries is a dict of {key: country} in this dataset
    cs = d["countries"]
    return cs.values() if isinstance(cs, dict) else cs


for c in iter_countries(d):
    for cl in c.get("claims", []):
        if cl["id"] == "UG-TX-C1":
            assert cl["state"] == "partially-verified", f"unexpected state {cl['state']}"
            cl["state"] = "verified"
            for sid in ("gt-ug-ita-cap340", "pwc-uganda-tax-summaries"):
                if sid not in cl["sourceIds"]:
                    cl["sourceIds"].append(sid)
            cl["note"] = (
                cl["note"]
                + " | r12 upgrade (editor-approved conditional on verification, 2026-09-23): Income Tax Act "
                "Cap 340 s.21(1)(y) - 'the income of a person derived from the exportation of finished "
                "consumer and capital goods for a period of ten years', with the 80% export condition "
                "(para (aa)) and the prescribed-conditions/certificate regime ((ab),(ac); inserted by IT "
                "(Am) Act 2008) - captured via a Grant Thornton/ULRC-based full-text reproduction (T2); the "
                "operationalising 2009 Regulations are in the same capture; PwC current edition (T3) "
                "corroborates the ten-year/80% terms. Verified under 'two independent corroborating "
                "sources'; the official ULII consolidation remains the confirmation target (fetch-blocked "
                "2026-09-23). The holiday is sector-agnostic statute text - any data-centre-specific "
                "treatment remains unverified."
            )
            break

d["datasetVersion"] = "policy-2026-Q3-r12"
d["generatedAt"] = "2026-09-23"

DS.write_text(json.dumps(d, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

# ── 3. Sanity print ─────────────────────────────────────────────────────────
states = {}
for c in iter_countries(d):
    for cl in c.get("claims", []):
        states[cl["state"]] = states.get(cl["state"], 0) + 1
print("datasetVersion:", d["datasetVersion"])
print("claims by state:", states, "| sources:", len(d["sources"]))
