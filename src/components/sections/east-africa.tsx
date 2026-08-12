"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Star,
  MapPin,
 Cable,
  Zap,
  Users,
  Globe,
  ArrowRight,
  Anchor,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const countries = [
  {
    name: "Kenya",
    tagline: "The Regional Leader",
    icon: Star,
    accent: "cyan" as const,
    status: "Leading",
    keyDevelopments: [
      "iXAfrica (22.5MW), Africa Data Centres (Tier 3)",
      "Safaricom, icolo.io, Microsoft-G42 (upcoming)",
    ],
    market: "~$509M (2024), projected $733M (2032)",
    advantage: "Geothermal energy, fibre connectivity, tech ecosystem",
  },
  {
    name: "Uganda",
    tagline: "Emerging Market",
    icon: MapPin,
    accent: "neon" as const,
    status: "Emerging",
    keyDevelopments: [
      "Growing cloud adoption across enterprises",
      "Government digitalisation push accelerating demand",
    ],
    market: "Nascent but growing, served partly by Kenyan DCs via cross-border fibre",
    advantage: "Young population, improving connectivity",
  },
  {
    name: "Tanzania",
    tagline: "Potential Powerhouse",
    icon: MapPin,
    accent: "neon" as const,
    status: "Early Stage",
    keyDevelopments: [
      "Government investing in digital infrastructure",
      "Growing mobile money ecosystem driving data needs",
    ],
    market: "Early stage, most enterprise data still hosted in Kenya or South Africa",
    advantage: "Large population, strategic Indian Ocean coast",
  },
  {
    name: "Rwanda",
    tagline: "The Dark Horse",
    icon: MapPin,
    accent: "neon" as const,
    status: "Ambitious",
    keyDevelopments: [
      "Smart Kigali initiative driving digital adoption",
      "Hosting international tech events, building brand",
    ],
    market: "Small but ambitious — Rwanda wants to be a tech hub and has the policy will to match",
    advantage: "Pro-business policies, regional fibre hub potential",
  },
  {
    name: "Ethiopia",
    tagline: "The Sleeping Giant",
    icon: MapPin,
    accent: "neon" as const,
    status: "High Potential",
    keyDevelopments: [
      "Massive population (120M+), recent telecom liberalisation",
      "Growing tech scene with emerging startups",
    ],
    market: "Enormous potential but early stage. Telecom market only recently opened to competition",
    advantage: "Huge domestic market, renewable energy potential",
  },
];

const statusColor: Record<string, string> = {
  Leading: "border-cyan/25 text-cyan bg-cyan/8",
  Emerging: "border-neon/25 text-neon bg-neon/8",
  "Early Stage": "border-foreground/15 text-muted-foreground bg-foreground/5",
  Ambitious: "border-neon/25 text-neon bg-neon/8",
  "High Potential": "border-cyan/25 text-cyan bg-cyan/8",
};

const cableNames = ["SEA-ME-WE", "EASSy", "DARE1", "TEAMS"];

export default function EastAfrica() {
  return (
    <section
      id="east-africa"
      className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Background accents */}
      <div
        className="absolute inset-0 grid-bg opacity-30 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-20 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_50%_50%_at_70%_30%,oklch(0.78_0.14_195/4%),transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse_50%_50%_at_30%_70%,oklch(0.75_0.18_155/3%),transparent_70%)] pointer-events-none"
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
          EAST AFRICA
        </Badge>

        <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-foreground">
          Beyond Kenya:{" "}
          <span className="text-gradient-cyan">The East African DC Landscape</span>
        </h2>

        <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
          Kenya doesn&apos;t exist in a vacuum. Here&apos;s how the broader East
          African region is developing its digital infrastructure.
        </p>
      </motion.div>

      {/* ── Hero Image ── */}
      <motion.div
        className="relative z-10 mb-16 lg:mb-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <figure className="flex flex-col gap-3">
          <Image
            src="/images/nairobi-skyline.png"
            alt="Nairobi, Kenya -- the emerging data centre capital of East Africa."
            width={1280}
            height={720}
            className="rounded-xl border border-border aspect-video w-full object-cover"
          />
          <figcaption className="text-sm text-muted-foreground text-center">
            Nairobi, Kenya -- the emerging data centre capital of East Africa.
          </figcaption>
        </figure>
      </motion.div>

      {/* ── Regional Overview ── */}
      <motion.div
        className="relative z-10 mb-16 lg:mb-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="glass-card glow-cyan-sm rounded-xl border-border/50 overflow-hidden">
          <CardContent className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
              {/* Map metaphor visual */}
              <div className="flex-shrink-0 flex items-center justify-center">
                <div className="relative size-32 sm:size-40 lg:size-48">
                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full border border-cyan/15" />
                  <div className="absolute inset-3 rounded-full border border-cyan/10" />
                  <div className="absolute inset-6 rounded-full border border-neon/8" />
                  {/* Center globe icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="size-16 sm:size-20 rounded-full bg-cyan/10 flex items-center justify-center">
                      <Globe className="size-8 sm:size-10 text-cyan" />
                    </div>
                  </div>
                  {/* Orbiting dots representing countries */}
                  <motion.div
                    className="absolute top-2 left-1/2 -translate-x-1/2 size-2.5 rounded-full bg-cyan glow-cyan-sm"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute top-8 right-4 size-2 rounded-full bg-neon"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.6,
                    }}
                  />
                  <motion.div
                    className="absolute bottom-8 right-6 size-2 rounded-full bg-neon"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.2,
                    }}
                  />
                  <motion.div
                    className="absolute bottom-8 left-6 size-2 rounded-full bg-neon"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.8,
                    }}
                  />
                  <motion.div
                    className="absolute top-8 left-4 size-2 rounded-full bg-neon"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2.4,
                    }}
                  />\n                </div>
              </div>

              {/* Text content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="size-4 text-cyan" />
                  <span className="text-sm font-mono uppercase tracking-widest text-neon">
                    Regional Overview
                  </span>
                </div>
                <p className="text-base sm:text-lg leading-relaxed text-foreground/90">
                  East Africa is one of the fastest-growing digital regions on the
                  continent. With a combined population of over{" "}
                  <span className="text-cyan font-semibold">300 million</span>,
                  rapidly expanding mobile penetration, and governments pushing
                  digital transformation, the demand for data centre infrastructure
                  is exploding. Kenya currently leads, but other nations are
                  catching up fast.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Country Cards Grid ── */}
      <motion.div
        className="relative z-10 mb-16 lg:mb-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h3 className="text-sm font-mono uppercase tracking-widest text-neon mb-8 text-center">
          Country Landscape
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {countries.map((country, i) => {
            const Icon = country.icon;
            const isLeading = country.name === "Kenya";
            return (
              <motion.div
                key={country.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={isLeading ? "md:col-span-2 lg:col-span-3" : ""}
              >
                <Card
                  className={`glass-card glass-card-hover h-full rounded-xl border-border/50 transition-colors duration-300 ${
                    isLeading ? "glow-cyan-sm" : ""
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center justify-center size-10 rounded-lg ${
                            country.accent === "cyan"
                              ? "bg-cyan/10 text-cyan"
                              : "bg-neon/10 text-neon"
                          }`}
                        >
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-foreground">
                            {country.name}
                          </CardTitle>
                          <CardDescription className="text-sm text-muted-foreground">
                            {country.tagline}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`rounded-md px-2.5 py-0.5 text-xs font-mono font-medium whitespace-nowrap ${
                          statusColor[country.status] || ""
                        }`}
                      >
                        {country.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {isLeading ? (
                      /* Kenya — wide layout with more detail */
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-mono uppercase tracking-wider text-neon mb-2">
                              Key Facilities
                            </p>
                            <ul className="space-y-1.5">
                              {country.keyDevelopments.map((item) => (
                                <li
                                  key={item}
                                  className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2"
                                >
                                  <ArrowRight className="size-3.5 text-cyan mt-0.5 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-mono uppercase tracking-wider text-neon mb-2">
                              Market Size
                            </p>
                            <p className="text-sm text-foreground/90 font-medium">
                              {country.market}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-mono uppercase tracking-wider text-neon mb-2">
                              Competitive Advantage
                            </p>
                            <div className="flex items-start gap-2">
                              <Zap className="size-4 text-cyan mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {country.advantage}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Other countries — compact layout */
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-mono uppercase tracking-wider text-neon mb-2">
                            Key Developments
                          </p>
                          <ul className="space-y-1.5">
                            {country.keyDevelopments.map((item) => (
                              <li
                                key={item}
                                className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2"
                              >
                                <ArrowRight className="size-3.5 text-neon mt-0.5 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-mono uppercase tracking-wider text-neon mb-1.5">
                              Market
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {country.market}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-mono uppercase tracking-wider text-neon mb-1.5">
                              Advantage
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {country.advantage}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Connectivity Note ── */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="glass-card rounded-xl border-border/50 overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              {/* Icon cluster */}
              <div className="flex-shrink-0 flex items-center justify-center size-14 rounded-xl bg-cyan/10 border border-cyan/15">
                <Cable className="size-6 text-cyan" />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Anchor className="size-4 text-neon" />
                  <span className="text-sm font-mono uppercase tracking-widest text-neon">
                    Connectivity Gateway
                  </span>
                </div>

                <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                  Undersea fibre cables landing in Mombasa make Kenya the natural
                  gateway for East Africa&apos;s internet traffic. Most East
                  African countries connect internationally through Kenyan
                  infrastructure, reinforcing Nairobi&apos;s position as a
                  regional data centre hub.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {cableNames.map((cable) => (
                    <Badge
                      key={cable}
                      variant="outline"
                      className="rounded-md px-3 py-1 text-xs font-mono border-cyan/20 text-cyan bg-cyan/5"
                    >
                      <Cable className="size-3 mr-1.5" />
                      {cable}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
