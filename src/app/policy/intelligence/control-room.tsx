"use client";

/**
 * Policy Intelligence Control Room (audit redesign 2026-09-23).
 *
 * One coordinated dashboard canvas instead of a vertically stacked report:
 *
 *   [since last review — slim strip]
 *   [evidence health anchor]  [country comparison]
 *   [coverage matrix — dominant, sticky toolbar, drawer]
 *   [research queue alerts]   [gaps by pillar]
 *   [selected country control room — tabs]
 *   [legend]
 *
 * Cross-panel interaction: selecting a country (comparison bar, matrix column
 * header, or drawer footer) focuses its matrix column and switches the
 * control-room panel. All content is server-rendered HTML (rooms are hidden,
 * not unmounted) so the evidence stays crawlable.
 */

import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import CopyButton from "@/components/copy-button";
import { POLICY_STATES, POLICY_GAP_STYLE } from "@/lib/policy/config";
import { countLabel } from "@/lib/policy";
import MatrixConsole from "./matrix-console";
import { CountUp, useInView, useWipe } from "./motion";
import type { OpsData, OpsGap, OpsSource } from "./dashboard-types";

const STATE_ORDER = ["verified", "partially-verified", "capture-pending", "unverified", "contradicted"] as const;
const STATE_META: Record<string, { label: string; dot: string; text: string; seg: string }> = Object.fromEntries(
  Object.entries(POLICY_STATES).map(([k, v]) => [
    k,
    { label: v.label, dot: v.dot, text: v.chip.match(/text-[\w-]+/)?.[0] ?? "text-slate-300", seg: v.dot },
  ])
);

const DOMAIN_LABELS: Record<string, string> = {
  communications: "Communications",
  dataProtection: "Data protection",
  investment: "Investment & zones",
  energy: "Energy",
  environment: "Environment",
  ict: "ICT & digital",
  tax: "Tax",
};

type RoomTab = "overview" | "claims" | "regulators" | "sources" | "gaps";
const ROOM_TABS: { id: RoomTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "claims", label: "Claims" },
  { id: "regulators", label: "Regulators" },
  { id: "sources", label: "Sources" },
  { id: "gaps", label: "Research gaps" },
];

function PanelLabel({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">{children}</h2>
      {right}
    </div>
  );
}

// ─── Since last review ─────────────────────────────────────────────────────

function SinceLastReview({ since }: { since: OpsData["sinceReview"] }) {
  const toneCls: Record<string, string> = {
    up: "text-emerald-400",
    flat: "text-slate-300",
    note: "text-sky-300",
  };
  return (
    <section
      aria-label="Changes since last dataset review"
      className="rounded-xl border border-[rgba(135,180,220,0.16)] bg-[#0B1627] p-4 sm:p-5"
    >
      <PanelLabel
        right={
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
            {since.fromVersion.replace("policy-", "")} → {since.toVersion.replace("policy-", "")} ·{" "}
            {since.date}
          </span>
        }
      >
        Since last dataset review
      </PanelLabel>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {since.items.map((it) => (
          <li key={it.label} className="rounded-lg border border-[rgba(135,180,220,0.10)] bg-[#101D30] px-3 py-2.5">
            <p className={`text-sm font-semibold ${toneCls[it.tone] ?? "text-slate-200"}`}>{it.label}</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{it.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── Evidence health (anchor card) ─────────────────────────────────────────

function EvidenceHealth({ data }: { data: OpsData }) {
  const m = data.meta;
  const total = m.claims || 1;
  const other = Math.max(total - m.verified - m.partial, 0);
  const wipe = useWipe<HTMLDivElement>();
  return (
    <div className="flex h-full flex-col rounded-xl border border-[rgba(135,180,220,0.16)] bg-[#0E1D31] p-5 transition-colors duration-300 hover:border-[rgba(135,180,220,0.30)]">
      <PanelLabel right={<CoverageTooltip />}>Regional evidence health</PanelLabel>
      <div className="mt-3 flex items-end justify-between gap-4">
        <p className="font-mono text-6xl font-bold leading-none text-white">
          <CountUp value={m.coveragePct} />
          <span className="text-2xl text-slate-500">%</span>
        </p>
        <p className="text-right text-xs leading-relaxed text-slate-400">
          evidence coverage across the audited claim set
        </p>
      </div>
      <div className="mt-5" aria-hidden="true">
        <div ref={wipe.ref} className="flex h-3 w-full gap-px overflow-hidden rounded-full bg-[#0B1627]">
          <div className={`flex h-full w-full gap-px overflow-hidden rounded-full ${wipe.cls}`} style={{ animationDelay: "120ms" }}>
            <span className="bg-emerald-500" style={{ width: `${(m.verified / total) * 100}%` }} />
            <span className="bg-amber-500" style={{ width: `${(m.partial / total) * 100}%` }} />
            {other > 0 && <span className="bg-slate-600" style={{ width: `${(other / total) * 100}%` }} />}
          </div>
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-wider">
          <span className="text-emerald-400">Verified</span>
          <span className="text-amber-400">Partial</span>
          <span className="text-slate-500">Other states</span>
        </div>
      </div>
      <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-[rgba(135,180,220,0.10)] pt-4">
        {[
          { v: m.claims, k: "claims" },
          { v: m.sources, k: "sources" },
          { v: m.gaps, k: "structured gaps", plural: "structured gaps", singular: "structured gap" },
        ].map((s) => (
          <div key={s.k}>
            <dd className="font-mono text-xl font-bold text-white">
              <CountUp value={s.v} duration={1100} />
            </dd>
            <dt className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{s.k}</dt>
          </div>
        ))}
      </dl>
      <p className="mt-auto pt-4 text-[11px] leading-relaxed text-slate-500">
        <span className="text-emerald-400">{m.verified} verified</span> ·{" "}
        <span className="text-amber-400">{m.partial} partial</span> ·{" "}
        <span className={POLICY_GAP_STYLE.text}>{m.gaps} structured gaps</span> — gaps are unresearched
        pillars, never findings.
      </p>
    </div>
  );
}

function CoverageTooltip() {
  return (
    <span
      title="Coverage = verified claims ÷ audited claims. Structured gaps are excluded from the denominator."
      className="cursor-help rounded border border-dashed border-slate-600 px-1.5 py-px font-mono text-[9px] uppercase tracking-wider text-slate-400"
    >
      what is this?
    </span>
  );
}

// ─── Country comparison (ranked bars) ──────────────────────────────────────

function CountryComparison({
  data,
  focus,
  onSelect,
}: {
  data: OpsData;
  focus: string | null;
  onSelect: (key: string) => void;
}) {
  const ranked = [...data.countries].sort(
    (a, b) => b.coveragePct - a.coveragePct || b.claims - a.claims
  );
  const wipe = useWipe<HTMLUListElement>();
  return (
    <div className="flex h-full flex-col rounded-xl border border-[rgba(135,180,220,0.16)] bg-[#0E1D31] p-5 transition-colors duration-300 hover:border-[rgba(135,180,220,0.30)]" id="countries">
      <PanelLabel right={<span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">click to focus</span>}>
        Country comparison
      </PanelLabel>
      <ul ref={wipe.ref} className="mt-4 flex-1 space-y-4">
        {ranked.map((c, i) => {
          const isFocus = focus === c.key;
          return (
            <li key={c.key}>
              <button
                type="button"
                onClick={() => onSelect(c.key)}
                aria-pressed={isFocus}
                className={`group w-full rounded-lg px-1 py-0.5 text-left transition-colors ${isFocus ? "text-cyan-300" : ""}`}
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium text-slate-200 group-hover:text-cyan-300">
                    {c.name} <span className="ml-1 font-mono text-[10px] text-slate-500">{c.iso}</span>
                  </span>
                  <span className="font-mono text-sm font-bold text-white">
                    <CountUp value={c.coveragePct} duration={1100} />%
                  </span>
                </span>
                <span className="mt-1.5 block h-2.5 w-full overflow-hidden rounded-full bg-[#0B1627]">
                  <span
                    className={`block h-full rounded-full transition-all ${wipe.cls} ${
                      isFocus ? "bg-cyan-400" : "bg-emerald-500/80 group-hover:bg-cyan-400/80"
                    }`}
                    style={{ width: `${c.coveragePct}%`, animationDelay: `${i * 110}ms` }}
                  />
                </span>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  {c.verified} verified · {c.partial} partial · {c.facilities}{" "}
                  {c.facilities === 1 ? "facility" : "facilities"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Research queue (alert panel) ──────────────────────────────────────────

function ResearchQueueAlert({ gaps, pillarLabel }: { gaps: OpsGap[]; pillarLabel: (id: string) => string }) {
  const [expanded, setExpanded] = useState(false);
  const high = gaps.filter((g) => g.priority === "high").length;
  const rows = expanded ? gaps : gaps.slice(0, 5);
  return (
    <div className="flex h-full flex-col rounded-xl border border-[rgba(135,180,220,0.16)] bg-[#0E1D31] p-5">
      <PanelLabel
        right={
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-px text-cyan-300">
              {high} high
            </span>
            <span className="rounded-full border border-slate-700 px-2 py-px text-slate-400">
              {gaps.length - high} medium
            </span>
          </span>
        }
      >
        Open research queue <span className="ml-1 text-slate-300">{gaps.length}</span>
      </PanelLabel>
      <ol className="mt-4 flex-1 divide-y divide-[rgba(135,180,220,0.08)]">
        {rows.map((g, i) => (
          <li key={`${g.country}-${g.pillar}`}>
            <details className="group">
              <summary className="flex cursor-pointer list-none items-baseline gap-3 py-2.5 transition-colors hover:bg-[#13253A]/40 [&::-webkit-details-marker]:hidden">
                <span className="font-mono text-[10px] text-slate-600">{String(i + 1).padStart(2, "0")}</span>
                <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                  g.priority === "high"
                    ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                    : "border-slate-700 text-slate-400"
                }`}>
                  {g.priority === "high" && (
                    <span className="relative flex size-1.5" aria-hidden="true">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-70" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-cyan-400" />
                    </span>
                  )}
                  {g.priority}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-slate-200">
                    {g.countryName} · {pillarLabel(g.pillar)}
                  </span>
                  <span className="block truncate text-xs text-slate-500">{g.upgradePath}</span>
                </span>
                <ChevronRight className="size-3.5 shrink-0 text-slate-600 transition-transform group-open:rotate-90" aria-hidden="true" />
              </summary>
              <div className="border-l border-cyan-500/20 bg-[#0B1627]/60 px-4 py-3">
                <p className="text-xs leading-relaxed text-slate-300">{g.gap}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-600">Expected sources · </span>
                  {g.expectedSources.join("; ")}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-600">Upgrade path · </span>
                  {g.upgradePath}
                </p>
              </div>
            </details>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mt-3 w-full rounded-lg border border-slate-700/70 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-cyan-500/40 hover:text-cyan-300"
      >
        {expanded ? "Show top 5 only" : `View all ${gaps.length} research gaps`}
      </button>
    </div>
  );
}

// ─── Gaps by pillar (ranked bars) ──────────────────────────────────────────

function GapsByPillar({ gaps, pillarLabel }: { gaps: OpsGap[]; pillarLabel: (id: string) => string }) {
  const counts = new Map<string, number>();
  for (const g of gaps) counts.set(g.pillar, (counts.get(g.pillar) ?? 0) + 1);
  const rows = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const max = rows[0]?.[1] ?? 1;
  const wipe = useWipe<HTMLUListElement>();
  return (
    <div className="flex h-full flex-col rounded-xl border border-[rgba(135,180,220,0.16)] bg-[#0E1D31] p-5 transition-colors duration-300 hover:border-[rgba(135,180,220,0.30)]">
      <PanelLabel right={<span className={`font-mono text-[10px] uppercase tracking-wider ${POLICY_GAP_STYLE.text}`}>structured gaps</span>}>
        Open gaps by pillar
      </PanelLabel>
      <ul ref={wipe.ref} className="mt-4 flex-1 space-y-3">
        {rows.map(([pid, n], i) => (
          <li key={pid}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xs text-slate-300">{pillarLabel(pid)}</span>
              <span className="font-mono text-xs font-bold text-slate-200">{n}</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#0B1627]">
              <div
                className={`h-full rounded-full bg-violet-400/70 ${wipe.cls}`}
                style={{ width: `${(n / max) * 100}%`, animationDelay: `${i * 90}ms` }}
              />
            </div>
          </li>
        ))}
        {rows.length === 0 && <li className="text-sm text-slate-500">No open gaps.</li>}
      </ul>
    </div>
  );
}

// ─── Country control room (tabs) ───────────────────────────────────────────

function ClaimCard({ claim }: { claim: OpsData["claims"][number] }) {
  const cfg = STATE_META[claim.state];
  return (
    <li className="rounded-lg border border-[rgba(135,180,220,0.16)] bg-[#101D30] p-4">
      <div className="flex flex-wrap items-center gap-2">
        {cfg && (
          <span
            title={POLICY_STATES[claim.state as keyof typeof POLICY_STATES]?.blurb}
            className={`inline-flex items-center gap-1.5 rounded-full border border-slate-700 px-2 py-0.5 text-[10px] font-medium ${cfg.text}`}
          >
            <span className={`size-1.5 rounded-full ${cfg.dot}`} aria-hidden="true" />
            {cfg.label}
          </span>
        )}
        <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500">{claim.id}</span>
        <CopyButton value={claim.id} className="ml-auto" />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-200">{claim.statement}</p>
      {claim.note && <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{claim.note}</p>}
      <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">
        Evidence strength: {claim.strength} · {claim.captureSummary}
      </p>
      {claim.sources.length > 0 && (
        <details className="mt-2">
          <summary className="cursor-pointer list-none font-mono text-[10px] uppercase tracking-widest text-sky-400 hover:text-sky-300 [&::-webkit-details-marker]:hidden">
            View evidence trail · {countLabel(claim.sources.length, "source")} ▾
          </summary>
          <ol className="mt-2 space-y-2 border-t border-[rgba(135,180,220,0.10)] pt-2">
            {claim.sources.map((s, i) => (
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
  );
}

function GapCard({ gap, pillarLabel }: { gap: OpsGap; pillarLabel: (id: string) => string }) {
  return (
    <div className={`rounded-lg border bg-violet-400/[0.04] p-4 ${POLICY_GAP_STYLE.chip}`}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
        Structured gap — not a finding · {pillarLabel(gap.pillar)}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{gap.gap}</p>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">Expected sources: {gap.expectedSources.join("; ")}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">Upgrade path: {gap.upgradePath}</p>
    </div>
  );
}

function CountryRoom({
  data,
  roomKey,
  tab,
  onTab,
  pillarLabel,
  switcher,
}: {
  data: OpsData;
  roomKey: string;
  tab: RoomTab;
  onTab: (t: RoomTab) => void;
  pillarLabel: (id: string) => string;
  switcher: React.ReactNode;
}) {
  const c = data.countries.find((x) => x.key === roomKey);
  if (!c) return null;
  const claims = data.claims.filter((cl) => cl.country === roomKey);
  const gaps = data.gaps.filter((g) => g.country === roomKey);
  const counts: Record<string, number> = {};
  for (const cl of claims) counts[cl.state] = (counts[cl.state] ?? 0) + 1;
  const uniqueSources: OpsSource[] = [];
  const seen = new Set<string>();
  for (const cl of claims) {
    for (const s of cl.sources) {
      if (!seen.has(s.id)) {
        seen.add(s.id);
        uniqueSources.push(s);
      }
    }
  }
  uniqueSources.sort((a, b) => a.tier - b.tier || a.publisher.localeCompare(b.publisher));
  const priorityGaps = gaps.filter((g) => g.priority === "high");

  return (
    <div className="rounded-xl border border-[rgba(135,180,220,0.16)] bg-[#0E1D31]">
      {/* Room header + country switcher + tabs */}
      <div className="border-b border-[rgba(135,180,220,0.16)] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <h3 className="text-xl font-bold text-white">
              {c.name} <span className="ml-1 font-mono text-xs text-slate-500">{c.iso}</span>
            </h3>
            <span className="font-mono text-[11px] text-slate-500">
              {c.coveragePct}% coverage · {countLabel(claims.length, "claim")} · {c.facilities}{" "}
              {c.facilities === 1 ? "facility" : "facilities"} · {countLabel(gaps.length, "open gap")}
            </span>
          </div>
          <div className="flex items-center gap-1" role="group" aria-label="Choose country control room">
            {switcher}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1" role="tablist" aria-label={`${c.name} control room sections`}>
          {ROOM_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => onTab(t.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === t.id ? "bg-cyan-500/15 text-cyan-300" : "text-slate-400 hover:bg-[#13253A]/60 hover:text-slate-200"
              }`}
            >
              {t.label}
              {t.id === "claims" && <span className="ml-1.5 font-mono text-[10px] text-slate-500">{claims.length}</span>}
              {t.id === "gaps" && <span className="ml-1.5 font-mono text-[10px] text-slate-500">{gaps.length}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Overview tab */}
      {tab === "overview" && (
        <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Evidence profile</p>
              <p className="mt-1.5 font-mono text-3xl font-bold text-white">{c.coveragePct}%</p>
              <div className="mt-2 flex h-2.5 w-full gap-px overflow-hidden rounded-full bg-[#0B1627]">
                {STATE_ORDER.map((s) =>
                  counts[s] ? (
                    <span key={s} className={STATE_META[s].seg} style={{ width: `${(counts[s] / claims.length) * 100}%` }} />
                  ) : null
                )}
              </div>
              <p className="mt-2 font-mono text-[11px]">
                <span className="text-emerald-400">{c.verified} verified</span>
                <span className="text-slate-600"> · </span>
                <span className="text-amber-400">{c.partial} partial</span>
                <span className="text-slate-600"> · </span>
                <span className={POLICY_GAP_STYLE.text}>{gaps.length} structured gaps</span>
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Investigated {c.investigatedLong}
                {c.facilitiesNote ? ` · ${c.facilitiesNote}` : ""}
              </p>
            </div>
            {priorityGaps.length > 0 && (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Priority gaps</p>
                <ul className="mt-2 space-y-1">
                  {priorityGaps.map((g) => (
                    <li key={g.pillar} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className={`size-1.5 rounded-full border border-dashed ${"border-violet-400"}`} aria-hidden="true" />
                      {pillarLabel(g.pillar)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {c.investigationNote && (
              <p className="border-t border-[rgba(135,180,220,0.10)] pt-3 text-[11px] leading-relaxed text-slate-500">
                {c.investigationNote}
              </p>
            )}
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Regulator map</p>
            <dl className="mt-2 space-y-1.5">
              {c.regulators.map((r) => (
                <div key={r.domain} className="flex flex-wrap items-baseline gap-x-2 text-xs">
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                    {DOMAIN_LABELS[r.domain] ?? r.domain}
                  </dt>
                  <dd className="text-slate-300">{r.name}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}

      {/* Claims tab */}
      {tab === "claims" && (
        <div className="space-y-6 p-4 sm:p-5">
          {data.pillars.map((p) => {
            const pClaims = claims.filter((cl) => cl.pillar === p.id);
            const pGap = gaps.find((g) => g.pillar === p.id);
            if (pClaims.length === 0 && !pGap) return null;
            return (
              <div key={p.id}>
                <h4 className="font-mono text-xs uppercase tracking-widest text-slate-400">
                  {p.label}
                  {pClaims.length > 0 && (
                    <span className="ml-2 text-slate-600">{countLabel(pClaims.length, "claim")}</span>
                  )}
                </h4>
                {pClaims.length > 0 && (
                  <ul className="mt-2 space-y-3">
                    {pClaims.map((cl) => (
                      <ClaimCard key={cl.id} claim={cl} />
                    ))}
                  </ul>
                )}
                {pGap && (
                  <div className={pClaims.length > 0 ? "mt-3" : "mt-2"}>
                    <GapCard gap={pGap} pillarLabel={pillarLabel} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Regulators tab */}
      {tab === "regulators" && (
        <div className="p-4 sm:p-5">
          <dl className="grid gap-3 sm:grid-cols-2">
            {c.regulators.map((r) => (
              <div key={r.domain} className="rounded-lg border border-[rgba(135,180,220,0.10)] bg-[#101D30] p-3">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  {DOMAIN_LABELS[r.domain] ?? r.domain}
                </dt>
                <dd className="mt-1 text-sm text-slate-200">{r.name}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Sources tab */}
      {tab === "sources" && (
        <div className="p-4 sm:p-5">
          <p className="text-xs text-slate-500">
            {countLabel(uniqueSources.length, "distinct source")} across this country&rsquo;s claims.
          </p>
          <ul className="mt-3 space-y-2">
            {uniqueSources.map((s) => (
              <li key={s.id} className="rounded-lg border border-[rgba(135,180,220,0.10)] bg-[#101D30] px-3 py-2">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-200 underline decoration-slate-600 underline-offset-2 hover:decoration-cyan-400"
                >
                  {s.publisher}
                </a>
                <span className="block text-xs text-slate-500">{s.label}</span>
                <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-wider text-slate-600">
                  T{s.tier} · {s.captureStatus}
                  {s.id ? ` · ${s.id}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gaps tab */}
      {tab === "gaps" && (
        <div className="space-y-3 p-4 sm:p-5">
          {gaps.map((g) => (
            <GapCard key={`${g.country}-${g.pillar}`} gap={g} pillarLabel={pillarLabel} />
          ))}
          {gaps.length === 0 && <p className="text-sm text-slate-500">No structured gaps for this country.</p>}
        </div>
      )}
    </div>
  );
}

// ─── Legend ────────────────────────────────────────────────────────────────

function Legend({ data }: { data: OpsData }) {
  const desc: Record<string, string> = {
    verified: "Strong evidence threshold met",
    "partially-verified": "Evidence exists; some elements unresolved",
    "capture-pending": "Source identified, not yet captured",
    unverified: "Does not yet meet the publication threshold",
    contradicted: "Credible evidence conflicts with the claim",
  };
  const liveCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const cl of data.claims) c[cl.state] = (c[cl.state] ?? 0) + 1;
    return c;
  }, [data.claims]);
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {Object.entries(POLICY_STATES).map(([key, cfg]) => (
        <div
          key={key}
          title={cfg.blurb}
          className="flex items-start gap-2.5 rounded-lg border border-[rgba(135,180,220,0.10)] bg-[#101D30] px-3 py-2.5 transition-colors duration-300 hover:border-[rgba(135,180,220,0.26)]"
        >
          <span className={`mt-1 size-2 shrink-0 rounded-full ${cfg.dot}`} aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-medium text-slate-200">{cfg.label}</span>
              {liveCounts[key] !== undefined && (
                <span className={`font-mono text-xs font-bold ${cfg.chip.match(/text-[\w-]+/)?.[0] ?? "text-slate-300"}`}>
                  {liveCounts[key]}
                  <span className="ml-1 font-normal text-slate-600">/ {data.meta.claims}</span>
                </span>
              )}
            </span>
            <span className="block text-xs leading-relaxed text-slate-500">{desc[key] ?? cfg.blurb}</span>
          </span>
        </div>
      ))}
      <div
        title="A gap is the condition of research coverage, not of a claim: the pillar is owned by the pipeline but has no researched statements yet."
        className={`flex items-start gap-2.5 rounded-lg border bg-transparent px-3 py-2.5 transition-colors duration-300 hover:border-violet-400/60 ${POLICY_GAP_STYLE.chip}`}
      >
        <span className="mt-1 size-2 shrink-0 rounded-full border border-dashed border-violet-400" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-2">
            <span className="text-sm font-medium text-slate-200">Structured gap</span>
            <span className={`font-mono text-xs font-bold ${POLICY_GAP_STYLE.text}`}>
              {data.gaps.length}
              <span className="ml-1 font-normal text-slate-600">pillars</span>
            </span>
          </span>
          <span className="block text-xs leading-relaxed text-slate-500">Pillar owned but not yet researched — never a finding</span>
        </span>
      </div>
    </div>
  );
}

// ─── Dashboard shell ───────────────────────────────────────────────────────

export default function ControlRoomDashboard({ data }: { data: OpsData }) {
  const [focus, setFocus] = useState<string | null>(null);
  const [roomKey, setRoomKey] = useState<string>(
    () => [...data.countries].sort((a, b) => b.coveragePct - a.coveragePct || b.claims - a.claims)[0]?.key ?? data.countries[0]?.key ?? ""
  );
  const [roomTab, setRoomTab] = useState<RoomTab>("overview");

  const pillarLabel = useMemo(
    () => (id: string) => data.pillars.find((p) => p.id === id)?.label ?? id,
    [data.pillars]
  );

  function selectCountry(key: string) {
    setFocus(focus === key ? null : key);
    setRoomKey(key);
    document.getElementById("control-room")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="space-y-10">
      <SinceLastReview since={data.sinceReview} />

      {/* Row 1: evidence health + country comparison */}
      <div id="health" className="grid scroll-mt-28 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <EvidenceHealth data={data} />
        </div>
        <div className="lg:col-span-5">
          <CountryComparison data={data} focus={focus} onSelect={selectCountry} />
        </div>
      </div>

      {/* Row 2: the matrix (dominant) */}
      <section id="matrix" className="scroll-mt-28" aria-label="Policy coverage matrix">
        <PanelLabel
          right={
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
              {data.pillars.length} pillars · {data.countries.length} countries · {countLabel(data.meta.claims, "claim")}
            </span>
          }
        >
          Policy coverage matrix
        </PanelLabel>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
          The system map: every tile counts claims by verification state; dashed violet tags mark
          structured gaps. Select a tile to inspect the underlying claims, sources and upgrade paths.
        </p>
        <div className="mt-3">
          <MatrixConsole data={data} focus={focus} onFocus={(k) => setFocus(k)} />
        </div>
      </section>

      {/* Row 3: queue + gaps by pillar */}
      <div id="queue" className="grid scroll-mt-28 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ResearchQueueAlert gaps={data.gaps} pillarLabel={pillarLabel} />
        </div>
        <div className="lg:col-span-5">
          <GapsByPillar gaps={data.gaps} pillarLabel={pillarLabel} />
        </div>
      </div>

      {/* Row 4: country control room */}
      <section id="control-room" className="scroll-mt-28" aria-label="Country control room">
        <PanelLabel>Selected country control room</PanelLabel>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
          Drill into one market: evidence profile, regulator map, the full claim set with evidence
          trails, distinct sources and the open research gaps.
        </p>
        <div className="mt-3">
          <CountryRoomSwitcher data={data} roomKey={roomKey} setRoomKey={setRoomKey} roomTab={roomTab} setRoomTab={setRoomTab} pillarLabel={pillarLabel} />
        </div>
      </section>

      {/* Legend */}
      <section id="legend" className="scroll-mt-28" aria-label="Evidence states">
        <PanelLabel>Evidence states</PanelLabel>
        <div className="mt-4">
          <Legend data={data} />
        </div>
        <p className="mt-3 max-w-3xl text-xs leading-relaxed text-slate-500">
          Evidence states describe the condition of a <span className="text-slate-400">claim</span>.
          A gap describes the condition of <span className="text-slate-400">research coverage</span> —
          it is never a claim, and it never borrows a claim&rsquo;s status. Hover any state for the
          full definition.
        </p>
      </section>
    </div>
  );
}

/** Thin wrapper so the switcher buttons inside the room header can drive state. */
function CountryRoomSwitcher({
  data,
  roomKey,
  setRoomKey,
  roomTab,
  setRoomTab,
  pillarLabel,
}: {
  data: OpsData;
  roomKey: string;
  setRoomKey: (k: string) => void;
  roomTab: RoomTab;
  setRoomTab: (t: RoomTab) => void;
  pillarLabel: (id: string) => string;
}) {
  const switcher = (
    <div className="flex items-center gap-1 rounded-lg border border-slate-700/70 p-0.5" role="group" aria-label="Choose country control room">
      {data.countries.map((x) => (
        <button
          key={x.key}
          type="button"
          onClick={() => setRoomKey(x.key)}
          aria-pressed={x.key === roomKey}
          className={`rounded-md px-2 py-1 font-mono text-[10px] uppercase transition-colors ${
            x.key === roomKey ? "bg-cyan-500/15 text-cyan-300" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          {x.iso}
        </button>
      ))}
    </div>
  );
  return (
    <CountryRoom
      data={data}
      roomKey={roomKey}
      tab={roomTab}
      onTab={setRoomTab}
      pillarLabel={pillarLabel}
      switcher={switcher}
    />
  );
}
