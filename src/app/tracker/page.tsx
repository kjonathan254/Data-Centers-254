import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle, HardHat, ShieldCheck, Megaphone, Zap, Server, ArrowRight,
  Download, MapPin, Shield, GitCompareArrows, Map as MapIcon, Wifi,
  type LucideIcon,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getFacilities, getMarketSnapshot, STATUS_ORDER } from "@/lib/directory-data";

/**
 * Kenya Data Centre Tracker — the working view of the supply pipeline.
 * Where the directory answers "what exists", the tracker answers "what is
 * moving": staged pipeline board, verified live-load league, dated
 * deliveries, operator scoreboard and a data-confidence watchlist. Fully
 * server-rendered from directory-data.ts — every figure traceable.
 */

export const metadata: Metadata = {
  title: "Kenya Data Centre Tracker — Pipeline, Capacity & Operators",
  description:
    "Track Kenya's data centre supply as it moves: live capacity league, the under-construction / committed / early-stage pipeline board, dated deliveries, operator scoreboard and a data-confidence watchlist. Verified and sourced by Data Centre 254.",
  alternates: { canonical: "/tracker" },
  openGraph: {
    title: "Kenya Data Centre Tracker | Data Centre 254",
    description:
      "Live capacity, pipeline board, dated deliveries and operator scoreboard — every figure sourced and dated.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
    images: [{ url: "/images/africa-dc-map.webp", width: 1200, height: 675, alt: "Kenya data centre tracker — Data Centre 254" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenya Data Centre Tracker",
    description: "Live capacity, pipeline board, dated deliveries and operator scoreboard — sourced and dated.",
    images: ["/images/africa-dc-map.webp"],
  },
};

const STAGE_META: Record<
  string,
  { icon: LucideIcon; color: string; bar: string; badge: string }
> = {
  Operational: {
    icon: CheckCircle, color: "text-neon", bar: "bg-neon/70",
    badge: "border-neon/25 text-neon bg-neon/10",
  },
  "Under Construction": {
    icon: HardHat, color: "text-cyan", bar: "bg-cyan/70",
    badge: "border-cyan/25 text-cyan bg-cyan/10",
  },
  Committed: {
    icon: ShieldCheck, color: "text-amber-500", bar: "bg-amber-500/70",
    badge: "border-amber-500/25 text-amber-500 bg-amber-500/10",
  },
  "Early Stage": {
    icon: Megaphone, color: "text-muted-foreground", bar: "bg-muted-foreground/50",
    badge: "border-border text-muted-foreground bg-accent/50",
  },
};

const CONFIDENCE_DOT: Record<string, string> = {
  High: "bg-neon",
  Medium: "bg-amber-500",
  Low: "bg-red-400",
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function fmtVerified(v: string): string {
  const [y, m] = v.split("-");
  const mi = parseInt(m, 10) - 1;
  if (!y || Number.isNaN(mi) || !MONTHS[mi]) return v;
  return `${MONTHS[mi]} ${y}`;
}

function facilityMw(f: { totalCapacityMw: number | null; itLoadMw: number | null }): number | null {
  return f.totalCapacityMw ?? f.itLoadMw ?? null;
}

export default function TrackerPage() {
  const facilities = getFacilities();
  const snap = getMarketSnapshot();

  const operational = facilities
    .filter((f) => f.status === "Operational")
    .sort((a, b) => (b.itLoadMw ?? 0) - (a.itLoadMw ?? 0));
  const pipeline = facilities
    .filter((f) => f.status !== "Operational")
    .sort(
      (a, b) =>
        STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) ||
        (b.totalCapacityMw ?? 0) - (a.totalCapacityMw ?? 0),
    );
  const maxLiveMw = Math.max(...operational.map((f) => f.itLoadMw ?? 0), 0);
  const pipelineMw = pipeline.reduce((s, f) => s + (f.totalCapacityMw ?? 0), 0);
  const dated = pipeline.filter((f) => f.openedDate || f.expansionDate);
  const undated = pipeline.filter((f) => !(f.openedDate || f.expansionDate));

  // Operator scoreboard
  const byOperator = new Map<
    string,
    { name: string; type: string; parent: string | null; count: number; mw: number; stages: Set<string> }
  >();
  for (const f of facilities) {
    const row = byOperator.get(f.operatorId) ?? {
      name: f.operator.name,
      type: f.operator.type,
      parent: f.operator.parentCompany,
      count: 0,
      mw: 0,
      stages: new Set<string>(),
    };
    row.count += 1;
    row.mw += facilityMw(f) ?? 0;
    row.stages.add(f.status);
    byOperator.set(f.operatorId, row);
  }
  const scoreboard = [...byOperator.values()].sort((a, b) => b.mw - a.mw || b.count - a.count);

  // Data-confidence watchlist: lowest confidence first (stable sort keeps
  // that order when gap counts tie), with the fields we couldn't verify.
  const CONF_RANK = { Low: 0, Medium: 1, High: 2 } as const;
  const watchlist = facilities
    .filter((f) => f.dataConfidence !== "High")
    .sort(
      (a, b) =>
        CONF_RANK[a.dataConfidence as keyof typeof CONF_RANK] -
        CONF_RANK[b.dataConfidence as keyof typeof CONF_RANK],
    )
    .map((f) => ({
      f,
      gaps: [
        f.rackCount == null && "racks",
        f.coolingType == null && "cooling",
        f.powerSource == null && "power",
        f.status === "Operational" && f.itLoadMw == null && "live IT load",
      ].filter(Boolean) as string[],
    }))
    .sort((a, b) => b.gaps.length - a.gaps.length);

  const aiReady = facilities.filter((f) => f.aiReady).length;
  const lastVerified = snap.lastVerified;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 lg:py-16">
        <div className="container-site">
          {/* Header */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="eyebrow">Kenya DC Tracker</span>
              <h1 className="h-display mt-3 text-foreground">
                Kenya&apos;s data centre pipeline, tracked.
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                The directory tells you what exists. This page tells you what is
                moving — live capacity, the staged pipeline, dated deliveries and
                which operator holds which megawatts. Updated as claims are
                verified, never as they are issued.
              </p>
            </div>
            <div className="shrink-0 md:text-right">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neon/25 bg-neon/10 px-3 py-1 text-xs font-medium text-neon">
                <Shield className="size-3.5" />
                Dataset verified {fmtVerified(lastVerified)}
              </div>
              <p className="mt-2 text-xs text-muted-foreground md:text-right">
                {facilities.length} facilities · {snap.operators} operators ·{" "}
                <Link href="/methodology" className="text-cyan underline underline-offset-2 hover:text-foreground">
                  how we verify
                </Link>
              </p>
            </div>
          </div>

          {/* Momentum strip */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {[
              { icon: CheckCircle, label: "Live facilities", value: String(snap.stages[0].count), hint: "operational today" },
              { icon: Zap, label: "Verified live IT load", value: `${snap.liveItLoadMw.toFixed(1)} MW`, hint: "in service, not announced" },
              { icon: HardHat, label: "Pipeline facilities", value: String(pipeline.length), hint: `${pipelineMw.toFixed(1)} MW announced` },
              { icon: Wifi, label: "AI-ready", value: String(aiReady), hint: "of all tracked facilities" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="card-solid rounded-xl p-4 sm:p-5">
                  <Icon className="size-4 text-cyan" />
                  <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
                    {s.value}
                  </p>
                  <p className="text-[11px] leading-snug text-muted-foreground">
                    {s.label} · {s.hint}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Pipeline board */}
          <section aria-labelledby="board-title" className="mt-16">
            <div className="max-w-2xl">
              <h2 id="board-title" className="h-display-sm text-foreground">
                The pipeline board
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Capacity only counts once it serves a server. We stage every
                facility the way investors read supply — live, building,
                committed, announced — so working infrastructure and press
                releases never share a column.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {STATUS_ORDER.map((stage) => {
                const meta = STAGE_META[stage];
                const Icon = meta.icon;
                const inStage =
                  stage === "Operational" ? operational : pipeline.filter((f) => f.status === stage);
                const stageMw = inStage.reduce((s, f) => s + (f.totalCapacityMw ?? 0), 0);
                return (
                  <div key={stage} className="card-solid relative overflow-hidden rounded-xl">
                    <div className={`absolute inset-x-0 top-0 h-0.5 ${meta.bar}`} aria-hidden="true" />
                    <div className="p-4 sm:p-5">
                      <p className={`flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider ${meta.color}`}>
                        <Icon className="size-3.5" />
                        {stage === "Operational" ? "Live" : stage}
                      </p>
                      <p className="mt-2 text-xl font-semibold tabular-nums text-foreground">
                        {stageMw > 0 ? `${stageMw.toFixed(1)} MW` : "—"}
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                          {inStage.length} facilit{inStage.length === 1 ? "y" : "ies"}
                        </span>
                      </p>
                      <ul className="mt-4 space-y-2">
                        {inStage.map((f) => (
                          <li key={f.id}>
                            <Link
                              href={`/directory/${f.slug}`}
                              className="group block rounded-lg border border-border/40 bg-background/40 p-3 transition-colors hover:border-cyan/40"
                            >
                              <span className="flex items-center justify-between gap-2">
                                <span className="truncate text-sm font-medium text-foreground group-hover:text-cyan">
                                  {f.name}
                                </span>
                                <span className={`shrink-0 rounded-full border px-1.5 py-px text-[9px] font-bold uppercase tracking-wider ${meta.badge}`}>
                                  {facilityMw(f) != null ? `${facilityMw(f)} MW` : "n/a"}
                                </span>
                              </span>
                              <span className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                <MapPin className="size-3 shrink-0" />
                                {f.city}
                                <span className="ml-auto inline-flex items-center gap-1">
                                  <span className={`size-1.5 rounded-full ${CONFIDENCE_DOT[f.dataConfidence] ?? "bg-muted-foreground"}`} aria-hidden="true" />
                                  {f.dataConfidence}
                                </span>
                              </span>
                            </Link>
                          </li>
                        ))}
                        {inStage.length === 0 && (
                          <li className="rounded-lg border border-dashed border-border/40 p-3 text-[11px] text-muted-foreground">
                            Nothing tracked in this stage yet.
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Live load league + deliveries */}
          <section aria-labelledby="mw-title" className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-8">
            <div>
              <h2 id="mw-title" className="h-display-sm text-foreground">
                Where the megawatts actually run
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Verified in-service IT load per live facility — designed
                capacity is deliberately not counted here, because announced
                numbers are not electrons.
              </p>
              <ul className="mt-6 space-y-3">
                {operational.map((f) => {
                  const mw = f.itLoadMw ?? 0;
                  const pct = maxLiveMw > 0 ? Math.max((mw / maxLiveMw) * 100, 2) : 0;
                  return (
                    <li key={f.id}>
                      <Link href={`/directory/${f.slug}`} className="group block">
                        <span className="flex items-baseline justify-between gap-3 text-sm">
                          <span className="truncate font-medium text-foreground group-hover:text-cyan">
                            {f.name}
                          </span>
                          <span className="shrink-0 tabular-nums text-muted-foreground">
                            {f.itLoadMw != null ? `${f.itLoadMw} MW` : "not disclosed"}
                          </span>
                        </span>
                        <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-accent/60">
                          <span
                            className="block h-full rounded-full bg-gradient-to-r from-cyan/60 to-cyan"
                            style={{ width: `${pct}%` }}
                            aria-hidden="true"
                          />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground/70">
                Facilities without a published live IT load are shown at zero
                length, not excluded — the gap is the story.
              </p>
            </div>

            <div>
              <h2 className="h-display-sm text-foreground">Coming online</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Pipeline facilities with an announced target date come first.
                Where no date has been published, we say so — we do not guess
                delivery windows on a developer&apos;s behalf.
              </p>

              <h3 className="mt-6 text-xs font-mono uppercase tracking-widest text-cyan">
                Dated deliveries
              </h3>
              <ul className="mt-3 space-y-3">
                {dated.map((f) => {
                  const when = f.expansionDate ?? f.openedDate;
                  return (
                    <li key={f.id} className="card-solid rounded-xl p-4">
                      <p className="flex items-center justify-between gap-3">
                        <Link href={`/directory/${f.slug}`} className="truncate text-sm font-medium text-foreground hover:text-cyan">
                          {f.name}
                        </Link>
                        <span className="shrink-0 rounded-full border border-cyan/25 bg-cyan/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan">
                          {when}
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {f.operator.name} · {f.status} ·{" "}
                        {facilityMw(f) != null ? `${facilityMw(f)} MW` : "capacity n/a"}
                      </p>
                    </li>
                  );
                })}
                {dated.length === 0 && (
                  <li className="rounded-lg border border-dashed border-border/40 p-3 text-xs text-muted-foreground">
                    No pipeline facility has published a target date yet.
                  </li>
                )}
              </ul>

              <h3 className="mt-6 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                No target date announced
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {undated.map((f) => (
                  <li key={f.id}>
                    <Link
                      href={`/directory/${f.slug}`}
                      className="inline-block rounded-full border border-border/60 bg-accent/40 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-cyan/40 hover:text-cyan"
                    >
                      {f.name} · {facilityMw(f) != null ? `${facilityMw(f)} MW` : "capacity n/a"}
                    </Link>
                  </li>
                ))}
                {undated.length === 0 && (
                  <li className="text-xs text-muted-foreground">Every tracked pipeline facility has a date.</li>
                )}
              </ul>
            </div>
          </section>

          {/* Operator scoreboard */}
          <section aria-labelledby="operators-title" className="mt-16">
            <div className="max-w-2xl">
              <h2 id="operators-title" className="h-display-sm text-foreground">
                Operator scoreboard
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Designed capacity across all four stages, per operator. Pipeline
                megawatts are developer-announced and marked as such — sort
                accordingly.
              </p>
            </div>
            <div className="card-solid mt-6 overflow-x-auto rounded-xl">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <caption className="sr-only">Operators ranked by total tracked capacity</caption>
                <thead>
                  <tr className="border-b border-border/60 text-left text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    <th scope="col" className="px-4 py-3 font-medium">Operator</th>
                    <th scope="col" className="px-4 py-3 font-medium">Facilities</th>
                    <th scope="col" className="px-4 py-3 font-medium">Stages</th>
                    <th scope="col" className="px-4 py-3 text-right font-medium">Capacity (MW)</th>
                  </tr>
                </thead>
                <tbody>
                  {scoreboard.map((o) => (
                    <tr key={o.name} className="border-b border-border/30 last:border-b-0">
                      <td className="px-4 py-3">
                        <span className="block font-medium text-foreground">{o.name}</span>
                        <span className="block text-[11px] text-muted-foreground">
                          {o.type}
                          {o.parent ? ` · ${o.parent}` : ""}
                        </span>
                      </td>
                      <td className="px-4 py-3 tabular-nums text-muted-foreground">{o.count}</td>
                      <td className="px-4 py-3">
                        <span className="flex flex-wrap gap-1">
                          {[...o.stages].map((s) => (
                            <span
                              key={s}
                              className={`rounded-full border px-1.5 py-px text-[9px] font-bold uppercase tracking-wider ${STAGE_META[s]?.badge ?? STAGE_META["Early Stage"].badge}`}
                            >
                              {s === "Operational" ? "Live" : s}
                            </span>
                          ))}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums text-foreground">
                        {o.mw > 0 ? o.mw.toFixed(1) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Data-confidence watchlist */}
          <section aria-labelledby="watchlist-title" className="mt-16">
            <div className="max-w-2xl">
              <h2 id="watchlist-title" className="h-display-sm text-foreground">
                Data-confidence watchlist
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                The rows we are least sure about, printed in public. Confidence
                is graded per facility — High means operator-confirmed, Medium
                means single-source, Low means fragmentary. Gaps listed are the
                fields we are actively chasing.
              </p>
            </div>
            <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
              {watchlist.map(({ f, gaps }) => (
                <li key={f.id} className="card-solid rounded-xl p-4">
                  <p className="flex items-center justify-between gap-3">
                    <Link href={`/directory/${f.slug}`} className="truncate text-sm font-medium text-foreground hover:text-cyan">
                      {f.name}
                    </Link>
                    <span className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <span className={`size-1.5 rounded-full ${CONFIDENCE_DOT[f.dataConfidence] ?? "bg-muted-foreground"}`} aria-hidden="true" />
                      {f.dataConfidence} confidence
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {gaps.length ? `Unverified: ${gaps.join(", ")}.` : "Confidence limited to a single source — corroborating evidence welcome."}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Cross-links */}
          <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/40 pt-8 text-sm">
            <Link href="/directory" className="inline-flex items-center gap-1.5 text-cyan underline hover:underline">
              Browse every facility <ArrowRight className="size-3.5" />
            </Link>
            <Link href="/directory/compare" className="inline-flex items-center gap-1.5 text-cyan underline hover:underline">
              <GitCompareArrows className="size-3.5" /> Compare facilities side by side
            </Link>
            <Link href="/infrastructure/map" className="inline-flex items-center gap-1.5 text-cyan underline hover:underline">
              <MapIcon className="size-3.5" /> View the infrastructure map
            </Link>
            <a href="/api/directory/csv" download className="inline-flex items-center gap-1.5 text-cyan underline hover:underline">
              <Download className="size-3.5" /> Download the dataset (CSV)
            </a>
            <a href="/reports/dc254-kenya-data-centre-index-2026.pdf" className="inline-flex items-center gap-1.5 text-cyan underline hover:underline">
              Kenya Data Centre Index 2026 (free PDF)
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
