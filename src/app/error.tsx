"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[DC254 Error Boundary]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <p className="text-[11px] font-mono uppercase tracking-widest text-cyan/50 mb-6">
          Something went wrong
        </p>
        <h1 className="text-2xl font-bold text-foreground mb-3">
          We hit an unexpected error.
        </h1>
        {/* DEBUG: show error message temporarily */}
        <pre className="text-xs text-left text-red-400 bg-red-950/30 rounded-lg p-4 mb-6 overflow-auto max-h-40 border border-red-900/50">
          {error.message}
          {error.digest && `\n[digest: ${error.digest}]`}
        </pre>
        <p className="text-sm text-muted-foreground mb-8">
          This has been logged. You can try again or head back to the homepage.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="bg-cyan text-background font-semibold text-sm rounded-lg h-10 px-5 hover:bg-cyan/90 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border border-border/60 text-foreground font-medium text-sm rounded-lg h-10 px-5 inline-flex items-center hover:border-cyan/30 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
