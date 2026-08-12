"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cpu, Server, LayoutGrid, Warehouse, Building2, Zap, Wind, Globe } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" } as const,
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } as const,
};

const stackItems = [
  { icon: Cpu, label: "GPU" },
  { icon: Server, label: "Server" },
  { icon: LayoutGrid, label: "Rack" },
  { icon: Warehouse, label: "Data Hall" },
  { icon: Building2, label: "Data Centre" },
  { icon: Zap, label: "Power" },
  { icon: Wind, label: "Cooling" },
  { icon: Globe, label: "Network" },
];

export default function AIInfrastructure() {
  return (
    <section id="ai-infra" className="relative section-deep section-y overflow-hidden">
      {/* Background image with heavy dark overlay */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <Image
          src="/images/ai-gpu-servers.png"
          alt=""
          fill
          className="object-cover opacity-20"
          priority={false}
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Label */}
        <motion.p
          className="text-section-label text-center mb-4"
          {...fadeUp}
        >
          AI
        </motion.p>

        {/* Headline line 1 */}
        <motion.h2
          className="text-display text-center text-foreground mb-2"
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
        >
          AI doesn&apos;t live in the cloud.
        </motion.h2>

        {/* Headline line 2 — gradient, with a pause delay */}
        <motion.h2
          className="text-display text-center text-gradient-cyan mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          It lives somewhere.
        </motion.h2>

        {/* Vertical stack flow */}
        <div className="flex flex-col items-center max-w-md mx-auto">
          {stackItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex flex-col items-center w-full">
                <motion.div
                  className="glass-card glass-card-hover rounded-lg flex items-center gap-3 px-5 py-3 w-full transition-colors duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Icon className="size-4 text-cyan flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </motion.div>

                {/* Flow line connector */}
                {i < stackItems.length - 1 && (
                  <motion.div
                    className="flow-line flow-line-dot my-1"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.3,
                      delay: i * 0.08 + 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Supporting copy */}
        <motion.p
          className="text-subtitle-center mt-12"
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.2 }}
        >
          Kenya&apos;s AI ambitions depend on physical infrastructure.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="text-center mt-8"
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.3 }}
        >
          <Link
            href="/ai"
            className="inline-flex items-center gap-2 text-cyan font-medium hover:gap-3 transition-all duration-300 text-sm tracking-wide"
          >
            Explore AI Infrastructure
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
