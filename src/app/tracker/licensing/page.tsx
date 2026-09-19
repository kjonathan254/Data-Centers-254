import type { Metadata } from "next";
import Link from "next/link";
import { Landmark, Shield, ArrowRight, CalendarClock, Scale } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import TrackerNav from "@/components/tracker-nav";
import { LICENSING_REGIMES, LICENSING_SOURCES, LICENSING_LAST_VERIFIED } from "@/lib/market-trackers";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kenya Data Centre Licensing Tracker: CA Regimes & Fees",
  description:
    "The licensing position for Kenya's colocation market: the current NFP-T2 regime, the proposed standalone Data Centre licence and its fees, and the ODPC's parallel track, dated and sourced.",
  alternates: { canonical: "/tracker/licensing" },
  openGraph: {
    title: "Kenya Data Centre Licensing Tracker",
    description:
      "NFP-T2 today, the proposed standalone licence, fee comparisons and the ODPC's parallel obligations, dated and sourced.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
    images: [{ url: "/images/national-assembly-chamber-session.webp", width: 1200, height: 675, alt: "Kenya data centre licensing tracker, Data Centre 254" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenya Data Centre Licensing Tracker",
    description: "CA regimes, fees and timelines for Kenya's colocation market, dated and sourced.",
    images: ["/images/national-assembly-chamber-session.webp"],
  },
};

const STATUS_BADGE: Record<string, string> = {
  Current: "border-neon/25 text-neon bg-neon/10",
  Proposed: "border-amber-500/25 text-amber-500 bg-amber-500/10",
};

export default function LicensingTrackerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "DC254 Kenya Data Centre Licensing Tracker",
    description: "The regulatory position for Kenya's colocation market: the current NFP-T2 licensing regime, the proposed standalone Data Centre licence (consultation opened 8 September 2026) with fee comparison, and the parallel Data Protection Act obligations.",
    url: `${SITE_URL}/tracker/licensing`,
    isAccessibleForFree: true,
    keywords: ["Kenya data centre licence", "Communications Authority", "NFP-T2", "standalone data centre licence", "ODPC", "regulation"],
    creator: { "@type": "Organization", name: "Data Centre 254", url: SITE_URL },
    temporalCoverage: LICENSING_LAST_VERIFIED,
    variableMeasured: ["Licensing regime status", "Application and licence fees", "Validity period", "Consultation timeline"],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 lg:py-16">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="container-site">
          {/* Header */}
          <div className="max-w-2xl">
            <span className="eyebrow">Kenya DC Tracker · Licensing</span>
            <h1 className="h-display mt-3 text-foreground">
              The rules the racks live under.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Kenya is rewriting how data centres are licensed, and the gap
              between consultation and implementation is exactly where
              investment decisions get made or lost. This tracker keeps the
              current regime, the proposal and the parallel data-protection
              track in one dated view.
            </p>
          </div>
          <TrackerNav current="/tracker/licensing" />

          {/* Momentum strip */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {[
              { icon: Landmark, label: "Regime of record", value: "NFP-T2", hint: "since 6 March 2026" },
              { icon: Scale, label: "Proposed initial fee", value: "KES 100,000", hint: "vs KES 15M under NFP-T2" },
              { icon: CalendarClock, label: "Consultation window", value: "30 days", hint: "opened 8 Sep 2026" },
              { icon: Shield, label: "Dataset verified", value: "Sep 2026", hint: "against CA + press record" },
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

          {/* Regime cards */}
          <section aria-labelledby="regimes" className="mt-16">
            <div className="max-w-2xl">
              <h2 id="regimes" className="h-display-sm text-foreground">Regime by regime</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Fees and validity are stated exactly as proposed or gazetted.
                The proposal is not law yet: NFP-T2 remains the licence of
                record through at least FY2026/27, with implementation
                scheduled FY2027/28.
              </p>
            </div>
            <div className="mt-6 space-y-3">
              {LICENSING_REGIMES.map((r) => (
                <div key={r.regime} className="card-solid rounded-xl p-4 sm:p-6">
                  <p className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground">{r.regime}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${STATUS_BADGE[r.status] ?? STATUS_BADGE.Proposed}`}>
                      {r.status}
                    </span>
                  </p>
                  <p className="mt-1.5 text-sm text-cyan">{r.keyFees}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Validity: {r.validity}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.note}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section aria-labelledby="timeline" className="mt-16">
            <div className="max-w-2xl">
              <h2 id="timeline" className="h-display-sm text-foreground">The road from proposal to licence</h2>
            </div>
            <ol className="mt-6 space-y-3">
              {[
                { when: "6 March 2026", what: "Commercial data centres brought under telecom licensing: Gazette Notice No. 3335 and the Revised Telecommunications Market Structure place colocation in NFP-T2." },
                { when: "8 September 2026", what: "CA opens a 30-day public consultation on a standalone Data Centre licence, recognising colocation provides 'colocation, power, cooling, storage and computing' rather than telecom services to end users." },
                { when: "~8 October 2026", what: "Comment deadline through the CA's open consultations portal. Operators, tenants and investors all have standing." },
                { when: "FY2026/27", what: "Consultation and finalisation of the framework; drafting and final rule-making follow." },
                { when: "FY2027/28", what: "Consequential changes to the market structure documents and implementation, with facilities migrating to the new category. Transition mechanics (migration, renewal, fee harmonisation) settle in this window." },
              ].map((t) => (
                <li key={t.when} className="card-solid flex flex-col gap-1 rounded-xl p-4 sm:flex-row sm:items-baseline sm:gap-4 sm:p-5">
                  <span className="w-40 shrink-0 text-xs font-mono uppercase tracking-widest text-cyan">{t.when}</span>
                  <span className="text-sm leading-relaxed text-muted-foreground">{t.what}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Sources */}
          <section aria-labelledby="lsrc" className="mt-16">
            <div className="card-solid rounded-xl p-5 sm:p-6">
              <h2 id="lsrc" className="text-base font-semibold text-foreground">Primary record</h2>
              <ul className="mt-3 space-y-2">
                {LICENSING_SOURCES.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan underline hover:underline">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                The full analysis, including the ODPC intersection and what it means for operators and investors:{" "}
                <Link href="/articles/kenya-ca-standalone-data-centre-licence" className="inline-flex items-center gap-1 text-cyan underline hover:underline">
                  CA consultation explainer <ArrowRight className="size-3" />
                </Link>
                . Verified {LICENSING_LAST_VERIFIED} against multiple independent outlets.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
