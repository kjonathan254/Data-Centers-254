"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Droplets,
  Leaf,
  Mountain,
  Trash2,
  Thermometer,
  Recycle,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const waterImpact = [
  {
    icon: Droplets,
    title: "Why Data Centres Need Water",
    description:
      "Cooling is the primary water consumer in a data centre. Traditional air-cooled systems still use water in cooling towers, where water evaporates to remove heat. A large facility using evaporative cooling can consume millions of litres of water per month. In water-stressed regions, this creates direct competition between data centres and communities for a finite resource.",
  },
  {
    icon: Thermometer,
    title: "Water-Use Effectiveness (WUE)",
    description:
      "The industry metric for measuring water consumption is WUE -- litres of water per kilowatt-hour of IT energy. A typical air-cooled facility achieves 1.0-2.0 L/kWh. Facilities using direct evaporative cooling in hot climates can reach 2.0-3.0+ L/kWh. Nairobi's mild climate is a genuine advantage: facilities can use free air cooling for much of the year, significantly reducing both energy and water consumption.",
  },
  {
    icon: Leaf,
    title: "Kenya's Water Context",
    description:
      "While Nairobi is not classified as water-scarce, Kenya faces significant water stress in arid and semi-arid regions (ASALs), which cover over 80% of the country's land area. As data centres scale, water consumption will become a more visible issue. Operators who invest in dry cooling or air-cooled systems will have a competitive and reputational advantage.",
  },
];

const environmentalDimensions = [
  {
    icon: Mountain,
    title: "Land & Embodied Carbon",
    description:
      "A hyperscale data centre campus can require 10-50 acres of land. The construction itself -- concrete, steel, copper, aluminium -- carries enormous embodied carbon. A single large facility can represent tens of thousands of tonnes of CO2 in materials alone, before a single server is powered on. In Kenya, where construction standards and environmental impact assessments are still evolving for this asset class, embodied carbon is rarely discussed but critically important.",
  },
  {
    icon: Trash2,
    title: "Electronic Waste",
    description:
      "Servers have a useful life of 3-5 years. A facility with 1,000 servers will replace 200-333 servers annually, generating significant electronic waste. Kenya has e-waste regulations, but enforcement and recycling infrastructure remain limited. As data centres grow, the e-waste stream will grow with them. Responsible operators establish partnerships with certified e-waste recyclers and publish disposal metrics.",
  },
  {
    icon: Recycle,
    title: "Waste Heat Recovery",
    description:
      "Data centres produce enormous amounts of waste heat. In colder climates, this heat is captured and used for district heating. In Nairobi, where temperatures rarely drop below 15 degrees Celsius, the opportunity is different but real: waste heat could potentially be used for industrial processes, water heating, or agricultural applications (greenhouses). No Kenyan data centre is known to be implementing waste heat recovery at scale -- a significant untapped opportunity.",
  },
  {
    icon: AlertTriangle,
    title: "The Diesel Problem",
    description:
      "Every Kenyan data centre has diesel backup generators. During extended grid outages, these generators can run for hours or days, burning thousands of litres of diesel and producing local air pollution (particulate matter, nitrogen oxides). While generators are a necessity for reliability, their environmental cost is real. Battery energy storage systems (BESS) could reduce generator runtime, and Kenya's growing solar capacity could eventually allow data centres to operate backup systems without fossil fuels.",
  },
];

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

export default function Environment() {
  return (
    <section id="environment" className="relative py-20 lg:py-28">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_20%,oklch(0.78_0.14_195/4%),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
          {...fadeUp}
        >
          <span className="inline-block font-mono text-xs sm:text-sm tracking-widest text-cyan mb-4 uppercase">
            ENVIRONMENT &amp; SUSTAINABILITY
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            The Environmental{" "}
            <span className="text-gradient-cyan">Cost You Don't See</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Kenya markets itself as a green data centre destination because of
            renewable energy. That story is incomplete. Water, land, e-waste,
            embodied carbon, and diesel backup all carry environmental costs
            that deserve honest examination.
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
              src="/images/dc-environment-sustainability.png"
              alt="Aerial view of sustainable data centre facility in Kenya with renewable energy infrastructure"
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
          <p className="mt-3 text-sm text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
            Sustainable data centre design is about more than renewable electricity.
            Water consumption, embodied carbon in construction, and e-waste
            management are equally important dimensions of environmental responsibility.
          </p>
        </motion.div>

        {/* Part 1: Water - The Hidden Dimension */}
        <motion.div className="mb-16 lg:mb-20" {...fadeUp}>
          <div className="glass-card rounded-2xl p-6 sm:p-8 lg:p-10 border-l-4 border-l-cyan relative overflow-hidden">
            <div
              className="absolute -top-20 -right-20 w-40 h-40 bg-cyan/5 rounded-full blur-3xl"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <Badge
                variant="outline"
                className="mb-4 rounded-full px-3 py-1 text-xs font-medium border-neon/25 text-neon bg-neon/5"
              >
                What Nobody Tells You
              </Badge>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">
                Data Centres Don't Just Use Electricity -- They Use Water
              </h3>
              <div className="space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <p>
                  When people think about data centres and the environment, they
                  think about electricity. But water is the hidden dimension.
                  Cooling systems -- particularly evaporative cooling towers --
                  consume enormous volumes of water. A single large data centre
                  using evaporative cooling can consume 1-5 million litres of
                  water per month. In a country where over 80% of land area is
                  arid or semi-arid, this is not a trivial consideration.
                </p>
                <p>
                  Water is particularly underexplored in African data-centre
                  discussions. Academic research has already produced datasets
                  examining water efficiency across 41 African countries. Nairobi's
                  mild climate (average daily high of 25 degrees Celsius) means
                  facilities can rely more on free air cooling and less on
                  water-intensive evaporative systems -- a genuine, measurable
                  competitive advantage over hotter African markets.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Part 2: Water Deep Dive */}
        <motion.div className="mb-16 lg:mb-20" {...fadeUp}>
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 text-center">
            Water &amp;{" "}
            <span className="text-cyan">Cooling</span>
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            The water question is emerging as one of the most important
            environmental issues in global data centre development. Kenya has
            advantages -- but also blind spots.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {waterImpact.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} {...staggerFadeUp(i)}>
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
        </motion.div>

        {/* Part 3: The Full Environmental Picture */}
        <motion.div {...fadeUp}>
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 text-center">
            Beyond Electricity: The{" "}
            <span className="text-gradient-cyan">Full Picture</span>
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            Energy is one dimension. Land, waste, and embodied carbon are
            others. Here is what a complete environmental assessment must
            consider.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {environmentalDimensions.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} {...staggerFadeUp(i)}>
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
        </motion.div>
      </div>
    </section>
  );
}
