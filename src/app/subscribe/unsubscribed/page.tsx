import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Unsubscribed",
  description: "You have been unsubscribed from The Rack Report briefing.",
  robots: { index: false, follow: false },
};

export default function SubscribeUnsubscribedPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-3xl" aria-hidden>
            ✓
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">You&apos;re unsubscribed</h1>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            That&apos;s done - no further editions of <strong className="text-white">The Rack Report</strong> will
            be sent to that address. Your personal details (email, role, organisation)
            have been erased from our subscription records; only an anonymised
            placeholder remains so the same address is never counted twice.
          </p>
          <p className="mt-3 text-sm text-white/50">
            Changed your mind? You can subscribe again at any time from the homepage.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-lg bg-sky-500 px-6 py-3 text-sm font-semibold text-[#04121f] transition-colors hover:bg-sky-400"
          >
            Back to the directory
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
