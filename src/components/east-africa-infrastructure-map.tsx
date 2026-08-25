"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Cable, Network, Server, X, Search,
  List, MapIcon, ArrowRight, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ─── TYPES ───
type AssetType = "datacenter" | "cable" | "ixp";
type ViewMode = "map" | "list";
type CountryKey = "kenya" | "tanzania" | "uganda" | "rwanda" | "ethiopia";

type CountryFilter = CountryKey | "all";
type TypeFilter = AssetType | "all";

interface InfraItem {
  id: string;
  name: string;
  type: AssetType;
  city: string;
  country: CountryKey;
  lat: number;
  lng: number;
  tier?: string;
  powerMW?: number;
  capacityGbps?: number;
  year: number;
  description: string;
  members?: number;
  peakGbps?: number;
  href?: string;
}

interface CityNode {
  id: string;
  name: string;
  country: CountryKey;
  lat: number;
  lng: number;
}

interface CableRoute {
  id: string;
  fromCity: string;
  toCity: string;
  type: "terrestrial" | "submarine";
  waypoints: [number, number][];
}

// ─── PROJECTION ───
const B = { latMin: -12, latMax: 15, lngMin: 28, lngMax: 43 };
const S = 1000;

const proj = (lat: number, lng: number) => ({
  x: ((lng - B.lngMin) / (B.lngMax - B.lngMin)) * S,
  y: ((B.latMax - lat) / (B.latMax - B.latMin)) * S,
});

const toPath = (coords: [number, number][]) =>
  coords.map(([lat, lng], i) => {
    const { x, y } = proj(lat, lng);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ") + " Z";

const DJIBOUTI_POS = proj(11.5, 42.0);

// ─── COUNTRY OUTLINES ───
const COUNTRIES: Record<CountryKey, [number, number][]> = {
  kenya: [
    [4.6,41],[3.8,41.9],[2.0,41.9],[0.2,41.8],[-1.7,40.5],[-3.0,40.1],
    [-4.05,39.7],[-4.7,39.4],[-5.0,39.0],[-4.9,38.5],[-4.2,37.8],
    [-2.5,34.5],[-1.0,34.05],[0.5,34.0],[1.5,34.2],[3.0,34.8],
    [3.5,35.0],[4.2,36.0],[4.6,37.5],
  ],
  tanzania: [
    [-1.0,30.3],[-1.6,30.4],[-3.5,30.5],[-5.0,30.0],[-6.0,30.5],
    [-7.5,31.0],[-9.0,32.5],[-10.5,34.5],[-11.5,35.5],[-10.8,36.5],
    [-10.0,37.5],[-8.5,39.2],[-7.0,39.5],[-6.8,39.3],[-5.0,38.8],
    [-4.9,38.0],[-3.0,36.0],[-1.0,34.5],[-1.0,30.3],
  ],
  uganda: [
    [3.5,30.0],[3.0,30.5],[2.2,31.0],[1.0,31.2],[-0.5,30.5],
    [-1.0,30.0],[-1.5,29.9],[-0.8,29.5],[0.2,29.7],[0.8,29.9],
    [1.5,30.2],[2.5,30.8],[3.5,30.0],
  ],
  rwanda: [
    [-1.0,29.0],[-1.5,29.2],[-2.8,29.0],[-2.8,29.6],[-2.5,30.2],
    [-1.5,30.5],[-1.0,30.2],[-0.8,29.5],[-1.0,29.0],
  ],
  ethiopia: [
    [14.8,33],[15,35],[14.5,37],[14,38.5],[12.5,40.5],[11,42],
    [10,42.5],[8.5,42],[7.5,40.5],[6,39],[5.5,37.5],[5,36],
    [4.5,35],[4.5,34],[5.5,33],[7,33.5],[8.5,33],[10,34],
    [12,33.5],[14.8,33],
  ],
};

// ─── CITIES ───
const CITIES: Record<string, CityNode> = {
  nairobi:      { id:"nairobi",       name:"Nairobi",        country:"kenya",    lat:-1.27,    lng:36.82 },
  mombasa:      { id:"mombasa",       name:"Mombasa",        country:"kenya",    lat:-4.0435,  lng:39.6682 },
  dar:          { id:"dar",           name:"Dar es Salaam",  country:"tanzania", lat:-6.81,    lng:39.27 },
  kampala:      { id:"kampala",       name:"Kampala",        country:"uganda",   lat:0.33,     lng:32.58 },
  kigali:       { id:"kigali",        name:"Kigali",         country:"rwanda",   lat:-1.95,    lng:30.06 },
  addis:        { id:"addis",         name:"Addis Ababa",    country:"ethiopia", lat:9.02,     lng:38.75 },
};

// ─── INFRASTRUCTURE DATA ───
const ITEMS: InfraItem[] = [
  // Kenya Data Centres
  { id:"ke-dc1", name:"iXAfrica NBOX1.1", type:"datacenter", city:"nairobi", country:"kenya", lat:-1.2921, lng:36.8219, tier:"Tier III", powerMW:4.5, year:2024, description:"East Africa's first hyper-scale AI-ready facility along Mombasa Road", href:"/directory" },
  { id:"ke-dc2", name:"Africa Data Centres — Nairobi", type:"datacenter", city:"nairobi", country:"kenya", lat:-1.2677, lng:36.8078, tier:"Tier III", powerMW:5, year:2012, description:"Carrier-neutral colocation, part of Liquid Intelligent Technologies", href:"/directory" },
  { id:"ke-dc3", name:"Africa Data Centres — Mombasa", type:"datacenter", city:"mombasa", country:"kenya", lat:-4.0435, lng:39.6682, tier:"Tier II", powerMW:1.5, year:2015, description:"Coastal facility near submarine cable landing stations", href:"/directory" },
  { id:"ke-dc4", name:"Safaricom Data Centre", type:"datacenter", city:"nairobi", country:"kenya", lat:-1.2456, lng:36.8123, tier:"Tier III", powerMW:2, year:2018, description:"Kenya's largest mobile operator's enterprise facility", href:"/directory" },
  { id:"ke-dc5", name:"Telkom Kenya DC", type:"datacenter", city:"nairobi", country:"kenya", lat:-1.2833, lng:36.8167, tier:"Tier II", powerMW:1, year:2016, description:"National carrier's colocation facility", href:"/directory" },
  // Kenya Cables
  { id:"ke-c1", name:"SEACOM", type:"cable", city:"mombasa", country:"kenya", lat:-4.0435, lng:39.6682, capacityGbps:1280, year:2009, description:"First private submarine cable serving East Africa", href:"/infrastructure" },
  { id:"ke-c2", name:"TEAMS", type:"cable", city:"mombasa", country:"kenya", lat:-4.0435, lng:39.6682, capacityGbps:1280, year:2009, description:"The East Africa Marine System, government-backed", href:"/infrastructure" },
  { id:"ke-c3", name:"EASSy", type:"cable", city:"mombasa", country:"kenya", lat:-4.0435, lng:39.6682, capacityGbps:4720, year:2010, description:"Eastern Africa Submarine Cable System, 7,000km", href:"/infrastructure" },
  { id:"ke-c4", name:"DARE1", type:"cable", city:"mombasa", country:"kenya", lat:-4.0435, lng:39.6682, capacityGbps:960, year:2015, description:"Djibouti Africa Regional Express 1", href:"/infrastructure" },
  { id:"ke-c5", name:"LION2", type:"cable", city:"mombasa", country:"kenya", lat:-4.0435, lng:39.6682, capacityGbps:1500, year:2012, description:"Lower Indian Ocean Network 2, connects to Madagascar", href:"/infrastructure" },
  { id:"ke-c6", name:"2Africa", type:"cable", city:"mombasa", country:"kenya", lat:-4.0435, lng:39.6682, capacityGbps:180000, year:2024, description:"Meta-backed next-gen cable, largest capacity in region", href:"/infrastructure" },
  // Kenya IXP
  { id:"ke-ixp", name:"KIXP", type:"ixp", city:"nairobi", country:"kenya", lat:-1.2921, lng:36.8219, year:2000, members:85, peakGbps:25, description:"One of Africa's largest and most active Internet Exchange Points", href:"/internet" },

  // Tanzania Data Centres
  { id:"tz-dc1", name:"Vodacom Tanzania DC", type:"datacenter", city:"dar", country:"tanzania", lat:-6.8161, lng:39.2803, tier:"Tier II", powerMW:1.5, year:2014, description:"Leading mobile operator's enterprise facility", href:"/directory" },
  { id:"tz-dc2", name:"SimbaNet Dar es Salaam", type:"datacenter", city:"dar", country:"tanzania", lat:-6.7924, lng:39.2083, tier:"Tier II", powerMW:1, year:2016, description:"Commercial ISP colocation facility", href:"/directory" },
  { id:"tz-dc3", name:"TTCL Data Centre", type:"datacenter", city:"dar", country:"tanzania", lat:-6.8, lng:39.25, tier:"Tier II", powerMW:1, year:2012, description:"National carrier facility near cable landing", href:"/directory" },
  // Tanzania Cables
  { id:"tz-c1", name:"SEACOM", type:"cable", city:"dar", country:"tanzania", lat:-6.8161, lng:39.2803, capacityGbps:1280, year:2009, description:"Same system landing in Mombasa, onward to Dar", href:"/infrastructure" },
  { id:"tz-c2", name:"EASSy", type:"cable", city:"dar", country:"tanzania", lat:-6.8161, lng:39.2803, capacityGbps:4720, year:2010, description:"Regional submarine cable", href:"/infrastructure" },
  // Tanzania IXP
  { id:"tz-ixp", name:"TIX", type:"ixp", city:"dar", country:"tanzania", lat:-6.7924, lng:39.2083, year:2016, members:45, peakGbps:8, description:"Tanzania Internet Exchange Point", href:"/internet" },

  // Uganda Data Centres
  { id:"ug-dc1", name:"Liquid Intelligent Technologies DC", type:"datacenter", city:"kampala", country:"uganda", lat:0.3476, lng:32.5825, tier:"Tier III", powerMW:2.5, year:2017, description:"Premier carrier-neutral facility in Uganda", href:"/directory" },
  { id:"ug-dc2", name:"MTN Uganda Data Centre", type:"datacenter", city:"kampala", country:"uganda", lat:0.3136, lng:32.5811, tier:"Tier II", powerMW:1.5, year:2015, description:"Largest mobile operator's facility", href:"/directory" },
  // Uganda Cables
  { id:"ug-c1", name:"EASSy Terrestrial Extension", type:"cable", city:"kampala", country:"uganda", lat:0.3476, lng:32.5825, capacityGbps:2400, year:2011, description:"Fibre from Mombasa via Nairobi to Kampala", href:"/infrastructure" },
  { id:"ug-c2", name:"TEAMS Terrestrial", type:"cable", city:"kampala", country:"uganda", lat:0.3136, lng:32.5811, capacityGbps:1280, year:2010, description:"Alternative fibre route via Malaba border", href:"/infrastructure" },
  // Uganda IXP
  { id:"ug-ixp", name:"UIXP", type:"ixp", city:"kampala", country:"uganda", lat:0.3476, lng:32.5825, year:2014, members:35, peakGbps:5, description:"Uganda Internet Exchange Point", href:"/internet" },

  // Rwanda Data Centres
  { id:"rw-dc1", name:"IHS Rwanda Data Centre", type:"datacenter", city:"kigali", country:"rwanda", lat:-1.9536, lng:30.0606, tier:"Tier III", powerMW:1.5, year:2018, description:"Smart Kigali initiative facility", href:"/directory" },
  { id:"rw-dc2", name:"Liquid Rwanda DC", type:"datacenter", city:"kigali", country:"rwanda", lat:-1.9449, lng:30.0589, tier:"Tier II", powerMW:1, year:2016, description:"Regional enterprise facility", href:"/directory" },
  // Rwanda Cables
  { id:"rw-c1", name:"Rwanda National Backbone", type:"cable", city:"kigali", country:"rwanda", lat:-1.9536, lng:30.0606, capacityGbps:640, year:2015, description:"Fibre from Kampala to Kigali", href:"/infrastructure" },
  { id:"rw-c2", name:"BSCA Fibre", type:"cable", city:"kigali", country:"rwanda", lat:-1.9449, lng:30.0589, capacityGbps:640, year:2018, description:"Broadband System Corporation, Dar-Kigali link", href:"/infrastructure" },
  // Rwanda IXP
  { id:"rw-ixp", name:"RINEX", type:"ixp", city:"kigali", country:"rwanda", lat:-1.9449, lng:30.0589, year:2015, members:20, peakGbps:2, description:"Rwanda Internet Exchange Point", href:"/internet" },

  // Ethiopia Data Centres
  { id:"et-dc1", name:"Ethio Telecom Data Centre", type:"datacenter", city:"addis", country:"ethiopia", lat:9.01, lng:38.76, tier:"Tier II", powerMW:2, year:2016, description:"Government-backed national facility", href:"/directory" },
  { id:"et-dc2", name:"Safaricom Ethiopia DC", type:"datacenter", city:"addis", country:"ethiopia", lat:9.02, lng:38.75, tier:"Tier II", powerMW:1.5, year:2023, description:"New market entrant after telecoms liberalisation", href:"/directory" },
  // Ethiopia Cables
  { id:"et-c1", name:"DARE1 Terrestrial", type:"cable", city:"addis", country:"ethiopia", lat:9.01, lng:38.76, capacityGbps:960, year:2016, description:"Fibre link from Djibouti to Addis Ababa", href:"/infrastructure" },
  { id:"et-c2", name:"PEACE Cable Extension", type:"cable", city:"addis", country:"ethiopia", lat:9.02, lng:38.75, capacityGbps:16000, year:2022, description:"High-capacity link connecting to Djibouti submarine systems", href:"/infrastructure" },
  // Ethiopia IXP
  { id:"et-ixp", name:"ET-IXP", type:"ixp", city:"addis", country:"ethiopia", lat:9.032, lng:38.7469, year:2018, members:42, peakGbps:12, description:"Ethiopian Internet Exchange Point", href:"/internet" },
];

// ─── CABLE ROUTES ───
const CABLE_ROUTES: CableRoute[] = [
  { id:"r1", fromCity:"mombasa", toCity:"nairobi", type:"terrestrial",
    waypoints:[[-4.04,39.67],[-2.5,38.5],[-1.8,37.8],[-1.27,36.82]] },
  { id:"r2", fromCity:"nairobi", toCity:"kampala", type:"terrestrial",
    waypoints:[[-1.27,36.82],[-0.5,35.5],[0.05,34.2],[0.33,32.58]] },
  { id:"r3", fromCity:"kampala", toCity:"kigali", type:"terrestrial",
    waypoints:[[0.33,32.58],[-0.3,31.8],[-1.0,31.0],[-1.5,30.5],[-1.95,30.06]] },
  { id:"r4", fromCity:"dar", toCity:"kigali", type:"terrestrial",
    waypoints:[[-6.81,39.27],[-5.5,36.5],[-4.0,34.5],[-2.5,32.5],[-1.95,30.06]] },
  { id:"r5", fromCity:"mombasa", toCity:"dar", type:"submarine",
    waypoints:[[-4.04,39.67],[-4.6,40.0],[-5.5,40.3],[-6.2,39.8],[-6.81,39.27]] },
  { id:"r6", fromCity:"djibouti", toCity:"addis", type:"terrestrial",
    waypoints:[[11.5,42.0],[11.2,41.0],[10.5,40.0],[9.8,39.5],[9.02,38.75]] },
];

// ─── HELPERS ───
const COUNTRY_META: Record<CountryKey, { label: string; flag: string }> = {
  kenya:    { label: "Kenya",    flag: "🇰🇪" },
  tanzania: { label: "Tanzania", flag: "🇹🇿" },
  uganda:   { label: "Uganda",   flag: "🇺🇬" },
  rwanda:   { label: "Rwanda",   flag: "🇷🇼" },
  ethiopia: { label: "Ethiopia", flag: "🇪🇹" },
};

const ALL_COUNTRIES: CountryKey[] = ["kenya","tanzania","uganda","rwanda","ethiopia"];

const TYPE_COLORS: Record<AssetType, string> = {
  datacenter: "bg-cyan",
  cable: "bg-purple-500",
  ixp: "bg-emerald-500",
};

const TYPE_LABELS: Record<AssetType, string> = {
  datacenter: "Data Centre",
  cable: "Cable",
  ixp: "IXP",
};

const formatCapacity = (gbps: number) =>
  gbps >= 1000 ? `${(gbps / 1000).toFixed(gbps >= 10000 ? 0 : 2)} Tbps` : `${gbps} Gbps`;

// ─── SUB-COMPONENTS ───

function StatsPanel({ items }: { items: InfraItem[] }) {
  const dcs = items.filter((i) => i.type === "datacenter");
  const cables = items.filter((i) => i.type === "cable");
  const ixps = items.filter((i) => i.type === "ixp");
  const totalMW = dcs.reduce((s, d) => s + (d.powerMW ?? 0), 0);
  const totalCapGbps = cables.reduce((s, c) => s + (c.capacityGbps ?? 0), 0);
  const totalIxpPeak = ixps.reduce((s, x) => s + (x.peakGbps ?? 0), 0);
  const totalMembers = ixps.reduce((s, x) => s + (x.members ?? 0), 0);

  const stats = [
    { label: "Data Centres", value: dcs.length.toString(), sub: `${totalMW.toFixed(1)} MW IT power` },
    { label: "Cable Capacity", value: formatCapacity(totalCapGbps), sub: `${cables.length} systems` },
    { label: "IXP Members", value: totalMembers.toString(), sub: `${totalIxpPeak} Gbps peak` },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4">
      {stats.map((s) => (
        <div key={s.label} className="glass-card rounded-xl p-3 md:p-4 border-cyan/10">
          <p className="text-section-label mb-1">{s.label}</p>
          <p className="text-foreground text-xl md:text-2xl font-bold tracking-tight">{s.value}</p>
          <p className="text-muted-foreground text-xs mt-1">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}

function Legend() {
  const entries: { type: AssetType; icon: typeof Server; label: string }[] = [
    { type: "datacenter", icon: Server, label: "Data Centre" },
    { type: "cable", icon: Cable, label: "Cable / IXP" },
    { type: "ixp", icon: Network, label: "IXP" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
      {entries.map(({ type, icon: Icon, label }) => (
        <span key={type} className="flex items-center gap-1.5">
          <span className={`inline-block w-2.5 h-2.5 rounded-full ${TYPE_COLORS[type]}`} />
          {label}
        </span>
      ))}
      <span className="flex items-center gap-1.5">
        <span className="inline-block w-5 h-0 border-t border-dashed border-purple-500/60" />
        Terrestrial / Submarine
      </span>
    </div>
  );
}

function FilterBar({
  country, setCountry, typeFilter, setTypeFilter,
  viewMode, setViewMode, search, setSearch,
}: {
  country: CountryFilter; setCountry: (c: CountryFilter) => void;
  typeFilter: TypeFilter; setTypeFilter: (t: TypeFilter) => void;
  viewMode: ViewMode; setViewMode: (v: ViewMode) => void;
  search: string; setSearch: (s: string) => void;
}) {
  const typeButtons: { key: TypeFilter; label: string }[] = [
    { key: "all", label: "All Types" },
    { key: "datacenter", label: "Data Centres" },
    { key: "cable", label: "Cables" },
    { key: "ixp", label: "IXPs" },
  ];

  return (
    <div className="space-y-3">
      {/* Country filter + view toggle row */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <Button size="sm" variant={country === "all" ? "default" : "outline"}
          onClick={() => setCountry("all")}
          className={country === "all" ? "bg-cyan text-cyan-foreground hover:bg-cyan/90 text-xs sm:text-sm" : "text-xs sm:text-sm"}>
          View All
        </Button>
        {ALL_COUNTRIES.map((c) => (
          <Button key={c} size="sm" variant={country === c ? "default" : "outline"}
            onClick={() => setCountry(c)}
            className={country === c ? "bg-cyan text-cyan-foreground hover:bg-cyan/90 text-xs sm:text-sm" : "text-xs sm:text-sm"}>
            {COUNTRY_META[c].flag} <span className="hidden sm:inline">{COUNTRY_META[c].label}</span>
          </Button>
        ))}
        <div className="ml-auto flex items-center gap-1">
          <Button size="sm" variant={viewMode === "map" ? "default" : "ghost"}
            onClick={() => setViewMode("map")}
            className={viewMode === "map" ? "bg-cyan text-cyan-foreground hover:bg-cyan/90" : ""}
            aria-label="Map view">
            <MapIcon className="w-4 h-4" />
          </Button>
          <Button size="sm" variant={viewMode === "list" ? "default" : "ghost"}
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-cyan text-cyan-foreground hover:bg-cyan/90" : ""}
            aria-label="List view">
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {/* Type filter + search row */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {typeButtons.map((t) => (
          <Button key={t.key} size="sm" variant={typeFilter === t.key ? "default" : "outline"}
            onClick={() => setTypeFilter(t.key)}
            className={typeFilter === t.key ? "bg-cyan text-cyan-foreground hover:bg-cyan/90 text-xs sm:text-sm" : "text-xs sm:text-sm"}>
            {t.label}
          </Button>
        ))}
        <div className="relative ml-auto w-full sm:w-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input type="text" placeholder="Search assets…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 sm:h-8 w-full sm:w-48 md:w-56 pl-8 pr-3 text-sm rounded-md bg-surface border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-cyan/50" />
        </div>
      </div>
    </div>
  );
}

function ListView({ items }: { items: InfraItem[] }) {
  if (items.length === 0) {
    return (
      <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">
        No infrastructure assets match your filters.
      </div>
    );
  }
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 text-left">
              <th className="px-4 py-3 text-section-label font-medium">Name</th>
              <th className="px-4 py-3 text-section-label font-medium hidden md:table-cell">City</th>
              <th className="px-4 py-3 text-section-label font-medium hidden lg:table-cell">Country</th>
              <th className="px-4 py-3 text-section-label font-medium">Type</th>
              <th className="px-4 py-3 text-section-label font-medium hidden md:table-cell">Specs</th>
              <th className="px-4 py-3 text-section-label font-medium hidden lg:table-cell">Year</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border/20 hover:bg-cyan/5 transition-colors">
                <td className="px-4 py-3 text-foreground font-medium">{item.name}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{item.city !== "dar" && item.city !== "addis" ? CITIES[item.city]?.name : item.city === "dar" ? "Dar es Salaam" : "Addis Ababa"}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{COUNTRY_META[item.country].flag} {COUNTRY_META[item.country].label}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="text-xs gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${TYPE_COLORS[item.type]}`} />
                    {TYPE_LABELS[item.type]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">
                  {item.type === "datacenter" && `${item.tier} · ${item.powerMW} MW`}
                  {item.type === "cable" && formatCapacity(item.capacityGbps ?? 0)}
                  {item.type === "ixp" && `${item.members} members · ${item.peakGbps} Gbps`}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{item.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DetailPanel({
  city, items, onClose,
}: {
  city: string; items: InfraItem[]; onClose: () => void;
}) {
  const cityName = city === "dar" ? "Dar es Salaam" : city === "addis" ? "Addis Ababa" : CITIES[city]?.name ?? city;
  const country = items[0]?.country;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-xl p-4 md:p-5 w-full md:w-80 lg:w-96 border-cyan/10 max-h-[40vh] md:max-h-[70vh] overflow-y-auto scrollbar-thin md:absolute md:top-4 md:right-4 md:bottom-4 fixed bottom-0 left-0 right-0 md:z-10 rounded-b-none md:rounded-b-xl"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="min-w-0">
          <h3 className="text-foreground font-semibold text-base md:text-lg truncate">{cityName}</h3>
          {country && <p className="text-muted-foreground text-sm">{COUNTRY_META[country].flag} {COUNTRY_META[country].label}</p>}
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 -mr-1 shrink-0 md:p-0">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-2.5">
        {items.map((item) => (
          <a key={item.id} href={item.href ?? "#"} className="block">
            <div className="bg-surface/50 rounded-lg p-3 border border-border/20 hover:border-cyan/20 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full shrink-0 ${TYPE_COLORS[item.type]}`} />
                <span className="text-foreground font-medium text-sm truncate">{item.name}</span>
                {item.href && <ArrowRight className="w-3 h-3 text-muted-foreground ml-auto shrink-0" />}
              </div>
              <p className="text-muted-foreground text-xs mb-2 line-clamp-2">{item.description}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">{TYPE_LABELS[item.type]}</Badge>
                {item.tier && <Badge variant="outline" className="text-[10px] px-1.5 py-0">{item.tier}</Badge>}
                {item.powerMW && <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-cyan" />{item.powerMW} MW</span>}
                {item.capacityGbps != null && <span className="flex items-center gap-1"><Cable className="w-3 h-3 text-purple-400" />{formatCapacity(item.capacityGbps)}</span>}
                {item.members != null && <span className="flex items-center gap-1"><Network className="w-3 h-3 text-emerald-400" />{item.members} members</span>}
                <span className="ml-auto">{item.year}</span>
              </div>
            </div>
          </a>
        ))}
        <a href="/directory">
          <Button variant="outline" size="sm" className="w-full mt-2 border-cyan/20 text-cyan hover:bg-cyan/10 hover:text-cyan">
            View Full Directory <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </a>
      </div>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ───
export default function EastAfricaInfrastructureMap() {
  const [country, setCountry] = useState<CountryFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    let result = ITEMS;
    if (country !== "all") result = result.filter((i) => i.country === country);
    if (typeFilter !== "all") result = result.filter((i) => i.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }
    return result;
  }, [country, typeFilter, search]);

  const cityGroups = useMemo(() => {
    const map = new Map<string, InfraItem[]>();
    for (const item of filteredItems) {
      const arr = map.get(item.city) ?? [];
      arr.push(item);
      map.set(item.city, arr);
    }
    return map;
  }, [filteredItems]);

  const visibleCityIds = useMemo(
    () => new Set(cityGroups.keys()),
    [cityGroups],
  );

  const selectedCityItems = useMemo(
    () => (selectedCity ? cityGroups.get(selectedCity) ?? [] : []),
    [selectedCity, cityGroups],
  );

  const countryPaths = useMemo(
    () =>
      (Object.entries(COUNTRIES) as [CountryKey, [number, number][]][]).map(
        ([key, coords]) => ({ key, d: toPath(coords) }),
      ),
    [],
  );

  const gridLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let lat = -12; lat <= 15; lat += 3) {
      const y = proj(lat, 28).y;
      lines.push({ x1: 0, y1: y, x2: S, y2: y });
    }
    for (let lng = 28; lng <= 43; lng += 3) {
      const x = proj(15, lng).x;
      lines.push({ x1: x, y1: 0, x2: x, y2: S });
    }
    return lines;
  }, []);

  const routeData = useMemo(() => {
    const countriesToShow = country === "all" ? ALL_COUNTRIES : [country];
    const countrySet = new Set(countriesToShow);
    return CABLE_ROUTES.filter((r) => {
      const from = CITIES[r.fromCity];
      const to = CITIES[r.toCity];
      if (from && !countrySet.has(from.country)) return false;
      if (to && !countrySet.has(to.country)) return false;
      if (r.fromCity === "djibouti" && country !== "all" && country !== "ethiopia") return false;
      return true;
    }).map((r) => {
      const pts = r.waypoints.map(([lat, lng]) => proj(lat, lng));
      const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
      return { ...r, d, points: pts };
    });
  }, [country]);

  const handleMarkerClick = useCallback((cityId: string) => {
    setSelectedCity((prev) => (prev === cityId ? null : cityId));
  }, []);

  return (
    <section className="section-y">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <p className="text-section-label mb-3">Infrastructure</p>
          <h2 className="text-display-sm text-foreground mb-3">East Africa Infrastructure Map</h2>
          <p className="text-subtitle-center">Data centres, submarine cables, and internet exchange points across Kenya, Tanzania, Uganda, Rwanda, and Ethiopia.</p>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <StatsPanel items={filteredItems} />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <FilterBar
            country={country} setCountry={setCountry}
            typeFilter={typeFilter} setTypeFilter={setTypeFilter}
            viewMode={viewMode} setViewMode={setViewMode}
            search={search} setSearch={setSearch}
          />
        </div>

        {/* Content */}
        {viewMode === "map" ? (
          <div className="relative">
            <div className="relative bg-[#0a0a0f] rounded-xl border border-border/30 overflow-hidden min-h-[320px] sm:min-h-[400px] md:min-h-[600px]">
              <svg viewBox="0 0 1000 1000" className="w-full h-full absolute inset-0" preserveAspectRatio="xMidYMid meet">
                {/* Grid */}
                {gridLines.map((l, i) => (
                  <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                    stroke="rgba(255,255,255,0.03)" strokeWidth={0.5} />
                ))}
                {/* Countries */}
                {countryPaths.map(({ key, d }) => {
                  const show = country === "all" || country === key;
                  return (
                    <g key={key} opacity={show ? 1 : 0.15}>
                      <path d={d} fill="rgba(6,182,212,0.04)" stroke="rgba(6,182,212,0.12)" strokeWidth={1} />
                    </g>
                  );
                })}
                {/* Cable routes with waypoints */}
                {routeData.map((r) => (
                  <g key={`route-${r.id}`}>
                    <path d={r.d} fill="none"
                      stroke={r.type === "submarine" ? "rgba(168,85,247,0.3)" : "rgba(168,85,247,0.18)"}
                      strokeWidth={1.5} strokeDasharray={r.type === "submarine" ? "8,6" : "6,4"}
                      strokeLinecap="round" strokeLinejoin="round" />
                    {r.type === "submarine" && r.points.length > 1 && (
                      <path d={r.d} fill="none"
                        stroke="rgba(168,85,247,0.08)" strokeWidth={6}
                        strokeLinecap="round" strokeLinejoin="round" />
                    )}
                  </g>
                ))}
                {/* City markers */}
                {Object.entries(CITIES).map(([cityId, city]) => {
                  if (!visibleCityIds.has(cityId)) return null;
                  const { x, y } = proj(city.lat, city.lng);
                  const items = cityGroups.get(cityId) ?? [];
                  const isSelected = selectedCity === cityId;
                  const hasDc = items.some((i) => i.type === "datacenter");
                  const hasCable = items.some((i) => i.type === "cable");
                  const hasIxp = items.some((i) => i.type === "ixp");
                  return (
                    <g key={cityId} className="cursor-pointer" onClick={() => handleMarkerClick(cityId)}>
                      {/* Pulse ring for selected */}
                      {isSelected && (
                        <circle cx={x} cy={y} r={12} fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth={1.5}>
                          <animate attributeName="r" from="8" to="20" dur="1.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                      )}
                      {/* Type indicators - stacked vertically */}
                      {hasDc && (
                        <circle cx={x} cy={y - 8} r={4.5} fill="rgb(6,182,212)" stroke="rgba(6,182,212,0.4)" strokeWidth={1} />
                      )}
                      {hasCable && (
                        <circle cx={x - (hasDc && hasIxp ? 6 : hasDc || hasIxp ? 6 : 0)} cy={y + (hasDc || hasIxp ? 2 : 0)} r={3.5} fill="rgb(168,85,247)" stroke="rgba(168,85,247,0.4)" strokeWidth={1} />
                      )}
                      {hasIxp && (
                        <circle cx={x + (hasDc && hasCable ? 6 : hasDc || hasCable ? 6 : 0)} cy={y + (hasDc || hasCable ? 2 : 0)} r={3.5} fill="rgb(16,185,129)" stroke="rgba(16,185,129,0.4)" strokeWidth={1} />
                      )}
                      {/* Count badge */}
                      <circle cx={x + 10} cy={y - 10} r={7} fill="#0a0a0f" stroke="rgba(6,182,212,0.3)" strokeWidth={0.8} />
                      <text x={x + 10} y={y - 10} textAnchor="middle" dominantBaseline="central"
                        fill="oklch(0.93 0.01 260)" fontSize={8} fontWeight={600}>
                        {items.length}
                      </text>
                      {/* City label */}
                      <text x={x} y={y + 18} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={9} fontWeight={500}>
                        {city.name}
                      </text>
                    </g>
                );
                })}
                {/* Djibouti label for Ethiopia route */}
                {routeData.some((r) => r.fromCity === "djibouti") ? (
                  <g key="djibouti">
                    <circle cx={DJIBOUTI_POS.x} cy={DJIBOUTI_POS.y} r={3} fill="rgb(168,85,247)" opacity={0.5} />
                    <text x={DJIBOUTI_POS.x} y={DJIBOUTI_POS.y + 12} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={8}>Djibouti</text>
                  </g>
                ) : null}
              </svg>
              {/* Detail Panel overlay */}
              <AnimatePresence>
                {selectedCity && selectedCityItems.length > 0 && (
                  <DetailPanel city={selectedCity} items={selectedCityItems} onClose={() => setSelectedCity(null)} />
                )}
              </AnimatePresence>
            </div>
            {/* Legend below map */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <Legend />
              <p className="text-[10px] text-muted-foreground hidden sm:block">
                Simplified borders · Projection: equirectangular
              </p>
            </div>
          </div>
        ) : (
          <ListView items={filteredItems} />
        )}
      </div>
    </section>
  );
}