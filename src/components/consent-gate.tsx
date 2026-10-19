"use client";

/**
 * Analytics consent gate (Kenya DPA 2019 / GDPR friendly).
 *
 * Google Analytics 4, Microsoft Clarity and PostHog are NOT loaded until the
 * visitor explicitly agrees via the on-site banner. Sentry Session Replay
 * (browser session recording for debugging) rides the same switch: src/
 * instrumentation-client.ts only attaches the replay integration after this
 * choice is "1", and listens for dc254:consent-granted / dc254:consent-reset
 * to attach or stop recording mid-session. The choice is stored on the
 * visitor's device (localStorage) and can be changed any time by clearing
 * site data. Declining leaves the site fully functional - analytics are the
 * only thing gated (Sentry error monitoring stays on: it is operational
 * telemetry, not analytics). Vercel Analytics (<Analytics /> in the layout)
 * stays on unconditionally: it is cookieless and sets no identifiers.
 *
 * Note: GA4 and PostHog set cookies/localStorage identifiers; Clarity is
 * cookieless but still behavioural, so they sit behind the same yes/no choice
 * rather than a granular CMP. PostHog additionally respects DNT, runs with
 * session recording off (Clarity/Sentry own replay, with masking) and builds
 * person profiles only for identified users.
 */

import { useEffect, useState } from "react";
import Script from "next/script";

const STORAGE_KEY = "dc_consent";

type Consent = "unknown" | "granted" | "denied";

const GA4_INIT =
  "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-GDS6XW6RS3');";

const CLARITY_INIT =
  '(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "yimqsgqdql");';

// PostHog product analytics (project token, US ingestion). Build-time inlined
// from NEXT_PUBLIC_POSTHOG_* env vars; when unset the script is simply never
// rendered, so this file is safe to deploy before the env vars exist.
// Data-minimisation defaults: session recording off (Clarity/Sentry own
// replay), DNT respected, person profiles only for identified users.
//
// Verification note (learned 2026-10-20, took a full debug session): PostHog
// SILENTLY DROPS all capture() events from bots - posthog-js _is_bot() gates
// capture on HeadlessChrome UAs / navigator.webdriver, so headless smoke
// tests never see events reach us.i.posthog.com even though the SDK is fully
// initialised (flags POST still fires - it is not bot-gated). To verify
// ingestion, POST a probe event directly to https://us.i.posthog.com/e/
// with the project key (HTTP 200 {"status":"Ok"}), and confirm the browser
// side loads array.js + POSTs /flags/?v=2 - both observable in headless.
const PH_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || "";
const PH_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
const POSTHOG_INIT = PH_KEY
  ? `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=s;void 0!==a?e[a]=u:e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init('${PH_KEY}',{api_host:'${PH_HOST}',autocapture:true,capture_pageview:true,respect_dnt:true,disable_session_recording:true,person_profiles:'identified_only'});`
  : "";

export default function ConsentGate() {
  const [consent, setConsent] = useState<Consent>("unknown");

  useEffect(() => {
    // Mount-time localStorage hydration on a server-rendered tree; same
    // documented pattern as use-compare-selection / chat-widget
    // (useSyncExternalStore refactor tracked separately).
    const stored = window.localStorage.getItem(STORAGE_KEY);
    setConsent(
      stored === "1" ? "granted" : stored === "0" ? "denied" : "unknown"
    );
  }, []);

  useEffect(() => {
    // Consent withdrawal (Kenya DPA 2019 / GDPR: withdrawing consent must be
    // as easy as giving it). The footer "Privacy settings" button dispatches
    // this event; the gate forgets the stored choice and re-shows the banner.
    function reset() {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Nothing stored (or storage unavailable) - banner shows anyway.
      }
      setConsent("unknown");
    }
    window.addEventListener("dc254:consent-reset", reset);
    return () => window.removeEventListener("dc254:consent-reset", reset);
  }, []);

  function decide(value: "1" | "0") {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Private-mode storage quota errors: treat as session-only choice.
    }
    setConsent(value === "1" ? "granted" : "denied");
    // Sentry Session Replay attaches to the live session the moment consent
    // is granted (listener in src/instrumentation-client.ts); withdrawal is
    // handled by dc254:consent-reset, which also fires below via the footer.
    if (value === "1") {
      window.dispatchEvent(new Event("dc254:consent-granted"));
    }
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
          {/* PostHog: product analytics + autocapture. The inline bootstrap queues
              init params; the loader injects array.js from the -assets host once
              this runs. ~80KB fetch happens after consent only. */}
          {POSTHOG_INIT && (
            <Script
              id="posthog-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{ __html: POSTHOG_INIT }}
            />
          )}
        </>
      )}

      {consent === "unknown" && (
        <div
          role="dialog"
          aria-label="Analytics consent"
          className="fixed bottom-3 left-3 right-3 z-[100] mx-auto flex max-w-2xl flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-white/10 bg-[#0b1e3c]/95 px-4 py-3 shadow-2xl backdrop-blur sm:bottom-4 sm:left-4 sm:right-auto"
        >
          <p className="min-w-0 flex-1 text-xs leading-relaxed text-white/75">
            Privacy-first analytics — GA4, cookieless Clarity, PostHog and
            optional session recording. Nothing analytical
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

/**
 * Footer control that re-opens the consent banner (audit D03: consent had to
 * be withdrawn by clearing browser storage — the only element gated behind
 * consent re-appears, so granting, declining and re-choosing are all one
 * click). Purely client-side; renders as a plain button.
 */
export function PrivacySettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("dc254:consent-reset"))}
      className={className}
    >
      Privacy settings
    </button>
  );
}
