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

const topics = [
  "Kenya Data Centre Market",
  "AI Infrastructure Readiness",
  "Data Centres & Energy",
  "Digital Infrastructure Index",
  "Data Centre Careers & Skills",
  "East African Cloud",
];

export default function ResearchSection() {
  return (
    <section className="section-surface section-y px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Label */}
        <motion.div className="text-center" {...fadeUp}>
          <span className="text-section-label">RESEARCH</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          {...fadeUp}
          className="mt-8 text-display-sm text-foreground"
        >
          The research most people don&apos;t know they need.
        </motion.h2>

        <motion.p {...fadeUp} className="mt-6 text-subtitle-center">
          DC254 is producing independent research on Kenya&apos;s digital
          infrastructure — market analysis, AI readiness, energy
          assessment and more. Each report will be available as a free
          summary and a downloadable deep-dive.
        </motion.p>

        {/* Topics — simple inline list, not cards */}
        <motion.div
          {...fadeUp}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
        >
          {topics.map((topic) => (
            <span
              key={topic}
              className="text-xs font-mono uppercase tracking-wider text-cyan/60"
            >
              {topic}
            </span>
          )).reduce((acc, el, i) => {
            if (i > 0) {
              acc.push(
                <span key={`sep-${i}`} className="text-cyan/20">/</span>
              );
            }
            acc.push(el);
            return acc;
          }, [] as React.ReactNode[])}
        </motion.div>

        {/* CTA */}
        <motion.div className="text-center mt-10" {...fadeUp}>
          <Link
            href="/research"
            className="inline-flex items-center gap-2 text-cyan font-medium hover:gap-3 transition-all duration-300 text-sm"
          >
            View research
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
