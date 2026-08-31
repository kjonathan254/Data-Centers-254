import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Map } from "lucide-react";
import { getFacilities } from "@/lib/directory-data";

/**
 * Fullscreen photographic hero — real server-hall image, text overlay,
 * verified-platform stat strip anchored to the bottom edge.
 * Server component: zero client JS, zero scroll effects, zero pinning.
 */
export default function Hero() {
  const facilities = getFacilities();
  const operators = new Set(facilities.map((f) => f.operator.name)).size;

  const stats = [
    { value: String(facilities.length), label: "Verified facilities" },
    { value: String(operators), label: "Operators tracked" },
    { value: "6", label: "Subsea cables live" },
    { value: "56+", label: "Explainers published" },
  ];

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
      {/* Fullscreen photograph */}
      <Image
        src="/images/hero-server-hall.webp"
        alt="Corridor between server racks inside a modern data centre"
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
        <p className="eyebrow">Kenya&apos;s Data Centre Intelligence Platform</p>

        <h1 className="h-display-xl mt-5 max-w-3xl text-foreground">
          Inside Kenya&apos;s digital infrastructure.
        </h1>

        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Every M-Pesa transaction, every stream, every AI query runs through
          buildings most people will never enter. DC254 maps, explains and
          tracks them — in plain language, with verified data.
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
            View the Infrastructure Map
          </Link>
        </div>

        {/* Stat strip — the platform's verified numbers as the hero's base */}
        <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-border/60 pt-6 sm:grid-cols-4 sm:gap-8">
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
          Directory data last verified August 2026 ·{" "}
          <Link href="/methodology" className="text-cyan/80 underline underline-offset-2 hover:text-cyan">
            How we verify
          </Link>
        </p>
      </div>
    </section>
  );
}
