"use client";

import { BOT_IDENTITY } from "@/lib/chatbot/identity";

/**
 * Device-side text-to-speech via the Web Speech API — free forever, zero
 * keys, zero latency, works offline on every modern browser. Matches the
 * site's device-side voice philosophy: no cloud dependency for audio.
 */

let cachedVoice: SpeechSynthesisVoice | null = null;

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const { preferredVoiceNames, preferredLangPrefixes } = BOT_IDENTITY.voice;
  for (const name of preferredVoiceNames) {
    const match = voices.find((v) => v.name === name);
    if (match) return (cachedVoice = match);
  }
  for (const lang of preferredLangPrefixes) {
    const match = voices.find((v) => v.lang.toLowerCase().startsWith(lang.toLowerCase()));
    if (match) return (cachedVoice = match);
  }
  return (cachedVoice = voices[0]);
}

// Voice list loads async on some browsers — prime the cache early.
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    pickVoice();
  };
}

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string): void {
  if (!speechSupported() || !text) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.slice(0, 600));
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  utterance.rate = BOT_IDENTITY.voice.rate;
  utterance.pitch = BOT_IDENTITY.voice.pitch;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (speechSupported()) window.speechSynthesis.cancel();
}
