"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Wrench,
  Network,
  Settings,
  Thermometer,
  Zap,
  Shield,
  Award,
  GraduationCap,
  BookMarked,
  Lightbulb,
  ClipboardCheck,
  UserCheck,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* ─── Data ────────────────────────────────────────────────────────────────── */

const careerPaths = [
  {
    icon: Wrench,
    title: "Data Centre Technician",
    description:
      "Hands-on role maintaining servers, networking equipment, and physical infrastructure. Entry-level position, great starting point.",
    salary: "KES 80K–180K/mo",
  },
  {
    icon: Network,
    title: "Network Engineer",
    description:
      "Design and manage the fibre optic and network systems that connect data centres to the world. High demand in Kenya.",
    salary: "KES 150K–400K/mo",
  },
  {
    icon: Settings,
    title: "DC Operations Manager",
    description:
      "Oversee day-to-day data centre operations, ensuring uptime, managing teams, and coordinating maintenance.",
    salary: "KES 300K–700K/mo",
  },
  {
    icon: Thermometer,
    title: "Cooling & HVAC Specialist",
    description:
      "Specialised role focused on the precision cooling systems that keep servers from overheating. Growing demand as DCs expand.",
    salary: "KES 100K–300K/mo",
  },
  {
    icon: Zap,
    title: "Power Systems Engineer",
    description:
      "Design and maintain the complex electrical systems — generators, UPS, PDUs — that keep data centres running 24/7.",
    salary: "KES 150K–500K/mo",
  },
  {
    icon: Shield,
    title: "Cybersecurity Analyst",
    description:
      "Protect data centre infrastructure and client data from cyber threats. Critical as more sensitive data is hosted locally.",
    salary: "KES 150K–450K/mo",
  },
];

const certifications = [
  {
    title: "CDCP (Certified Data Centre Professional)",
    description:
      "The industry gold standard. Offered by EPI. Covers DC design, operations, and management. Recognised globally.",
    level: "Foundation to Advanced",
    cost: "~$2,000-3,500",
    demand: "High and growing",
    icon: Award,
  },
  {
    title: "Cisco CCNA / CCNP Data Centre",
    description:
      "Networking-focused certifications from Cisco. Essential for anyone working on DC network infrastructure.",
    level: "Associate to Professional",
    cost: "~$300-600 per exam",
    demand: "Very High",
    icon: GraduationCap,
  },
  {
    title: "CompTIA Server+ / Network+",
    description:
      "Great entry-level certifications for those starting out. Cover server hardware, networking basics, and IT fundamentals.",
    level: "Entry Level",
    cost: "~$350 per exam",
    demand: "Good starting point",
    icon: BookMarked,
  },
];

const steps = [
  {
    number: "01",
    title: "Build Foundation Knowledge",
    description:
      "Start right here on Data Centre 254. Understand what data centres are, how they work, and the key players in Kenya. You're already doing this.",
    icon: Lightbulb,
  },
  {
    number: "02",
    title: "Get Certified",
    description:
      "Pick a certification path (see above) that matches your background. If you're in IT already, CDCP or Cisco certs. If you're fresh, start with CompTIA.",
    icon: ClipboardCheck,
  },
  {
    number: "03",
    title: "Gain Practical Experience",
    description:
      "Look for internships or entry-level roles at facilities like iXAfrica, Africa Data Centres, or Safaricom. Network at events like the Africa Data Centres Summit.",
    icon: UserCheck,
  },
  {
    number: "04",
    title: "Specialise & Grow",
    description:
      "Choose a specialisation — networking, power, cooling, or security. The industry rewards deep expertise. As Kenya's DC market grows, so will your opportunities.",
    icon: ArrowUpRight,
  },
];

/* ─── Animation Helpers ────────────────────────────────────────────────────── */

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" } as const,
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as const,
};

const staggerFadeUp = (index: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" } as const,
  transition: {
    duration: 0.5,
    delay: index * 0.08,
    ease: [0.22, 1, 0.36, 1],
  } as const,
});

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function Opportunities() {
  return (
    <section id="opportunities" className="relative py-20 lg:py-28">
      {/* Subtle background layers */}
      <div
        className="absolute inset-0 grid-bg opacity-40"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_10%,oklch(0.78_0.14_195/5%),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
          {...fadeUp}
        >
          <span className="inline-block font-mono text-xs sm:text-sm tracking-widest text-cyan mb-4">
            OPPORTUNITIES
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Your Career in Data Centres{" "}
            <span className="text-gradient-cyan">Starts Here</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            The data centre industry in Kenya is creating jobs that didn&apos;t
            exist 5 years ago. Here&apos;s how to get in.
          </p>
        </motion.div>

        {/* ── Section Image ── */}
        <motion.div
          className="mb-12 lg:mb-16 flex justify-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <figure className="flex flex-col gap-3 w-full lg:w-1/2">
            <Image
              src="/images/dc-careers-tech.png"
              alt="Data centre careers and technology"
              width={640}
              height={360}
              className="w-full rounded-xl object-cover"
            />
            <figcaption className="text-sm text-muted-foreground text-center">
              Data centre technicians are among the most in-demand professionals in Kenya&apos;s growing digital infrastructure sector.
            </figcaption>
          </figure>
        </motion.div>

        {/* ── Part 1: Career Paths ── */}
        <motion.div className="mb-16 lg:mb-20">
          <motion.h3
            className="text-xl sm:text-2xl font-semibold text-foreground mb-2 text-center"
            {...fadeUp}
          >
            Career <span className="text-cyan">Paths</span>
          </motion.h3>
          <motion.p
            className="text-sm sm:text-base text-muted-foreground mb-8 text-center max-w-2xl mx-auto"
            {...fadeUp}
          >
            From entry-level technician to senior operations manager — the
            industry needs talent at every level.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {careerPaths.map((career, i) => {
              const Icon = career.icon;
              return (
                <motion.div key={career.title} {...staggerFadeUp(i)}>
                  <Card className="glass-card glass-card-hover rounded-xl p-0 overflow-hidden transition-colors duration-300 group h-full border-0">
                    <CardContent className="p-5 sm:p-6 flex flex-col gap-4">
                      {/* Icon + Title row */}
                      <div className="flex items-start gap-3.5">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-cyan/10 text-cyan shrink-0 group-hover:bg-cyan/20 transition-colors duration-300">
                          <Icon className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-base font-semibold text-foreground leading-snug">
                            {career.title}
                          </h4>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {career.description}
                      </p>

                      {/* Salary badge */}
                      <Badge
                        variant="outline"
                        className="w-fit rounded-full px-3 py-1 text-xs font-medium border-neon/25 text-neon bg-neon/5"
                      >
                        {career.salary}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Part 2: Certifications That Matter ── */}
        <motion.div className="mb-16 lg:mb-20">
          <motion.h3
            className="text-xl sm:text-2xl font-semibold text-foreground mb-2 text-center"
            {...fadeUp}
          >
            Certifications <span className="text-cyan">That Matter</span>
          </motion.h3>
          <motion.p
            className="text-sm sm:text-base text-muted-foreground mb-8 text-center max-w-2xl mx-auto"
            {...fadeUp}
          >
            The right certification can fast-track your career. Here are the ones
            employers in Kenya actually look for.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {certifications.map((cert, i) => {
              const Icon = cert.icon;
              return (
                <motion.div key={cert.title} {...staggerFadeUp(i)}>
                  <Card className="glass-card glass-card-hover rounded-xl p-0 overflow-hidden transition-colors duration-300 group h-full border-0">
                    <CardContent className="p-5 sm:p-6 flex flex-col gap-4">
                      {/* Icon */}
                      <div className="flex items-center justify-center size-12 rounded-xl bg-cyan/10 text-cyan shrink-0 group-hover:bg-cyan/20 transition-colors duration-300">
                        <Icon className="size-6" />
                      </div>

                      {/* Title */}
                      <h4 className="text-base font-semibold text-foreground leading-snug">
                        {cert.title}
                      </h4>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {cert.description}
                      </p>

                      {/* Details grid */}
                      <div className="grid grid-cols-1 gap-2.5 pt-2 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground shrink-0 w-20">
                            Level
                          </span>
                          <Badge
                            variant="outline"
                            className="rounded-full px-2.5 py-0 text-xs font-normal border-cyan/20 text-cyan/80"
                          >
                            {cert.level}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground shrink-0 w-20">
                            Cost
                          </span>
                          <span className="text-xs text-foreground">
                            {cert.cost}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground shrink-0 w-20">
                            Demand
                          </span>
                          <Badge
                            variant="outline"
                            className="rounded-full px-2.5 py-0 text-xs font-normal border-neon/25 text-neon bg-neon/5"
                          >
                            {cert.demand}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Part 3: How To Get Started ── */}
        <motion.div>
          <motion.h3
            className="text-xl sm:text-2xl font-semibold text-foreground mb-2 text-center"
            {...fadeUp}
          >
            How To <span className="text-cyan">Get Started</span>
          </motion.h3>
          <motion.p
            className="text-sm sm:text-base text-muted-foreground mb-8 text-center max-w-2xl mx-auto"
            {...fadeUp}
          >
            A practical roadmap from zero to hired in Kenya&apos;s growing data
            centre industry.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.number} {...staggerFadeUp(i)}>
                  <Card className="glass-card glass-card-hover rounded-xl p-0 overflow-hidden transition-colors duration-300 group h-full border-0 relative">
                    {/* Step number accent */}
                    <div className="absolute top-0 right-0 font-mono text-6xl sm:text-7xl font-bold text-cyan/[0.04] leading-none select-none pointer-events-none">
                      {step.number}
                    </div>
                    <CardContent className="relative z-10 p-5 sm:p-6 flex flex-col gap-3">
                      {/* Step number + Icon + Title */}
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center size-9 rounded-lg bg-cyan/10 text-cyan font-mono text-sm font-bold shrink-0 group-hover:bg-cyan/20 transition-colors duration-300">
                          {step.number}
                        </span>
                        <Icon className="size-4 text-neon shrink-0" />
                        <h4 className="text-base font-semibold text-foreground leading-snug">
                          {step.title}
                        </h4>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed pl-12">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-sm font-medium text-cyan hover:text-cyan/80 transition-colors"
            >
              Read the full careers & business guides
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
