import Link from "next/link";
import { ArrowRight, Server, Globe2, Zap } from "lucide-react";

/**
 * "Start here", the beginner door into the explainer library.
 * Replaces the old WhatIsDC + ReadTheLibrary pair on the homepage: three
 * entry points instead of nine categories, so the educational mission
 * stays reachable without the homepage reading like a content archive.
 * Server component, zero client JS.
 */

const STARTERS = [
  {
    icon: Server,
    question: "What is a data centre?",
    title: "What Is a Data Centre? A Plain-Language Guide",
    href: "/articles/what-is-a-data-centre",
    note: "The journey from your pocket to the server rack, in plain language.",
  },
  {
    icon: Globe2,
    question: "How does Kenya connect to the internet?",
    title: "Submarine Cables in Mombasa: East Africa's Gateway",
    href: "/articles/submarine-cables-landing-mombasa",
    note: "The undersea cables that land Kenya's entire online life.",
  },
  {
    icon: Zap,
    question: "Why does power reliability matter?",
    title: "Why Power Reliability Shapes Kenya's Data Centres",
    href: "/articles/kenya-power-reliability-data-centres",
    note: "Uptime is an electricity story. Here is how it is solved.",
  },
];

export default function StartHere() {
  return (
    <section className="section-y border-t border-border/40">
      <div className="container-site">
        <p className="eyebrow">Learn the infrastructure</p>
        <h2 className="h-display mt-3 max-w-2xl text-foreground">
          New to digital infrastructure? Start here.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Three explainers take you from zero to understanding the buildings,
          cables and power behind Kenya&apos;s digital economy.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {STARTERS.map((s) => (
            <Link key={s.href} href={s.href} className="group block">
              <article className="card-solid card-solid-hover h-full rounded-xl p-6">
                <s.icon className="size-5 text-cyan" />
                <h3 className="mt-4 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-cyan">
                  {s.question}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {s.note}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-cyan transition-all group-hover:gap-2">
                  Read the explainer
                  <ArrowRight className="size-3.5" />
                </span>
              </article>
            </Link>
          ))}
        </div>

        <Link
          href="/data-centres"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-cyan transition-all hover:gap-2.5"
        >
          Browse all explainers
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
