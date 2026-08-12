"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" } as const,
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as const,
};

type FormState = "idle" | "submitting" | "subscribed" | "already" | "error";

const messages: Record<Exclude<FormState, "idle" | "submitting">, string> = {
  subscribed: "You're on the list. We'll notify you when DC254 Brief launches.",
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

  // Success / already subscribed — show confirmation
  if (state === "subscribed" || state === "already") {
    return (
      <section className="section-y px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-mono uppercase tracking-widest text-cyan/50"
          >
            DC254 Brief
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-sm text-foreground/80"
          >
            {messages[state]}
          </motion.p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-y px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto text-center">
        {/* Brand name — quiet, confident */}
        <motion.p {...fadeUp} className="text-[11px] font-mono uppercase tracking-widest text-cyan/50">
          DC254 Brief
        </motion.p>

        {/* Headline — one statement */}
        <motion.h2
          {...fadeUp}
          className="mt-4 text-lg sm:text-xl font-semibold text-foreground tracking-tight"
        >
          Know what powers Kenya.
        </motion.h2>

        {/* Subtitle — what it is */}
        <motion.p {...fadeUp} className="mt-2 text-sm text-muted-foreground">
          A concise weekly briefing on Kenya&apos;s digital infrastructure.
        </motion.p>

        {/* Form — minimal */}
        <motion.div {...fadeUp} className="mt-6">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2">
            <input
              ref={inputRef}
              name="email"
              type="email"
              required
              placeholder="Email address"
              disabled={state === "submitting"}
              className="flex-1 bg-transparent border border-border/60 rounded-lg h-10 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-cyan/30 focus:border-cyan/30 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={state === "submitting"}
              className="bg-cyan text-background font-semibold text-sm rounded-lg h-10 px-5 hover:bg-cyan/90 active:scale-[0.98] transition-all duration-200 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state === "submitting" ? "..." : "Subscribe"}
            </button>
          </form>
          {/* Error message */}
          {state === "error" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-xs text-destructive"
            >
              {messages.error}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
