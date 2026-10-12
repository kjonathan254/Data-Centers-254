"use client";

import { useState } from "react";
import type { ReactNode } from "react";

/**
 * The one subscribe form (Task 132 consolidation — was copy-pasted three
 * times: newsletter-v2, rack-report-signup, subscribe-compact). Owns the
 * whole state machine, the /api/subscribe call, the honeypot and the
 * success/error UI. Placement chrome (form layout, select position, copy,
 * fine print) comes in as props so all three placements keep their exact
 * current look — see the consumers for the prop recipes.
 *
 * The API returns specific, retryable copy for known failures (rate limit,
 * email stack down). It is shown verbatim instead of a generic message so a
 * 503 during an outage does not read as "the form is broken".
 */

export type SubscribeFormState =
  | "idle"
  | "submitting"
  | "check"
  | "subscribed"
  | "already"
  | "error";

export interface SubscribeRole {
  value: string;
  label: string;
}

/** Default role list (homepage + rack-report placements). */
export const SUBSCRIBE_ROLES: SubscribeRole[] = [
  { value: "other", label: "Optional: I am a…" },
  { value: "investor", label: "Investor / analyst" },
  { value: "operator", label: "Operator" },
  { value: "leadership", label: "CTO / technology leader" },
  { value: "vendor", label: "Vendor / supplier" },
  { value: "journalist", label: "Journalist / researcher" },
  { value: "student", label: "Student / learner" },
];

const EMAIL_CLASS =
  "h-11 flex-1 rounded-lg border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-cyan/40 focus:outline-none focus:ring-2 focus:ring-cyan/30 disabled:opacity-50";
const BUTTON_CLASS =
  "h-11 cursor-pointer whitespace-nowrap rounded-lg bg-cyan px-6 text-sm font-semibold text-background transition-colors hover:bg-cyan/90 disabled:cursor-not-allowed disabled:opacity-50";
const SELECT_CLASS =
  "h-11 rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground transition-colors focus:border-cyan/40 focus:outline-none focus:ring-2 focus:ring-cyan/30 disabled:opacity-50";

export interface SubscribeFormProps {
  /** Source tag recorded with the subscription (media-kit attribution). */
  source: string;
  roles?: SubscribeRole[];
  initialRole?: string;
  /** "below" = email+button row, select under it (default). "inline" = email, select, button in one row (article placement). */
  selectPlacement?: "below" | "inline";
  selectAriaLabel?: string;
  selectClassName?: string;
  formClassName?: string;
  buttonClassName?: string;
  /** Per-placement copy; defaults are the homepage wording. */
  copy?: Partial<Record<"check" | "subscribed" | "already" | "error", string>>;
  successClassName?: string;
  errorClassName?: string;
  /** Fine print / links rendered under the form (non-success states only). */
  footer?: ReactNode;
}

export default function SubscribeForm({
  source,
  roles = SUBSCRIBE_ROLES,
  initialRole = "other",
  selectPlacement = "below",
  selectAriaLabel = "Which describes you, optional",
  selectClassName = SELECT_CLASS,
  formClassName = "mt-6 flex flex-col items-stretch gap-2 text-left",
  buttonClassName = BUTTON_CLASS,
  copy,
  successClassName = "mt-6 rounded-lg border border-neon/25 bg-neon/10 px-4 py-3 text-sm text-foreground",
  errorClassName = "mt-3 text-xs text-destructive",
  footer,
}: SubscribeFormProps) {
  const [state, setState] = useState<SubscribeFormState>("idle");
  const [role, setRole] = useState(initialRole);
  const [serverError, setServerError] = useState<string | null>(null);

  const messages: Record<
    Exclude<SubscribeFormState, "idle" | "submitting">,
    string
  > = {
    check: copy?.check ?? "Almost there - check your inbox and click the confirmation link.",
    subscribed:
      copy?.subscribed ??
      "You're on the list, the next issue of The Rack Report lands on Monday morning.",
    already: copy?.already ?? "You're already on the list.",
    error: copy?.error ?? "Something went wrong. Try again.",
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    // honeypot, real users never see or fill this
    const honeypot = (form.elements.namedItem("website") as HTMLInputElement)?.value;
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
          source,
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

  const fields = (
    <>
      <input
        name="email"
        type="email"
        required
        placeholder="Email address"
        disabled={state === "submitting"}
        aria-label="Email address"
        className={EMAIL_CLASS}
      />
      {selectPlacement === "inline" && (
        <select
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={state === "submitting"}
          aria-label={selectAriaLabel}
          className={selectClassName}
        >
          {roles.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      )}
      <button
        type="submit"
        disabled={state === "submitting"}
        className={buttonClassName}
      >
        {state === "submitting" ? "One moment…" : "Get the next issue"}
      </button>
    </>
  );

  return (
    <>
      {state === "subscribed" || state === "already" || state === "check" ? (
        <p className={successClassName} role="status">
          {messages[state]}
        </p>
      ) : (
        <>
          <form onSubmit={handleSubmit} className={formClassName}>
            {/* honeypot, visually hidden, ignored by humans */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />
            {selectPlacement === "below" ? (
              <>
                <div className="flex flex-col items-stretch gap-2 sm:flex-row">
                  {fields}
                </div>
                <select
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={state === "submitting"}
                  aria-label={selectAriaLabel}
                  className={selectClassName}
                >
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              fields
            )}
          </form>
          {state === "error" && (
            <p className={errorClassName} role="alert">
              {serverError ?? messages.error}
            </p>
          )}
          {footer}
        </>
      )}
    </>
  );
}
