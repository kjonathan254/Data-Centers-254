import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { getArticlesByCluster } from "@/lib/articles";
import { getClusterImage } from "@/lib/imagery";

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
  AI: {
    title: "AI & Cloud",
    subtitle: "AI & CLOUD",
    description:
      "GPU computing, AI-ready data centres, cloud regions, and the computing demand shaping Africa\u2019s next technology frontier.",
  },
  Infrastructure: {
    title: "Inside Data Centres",
    subtitle: "DATA CENTRES & INFRASTRUCTURE",
    description:
      "The physical systems that make data centres work — cooling, power, cabling, fire suppression, and building design — plus the facilities operating in Kenya today.",
  },
  Policy: {
    title: "Policy & Regulation",
    subtitle: "POLICY & REGULATION",
    description:
      "Licensing frameworks, data protection laws, tax incentives, building codes, and the regulatory landscape shaping Kenya\u2019s data centre industry.",
  },
};

export default function ArticleClusterPage({ cluster }: { cluster: string }) {
  const articles = getArticlesByCluster(cluster);
  const config = clusterConfig[cluster] || clusterConfig.Beginner;
  const heroImg = getClusterImage(cluster);

  return (
    <div>
      {/* Photographic page header */}
      <header className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0">
          <Image
            src={heroImg.src}
            alt={heroImg.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/40"
          />
        </div>

        <div className="relative z-10 container-site py-20 sm:py-28">
          <p className="eyebrow">{config.subtitle}</p>
          <h1 className="h-display mt-3 max-w-2xl text-foreground">{config.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {config.description}
          </p>
          <p className="mt-5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {articles.length} article{articles.length !== 1 ? "s" : ""}
          </p>
        </div>
      </header>

      {/* Article list — image thumbs + text rows */}
      <div className="container-site py-14 sm:py-16">
        {articles.length === 0 ? (
          <p className="text-muted-foreground">Articles coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {articles.map((a) => (
              <Link
                key={a.frontmatter.slug}
                href={`/articles/${a.frontmatter.slug}`}
                className="group block"
              >
                <article className="card-solid card-solid-hover flex h-full overflow-hidden">
                  <div className="relative hidden w-36 shrink-0 sm:block">
                    <Image
                      src={heroImg.src}
                      alt={heroImg.alt}
                      fill
                      sizes="144px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 p-5">
                    <h2 className="text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-cyan">
                      {a.frontmatter.title}
                    </h2>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {a.frontmatter.meta_description}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {a.frontmatter.reading_time}
                      </span>
                      <span className="font-mono">
                        {new Date(a.frontmatter.published_date).toLocaleDateString("en-KE", {
                          year: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Back to all topics */}
        <Link
          href="/#the-library"
          className="mt-10 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-cyan"
        >
          <ArrowRight className="size-4 rotate-180" />
          All topics
        </Link>
      </div>
    </div>
  );
}
