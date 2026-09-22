"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * Copy-to-clipboard for claim IDs (policy evidence records).
 * Clipboard API with a no-op fallback: copying must never break the page.
 */
export default function CopyButton({
  value,
  label = "Copy claim ID",
  className = "",
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable (permissions / http): silent, button is a nicety.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${label}: ${value}`}
      title={copied ? "Copied" : label}
      className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
        copied
          ? "border-emerald-500/40 text-emerald-400"
          : "border-slate-700/80 text-slate-400 hover:border-slate-500 hover:text-slate-200"
      } ${className}`}
    >
      {copied ? <Check className="size-3" aria-hidden="true" /> : <Copy className="size-3" aria-hidden="true" />}
      <span className="hidden sm:inline">{copied ? "Copied" : label}</span>
      <span className="sm:hidden">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
