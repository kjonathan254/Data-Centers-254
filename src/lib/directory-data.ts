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
  websiteUrl: string;
}

export interface Facility {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
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
  { id: "kenya-telcom", name: "Kenya Data Centres", slug: "kenya-data-centres", type: "Government", parentCompany: "Kenya ICT Authority", hqCountry: "Kenya", websiteUrl: null },
  { id: "purple", name: "Purple Communication", slug: "purple", type: "Commercial", parentCompany: null, hqCountry: "Kenya", websiteUrl: null },
  { id: "global-ts", name: "Global Telecommunications & Services", slug: "global-ts", type: "Commercial", parentCompany: null, hqCountry: "Kenya", websiteUrl: null },
  { id: "wananchi", name: "Wananchi Group", slug: "wananchi", type: "Commercial", parentCompany: null, hqCountry: "Kenya", websiteUrl: null },
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
    address: "Mombasa Road, Industrial Area",
    city: "Nairobi",
    region: "Nairobi County",
    itLoadMw: 4.5,
    totalCapacityMw: 5,
    rackCount: 500,
    tierRating: "III",
    facilityType: "Hyperscale",
    aiReady: true,
    openedDate: "2024",
    expansionDate: null,
    coolingType: "Precision air + free cooling",
    powerSource: "Kenya Power grid + on-site diesel generators",
    renewableClaim: "Kenya grid is 75%+ renewable (geothermal, hydro, wind)",
    notable: "East Africa's first hyperscale AI-ready facility. Backed by Actis, a leading emerging markets investor. Campus designed for 16 MW total capacity across multiple phases.",
    lastVerified: "2026-08",
    dataSource: "iXAfrica website, DataCenterDynamics, press releases",
    dataConfidence: "High",
    operatorId: "ixafrica",
    operator: operators[0],
    connectivityFacility: [
      { provider: { name: "Liquid Datapoint", type: "Fibre" } },
      { provider: { name: "WIOCC", type: "Submarine" } },
      { provider: { name: "SEACOM", type: "Submarine" } },
      { provider: { name: "Telkom Kenya", type: "Fibre" } },
      { provider: { name: "Safaricom", type: "Fibre" } },
    ],
    certifications: [],
  },
  {
    id: "6",
    name: "iXAfrica NBOX2",
    slug: "ixafrica-nbox2",
    description: "Second iXAfrica facility under development on the same Mombasa Road campus, expanding total capacity to 10+ MW.",
    status: "Under Construction",
    address: "Mombasa Road, Industrial Area",
    city: "Nairobi",
    region: "Nairobi County",
    itLoadMw: null,
    totalCapacityMw: 6,
    rackCount: null,
    tierRating: "III",
    facilityType: "Hyperscale",
    aiReady: true,
    openedDate: null,
    expansionDate: null,
    coolingType: null,
    powerSource: "Kenya Power",
    renewableClaim: null,
    notable: "Part of iXAfrica's plan for 16 MW campus. Backed by Actis investment.",
    lastVerified: "2026-08",
    dataSource: "iXAfrica press releases, DataCenterDynamics",
    dataConfidence: "High",
    operatorId: "ixafrica",
    operator: operators[0],
    connectivityFacility: [],
    certifications: [],
  },

  // ── Africa Data Centres ────────────────────────────────────────────────
  {
    id: "2",
    name: "Africa Data Centres Nairobi 1",
    slug: "africa-dc-nairobi-1",
    description: "ADC's flagship East Africa facility. Carrier-neutral colocation campus in Nairobi serving enterprise, cloud, and government tenants.",
    status: "Operational",
    address: "Mombasa Road",
    city: "Nairobi",
    region: "Nairobi County",
    itLoadMw: 2,
    totalCapacityMw: 3,
    rackCount: 200,
    tierRating: "III",
    facilityType: "Colocation",
    aiReady: false,
    openedDate: "2019",
    expansionDate: "2025",
    coolingType: "Precision air",
    powerSource: "Kenya Power + diesel backup",
    renewableClaim: null,
    notable: "ADC's first facility in East Africa. Part of Cassava Technologies group which operates 40+ facilities across 13 African countries.",
    lastVerified: "2026-08",
    dataSource: "Africa Data Centres website, ITWeb Africa",
    dataConfidence: "High",
    operatorId: "africa-dc",
    operator: operators[1],
    connectivityFacility: [
      { provider: { name: "Liquid Datapoint", type: "Fibre" } },
      { provider: { name: "SEACOM", type: "Submarine" } },
      { provider: { name: "WIOCC", type: "Submarine" } },
    ],
    certifications: [],
  },
  {
    id: "3",
    name: "Africa Data Centres Nairobi 2",
    slug: "africa-dc-nairobi-2",
    description: "Second ADC facility in Nairobi, added to meet growing demand for colocation and cloud services.",
    status: "Operational",
    address: "Mombasa Road",
    city: "Nairobi",
    region: "Nairobi County",
    itLoadMw: 1.5,
    totalCapacityMw: 2.5,
    rackCount: 150,
    tierRating: "III",
    facilityType: "Colocation",
    aiReady: false,
    openedDate: "2022",
    expansionDate: null,
    coolingType: "Precision air",
    powerSource: "Kenya Power",
    renewableClaim: null,
    notable: null,
    lastVerified: "2026-08",
    dataSource: "Africa Data Centres website",
    dataConfidence: "High",
    operatorId: "africa-dc",
    operator: operators[1],
    connectivityFacility: [
      { provider: { name: "Liquid Datapoint", type: "Fibre" } },
    ],
    certifications: [],
  },
  {
    id: "8",
    name: "Africa Data Centres Mombasa",
    slug: "africa-dc-mombasa",
    description: "Coastal colocation facility near submarine cable landing stations, providing low-latency access to international bandwidth.",
    status: "Operational",
    address: "Mombasa",
    city: "Mombasa",
    region: "Mombasa County",
    itLoadMw: 0.5,
    totalCapacityMw: 1,
    rackCount: 50,
    tierRating: "II",
    facilityType: "Colocation",
    aiReady: false,
    openedDate: "2021",
    expansionDate: null,
    coolingType: "Precision air",
    powerSource: "Kenya Power",
    renewableClaim: null,
    notable: "Strategically located near submarine cable landing stations for direct cable access.",
    lastVerified: "2026-08",
    dataSource: "Africa Data Centres website",
    dataConfidence: "Medium",
    operatorId: "africa-dc",
    operator: operators[1],
    connectivityFacility: [
      { provider: { name: "SEACOM", type: "Submarine" } },
      { provider: { name: "EASSy", type: "Submarine" } },
      { provider: { name: "TEAMS", type: "Submarine" } },
    ],
    certifications: [],
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
    lastVerified: "2026-08",
    dataSource: "Safaricom Annual Reports, TechCabal",
    dataConfidence: "Medium",
    operatorId: "safaricom",
    operator: operators[2],
    connectivityFacility: [
      { provider: { name: "Safaricom Fibre", type: "Fibre" } },
      { provider: { name: "Telkom Kenya", type: "Fibre" } },
    ],
    certifications: [],
  },
  {
    id: "7",
    name: "Microsoft-G42 AI Data Centre",
    slug: "microsoft-g42-ai-dc",
    description: "Planned $1 billion AI data centre joint venture. Would be Kenya's first hyperscale cloud/AI facility from a global tech company.",
    status: "Announced",
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
    notable: "Would be the largest single foreign direct investment in Kenya's digital infrastructure. Partnership between Microsoft and G42 (UAE-based AI company). Safaricom named as local partner. Stalled due to grid power capacity constraints — Kenya Power cannot currently deliver the required 100+ MW at a single site.",
    lastVerified: "2026-08",
    dataSource: "Semafor, Tom's Hardware, Business Daily",
    dataConfidence: "High",
    operatorId: "safaricom",
    operator: operators[2],
    connectivityFacility: [],
    certifications: [],
  },

  // ── Telkom Kenya ───────────────────────────────────────────────────────
  {
    id: "5",
    name: "Telkom Kenya Data Centre",
    slug: "telkom-dc-nairobi",
    description: "Telkom Kenya's primary data centre supporting telecom and enterprise colocation services.",
    status: "Operational",
    address: "Mombasa Road",
    city: "Nairobi",
    region: "Nairobi County",
    itLoadMw: 0.8,
    totalCapacityMw: 1.5,
    rackCount: 80,
    tierRating: "II",
    facilityType: "Enterprise",
    aiReady: false,
    openedDate: "2010",
    expansionDate: null,
    coolingType: "Precision air",
    powerSource: "Kenya Power",
    renewableClaim: null,
    notable: "Telkom co-owns the TEAMS submarine cable and operates landing station infrastructure in Mombasa.",
    lastVerified: "2026-08",
    dataSource: "Telkom Kenya website",
    dataConfidence: "Medium",
    operatorId: "telkom-ke",
    operator: operators[3],
    connectivityFacility: [
      { provider: { name: "Telkom Fibre", type: "Fibre" } },
      { provider: { name: "TEAMS", type: "Submarine" } },
    ],
    certifications: [],
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
    lastVerified: "2026-08",
    dataSource: "Liquid Intelligent Technologies website",
    dataConfidence: "Medium",
    operatorId: "liquid-ke",
    operator: operators[4],
    connectivityFacility: [
      { provider: { name: "Liquid Datapoint", type: "Fibre" } },
      { provider: { name: "WIOCC", type: "Submarine" } },
    ],
    certifications: [],
  },

  // ── Wingu Africa ────────────────────────────────────────────────────────
  {
    id: "12",
    name: "Wingu Nairobi Data Centre",
    slug: "wingu-nairobi",
    description: "Wingu's carrier-neutral edge data centre in Nairobi, designed for cloud, CDN, and enterprise workloads.",
    status: "Operational",
    address: "Nairobi",
    city: "Nairobi",
    region: "Nairobi County",
    itLoadMw: 0.5,
    totalCapacityMw: 1,
    rackCount: 60,
    tierRating: "III",
    facilityType: "Edge",
    aiReady: false,
    openedDate: "2022",
    expansionDate: null,
    coolingType: "Precision air",
    powerSource: "Kenya Power",
    renewableClaim: null,
    notable: "Wingu focuses on edge computing and cloud-on-ramp services. Designed to serve as a content delivery and cloud interconnection point for East Africa.",
    lastVerified: "2026-08",
    dataSource: "Wingu Africa website, press releases",
    dataConfidence: "Medium",
    operatorId: "wingu",
    operator: operators[5],
    connectivityFacility: [
      { provider: { name: "Liquid Datapoint", type: "Fibre" } },
      { provider: { name: "Safaricom", type: "Fibre" } },
    ],
    certifications: [],
  },

  // ── Raxio ───────────────────────────────────────────────────────────────
  {
    id: "13",
    name: "Raxio Nairobi Data Centre",
    slug: "raxio-nairobi",
    description: "Raxio's carrier-neutral colocation facility in Nairobi, targeting enterprise and hyperscale customers.",
    status: "Operational",
    address: "Nairobi",
    city: "Nairobi",
    region: "Nairobi County",
    itLoadMw: 1.2,
    totalCapacityMw: 2,
    rackCount: 100,
    tierRating: "III",
    facilityType: "Colocation",
    aiReady: false,
    openedDate: "2023",
    expansionDate: null,
    coolingType: "Precision air",
    powerSource: "Kenya Power",
    renewableClaim: null,
    notable: "Raxio Group is backed by investment from the IFC (World Bank Group). Has facilities in Uganda and Ethiopia in addition to Kenya.",
    lastVerified: "2026-08",
    dataSource: "Raxio website, DataCenterDynamics",
    dataConfidence: "Medium",
    operatorId: "raxio",
    operator: operators[6],
    connectivityFacility: [
      { provider: { name: "Liquid Datapoint", type: "Fibre" } },
    ],
    certifications: [],
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
    lastVerified: "2026-08",
    dataSource: "Septris EO Ltd website",
    dataConfidence: "Low",
    operatorId: "septris",
    operator: operators[7],
    connectivityFacility: [],
    certifications: [],
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
    lastVerified: "2026-08",
    dataSource: "Operator website",
    dataConfidence: "Low",
    operatorId: "global-ts",
    operator: operators[10],
    connectivityFacility: [],
    certifications: [],
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
    lastVerified: "2026-08",
    dataSource: "Wananchi Group website",
    dataConfidence: "Low",
    operatorId: "wananchi",
    operator: operators[11],
    connectivityFacility: [],
    certifications: [],
  },
];

export function getFacilities() {
  return facilities;
}

export function getOperators() {
  return operators;
}

export function getDirectoryStats() {
  const ops = facilities.filter((f) => f.status === "Operational");
  const mw = facilities.reduce((s, f) => s + (f.itLoadMw || 0), 0);
  const racks = facilities.reduce((s, f) => s + (f.rackCount || 0), 0);
  const ai = facilities.filter((f) => f.aiReady).length;
  return {
    totalFacilities: facilities.length,
    operationalCount: ops.length,
    totalMw: mw,
    totalRacks: racks,
    aiReadyCount: ai,
  };
}

export function getFilterMeta() {
  const statuses = facilities.reduce<Record<string, number>>((acc, f) => {
    acc[f.status] = (acc[f.status] || 0) + 1;
    return acc;
  }, {});
  const cities = [...new Set(facilities.map((f) => f.city))];
  const types = [...new Set(facilities.map((f) => f.facilityType).filter(Boolean))];
  return {
    operators: operators.map((o) => ({ id: o.id, name: o.name })),
    statuses: Object.entries(statuses).map(([value, count]) => ({ value, count })),
    cities,
    types,
  };
}
