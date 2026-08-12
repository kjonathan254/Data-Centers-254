"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" } as const,
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } as const,
};

const chain = [
  {
    location: "Olkaria, Rift Valley",
    fact: "Geothermal steam rises from deep underground, turning turbines that generate electricity. Kenya is Africa's largest geothermal producer.",
    source: "FACT — Kenya Electricity Generating Company (KenGen)",
  },
  {
    location: "Kenya Power Grid",
    fact: "That electricity travels hundreds of kilometres across Kenya's national grid to reach Nairobi, Mombasa and other towns.",
    source: "FACT — Energy and Petroleum Regulatory Authority (EPRA)",
  },
  {
    location: "Data Centre, Nairobi",
    fact: "Inside the building, the power feeds servers, cooling systems, and backup generators — 24 hours a day, every day.",
    source: "INDUSTRY STANDARD — Uptime Institute",
  },
];

export default function EnergySection() {
  return (
    <section id="energy-section" className="relative section-surface section-y-lg overflow-hidden">
      {/* Subtle grid texture */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Label */}
        <motion.p
          className="text-section-label text-center mb-4"
          {...fadeUp}
        >
          ENERGY
        </motion.p>

        {/* Headline */}
        <motion.h2
          className="text-display-sm text-center max-w-3xl mx-auto mb-2"
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
        >
          Every M-Pesa transaction starts
        </motion.h2>
        <motion.h2
          className="text-display-sm text-center text-gradient-cyan max-w-3xl mx-auto mb-8"
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.15 }}
        >
          with geothermal steam from the Rift Valley.
        </motion.h2>

        {/* Setup */}
        <motion.p
          className="text-subtitle text-center max-w-2xl mx-auto"
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.2 }}
        >
          Data centres run on electricity. In most countries, that means
          coal or gas. In Kenya, it means something different — and it
          might be the country's most underrated competitive advantage.
        </motion.p>

        {/* The energy chain — Rift Valley → Grid → Data Centre */}
        <div className="mt-16 flex flex-col gap-0">
          {chain.map((step, i) => (
            <div key={step.location} className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="glass-card rounded-xl p-6 sm:p-8 w-full max-w-lg"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-mono uppercase tracking-widest text-cyan">
                    {step.location}
                  </h3>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-cyan/40 flex-shrink-0">
                    {step.source}
                  </span>
                </div>
                <p className="mt-3 text-sm text-foreground leading-relaxed">
                  {step.fact}
                </p>
              </motion.div>

              {i < chain.length - 1 && (
                <div className="flow-line flow-line-dot my-2" />
              )}
            </div>
          ))}
        </div>

        {/* Key revelation — with sourcing */}
        <motion.div
          className="pull-quote text-center max-w-2xl mx-auto mt-16"
          style={{ borderLeft: "none", paddingLeft: 0, borderTop: "2px solid oklch(0.78 0.14 195 / 40%)", paddingTop: "1.5rem" }}
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.3 }}
        >
          Over 75% of Kenya's electricity comes from renewable sources —
          geothermal, hydro, wind and solar. For data centres, this isn't
          just sustainability. It's a reason to build here.
        </motion.div>
        <motion.p
          className="text-[10px] font-mono uppercase tracking-widest text-cyan/40 text-center mt-3"
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.35 }}
        >
          FACT — EPRA & Kenya National Bureau of Statistics, 2024
        </motion.p>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.4 }}
        >
          <Link
            href="/energy"
            className="inline-flex items-center gap-2 text-cyan font-medium hover:gap-3 transition-all duration-300 text-sm tracking-wide"
          >
            Explore Energy &amp; Infrastructure
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
