import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Subscription confirmed",
  description: "Your subscription to The Rack Report briefing is confirmed.",
  robots: { index: false, follow: false },
};

export default function SubscribeVerifiedPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-sky-500/15 text-3xl" aria-hidden>
            ✓
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Subscription confirmed</h1>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            You&apos;re on the list for <strong className="text-white">The Rack Report</strong> -
            the weekly intelligence briefing on Kenya&apos;s data centres, connectivity,
            and power infrastructure. The next edition lands in your inbox.
          </p>
          <p className="mt-3 text-sm text-white/50">
            Every email carries a one-click unsubscribe link; using it erases your
            details from our records right away.
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
