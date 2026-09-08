"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, BookOpen, Download, FileText, Gauge, Layers,
  Network, ShieldCheck, Zap,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" } as const,
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } as const,
};

const reports = [
  {
    edition: "Brief / 01",
    title: "State of Kenyan Data Centres 2026",
    period: "Annual Review · September 2026",
    description:
      "The verified annual review of Kenya's data centre market: the honestly staged supply pipeline, the PeeringDB interconnection league table, certification records read precisely, and the four events that will decide 2027. The web edition re-computes from the live dataset on every visit; the PDF is the dated deep-dive edition.",
    stats: [
      { icon: Layers, value: "26", label: "facilities" },
      { icon: Gauge, value: "186 MW", label: "pipeline" },
      { icon: Network, value: "122", label: "top networks" },
      { icon: ShieldCheck, value: "8/20", label: "carrier-neutral" },
    ],
    summaryHref: "/research/state-of-kenyan-data-centres-2026",
    pdfHref: "/reports/dc254-state-of-kenyan-data-centres-2026.pdf",
    pdfMeta: "PDF · 4 pages · 2.7 MB",
    featured: true,
  },
  {
    edition: "Index · First edition",
    title: "Kenya Data Centre Index 2026",
    period: "August 2026 · 10 pages",
    description:
      "The first open, facility-level census of Kenya's data centre market — supply pipeline, quantum landscape, interconnection context, outlook and data provenance, every number sourced and dated. Superseded figures: the August dataset tracked 16 facilities; Brief / 01 carries the September verification at 26.",
    stats: [],
    summaryHref: null,
    pdfHref: "/reports/dc254-kenya-data-centre-index-2026.pdf",
    pdfMeta: "PDF · 10 pages · 0.3 MB",
    featured: false,
  },
];

export default function ResearchContent() {
  return (
    <section className="relative">
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_10%,oklch(0.78_0.14_195/3%),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        {/* Header */}
        <motion.div className="text-center mb-14 lg:mb-20" {...fadeUp}>
          <span className="text-section-label">REPORTS &amp; BRIEFS</span>
          <h1 className="text-display-sm mt-4 text-foreground">
            DC254 Reports
          </h1>
          <p className="text-subtitle-center mt-4">
            Every report ships two ways: a free summary on the web, and a
            downloadable deep-dive PDF. Open data — no signup wall.
          </p>
        </motion.div>

        {/* Report cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
          {reports.map((report, i) => (
            <motion.div
              key={report.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" } as const}
              transition={{
                duration: 0.7,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
            >
              <div
                className={`glass-card rounded-xl p-6 sm:p-7 h-full flex flex-col ${
                  report.featured
                    ? "border-cyan/25 shadow-[0_0_40px_oklch(0.78_0.14_195/6%)]"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide uppercase ${
                      report.featured
                        ? "border-cyan/30 text-cyan bg-cyan/5"
                        : "border-border/60 text-muted-foreground bg-accent/20"
                    }`}
                  >
                    {report.edition}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {report.period}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  {report.title}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground mt-2.5 mb-5">
                  {report.description}
                </p>

                {report.stats.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-6">
                    {report.stats.map((s) => (
                      <div
                        key={s.label}
                        className="rounded-lg border border-border/40 bg-accent/20 px-2 py-2.5 text-center"
                      >
                        <p className="text-sm font-bold text-foreground tabular-nums">
                          {s.value}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-auto flex flex-wrap gap-2.5">
                  {report.summaryHref && (
                    <Link
                      href={report.summaryHref}
                      className="inline-flex items-center gap-1.5 rounded-md bg-cyan px-4 py-2 text-sm font-medium text-cyan-foreground hover:bg-cyan/90 transition-colors"
                    >
                      <BookOpen className="size-4" /> Free summary
                    </Link>
                  )}
                  <a
                    href={report.pdfHref}
                    download
                    className={`inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                      report.summaryHref
                        ? "border-cyan/25 text-cyan hover:bg-cyan/10"
                        : "bg-cyan text-cyan-foreground hover:bg-cyan/90 border-transparent"
                    }`}
                  >
                    <Download className="size-4" /> Download PDF
                    <span className="text-[10px] opacity-70 font-normal">
                      {report.pdfMeta}
                    </span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Next in the series */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" } as const}
            transition={{
              duration: 0.7,
              delay: 0.16,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
          >
            <div className="glass-card rounded-xl p-6 sm:p-7 h-full flex flex-col border-dashed">
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="inline-flex items-center rounded-full border border-border/60 bg-accent/20 px-3 py-1 text-[11px] font-medium tracking-wide uppercase text-muted-foreground">
                  Brief / 02 · In production
                </span>
                <Zap className="size-4 text-muted-foreground" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                Powering Data Centres
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground mt-2.5 mb-5">
                Kenya&apos;s grid constraint, geothermal supply, PUE and the
                energy-to-capacity equation — the sequel the 2027 watchlist
                keeps pointing at. Same shape as Brief / 01: a cover image, a
                three-point summary, two infographics, dated sources.
              </p>
              <div className="mt-auto inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <FileText className="size-4" /> Coming after the 2027 watchlist
                events start landing
              </div>
            </div>
          </motion.div>
        </div>

        {/* Format promise strip */}
        <motion.div
          className="mt-12 rounded-xl border border-cyan/20 bg-cyan/5 p-5 sm:p-6"
          {...fadeUp}
        >
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 size-5 shrink-0 text-cyan" />
            <div>
              <h3 className="text-base font-semibold text-foreground">
                The DC254 brief format
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground mt-1.5">
                Every DC254 document takes the same simple structure from here
                on: a relevant cover image, a three-point summary you can read
                in thirty seconds, one or two infographics that carry the
                argument, and dated sources at the back. No fifty-page decks,
                no registration gates — the web edition is always free, the
                PDF is always downloadable.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Cross-links */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10"
          {...fadeUp}
        >
          <Link
            href="/directory"
            className="glass-card rounded-xl p-4 border-cyan/10 hover:border-cyan/30 transition-colors group"
          >
            <p className="text-sm font-semibold text-foreground group-hover:text-cyan transition-colors">
              Browse the DC Directory
              <ArrowRight className="inline size-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Every facility the reports count, with per-entry sources.
            </p>
          </Link>
          <Link
            href="/methodology"
            className="glass-card rounded-xl p-4 border-cyan/10 hover:border-cyan/30 transition-colors group"
          >
            <p className="text-sm font-semibold text-foreground group-hover:text-cyan transition-colors">
              How we count
              <ArrowRight className="inline size-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Counting rules, source tiers, confidence levels, update log.
            </p>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
