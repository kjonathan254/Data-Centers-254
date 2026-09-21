import type { Metadata } from "next";
import Link from "next/link";
import {
  Newspaper,
  BarChart3,
  Server,
  Zap,
  Network,
  Banknote,
  Landmark,
  Eye,
  Link2,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import RackReportSignup from "@/components/sections/rack-report-signup";
import { getLatestArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "The Rack Report: Kenya's Data Centre Monthly",
  description:
    "The Rack Report is DC254's monthly intelligence briefing: data centres, power, cloud, connectivity, investment, and policy. Free, first Monday of the month.",
  alternates: { canonical: "/rack-report" },
  openGraph: {
    title: "The Rack Report: Kenya's Data Centre Monthly",
    description:
      "Data centres. Power. Cloud. Connectivity. Investment. Policy. The monthly intelligence briefing from DataCentre254.",
    type: "website",
    images: [
      {
        url: "/images/rack-report-cover.png",
        width: 1200,
        height: 630,
        alt: "The Rack Report — Data Centre 254 monthly intelligence briefing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Rack Report: Kenya's Data Centre Monthly",
    description:
      "Data centres. Power. Cloud. Connectivity. Investment. Policy. The monthly intelligence briefing from DataCentre254.",
    images: ["/images/rack-report-cover.png"],
  },
};

// The "from the reporting" block refreshes as new explainers publish.
export const revalidate = 600;

const anatomy = [
  {
    icon: Newspaper,
    name: "The Headline",
    body: "The biggest development of the month, and what it actually means.",
  },
  {
    icon: BarChart3,
    name: "By the Numbers",
    body: "One important industry statistic, sourced and put in context.",
  },
  {
    icon: Server,
    name: "Infrastructure",
    body: "What's happening with data centres, builds, capacity, operators.",
  },
  {
    icon: Zap,
    name: "Power",
    body: "Energy developments affecting the industry: tariffs, generation, grid.",
  },
  {
    icon: Network,
    name: "Connectivity",
    body: "Subsea cables, fibre, IXPs and network expansion.",
  },
  {
    icon: Banknote,
    name: "Money",
    body: "Investment, funding, acquisitions and expansion deals.",
  },
  {
    icon: Landmark,
    name: "Policy",
    body: "Government and regulatory developments that move the market.",
  },
  {
    icon: Eye,
    name: "What We're Watching",
    body: "Two to three developments likely to matter next, before they land.",
  },
  {
    icon: Link2,
    name: "From DataCentre254",
    body: "Links to our strongest analysis of the month, for going deeper.",
  },
];

export default function RackReportPage() {
  const latest = getLatestArticles(4);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero + signup */}
        <section className="section-y border-b border-border/40">
          <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
            <p className="text-section-label mb-4">
              The Rack Report · by DataCentre254
            </p>
            <h1 className="text-display-sm text-foreground mb-5">
              The monthly briefing on Kenya and East Africa&apos;s digital
              infrastructure.
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto mb-4">
              The Rack Report is DC254&apos;s monthly infrastructure briefing.
              Every issue distils the most important developments across the
              market: new and expanding data centres, operator activity,
              capacity changes, power and connectivity, subsea cables, AI
              projects, policy and major investment announcements.
            </p>
            <p className="text-sm font-medium text-foreground/90 mb-8 max-w-2xl mx-auto">
              The goal is not to repeat every press release. It is to help you
              understand what actually changed, what is verified, what remains
              uncertain and what deserves attention next.
            </p>
            <RackReportSignup />
            <p className="mt-5 text-xs text-muted-foreground">
              Prefer to look first?{" "}
              <a
                href="/reports/rack-report-issue-1.pdf"
                target="_blank"
                rel="noopener"
                className="text-cyan underline underline-offset-2 hover:text-cyan"
              >
                Read a sample issue
              </a>{" "}
              (Issue 001, PDF).
            </p>
          </div>
        </section>

        {/* Issue anatomy */}
        <section className="section-y border-b border-border/40">
          <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              What lands in every briefing
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              A consistent structure, so you can scan the whole industry in one
              read, and jump straight to the section you care about.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {anatomy.map((a) => (
                <div
                  key={a.name}
                  className="rounded-xl border border-border/50 bg-card/60 p-5"
                >
                  <a.icon className="size-5 text-cyan mb-3" />
                  <h3 className="text-sm font-semibold text-foreground mb-1.5">
                    {a.name}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {a.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Publication cadence, the promise, printed (docs/NEWSLETTER-CADENCE.md) */}
        <section className="section-y border-b border-border/40">
          <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Publication cadence
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              A cadence is a promise, so here it is in writing. If the first
              Monday ever slips, the issue ships the next day with a dated
              editor&apos;s note; issues are numbered and never skipped silently.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  t: "Monthly, first Monday",
                  b: "One issue, every month, sequential numbering. Sent 06:00 EAT so Nairobi starts with it.",
                },
                {
                  t: "One sponsor, labelled",
                  b: "A single clearly-marked sponsor message per issue, never blended into the reporting.",
                },
                {
                  t: "Sources in the send",
                  b: "Same verification chain as the site: dated claims, named sources, confidence stated.",
                },
              ].map((c) => (
                <div key={c.t} className="rounded-xl border border-border/50 bg-card/60 p-5">
                  <p className="text-sm font-semibold text-foreground mb-1">{c.t}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{c.b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Issue #002 download */}
        <section className="section-y border-b border-border/40">
          <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Read Issue #002
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Issue 002 ships on Monday 5 October 2026: the US DFC&apos;s
              largest-ever equity bet, up to $155M into WIOCC and what it means
              for Kenya&apos;s bandwidth, NBO2&apos;s 6.4MW of delivered
              capacity, why generation is not reliability, and the CA licence
              consultation closing on 8 October.
            </p>
            <div className="rounded-xl border border-cyan/25 bg-cyan/5 p-5 sm:p-6 mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-1">
                  The Rack Report · Issue 002
                </p>
                <p className="text-xs text-muted-foreground">
                  Monday 5 October 2026 · 8 pages · PDF, about 430 KB
                </p>
              </div>
              <a
                href="/reports/rack-report-issue-2.pdf"
                download
                className="inline-flex items-center justify-center gap-2 glow-cyan bg-cyan text-background rounded-lg px-6 h-11 text-sm font-semibold hover:bg-cyan/90 transition-all shrink-0"
              >
                Download the PDF
              </a>
            </div>
            <p className="text-xs text-muted-foreground mb-8">
              Past issues:{" "}
              <a
                href="/reports/rack-report-issue-1.pdf"
                className="text-cyan hover:underline"
              >
                Issue 001 · 14 September 2026
              </a>{" "}
              · the CA licence consultation, $600M in AmCham pledges, Amaco&apos;s
              $1.5B Mombasa plan, LuLu and the northern route.
            </p>
            <h3 className="text-sm font-semibold text-foreground mb-2">
              From the reporting
            </h3>
            <p className="text-sm text-muted-foreground mb-8">
              The reporting the briefing draws on, researched, sourced,
              published openly.
            </p>
            <div className="grid gap-4">
              {latest.map((a) => (
                <Link
                  key={a.frontmatter.slug}
                  href={`/articles/${a.frontmatter.slug}`}
                  className="group rounded-xl border border-border/50 p-5 hover:border-cyan/30 transition-colors"
                >
                  <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
                    {a.frontmatter.cluster}
                  </p>
                  <h3 className="text-base font-semibold text-foreground group-hover:text-cyan transition-colors mb-1.5">
                    {a.frontmatter.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {a.frontmatter.meta_description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* For advertisers */}
        <section className="section-y">
          <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="rounded-xl border border-cyan/25 bg-cyan/5 p-6 sm:p-8">
              <div className="flex items-start gap-3 mb-4">
                <TrendingUp className="size-5 text-cyan flex-shrink-0 mt-0.5" />
                <h2 className="text-lg font-semibold text-foreground">
                  For advertisers
                </h2>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-5">
                Reach Kenya&apos;s digital infrastructure decision-makers. The
                Rack Report is a specialist channel, one sponsor per issue,
                clearly labelled, with a tracked click report every month.
                Current audience numbers and pricing are always live, never
                inflated.
              </p>
              <Link
                href="/advertise"
                className="inline-flex items-center justify-center gap-2 glow-cyan bg-cyan text-background rounded-lg px-6 h-11 text-sm font-semibold hover:bg-cyan/90 transition-all"
              >
                See the numbers &amp; pricing
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
