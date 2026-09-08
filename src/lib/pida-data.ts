// ─────────────────────────────────────────────────────────────────────────────
// DC254 — PIDA / African Infrastructure Database (AID) layer.
//
// Source: AUDA-NEPAD "African Infrastructure Database" public API
// (https://aid.nepad.org/aid/public/api — country-projects.php?country=Kenya),
// authenticated with the DC254 API key. Fetched 2026-09-08 via browser session.
//
// Coverage note: Kenya's full registry holds 186 projects (~US$172bn capex,
// 4 sectors: Transport / Energy / Water / ICT). The public endpoint serves the
// first 100 records per request; this layer curates the digital-infrastructure
// projects plus power/transport context items that bear on Kenya's data centre
// build-out. Registry records are continental project preparations — NOT
// verified built facilities — and must never be mixed into DC capacity counts
// (see /methodology).
// ─────────────────────────────────────────────────────────────────────────────

export interface PidaProject {
  id: number;
  name: string;
  pidaCode: string | null;
  sector: "ICT" | "Energy" | "Transport" | "Water";
  subsector: string | null;
  status: string;
  /** Capex in US$ millions, as registered. null = not published. */
  capexM: number | null;
  lat: number | null;
  lng: number | null;
  countries: string[];
  programme: string | null;
  note: string;
}

export const PIDA_SOURCE = {
  name: "African Infrastructure Database (AIDA-NEPAD / AUDA-NEPAD)",
  label: "AUDA-NEPAD African Infrastructure Database — PIDA project registry",
  url: "https://aid.nepad.org/",
  api: "https://aid.nepad.org/aid/public/api/country-projects.php?country=Kenya",
  fetched: "2026-09-08",
  kenya: {
    totalProjects: 186,
    totalCapexM: 172035, // US$ ~172 billion, as registered
    sectors: ["Transport", "Energy", "Water", "ICT"],
    /** The public endpoint serves the first 100 records; the curated layer below
     *  draws on that slice, prioritising every ICT-sector project. */
    served: 100,
  },
} as const;

export const PIDA_PROJECTS: PidaProject[] = [
  // ── Digital / ICT (every geocoded ICT project in the served slice) ──
  {
    id: 3102,
    name: "Transborder Submarine Fiber PoPs, Regional Smart Hub Facility and Data Centre",
    pidaCode: "I.02.30.05",
    sector: "ICT",
    subsector: "Data Centers",
    status: "Active",
    capexM: 395,
    lat: -4.0435,
    lng: 39.6682,
    countries: ["Kenya", "Uganda", "Tanzania", "South Sudan", "Somalia", "Ethiopia"],
    programme: "PIDA PAP 2",
    note: "Continental-registry flagship: an EAC/IGAD-coordinated regional smart hub with data centre capacity at Mombasa, advanced as a PPP under PIDA PAP 2 and anchored in the IGAD Regional Infrastructure Masterplan. Registered at Project Structuring stage as of 2024 — a pipeline project, not a built facility. The Mombasa coordinates land inside Digital Realty's MBA1 campus area.",
  },
  {
    id: 3103,
    name: "Juba – Nairobi Fiber Optic Link",
    pidaCode: "I.02.30.06",
    sector: "ICT",
    subsector: "Fibre Optic Cable",
    status: "Active",
    capexM: 45,
    lat: 2.5,
    lng: 35.0,
    countries: ["Kenya", "South Sudan"],
    programme: "PIDA PAP 2",
    note: "Kenyan segment (~700 km, part of NOFBI) is operational; the South Sudan segment has been delayed by security and financing constraints. August 2023 Ruto–Kiir MoU revived the bilateral push.",
  },
  {
    id: 2226,
    name: "Djibouti Africa Regional Express (DARE / DARE1)",
    pidaCode: null,
    sector: "ICT",
    subsector: "Fibre Optic Cable",
    status: "Active",
    capexM: null,
    lat: null,
    lng: null,
    countries: ["Djibouti", "Somalia", "Kenya"],
    programme: null,
    note: "Registry record for the live DARE1 cable: 4,763 km with landings at Berbera, Bossaso, Mogadishu, Mombasa and Dar es Salaam; Kenya treats it as TEAMS redundancy. Registry summary cites a 60 Tbit/s system design — we carry the conservative per-landing figure on our cable layer and flag the divergence.",
  },
  {
    id: 2393,
    name: "Garissa – Kismayo Fibre Optic Link + Kismayo PoP",
    pidaCode: null,
    sector: "ICT",
    subsector: "Fibre Optic Cable",
    status: "Active",
    capexM: null,
    lat: null,
    lng: null,
    countries: ["Kenya", "Somalia"],
    programme: null,
    note: "Cross-border fibre from Garissa via the Liboi border to Kismayo, with a point of presence at Kismayo Port.",
  },
  {
    id: 2394,
    name: "Nairobi – Mogadishu Fibre Optic Link + Mogadishu PoP",
    pidaCode: null,
    sector: "ICT",
    subsector: "Fibre Optic Cable",
    status: "Active",
    capexM: null,
    lat: null,
    lng: null,
    countries: ["Kenya", "Somalia"],
    programme: null,
    note: "Cross-border fibre connecting Nairobi to Mogadishu (Somalia section) with a PoP at Mogadishu.",
  },

  // ── Power context (why the grid constraint matters) ──
  {
    id: 719,
    name: "ZTK Transmission Interconnector (Kenya section)",
    pidaCode: "E.02.03.02",
    sector: "Energy",
    subsector: "Transmission",
    status: "Active",
    capexM: 50,
    lat: -1.291,
    lng: 36.82,
    countries: ["Kenya", "Tanzania", "Zambia"],
    programme: "PIDA PAP 1",
    note: "The Kenya segment of the Zambia–Tanzania–Kenya (ZTK) 400 kV interconnector — the Eastern Africa Power Pool link that lets Kenyan data centres trade geothermal surpluses and shortfalls across borders. Directly relevant to the single-site power-delivery constraint that stalled the Microsoft–G42 project. (The registry carries a duplicate, un-coded record for the same project — one of the data-quality quirks of a continental registry.)",
  },
  {
    id: 3162,
    name: "LAPSSET Crude Oil Pipeline (Lamu – South Sudan)",
    pidaCode: "E.30.03",
    sector: "Energy",
    subsector: "Pipeline",
    status: "Active",
    capexM: 3064,
    lat: -2.2685,
    lng: 40.902,
    countries: ["Kenya", "South Sudan"],
    programme: "PIDA PAP 2",
    note: "Included as corridor context: LAPSSET infrastructure (port, pipeline, railway) reshapes the coastal energy and logistics picture that data centre siting decisions in Lamu–Mombasa depend on.",
  },

  // ── Transport context (the connectivity corridors) ──
  {
    id: 221,
    name: "Mombasa – Nairobi SGR (Northern Corridor railway, completed section)",
    pidaCode: "T.05.05.01.01",
    sector: "Transport",
    subsector: "Railway",
    status: "Completed",
    capexM: 5000,
    lat: -1.3,
    lng: 36.85,
    countries: ["Kenya", "Uganda", "Rwanda", "South Sudan"],
    programme: "PIDA PAP 1",
    note: "The operational Mombasa–Nairobi standard-gauge section of the regional Northern Corridor railway programme. Fibre often rides rail and power corridors — the SGR wayleave is one of the routes carrying terrestrial backhaul between the coast and Nairobi.",
  },
];

export const PIDA_ICT_COUNT = PIDA_PROJECTS.filter((p) => p.sector === "ICT").length;
export const PIDA_MAPPED_COUNT = PIDA_PROJECTS.filter(
  (p) => p.lat !== null && p.lng !== null
).length;
