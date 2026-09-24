/**
 * Market tracker datasets (audit Phase 2, Table 8.3): subsea cables,
 * power tariffs and licensing join the capacity pipeline (see /tracker)
 * as recurring, source-cited intelligence surfaces.
 *
 * Ground rules, inherited from the directory dataset:
 *  - every row carries named sources, a last-verified month and a
 *    confidence grade (High = operator-confirmed, Medium = single-source
 *    or mixed, Low = fragmentary);
 *  - reported claims are labelled as reported; DC254 estimates say so;
 *  - a row is never deleted for bad news, it gets a divergenceNote.
 *
 * Facts are cross-checked against the corresponding validated explainers:
 * content/articles/submarine-cables-landing-mombasa.md (updated 16 Sep 2026),
 * content/articles/kenya-power-tariffs-data-centres.md,
 * content/articles/kenya-ca-standalone-data-centre-licence.md (updated 16 Sep 2026).
 */

export type TrackerSource = {
  label: string;
  url: string;
  kind: "operator" | "registry" | "press" | "gov";
};

export type CableStatus =
  | "In service"
  | "Landed, RFS pending"
  | "Announced"
  | "Planned";

export interface CableRecord {
  name: string;
  longName: string | null;
  status: CableStatus;
  /** Ready-for-service year at the Kenyan landing; null when not in service. */
  rfsDate: string | null;
  kenyanLandings: string[];
  owners: string;
  /** Design capacity as reported; lit capacity is usually lower and untracked. */
  designCapacity: string | null;
  note: string;
  lastVerified: string;
  dataConfidence: "High" | "Medium" | "Low";
  sources: TrackerSource[];
  dc254Article?: string;
}

export interface TariffBenchmark {
  metric: string;
  value: string;
  /** How the figure is established: published tariff, DC254 benchmark estimate, or reported range. */
  basis: "Published tariff structure" | "DC254 benchmark estimate" | "Reported range";
  note: string;
}

export interface LicensingRegime {
  regime: string;
  status: "Current" | "Proposed";
  keyFees: string;
  validity: string;
  note: string;
}

export const CABLES_LAST_VERIFIED = "2026-09";

export const SUBSEA_CABLES: CableRecord[] = [
  {
    name: "TEAMS",
    longName: "The East African Marine System",
    status: "In service",
    rfsDate: "2009",
    kenyanLandings: ["Mombasa"],
    owners: "Telkom Kenya on behalf of the Government of Kenya",
    designCapacity: "1.28 Tbps at launch, subsequently upgraded",
    note: "Kenya's first submarine cable. Cut international bandwidth costs by over 90% and connected Kenya to the UAE and onwards to Europe and Asia.",
    lastVerified: CABLES_LAST_VERIFIED,
    dataConfidence: "High",
    sources: [
      { label: "Telkom Kenya (TEAMS operator)", url: "https://www.telkom.co.ke", kind: "operator" },
    ],
    dc254Article: "submarine-cables-landing-mombasa",
  },
  {
    name: "SEACOM",
    longName: null,
    status: "In service",
    rfsDate: "2009",
    kenyanLandings: ["Mombasa"],
    owners: "Privately owned (SEACOM)",
    designCapacity: null,
    note: "Connects South Africa, Mozambique, Tanzania and Kenya to Europe and India. Played a crucial role in breaking East Africa's bandwidth monopoly.",
    lastVerified: CABLES_LAST_VERIFIED,
    dataConfidence: "High",
    sources: [
      { label: "SEACOM corporate site", url: "https://seacom.mu", kind: "operator" },
    ],
    dc254Article: "submarine-cables-landing-mombasa",
  },
  {
    name: "EASSy",
    longName: "Eastern Africa Submarine System",
    status: "In service",
    rfsDate: "2010",
    kenyanLandings: ["Mombasa (branch)"],
    owners: "21-member consortium",
    designCapacity: "Upgraded to 48 Tbps (reported)",
    note: "Runs from South Africa to Sudan with a Mombasa branch, connecting to Europe via multiple landing points.",
    lastVerified: CABLES_LAST_VERIFIED,
    dataConfidence: "High",
    sources: [
      { label: "EASSy consortium via WIOCC", url: "https://wiocc.net", kind: "operator" },
    ],
    dc254Article: "submarine-cables-landing-mombasa",
  },
  {
    name: "LION2",
    longName: "Lower Indian Ocean Network 2",
    status: "In service",
    rfsDate: "2012",
    kenyanLandings: ["Mombasa"],
    owners: "Orange-led consortium",
    designCapacity: null,
    note: "Links Mombasa to Madagascar and Réunion; ready for service since April 2012.",
    lastVerified: CABLES_LAST_VERIFIED,
    dataConfidence: "High",
    sources: [
      { label: "Orange (LION2 consortium lead)", url: "https://www.orange.com", kind: "operator" },
    ],
    dc254Article: "submarine-cables-landing-mombasa",
  },
  {
    name: "DARE1",
    longName: "Djibouti Africa Regional Express",
    status: "In service",
    rfsDate: "2021",
    kenyanLandings: ["Mombasa"],
    owners: "Djibouti Telecom-led consortium",
    designCapacity: null,
    note: "In service since February 2021, connecting Djibouti, Mogadishu and Mombasa; designed to add diversity for landlocked East African nations.",
    lastVerified: CABLES_LAST_VERIFIED,
    dataConfidence: "High",
    sources: [
      { label: "SubmarineNetworks, DARE-1 ready for service (1 Apr 2021)", url: "https://www.submarinenetworks.com", kind: "press" },
    ],
    dc254Article: "submarine-cables-landing-mombasa",
  },
  {
    name: "PEACE",
    longName: "Pakistan and East Africa Connecting Europe",
    status: "In service",
    rfsDate: "2022",
    kenyanLandings: ["Mombasa (branch)"],
    owners: "Huawei Marine Networks-built, PEACE consortium",
    designCapacity: null,
    note: "Provides a new route to Europe via Pakistan and the Middle East, with a branch landing in Mombasa.",
    lastVerified: CABLES_LAST_VERIFIED,
    dataConfidence: "Medium",
    sources: [
      { label: "PEACE Cable corporate site", url: "https://peacecable.com", kind: "operator" },
    ],
    dc254Article: "submarine-cables-landing-mombasa",
  },
  {
    name: "2Africa",
    longName: null,
    status: "In service",
    rfsDate: "2024",
    kenyanLandings: ["Mombasa", "Mtwapa"],
    owners: "Meta-led consortium",
    designCapacity: "180 Tbps design capacity",
    note: "One of the largest subsea projects globally. Its Kenya segment went live in June 2024; the core system was completed in November 2025.",
    lastVerified: CABLES_LAST_VERIFIED,
    dataConfidence: "High",
    sources: [
      { label: "DataCenterDynamics, 2Africa goes live between South Africa and Kenya (14 Jun 2024)", url: "https://www.datacenterdynamics.com/en/news/2024-06-14/2africa-cable-goes-live-between-south-africa-and-kenya/", kind: "press" },
      { label: "Meta Engineering, completion of the core 2Africa system (17 Nov 2025)", url: "https://engineering.fb.com/", kind: "operator" },
    ],
    dc254Article: "submarine-cables-landing-mombasa",
  },
  {
    name: "Africa-1",
    longName: null,
    status: "Landed, RFS pending",
    rfsDate: null,
    kenyanLandings: ["Mombasa"],
    owners: "Telecom Egypt-led consortium",
    designCapacity: null,
    note: "The cable has come ashore at Mombasa but its ready-for-service date has not been announced, so DC254 does not count it among the live systems yet.",
    lastVerified: CABLES_LAST_VERIFIED,
    dataConfidence: "Medium",
    sources: [
      { label: "Africa-1 Submarine Cable System", url: "https://www.africa-1.africa/", kind: "operator" },
    ],
    dc254Article: "submarine-cables-landing-mombasa",
  },
  {
    name: "Daraja",
    longName: null,
    status: "Announced",
    rfsDate: null,
    kenyanLandings: ["Mombasa (planned)"],
    owners: "Meta-backed, hosted by Safaricom",
    designCapacity: null,
    note: "Announced October 2025 to run from Salalah in Oman to Mombasa with 24 fibre pairs. In development; does not change the live count.",
    lastVerified: CABLES_LAST_VERIFIED,
    dataConfidence: "Medium",
    sources: [
      { label: "Safaricom (Daraja host)", url: "https://www.safaricom.co.ke", kind: "operator" },
    ],
    dc254Article: "submarine-cables-landing-mombasa",
  },
  {
    name: "LuLu",
    longName: "LuLu coastal cable system",
    status: "Planned",
    rfsDate: null,
    kenyanLandings: ["Mombasa to Lamu coastal corridor: Vipingo SEZ, Kilifi, Malindi"],
    owners: "INDOI Ltd (IOX) and Blue Trade Investments consortium",
    designCapacity: "Up to 60 Tbps per fibre pair, 144 pairs (announced)",
    note: "Announced at ITW Africa 2026 (September 2026): a ~500 km coastal diversity route pairing a subsea span with a protected terrestrial path. Readiness-for-service target Q2 2028, subject to contract execution; no supplier named and construction not started at announcement.",
    lastVerified: CABLES_LAST_VERIFIED,
    dataConfidence: "Medium",
    sources: [
      { label: "IOX (INDOI Ltd), LuLu announcement at ITW Africa 2026", url: "https://www.ioxcable.com", kind: "operator" },
    ],
    dc254Article: "kenya-lulu-coastal-cable-system",
  },
];

export const TARIFFS_LAST_VERIFIED = "2026-09";

export const POWER_TARIFFS: TariffBenchmark[] = [
  {
    metric: "Energy charge, off-peak (22:00-06:00)",
    value: "from ~KES 10/kWh",
    basis: "DC254 benchmark estimate",
    note: "Lowest TOU band for large commercial and industrial customers; surplus geothermal base-load sets the floor.",
  },
  {
    metric: "Energy charge, peak (18:00-22:00)",
    value: "up to ~KES 18/kWh",
    basis: "DC254 benchmark estimate",
    note: "Evening surge band. A 24/7 data centre load mostly avoids the peak band's cost weighting.",
  },
  {
    metric: "Blended average energy charge",
    value: "KES 13-16/kWh",
    basis: "DC254 benchmark estimate",
    note: "Weighted across TOU bands for a constant 24/7 load pattern, the normal operating case for a data centre.",
  },
  {
    metric: "Effective all-in cost",
    value: "KES 15-20/kWh ($0.10-0.13)",
    basis: "DC254 benchmark estimate",
    note: "Blended energy charge plus demand charges, fuel levy and other pass-through costs.",
  },
  {
    metric: "Demand charge",
    value: "KES 300-500 per kVA per month",
    basis: "DC254 benchmark estimate",
    note: "A 2 MVA contracted demand carries KES 600,000-1,000,000 per month on demand charges alone; peak-draw management is a core competency.",
  },
  {
    metric: "Pass-through costs and levies",
    value: "+15-25% on the base energy charge",
    basis: "DC254 benchmark estimate",
    note: "FECC, inflation and forex adjustment charges, and the renewable energy levy, each small per-kWh additions that compound.",
  },
  {
    metric: "Regional comparison: Kenya",
    value: "KES 15-20/kWh effective",
    basis: "Reported range",
    note: "Competitive in Africa, strengthened by a 90%+ renewable grid mix and Nairobi's free-cooling climate.",
  },
  {
    metric: "Regional comparison: South Africa",
    value: "KES 15-22/kWh, +20-40% effective",
    basis: "Reported range",
    note: "Similar published rates, but load shedding adds generator fuel, battery wear and operational complexity.",
  },
  {
    metric: "Regional comparison: Nigeria",
    value: "up to KES 50+/kWh effective",
    basis: "Reported range",
    note: "Grid tariff KES 20-35/kWh plus KES 30-50/kWh of diesel self-generation; roughly three times the Kenyan all-in cost.",
  },
  {
    metric: "Regional comparison: Egypt / Ethiopia",
    value: "KES 8-12 / KES 6-10 per kWh",
    basis: "Reported range",
    note: "Subsidised gas (Egypt) and hydro (Ethiopia) set the regional floor; both trade against grid reliability and connectivity.",
  },
];

export const TARIFF_SOURCES: TrackerSource[] = [
  { label: "Kenya Power, tariff schedule", url: "https://www.kplc.co.ke/category/view/45/tariffs", kind: "operator" },
  { label: "Energy and Petroleum Regulatory Authority (EPRA)", url: "https://www.epra.go.ke/", kind: "gov" },
];

export const LICENSING_LAST_VERIFIED = "2026-09";

export const LICENSING_REGIMES: LicensingRegime[] = [
  {
    regime: "NFP-T2 (Network Facilities Provider Tier 2)",
    status: "Current",
    keyFees: "Application KES 5,000; 15-year licence fee KES 15 million, or 0.4% of gross annual turnover, whichever is higher",
    validity: "15 years",
    note: "Where colocation data centres have been licensed since 6 March 2026 (Gazette Notice No. 3335, Revised Telecommunications Market Structure). Remainder of the licensing regime for facilities entering the market now.",
  },
  {
    regime: "Standalone Data Centre licence (proposed)",
    status: "Proposed",
    keyFees: "Application KES 5,000; initial licence fee KES 100,000; annual operating fee KES 80,000 or 0.4% of annual gross turnover, whichever is higher",
    validity: "15 years (proposed)",
    note: "CA public consultation opened 8 September 2026, 30-day window (comments due ~8 October 2026). Would remove colocation from NFP-T2; NFP and ASP licence holders would remain exempt. Finalisation scheduled FY2026/27, implementation FY2027/28. The Universal Service Fund levy (0.5% of annual gross revenue) still applies on top.",
  },
  {
    regime: "Data Protection Act 2019 obligations (ODPC)",
    status: "Current",
    keyFees: "ODPC registration where thresholds are met",
    validity: "Ongoing",
    note: "Runs in parallel whichever CA licence applies: operator registration, breach notification (72-hour ODPC window for controllers) and Section 48 transfer restrictions. A CA licence is not a data-protection clearance.",
  },
];

export const LICENSING_SOURCES: TrackerSource[] = [
  { label: "Communications Authority of Kenya, Proposed Licensing Framework for Data Centres (September 2026, Consultation Version) - full text captured, figures verified exact", url: "https://www.ca.go.ke/sites/default/files/2026-09/Public%20Consultation%20on%20Data%20Centres%20September%202026.pdf", kind: "gov" },
  { label: "Communications Authority of Kenya, open consultations", url: "https://www.ca.go.ke/open-consultations", kind: "gov" },
  { label: "Business Daily, CA to issue standalone permits for data centres (8 Sep 2026)", url: "https://www.businessdailyafrica.com/bd/economy/ca-to-issue-standalone-permits-for-data-centres-5588294", kind: "press" },
  { label: "Developing Telecoms, Kenya regulator proposes standalone licence for data centres (9 Sep 2026)", url: "https://developingtelecoms.com/telecom-technology/data-centres-networks/20797-kenya-regulator-proposes-standalone-licence-for-data-centres.html", kind: "press" },
  { label: "w.media, Kenya's standalone data center license aims to lure investment (Sep 2026)", url: "https://w.media/kenyas-standalone-data-center-license-aims-to-lure-investment/", kind: "press" },
];
