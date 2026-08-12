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

export default function TheScale() {
  return (
    <section id="the-scale" className="section-y-lg section-surface">
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
          Just infrastructure you&apos;ve never noticed.
        </motion.h2>

        <motion.p {...fadeUp} className="mt-6 text-subtitle-center">
          When someone says &ldquo;the cloud,&rdquo; they mean buildings in Nairobi,
          cables under the Indian Ocean, and power lines from the Rift Valley.
        </motion.p>
      </div>

      {/* Full-bleed map — breaks out of container for dramatic effect */}
      <motion.div
        {...fadeUp}
        className="mt-14 mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl"
      >
        <div className="relative rounded-2xl overflow-hidden border border-border/20">
          <div className="relative aspect-[16/9]">
            <Image
              src="/images/africa-dc-map.png"
              alt="Map of Kenya showing data centre locations, submarine cable landing points, and fibre connectivity routes"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-background/20" />
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground max-w-2xl mx-auto">
          From submarine cables landing in Mombasa to data centres in Nairobi — Kenya&apos;s digital infrastructure is physical, measurable and growing.
        </p>
      </motion.div>

      {/* 3 dramatic revelations — inline, not in cards */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-16 flex flex-col gap-10">
        <motion.div
          {...fadeUp}
          className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-5"
        >
          <div className="flex items-baseline gap-2 flex-shrink-0">
            <span className="stat-display text-gradient-cyan">4</span>
            <span className="text-sm font-medium text-foreground">submarine cables</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            land in Mombasa — carrying the vast majority of Kenya&apos;s international internet traffic along the Indian Ocean floor.
            <span className="ml-2 text-[10px] font-mono uppercase tracking-wider text-cyan/50">REPORTED</span>
          </p>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-5"
        >
          <div className="flex items-baseline gap-2 flex-shrink-0">
            <span className="stat-display text-gradient-cyan">9</span>
            <span className="text-sm font-medium text-foreground">known facilities</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            house the servers, storage and networking equipment that make Kenya&apos;s digital economy possible.
            <span className="ml-2 text-[10px] font-mono uppercase tracking-wider text-cyan/50">DC254 DATABASE</span>
          </p>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-5"
        >
          <div className="flex items-baseline gap-2 flex-shrink-0">
            <span className="text-sm font-medium text-foreground">Nairobi + Mombasa</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            — two cities where the buildings that process your M-Pesa, banking, government services and streaming are physically located.
            <span className="ml-2 text-[10px] font-mono uppercase tracking-wider text-cyan/50">DC254 DATABASE</span>
          </p>
        </motion.div>
      </div>

      {/* CTA */}
      <div className="mt-14 text-center">
        <Link
          href="/directory"
          className="inline-flex items-center gap-2 text-cyan text-sm font-medium hover:gap-3 transition-all duration-300"
        >
          Explore the DC Directory
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
