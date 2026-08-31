"use client";

/**
 * PwaRegister — service worker registration + "Add to Home Screen" polish.
 *
 * - Registers /sw.js during idle time so it never competes with first paint.
 * - Android/desktop Chromium: captures the beforeinstallprompt event and
 *   shows DC254's own install card (Chrome's default infobar is ugly and
 *   dismissals there are sticky for months).
 * - iOS Safari: shows a one-time "Share → Add to Home Screen" hint.
 * - Both banners are dismissible for 30 days and never appear once the app
 *   is running installed (standalone).
 * - Fires GA4 events: pwa_standalone (launches from home screen),
 *   pwa_install_prompt (accepted/dismissed), pwa_banner_dismissed.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_DAYS = 30;
const KEY_NATIVE = "dc254-pwa-native-dismissed-at";
const KEY_IOS = "dc254-pwa-ios-dismissed-at";
const SHOW_DELAY_MS = 10000;

function wasDismissedRecently(key: string): boolean {
  try {
    const at = window.localStorage.getItem(key);
    if (!at) return false;
    return Date.now() - Number(at) < DISMISS_DAYS * 24 * 3600 * 1000;
  } catch {
    return true; // private browsing — never nag
  }
}

function track(event: string, label?: string) {
  try {
    const g = (window as unknown as { gtag?: (...args: unknown[]) => void })
      .gtag;
    if (g) g("event", event, label ? { label } : {});
  } catch {
    /* analytics optional */
  }
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIOS(): boolean {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export default function PwaRegister() {
  const [banner, setBanner] = useState<null | "native" | "ios">(null);
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // 1. Service worker (idle-time, never competes with first paint).
    if ("serviceWorker" in navigator) {
      const register = () => {
        navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
          /* PWA is progressive — ignore failures */
        });
      };
      if ("requestIdleCallback" in window) {
        requestIdleCallback(register, { timeout: 4000 });
      } else {
        setTimeout(register, 1500);
      }
    }

    // 2. Measure installed launches.
    if (isStandalone()) {
      track("pwa_standalone");
      return;
    }

    // 3. Decide which install hint (if any) this visitor gets.
    let timer = 0;
    const evaluate = () => {
      if (deferredRef.current) {
        if (!wasDismissedRecently(KEY_NATIVE)) setBanner("native");
      } else if (isIOS() && !wasDismissedRecently(KEY_IOS)) {
        setBanner("ios");
      }
    };

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredRef.current = e as BeforeInstallPromptEvent;
    };
    const onInstalled = () => {
      track("pwa_installed");
      setBanner(null);
      deferredRef.current = null;
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    timer = window.setTimeout(evaluate, SHOW_DELAY_MS);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const install = async () => {
    const e = deferredRef.current;
    if (!e) return;
    try {
      await e.prompt();
      const { outcome } = await e.userChoice;
      track("pwa_install_prompt", outcome);
    } catch {
      track("pwa_install_prompt", "error");
    }
    deferredRef.current = null;
    setBanner(null);
  };

  const dismiss = () => {
    try {
      window.localStorage.setItem(
        banner === "ios" ? KEY_IOS : KEY_NATIVE,
        String(Date.now())
      );
    } catch {
      /* private browsing */
    }
    track("pwa_banner_dismissed", banner ?? undefined);
    setBanner(null);
  };

  if (!banner) return null;

  return (
    <div
      role="dialog"
      aria-label="Install DC254"
      className="fixed bottom-20 inset-x-3 z-50 sm:bottom-6 sm:inset-x-auto sm:right-5 sm:max-w-sm"
    >
      <div className="glass-card rounded-xl border border-border/50 p-3.5 shadow-2xl">
        <div className="flex items-start gap-3">
          <Image
            src="/icon-192.png"
            alt="DC254"
            width={44}
            height={44}
            className="size-11 shrink-0 rounded-lg"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">
              Install DC254
            </p>
            <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
              {banner === "native" ? (
                <>
                  One tap to install. Read articles offline, launch from your
                  home screen — no app store needed.
                </>
              ) : (
                <>
                  Add DC254 to your Home Screen: tap{" "}
                  <span className="font-medium text-foreground">Share</span>,
                  then{" "}
                  <span className="font-medium text-foreground">
                    &ldquo;Add to Home Screen&rdquo;
                  </span>
                  .
                </>
              )}
            </p>
            {banner === "native" && (
              <button
                onClick={install}
                className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-cyan/30 bg-cyan/10 px-3 py-1.5 text-xs font-medium text-cyan transition-colors hover:bg-cyan/20"
              >
                <Download className="size-3.5" aria-hidden />
                Install app
              </button>
            )}
          </div>
          <button
            onClick={dismiss}
            aria-label="Dismiss install prompt"
            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
