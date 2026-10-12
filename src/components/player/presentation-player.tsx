"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, StickyNote, X } from "lucide-react";
import type { DeckTier } from "@/types/deck";
import {
  selectActiveDeck,
  selectActiveSlide,
  useDeckStore,
  useHydrated,
} from "@/store/deck-store";
import { ScaledSlide } from "@/components/renderers/scaled-slide";
import { SlideRenderer } from "@/components/renderers/slide-renderer";
import { Segmented } from "@/components/ui/segmented";
import { Kbd } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn, formatSlideLabel } from "@/lib/utils";

const IDLE_MS = 2000;

async function toggleFullscreen() {
  if (!document.fullscreenElement) await document.documentElement.requestFullscreen().catch(() => undefined);
  else await document.exitFullscreen();
}

export function PresentationPlayer({ deckId }: { deckId: string }) {
  const hydrated = useHydrated();
  const router = useRouter();
  const openDeck = useDeckStore((s) => s.openDeck);
  const exists = useDeckStore((s) => Boolean(s.decks[deckId]));
  const deck = useDeckStore(selectActiveDeck);
  const slide = useDeckStore(selectActiveSlide);
  const activeSlideIndex = useDeckStore((s) => s.activeSlideIndex);
  const diagramStep = useDeckStore((s) => s.diagramStep);
  const nextSlide = useDeckStore((s) => s.nextSlide);
  const prevSlide = useDeckStore((s) => s.prevSlide);
  const setActiveSlideIndex = useDeckStore((s) => s.setActiveSlideIndex);
  const setDiagramStep = useDeckStore((s) => s.setDiagramStep);
  const setTier = useDeckStore((s) => s.setTier);

  const [ready, setReady] = useState(false);
  const [chromeVisible, setChromeVisible] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const idleTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (hydrated) setReady(openDeck(deckId));
  }, [hydrated, deckId, openDeck]);

  const diagramCount = slide.blocks.filter((b) => b.type === "diagram-step").length;
  const exitToEditor = useCallback(() => router.push(`/editor/${deckId}`), [router, deckId]);

  const advance = useCallback(() => {
    if (diagramCount > 0 && diagramStep < diagramCount - 1) setDiagramStep(diagramStep + 1);
    else nextSlide();
  }, [diagramCount, diagramStep, nextSlide, setDiagramStep]);

  const retreat = useCallback(() => {
    if (diagramStep > 0) setDiagramStep(diagramStep - 1);
    else prevSlide();
  }, [diagramStep, prevSlide, setDiagramStep]);

  const wake = useCallback(() => {
    setChromeVisible(true);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setChromeVisible(false), IDLE_MS);
  }, []);

  useEffect(() => {
    wake();
    return () => window.clearTimeout(idleTimer.current);
  }, [wake]);

  useEffect(() => {
    if (!ready) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        advance();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        retreat();
      } else if (e.key === "Escape") {
        if (!document.fullscreenElement) exitToEditor();
      } else if (e.key.toLowerCase() === "n") {
        setShowNotes((v) => !v);
      } else if (e.key.toLowerCase() === "f") {
        void toggleFullscreen();
      } else if (e.key === "Home") {
        setActiveSlideIndex(0);
      } else if (e.key === "End") {
        setActiveSlideIndex(deck.slides.length - 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ready, advance, retreat, exitToEditor, setActiveSlideIndex, deck.slides.length]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  if (hydrated && !exists) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center bg-black text-center">
        <h1 className="text-[20px] font-semibold">This deck isn’t available</h1>
        <Button className="mt-6" size="sm" asChild>
          <Link href="/decks">Back to decks</Link>
        </Button>
      </div>
    );
  }

  if (!ready) return <div className="h-dvh bg-black" />;

  const progress = deck.slides.length > 1 ? activeSlideIndex / (deck.slides.length - 1) : 1;
  const chromeClass = cn(
    "transition-all duration-500 ease-out",
    chromeVisible || showNotes ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0"
  );

  return (
    <div
      className={cn("relative h-dvh overflow-hidden bg-black", !chromeVisible && "cursor-none")}
      onPointerMove={wake}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("[data-chrome]")) return;
        advance();
      }}
    >
      <ScaledSlide fit="contain">
        <SlideRenderer deck={deck} slide={slide} slideIndex={activeSlideIndex} diagramStep={diagramStep} />
      </ScaledSlide>

      {/* Progress line */}
      <div className="absolute inset-x-0 top-0 z-20 h-[2px] bg-white/[0.06]">
        <motion.div
          className="h-full bg-accent shadow-[0_0_12px_rgba(124,108,255,0.8)]"
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        />
      </div>

      {/* Top chrome */}
      <div data-chrome className={cn("absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4", chromeClass, !chromeVisible && "-translate-y-2")}>
        <div className="flex items-center gap-3 rounded-xl bg-black/50 px-3 py-2 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-xl">
          <span className="max-w-[260px] truncate text-[12.5px] font-medium text-fg-primary">{deck.title}</span>
          <span className="font-mono text-[11px] text-fg-tertiary">
            {formatSlideLabel(activeSlideIndex)}/{formatSlideLabel(deck.slides.length - 1)}
          </span>
        </div>
        <button
          type="button"
          onClick={exitToEditor}
          aria-label="Exit presentation"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/50 text-fg-secondary shadow-[0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-xl transition-colors hover:text-fg-primary"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Control pill */}
      <div data-chrome className={cn("absolute bottom-6 left-1/2 z-20 -translate-x-1/2", chromeClass, !chromeVisible && "translate-y-2")}>
        <div className="flex items-center gap-1 rounded-2xl bg-black/55 p-1.5 shadow-[0_0_0_1px_rgba(255,255,255,0.09),0_20px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <PillButton label="Previous" onClick={retreat}>
            <ChevronLeft className="h-4 w-4" />
          </PillButton>
          <PillButton label="Next" onClick={advance}>
            <ChevronRight className="h-4 w-4" />
          </PillButton>
          <span className="mx-1.5 h-5 w-px bg-white/10" />
          <Segmented<DeckTier>
            size="sm"
            ariaLabel="Visual tier"
            value={deck.tier}
            onChange={setTier}
            options={[
              { value: "basic", label: "Basic" },
              { value: "plus", label: "Plus" },
              { value: "pro", label: "Pro" },
            ]}
          />
          <span className="mx-1.5 h-5 w-px bg-white/10" />
          <PillButton label="Speaker notes (N)" onClick={() => setShowNotes((v) => !v)} active={showNotes}>
            <StickyNote className="h-4 w-4" />
          </PillButton>
          <PillButton label="Fullscreen (F)" onClick={() => void toggleFullscreen()}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </PillButton>
        </div>
        <div className="mt-2.5 hidden items-center justify-center gap-3 text-[11px] text-fg-tertiary md:flex">
          <span className="flex items-center gap-1"><Kbd>Space</Kbd> next</span>
          <span className="flex items-center gap-1"><Kbd>N</Kbd> notes</span>
          <span className="flex items-center gap-1"><Kbd>Esc</Kbd> exit</span>
        </div>
      </div>

      {/* Notes */}
      <AnimatePresence>
        {showNotes ? (
          <motion.aside
            data-chrome
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            className="absolute bottom-6 left-6 z-30 w-[min(360px,calc(100%-3rem))] rounded-2xl bg-black/65 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.09)] backdrop-blur-xl"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-fg-tertiary">Speaker notes</span>
              <span className="font-mono text-[10.5px] text-fg-tertiary">{formatSlideLabel(activeSlideIndex)}</span>
            </div>
            <p className="text-[14px] leading-relaxed text-fg-primary/90">
              {slide.notes?.trim() || "No notes for this slide."}
            </p>
            {deck.slides[activeSlideIndex + 1] ? (
              <p className="mt-4 border-t border-hairline pt-3 text-[12px] text-fg-tertiary">
                Next: <span className="text-fg-secondary">{deck.slides[activeSlideIndex + 1].headline}</span>
              </p>
            ) : null}
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function PillButton({
  label,
  onClick,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
        active ? "bg-white/[0.1] text-fg-primary" : "text-fg-secondary hover:bg-white/[0.07] hover:text-fg-primary"
      )}
    >
      {children}
    </button>
  );
}
