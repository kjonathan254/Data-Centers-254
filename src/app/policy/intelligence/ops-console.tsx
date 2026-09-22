"use client";

/**
 * Policy Ops Console — the interactive core of /policy/intelligence.
 *
 * Renders the 10-pillar × 4-country coverage matrix as an operations panel:
 *  - every cell with claims or a gap is a clickable tile that opens a side
 *    drawer listing the underlying evidence records (claims + sources) and
 *    the structured gap / upgrade path;
 *  - filters by country, pillar and verification state (non-matching cells
 *    dim, they never disappear — the shape of coverage stays visible);
 *  - full-text search across claim text, IDs, pillars, regulators and sources;
 *  - mobile defaults to per-country cards, full matrix behind a toggle.
 *
 * Server component passes a fully serializable OpsData payload; all colours
 * are literal Tailwind classes so they survive content scanning.
 */

import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Search, X } from "lucide-react";
import CopyButton from "@/components/copy-button";

// ─── Serializable payload types (built on the server) ──────────────────────

export interface OpsSource {
  id: string;
  label: string;
  url: string;
  tier: number;
  publisher: string;
  captureStatus: string;
  excerpt: string;
}

export interface OpsClaim {
  id: string;
  country: string;
  countryName: string;
  pillar: string;
  statement: string;
  note: string;
  state: string;
  strength: string;
  captureSummary: string;
  sources: OpsSource[];
}

export interface OpsGap {
  country: string;
  countryName: string;
  pillar: string;
  gap: string;
  expectedSources: string[];
  upgradePath: string;
  priority: "high" | "medium";
}

export interface OpsCountry {
  key: string;
  name: string;
  iso: string;
  facilities: number;
  claims: number;
  verified: number;
  partial: number;
  coveragePct: number;
  investigatedShort: string;
  regulators: { domain: string; name: string }[];
}

export interface OpsCell {
  country: string;
  pillar: string;
  states: Record<string, number>;
  total: number;
  gap: boolean;
}

export interface OpsData {
  countries: OpsCountry[];
  pillars: { id: string; label: string; blurb: string }[];
  claims: OpsClaim[];
  gaps: OpsGap[];
  cells: OpsCell[];
  meta: {
    gateShort: string;
    gateFull: string;
    reviewedLong: string;
    schemaVersion: string;
    datasetVersion: string;
    claims: number;
    sources: number;
    gaps: number;
    verified: number;
    partial: number;
    coveragePct: number;
  };
}

// ─── Local style system (literal classes — safe for Tailwind scanning) ─────

const STATE_ORDER = [
  "verified",
  "partially-verified",
  "capture-pending",
  "unverified",
  "contradicted",
] as const;

const STATE_META: Record<string, { label: string; dot: string; text: string; seg: string }> = {
  verified: { label: "Verified", dot: "bg-emerald-500", text: "text-emerald-400", seg: "bg-emerald-500" },
  "partially-verified": { label: "Partial", dot: "bg-amber-500", text: "text-amber-400", seg: "bg-amber-500" },
  "capture-pending": { label: "Pending", dot: "bg-sky-500", text: "text-sky-400", seg: "bg-sky-500" },
  unverified: { label: "Unverified", dot: "bg-slate-400", text: "text-slate-400", seg: "bg-slate-500" },
  contradicted: { label: "Contradicted", dot: "bg-red-500", text: "text-red-400", seg: "bg-red-500" },
};

/** Pillar → regulator domain, used to surface the responsible institution in the drawer. */
const PILLAR_DOMAIN: Record<string, string> = {
  licensing: "communications",
  "data-protection": "dataProtection",
  "data-localisation-sovereignty": "dataProtection",
  "cross-border-data-flows": "dataProtection",
  "tax-incentives": "investment",
  "ai-digital-policy": "ict",
  "energy-electricity": "energy",
  environmental: "environment",
};

const DOMAIN_LABELS: Record<string, string> = {
  communications: "Communications",
  dataProtection: "Data protection",
  investment: "Investment & zones",
  energy: "Energy",
  environment: "Environment",
  ict: "ICT & digital",
  tax: "Tax",
};

type Filters = { country: string; pillar: string; state: string };

// ─── Component ─────────────────────────────────────────────────────────────

export default function OpsConsole({ data }: { data: OpsData }) {
  const [f, setF] = useState<Filters>({ country: "all", pillar: "all", state: "all" });
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"cards" | "matrix">("cards");
  const [active, setActive] = useState<{ country: string; pillar: string } | null>(null);

  const cells = useMemo(() => {
    const m = new Map<string, OpsCell>();
    for (const c of data.cells) m.set(`${c.country}|${c.pillar}`, c);
    return m;
  }, [data.cells]);

  const pillarIds = useMemo(
    () => (f.pillar === "all" ? data.pillars.map((p) => p.id) : [f.pillar]),
    [data.pillars, f.pillar]
  );

  const visibleCountries = useMemo(
    () => (f.country === "all" ? data.countries : data.countries.filter((c) => c.key === f.country)),
    [data.countries, f.country]
  );

  function cellDimmed(cell: OpsCell | undefined): boolean {
    if (!cell) return false;
    if (f.state === "gap") return !cell.gap;
    if (f.state !== "all" && !(cell.states[f.state] > 0)) return true;
    return false;
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return data.claims.filter((cl) => {
      const hay = [
        cl.id,
        cl.statement,
        cl.note,
        cl.countryName,
        cl.pillar,
        cl.state,
        ...cl.sources.map((s) => `${s.publisher} ${s.label}`),
      ]
        .join(" ")
        .toLowerCase();
      return q.split(/\s+/).every((tok) => hay.includes(tok));
    });
  }, [query, data.claims]);

  // Drawer body scroll lock + Escape to close.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active]);

  function openCell(country: string, pillar: string) {
    setActive({ country, pillar });
  }

  const activeGap = active ? data.gaps.find((g) => g.country === active.country && g.pillar === active.pillar) : undefined;
  const activeClaims = active
    ? data.claims.filter((cl) => cl.country === active.country && cl.pillar === active.pillar)
    : [];
  const activeCountry = active ? data.countries.find((c) => c.key === active.country) : undefined;
  const activePillar = active ? data.pillars.find((p) => p.id === active.pillar) : undefined;

  return (
    <div>
      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search claims, sources, regulators…"
            aria-label="Search claims, sources and regulators"
            className="h-9 w-full rounded-lg border border-slate-700 bg-slate-900/70 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/60 focus:outline-none"
          />
        </div>
        <Select
          label="Country"
          value={f.country}
          onChange={(v) => setF({ ...f, country: v })}
          options={[{ v: "all", l: "All countries" }, ...data.countries.map((c) => ({ v: c.key, l: c.name }))]}
        />
        <Select
          label="Pillar"
          value={f.pillar}
          onChange={(v) => setF({ ...f, pillar: v })}
          options={[{ v: "all", l: "All pillars" }, ...data.pillars.map((p) => ({ v: p.id, l: p.label }))]}
        />
        <Select
          label="State"
          value={f.state}
          onChange={(v) => setF({ ...f, state: v })}
          options={[
            { v: "all", l: "All states" },
            ...STATE_ORDER.map((s) => ({ v: s, l: STATE_META[s].label })),
            { v: "gap", l: "Gap" },
          ]}
        />
        <div className="flex items-center gap-1 rounded-lg border border-slate-700 p-0.5 lg:hidden" role="group" aria-label="Matrix view toggle">
          <button
            type="button"
            onClick={() => setView("cards")}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium ${view === "cards" ? "bg-slate-700/70 text-white" : "text-slate-400"}`}
          >
            Country view
          </button>
          <button
            type="button"
            onClick={() => setView("matrix")}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium ${view === "matrix" ? "bg-slate-700/70 text-white" : "text-slate-400"}`}
          >
            Compare
          </button>
        </div>
      </div>

      {/* ── Search results ──────────────────────────────────────────── */}
      {results ? (
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/30">
          <p className="border-b border-slate-800 px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest text-slate-500">
            {results.length} claim{results.length === 1 ? "" : "s"} match &ldquo;{query.trim()}&rdquo;
          </p>
          <ul className="divide-y divide-slate-800/70">
            {results.map((cl) => (
              <li key={cl.id}>
                <button
                  type="button"
                  onClick={() => openCell(cl.country, cl.pillar)}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-800/40"
                >
                  <span className={`mt-1.5 size-2 shrink-0 rounded-full ${STATE_META[cl.state]?.dot ?? "bg-slate-500"}`} aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500">{cl.id}</span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-600">
                        {cl.countryName} · {data.pillars.find((p) => p.id === cl.pillar)?.label ?? cl.pillar}
                      </span>
                    </span>
                    <span className="mt-1 block line-clamp-2 text-sm leading-relaxed text-slate-200">{cl.statement}</span>
                  </span>
                  <ChevronRight className="ml-auto mt-1 size-4 shrink-0 text-slate-600" aria-hidden="true" />
                </button>
              </li>
            ))}
            {results.length === 0 && (
              <li className="px-4 py-6 text-sm text-slate-500">No claims match. Try a regulator, pillar or state name.</li>
            )}
          </ul>
        </div>
      ) : (
        <>
          {/* ── Mobile / tablet: per-country cards ─────────────────── */}
          <div className={`mt-4 space-y-4 ${view === "cards" ? "lg:hidden" : "hidden"}`}>
            {visibleCountries.map((c) => (
              <div key={c.key} className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">
                    {c.name} <span className="ml-1 font-mono text-[10px] text-slate-500">{c.iso}</span>
                  </p>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                    {c.verified}V · {c.partial}P · {c.coveragePct}%
                  </span>
                </div>
                <ul className="mt-3 divide-y divide-slate-800/70">
                  {data.pillars.map((p) => {
                    const cell = cells.get(`${c.key}|${p.id}`);
                    if (!cell) return null;
                    return (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => openCell(c.key, p.id)}
                          className="flex w-full items-center justify-between gap-3 py-2.5 text-left"
                        >
                          <span className="text-sm text-slate-200">{p.label}</span>
                          <span className="flex items-center gap-1.5">
                            {STATE_ORDER.map((s) =>
                              cell.states[s] ? (
                                <span key={s} className={`font-mono text-[11px] ${STATE_META[s].text}`}>
                                  {cell.states[s]}
                                  <span className={`ml-0.5 inline-block size-1.5 rounded-full align-middle ${STATE_META[s].dot}`} />
                                </span>
                              ) : null
                            )}
                            {cell.gap && (
                              <span className="rounded-full border border-dashed border-slate-600 px-1.5 py-px font-mono text-[10px] text-slate-400">
                                gap
                              </span>
                            )}
                            <ChevronRight className="size-4 text-slate-600" aria-hidden="true" />
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* ── Desktop: the full matrix ───────────────────────────── */}
          <div className={`mt-4 overflow-x-auto rounded-xl border border-slate-800 ${view === "matrix" ? "" : "hidden lg:block"}`}>
            <table className="w-full min-w-[880px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60">
                  <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-widest text-slate-500">
                    Policy pillar
                  </th>
                  {data.countries.map((c) => (
                    <th
                      key={c.key}
                      className={`px-3 py-3 text-center font-medium transition-opacity ${
                        f.country === "all" || f.country === c.key ? "text-slate-300" : "text-slate-600 opacity-40"
                      }`}
                    >
                      {c.name}
                      <span className="block font-mono text-[10px] font-normal text-slate-500">
                        {c.claims} claims · {c.coveragePct}%
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pillarIds.map((pid) => {
                  const p = data.pillars.find((x) => x.id === pid);
                  if (!p) return null;
                  return (
                    <tr key={pid} className="border-b border-slate-800/60 last:border-0">
                      <td className="max-w-[240px] px-4 py-2 align-middle" title={p.blurb}>
                        <span className="text-sm font-medium text-slate-200">{p.label}</span>
                      </td>
                      {data.countries.map((c) => {
                        const cell = cells.get(`${c.key}|${pid}`);
                        const dim = cellDimmed(cell);
                        const hiddenCol = f.country !== "all" && f.country !== c.key;
                        if (!cell) {
                          return (
                            <td key={c.key} className={`px-3 py-2 text-center ${hiddenCol ? "opacity-40" : ""}`}>
                              <span className="text-xs text-slate-700">—</span>
                            </td>
                          );
                        }
                        return (
                          <td key={c.key} className={`px-1.5 py-1.5 ${hiddenCol ? "opacity-40" : ""}`}>
                            <button
                              type="button"
                              onClick={() => openCell(c.key, pid)}
                              aria-label={`${c.name} · ${p.label}: ${cell.total} claims${cell.gap ? " plus a structured gap" : ""}`}
                              className={`h-full min-h-[56px] w-full rounded-lg border p-2.5 text-left transition-all ${
                                dim ? "opacity-25" : ""
                              } border-slate-800 bg-slate-900/40 hover:border-cyan-500/50 hover:bg-slate-800/50 focus:border-cyan-400 focus:outline-none`}
                            >
                              {cell.total > 0 ? (
                                <>
                                  <span className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-800" aria-hidden="true">
                                    {STATE_ORDER.map((s) =>
                                      cell.states[s] ? (
                                        <span
                                          key={s}
                                          className={STATE_META[s].seg}
                                          style={{ width: `${(cell.states[s] / cell.total) * 100}%` }}
                                        />
                                      ) : null
                                    )}
                                  </span>
                                  <span className="mt-2 flex flex-wrap gap-x-2.5 gap-y-1">
                                    {STATE_ORDER.map((s) =>
                                      cell.states[s] ? (
                                        <span key={s} className={`font-mono text-[11px] leading-none ${STATE_META[s].text}`}>
                                          {cell.states[s]}
                                          <span className={`ml-1 inline-block size-1.5 rounded-full align-middle ${STATE_META[s].dot}`} />
                                        </span>
                                      ) : null
                                    )}
                                  </span>
                                </>
                              ) : (
                                <span className="font-mono text-[11px] leading-none text-slate-600">no claims</span>
                              )}
                              {cell.gap && (
                                <span className="mt-2 inline-block rounded-full border border-dashed border-slate-600 px-1.5 py-px font-mono text-[10px] leading-none text-slate-400">
                                  gap
                                </span>
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Cell drawer ─────────────────────────────────────────────── */}
      {active && (
        <div className="fixed inset-0 z-[110]">
          <button
            type="button"
            aria-label="Close evidence panel"
            onClick={() => setActive(null)}
            className="absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-sm"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={`${activeCountry?.name ?? ""} · ${activePillar?.label ?? ""} evidence`}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-slate-800 bg-background shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 p-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  {activeCountry?.name} · {activePillar?.label}
                </p>
                <p className="mt-1.5 text-sm text-slate-300">
                  {activeClaims.length > 0 && (
                    <>
                      {activeClaims.map((cl, i) => (
                        <span key={cl.id}>
                          {i > 0 && " · "}
                          <span className={STATE_META[cl.state]?.text}>{activeClaims.filter((x) => x.state === cl.state).length}</span>{" "}
                          {STATE_META[cl.state]?.label.toLowerCase()}
                        </span>
                      ))}
                    </>
                  )}
                  {activeGap && (
                    <span className={activeClaims.length > 0 ? "text-slate-500" : ""}>
                      {activeClaims.length > 0 ? " · " : ""}
                      1 structured gap
                    </span>
                  )}
                  {!activeGap && activeClaims.length === 0 && "No researched coverage"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close panel"
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {activePillar && <p className="mb-4 text-xs leading-relaxed text-slate-500">{activePillar.blurb}</p>}

              {activeCountry && (
                <p className="mb-4 rounded-lg border border-slate-800 bg-slate-900/40 p-3 text-xs leading-relaxed text-slate-400">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    {PILLAR_DOMAIN[active.pillar] && activeCountry.regulators.some((r) => r.domain === PILLAR_DOMAIN[active.pillar])
                      ? "Responsible regulator"
                      : "Regulators in scope"}
                  </span>
                  <span className="mt-1 block">
                    {PILLAR_DOMAIN[active.pillar] &&
                    activeCountry.regulators.some((r) => r.domain === PILLAR_DOMAIN[active.pillar])
                      ? activeCountry.regulators
                          .filter((r) => r.domain === PILLAR_DOMAIN[active.pillar])
                          .map((r) => r.name)
                          .join(" · ")
                      : activeCountry.regulators.map((r) => r.name).join(" · ")}
                  </span>
                </p>
              )}

              {activeGap && (
                <div className="mb-4 rounded-lg border border-dashed border-slate-600 bg-slate-900/20 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    Structured gap — not a finding
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{activeGap.gap}</p>
                  {activeGap.expectedSources.length > 0 && (
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">
                      Expected sources: {activeGap.expectedSources.join("; ")}
                    </p>
                  )}
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">Upgrade path: {activeGap.upgradePath}</p>
                </div>
              )}

              <ul className="space-y-3">
                {activeClaims.map((cl) => (
                  <li key={cl.id} className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border border-slate-700 px-2 py-0.5 text-[10px] font-medium ${STATE_META[cl.state]?.text}`}
                      >
                        <span className={`size-1.5 rounded-full ${STATE_META[cl.state]?.dot}`} aria-hidden="true" />
                        {STATE_META[cl.state]?.label}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500">{cl.id}</span>
                      <CopyButton value={cl.id} className="ml-auto" />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-200">{cl.statement}</p>
                    {cl.note && <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{cl.note}</p>}
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                      Evidence strength: {cl.strength} · {cl.captureSummary}
                    </p>
                    {cl.sources.length > 0 && (
                      <details className="group mt-2">
                        <summary className="cursor-pointer list-none font-mono text-[10px] uppercase tracking-widest text-sky-400 hover:text-sky-300 [&::-webkit-details-marker]:hidden">
                          Evidence trail · {cl.sources.length} source{cl.sources.length === 1 ? "" : "s"} ▾
                        </summary>
                        <ol className="mt-2 space-y-2 border-t border-slate-800 pt-2">
                          {cl.sources.map((s, i) => (
                            <li key={`${s.id}-${i}`} className="text-xs leading-relaxed text-slate-400">
                              <a
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-300 underline decoration-slate-600 underline-offset-2 hover:decoration-slate-300"
                              >
                                {i + 1}. {s.publisher}
                              </a>{" "}
                              — {s.label}
                              <span className="ml-1.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-slate-500">
                                T{s.tier} · {s.captureStatus}
                              </span>
                              {s.excerpt && (
                                <span className="mt-1 block border-l border-slate-700 pl-2 font-mono text-[10px] leading-relaxed text-slate-500 line-clamp-4">
                                  {s.excerpt}
                                </span>
                              )}
                            </li>
                          ))}
                        </ol>
                      </details>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {activeCountry && (
              <div className="border-t border-slate-800 p-4">
                <a
                  href={`#room-${activeCountry.key}`}
                  onClick={() => setActive(null)}
                  className="flex items-center justify-between rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2.5 text-sm font-medium text-cyan-300 transition-colors hover:bg-cyan-500/15"
                >
                  Open the {activeCountry.name} control room
                  <ChevronRight className="size-4" aria-hidden="true" />
                </a>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

// ─── Small styled select ───────────────────────────────────────────────────

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { v: string; l: string }[];
}) {
  return (
    <select
      aria-label={`Filter by ${label.toLowerCase()}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-lg border border-slate-700 bg-slate-900/70 px-2 text-xs text-slate-300 focus:border-cyan-500/60 focus:outline-none"
    >
      {options.map((o) => (
        <option key={o.v} value={o.v} className="bg-slate-900">
          {o.l}
        </option>
      ))}
    </select>
  );
}
