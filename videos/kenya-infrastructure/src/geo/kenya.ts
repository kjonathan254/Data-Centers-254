import data from "./kenya-data.json";

// Scene space: 1 unit = 1 degree of lon/lat.
// x: 0 (33.9E, west) -> 8 (41.9E, east). z: 0 (-4.7S, coast/south) -> -10.13 (5.4N, north).
export const RING: [number, number][] = data.ring as [number, number][];
export const CITIES = data.cities as Record<string, [number, number]>;

export const MOMBASA: [number, number] = [5.768, -0.657];
export const NAIROBI: [number, number] = [2.921, -3.408];

// Backbone: Mombasa -> Voi -> Mtito Andei -> Nairobi (A109 highway corridor, NOFBI route)
export const BACKBONE: [number, number][] = [
  MOMBASA,
  CITIES.voi,
  CITIES.mtito,
  [CITIES.mtito[0] - 0.1, CITIES.mtito[1] - 0.55],
  NAIROBI,
];

// NOFBI spurs from Nairobi (simplified to border towns)
export const SPURS: [number, number][][] = [
  [NAIROBI, CITIES.nakuru, CITIES.eldoret, [1.2, -1.2]], // toward Uganda (Malaba)
  [NAIROBI, CITIES.embu, CITIES.garissa], // northeast
  [NAIROBI, CITIES.nakuru, CITIES.kisumu], // west to Lake Victoria
  [NAIROBI, CITIES.eldoret, CITIES.lodwar], // northwest
];

export type CableDef = {
  name: string;
  year: string;
  // 2-3 offshore waypoints ending at Mombasa; for coastal systems the line passes through
  path: [number, number][];
  labelPos: "end" | "along";
};

// Seven in-service systems landing on Kenya's coast (DC254 tracker, sourced & dated).
// Exit bearings follow real routes: TEAMS->UAE, SEACOM->India, EASSy coastal S<->N,
// LION2->Madagascar/Mayotte, DARE1->Djibouti, PEACE->Pakistan, 2Africa coastal ring.
export const CABLES: CableDef[] = [
  {
    name: "TEAMS",
    year: "2009",
    path: [
      [11.8, -4.2],
      [8.8, -2.4],
      [7.1, -1.4],
    ],
    labelPos: "end",
  },
  {
    name: "SEACOM",
    year: "2009",
    path: [
      [12.2, 1.2],
      [9.2, 0.2],
      [7.2, -0.9],
    ],
    labelPos: "end",
  },
  {
    name: "EASSy",
    year: "2010",
    path: [
      [7.6, 3.4],
      [6.9, 0.9],
      [6.15, -1.6],
      [8.6, -6.4],
    ],
    labelPos: "along",
  },
  {
    name: "LION2",
    year: "2012",
    path: [
      [9.1, 3.6],
      [7.9, 1.6],
      [6.5, -0.5],
    ],
    labelPos: "end",
  },
  {
    name: "DARE1",
    year: "2020",
    path: [
      [9.6, -7.6],
      [7.6, -4.4],
      [6.3, -1.9],
    ],
    labelPos: "end",
  },
  {
    name: "PEACE",
    year: "2022",
    path: [
      [12.0, -1.6],
      [9.0, -0.9],
      [6.9, -0.8],
    ],
    labelPos: "end",
  },
  {
    name: "2Africa",
    year: "2022",
    path: [
      [8.6, 4.6],
      [7.4, 2.2],
      [6.6, -0.2],
      [9.4, -6.9],
    ],
    labelPos: "along",
  },
];

export const CABLE_Y = 0.045; // drawn just above the sea surface, flight-map style
