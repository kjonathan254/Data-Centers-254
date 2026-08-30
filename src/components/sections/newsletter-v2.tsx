"use client";

import { useState, useRef } from "react";

type FormState = "idle" | "submitting" | "subscribed" | "already" | "error";

const messages: Record<Exclude<FormState, "idle" | "submitting">, string> = {
  subscribed: "You're on the list — the next Brief lands Monday morning.",
  already: "You're already on the list.",
  error: "Something went wrong. Try again.",
};

export default function NewsletterV2() {
  const [state, setState] = useState<FormState>("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    if (!email) return;

    setState("submitting");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "homepage" }),
      });
      const data = await res.json();

      if (res.ok) {
        setState(data.message === "Already subscribed" ? "already" : "subscribed");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <section className="section-y border-t border-border/40">
      <div className="container-site">
        <div className="card-solid mx-auto max-w-xl p-8 text-center sm:p-10">
          <p className="eyebrow">DC254 Brief · Weekly</p>
          <h2 className="h-display-sm mt-3 text-foreground">
            Know what changed in Kenya&apos;s data centre industry — every
            Monday.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            One short email each Monday morning: new facilities verified,
            licensing and cable updates, policy changes — each with its source
            and what it means.
          </p>

          <ul className="mx-auto mt-5 max-w-sm space-y-2 text-left text-sm text-foreground/90">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan" />
              See new facility verifications before they hit the directory
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan" />
              Licence, cable and grid changes explained in plain language
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan" />
              What each change means for jobs, buyers and builders
            </li>
          </ul>

          {state === "subscribed" || state === "already" ? (
            <p
              className="mt-6 rounded-lg border border-neon/25 bg-neon/10 px-4 py-3 text-sm text-foreground"
              role="status"
            >
              {messages[state]}
            </p>
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                className="mt-6 flex flex-col items-stretch gap-2 sm:flex-row"
              >
                <input
                  ref={inputRef}
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  disabled={state === "submitting"}
                  aria-label="Email address"
                  className="h-11 flex-1 rounded-lg border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-cyan/40 focus:outline-none focus:ring-2 focus:ring-cyan/30 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={state === "submitting"}
                  className="h-11 cursor-pointer whitespace-nowrap rounded-lg bg-cyan px-6 text-sm font-semibold text-background transition-colors hover:bg-cyan/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {state === "submitting" ? "Subscribing…" : "Get the Brief"}
                </button>
              </form>
              <p className="mt-3 text-xs text-muted-foreground/60">
                Free, no spam, unsubscribe anytime.
              </p>
              {state === "error" && (
                <p className="mt-3 text-xs text-destructive" role="alert">
                  {messages.error}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
