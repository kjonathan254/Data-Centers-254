"use client";

import { motion } from "framer-motion";

export default function TheNumber() {
  return (
    <section className="relative section-deep section-y-lg overflow-hidden">
      {/* Subtle radial glow behind the number */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,oklch(0.78_0.14_195/4%),transparent_70%)]" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        {/* The number — massive, alone, cinematic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-gradient-cyan leading-none"
            style={{
              fontSize: "clamp(6rem, 20vw, 14rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 0.85,
              display: "block",
            }}
          >
            2
          </span>
          <span
            className="text-foreground/80"
            style={{
              fontSize: "clamp(1.5rem, 4vw, 3rem)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            seconds
          </span>
        </motion.div>

        {/* Context — small, quiet, after the dramatic pause */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 text-subtitle-center max-w-xl mx-auto"
        >
          That&apos;s how long it takes for an M-Pesa transaction to travel
          from your phone, through fibre, into a data centre, and back.
        </motion.p>

        {/* Source label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-6 text-[10px] font-mono uppercase tracking-widest text-cyan/40"
        >
          Safaricom reports average USSD latency under 2 seconds — ESTIMATE based on reported network round-trip times
        </motion.p>
      </div>
    </section>
  );
}
