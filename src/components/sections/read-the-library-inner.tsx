import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { getClusterImage } from "@/lib/imagery";

const clusterMeta: Record<string, { label: string; entry: string; route: string }> = {
  Beginner: {
    label: "Start here",
    entry: "You use data centres every day. Most people have no idea what they are.",
    route: "/beginners",
  },
  Kenya: {
    label: "Kenya",
    entry: "Nairobi and Mombasa — the two cities where Kenya's digital economy actually lives.",
    route: "/kenya",
  },
  Internet: {
    label: "Connectivity",
    entry: "Undersea cables, fibre routes, and the physical paths that carry your data.",
    route: "/infrastructure",
  },
  Energy: {
    label: "Energy",
    entry: "Geothermal from the Rift Valley. The power behind the servers.",
    route: "/energy",
  },
  AI: {
    label: "AI & cloud",
    entry: "GPU racks, cloud regions and the compute demand shaping East Africa.",
    route: "/ai",
  },
  Policy: {
    label: "Policy",
    entry: "Licensing, data protection and the rules shaping who builds what, where.",
    route: "/research",
  },
  Infrastructure: {
    label: "Data centres",
    entry: "Cooling, power, cabling and design — how the buildings actually work.",
    route: "/data-centres",
  },
  Careers: {
    label: "Careers",
    entry: "The jobs inside these buildings — roles most Kenyans have never heard of.",
    route: "/careers",
  },
};

interface Cluster {
  cluster: string;
  count: number;
  firstArticle?: { title: string; slug: string; reading_time: string };
  lastUpdated?: string;
}

/**
 * The library — every cluster as an image-led card. Server component.
 */
export default function ReadTheLibraryInner({ clusters }: { clusters: Cluster[] }) {
  const total = clusters.reduce((sum, c) => sum + c.count, 0);

  return (
    <section id="the-library" className="section-pad">
      <div className="container-site">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">The library</p>
            <h2 className="h-display-sm mt-3 max-w-xl text-foreground">
              {total} explanations of infrastructure most people never think about.
            </h2>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {clusters.map((cluster) => {
            const meta = clusterMeta[cluster.cluster] ?? {
              label: cluster.cluster,
              entry: "",
              route: "/search",
            };
            const img = getClusterImage(cluster.cluster);

            return (
              <Link
                key={cluster.cluster}
                href={meta.route}
                className="group block"
              >
                <article className="card-solid card-solid-hover h-full overflow-hidden">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs uppercase tracking-wider text-cyan/80">
                        {meta.label}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground/60">
                        {cluster.count} {cluster.count === 1 ? "article" : "articles"}
                      </span>
                    </div>
                    <p className="mt-2.5 text-sm leading-relaxed text-foreground/90">
                      {meta.entry}
                    </p>
                    {cluster.lastUpdated && (
                      <p className="mt-3 flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-muted-foreground/70">
                        <Clock className="size-3" />
                        Updated{" "}
                        {new Date(cluster.lastUpdated).toLocaleDateString("en-KE", {
                          year: "numeric",
                          month: "short",
                        })}
                      </p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-all group-hover:gap-2 group-hover:text-cyan">
                      Browse
                      <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
