"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

/** Copies the current comparison URL to the clipboard for sharing. */
export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (permissions / insecure context) — no-op.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-accent/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-cyan/40 hover:text-cyan"
      aria-live="polite"
    >
      {copied ? <Check className="size-3.5 text-neon" /> : <Link2 className="size-3.5" />}
      {copied ? "Link copied" : "Copy share link"}
    </button>
  );
}
