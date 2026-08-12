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

const roles = [
  {
    title: "Electrical Engineer",
    revelation:
      "Ensures megawatts of power from the grid — much of it geothermal from the Rift Valley — reach every server without a single flicker.",
  },
  {
    title: "Network Engineer",
    revelation:
      "Keeps the fibre links between Mombasa's cable landing stations and Nairobi's data centres running at the speed of light.",
  },
  {
    title: "Cybersecurity Analyst",
    revelation:
      "Protects the servers that process Kenya's mobile money, banking transactions and government data — 24 hours a day.",
  },
];

export default function CareersSection() {
  return (
    <section id="careers-section" className="relative section-y-lg overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Label */}
        <motion.p
          className="text-section-label text-center mb-4"
          {...fadeUp}
        >
          CAREERS
        </motion.p>

        {/* Headline */}
        <motion.h2
          className="text-display-sm text-center max-w-3xl mx-auto mb-2"
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
        >
          Behind every transaction
        </motion.h2>
        <motion.h2
          className="text-display-sm text-center text-gradient-cyan max-w-3xl mx-auto mb-6"
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.15 }}
        >
          are people you will never meet.
        </motion.h2>

        <motion.p
          className="text-subtitle-center"
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.2 }}
        >
          A data centre needs engineers, technicians, analysts and managers —
          all working in shifts, around the clock, in buildings most Kenyans
          will never enter.
        </motion.p>

        {/* Role revelations — 3 only, tight */}
        <div className="mt-14 flex flex-col gap-4">
          {roles.map((role, i) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-5 py-5 border-b border-border/30 last:border-b-0">
                <h3 className="text-sm font-mono uppercase tracking-widest text-cyan flex-shrink-0">
                  {role.title}
                </h3>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {role.revelation}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.25 }}
        >
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-cyan font-medium hover:gap-3 transition-all duration-300 text-sm tracking-wide"
          >
            Explore Data Centre Careers
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
