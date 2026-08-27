import Link from "next/link";
import { Clock, ArrowRight, Server } from "lucide-react";
import { getArticlesByCluster } from "@/lib/articles";

const clusterConfig: Record<
  string,
  {
    title: string;
    subtitle: string;
    description: string;
  }
> = {
  Beginner: {
    title: "Beginner Guides",
    subtitle: "START HERE",
    description:
      "New to data centres? Start here. These guides explain the basics in plain language — no engineering degree required. Every concept is tied to examples you already know, like M-Pesa, WhatsApp, and Netflix.",
  },
  Kenya: {
    title: "Kenya\u2019s Data Centre Industry",
    subtitle: "KENYA FOCUS",
    description:
      "Everything about data centres in Kenya — where they are, who owns them, how the market works, and why Kenya is becoming the data centre hub of East Africa.",
  },
  Internet: {
    title: "Internet & Connectivity",
    subtitle: "CONNECTIVITY",
    description:
      "How the internet reaches Kenya, why submarine cables matter, what KIXP does, and why every cloud service needs local infrastructure.",
  },
  Energy: {
    title: "Energy & Power",
    subtitle: "ENERGY",
    description:
      "Data centres are massive electricity consumers. Kenya\u2019s geothermal advantage could make it Africa\u2019s green data centre hub — but the grid has limits.",
  },
  Careers: {
    title: "Careers & Business",
    subtitle: "CAREERS & BUSINESS",
    description:
      "Jobs, certifications, business models, and investment opportunities in Kenya\u2019s data centre industry.",
  },
};

export default function ArticleClusterPage({ cluster }: { cluster: string }) {
  const articles = getArticlesByCluster(cluster);
  const config = clusterConfig[cluster] || clusterConfig.Beginner;

  return (
    <div className="relative">
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_10%,oklch(0.78_0.14_195/3%),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        {/* Header */}
        <div className="mb-12">
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
            {articles.length} article{articles.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Article List */}
        {articles.length === 0 ? (
          <div className="glass-card rounded-xl p-8 text-center">
            <Server className="size-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Articles coming soon.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map((a) => (
              <Link
                key={a.frontmatter.slug}
                href={`/articles/${a.frontmatter.slug}`}
                className="block glass-card glass-card-hover rounded-xl p-5 sm:p-6 border border-border/50 hover:border-cyan/30 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-cyan transition-colors leading-snug">
                      {a.frontmatter.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                      {a.frontmatter.meta_description}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />{a.frontmatter.reading_time}
                      </span>
                      <span className="font-mono">
                        {new Date(a.frontmatter.published_date).toLocaleDateString("en-KE", { year: "numeric", month: "short" })}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="size-5 text-muted-foreground/30 group-hover:text-cyan group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}