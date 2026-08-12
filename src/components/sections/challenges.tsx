"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Zap, Wifi, GraduationCap, Scale, Building, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type StatusVariant = "neon" | "amber" | "destructive" | "cyan";

interface Challenge {
  icon: LucideIcon;
  title: string;
  description: string;
  status: string;
  statusVariant: StatusVariant;
}

const challenges: Challenge[] = [
  {
    icon: Zap,
    title: "Power Reliability & Cost",
    description:
      "While Kenya has one of Africa's highest electricity access rates, the cost of commercial power (KES 15-25/kWh for industrial users) is significantly higher than global averages. Data centres need power 24/7/365 — even a second of interruption is unacceptable. KPLC outages, while improving, still occur. Every DC must invest in expensive backup systems (diesel generators, UPS, battery banks), adding 30-50% to infrastructure costs. The Microsoft-G42 project delay (May 2026) exposed this vividly — the planned 100MW facility could not secure sufficient geothermal power allocation from Olkaria, despite Kenya's 800MW+ geothermal capacity. Most of that capacity is already committed to the national grid.",
    status: "Critical",
    statusVariant: "destructive",
  },
  {
    icon: Wifi,
    title: "Internet Connectivity Costs",
    description:
      "While Kenya has excellent international fibre connectivity (through undersea cables landing in Mombasa), the last-mile and cross-country fibre costs remain high compared to developed markets. A dedicated 10Gbps connection that costs $500/month in Europe can cost significantly more in Nairobi. However, the Kenya Internet Exchange Point (KIXP) helps by keeping local traffic local.",
    status: "Moderate",
    statusVariant: "amber",
  },
  {
    icon: GraduationCap,
    title: "Skills Gap",
    description:
      "There are very few data centre-specific training programmes in Kenya's universities and TVET institutions. Most DC professionals are trained abroad or learn on the job. As iXAfrica, Africa Data Centres, and Microsoft scale up operations, the demand for skilled technicians, engineers, and operators will outstrip supply. This is both a challenge and an opportunity for anyone reading this.",
    status: "Critical",
    statusVariant: "destructive",
  },
  {
    icon: Scale,
    title: "Regulatory Environment",
    description:
      "Kenya's Data Protection Act (2019) is progressive, but regulations around data centre operations, zoning, environmental impact, and cross-border data flows are still evolving. Clearer frameworks would attract more investment. The government's National Cloud Policy and AI Strategy (in development) are positive steps.",
    status: "In Progress",
    statusVariant: "cyan",
  },
  {
    icon: Building,
    title: "Land & Construction Costs",
    description:
      "Data centres need large plots of land with specific characteristics: stable ground, access to multiple power grids, fibre connectivity, and — ideally — proximity to major urban centres. Nairobi's rapidly appreciating land prices make suitable locations expensive. Construction costs in Kenya are also higher per square metre than in some competing markets.",
    status: "Moderate",
    statusVariant: "amber",
  },
];

const statusStyles: Record<StatusVariant, string> = {
  neon: "border-neon/40 text-neon bg-neon/10",
  amber: "border-amber-500/40 text-amber-400 bg-amber-500/10",
  destructive: "border-destructive/40 text-destructive bg-destructive/10",
  cyan: "border-cyan/40 text-cyan bg-cyan/10",
};

const statusDotStyles: Record<StatusVariant, string> = {
  neon: "bg-neon",
  amber: "bg-amber-400",
  destructive: "bg-destructive",
  cyan: "bg-cyan",
};

export default function Challenges() {
  return (
    <section id="challenges" className="relative py-20 lg:py-28">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-cyan mb-4">
            Challenges
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            The Real Hurdles{" "}
            <span className="text-gradient-cyan">(And Why They Matter)</span>
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            An honest look at the challenges facing data centre growth in Kenya.
            Understanding these is the first step to solving them.
          </p>
        </motion.div>

        {/* Section Image */}
        <motion.div
          className="mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <figure className="flex flex-col gap-3">
            <Image
              src="/images/dc-challenges.png"
              alt="Data centre challenges"
              width={1280}
              height={720}
              className="w-full rounded-xl border border-border aspect-video object-cover"
            />
            <figcaption className="text-sm text-muted-foreground text-center">
              The infrastructure gap between aspiration and reality remains a central challenge.
            </figcaption>
          </figure>
        </motion.div>

        {/* Challenge Cards */}
        <div className="space-y-6 lg:space-y-8">
          {challenges.map((challenge, index) => {
            const Icon = challenge.icon;
            const isReversed = index % 2 === 1;

            return (
              <motion.div
                key={challenge.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.05,
                }}
              >
                <Card className="glass-card glass-card-hover overflow-hidden border-0 transition-colors duration-300">
                  <CardContent className="p-0">
                    <div
                      className={`flex flex-col ${
                        isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                      }`}
                    >
                      {/* Icon / Visual Side */}
                      <div
                        className={`flex items-center justify-center p-6 sm:p-8 lg:p-10 lg:w-[280px] xl:w-[320px] shrink-0 bg-surface/50 ${
                          isReversed
                            ? "lg:border-l border-b lg:border-b-0 border-border"
                            : "lg:border-r border-b lg:border-b-0 border-border"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-4">
                          <div className="glow-cyan-sm flex items-center justify-center size-16 sm:size-20 rounded-2xl bg-cyan/10">
                            <Icon className="size-8 sm:size-10 text-cyan" />
                          </div>
                          <Badge
                            variant="outline"
                            className={`${statusStyles[challenge.statusVariant]} text-xs sm:text-sm px-3 py-1 rounded-full font-medium`}
                          >
                            <span
                              className={`mr-1.5 inline-block size-1.5 rounded-full ${statusDotStyles[challenge.statusVariant]}`}
                            />
                            {challenge.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Content Side */}
                      <div className="flex-1 p-6 sm:p-8 lg:p-10">
                        <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 leading-snug">
                          {challenge.title}
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          {challenge.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Insight Card */}
        <motion.div
          className="mt-12 lg:mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="glass-card glow-cyan-sm rounded-xl p-6 sm:p-8 border-l-2 border-l-cyan">
            <div className="flex gap-4">
              <div className="hidden sm:flex items-start justify-center shrink-0 pt-1">
                <div className="flex items-center justify-center size-10 rounded-lg bg-cyan/10">
                  <Zap className="size-5 text-cyan" />
                </div>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                  The Silver Lining
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  The good news? Every single one of these challenges is being
                  actively worked on. Kenya's geothermal energy potential, growing
                  fibre networks, young tech-savvy population, and strategic
                  government policies are creating a flywheel of improvement. The
                  question isn't whether Kenya will become a data centre powerhouse
                  — it's how fast.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
