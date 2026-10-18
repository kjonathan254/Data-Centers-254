"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Link2, RotateCcw, Search } from "lucide-react";

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
 *
 * External spec round 2 (2026-10-18): every filter choice is mirrored into
 * the URL query (history.replaceState, no history pollution) so a filtered
 * view is shareable and restorable, with a "copy link to this view" action;
 * a gap filter ("only records not disclosing this measure") turns missing
 * figures from an absence into an inspectable, deep-linkable state.
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

/** Everything the explorer can be tuned to; mirrored one-to-one into the URL. */
interface ExplorerState {
  measure: Measure;
  stage: string;
  operator: string;
  city: string;
  sort: SortKey;
  missingOnly: boolean;
}

const DEFAULT_STATE: ExplorerState = {
  measure: "live",
  stage: "all",
  operator: "all",
  city: "all",
  sort: "mw",
  missingOnly: false,
};

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
  const [measure, setMeasure] = useState<Measure>(DEFAULT_STATE.measure);
  const [stage, setStage] = useState(DEFAULT_STATE.stage);
  const [operator, setOperator] = useState(DEFAULT_STATE.operator);
  const [city, setCity] = useState(DEFAULT_STATE.city);
  const [sort, setSort] = useState<SortKey>(DEFAULT_STATE.sort);
  const [missingOnly, setMissingOnly] = useState(DEFAULT_STATE.missingOnly);
  const [copied, setCopied] = useState(false);

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

  // URL state (external spec 2026-10-18): a filtered view must be shareable
  // and restorable. Written with history.replaceState so filter changes
  // never pollute the back stack; read once on mount so a pasted link
  // restores the exact view. Unknown or stale values fall back to defaults.
  function syncUrl(next: ExplorerState) {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams();
    if (next.measure !== DEFAULT_STATE.measure) p.set("measure", next.measure);
    if (next.stage !== "all") p.set("stage", next.stage);
    if (next.operator !== "all") p.set("operator", next.operator);
    if (next.city !== "all") p.set("city", next.city);
    if (next.sort !== "mw") p.set("sort", next.sort);
    if (next.missingOnly) p.set("missing", "1");
    const qs = p.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${qs ? `?${qs}` : ""}`,
    );
  }

  function patchState(patch: Partial<ExplorerState>) {
    const next: ExplorerState = {
      measure, stage, operator, city, sort, missingOnly, ...patch,
    };
    setMeasure(next.measure);
    setStage(next.stage);
    setOperator(next.operator);
    setCity(next.city);
    setSort(next.sort);
    setMissingOnly(next.missingOnly);
    syncUrl(next);
  }

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const m = p.get("measure");
    const st = p.get("stage");
    const op = p.get("operator");
    const ct = p.get("city");
    const so = p.get("sort");
    const next: ExplorerState = {
      measure: m === "designed" || m === "announced" ? m : DEFAULT_STATE.measure,
      stage: st && (st === "all" || stages.includes(st)) ? st : DEFAULT_STATE.stage,
      operator: op && (op === "all" || operators.includes(op)) ? op : DEFAULT_STATE.operator,
      city: ct && (ct === "all" || cities.includes(ct)) ? ct : DEFAULT_STATE.city,
      sort: so === "name" || so === "verified" ? so : DEFAULT_STATE.sort,
      missingOnly: p.get("missing") === "1",
    };
    if (
      next.measure !== DEFAULT_STATE.measure ||
      next.stage !== DEFAULT_STATE.stage ||
      next.operator !== DEFAULT_STATE.operator ||
      next.city !== DEFAULT_STATE.city ||
      next.sort !== DEFAULT_STATE.sort ||
      next.missingOnly !== DEFAULT_STATE.missingOnly
    ) {
      setMeasure(next.measure);
      setStage(next.stage);
      setOperator(next.operator);
      setCity(next.city);
      setSort(next.sort);
      setMissingOnly(next.missingOnly);
    }
    // Runs once on mount; the option lists derive from the stable rows prop.
  }, []);

  async function copyView() {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // Clipboard API can be unavailable (permissions, older engines);
      // fall back to the textarea trick rather than failing silently.
      const ta = document.createElement("textarea");
      ta.value = window.location.href;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  const filtered = useMemo(() => {
    const list = rows.filter(
      (r) =>
        (stage === "all" || r.status === stage) &&
        (operator === "all" || r.operator === operator) &&
        (city === "all" || r.city === city) &&
        (!missingOnly ||
          (measureApplies(r, measure) && valueFor(r, measure) == null)),
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
  }, [rows, stage, operator, city, measure, sort, missingOnly]);

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
  const isFiltered =
    stage !== "all" || operator !== "all" || city !== "all" || missingOnly;

  function reset() {
    // Clears filters and the gap view; the chosen measure is kept, it is a
    // reading preference, not a filter.
    patchState({
      stage: "all",
      operator: "all",
      city: "all",
      sort: "mw",
      missingOnly: false,
    });
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
              onClick={() => patchState({ measure: m.key })}
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
            onChange={(e) => patchState({ stage: e.target.value })}
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
            onChange={(e) => patchState({ operator: e.target.value })}
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
            onChange={(e) => patchState({ city: e.target.value })}
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
            onChange={(e) => patchState({ sort: e.target.value as SortKey })}
            className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground focus:border-cyan focus:outline-none"
          >
            <option value="mw">Capacity (high to low)</option>
            <option value="name">Name (A to Z)</option>
            <option value="verified">Recently verified</option>
          </select>
        </div>
      </div>

      {/* Gap filter (external spec 2026-10-18 #11): "where the market is
          still unclear" is an inspectable state, deep-linkable via ?missing=1.
          A missing figure is an honest gap, never a zero. */}
      <label
        htmlFor="cx-missing"
        className="mt-3 inline-flex cursor-pointer items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <input
          id="cx-missing"
          type="checkbox"
          checked={missingOnly}
          onChange={(e) => patchState({ missingOnly: e.target.checked })}
          className="size-3.5 accent-cyan"
        />
        Show only records not disclosing this measure
      </label>

      {/* Traceable summary, announced to screen readers on every change */}
      <div
        aria-live="polite"
        className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-border/50 bg-accent/30 px-4 py-3 text-sm"
      >
        <span className="font-semibold tabular-nums text-foreground">
          {disclosed > 0 ? `${fmtMw(total)} MW` : "–"}
        </span>
        <span className="text-muted-foreground">{active.label.toLowerCase()} total</span>
        <span className="text-muted-foreground" aria-hidden="true">·</span>
        <span className="tabular-nums text-muted-foreground">
          {filtered.length} of {rows.length} records shown
        </span>
        <span className="text-muted-foreground" aria-hidden="true">·</span>
        {missingOnly ? (
          <span className="tabular-nums text-muted-foreground">
            showing only the {undisclosed} record{undisclosed === 1 ? "" : "s"} without a published figure
          </span>
        ) : (
          <span className="tabular-nums text-muted-foreground">
            {disclosed} with a published figure{undisclosed > 0 ? `, ${undisclosed} not disclosed` : ""}
          </span>
        )}
        <span className="ml-auto inline-flex items-center gap-4">
          {isFiltered && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan hover:underline"
            >
              <RotateCcw className="size-3" />
              Reset filters
            </button>
          )}
          <button
            type="button"
            onClick={copyView}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan hover:underline"
          >
            <Link2 className="size-3" aria-hidden="true" />
            {copied ? "Link copied" : "Copy link to this view"}
          </button>
        </span>
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
