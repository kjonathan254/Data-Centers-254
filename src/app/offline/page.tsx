import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff, Home, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "You're offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-24">
      <div className="relative z-10 max-w-lg w-full text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl border border-border/50 bg-surface">
          <WifiOff className="size-7 text-cyan" aria-hidden />
        </div>

        <span className="text-section-label">Offline</span>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-3 mb-4">
          You&apos;re offline
        </h1>

        <p className="text-muted-foreground leading-relaxed mb-3">
          No connection right now. Any page you&apos;ve already visited on
          DC254 stays readable from your device&apos;s cache — articles,
          directory entries and maps you&apos;ve loaded before are still
          there.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Reconnect and reload to pick up the latest research and data.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-cyan/30 bg-cyan/10 px-4 py-2 text-sm font-medium text-cyan transition-colors hover:bg-cyan/20"
          >
            <Home className="size-4" aria-hidden />
            Back to Home
          </Link>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 rounded-lg border border-border/50 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-cyan/30 hover:text-cyan"
          >
            <BookOpen className="size-4" aria-hidden />
            Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
