"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Search, List, MapIcon, ArrowRight, Zap, Cable, Network,
  ChevronRight, Building2, RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  KENYA_FACILITIES, REGION_ITEMS, CONTEXT_CITIES, SUBSEA_CABLES,
  LANDING_STATION, KIXP, LIVE_MW, PIPELINE_MW,
  type DcStatus, type KenyaFacility,
} from "@/lib/map-data";
import { SUBSEA_CABLES as CABLE_REGISTER } from "@/lib/market-trackers";
import { CYAN, NEON, AMBER, STATUS_COLOR } from "./map/shared";
import { CountryMap } from "./map/country-map";
import { NairobiMap, MombasaMap } from "./map/metro-maps";

type DcCity = KenyaFacility["city"];
const CITY_LABEL: Record<DcCity, string> = { nairobi: "Nairobi", mombasa: "Mombasa", thika: "Thika", limuru: "Limuru", konza: "Konza" };

type Mode = "country" | "nairobi" | "mombasa";
type ViewMode = "map" | "list";
type TypeFilter = "all" | "datacenter" | "cable" | "ixp";

const CITY_NAMES: Record<string, string> = {
  dar: "Dar es Salaam, Tanzania",
  kampala: "Kampala, Uganda",
  kigali: "Kigali, Rwanda",
  addis: "Addis Ababa, Ethiopia",
};

// ─── STATS ──────────────────────────────────────────────────────────────────

/** Ease-out count-up on mount. SSR renders the final value; the animation
 *  is a client-only polish. Respects prefers-reduced-motion. */
function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const duration = 900;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setDisplay(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{format(display)}</>;
}

function StatsBand() {
  const ops = KENYA_FACILITIES.filter((f) => f.status === "Operational").length;
  const nbo = KENYA_FACILITIES.filter((f) => f.metro === "nairobi").length;
  const int = (n: number) => String(Math.round(n));
  const stats = [
    { label: "Facilities", value: KENYA_FACILITIES.length, format: int, sub: `${ops} operational · ${nbo} in Nairobi metro` },
    { label: "Mapped live capacity", value: LIVE_MW, format: (n: number) => `${n.toFixed(1)} MW`, sub: `of ${PIPELINE_MW} MW announced pipeline` },
    { label: "Subsea cables", value: CABLE_REGISTER.filter((c) => c.status === "In service").length, format: int, sub: `in service of ${CABLE_REGISTER.length} tracked systems` },
    { label: "KIXP Nairobi", value: KIXP.members, format: int, sub: `members · ~${(KIXP.peakGbps / 1000).toFixed(1)} Tbps peak` },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="glass-card rounded-xl p-3 md:p-4 border-cyan/10">
          <p className="text-section-label mb-1">{s.label}</p>
          <p className="text-foreground text-xl md:text-2xl font-bold tracking-tight tabular-nums">
            <CountUp value={s.value} format={s.format} />
          </p>
          <p className="text-muted-foreground text-xs mt-1">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ─── PANELS ─────────────────────────────────────────────────────────────────

function PanelShell({ title, subtitle, onClose, children }: {
  title: string; subtitle?: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="glass-card rounded-xl p-4 md:p-5 w-full md:w-[340px] border-cyan/10 max-h-[46vh] md:max-h-[calc(100%-2rem)] overflow-y-auto scrollbar-thin md:absolute md:top-4 md:right-4 md:left-auto md:bottom-4 fixed bottom-0 left-0 right-0 md:z-10 rounded-b-none md:rounded-b-xl"
    >
      <div className="flex items-start justify-between mb-4 gap-2">
        <div className="min-w-0">
          <h3 className="text-foreground font-semibold text-base md:text-lg leading-tight">{title}</h3>
          {subtitle && <p className="text-muted-foreground text-xs mt-1">{subtitle}</p>}
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 -mr-1 shrink-0" aria-label="Close panel">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-2.5">{children}</div>
    </motion.div>
  );
}

function StatusChip({ status }: { status: DcStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <span className="inline-block w-2 h-2 rounded-full" style={{ background: STATUS_COLOR[status] }} />
      {status}
    </span>
  );
}

function FacilityCard({ f }: { f: KenyaFacility }) {
  return (
    <a href="/directory" className="block group">
      <div className="bg-surface/50 rounded-lg p-3.5 border border-border/20 hover:border-cyan/30 transition-colors">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: STATUS_COLOR[f.status] }} />
          <span className="text-foreground font-medium text-sm truncate">{f.name}</span>
          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto shrink-0 group-hover:text-cyan transition-colors" />
        </div>
        <p className="text-muted-foreground text-xs mb-2.5">{f.operator}</p>
        {f.note && <p className="text-muted-foreground text-xs mb-2.5 leading-relaxed">{f.note}</p>}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">{f.tier}</Badge>
          <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-cyan" />{f.totalMW > 0 ? `${f.totalMW} MW` : "MW n/p"}</span>
          {f.racks != null && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{f.racks} racks</span>}
          {f.aiReady && <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-cyan/30 text-cyan">AI-ready</Badge>}
        </div>
      </div>
    </a>
  );
}

function CityAssetRow({ item }: { item: (typeof REGION_ITEMS)[number] }) {
  return (
    <div className="bg-surface/50 rounded-lg p-3 border border-border/20">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.type === "ixp" ? NEON : CYAN }} />
        <span className="text-foreground font-medium text-sm truncate">{item.name}</span>
        <span className="ml-auto text-[10px] text-muted-foreground shrink-0">{item.year}</span>
      </div>
      <p className="text-muted-foreground text-xs mb-2">{item.description}</p>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{item.type === "ixp" ? "IXP" : "Data centre"}</Badge>
        {item.powerMW && <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-cyan" />{item.powerMW} MW</span>}
        {item.members != null && <span className="flex items-center gap-1"><Network className="w-3 h-3 text-neon" />{item.members} members</span>}
        {item.peakGbps != null && <span>{item.peakGbps} Gbps peak</span>}
      </div>
    </div>
  );
}

// ─── LEGEND ─────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: NEON }} />Operational</span>
      <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: AMBER }} />Under construction</span>
      <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-full border border-dashed" style={{ borderColor: CYAN }} />Announced</span>
      <span className="flex items-center gap-1.5"><span className="inline-block w-5 h-0.5 rounded-full" style={{ background: CYAN }} />Subsea cable</span>
      <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rotate-45" style={{ background: "oklch(0.72 0.15 305)" }} />PIDA project (continental registry)</span>
      <span className="flex items-center gap-1.5"><span className="inline-block w-5 border-t border-dashed border-foreground/40" />Terrestrial fibre</span>
    </div>
  );
}

// ─── MAIN ───────────────────────────────────────────────────────────────────

export default function EastAfricaInfrastructureMap() {
  const [mode, setMode] = useState<Mode>("country");
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | DcStatus>("all");
  const [search, setSearch] = useState("");
  const [cityPanel, setCityPanel] = useState<string | null>(null);
  const [facilityPanel, setFacilityPanel] = useState<KenyaFacility | null>(null);
  // Cable traced from the country map OR the side-rail cable list -
  // one shared state keeps both highlights in sync.
  const [activeCable, setActiveCable] = useState<string | null>(null);

  const q = search.trim().toLowerCase();

  const facilityVisible = useMemo(() => {
    const set = new Set<string>();
    for (const f of KENYA_FACILITIES) {
      const okStatus = statusFilter === "all" || f.status === statusFilter;
      const okSearch = !q || f.name.toLowerCase().includes(q) || f.operator.toLowerCase().includes(q) || (f.note ?? "").toLowerCase().includes(q);
      if (okStatus && okSearch) set.add(f.id);
    }
    return set;
  }, [statusFilter, q]);

  const dimmedFacilities = useMemo(() => {
    const set = new Set<string>();
    for (const f of KENYA_FACILITIES) if (!facilityVisible.has(f.id)) set.add(f.id);
    return set;
  }, [facilityVisible]);

  const dimmedMapKeys = useMemo(() => {
    const set = new Set<string>(dimmedFacilities);
    if (typeFilter === "cable") set.add("datacenter");
    if (typeFilter === "datacenter" || typeFilter === "ixp") { set.add("cable"); set.add("cable-live"); set.add("cable-dev"); }
    if (typeFilter === "cable") { set.delete("cable"); set.add("ixp"); }
    if (q) {
      for (const c of SUBSEA_CABLES) {
        if (!c.name.toLowerCase().includes(q)) { set.add("cable-live"); set.add("cable-dev"); set.add(c.live ? "cable-live" : "cable-dev"); }
      }
    }
    return set;
  }, [dimmedFacilities, typeFilter, q]);

  const metroDimmed = useMemo(() => {
    const set = new Set<string>(dimmedFacilities);
    if (typeFilter === "cable") for (const f of KENYA_FACILITIES) set.add(f.id);
    return set;
  }, [dimmedFacilities, typeFilter]);

  const reset = () => { setMode("country"); setCityPanel(null); setFacilityPanel(null); };

  const openMetro = (m: "nairobi" | "mombasa") => { setMode(m); setCityPanel(null); };

  const listRows = useMemo(() => {
    const rows: { id: string; name: string; loc: string; type: string; status: string | null; statusColor: string | null; specs: string; year: number | null }[] = [];
    for (const f of KENYA_FACILITIES) {
      rows.push({
        id: f.id, name: f.name, loc: CITY_LABEL[f.city], type: "datacenter",
        status: f.status, statusColor: STATUS_COLOR[f.status],
        specs: `${f.tier} · ${f.totalMW > 0 ? `${f.totalMW} MW` : "MW n/p"}${f.racks ? ` · ${f.racks} racks` : ""}`, year: f.openedYear,
      });
    }
    for (const c of SUBSEA_CABLES) {
      rows.push({
        id: c.id, name: c.name, loc: "Mombasa landing", type: "cable",
        status: c.live ? "Operational" : "In development", statusColor: c.live ? NEON : AMBER,
        specs: c.designTbps ? `${c.designTbps} Tbps design capacity` : "Route in survey", year: c.year,
      });
    }
    rows.push({ id: "kixp", name: "KIXP Nairobi", loc: "Nairobi", type: "ixp", status: "Operational", statusColor: NEON, specs: `${KIXP.members} members · ${KIXP.peakGbps} Gbps peak`, year: KIXP.year });
    for (const it of REGION_ITEMS) {
      rows.push({
        id: it.id, name: it.name, loc: CITY_NAMES[it.city] ?? it.city,
        type: it.type, status: null, statusColor: null,
        specs: it.powerMW ? `${it.powerMW} MW` : `${it.members} members · ${it.peakGbps} Gbps peak`, year: it.year,
      });
    }
    return rows.filter((r) => {
      const okType = typeFilter === "all" || r.type === typeFilter;
      const okSearch = !q || r.name.toLowerCase().includes(q) || r.loc.toLowerCase().includes(q);
      return okType && okSearch;
    });
  }, [typeFilter, q]);

  const typeChips: { key: TypeFilter; label: string }[] = [
    { key: "all", label: "All assets" },
    { key: "datacenter", label: "Data centres" },
    { key: "cable", label: "Cables" },
    { key: "ixp", label: "IXPs" },
  ];
  const statusChips: { key: "all" | DcStatus; label: string }[] = [
    { key: "all", label: "Any status" },
    { key: "Operational", label: "Operational" },
    { key: "Under Construction", label: "In construction" },
    { key: "Committed", label: "Committed" },
    { key: "Early Stage", label: "Early stage" },
  ];

  return (
    <section className="section-y">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <p className="text-section-label mb-3 text-center">Infrastructure · Interactive map</p>
          <h2 className="text-display-sm text-foreground mb-3 text-center">Every data centre in Kenya, mapped</h2>
          <p className="text-subtitle-center">
            Twenty-seven facilities in Kenya, ten tracked submarine cable systems (seven in service), and the fibre backbone
            that connects them, with the wider East African region for context.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <StatsBand />
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-3">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {typeChips.map((t) => (
              <Button key={t.key} size="sm" variant={typeFilter === t.key ? "default" : "outline"}
                onClick={() => setTypeFilter(t.key)}
                className={typeFilter === t.key ? "bg-cyan text-cyan-foreground hover:bg-cyan/90 text-xs sm:text-sm" : "text-xs sm:text-sm"}>
                {t.label}
              </Button>
            ))}
            <span className="w-px h-5 bg-border/60 mx-1 hidden sm:block" />
            {statusChips.map((s) => (
              <Button key={s.key} size="sm" variant={statusFilter === s.key ? "default" : "outline"}
                onClick={() => setStatusFilter(s.key)}
                className={statusFilter === s.key ? "bg-cyan text-cyan-foreground hover:bg-cyan/90 text-xs sm:text-sm" : "text-xs sm:text-sm"}>
                {s.label}
              </Button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input type="text" placeholder="Search facilities…" value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 sm:h-8 w-40 sm:w-48 pl-8 pr-3 text-sm rounded-md bg-surface border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-cyan/50" />
              </div>
              <div className="flex items-center gap-1">
                <Button size="sm" variant={viewMode === "map" ? "default" : "ghost"} onClick={() => setViewMode("map")}
                  className={viewMode === "map" ? "bg-cyan text-cyan-foreground hover:bg-cyan/90" : ""} aria-label="Map view">
                  <MapIcon className="w-4 h-4" />
                </Button>
                <Button size="sm" variant={viewMode === "list" ? "default" : "ghost"} onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-cyan text-cyan-foreground hover:bg-cyan/90" : ""} aria-label="List view">
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {viewMode === "list" ? (
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-left">
                    <th className="px-4 py-3 text-section-label font-medium">Name</th>
                    <th className="px-4 py-3 text-section-label font-medium">Location</th>
                    <th className="px-4 py-3 text-section-label font-medium">Type</th>
                    <th className="px-4 py-3 text-section-label font-medium">Status</th>
                    <th className="px-4 py-3 text-section-label font-medium hidden md:table-cell">Specs</th>
                    <th className="px-4 py-3 text-section-label font-medium hidden lg:table-cell text-right">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {listRows.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">Nothing matches “{search}”.</td></tr>
                  )}
                  {listRows.map((r) => (
                    <tr key={r.id} className="border-b border-border/20 hover:bg-cyan/5 transition-colors">
                      <td className="px-4 py-3 text-foreground font-medium whitespace-nowrap">{r.name}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{r.loc}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs gap-1.5">
                          {r.type === "datacenter" ? <Building2 className="w-3 h-3" /> : r.type === "cable" ? <Cable className="w-3 h-3" /> : <Network className="w-3 h-3" />}
                          {r.type === "datacenter" ? "Data centre" : r.type === "cable" ? "Cable" : "IXP"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {r.status ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: r.statusColor ?? NEON }} />{r.status}
                          </span>
                        ) : <span className="text-xs text-muted-foreground">Regional</span>}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell whitespace-nowrap">{r.specs}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell text-right">{r.year ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] items-start">
            <div className="relative">
              <div
                className="relative rounded-xl border border-border/30 overflow-hidden h-[480px] sm:h-[600px] md:h-[740px]"
                style={{ background: "radial-gradient(120% 90% at 50% 38%, #0a1526 0%, #070d18 55%, #04080e 100%)" }}
              >
              {/* faint tech grid */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: "linear-gradient(oklch(0.78 0.14 195 / 0.045) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.14 195 / 0.045) 1px, transparent 1px)",
                  backgroundSize: "54px 54px",
                }}
              />
              {/* breadcrumb / back */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
                {mode !== "country" && (
                  <button onClick={reset}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground bg-[#0b1424]/85 border border-border/40 rounded-md px-2.5 py-1.5 backdrop-blur transition-colors">
                    <RotateCcw className="w-3 h-3" /> East Africa
                  </button>
                )}
                <span className="flex items-center gap-1.5 text-xs bg-[#0b1424]/85 border border-cyan/20 text-cyan rounded-md px-2.5 py-1.5 backdrop-blur">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style={{ background: NEON }} />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: NEON }} />
                  </span>
                  {mode === "country" ? "East Africa" : mode === "nairobi" ? "Nairobi metro" : "Mombasa metro"}
                  {mode !== "country" && <ChevronRight className="w-3 h-3" />}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.985 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  {mode === "country" && (
                    <CountryMap
                      dimmed={dimmedMapKeys}
                      activeCable={activeCable}
                      onHoverCable={setActiveCable}
                      onOpenNairobi={() => openMetro("nairobi")}
                      onOpenMombasa={() => openMetro("mombasa")}
                      onOpenCity={(id) => setCityPanel((p) => (p === id ? null : id))}
                    />
                  )}
                  {mode === "nairobi" && <NairobiMap dimmed={metroDimmed} selectedId={facilityPanel?.id ?? null} onFacility={(f) => setFacilityPanel((p) => (p?.id === f.id ? null : f))} />}
                  {mode === "mombasa" && <MombasaMap dimmed={metroDimmed} forcedCable={activeCable} selectedId={facilityPanel?.id ?? null} onFacility={(f) => setFacilityPanel((p) => (p?.id === f.id ? null : f))} />}
                </motion.div>
              </AnimatePresence>

              {/* vignette */}
              <div
                className="absolute inset-0 pointer-events-none z-[5]"
                style={{ boxShadow: "inset 0 0 110px 24px rgba(3, 6, 12, 0.72)" }}
              />

              {/* Panels */}
              <AnimatePresence>
                {mode === "nairobi" && facilityPanel && (
                  <PanelShell title={facilityPanel.name} subtitle={`${facilityPanel.operator} · ${CITY_LABEL[facilityPanel.city]}`} onClose={() => setFacilityPanel(null)}>
                    <FacilityCard f={facilityPanel} />
                    <a href="/directory">
                      <Button variant="outline" size="sm" className="w-full mt-2 border-cyan/20 text-cyan hover:bg-cyan/10 hover:text-cyan">
                        Browse all {KENYA_FACILITIES.length} in the directory <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </a>
                  </PanelShell>
                )}
                {mode === "mombasa" && facilityPanel && (
                  <PanelShell title={facilityPanel.name} subtitle={`${facilityPanel.operator} · Mombasa`} onClose={() => setFacilityPanel(null)}>
                    <FacilityCard f={facilityPanel} />
                    <div className="bg-surface/50 rounded-lg p-3 border border-border/20 text-xs text-muted-foreground leading-relaxed">
                      Six of the seven in-service cable systems (SEACOM, TEAMS, EASSy, LION2, DARE1 and PEACE) come
                      ashore here, with 2Africa also in service since 2024 and Meta&rsquo;s Daraja in development.
                      Mombasa is Kenya&rsquo;s single point of contact with the global internet.
                    </div>
                  </PanelShell>
                )}
                {mode === "country" && cityPanel && (
                  <PanelShell
                    title={CONTEXT_CITIES.find((c) => c.id === cityPanel)?.name ?? cityPanel}
                    subtitle={CITY_NAMES[cityPanel]}
                    onClose={() => setCityPanel(null)}
                  >
                    {REGION_ITEMS.filter((i) => i.city === cityPanel).map((i) => <CityAssetRow key={i.id} item={i} />)}
                    <p className="text-[11px] text-muted-foreground pt-1">Tracked in summary, DC254 profiles focus on Kenya.</p>
                  </PanelShell>
                )}
              </AnimatePresence>
            </div>
            </div>

            {/* Side rail */}
            <aside className="space-y-4 lg:sticky lg:top-24">
              <div className="glass-card rounded-xl p-4 border-cyan/10">
                <p className="text-section-label mb-3">How to read this map</p>
                <ul className="space-y-2.5 text-xs text-muted-foreground leading-relaxed">
                  <li className="flex gap-2"><span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: CYAN }} /><span>Bubble sizes mark the big clusters, tap <span className="text-foreground font-medium">Nairobi</span> or <span className="text-foreground font-medium">Mombasa</span> to zoom in.</span></li>
                  <li className="flex gap-2"><span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: NEON }} /><span>Dot colours show status: green live, amber building, dashed cyan announced.</span></li>
                  <li className="flex gap-2"><span className="inline-block w-4 h-0.5 mt-1.5 shrink-0 rounded-full" style={{ background: CYAN }} /><span>Solid cyan lines are the {SUBSEA_CABLES.filter((c) => c.live).length} in-service cable routes (of {CABLE_REGISTER.length} tracked systems), dashed amber routes are still in development, dotted lines are terrestrial fibre.</span></li>
                  <li className="flex gap-2"><span className="w-2 h-2 rounded-full mt-1.5 shrink-0 border border-dashed" style={{ borderColor: CYAN }} /><span>Hover any cable — on the map or in the cable list — to trace its route.</span></li>
                </ul>
              </div>
              <div className="glass-card rounded-xl p-4 border-cyan/10">
                <p className="text-section-label mb-3">Cables landing in Mombasa</p>
                <ul className="divide-y divide-border/30">
                  {SUBSEA_CABLES.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onMouseEnter={() => setActiveCable(c.id)}
                        onMouseLeave={() => setActiveCable(null)}
                        onFocus={() => setActiveCable(c.id)}
                        onBlur={() => setActiveCable(null)}
                        onClick={() => setMode("country")}
                        aria-label={`${c.name}, ${c.designTbps ? `${c.designTbps} terabits per second design capacity` : "in development"}, ${c.live ? "in service" : "in development"} since ${c.year}, trace route on map`}
                        className={`flex w-full items-center gap-2 py-2 text-xs rounded-md px-1.5 -mx-1.5 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan/50 ${activeCable === c.id ? "bg-cyan/10" : "hover:bg-cyan/5"}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.live ? CYAN : AMBER }} />
                        <span className={`font-medium transition-colors ${activeCable === c.id ? "text-cyan" : "text-foreground"}`}>{c.name}</span>
                        <span className="text-muted-foreground ml-auto whitespace-nowrap">
                          {c.designTbps ? `${c.designTbps} Tbps` : "in development"} · {c.year}
                        </span>
                        <ChevronRight className={`w-3 h-3 shrink-0 transition-all ${activeCable === c.id ? "text-cyan translate-x-0.5" : "text-muted-foreground/50"}`} />
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-[10px] leading-snug text-muted-foreground/70">
                  Hover a cable to trace its route on the map. The cable tracker also lists LuLu (planned, 2026).
                </p>
              </div>
              <a href="/infrastructure" className="block glass-card rounded-xl p-4 border-cyan/10 hover:border-cyan/30 transition-colors group">
                <p className="text-section-label mb-2">Deep dive</p>
                <p className="text-sm text-foreground font-medium flex items-center gap-1">
                  Kenya&rsquo;s connectivity stack
                  <ArrowRight className="w-3.5 h-3.5 text-cyan group-hover:translate-x-0.5 transition-transform" />
                </p>
                <p className="text-xs text-muted-foreground mt-1">Cables, IXPs and fibre, explained for builders.</p>
              </a>
            </aside>
          </div>

            {/* Legend + note */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <Legend />
              <p className="text-[10px] text-muted-foreground hidden sm:block">
                Natural Earth borders (indicative) · facility positions schematic · verified Aug 2026
              </p>
            </div>
          </>
        )}

        {/* CTA */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href="/directory">
            <Button className="bg-cyan text-cyan-foreground hover:bg-cyan/90">
              Browse the full directory <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </a>
          <a href="/infrastructure">
            <Button variant="outline" className="border-cyan/20 text-cyan hover:bg-cyan/10 hover:text-cyan">
              How Kenya connects <Cable className="w-4 h-4 ml-1" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
