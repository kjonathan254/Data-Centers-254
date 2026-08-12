"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Server,
  Zap,
  Thermometer,
  Wifi,
  Shield,
  LayoutGrid,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const components = [
  {
    icon: Server,
    title: "Servers",
    subtitle: "The Brains",
    image: "/images/dc-servers-racks.png",
    imageAlt: "Rows of server racks in a data centre facility",
    description:
      "These are powerful computers that process and store data. A single rack can hold 40+ servers, and a large data centre has thousands of racks.",
  },
  {
    icon: Zap,
    title: "Power Systems",
    subtitle: "The Heartbeat",
    image: "/images/dc-power-systems.png",
    imageAlt: "Data centre power distribution units and backup generators",
    description:
      "Data centres need enormous, uninterrupted power. They connect to the national grid (KPLC) but also have diesel generators and UPS (Uninterruptible Power Supply) battery systems for backup.",
  },
  {
    icon: Thermometer,
    title: "Cooling Systems",
    subtitle: "The Air Conditioning on Steroids",
    image: "/images/dc-cooling.png",
    imageAlt: "Data centre cooling infrastructure and HVAC systems",
    description:
      "Servers generate massive heat. Without cooling, they'd overheat and fail in minutes. Kenya's climate is actually an advantage — Nairobi's mild temperatures mean less energy spent on cooling compared to hotter regions.",
  },
  {
    icon: Wifi,
    title: "Networking",
    subtitle: "The Highway System",
    image: "/images/dc-networking.png",
    imageAlt: "Fibre optic networking cables and switches in a data centre",
    description:
      "Fibre optic cables connect data centres to the internet and to each other. In Kenya, companies like Liquid Intelligent Technologies and the Kenya Internet Exchange Point (KIXP) handle this connectivity.",
  },
  {
    icon: Shield,
    title: "Security",
    subtitle: "The Fortress",
    image: "/images/dc-security.png",
    imageAlt: "Data centre physical security systems and biometric access controls",
    description:
      "Physical security (guards, biometric access, CCTV) and cybersecurity (firewalls, encryption) protect the data. Tier 3+ facilities have multiple security layers.",
  },
  {
    icon: LayoutGrid,
    title: "Racks & Cabling",
    subtitle: "The Skeleton",
    image: "/images/dc-networking.png",
    imageAlt: "Organised server rack cabling and structured wiring",
    description:
      "Servers are mounted in standardised metal frames called racks. The cabling alone in a large DC can stretch hundreds of kilometres — all colour-coded and meticulously organised.",
  },
];

const tiers = [
  {
    level: "Tier 1 — Basic",
    redundancy: "N+0 redundancy",
    description:
      "The simplest setup. Single path for power and cooling. No backup if something fails. Suitable only for non-critical applications. Very rare in commercial use today.",
  },
  {
    level: "Tier 2 — Redundant Components",
    redundancy: "N+1 redundancy",
    description:
      "Has some backup equipment (extra UPS, extra cooling units), but still a single path for power and cooling. Can handle minor equipment failures.",
  },
  {
    level: "Tier 3 — Concurrently Maintainable",
    redundancy: "N+2 redundancy",
    description:
      "This is the gold standard for modern commercial DCs, and what Kenya's leading facilities target. Everything has backups, and you can maintain or replace equipment WITHOUT shutting down the data centre. iXAfrica's NBOX1 in Nairobi is East Africa's first Tier 3 design.",
  },
  {
    level: "Tier 4 — Fault Tolerant",
    redundancy: "2N or N+N redundancy",
    description:
      "The ultimate. Everything is duplicated — independent power paths, independent cooling systems. Can survive any single failure without any impact. Extremely expensive. Only a few facilities in Africa approach this level.",
  },
];

export default function DC101() {
  return (
    <section id="dc101" className="relative py-20 lg:py-28">
      {/* Subtle background texture */}
      <div className="absolute inset-0 grid-bg opacity-50" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_20%,oklch(0.78_0.14_195/4%),transparent_70%)]" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Badge
            variant="outline"
            className="glass-card gap-2 rounded-full px-4 py-1.5 text-sm font-medium border-cyan/20 text-cyan mb-6"
          >
            <BookOpen className="size-3.5" />
            DATA CENTRES
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            The Centre of <span className="text-gradient-cyan">Gravity</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Data centres are the physical engine of Kenya's digital economy.
            They sit at the convergence of connectivity, power, and computing --
            the place where the digital world becomes physical.
          </p>
        </motion.div>

        {/* ── Part 1: Simple Explanation ── */}
        <motion.div
          className="mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="glass-card glass-card-hover rounded-2xl p-6 sm:p-8 lg:p-10 transition-colors duration-300">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex items-center justify-center size-12 rounded-xl bg-cyan/10 text-cyan shrink-0 mt-0.5">
                <BookOpen className="size-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">
                  The Simplest Explanation
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  Think of a data centre as a specialized building — a really powerful
                  one. Just like a library stores books, a data centre stores,
                  processes, and distributes data. But instead of bookshelves, it
                  houses thousands of computers (called servers) stacked in racks, all
                  connected to ultra-fast internet. Every time you stream a YouTube
                  video, send an M-Pesa transaction, or open a government portal like
                  e-Citizen, your request travels to a data centre somewhere.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Section Image Banner ── */}
        <motion.div
          className="mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="rounded-xl overflow-hidden border border-border">
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
              <Image
                src="/images/dc-servers-racks.png"
                alt="Interior of a modern data centre showing rows of server racks with blue LED lighting"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
                priority={false}
              />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground px-4 py-3">
              Inside a modern hyperscale data centre. Facilities like iXAfrica&apos;s NBOX1 in Nairobi house hundreds of racks like these.
            </p>
          </div>
        </motion.div>

        {/* ── Part 2: The 6 Core Components ── */}
        <motion.div
          className="mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-8 text-center">
            The <span className="text-cyan">6 Core Components</span> of a Data Centre
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {components.map((comp, i) => {
              const Icon = comp.icon;
              return (
                <motion.div
                  key={comp.title}
                  className="glass-card glass-card-hover rounded-xl p-5 sm:p-6 transition-colors duration-300 group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="w-full h-20 sm:h-[120px] rounded-lg overflow-hidden mb-4">
                    <Image
                      src={comp.image}
                      alt={comp.imageAlt}
                      width={120}
                      height={120}
                      sizes="(max-width: 768px) 80px, 120px"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-start gap-3.5">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-cyan/10 text-cyan shrink-0 group-hover:bg-cyan/20 transition-colors duration-300">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base font-semibold text-foreground">
                        {comp.title}
                      </h4>
                      <p className="text-xs text-neon font-medium mt-0.5 mb-2">
                        {comp.subtitle}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {comp.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Part 3: Tier System Explained ── */}
        <motion.div
          className="mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 text-center">
            Understanding Tier Levels
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            Not all data centres are equal. The Uptime Institute created a tier
            classification system to rate their reliability and redundancy.
          </p>
          <div className="glass-card rounded-2xl p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {tiers.map((tier, i) => (
                <motion.div
                  key={tier.level}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.45,
                    delay: i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <AccordionItem
                    value={tier.level}
                    className="border-border/50"
                  >
                    <AccordionTrigger className="text-foreground hover:text-cyan hover:no-underline py-4 sm:py-5">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <span className="font-semibold text-sm sm:text-base">
                          {tier.level}
                        </span>
                        <Badge
                          variant="outline"
                          className="w-fit rounded-full px-2.5 py-0 text-xs font-normal border-cyan/20 text-cyan/80"
                        >
                          {tier.redundancy}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm sm:text-base text-muted-foreground leading-relaxed pb-4">
                      {tier.description}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </motion.div>

        {/* ── Part 4: Why It Matters for Kenya ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="glass-card glow-cyan-sm rounded-2xl p-6 sm:p-8 lg:p-10 border-cyan/20 relative overflow-hidden">
            {/* Accent glow corner */}
            <div
              className="absolute -top-20 -right-20 w-40 h-40 bg-cyan/5 rounded-full blur-3xl"
              aria-hidden="true"
            />
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-neon/5 rounded-full blur-3xl" aria-hidden="true" />

            <div className="relative z-10 flex items-start gap-4">
              <div className="hidden sm:flex items-center justify-center size-12 rounded-xl bg-cyan/10 text-cyan shrink-0 mt-0.5">
                <TrendingUp className="size-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">
                  Why This Matters for <span className="text-cyan">Kenya</span>
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  The broader African data centre market is valued at $3.49
                  billion (2024), with Kenya&apos;s share growing at 15.76% CAGR.
                  With Microsoft and G42&apos;s $1 billion investment, Nairobi is
                  positioning itself as the cloud and AI hub for East Africa.
                  Understanding this infrastructure isn&apos;t just for tech people —
                  it&apos;s for everyone who uses a phone, sends money, or relies on
                  digital services in Kenya. In January 2026, iXAfrica
                  partnered with Oracle to deliver Kenya&apos;s first public cloud
                  region, while iXAfrica&apos;s NBOX1.2 expansion (18MW, 3,744
                  racks) is underway.
                </p>
                <Link
                  href="/beginners"
                  className="inline-flex items-center gap-2 text-sm font-medium text-cyan hover:text-cyan/80 transition-colors mt-4"
                >
                  Read the beginner guides
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
