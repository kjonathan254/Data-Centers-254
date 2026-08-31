"use client";

/**
 * ListenBar — device-side text-to-speech for DC254 articles.
 *
 * Approach: the browser's built-in Web Speech API. No audio files to host or
 * regenerate when an article changes, near-zero data cost for readers on
 * metered mobile plans, and every article (current + future) is covered
 * automatically. Speech is synthesised one block at a time (paragraph /
 * heading / table row / caption) with a follow-along highlight, speed
 * control and voice picker. Gracefully renders nothing on devices that
 * don't support the API or have no English voices.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Headphones, Pause, Play, Square } from "lucide-react";

type ListenStatus = "idle" | "playing" | "paused";

interface SpeechBlock {
  el: HTMLElement;
  text: string;
  words: number;
}

interface Props {
  /** DOM id of the container whose text should be read (the article body). */
  targetId: string;
  /** Article slug, used for the GA4 listen_start event. */
  slug: string;
}

const RATES = [0.75, 1, 1.25, 1.5, 2];
const WPM = 155; // approximate narration speed, for duration estimates
const LS_VOICE = "dc254-listen-voice";
const LS_RATE = "dc254-listen-rate";

// Never-changing store — just lets useSyncExternalStore do client-only
// feature detection without hydration mismatches or effect setState calls.
const subscribeNoop = () => () => {};

// Light text normalisation so figures and abbreviations read naturally.
function cleanSpeechText(raw: string): string {
  return raw
    .replace(/\s+/g, " ")
    .replace(/KES\s*\/\s*month/gi, "Kenyan shillings per month")
    .replace(/\bKES\b/g, "Kenyan shillings")
    .replace(/\bUSD\b/gi, "US dollars")
    .replace(/US\$/g, "US dollars ")
    .replace(/\be\.g\.,?/gi, "for example,")
    .replace(/\bi\.e\.,?/gi, "that is,")
    .trim();
}

// Build the utterance text for a single block element.
function blockText(el: HTMLElement): string {
  const tag = el.tagName;
  if (tag === "TR") {
    const cells = Array.from(el.children)
      .map((c) => (c.textContent || "").replace(/\s+/g, " ").trim())
      .filter(Boolean);
    return cells.join(", ");
  }
  const raw = el.textContent || "";
  if (tag === "H2" || tag === "H3" || tag === "H4") return `Section: ${raw}`;
  if (tag === "FIGCAPTION") return `Caption: ${raw}`;
  return raw;
}

// Collect readable blocks from the article body, in document order.
function collectBlocks(root: HTMLElement): SpeechBlock[] {
  const blocks: SpeechBlock[] = [];
  const els = root.querySelectorAll<HTMLElement>(
    "h2, h3, h4, p, li, tr, figcaption"
  );
  els.forEach((el) => {
    if (el.closest("pre")) return; // never read code blocks
    // Table-cell paragraphs are covered by their <tr>; list paragraphs by
    // their <li> (loose lists render li > p).
    if (el.tagName === "P" && (el.closest("li") || el.closest("td") || el.closest("th"))) return;
    if (el.tagName === "LI" && el.querySelector("p")) return;
    const cleaned = cleanSpeechText(blockText(el));
    if (cleaned.length < 2) return;
    blocks.push({ el, text: cleaned, words: cleaned.split(/\s+/).length });
  });
  return blocks;
}

// Rank available English voices — en-GB preferred (closest to Kenyan
// English), then high-quality neural voices, then anything else.
function scoreVoice(v: SpeechSynthesisVoice): number {
  const n = v.name.toLowerCase();
  const lang = v.lang.toLowerCase();
  if (n.includes("google uk english female")) return 0;
  if (n.includes("google uk english male")) return 1;
  if (n.includes("natural") && lang.startsWith("en-gb")) return 2;
  if (n.includes("natural")) return 3;
  if (n.includes("google uk english")) return 4;
  if (lang === "en-gb") return 5;
  if (lang === "en-us") return 6;
  return 7;
}

export default function ListenBar({ targetId, slug }: Props) {
  // Client-only feature detection. React uses the server snapshot during
  // hydration, then re-checks — no mismatch, no effect setState.
  const supported = useSyncExternalStore(
    subscribeNoop,
    () => typeof window !== "undefined" && "speechSynthesis" in window,
    () => false
  );
  const [total, setTotal] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [wordCounts, setWordCounts] = useState<number[]>([]);
  const [status, setStatus] = useState<ListenStatus>("idle");
  const [idx, setIdx] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState("");
  const [rate, setRate] = useState(1);

  const blocksRef = useRef<SpeechBlock[] | null>(null);
  const tokenRef = useRef(0);
  const watchdogRef = useRef<number | null>(null);
  const highlightRef = useRef<HTMLElement | null>(null);
  const idxRef = useRef(0);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const rateRef = useRef(1);
  // Latest-ref bridge so utterance callbacks can recurse into speakFrom
  // without the hook lint rule seeing a use-before-declaration.
  const speakFromRef = useRef<(i: number) => void>(() => {});

  // Restore the saved playback speed (async callback context), and cancel
  // any ongoing speech + timers when the article page unmounts.
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const stored = parseFloat(window.localStorage.getItem(LS_RATE) || "");
        if (RATES.includes(stored)) {
          setRate(stored);
          rateRef.current = stored;
        }
      } catch {
        /* private browsing */
      }
    });
    return () => {
      cancelled = true;
      tokenRef.current += 1;
      if (watchdogRef.current) window.clearTimeout(watchdogRef.current);
      try {
        window.speechSynthesis?.cancel();
      } catch {
        /* noop */
      }
      highlightRef.current?.classList.remove("dc-speaking");
      highlightRef.current = null;
    };
  }, []);

  // Index the article body once it is in the DOM. State updates run in a
  // microtask so renders don't cascade synchronously inside the effect.
  useEffect(() => {
    if (!supported) return;
    const root = document.getElementById(targetId);
    if (!root) return;
    const blocks = collectBlocks(root);
    blocksRef.current = blocks;
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setTotal(blocks.length);
      setTotalWords(blocks.reduce((a, b) => a + b.words, 0));
      setWordCounts(blocks.map((b) => b.words));
    });
    return () => {
      cancelled = true;
    };
  }, [supported, targetId]);

  // Load English voices (async on most platforms; poll a few times because
  // some browsers never fire voiceschanged) and pick the default narrator
  // (stored choice first, then best-ranked) inside the same callback.
  useEffect(() => {
    if (!supported) return;
    let tries = 0;
    let timer = 0;
    let cancelled = false;
    const apply = (en: SpeechSynthesisVoice[]) => {
      if (cancelled || en.length === 0) return;
      setVoices(en);
      let stored: string | null = null;
      try {
        stored = window.localStorage.getItem(LS_VOICE);
      } catch {
        /* private browsing */
      }
      const pick =
        (stored ? en.find((v) => v.voiceURI === stored) : undefined) ??
        [...en].sort(
          (a, b) => scoreVoice(a) - scoreVoice(b) || a.name.localeCompare(b.name)
        )[0];
      voiceRef.current = pick;
      setVoiceURI(pick.voiceURI);
    };
    const load = () => {
      if (cancelled) return;
      const en = window.speechSynthesis
        .getVoices()
        .filter((v) => v.lang.toLowerCase().startsWith("en"));
      if (en.length > 0) {
        apply(en);
        return;
      }
      if (tries < 8) {
        tries += 1;
        timer = window.setTimeout(load, 400);
      }
    };
    timer = window.setTimeout(load, 0);
    window.speechSynthesis.addEventListener?.("voiceschanged", load);
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
      window.speechSynthesis.removeEventListener?.("voiceschanged", load);
    };
  }, [supported]);

  // Keepalive — desktop Chrome silently stops long synthesis sessions;
  // a periodic pause/resume keeps the engine alive (standard workaround).
  useEffect(() => {
    if (status !== "playing") return;
    const id = window.setInterval(() => {
      try {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      } catch {
        /* noop */
      }
    }, 12000);
    return () => window.clearInterval(id);
  }, [status]);

  const clearHighlight = useCallback(() => {
    highlightRef.current?.classList.remove("dc-speaking");
    highlightRef.current = null;
  }, []);

  const clearWatchdog = useCallback(() => {
    if (watchdogRef.current) {
      window.clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
  }, []);

  const highlight = useCallback((i: number) => {
    clearHighlight();
    const el = blocksRef.current?.[i]?.el;
    if (!el) return;
    el.classList.add("dc-speaking");
    highlightRef.current = el;
    // Only scroll when the block being read is off-screen — don't yank the
    // reader around while they follow along.
    const r = el.getBoundingClientRect();
    if (r.top < 0 || r.bottom > window.innerHeight) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    }
  }, [clearHighlight]);

  const stopPlayback = useCallback(() => {
    tokenRef.current += 1;
    clearWatchdog();
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* noop */
    }
    clearHighlight();
    idxRef.current = 0;
    setIdx(0);
    setStatus("idle");
  }, [clearHighlight, clearWatchdog]);

  // Speak block i, then chain to the next one. A generation token invalidates
  // callbacks from cancelled utterances; a watchdog rescues engine hangs.
  const speakFrom = useCallback(
    (i: number) => {
      const blocks = blocksRef.current;
      if (!blocks || i >= blocks.length) {
        stopPlayback();
        return;
      }
      tokenRef.current += 1;
      const token = tokenRef.current;
      idxRef.current = i;
      setIdx(i);
      highlight(i);
      const b = blocks[i];
      const u = new SpeechSynthesisUtterance(b.text);
      if (voiceRef.current) {
        u.voice = voiceRef.current;
        u.lang = voiceRef.current.lang;
      }
      u.rate = rateRef.current;
      u.onend = () => {
        if (tokenRef.current !== token) return;
        clearWatchdog();
        speakFromRef.current(i + 1);
      };
      u.onerror = (e: SpeechSynthesisErrorEvent) => {
        if (tokenRef.current !== token) return;
        if (e.error === "interrupted" || e.error === "canceled") return;
        clearWatchdog();
        speakFromRef.current(i + 1); // skip the problematic block, keep listening
      };
      // Expected duration at this rate, with generous headroom.
      const expectedMs = (b.words / (2.4 * rateRef.current)) * 1000;
      watchdogRef.current = window.setTimeout(() => {
        if (tokenRef.current !== token) return;
        tokenRef.current += 1;
        try {
          window.speechSynthesis.cancel();
        } catch {
          /* noop */
        }
        speakFromRef.current(i + 1);
      }, Math.max(30000, expectedMs * 2 + 20000));
      window.speechSynthesis.speak(u);
    },
    [clearWatchdog, highlight, stopPlayback]
  );

  // Keep the recursion bridge pointing at the latest speakFrom.
  useEffect(() => {
    speakFromRef.current = speakFrom;
  }, [speakFrom]);

  const restartCurrent = useCallback(() => {
    tokenRef.current += 1;
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* noop */
    }
    speakFrom(idxRef.current);
  }, [speakFrom]);

  const trackStart = useCallback(() => {
    try {
      const g = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
      if (g) g("event", "listen_start", { article_slug: slug });
    } catch {
      /* analytics optional */
    }
  }, [slug]);

  const start = useCallback(() => {
    const synth = window.speechSynthesis;
    if (!blocksRef.current || blocksRef.current.length === 0) return;
    if (status === "idle") trackStart();
    setStatus("playing");
    if (synth.speaking && synth.paused) {
      synth.resume(); // resume a paused engine
      return;
    }
    if (synth.speaking) return; // already playing — nothing to do
    speakFrom(idxRef.current);
  }, [speakFrom, status, trackStart]);

  const pause = useCallback(() => {
    setStatus("paused");
    try {
      window.speechSynthesis.pause();
    } catch {
      /* noop */
    }
  }, []);

  const changeRate = useCallback(
    (r: number) => {
      rateRef.current = r;
      setRate(r);
      try {
        window.localStorage.setItem(LS_RATE, String(r));
      } catch {
        /* private browsing */
      }
      if (status === "playing") restartCurrent();
    },
    [restartCurrent, status]
  );

  const changeVoice = useCallback(
    (uri: string) => {
      const v = voices.find((x) => x.voiceURI === uri);
      if (!v) return;
      voiceRef.current = v;
      setVoiceURI(uri);
      try {
        window.localStorage.setItem(LS_VOICE, uri);
      } catch {
        /* private browsing */
      }
      if (status === "playing") restartCurrent();
    },
    [status, voices]
  );

  // Progress figures (from state — refs are only touched in handlers/effects).
  const wordsDone = useMemo(() => {
    let s = 0;
    for (let i = 0; i < idx && i < wordCounts.length; i++) s += wordCounts[i];
    return s;
  }, [idx, wordCounts]);
  const pct = totalWords > 0 ? Math.min(100, (wordsDone / totalWords) * 100) : 0;
  const minsLeft = Math.max(1, Math.round((totalWords - wordsDone) / (WPM * rate)));
  const minsTotal = Math.max(1, Math.round(totalWords / (WPM * rate)));

  if (!supported || total === 0) return null;

  return (
    <>
      <section
        aria-label="Listen to this article"
        className="glass-card rounded-xl border border-border/50 p-4 sm:p-5 mb-10"
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
          <button
            onClick={status === "playing" ? pause : start}
            className="inline-flex items-center gap-2 rounded-lg border border-cyan/30 bg-cyan/10 px-4 py-2 text-sm font-medium text-cyan transition-colors hover:bg-cyan/20"
          >
            {status === "playing" ? (
              <Pause className="size-4" aria-hidden />
            ) : (
              <Play className="size-4" aria-hidden />
            )}
            {status === "idle"
              ? "Listen to this article"
              : status === "paused"
              ? "Resume"
              : "Pause"}
          </button>

          {status !== "idle" && (
            <button
              onClick={stopPlayback}
              aria-label="Stop listening"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-colors hover:border-cyan/30 hover:text-cyan"
            >
              <Square className="size-3.5" aria-hidden />
            </button>
          )}

          <button
            onClick={() => changeRate(RATES[(RATES.indexOf(rate) + 1) % RATES.length])}
            aria-label={`Playback speed, currently ${rate} times`}
            className="rounded-lg border border-border/50 px-2.5 py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-cyan/30 hover:text-cyan"
          >
            {rate}×
          </button>

          {voices.length > 0 && (
            <select
              value={voiceURI}
              onChange={(e) => changeVoice(e.target.value)}
              aria-label="Narrator voice"
              style={{ colorScheme: "dark" }}
              className="max-w-[11rem] truncate rounded-lg border border-border/50 bg-surface px-2 py-2 text-xs text-muted-foreground transition-colors hover:border-cyan/30 sm:max-w-[16rem]"
            >
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          )}

          <span className="ml-auto hidden shrink-0 font-mono text-xs text-muted-foreground sm:block">
            <Headphones className="mr-1.5 inline size-3.5" aria-hidden />
            {status === "idle" ? `≈ ${minsTotal} min` : `≈ ${minsLeft} min left`}
          </span>
        </div>

        {status !== "idle" && (
          <div className="mt-4">
            <div className="h-1 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full bg-cyan transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground sm:hidden">
              ≈ {minsLeft} min left
            </p>
          </div>
        )}

        <p className="mt-3 text-xs text-muted-foreground">
          Read aloud with your device&apos;s built-in voice — no audio files,
          minimal data use. Pick a different narrator or speed above.
        </p>
      </section>

      {/* Sticky mini-player while listening */}
      {status !== "idle" && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/50 bg-background/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
            <button
              onClick={status === "playing" ? pause : start}
              aria-label={status === "playing" ? "Pause" : "Resume"}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-cyan/30 bg-cyan/10 text-cyan transition-colors hover:bg-cyan/20"
            >
              {status === "playing" ? (
                <Pause className="size-4" aria-hidden />
              ) : (
                <Play className="size-4" aria-hidden />
              )}
            </button>
            <button
              onClick={stopPlayback}
              aria-label="Stop listening"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-colors hover:border-cyan/30 hover:text-cyan"
            >
              <Square className="size-3.5" aria-hidden />
            </button>
            <div className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-border">
              <div
                className="h-full bg-cyan transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="shrink-0 font-mono text-xs text-muted-foreground">
              {idx + 1}/{total} · {rate}×
            </span>
          </div>
        </div>
      )}
    </>
  );
}
