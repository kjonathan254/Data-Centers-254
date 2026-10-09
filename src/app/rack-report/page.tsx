import type { Metadata } from "next";
import Link from "next/link";
import {
  Newspaper,
  BarChart3,
  Server,
  Network,
  Landmark,
  Eye,
  Link2,
  TrendingUp,
  FileText,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import RackReportSignup from "@/components/sections/rack-report-signup";
import { getLatestArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "The Rack Report: Kenya's Data Centre Briefing",
  description:
    "The Rack Report is DC254's monthly intelligence briefing: data centres, power, cloud, connectivity, investment, and policy. Free, the first Monday of every month.",
  alternates: { canonical: "/rack-report" },
  openGraph: {
    title: "The Rack Report: Kenya's Data Centre Briefing",
    description:
      "Data centres. Power. Cloud. Connectivity. Investment. Policy. The monthly intelligence briefing from DataCentre254.",
    type: "website",
    images: [
      {
        url: "/og/rack-report-cover.jpg",
        width: 1200,
        height: 630,
        alt: "The Rack Report — Data Centre 254 monthly intelligence briefing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Rack Report: Kenya's Data Centre Briefing",
    description:
      "Data centres. Power. Cloud. Connectivity. Investment. Policy. The monthly intelligence briefing from DataCentre254.",
    images: ["/og/rack-report-cover.jpg"],
  },
};

// The "from the reporting" block refreshes as new explainers publish.
export const revalidate = 600;

const anatomy = [
  {
    icon: Newspaper,
    name: "The Headline",
    body: "What changed this month, and what it actually means.",
  },
  {
    icon: BarChart3,
    name: "By the Numbers",
    body: "The verified figures, sourced and put in context.",
  },
  {
    icon: Server,
    name: "Infrastructure Intelligence",
    body: "What is live, what is under construction, what is only announced.",
  },
  {
    icon: Network,
    name: "Inside the Map",
    body: "Subsea cables, landing states and connectivity from Mombasa up.",
  },
  {
    icon: Landmark,
    name: "Policy Watch",
    body: "Regulatory developments, and the questions they raise without answering.",
  },
  {
    icon: Eye,
    name: "What We're Watching",
    body: "Three developments likely to matter next, before they land.",
  },
  {
    icon: Link2,
    name: "From DataCentre254",
    body: "The founder's note, and where to go deeper on the site.",
  },
];

export default function RackReportPage() {
  const latest = getLatestArticles(4);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
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
              The Rack Report is DC254&apos;s monthly intelligence briefing.
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
                  b: "One issue, the first Monday of every month, sequential numbering. Sent 06:00 EAT so Nairobi starts with it.",
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

        {/* Every issue - the full archive with PDFs (editor request, 9 Oct 2026) */}
        <section className="section-y border-b border-border/40">
          <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Every issue, with the PDFs
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Issues are numbered and never skipped, and every past issue stays
              online. Each PDF is the exact edition subscribers receive.
            </p>

            {/* Issue 002 - latest, featured */}
            <div className="rounded-xl border border-cyan/25 bg-cyan/5 p-5 sm:p-6 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1">
                  <p className="text-xs font-mono uppercase tracking-widest text-cyan mb-2">
                    Latest issue
                  </p>
                  <p className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                    <FileText className="size-4 text-cyan shrink-0" />
                    The Rack Report · Issue 002
                  </p>
                  <p className="text-sm text-foreground/90 mb-1.5">
                    What is actually live in Kenya&apos;s digital
                    infrastructure?
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    Monday 5 October 2026 · 6 pages · PDF, 0.2 MB
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    The verified board (27 tracked, 20 operational, 10.5 MW
                    live), the 230 MW pipeline question, seven live cable
                    systems at Mombasa, and the CA licence consultation closing
                    on or about 8 October.
                  </p>
                </div>
                <a
                  href="/reports/rack-report-issue-2.pdf"
                  download
                  className="inline-flex items-center justify-center gap-2 glow-cyan bg-cyan text-background rounded-lg px-6 h-11 text-sm font-semibold hover:bg-cyan/90 transition-all shrink-0 sm:self-center"
                >
                  Download the PDF
                </a>
              </div>
            </div>

            {/* Issue 001 - the archive */}
            <div className="rounded-xl border border-border/50 bg-card/60 p-5 sm:p-6 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1">
                  <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
                    Past issue
                  </p>
                  <p className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                    <FileText className="size-4 text-muted-foreground shrink-0" />
                    The Rack Report · Issue 001
                  </p>
                  <p className="text-sm text-foreground/90 mb-1.5">
                    The first issue of the briefing.
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    Monday 14 September 2026 · 8 pages · PDF, 0.3 MB
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    The CA licence consultation, $600M in AmCham pledges,
                    Amaco&apos;s $1.5B Mombasa plan, LuLu and the northern
                    route.
                  </p>
                </div>
                <a
                  href="/reports/rack-report-issue-1.pdf"
                  download
                  className="inline-flex items-center justify-center gap-2 border border-cyan/40 text-cyan rounded-lg px-6 h-11 text-sm font-semibold hover:bg-cyan/10 transition-all shrink-0 sm:self-center"
                >
                  Download the PDF
                </a>
              </div>
            </div>

            {/* Next issue - the cadence promise, visible */}
            <div className="rounded-xl border border-dashed border-border/60 p-5 sm:p-6 mb-8">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
                Next issue
              </p>
              <p className="text-sm font-semibold text-foreground mb-1">
                The Rack Report · Issue 003
              </p>
              <p className="text-xs text-muted-foreground">
                Monday 2 November 2026, 06:00 EAT · the first-Monday cadence
                promise, in writing.
              </p>
            </div>

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
