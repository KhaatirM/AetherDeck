"use client";

import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useDeckStore, selectActiveSlide } from "@/store/deck-store";
import { SlideRenderer } from "@/components/renderers/slide-renderer";
import { Button } from "@/components/ui/button";
import { formatSlideLabel } from "@/lib/utils";
import Link from "next/link";

export function LiveViewport() {
  const deck = useDeckStore((s) => s.deck);
  const activeSlideIndex = useDeckStore((s) => s.activeSlideIndex);
  const diagramStep = useDeckStore((s) => s.diagramStep);
  const nextSlide = useDeckStore((s) => s.nextSlide);
  const prevSlide = useDeckStore((s) => s.prevSlide);
  const setDiagramStep = useDeckStore((s) => s.setDiagramStep);
  const slide = useDeckStore(selectActiveSlide);

  const diagramBlocks = slide.blocks.filter((b) => b.type === "diagram-step");

  return (
    <section className="flex min-w-0 flex-1 flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
            Live canvas · Tier {deck.tier}
          </p>
          <p className="truncate text-sm font-medium">
            {formatSlideLabel(activeSlideIndex)} — {slide.headline}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={prevSlide}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" onClick={nextSlide}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="accent" asChild>
            <Link href="/present">
              <Maximize2 className="h-4 w-4" />
              Present
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-4 md:p-8">
        <div className="slide-frame w-full max-w-5xl border border-border shadow-2xl shadow-primary/10">
          <SlideRenderer
            deck={deck}
            slide={slide}
            slideIndex={activeSlideIndex}
            diagramStep={diagramStep}
          />
        </div>
      </div>

      {diagramBlocks.length > 0 ? (
        <div className="flex items-center justify-center gap-2 border-t border-border px-4 py-3">
          <span className="text-xs text-muted">Diagram steps</span>
          {diagramBlocks.map((_, i) => (
            <Button
              key={i}
              size="sm"
              variant={diagramStep === i ? "default" : "secondary"}
              onClick={() => setDiagramStep(i)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
