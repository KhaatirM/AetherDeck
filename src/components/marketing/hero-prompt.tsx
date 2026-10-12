"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Sparkles } from "lucide-react";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "A Series A pitch for an AI infrastructure startup",
  "A product launch keynote for a smart home device",
  "A lecture on the history of cinema in 10 slides",
  "A quarterly business review for a design team",
];

export function HeroPrompt() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (value) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % SUGGESTIONS.length), 3600);
    return () => window.clearInterval(id);
  }, [value]);

  function submit() {
    const prompt = value.trim() || SUGGESTIONS[index];
    router.push(`/new?prompt=${encodeURIComponent(prompt)}`);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className={cn(
        "group relative mx-auto flex w-full max-w-xl items-center gap-2 rounded-2xl bg-surface-1/80 p-1.5 pl-4 backdrop-blur-xl transition-shadow duration-300",
        focused
          ? "shadow-[0_0_0_1px_rgba(124,108,255,0.55),0_0_0_5px_rgba(124,108,255,0.12),0_20px_60px_-20px_rgba(124,108,255,0.5)]"
          : "shadow-[0_0_0_1px_rgba(255,255,255,0.09),0_20px_60px_-24px_rgba(0,0,0,0.8)]"
      )}
    >
      <Sparkles className="h-4 w-4 shrink-0 text-accent-soft" />
      <div className="relative min-w-0 flex-1">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label="Describe your presentation"
          className="h-10 w-full bg-transparent text-[14.5px] text-fg-primary outline-none placeholder:text-transparent"
          placeholder={SUGGESTIONS[index]}
        />
        {!value ? (
          <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                className="truncate text-[14.5px] text-fg-tertiary"
              >
                {SUGGESTIONS[index]}
              </motion.span>
            </AnimatePresence>
          </div>
        ) : null}
      </div>
      <button
        type="submit"
        aria-label="Generate deck"
        className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-fg-primary px-4 text-[13px] font-medium text-ink transition-all hover:bg-white active:scale-[0.97]"
      >
        Generate
        <ArrowUp className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}
