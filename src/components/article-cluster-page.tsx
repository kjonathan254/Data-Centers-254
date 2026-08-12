"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Shield, ArrowRight, Server } from "lucide-react";

interface Article {
  id: string;
  title: string;
  slug: string;
  tlDr: string | null;
  description: string | null;
  cluster: string;
  readingTimeMin: number | null;
  lastVerified: string | null;
  createdAt: string;
}

const clusterConfig: Record<
  string,
  {
    title: string;
    subtitle: string;
    description: string;
    icon: string;
  }
> = {
  Beginner: {
    title: "Beginner Guides",
    subtitle: "START HERE",
    description:
      "New to data centres? Start here. These guides explain the basics in plain language — no engineering degree required. Every concept is tied to examples you already know, like M-Pesa, WhatsApp, and Netflix.",
    icon: "\U0001F4DA",
  },
  Kenya: {
    title: "Kenya’s Data Centre Industry",
    subtitle: "KENYA FOCUS",
    description:
      "Everything about data centres in Kenya — where they are, who owns them, how the market works, and why Kenya is becoming the data centre hub of East Africa. This is the core of Data Centre 254.",
    icon: "\U0001F1F0\U0001F1EA",
  },
  Internet: {
    title: "Internet & Connectivity",
    subtitle: "CONNECTIVITY",
    description:
      "How the internet reaches Kenya, why submarine cables matter, what KIXP does, and why every cloud service needs local infrastructure. The physical path your data takes.",
    icon: "\U0001F310",
  },
  Energy: {
    title: "Energy & Power",
    subtitle: "ENERGY",
    description:
      "Data centres are massive electricity consumers. Kenya’s geothermal advantage could make it Africa’s green data centre hub — but the grid has limits. Understand the energy question.",
    icon: "\u26A1",
  },
  Careers: {
    title: "Careers & Business",
    subtitle: "CAREERS & BUSINESS",
    description:
      "Jobs, certifications, business models, and investment opportunities in Kenya’s data centre industry. Whether you’re looking for a career or a business opportunity.",
    icon: "\U0001F4BC",
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" } as const,
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } as const,
};

export default function ArticleClusterPage({ cluster }: { cluster: string }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const config = clusterConfig[cluster] || clusterConfig.Beginner;

  useEffect(() => {
    fetch(`/api/articles?cluster=${cluster}`)
      .then((r) => r.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [cluster]);

  return (
    <div className="relative">
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_10%,oklch(0.78_0.14_195/3%),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        {/* Header */}
        <motion.div className="mb-12" {...fadeUp}>
          <span className="inline-block font-mono text-xs sm:text-sm tracking-widest text-cyan mb-4 uppercase">
            {config.subtitle}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight mb-4">
            {config.title}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {config.description}
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            {loading ? "Loading..." : `${articles.length} article${articles.length !== 1 ? "s" : ""}`}
          </div>
        </motion.div>

        {/* Article List */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="glass-card rounded-xl p-5 animate-pulse">
                <div className="h-5 bg-accent rounded w-3/4 mb-2" />
                <div className="h-4 bg-accent rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="glass-card rounded-xl p-8 text-center">
            <Server className="size-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Articles coming soon.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <Link
                  href={`/articles/${a.slug}`}
                  className="block glass-card glass-card-hover rounded-xl p-5 sm:p-6 border border-border/50 hover:border-cyan/30 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-cyan transition-colors leading-snug">
                        {a.title}
                      </h2>
                      {a.tlDr && (
                        <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                          {a.tlDr}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        {a.readingTimeMin && (
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />{a.readingTimeMin} min
                          </span>
                        )}
                        {a.lastVerified && (
                          <span className="flex items-center gap-1">
                            <Shield className="size-3" />Verified {a.lastVerified}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="size-5 text-muted-foreground/30 group-hover:text-cyan group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
