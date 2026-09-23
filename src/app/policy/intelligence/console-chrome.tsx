"use client";

/**
 * Console chrome — the control-room frame around the dashboard.
 *
 * Mockup layout (2026-09-23 audit round 2):
 *   [fixed left icon rail]  [sticky console header: title · pill nav · status chips]
 *
 * Both rails share one scrollspy (IntersectionObserver over the page section
 * ids) so the active item follows scroll, exactly like a mission console.
 * Below xl the rail hides; below lg the pill nav hides — the page keeps its
 * natural scroll and every section stays reachable by scrolling.
 */

import { useEffect, useState } from "react";
import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Flag,
  Home,
  Layers,
  LayoutDashboard,
  Radar,
  Settings,
} from "lucide-react";

export const CONSOLE_SECTIONS = [
  { id: "health", label: "Overview", icon: Home },
  { id: "matrix", label: "Pillars", icon: Layers },
  { id: "countries", label: "Jurisdictions", icon: Flag },
  { id: "sources", label: "Library", icon: BookOpen },
  { id: "queue", label: "Alerts", icon: Bell },
  { id: "control-room", label: "Reports", icon: ClipboardList },
] as const;

const CONSOLE_FOOTER_SECTIONS = [{ id: "method", label: "Method", icon: Settings }] as const;

/** Shared scrollspy: returns the id of the section currently in view. */
export function useConsoleScrollSpy(): string {
  const [active, setActive] = useState<string>("health");
  useEffect(() => {
    const ids = [...CONSOLE_SECTIONS, ...CONSOLE_FOOTER_SECTIONS].map((s) => s.id);
    const targets = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));
    if (targets.length === 0 || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        // Pick the earliest section in console order among the intersecting
        // ones — when two sections share a row (hero + jurisdiction cards)
        // the first one owns the active state.
        const hit = CONSOLE_SECTIONS.find((s) =>
          entries.some((e) => e.isIntersecting && e.target.id === s.id)
        );
        if (hit) setActive(hit.id);
        else {
          const footerHit = CONSOLE_FOOTER_SECTIONS.find((s) =>
            entries.some((e) => e.isIntersecting && e.target.id === s.id)
          );
          if (footerHit) setActive(footerHit.id);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);
  return active;
}

// ─── Left icon rail (fixed, xl+) ─────────────────────────────────────────────

export function ConsoleRail() {
  const active = useConsoleScrollSpy();
  const item = (s: { id: string; label: string; icon: typeof Home }) => {
    const Icon = s.icon;
    const isActive = active === s.id;
    return (
      <a
        key={s.id}
        href={`#${s.id}`}
        aria-current={isActive ? "true" : undefined}
        title={s.label}
        className={`group relative flex flex-col items-center gap-1 rounded-lg py-2.5 transition-colors ${
          isActive ? "text-cyan-300" : "text-slate-500 hover:text-slate-200"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-cyan-400 transition-opacity ${
            isActive ? "opacity-100 shadow-[0_0_12px_rgba(34,211,238,0.8)]" : "opacity-0"
          }`}
        />
        <span
          aria-hidden="true"
          className={`flex size-9 items-center justify-center rounded-lg transition-all ${
            isActive
              ? "bg-cyan-500/15 shadow-[inset_0_0_18px_rgba(34,211,238,0.12)]"
              : "bg-transparent group-hover:bg-[#13253A]"
          }`}
        >
          <Icon className="size-[18px]" aria-hidden="true" />
        </span>
        <span className="text-[9px] font-medium leading-none tracking-wide">{s.label}</span>
      </a>
    );
  };

  return (
    <aside
      aria-label="Console navigation"
      className="fixed bottom-0 left-0 top-14 z-40 hidden w-[76px] flex-col border-r border-[rgba(135,180,220,0.14)] bg-[#081220]/95 px-2 py-4 backdrop-blur xl:flex"
    >
      <a
        href="/policy"
        title="DataCentre254 · Policy Intelligence — back to policy explainers"
        className="mx-auto mb-5 flex size-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 to-transparent shadow-[0_0_20px_rgba(34,211,238,0.18)] transition-shadow hover:shadow-[0_0_28px_rgba(34,211,238,0.35)]"
      >
        <Radar className="size-5 text-cyan-300" aria-hidden="true" />
      </a>
      <nav aria-label="Console sections" className="flex flex-1 flex-col gap-1">
        {CONSOLE_SECTIONS.map(item)}
      </nav>
      <nav aria-label="Console footer sections" className="flex flex-col gap-1 border-t border-[rgba(135,180,220,0.10)] pt-2">
        {CONSOLE_FOOTER_SECTIONS.map(item)}
      </nav>
    </aside>
  );
}

// ─── Sticky console header ───────────────────────────────────────────────────

export function ConsoleHeader({
  datasetVersion,
  reviewedLong,
}: {
  datasetVersion: string;
  reviewedLong: string;
}) {
  const active = useConsoleScrollSpy();
  const rTag = datasetVersion.replace(/^policy-[\wQ]+-?/, "") || datasetVersion;

  return (
    <header className="sticky top-14 z-40 -mx-3 mb-5 border-b border-[rgba(135,180,220,0.14)] bg-[#07111F]/92 px-3 py-2.5 backdrop-blur sm:-mx-5 sm:px-5">
      <div className="flex items-center gap-3">
        {/* Title block */}
        <div className="min-w-0 shrink-0">
          <p className="truncate text-sm font-bold tracking-[0.16em] text-white">POLICY INTELLIGENCE</p>
          <p className="truncate text-[10px] leading-tight text-slate-500">East Africa regulatory evidence engine</p>
        </div>

        {/* Centre pill nav (lg+) */}
        <nav
          aria-label="Console sections"
          className="mx-auto hidden items-center gap-0.5 rounded-xl border border-[rgba(135,180,220,0.10)] bg-[#0B1627]/80 p-1 lg:flex"
        >
          {CONSOLE_SECTIONS.slice(0, 5).map((s) => {
            const Icon = s.icon;
            const isActive = active === s.id;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 shadow-[inset_0_0_14px_rgba(34,211,238,0.10)]"
                    : "text-slate-400 hover:bg-[#13253A]/70 hover:text-slate-200"
                }`}
              >
                <Icon className="size-3.5" aria-hidden="true" />
                {s.label}
              </a>
            );
          })}
        </nav>

        {/* Status chips */}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <span
            title="Every number on this page renders from this dataset version — nothing is hardcoded"
            className="hidden items-center gap-2 rounded-lg border border-[rgba(135,180,220,0.12)] bg-[#0B1627] px-2.5 py-1.5 md:flex"
          >
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[11px] font-medium text-slate-300">Dataset refreshed</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{rTag}</span>
          </span>
          <span
            title={`Editorial review date: ${reviewedLong}`}
            className="hidden items-center gap-1.5 rounded-lg border border-[rgba(135,180,220,0.12)] bg-[#0B1627] px-2.5 py-1.5 text-[11px] text-slate-300 sm:flex"
          >
            <CalendarDays className="size-3.5 text-slate-500" aria-hidden="true" />
            {reviewedLong}
          </span>
          <span
            title="AI proposes, the editor disposes — every claim passes the human gate before publication"
            className="flex cursor-help items-center gap-1 rounded-full border border-[rgba(135,180,220,0.16)] bg-[#101D30] py-1 pl-1 pr-1.5"
          >
            <span className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/40 to-violet-500/30 font-mono text-[9px] font-bold text-white">
              ED
            </span>
            <ChevronDown className="size-3 text-slate-500" aria-hidden="true" />
          </span>
        </div>
      </div>
    </header>
  );
}
