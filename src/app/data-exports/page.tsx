import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  FileText, Database, TrendingUp, Zap, Globe2, ShieldCheck,
  CheckCircle2, Clock,
} from "lucide-react";
import ExportInterestForm from "./ExportInterestClient";

export const metadata: Metadata = {
  title: "Kenya Data Centre Market Snapshot — Premium Data Export",
  description:
    "A quarterly PDF snapshot of Kenya's data centre market: tracked facilities, capacity, power tariffs, connectivity and deal flow. $50, updated every quarter.",
  alternates: { canonical: "/data-exports" },
};

const contents = [
  {
    icon: Building2Icon,
    title: "Facility register",
    body: "Every tracked facility in the directory — operator, location, tier, capacity where disclosed, and status of announced expansions.",
  },
  {
    icon: Zap,
    title: "Power economics",
    body: "Tariff movements and what they do to colocation pricing, plus how geothermal-heavy supply shapes the Kenya cost story.",
  },
  {
    icon: Globe2,
    title: "Connectivity position",
    body: "Submarine cable landings, IXP health and why capacity concentrates in Nairobi and Mombasa — mapped.",
  },
  {
    icon: TrendingUp,
    title: "Deal flow & forecast",
    body: "The quarter's investments, acquisitions and policy shifts, with the trajectory we expect next quarter.",
  },
];

function Building2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4M10 10h4M10 14h4M10 18h4" />
    </svg>
  );
}

const includes = [
  "12–15 page PDF, designed for reading and forwarding",
  "Facility register as a sortable CSV appendix",
  "Every claim sourced — public filings, regulator data, operator announcements",
  "Next edition lands the quarter after this one; buyers get launch notification first",
];

export default function DataExportsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto section-y">
          <p className="text-section-label mb-4">Premium data export</p>
          <h1 className="text-display-sm text-foreground mb-5">
            Kenya Data Centre Market Snapshot
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mb-10">
            The same research behind DC254&apos;s article library, condensed
            into one quarterly document built for people who make decisions:
            investors scoping the market, vendors sizing it, operators
            benchmarking against it. <strong className="text-foreground">$50</strong> per
            quarterly edition.
          </p>

          {/* What's inside */}
          <div className="grid gap-4 sm:grid-cols-2 mb-12">
            {contents.map((c) => (
              <div
                key={c.title}
                className="rounded-xl border border-border/50 bg-card/60 p-6"
              >
                <c.icon className="size-5 text-cyan mb-3" aria-hidden="true" />
                <h2 className="text-base font-semibold text-foreground mb-2">
                  {c.title}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {c.body}
                </p>
              </div>
            ))}
          </div>

          {/* Includes */}
          <div className="card-solid p-6 sm:p-8 mb-12">
            <div className="flex items-center gap-2 mb-5">
              <FileText className="size-5 text-cyan" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-foreground">
                What you get
              </h2>
            </div>
            <ul className="space-y-3">
              {includes.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="size-4 text-cyan mt-0.5 shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" aria-hidden="true" />
                Q4 2026 edition — in production now
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                Personal licence — no redistribution
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Database className="size-3.5" aria-hidden="true" />
                Built from the same tracker behind the site
              </span>
            </div>
          </div>

          {/* Capture — checkout arrives with Stripe */}
          <ExportInterestForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
