"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "done" | "already" | "error";

const messages: Record<Exclude<FormState, "idle" | "submitting">, string> = {
  done: "Noted — you'll be first to know when the Q4 2026 snapshot lands.",
  already: "You're already on the list.",
  error: "Something went wrong. Try again.",
};

/**
 * Pre-checkout capture for the Premium Market Data Export. Checkout goes
 * live with Stripe; until then this records invoice requests and launch
 * notifications so the product launches to a real list, not zero.
 */
export default function ExportInterestForm() {
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    const kind = (form.elements.namedItem("kind") as HTMLSelectElement)?.value;
    const honeypot = (form.elements.namedItem("website") as HTMLInputElement)?.value;
    if (!email) return;

    setState("submitting");
    try {
      const res = await fetch("/api/export-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, kind, website: honeypot || "" }),
      });
      const data = await res.json();
      if (res.ok) {
        setState(data.message === "Already on the list" ? "already" : "done");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <div className="card-solid p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-foreground">
        Get the Q4 2026 snapshot
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Checkout is being wired up. Leave your email and we&apos;ll send the
        buy link the day it lands — or request an invoice now if procurement
        needs one.
      </p>

      {state === "done" || state === "already" ? (
        <p
          className="mt-4 rounded-lg border border-neon/25 bg-neon/10 px-4 py-3 text-sm text-foreground"
          role="status"
        >
          {messages[state]}
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row"
        >
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email address"
            disabled={state === "submitting"}
            aria-label="Email address"
            className="h-11 flex-1 rounded-lg border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-cyan/40 focus:outline-none focus:ring-2 focus:ring-cyan/30 disabled:opacity-50"
          />
          <select
            name="kind"
            defaultValue="notify-only"
            disabled={state === "submitting"}
            aria-label="What do you need"
            className="h-11 rounded-lg border border-border bg-background px-3 text-sm text-foreground transition-colors focus:border-cyan/40 focus:outline-none focus:ring-2 focus:ring-cyan/30 disabled:opacity-50 sm:max-w-[200px]"
          >
            <option value="notify-only">Notify me at launch</option>
            <option value="invoice-request">Request an invoice</option>
          </select>
          <button
            type="submit"
            disabled={state === "submitting"}
            className="h-11 cursor-pointer whitespace-nowrap rounded-lg bg-cyan px-6 text-sm font-semibold text-background transition-colors hover:bg-cyan/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {state === "submitting" ? "Sending…" : "Keep me posted"}
          </button>
        </form>
      )}
      {state === "error" && (
        <p className="mt-3 text-xs text-destructive" role="alert">
          {messages.error}
        </p>
      )}
    </div>
  );
}
