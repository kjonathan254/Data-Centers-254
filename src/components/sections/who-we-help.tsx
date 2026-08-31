import Link from "next/link";
import {
  GraduationCap, Newspaper, TrendingUp, Landmark, ArrowRight,
  type LucideIcon,
} from "lucide-react";

/**
 * "Who we help" — audience entry points, packaged the way institutional
 * trackers do it but for an open platform. Server component.
 */

const AUDIENCES: {
  icon: LucideIcon;
  title: string;
  body: string;
  cta: string;
  href: string;
}[] = [
  {
    icon: GraduationCap,
    title: "New to data centres",
    body: "Start from zero with plain-English explainers — what a data centre actually is, why Kenya, and where the cloud physically lives.",
    cta: "Start learning",
    href: "/beginners",
  },
  {
    icon: Newspaper,
    title: "Journalists & writers",
    body: "Sourced numbers you can cite: every figure carries its claim, source, date verified and independent evidence.",
    cta: "See the newsroom",
    href: "/news",
  },
  {
    icon: TrendingUp,
    title: "Operators & investors",
    body: "The full facility dataset, staged supply pipeline and market snapshot — free, with no signup wall.",
    cta: "Open the directory",
    href: "/directory",
  },
  {
    icon: Landmark,
    title: "Researchers & policymakers",
    body: "Methodology, confidence ratings and the reasoning behind every stage of Kenya's digital infrastructure build-out.",
    cta: "Read the methodology",
    href: "/methodology",
  },
];

export default function WhoWeHelp() {
  return (
    <section aria-labelledby="who-we-help-title" className="section-y section-surface border-y border-border/40">
      <div className="container-site">
        <span className="eyebrow">Who we help</span>
        <h2 id="who-we-help-title" className="h-display mt-3 max-w-2xl text-foreground">
          One dataset. Four ways in.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Whether you&apos;re writing a story, sizing a market, drafting
          policy or just curious what the cloud is made of — start where you
          stand.
        </p>

        <div className="mt-10 grid gap-4 sm:gap-5 md:grid-cols-2">
          {AUDIENCES.map((a) => {
            const Icon = a.icon;
            return (
              <div key={a.title} className="card-solid card-solid-hover flex flex-col rounded-xl p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-cyan/20 bg-cyan/5">
                    <Icon className="size-5 text-cyan" />
                  </span>
                  <h3 className="text-base font-semibold text-foreground">{a.title}</h3>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
                <Link
                  href={a.href}
                  className="group mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-cyan"
                >
                  {a.cta}
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
