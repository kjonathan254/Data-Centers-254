import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const flowSteps = [
  {
    label: "Your phone",
    reveal: "Every tap, swipe and search starts here — on a device you hold in your hand.",
  },
  {
    label: "Mobile network",
    reveal: "Cell towers across Kenya convert your signal into data in milliseconds.",
  },
  {
    label: "Fibre network",
    reveal: "Your request travels as light through cables buried beneath Kenyan roads.",
  },
  {
    label: "Data centre",
    highlight: true,
    reveal: "A building in Nairobi processes it all — in a room you will never enter.",
  },
  {
    label: "Cloud / internet",
    reveal: "The response returns through the same chain — in reverse — in under a second.",
  },
];

/**
 * "What is a data centre" — the journey from pocket to server rack,
 * told as a numbered sequence beside a real facility photograph.
 * Server component.
 */
export default function WhatIsDC() {
  return (
    <section className="section-y border-t border-border/40">
      <div className="container-site">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Photograph column */}
          <div className="lg:sticky lg:top-24">
            <p className="eyebrow">The basics</p>
            <h2 className="h-display mt-3 text-foreground">
              You use them every day.
              <span className="block text-muted-foreground">You just don&apos;t see them.</span>
            </h2>
            <div className="img-frame mt-8">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/dc-environment-sustainability.webp"
                  alt="Aerial view of a data centre facility in Nairobi at dusk"
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-cover"
                />
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              A carrier-neutral data centre campus, Nairobi. Backup generators,
              cooling plant and security perimeters — the physical form of the cloud.
            </p>
          </div>

          {/* Journey column */}
          <div className="lg:pt-16">
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Every digital service depends on a physical chain of
              infrastructure — cables, buildings, power lines — that most
              people never think about. Follow one tap from your pocket to
              the rack and back:
            </p>

            <ol className="mt-10">
              {flowSteps.map((step, i) => (
                <li
                  key={step.label}
                  className={[
                    "flex gap-5 border-b border-border/40 py-6 first:pt-0 last:border-b-0",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "font-mono text-sm",
                      step.highlight ? "text-cyan" : "text-muted-foreground/60",
                    ].join(" ")}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3
                      className={[
                        "text-base font-semibold",
                        step.highlight ? "text-cyan" : "text-foreground",
                      ].join(" ")}
                    >
                      {step.label}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {step.reveal}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Cutaway infographic — what's actually inside the building */}
            <div className="img-frame mt-10 max-w-sm">
              <div className="relative aspect-[736/1104]">
                <Image
                  src="/images/whats-inside-ai-data-center.webp"
                  alt="Cutaway diagram of an AI data centre showing GPU servers, cooling, power distribution, UPS, networking, monitoring, security and fire suppression"
                  fill
                  sizes="(max-width: 1024px) 100vw, 384px"
                  className="object-cover"
                />
              </div>
            </div>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-muted-foreground">
              Open the building up: the systems inside a modern AI-ready data
              centre — compute, cooling, power chains, networking, security.
            </p>

            <Link
              href="/data-centres"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-cyan transition-all hover:gap-2.5"
            >
              Understand data centres
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
