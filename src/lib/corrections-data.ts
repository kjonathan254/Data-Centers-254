/**
 * Canonical corrections & update log.
 *
 * Single source of truth shared by /corrections (the public product) and
 * /methodology (the update log section). Every material correction,
 * reclassification or dataset change is appended here with an ISO date,
 * including our own errors, because a directory that never admits mistakes
 * is telling you it never checks.
 */
export interface CorrectionEntry {
  /** ISO date (YYYY-MM-DD) the change was published. */
  date: string;
  /** One-line summary of what moved. */
  summary: string;
  /** The dated specifics. */
  changes: string[];
}

export const CORRECTIONS_EMAIL = "elmaccommunicationslimited@gmail.com";

/** How fast we commit to act, stated identically on /corrections and /methodology. */
export const CORRECTIONS_SLA = {
  acknowledgementHours: 48,
  fixWorkingDays: 5,
};

export const correctionsLog: CorrectionEntry[] = [
  {
    date: "2026-09-25",
    summary: "Second audit pass: Kenya scoping on the annual review and research hub cards; the Brief/01 PDF snapshot stamped; directory sentence order clarified.",
    changes: [
      "Annual review (research/state-of-kenyan-data-centres-2026): the headline KPI counted all 31 directory records (22 operational) under a review titled \u201cState of Kenyan Data Centres\u201d. It now reads 27 facilities tracked, 20 operational in Kenya. The carrier-neutral footnote and the pipeline-to-watch grid are Kenya-scoped too, so the 2 regional under-construction reference records no longer appear as Kenyan pipeline, and the intro states the 27 + 4 split explicitly.",
      "Research hub: the Brief/01 card carried the 21 September snapshot figures (26 facilities, 186 MW pipeline); it now shows the current dataset (27 facilities, 230 MW pipeline). \u201c122 top networks\u201d and \u201c8/20 carrier-neutral\u201d were re-verified against the dataset and are unchanged.",
      "Brief/01 PDF: the downloadable edition was minted 21 September from an earlier snapshot (26 facilities, 186 MW announced) with no marker separating it from the live page it is an edition of. The cover now carries a visible data-snapshot stamp pointing to the live figures; a full re-mint of the brief is queued.",
      "Directory intro: reordered the sentence so the city split (Nairobi, Mombasa, the rest) attaches to the 27 Kenyan facilities rather than reading as a split of the 20 operational \u2014 in both the meta description and the body copy. The numbers themselves were already correct.",
      "Megawatt figures cross-checked and confirmed as three different labelled metrics, not contradictions: 10.5 MW published in-service IT load, 42.9 MW built (designed) capacity of live sites, 230 MW announced pipeline, 272.9 MW total tracked supply. Also re-verified live: sitemap.xml (HTTP 200, 179 URLs), /infrastructure/map (200), /api/directory (200), unique titles on methodology/corrections/editorial-policy.",
      "Advisory, owner decision pending (not a factual error): the site runs on a vercel.app subdomain, the contact address is a gmail inbox, and the brand mixes \u201ccenters\u201d (domain) with \u201ccentres\u201d (editorial style).",
    ],
  },
  {
    date: "2026-09-24",
    summary: "Scope reconciliation on the homepage directory band and FAQ; stale snapshot count removed from the annual review metadata.",
    changes: [
      "Homepage \u201cThe DC Directory\u201d band: the status line under \u201cEvery known data-centre facility in Kenya\u201d was counting all 31 tracked records (22 operational \u00b7 5 under construction \u00b7 1 committed \u00b7 3 early stage), which includes 4 East African reference records. It is now scoped to Kenya as the heading promises: 20 operational \u00b7 3 under construction \u00b7 1 committed \u00b7 3 early stage (27 facilities).",
      "FAQ \u201cHow many data centres does Kenya have?\u201d: the answer said \u201c31 facilities across Kenya, of which 22 operational\u201d \u2014 both figures are region-wide (31 records and 22 operational include 2 operational records in Kampala). It now reads: 31 records = 27 Kenyan facilities + 4 East African reference facilities, 20 of them operational in Kenya.",
      "Annual review metadata description dropped its hardcoded \u201c26 tracked facilities\u201d (a superseded snapshot count); the page body already states it draws live from the full register.",
      "Audited and confirmed correct, no change needed: sitemap.xml (live HTTP 200, 179 URLs), /infrastructure/map (live HTTP 200), /api/directory (live HTTP 200), unique metadata titles on methodology/corrections/editorial-policy, and the directory page's internally consistent 27/20/19/4 arithmetic.",
    ],
  },
  {
    date: "2026-09-18",
    summary: "Homepage stat strip made fully data-driven; research page listing.",
    changes: [
      "Fixed the homepage stat strip: \u201cSubsea cables live\u201d now reads directly from the verified cable dataset (7 live of 9 systems) instead of a hardcoded number, the explainer count updates itself from the article index (97), and the verification stamp moved to September 2026.",
      "Listed the Rack Report PDF editions (Issues 001 and 002) on the Research page alongside the report PDFs.",
    ],
  },
  {
    date: "2026-09-08",
    summary:
      "Directory sweep: 10 facilities added, 2 removed, 2 reclassified, and unsourced capacity figures withdrawn.",
    changes: [
      "Added the four iColo (Digital Realty) facilities (NBO1, NBO2, MBA1, MBA2) previously missing despite MBA1 being the most interconnected building on the Kenyan coast (94 networks on PeeringDB).",
      "Added PAIX Nairobi (Britam Tower), Safaricom Thika, Safaricom Red Hill (Limuru), Telkom Milimani, Telkom Telephone House (Nairobi and Mombasa), Konza National Data Centre, SEACOM Mombasa cable landing station, and SimbaNET Nairobi.",
      "Removed Wingu Nairobi after checking the operator's own website, which names only Djibouti, Ethiopia and Tanzania, Wingu does not operate in Kenya, despite appearing in many round-ups (including ours previously).",
      "Removed Africa Data Centres Mombasa: no operator page, no register entry, and no independent evidence supports it.",
      "Reclassified ADC Nairobi 2 as under construction, ADC's own site lists only NBO1 in Nairobi, and no source confirms the January 2023 expansion completed.",
      "Withdrew the capacity figures previously shown for Raxio Nairobi and reclassified it as early stage, the facility does not appear on the PeeringDB register (checked 8 Sep 2026) and no operator page confirms an opened Nairobi site.",
      "Updated iColo NBO2 for its formal launch on 7 September 2026 (Capital FM / Digital Realty), still ramping on interconnection.",
      "Cross-checked every PeeringDB-registered Kenyan facility (14 records fetched 8 Sep 2026) and added per-entry network and exchange counts.",
    ],
  },
];

/** "2026-09-18" -> "18 September 2026" (deterministic, no locale drift). */
export function formatCorrectionDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${parseInt(m[3], 10)} ${months[parseInt(m[2], 10) - 1]} ${m[1]}`;
}

/** Newest correction date, for deterministic sitemap lastModified values. */
export function latestCorrectionDate(): string | null {
  const dates = correctionsLog
    .map((c) => c.date)
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort();
  return dates.at(-1) ?? null;
}
