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
    date: "2026-09-26",
    summary:
      "Published the Dangote Lamu power-plant analysis (Energy cluster) with staged-announcement sourcing; registered two reference records in the policy dataset (bumped to r16).",
    changes: [
      "New article /articles/dangote-lamu-refinery-power-plant-data-centres: covers the 26 September 2026 announcement of a 1,000 MW power plant at the proposed Lamu refinery with ~500 MW offered to the Kenyan government. The article stages every figure as an announcement, flags the refinery-capacity discrepancy across outlets (roughly 220,000 to 700,000 barrels per day as reported), establishes from The Africa Report that the plant is LNG-fired rather than renewable, sets the scale against the directory's live figures (42.9 MW built capacity, 10.5 MW published IT load, 230 MW pipeline, ~3,000 MW installed grid capacity), and records the Lamu coal-plant precedent (1,050 MW Amu Power licence revoked 2019) as part of the project's risk profile.",
      "Policy intelligence source registry: added the Kenyans.co.ke report (full text captured) and The Africa Report LNG reporting (snippet capture, paywalled) as tier-2 reference records with explicit no-claim-yet notes; candidate background evidence for the energy-electricity pillar. Dataset bumped from r15 to r16.",
      "Imagery: the article uses photographs of the Ruto-Dangote walkthrough at the Lekki refinery (supplied by the editor and uploaded to the repository) for the hero and announcement sections, an explicitly labelled artistic impression of the proposed Lamu layout flagged as promotional material, and existing verified infrastructure photography for the grid and geothermal sections. No AI-generated imagery was retained for this article.",
    ],
  },
  {
    date: "2026-09-26",
    summary:
      "Fifth audit pass: MTN/Africa Data Hub announcement added to the policy intelligence source registry (dataset bumped to r15) and the article's IT News Africa citation canonicalised; crawler-report triage confirmed closed.",
    changes: [
      "Policy intelligence source registry: added the IT News Africa report of the MTN Digital Infrastructure / Africa Data Hub Holding Limited partnership (31 Aug 2026, full text captured 26 Sep) as a tier-2 reference record. It is a commercial market development, not a policy claim, so it is registered with an explicit note that it supports no claim yet and is candidate background evidence for the ai-digital-policy and regional-frameworks pillars. Dataset bumped from r14 to r15.",
      "MTN analysis article (mtn-africa-data-hub-ai-data-centres): the IT News Africa citation used the publisher's older /2026/08/ path, which only resolves via redirect; updated to the canonical /enterprise/digital-transformation/ path and verified live (HTTP 200).",
      "Re-verified the article against the captured source text: every material fact (Africa Data Hub Holding Limited vehicle, Bayobab's shareholder role, the Mrou\u00e9 and Al Ashram quotes, the South Africa and Nigeria initial focus, Ambition 2030 framing) was already present and accurate; no content change was needed.",
      "Re-checked the external crawler report's remaining items against the live site and the four earlier audit passes: the two genuine number-consistency findings were already fixed in passes 2-4, and the rest were crawler artefacts (guessed routes, XML rendering failures) confirmed with live HTTP checks recorded on 25 September.",
    ],
  },
  {
    date: "2026-09-26",
    summary: "Fourth audit pass: FAQ page answers re-scoped to Kenya where the question is Kenya-scoped, plus copy fixes.",
    changes: [
      "FAQ \u201cHow much new data centre capacity is coming to Kenya?\u201d: the 232 MW figure summed announced pipeline across all tracked records including the East African reference builds; the question asks about Kenya, so the answer is now the Kenya-scoped 230 MW.",
      "FAQ \u201cWhich Kenyan data centres are AI-ready?\u201d: read \u201c5 of the 31 tracked facilities\u201d, using the full register as denominator for a Kenya-scoped question; now \u201c5 of the 27 Kenyan facilities in the directory\u201d.",
      "Directory page: fixed a stray space before the comma in \u201cfree to download and cite\u201d.",
      "DigitalOcean analysis article: cross-reference to the market-numbers explainer updated from \u201c26 facilities\u201d to \u201c27 verified facilities\u201d following the 19 September directory update, and the article's updated_date moved accordingly.",
    ],
  },
  {
    date: "2026-09-25",
    summary: "Third audit pass: the chatbot's curated answers were still quoting superseded numbers, and the directory meta description still showed a city split that did not sum.",
    changes: [
      "Chatbot FAQ \u201cHow many data centres does Kenya have?\u201d: said \u201c16 tracked data centre facilities, of which 12 are operational\u201d, a superseded snapshot from an earlier register. It now derives the answer from the live directory like the FAQ page does: 27 verified Kenyan facilities, 20 operational, plus 4 East African reference records (31 tracked).",
      "Chatbot FAQ \u201cWhich Kenyan data centres are AI-ready?\u201d: said \u201c12 of the 16 tracked facilities\u201d. The AI-ready flag is held by 5 of the 27 tracked Kenyan facilities; the answer is now dataset-derived.",
      "Chatbot FAQ \u201cWho operates Kenya's data centres?\u201d: said \u201c12 tracked operators\u201d. The directory tracks 18; the answer is now dataset-derived.",
      "Chatbot FAQ \u201cHow much new data centre capacity is coming to Kenya?\u201d: said \u201croughly 171 MW\u201d and named the Microsoft\u2013G42 campus as part of it. The announced pipeline is 230 MW (77 MW of it under construction across iXAfrica NBOX1.2, Africa Data Centres Nairobi 2 and Nxtra by Airtel Tatu City), and G42's own directory record warns the project has stalled on grid power constraints, so the answer now separates the two and derives the total from the dataset constant.",
      "Chatbot Microsoft\u2013G42 fact chunk: described the project as \u201cpending grid capacity\u201d and \u201cthe single largest project in Kenya's data centre pipeline\u201d. It now carries the same caveat as the directory record: no site confirmed, stalled on grid power, treat the 100 MW as an announcement, not bankable pipeline.",
      "Chatbot FAQ \u201cHow many submarine cables\u201d: kept 7 in service (re-verified against the dataset) but now states 10 systems tracked and names Daraja and LuLu as in development; \u201cawaits full service\u201d tightened to \u201cawaits ready-for-service\u201d.",
      "Chatbot FAQ \u201cDo you need a licence...\u201d: refreshed with the September 2026 CA standalone-licence consultation (tiered annual fees to KSh 100,000 or 0.4 percent of turnover, whichever is higher, submissions due on or about 8 October 2026 to datacentres@ca.go.ke) and now links Policy Intelligence alongside the explainer.",
      "Directory meta description: the 25 Sep pass log said the city split was fixed \u201cin both the meta description and the body copy\u201d, but only the body was reordered; the meta description still read 27 facilities with a 19 + 4 city split that does not sum. It now reads the full split (19 Nairobi, 4 Mombasa, and the remaining 4 named by city), computed from the dataset alongside the body copy so the two can never drift or fail to sum again.",
      "Also re-verified live: every internal link on /infrastructure/map resolves HTTP 200 (the crawler's ten guessed routes never existed), robots.txt \u201cDisallow: /api/\u201d affects only search indexing while the /directory CSV link keeps working for users, and /api/directory/csv serves HTTP 200.",
    ],
  },
  {
    date: "2026-09-25",
    summary: "Second audit pass: Kenya scoping on the annual review and research hub cards; the Brief/01 PDF re-minted to the current dataset; directory sentence order clarified.",
    changes: [
      "Annual review (research/state-of-kenyan-data-centres-2026): the headline KPI counted all 31 directory records (22 operational) under a review titled \u201cState of Kenyan Data Centres\u201d. It now reads 27 facilities tracked, 20 operational in Kenya. The carrier-neutral footnote and the pipeline-to-watch grid are Kenya-scoped too, so the 2 regional under-construction reference records no longer appear as Kenyan pipeline, and the intro states the 27 + 4 split explicitly.",
      "Research hub: the Brief/01 card carried the 21 September snapshot figures (26 facilities, 186 MW pipeline); it now shows the current dataset (27 facilities, 230 MW pipeline). \u201c122 top networks\u201d and \u201c8/20 carrier-neutral\u201d were re-verified against the dataset and are unchanged.",
      "Brief/01 PDF: the downloadable edition was minted 21 September from an earlier snapshot (26 facilities, 186 MW announced) with no marker separating it from the live page it is an edition of. It was first stamped with a visible data-snapshot note, then fully re-minted the same week from the current dataset: cover bullets, the Section 1 stat strip and Figure 1 now read 27 facilities, 42.9 MW built, 230 MW announced and 10.5 MW published IT load, with the under-construction stage restated as 77 MW across three projects (iXAfrica NBOX1.2, Africa Data Centres Nairobi 2, Nxtra by Airtel Tatu City). The temporary stamp is retired and the cover states the dataset verification month (2026-09) like the live page. Section 2 figures (122 networks, 8 of 20 carrier-neutral) were re-verified and are unchanged.",
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
