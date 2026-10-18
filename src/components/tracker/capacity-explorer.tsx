"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { RotateCcw, Search } from "lucide-react";

/**
 * Capacity Explorer, the working view of the tracker (external review
 * 2026-10-18, flagship feature B): filter the market by stage, operator and
 * city, switch the measure between live IT load, designed capacity and
 * announced pipeline, and trace every total to the rows that contribute to
 * it. One measure is ever summed at a time; missing figures read "not
 * disclosed", never zero; the four East Africa reference records are
 * excluded server-side so unfiltered totals reproduce the canonical
 * site-stats figures (10.5 live / 42.9 designed / 230 announced) exactly.
 * Fully client-side over a Kenya-scoped snapshot passed from the server
 * page; no fetching, no invented values.
 */

export interface ExplorerRow {
  id: string;
  name: string;
  slug: string;
  operator: string;
  city: string;
  status: string;
  itLoadMw: number | null;
  totalCapacityMw: number | null;
  lastVerified: string;
  dataConfidence: string;
}

type Measure = "live" | "designed" | "announced";
type SortKey = "mw" | "name" | "verified";

const MEASURES: { key: Measure; label: string; blurb: string }[] = [
  {
    key: "live",
    label: "Live IT load",
    blurb:
      "Published in-service IT load, operational facilities. What servers draw today, the hardest figure to fake.",
  },
  {
    key: "designed",
    label: "Designed capacity",
    blurb:
      "What the built, operational halls were designed to hold. Real infrastructure, not yet fully sold or fitted out.",
  },
  {
    key: "announced",
    label: "Announced pipeline",
    blurb:
      "Developer-announced megawatts for building, committed and early-stage projects. Press releases, not electrons.",
  },
];

const STAGE_ORDER = [
  "Operational",
  "Under Construction",
  "Committed",
  "Early Stage",
  "Announced",
];

const STAGE_BADGE: Record<string, string> = {
  Operational: "border-neon/25 text-neon bg-neon/10",
  "Under Construction": "border-cyan/25 text-cyan bg-cyan/10",
  Committed: "border-amber-500/25 text-amber-500 bg-amber-500/10",
  "Early Stage": "border-border text-muted-foreground bg-accent/50",
  Announced: "border-border text-muted-foreground bg-accent/50",
};

const CONF_DOT: Record<string, string> = {
  High: "bg-neon",
  Medium: "bg-amber-500",
  Low: "bg-red-400",
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Which rows a measure can legitimately apply to. Never mixed in one sum. */
function measureApplies(row: ExplorerRow, measure: Measure): boolean {
  if (measure === "designed") return row.status === "Operational";
  if (measure === "announced") return row.status !== "Operational";
  return true;
}

function valueFor(row: ExplorerRow, measure: Measure): number | null {
  if (!measureApplies(row, measure)) return null;
  return measure === "live" ? row.itLoadMw : row.totalCapacityMw;
}

function fmtMw(n: number): string {
  const r = Math.round(n * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
}

/** Month-precision dates formatted by hand: no locale, no timezone drift. */
function fmtVerified(v: string): string {
  const [y, m] = v.split("-");
  const mi = parseInt(m ?? "", 10) - 1;
  if (!y || Number.isNaN(mi) || !MONTHS[mi]) return v;
  return `${MONTHS[mi]} ${y}`;
}

function stageBadgeClass(stage: string): string {
  return STAGE_BADGE[stage] ?? STAGE_BADGE["Early Stage"];
}

export default function CapacityExplorer({ rows }: { rows: ExplorerRow[] }) {
  const [measure, setMeasure] = useState<Measure>("live");
  const [stage, setStage] = useState("all");
  const [operator, setOperator] = useState("all");
  const [city, setCity] = useState("all");
  const [sort, setSort] = useState<SortKey>("mw");

  const stages = useMemo(() => {
    const present = new Set(rows.map((r) => r.status));
    const ordered = STAGE_ORDER.filter((s) => present.has(s));
    for (const s of present) if (!ordered.includes(s)) ordered.push(s);
    return ordered;
  }, [rows]);

  const operators = useMemo(
    () => [...new Set(rows.map((r) => r.operator))].sort(),
    [rows],
  );
  const cities = useMemo(
    () => [...new Set(rows.map((r) => r.city))].sort(),
    [rows],
  );

  const filtered = useMemo(() => {
    const list = rows.filter(
      (r) =>
        (stage === "all" || r.status === stage) &&
        (operator === "all" || r.operator === operator) &&
        (city === "all" || r.city === city),
    );
    const val = (r: ExplorerRow) => valueFor(r, measure);
    return list.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "verified") return b.lastVerified.localeCompare(a.lastVerified) || a.name.localeCompare(b.name);
      const av = val(a);
      const bv = val(b);
      if (av == null && bv == null) return a.name.localeCompare(b.name);
      if (av == null) return 1;
      if (bv == null) return -1;
      return bv - av || a.name.localeCompare(b.name);
    });
  }, [rows, stage, operator, city, measure, sort]);

  const { total, disclosed, undisclosed } = useMemo(() => {
    let t = 0;
    let d = 0;
    for (const r of filtered) {
      const v = valueFor(r, measure);
      if (v != null) {
        t += v;
        d += 1;
      }
    }
    return { total: t, disclosed: d, undisclosed: filtered.length - d };
  }, [filtered, measure]);

  const active = MEASURES.find((m) => m.key === measure) ?? MEASURES[0];
  const isFiltered = stage !== "all" || operator !== "all" || city !== "all";

  function reset() {
    setStage("all");
    setOperator("all");
    setCity("all");
    setSort("mw");
  }

  return (
    <section aria-labelledby="explorer-title" className="mt-16">
      <div className="max-w-2xl">
        <h2 id="explorer-title" className="h-display-sm text-foreground">
          The capacity explorer
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The working tool. Filter the market, switch the measure, and read the
          total straight off the rows that contribute to it. Kenya records
          only; the four East Africa reference records sit in the directory.
        </p>
      </div>

      {/* Measure switcher: one measure is ever summed at a time */}
      <div className="mt-8">
        <div
          role="group"
          aria-label="Capacity measure"
          className="inline-flex flex-wrap rounded-xl border border-border/60 bg-accent/30 p-1"
        >
          {MEASURES.map((m) => (
            <button
              key={m.key}
              type="button"
              aria-pressed={measure === m.key}
              onClick={() => setMeasure(m.key)}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                measure === m.key
                  ? "bg-background text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
          {active.blurb}
        </p>
      </div>

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="cx-stage" className="mb-1.5 block text-2xs font-mono uppercase tracking-widest text-muted-foreground">
            Stage
          </label>
          <select
            id="cx-stage"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground focus:border-cyan focus:outline-none"
          >
            <option value="all">All stages</option>
            {stages.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cx-operator" className="mb-1.5 block text-2xs font-mono uppercase tracking-widest text-muted-foreground">
            Operator
          </label>
          <select
            id="cx-operator"
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground focus:border-cyan focus:outline-none"
          >
            <option value="all">All operators</option>
            {operators.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cx-city" className="mb-1.5 block text-2xs font-mono uppercase tracking-widest text-muted-foreground">
            Location
          </label>
          <select
            id="cx-city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground focus:border-cyan focus:outline-none"
          >
            <option value="all">All locations</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cx-sort" className="mb-1.5 block text-2xs font-mono uppercase tracking-widest text-muted-foreground">
            Sort by
          </label>
          <select
            id="cx-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground focus:border-cyan focus:outline-none"
          >
            <option value="mw">Capacity (high to low)</option>
            <option value="name">Name (A to Z)</option>
            <option value="verified">Recently verified</option>
          </select>
        </div>
      </div>

      {/* Traceable summary, announced to screen readers on every change */}
      <div
        aria-live="polite"
        className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-border/50 bg-accent/30 px-4 py-3 text-sm"
      >
        <span className="font-semibold tabular-nums text-foreground">
          {fmtMw(total)} MW
        </span>
        <span className="text-muted-foreground">{active.label.toLowerCase()} total</span>
        <span className="text-muted-foreground" aria-hidden="true">·</span>
        <span className="tabular-nums text-muted-foreground">
          {filtered.length} of {rows.length} records shown
        </span>
        <span className="text-muted-foreground" aria-hidden="true">·</span>
        <span className="tabular-nums text-muted-foreground">
          {disclosed} with a published figure{undisclosed > 0 ? `, ${undisclosed} not disclosed` : ""}
        </span>
        {isFiltered && (
          <button
            type="button"
            onClick={reset}
            className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-cyan hover:underline"
          >
            <RotateCcw className="size-3" />
            Reset filters
          </button>
        )}
      </div>

      {/* Desktop table */}
      <div className="card-solid mt-5 hidden overflow-x-auto rounded-xl md:block">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <caption className="sr-only">
            Kenya data centre facilities with {active.label.toLowerCase()}, filterable by stage, operator and location
          </caption>
          <thead>
            <tr className="border-b border-border/60 text-left text-xs font-mono uppercase tracking-widest text-muted-foreground">
              <th scope="col" className="px-4 py-3 font-medium">Facility</th>
              <th scope="col" className="px-4 py-3 font-medium">Operator</th>
              <th scope="col" className="px-4 py-3 font-medium">Location</th>
              <th scope="col" className="px-4 py-3 font-medium">Stage</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">{active.label} (MW)</th>
              <th scope="col" className="px-4 py-3 font-medium">Verified</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const v = valueFor(r, measure);
              return (
                <tr key={r.id} className="border-b border-border/30 last:border-b-0 hover:bg-accent/20">
                  <td className="px-4 py-3">
                    <Link href={`/directory/${r.slug}`} className="font-medium text-foreground hover:text-cyan">
                      {r.name}
                    </Link>
                    <span className="mt-0.5 flex items-center gap-1.5 text-2xs text-muted-foreground">
                      <span className={`size-1.5 rounded-full ${CONF_DOT[r.dataConfidence] ?? "bg-muted-foreground"}`} aria-hidden="true" />
                      {r.dataConfidence} confidence
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.operator}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.city}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full border px-1.5 py-px text-2xs font-bold uppercase tracking-wider ${stageBadgeClass(r.status)}`}>
                      {r.status === "Operational" ? "Live" : r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums text-foreground">
                    {v != null ? fmtMw(v) : (
                      <span className="font-normal text-muted-foreground">
                        {measureApplies(r, measure) ? "not disclosed" : "n/a"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-muted-foreground">{fmtVerified(r.lastVerified)}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No records match those filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="mt-5 space-y-3 md:hidden">
        {filtered.map((r) => {
          const v = valueFor(r, measure);
          return (
            <li key={r.id} className="card-solid rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/directory/${r.slug}`} className="block truncate text-sm font-medium text-foreground hover:text-cyan">
                    {r.name}
                  </Link>
                  <p className="mt-0.5 truncate text-2xs text-muted-foreground">
                    {r.operator} · {r.city}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-lg font-semibold tabular-nums text-foreground">
                    {v != null ? `${fmtMw(v)} MW` : (
                      <span className="text-xs font-normal text-muted-foreground">
                        {measureApplies(r, measure) ? "not disclosed" : "n/a"}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-border/40 pt-3">
                <span className={`rounded-full border px-1.5 py-px text-2xs font-bold uppercase tracking-wider ${stageBadgeClass(r.status)}`}>
                  {r.status === "Operational" ? "Live" : r.status}
                </span>
                <span className="ml-auto inline-flex items-center gap-1 text-2xs text-muted-foreground">
                  <span className={`size-1.5 rounded-full ${CONF_DOT[r.dataConfidence] ?? "bg-muted-foreground"}`} aria-hidden="true" />
                  {r.dataConfidence} · verified {fmtVerified(r.lastVerified)}
                </span>
              </div>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="rounded-xl border border-dashed border-border/40 p-6 text-center text-sm text-muted-foreground">
            No records match those filters. Loosen a filter or reset.
          </li>
        )}
      </ul>

      {/* How the totals work */}
      <p className="mt-4 flex items-start gap-2 text-2xs leading-relaxed text-muted-foreground">
        <Search className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
        <span>
          Totals sum only the rows shown, one measure at a time; live IT load,
          designed capacity and announced capacity are never added together.
          With no filters applied, the three totals reproduce the figures in
          the cards above, both come from the same verified dataset. Figure
          bases and evidence:{" "}
          <Link href="/methodology" className="text-cyan hover:underline">how we verify</Link>.
        </span>
      </p>
    </section>
  );
}
