"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Anchor,
  Network,
  ArrowRightLeft,
  Globe,
  Building2,
  Radio,
  Landmark,
  CircleDot,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const subseaCables = [
  {
    icon: Network,
    title: "SEACOM",
    status: "Active",
    description:
      "The first private submarine cable to land in East Africa (2009). SEACOM connects South Africa, Mozambique, Tanzania, Kenya, and onward to Europe and India. It was instrumental in breaking the telecom monopoly on international bandwidth and dramatically lowering internet costs in Kenya.",
  },
  {
    icon: Anchor,
    title: "TEAMS",
    status: "Active",
    description:
      "The East African Marine System is owned by the Kenyan government and private investors. Landing in Mombasa in 2009 alongside SEACOM, it was Kenya's first dedicated government-backed undersea cable and marked a turning point for the country's internet connectivity.",
  },
  {
    icon: Globe,
    title: "EASSy",
    status: "Active",
    description:
      "The Eastern Africa Submarine Cable System runs along the East African coast from South Africa to Sudan, landing in Mombasa. It provides direct connectivity to over 20 coastal and landlocked African countries and is backed by a consortium of African and international telecom operators.",
  },
  {
    icon: ArrowRightLeft,
    title: "LION2",
    status: "Active",
    description:
      "The Lower Indian Ocean Network 2 connects Madagascar, Reunion, Mayotte, Mozambique, Kenya (Mombasa), and Tanzania. It provides additional redundancy and capacity on the East African coast, ensuring Kenya has multiple diverse routes to international networks.",
  },
  {
    icon: Radio,
    title: "DARE1",
    status: "Active",
    description:
      "The Djibouti Africa Regional Express 1 cable connects Djibouti to Mombasa and South Africa. Designed to provide redundancy and additional capacity to the East African coast, it strengthens Kenya's position as a regional connectivity hub.",
  },
  {
    icon: CircleDot,
    title: "PEACE",
    status: "Active",
    description:
      "The Pakistan and East Africa Connecting Europe cable lands in Mombasa and connects Kenya to Pakistan, Egypt, and Europe. It entered service in 2022 and adds a new eastward route, diversifying Kenya's international connectivity beyond the traditional European corridors.",
  },
];

const connectivityPlayers = [
  {
    icon: Building2,
    title: "Liquid Intelligent Technologies",
    description:
      "Africa's largest independent fibre network operator. Owned by Cassava Technologies. Operates extensive fibre backbone across Kenya and over 15 African countries. Also owns Africa Data Centres, making it a vertically integrated infrastructure player.",
  },
  {
    icon: Radio,
    title: "Safaricom",
    description:
      "Kenya's largest telecom operator, with extensive fibre and microwave backhaul networks. Owns the majority of Kenya's cell tower infrastructure. Safaricom's network carries M-Pesa, one of the world's most-used mobile money platforms, processing billions of transactions annually.",
  },
  {
    icon: Landmark,
    title: "Kenya Digital Acceleration Programme",
    description:
      "A government-backed initiative to expand broadband connectivity to underserved areas. Aims to extend fibre to all county headquarters and improve last-mile connectivity. Kenya's fibre penetration has grown significantly but remains uneven between urban and rural areas.",
  },
];

export default function Connectivity() {
  return (
    <section id="connectivity" className="relative py-20 lg:py-28">
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
            Connectivity
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            The Cables That Connect Kenya{" "}
            <span className="text-gradient-cyan">to the World</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            From undersea cables in Mombasa to fibre lines criss-crossing
            Nairobi, connectivity is the layer that makes everything possible.
          </p>
        </motion.div>

        {/* ── Banner Image ── */}
        <motion.div
          className="mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative rounded-xl overflow-hidden border border-border aspect-video bg-surface">
            <Image
              src="/images/dc-networking.webp"
              alt="Fibre optic networking infrastructure"
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
          <p className="mt-3 text-sm text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
            Fibre optic cables are the arteries of Kenya&apos;s digital
            infrastructure. Thousands of kilometres of cable connect data
            centres, cell towers, and businesses across the country.
          </p>
        </motion.div>

        {/* ── Part 1: Subsea Cables Landing in Mombasa ── */}
        <motion.div
          className="mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 text-center">
            Kenya&apos;s Gateway to the{" "}
            <span className="text-gradient-cyan">Global Internet</span>
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            Six major subsea cable systems land in Mombasa, carrying
            Kenya&apos;s data to every corner of the world. A seventh
            cable, Meta's Daraja, is in development.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {subseaCables.map((cable, i) => {
              const Icon = cable.icon;
              return (
                <motion.div
                  key={cable.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Card className="glass-card glass-card-hover border-border/50 h-full transition-colors duration-300 group">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex items-start gap-3.5">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-cyan/10 text-cyan shrink-0 group-hover:bg-cyan/20 transition-colors duration-300">
                          <Icon className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-base font-semibold text-foreground">
                              {cable.title}
                            </h4>
                            <Badge
                              variant="outline"
                              className="rounded-full px-2 py-0 text-[11px] font-medium border-cyan/20 text-cyan shrink-0"
                            >
                              {cable.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {cable.description}
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

        {/* ── Part 2: KIXP Highlight Card ── */}
        <motion.div
          className="mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="glass-card rounded-2xl p-6 sm:p-8 lg:p-10 border border-cyan/20 relative overflow-hidden">
            <div
              className="absolute -top-20 -right-20 w-40 h-40 bg-cyan/5 rounded-full blur-3xl"
              aria-hidden="true"
            />
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-cyan/5 rounded-full blur-3xl" aria-hidden="true" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center size-10 rounded-lg bg-cyan/10 text-cyan glow-cyan-sm">
                  <CircleDot className="size-5" />
                </div>
                <div>
                  <Badge
                    variant="outline"
                    className="rounded-full px-3 py-1 text-xs font-medium border-cyan/20 text-cyan mb-1"
                  >
                    Internet Exchange Point
                  </Badge>
                  <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                    What is KIXP?
                  </h3>
                </div>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                The Kenya Internet Exchange Point (KIXP) is a facility where
                internet service providers, content providers, and network
                operators interconnect their networks directly. Without KIXP, a
                Nairobi user accessing a Kenyan website might have to route
                their traffic through Europe and back -- adding hundreds of
                milliseconds of latency. With KIXP, that traffic stays in
                Nairobi, making local services faster and cheaper. KIXP is one
                of the most important pieces of internet infrastructure that most
                Kenyans have never heard of. It&apos;s operated by the
                Telecommunications Service Providers Association of Kenya
                (TESPOK).
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Part 3: Key Connectivity Players ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 text-center">
            Key{" "}
            <span className="text-cyan">Connectivity Players</span>
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            The organisations building and operating the networks that keep
            Kenya connected.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {connectivityPlayers.map((player, i) => {
              const Icon = player.icon;
              return (
                <motion.div
                  key={player.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
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
                            {player.title}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {player.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/internet"
              className="inline-flex items-center gap-2 text-sm font-medium text-cyan hover:text-cyan/80 transition-colors"
            >
              Read the full connectivity guides
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
