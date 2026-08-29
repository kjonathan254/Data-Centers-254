import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { getClusterImage } from "@/lib/imagery";

interface Article {
  id: string;
  title: string;
  slug: string;
  tlDr: string;
  cluster: string;
  readingTimeMin: number | null;
}

/**
 * Latest intelligence — image-led article cards under a left-aligned
 * editorial header. Server component; zero client JS.
 */
export default function LatestIntelligenceInner({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="section-pad">
      <div className="container-site">
        {/* Section header — left-aligned editorial pattern */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Latest intelligence</p>
            <h2 className="h-display-sm mt-3 max-w-xl text-foreground">
              The infrastructure is being built right now.
            </h2>
          </div>
          <Link
            href="/search"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-cyan hover:gap-2.5 transition-all sm:inline-flex"
          >
            All articles
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Image-led article cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {articles.map((article) => {
            const img = getClusterImage(article.cluster);
            return (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group block"
              >
                <article className="card-solid card-solid-hover h-full overflow-hidden">
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-mono uppercase tracking-wider text-cyan/80">
                        {article.cluster}
                      </span>
                      {article.readingTimeMin && (
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {article.readingTimeMin} min
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2.5 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-cyan">
                      {article.title}
                    </h3>
                    {article.tlDr && (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {article.tlDr}
                      </p>
                    )}
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        <Link
          href="/search"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-cyan hover:gap-2.5 transition-all sm:hidden"
        >
          All articles
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
