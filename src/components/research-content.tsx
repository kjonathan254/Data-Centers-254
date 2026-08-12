"use client";

import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" } as const,
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } as const,
};

const topics = [
  {
    title: "Kenya Data Centre Market",
    description:
      "Market size, growth projections, operator landscape and investment trends.",
  },
  {
    title: "Kenya AI Infrastructure",
    description:
      "GPU capacity, cloud regions, AI readiness and computing demand.",
  },
  {
    title: "Data Centres & Energy",
    description: "Power consumption, renewable energy, PUE metrics and grid capacity.",
  },
  {
    title: "Kenya Digital Infrastructure Index",
    description:
      "Comprehensive scoring of Kenya's infrastructure maturity.",
  },
  {
    title: "Data Centre Careers",
    description: "Skills gaps, certification pathways and workforce development.",
  },
  {
    title: "East African Cloud Infrastructure",
    description:
      "Regional comparison, cross-border data flows and cloud adoption.",
  },
];

export default function ResearchContent() {
  return (
    <section className="relative">
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_10%,oklch(0.78_0.14_195/3%),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        {/* Header */}
        <motion.div className="text-center mb-14 lg:mb-20" {...fadeUp}>
          <span className="text-section-label">RESEARCH</span>
          <h1 className="text-display-sm mt-4 text-foreground">
            DC254 Research
          </h1>
          <p className="text-subtitle-center mt-4">
            Independent research and analysis on Kenya&apos;s digital
            infrastructure.
          </p>
        </motion.div>

        {/* Research Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {topics.map((topic, i) => (
            <motion.div
              key={topic.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" } as const}
              transition={{
                duration: 0.7,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              } as const}
            >
              <div className="glass-card glass-card-hover rounded-xl p-6 transition-all duration-300 h-full">
                <h3 className="text-base font-semibold text-foreground">
                  {topic.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {topic.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footnote */}
        <motion.p
          className="text-sm text-muted-foreground text-center mt-12"
          {...fadeUp}
        >
          Reports will include both free summaries and downloadable deep-dive
          PDFs.
        </motion.p>
      </div>
    </section>
  );
}
