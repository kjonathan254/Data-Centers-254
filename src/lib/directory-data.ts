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

// ─── Static directory data ────────────────────────────────────────────────

const operators: Operator[] = [
  { id: "ixafrica", name: "iXAfrica Data Centres", slug: "ixafrica", type: "Commercial", parentCompany: null },
  { id: "africa-dc", name: "Africa Data Centres", slug: "africa-data-centres", type: "Commercial", parentCompany: "Liquid Intelligent Technologies" },
  { id: "safaricom", name: "Safaricom", slug: "safaricom", type: "Telecom", parentCompany: null },
  { id: "telkom-ke", name: "Telkom Kenya", slug: "telkom-kenya", type: "Telecom", parentCompany: "Helios Investment Partners" },
  { id: "kenya-telcom", name: "Kenya Data Centres", slug: "kenya-data-centres", type: "Government", parentCompany: "Kenya ICT Authority" },
  { id: "purple", name: "Purple Communication", slug: "purple", type: "Commercial", parentCompany: null },
  { id: "global-ts", name: "Global Telecommunications & Services", slug: "global-ts", type: "Commercial", parentCompany: null },
  { id: "wananchi", name: "Wananchi Group", slug: "wananchi", type: "Commercial", parentCompany: null },
];

const facilities: Facility[] = [
  {
    id: "1", name: "iXAfrica NBOX1.1", slug: "ixafrica-nbox1", description: "East Africa's first hyper-scale, AI-ready data centre facility along Mombasa Road, Nairobi.",
    status: "Operational", address: "Mombasa Road", city: "Nairobi", region: "Nairobi County",
    itLoadMw: 4.5, totalCapacityMw: 5, rackCount: 500, tierRating: "III", facilityType: "Hyperscale",
    aiReady: true, openedDate: "2024", expansionDate: null, coolingType: "Precision air",
    powerSource: "Kenya Power + backup generators", renewableClaim: null,
    notable: "East Africa's first hyper-scale AI-ready facility", lastVerified: "2026-08",
    dataSource: "iXAfrica website, press releases", dataConfidence: "High",
    operatorId: "ixafrica", operator: operators[0],
    connectivityFacility: [
      { provider: { name: "Liquid Datapoint", type: "Fibre" } },
      { provider: { name: "WIOCC", type: "Submarine" } },
    ],
    certifications: [],
  },
  {
    id: "2", name: "Africa Data Centres Nairobi 1", slug: "africa-dc-nairobi-1", description: "Carrier-neutral colocation facility in Nairobi serving enterprise and cloud customers.",
    status: "Operational", address: "Mombasa Road", city: "Nairobi", region: "Nairobi County",
    itLoadMw: 2, totalCapacityMw: 3, rackCount: 200, tierRating: "III", facilityType: "Colocation",
    aiReady: false, openedDate: "2019", expansionDate: "2025", coolingType: "Precision air",
    powerSource: "Kenya Power", renewableClaim: null, notable: null, lastVerified: "2026-08",
    dataSource: "Africa Data Centres website", dataConfidence: "High",
    operatorId: "africa-dc", operator: operators[1],
    connectivityFacility: [
      { provider: { name: "Liquid Datapoint", type: "Fibre" } },
      { provider: { name: "SEACOM", type: "Submarine" } },
    ],
    certifications: [],
  },
  {
    id: "3", name: "Africa Data Centres Nairobi 2", slug: "africa-dc-nairobi-2", description: "Second ADC facility in Nairobi, expanded to meet growing demand for colocation and cloud.",
    status: "Operational", address: "Mombasa Road", city: "Nairobi", region: "Nairobi County",
    itLoadMw: 1.5, totalCapacityMw: 2.5, rackCount: 150, tierRating: "III", facilityType: "Colocation",
    aiReady: false, openedDate: "2022", expansionDate: null, coolingType: "Precision air",
    powerSource: "Kenya Power", renewableClaim: null, notable: null, lastVerified: "2026-08",
    dataSource: "Africa Data Centres website", dataConfidence: "High",
    operatorId: "africa-dc", operator: operators[1],
    connectivityFacility: [
      { provider: { name: "Liquid Datapoint", type: "Fibre" } },
    ],
    certifications: [],
  },
  {
    id: "4", name: "Safaricom Data Centre", slug: "safaricom-dc-nairobi", description: "Safaricom's primary data centre supporting mobile network and enterprise services.",
    status: "Operational", address: "Waiyaki Way", city: "Nairobi", region: "Nairobi County",
    itLoadMw: 1.5, totalCapacityMw: 2, rackCount: 120, tierRating: "III", facilityType: "Enterprise",
    aiReady: false, openedDate: "2013", expansionDate: null, coolingType: "Precision air",
    powerSource: "Kenya Power", renewableClaim: null, notable: null, lastVerified: "2026-08",
    dataSource: "Safaricom annual reports", dataConfidence: "Medium",
    operatorId: "safaricom", operator: operators[2],
    connectivityFacility: [
      { provider: { name: "Safaricom Fibre", type: "Fibre" } },
    ],
    certifications: [],
  },
  {
    id: "5", name: "Telkom Kenya Data Centre", slug: "telkom-dc-nairobi", description: "Telkom Kenya's data centre supporting telecom and enterprise services.",
    status: "Operational", address: "Mombasa Road", city: "Nairobi", region: "Nairobi County",
    itLoadMw: 0.8, totalCapacityMw: 1.5, rackCount: 80, tierRating: "II", facilityType: "Enterprise",
    aiReady: false, openedDate: "2010", expansionDate: null, coolingType: "Precision air",
    powerSource: "Kenya Power", renewableClaim: null, notable: null, lastVerified: "2026-08",
    dataSource: "Telkom Kenya website", dataConfidence: "Medium",
    operatorId: "telkom-ke", operator: operators[3],
    connectivityFacility: [
      { provider: { name: "Telkom Fibre", type: "Fibre" } },
    ],
    certifications: [],
  },
  {
    id: "6", name: "iXAfrica NBOX2", slug: "ixafrica-nbox2", description: "Second iXAfrica facility under development, adjacent to NBOX1.1 along Mombasa Road.",
    status: "Under Construction", address: "Mombasa Road", city: "Nairobi", region: "Nairobi County",
    itLoadMw: null, totalCapacityMw: 6, rackCount: null, tierRating: "III", facilityType: "Hyperscale",
    aiReady: true, openedDate: null, expansionDate: null, coolingType: null,
    powerSource: "Kenya Power", renewableClaim: null,
    notable: "Planned expansion of iXAfrica campus to 10MW total IT load", lastVerified: "2026-08",
    dataSource: "iXAfrica press releases", dataConfidence: "High",
    operatorId: "ixafrica", operator: operators[0],
    connectivityFacility: [],
    certifications: [],
  },
  {
    id: "7", name: "Microsoft-G42 AI Data Centre", slug: "microsoft-g42-ai-dc", description: "Planned $1B AI data centre project, stalled due to grid power capacity constraints.",
    status: "Announced", address: "To be determined", city: "Nairobi", region: "Nairobi County",
    itLoadMw: null, totalCapacityMw: 100, rackCount: null, tierRating: null, facilityType: "Hyperscale",
    aiReady: true, openedDate: null, expansionDate: null, coolingType: null,
    powerSource: "Requires new power infrastructure", renewableClaim: "Geothermal potential discussed",
    notable: "Would be the largest single foreign direct investment in Kenya's digital infrastructure", lastVerified: "2026-08",
    dataSource: "Semafor, Tom's Hardware", dataConfidence: "High",
    operatorId: "safaricom", operator: operators[2],
    connectivityFacility: [],
    certifications: [],
  },
  {
    id: "8", name: "Africa Data Centres Mombasa", slug: "africa-dc-mombasa", description: "Coastal facility near submarine cable landing stations in Mombasa.",
    status: "Operational", address: "Mombasa", city: "Mombasa", region: "Mombasa County",
    itLoadMw: 0.5, totalCapacityMw: 1, rackCount: 50, tierRating: "II", facilityType: "Colocation",
    aiReady: false, openedDate: "2021", expansionDate: null, coolingType: "Precision air",
    powerSource: "Kenya Power", renewableClaim: null, notable: null, lastVerified: "2026-08",
    dataSource: "Africa Data Centres website", dataConfidence: "Medium",
    operatorId: "africa-dc", operator: operators[1],
    connectivityFacility: [
      { provider: { name: "SEACOM", type: "Submarine" } },
      { provider: { name: "EASSy", type: "Submarine" } },
    ],
    certifications: [],
  },
  {
    id: "9", name: "Global TS Data Centre", slug: "global-ts-nairobi", description: "Commercial colocation and hosting facility in Nairobi.",
    status: "Operational", address: "Nairobi", city: "Nairobi", region: "Nairobi County",
    itLoadMw: 0.3, totalCapacityMw: 0.5, rackCount: 30, tierRating: "II", facilityType: "Colocation",
    aiReady: false, openedDate: "2015", expansionDate: null, coolingType: "Precision air",
    powerSource: "Kenya Power", renewableClaim: null, notable: null, lastVerified: "2026-08",
    dataSource: "Operator website", dataConfidence: "Low",
    operatorId: "global-ts", operator: operators[6],
    connectivityFacility: [],
    certifications: [],
  },
  {
    id: "10", name: "Wananchi Group Data Centre", slug: "wananchi-nairobi", description: "Data centre supporting Wananchi's fibre and cable TV operations in Nairobi.",
    status: "Operational", address: "Nairobi", city: "Nairobi", region: "Nairobi County",
    itLoadMw: 0.2, totalCapacityMw: 0.5, rackCount: 20, tierRating: "II", facilityType: "Enterprise",
    aiReady: false, openedDate: "2012", expansionDate: null, coolingType: "Precision air",
    powerSource: "Kenya Power", renewableClaim: null, notable: null, lastVerified: "2026-08",
    dataSource: "Operator website", dataConfidence: "Low",
    operatorId: "wananchi", operator: operators[7],
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
