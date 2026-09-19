import type { Metadata } from "next";
import Link from "next/link";
import {
  Database, Cable, Zap, Landmark, Globe2, Download, FileSpreadsheet,
  ArrowRight, ShieldCheck, GitCompareArrows, CheckCircle2, HardHat,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  SUBSEA_CABLES, POWER_TARIFFS, LICENSING_REGIMES,
} from "@/lib/market-trackers";
import { SITE_URL } from "@/lib/site";
import snapshotJson from "@/data/directory/snapshots/2026-Q3.json";

/**
 * State of the Market 2026-Q3 (audit Phase 2, Table 8.3: "publish the next
 * quarterly State of the Market report with dataset bundle"). Unlike the
 * annual review, which renders live, this quarterly edition is pinned to the
 * frozen snapshot (data/directory/snapshots/2026-Q3.json) so the figures a
 * reader cites are the figures the bundle contains, forever.
 */

type RawFacility = {
  slug: string; name: string; status: string; city: string; country?: string;
  itLoadMw: number | null; totalCapacityMw: number | null; operator: { name: string };
};

const snap = snapshotJson as unknown as {
  snapshotOf: string; takenAt: string; recordCounts: { facilities: number; operators: number };
  operators: { id: string }[];
  facilities: RawFacility[];
};

export const metadata: Metadata = {
  title: "State of the Market 2026-Q3: Kenya Data Centres",
  description:
    "The quarterly State of the Market: Kenya's verified supply pipeline as at the 2026-Q3 snapshot, tracker digests (cables, power, licensing), the first East Africa regional records, and the free dataset bundle.",
  alternates: { canonical: "/research/state-of-the-market-2026-q3" },
  openGraph: {
    title: "State of the Market 2026-Q3: Kenya Data Centres",
    description:
      "The quarterly edition: frozen Q3 snapshot figures, tracker digests, East Africa first look and the free dataset bundle.",
    siteName: "Data Centre 254",
    type: "article",
    locale: "en_KE",
    images: [{ url: "/images/limuru-campus-aerial-solar.webp", width: 1200, height: 630, alt: "State of the Market 2026-Q3, Data Centre 254" }],
  },
};

export default function StateOfMarket2026Q3() {
  const facilities = snap.facilities;
  const ke = facilities.filter((f) => (f.country || "Kenya") === "Kenya");
  const regional = facilities.filter((f) => (f.country || "Kenya") !== "Kenya");
  const operational = ke.filter((f) => f.status === "Operational");
  const pipeline = ke.filter((f) => f.status !== "Operational");
  const liveItLoad = operational.reduce((s, f) => s + (f.itLoadMw || 0), 0);
  const builtMw = operational.reduce((s, f) => s + (f.totalCapacityMw || 0), 0);
  const pipelineMw = pipeline.reduce((s, f) => s + (f.totalCapacityMw || 0), 0);
  const liveCables = SUBSEA_CABLES.filter((c) => c.status === "In service").length;
  const regionalOps = operational.filter((f) => (f.country || "Kenya") !== "Kenya").length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Report",
    name: "DC254 State of the Market 2026-Q3",
    description: `Quarterly review of Kenya's data centre market as at the ${snap.snapshotOf} snapshot: ${snap.recordCounts.facilities} tracked facilities, ${liveItLoad.toFixed(1)} MW verified live IT load, ${pipelineMw.toFixed(0)} MW announced pipeline, plus subsea cable, power tariff and licensing digests and the first East Africa regional records.`,
    url: `${SITE_URL}/research/state-of-the-market-2026-q3`,
    isAccessibleForFree: true,
    author: { "@type": "Organization", name: "Data Centre 254", url: SITE_URL },
    datePublished: snap.takenAt,
    temporalCoverage: snap.snapshotOf,
  };

  const bundleFiles = [
    { name: "facilities-2026-Q3.csv", label: "Facility records (CSV)" },
    { name: "operators-2026-Q3.csv", label: "Operators (CSV)" },
    { name: "subsea-cables-2026-Q3.csv", label: "Subsea cables (CSV)" },
    { name: "power-tariffs-2026-Q3.csv", label: "Power tariff benchmarks (CSV)" },
    { name: "licensing-2026-Q3.csv", label: "Licensing regimes (CSV)" },
    { name: "manifest.json", label: "Manifest + citation (JSON)" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto section-y">
          <p className="text-section-label mb-4">Quarterly Report · {snap.snapshotOf} Edition</p>
          <h1 className="text-display-sm text-foreground mb-5">State of the Market 2026-Q3</h1>
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mb-4">
            The first quarterly edition. Unlike the annual review, which renders
            live, this report is pinned to the {snap.snapshotOf} snapshot taken on {snap.takenAt}:
            the figures you read are the figures the dataset bundle contains,
            which is what makes a quarterly report citable rather than perishable.
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            Snapshot: {snap.recordCounts.facilities} facilities · {snap.recordCounts.operators} operators · frozen {snap.takenAt} ·{" "}
            <Link href="/methodology" className="text-cyan underline hover:underline">methodology</Link> ·{" "}
            <Link href="/corrections" className="text-cyan underline hover:underline">corrections</Link>
          </p>

          {/* Headline stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-14">
            {[
              { label: "Kenya facilities tracked", value: String(ke.length), sub: `${operational.length} operational` },
              { label: "Verified live IT load", value: `${liveItLoad.toFixed(1)} MW`, sub: "published, in service" },
              { label: "Announced pipeline", value: `${pipelineMw.toFixed(0)} MW`, sub: "UC + committed + early stage" },
              { label: "Subsea cables live", value: String(liveCables), sub: "at Mombasa, RFS basis" },
            ].map((s) => (
              <div key={s.label} className="card-solid rounded-xl p-4">
                <p className="text-2xl font-bold text-foreground tabular-nums">{s.value}</p>
                <p className="text-[11px] font-medium text-foreground/80 mt-1">{s.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Kenya market state */}
          <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground mb-3">
            <Database className="size-5 text-cyan" /> Kenya: the quarter&apos;s supply picture
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-6">
            {operational.length} of {ke.length} tracked Kenyan facilities are operational, carrying{" "}
            {liveItLoad.toFixed(1)} MW of verified live IT load against {builtMw.toFixed(1)} MW of
            designed capacity, the gap between those two numbers is the
            utilisation story no press release tells. Behind them, {pipeline.length} facilities
            hold {pipelineMw.toFixed(0)} MW of announced capacity, led by the Nxtra Tatu City
            campus (44 MW across two phases, now pointing at July 2027). The
            staging discipline is unchanged: announced
            megawatts are never allowed to sit next to live ones.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-14">
            {[
              { icon: CheckCircle2, label: "Live", n: operational.length },
              { icon: HardHat, label: "Under construction", n: ke.filter((f) => f.status === "Under Construction").length },
              { icon: ShieldCheck, label: "Committed", n: ke.filter((f) => f.status === "Committed").length },
              { icon: ArrowRight, label: "Early stage", n: ke.filter((f) => f.status === "Early Stage").length },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="card-solid rounded-xl p-4 flex items-center gap-3">
                  <Icon className="size-4 text-cyan shrink-0" />
                  <div>
                    <p className="text-xl font-semibold tabular-nums text-foreground">{s.n}</p>
                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tracker digests */}
          <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground mb-3">
            <GitCompareArrows className="size-5 text-cyan" /> Tracker digests
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-6">
            Three new trackers joined the capacity pipeline this quarter, and
            each contributes a headline here. Full tables live on the tracker
            pages; the bundle carries the same rows as CSV.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
            <Link href="/tracker/cables" className="card-solid card-solid-hover rounded-xl p-5 group">
              <Cable className="size-5 text-cyan mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-cyan">Subsea cables</h3>
              <p className="text-2xl font-bold tabular-nums text-foreground">{liveCables} live</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Seven systems in service at Mombasa. Africa-1 is ashore but not
                counted until ready-for-service; Daraja (Meta/Safaricom) and the
                LuLu coastal route are tracked, never counted.
              </p>
            </Link>
            <Link href="/tracker/power" className="card-solid card-solid-hover rounded-xl p-5 group">
              <Zap className="size-5 text-cyan mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-cyan">Power tariffs</h3>
              <p className="text-2xl font-bold tabular-nums text-foreground">KES 15-20/kWh</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Effective all-in benchmark, TOU energy KES 13-16 blended plus
                demand charges of KES 300-500/kVA. 90%+ renewable grid remains
                the structural advantage.
              </p>
            </Link>
            <Link href="/tracker/licensing" className="card-solid card-solid-hover rounded-xl p-5 group">
              <Landmark className="size-5 text-cyan mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-cyan">Licensing</h3>
              <p className="text-2xl font-bold tabular-nums text-foreground">KES 100k vs 15M</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                The proposed standalone Data Centre licence cuts the initial fee
                by more than 99% against NFP-T2. Consultation ran 30 days from
                8 September; implementation FY2027/28.
              </p>
            </Link>
          </div>

          {/* East Africa first look */}
          <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground mb-3">
            <Globe2 className="size-5 text-cyan" /> East Africa: the first regional records
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-6">
            Coverage formally crosses the border this quarter with {regional.length} verified
            records: {regional.map((f) => `${f.name} (${f.country})`).join("; ")}. Two are
            operational ({regionalOps} of the regional set), two are pipeline, and every one
            carries the same source-and-confidence discipline as the Kenya census.
            Regional comparability is now a product direction, country filtering is live in the
            directory, and the map stays Kenya-scoped until the regional set justifies its own layer.
          </p>

          {/* Dataset bundle */}
          <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground mb-3">
            <Download className="size-5 text-cyan" /> The 2026-Q3 dataset bundle
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-6">
            The whole quarter, cuttable: facility and operator CSVs plus all
            three tracker tables, each row carrying its sources and verification
            date. CC BY 4.0, citation string in the manifest, no signup wall.
          </p>
          <div className="card-solid rounded-xl p-5 sm:p-6 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Complete bundle (zip, ~10 KB)</p>
                <p className="text-xs text-muted-foreground mt-1">
                  All files below plus README with the data dictionary and confidence grades.
                </p>
              </div>
              <a
                href="/datasets/dc254-dataset-bundle-2026-Q3.zip"
                download
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-cyan px-4 py-2.5 text-sm font-medium text-cyan-foreground hover:bg-cyan/90 transition-colors"
              >
                <Download className="size-4" /> Download bundle
              </a>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {bundleFiles.map((f) => (
                <li key={f.name}>
                  <a
                    href={`/datasets/2026-Q3/${f.name}`}
                    download
                    className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-cyan/40 hover:text-cyan"
                  >
                    <FileSpreadsheet className="size-3.5 shrink-0 text-cyan" />
                    {f.label}
                    <span className="ml-auto font-mono text-[10px] opacity-70">{f.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cross-links */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/40 pt-8 text-sm">
            <Link href="/directory" className="text-cyan underline hover:underline">Browse the live directory</Link>
            <Link href="/tracker" className="text-cyan underline hover:underline">Capacity pipeline tracker</Link>
            <Link href="/research/state-of-kenyan-data-centres-2026" className="text-cyan underline hover:underline">Annual review 2026</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
