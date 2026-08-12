"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  DollarSign,
  Building2,
  TrendingUp,
  MapPin,
  BarChart3,
  ArrowRightLeft,
  Calculator,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const nairobiAdvantages = [
  {
    icon: MapPin,
    title: "Strategic Location",
    description:
      "Nairobi is the financial and technology hub of East Africa, serving a market of over 300 million people across Kenya, Uganda, Tanzania, Rwanda, Ethiopia, and the DRC. Its geographic position and time zone make it suitable for serving both African and European workloads. Jomo Kenyatta International Airport provides direct cargo and passenger connections to major global tech hubs.",
  },
  {
    icon: TrendingUp,
    title: "Proven Market Growth",
    description:
      "Africa's data centre market is valued at $3.49 billion (2024) and growing at 15.76% CAGR through 2031. Kenya is consistently ranked among the top 3 DC markets in Africa alongside South Africa and Nigeria. The World Bank, Oracle, Microsoft, and G42 have all identified Kenya as a strategic investment destination. iXAfrica's rapid expansion (4.5MW operational, 18MW under construction, 53MW planned) demonstrates commercial viability.",
  },
  {
    icon: ArrowRightLeft,
    title: "Connectivity Convergence",
    description:
      "Four subsea cables land in Mombasa (SEA-ME-WE 5, EASSy, DARE1, TEAMS), multiple fibre operators compete nationally (Liquid, Safaricom, Jamii Telecom), and KIXP keeps local traffic local. This connectivity density is unusual for East Africa and reduces the cost and latency advantages that might otherwise favour Johannesburg or Lagos.",
  },
];

const businessModels = [
  {
    icon: Building2,
    title: "Colocation",
    description:
      "The most common model in Kenya today. A data centre operator provides the physical space, power, cooling, security, and connectivity. The customer brings their own servers and equipment. Pricing is typically per rack per month, with additional charges for power consumption above a base allocation. This is what iXAfrica, Africa Data Centres, and PAIX offer. Retail colocation serves smaller customers (1-10 racks). Wholesale colocation serves large enterprises and cloud providers (100+ racks).",
    badge: "Primary Model",
  },
  {
    icon: DollarSign,
    title: "Hyperscale / Cloud",
    description:
      "Technology giants (Microsoft, Google, Oracle, AWS) build or lease massive facilities designed specifically for their cloud platforms. These are the largest investments -- often $100 million to $1 billion+ for a single site. The Microsoft-G42 $1 billion project is the most prominent example. Oracle's January 2026 cloud region at iXAfrica shows the colocation-hyperscale hybrid model: Oracle doesn't own the building, but it delivers cloud services from within iXAfrica's facility.",
    badge: "Emerging",
  },
  {
    icon: BarChart3,
    title: "Edge / Telecommunications",
    description:
      "Safaricom's Limuru data centre represents the telco-driven model: build facilities to support your own network and services first, then offer excess capacity to the market. Edge data centres -- smaller facilities in secondary cities like Kisumu, Mombasa, or Eldoret -- could serve local demand with lower latency. This model is at an earlier stage in Kenya but is being actively discussed.",
    badge: "Early Stage",
  },
];

const costInsights = [
  {
    icon: Calculator,
    title: "What Does It Cost to Build a Data Centre?",
    description:
      "Construction costs for a modern Tier 3 data centre in Kenya typically range from $8-15 million per megawatt of IT capacity, depending on specification, location, and whether the facility is purpose-built or retrofitted. A 10MW facility could cost $80-150 million. The Microsoft-G42 project was announced at $1 billion for a 100MW initial phase -- approximately $10 million per MW, reflecting the premium cost of hyperscale AI-ready design. These are estimate ranges based on industry benchmarks, not proprietary financial data.",
  },
  {
    icon: DollarSign,
    title: "How Do Data Centres Make Money?",
    description:
      "Revenue comes primarily from recurring contracts: rack space rental (KES 50,000-200,000+ per rack per month depending on power allocation and tier), power charges (per kWh above base allocation), cross-connect fees (for connecting to specific networks or cloud providers), managed services, and value-added services like backup and disaster recovery. A well-utilised facility can achieve strong operating margins, but the upfront capital investment is enormous and payback periods typically range from 7-12 years.",
  },
  {
    icon: TrendingUp,
    title: "What Makes a Location Attractive?",
    description:
      "The key factors are: reliable and affordable power (Kenya scores well on renewable energy but poorly on industrial tariff costs), fibre connectivity (Kenya is strong due to subsea cables and competitive fibre market), proximity to customers (Nairobi is the regional hub), favourable regulation (Kenya's Data Protection Act drives local data hosting demand), and political stability. The main constraint -- as the Microsoft-G42 delay demonstrated -- is securing sufficient dedicated power for large facilities.",
  },
];

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

export default function BusinessInvestment() {
  return (
    <section id="business" className="relative py-20 lg:py-28">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_20%,oklch(0.78_0.14_195/4%),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
          {...fadeUp}
        >
          <span className="inline-block font-mono text-xs sm:text-sm tracking-widest text-cyan mb-4 uppercase">
            BUSINESS & INVESTMENT
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            The Economics Behind{" "}
            <span className="text-gradient-cyan">Every Rack</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Data centres are expensive to build but potentially very profitable
            to operate. Understanding the business model is essential for
            investors, entrepreneurs, and anyone who wants to know why this
            industry matters to Kenya&apos;s economy.
          </p>
        </motion.div>

        {/* Banner Image */}
        <motion.div
          className="mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative rounded-xl overflow-hidden border border-border aspect-video bg-surface">
            <Image
              src="/images/dc-business-investment.png"
              alt="Nairobi business district and commercial real estate"
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
          <p className="mt-3 text-sm text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
            Nairobi&apos;s position as East Africa&apos;s financial hub makes
            it a natural location for data centre investment -- but power
            constraints and regulatory gaps mean not every project succeeds.
          </p>
        </motion.div>

        {/* Part 1: Why Nairobi? */}
        <motion.div className="mb-16 lg:mb-20" {...fadeUp}>
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 text-center">
            Why{" "}
            <span className="text-gradient-cyan">Nairobi?</span>
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            What makes Nairobi one of Africa&apos;s top 3 data centre markets --
            and what could make it number one.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {nairobiAdvantages.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} {...staggerFadeUp(i)}>
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

        {/* Part 2: Business Models */}
        <motion.div className="mb-16 lg:mb-20" {...fadeUp}>
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 text-center">
            How the <span className="text-cyan">Business Works</span>
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            Three distinct business models drive data centre investment in Kenya.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {businessModels.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} {...staggerFadeUp(i)}>
                  <Card className="glass-card glass-card-hover border-border/50 h-full transition-colors duration-300 group">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex items-start gap-3.5">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-cyan/10 text-cyan shrink-0 group-hover:bg-cyan/20 transition-colors duration-300">
                          <Icon className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h4 className="text-base font-semibold text-foreground">
                              {item.title}
                            </h4>
                          </div>
                          <Badge
                            variant="outline"
                            className="rounded-full px-2.5 py-0 text-[11px] font-medium border-neon/25 text-neon bg-neon/5 mb-3 inline-block"
                          >
                            {item.badge}
                          </Badge>
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

        {/* Part 3: What Nobody Tells You - The Real Economics */}
        <motion.div className="mb-16 lg:mb-20" {...fadeUp}>
          <div className="glass-card rounded-2xl p-6 sm:p-8 lg:p-10 border-l-4 border-l-cyan relative overflow-hidden">
            <div
              className="absolute -top-20 -right-20 w-40 h-40 bg-cyan/5 rounded-full blur-3xl"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <Badge
                variant="outline"
                className="mb-4 rounded-full px-3 py-1 text-xs font-medium border-neon/25 text-neon bg-neon/5"
              >
                What Nobody Tells You
              </Badge>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">
                The Real Economics of Kenyan Data Centres
              </h3>
              <div className="space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <p>
                  A 100MW data centre would consume more electricity than many
                  Kenyan towns. The Microsoft-G42 project planned to draw 100MW
                  from the Olkaria geothermal field -- roughly 4% of Kenya&apos;s
                  entire installed geothermal capacity. When that allocation
                  could not be secured, the $1 billion project stalled. This
                  tells you something critical: in Kenya, the primary constraint
                  on data centre investment is not land, not demand, and not
                  regulation. It is power.
                </p>
                <p>
                  Kenya&apos;s industrial electricity tariff (KES 15-25/kWh) is
                  significantly higher than the global average for data centre
                  markets. In the United States, large data centres routinely
                  secure power at $0.04-0.08/kWh. In Kenya, even with
                  geothermal energy, the delivered cost to a data centre
                  customer is often 2-4 times higher. This directly affects rack
                  pricing, profitability, and Kenya&apos;s competitiveness
                  against markets like South Africa, Egypt, or Nigeria.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Part 4: Cost Questions Answered */}
        <motion.div {...fadeUp}>
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 text-center">
            Questions Every Investor <span className="text-cyan">Asks</span>
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            The most common questions about data centre economics in Kenya --
            answered with publicly available data.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {costInsights.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} {...staggerFadeUp(i)}>
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
      </div>
    </section>
  );
}
