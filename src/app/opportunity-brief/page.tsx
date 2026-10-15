import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Crosshair,
  FileSearch,
  FileDown,
  ShieldCheck,
  Signal,
  Eye,
  CalendarCheck,
  ArrowRight,
  Building2,
} from "lucide-react";
import { getPlatformStats, STAT_LABELS } from "@/lib/site-stats";
import { getOpportunityBrief } from "@/lib/opportunity-brief";
import OpportunityBriefInterestForm from "./OpportunityBriefInterestForm";

export const metadata: Metadata = {
  title: "Kenya Data Centre Opportunity Brief | DC254",
  description:
    "A short, sourced intelligence brief answering one question in Kenya's data-centre market: where is usable capacity most likely to emerge next. Built for vendors, investors, operators and consultants deciding where to focus next.",
  alternates: { canonical: "/opportunity-brief" },
};

const SAMPLE_HREF = "/api/opportunity-brief/sample";

const trustStrip = [
  { icon: FileSearch, label: "Claim-level sources" },
  { icon: CalendarCheck, label: "Evidence dates shown" },
  { icon: ShieldCheck, label: "Confidence levels included" },
  { icon: Building2, label: "Kenya-focused" },
  { icon: Eye, label: "No paywall on the public directory" },
];

const receiveCards = [
  {
    icon: Crosshair,
    title: "The answer",
    body: "One decision question, answered directly. Not a data dump: a conclusion you can act on, with the three numbers that matter.",
  },
  {
    icon: FileSearch,
    title: "The evidence",
    body: "Sources, publication dates and confidence levels sit beside every claim, so you can judge how hard you can lean on it.",
  },
  {
    icon: Signal,
    title: "The opportunity lens",
    body: "What the evidence means for your type of organisation, vendors, investors, operators or consultants, stated as analysis, never as guaranteed demand.",
  },
  {
    icon: Eye,
    title: "The watchlist",
    body: "The named triggers that tell you when to move: milestones, energisation, ready-for-service, licensing outcomes.",
  },
];

const productComparison = [
  {
    product: "Free directory",
    bestFor: "Exploring facilities and operators",
    output: "Public records, filters, CSV and API",
    highlight: false,
    href: "/directory",
  },
  {
    product: "Opportunity Brief",
    bestFor: "Deciding where to focus next",
    output: "4-6 page focused intelligence brief",
    highlight: true,
    href: "/opportunity-brief",
  },
  {
    product: "Market Snapshot",
    bestFor: "Benchmarking the full market",
    output: "12-15 page quarterly report and appendix",
    highlight: false,
    href: "/data-exports",
  },
  {
    product: "The Rack Report",
    bestFor: "Staying current monthly",
    output: "Monthly intelligence briefing",
    highlight: false,
    href: "/rack-report",
  },
  {
    product: "Custom research",
    bestFor: "A defined organisation-specific question",
    output: "Scoped project and bespoke deliverable",
    highlight: false,
    href: "/advertise",
  },
];

const pricing = [
  { tier: "Single brief", price: "US$75-150", note: "one edition, one decision question" },
  { tier: "Three-brief bundle", price: "US$250-375", note: "for teams tracking several questions" },
  { tier: "Custom buyer lens", price: "from US$300", note: "your segment, scoped separately" },
  { tier: "Institutional licence", price: "Quoted", note: "team use and redistribution rights" },
];

export default function OpportunityBriefPage() {
  const brief = getOpportunityBrief();
  const stats = getPlatformStats();

  const statBand = [
    {
      value: String(stats.kenyaFacilities),
      label: STAT_LABELS.kenya,
    },
    {
      value: `${stats.designedLiveMw.toFixed(1)} MW`,
      label: STAT_LABELS.designedLive,
    },
    {
      value: `${stats.publishedItLoadMw.toFixed(1)} MW`,
      label: STAT_LABELS.publishedItLoad,
    },
    {
      value: String(stats.cables.inService),
      label: STAT_LABELS.cablesInService,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto section-y">
          {/* Hero */}
          <p className="text-section-label mb-4">DC254 Intelligence Product</p>
          <h1 className="text-display-sm text-foreground mb-5 max-w-2xl">
            Know where the opportunity is before the announcement becomes noise.
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mb-8">
            A short, sourced brief on one question in Kenya&apos;s data-centre
            and digital-infrastructure market:{" "}
            <em className="text-foreground not-italic font-medium">
              {brief.decisionQuestion}
            </em>{" "}
            Built for people deciding where to focus next, not for people
            browsing headlines.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <a
              href={SAMPLE_HREF}
              className="inline-flex items-center justify-center gap-2 glow-cyan bg-cyan text-background rounded-lg px-6 h-11 text-sm font-semibold hover:bg-cyan/90 transition-all"
            >
              <FileDown className="size-4" aria-hidden="true" />
              View the redacted sample
            </a>
            <a
              href="#request"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 h-11 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-cyan/40 transition-all"
            >
              Request the next brief
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>

          {/* Trust strip */}
          <ul className="flex flex-wrap gap-x-5 gap-y-2 mb-12" aria-label="What every brief includes">
            {trustStrip.map((t) => (
              <li
                key={t.label}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <t.icon className="size-3.5 text-cyan" aria-hidden="true" />
                {t.label}
              </li>
            ))}
          </ul>

          {/* Canonical figures, straight from the directory dataset */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            {statBand.map((s) => (
              <div key={s.label} className="rounded-xl border border-border/50 bg-accent/30 p-5">
                <p className="text-2xl font-bold text-foreground mb-1">{s.value}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mb-14">
            Generated from the same versioned dataset behind the{" "}
            <a href="/directory" className="text-cyan hover:underline">public directory</a>{" "}
            and <a href="/tracker" className="text-cyan hover:underline">tracker</a>{" "}
            (verified through {stats.lastVerified}). The brief never quotes
            numbers the public site does not.
          </p>

          {/* Pilot edition card */}
          <div className="card-solid p-6 sm:p-8 mb-14">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan">
                {brief.edition}
              </span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">
                {brief.format}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Kenya capacity and delivery signals
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground mb-6">
              <strong className="text-foreground">{brief.headline}</strong>{" "}
              {brief.oneLineAnswer}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-sm">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">Verified through</p>
                <p className="text-foreground">October 2026</p>
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">Audience</p>
                <p className="text-foreground">Vendors, investors, operators, consultants</p>
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">Signals this edition</p>
                <p className="text-foreground">{brief.signals.length} source-linked entries</p>
              </div>
            </div>
            <a
              href={SAMPLE_HREF}
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:underline"
            >
              <FileDown className="size-4" aria-hidden="true" />
              Preview the sample
            </a>
          </div>

          {/* What a buyer receives */}
          <h2 className="text-xl font-semibold text-foreground mb-2">What a buyer receives</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Every edition follows the same structure, so the product is
            repeatable and comparable across quarters.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
            {receiveCards.map((c) => (
              <div key={c.title} className="rounded-xl border border-border/50 bg-card/60 p-6">
                <c.icon className="size-5 text-cyan mb-3" aria-hidden="true" />
                <h3 className="text-base font-semibold text-foreground mb-2">{c.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>

          {/* Signals in this edition */}
          <h2 className="text-xl font-semibold text-foreground mb-2">
            What the pilot edition covers
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Each signal is a named project with its status, the documented
            milestone, source links, a confidence grade and the next question a
            supplier should ask. These are the five entries in the pilot:
          </p>
          <ol className="space-y-3 mb-4">
            {brief.signals.map((sig) => (
              <li
                key={sig.id}
                className="rounded-xl border border-border/50 p-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
              >
                <span className="text-xs font-mono text-cyan shrink-0">{sig.id}</span>
                <span className="text-sm text-foreground flex-1">{sig.signal}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {sig.status} · confidence {sig.confidence.toLowerCase()} · checked {sig.lastChecked}
                </span>
              </li>
            ))}
          </ol>
          <p className="text-xs text-muted-foreground mb-14">
            The full entries, with sources, supplier relevance and next
            questions, are in the{" "}
            <a href={SAMPLE_HREF} className="text-cyan hover:underline">redacted sample PDF</a>.
          </p>

          {/* How it differs */}
          <h2 className="text-xl font-semibold text-foreground mb-2">
            How it differs from the other DC254 products
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            The Market Snapshot tells you what the market looks like. The
            Opportunity Brief tells you where to focus next.
          </p>
          <div className="rounded-xl border border-border/50 overflow-x-auto mb-14">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="border-b border-border/50 text-left">
                  <th className="px-4 py-3 font-semibold text-foreground">Product</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Best for</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Output</th>
                </tr>
              </thead>
              <tbody>
                {productComparison.map((row) => (
                  <tr
                    key={row.product}
                    className={`border-b border-border/30 last:border-0 ${
                      row.highlight ? "bg-cyan/5" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      <a href={row.href} className="hover:text-cyan transition-colors">
                        {row.product}
                      </a>
                      {row.highlight && (
                        <span className="ml-2 text-xs font-mono text-cyan align-middle">you are here</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{row.bestFor}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.output}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing pilot */}
          <h2 className="text-xl font-semibold text-foreground mb-2">Pricing pilot</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Launch pricing is deliberately a range being validated through the
            first buyer conversations. You confirm scope, edition date and
            price before any payment; there is no self-serve checkout in the
            pilot. The $50 quarterly{" "}
            <a href="/data-exports" className="text-cyan hover:underline">Market Snapshot</a>{" "}
            remains the broader benchmark product.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
            {pricing.map((p) => (
              <div key={p.tier} className="rounded-xl border border-border/50 bg-card/60 p-6">
                <p className="text-lg font-bold text-foreground">{p.price}</p>
                <p className="text-sm text-foreground mt-1">{p.tier}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.note}</p>
              </div>
            ))}
          </div>

          {/* Evidence and methodology */}
          <div className="rounded-xl border border-border/50 bg-card/60 p-6 sm:p-8 mb-14">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="size-5 text-cyan" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-foreground">Evidence before assumptions</h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground mb-4">
              {brief.methodologyNote}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground mb-4">
              {brief.limitations}
            </p>
            <a href="/methodology" className="text-sm font-medium text-cyan hover:underline">
              Read the full methodology
            </a>
          </div>

          {/* Redaction honesty strip */}
          <div className="rounded-xl border border-border/40 bg-accent/20 p-6 mb-14">
            <h2 className="text-base font-semibold text-foreground mb-3">
              What the sample redacts
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              The sample shows the real structure and real public evidence.
              Redaction removes commercial analysis, never the sources, and no
              black box is used to hide information that was never verified.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {brief.redactedFields.map((f) => (
                <li key={f} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-cyan mt-0.5" aria-hidden="true">-</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Request form */}
          <div id="request" className="scroll-mt-24">
            <h2 className="text-xl font-semibold text-foreground mb-2">Request the next brief</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Tell us the decision you are trying to make. We will confirm
              whether the next brief answers it, propose a custom scope, or
              simply answer honestly that the evidence is not there yet.
            </p>
            <OpportunityBriefInterestForm />
          </div>

          <p className="text-xs text-muted-foreground mt-12 leading-relaxed">
            DC254 provides research and market intelligence based on available
            evidence. It does not guarantee contracts, procurement access,
            project completion or sales outcomes.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
