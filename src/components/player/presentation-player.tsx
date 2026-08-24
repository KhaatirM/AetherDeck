"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  StickyNote,
  X,
} from "lucide-react";
import { useDeckStore, selectActiveSlide } from "@/store/deck-store";
import type { DeckTier } from "@/types/deck";
import { SlideRenderer } from "@/components/renderers/slide-renderer";
import { Button } from "@/components/ui/button";
import { cn, formatSlideLabel } from "@/lib/utils";

const TIERS: DeckTier[] = ["basic", "plus", "pro"];

export function PresentationPlayer() {
  const deck = useDeckStore((s) => s.deck);
  const activeSlideIndex = useDeckStore((s) => s.activeSlideIndex);
  const diagramStep = useDeckStore((s) => s.diagramStep);
  const nextSlide = useDeckStore((s) => s.nextSlide);
  const prevSlide = useDeckStore((s) => s.prevSlide);
  const setActiveSlideIndex = useDeckStore((s) => s.setActiveSlideIndex);
  const setDiagramStep = useDeckStore((s) => s.setDiagramStep);
  const setTier = useDeckStore((s) => s.setTier);
  const slide = useDeckStore(selectActiveSlide);

  const [showNotes, setShowNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const diagramCount = slide.blocks.filter(
    (b) => b.type === "diagram-step"
  ).length;

  const advance = useCallback(() => {
    if (diagramCount > 0 && diagramStep < diagramCount - 1) {
      setDiagramStep(diagramStep + 1);
      return;
    }
    nextSlide();
  }, [diagramCount, diagramStep, nextSlide, setDiagramStep]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        advance();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        if (diagramStep > 0) setDiagramStep(diagramStep - 1);
        else prevSlide();
      } else if (e.key === "Escape") {
        if (document.fullscreenElement) {
          void document.exitFullscreen();
        } else {
          window.location.href = "/editor";
        }
      } else if (e.key === "n" || e.key === "N") {
        setShowNotes((v) => !v);
      } else if (e.key === "Home") {
        setActiveSlideIndex(0);
      } else if (e.key === "End") {
        setActiveSlideIndex(deck.slides.length - 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    advance,
    deck.slides.length,
    diagramStep,
    prevSlide,
    setActiveSlideIndex,
    setDiagramStep,
  ]);

  useEffect(() => {
    function onFs() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  async function toggleFullscreen() {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }

  return (
    <div className="relative flex h-dvh flex-col bg-black">
      <div className="absolute inset-0">
        <SlideRenderer
          deck={deck}
          slide={slide}
          slideIndex={activeSlideIndex}
          diagramStep={diagramStep}
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-4">
        <div className="pointer-events-auto rounded-xl glass-strong px-3 py-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
            AetherDeck Player
          </p>
          <p className="text-sm font-medium">
            {formatSlideLabel(activeSlideIndex)} /{" "}
            {formatSlideLabel(deck.slides.length - 1)} · {deck.title}
          </p>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 rounded-xl glass-strong p-2">
          {TIERS.map((tier) => (
            <Button
              key={tier}
              size="sm"
              variant={deck.tier === tier ? "default" : "ghost"}
              onClick={() => setTier(tier)}
            >
              {tier}
            </Button>
          ))}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowNotes((v) => !v)}
            title="Toggle notes (N)"
          >
            <StickyNote className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => void toggleFullscreen()}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              window.location.href = "/editor";
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between p-4">
        <div className="pointer-events-auto flex gap-2">
          <Button size="icon" variant="secondary" onClick={prevSlide}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" onClick={advance}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="pointer-events-auto flex max-w-md gap-1 overflow-x-auto rounded-xl glass-strong p-2">
          {deck.slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSlideIndex(i)}
              className={cn(
                "h-1.5 w-8 rounded-full transition-all",
                i === activeSlideIndex ? "bg-primary" : "bg-white/25"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <p className="pointer-events-none hidden text-xs text-white/40 md:block">
          Space / → next · Esc exit · N notes
        </p>
      </div>

      {showNotes ? (
        <div className="absolute bottom-20 left-4 z-30 max-w-sm rounded-2xl glass-strong p-4">
          <p className="mb-1 text-[10px] uppercase tracking-widest text-muted">
            Presenter notes
          </p>
          <p className="text-sm text-white/80">
            {slide.notes?.trim() || "No notes for this slide."}
          </p>
        </div>
      ) : null}
    </div>
  );
}
