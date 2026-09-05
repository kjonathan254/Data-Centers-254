"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { track } from "@vercel/analytics";
import { BOT_IDENTITY } from "@/lib/chatbot/identity";
import { JibuAvatar } from "@/components/chat/jibu-chat";
import {
  JIBU_OPENED_KEY,
  JIBU_WELCOME_KEY,
  JIBU_WELCOME_SESSION_KEY,
} from "@/components/chat/jibu-storage-keys";

/**
 * Jibu's one-time welcome — an introduction, not an interruption.
 *
 * Behaviour:
 *  - pops ~5s after landing; hard cap of once per browser session
 *  - skipped entirely if the visitor has already opened the chat this session
 *  - "Ask Jibu" opens the chat; either button (or Esc, or the X) starts a
 *    48-hour quiet period (localStorage)
 *  - ?meet-jibu=1 on any URL overrides the quiet period and session cap —
 *    the reliable way to see/demo the intro (quiet logic still applies after)
 *  - mobile: bottom drawer · desktop: card above the floating button
 *  - fixed positioning only — zero layout shift; entrance animations are
 *    disabled under prefers-reduced-motion
 */

const DELAY_MS = 5_000;
const QUIET_MS = 48 * 60 * 60 * 1000;

type WelcomeAction = "shown" | "ask" | "dismiss";

export default function JibuWelcome({
  trayVisible,
  onAsk,
}: {
  trayVisible: boolean;
  onAsk: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      let mayShow = true;
      const forceShow = new URLSearchParams(window.location.search).has("meet-jibu");
      try {
        if (forceShow) {
          // Demo/verification escape hatch — beats quiet period and session cap,
          // but still records the session flag so refresh returns to normal.
        } else {
          if (sessionStorage.getItem(JIBU_WELCOME_SESSION_KEY) === "1") mayShow = false;
          if (sessionStorage.getItem(JIBU_OPENED_KEY) === "1") mayShow = false;
          const last = Number(localStorage.getItem(JIBU_WELCOME_KEY));
          if (Number.isFinite(last) && last > 0 && Date.now() - last < QUIET_MS) mayShow = false;
        }
        if (mayShow) sessionStorage.setItem(JIBU_WELCOME_SESSION_KEY, "1");
      } catch {
        // Storage unavailable (private mode) — still greet, once per page load.
      }
      if (mayShow) {
        setVisible(true);
        report("shown");
      }
    }, DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  function report(action: WelcomeAction) {
    try {
      const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
      gtag?.("event", "jibu_welcome", { action });
      track("jibu_welcome", { action });
    } catch {
      // Analytics must never break the greeting.
    }
  }

  function quiet() {
    try {
      localStorage.setItem(JIBU_WELCOME_KEY, String(Date.now()));
    } catch {
      // Private mode — the session guard still limits repeats.
    }
  }

  function dismiss() {
    report("dismiss");
    quiet();
    setVisible(false);
  }

  function ask() {
    report("ask");
    quiet();
    setVisible(false);
    onAsk();
  }

  if (!visible) return null;

  const content = (
    <>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss Jibu introduction"
        className="absolute right-2 top-2 rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="size-4" />
      </button>

      <div className="flex items-center gap-3 pr-8">
        <JibuAvatar className="size-10" />
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            DC254 · {BOT_IDENTITY.name}
          </p>
          <p className="text-base font-semibold text-foreground">
            Habari! I&apos;m {BOT_IDENTITY.name}.
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{BOT_IDENTITY.welcome}</p>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={ask}
          className="h-10 flex-1 rounded-xl bg-cyan text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Ask {BOT_IDENTITY.name}
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="h-10 flex-1 rounded-xl border border-border/60 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Explore the site first
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile — bottom drawer */}
      <div className="fixed inset-x-0 bottom-0 z-[56] sm:hidden">
        <div
          role="dialog"
          aria-label={`${BOT_IDENTITY.name} introduction`}
          className="card-solid animate-jibu-drawer relative rounded-t-2xl border-x border-t border-border/70 px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4 shadow-2xl shadow-black/40"
        >
          {content}
        </div>
      </div>

      {/* Desktop — card above the floating button */}
      <div
        className={`fixed right-4 z-[56] hidden sm:right-6 sm:block ${
          trayVisible ? "sm:bottom-36" : "sm:bottom-24"
        }`}
      >
        <div
          role="dialog"
          aria-label={`${BOT_IDENTITY.name} introduction`}
          className="card-solid animate-jibu-card relative w-[min(360px,calc(100vw-2rem))] rounded-2xl border border-border/70 p-5 shadow-2xl shadow-black/40"
        >
          {content}
        </div>
      </div>
    </>
  );
}
