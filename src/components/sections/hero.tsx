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

export default function Hero() {
  return (
    <section className="relative min-h-screen section-full overflow-hidden">
      {/* Grid background with radial gradient glows */}
      <div className="absolute inset-0 grid-bg" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,oklch(0.78_0.14_195/6%),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_30%_70%,oklch(0.75_0.18_155/4%),transparent_70%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col items-center text-center">
        {/* Label */}
        <motion.span
          {...fadeUp}
          className="text-section-label"
        >
          DATA CENTRE 254
        </motion.span>

        {/* Hero image — full-width with cyan ring glow */}
        <motion.div
          {...fadeUp}
          className="mt-10 w-full -mx-4 sm:-mx-6 lg:-mx-8"
        >
          <div className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden ring-1 ring-cyan/20 shadow-[0_0_60px_-10px_oklch(0.78_0.14_195/0.35)]">
            <div className="relative aspect-[16/9]">
              <Image
                src="/images/hero-dc-nairobi.png"
                alt="Modern data centre facility in Nairobi, Kenya — the digital heart of East Africa"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp}
          className="mt-12 text-display-lg text-foreground leading-[1.05] tracking-tight"
        >
          Inside Kenya&apos;s{" "}
          <span className="text-gradient-cyan">Digital Infrastructure</span>
        </motion.h1>

        {/* Supporting copy */}
        <motion.p
          {...fadeUp}
          className="mt-8 text-subtitle-center max-w-2xl"
        >
          Every M-Pesa transaction. Every WhatsApp message. Every AI query.
          Every website you visit depends on infrastructure you rarely see.
        </motion.p>

        {/* CTA */}
        <motion.div
          {...fadeUp}
          className="mt-12"
        >
          <Link
            href="#digital-backbone"
            className="inline-flex items-center gap-2 glow-cyan bg-cyan text-background rounded-lg px-8 h-12 text-base font-semibold hover:bg-cyan/90 transition-all duration-300"
          >
            Explore Kenya&apos;s Digital Backbone
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
