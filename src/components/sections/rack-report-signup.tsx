"use client";

import { useState } from "react";

type FormState =
  | "idle"
  | "submitting"
  | "check"
  | "subscribed"
  | "already"
  | "error";

const messages: Record<Exclude<FormState, "idle" | "submitting">, string> = {
  check:
    "Almost there - check your inbox and click the confirmation link to get the next issue.",
  subscribed:
    "You're on the list. The next issue lands on the first Monday of the month. Watch your inbox.",
  already: "You're already on the list.",
  error: "Something went wrong. Try again.",
};

const ROLES = [
  { value: "other", label: "Optional: I am a\u2026" },
  { value: "investor", label: "Investor / analyst" },
  { value: "operator", label: "Operator" },
  { value: "leadership", label: "CTO / technology leader" },
  { value: "vendor", label: "Vendor / supplier" },
  { value: "journalist", label: "Journalist / researcher" },
  { value: "student", label: "Student / learner" },
];

/**
 * Signup form for the /rack-report landing page. Same pipeline as the
 * homepage band, POST /api/subscribe with a page-specific source tag.
 */
export default function RackReportSignup() {
  const [state, setState] = useState<FormState>("idle");
  const [role, setRole] = useState("other");
  // The API returns specific, retryable copy for known failures (rate limit,
  // email stack down). Show it verbatim instead of a generic message so a
  // 503 during an outage does not read as "the form is broken".
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    // honeypot, real users never see or fill this
    const honeypot = (form.elements.namedItem("website") as HTMLInputElement)
      ?.value;
    if (!email) return;

    setState("submitting");
    setServerError(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          role,
          companyType: "",
          source: "rack-report-page",
          website: honeypot || "",
        }),
      });
      const data = await res.json();

      if (res.ok) {
        if (data.message === "Already subscribed") {
          setState("already");
        } else if (
          typeof data.message === "string" &&
          data.message.startsWith("Check your inbox")
        ) {
          setState("check");
        } else {
          setState("subscribed");
        }
      } else {
        // Covers 429/503 (rate limit, email stack down) and any other failure.
        // Surface the server's message when it has one; fall back to generic.
        setServerError(
          typeof data?.error === "string" && data.error.trim() !== ""
            ? data.error
            : null
        );
        setState("error");
      }
    } catch {
      setServerError(null);
      setState("error");
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      {state === "subscribed" || state === "already" || state === "check" ? (
        <p
          className="rounded-lg border border-neon/25 bg-neon/10 px-4 py-3 text-center text-sm text-foreground"
          role="status"
        >
          {messages[state]}
        </p>
      ) : (
        <>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-stretch gap-2 text-left"
          >
            {/* honeypot, visually hidden, ignored by humans */}
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
                {state === "submitting" ? "One moment…" : "Get the next issue"}
              </button>
            </div>
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={state === "submitting"}
              aria-label="Which describes you, optional"
              className="h-11 rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground transition-colors focus:border-cyan/40 focus:outline-none focus:ring-2 focus:ring-cyan/30 disabled:opacity-50"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </form>
          {state === "error" && (
            <p className="mt-3 text-xs text-destructive" role="alert">
              {serverError ?? messages.error}
            </p>
          )}
          <p className="mt-3 text-center text-xs text-muted-foreground">
            One concise email each month. Unsubscribe anytime. We do not sell
            subscriber details.
          </p>
        </>
      )}
    </div>
  );
}
