"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, SlidersHorizontal, X, Building2, Zap, Server,
  MapPin, Shield, Globe, ArrowUpDown, Database, Wifi,
  AlertTriangle, Circle, CheckCircle, Clock, HardHat, Megaphone,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

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
  Planned: { color: "text-muted-foreground", bg: "bg-accent/50 border-border", icon: Clock },
  Announced: { color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/25", icon: Megaphone },
};

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-100px" } as const, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as const };
const stagger = (i: number) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" } as const, transition: { duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] } as const });

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
  const [selected, setSelected] = useState<Facility | null>(null);

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
    <section id="directory" className="relative py-20 lg:py-28">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_20%,oklch(0.78_0.14_195/4%),transparent_70%)]" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <motion.div className="text-center max-w-3xl mx-auto mb-12" {...fadeUp}>
          <span className="inline-block font-mono text-xs sm:text-sm tracking-widest text-cyan mb-4 uppercase">KENYA DC DIRECTORY</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Every Data Centre <span className="text-gradient-cyan">in One Place</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            A searchable database of data centre facilities in Kenya. Every facility
            verified and sourced. This is the asset that makes Data Centre 254 different.
          </p>
        </motion.div>

        {data && !loading && (
          <motion.div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-10" {...fadeUp}>
            {[
              { label: "Facilities", value: String(data.stats.totalFacilities), icon: Database },
              { label: "Operational", value: String(data.stats.operationalCount), icon: CheckCircle },
              { label: "Total IT Load", value: `${data.stats.totalMw.toFixed(1)} MW`, icon: Zap },
              { label: "Total Racks", value: data.stats.totalRacks > 0 ? `${data.stats.totalRacks.toLocaleString()}` : "--", icon: Server },
              { label: "AI-Ready", value: String(data.stats.aiReadyCount), icon: Wifi },
            ].map((s, i) => { const Icon = s.icon; return (
              <div key={s.label} className="glass-card rounded-xl p-3 sm:p-4 text-center">
                <Icon className="size-4 text-cyan mx-auto mb-1.5" />
                <div className="text-lg sm:text-xl font-bold text-gradient-cyan">{s.value}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{s.label}</div>
              </div>); })}
          </motion.div>
        )}

        <motion.div className="mb-8" {...fadeUp}>
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

          <AnimatePresence>
            {showFilters && data && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="glass-card rounded-xl p-5 mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div><label className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2 block">Status</label>
                    <Select value={status} onValueChange={setStatus}><SelectTrigger className="border-border/50 bg-background text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="all">All Statuses</SelectItem>{data.filters.statuses.map((s) => <SelectItem key={s.value} value={s.value}>{s.value} ({s.count})</SelectItem>)}</SelectContent></Select></div>
                  <div><label className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2 block">Operator</label>
                    <Select value={operator} onValueChange={setOperator}><SelectTrigger className="border-border/50 bg-background text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="all">All Operators</SelectItem>{data.filters.operators.map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}</SelectContent></Select></div>
                  <div><label className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2 block">Type</label>
                    <Select value={facilityType} onValueChange={setFacilityType}><SelectTrigger className="border-border/50 bg-background text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="all">All Types</SelectItem>{data.filters.types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                </div>
                {activeCount > 0 && <button onClick={() => { setStatus("all"); setOperator("all"); setFacilityType("all"); }} className="text-xs text-cyan hover:underline mt-3 ml-1">Clear all filters</button>}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {!loading && data && <p className="text-sm text-muted-foreground mb-6">Showing {data.facilities.length} facilit{data.facilities.length === 1 ? "y" : "ies"}{search && <> for &ldquo;{search}&rdquo;</>}</p>}

        {loading && !data && <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="glass-card rounded-xl p-6 space-y-4"><Skeleton className="h-6 w-48" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></div>)}</div>}
        {error && <div className="glass-card rounded-xl p-8 text-center"><AlertTriangle className="size-8 text-amber-500 mx-auto mb-3" /><p className="text-muted-foreground">{error}</p></div>}

        {!loading && data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <AnimatePresence mode="popLayout">
              {data.facilities.map((f, i) => {
                const sc = statusCfg[f.status] || statusCfg.Planned;
                const SIcon = sc.icon;
                return (
                  <motion.div key={f.id} {...stagger(i)} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                    <button onClick={() => setSelected(f)} className="w-full text-left glass-card glass-card-hover rounded-xl p-5 sm:p-6 transition-all duration-300 group cursor-pointer border border-border/50 hover:border-cyan/30">
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
                        <div className="flex items-center gap-3 text-xs text-muted-foreground"><span>{f.connectivityFacility.length} connections</span>{f.certifications.length > 0 && <span>{f.certifications.length} certs</span>}</div>
                      </div>
                    </button>
                  </motion.div>);
              })}
            </AnimatePresence>
          </div>
        )}

        {!loading && data && <motion.div className="mt-10 text-center" {...fadeUp}><p className="text-xs text-muted-foreground/60 max-w-2xl mx-auto leading-relaxed">Data sourced from operator websites, press releases, and publicly available information. Every data point follows: Claim, Source, Date Verified, Independent Evidence. Last verified: August 2026.</p></motion.div>}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => { if (!o) setSelected(null); }}>
        {selected && <FacilityDetail facility={selected} />}
      </Dialog>
    </section>
  );
}

function FacilityDetail({ facility: f }: { facility: Facility }) {
  const sc = statusCfg[f.status] || statusCfg.Planned;
  const SIcon = sc.icon;
  return (
    <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-background border-border p-0 scrollbar-thin">
      <DialogHeader className="p-6 pb-0">
        <div className="flex items-start justify-between gap-3">
          <div><DialogTitle className="text-xl font-bold text-foreground">{f.name}</DialogTitle><p className="text-sm text-muted-foreground mt-1">{f.operator.name}{f.operator.parentCompany ? ` (${f.operator.parentCompany})` : ""}</p></div>
          <Badge variant="outline" className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium border ${sc.bg} ${sc.color}`}><SIcon className="size-3 mr-1" />{f.status}</Badge>
        </div>
      </DialogHeader>
      <div className="p-6 space-y-6">
        {f.description && <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>}
        {f.notable && <div className="glass-card rounded-lg p-4 border-l-4 border-l-cyan"><p className="text-sm text-foreground leading-relaxed">{f.notable}</p></div>}
        <Separator className="bg-border/50" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {f.itLoadMw && <Spec icon={Zap} label="IT Load" value={`${f.itLoadMw} MW`} />}
          {f.totalCapacityMw && <Spec icon={Zap} label="Total Capacity" value={`${f.totalCapacityMw} MW`} />}
          {f.rackCount && <Spec icon={Server} label="Racks" value={f.rackCount.toLocaleString()} />}
          {f.tierRating && <Spec icon={Shield} label="Tier Rating" value={f.tierRating} />}
          {f.facilityType && <Spec icon={Building2} label="Type" value={f.facilityType} />}
          {f.aiReady && <Spec icon={Wifi} label="AI Ready" value="Yes" />}
          {f.coolingType && <Spec icon={Globe} label="Cooling" value={f.coolingType} />}
          {f.openedDate && <Spec icon={Clock} label="Opened" value={f.openedDate} />}
          {f.expansionDate && <Spec icon={Clock} label="Expansion" value={f.expansionDate} />}
        </div>
        {(f.address || f.city || f.region) && <div><h4 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">Location</h4><p className="text-sm text-foreground">{[f.address, f.city, f.region].filter(Boolean).join(", ")}</p></div>}
        {f.powerSource && <div><h4 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">Power Source</h4><p className="text-sm text-foreground">{f.powerSource}</p>{f.renewableClaim && <p className="text-xs text-muted-foreground mt-1">{f.renewableClaim}</p>}</div>}
        {f.connectivityFacility.length > 0 && <div><h4 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">Connectivity ({f.connectivityFacility.length} providers)</h4><div className="flex flex-wrap gap-2">{f.connectivityFacility.map((cf) => <Badge key={cf.provider.name} variant="outline" className="rounded-full px-2.5 py-0.5 text-xs font-normal border-border text-muted-foreground">{cf.provider.name} <span className="text-[10px] text-cyan/60 ml-1">{cf.provider.type}</span></Badge>)}</div></div>}
        {f.certifications.length > 0 && <div><h4 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">Certifications</h4><div className="flex flex-wrap gap-2">{f.certifications.map((fc) => <Badge key={fc.certification.name} variant="outline" className="rounded-full px-2.5 py-0.5 text-xs font-normal border-cyan/20 text-cyan bg-cyan/5">{fc.certification.name}</Badge>)}</div></div>}
        <Separator className="bg-border/50" />
        <div className="flex items-center justify-between text-xs text-muted-foreground/60">
          <span>Source: {f.dataSource || "Not specified"}</span>
          <span>Verified: {f.lastVerified || "Unknown"}</span>
          <Badge variant="outline" className={`rounded-full px-2 py-0 text-[10px] ${f.dataConfidence === "High" ? "border-neon/25 text-neon bg-neon/5" : f.dataConfidence === "Medium" ? "border-cyan/20 text-cyan bg-cyan/5" : "border-border text-muted-foreground"}`}>Confidence: {f.dataConfidence}</Badge>
        </div>
      </div>
    </DialogContent>
  );
}

function Spec({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (<div className="glass-card rounded-lg p-3"><Icon className="size-4 text-cyan mb-1" /><div className="text-sm font-semibold text-foreground">{value}</div><div className="text-[11px] text-muted-foreground">{label}</div></div>);
}
