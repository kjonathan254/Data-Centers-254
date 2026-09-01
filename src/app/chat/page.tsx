import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap, GitCompareArrows, HardHat, Radio, Leaf, BookOpen, ShieldCheck, ArrowRight,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import JibuChat from "@/components/chat/jibu-chat";
import { BOT_IDENTITY } from "@/lib/chatbot/identity";

/**
 * Jibu's home — the full-page chat experience. The floating widget is the
 * everywhere-entry; this page is the destination for "meet the bot", with
 * capability cards that double as one-tap questions.
 */

export const metadata: Metadata = {
  title: `Ask ${BOT_IDENTITY.name} — Kenya's Data Centre Answer Engine | Data Centre 254`,
  description: `${BOT_IDENTITY.name} answers questions about Kenya's data centre market from DC254's verified dataset — capacity, operators, comparisons, submarine cables, AI readiness and green power. Every figure sourced and dated.`,
  alternates: { canonical: "/chat" },
  openGraph: {
    title: `Ask ${BOT_IDENTITY.name} — the DC254 answer engine`,
    description:
      "Ask anything about Kenya's data centre market and get answers from the verified dataset — sources attached.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
    images: [{ url: "/images/africa-dc-map.webp", width: 1200, height: 675, alt: `${BOT_IDENTITY.name} — the DC254 answer engine` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Ask ${BOT_IDENTITY.name} — the DC254 answer engine`,
    description: "Answers from the verified DC254 dataset — sources attached.",
    images: ["/images/africa-dc-map.webp"],
  },
};

const CAPABILITIES = [
  { icon: Zap, label: "Capacity & supply", q: "How much capacity does Kenya have in total?" },
  { icon: GitCompareArrows, label: "Head-to-head comparisons", q: "Compare iXAfrica NBOX1 and ADC Nairobi 1" },
  { icon: HardHat, label: "Pipeline tracking", q: "What's under construction right now?" },
  { icon: Radio, label: "Submarine cables", q: "Which submarine cables connect Kenya?" },
  { icon: Leaf, label: "Green power", q: "What powers Kenya's data centres?" },
  { icon: BookOpen, label: "Jargon, decoded", q: "What does Tier III mean?" },
];

export default function ChatPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 lg:py-14">
        <div className="container-site">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12">
            {/* Intro column */}
            <div className="lg:col-span-2">
              <span className="eyebrow">Meet {BOT_IDENTITY.name}</span>
              <h1 className="h-display mt-3 text-foreground">
                Kenya&apos;s data centre market, on call.
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {BOT_IDENTITY.name} — {BOT_IDENTITY.meaning.toLowerCase()[0].toUpperCase() + BOT_IDENTITY.meaning.slice(1).toLowerCase()} —
                answers from the same verified dataset this site publishes, not
                from model memory. Every figure arrives with its source and its
                verification date; when something isn&apos;t tracked, the bot says
                so instead of improvising.
              </p>

              <div className="mt-6 flex items-start gap-3 rounded-xl border border-neon/25 bg-neon/5 p-4">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-neon" />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">The house rule:</strong> if a
                  number can&apos;t be verified, {BOT_IDENTITY.name} won&apos;t say it. That
                  is the same standard every directory row and article on DC254 is
                  held to — see{" "}
                  <Link href="/methodology" className="text-cyan underline underline-offset-2 hover:text-foreground">
                    the methodology
                  </Link>
                  .
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {CAPABILITIES.map((c) => (
                  <div
                    key={c.label}
                    className="card-solid rounded-xl p-3.5 text-left"
                  >
                    <c.icon className="size-4 text-cyan" />
                    <p className="mt-2 text-sm font-medium text-foreground">{c.label}</p>
                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                      Try: &ldquo;{c.q}&rdquo;
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground">
                Want the numbers without asking?
                <Link href="/tracker" className="inline-flex items-center gap-1 text-cyan underline underline-offset-2 hover:text-foreground">
                  The tracker <ArrowRight className="size-3" />
                </Link>
              </p>
            </div>

            {/* Chat column */}
            <div className="lg:col-span-3">
              <div className="card-solid h-[72dvh] min-h-[480px] overflow-hidden rounded-2xl border-border/60">
                <JibuChat variant="page" />
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/60">
                {BOT_IDENTITY.name} is grounded in DC254&apos;s published corpus —
                articles, directory and glossary — and links its sources on every
                answer. Voice playback uses your device&apos;s built-in speech engine;
                no audio leaves your browser.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
