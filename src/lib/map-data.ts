// ─────────────────────────────────────────────────────────────────────────────
// DC254 — Map datasets. Numbers mirror src/lib/directory-data.ts (verified
// 2026-09, cross-checked against the PeeringDB Kenya facility register,
// fetched 8 Sep 2026). Positions for Nairobi / Mombasa facilities are
// schematic (approximate, spread for readability). Facilities with
// metro: "none" sit outside the two metro frames (Thika, Limuru, Konza,
// Tilisi) and appear in the directory, not on the metro maps.
// ─────────────────────────────────────────────────────────────────────────────

export type DcStatus = "Operational" | "Under Construction" | "Committed" | "Early Stage";

export interface KenyaFacility {
  id: string;
  name: string;
  shortName: string;
  operator: string;
  status: DcStatus;
  city: "nairobi" | "mombasa" | "thika" | "limuru" | "konza";
  /** Which metro map this facility plots on — "none" = directory only. */
  metro: "nairobi" | "mombasa" | "none";
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
  // ── Nairobi metro (17) ──
  { id: "nbox1", metro: "nairobi", openedYear: 2024, name: "iXAfrica NBOX1", shortName: "iXAfrica NBOX1", operator: "iXAfrica Data Centres", status: "Operational", city: "nairobi", lat: -1.3120, lng: 36.8530, totalMW: 5, tier: "Tier III*", racks: 780, aiReady: true, note: "East Africa's first hyperscale, AI-ready facility — Cabanas, Mombasa Road. *Design claim, no Uptime cert on record. OCI Nairobi region announced Jan 2026." },
  { id: "nbox1-2", metro: "nairobi", openedYear: null, name: "iXAfrica NBOX1.2", shortName: "iXAfrica NBOX1.2", operator: "iXAfrica Data Centres", status: "Under Construction", city: "nairobi", lat: -1.3136, lng: 36.8552, totalMW: 18, tier: "Tier III*", racks: null, note: "Second building on the Mombasa Road campus: 18 MW / 3,744 racks, taking the campus to 22.5 MW. Financing secured; completion not independently confirmed." },
  { id: "adcn1", metro: "nairobi", openedYear: 2019, name: "Africa Data Centres Nairobi 1 (NBO1)", shortName: "ADC Nairobi 1", operator: "Africa Data Centres", status: "Operational", city: "nairobi", lat: -1.3062, lng: 36.8456, totalMW: 7.5, tier: "Tier III (Uptime, operator-stated)", racks: null, note: "Sameer Business Park. Kenya's most connected building: 122 networks, 4 exchanges (KIXP, LINX, BGP.Exchange, PLUGINS). 7.5 MW = operator's available site capacity; commissioned load not published." },
  { id: "adcn2", metro: "nairobi", openedYear: null, name: "ADC Nairobi 2 (expansion)", shortName: "ADC Nairobi 2", operator: "Africa Data Centres", status: "Under Construction", city: "nairobi", lat: -1.3048, lng: 36.8472, totalMW: 15, tier: "Planned", racks: null, note: "Sameer expansion, groundbreaking Jan 2023 — 5 MW scaling to 15 MW. No completion confirmation published." },
  { id: "msft", metro: "nairobi", openedYear: null, name: "Microsoft–G42 AI Data Centre", shortName: "Microsoft–G42", operator: "Safaricom / Microsoft / G42", status: "Early Stage", city: "nairobi", lat: -1.3005, lng: 36.8700, totalMW: 100, tier: "Hyperscale", racks: null, note: "US$1bn announced — site TBD (Nairobi or Olkaria geothermal). Stalled on grid power delivery at single-site scale." },
  { id: "safaricom", metro: "nairobi", openedYear: 2013, name: "Safaricom Data Centre (Waiyaki Way)", shortName: "Safaricom", operator: "Safaricom", status: "Operational", city: "nairobi", lat: -1.2632, lng: 36.8038, totalMW: 2, tier: "Tier III", racks: 120, note: "Operator-owned — supports M-Pesa and Safaricom's core, not carrier-neutral." },
  { id: "liquid", metro: "nairobi", openedYear: 2018, name: "Liquid Nairobi Data Centre", shortName: "Liquid", operator: "Liquid Intelligent Technologies", status: "Operational", city: "nairobi", lat: -1.2648, lng: 36.8093, totalMW: 1.5, tier: "Tier III", racks: 100, note: "Not on the PeeringDB register — confirm which Liquid/Cassava building you are quoted for." },
  { id: "paix", metro: "nairobi", openedYear: 2020, name: "PAIX Nairobi (NBO-1)", shortName: "PAIX", operator: "PAIX Data Centres", status: "Operational", city: "nairobi", lat: -1.2987, lng: 36.8138, totalMW: 1.5, tier: "No Uptime claim", racks: 240, note: "Inside Britam Tower, Upper Hill — the most central carrier-neutral facility. 1.5 MVA; KIXP and Nairobi-IX on site." },
  { id: "icolo-nbo1", metro: "nairobi", openedYear: 2019, name: "iColo Nairobi One (NBO1)", shortName: "iColo NBO1", operator: "iColo (Digital Realty)", status: "Operational", city: "nairobi", lat: -1.3190, lng: 36.7280, totalMW: 0, tier: "ISO 27001 · PCI DSS", racks: 280, note: "Karen. Launched 2019 as \"the first truly carrier-neutral data centre in Nairobi\". 62 networks, 4 exchanges. IT load not published." },
  { id: "icolo-nbo2", metro: "nairobi", openedYear: null, name: "iColo Nairobi Two (NBO2)", shortName: "iColo NBO2", operator: "iColo (Digital Realty)", status: "Operational", city: "nairobi", lat: -1.3270, lng: 36.7380, totalMW: 6.5, tier: "ISO 27001 · PCI DSS", racks: null, note: "Bogani East Rd, Karen. Formally launched 7 Sep 2026 — 6.5 MW design load, still ramping (2 networks on PeeringDB). Ask for as-built capacity." },
  { id: "telkom-milimani", metro: "nairobi", openedYear: null, name: "Telkom Milimani Exchange", shortName: "Telkom Milimani", operator: "Telkom Kenya", status: "Operational", city: "nairobi", lat: -1.2995, lng: 36.8120, totalMW: 0, tier: "Open access", racks: 100, note: "Telkom Plaza, Ralph Bunche Rd. 100+ racks, 4 kW dual-input per rack, operator-owned." },
  { id: "telkom-th-nbo", metro: "nairobi", openedYear: null, name: "Telkom Telephone House (Nairobi)", shortName: "Telkom TH", operator: "Telkom Kenya", status: "Operational", city: "nairobi", lat: -1.2864, lng: 36.8172, totalMW: 0, tier: "Operator colo", racks: null, note: "Koinange Street, CBD. Minimal public data (1 network on PeeringDB)." },
  { id: "simbanet", metro: "nairobi", openedYear: null, name: "SimbaNET Nairobi", shortName: "SimbaNET", operator: "SimbaNET Kenya", status: "Operational", city: "nairobi", lat: -1.3280, lng: 36.8840, totalMW: 0, tier: "Operator-owned", racks: null, note: "Gateway Business Park, Mombasa Road. On the PeeringDB register with minimal interconnection." },
  { id: "raxio", metro: "nairobi", openedYear: null, name: "Raxio Nairobi (unverified)", shortName: "Raxio", operator: "Raxio Data Centres", status: "Early Stage", city: "nairobi", lat: -1.2955, lng: 36.7882, totalMW: 0, tier: "Unverified", racks: null, note: "Raxio has signalled Kenyan entry; no opened facility verifiable from primary sources (not on PeeringDB, checked 8 Sep 2026). Treat as pipeline." },
  { id: "septris", metro: "nairobi", openedYear: 2016, name: "Septris Data Centre", shortName: "Septris", operator: "Septris EO Ltd", status: "Operational", city: "nairobi", lat: -1.2838, lng: 36.8312, totalMW: 0.5, tier: "Tier II", racks: 40, note: "Kenyan-owned colocation. Not on the PeeringDB register — operator-stated figures only." },
  { id: "gts", metro: "nairobi", openedYear: 2015, name: "Global TS Data Centre", shortName: "Global TS", operator: "Global Telecommunications & Services", status: "Operational", city: "nairobi", lat: -1.2908, lng: 36.7955, totalMW: 0.5, tier: "Tier II", racks: 30, note: "Not on the PeeringDB register — minimal public data." },
  { id: "wananchi", metro: "nairobi", openedYear: 2012, name: "Wananchi Group Data Centre", shortName: "Wananchi", operator: "Wananchi Group", status: "Operational", city: "nairobi", lat: -1.2702, lng: 36.8012, totalMW: 0.5, tier: "Tier II", racks: 20, note: "Primarily supports Zuku consumer services, not commercial colocation." },

  // ── Satellite towns (directory only — outside the metro frames) ──
  { id: "thika", metro: "none", openedYear: null, name: "Safaricom Thika Data Centre", shortName: "Safaricom Thika", operator: "Safaricom", status: "Operational", city: "thika", lat: -1.0380, lng: 37.0800, totalMW: 0, tier: "Tier III (Uptime TCDD 2018)", racks: null, note: "Safaricom's carrier-facing facility, on the PeeringDB register. Uptime Tier III Design cert (Sep 2018)." },
  { id: "redhill", metro: "none", openedYear: 2025, name: "Safaricom Red Hill (Limuru) Campus", shortName: "Safaricom Red Hill", operator: "Safaricom", status: "Operational", city: "limuru", lat: -1.1600, lng: 36.6400, totalMW: 0, tier: "Tier III TCDD + TCCF", racks: null, note: "Strongest certification record in Kenya: Tier III Design + Constructed Facility (26 Mar 2024). Phase 1 completed Mar 2025; 2.8 MW is the phase-2 target." },
  { id: "konza", metro: "none", openedYear: null, name: "Konza National Data Centre", shortName: "Konza NDC", operator: "KoTDA (Government of Kenya)", status: "Operational", city: "konza", lat: -1.4400, lng: 37.3000, totalMW: 0, tier: "Tier III TCCF (2022)", racks: 140, note: "Government facility at Konza Technopolis. Uptime Tier III Constructed Facility (23 Aug 2022) + Design (13 Feb 2020). Serves government workloads primarily." },
  { id: "tilisi", metro: "none", openedYear: null, name: "iXAfrica NBOX2 (Tilisi)", shortName: "iXAfrica Tilisi", operator: "iXAfrica Data Centres", status: "Committed", city: "nairobi", lat: -1.1800, lng: 36.6500, totalMW: 53, tier: "Planned hyperscale", racks: null, note: "11 acres acquired in the Tilisi development (Aug 2023) — planned for over 53 MW of IT load. Pre-build; do not confuse with NBOX1.2 on Mombasa Road." },
  { id: "kdc", metro: "none", openedYear: null, name: "Kenya Data Centres SME Facility", shortName: "KDC SME", operator: "Kenya Data Centres (ICT Authority)", status: "Early Stage", city: "nairobi", lat: -1.2860, lng: 36.8200, totalMW: 0, tier: "Announced", racks: null, note: "Announced SME-focused colocation facility — site and capacity undisclosed. A signal of where the market is heading, not a pipeline." },

  // ── Mombasa metro (4) ──
  { id: "icolo-mba1", metro: "mombasa", openedYear: 2017, name: "iColo Mombasa One (MBA1)", shortName: "iColo MBA1", operator: "iColo (Digital Realty)", status: "Operational", city: "mombasa", lat: -3.9650, lng: 39.6550, totalMW: 0.9, tier: "Carrier-neutral", racks: 250, note: "Miritini. The densest interconnection point on the Kenyan coast: 94 networks, 3 exchanges. Campus master plan: 13 MW / 1,800 racks." },
  { id: "icolo-mba2", metro: "mombasa", openedYear: 2022, name: "iColo Mombasa Two (MBA2)", shortName: "iColo MBA2", operator: "iColo (Digital Realty)", status: "Operational", city: "mombasa", lat: -4.0430, lng: 39.6900, totalMW: 1.75, tier: "Carrier-neutral", racks: 600, note: "Nyali. 600 racks; ~2 km from the nearest beach manhole — short backhaul to the cable systems." },
  { id: "telkom-th-msa", metro: "mombasa", openedYear: null, name: "Telkom Telephone House (Mombasa)", shortName: "Telkom TH Msa", operator: "Telkom Kenya", status: "Operational", city: "mombasa", lat: -4.0580, lng: 39.6680, totalMW: 0, tier: "Operator colo", racks: null, note: "Moi Avenue. Cross-connects to submarine cable systems; Telkom holds stakes in TEAMS, LION2 and EASSy." },
  { id: "seacom-cls", metro: "mombasa", openedYear: 2009, name: "SEACOM Mombasa Cable Landing Station", shortName: "SEACOM CLS", operator: "SEACOM", status: "Operational", city: "mombasa", lat: -3.9880, lng: 39.7250, totalMW: 0, tier: "Cable landing station", racks: null, note: "Not commercial colocation — a landing station with 31 networks registered. Included for completeness of the register." },
];

export const LIVE_MW = 28.2;    // built (designed) capacity of operational facilities, where published
export const PIPELINE_MW = 186; // UC (18+15) + Committed (53) + Early Stage (100) — announced basis

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
  { id: "eig", name: "EIG", year: 2011, live: true, designTbps: null, note: "Europe–India Gateway; Kenya share undisclosed", waypoints: [[-3.982, 39.728], [-1.20, 41.70], [0.60, 42.35]], label: "EIG · landed Mombasa" },
  { id: "2africa", name: "2Africa", year: 2024, live: true, designTbps: null, note: "Largest submarine cable system ever built (180 Tbps system design); Kenya share undisclosed", waypoints: [[-3.982, 39.705], [-4.80, 40.10], [-6.20, 41.50]], label: "2Africa · 180 Tbps system" },
  { id: "daraja", name: "Daraja", year: 2026, live: false, designTbps: null, note: "Meta-backed cable, in development — Salalah to Mombasa, hosted by Safaricom (announced Oct 2025, 24 fibre pairs)", waypoints: [[-3.982, 39.715], [-3.08, 40.75], [-2.17, 42.35]], label: "Daraja · in development" },
  { id: "eassy", name: "EASSy", year: 2010, live: true, designTbps: 4.72, note: "7,000 km along the east coast", waypoints: [[-3.982, 39.71], [-5.2, 39.85], [-6.84, 40.4]], label: "EASSy · 4.7 Tbps" },
  { id: "lion2", name: "LION2", year: 2012, live: true, designTbps: 1.5, note: "Link to Madagascar & Réunion", waypoints: [[-3.982, 39.7], [-5.6, 40.6], [-7.62, 41.9]], label: "LION2 · 1.5 Tbps" },
];

// ── Terrestrial fibre backbone ──────────────────────────────────────────────

export const FIBRE_ROUTES: { id: string; waypoints: [number, number][]; note?: string }[] = [
  { id: "msa-nbo", waypoints: [[-4.04, 39.66], [-3.1, 38.6], [-2.1, 37.5], [-1.28, 36.82]] },
  { id: "nbo-kampala", waypoints: [[-1.28, 36.82], [-1.0, 35.4], [-0.5, 34.2], [0.05, 33.9], [0.33, 32.58]] },
  { id: "kampala-kigali", waypoints: [[0.33, 32.58], [-0.4, 31.7], [-1.05, 30.9], [-1.95, 30.06]] },
  { id: "dar-kigali", waypoints: [[-6.81, 39.27], [-6.2, 37.4], [-5.0, 35.4], [-3.5, 33.4], [-2.5, 31.5], [-1.95, 30.06]] },
  { id: "djibouti-addis", waypoints: [[11.5, 42.9], [10.8, 42.0], [9.9, 40.4], [9.02, 38.75]] },
  { id: "g2m", waypoints: [[-4.04, 39.66], [-2.1, 37.5], [-1.28, 36.82], [-0.4, 31.7], [-1.05, 30.9], [-1.68, 29.23]], note: "Paratus Goma–Mombasa (G2M) route, live 2026 — Goma via Kigali, Kampala and Nairobi to the Mombasa cable landing" },
];

export const KIXP = { name: "KIXP", members: 140, peakGbps: 2900, year: 2000, city: "nairobi" as const };

export const CABLE_TOTAL_TBPS = SUBSEA_CABLES.reduce((s, c) => s + (c.designTbps ?? 0), 0); // 25.74
