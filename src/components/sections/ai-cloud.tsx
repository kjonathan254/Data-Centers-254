"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Cloud, BrainCircuit, TrendingUp, Shield, Database, Globe } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const connectionCards = [
  {
    icon: Cloud,
    title: "Cloud Computing",
    description:
      "When you use Gmail, Netflix, or M-Pesa, you're not running software on your phone — your phone is just a remote control. The actual computing happens in a data centre. In Kenya, services like KCB's banking app, Safaricom's network, and e-Citizen all run on cloud servers inside data centres.",
  },
  {
    icon: BrainCircuit,
    title: "AI Infrastructure",
    description:
      "AI is different from regular software. Training a single large AI model requires thousands of specialised processors (GPUs) running non-stop for weeks or months. These GPUs live in data centres with massive power and cooling. An AI training run can cost millions in electricity alone.",
  },
  {
    icon: TrendingUp,
    title: "The Kenya Opportunity",
    description:
      "Kenya is uniquely positioned. Our geothermal energy (over 800MW from the Rift Valley), strategic location, growing fibre connectivity, and tech-savvy workforce make Nairobi an ideal hub for AI infrastructure serving East and Central Africa. The Microsoft-G42 $1 billion investment is proof.",
  },
];

const milestones = [
  {
    year: "2015",
    text: "Cloudflare opens a point of presence in Mombasa, serving Kenya, Tanzania, Rwanda, Uganda, Ethiopia",
  },
  {
    year: "2018–2022",
    text: "Africa Data Centres (Liquid Intelligent Technologies) builds East Africa's first Tier 3 data centre in Nairobi",
  },
  {
    year: "March 2025",
    text: "iXAfrica launches NBOX1 (4.5MW, 780 racks). Safaricom completes phase 1 of its Limuru data centre",
  },
  {
    year: "May 2025",
    text: "Safaricom and iXAfrica partner to deliver East Africa's first AI-ready enterprise infrastructure",
  },
  {
    year: "January 2026",
    text: "iXAfrica hosts Oracle Cloud Infrastructure, delivering Kenya's first public cloud region in Nairobi",
  },
  {
    year: "May 2026",
    text: "Microsoft-G42 $1 billion project faces delays over power capacity constraints and government negotiations",
  },
];

const insightCards = [
  {
    icon: Database,
    text: "In January 2026, iXAfrica and Oracle made history by launching Kenya's first public cloud region in Nairobi. This means Kenyan companies can now run workloads on local Oracle Cloud infrastructure without data leaving the country — a milestone for data sovereignty.",
  },
  {
    icon: TrendingUp,
    text: "The Microsoft-G42 $1 billion project, announced in May 2024, has faced significant delays as of May 2026 due to power capacity constraints and disagreements with the Kenyan government over payment terms and power allocation from the Olkaria geothermal field.",
  },
  {
    icon: Shield,
    text: "Africa's data centre market is now valued at $3.49 billion (2024) and growing at 15.76% CAGR. The World Bank has also launched initiatives supporting data infrastructure for AI readiness across the continent (May 2026).",
  },
];

export default function AICloud() {
  return (
    <section
      id="ai-cloud"
      className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Background accents */}
      <div
        className="absolute inset-0 grid-bg opacity-40 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,oklch(0.78_0.14_195/5%),transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />

      {/* ── Section Header ── */}
      <motion.div
        className="relative z-10 text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Badge
          variant="outline"
          className="glass-card rounded-full px-4 py-1.5 text-sm font-mono font-medium border-cyan/20 text-cyan"
        >
          CLOUD, AI & DATA SOVEREIGNTY
        </Badge>

        <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-foreground">
          Where Does Your Data <span className="text-gradient-cyan">Actually Go?</span>
        </h2>

        <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
          When Kenyan companies use cloud services or AI tools, where does the
          processing happen? Why does it matter? And what does data sovereignty
          mean for Kenya's economy and security?
        </p>
      </motion.div>

      {/* ── Part 1: The Connection Explained ── */}
      <div className="relative z-10 mb-16 lg:mb-24">
        <motion.h3
          className="text-sm font-mono uppercase tracking-widest text-neon mb-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          The Connection Explained
        </motion.h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {connectionCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Card className="glass-card glass-card-hover h-full rounded-xl border-border/50 transition-colors duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center justify-center size-10 rounded-lg bg-cyan/10 text-cyan glow-cyan-sm">
                        <Icon className="size-5" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-foreground">
                        {card.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                      {card.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── GPU Servers Image ── */}
      <motion.div
        className="relative z-10 mb-16 lg:mb-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl border border-border overflow-hidden">
            <Image
              src="/images/ai-gpu-servers.png"
              alt="GPU servers powering AI training workloads"
              width={1200}
              height={675}
              className="w-full h-auto object-cover"
            />
          </div>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            GPU servers like these power AI training workloads. A single AI training run can cost millions in electricity alone.
          </p>
        </div>
      </motion.div>

      {/* ── Part 2: Kenya's AI DC Milestones ── */}
      <div className="relative z-10 mb-16 lg:mb-24">
        <motion.h3
          className="text-sm font-mono uppercase tracking-widest text-neon mb-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          Kenya&apos;s AI &amp; DC Milestones
        </motion.h3>

        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-10 max-w-5xl mx-auto">
          {/* Nairobi skyline side image */}
          <motion.div
            className="w-full lg:w-1/2 flex-shrink-0"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="rounded-xl overflow-hidden">
              <Image
                src="/images/nairobi-skyline.webp"
                alt="Nairobi's transforming skyline"
                width={800}
                height={500}
                className="w-full h-auto object-cover"
              />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Nairobi&apos;s skyline is transforming as data centre investments pour into the Silicon Savannah.
            </p>
          </motion.div>

          {/* Timeline column */}
          <div className="relative flex-1 min-w-0">
          {/* Vertical timeline line */}
          <div
            className="absolute left-[23px] sm:left-[31px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan/40 via-cyan/20 to-transparent"
            aria-hidden="true"
          />

          <div className="flex flex-col gap-4">
            {milestones.map((milestone, i) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative flex items-start gap-4 sm:gap-5"
              >
                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0 mt-1.5">
                  <div className="size-[14px] sm:size-[18px] rounded-full bg-background border-2 border-cyan glow-cyan-sm" />
                </div>

                <Card className="glass-card glass-card-hover flex-1 rounded-xl border-border/50 transition-colors duration-300">
                  <CardContent className="p-4 sm:p-5">
                    <Badge
                      variant="outline"
                      className="mb-2 rounded-md px-2.5 py-0.5 text-xs font-mono font-semibold border-cyan/20 text-cyan bg-cyan/5"
                    >
                      {milestone.year}
                    </Badge>
                    <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                      {milestone.text}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      </div>

      {/* ── Part 3: What This Means For You ── */}
      <div className="relative z-10">
        <motion.h3
          className="text-sm font-mono uppercase tracking-widest text-neon mb-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          What This Means For You
        </motion.h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {insightCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Card className="glass-card glass-card-hover h-full rounded-xl border-border/50 transition-colors duration-300">
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-neon/10 text-neon mb-4">
                      <Icon className="size-5" />
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed text-foreground font-medium">
                      {card.text}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
