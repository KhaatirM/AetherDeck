"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Sparkles, X } from "lucide-react";
import type { Slide } from "@/types/deck";
import { selectActiveSlide, useDeckStore } from "@/store/deck-store";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const QUICK_ACTIONS = ["Make it more cinematic", "Tighten the copy", "Make it calmer"];

/** Local, offline rewrite rules so slide refinement works without an API key. */
function applyInstruction(
  text: string,
  slide: Slide,
  update: (patch: Partial<Slide>) => void
): string {
  const lower = text.toLowerCase();

  if (/(cinematic|dramatic|epic|bold)/.test(lower)) {
    update({ backgroundEffect: "aurora", transitionType: "cinematic-zoom" });
    return "Switched to an aurora atmosphere with a cinematic zoom entrance. Try the Pro tier to feel it in 3D.";
  }
  if (/(short|tight|concise|trim)/.test(lower)) {
    update({
      headline: slide.headline.split(" ").slice(0, 6).join(" "),
      subheadline: slide.subheadline
        ? `${slide.subheadline.split(" ").slice(0, 12).join(" ").replace(/[,.;:]$/, "")}.`
        : slide.subheadline,
    });
    return "Trimmed the headline and supporting line for faster scanning.";
  }
  if (/(calm|minimal|quiet|simple|clean)/.test(lower)) {
    update({ backgroundEffect: "color", transitionType: "fade" });
    return "Simplified the background and switched to a gentle fade.";
  }
  if (/(stat|number|metric|proof)/.test(lower)) {
    update({ layoutType: "stat-callout" });
    return "Changed this slide to a stat-callout layout.";
  }
  if (/(timeline|steps|process|journey)/.test(lower)) {
    update({ layoutType: "timeline" });
    return "Changed this slide to a timeline layout.";
  }
  return "I can make this slide more cinematic, tighter, calmer, or switch it to a stats or timeline layout.";
}

export function AiDrawer() {
  const open = useDeckStore((s) => s.aiDrawerOpen);
  const setOpen = useDeckStore((s) => s.setAiDrawerOpen);
  const slide = useDeckStore(selectActiveSlide);
  const updateSlide = useDeckStore((s) => s.updateSlide);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    setMessages((m) => [...m, { id: `u_${Date.now()}`, role: "user", content }]);
    setInput("");
    setBusy(true);
    await new Promise((r) => setTimeout(r, 500));
    const reply = applyInstruction(content, slide, (patch) => updateSlide(slide.id, patch));
    setMessages((m) => [...m, { id: `a_${Date.now()}`, role: "assistant", content: reply }]);
    setBusy(false);
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
          className="absolute bottom-20 left-1/2 z-30 w-[min(560px,calc(100%-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl bg-surface-2/95 shadow-window backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-hairline px-4 py-2.5">
            <div className="flex items-center gap-2 text-[12.5px] font-medium text-fg-primary">
              <Sparkles className="h-3.5 w-3.5 text-accent-soft" />
              Refine this slide
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-fg-tertiary transition-colors hover:bg-white/[0.06] hover:text-fg-primary"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div ref={listRef} className="scrollbar-thin max-h-56 overflow-y-auto px-4 py-3">
            {messages.length === 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => void send(action)}
                    className="rounded-full bg-white/[0.04] px-3 py-1 text-[12px] text-fg-secondary shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)] transition-colors hover:bg-white/[0.07] hover:text-fg-primary"
                  >
                    {action}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                    className={cn(
                      "max-w-[85%] rounded-xl px-3 py-2 text-[12.5px] leading-relaxed",
                      msg.role === "user"
                        ? "self-end bg-accent/15 text-fg-primary shadow-[inset_0_0_0_1px_rgba(124,108,255,0.25)]"
                        : "self-start bg-white/[0.04] text-fg-secondary"
                    )}
                  >
                    {msg.content}
                  </motion.div>
                ))}
                {busy ? <div className="shimmer-text self-start px-1 text-[12px]">Thinking…</div> : null}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="flex items-center gap-2 border-t border-hairline p-2 pl-4"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe a change…"
              className="h-8 flex-1 bg-transparent text-[13px] text-fg-primary outline-none placeholder:text-fg-tertiary"
            />
            <button
              type="submit"
              disabled={!input.trim() || busy}
              aria-label="Send"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-fg-primary text-ink transition-opacity disabled:opacity-30"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
