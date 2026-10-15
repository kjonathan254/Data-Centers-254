"use client";

import { useState } from "react";

/**
 * Buyer enquiry form for the Opportunity Brief (/opportunity-brief).
 *
 * Posts to /api/opportunity-brief/inquiry, which persists the enquiry
 * fail-closed in Upstash (a buyer enquiry must never evaporate in a
 * serverless redeploy) and returns a short reference. The form surfaces
 * storage outages honestly (503 -> "email us instead") because pretending
 * success on a commercial pipeline is worse than showing an error.
 *
 * Fields follow the product blueprint: name, work email, organisation, role,
 * buyer type, the decision question, preferred format, consent. Honeypot
 * field pattern matches ExportInterestForm.
 */

type FormState =
  | "idle"
  | "submitting"
  | { done: string }
  | { error: string };

const BUYER_TYPES = [
  { value: "vendor", label: "Vendor / supplier of infrastructure" },
  { value: "investor", label: "Investor / analyst" },
  { value: "operator", label: "Data centre operator" },
  { value: "consultant", label: "Consultant / advisor" },
  { value: "journalist", label: "Journalist / media" },
  { value: "educator", label: "Educator / researcher" },
  { value: "other", label: "Other" },
];

const FORMATS = [
  { value: "single-brief", label: "Single brief" },
  { value: "bundle", label: "Bundle (three briefs)" },
  { value: "custom-research", label: "Custom buyer lens" },
  { value: "not-sure", label: "Not sure yet" },
];

const inputClass =
  "h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-cyan/40 focus:outline-none focus:ring-2 focus:ring-cyan/30 disabled:opacity-50";

export default function OpportunityBriefInterestForm() {
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const val = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null)?.value ?? "";
    const payload = {
      name: val("name"),
      email: val("email"),
      organisation: val("organisation"),
      role: val("role"),
      buyerType: val("buyerType"),
      question: val("question"),
      preferredFormat: val("preferredFormat"),
      consent: (form.elements.namedItem("consent") as HTMLInputElement)?.checked === true,
      website: val("website"),
    };

    setState("submitting");
    try {
      const res = await fetch("/api/opportunity-brief/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        form.reset();
        setState({ done: data.reference ?? "" });
      } else {
        setState({
          error:
            data.error ??
            "Something went wrong. Please try again, or email elmaccommunicationslimited@gmail.com.",
        });
      }
    } catch {
      setState({
        error:
          "The enquiry service could not be reached. Please try again shortly, or email elmaccommunicationslimited@gmail.com.",
      });
    }
  }

  if (typeof state === "object" && "done" in state) {
    return (
      <div
        className="rounded-xl border border-cyan/25 bg-cyan/5 p-6 sm:p-8"
        role="status"
      >
        <h3 className="text-base font-semibold text-foreground mb-2">
          Enquiry received
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground mb-2">
          Your reference is{" "}
          <strong className="text-foreground font-mono">{state.done}</strong>.
          We read every enquiry personally and will reply to confirm whether
          the next brief answers your question, or propose a custom scope.
        </p>
        <p className="text-xs text-muted-foreground">
          Your enquiry is stored under our{" "}
          <a href="/privacy" className="text-cyan hover:underline">privacy policy</a>{" "}
          and erased after two years.
        </p>
      </div>
    );
  }

  const error = typeof state === "object" && "error" in state ? state.error : null;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border/50 bg-card/60 p-6 sm:p-8"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="ob-name" className="block text-sm font-medium text-foreground mb-1.5">
            Name <span className="text-cyan" aria-hidden="true">*</span>
          </label>
          <input
            id="ob-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            maxLength={100}
            placeholder="Your name"
            disabled={state === "submitting"}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="ob-email" className="block text-sm font-medium text-foreground mb-1.5">
            Work email <span className="text-cyan" aria-hidden="true">*</span>
          </label>
          <input
            id="ob-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={254}
            placeholder="you@company.com"
            disabled={state === "submitting"}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="ob-organisation" className="block text-sm font-medium text-foreground mb-1.5">
            Organisation
          </label>
          <input
            id="ob-organisation"
            name="organisation"
            type="text"
            autoComplete="organization"
            maxLength={120}
            placeholder="Company or institution"
            disabled={state === "submitting"}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="ob-role" className="block text-sm font-medium text-foreground mb-1.5">
            Role
          </label>
          <input
            id="ob-role"
            name="role"
            type="text"
            autoComplete="organization-title"
            maxLength={80}
            placeholder="e.g. Head of Procurement"
            disabled={state === "submitting"}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="ob-buyer-type" className="block text-sm font-medium text-foreground mb-1.5">
            Which best describes you? <span className="text-cyan" aria-hidden="true">*</span>
          </label>
          <select
            id="ob-buyer-type"
            name="buyerType"
            required
            defaultValue=""
            disabled={state === "submitting"}
            className={inputClass}
          >
            <option value="" disabled>
              Choose one
            </option>
            {BUYER_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ob-format" className="block text-sm font-medium text-foreground mb-1.5">
            What you are interested in <span className="text-cyan" aria-hidden="true">*</span>
          </label>
          <select
            id="ob-format"
            name="preferredFormat"
            required
            defaultValue=""
            disabled={state === "submitting"}
            className={inputClass}
          >
            <option value="" disabled>
              Choose one
            </option>
            {FORMATS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="ob-question" className="block text-sm font-medium text-foreground mb-1.5">
          The decision you are trying to make <span className="text-cyan" aria-hidden="true">*</span>
        </label>
        <textarea
          id="ob-question"
          name="question"
          required
          rows={4}
          maxLength={2000}
          placeholder="e.g. Which construction-stage projects have open procurement windows for cooling equipment in the next two quarters?"
          disabled={state === "submitting"}
          className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-cyan/40 focus:outline-none focus:ring-2 focus:ring-cyan/30 disabled:opacity-50"
        />
      </div>

      {/* Honeypot: hidden from humans, bots fill it. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="flex items-start gap-2.5 mb-5">
        <input
          id="ob-consent"
          name="consent"
          type="checkbox"
          required
          disabled={state === "submitting"}
          className="mt-1 size-4 rounded border-border accent-[var(--cyan)]"
        />
        <label htmlFor="ob-consent" className="text-xs leading-relaxed text-muted-foreground">
          DC254 may reply to this enquiry by email and store the details above
          for up to two years, under the{" "}
          <a href="/privacy" className="text-cyan hover:underline">privacy policy</a>.
          Required to submit.
        </label>
      </div>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="h-11 w-full sm:w-auto cursor-pointer rounded-lg bg-cyan px-8 text-sm font-semibold text-background transition-colors hover:bg-cyan/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {state === "submitting" ? "Sending…" : "Send the enquiry"}
      </button>

      {error && (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
