"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Newspaper,
  Handshake,
  TrendingUp,
  BarChart3,
  Building2,
  Server,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

/* ─── Data ────────────────────────────────────────────────────────────────── */

type Category = "Milestone" | "Setback" | "Expansion" | "Market" | "Infrastructure" | "Policy";

interface NewsItem {
  date: string;
  category: Category;
  icon: typeof Newspaper;
  title: string;
  description: string;
  keyDetail: string;
}

const newsItems: NewsItem[] = [
  {
    date: "August 2026",
    category: "Policy",
    icon: FileText,
    title: "Kenya Formally Licences Data Centres Under NFP-T1 and NFP-T2",
    description:
      "The Communications Authority's Revised Telecommunications Market Structure (Gazette Notice No. 3335) brings commercial data centres under telecoms licensing for the first time. NFP-T2 is the primary route for pure-play operators at KES 15M for 15 years, while NFP-T1 serves large integrated players with an optional 25-year term at KES 45M.",
    keyDetail: "First explicit data centre licensing framework in Kenya's history",
  },
  {
    date: "January 2026",
    category: "Milestone",
    icon: Building2,
    title: "iXAfrica Hosts Oracle Cloud Region -- Kenya's First",
    description:
      "iXAfrica Data Centres and Oracle announced that Oracle Cloud Infrastructure (OCI) is now available at iXAfrica's Nairobi campus, making it Kenya's first public cloud region. This positions iXAfrica as a regional hub for cloud and AI workloads across East and Central Africa.",
    keyDetail: "Kenya's first public cloud region is now live",
  },
  {
    date: "May 2026",
    category: "Setback",
    icon: TrendingUp,
    title: "Microsoft-G42 $1B Kenya Project Faces Delays",
    description:
      "The flagship Microsoft-G42 data centre project, announced in May 2024, has stalled due to insufficient power capacity from the Olkaria geothermal field and disagreements with the Kenyan government over payment terms and power allocation. The facility was designed for 100MW initial phase, entirely geothermal-powered.",
    keyDetail: "Power capacity constraints stall $1 billion project",
  },
  {
    date: "March 2025",
    category: "Expansion",
    icon: Handshake,
    title: "iXAfrica NBOX1 Operational, NBOX1.2 Under Construction",
    description:
      "iXAfrica's NBOX1 launched with 4.5MW IT load and 780 racks. The adjacent NBOX1.2, designed for 18MW and 3,744 racks, is under construction. A second campus on 11 acres in Tilisi is planned at 53MW, which would make it one of Africa's largest.",
    keyDetail: "22.5MW current campus, 53MW second campus planned",
  },
  {
    date: "March 2025",
    category: "Infrastructure",
    icon: Server,
    title: "Safaricom Completes Limuru Data Centre Phase 1",
    description:
      "Safaricom completed the first phase of its data centre in Limuru, Kenya, with plans for 2.8MW of IT capacity in the second phase. The telco also partnered with iXAfrica to deliver East Africa's first AI-ready enterprise infrastructure.",
    keyDetail: "Phase 2 targeting 2.8MW IT capacity",
  },
  {
    date: "July 2026",
    category: "Market",
    icon: BarChart3,
    title: "Africa DC Market Valued at $3.49B, Growing at 15.76% CAGR",
    description:
      "Africa's data centre market is projected to grow from $3.49 billion (2024) at a CAGR of 15.76% through 2031, driven by AI workloads, sovereign data demands, and local cloud adoption. Analysts estimate $10-20 billion in new capital investment is needed across the continent.",
    keyDetail: "$10-20 billion investment needed across Africa",
  },
  {
    date: "May 2026",
    category: "Policy",
    icon: FileText,
    title: "World Bank Backs Data Infrastructure for AI Readiness",
    description:
      "The World Bank Group launched new initiatives to help countries build data centres, cloud services, and AI-ready policies. In Kenya, this aligns with the National AI Strategy and Cloud Policy under development.",
    keyDetail: "Global institution signals strategic importance of African DCs",
  },
];

/* ─── Category badge styling ──────────────────────────────────────────────── */

const categoryBadgeStyle: Record<Category, string> = {
  Milestone:
    "border-neon/30 text-neon bg-neon/10 hover:bg-neon/15",
  Setback:
    "border-destructive/30 text-destructive bg-destructive/10 hover:bg-destructive/15",
  Expansion:
    "border-cyan/30 text-cyan bg-cyan/10 hover:bg-cyan/15",
  Market:
    "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
  Infrastructure:
    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90",
  Policy:
    "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
};

const categoryBadgeVariant: Record<Category, "outline" | "default" | "secondary"> = {
  Milestone: "outline",
  Setback: "outline",
  Expansion: "outline",
  Market: "default",
  Infrastructure: "secondary",
  Policy: "default",
};

/* ─── Animation Helpers ────────────────────────────────────────────────────── */

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" } as const,
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as const,
};

const staggerFadeUp = (index: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" } as const,
  transition: {
    duration: 0.5,
    delay: index * 0.08,
    ease: [0.22, 1, 0.36, 1],
  } as const,
});

/* ─── Component ────────────────────────────────────────────────────────────── */

export default function News() {
  return (
    <section id="news" className="relative py-20 lg:py-28">
      {/* Subtle background layers */}
      <div
        className="absolute inset-0 grid-bg opacity-40"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_20%,oklch(0.78_0.14_195/5%),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_80%,oklch(0.75_0.18_155/3%),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
          {...fadeUp}
        >
          <span className="inline-block font-mono text-xs sm:text-sm tracking-widest text-cyan mb-4">
            NEWS &amp; DEVELOPMENTS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            What&apos;s Happening in{" "}
            <span className="text-gradient-cyan">Kenya&apos;s DC Space</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Stay updated on the latest projects, investments, and policy changes
            shaping Kenya and Africa&apos;s digital infrastructure landscape.
          </p>
        </motion.div>

        {/* ── Section Image ── */}
        <motion.div
          className="mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <figure className="flex flex-col gap-3">
            <Image
              src="/images/nairobi-skyline.webp"
              alt="Nairobi skyline"
              width={1280}
              height={720}
              className="w-full rounded-xl border border-border aspect-video object-cover"
            />
            <figcaption className="text-sm text-muted-foreground text-center">
              Nairobi is emerging as East Africa&apos;s data centre capital.
            </figcaption>
          </figure>
        </motion.div>

        {/* ── News Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {newsItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.title} {...staggerFadeUp(i)}>
                <article className="glass-card glass-card-hover rounded-xl p-5 sm:p-6 flex flex-col gap-4 transition-all duration-300 group h-full">
                  {/* Top row: Date badge + Category badge */}
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant="outline"
                      className="rounded-full px-2.5 py-0.5 text-xs font-mono border-border/50 text-muted-foreground"
                    >
                      {item.date}
                    </Badge>
                    <Badge
                      variant={categoryBadgeVariant[item.category]}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryBadgeStyle[item.category]}`}
                    >
                      {item.category}
                    </Badge>
                  </div>

                  {/* Icon + Title */}
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center size-9 rounded-lg bg-cyan/10 text-cyan shrink-0 group-hover:bg-cyan/20 transition-colors duration-300 mt-0.5">
                      <Icon className="size-4" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>

                  {/* Key detail */}
                  <div className="mt-auto pt-3 border-t border-border/50">
                    <div className="flex items-center gap-2 glow-cyan-sm rounded-lg bg-cyan/5 px-3 py-2">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan" />
                      </span>
                      <span className="text-xs font-medium text-cyan leading-snug">
                        {item.keyDetail}
                      </span>
                    </div>
                  </div>
                </article>
              </motion.div>
            );
          })}
        </div>

        {/* ── Bottom Note ── */}
        <motion.div
          className="mt-12 lg:mt-16 text-center"
          {...fadeUp}
        >
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            This is a snapshot of major developments. Our full news feed launches
            in Phase 2 — subscribe to be notified.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
