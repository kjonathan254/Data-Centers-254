"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, CalendarClock, Check, ChevronDown, Copy, ExternalLink,
  RotateCcw, Search,
} from "lucide-react";
import {
  SUBSEA_CABLES, CABLES_LAST_VERIFIED, type CableRecord, type CableStatus,
} from "@/lib/market-trackers";

// ── shared status language ──────────────────────────────────────────────────

type SortKey = "status" | "newest" | "oldest";

const STATUS_ORDER: CableStatus[] = ["In service", "Landed, RFS pending", "Announced", "Planned"];

const STATUS_META: Record<CableStatus, { badge: string; dot: string; blurb: string; short: string }> = {
  "In service": {
    badge: "border-neon/25 text-neon bg-neon/10",
    dot: "bg-neon",
    blurb: "Counted live: carrying traffic on the Kenya segment.",
    short: "Live",
  },
  "Landed, RFS pending": {
    badge: "border-amber-500/25 text-amber-500 bg-amber-500/10",
    dot: "bg-amber-500",
    blurb: "Not counted live: physically ashore, but no ready-for-service date announced.",
    short: "RFS pending",
  },
  Announced: {
    badge: "border-cyan/25 text-cyan bg-cyan/10",
    dot: "bg-cyan",
    blurb: "Not counted live: formally announced build, host or consortium named.",
    short: "Announced",
  },
  Planned: {
    badge: "border-border text-muted-foreground bg-accent/50",
    dot: "bg-foreground/40",
    blurb: "Not counted live: announced intent, pre-contract or pre-construction.",
    short: "Planned",
  },
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2026-09" -> "Sep 2026" (tolerates full ISO dates); falls back to the raw string. */
function fmtVerified(iso: string): string {
  const m = /^(\d{4})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const mi = Number(m[2]) - 1;
  return `${MONTHS[mi] ?? ""} ${m[1]}`.trim();
}
const VERIFIED_LABEL = fmtVerified(CABLES_LAST_VERIFIED);

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/** Leading capacity figure for the compact row ("1.28 Tbps at launch, ..." -> "1.28 Tbps"). */
function shortCapacity(c: string | null): string | null {
  if (!c) return null;
  const m = /([\d.]+\s*Tbps)/i.exec(c);
  return m ? m[1].toUpperCase().replace("TBPS", "Tbps") : null;
}

/** RFS year for dated systems; pipeline records sort after all dated ones. */
function yearOf(c: CableRecord): number | null {
  if (!c.rfsDate) return null;
  const y = Number(c.rfsDate);
  return Number.isFinite(y) ? y : null;
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ── status story bar ────────────────────────────────────────────────────────

function StatusBar({ live, pending, pipeline }: { live: number; pending: number; pipeline: number }) {
  const total = live + pending + pipeline;
  const hatch = "repeating-linear-gradient(45deg, oklch(0.85 0.12 85 / 0.45) 0 3px, transparent 3px 7px)";
  const segs = [
    { n: live, label: "LIVE", cls: "border-neon/50 bg-neon/15", pattern: null as string | null },
    { n: pending, label: "RFS PENDING", cls: "border-amber-500/60 bg-amber-500/10", pattern: hatch },
    { n: pipeline, label: "PLANNED", cls: "border-cyan/50 border-dashed bg-cyan/5", pattern: null },
  ];
  return (
    <div className="card-solid rounded-xl p-4 sm:p-5">
      <div
        className="flex h-9 w-full gap-1"
        role="img"
        aria-label={`Status of the ${total} tracked systems: ${live} live, ${pending} landed with ready-for-service pending, ${pipeline} planned or announced`}
      >
        {segs.map((s) => (
          <div
            key={s.label}
            style={{ flexGrow: Math.max(s.n, 0.45) }}
            className={`relative flex min-w-0 items-center justify-center overflow-hidden rounded-md border ${s.cls}`}
          >
            {s.pattern && <span aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: s.pattern }} />}
            <span className="relative z-10 whitespace-nowrap px-2 text-[11px] font-mono font-bold tracking-widest text-foreground">
              {s.n} {s.label}
            </span>
          </div>
        ))}
      </div>
      <ul className="mt-3 grid gap-1.5 text-[11px] leading-snug text-muted-foreground sm:grid-cols-3 sm:gap-3">
        <li className="flex items-start gap-1.5">
          <span aria-hidden="true" className="mt-0.5 inline-block size-2 shrink-0 rounded-full bg-neon" />
          <span><strong className="font-semibold text-foreground">{live} live</strong> — carrying traffic on the Kenya segment.</span>
        </li>
        <li className="flex items-start gap-1.5">
          <span aria-hidden="true" className="mt-0.5 inline-block size-2 shrink-0 rounded-sm border border-amber-500/70 bg-amber-500/30" style={{ backgroundImage: hatch }} />
          <span><strong className="font-semibold text-foreground">{pending} landed / RFS pending</strong> — ashore, ready-for-service not confirmed.</span>
        </li>
        <li className="flex items-start gap-1.5">
          <span aria-hidden="true" className="mt-0.5 inline-block size-2 shrink-0 rounded-sm border border-dashed border-cyan/70 bg-cyan/10" />
          <span><strong className="font-semibold text-foreground">{pipeline} planned</strong> — announced build or route, not counted as live.</span>
        </li>
      </ul>
      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground/80">
        <CalendarClock aria-hidden="true" className="size-3.5 text-cyan" />
        Verified {VERIFIED_LABEL} · monthly sweep
      </p>
    </div>
  );
}

// ── cable row (compact, expandable) ─────────────────────────────────────────

function CableRow({ c, isOpen, onToggle }: { c: CableRecord; isOpen: boolean; onToggle: () => void }) {
  const meta = STATUS_META[c.status];
  const id = slug(c.name);
  const cap = shortCapacity(c.designCapacity);
  const primary = c.sources[0];
  return (
    <article className="card-solid overflow-hidden rounded-xl">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`cable-detail-${id}`}
        id={`cable-row-${id}`}
        className="flex w-full flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-3.5 text-left transition-colors hover:bg-cyan/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan/60"
      >
        <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${meta.dot}`} />
        <span className="text-sm font-semibold text-foreground">
          {c.name}
          {c.longName && <span className="ml-2 hidden text-xs font-normal text-muted-foreground md:inline">{c.longName}</span>}
        </span>
        <span className="rounded-full border border-border/60 bg-accent/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground tabular-nums">
          {c.rfsDate ?? "no RFS date"}
        </span>
        <span className="truncate text-xs text-muted-foreground">{c.kenyanLandings[0]}</span>
        <span className="ml-auto flex items-center gap-2 sm:gap-3">
          {cap && <span className="whitespace-nowrap text-xs font-medium tabular-nums text-foreground">{cap}</span>}
          <span className={`hidden rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider sm:inline-flex ${meta.badge}`}>
            {meta.short}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan">
            Details <ChevronDown aria-hidden="true" className={`size-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </span>
        </span>
      </button>
      {isOpen && (
        <div id={`cable-detail-${id}`} role="region" aria-labelledby={`cable-row-${id}`} className="space-y-3 border-t border-border/30 px-4 py-4">
          <p className="text-sm leading-relaxed text-muted-foreground">{c.note}</p>
          <p className="text-xs text-muted-foreground">{meta.blurb}</p>
          <dl className="grid gap-x-6 gap-y-2 text-xs sm:grid-cols-2">
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/80">Owner / consortium</dt>
              <dd className="mt-0.5 text-foreground">{c.owners}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/80">Kenyan landing</dt>
              <dd className="mt-0.5 text-foreground">{c.kenyanLandings.join(" · ")}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/80">Design capacity</dt>
              <dd className="mt-0.5 text-foreground">
                {c.designCapacity ?? "Not published"}
                {c.designCapacity && (
                  <span className="mt-1 block text-[11px] leading-snug text-muted-foreground/80">
                    Design capacity is operator-reported. Lit capacity is not published and is deliberately not estimated here.
                  </span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/80">Evidence</dt>
              <dd className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-foreground">
                <span aria-hidden="true" className={`inline-block size-1.5 rounded-full ${c.dataConfidence === "High" ? "bg-neon" : c.dataConfidence === "Medium" ? "bg-amber-500" : "bg-red-400"}`} />
                {c.dataConfidence} confidence · verified {fmtVerified(c.lastVerified)}
                {primary && (
                  <a href={primary.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-cyan hover:underline">
                    Source trail <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                )}
              </dd>
            </div>
          </dl>
          {c.dc254Article && (
            <Link href={`/articles/${c.dc254Article}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan transition-all hover:gap-2.5">
              Read the full explainer <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      )}
    </article>
  );
}

// ── main explorer ───────────────────────────────────────────────────────────

export default function CableExplorer() {
  const live = SUBSEA_CABLES.filter((c) => c.status === "In service");
  const pending = SUBSEA_CABLES.filter((c) => c.status === "Landed, RFS pending");
  const announced = SUBSEA_CABLES.filter((c) => c.status === "Announced");
  const planned = SUBSEA_CABLES.filter((c) => c.status === "Planned");
  const pipeline = announced.length + planned.length;

  const [query, setQuery] = useState("");
  const [statuses, setStatuses] = useState<Set<CableStatus>>(new Set());
  const [sort, setSort] = useState<SortKey>("status");
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const slateRef = useRef<HTMLElement>(null);

  // Timeline: RFS year for live systems; announcement year for the pipeline
  // records (Daraja announced Oct 2025, LuLu at ITW Africa Sep 2026 — from
  // the CableRecord notes, 2026-09 sweep).
  const timeline = useMemo(() => {
    const items: { name: string; year: number; status: CableStatus }[] = [];
    for (const c of SUBSEA_CABLES) {
      const y = yearOf(c);
      if (y !== null) items.push({ name: c.name, year: y, status: c.status });
    }
    items.push({ name: "Daraja", year: 2025, status: "Announced" });
    items.push({ name: "LuLu", year: 2026, status: "Planned" });
    return items.sort((a, b) => a.year - b.year || a.name.localeCompare(b.name));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = SUBSEA_CABLES.filter((c) => {
      const okStatus = statuses.size === 0 || statuses.has(c.status);
      const hay = `${c.name} ${c.longName ?? ""} ${c.owners} ${c.kenyanLandings.join(" ")} ${c.note}`.toLowerCase();
      return okStatus && (!q || hay.includes(q));
    });
    if (sort === "status") return rows;
    const dated = rows.filter((c) => yearOf(c) !== null);
    const undated = rows.filter((c) => yearOf(c) === null);
    const byYear = (a: CableRecord, b: CableRecord) => (yearOf(a) ?? 0) - (yearOf(b) ?? 0) || a.name.localeCompare(b.name);
    return sort === "newest" ? [...dated].sort((a, b) => byYear(b, a)).concat(undated) : [...dated].sort(byYear).concat(undated);
  }, [query, statuses, sort]);

  const toggleRow = (name: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const scrollToSlate = () => {
    slateRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  };

  const focusStatuses = (set: CableStatus[]) => {
    setStatuses(new Set(set));
    scrollToSlate();
  };

  const openFromTimeline = (name: string) => {
    setQuery("");
    setStatuses(new Set());
    setOpen((prev) => new Set(prev).add(name));
    requestAnimationFrame(() => {
      document.getElementById(`cable-row-${slug(name)}`)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
    });
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable (permissions / http): silently ignore
    }
  };

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan/60 ${
      active ? "border-cyan/50 bg-cyan/15 text-cyan" : "border-border/60 bg-accent/30 text-muted-foreground hover:border-cyan/40 hover:text-cyan"
    }`;

  return (
    <div className="mt-8 space-y-10">
      {/* Status story */}
      <section aria-label="Status of the tracked cable systems">
        <StatusBar live={live.length} pending={pending.length} pipeline={pipeline} />
      </section>

      {/* Primary actions */}
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => focusStatuses(["In service"])} className="inline-flex items-center gap-1.5 rounded-lg bg-cyan px-4 py-2 text-sm font-medium text-cyan-foreground transition-colors hover:bg-cyan/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan">
          Explore live systems <ArrowRight className="size-4" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => focusStatuses(["Announced", "Planned"])} className="inline-flex items-center gap-1.5 rounded-lg border border-cyan/20 px-4 py-2 text-sm font-medium text-cyan transition-colors hover:bg-cyan/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan">
          See the pipeline
        </button>
        <Link href="/infrastructure/map" className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-cyan/40 hover:text-cyan focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan">
          Open cable map
        </Link>
      </div>

      {/* Trust modules */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section aria-labelledby="why-live" className="card-solid rounded-xl border border-neon/15 p-5 sm:p-6">
          <h2 id="why-live" className="text-section-label">Why the live count is {live.length}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground tabular-nums">{SUBSEA_CABLES.length} systems</strong> are tracked ·{" "}
            <strong className="text-foreground tabular-nums">{live.length}</strong> are carrying traffic ·{" "}
            <strong className="text-foreground tabular-nums">{pending.length}</strong> is landed but has no announced
            ready-for-service date · <strong className="text-foreground tabular-nums">{pipeline}</strong> are announced or planned.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            A cable joins the live count when service is confirmed — not when it makes headlines, and not when it comes
            ashore. That discipline is the whole point of this tracker.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href="#methodology" className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan transition-all hover:gap-2.5">
              Read the methodology <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <button type="button" onClick={share} className="inline-flex items-center gap-1.5 rounded text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan/60">
              {copied ? <>Link copied <Check className="size-4 text-neon" aria-hidden="true" /></> : <>Share this tracker <Copy className="size-4" aria-hidden="true" /></>}
            </button>
          </div>
        </section>

        <section aria-labelledby="what-changed" className="card-solid rounded-xl p-5 sm:p-6">
          <h2 id="what-changed" className="text-section-label">{VERIFIED_LABEL} update · monthly sweep</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li className="flex gap-2"><span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-cyan" />Live count unchanged at {live.length}.</li>
            <li className="flex gap-2"><span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-cyan" /><span><strong className="text-foreground">LuLu</strong> added to Planned — the ~500 km coastal diversity route announced at ITW Africa 2026.</span></li>
            <li className="flex gap-2"><span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-cyan" /><span><strong className="text-foreground">Africa-1</strong> remains landed with RFS pending; <strong className="text-foreground">Daraja</strong> remains announced.</span></li>
            <li className="flex gap-2"><span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-cyan" />Next review: October 2026.</li>
          </ul>
        </section>
      </div>

      {/* Full slate */}
      <section aria-labelledby="cable-table" ref={slateRef} className="scroll-mt-20">
        <div className="max-w-2xl">
          <h2 id="cable-table" className="h-display-sm text-foreground">The full slate</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Search, filter and sort every tracked system. Each row expands into the full record with owners, landings,
            capacity and the evidence behind the status. Design capacity is the operator-reported figure and is usually
            far above lit capacity, which is not published and is deliberately not estimated here.
          </p>
        </div>

        {/* Controls */}
        <div className="mt-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="cable-search" className="sr-only">Search cable or consortium</label>
            <div className="relative">
              <Search aria-hidden="true" className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                id="cable-search"
                type="text"
                placeholder="Search cable or consortium…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-9 w-52 rounded-md border border-border/50 bg-surface pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-cyan/50"
              />
            </div>
            <div role="group" aria-label="Filter by status" className="flex flex-wrap items-center gap-1.5">
              <button type="button" onClick={() => setStatuses(new Set())} aria-pressed={statuses.size === 0} className={chip(statuses.size === 0)}>All status</button>
              {STATUS_ORDER.map((s) => {
                const active = statuses.has(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatuses((prev) => { const next = new Set(prev); if (next.has(s)) next.delete(s); else next.add(s); return next; })}
                    aria-pressed={active}
                    className={chip(active)}
                  >
                    {STATUS_META[s].short}
                  </button>
                );
              })}
            </div>
            <label className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-8 rounded-md border border-border/50 bg-surface px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-cyan/50"
              >
                <option value="status">by status</option>
                <option value="newest">newest first</option>
                <option value="oldest">oldest first</option>
              </select>
            </label>
          </div>
          <p className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground" aria-live="polite">
            <span>
              Showing <strong className="font-semibold text-foreground tabular-nums">{filtered.length}</strong> of{" "}
              <span className="tabular-nums">{SUBSEA_CABLES.length}</span> systems
              {query.trim() !== "" && <> for &ldquo;{query.trim()}&rdquo;</>}
            </span>
            {(statuses.size > 0 || query.trim() !== "") && (
              <button type="button" onClick={() => { setStatuses(new Set()); setQuery(""); }} className="inline-flex items-center gap-1 rounded text-cyan hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan/60">
                <RotateCcw className="size-3" aria-hidden="true" /> Clear filters
              </button>
            )}
          </p>
        </div>

        {/* Timeline */}
        <div className="mt-8">
          <p className="text-section-label mb-3">Ready-for-service timeline</p>
          <ol className="scrollbar-thin flex items-start gap-0 overflow-x-auto pb-2">
            {timeline.map((t, i) => {
              const last = i === timeline.length - 1;
              const isLive = t.status === "In service";
              return (
                <li key={`${t.name}-${t.year}`} className={`flex items-start ${last ? "" : "flex-1"}`}>
                  <button
                    type="button"
                    onClick={() => openFromTimeline(t.name)}
                    aria-label={`${t.name}, ${isLive ? "ready for service" : "announced"} ${t.year}. Show cable details.`}
                    className="group flex w-16 shrink-0 flex-col items-center gap-1.5 rounded-md py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan/60"
                  >
                    <span className={`text-[10px] font-mono tabular-nums ${isLive ? "text-foreground" : "text-muted-foreground"}`}>{t.year}</span>
                    <span aria-hidden="true" className={`size-2.5 rounded-full border-2 transition-transform group-hover:scale-125 ${isLive ? "border-neon bg-neon/40" : "border-dashed border-cyan/70 bg-transparent"}`} />
                    <span className={`text-center text-[10px] font-medium leading-tight ${isLive ? "text-foreground" : "text-muted-foreground"}`}>{t.name}</span>
                  </button>
                  {!last && <span aria-hidden="true" className="mt-[26px] h-px flex-1 bg-border/40" style={{ minWidth: 16 }} />}
                </li>
              );
            })}
          </ol>
          <p className="mt-1 text-[10px] text-muted-foreground/70">
            Dotted markers are announced or planned systems (shown at announcement year, not RFS). Tap any entry to open its record.
          </p>
        </div>

        {/* Rows */}
        <div className="mt-8 space-y-6">
          {filtered.length === 0 && (
            <p className="card-solid rounded-xl px-4 py-10 text-center text-sm text-muted-foreground">
              Nothing matches &ldquo;{query.trim()}&rdquo;{statuses.size > 0 ? " with the selected status filters" : ""}.
            </p>
          )}
          {sort === "status"
            ? STATUS_ORDER.map((status) => {
                const rows = filtered.filter((c) => c.status === status);
                if (!rows.length) return null;
                const meta = STATUS_META[status];
                return (
                  <div key={status}>
                    <p className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                      <span className={`inline-block rounded-full border px-2 py-0.5 text-[9px] font-bold ${meta.badge}`}>{status}</span>
                      {meta.blurb}
                    </p>
                    <ul className="mt-3 space-y-2">
                      {rows.map((c) => (
                        <li key={c.name}>
                          <CableRow c={c} isOpen={open.has(c.name)} onToggle={() => toggleRow(c.name)} />
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })
            : (
              <ul className="space-y-2">
                {filtered.map((c) => (
                  <li key={c.name}>
                    <CableRow c={c} isOpen={open.has(c.name)} onToggle={() => toggleRow(c.name)} />
                  </li>
                ))}
              </ul>
            )}
        </div>
      </section>
    </div>
  );
}
