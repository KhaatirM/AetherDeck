"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play } from "lucide-react";
import type { DeckTier } from "@/types/deck";
import { mockDeck } from "@/lib/mock-deck";
import { ScaledSlide } from "@/components/renderers/scaled-slide";
import { SlideRenderer, SlideThumbnail } from "@/components/renderers/slide-renderer";
import { Segmented } from "@/components/ui/segmented";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

const SEQUENCE: { tier: DeckTier; slideIndex: number }[] = [
  { tier: "basic", slideIndex: 2 },
  { tier: "plus", slideIndex: 4 },
  { tier: "pro", slideIndex: 5 },
  { tier: "plus", slideIndex: 3 },
];

const TIER_LABEL: Record<DeckTier, string> = { basic: "Basic", plus: "Plus", pro: "Pro" };

export function ProductPreview() {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [manualTier, setManualTier] = useState<DeckTier | null>(null);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % SEQUENCE.length), 5200);
    return () => window.clearInterval(id);
  }, [paused]);

  const current = SEQUENCE[step];
  const tier = manualTier ?? current.tier;
  const slide = mockDeck.slides[current.slideIndex];

  return (
    <div
      className="frame-gradient relative rounded-[18px] bg-surface-1 shadow-window"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        setManualTier(null);
      }}
    >
      {/* Window chrome */}
      <div className="flex h-11 items-center justify-between border-b border-hairline px-4">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        </div>
        <Segmented<DeckTier>
          size="sm"
          ariaLabel="Preview tier"
          value={tier}
          onChange={(value) => setManualTier(value)}
          options={[
            { value: "basic", label: "Basic" },
            { value: "plus", label: "Plus" },
            { value: "pro", label: "Pro" },
          ]}
        />
        <div className="flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[10.5px] text-fg-tertiary">
          <Play className="h-3 w-3" />
          <span className="hidden sm:inline">Present</span>
        </div>
      </div>

      <div className="flex">
        {/* Slide rail */}
        <div className="hidden w-[148px] shrink-0 flex-col gap-2.5 border-r border-hairline p-3 md:flex">
          {mockDeck.slides.slice(0, 6).map((s, i) => (
            <div key={s.id} className="flex items-start gap-2">
              <span className="mt-0.5 w-3 font-mono text-[9px] text-fg-tertiary">{i + 1}</span>
              <div
                className={cn(
                  "flex-1 overflow-hidden rounded-[5px] transition-shadow duration-500",
                  i === current.slideIndex
                    ? "shadow-[0_0_0_1.5px_rgba(124,108,255,0.9)]"
                    : "shadow-[0_0_0_1px_rgba(255,255,255,0.07)] opacity-60"
                )}
              >
                <SlideThumbnail slide={s} theme={mockDeck.theme} />
              </div>
            </div>
          ))}
        </div>

        {/* Stage */}
        <div className="relative flex-1 bg-[#0B0C0F] p-4 sm:p-6">
          <div className="overflow-hidden rounded-[10px] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_24px_48px_-16px_rgba(0,0,0,0.8)]">
            <ScaledSlide>
              <SlideRenderer deck={mockDeck} slide={slide} slideIndex={current.slideIndex} tier={tier} diagramStep={1} />
            </ScaledSlide>
          </div>
          <div className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 sm:bottom-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                className="rounded-full bg-black/60 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-fg-primary shadow-[0_0_0_1px_rgba(255,255,255,0.1)] backdrop-blur-md"
              >
                Tier · {TIER_LABEL[tier]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
