"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, SlidersHorizontal, X, Building2, Zap, Server,
  MapPin, Shield, Globe, ArrowUpDown, Database, Wifi,
  AlertTriangle, CheckCircle, Clock, HardHat, Megaphone, ShieldCheck,
  GitCompareArrows, ExternalLink, Landmark,
  type LucideIcon,
} from "lucide-react";
import CompareTray from "@/components/compare/compare-tray";
import { useCompareSelection } from "@/components/compare/use-compare-selection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { SUBSEA_CABLES, type CableRecord, type CableStatus } from "@/lib/market-trackers";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface ConnectivityProvider { name: string; type: string }
interface Cert { certification: { name: string; type: string } }
interface Op { name: string; slug: string; type: string; parentCompany: string | null }

interface Facility {
  id: string; name: string; slug: string; description: string | null;
  status: string; address: string | null; city: string; region: string;
  country?: string;
  itLoadMw: number | null; totalCapacityMw: number | null; rackCount: number | null;
  tierRating: string | null; facilityType: string | null; aiReady: boolean;
  openedDate: string | null; expansionDate: string | null;
  coolingType: string | null; powerSource: string | null;
  renewableClaim: string | null; notable: string | null;
  lastVerified: string | null; dataSource: string | null; dataConfidence: string;
  articleSlugs?: string[];
  sources?: { label: string; url: string; kind: "operator" | "registry" | "press" | "gov" }[];
  peeringdbFacId?: number; peeringdbNetworks?: number; peeringdbIxs?: number;
  carrierNeutral?: boolean;
  certNote?: string | null; divergenceNote?: string | null;
  operator: Op;
  connectivityFacility: { provider: ConnectivityProvider }[];
  certifications: Cert[];
}

interface FilterMeta {
  operators: { id: string; name: string }[];
  statuses: { value: string; count: number }[];
  cities: string[]; types: string[]; countries?: string[];
}

interface DirStats { totalFacilities: number; operationalCount: number; totalMw: number; totalRacks: number; aiReadyCount: number; carrierNeutralCount: number; }
interface ScopeStats {
  count: number; operational: number; underConstruction: number; committed: number;
  earlyStage: number; publishedItLoadMw: number; designedMw: number; announcedMw: number; racks: number;
  aiReady: number; carrierNeutral: number; countries: string[]; operators: number;
}
interface DirData { facilities: Facility[]; filters: FilterMeta; stats: DirStats; scopeStats: ScopeStats; tab: string; }

/** The four audit-recommended views of the dataset. */
type DirTab = "kenya" | "ea" | "pipeline" | "cables";

const TABS: { id: DirTab; label: string; hint: string }[] = [
  { id: "kenya", label: "Kenya", hint: "verified facilities in Kenya" },
  { id: "ea", label: "East Africa", hint: "regional reference records" },
  { id: "pipeline", label: "Pipeline", hint: "announced Kenyan capacity, by stage" },
  { id: "cables", label: "Cables", hint: "subsea systems at the coast" },
];

const CABLE_STATUS_META: Record<CableStatus, { badge: string }> = {
  "In service": { badge: "border-neon/25 text-neon bg-neon/10" },
  "Landed, RFS pending": { badge: "border-amber-500/25 text-amber-500 bg-amber-500/10" },
  Announced: { badge: "border-cyan/25 text-cyan bg-cyan/10" },
  Planned: { badge: "border-border text-muted-foreground bg-accent/50" },
};

const CABLE_STATUS_ORDER: CableStatus[] = ["In service", "Landed, RFS pending", "Announced", "Planned"];

const statusCfg: Record<string, { color: string; bg: string; icon: LucideIcon }> = {
  Operational: { color: "text-neon", bg: "bg-neon/10 border-neon/25", icon: CheckCircle },
  "Under Construction": { color: "text-cyan", bg: "bg-cyan/10 border-cyan/25", icon: HardHat },
  Committed: { color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/25", icon: ShieldCheck },
  "Early Stage": { color: "text-muted-foreground", bg: "bg-accent/50 border-border", icon: Megaphone },
  Planned: { color: "text-muted-foreground", bg: "bg-accent/50 border-border", icon: Clock },
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmtVerified(v: string | null): string | null {
  if (!v) return null;
  const [y, m] = v.split("-");
  const mi = parseInt(m, 10) - 1;
  if (!y || isNaN(mi) || !MONTHS[mi]) return v;
  return `${MONTHS[mi]} ${y}`;
}

function cableRows(search: string): CableRecord[] {
  const q = search.trim().toLowerCase();
  if (!q) return SUBSEA_CABLES;
  return SUBSEA_CABLES.filter((c) =>
    c.name.toLowerCase().includes(q) ||
    (c.longName || "").toLowerCase().includes(q) ||
    c.owners.toLowerCase().includes(q) ||
    c.kenyanLandings.some((l) => l.toLowerCase().includes(q))
  );
}

/**
 * The subsea-cable register, compact form: same data and counting rule as
 * /tracker/cables, grouped by status so the live count stays honest
 * (in service ≠ landed ≠ announced).
 */
function CableRegister({ search }: { search: string }) {
  const rows = cableRows(search);
  return (
    <div className="space-y-8">
      {CABLE_STATUS_ORDER.map((status) => {
        const group = rows.filter((c) => c.status === status);
        if (!group.length) return null;
        return (
          <div key={status}>
            <p className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              <span className={`inline-block rounded-full border px-2 py-0.5 text-[9px] font-bold ${CABLE_STATUS_META[status].badge}`}>{status}</span>
              {group.length} system{group.length === 1 ? "" : "s"}
            </p>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {group.map((c) => (
                <article key={c.name} className="card-solid rounded-xl p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-foreground leading-snug">{c.name}</h3>
                      {c.longName && <p className="text-xs text-muted-foreground mt-0.5">{c.longName}</p>}
                    </div>
                    <Badge variant="outline" className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${CABLE_STATUS_META[c.status].badge}`}>
                      {c.rfsDate ? `RFS ${c.rfsDate}` : "no RFS date"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><MapPin className="size-3.5 text-cyan" />{c.kenyanLandings.join(" · ")}</span>
                    <span className="flex items-center gap-1.5"><Globe className="size-3.5 text-cyan" />{c.owners}</span>
                    {c.designCapacity && <span className="flex items-center gap-1.5"><Wifi className="size-3.5 text-cyan" />{c.designCapacity}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.note}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className={`size-1.5 rounded-full ${c.dataConfidence === "High" ? "bg-neon" : c.dataConfidence === "Medium" ? "bg-amber-500" : "bg-red-400"}`} aria-hidden="true" />
                      {c.dataConfidence} confidence · verified {c.lastVerified}
                    </span>
                    {c.dc254Article && (
                      <Link href={`/articles/${c.dc254Article}`} className="inline-flex items-center gap-1 text-cyan hover:text-cyan underline underline-offset-2">
                        full explainer <ExternalLink className="size-3" />
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        );
      })}
      {rows.length === 0 && (
        <div className="card-solid rounded-xl p-8 text-center">
          <p className="text-muted-foreground">No cable system matches &ldquo;{search}&rdquo;.</p>
        </div>
      )}
      <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
        The counting rule: a cable joins the live count on ready-for-service,
        not on landing. Landed-but-pending and announced systems are tracked
        so the pipeline stays visible, never counted. Owner-reported design
        capacity sits far above lit capacity, which is not published and is
        deliberately not estimated. Full register, sources and methodology on
        the <Link href="/tracker/cables" className="text-cyan underline hover:underline">cable tracker</Link>.
      </p>
    </div>
  );
}

export default function DirectorySection({
  initialSearch = "",
  tabCounts,
}: {
  initialSearch?: string;
  tabCounts: { kenya: number; ea: number; pipeline: number };
}) {
  const [data, setData] = useState<DirData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(initialSearch);
  const [tab, setTab] = useState<DirTab>("kenya");
  const [status, setStatus] = useState("all");
  const [operator, setOperator] = useState("all");
  const [country, setCountry] = useState("all");
  const [facilityType, setFacilityType] = useState("all");
  const [sortBy, setSortBy] = useState("itLoadMw");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const { slugs: compareSlugs, toggle: toggleCompare } = useCompareSelection();
  const compareSet = new Set(compareSlugs);

  const fetchDir = useCallback(async () => {
    try {
      const p = new URLSearchParams();
      p.set("tab", tab);
      if (search) p.set("search", search);
      if (status !== "all") p.set("status", status);
      if (operator !== "all") p.set("operator", operator);
      if (country !== "all") p.set("country", country);
      if (facilityType !== "all") p.set("type", facilityType);
      p.set("sortBy", sortBy); p.set("sortOrder", sortOrder);
      const r = await fetch(`/api/directory?${p}`);
      if (!r.ok) throw new Error();
      setData(await r.json());
    } catch { setError("Could not load directory data"); }
    finally { setLoading(false); }
  }, [tab, search, status, operator, country, facilityType, sortBy, sortOrder]);

  useEffect(() => { if (tab === "cables") { setLoading(false); return; } setLoading(true); setError(null); const t = setTimeout(fetchDir, 300); return () => clearTimeout(t); }, [fetchDir, tab]);
  useEffect(() => { fetchDir(); }, []);

  const switchTab = (next: DirTab) => {
    setTab(next);
    // Reset scope-dependent filters so a tab always opens on its full scope.
    setCountry("all"); setStatus("all"); setOperator("all"); setFacilityType("all");
    if (next === "pipeline") setSortBy("stage");
    else if (sortBy === "stage") setSortBy("itLoadMw");
  };

  const activeCount = [status !== "all", operator !== "all", country !== "all", facilityType !== "all"].filter(Boolean).length;

  return (
    <section id="directory" className="py-14 lg:py-20">
      <div className="container-site">

        {/* Header, left-aligned, editorial */}
        <div className="max-w-2xl">
          <span className="eyebrow">Kenya &amp; East Africa DC Directory</span>
          <h1 className="h-display mt-3 text-foreground">Every data centre in one place.</h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            One dataset, four views: the verified Kenyan facilities, the East
            African reference records, the announced capacity pipeline and the
            subsea cables at the coast. Every row verified and sourced, the
            asset that makes Data Centre 254 different.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Shield className="size-3.5 text-neon" />
              Dataset last verified: September 2026
            </span>
            <Link href="/methodology" className="text-cyan underline hover:underline">
              How we verify →
            </Link>
          </div>
        </div>

        {/* Tabs, the four audit-recommended views of the dataset */}
        <div className="mt-8 flex flex-wrap items-center gap-2" role="tablist" aria-label="Directory views">
          {TABS.map((t) => {
            const count = t.id === "cables" ? SUBSEA_CABLES.length : tabCounts[t.id];
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                title={t.hint}
                onClick={() => switchTab(t.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "border-cyan/40 bg-cyan/10 text-cyan"
                    : "border-border/60 text-muted-foreground hover:border-cyan/30 hover:text-foreground"
                }`}
              >
                {t.label}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                  active ? "bg-cyan/20 text-cyan" : "bg-accent/60 text-muted-foreground"
                }`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Stats, scoped to the active tab so each number keeps its canonical label */}
        {tab === "cables" ? (() => {
          const inService = SUBSEA_CABLES.filter((c) => c.status === "In service").length;
          const landed = SUBSEA_CABLES.filter((c) => c.status === "Landed, RFS pending").length;
          const dev = SUBSEA_CABLES.filter((c) => c.status === "Announced" || c.status === "Planned").length;
          const landings = new Set(SUBSEA_CABLES.flatMap((c) => c.kenyanLandings));
          const cards = [
            { label: "Systems tracked", value: String(SUBSEA_CABLES.length), icon: Database },
            { label: "In service", value: String(inService), icon: CheckCircle },
            { label: "Landed, RFS pending", value: String(landed), icon: Clock },
            { label: "Announced / planned", value: String(dev), icon: Megaphone },
            { label: "Kenyan landing points", value: String(landings.size), icon: MapPin },
            { label: "Dataset verified", value: "Sep 2026", icon: Shield },
          ];
          return (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {cards.map((s) => { const Icon = s.icon; return (
                <div key={s.label} className="card-solid rounded-xl p-4">
                  <Icon className="size-4 text-cyan mb-2" />
                  <p className="text-lg sm:text-xl font-semibold text-foreground tabular-nums">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
                </div>); })}
            </div>
          );
        })() : data && !loading && (() => {
          const sc = data.scopeStats;
          const cards: { label: string; value: string; icon: LucideIcon }[] =
            tab === "kenya" ? [
              { label: "Facilities in Kenya", value: String(sc.count), icon: Database },
              { label: "Operational", value: String(sc.operational), icon: CheckCircle },
              { label: "Published IT load", value: `${sc.publishedItLoadMw.toFixed(1)} MW`, icon: Zap },
              { label: "Live designed capacity", value: `${sc.designedMw.toFixed(1)} MW`, icon: Landmark },
              { label: "Total racks", value: sc.racks > 0 ? sc.racks.toLocaleString() : "--", icon: Server },
              { label: "AI-ready", value: String(sc.aiReady), icon: Wifi },
            ] : tab === "ea" ? [
              { label: "Regional records", value: String(sc.count), icon: Database },
              { label: "Operational", value: String(sc.operational), icon: CheckCircle },
              { label: "Under construction", value: String(sc.underConstruction), icon: HardHat },
              { label: "Countries covered", value: String(sc.countries.length), icon: Globe },
              { label: "Operators on record", value: String(sc.operators), icon: Building2 },
              { label: "Dataset verified", value: "Sep 2026", icon: Shield },
            ] : [
              { label: "Pipeline projects", value: String(sc.count), icon: Database },
              { label: "Announced pipeline", value: `${sc.announcedMw.toFixed(1)} MW`, icon: Zap },
              { label: "Under construction", value: String(sc.underConstruction), icon: HardHat },
              { label: "Committed", value: String(sc.committed), icon: ShieldCheck },
              { label: "Early stage", value: String(sc.earlyStage), icon: Megaphone },
              { label: "Dataset verified", value: "Sep 2026", icon: Shield },
            ];
          return (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {cards.map((s) => { const Icon = s.icon; return (
                <div key={s.label} className="card-solid rounded-xl p-4">
                  <Icon className="size-4 text-cyan mb-2" />
                  <p className="text-lg sm:text-xl font-semibold text-foreground tabular-nums">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
                </div>); })}
            </div>
          );
        })()}

        {/* Search + filters */}
        <div className="mt-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder={tab === "cables" ? "Search cable systems, owners, landings..." : "Search facilities, operators, locations..."} value={search} onChange={(e) => setSearch(e.target.value)}
                className="h-11 pl-10 bg-background border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:border-cyan/40 focus:ring-cyan/20 rounded-lg text-sm" />
              {search && <button onClick={() => setSearch("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2"><X className="size-4 text-muted-foreground hover:text-foreground" /></button>}
            </div>
            {tab !== "cables" ? (
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-11 px-4 border-border/50 gap-2 relative">
              <SlidersHorizontal className="size-4" />Filters
              {activeCount > 0 && <span className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-cyan text-background text-[10px] font-bold flex items-center justify-center">{activeCount}</span>}
            </Button>) : null}
            {tab !== "cables" ? (
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-11 w-full sm:w-[170px] border-border/50 bg-background text-sm"><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="itLoadMw">IT Load (MW)</SelectItem>
                <SelectItem value="rackCount">Rack Count</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                {tab === "pipeline" && <SelectItem value="stage">Pipeline stage</SelectItem>}
              </SelectContent>
            </Select>) : null}
            {tab !== "cables" ? (
            <Button variant="outline" onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")} aria-label="Toggle sort order" className="h-11 px-3 border-border/50"><ArrowUpDown className="size-4" /></Button>) : null}
          </div>

          {showFilters && data && tab !== "cables" && (
            <div className="card-solid rounded-xl p-5 mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div><label className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2 block">Status</label>
                <Select value={status} onValueChange={setStatus}><SelectTrigger className="border-border/50 bg-background text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="all">All Statuses</SelectItem>{data.filters.statuses.map((s) => <SelectItem key={s.value} value={s.value}>{s.value} ({s.count})</SelectItem>)}</SelectContent></Select></div>
              <div><label className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2 block">Country</label>
                <Select value={country} onValueChange={setCountry}><SelectTrigger className="border-border/50 bg-background text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="all">All Countries</SelectItem>{(data.filters.countries ?? []).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
              <div><label className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2 block">Operator</label>
                <Select value={operator} onValueChange={setOperator}><SelectTrigger className="border-border/50 bg-background text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="all">All Operators</SelectItem>{data.filters.operators.map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}</SelectContent></Select></div>
              <div><label className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2 block">Type</label>
                <Select value={facilityType} onValueChange={setFacilityType}><SelectTrigger className="border-border/50 bg-background text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="all">All Types</SelectItem>{data.filters.types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
              {activeCount > 0 && <button onClick={() => { setStatus("all"); setOperator("all"); setCountry("all"); setFacilityType("all"); }} className="text-xs text-cyan underline hover:underline sm:col-span-2 lg:col-span-4 text-left">Clear all filters</button>}
            </div>
          )}
        </div>

        {!loading && data && tab !== "cables" && <p className="text-sm text-muted-foreground my-6">Showing {data.facilities.length} facilit{data.facilities.length === 1 ? "y" : "ies"}{search && <> for &ldquo;{search}&rdquo;</>}</p>}
        {tab === "cables" && (() => { const rows = cableRows(search); return <p className="text-sm text-muted-foreground my-6">Showing {rows.length} cable system{rows.length === 1 ? "" : "s"}{search && <> matching &ldquo;{search}&rdquo;</>} · <Link href="/tracker/cables" className="text-cyan underline hover:underline">full cable tracker →</Link></p>; })()}

        {loading && !data && tab !== "cables" && <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="card-solid rounded-xl p-6 space-y-4"><Skeleton className="h-6 w-48" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></div>)}</div>}
        {error && tab !== "cables" && <div className="card-solid rounded-xl p-8 text-center"><AlertTriangle className="size-8 text-amber-500 mx-auto mb-3" /><p className="text-muted-foreground">{error}</p></div>}

        {tab === "cables" && <CableRegister search={search} />}

        {!loading && data && tab !== "cables" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {data.facilities.map((f) => {
              const sc = statusCfg[f.status] || statusCfg.Planned;
              const inCompare = compareSet.has(f.slug);
              return (
                <article key={f.id} className="card-solid card-solid-hover relative rounded-xl p-5 sm:p-6 group">
                  {/* Stretched link, whole card navigates to the profile */}
                  <Link href={`/directory/${f.slug}`} className="absolute inset-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-cyan" aria-label={`${f.name}, full profile`} />
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0"><h3 className="text-base font-semibold text-foreground group-hover:text-cyan transition-colors leading-snug">{f.name}</h3><p className="text-xs text-muted-foreground mt-0.5">{f.operator.name}</p></div>
                    <Badge variant="outline" className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${sc.bg} ${sc.color}`}>{f.status}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {f.itLoadMw && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Zap className="size-3.5 text-cyan" /><span>{f.itLoadMw} MW</span></div>}
                    {f.rackCount && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Server className="size-3.5 text-cyan" /><span>{f.rackCount.toLocaleString()} racks</span></div>}
                    {f.carrierNeutral === true && <Badge variant="outline" className="rounded-full px-2 py-0 text-[10px] font-medium border-neon/25 text-neon bg-neon/5">CARRIER-NEUTRAL</Badge>}
                    {f.aiReady && <Badge variant="outline" className="rounded-full px-2 py-0 text-[10px] font-medium border-neon/25 text-neon bg-neon/5">AI-READY</Badge>}
                    {f.tierRating && <Badge variant="outline" className="rounded-full px-2 py-0 text-[10px] font-medium border-border text-muted-foreground">{f.tierRating}</Badge>}
                  </div>
                  {f.description && <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{f.description}</p>}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                    <button
                      type="button"
                      onClick={() => toggleCompare(f.slug)}
                      aria-pressed={inCompare}
                      className={`relative z-10 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        inCompare
                          ? "border-cyan/50 bg-cyan/15 text-cyan"
                          : "border-border/60 text-muted-foreground hover:border-cyan/40 hover:text-cyan"
                      }`}
                    >
                      <GitCompareArrows className="size-3.5" />
                      {inCompare ? "Added to compare" : "Compare"}
                    </button>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><MapPin className="size-3" />{f.city}{f.country && f.country !== "Kenya" ? `, ${f.country}` : ""}</span>{f.peeringdbNetworks !== undefined && <span title="Networks registered on PeeringDB">{f.peeringdbNetworks} networks</span>}{f.sources && f.sources.length > 0 && <span className="inline-flex items-center gap-1 text-cyan/80" title="Named sources on the profile"><ExternalLink className="size-3" />{f.sources.length}</span>}<span className="flex items-center gap-1"><Shield className="size-3 text-neon" />Verified {fmtVerified(f.lastVerified)}</span></div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!loading && data && (
          <p className="mt-10 text-xs text-muted-foreground max-w-2xl leading-relaxed">
            Data sourced from operator websites, independent registers, and
            credible press, every entry carries named sources, a last-verified
            date, a PeeringDB cross-reference where one exists, and an explicit
            note wherever marketing claims and evidence part ways. Last
            verified: September 2026.{" "}
            <Link href="/methodology" className="text-cyan/80 hover:text-cyan underline hover:underline">
              Read the full methodology
            </Link>
            .
          </p>
        )}
      </div>
      <CompareTray />
    </section>
  );
}
