// ─────────────────────────────────────────────────────────────────────────────
// DC254 — Map datasets. Numbers mirror src/lib/directory-data.ts (verified
// 2026-08) and the site's connectivity copy. Positions for Nairobi / Mombasa
// facilities are schematic (approximate, spread for readability).
// ─────────────────────────────────────────────────────────────────────────────

export type DcStatus = "Operational" | "Under Construction" | "Announced";

export interface KenyaFacility {
  id: string;
  name: string;
  shortName: string;
  operator: string;
  status: DcStatus;
  city: "nairobi" | "mombasa";
  lat: number;
  lng: number;
  totalMW: number;
  openedYear: number | null;
  tier: string;
  racks: number | null;
  aiReady?: boolean;
  note?: string;
}

export const KENYA_FACILITIES: KenyaFacility[] = [
  // ── Nairobi (15) ──
  { id: "nbox1", openedYear: 2024, name: "iXAfrica NBOX1", shortName: "iXAfrica NBOX1", operator: "iXAfrica Data Centres", status: "Operational", city: "nairobi", lat: -1.3120, lng: 36.8530, totalMW: 5, tier: "Tier III", racks: 500, aiReady: true, note: "East Africa's first hyperscale, AI-ready facility — Mombasa Road" },
  { id: "nbox1-2", openedYear: null, name: "iXAfrica NBOX1.2", shortName: "iXAfrica NBOX1.2", operator: "iXAfrica Data Centres", status: "Under Construction", city: "nairobi", lat: -1.3136, lng: 36.8552, totalMW: 18, tier: "Tier III", racks: 3744, note: "Mombasa Road campus phase 2 — financing secured, build underway; campus total 22.5 MW" },
  { id: "tilisi", openedYear: null, name: "iXAfrica NBOX2 (Tilisi)", shortName: "iXAfrica Tilisi", operator: "iXAfrica Data Centres", status: "Announced", city: "nairobi", lat: -1.24, lng: 36.745, totalMW: 53, tier: "Hyperscale", racks: null, note: "Second campus at Tilisi (Limuru, 11 acres acquired 2023) — position schematic; planned 53+ MW" },
  { id: "adcn1", openedYear: 2019, name: "Africa Data Centres Nairobi 1", shortName: "ADC Nairobi 1", operator: "Africa Data Centres", status: "Operational", city: "nairobi", lat: -1.3062, lng: 36.8456, totalMW: 3, tier: "Tier III", racks: 200 },
  { id: "adcn2", openedYear: 2022, name: "Africa Data Centres Nairobi 2", shortName: "ADC Nairobi 2", operator: "Africa Data Centres", status: "Operational", city: "nairobi", lat: -1.3048, lng: 36.8472, totalMW: 2.5, tier: "Tier III", racks: 150 },
  { id: "msft", openedYear: null, name: "Microsoft–G42 AI Data Centre", shortName: "Microsoft–G42", operator: "Safaricom / Microsoft / G42", status: "Announced", city: "nairobi", lat: -1.3005, lng: 36.8700, totalMW: 100, tier: "Hyperscale", racks: null, note: "US$1bn — early stage: site TBD, pending grid capacity (100+ MW)" },
  { id: "kdc", openedYear: null, name: "Kenya Data Centres SME Facility", shortName: "Kenya DC (SME)", operator: "Kenya Data Centres", status: "Announced", city: "nairobi", lat: -1.2865, lng: 36.822, totalMW: 0, tier: "Colocation", racks: null, note: "Announced SME colocation facility — capacity undisclosed; position schematic" },
  { id: "safaricom", openedYear: 2013, name: "Safaricom Data Centre", shortName: "Safaricom", operator: "Safaricom", status: "Operational", city: "nairobi", lat: -1.2632, lng: 36.8038, totalMW: 2, tier: "Tier III", racks: 120 },
  { id: "telkom", openedYear: 2010, name: "Telkom Kenya Data Centre", shortName: "Telkom Kenya", operator: "Telkom Kenya", status: "Operational", city: "nairobi", lat: -1.2988, lng: 36.8105, totalMW: 1.5, tier: "Tier II", racks: 80 },
  { id: "liquid", openedYear: 2018, name: "Liquid Nairobi Data Centre", shortName: "Liquid", operator: "Liquid Intelligent Technologies", status: "Operational", city: "nairobi", lat: -1.2648, lng: 36.8093, totalMW: 1.5, tier: "Tier III", racks: 100 },
  { id: "wingu", openedYear: 2022, name: "Wingu Nairobi Data Centre", shortName: "Wingu", operator: "Wingu Africa", status: "Operational", city: "nairobi", lat: -1.2712, lng: 36.8180, totalMW: 1, tier: "Tier III", racks: 60 },
  { id: "raxio", openedYear: 2023, name: "Raxio Nairobi Data Centre", shortName: "Raxio", operator: "Raxio Data Centres", status: "Operational", city: "nairobi", lat: -1.2955, lng: 36.7882, totalMW: 2, tier: "Tier III", racks: 100 },
  { id: "septris", openedYear: 2016, name: "Septris Data Centre", shortName: "Septris", operator: "Septris EO Ltd", status: "Operational", city: "nairobi", lat: -1.2838, lng: 36.8312, totalMW: 0.5, tier: "Tier II", racks: 40 },
  { id: "gts", openedYear: 2015, name: "Global TS Data Centre", shortName: "Global TS", operator: "Global Telecommunications & Services", status: "Operational", city: "nairobi", lat: -1.2908, lng: 36.7955, totalMW: 0.5, tier: "Tier II", racks: 30 },
  { id: "wananchi", openedYear: 2012, name: "Wananchi Group Data Centre", shortName: "Wananchi", operator: "Wananchi Group", status: "Operational", city: "nairobi", lat: -1.2702, lng: 36.8012, totalMW: 0.5, tier: "Tier II", racks: 20 },
  // ── Mombasa (1) ──
  { id: "adcmsa", openedYear: 2021, name: "Africa Data Centres Mombasa", shortName: "ADC Mombasa", operator: "Africa Data Centres", status: "Operational", city: "mombasa", lat: -4.0320, lng: 39.6770, totalMW: 1, tier: "Tier II", racks: 50, note: "Coastal facility near the submarine cable landing stations" },
];

export const LIVE_MW = 21.0;    // built (designed) capacity of operational facilities
export const PIPELINE_MW = 171; // UC (18) + Committed (53) + Early Stage (100) — announced basis

// ── Regional (context) assets ───────────────────────────────────────────────

export interface RegionItem {
  id: string;
  name: string;
  type: "datacenter" | "ixp";
  city: string;
  powerMW?: number;
  members?: number;
  peakGbps?: number;
  year: number;
  description: string;
}

export const REGION_ITEMS: RegionItem[] = [
  { id: "tz-dc1", name: "Vodacom Tanzania DC", type: "datacenter", city: "dar", powerMW: 1.5, year: 2014, description: "Leading mobile operator's enterprise facility" },
  { id: "tz-dc2", name: "SimbaNet Dar es Salaam", type: "datacenter", city: "dar", powerMW: 1, year: 2016, description: "Commercial ISP colocation facility" },
  { id: "tz-dc3", name: "TTCL Data Centre", type: "datacenter", city: "dar", powerMW: 1, year: 2012, description: "National carrier facility near the cable landing" },
  { id: "tz-ixp", name: "TIX", type: "ixp", city: "dar", members: 45, peakGbps: 8, year: 2016, description: "Tanzania Internet Exchange Point" },
  { id: "ug-dc1", name: "Liquid Kampala DC", type: "datacenter", city: "kampala", powerMW: 2.5, year: 2017, description: "Premier carrier-neutral facility in Uganda" },
  { id: "ug-dc2", name: "MTN Uganda DC", type: "datacenter", city: "kampala", powerMW: 1.5, year: 2015, description: "Largest mobile operator's facility" },
  { id: "ug-ixp", name: "UIXP", type: "ixp", city: "kampala", members: 35, peakGbps: 5, year: 2014, description: "Uganda Internet Exchange Point" },
  { id: "rw-dc1", name: "IHS Rwanda DC", type: "datacenter", city: "kigali", powerMW: 1.5, year: 2018, description: "Smart Kigali initiative facility" },
  { id: "rw-dc2", name: "Liquid Rwanda DC", type: "datacenter", city: "kigali", powerMW: 1, year: 2016, description: "Regional enterprise facility" },
  { id: "rw-ixp", name: "RINEX", type: "ixp", city: "kigali", members: 20, peakGbps: 2, year: 2015, description: "Rwanda Internet Exchange Point" },
  { id: "et-dc1", name: "Ethio Telecom DC", type: "datacenter", city: "addis", powerMW: 2, year: 2016, description: "Government-backed national facility" },
  { id: "et-dc2", name: "Safaricom Ethiopia DC", type: "datacenter", city: "addis", powerMW: 1.5, year: 2023, description: "New market entrant after telecoms liberalisation" },
  { id: "et-ixp", name: "ET-IXP", type: "ixp", city: "addis", members: 42, peakGbps: 12, year: 2018, description: "Ethiopian Internet Exchange Point" },
];

export const CONTEXT_CITIES = [
  { id: "dar", name: "Dar es Salaam", country: "Tanzania", lat: -6.81, lng: 39.27 },
  { id: "kampala", name: "Kampala", country: "Uganda", lat: 0.33, lng: 32.58 },
  { id: "kigali", name: "Kigali", country: "Rwanda", lat: -1.95, lng: 30.06 },
  { id: "addis", name: "Addis Ababa", country: "Ethiopia", lat: 9.02, lng: 38.75 },
];

// ── Submarine cables landing at Mombasa ─────────────────────────────────────

export interface SubseaCable {
  id: string;
  name: string;
  year: number;
  live: boolean;
  designTbps: number | null;
  note: string;
  /** offshore arc waypoints [lat, lng] from the Mombasa landing station */
  waypoints: [number, number][];
  label: string;
}

export const LANDING_STATION = { lat: -3.982, lng: 39.723, name: "Mombasa cable landing station" };

export const SUBSEA_CABLES: SubseaCable[] = [
  // North-bound cables end on a vertical label stack (x ≈ 42.35°E) — clean fan, no crossings
  { id: "dare1", name: "DARE1", year: 2015, live: true, designTbps: 0.96, note: "Direct express route to Djibouti", waypoints: [[-3.982, 39.735], [-1.52, 42.27], [0.94, 42.35]], label: "DARE1 · 1 Tbps" },
  { id: "seacom", name: "SEACOM", year: 2009, live: true, designTbps: 1.28, note: "First private submarine cable in East Africa", waypoints: [[-3.982, 39.723], [-1.91, 41.89], [0.16, 42.35]], label: "SEACOM · 1.3 Tbps" },
  { id: "peace", name: "PEACE", year: 2022, live: true, designTbps: 16, note: "High-capacity eastbound route", waypoints: [[-3.982, 39.73], [-2.30, 41.51], [-0.62, 42.35]], label: "PEACE · 16 Tbps" },
  { id: "teams", name: "TEAMS", year: 2009, live: true, designTbps: 1.28, note: "Kenya's first government-backed cable", waypoints: [[-3.982, 39.72], [-2.69, 41.13], [-1.40, 42.35]], label: "TEAMS · 1.3 Tbps" },
  { id: "daraja", name: "Daraja", year: 2026, live: false, designTbps: null, note: "Meta-backed cable, in development", waypoints: [[-3.982, 39.715], [-3.08, 40.75], [-2.17, 42.35]], label: "Daraja · in development" },
  { id: "eassy", name: "EASSy", year: 2010, live: true, designTbps: 4.72, note: "7,000 km along the east coast", waypoints: [[-3.982, 39.71], [-5.2, 39.85], [-6.84, 40.4]], label: "EASSy · 4.7 Tbps" },
  { id: "lion2", name: "LION2", year: 2012, live: true, designTbps: 1.5, note: "Link to Madagascar & Réunion", waypoints: [[-3.982, 39.7], [-5.6, 40.6], [-7.62, 41.9]], label: "LION2 · 1.5 Tbps" },
];

// ── Terrestrial fibre backbone ──────────────────────────────────────────────

export const FIBRE_ROUTES: { id: string; waypoints: [number, number][] }[] = [
  { id: "msa-nbo", waypoints: [[-4.04, 39.66], [-3.1, 38.6], [-2.1, 37.5], [-1.28, 36.82]] },
  { id: "nbo-kampala", waypoints: [[-1.28, 36.82], [-1.0, 35.4], [-0.5, 34.2], [0.05, 33.9], [0.33, 32.58]] },
  { id: "kampala-kigali", waypoints: [[0.33, 32.58], [-0.4, 31.7], [-1.05, 30.9], [-1.95, 30.06]] },
  { id: "dar-kigali", waypoints: [[-6.81, 39.27], [-6.2, 37.4], [-5.0, 35.4], [-3.5, 33.4], [-2.5, 31.5], [-1.95, 30.06]] },
  { id: "djibouti-addis", waypoints: [[11.5, 42.9], [10.8, 42.0], [9.9, 40.4], [9.02, 38.75]] },
];

export const KIXP = { name: "KIXP", members: 85, peakGbps: 25, year: 2000, city: "nairobi" as const };

export const CABLE_TOTAL_TBPS = SUBSEA_CABLES.reduce((s, c) => s + (c.designTbps ?? 0), 0); // 25.74
