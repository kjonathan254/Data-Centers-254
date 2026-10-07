import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Map, FileText } from "lucide-react";
import { getAllArticles } from "@/lib/articles";
import { getPlatformStats, STAT_LABELS } from "@/lib/site-stats";

/**
 * Fullscreen photographic hero, real server-hall image, text overlay,
 * verified-platform stat strip anchored to the bottom edge.
 * Server component: zero client JS, zero scroll effects, zero pinning.
 * All figures come from site-stats.ts so the labels here match the
 * directory, map and methodology word for word.
 *
 * Hero rotation (system audit 2026-10-07): the photograph rotates daily
 * through a curated cast of seven real photographs already published on
 * the platform (no AI-generated shots, no new uploads). The pick is
 * deterministic on the calendar day in East Africa Time, not random:
 *  - every visitor that day sees the same hero, so repeat visits and the
 *    edge cache stay coherent;
 *  - the hero changes for returning visitors without any deploy or client
 *    JS, which is what "rotated a bit" asked for;
 *  - the image still renders with `priority` on first paint, so LCP and
 *    the zero-client-JS property are untouched.
 * The page carries `revalidate = 86400` so the prerender refreshes once a
 * day and the new day's pick is baked in at the edge.
 */
const HERO_ROTATION: { src: string; alt: string }[] = [
  {
    src: "/images/hero-server-hall.webp",
    alt: "Corridor between server racks inside a modern data centre",
  },
  {
    src: "/images/dc-engineer-rack-aisle.webp",
    alt: "Engineer working between server racks in a data centre aisle",
  },
  {
    src: "/images/atlancis-nairobi-datacentre-hall.webp",
    alt: "Server hall inside a Nairobi data centre facility",
  },
  {
    src: "/images/nairobi-skyline-night-kicc.webp",
    alt: "Nairobi city skyline at night with the KICC tower lit",
  },
  {
    src: "/images/mombasa-port-wide.webp",
    alt: "Mombasa port where Kenya's submarine cables come ashore",
  },
  {
    src: "/images/dc-aisle-red-status-lighting.webp",
    alt: "Data centre aisle lit red by equipment status lights",
  },
  {
    src: "/images/dc-ups-power-room.webp",
    alt: "Uninterruptible power supply room inside a data centre",
  },
];

/** Day of year in EAT (UTC+3), 0-indexed, stable across the whole day. */
function heroRotationIndex(): number {
  const now = new Date(Date.now() + 3 * 60 * 60 * 1000);
  const startOfYear = Date.UTC(now.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - startOfYear) / 86_400_000);
  return dayOfYear % HERO_ROTATION.length;
}

export default function Hero() {
  const stats_ = getPlatformStats();
  const explainers = getAllArticles().length;
  const hero = HERO_ROTATION[heroRotationIndex()];

  // All three stats read from the verified datasets, never hardcoded.
  // The three-beat strip the homepage leads with: what exists, what
  // connects us, what we have explained.
  const stats = [
    { value: String(stats_.totalTracked), label: "Tracked facilities & projects" },
    { value: String(stats_.cables.inService), label: STAT_LABELS.cablesInService },
    { value: String(explainers), label: "Explainers published" },
  ];

  const verifiedDate = new Date(`${stats_.lastVerified}T00:00:00`).toLocaleDateString(
    "en-KE",
    { month: "long", year: "numeric" }
  );

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
      {/* Fullscreen photograph, rotated daily through the verified cast */}
      <Image
        src={hero.src}
        alt={hero.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Scrims: left column for text legibility, floor fade into page background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-background/15"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-background to-transparent"
      />

      {/* Overlay content */}
      <div className="relative z-10 container-site pb-14 pt-36 sm:pb-16">
        <p className="eyebrow">Kenya&apos;s digital infrastructure intelligence platform</p>

        <h1 className="h-display-xl mt-5 max-w-3xl text-foreground">
          Inside Kenya&apos;s digital infrastructure.
        </h1>

        <p className="mt-4 max-w-xl text-base font-medium text-foreground sm:text-lg">
          The verified directory, market data and infrastructure intelligence
          platform for Kenya&apos;s data-centre economy.
        </p>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Every M-Pesa transaction, every stream, every AI query runs through
          buildings most people will never enter. DC254 maps, explains and
          tracks them, in plain language, with verified data.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/directory"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-cyan px-7 text-base font-semibold text-background transition-colors hover:bg-cyan/90"
          >
            Explore the DC Directory
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/infrastructure/map"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-background/40 px-7 text-base font-medium text-foreground backdrop-blur-sm transition-colors hover:border-cyan/40 hover:text-cyan"
          >
            <Map className="size-4" />
            Open the Infrastructure Map
          </Link>
          <Link
            href="/research/state-of-the-market-2026-q3"
            className="inline-flex h-12 items-center justify-center gap-2 px-2 text-base font-medium text-cyan transition-colors hover:text-cyan/80 sm:px-4"
          >
            <FileText className="size-4" />
            Read the 2026 Market Report
          </Link>
        </div>

        {/* Stat strip, the platform's verified numbers as the hero's base */}
        <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-border/60 pt-6 sm:grid-cols-3 sm:gap-8">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col">
              <dd className="stat-value order-1">{s.value}</dd>
              <dt className="order-2 mt-1 text-xs leading-snug text-muted-foreground">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[11px] text-muted-foreground/80">
          {stats_.kenyaFacilities} verified facilities in Kenya ·{" "}
          {stats_.regionalRecords} East Africa reference records · last verified{" "}
          {verifiedDate} ·{" "}
          <Link href="/methodology" className="text-cyan/80 underline underline-offset-2 hover:text-cyan">
            How we verify
          </Link>
        </p>
      </div>
    </section>
  );
}
