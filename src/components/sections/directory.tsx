"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, SlidersHorizontal, X, Building2, Zap, Server,
  MapPin, Shield, Globe, ArrowUpDown, Database, Wifi,
  AlertTriangle, CheckCircle, Clock, HardHat, Megaphone, ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
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
  itLoadMw: number | null; totalCapacityMw: number | null; rackCount: number | null;
  tierRating: string | null; facilityType: string | null; aiReady: boolean;
  openedDate: string | null; expansionDate: string | null;
  coolingType: string | null; powerSource: string | null;
  renewableClaim: string | null; notable: string | null;
  lastVerified: string | null; dataSource: string | null; dataConfidence: string;
  operator: Op;
  connectivityFacility: { provider: ConnectivityProvider }[];
  certifications: Cert[];
}

interface FilterMeta {
  operators: { id: string; name: string }[];
  statuses: { value: string; count: number }[];
  cities: string[]; types: string[];
}

interface DirStats { totalFacilities: number; operationalCount: number; totalMw: number; totalRacks: number; aiReadyCount: number; }
interface DirData { facilities: Facility[]; filters: FilterMeta; stats: DirStats; }

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

export default function DirectorySection({ initialSearch = "" }: { initialSearch?: string }) {
  const [data, setData] = useState<DirData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState("all");
  const [operator, setOperator] = useState("all");
  const [facilityType, setFacilityType] = useState("all");
  const [sortBy, setSortBy] = useState("itLoadMw");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);

  const fetchDir = useCallback(async () => {
    try {
      const p = new URLSearchParams();
      if (search) p.set("search", search);
      if (status !== "all") p.set("status", status);
      if (operator !== "all") p.set("operator", operator);
      if (facilityType !== "all") p.set("type", facilityType);
      p.set("sortBy", sortBy); p.set("sortOrder", sortOrder);
      const r = await fetch(`/api/directory?${p}`);
      if (!r.ok) throw new Error();
      setData(await r.json());
    } catch { setError("Could not load directory data"); }
    finally { setLoading(false); }
  }, [search, status, operator, facilityType, sortBy, sortOrder]);

  useEffect(() => { setLoading(true); setError(null); const t = setTimeout(fetchDir, 300); return () => clearTimeout(t); }, [fetchDir]);
  useEffect(() => { fetchDir(); }, []);

  const activeCount = [status !== "all", operator !== "all", facilityType !== "all"].filter(Boolean).length;

  return (
    <section id="directory" className="py-14 lg:py-20">
      <div className="container-site">

        {/* Header — left-aligned, editorial */}
        <div className="max-w-2xl">
          <span className="eyebrow">Kenya DC Directory</span>
          <h1 className="h-display mt-3 text-foreground">Every data centre in one place.</h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            A searchable database of data centre facilities in Kenya. Every
            facility verified and sourced — the asset that makes Data Centre
            254 different.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Shield className="size-3.5 text-neon" />
              Dataset last verified: August 2026
            </span>
            <Link href="/methodology" className="text-cyan hover:underline">
              How we verify →
            </Link>
          </div>
        </div>

        {/* Stats */}
        {data && !loading && (
          <dl className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
            {[
              { label: "Facilities", value: String(data.stats.totalFacilities), icon: Database },
              { label: "Operational", value: String(data.stats.operationalCount), icon: CheckCircle },
              { label: "Total IT Load", value: `${data.stats.totalMw.toFixed(1)} MW`, icon: Zap },
              { label: "Total Racks", value: data.stats.totalRacks > 0 ? `${data.stats.totalRacks.toLocaleString()}` : "--", icon: Server },
              { label: "AI-Ready", value: String(data.stats.aiReadyCount), icon: Wifi },
            ].map((s) => { const Icon = s.icon; return (
              <div key={s.label} className="card-solid rounded-xl p-4">
                <Icon className="size-4 text-cyan mb-2" />
                <dd className="text-lg sm:text-xl font-semibold text-foreground tabular-nums">{s.value}</dd>
                <dt className="text-[11px] text-muted-foreground mt-0.5">{s.label}</dt>
              </div>); })}
          </dl>
        )}

        {/* Search + filters */}
        <div className="mt-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search facilities, operators, locations..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="h-11 pl-10 bg-background border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:border-cyan/40 focus:ring-cyan/20 rounded-lg text-sm" />
              {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="size-4 text-muted-foreground hover:text-foreground" /></button>}
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-11 px-4 border-border/50 gap-2 relative">
              <SlidersHorizontal className="size-4" />Filters
              {activeCount > 0 && <span className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-cyan text-background text-[10px] font-bold flex items-center justify-center">{activeCount}</span>}
            </Button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-11 w-full sm:w-[160px] border-border/50 bg-background text-sm"><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent><SelectItem value="itLoadMw">IT Load (MW)</SelectItem><SelectItem value="rackCount">Rack Count</SelectItem><SelectItem value="name">Name (A-Z)</SelectItem></SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")} className="h-11 px-3 border-border/50"><ArrowUpDown className="size-4" /></Button>
          </div>

          {showFilters && data && (
            <div className="card-solid rounded-xl p-5 mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><label className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2 block">Status</label>
                <Select value={status} onValueChange={setStatus}><SelectTrigger className="border-border/50 bg-background text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="all">All Statuses</SelectItem>{data.filters.statuses.map((s) => <SelectItem key={s.value} value={s.value}>{s.value} ({s.count})</SelectItem>)}</SelectContent></Select></div>
              <div><label className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2 block">Operator</label>
                <Select value={operator} onValueChange={setOperator}><SelectTrigger className="border-border/50 bg-background text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="all">All Operators</SelectItem>{data.filters.operators.map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}</SelectContent></Select></div>
              <div><label className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2 block">Type</label>
                <Select value={facilityType} onValueChange={setFacilityType}><SelectTrigger className="border-border/50 bg-background text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="all">All Types</SelectItem>{data.filters.types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
              {activeCount > 0 && <button onClick={() => { setStatus("all"); setOperator("all"); setFacilityType("all"); }} className="text-xs text-cyan hover:underline sm:col-span-3 text-left">Clear all filters</button>}
            </div>
          )}
        </div>

        {!loading && data && <p className="text-sm text-muted-foreground my-6">Showing {data.facilities.length} facilit{data.facilities.length === 1 ? "y" : "ies"}{search && <> for &ldquo;{search}&rdquo;</>}</p>}

        {loading && !data && <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="card-solid rounded-xl p-6 space-y-4"><Skeleton className="h-6 w-48" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></div>)}</div>}
        {error && <div className="card-solid rounded-xl p-8 text-center"><AlertTriangle className="size-8 text-amber-500 mx-auto mb-3" /><p className="text-muted-foreground">{error}</p></div>}

        {!loading && data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {data.facilities.map((f) => {
              const sc = statusCfg[f.status] || statusCfg.Planned;
              return (
                <Link key={f.id} href={`/directory/${f.slug}`} className="w-full text-left card-solid card-solid-hover rounded-xl p-5 sm:p-6 group">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0"><h3 className="text-base font-semibold text-foreground group-hover:text-cyan transition-colors leading-snug">{f.name}</h3><p className="text-xs text-muted-foreground mt-0.5">{f.operator.name}</p></div>
                    <Badge variant="outline" className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${sc.bg} ${sc.color}`}>{f.status}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {f.itLoadMw && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Zap className="size-3.5 text-cyan" /><span>{f.itLoadMw} MW</span></div>}
                    {f.rackCount && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Server className="size-3.5 text-cyan" /><span>{f.rackCount.toLocaleString()} racks</span></div>}
                    {f.aiReady && <Badge variant="outline" className="rounded-full px-2 py-0 text-[10px] font-medium border-neon/25 text-neon bg-neon/5">AI-READY</Badge>}
                    {f.tierRating && <Badge variant="outline" className="rounded-full px-2 py-0 text-[10px] font-medium border-border text-muted-foreground">{f.tierRating}</Badge>}
                  </div>
                  {f.description && <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{f.description}</p>}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="size-3" />{f.city}</div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground"><span>Full profile →</span><span className="flex items-center gap-1"><Shield className="size-3 text-neon" />Verified {fmtVerified(f.lastVerified)}</span></div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!loading && data && (
          <p className="mt-10 text-xs text-muted-foreground/60 max-w-2xl leading-relaxed">
            Data sourced from operator websites, press releases, and publicly
            available information. Every data point follows: Claim, Source,
            Date Verified, Independent Evidence. Last verified: August 2026.{" "}
            <Link href="/methodology" className="text-cyan/80 hover:text-cyan hover:underline">
              Read the full methodology
            </Link>
            .
          </p>
        )}
      </div>
    </section>
  );
}
