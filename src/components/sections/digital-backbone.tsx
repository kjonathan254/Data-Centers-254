"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" } as const,
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } as const,
};

const revelations = [
  {
    value: "4",
    unit: "submarine cables",
    detail: "land in Mombasa, carrying 99% of Kenya’s international internet traffic along the ocean floor.",
  },
  {
    value: "47,000+",
    unit: "km of fibre",
    detail: "criss-cross Kenya underground — connecting Mombasa to Nairobi, Kisumu, and the borders beyond.",
  },
  {
    value: "9",
    unit: "known facilities",
    detail: "house the servers, storage and networking equipment that make Kenya’s digital economy possible.",
  },
];

export default function DigitalBackbone() {
  return (
    <section id="digital-backbone" className="section-y-lg section-surface">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Label */}
        <motion.div {...fadeUp} className="text-center">
          <span className="text-section-label">THE ECOSYSTEM</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          {...fadeUp}
          className="mt-8 text-center text-display text-foreground"
        >
          There is no cloud.
        </motion.h2>
        <motion.h2
          {...fadeUp}
          className="mt-2 text-center text-display text-gradient-cyan"
        >
          Just infrastructure you’ve never noticed.
        </motion.h2>

        {/* Subtitle */}
        <motion.p {...fadeUp} className="mt-6 text-subtitle-center">
          When someone says “the cloud,” they mean buildings in Nairobi,
          cables under the Indian Ocean, and power lines from the Rift Valley.
          Here is the scale of the system.
        </motion.p>

        {/* Map image */}
        <motion.div {...fadeUp} className="mt-14">
          <div className="mx-auto max-w-4xl">
            <div className="relative rounded-xl overflow-hidden border border-border/30">
              <div className="relative aspect-[16/9]">
                <Image
                  src="/images/africa-dc-map.webp"
                  alt="Map of Kenya showing data centre locations, submarine cable landing points, and fibre connectivity routes"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              From submarine cables landing in Mombasa to data centres in
              Nairobi — Kenya’s digital infrastructure is physical, measurable,
              and growing.
            </p>
          </div>
        </motion.div>

        {/* Revelation blocks — each a dramatic number + explanation */}
        <div className="mt-16 flex flex-col gap-10">
          {revelations.map((item, i) => (
            <motion.div
              key={item.unit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-5"
            >
              <div className="flex items-baseline gap-2 flex-shrink-0">
                <span className="stat-display text-gradient-cyan">
                  {item.value}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {item.unit}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div {...fadeUp} className="mt-14 text-center">
          <Link
            href="/infrastructure"
            className="inline-flex items-center gap-2 text-cyan text-sm font-medium hover:gap-3 transition-all duration-300"
          >
            Explore the Infrastructure
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
