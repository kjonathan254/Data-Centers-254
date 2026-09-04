"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { Bot, Send, Volume2, VolumeX, Square, ExternalLink, AlertTriangle } from "lucide-react";
import { BOT_IDENTITY, STARTER_QUESTIONS } from "@/lib/chatbot/identity";
import { speakAnswer, stopSpeaking, speechSupported } from "@/components/chat/speak";

/**
 * The shared chat experience — used by both the floating widget (panel) and
 * the /chat page (full). Plain, honest UI: typewriter reveal, citation chips,
 * suggested follow-ups, device-side voice.
 */

interface Citation {
  label: string;
  href: string;
}

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
  citations?: Citation[];
  suggestions?: string[];
  fallback?: string | null;
  shown?: string;
}

interface ApiReply {
  reply: string;
  citations: Citation[];
  suggestions: string[];
  intent: string;
  answered: boolean;
  fallback: string | null;
  error?: string;
}

let messageId = 0;

export function JibuAvatar({ className = "size-8" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`${className} inline-flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan to-cyan/60 text-background shadow-lg shadow-cyan/20`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-[58%]" aria-hidden="true">
        <path
          d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13l1.5-8Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function JibuChat({ variant }: { variant: "panel" | "page" }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: ++messageId,
      role: "bot",
      text: BOT_IDENTITY.greeting,
      suggestions: [...STARTER_QUESTIONS],
      shown: "",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const [offline, setOffline] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);

  // Typewriter reveal for the latest bot message (skipped for reduced motion).
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last || last.role !== "bot" || (last.shown && last.shown.length) || !last.text) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const full = last.text;
    if (reduced) {
      setMessages((m) => m.map((x, i) => (i === m.length - 1 ? { ...x, shown: full } : x)));
      if (voiceOn) void speakAnswer(full);
      return;
    }
    let i = 0;
    const step = Math.max(2, Math.round(full.length / 90));
    const timer = window.setInterval(() => {
      i = Math.min(i + step, full.length);
      const shown = full.slice(0, i);
      setMessages((m) => m.map((x, idx) => (idx === m.length - 1 ? { ...x, shown } : x)));
      if (i >= full.length) {
        window.clearInterval(timer);
        if (voiceOn) void speakAnswer(full);
      }
    }, 14);
    timersRef.current.push(timer);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  useEffect(() => () => timersRef.current.forEach((t) => window.clearInterval(t)), []);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    setOffline(!navigator.onLine);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim().slice(0, 500);
      if (!text || busy) return;
      stopSpeaking();
      setBusy(true);
      setInput("");

      const history = messages
        .filter((m) => m.text && (m.shown?.length === m.text.length || m.role === "user"))
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.text }));

      setMessages((m) => [...m, { id: ++messageId, role: "user", text }]);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, history }),
        });
        const data = (await res.json()) as ApiReply;
        setMessages((m) => [
          ...m,
          {
            id: ++messageId,
            role: "bot",
            text: data.error ?? data.reply,
            citations: data.error ? undefined : data.citations,
            suggestions: data.error ? undefined : data.suggestions,
            fallback: data.error ? "error" : data.fallback,
            shown: "",
          },
        ]);
        // Tier 4 "log & learn" — unanswered questions feed the editorial radar.
        if (typeof window !== "undefined") {
          const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
          gtag?.("event", "chatbot_question", {
            intent: data.intent ?? "unknown",
            answered: data.answered ?? false,
            fallback: data.fallback ?? "none",
          });
          track("chatbot_question", {
            intent: data.intent ?? "unknown",
            answered: data.answered ?? false,
            fallback: data.fallback ?? "none",
          });
        }
      } catch {
        setMessages((m) => [
          ...m,
          {
            id: ++messageId,
            role: "bot",
            text: "I lost that connection mid-thought — check your network and ask me again.",
            citations: undefined,
            suggestions: undefined,
            fallback: "error",
            shown: "",
          },
        ]);
      } finally {
        setBusy(false);
      }
    },
    [busy, messages, voiceOn],
  );

  const panelHeight = variant === "panel" ? "h-[min(560px,65dvh)]" : "h-[62dvh] sm:h-[60dvh]";

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border/50 px-4 py-3">
        <JibuAvatar />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">
            {BOT_IDENTITY.name} <span className="font-normal text-muted-foreground">· {BOT_IDENTITY.role}</span>
          </p>
          <p className="text-[11px] text-muted-foreground">
            {busy ? "Scanning the verified dataset…" : offline ? "Offline — reconnect to chat" : `Answers grounded in ${new Date().toLocaleDateString("en-KE", { month: "long", year: "numeric" })} verified data`}
          </p>
        </div>
        {speechSupported() && (
          <button
            type="button"
            onClick={() => {
              if (voiceOn) stopSpeaking();
              setVoiceOn(!voiceOn);
            }}
            aria-pressed={voiceOn}
            aria-label={voiceOn ? "Mute voice replies" : "Speak replies aloud"}
            className={`rounded-lg border p-2 transition-colors ${
              voiceOn
                ? "border-cyan/40 bg-cyan/10 text-cyan"
                : "border-border/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            {voiceOn ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          </button>
        )}
        {voiceOn && (
          <button
            type="button"
            onClick={stopSpeaking}
            aria-label="Stop speaking"
            className="rounded-lg border border-border/60 p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Square className="size-3.5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className={`min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 ${panelHeight}`}
        aria-live="polite"
        aria-label={`${BOT_IDENTITY.name} conversation`}
      >
        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="flex justify-end">
              <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-cyan px-3.5 py-2.5 text-sm leading-relaxed text-background">
                {m.text}
              </p>
            </div>
          ) : (
            <div key={m.id} className="flex items-start gap-2.5">
              <JibuAvatar className="mt-0.5 size-7" />
              <div className="min-w-0 max-w-[88%]">
                <p className="rounded-2xl rounded-bl-sm border border-border/50 bg-accent/40 px-3.5 py-2.5 text-sm leading-relaxed text-foreground/95">
                  {m.shown || ""}
                  {(!m.shown || m.shown.length < m.text.length) && (
                    <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse rounded-sm bg-cyan align-middle" aria-hidden="true" />
                  )}
                </p>
                {m.shown?.length === m.text.length && m.fallback && m.fallback !== "error" && (
                  <p className="mt-1.5 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-amber-500/90">
                    <AlertTriangle className="size-3" />
                    Outside the verified dataset — double-check before citing
                  </p>
                )}
                {m.shown?.length === m.text.length && m.citations && m.citations.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.citations.map((c) => (
                      <a
                        key={c.href + c.label}
                        href={c.href}
                        target={c.href.startsWith("/api") ? undefined : undefined}
                        className="inline-flex max-w-full items-center gap-1 rounded-full border border-cyan/25 bg-cyan/5 px-2.5 py-1 text-[11px] text-cyan transition-colors hover:bg-cyan/10"
                      >
                        <span className="truncate">{c.label}</span>
                        <ExternalLink className="size-3 shrink-0" />
                      </a>
                    ))}
                  </div>
                )}
                {m.shown?.length === m.text.length && m.suggestions && m.suggestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => void send(s)}
                        className="rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-cyan/40 hover:text-cyan"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ),
        )}
        {busy && (
          <div className="flex items-start gap-2.5" aria-hidden="true">
            <JibuAvatar className="mt-0.5 size-7" />
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-border/50 bg-accent/40 px-4 py-3">
              {[0, 150, 300].map((d) => (
                <span key={d} className="size-1.5 animate-bounce rounded-full bg-cyan/70" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="border-t border-border/50 p-3"
      >
        <div className="flex items-center gap-2">
          <span className="hidden shrink-0 sm:block"><Bot className="size-4 text-muted-foreground" /></span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={offline ? "You're offline…" : `Ask ${BOT_IDENTITY.name} anything data centres…`}
            disabled={busy || offline}
            maxLength={500}
            aria-label="Your question"
            className="h-10 min-w-0 flex-1 rounded-xl border border-border/50 bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-cyan/40 focus:outline-none focus:ring-1 focus:ring-cyan/20 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={busy || !input.trim() || offline}
            aria-label="Send question"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cyan text-background transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Send className="size-4" />
          </button>
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground/60">
          {BOT_IDENTITY.name} answers only from DC254&apos;s verified dataset and articles — every figure carries its source. No signup, no tracking of your messages.
        </p>
      </form>
    </div>
  );
}
