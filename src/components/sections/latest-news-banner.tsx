"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" } as const,
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } as const,
};

export default function LatestNewsBanner() {
  return (
    <section className="section-y px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Label */}
        <motion.div {...fadeUp} className="text-center">
          <span className="text-section-label">LATEST NEWS</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          {...fadeUp}
          className="mt-8 text-center text-display-sm text-foreground max-w-3xl mx-auto"
        >
          Breaking: Kenya formally licenses data centres.
        </motion.h2>

        <motion.p {...fadeUp} className="mt-6 text-subtitle-center">
          The Communications Authority's new NFP-T2 framework changes
          everything for operators, investors, and engineers.
        </motion.p>

        {/* Featured Article Card */}
        <motion.div
          {...fadeUp}
          className="mt-14 max-w-3xl mx-auto"
        >
          <Link
            href="/news/kenya-data-centre-licensing-framework"
            className="block group"
          >
            <div className="glass-card glass-card-hover rounded-xl overflow-hidden transition-all duration-300 relative">
              {/* Accent top border */}
              <div className="h-0.5 bg-gradient-to-r from-cyan via-neon to-cyan" />
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Badge
                    variant="secondary"
                    className="rounded-md px-2 py-0.5 text-xs font-medium"
                  >
                    Regulatory Intelligence
                  </Badge>
                  <Badge
                    variant="outline"
                    className="rounded-md px-2 py-0.5 text-xs font-mono border-cyan/20 text-cyan bg-cyan/5"
                  >
                    <Sparkles className="size-3 mr-1" />
                    New
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                    <Clock className="size-3" />
                    12 min read
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-cyan transition-colors duration-300 leading-snug">
                  Kenya&apos;s Data Centre Licensing Framework: What NFP-T1 and NFP-T2 Mean for the Industry
                </h3>

                <p className="text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                  For the first time in Kenya&apos;s regulatory history, commercial data
                  centres are explicitly licensed under the NFP-T2 tier (KES 15M initial,
                  15-year term). Here is what operators, investors, and engineers need to
                  know about Gazette Notice No. 3335.
                </p>

                <div className="flex items-center gap-2 mt-5 text-cyan font-medium text-sm group-hover:gap-3 transition-all duration-300">
                  Read the full analysis
                  <ArrowRight className="size-4" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
