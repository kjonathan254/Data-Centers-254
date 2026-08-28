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

const facilities = [
  {
    city: "Nairobi",
    detail:
      "Home to the majority of Kenya's known data centre capacity — serving banks, telcos, government and cloud providers.",
  },
  {
    city: "Mombasa",
    detail:
      "Gateway to East Africa. Submarine cables land here. Data centres in Mombasa handle international traffic exchange.",
  },
];

export default function DCMap() {
  return (
    <section id="dc-map" className="section-y-lg">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Label */}
        <motion.div {...fadeUp} className="text-center">
          <span className="text-section-label">THE DIRECTORY</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          {...fadeUp}
          className="mt-8 text-center text-display-sm text-foreground max-w-3xl mx-auto"
        >
          Kenya&apos;s digital economy runs through a handful of buildings.
        </motion.h2>

        {/* Subtitle */}
        <motion.p {...fadeUp} className="mt-6 text-subtitle-center">
          Nine known facilities. Two cities. Five operators. This is where
          your M-Pesa gets processed, your banking happens, and your
          government data lives.
        </motion.p>

        {/* City blocks */}
        <div className="mt-14 flex flex-col gap-8">
          {facilities.map((city, i) => (
            <motion.div
              key={city.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="glass-card rounded-2xl p-8 sm:p-10"
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                {city.city}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {city.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div {...fadeUp} className="mt-12 text-center">
          <Link
            href="/directory"
            className="inline-flex items-center gap-2 text-cyan text-sm font-medium hover:gap-3 transition-all duration-300"
          >
            Explore every facility in the DC Directory
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
