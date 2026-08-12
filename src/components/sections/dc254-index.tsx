"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" } as const,
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } as const,
};

interface DirectoryData {
  facilities: {
    id: string;
    city: string | null;
    operator: { name: string } | null;
  }[];
  stats: {
    totalFacilities: number;
    operationalCount: number;
    totalMw: number;
    totalRacks: number;
    aiReadyCount: number;
  };
}

export default function DC254Index() {
  const [data, setData] = useState<DirectoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/directory");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const stats = data
    ? [
        {
          value: String(data.stats.totalFacilities),
          label: "Facilities",
        },
        {
          value: String(
            new Set(data.facilities.map((f) => f.operator?.name).filter(Boolean)).size
          ),
          label: "Operators",
        },
        {
          value: String(data.stats.totalMw),
          unit: "MW",
          label: "Total Power Capacity",
        },
        {
          value: String(data.stats.aiReadyCount || 0),
          label: "AI-Ready Facilities",
        },
      ]
    : [];

  return (
    <section className="section-deep section-y-lg px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Label */}
        <motion.div className="text-center" {...fadeUp}>
          <span className="text-section-label">THE DATABASE</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          {...fadeUp}
          className="mt-8 text-center text-display-sm text-foreground"
        >
          Every facility. Every operator. Every connection.
        </motion.h2>

        <motion.p {...fadeUp} className="mt-6 text-subtitle-center max-w-2xl mx-auto">
          DC254 isn&apos;t just articles. It&apos;s a verified database of
          Kenya&apos;s data centre infrastructure — facilities, operators,
          capacity, connectivity and more. Sourced, timestamped and updated.
        </motion.p>

        {/* Stats — inline revelation blocks, not dashboard cards */}
        {!loading && stats.length > 0 && (
          <div className="mt-14 flex flex-col gap-6 max-w-2xl mx-auto">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-baseline gap-4"
              >
                <div className="flex items-baseline gap-1.5 flex-shrink-0">
                  <span className="stat-display text-gradient-cyan">
                    {stat.value}
                  </span>
                  {"unit" in stat && stat.unit && (
                    <span className="text-lg font-semibold text-cyan/80">
                      {stat.unit}
                    </span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                  {i < stats.length - 1 && (
                    <span className="text-cyan/30"> &middot;</span>
                  )}
                </span>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon" />
              </span>
              Live from the DC254 database
            </motion.div>
          </div>
        )}

        {/* CTA */}
        <motion.div className="text-center mt-12" {...fadeUp}>
          <Link
            href="/index"
            className="inline-flex items-center gap-2 text-cyan font-medium text-sm hover:gap-3 transition-all duration-300"
          >
            Explore the full database
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
