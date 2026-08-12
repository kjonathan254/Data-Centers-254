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

const steps = [
  {
    number: 1,
    label: "Your Phone",
    reveal: "You tap 'Send' on M-Pesa.",
  },
  {
    number: 2,
    label: "Mobile Network",
    reveal: "Your phone sends a signal to the nearest cell tower.",
  },
  {
    number: 3,
    label: "Fibre Infrastructure",
    reveal: "The request converts to light pulses travelling through buried cable.",
  },
  {
    number: 4,
    label: "Core Network",
    reveal: "Safaricom's switches route your KSh 1,000 to the right processor.",
  },
  {
    number: 5,
    label: "Data Centre",
    reveal: "A server in a Nairobi building validates and records the transaction.",
    highlighted: true,
  },
  {
    number: 6,
    label: "Financial Infrastructure",
    reveal: "Kenya's payment systems settle the transfer between accounts.",
  },
  {
    number: 7,
    label: "Transaction Complete",
    reveal: "Your recipient gets a notification. Total time: under 2 seconds.",
  },
];

export default function FollowData() {
  return (
    <section id="follow-data" className="relative section-deep section-y overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 dot-bg opacity-30 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Label */}
        <motion.p
          className="text-section-label text-center mb-4"
          {...fadeUp}
        >
          THE JOURNEY
        </motion.p>

        {/* Headline */}
        <motion.h2
          className="text-display-sm text-center max-w-3xl mx-auto mb-6"
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
        >
          What happens when you send KSh 1,000 on M-Pesa?
        </motion.h2>

        {/* Setup line */}
        <motion.p
          className="text-subtitle-center max-w-2xl mx-auto mb-16 lg:mb-20"
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.15 }}
        >
          You do this every day. But the transaction doesn't just happen — it
          travels through a physical chain of infrastructure most Kenyans have
          never seen.
        </motion.p>

        {/* Journey Visualization — Desktop: horizontal */}
        <div className="hidden lg:block max-w-6xl mx-auto">
          <div className="flex items-start justify-between gap-3">
            {steps.map((step, i) => (
              <div key={step.number} className="flex items-start flex-1">
                <motion.div
                  className="flex flex-col items-center w-full"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {/* Number circle */}
                  <div
                    className={`relative flex items-center justify-center rounded-full border-2 transition-all duration-300 flex-shrink-0 ${
                      step.highlighted
                        ? "w-14 h-14 border-cyan bg-cyan glow-cyan text-cyan-foreground text-lg font-bold"
                        : "w-11 h-11 border-cyan/50 bg-transparent text-cyan text-sm font-semibold"
                    }`}
                  >
                    {step.number}
                    {step.highlighted && (
                      <div className="absolute inset-0 rounded-full border-2 border-cyan/30 animate-ping" style={{ animationDuration: "3s" }} />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`mt-3 text-center text-xs font-semibold leading-tight max-w-[6rem] ${
                      step.highlighted ? "text-cyan" : "text-foreground"
                    }`}
                  >
                    {step.label}
                  </span>

                  {/* Revelation text */}
                  <p
                    className={`mt-1.5 text-center text-[11px] leading-relaxed max-w-[7rem] ${
                      step.highlighted ? "text-cyan/70" : "text-muted-foreground"
                    }`}
                  >
                    {step.reveal}
                  </p>
                </motion.div>

                {/* Connector line between steps */}
                {i < steps.length - 1 && (
                  <motion.div
                    className="relative mx-1 flex-shrink-0 self-center mt-[-2.5rem]"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.12 + 0.15,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ width: "1rem" }}
                  >
                    <div
                      className={`h-px w-full origin-left ${
                        step.number === 4
                          ? "bg-gradient-to-r from-cyan/60 to-cyan"
                          : "bg-cyan/20"
                      }`}
                    />
                    <div
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full ${
                        step.number === 4 ? "bg-cyan glow-cyan-sm" : "bg-cyan/30"
                      }`}
                    />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Journey Visualization — Tablet: horizontal, no reveal text */}
        <div className="hidden md:flex lg:hidden items-center justify-between gap-0">
          {steps.map((step, i) => (
            <div key={step.number} className="flex items-center">
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div
                  className={`relative flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    step.highlighted
                      ? "w-16 h-16 border-cyan bg-cyan glow-cyan text-cyan-foreground text-xl font-bold"
                      : "w-12 h-12 border-cyan/50 bg-transparent text-cyan text-base font-semibold"
                  }`}
                >
                  {step.number}
                  {step.highlighted && (
                    <div className="absolute inset-0 rounded-full border-2 border-cyan/30 animate-ping" style={{ animationDuration: "3s" }} />
                  )}
                </div>
                <span
                  className={`mt-3 text-center text-xs font-medium leading-tight max-w-[5.5rem] ${
                    step.highlighted ? "text-cyan font-semibold" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </motion.div>

              {i < steps.length - 1 && (
                <motion.div
                  className="relative mx-1 sm:mx-2 flex-shrink-0"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.12 + 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ width: step.number === 4 ? "2rem" : "1.5rem" }}
                >
                  <div
                    className={`h-px w-full origin-left ${
                      step.number === 4
                        ? "bg-gradient-to-r from-cyan/60 to-cyan"
                        : "bg-cyan/20"
                    }`}
                  />
                  <div
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${
                      step.number === 4 ? "bg-cyan glow-cyan-sm" : "bg-cyan/30"
                    }`}
                  />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Journey Visualization — Mobile: vertical with revelations */}
        <div className="flex md:hidden flex-col items-center gap-0">
          {steps.map((step, i) => (
            <div key={step.number} className="flex flex-col items-center">
              <motion.div
                className="flex items-center gap-4 w-full max-w-xs"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div
                  className={`relative flex items-center justify-center rounded-full border-2 flex-shrink-0 transition-all duration-300 ${
                    step.highlighted
                      ? "w-14 h-14 border-cyan bg-cyan glow-cyan text-cyan-foreground text-lg font-bold"
                      : "w-11 h-11 border-cyan/50 bg-transparent text-cyan text-sm font-semibold"
                  }`}
                >
                  {step.number}
                  {step.highlighted && (
                    <div className="absolute inset-0 rounded-full border-2 border-cyan/30 animate-ping" style={{ animationDuration: "3s" }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-sm font-semibold leading-tight block ${
                      step.highlighted ? "text-cyan" : "text-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {step.reveal}
                  </p>
                </div>
              </motion.div>

              {i < steps.length - 1 && (
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.08 + 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="flow-line flow-line-dot" />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Pull quote */}
        <motion.div
          className="pull-quote text-center max-w-2xl mx-auto mt-16 lg:mt-20"
          style={{ borderLeft: "none", paddingLeft: 0, borderTop: "2px solid oklch(0.78 0.14 195 / 40%)", paddingTop: "1.5rem" }}
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.3 }}
        >
          You send M-Pesa dozens of times a month. Each time, your money travels
          through fibre cables, cell towers, core switches and a data centre you
          will never see — in under 2 seconds.
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.4 }}
        >
          <Link
            href="/infrastructure"
            className="inline-flex items-center gap-2 text-cyan font-medium hover:gap-3 transition-all duration-300 text-sm tracking-wide"
          >
            Explore the Infrastructure
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
