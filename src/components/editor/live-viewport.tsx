"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { selectActiveDeck, selectActiveSlide, useDeckStore } from "@/store/deck-store";
import { ScaledSlide } from "@/components/renderers/scaled-slide";
import { SlideRenderer } from "@/components/renderers/slide-renderer";
import { AiDrawer } from "@/components/ai/ai-drawer";
import { cn, formatSlideLabel } from "@/lib/utils";

export function LiveViewport() {
  const deck = useDeckStore(selectActiveDeck);
  const slide = useDeckStore(selectActiveSlide);
  const activeSlideIndex = useDeckStore((s) => s.activeSlideIndex);
  const diagramStep = useDeckStore((s) => s.diagramStep);
  const nextSlide = useDeckStore((s) => s.nextSlide);
  const prevSlide = useDeckStore((s) => s.prevSlide);
  const setDiagramStep = useDeckStore((s) => s.setDiagramStep);

  const diagramCount = slide.blocks.filter((b) => b.type === "diagram-step").length;

  return (
    <section className="relative flex min-w-0 flex-1 flex-col bg-[#0A0B0D]">
      <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-50" aria-hidden />

      <div className="relative flex min-h-0 flex-1 items-center justify-center p-6 lg:p-10">
        <div className="relative h-full w-full">
          <ScaledSlide fit="contain">
            <div className="h-full w-full overflow-hidden rounded-[6px] shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_30px_80px_-20px_rgba(0,0,0,0.9),0_0_120px_-40px_rgba(124,108,255,0.35)]">
              <SlideRenderer
                deck={deck}
                slide={slide}
                slideIndex={activeSlideIndex}
                diagramStep={diagramStep}
              />
            </div>
          </ScaledSlide>
        </div>
      </div>

      <div className="relative flex h-16 shrink-0 items-start justify-center">
        <div className="flex items-center gap-1 rounded-xl bg-surface-2/90 p-1 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_12px_32px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <button
            type="button"
            onClick={prevSlide}
            disabled={activeSlideIndex === 0}
            aria-label="Previous slide"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-fg-secondary transition-colors hover:bg-white/[0.06] hover:text-fg-primary disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[64px] text-center font-mono text-[11px] text-fg-secondary">
            {formatSlideLabel(activeSlideIndex)} <span className="text-fg-tertiary">/ {formatSlideLabel(deck.slides.length - 1)}</span>
          </span>
          <button
            type="button"
            onClick={nextSlide}
            disabled={activeSlideIndex === deck.slides.length - 1}
            aria-label="Next slide"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-fg-secondary transition-colors hover:bg-white/[0.06] hover:text-fg-primary disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {diagramCount > 0 ? (
            <>
              <span className="mx-1 h-4 w-px bg-white/10" />
              <span className="pl-1 pr-1.5 text-[11px] text-fg-tertiary">Steps</span>
              {Array.from({ length: diagramCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setDiagramStep(i)}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg font-mono text-[11px] transition-colors",
                    diagramStep === i
                      ? "bg-accent/20 text-accent-soft shadow-[inset_0_0_0_1px_rgba(124,108,255,0.4)]"
                      : "text-fg-tertiary hover:bg-white/[0.06] hover:text-fg-primary"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </>
          ) : null}
        </div>
      </div>

      <AiDrawer />
    </section>
  );
}
