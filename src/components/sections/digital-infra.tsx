"use client";

import { motion } from "framer-motion";
import {
  Smartphone,
  Radio,
  Cable,
  Server,
  CheckCircle,
  Anchor,
  Network,
  GitBranch,
  Zap,
  Thermometer,
  ArrowRight,
  ArrowDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const journeySteps = [
  {
    icon: Smartphone,
    title: "Your Phone",
    description:
      "You open the Safaricom app and tap 'Send Money'. Your phone connects to the nearest cell tower via radio waves.",
  },
  {
    icon: Radio,
    title: "Cell Tower",
    description:
      "The cell tower receives your signal and forwards it through Safaricom's microwave or fibre backhaul network to a central switching facility.",
  },
  {
    icon: Cable,
    title: "Fibre Network",
    description:
      "Your request travels through hundreds of kilometres of fibre optic cables -- including undersea cables that connect Kenya to the rest of the world.",
  },
  {
    icon: Server,
    title: "Data Centre",
    description:
      "The M-Pesa processing servers -- hosted in a data centre in Nairobi -- verify your balance, authenticate the transaction, and update the ledger in milliseconds.",
  },
  {
    icon: CheckCircle,
    title: "Back to You",
    description:
      "Confirmation arrives back through the same path in under 3 seconds. The recipient gets their money. A data centre made it possible.",
  },
];

const infraStack = [
  {
    icon: Anchor,
    title: "Subsea Cables",
    description:
      "Kenya connects to the global internet through six undersea fibre optic cables landing in Mombasa — SEACOM, TEAMS, EASSy, LION2, DARE1, and PEACE — with Meta's Daraja cable in development. These cables carry Kenya's data to the world, and without them, there would be no international connectivity.",
  },
  {
    icon: Network,
    title: "Fibre Networks",
    description:
      "Once data reaches Mombasa, terrestrial fibre networks distribute it across Kenya. Companies like Liquid Intelligent Technologies, Safaricom, and the Kenya Information Communications Authority have built thousands of kilometres of fibre.",
  },
  {
    icon: GitBranch,
    title: "Internet Exchange Points",
    description:
      "The Kenya Internet Exchange Point (KIXP) in Nairobi allows local internet traffic to stay local. When you access a Kenyan website, the data doesn't need to travel to Europe and back -- it stays in Nairobi.",
  },
  {
    icon: Server,
    title: "Data Centres",
    description:
      "This is where it all converges. Data centres house the servers that process M-Pesa, host banking apps, run government services like e-Citizen, and increasingly power AI and cloud computing. They are the physical engine of Kenya's digital economy.",
  },
  {
    icon: Zap,
    title: "Power Systems",
    description:
      "All of this infrastructure runs on electricity. Kenya's grid -- powered largely by geothermal energy from the Rift Valley -- must deliver reliable, uninterrupted power 24/7/365. Data centres are among the largest electricity consumers in the country.",
  },
  {
    icon: Thermometer,
    title: "Cooling & Environment",
    description:
      "Servers generate enormous heat. Data centres in Kenya spend significant energy on cooling systems to keep equipment at optimal temperatures. Nairobi's mild climate is actually an advantage -- less cooling needed than in hotter regions.",
  },
];

export default function DigitalInfra() {
  return (
    <section id="digital-infra" className="relative py-20 lg:py-28">
      {/* Background layers */}
      <div className="absolute inset-0 grid-bg opacity-50" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_20%,oklch(0.78_0.14_195/4%),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block font-mono text-sm tracking-widest text-cyan mb-6 uppercase">
            Digital Infrastructure 101
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            What Runs Behind the Screen
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Every time you tap your phone, an enormous physical infrastructure
            springs into action. Most Kenyans use this infrastructure daily
            without knowing it exists. Let&apos;s change that.
          </p>
        </motion.div>

        {/* ── The M-Pesa Journey ── */}
        <motion.div
          className="mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 text-center">
            The{" "}
            <span className="text-gradient-cyan">M-Pesa Journey</span>
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            What happens when you send KES 1,000 via M-Pesa? Trace the journey
            from your fingertips to a data centre and back.
          </p>

          {/* Desktop: horizontal layout */}
          <div className="hidden lg:block">
            <div className="glass-card rounded-2xl p-6 xl:p-8 relative">
              <div className="flex items-stretch gap-0">
                {journeySteps.map((step, i) => {
                  const Icon = step.icon;
                  const isLast = i === journeySteps.length - 1;
                  return (
                    <div key={step.title} className="flex items-stretch">
                      <motion.div
                        className="flex flex-col items-center text-center px-4 xl:px-5 pt-6 pb-4 min-w-[180px] xl:min-w-[200px]"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{
                          duration: 0.5,
                          delay: i * 0.12,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <div className="flex items-center justify-center size-12 rounded-xl bg-cyan/10 text-cyan mb-3 shrink-0">
                          <Icon className="size-6" />
                        </div>
                        <span className="font-mono text-[11px] text-neon font-medium tracking-wide mb-1">
                          STEP {i + 1}
                        </span>
                        <h4 className="text-sm font-semibold text-foreground mb-2">
                          {step.title}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </motion.div>
                      {!isLast && (
                        <div className="flex items-center py-6">
                          <ArrowRight className="size-5 text-cyan/40 shrink-0" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile / Tablet: vertical layout */}
          <div className="lg:hidden">
            <div className="glass-card rounded-2xl p-5 sm:p-6">
              <div className="flex flex-col">
                {journeySteps.map((step, i) => {
                  const Icon = step.icon;
                  const isLast = i === journeySteps.length - 1;
                  return (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.1,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <div className="flex items-start gap-4 py-3">
                        <div className="flex flex-col items-center shrink-0">
                          <div className="flex items-center justify-center size-11 rounded-xl bg-cyan/10 text-cyan">
                            <Icon className="size-5" />
                          </div>
                          <span className="font-mono text-[10px] text-neon font-medium tracking-wide mt-1.5">
                            {i + 1}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pb-1">
                          <h4 className="text-sm font-semibold text-foreground mb-1">
                            {step.title}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                      {!isLast && (
                        <div className="flex justify-center py-1">
                          <ArrowDown className="size-4 text-cyan/30" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── The Infrastructure Stack ── */}
        <motion.div
          className="mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 text-center">
            The{" "}
            <span className="text-cyan">Infrastructure Stack</span>
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            Six layers of physical infrastructure power Kenya&apos;s digital
            economy. Data centres sit at the centre of gravity.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {infraStack.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Card className="glass-card glass-card-hover border-border/50 h-full transition-colors duration-300 group">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex items-start gap-3.5">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-cyan/10 text-cyan shrink-0 group-hover:bg-cyan/20 transition-colors duration-300">
                          <Icon className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-base font-semibold text-foreground mb-2">
                            {item.title}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Closing Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="glass-card rounded-2xl p-6 sm:p-8 lg:p-10 border-l-4 border-l-cyan relative overflow-hidden">
            <div
              className="absolute -top-20 -right-20 w-40 h-40 bg-cyan/5 rounded-full blur-3xl"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <Badge
                variant="outline"
                className="mb-4 rounded-full px-3 py-1 text-xs font-medium border-cyan/20 text-cyan"
              >
                The Big Picture
              </Badge>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                This is the infrastructure stack that most people never think
                about. Data centres sit at the centre of gravity -- they are
                where connectivity, power, and computing converge. The sections
                below explore each layer in depth.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
