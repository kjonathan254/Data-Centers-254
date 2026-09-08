export interface ConnectivityProvider {
  name: string;
  type: string;
}

export interface Cert {
  certification: { name: string; type: string };
}

export interface Operator {
  id: string;
  name: string;
  slug: string;
  type: string;
  parentCompany: string | null;
  hqCountry: string;
  websiteUrl: string | null;
}

/**
 * Investment-standard supply pipeline staging (mirrors the language used by
 * global market trackers): built capacity flows from Live through Under
 * Construction (financed, build underway), Committed (land/funding secured,
 * pre-build) and Early Stage (announced intent) before it reaches the grid.
 */
export type FacilityStatus =
  | "Operational"
  | "Under Construction"
  | "Committed"
  | "Early Stage";

export const STATUS_ORDER: FacilityStatus[] = [
  "Operational",
  "Under Construction",
  "Committed",
  "Early Stage",
];

/** A citable source behind a facility record. */
export interface SourceRef {
  label: string;
  url: string;
  /** operator = primary operator page · registry = independent register · press = credible third-party report · gov = government/institutional */
  kind: "operator" | "registry" | "press" | "gov";
}

export interface Facility {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: FacilityStatus;
  address: string | null;
  city: string;
  region: string;
  itLoadMw: number | null;
  totalCapacityMw: number | null;
  rackCount: number | null;
  tierRating: string | null;
  facilityType: string | null;
  aiReady: boolean;
  openedDate: string | null;
  expansionDate: string | null;
  coolingType: string | null;
  powerSource: string | null;
  renewableClaim: string | null;
  notable: string | null;
  lastVerified: string;
  dataSource: string;
  dataConfidence: string;
  /** Hand-curated links to DC254 coverage of this facility/operator. */
  articleSlugs?: string[];
  /** Per-claim source links — the claim, the source, the date. */
  sources?: SourceRef[];
  /** Cross-reference against the PeeringDB facility register. */
  peeringdbFacId?: number;
  peeringdbNetworks?: number;
  peeringdbIxs?: number;
  /** True only where carrier neutrality is operator-stated or independently evidenced. */
  carrierNeutral?: boolean;
  /** Third-party certification position, stated precisely (design vs constructed-facility). */
  certNote?: string | null;
  /** Where marketing claims and available evidence part ways — said plainly. */
  divergenceNote?: string | null;
  operatorId: string;
  operator: Operator;
  connectivityFacility: { provider: ConnectivityProvider }[];
  certifications: Cert[];
}

// ─── Operators ─────────────────────────────────────────────────────────────

const operators: Operator[] = [
  { id: "ixafrica", name: "iXAfrica Data Centres", slug: "ixafrica", type: "Commercial", parentCompany: null, hqCountry: "Kenya", websiteUrl: "https://ixafrica.co.ke" },
  { id: "africa-dc", name: "Africa Data Centres", slug: "africa-data-centres", type: "Commercial", parentCompany: "Liquid Intelligent Technologies (Cassava Technologies)", hqCountry: "South Africa", websiteUrl: "https://africadatacentres.com" },
  { id: "safaricom", name: "Safaricom", slug: "safaricom", type: "Telecom", parentCompany: null, hqCountry: "Kenya", websiteUrl: "https://safaricom.co.ke" },
  { id: "telkom-ke", name: "Telkom Kenya", slug: "telkom-kenya", type: "Telecom", parentCompany: "Helios Investment Partners", hqCountry: "Kenya", websiteUrl: "https://telkom.co.ke" },
  { id: "liquid-ke", name: "Liquid Intelligent Technologies Kenya", slug: "liquid-kenya", type: "Commercial", parentCompany: "Cassava Technologies", hqCountry: "Kenya", websiteUrl: "https://liquid.intelligent" },
  { id: "wingu", name: "Wingu Africa", slug: "wingu", type: "Commercial", parentCompany: "Wingu Group", hqCountry: "Kenya", websiteUrl: "https://wingu.africa" },
  { id: "raxio", name: "Raxio Data Centres", slug: "raxio", type: "Commercial", parentCompany: "Raxio Group", hqCountry: "UAE", websiteUrl: "https://raxio.com" },
  { id: "septris", name: "Septris EO Ltd", slug: "septris", type: "Commercial", parentCompany: null, hqCountry: "Kenya", websiteUrl: null },
  { id: "kotda", name: "Konza Technopolis Development Authority (KoTDA)", slug: "kotda", type: "Government", parentCompany: "Government of Kenya", hqCountry: "Kenya", websiteUrl: null },
  { id: "icolo", name: "iColo (Digital Realty)", slug: "icolo", type: "Commercial", parentCompany: "Digital Realty", hqCountry: "Kenya", websiteUrl: "https://www.icolo.io" },
  { id: "global-ts", name: "Global Telecommunications & Services", slug: "global-ts", type: "Commercial", parentCompany: null, hqCountry: "Kenya", websiteUrl: null },
  { id: "wananchi", name: "Wananchi Group", slug: "wananchi", type: "Commercial", parentCompany: null, hqCountry: "Kenya", websiteUrl: null },
  { id: "paix", name: "PAIX Data Centres", slug: "paix", type: "Commercial", parentCompany: null, hqCountry: "Kenya", websiteUrl: "https://paix.io" },
  { id: "seacom", name: "SEACOM", slug: "seacom", type: "Carrier", parentCompany: null, hqCountry: "South Africa", websiteUrl: "https://www.seacom.mu" },
  { id: "simbanet", name: "SimbaNET Kenya", slug: "simbanet", type: "Telecom", parentCompany: null, hqCountry: "Kenya", websiteUrl: "https://www.simbanet.co.ke" },
  { id: "kenya-data-centres", name: "Kenya Data Centres (ICT Authority)", slug: "kenya-data-centres", type: "Government", parentCompany: "Kenya ICT Authority", hqCountry: "Kenya", websiteUrl: null },
];

// ─── Facilities ────────────────────────────────────────────────────────────

const facilities: Facility[] = [
  // ── iXAfrica ──────────────────────────────────────────────────────────
  {
    id: "1",
    name: "iXAfrica NBOX1",
    slug: "ixafrica-nbox1",
    description: "East Africa's first hyperscale, AI-ready data centre. Purpose-built facility along Mombasa Road offering carrier-neutral colocation with direct access to submarine cable connectivity.",
    status: "Operational",
    address: "Cabanas, Mombasa Road, Industrial Area",
    city: "Nairobi",
    region: "Nairobi County",
    itLoadMw: 4.5,
    totalCapacityMw: 5,
    rackCount: 780,
    tierRating: "III",
    facilityType: "Hyperscale",
    aiReady: true,
    openedDate: "2024",
    expansionDate: null,
    coolingType: "Free-air cooling (operator-stated)",
    powerSource: "Kenya Power grid + on-site diesel generators",
    renewableClaim: "Kenya grid is 75%+ renewable (geothermal, hydro, wind)",
    notable: "Phase one (NBOX1.1) unveiled 28 February 2025 alongside a new KIXP point of presence, with LINX Nairobi also on site. Operator cites up to 40 kW per rack and a campus PUE target of 1.25. On 27 January 2026 iXAfrica announced it will host Oracle Cloud Infrastructure's Nairobi region — no launch date given.",
    lastVerified: "2026-09",
    dataSource: "iXAfrica website and press releases; PeeringDB register",
    dataConfidence: "High",
    articleSlugs: ["ixafrica-data-centres-kenya"],
    operatorId: "ixafrica",
    operator: operators[0],
    connectivityFacility: [
      { provider: { name: "Liquid Datapoint", type: "Fibre" } },
      { provider: { name: "WIOCC", type: "Submarine" } },
      { provider: { name: "SEACOM", type: "Submarine" } },
      { provider: { name: "Telkom Kenya", type: "Fibre" } },
      { provider: { name: "Safaricom", type: "Fibre" } },
      { provider: { name: "KIXP", type: "IXP" } },
      { provider: { name: "LINX Nairobi", type: "IXP" } },
    ],
    certifications: [],
    sources: [
      { label: "iXAfrica — NBOX1 facility page", url: "https://ixafrica.co.ke/", kind: "operator" },
      { label: "iXAfrica — OCI Nairobi announcement (27 Jan 2026)", url: "https://ixafrica.co.ke/media-center", kind: "operator" },
      { label: "PeeringDB facility record (fetched 8 Sep 2026)", url: "https://www.peeringdb.com/fac/13572", kind: "registry" },
    ],
    peeringdbFacId: 13572,
    peeringdbNetworks: 44,
    peeringdbIxs: 3,
    carrierNeutral: true,
    certNote: "Widely described as \"Tier III standard\" — but iXAfrica does not appear in Uptime Institute's Kenya awards directory, and no Uptime Tier certification, ISO 27001 or PCI DSS claim appeared on its own site when checked (Sep 2026). \"Built to Tier III standards\" is a design statement, not a third-party certification.",
    divergenceNote: "Marketing materials describe a 22.5 MW campus (NBOX1.1 4.5 MW + NBOX1.2 at 18 MW / 3,744 racks). Only phase one is verifiable as operating; the 18 MW second building is under construction, not confirmed complete.",
  },
  {
    id: "6",
    name: "iXAfrica NBOX1.2",
    slug: "ixafrica-nbox1-2",
    description: "Second phase of iXAfrica's Mombasa Road campus. Financing is secured and construction is underway; on completion the NBOX1 campus will deliver 22.5 MW of IT power — the largest single-site campus in Greater East Africa.",
    status: "Under Construction",
    address: "Cabanas, Mombasa Road, Industrial Area",
    city: "Nairobi",
    region: "Nairobi County",
    itLoadMw: null,
    totalCapacityMw: 18,
    rackCount: null,
    tierRating: "III",
    facilityType: "Hyperscale",
    aiReady: true,
    openedDate: null,
    expansionDate: null,
    coolingType: null,
    powerSource: "Kenya Power",
    renewableClaim: null,
    notable: "Operator cites 18 MW and 3,744 racks for NBOX1.2, with design targets up to 50 kW per rack for AI workloads. Part of iXAfrica's announced 22.5 MW campus plan, backed by Actis investment.",
    lastVerified: "2026-09",
    dataSource: "iXAfrica press releases; Developing Telecoms; PeeringDB register",
    dataConfidence: "Medium",
    articleSlugs: ["ixafrica-data-centres-kenya"],
    operatorId: "ixafrica",
    operator: operators[0],
    connectivityFacility: [],
    certifications: [],
    sources: [
      { label: "iXAfrica — campus plans and press releases", url: "https://ixafrica.co.ke/", kind: "operator" },
      { label: "DataCenterDynamics — iXAfrica coverage", url: "https://www.datacenterdynamics.com/en/search/?q=iXAfrica", kind: "press" },
    ],
    carrierNeutral: true,
    certNote: null,
    divergenceNote: "Announced at 18 MW / 3,744 racks. Construction is underway per the operator, but no completion date has been published and the building does not yet appear on the PeeringDB register as an operating site.",
  },
  {
    id: "15",
    name: "iXAfrica NBOX2 (Tilisi)",
    slug: "ixafrica-tilisi",
    description: "Committed second iXAfrica campus on 11 acres acquired in the Tilisi master-planned development, roughly 30 km from NBOX1 along the Nairobi–Nakuru highway near Limuru.",
    status: "Committed",
    address: "Tilisi development, Limuru",
    city: "Nairobi",
    region: "Kiambu County",
    itLoadMw: null,
    totalCapacityMw: 53,
    rackCount: null,
    tierRating: null,
    facilityType: "Hyperscale",
    aiReady: true,
    openedDate: null,
    expansionDate: null,
    coolingType: null,
    powerSource: "Kenya Power (planned)",
    renewableClaim: null,
    notable: "Land acquired in August 2023 (11 acres) in the Tilisi development. Planned for over 53 MW of IT load — iXAfrica's medium-term growth vector after NBOX1.2.",
    lastVerified: "2026-09",
    dataSource: "iXAfrica campus announcements, DC254 editorial",
    dataConfidence: "Medium",
    articleSlugs: ["ixafrica-data-centres-kenya"],
    operatorId: "ixafrica",
    operator: operators[0],
    connectivityFacility: [],
    certifications: [],
    sources: [
      { label: "iXAfrica — Tilisi campus announcements", url: "https://ixafrica.co.ke/media-center", kind: "operator" },
    ],
    carrierNeutral: true,
    certNote: null,
    divergenceNote: "Land secured and pre-build stage — no vertical construction confirmed. The 53 MW figure is the long-term master plan, not committed capacity. Do not confuse with NBOX1.2 (the 18 MW second building at the Mombasa Road campus).",
  },

  // ── Africa Data Centres ────────────────────────────────────────────────
  {
    id: "2",
    name: "Africa Data Centres Nairobi 1 (NBO1)",
    slug: "africa-dc-nairobi-1",
    description: "ADC's flagship East Africa facility at Sameer Business Park — the most densely connected data centre building in Kenya, with four internet exchanges on site.",
    status: "Operational",
    address: "Sameer Business Park, Block A, Mombasa Road",
    city: "Nairobi",
    region: "Nairobi County",
    itLoadMw: null,
    totalCapacityMw: 7.5,
    rackCount: null,
    tierRating: "III",
    facilityType: "Colocation",
    aiReady: false,
    openedDate: "2019",
    expansionDate: null,
    coolingType: "Hot/cold-aisle containment; non-potable water used in cooling",
    powerSource: "Kenya Power + diesel backup",
    renewableClaim: null,
    notable: "Opened as East Africa Data Centre (EADC) and rebranded under Cassava Technologies — \"East Africa Data Centre\" and \"Africa Data Centres Nairobi\" are the same building. Operator states 2,000 m² of secured server space, \"available site capacity 7.5 MW\", four data halls certified Uptime Institute Tier 3, and PCI DSS (first in the region). Exchanges on site: KIXP Nairobi, LINX Nairobi, BGP.Exchange, PLUGINS IX.",
    lastVerified: "2026-09",
    dataSource: "Africa Data Centres website; PeeringDB register",
    dataConfidence: "High",
    articleSlugs: ["africa-data-centres-kenya-operations"],
    operatorId: "africa-dc",
    operator: operators[1],
    connectivityFacility: [
      { provider: { name: "Liquid Datapoint", type: "Fibre" } },
      { provider: { name: "SEACOM", type: "Submarine" } },
      { provider: { name: "WIOCC", type: "Submarine" } },
      { provider: { name: "KIXP Nairobi", type: "IXP" } },
      { provider: { name: "LINX Nairobi", type: "IXP" } },
      { provider: { name: "BGP.Exchange", type: "IXP" } },
      { provider: { name: "PLUGINS IX", type: "IXP" } },
    ],
    certifications: [
      { certification: { name: "PCI DSS", type: "Payment Security" } },
    ],
    sources: [
      { label: "Africa Data Centres — Nairobi facility page", url: "https://www.africadatacentres.com/nairobi/", kind: "operator" },
      { label: "PeeringDB facility record (fetched 8 Sep 2026)", url: "https://www.peeringdb.com/fac/1964", kind: "registry" },
    ],
    peeringdbFacId: 1964,
    peeringdbNetworks: 122,
    peeringdbIxs: 4,
    carrierNeutral: true,
    certNote: "Operator wording: \"4 data halls certified Uptime Institute Tier 3 facility\", plus PCI DSS. Uptime Institute's records file the building under Liquid Telecom Group (legacy name).",
    divergenceNote: "ADC announced two further Nairobi facilities (Nov 2021, the second up to 20 MW) and broke ground on a Sameer expansion in January 2023 — starting at 5 MW and scaling to an additional 15 MW, targeted for H1 2024 completion. No ADC page confirms that expansion completed or states the current commissioned IT load. \"7.5 MW\" is the operator's available site capacity, not an as-built commissioned figure — ask for as-built capacity in the specific hall.",
  },
  {
    id: "3",
    name: "Africa Data Centres Nairobi 2 (planned expansion)",
    slug: "africa-dc-nairobi-2",
    description: "Announced second Nairobi facility at the Sameer Business Park campus — groundbreaking January 2023, first phase from 5 MW scaling toward an additional 15 MW.",
    status: "Under Construction",
    address: "Sameer Business Park, Mombasa Road",
    city: "Nairobi",
    region: "Nairobi County",
    itLoadMw: null,
    totalCapacityMw: 15,
    rackCount: null,
    tierRating: null,
    facilityType: "Colocation",
    aiReady: false,
    openedDate: null,
    expansionDate: null,
    coolingType: null,
    powerSource: "Kenya Power",
    renewableClaim: null,
    notable: "Announced November 2021 (two further Nairobi facilities, the second up to 20 MW) with a $200m+ commitment; Sameer expansion broke ground January 2023.",
    lastVerified: "2026-09",
    dataSource: "ADC press releases via DataCenterDynamics",
    dataConfidence: "Medium",
    articleSlugs: ["africa-data-centres-kenya-operations"],
    operatorId: "africa-dc",
    operator: operators[1],
    connectivityFacility: [],
    certifications: [],
    sources: [
      { label: "DataCenterDynamics — ADC Nairobi expansion coverage", url: "https://www.datacenterdynamics.com/en/search/?q=Africa+Data+Centres+Nairobi", kind: "press" },
      { label: "Africa Data Centres — facility list (only NBO1 listed as operating)", url: "https://www.africadatacentres.com/", kind: "operator" },
    ],
    carrierNeutral: true,
    certNote: null,
    divergenceNote: "ADC's own website lists only NBO1 under Nairobi — this expansion does not yet appear as an operating facility, and no completion date has been published. Capacity shown is the announced plan, not a confirmed as-built figure.",
  },

  // ── Safaricom ───────────────────────────────────────────────────────────
  {
    id: "4",
    name: "Safaricom Data Centre (Waiyaki Way)",
    slug: "safaricom-dc-waiyaki",
    description: "Safaricom's primary data centre supporting M-Pesa, mobile network core, and enterprise cloud services.",
    status: "Operational",
    address: "Waiyaki Way, Westlands",
    city: "Nairobi",
    region: "Nairobi County",
    itLoadMw: 1.5,
    totalCapacityMw: 2,
    rackCount: 120,
    tierRating: "III",
    facilityType: "Enterprise",
    aiReady: false,
    openedDate: "2013",
    expansionDate: null,
    coolingType: "Precision air",
    powerSource: "Kenya Power + diesel generators",
    renewableClaim: null,
    notable: "Supports M-Pesa (processes KES 20+ trillion annually), Safaricom's 4G/5G core, and enterprise cloud. Not carrier-neutral — primarily serves Safaricom's own services.",
    lastVerified: "2026-09",
    dataSource: "Safaricom Annual Reports; TechCabal",
    dataConfidence: "Medium",
    articleSlugs: ["safaricom-data-centre-operations-kenya"],
    operatorId: "safaricom",
    operator: operators[2],
    connectivityFacility: [
      { provider: { name: "Safaricom Fibre", type: "Fibre" } },
      { provider: { name: "Telkom Kenya", type: "Fibre" } },
    ],
    certifications: [],
    sources: [
      { label: "Safaricom — annual reports and investor disclosures", url: "https://www.safaricom.co.ke/investor-relations", kind: "operator" },
    ],
    carrierNeutral: false,
    certNote: null,
    divergenceNote: "Not listed on the PeeringDB facility register (checked 8 Sep 2026) — Safaricom's registered carrier-facing facility is Thika. Capacity figures here are estimates from press reporting, not operator-published.",
  },
  {
    id: "16",
    name: "Safaricom Thika Data Centre",
    slug: "safaricom-thika",
    description: "Safaricom's carrier-facing facility in Thika, registered on PeeringDB and sold as colocation to banking, telecoms and financial-services customers.",
    status: "Operational",
    address: "Thika, Kiambu County",
    city: "Thika",
    region: "Kiambu County",
    itLoadMw: null,
    totalCapacityMw: null,
    rackCount: null,
    tierRating: "III",
    facilityType: "Enterprise (sells colocation)",
    aiReady: false,
    openedDate: null,
    expansionDate: null,
    coolingType: null,
    powerSource: "Kenya Power + backup",
    renewableClaim: null,
    notable: "The facility Safaricom registers on the PeeringDB facility register for network interconnection.",
    lastVerified: "2026-09",
    dataSource: "PeeringDB register; Uptime Institute directory; Safaricom",
    dataConfidence: "Medium",
    articleSlugs: ["safaricom-data-centre-operations-kenya"],
    operatorId: "safaricom",
    operator: operators[2],
    connectivityFacility: [],
    certifications: [],
    sources: [
      { label: "PeeringDB facility record (fetched 8 Sep 2026)", url: "https://www.peeringdb.com/fac/5802", kind: "registry" },
      { label: "Safaricom — enterprise colocation", url: "https://www.safaricom.co.ke/business", kind: "operator" },
    ],
    peeringdbFacId: 5802,
    peeringdbNetworks: 2,
    peeringdbIxs: 0,
    carrierNeutral: false,
    certNote: "Awarded Uptime Institute Tier III Concurrently Maintainable Design Certification in September 2018 — a design-document certification (TCDD), not a constructed-facility certification.",
    divergenceNote: "Capacity is not published anywhere primary — ask Safaricom directly for committed and available capacity.",
  },
  {
    id: "17",
    name: "Safaricom Red Hill (Limuru) Campus",
    slug: "safaricom-red-hill",
    description: "Safaricom's newer three-building campus at Red Hill, Limuru — the strongest certification position in Kenya, with phase one completed March 2025.",
    status: "Operational",
    address: "Red Hill, Limuru Road, Kiambu County",
    city: "Limuru",
    region: "Kiambu County",
    itLoadMw: null,
    totalCapacityMw: null,
    rackCount: null,
    tierRating: "III",
    facilityType: "Enterprise",
    aiReady: false,
    openedDate: "2025",
    expansionDate: null,
    coolingType: "Free cooling supplemented by solar (operator-stated)",
    powerSource: "Kenya Power + solar supplement",
    renewableClaim: "Free cooling supplemented by solar (operator-stated)",
    notable: "Described by Safaricom as a three-building campus \"built to Tier III standards\", with phase one completed in March 2025 and phase two targeted for January 2026.",
    lastVerified: "2026-09",
    dataSource: "Safaricom announcements; Uptime Institute directory",
    dataConfidence: "Medium",
    articleSlugs: ["safaricom-data-centre-operations-kenya"],
    operatorId: "safaricom",
    operator: operators[2],
    connectivityFacility: [],
    certifications: [
      { certification: { name: "Uptime Institute Tier III Design (TCDD)", type: "Uptime Institute" } },
      { certification: { name: "Uptime Institute Tier III Constructed Facility (TCCF, 26 Mar 2024)", type: "Uptime Institute" } },
    ],
    sources: [
      { label: "Uptime Institute — public certification directory", url: "https://uptimeinstitute.com/uptime-institute-professional-services", kind: "gov" },
      { label: "Safaricom — Red Hill campus announcements", url: "https://www.safaricom.co.ke/media-centre", kind: "operator" },
    ],
    carrierNeutral: false,
    certNote: "Uptime's directory shows Red Hill holding both a Tier III Design certificate (expiring 2027) and a Tier III Certification of Constructed Facility awarded 26 March 2024 — meaning Uptime inspected the finished building, not just the drawings. The strongest formal certification record of any commercial operator facility in Kenya.",
    divergenceNote: "\"2.8 MW\" circulating in press coverage is the end-of-phase-two target (January 2026) — no fetched source confirms phase two actually completed on that date, so treat 2.8 MW as planned rather than commissioned capacity.",
  },

  // ── Microsoft / G42 (early stage) ──────────────────────────────────────
  {
    id: "7",
    name: "Microsoft–G42 AI Data Centre",
    slug: "microsoft-g42-ai-dc",
    description: "Planned $1 billion AI data centre joint venture. Would be Kenya's first hyperscale cloud/AI facility from a global tech company.",
    status: "Early Stage",
    address: "To be determined (likely Nairobi or Olkaria)",
    city: "Nairobi",
    region: "Nairobi County",
    itLoadMw: null,
    totalCapacityMw: 100,
    rackCount: null,
    tierRating: null,
    facilityType: "Hyperscale",
    aiReady: true,
    openedDate: null,
    expansionDate: null,
    coolingType: null,
    powerSource: "Requires dedicated power infrastructure",
    renewableClaim: "Geothermal power from Olkaria discussed as primary source",
    notable: "Would be the largest single foreign direct investment in Kenya's digital infrastructure. Partnership between Microsoft and G42 (UAE-based AI company). Safaricom named as local partner.",
    lastVerified: "2026-09",
    dataSource: "Semafor, Tom's Hardware, Business Daily",
    dataConfidence: "Medium",
    articleSlugs: ["ai-data-centres-east-africa"],
    operatorId: "safaricom",
    operator: operators[2],
    connectivityFacility: [],
    certifications: [],
    sources: [
      { label: "Semafor — Microsoft/G42 Kenya exclusive", url: "https://www.semafor.com/", kind: "press" },
      { label: "Business Daily — Kenya coverage", url: "https://www.businessdailyafrica.com/", kind: "press" },
    ],
    carrierNeutral: undefined,
    certNote: null,
    divergenceNote: "No site has been confirmed (Nairobi vs Olkaria), and reporting indicates the project stalled on grid power constraints — Kenya Power cannot currently deliver the required 100+ MW at a single site. Treat the 100 MW figure as an announcement, not a pipeline.",
  },

  // ── Telkom Kenya (Nairobi sites) ───────────────────────────────────────
  {
    id: "18",
    name: "Telkom Kenya — Milimani Exchange",
    slug: "telkom-milimani-nairobi",
    description: "Telkom Kenya's open-access colocation site at Telkom Plaza, Upper Hill — sold as open-access colocation on the operator's own network.",
    status: "Operational",
    address: "Telkom Plaza, Ralph Bunche Road, Upper Hill",
    city: "Nairobi",
    region: "Nairobi County",
    itLoadMw: null,
    totalCapacityMw: null,
    rackCount: 100,
    tierRating: null,
    facilityType: "Operator-owned (open access)",
    aiReady: false,
    openedDate: null,
    expansionDate: null,
    coolingType: "N+1 cooling per room (operator-stated)",
    powerSource: "Dual standby gensets with A and B modular UPS",
    renewableClaim: null,
    notable: "Operator specifies 100+ racks of up to 52U rack height, 4 kW dual-input power per rack, and three diverse fibre routes to the site.",
    lastVerified: "2026-09",
    dataSource: "Telkom Kenya carrier-services page; PeeringDB register",
    dataConfidence: "Medium",
    operatorId: "telkom-ke",
    operator: operators[3],
    connectivityFacility: [
      { provider: { name: "Telkom Fibre", type: "Fibre" } },
      { provider: { name: "TEAMS", type: "Submarine" } },
    ],
    certifications: [],
    sources: [
      { label: "Telkom Kenya — carrier services & hosting", url: "https://telkom.co.ke/carrier-services/our-solutions/carrier-services-hosting", kind: "operator" },
      { label: "PeeringDB facility record (fetched 8 Sep 2026)", url: "https://www.peeringdb.com/fac/6929", kind: "registry" },
    ],
    peeringdbFacId: 6929,
    peeringdbNetworks: 2,
    peeringdbIxs: 0,
    carrierNeutral: false,
    certNote: null,
    divergenceNote: "Operator-owned: tenants generally buy Telkom's transit rather than full carrier-neutrality — price it accordingly.",
  },
  {
    id: "19",
    name: "Telkom Kenya — Telephone House (Nairobi)",
    slug: "telkom-telephone-house-nairobi",
    description: "Telkom Kenya's central Nairobi exchange building on Koinange Street, registered on PeeringDB and offering operator colocation.",
    status: "Operational",
    address: "Telephone House, Koinange Street, CBD",
    city: "Nairobi",
    region: "Nairobi County",
    itLoadMw: null,
    totalCapacityMw: null,
    rackCount: null,
    tierRating: null,
    facilityType: "Operator-owned",
    aiReady: false,
    openedDate: null,
    expansionDate: null,
    coolingType: null,
    powerSource: "Kenya Power + backup",
    renewableClaim: null,
    notable: null,
    lastVerified: "2026-09",
    dataSource: "PeeringDB register; Telkom Kenya",
    dataConfidence: "Medium",
    operatorId: "telkom-ke",
    operator: operators[3],
    connectivityFacility: [],
    certifications: [],
    sources: [
      { label: "PeeringDB facility record (fetched 8 Sep 2026)", url: "https://www.peeringdb.com/fac/6931", kind: "registry" },
      { label: "Telkom Kenya — carrier services & hosting", url: "https://telkom.co.ke/carrier-services/our-solutions/carrier-services-hosting", kind: "operator" },
    ],
    peeringdbFacId: 6931,
    peeringdbNetworks: 1,
    peeringdbIxs: 0,
    carrierNeutral: false,
    certNote: null,
    divergenceNote: "Minimal public data — a single network registered on PeeringDB. Capacity and colocation terms are not published; approach Telkom directly.",
  },

  // ── Liquid Intelligent Technologies Kenya ─────────────────────────────
  {
    id: "11",
    name: "Liquid Nairobi Data Centre",
    slug: "liquid-nairobi",
    description: "Liquid's carrier-neutral facility in Nairobi offering colocation, cloud, and connectivity services across East Africa.",
    status: "Operational",
    address: "Nairobi",
    city: "Nairobi",
    region: "Nairobi County",
    itLoadMw: 1,
    totalCapacityMw: 1.5,
    rackCount: 100,
    tierRating: "III",
    facilityType: "Colocation",
    aiReady: false,
    openedDate: "2018",
    expansionDate: null,
    coolingType: "Precision air",
    powerSource: "Kenya Power",
    renewableClaim: null,
    notable: "Liquid (formerly Eaton/DBN) operates one of Africa's largest fibre networks spanning 100,000+ km across 13 countries. Parent company Cassava Technologies also owns Africa Data Centres.",
    lastVerified: "2026-09",
    dataSource: "Liquid Intelligent Technologies website",
    dataConfidence: "Medium",
    operatorId: "liquid-ke",
    operator: operators[4],
    connectivityFacility: [
      { provider: { name: "Liquid Datapoint", type: "Fibre" } },
      { provider: { name: "WIOCC", type: "Submarine" } },
    ],
    certifications: [],
    sources: [
      { label: "Liquid Intelligent Technologies — Kenya", url: "https://www.liquid.tech/", kind: "operator" },
    ],
    carrierNeutral: true,
    certNote: null,
    divergenceNote: "Not listed on the PeeringDB facility register (checked 8 Sep 2026). Note the group relationship: Liquid's data centre arm was consolidated into Africa Data Centres (Sameer Business Park) — confirm with Liquid which Nairobi building you are being quoted for, and do not double-count it against ADC NBO1.",
  },

  // ── iColo (Digital Realty) — Kenya's largest facility count ────────────
  {
    id: "20",
    name: "iColo Nairobi One (NBO1)",
    slug: "icolo-nbo1",
    description: "iColo's Karen flagship — launched September 2019 as \"the first truly carrier-neutral data centre in Nairobi\", and one of Kenya's best-connected buildings.",
    status: "Operational",
    address: "Langata South Road, Karen, Nairobi",
    city: "Nairobi",
    region: "Nairobi County",
    itLoadMw: null,
    totalCapacityMw: null,
    rackCount: 280,
    tierRating: null,
    facilityType: "Colocation",
    aiReady: false,
    openedDate: "2019",
    expansionDate: null,
    coolingType: "N+2 cooling (per Digital Realty listing)",
    powerSource: "2N power (per Digital Realty listing)",
    renewableClaim: null,
    notable: "iColo — a Digital Realty company — runs the largest facility count in Kenya. NBO1: 624 m² of customer space, 60+ connectivity providers and four internet exchanges on site per the operator; 30-day CCTV retention, PCI-DSS and ISO 27001 per the Digital Realty listing.",
    lastVerified: "2026-09",
    dataSource: "iColo website; Digital Realty listing; PeeringDB register",
    dataConfidence: "High",
    operatorId: "icolo",
    operator: operators[9],
    connectivityFacility: [
      { provider: { name: "Liquid Datapoint", type: "Fibre" } },
      { provider: { name: "Safaricom", type: "Fibre" } },
      { provider: { name: "Telkom Kenya", type: "Fibre" } },
      { provider: { name: "KIXP Nairobi", type: "IXP" } },
    ],
    certifications: [
      { certification: { name: "ISO 27001", type: "Information Security" } },
      { certification: { name: "PCI DSS", type: "Payment Security" } },
    ],
    sources: [
      { label: "iColo — Nairobi One facility page", url: "https://www.icolo.io/", kind: "operator" },
      { label: "Digital Realty — NBO1 listing", url: "https://www.digitalrealty.com/", kind: "operator" },
      { label: "PeeringDB facility record (fetched 8 Sep 2026)", url: "https://www.peeringdb.com/fac/6448", kind: "registry" },
    ],
    peeringdbFacId: 6448,
    peeringdbNetworks: 62,
    peeringdbIxs: 4,
    carrierNeutral: true,
    certNote: "ISO 27001 and PCI-DSS are claimed on the Digital Realty listing. No Uptime Institute Tier certification is published for this facility.",
    divergenceNote: "Neither iColo's page nor Digital Realty's listing publishes an IT load figure for NBO1 — ask for committed and available capacity in kW before sizing a deployment.",
  },
  {
    id: "21",
    name: "iColo Nairobi Two (NBO2)",
    slug: "icolo-nbo2",
    description: "iColo's second Nairobi building on Bogani East Road, Karen — formally launched 7 September 2026 as Digital Realty strengthens Nairobi's position as East Africa's digital gateway.",
    status: "Operational",
    address: "Bogani East Road, Karen, Nairobi",
    city: "Nairobi",
    region: "Nairobi County",
    itLoadMw: null,
    totalCapacityMw: 6.5,
    rackCount: null,
    tierRating: null,
    facilityType: "Colocation",
    aiReady: false,
    openedDate: null,
    expansionDate: null,
    coolingType: "N+2 cooling (per Digital Realty listing)",
    powerSource: "2N power; master plan includes a captive substation consuming over 20 MW at full build",
    renewableClaim: null,
    notable: "Launched 7 September 2026 at an event attended by ICT Principal Secretary John Tanui, who framed it as part of Kenya's push to become East Africa's leading digital hub. Designed to serve cloud providers, financial institutions, enterprises and ISPs. Developing Telecoms reported (August 2024) a 6.5 MW IT load within a master plan of three data centres; the Digital Realty listing describes a 3,600 m² building with 2N power, N+2 cooling, PCI-DSS, ISO 27001 and 90-day CCTV retention.",
    lastVerified: "2026-09",
    dataSource: "Capital FM / allAfrica launch coverage (7 Sep 2026); Developing Telecoms (Aug 2024); Digital Realty listing; PeeringDB register",
    dataConfidence: "Medium",
    operatorId: "icolo",
    operator: operators[9],
    connectivityFacility: [],
    certifications: [
      { certification: { name: "ISO 27001", type: "Information Security" } },
      { certification: { name: "PCI DSS", type: "Payment Security" } },
    ],
    sources: [
      { label: "Capital FM (via allAfrica) — NBO2 launch, 7 Sep 2026", url: "https://allafrica.com/stories/202609080028.html", kind: "press" },
      { label: "Digital Realty — NBO2 launch announcement", url: "https://www.digitalrealty.com/about/newsroom", kind: "operator" },
      { label: "PeeringDB facility record (fetched 8 Sep 2026)", url: "https://www.peeringdb.com/fac/14166", kind: "registry" },
    ],
    peeringdbFacId: 14166,
    peeringdbNetworks: 2,
    peeringdbIxs: 1,
    carrierNeutral: true,
    certNote: "ISO 27001 and PCI-DSS per the Digital Realty listing. No Uptime Institute Tier certification published.",
    divergenceNote: "A real, now formally launched, but still-ramping building: PeeringDB shows only two networks and a single exchange (record last updated September 2025) — not yet a peer of NBO1 on connectivity. Commissioned (as opposed to design) IT load has not been published; ask for as-built capacity before sizing a deployment.",
  },
  {
    id: "22",
    name: "iColo Mombasa One (MBA1)",
    slug: "icolo-mba1",
    description: "Opened 2017 in Miritini — the densest interconnection point on the Kenyan coast, with 90+ networks registered and three internet exchanges on site.",
    status: "Operational",
    address: "Miritini, Mombasa",
    city: "Mombasa",
    region: "Mombasa County",
    itLoadMw: 0.9,
    totalCapacityMw: 13,
    rackCount: 250,
    tierRating: null,
    facilityType: "Colocation",
    aiReady: false,
    openedDate: "2017",
    expansionDate: null,
    coolingType: null,
    powerSource: "Kenya Power + backup",
    renewableClaim: null,
    notable: "250 racks operational in 580 m², 80+ connectivity providers and three internet exchanges per the operator. iColo states the Miritini campus will eventually hold three data centres across 18,000 m², 13 MW and 1,800 racks. Current IT power on the 4,000 m² site is 0.9 MW per iColo's homepage.",
    lastVerified: "2026-09",
    dataSource: "iColo website; PeeringDB register",
    dataConfidence: "High",
    operatorId: "icolo",
    operator: operators[9],
    connectivityFacility: [
      { provider: { name: "SEACOM", type: "Submarine" } },
      { provider: { name: "EASSy", type: "Submarine" } },
      { provider: { name: "TEAMS", type: "Submarine" } },
      { provider: { name: "KIXP Mombasa", type: "IXP" } },
    ],
    certifications: [],
    sources: [
      { label: "iColo — Mombasa facility page", url: "https://www.icolo.io/locations/mombasa/", kind: "operator" },
      { label: "PeeringDB facility record (fetched 8 Sep 2026)", url: "https://www.peeringdb.com/fac/5019", kind: "registry" },
    ],
    peeringdbFacId: 5019,
    peeringdbNetworks: 94,
    peeringdbIxs: 3,
    carrierNeutral: true,
    certNote: null,
    divergenceNote: "The 13 MW campus figure is the full master plan, not the current building — current IT power is 0.9 MW per the operator's own homepage.",
  },
  {
    id: "23",
    name: "iColo Mombasa Two (MBA2)",
    slug: "icolo-mba2",
    description: "iColo's Nyali facility, opened 2022 — 600 racks and, the detail that matters for a cable landing, roughly 2 km from the nearest beach manhole.",
    status: "Operational",
    address: "Nyali, Mombasa",
    city: "Mombasa",
    region: "Mombasa County",
    itLoadMw: 1.75,
    totalCapacityMw: null,
    rackCount: 600,
    tierRating: null,
    facilityType: "Colocation",
    aiReady: false,
    openedDate: "2022",
    expansionDate: null,
    coolingType: null,
    powerSource: "Kenya Power + backup",
    renewableClaim: null,
    notable: "1,200 m² of IT space on a 4,000 m² campus with 20+ networks, per iColo. Approximately 2 km to the nearest beach manhole — direct, short backhaul to submarine cable systems.",
    lastVerified: "2026-09",
    dataSource: "iColo website; PeeringDB register",
    dataConfidence: "High",
    operatorId: "icolo",
    operator: operators[9],
    connectivityFacility: [
      { provider: { name: "SEACOM", type: "Submarine" } },
      { provider: { name: "EASSy", type: "Submarine" } },
    ],
    certifications: [],
    sources: [
      { label: "iColo — locations", url: "https://www.icolo.io/", kind: "operator" },
      { label: "PeeringDB facility record (fetched 8 Sep 2026)", url: "https://www.peeringdb.com/fac/10232", kind: "registry" },
    ],
    peeringdbFacId: 10232,
    peeringdbNetworks: 40,
    peeringdbIxs: 3,
    carrierNeutral: true,
    certNote: null,
    divergenceNote: null,
  },

  // ── PAIX Data Centres ──────────────────────────────────────────────────
  {
    id: "24",
    name: "PAIX Nairobi (NBO-1)",
    slug: "paix-nairobi",
    description: "PAIX built inside Britam Tower in Upper Hill rather than on a suburban campus — the most central of Nairobi's carrier-neutral facilities.",
    status: "Operational",
    address: "Britam Tower, Hospital Road, Upper Hill",
    city: "Nairobi",
    region: "Nairobi County",
    itLoadMw: null,
    totalCapacityMw: 1.5,
    rackCount: 240,
    tierRating: null,
    facilityType: "Colocation",
    aiReady: false,
    openedDate: "2020",
    expansionDate: null,
    coolingType: null,
    powerSource: "Kenya Power + backup",
    renewableClaim: null,
    notable: "At launch specified at 240 cabinets, 1.5 MVA total power, 690 m² of whitespace and a 99.982% uptime guarantee. PAIX's Kenya page confirms both KIXP and Nairobi-IX on site. Its central location is genuinely useful when your staff, your bank and your regulator are all within walking distance.",
    lastVerified: "2026-09",
    dataSource: "PAIX website; PeeringDB register",
    dataConfidence: "High",
    operatorId: "paix",
    operator: operators[12],
    connectivityFacility: [
      { provider: { name: "KIXP", type: "IXP" } },
      { provider: { name: "Nairobi-IX", type: "IXP" } },
      { provider: { name: "Safaricom", type: "Fibre" } },
      { provider: { name: "Liquid Datapoint", type: "Fibre" } },
    ],
    certifications: [],
    sources: [
      { label: "PAIX — Kenya facility page", url: "https://paix.io/datacentres/kenya/", kind: "operator" },
      { label: "PeeringDB facility record (fetched 8 Sep 2026)", url: "https://www.peeringdb.com/fac/7995", kind: "registry" },
    ],
    peeringdbFacId: 7995,
    peeringdbNetworks: 37,
    peeringdbIxs: 3,
    carrierNeutral: true,
    certNote: "PAIX's group site refers to \"ISO and PCI-DSS frameworks\" rather than naming ISO 27001, and makes no Uptime Tier claim.",
    divergenceNote: "The smallest of Nairobi's four carrier-neutral facilities by registered connectivity (37 networks vs 122 at ADC NBO1) — its case is location, not interconnection density. The 1.5 MVA figure is VA capacity, not MW IT load.",
  },

  // ── Konza National Data Centre (government) ────────────────────────────
  {
    id: "25",
    name: "Konza National Data Centre",
    slug: "konza-national-dc",
    description: "The government facility at Konza Technopolis — among the strongest formal certification records in Kenya, primarily serving government workloads and government cloud.",
    status: "Operational",
    address: "Konza Technopolis, Machakos County",
    city: "Konza",
    region: "Machakos County",
    itLoadMw: null,
    totalCapacityMw: null,
    rackCount: 140,
    tierRating: "III",
    facilityType: "Government",
    aiReady: false,
    openedDate: null,
    expansionDate: null,
    coolingType: null,
    powerSource: "Kenya Power + backup",
    renewableClaim: null,
    notable: "Operated by the Konza Technopolis Development Authority (KoTDA). Primarily serves government workloads — not a mainstream commercial colocation option for a private business.",
    lastVerified: "2026-09",
    dataSource: "Uptime Institute directory; PeeringDB; KoTDA",
    dataConfidence: "Medium",
    operatorId: "kotda",
    operator: operators[8],
    connectivityFacility: [],
    certifications: [
      { certification: { name: "Uptime Institute Tier III Constructed Facility (TCCF, 23 Aug 2022)", type: "Uptime Institute" } },
      { certification: { name: "Uptime Institute Tier III Design (13 Feb 2020)", type: "Uptime Institute" } },
    ],
    sources: [
      { label: "Uptime Institute — public certification directory", url: "https://uptimeinstitute.com/uptime-institute-professional-services", kind: "gov" },
      { label: "Konza Technopolis — National Data Centre", url: "https://konza.go.ke/", kind: "gov" },
    ],
    carrierNeutral: false,
    certNote: "Uptime's directory shows Konza with a Tier III Certification of Constructed Facility awarded 23 August 2022 and a Tier III Design certification dated 13 February 2020.",
    divergenceNote: "The facility's own site (dc.konza.go.ke) did not resolve when checked (Sep 2026), so current capacity, cabinet availability and commercial terms are not verifiable from a primary source — approach KoTDA directly.",
  },

  // ── Telkom Telephone House Mombasa ─────────────────────────────────────
  {
    id: "26",
    name: "Telkom Kenya — Telephone House (Mombasa)",
    slug: "telkom-telephone-house-mombasa",
    description: "Telkom Kenya's Mombasa exchange building on Moi Avenue — an operator colocation site whose real strategic weight is submarine-cable landing participation.",
    status: "Operational",
    address: "Telephone House, Moi Avenue, Mombasa",
    city: "Mombasa",
    region: "Mombasa County",
    itLoadMw: null,
    totalCapacityMw: null,
    rackCount: null,
    tierRating: null,
    facilityType: "Operator-owned (cable landing)",
    aiReady: false,
    openedDate: null,
    expansionDate: null,
    coolingType: null,
    powerSource: "Kenya Power + backup",
    renewableClaim: null,
    notable: "Offers cross-connects to submarine cable systems. Telkom holds 23% of TEAMS, 10% of LION2 and 2.6% of EASSy — it is a cable landing party first and a colocation vendor second.",
    lastVerified: "2026-09",
    dataSource: "PeeringDB register; Telkom Kenya",
    dataConfidence: "Medium",
    operatorId: "telkom-ke",
    operator: operators[3],
    connectivityFacility: [
      { provider: { name: "TEAMS", type: "Submarine" } },
      { provider: { name: "LION2", type: "Submarine" } },
      { provider: { name: "EASSy", type: "Submarine" } },
    ],
    certifications: [],
    sources: [
      { label: "PeeringDB facility record (fetched 8 Sep 2026)", url: "https://www.peeringdb.com/fac/6930", kind: "registry" },
      { label: "Telkom Kenya — carrier services & hosting", url: "https://telkom.co.ke/carrier-services/our-solutions/carrier-services-hosting", kind: "operator" },
    ],
    peeringdbFacId: 6930,
    peeringdbNetworks: 9,
    peeringdbIxs: 0,
    carrierNeutral: false,
    certNote: null,
    divergenceNote: null,
  },

  // ── SEACOM Mombasa CLS ─────────────────────────────────────────────────
  {
    id: "27",
    name: "SEACOM Mombasa Cable Landing Station",
    slug: "seacom-mombasa-cls",
    description: "The SEACOM cable landing station in Mombasa — not a commercial colocation facility, but a heavily used interconnection point with 30+ networks registered.",
    status: "Operational",
    address: "Mombasa (Swahili Cultural Centre site)",
    city: "Mombasa",
    region: "Mombasa County",
    itLoadMw: null,
    totalCapacityMw: null,
    rackCount: null,
    tierRating: null,
    facilityType: "Cable Landing Station",
    aiReady: false,
    openedDate: "2009",
    expansionDate: null,
    coolingType: null,
    powerSource: "Kenya Power + backup",
    renewableClaim: null,
    notable: "SEACOM was the first private submarine cable to serve East Africa (2009). The landing station itself is registered on PeeringDB with 30+ networks — a measure of how much traffic is handed over here.",
    lastVerified: "2026-09",
    dataSource: "PeeringDB register; SEACOM",
    dataConfidence: "High",
    operatorId: "seacom",
    operator: operators[13],
    connectivityFacility: [
      { provider: { name: "SEACOM", type: "Submarine" } },
    ],
    certifications: [],
    sources: [
      { label: "PeeringDB facility record (fetched 8 Sep 2026)", url: "https://www.peeringdb.com/fac/1648", kind: "registry" },
      { label: "SEACOM — network and landing stations", url: "https://www.seacom.mu/", kind: "operator" },
    ],
    peeringdbFacId: 1648,
    peeringdbNetworks: 31,
    peeringdbIxs: 0,
    carrierNeutral: false,
    certNote: null,
    divergenceNote: "A cable landing station, not commercial colocation — included because it appears on the PeeringDB register and matters for understanding Mombasa's connectivity role.",
  },

  // ── SimbaNET ───────────────────────────────────────────────────────────
  {
    id: "28",
    name: "SimbaNET Nairobi",
    slug: "simbanet-nairobi",
    description: "SimbaNET Kenya's facility at Gateway Business Park on Mombasa Road — an operator-owned site registered on PeeringDB.",
    status: "Operational",
    address: "Gateway Business Park, Mombasa Road",
    city: "Nairobi",
    region: "Nairobi County",
    itLoadMw: null,
    totalCapacityMw: null,
    rackCount: null,
    tierRating: null,
    facilityType: "Operator-owned",
    aiReady: false,
    openedDate: null,
    expansionDate: null,
    coolingType: null,
    powerSource: "Kenya Power + backup",
    renewableClaim: null,
    notable: null,
    lastVerified: "2026-09",
    dataSource: "PeeringDB register; SimbaNET",
    dataConfidence: "Medium",
    operatorId: "simbanet",
    operator: operators[14],
    connectivityFacility: [],
    certifications: [],
    sources: [
      { label: "PeeringDB facility record (fetched 8 Sep 2026)", url: "https://www.peeringdb.com/fac/4533", kind: "registry" },
      { label: "SimbaNET Kenya", url: "https://www.simbanet.co.ke/", kind: "operator" },
    ],
    peeringdbFacId: 4533,
    peeringdbNetworks: 2,
    peeringdbIxs: 0,
    carrierNeutral: false,
    certNote: null,
    divergenceNote: "Capacity not published; listed on the register but with minimal interconnection. Included for completeness of the register.",
  },

  // ── Raxio ───────────────────────────────────────────────────────────────
  {
    id: "13",
    name: "Raxio Nairobi (unverified)",
    slug: "raxio-nairobi",
    description: "Raxio Group has signalled entry into Kenya. No opened Nairobi facility is currently verifiable from primary sources.",
    status: "Early Stage",
    address: null,
    city: "Nairobi",
    region: "Nairobi County",
    itLoadMw: null,
    totalCapacityMw: null,
    rackCount: null,
    tierRating: null,
    facilityType: "Colocation",
    aiReady: false,
    openedDate: null,
    expansionDate: null,
    coolingType: null,
    powerSource: null,
    renewableClaim: null,
    notable: "Raxio Group is backed by IFC investment and operates facilities in Uganda, Ethiopia and elsewhere. Its Kenyan entry remains unconfirmed at facility level.",
    lastVerified: "2026-09",
    dataSource: "Raxio website (JS-gated); PeeringDB register (absence checked)",
    dataConfidence: "Low",
    operatorId: "raxio",
    operator: operators[6],
    connectivityFacility: [],
    certifications: [],
    sources: [
      { label: "Raxio Group — company site", url: "https://www.raxio.com/", kind: "operator" },
      { label: "PeeringDB Kenya register (no Raxio facility listed, fetched 8 Sep 2026)", url: "https://www.peeringdb.com/api/fac?country=KE", kind: "registry" },
    ],
    carrierNeutral: true,
    certNote: null,
    divergenceNote: "Previously listed here as operational since 2023 with capacity figures — those figures have been withdrawn pending verification: the facility does not appear on the PeeringDB register (checked 8 Sep 2026) and no operator page confirms an opened Nairobi site. Treat as pipeline, not operating capacity.",
  },

  // ── Septris ─────────────────────────────────────────────────────────────
  {
    id: "14",
    name: "Septris Data Centre",
    slug: "septris-nairobi",
    description: "Kenyan-owned colocation and managed services facility in Nairobi.",
    status: "Operational",
    address: "Nairobi",
    city: "Nairobi",
    region: "Nairobi County",
    itLoadMw: 0.3,
    totalCapacityMw: 0.5,
    rackCount: 40,
    tierRating: "II",
    facilityType: "Colocation",
    aiReady: false,
    openedDate: "2016",
    expansionDate: null,
    coolingType: "Precision air",
    powerSource: "Kenya Power",
    renewableClaim: null,
    notable: null,
    lastVerified: "2026-09",
    dataSource: "Septris EO Ltd website",
    dataConfidence: "Low",
    operatorId: "septris",
    operator: operators[7],
    connectivityFacility: [],
    certifications: [],
    sources: [
      { label: "Septris EO Ltd", url: "https://septris.co.ke/", kind: "operator" },
    ],
    carrierNeutral: undefined,
    certNote: null,
    divergenceNote: "Not listed on the PeeringDB facility register (checked 8 Sep 2026) and minimal public data exists — figures are estimates from the operator's own materials, not independently confirmed.",
  },

  // ── Global TS ───────────────────────────────────────────────────────────
  {
    id: "9",
    name: "Global TS Data Centre",
    slug: "global-ts-nairobi",
    description: "Commercial colocation and managed hosting facility.",
    status: "Operational",
    address: "Nairobi",
    city: "Nairobi",
    region: "Nairobi County",
    itLoadMw: 0.3,
    totalCapacityMw: 0.5,
    rackCount: 30,
    tierRating: "II",
    facilityType: "Colocation",
    aiReady: false,
    openedDate: "2015",
    expansionDate: null,
    coolingType: "Precision air",
    powerSource: "Kenya Power",
    renewableClaim: null,
    notable: null,
    lastVerified: "2026-09",
    dataSource: "Operator website",
    dataConfidence: "Low",
    operatorId: "global-ts",
    operator: operators[10],
    connectivityFacility: [],
    certifications: [],
    sources: [
      { label: "Global Telecommunications & Services", url: "https://www.global-ts.com/", kind: "operator" },
    ],
    carrierNeutral: undefined,
    certNote: null,
    divergenceNote: "Not listed on the PeeringDB facility register (checked 8 Sep 2026) and minimal public data exists — figures are estimates, not independently confirmed.",
  },

  // ── Wananchi ────────────────────────────────────────────────────────────
  {
    id: "10",
    name: "Wananchi Group Data Centre",
    slug: "wananchi-nairobi",
    description: "Facility supporting Wananchi's fibre broadband, cable TV, and cloud services.",
    status: "Operational",
    address: "Nairobi",
    city: "Nairobi",
    region: "Nairobi County",
    itLoadMw: 0.2,
    totalCapacityMw: 0.5,
    rackCount: 20,
    tierRating: "II",
    facilityType: "Enterprise",
    aiReady: false,
    openedDate: "2012",
    expansionDate: null,
    coolingType: "Precision air",
    powerSource: "Kenya Power",
    renewableClaim: null,
    notable: "Primarily supports Wananchi's Zuku fibre and cable TV consumer services rather than commercial colocation.",
    lastVerified: "2026-09",
    dataSource: "Wananchi Group website",
    dataConfidence: "Low",
    operatorId: "wananchi",
    operator: operators[11],
    connectivityFacility: [],
    certifications: [],
    sources: [
      { label: "Wananchi Group / Zuku", url: "https://www.zuku.co.ke/", kind: "operator" },
    ],
    carrierNeutral: false,
    certNote: null,
    divergenceNote: "Not listed on the PeeringDB facility register (checked 8 Sep 2026) — primarily an internal operator facility.",
  },

  // ── Kenya Data Centres SME Facility (announced) ─────────────────────────
  {
    id: "29",
    name: "Kenya Data Centres SME Facility",
    slug: "kenya-data-centres-sme",
    description: "Announced facility by Kenya Data Centres targeting small and medium enterprise colocation customers.",
    status: "Early Stage",
    address: null,
    city: "Nairobi",
    region: "Nairobi County",
    itLoadMw: null,
    totalCapacityMw: null,
    rackCount: null,
    tierRating: null,
    facilityType: "Colocation",
    aiReady: false,
    openedDate: null,
    expansionDate: null,
    coolingType: null,
    powerSource: null,
    renewableClaim: null,
    notable: "Announced plans targeting Kenya's SME colocation segment — an underserved tier between enterprise carriers and hyperscale campuses. Capacity and site undisclosed.",
    lastVerified: "2026-09",
    dataSource: "DC254 market outlook research",
    dataConfidence: "Low",
    articleSlugs: ["kenya-data-centre-market-outlook-2025-2030"],
    operatorId: "kenya-data-centres",
    operator: operators[15],
    connectivityFacility: [],
    certifications: [],
    sources: [
      { label: "Kenya ICT Authority — digital infrastructure programmes", url: "https://www.ict.go.ke/", kind: "gov" },
    ],
    carrierNeutral: undefined,
    certNote: null,
    divergenceNote: "Announced intent only — no site, capacity or timeline disclosed. Included because it targets the SME tier our readers ask about most; treat as a signal, not a pipeline.",
  },
];

export function getFacilities() {
  return facilities;
}

export function getFacilityBySlug(slug: string) {
  return facilities.find((f) => f.slug === slug) || null;
}

/**
 * Market supply snapshot, staged by pipeline status. Capacity basis:
 * Operational = built (designed) capacity of live facilities; pipeline
 * stages = developer-announced capacity. liveItLoadMw is the verified
 * in-service IT load, tracked separately for honesty about utilisation.
 */
export function getMarketSnapshot() {
  const stages = STATUS_ORDER.map((stage) => {
    const inStage = facilities.filter((f) => f.status === stage);
    const mw = inStage.reduce((s, f) => s + (f.totalCapacityMw || 0), 0);
    return { stage, count: inStage.length, mw };
  });
  const totalSupplyMw = stages.reduce((s, x) => s + x.mw, 0);
  const liveItLoadMw = facilities
    .filter((f) => f.status === "Operational")
    .reduce((s, f) => s + (f.itLoadMw || 0), 0);
  const dates = facilities.map((f) => f.lastVerified).sort();
  const lastVerified = dates[dates.length - 1] || "";
  return {
    stages,
    totalSupplyMw,
    liveItLoadMw,
    facilities: facilities.length,
    operators: operators.length,
    lastVerified,
  };
}

export function getOperators() {
  return operators;
}

export function getDirectoryStats() {
  const ops = facilities.filter((f) => f.status === "Operational");
  const mw = facilities.reduce((s, f) => s + (f.itLoadMw || 0), 0);
  const racks = facilities.reduce((s, f) => s + (f.rackCount || 0), 0);
  const ai = facilities.filter((f) => f.aiReady).length;
  const neutral = facilities.filter((f) => f.carrierNeutral === true && f.status === "Operational").length;
  return {
    totalFacilities: facilities.length,
    operationalCount: ops.length,
    totalMw: mw,
    totalRacks: racks,
    aiReadyCount: ai,
    carrierNeutralCount: neutral,
  };
}

export function getFilterMeta() {
  const statuses = facilities.reduce<Record<string, number>>((acc, f) => {
    acc[f.status] = (acc[f.status] || 0) + 1;
    return acc;
  }, {});
  const cities = [...new Set(facilities.map((f) => f.city))];
  const types = [...new Set(facilities.map((f) => f.facilityType).filter(Boolean))];
  // Only offer operators that actually have facilities in the directory
  const usedOperatorIds = new Set(facilities.map((f) => f.operatorId));
  return {
    operators: operators
      .filter((o) => usedOperatorIds.has(o.id))
      .map((o) => ({ id: o.id, name: o.name })),
    statuses: Object.entries(statuses).map(([value, count]) => ({ value, count })),
    cities,
    types,
  };
}
