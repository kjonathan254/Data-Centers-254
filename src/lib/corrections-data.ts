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
