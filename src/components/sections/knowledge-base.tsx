"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Server, Network, Brain, Zap, Shield, GraduationCap } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" } as const,
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } as const,
};

const links = [
  { icon: Server, label: "Data Centres", href: "/data-centres" },
  { icon: Network, label: "Connectivity", href: "/infrastructure" },
  { icon: Brain, label: "AI", href: "/ai" },
  { icon: Zap, label: "Energy", href: "/energy" },
  { icon: Shield, label: "Policy", href: "/data-centres" },
  { icon: GraduationCap, label: "Careers", href: "/careers" },
];

export default function KnowledgeBase() {
  return (
    <section className="section-surface section-y-lg px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Label */}
        <motion.span {...fadeUp} className="text-section-label">
          GO DEEPER
        </motion.span>

        {/* Headline */}
        <motion.h2
          {...fadeUp}
          className="mt-8 text-display-sm text-foreground"
        >
          You&apos;ve seen the chain.
        </motion.h2>
        <motion.h2
          {...fadeUp}
          className="mt-2 text-display-sm text-gradient-cyan"
        >
          Now understand each link.
        </motion.h2>

        <motion.p {...fadeUp} className="mt-6 text-subtitle-center max-w-2xl mx-auto">
          Every section above is a single thread. The full picture is more
          complex — and more interesting. Explore the topics in depth.
        </motion.p>

        {/* Topic links — minimal, editorial row */}
        <motion.div
          {...fadeUp}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
        >
          {links.map((link, i) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.href}
                className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-cyan transition-colors duration-300"
              >
                <Icon className="size-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="font-medium">{link.label}</span>
                <ArrowRight className="size-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
              </Link>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
