"use client";

/**
 * Analytics consent gate (Kenya DPA 2019 / GDPR friendly).
 *
 * Google Analytics 4 and Microsoft Clarity are NOT loaded until the visitor
 * explicitly agrees via the on-site banner. The choice is stored on the
 * visitor's device (localStorage) and can be changed any time by clearing
 * site data. Declining leaves the site fully functional - analytics are the
 * only thing gated. Vercel Analytics (<Analytics /> in the layout) stays on
 * unconditionally: it is cookieless and sets no identifiers.
 *
 * Note: GA4 sets cookies; Clarity is cookieless but still behavioural, so
 * both sit behind the same yes/no choice rather than a granular CMP.
 */

import { useEffect, useState } from "react";
import Script from "next/script";

const STORAGE_KEY = "dc_consent";

type Consent = "unknown" | "granted" | "denied";

const GA4_INIT =
  "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-GDS6XW6RS3');";

const CLARITY_INIT =
  '(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "yimqsgqdql");';

export default function ConsentGate() {
  const [consent, setConsent] = useState<Consent>("unknown");

  useEffect(() => {
    // Mount-time localStorage hydration on a server-rendered tree; same
    // documented pattern as use-compare-selection / chat-widget
    // (useSyncExternalStore refactor tracked separately).
    const stored = window.localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(
      stored === "1" ? "granted" : stored === "0" ? "denied" : "unknown"
    );
  }, []);

  function decide(value: "1" | "0") {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Private-mode storage quota errors: treat as session-only choice.
    }
    setConsent(value === "1" ? "granted" : "denied");
  }

  return (
    <>
      {consent === "granted" && (
        <>
          {/* GA4: inline init queues events immediately; the 170KB gtag.js fetch is
              deferred to window load (lazyOnload) so it never blocks the main thread. */}
          <Script
            id="ga-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: GA4_INIT }}
          />
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-GDS6XW6RS3"
            strategy="lazyOnload"
          />
          {/* Microsoft Clarity: cookieless behavioural analytics (heatmaps, session
              replays with automatic input masking, rage-click detection). */}
          <Script
            id="ms-clarity"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: CLARITY_INIT }}
          />
        </>
      )}

      {consent === "unknown" && (
        <div
          role="dialog"
          aria-label="Analytics consent"
          className="fixed bottom-3 left-3 right-3 z-[100] mx-auto flex max-w-2xl flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-white/10 bg-[#0b1e3c]/95 px-4 py-3 shadow-2xl backdrop-blur sm:bottom-4 sm:left-4 sm:right-auto"
        >
          <p className="min-w-0 flex-1 text-xs leading-relaxed text-white/75">
            Privacy-first analytics — GA4 and cookieless Clarity. Nothing analytical
            loads until you agree.{" "}
            <a href="/privacy" className="text-sky-300 underline underline-offset-2">
              Privacy details
            </a>
            .
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => decide("1")}
              className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-[#04121f] transition-colors hover:bg-sky-400"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => decide("0")}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/5"
            >
              Decline
            </button>
          </div>
        </div>
      )}
    </>
  );
}
