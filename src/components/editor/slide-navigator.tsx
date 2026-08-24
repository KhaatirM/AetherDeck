"use client";

import { Plus, Trash2 } from "lucide-react";
import { useDeckStore } from "@/store/deck-store";
import { formatSlideLabel, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SlideRenderer } from "@/components/renderers/slide-renderer";

export function SlideNavigator() {
  const deck = useDeckStore((s) => s.deck);
  const activeSlideIndex = useDeckStore((s) => s.activeSlideIndex);
  const setActiveSlideIndex = useDeckStore((s) => s.setActiveSlideIndex);
  const addSlide = useDeckStore((s) => s.addSlide);
  const deleteSlide = useDeckStore((s) => s.deleteSlide);

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-border glass-strong">
      <div className="flex items-center justify-between border-b border-border px-3 py-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
            Slides
          </p>
          <p className="text-sm font-medium">{deck.slides.length} frames</p>
        </div>
        <Button size="icon" variant="secondary" onClick={() => addSlide()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-3 p-3">
          {deck.slides.map((slide, index) => {
            const active = index === activeSlideIndex;
            return (
              <div key={slide.id} className="group relative">
                <button
                  type="button"
                  onClick={() => setActiveSlideIndex(index)}
                  className={cn(
                    "w-full overflow-hidden rounded-xl border text-left transition-all",
                    active
                      ? "border-primary/60 ring-2 ring-primary/30"
                      : "border-border hover:border-white/25"
                  )}
                >
                  <div className="pointer-events-none aspect-video scale-[1.01] origin-top-left">
                    <div className="h-[180%] w-[180%] origin-top-left scale-[0.555]">
                      <SlideRenderer
                        deck={deck}
                        slide={slide}
                        slideIndex={index}
                        tier="basic"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-border bg-black/40 px-2 py-1.5">
                    <span className="text-[10px] font-medium text-muted">
                      {formatSlideLabel(index)}
                    </span>
                    <span className="truncate text-[10px] text-white/70">
                      {slide.headline}
                    </span>
                  </div>
                </button>
                {deck.slides.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => deleteSlide(slide.id)}
                    className="absolute right-1 top-1 hidden rounded-md bg-black/60 p-1 text-white/70 hover:text-red-300 group-hover:block"
                    aria-label="Delete slide"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
