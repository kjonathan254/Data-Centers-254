import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Link expired or invalid",
  description: "This subscription link has expired or is invalid.",
  robots: { index: false, follow: false },
};

export default function SubscribeInvalidPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/15 text-3xl" aria-hidden>
            !
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">This link has expired</h1>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            Subscription links are signed and expire after seven days for your
            security. Request a fresh one by subscribing again from the homepage -
            if you already started, we&apos;ll send a new confirmation email straight away.
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
