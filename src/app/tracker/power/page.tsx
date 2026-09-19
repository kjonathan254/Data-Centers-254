import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Shield, ArrowRight, Scale, FileSpreadsheet } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import TrackerNav from "@/components/tracker-nav";
import { POWER_TARIFFS, TARIFF_SOURCES, TARIFFS_LAST_VERIFIED } from "@/lib/market-trackers";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kenya Power Tariff Tracker: Data Centre Energy Benchmarks",
  description:
    "Kenya Power's tariff structure as data centres actually meet it: TOU energy charges, demand charges, pass-through costs, and the regional comparison, with sources and dates.",
  alternates: { canonical: "/tracker/power" },
  openGraph: {
    title: "Kenya Power Tariff Tracker: Data Centre Energy Benchmarks",
    description:
      "TOU energy charges, demand charges, pass-through costs and the regional comparison, benchmarked and dated.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
    images: [{ url: "/images/kenya-transmission-pylons-3.webp", width: 1200, height: 675, alt: "Kenya power tariff tracker, Data Centre 254" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenya Power Tariff Tracker",
    description: "Data centre energy benchmarks for Kenya: TOU, demand charges, pass-throughs, regional context.",
    images: ["/images/kenya-transmission-pylons-3.webp"],
  },
};

const BASIS_BADGE: Record<string, string> = {
  "Published tariff structure": "border-neon/25 text-neon bg-neon/10",
  "DC254 benchmark estimate": "border-cyan/25 text-cyan bg-cyan/10",
  "Reported range": "border-border text-muted-foreground bg-accent/50",
};

export default function PowerTrackerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "DC254 Kenya Power Tariff Tracker: Data Centre Energy Benchmarks",
    description: "Benchmark view of Kenya Power's tariff structure as data centres meet it: time-of-use energy charges, demand charges, pass-through levies, effective all-in cost and the African regional comparison, each labelled by how the figure is established.",
    url: `${SITE_URL}/tracker/power`,
    isAccessibleForFree: true,
    keywords: ["Kenya Power tariffs", "data centre electricity cost", "demand charges", "EPRA", "time of use", "East Africa power costs"],
    creator: { "@type": "Organization", name: "Data Centre 254", url: SITE_URL },
    temporalCoverage: TARIFFS_LAST_VERIFIED,
    variableMeasured: ["Energy charge (KES/kWh)", "Demand charge (KES/kVA/month)", "Pass-through uplift", "Effective all-in cost"],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 lg:py-16">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="container-site">
          {/* Header */}
          <div className="max-w-2xl">
            <span className="eyebrow">Kenya DC Tracker · Power tariffs</span>
            <h1 className="h-display mt-3 text-foreground">
              What a kilowatt-hour costs a data centre.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Power is the largest operating cost line, so the tariff
              structure deserves tracker treatment. Every figure below says
              how it is established: a published tariff, a DC254 benchmark
              estimate from that structure, or a reported range, because a
              benchmark that hides its basis is just a rumour with a table.
            </p>
          </div>
          <TrackerNav current="/tracker/power" />

          {/* Momentum strip */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {[
              { icon: Zap, label: "Blended energy", value: "KES 13-16/kWh", hint: "24/7 load, TOU-weighted" },
              { icon: Scale, label: "Demand charge", value: "KES 300-500/kVA", hint: "per month, on max demand" },
              { icon: FileSpreadsheet, label: "All-in effective", value: "KES 15-20/kWh", hint: "incl. levies & pass-throughs" },
              { icon: Shield, label: "Dataset verified", value: "Sep 2026", hint: "benchmarks re-checked" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="card-solid rounded-xl p-4 sm:p-5">
                  <Icon className="size-4 text-cyan" />
                  <p className="mt-2 text-xl font-semibold tabular-nums text-foreground">{s.value}</p>
                  <p className="text-[11px] leading-snug text-muted-foreground">{s.label} · {s.hint}</p>
                </div>
              );
            })}
          </div>

          {/* Benchmark table */}
          <section aria-labelledby="bench" className="mt-16">
            <div className="max-w-2xl">
              <h2 id="bench" className="h-display-sm text-foreground">The benchmark table</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Indicative ranges, not quotes. Large consumers above roughly
                1 MW typically negotiate bespoke agreements with Kenya Power
                against committed volume and multi-year terms, so a specific
                facility&apos;s all-in rate can land outside these bands.
              </p>
            </div>
            <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
              {POWER_TARIFFS.map((row) => (
                <li key={row.metric} className="card-solid rounded-xl p-4 sm:p-5">
                  <p className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground">{row.metric}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${BASIS_BADGE[row.basis] ?? BASIS_BADGE["Reported range"]}`}>
                      {row.basis.replace("DC254 ", "")}
                    </span>
                  </p>
                  <p className="mt-1.5 text-lg font-semibold tabular-nums text-cyan">{row.value}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{row.note}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Sources + reading */}
          <section aria-labelledby="psrc" className="mt-16">
            <div className="card-solid rounded-xl p-5 sm:p-6">
              <h2 id="psrc" className="text-base font-semibold text-foreground">Where the numbers come from</h2>
              <ul className="mt-3 space-y-2">
                {TARIFF_SOURCES.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan underline hover:underline">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                The full working, PUE effects and negotiation levers:{" "}
                <Link href="/articles/kenya-power-tariffs-data-centres" className="inline-flex items-center gap-1 text-cyan underline hover:underline">
                  Kenya power tariffs for data centres <ArrowRight className="size-3" />
                </Link>
                . Grid reliability and the generation mix:{" "}
                <Link href="/articles/kenya-power-reliability-data-centres" className="text-cyan underline hover:underline">
                  power reliability explainer
                </Link>
                . Verified {TARIFFS_LAST_VERIFIED}; EPRA reviews adjust tariffs periodically, so figures carry their check date.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
