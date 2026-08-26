"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Flame, Sun, AlertTriangle, Plug, Battery, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const energyAdvantages = [
  {
    icon: Flame,
    title: "Geothermal Leadership",
    description:
      "Kenya is Africa's largest geothermal energy producer, with over 800MW of installed capacity from the Olkaria geothermal field in the Rift Valley. Geothermal energy provides a stable, baseload power source that doesn't depend on weather or fuel imports. For data centres, this is significant -- many global tech companies are committed to 100% renewable energy, and Kenya's geothermal resource is a genuine competitive advantage.",
    badge: "Africa's #1 Geothermal Producer",
  },
  {
    icon: Sun,
    title: "The Renewable Mix",
    description:
      "Kenya's electricity grid is already approximately 90% renewable, drawing from geothermal, hydroelectric, wind (Lake Turkana Wind Farm at 310MW), and solar. This makes Kenyan data centres some of the greenest in the world by default -- a major selling point for sustainability-conscious hyperscalers.",
    badge: "~90% Renewable Grid",
  },
  {
    icon: AlertTriangle,
    title: "The Capacity Problem",
    description:
      "Despite the green credentials, Kenya's total installed generation capacity is approximately 3,500MW, with peak demand around 2,300MW. A large hyperscale data centre can consume 100MW or more -- a significant fraction of the entire national grid. The Microsoft-G42 project delay (May 2026) exposed this tension: the planned 100MW facility could not secure sufficient geothermal power allocation. Growing the grid is essential to growing data centres.",
    badge: "Critical Constraint",
  },
];

const powerSystems = [
  {
    icon: Plug,
    title: "Grid Connection",
    description:
      "The primary power source. Kenya's grid (KPLC) delivers electricity to the facility. A large data centre may have multiple independent grid feeds for redundancy.",
  },
  {
    icon: Battery,
    title: "Backup Generators",
    description:
      "Diesel generators provide backup power during grid outages. A Tier 3+ data centre must be able to run on generators indefinitely. Fuel storage for days or weeks of operation is required on-site.",
  },
  {
    icon: Zap,
    title: "UPS Systems",
    description:
      "Uninterruptible Power Supply systems bridge the gap between a grid failure and generator startup (typically 10-30 seconds). They also condition the power, removing surges, sags, and frequency variations that could damage sensitive server equipment.",
  },
];

export default function Power() {
  return (
    <section id="power" className="relative py-20 lg:py-28">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-cyan mb-4">
            POWER &amp; SUSTAINABILITY
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            The Grid Behind{" "}
            <span className="text-gradient-cyan">the Grid</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Data centres are among the largest industrial electricity consumers
            in any country. In Kenya, the power question is both the biggest
            opportunity and the biggest challenge.
          </p>
        </motion.div>

        {/* Banner Image */}
        <motion.div
          className="mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative rounded-xl overflow-hidden border border-border aspect-video bg-surface">
            <Image
              src="/images/dc-power-systems.webp"
              alt="Data centre power systems infrastructure"
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
          <p className="mt-3 text-sm text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
            Data centres require massive, uninterrupted power. Backup
            generators and UPS systems ensure reliability even when the grid
            fails.
          </p>
        </motion.div>

        {/* Part 1: Kenya's Energy Advantage */}
        <motion.div
          className="mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 text-center">
            Kenya&apos;s Energy{" "}
            <span className="text-gradient-cyan">Advantage</span>
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            A deep look at the renewable resources that make Kenya a compelling
            location for data centres -- and the constraints that limit growth.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {energyAdvantages.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Card className="glass-card glass-card-hover border-border/50 h-full transition-colors duration-300 group">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex items-start gap-3.5">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-cyan/10 text-cyan shrink-0 group-hover:bg-cyan/20 transition-colors duration-300">
                          <Icon className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-base font-semibold text-foreground">
                              {item.title}
                            </h4>
                          </div>
                          <Badge
                            variant="outline"
                            className="rounded-full px-2 py-0 text-[11px] font-medium border-cyan/20 text-cyan mb-3 inline-block"
                          >
                            {item.badge}
                          </Badge>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Part 2: The Environmental Cost */}
        <motion.div
          className="mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="glass-card rounded-2xl p-6 sm:p-8 lg:p-10 border border-cyan/20 relative overflow-hidden">
            <div
              className="absolute -top-20 -right-20 w-40 h-40 bg-cyan/5 rounded-full blur-3xl"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-16 -left-16 w-32 h-32 bg-cyan/5 rounded-full blur-3xl"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center size-10 rounded-lg bg-cyan/10 text-cyan glow-cyan-sm">
                  <AlertTriangle className="size-5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                  It&apos;s Not All Green
                </h3>
              </div>
              <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <p>
                  Even with renewable energy, data centres have a significant
                  environmental footprint. Cooling systems consume enormous
                  amounts of water (though many modern facilities use air
                  cooling). The construction of data centres requires vast
                  amounts of concrete, steel, and specialised equipment. The
                  embodied carbon in a single hyperscale facility can be tens of
                  thousands of tonnes.
                </p>
                <p>
                  Furthermore, Kenya&apos;s growing data centre demand could
                  accelerate the need for new power generation, some of which may
                  come from non-renewable sources if geothermal expansion cannot
                  keep pace. The World Bank estimates that Africa needs $10-20
                  billion in new data centre investment alone -- the supporting
                  power infrastructure would add billions more.
                </p>
                <p>
                  The question isn&apos;t whether data centres are good or bad
                  for the environment. The question is whether Kenya can grow its
                  digital infrastructure while maintaining its renewable energy
                  leadership. That requires intentional policy, investment, and
                  planning.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Part 3: Power Inside a Data Centre */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 text-center">
            Power Inside a{" "}
            <span className="text-cyan">Data Centre</span>
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            The layered power architecture that keeps servers running 24/7/365,
            from grid connection to UPS conditioning.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {powerSystems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Card className="glass-card glass-card-hover border-border/50 h-full transition-colors duration-300 group">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex items-start gap-3.5">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-cyan/10 text-cyan shrink-0 group-hover:bg-cyan/20 transition-colors duration-300">
                          <Icon className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-base font-semibold text-foreground mb-2">
                            {item.title}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/energy"
              className="inline-flex items-center gap-2 text-sm font-medium text-cyan hover:text-cyan/80 transition-colors"
            >
              Read the full energy & power guides
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
