import type { Metadata } from "next";
import Link from "next/link";
import { Cable, Shield, ArrowRight, Anchor, Radio } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import TrackerNav from "@/components/tracker-nav";
import {
  SUBSEA_CABLES, CABLES_LAST_VERIFIED, type CableStatus,
} from "@/lib/market-trackers";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kenya Subsea Cable Tracker: Mombasa Landings & Pipeline",
  description:
    "Every submarine cable at Kenya's Mombasa landings: seven live systems, what is landed but not yet in service, and what is announced, with sources and dates.",
  alternates: { canonical: "/tracker/cables" },
  openGraph: {
    title: "Kenya Subsea Cable Tracker: Mombasa Landings & Pipeline",
    description:
      "Seven live systems, one landed and pending, two announced: Mombasa's cable slate, sourced and dated.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
    images: [{ url: "/images/mombasa-cable-landing-4.webp", width: 1200, height: 675, alt: "Kenya subsea cable tracker, Data Centre 254" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenya Subsea Cable Tracker",
    description: "Mombasa's cable slate: live, landed and announced, sourced and dated.",
    images: ["/images/mombasa-cable-landing-4.webp"],
  },
};

const STATUS_META: Record<CableStatus, { badge: string; blurb: string }> = {
  "In service": {
    badge: "border-neon/25 text-neon bg-neon/10",
    blurb: "Carrying traffic on the Kenya segment",
  },
  "Landed, RFS pending": {
    badge: "border-amber-500/25 text-amber-500 bg-amber-500/10",
    blurb: "Ashore, but no ready-for-service date announced",
  },
  Announced: {
    badge: "border-cyan/25 text-cyan bg-cyan/10",
    blurb: "Formally announced build, host or consortium named",
  },
  Planned: {
    badge: "border-border text-muted-foreground bg-accent/50",
    blurb: "Announced intent, pre-contract or pre-construction",
  },
};

const STATUS_ORDER: CableStatus[] = ["In service", "Landed, RFS pending", "Announced", "Planned"];

export default function CablesTrackerPage() {
  const live = SUBSEA_CABLES.filter((c) => c.status === "In service");
  const pending = SUBSEA_CABLES.filter((c) => c.status === "Landed, RFS pending");
  const pipeline = SUBSEA_CABLES.filter((c) => c.status === "Announced" || c.status === "Planned");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "DC254 Kenya Subsea Cable Tracker",
    description: `A source-cited tracker of submarine cable systems at Kenya's Mombasa landings: ${live.length} live systems, ${pending.length} landed awaiting ready-for-service and ${pipeline.length} announced or planned, with owners, landing points and reported design capacity.`,
    url: `${SITE_URL}/tracker/cables`,
    isAccessibleForFree: true,
    keywords: ["submarine cables", "Mombasa", "subsea", "Kenya", "EASSy", "TEAMS", "2Africa", "East Africa connectivity"],
    creator: { "@type": "Organization", name: "Data Centre 254", url: SITE_URL },
    temporalCoverage: CABLES_LAST_VERIFIED,
    variableMeasured: ["Cable status", "Ready-for-service date", "Kenyan landing points", "Owners", "Design capacity"],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 lg:py-16">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="container-site">
          {/* Header */}
          <div className="max-w-2xl">
            <span className="eyebrow">Kenya DC Tracker · Subsea cables</span>
            <h1 className="h-display mt-3 text-foreground">
              The cables under Mombasa, tracked.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Every international system at Kenya&apos;s coast: what is live,
              what is landed but not yet counted, and what is only announced.
              The same discipline as the capacity pipeline, a cable joins the
              live count when it carries traffic, not when it makes headlines.
            </p>
          </div>
          <TrackerNav current="/tracker/cables" />

          {/* Momentum strip */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {[
              { icon: Cable, label: "Live systems", value: String(live.length), hint: "in service at Mombasa" },
              { icon: Anchor, label: "Landed, RFS pending", value: String(pending.length), hint: "not counted as live" },
              { icon: Radio, label: "Announced / planned", value: String(pipeline.length), hint: "incl. first coastal route" },
              { icon: Shield, label: "Dataset verified", value: "Sep 2026", hint: "monthly sweep" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="card-solid rounded-xl p-4 sm:p-5">
                  <Icon className="size-4 text-cyan" />
                  <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{s.value}</p>
                  <p className="text-[11px] leading-snug text-muted-foreground">{s.label} · {s.hint}</p>
                </div>
              );
            })}
          </div>

          {/* Cable table */}
          <section aria-labelledby="cable-table" className="mt-16">
            <div className="max-w-2xl">
              <h2 id="cable-table" className="h-display-sm text-foreground">The full slate</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Sorted by status, then by ready-for-service date. Design
                capacity is the operator-reported figure and is usually far
                above lit capacity, which is not published and is deliberately
                not estimated here.
              </p>
            </div>
            <div className="mt-6 space-y-3">
              {STATUS_ORDER.map((status) => {
                const rows = SUBSEA_CABLES.filter((c) => c.status === status);
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
                        <li key={c.name} className="card-solid rounded-xl p-4 sm:p-5">
                          <p className="flex flex-wrap items-baseline justify-between gap-2">
                            <span className="text-sm font-semibold text-foreground">
                              {c.name}
                              {c.longName && <span className="ml-2 text-xs font-normal text-muted-foreground">{c.longName}</span>}
                            </span>
                            <span className="rounded-full border border-border/60 bg-accent/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              {c.rfsDate ?? "no RFS date"}
                            </span>
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {c.kenyanLandings.join(" · ")} &nbsp;·&nbsp; {c.owners}
                            {c.designCapacity && <> &nbsp;·&nbsp; {c.designCapacity}</>}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.note}</p>
                          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground/80">
                            <span className={`size-1.5 rounded-full ${c.dataConfidence === "High" ? "bg-neon" : c.dataConfidence === "Medium" ? "bg-amber-500" : "bg-red-400"}`} aria-hidden="true" />
                            {c.dataConfidence} confidence · verified {c.lastVerified}
                            {c.dc254Article && (
                              <Link href={`/articles/${c.dc254Article}`} className="inline-flex items-center gap-1 text-cyan underline hover:underline">
                                full explainer <ArrowRight className="size-3" />
                              </Link>
                            )}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Counting rule */}
          <section aria-labelledby="rule" className="mt-16">
            <div className="card-solid rounded-xl p-5 sm:p-6">
              <h2 id="rule" className="text-base font-semibold text-foreground">The counting rule</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The live count changes on ready-for-service, not on landing.
                Africa-1 is ashore but not counted until an RFS date is
                published; Daraja and LuLu are tracked so the pipeline is
                visible, never counted. Where a claim and the evidence part
                ways, the row says so. Sources per row; full methodology on the
                linked explainers.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
