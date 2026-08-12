"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Scale,
  Shield,
  FileText,
  Globe,
  Lock,
  Landmark,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const regulations = [
  {
    icon: Shield,
    title: "Kenya Data Protection Act (2019)",
    description:
      "Kenya's primary data protection legislation, modelled partly on the EU's GDPR. It establishes the Office of the Data Protection Commissioner (ODPC), defines lawful bases for processing personal data, and grants Kenyans rights over their personal information. For data centres, this is foundational -- any facility hosting Kenyan citizen data must ensure compliance with data handling, storage, and breach notification requirements. The Act applies to any entity processing personal data in Kenya, regardless of where the entity is based.",
    badge: "Enacted",
  },
  {
    icon: Lock,
    title: "Data Localisation & Sovereignty",
    description:
      "The Data Protection Act contains provisions that favour processing personal data within Kenya's borders. While not a strict data localisation mandate (the ODPC can authorise cross-border transfers), the regulatory direction is clear: the government wants Kenyan data on Kenyan soil. This is one of the strongest drivers of data centre investment in the country. The iXAfrica-Oracle Cloud Region launched in January 2026 is a direct response to this demand -- Kenyan companies can now keep workloads local. The question of where TikTok, WhatsApp, and Google store Kenyan users' data remains a live policy issue.",
    badge: "Active",
  },
  {
    icon: Globe,
    title: "Cross-Border Data Transfers",
    description:
      "Under the DPA, personal data can only be transferred outside Kenya if the recipient country has adequate data protection laws, or if specific contractual safeguards are in place. This matters for every cloud service used by Kenyan organisations. When a Kenyan bank runs its core banking on a server in South Africa or Europe, that cross-border transfer must comply with the DPA. Data centres in Kenya eliminate this friction entirely, which is why they are strategically important beyond just the technology.",
    badge: "Evolving",
  },
  {
    icon: FileText,
    title: "National Cloud Policy (In Development)",
    description:
      "The Kenyan government is developing a National Cloud Policy to accelerate public-sector cloud adoption. This would mandate or strongly encourage government agencies to use Kenyan-based cloud infrastructure for sensitive data. For data centre operators, this is potentially transformative -- government demand alone could sustain multiple large facilities. The policy aligns with broader East African Community (EAC) digital integration efforts and the African Union's Digital Transformation Strategy.",
    badge: "In Development",
  },
  {
    icon: Landmark,
    title: "AI Regulation & Strategy",
    description:
      "Kenya's National AI Strategy is under development as of 2026, positioning the country as an early mover on AI governance in Africa. The strategy is expected to address AI safety, ethics, workforce implications, and the infrastructure requirements for AI development. Combined with the World Bank's May 2026 initiative backing data infrastructure for AI readiness across Africa, Kenya is signalling that it intends to be a rules-maker, not just a rules-taker, in African AI policy. For data centres, this means AI-specific power, cooling, and connectivity standards may emerge.",
    badge: "In Development",
  },
  {
    icon: AlertCircle,
    title: "Environmental & Energy Regulation",
    description:
      "Data centres in Kenya are subject to environmental impact assessment (EIA) requirements under the Environmental Management and Coordination Act. Facilities above certain power thresholds require NEMA (National Environment Management Authority) approval. As data centres grow larger and more numerous, questions about water usage, diesel generator emissions, noise, and electronic waste disposal will increasingly come under regulatory scrutiny. The gap between existing environmental regulations and the specific needs of large-scale data centres is a policy area to watch.",
    badge: "Active but Gaps Exist",
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

export default function PolicyRegulation() {
  return (
    <section id="policy" className="relative py-20 lg:py-28">
      {/* Background layers */}
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
            POLICY & REGULATION
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            The Rules That Shape{" "}
            <span className="text-gradient-cyan">Kenya&apos;s Digital Infrastructure</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Data centres don&apos;t exist in a vacuum. Kenya&apos;s laws,
            policies, and regulatory frameworks determine where data can go, who
            can build, and what happens when things go wrong.
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
              src="/images/dc-policy-regulation.png"
              alt="Government and regulatory buildings in Nairobi, Kenya"
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
          <p className="mt-3 text-sm text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
            Kenya&apos;s regulatory environment is evolving rapidly. The Data
            Protection Act, National Cloud Policy, and AI Strategy will shape the
            next decade of digital infrastructure investment.
          </p>
        </motion.div>

        {/* Part 1: What Nobody Tells You - Data Sovereignty */}
        <motion.div
          className="mb-16 lg:mb-20"
          {...fadeUp}
        >
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
                Where Does Kenyan Data Actually Travel?
              </h3>
              <div className="space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <p>
                  When you send a WhatsApp message from Nairobi, the default
                  route takes your data to Meta&apos;s servers -- likely in
                  South Africa, Europe, or the United States. When you use
                  TikTok, your data passes through systems controlled by
                  ByteDance. When a Kenyan startup uses AWS, their data
                  processes in Cape Town or Frankfurt. When a government
                  agency uses Microsoft 365, emails and documents may traverse
                  multiple countries before returning.
                </p>
                <p>
                  Kenya&apos;s Data Protection Act gives the ODPC authority to
                  regulate these flows. But enforcement capacity is still
                  developing, and many Kenyans have no idea their data leaves
                  the country at all. This is the data sovereignty gap -- and
                  it is one of the strongest arguments for building more data
                  centres in Kenya. The Oracle Cloud Region at iXAfrica
                  (January 2026) was a direct response. More are needed.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Part 2: The Regulatory Landscape */}
        <motion.div {...fadeUp}>
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 text-center">
            Kenya&apos;s{" "}
            <span className="text-cyan">Regulatory Landscape</span>
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            The laws, policies, and frameworks that govern digital
            infrastructure in Kenya -- and what they mean for data centres,
            cloud providers, and citizens.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {regulations.map((reg, i) => {
              const Icon = reg.icon;
              return (
                <motion.div key={reg.title} {...staggerFadeUp(i)}>
                  <Card className="glass-card glass-card-hover border-border/50 h-full transition-colors duration-300 group">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex items-start gap-3.5">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-cyan/10 text-cyan shrink-0 group-hover:bg-cyan/20 transition-colors duration-300">
                          <Icon className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h4 className="text-base font-semibold text-foreground">
                              {reg.title}
                            </h4>
                          </div>
                          <Badge
                            variant="outline"
                            className="rounded-full px-2.5 py-0 text-[11px] font-medium border-cyan/20 text-cyan mb-3 inline-block"
                          >
                            {reg.badge}
                          </Badge>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {reg.description}
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
