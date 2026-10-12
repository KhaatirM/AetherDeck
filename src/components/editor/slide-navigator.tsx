"use client";

import { useEffect, useRef } from "react";
import { Copy, Plus, Trash2 } from "lucide-react";
import { selectActiveDeck, useDeckStore } from "@/store/deck-store";
import { SlideThumbnail } from "@/components/renderers/slide-renderer";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, formatSlideLabel } from "@/lib/utils";

export function SlideNavigator() {
  const deck = useDeckStore(selectActiveDeck);
  const activeSlideIndex = useDeckStore((s) => s.activeSlideIndex);
  const setActiveSlideIndex = useDeckStore((s) => s.setActiveSlideIndex);
  const addSlide = useDeckStore((s) => s.addSlide);
  const duplicateSlide = useDeckStore((s) => s.duplicateSlide);
  const deleteSlide = useDeckStore((s) => s.deleteSlide);
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeSlideIndex]);

  return (
    <aside className="flex w-[212px] shrink-0 flex-col border-r border-hairline bg-surface-1/40">
      <div className="flex h-11 items-center justify-between px-4">
        <span className="text-[12px] font-medium text-fg-secondary">Slides</span>
        <span className="font-mono text-[10.5px] text-fg-tertiary">{deck.slides.length}</span>
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto px-3 pb-3">
        <div className="flex flex-col gap-2.5">
          {deck.slides.map((slide, index) => {
            const active = index === activeSlideIndex;
            return (
              <div
                key={slide.id}
                ref={active ? activeRef : undefined}
                className="group relative flex items-start gap-2"
              >
                <span
                  className={cn(
                    "mt-1 w-4 shrink-0 text-right font-mono text-[10px] transition-colors",
                    active ? "text-fg-primary" : "text-fg-tertiary"
                  )}
                >
                  {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveSlideIndex(index)}
                  aria-label={`Slide ${formatSlideLabel(index)}: ${slide.headline}`}
                  aria-current={active ? "true" : undefined}
                  className="relative min-w-0 flex-1 overflow-hidden rounded-[7px] outline-none"
                >
                  <SlideThumbnail slide={slide} theme={deck.theme} />
                  <span
                    className={cn(
                      "pointer-events-none absolute inset-0 rounded-[7px] transition-shadow duration-200",
                      active
                        ? "shadow-[inset_0_0_0_1.5px_rgba(124,108,255,1),0_0_0_3px_rgba(124,108,255,0.18)]"
                        : "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)] group-hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]"
                    )}
                  />
                </button>
                <div className="absolute right-1 top-1 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => duplicateSlide(slide.id)}
                        aria-label="Duplicate slide"
                        className="flex h-5 w-5 items-center justify-center rounded bg-black/70 text-fg-secondary backdrop-blur hover:text-fg-primary"
                      >
                        <Copy className="h-2.5 w-2.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Duplicate</TooltipContent>
                  </Tooltip>
                  {deck.slides.length > 1 ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => deleteSlide(slide.id)}
                          aria-label="Delete slide"
                          className="flex h-5 w-5 items-center justify-center rounded bg-black/70 text-fg-secondary backdrop-blur hover:text-red-300"
                        >
                          <Trash2 className="h-2.5 w-2.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">Delete</TooltipContent>
                    </Tooltip>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => addSlide()}
          className="ml-6 mt-3 flex h-9 w-[calc(100%-1.5rem)] items-center justify-center gap-1.5 rounded-[7px] border border-dashed border-white/10 text-[12px] text-fg-tertiary transition-colors hover:border-white/20 hover:bg-white/[0.02] hover:text-fg-primary"
        >
          <Plus className="h-3.5 w-3.5" />
          Add slide
        </button>
      </div>
    </aside>
  );
}
