"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Smartphone, Radio, Cable, Server, Cloud } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" } as const,
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } as const,
};

const flowSteps = [
  {
    icon: Smartphone,
    label: "Your Phone",
    reveal: "Every tap, swipe and search starts here — on a device you hold in your hand.",
  },
  {
    icon: Radio,
    label: "Mobile Network",
    reveal: "Cell towers across Kenya convert your signal into data in milliseconds.",
  },
  {
    icon: Cable,
    label: "Fibre Network",
    reveal: "Your request travels as light through cables buried beneath Kenyan roads.",
  },
  {
    icon: Server,
    label: "Data Centre",
    highlighted: true,
    reveal: "A building in Nairobi processes it all — in a room you will never enter.",
  },
  {
    icon: Cloud,
    label: "Cloud / Internet",
    reveal: "The response returns through the same chain — in reverse — in under a second.",
  },
];

export default function WhatIsDC() {
  return (
    <section className="section-y-lg">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Label */}
        <motion.span {...fadeUp} className="text-section-label">
          THE BASICS
        </motion.span>

        {/* Headlines */}
        <motion.h2 {...fadeUp} className="mt-8 text-display text-foreground">
          You use them every day.
        </motion.h2>
        <motion.h2
          {...fadeUp}
          className="mt-2 text-display text-gradient-cyan"
        >
          You just don&apos;t see them.
        </motion.h2>

        {/* Paragraph */}
        <motion.p {...fadeUp} className="mt-6 text-subtitle">
          Every digital service you use depends on a physical chain of
          infrastructure — cables, buildings, power lines — that most people
          never think about.
        </motion.p>

        {/* Vertical Data Flow with revelations */}
        <motion.div {...fadeUp} className="mt-16 flex flex-col items-center">
          {flowSteps.map((step, i) => {
            const Icon = step.icon;
            const isLast = i === flowSteps.length - 1;

            return (
              <div key={step.label} className="flex flex-col items-center">
                {/* Step card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={[
                    "glass-card flex items-center gap-4 rounded-xl px-6 py-4 w-full max-w-md transition-all duration-300",
                    step.highlighted
                      ? "border-cyan/40 ring-1 ring-cyan/20 glow-cyan-sm"
                      : "hover:border-cyan/20"
                  ].join(" ")}
                >
                  <div
                    className={[
                      "flex items-center justify-center size-10 rounded-full flex-shrink-0",
                      step.highlighted
                        ? "bg-cyan/20 text-cyan"
                        : "bg-cyan/10 text-cyan/80"
                    ].join(" ")}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={[
                          "text-sm font-semibold",
                          step.highlighted ? "text-cyan" : "text-foreground"
                        ].join(" ")}
                      >
                        {step.label}
                      </span>
                      {step.highlighted && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-cyan/15 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-cyan">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan" />
                          </span>
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {step.reveal}
                    </p>
                  </div>
                </motion.div>

                {/* Flow line connector */}
                {!isLast && (
                  <div className="flow-line flow-line-dot my-2" />
                )}
              </div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div {...fadeUp} className="mt-14">
          <Link
            href="/data-centres"
            className="inline-flex items-center gap-2 text-cyan text-sm font-medium hover:gap-3 transition-all duration-300"
          >
            Understand Data Centres
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
