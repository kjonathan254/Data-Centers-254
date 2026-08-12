"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Zap,
  MapPin,
  Users,
  Leaf,
  Globe,
  AlertTriangle,
  Shield,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

/* ─── Data ────────────────────────────────────────────────────────────────── */

const stats = [
  {
    icon: DollarSign,
    value: "$1.26B",
    label: "Africa DC Construction Market (2024)",
  },
  {
    icon: TrendingUp,
    value: "$3.06B",
    label: "Projected by 2030",
  },
  {
    icon: BarChart3,
    value: "15.9%",
    label: "CAGR Growth Rate",
  },
  {
    icon: Zap,
    value: "$10-20B",
    label: "Investment Needed (Africa)",
  },
];

interface AdvantageChallenge {
  label: string;
  icon: LucideIcon;
  color: "cyan" | "neon" | "amber";
}

interface LeadingMarket {
  title: string;
  tagline: string;
  description: string;
  advantages: AdvantageChallenge[];
  challenges: AdvantageChallenge[];
}

const leadingMarkets: LeadingMarket[] = [
  {
    title: "South Africa",
    tagline: "The Mature Market",
    description:
      "Over 60% of Africa's DC capacity. Home to Teraco, Africa Data Centres, DCPE. Johannesburg is the continental capital of DCs.",
    advantages: [
      { label: "Deep capital markets", icon: TrendingUp, color: "cyan" },
      { label: "Established ecosystem", icon: Shield, color: "cyan" },
    ],
    challenges: [
      {
        label: "Power grid instability (load shedding)",
        icon: AlertTriangle,
        color: "amber",
      },
    ],
  },
  {
    title: "Nigeria",
    tagline: "The Population Giant",
    description:
      "Africa's largest economy by GDP. Massive domestic demand. Azure and AWS have cloud regions in Lagos (or planned).",
    advantages: [
      { label: "200M+ population", icon: Users, color: "cyan" },
      { label: "Oil wealth", icon: DollarSign, color: "neon" },
    ],
    challenges: [
      {
        label: "Power infrastructure, regulatory complexity",
        icon: AlertTriangle,
        color: "amber",
      },
    ],
  },
  {
    title: "Kenya",
    tagline: "The Strategic Rising Star",
    description:
      "Leading East Africa, geothermal advantage, growing AI investment. The Microsoft-G42 investment is a watershed moment.",
    advantages: [
      { label: "Green energy", icon: Leaf, color: "neon" },
      { label: "Strategic location", icon: MapPin, color: "cyan" },
      { label: "Tech ecosystem", icon: Globe, color: "cyan" },
    ],
    challenges: [
      {
        label: "Smaller domestic market",
        icon: AlertTriangle,
        color: "amber",
      },
    ],
  },
];

const tagColorMap = {
  cyan: "border-cyan/20 text-cyan bg-cyan/5",
  neon: "border-neon/20 text-neon bg-neon/5",
  amber: "border-amber-500/20 text-amber-400 bg-amber-500/5",
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
  viewport: { once: true, margin: "-80px" } as const,
  transition: {
    duration: 0.5,
    delay: index * 0.08,
    ease: [0.22, 1, 0.36, 1],
  } as const,
});

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function AfricaSection() {
  return (
    <section id="africa" className="relative py-20 lg:py-28">
      {/* Subtle background layers */}
      <div
        className="absolute inset-0 grid-bg opacity-30"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_20%,oklch(0.78_0.14_195/5%),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_20%_80%,oklch(0.75_0.18_155/4%),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* ── Section Header ── */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-14 lg:mb-18"
          {...fadeUp}
        >
          <span className="inline-block font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-cyan mb-4">
            AFRICA
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            The Continental{" "}
            <span className="text-gradient-cyan">Picture</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Africa&apos;s data centre market is at an inflection point.
            Here&apos;s the lay of the land.
          </p>
        </motion.div>

        {/* ── Stat Cards ── */}
        <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-16 lg:mb-20">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} {...staggerFadeUp(i)}>
                <div className="glass-card glass-card-hover glow-cyan-sm rounded-xl p-4 sm:p-5 flex flex-col items-center text-center gap-2 transition-colors duration-300 h-full">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-cyan/10 text-cyan">
                    <Icon className="size-5" />
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-gradient-cyan tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground leading-snug">
                    {stat.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Map Image ── */}
        <motion.div
          className="mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <figure className="flex flex-col gap-3">
            <Image
              src="/images/africa-dc-map.png"
              alt="Africa's data centre infrastructure is concentrated in a few key hubs, but expanding rapidly."
              width={1280}
              height={720}
              className="rounded-xl border border-border aspect-video w-full object-cover"
            />
            <figcaption className="text-sm text-muted-foreground text-center">
              Africa&apos;s data centre infrastructure is concentrated in a few key hubs, but expanding rapidly.
            </figcaption>
          </figure>
        </motion.div>

        {/* ── Leading Markets ── */}
        <motion.h3
          className="text-xl sm:text-2xl font-semibold text-foreground mb-2 text-center"
          {...fadeUp}
        >
          Leading <span className="text-cyan">Markets</span>
        </motion.h3>
        <motion.p
          className="text-sm sm:text-base text-muted-foreground mb-8 text-center max-w-2xl mx-auto"
          {...fadeUp}
        >
          Three markets are shaping Africa&apos;s data centre landscape. Each has
          unique strengths and challenges.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-16 lg:mb-20">
          {leadingMarkets.map((market, i) => (
            <motion.div key={market.title} {...staggerFadeUp(i)}>
              <Card className="glass-card glass-card-hover rounded-xl overflow-hidden transition-colors duration-300 group h-full border-0">
                <CardContent className="p-5 sm:p-6 flex flex-col gap-4">
                  {/* Market Header */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-11 rounded-xl bg-cyan/10 text-cyan shrink-0 group-hover:bg-cyan/20 transition-colors duration-300">
                      <MapPin className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-foreground leading-snug">
                        {market.title}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {market.tagline}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {market.description}
                  </p>

                  {/* Advantages */}
                  <div className="flex flex-col gap-2 pt-3 border-t border-border/50">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Advantages
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {market.advantages.map((adv) => {
                        const AdvIcon = adv.icon;
                        return (
                          <Badge
                            key={adv.label}
                            variant="outline"
                            className={`rounded-full px-2.5 py-0.5 text-xs font-normal gap-1 ${tagColorMap[adv.color]}`}
                          >
                            <AdvIcon className="size-3" />
                            {adv.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  {/* Challenges */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Challenges
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {market.challenges.map((ch) => {
                        const ChIcon = ch.icon;
                        return (
                          <Badge
                            key={ch.label}
                            variant="outline"
                            className={`rounded-full px-2.5 py-0.5 text-xs font-normal gap-1 ${tagColorMap[ch.color]}`}
                          >
                            <ChIcon className="size-3" />
                            {ch.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* ── Closing Note ── */}
        <motion.div {...fadeUp}>
          <div className="glass-card glow-cyan-sm rounded-xl p-6 sm:p-8 border-l-2 border-l-cyan max-w-4xl mx-auto">
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              The next decade will see Africa&apos;s DC market transform from a
              niche to a mainstream asset class. For Kenya and East Africa, the
              opportunity is to capture a disproportionate share of this growth by
              leaning into natural advantages:{" "}
              <span className="text-neon font-medium">
                green energy
              </span>
              ,{" "}
              <span className="text-cyan font-medium">
                strategic location
              </span>
              , and{" "}
              <span className="text-neon font-medium">
                a young, tech-literate workforce
              </span>
              .
            </p>
            <Link
              href="/kenya"
              className="inline-flex items-center gap-2 text-sm font-medium text-cyan hover:text-cyan/80 transition-colors mt-4"
            >
              Explore Kenya’s full DC industry cluster
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
