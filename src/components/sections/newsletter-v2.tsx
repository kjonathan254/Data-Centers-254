"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "subscribed" | "already" | "error";

const messages: Record<Exclude<FormState, "idle" | "submitting">, string> = {
  subscribed: "You're on the list — the next issue of The Rack Report lands Monday morning.",
  already: "You're already on the list.",
  error: "Something went wrong. Try again.",
};

const ROLES = [
  { value: "operator", label: "I work in a data centre" },
  { value: "leadership", label: "CTO / IT leadership" },
  { value: "investor", label: "Investor / analyst" },
  { value: "journalist", label: "Journalist / media" },
  { value: "vendor", label: "Vendor / supplier" },
  { value: "student", label: "Student / learning" },
  { value: "other", label: "Just interested" },
];

export default function NewsletterV2() {
  const [state, setState] = useState<FormState>("idle");
  const [role, setRole] = useState("other");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    const company = (form.elements.namedItem("companyType") as HTMLInputElement)?.value;
    // honeypot — real users never see or fill this
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
          companyType: company || "",
          source: "homepage",
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
    <section className="section-y border-t border-border/40">
      <div className="container-site">
        <div className="card-solid mx-auto max-w-xl p-8 text-center sm:p-10">
          <p className="eyebrow">From DataCentre254</p>
          <h2 className="h-display-sm mt-3 text-foreground">
            Get The Rack Report
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            The weekly briefing on Kenya&apos;s data-centre industry.
          </p>
          <p className="mt-3 text-sm font-medium text-foreground/90">
            Data centres. Power. Cloud. Connectivity. Investment. Policy.
          </p>

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
                className="mt-6 flex flex-col items-stretch gap-2 text-left"
              >
                {/* honeypot — visually hidden, ignored by humans */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />
                <div className="flex flex-col items-stretch gap-2 sm:flex-row">
                  <input
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
                    {state === "submitting" ? "One moment…" : "Get The Rack Report"}
                  </button>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <select
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={state === "submitting"}
                    aria-label="Which describes you"
                    className="h-11 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground transition-colors focus:border-cyan/40 focus:outline-none focus:ring-2 focus:ring-cyan/30 disabled:opacity-50"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <input
                    name="companyType"
                    type="text"
                    placeholder="Company (optional)"
                    disabled={state === "submitting"}
                    aria-label="Company or organisation, optional"
                    maxLength={80}
                    className="h-11 flex-1 rounded-lg border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-cyan/40 focus:outline-none focus:ring-2 focus:ring-cyan/30 disabled:opacity-50"
                  />
                </div>
              </form>
              {state === "error" && (
                <p className="mt-3 text-xs text-destructive" role="alert">
                  {messages.error}
                </p>
              )}
              <p className="mt-4 text-xs text-muted-foreground">
                Free. Weekly. No industry noise.
              </p>
              <a
                href="/rack-report"
                className="mt-2 inline-block text-xs text-cyan hover:underline"
              >
                See what lands in every briefing →
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
