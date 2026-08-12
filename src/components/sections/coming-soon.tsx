"use client";

import { motion } from "framer-motion";
import {
  CheckCircle,
  Database,
  MessageSquare,
  Briefcase,
  Mail,
  BarChart3,
  GraduationCap,
  CalendarDays,
  Code,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

/* ─── Data ────────────────────────────────────────────────────────────────── */

interface RoadmapItem {
  icon: LucideIcon;
  title: string;
  phase: string;
  phaseColor: "cyan" | "neon";
  description: string;
  isLive?: boolean;
}

const roadmapItems: RoadmapItem[] = [
  {
    icon: CheckCircle,
    title: "Kenya DC Directory",
    phase: "Phase 1",
    phaseColor: "cyan",
    description:
      "A searchable database of every data centre in Kenya and East Africa. Filter by location, capacity, tier rating, services offered, and connectivity. Every facility with verified data: operator, power, rack count, certifications, and expansion plans. Now live on this page.",
    isLive: true,
  },
  {
    icon: BarChart3,
    title: "Kenya DC Index & Reports",
    phase: "Phase 2",
    phaseColor: "cyan",
    description:
      "A quarterly-updated index tracking every measurable dimension of Kenya’s data centre ecosystem: facilities, capacity, operators, AI-readiness, power allocation, connectivity, investment, and jobs. Published alongside in-depth market reports with independent analysis.",
  },
  {
    icon: Code,
    title: "Infrastructure Database & API",
    phase: "Phase 2",
    phaseColor: "cyan",
    description:
      "Structured data on Kenya’s digital infrastructure, accessible via API. Designed for researchers, investors, and companies who need programmable access to facility data, connectivity maps, power infrastructure, and regulatory information. The asset that transforms this from a publication into an intelligence platform.",
  },
  {
    icon: Briefcase,
    title: "Job Board",
    phase: "Phase 3",
    phaseColor: "neon",
    description:
      "The go-to job board for data centre and digital infrastructure careers in Kenya. From entry-level technician roles to senior DC architect positions. Companies post jobs, candidates build infrastructure-specific profiles.",
  },
  {
    icon: GraduationCap,
    title: "Education Courses",
    phase: "Phase 3",
    phaseColor: "neon",
    description:
      "Online courses built specifically for the Kenyan context: Data Centres 101, Understanding Kenya’s Digital Infrastructure, DC Careers Starter, AI Infrastructure Fundamentals. Localised, accessible, and practical.",
  },
  {
    icon: CalendarDays,
    title: "Kenya Digital Infrastructure Forum",
    phase: "Phase 3",
    phaseColor: "neon",
    description:
      "An annual event bringing together operators, engineers, government, universities, investors, telecoms, energy companies, and students. Start online, eventually physical. The convening platform for Kenya’s digital infrastructure ecosystem.",
  },
  {
    icon: MessageSquare,
    title: "Community Forum",
    phase: "Phase 3",
    phaseColor: "neon",
    description:
      "Ask questions, share knowledge, connect with DC professionals and enthusiasts across Kenya and Africa. A community-driven knowledge base that grows with every contribution.",
  },
  {
    icon: Mail,
    title: "Newsletter & Weekly Digest",
    phase: "Phase 2",
    phaseColor: "cyan",
    description:
      "Weekly digest of the latest developments, investment news, policy changes, and original analysis. Plus in-depth reports on Kenya’s DC market. Delivered every Monday.",
  },
];

const phaseBadgeStyle: Record<string, string> = {
  cyan: "border-cyan/25 text-cyan bg-cyan/10",
  neon: "border-neon/25 text-neon bg-neon/10",
};

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

export default function ComingSoon() {
  return (
    <section id="roadmap" className="relative py-20 lg:py-28">
      {/* Background layers */}
      <div
        className="absolute inset-0 grid-bg-dense opacity-30"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_30%,oklch(0.75_0.18_155/5%),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_70%,oklch(0.78_0.14_195/4%),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* ── Section Header ── */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-14 lg:mb-18"
          {...fadeUp}
        >
          <span className="inline-block font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-cyan mb-4">
            ROADMAP
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            What We&apos;re{" "}
            <span className="text-gradient-cyan">Building</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            This landing page is Phase 1. Here is the full product vision for
            Kenya&apos;s independent digital infrastructure intelligence platform.
          </p>
        </motion.div>

        {/* ── Roadmap Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {roadmapItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.title} {...staggerFadeUp(i)}>
                <Card className="glass-card glass-card-hover rounded-xl overflow-hidden transition-colors duration-300 group h-full border-0 relative">
                  {/* Phase number accent */}
                  <div
                    className="absolute top-0 right-0 font-mono text-6xl sm:text-7xl font-bold text-cyan/[0.04] leading-none select-none pointer-events-none"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <CardContent className="relative z-10 p-5 sm:p-6 flex flex-col gap-4">
                    {/* Icon + Phase badge row */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center justify-center size-12 rounded-xl bg-cyan/10 text-cyan shrink-0 group-hover:bg-cyan/20 transition-colors duration-300">
                        <Icon className="size-6" />
                      </div>
                      <Badge
                        variant="outline"
                        className={`rounded-full px-3 py-1 text-xs font-medium ${item.isLive ? "border-neon/25 text-neon bg-neon/5" : phaseBadgeStyle[item.phaseColor]}`}
                      >
                        {item.isLive ? "LIVE" : item.phase}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h4 className="text-lg font-semibold text-foreground leading-snug">
                      {item.title}
                    </h4>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
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
