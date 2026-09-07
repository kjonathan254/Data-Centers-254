"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "subscribed" | "already" | "error";

const messages: Record<Exclude<FormState, "idle" | "submitting">, string> = {
  subscribed: "Done — you're on the list.",
  already: "You're already on the list.",
  error: "Something went wrong. Try again.",
};

/**
 * Compact end-of-article signup for The Rack Report. Sits right after the
 * article body — the moment a reader has just finished something useful is
 * the highest-intent moment to ask. Each placement is source-tagged so the
 * media kit can eventually say which articles convert.
 */
export default function SubscribeCompact({
  source = "article",
}: {
  source?: string;
}) {
  const [state, setState] = useState<FormState>("idle");
  const [role, setRole] = useState("other");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    const honeypot = (form.elements.namedItem("website") as HTMLInputElement)?.value;
    if (!email) return;

    setState("submitting");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          role,
          companyType: "",
          source,
          website: honeypot || "",
        }),
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
    <aside className="mt-14 rounded-xl border border-border/50 bg-card/60 p-6 sm:p-8">
      <p className="eyebrow">The Rack Report · Weekly intelligence briefing</p>
      <p className="mt-2 text-base font-semibold text-foreground sm:text-lg">
        This was one article. The weekly briefing is the whole build-out.
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        Kenya&apos;s data-centre industry, delivered to your inbox — facilities,
        submarine cables, power tariffs, policy and deals. One briefing a
        week, read by operators, investors and journalists.
      </p>

      {state === "subscribed" || state === "already" ? (
        <p
          className="mt-4 rounded-lg border border-neon/25 bg-neon/10 px-4 py-3 text-sm text-foreground"
          role="status"
        >
          {messages[state]}
        </p>
      ) : (
        <>
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
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={state === "submitting"}
              aria-label="Which describes you"
              className="h-11 rounded-lg border border-border bg-background px-3 text-sm text-foreground transition-colors focus:border-cyan/40 focus:outline-none focus:ring-2 focus:ring-cyan/30 disabled:opacity-50 sm:max-w-[180px]"
            >
              <option value="operator">Data centre staff</option>
              <option value="leadership">CTO / IT leader</option>
              <option value="investor">Investor / analyst</option>
              <option value="journalist">Journalist</option>
              <option value="vendor">Vendor / supplier</option>
              <option value="student">Student</option>
              <option value="other">Just interested</option>
            </select>
            <button
              type="submit"
              disabled={state === "submitting"}
              className="h-11 cursor-pointer whitespace-nowrap rounded-lg bg-cyan px-5 text-sm font-semibold text-background transition-colors hover:bg-cyan/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {state === "submitting" ? "One moment…" : "Get The Rack Report"}
            </button>
          </form>
          {state === "error" && (
            <p className="mt-2 text-xs text-destructive" role="alert">
              {messages.error}
            </p>
          )}
        </>
      )}
    </aside>
  );
}
