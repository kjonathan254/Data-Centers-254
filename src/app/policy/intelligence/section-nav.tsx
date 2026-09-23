"use client";

/**
 * Control-room command bar — sticky in-page nav with scrollspy.
 *
 * Mirrors the audit mockup's top tabs (Overview / Matrix / Queue / …) but
 * wired to the live page sections: the active pill follows scroll position
 * via IntersectionObserver, and every pill smooth-scrolls to its section
 * (html has scroll-behavior: smooth under prefers-reduced-motion: no-preference).
 * Also carries the live dataset chip — the control room always announces
 * which dataset version you are looking at.
 */

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "health", label: "Overview" },
  { id: "matrix", label: "Coverage matrix" },
  { id: "queue", label: "Research queue" },
  { id: "rooms", label: "Country rooms" },
  { id: "legend", label: "Evidence states" },
] as const;

export default function SectionNav({
  datasetVersion,
  queueCount,
}: {
  datasetVersion: string;
  queueCount: number;
}) {
  const [active, setActive] = useState<string>("health");

  useEffect(() => {
    const targets = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (targets.length === 0 || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      // A slim horizontal band just above the viewport centre decides the active section.
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="Control room sections"
      className="sticky top-14 z-40 mt-8 flex items-center justify-between gap-2 rounded-xl border border-[rgba(135,180,220,0.16)] bg-[#0B1627]/92 px-2 py-1.5 shadow-lg shadow-black/20 backdrop-blur"
    >
      <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto" role="presentation">
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={isActive ? "true" : undefined}
              className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-cyan-500/15 text-cyan-300"
                  : "text-slate-400 hover:bg-[#13253A]/60 hover:text-slate-200"
              }`}
            >
              <span
                aria-hidden="true"
                className={`size-1.5 rounded-full transition-colors ${isActive ? "bg-cyan-400" : "bg-slate-600"}`}
              />
              {s.label}
              {s.id === "queue" && queueCount > 0 && (
                <span className={`rounded-full px-1.5 py-px font-mono text-[10px] leading-none ${
                  isActive ? "bg-cyan-500/20 text-cyan-200" : "bg-slate-800 text-slate-400"
                }`}>
                  {queueCount}
                </span>
              )}
            </a>
          );
        })}
      </div>
      <span
        className="hidden shrink-0 items-center gap-2 rounded-lg border border-[rgba(135,180,220,0.10)] bg-[#101D30] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 md:flex"
        title="The dataset version powering every number on this page"
      >
        <span className="relative flex size-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
        </span>
        dataset {datasetVersion.replace("policy-", "")}
      </span>
    </nav>
  );
}
