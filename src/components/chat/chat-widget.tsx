"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";
import JibuChat from "@/components/chat/jibu-chat";
import JibuWelcome from "@/components/chat/jibu-welcome";
import { BOT_IDENTITY } from "@/lib/chatbot/identity";
import { JIBU_OPENED_KEY as PULSE_KEY } from "@/components/chat/jibu-storage-keys";

/**
 * Site-wide floating chat: a quiet cyan button, bottom-right, that opens the
 * conversation in place. Details handled:
 *  - hidden on /chat (the page IS the chat)
 *  - slides up when the directory's compare tray is open (they share the bottom edge)
 *  - unvisited pulse dot until first open (sessionStorage)
 *  - one-time welcome card ~5s after landing (mobile: bottom drawer,
 *    desktop: card above the button) — see jibu-welcome.tsx
 */

export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [trayVisible, setTrayVisible] = useState(false);
  const [seen, setSeen] = useState(true);

  useEffect(() => {
    setSeen(sessionStorage.getItem(PULSE_KEY) === "1");
  }, []);

  useEffect(() => {
    const sync = () => {
      try {
        const raw = sessionStorage.getItem("dc254:compare");
        const arr = raw ? (JSON.parse(raw) as unknown) : [];
        setTrayVisible(Array.isArray(arr) && arr.length > 0);
      } catch {
        setTrayVisible(false);
      }
    };
    sync();
    window.addEventListener("dc254:compare-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("dc254:compare-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (pathname === "/chat") return null;

  function toggle() {
    setOpen(!open);
    if (!open) {
      setSeen(true);
      try {
        sessionStorage.setItem(PULSE_KEY, "1");
      } catch {
        // Private mode — pulse may reappear; harmless.
      }
    }
  }

  const bottomOffset = trayVisible ? "bottom-24 sm:bottom-20" : "bottom-4 sm:bottom-6";

  return (
    <>
      {!open && <JibuWelcome trayVisible={trayVisible} onAsk={() => toggle()} />}

      <div className={`fixed right-4 z-[55] sm:right-6 ${bottomOffset}`}>
      {open && (
        <div
          role="dialog"
          aria-label={`${BOT_IDENTITY.name} — chat with the DC254 answer engine`}
          className="card-solid mb-3 flex h-[min(620px,72dvh)] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border/70 shadow-2xl shadow-black/40"
        >
          <div className="flex items-center justify-between border-b border-border/50 bg-accent/30 pr-2">
            <p className="px-4 pt-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              DC254 · {BOT_IDENTITY.name}
            </p>
            <button
              type="button"
              onClick={toggle}
              aria-label="Close chat"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="min-h-0 flex-1">
            <JibuChat variant="panel" />
          </div>
        </div>
      )}

      {!open && (
        <button
          type="button"
          onClick={toggle}
          aria-label={`Chat with ${BOT_IDENTITY.name}, the DC254 answer engine`}
          className="group relative flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan to-cyan/70 text-background shadow-xl shadow-cyan/25 transition-transform hover:scale-105 active:scale-95"
        >
          <MessageCircle className="size-6" aria-hidden="true" />
          {!seen && (
            <span
              className="absolute -right-0.5 -top-0.5 flex size-3.5"
              aria-hidden="true"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-75" />
              <span className="relative inline-flex size-3.5 rounded-full bg-neon" />
            </span>
          )}
        </button>
      )}
      </div>
    </>
  );
}
