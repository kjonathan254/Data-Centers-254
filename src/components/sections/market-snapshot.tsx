import Link from "next/link";
import {
  CheckCircle, HardHat, ShieldCheck, Megaphone, Zap, ArrowRight, Download,
  type LucideIcon,
} from "lucide-react";
import { getMarketSnapshot } from "@/lib/directory-data";

/**
 * Market Snapshot — pipeline-staged supply view (Live / Under Construction /
 * Committed / Early Stage) with the methodology printed underneath, DC-Byte
 * style but honest: built capacity and verified live IT load reported
 * separately. Server component; every number comes from directory-data.ts.
 */

const STAGE_META: Record<
  string,
  { icon: LucideIcon; color: string; bar: string; hint: string }
> = {
  Operational: {
    icon: CheckCircle,
    color: "text-neon",
    bar: "bg-neon/70",
    hint: "Built and commissioned",
  },
  "Under Construction": {
    icon: HardHat,
    color: "text-cyan",
    bar: "bg-cyan/70",
    hint: "Financed, build underway",
  },
  Committed: {
    icon: ShieldCheck,
    color: "text-amber-500",
    bar: "bg-amber-500/70",
    hint: "Land or funding secured, pre-build",
  },
  "Early Stage": {
    icon: Megaphone,
    color: "text-muted-foreground",
    bar: "bg-muted-foreground/50",
    hint: "Announced intent",
  },
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function fmtVerified(v: string): string {
  const [y, m] = v.split("-");
  const mi = parseInt(m, 10) - 1;
  if (!y || isNaN(mi) || !MONTHS[mi]) return v;
  return `${MONTHS[mi]} ${y}`;
}

export default function MarketSnapshot() {
  const snap = getMarketSnapshot();

  return (
    <section aria-labelledby="market-snapshot-title" className="py-14 lg:py-20">
      <div className="container-site">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow">Market snapshot</span>
            <h2 id="market-snapshot-title" className="h-display mt-3 text-foreground">
              Kenya&apos;s data centre supply, staged.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Capacity moves through a pipeline before it serves a single
              server. We stage it the way investors read it — so you can tell
              working infrastructure from press releases.
            </p>
          </div>
          <div className="shrink-0 md:text-right">
            <div className="text-4xl font-bold tracking-tight text-foreground tabular-nums lg:text-5xl">
              {snap.totalSupplyMw.toFixed(1)} <span className="text-2xl lg:text-3xl text-muted-foreground">MW</span>
            </div>
            <div className="mt-1 text-xs font-mono uppercase tracking-widest text-cyan">
              Total supply · all stages
            </div>
          </div>
        </div>

        {/* Stage tiles */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          {snap.stages.map((s) => {
            const meta = STAGE_META[s.stage];
            const Icon = meta.icon;
            return (
              <div key={s.stage} className="card-solid relative overflow-hidden rounded-xl p-4 sm:p-5">
                <div className={`absolute inset-x-0 top-0 h-0.5 ${meta.bar}`} aria-hidden="true" />
                <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  <Icon className={`size-3.5 ${meta.color}`} />
                  {s.stage === "Operational" ? "Live" : s.stage}
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground tabular-nums">
                  {s.mw.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">MW</span>
                </p>
                <p className="mt-1 text-[11px] leading-snug text-muted-foreground/80">
                  {s.count} facilit{s.count === 1 ? "y" : "ies"} · {meta.hint}
                </p>
              </div>
            );
          })}
          <div className="card-solid relative overflow-hidden rounded-xl border-cyan/30 p-4 sm:p-5">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-cyan" aria-hidden="true" />
            <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-cyan">
              <Zap className="size-3.5" />
              Total supply
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground tabular-nums">
              {snap.totalSupplyMw.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">MW</span>
            </p>
            <p className="mt-1 text-[11px] leading-snug text-muted-foreground/80">
              {snap.facilities} facilities · {snap.operators} operators
            </p>
          </div>
        </div>

        {/* Printed definition — the trust layer that paid trackers bolt behind signup */}
        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted-foreground/80">
          <strong className="font-medium text-muted-foreground">How we count:</strong>{" "}
          Total supply is the sum of designed capacity across all four stages.
          Of the {snap.stages[0].mw.toFixed(1)} MW of live capacity,{" "}
          {snap.liveItLoadMw.toFixed(1)} MW is verified in-service IT load;
          pipeline figures are developer-announced. Every facility carries its
          source and verification date — last verified {fmtVerified(snap.lastVerified) || "August 2026"}.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <Link href="/directory" className="inline-flex items-center gap-1.5 text-cyan underline hover:underline">
            Browse every facility <ArrowRight className="size-3.5" />
          </Link>
          <a href="/reports/dc254-kenya-data-centre-index-2026.pdf" className="inline-flex items-center gap-1.5 text-cyan underline hover:underline">
            <Download className="size-3.5" /> Kenya Data Centre Index 2026 (free PDF)
          </a>
          <Link href="/methodology" className="text-muted-foreground hover:text-cyan underline hover:underline">
            Verification methodology
          </Link>
        </div>
      </div>
    </section>
  );
}
