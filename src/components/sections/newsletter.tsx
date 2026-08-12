"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users, Gift, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/* ─── Schema ────────────────────────────────────────────────────────────── */

const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

/* ─── Data ────────────────────────────────────────────────────────────────── */

const trustIndicators = [
  { icon: Users, label: "500+ Interested" },
  { icon: Gift, label: "Free Forever" },
  { icon: Clock, label: "Weekly Updates" },
];

/* ─── Animation Helpers ────────────────────────────────────────────────────── */

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" } as const,
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as const,
};

const staggerFadeUp = (index: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" } as const,
  transition: {
    duration: 0.5,
    delay: index * 0.1,
    ease: [0.22, 1, 0.36, 1],
  } as const,
});

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function Newsletter() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormValues) => {
    // Simulate a short delay for UX
    await new Promise((resolve) => setTimeout(resolve, 600));
    toast.success("Welcome aboard! We'll keep you updated.");
    reset();
  };

  return (
    <section id="newsletter" className="relative py-20 lg:py-28">
      {/* Dot background pattern */}
      <div
        className="absolute inset-0 dot-bg opacity-40"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,oklch(0.78_0.14_195/6%),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          {/* ── Section Header ── */}
          <motion.div className="mb-10 lg:mb-12" {...fadeUp}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Stay Ahead of the{" "}
              <span className="text-gradient-cyan">Curve</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Be the first to know when we launch new features and content. Join
              the Data Centre 254 community.
            </p>
          </motion.div>

          {/* ── Email Form ── */}
          <motion.div {...fadeUp}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="glass-card glow-cyan-sm rounded-xl p-5 sm:p-8"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    {...register("email")}
                    className="h-12 bg-background border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:border-cyan/40 focus:ring-cyan/20 rounded-lg px-4 text-sm sm:text-base"
                  />
                  {errors.email && (
                    <p className="absolute -bottom-5 left-1 text-xs text-destructive mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 bg-cyan text-cyan-foreground hover:bg-cyan/90 rounded-lg px-6 sm:px-8 text-sm sm:text-base font-semibold glow-cyan-sm transition-all shrink-0"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 border-2 border-cyan-foreground/30 border-t-cyan-foreground rounded-full animate-spin" />
                      Joining...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Join the Community
                      <ArrowRight className="size-4" />
                    </span>
                  )}
                </Button>
              </div>

              {/* Privacy note */}
              <p className="mt-6 text-xs sm:text-sm text-muted-foreground">
                No spam, ever. We respect your inbox. Unsubscribe anytime.
              </p>
            </form>
          </motion.div>

          {/* ── Trust Indicators ── */}
          <motion.div className="mt-10 lg:mt-12 flex items-center justify-center gap-6 sm:gap-10">
            {trustIndicators.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  className="flex items-center gap-2 text-muted-foreground"
                  {...staggerFadeUp(i)}
                >
                  <Icon className="size-4 text-cyan" />
                  <span className="text-xs sm:text-sm font-medium text-foreground/80">
                    {item.label}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
