"use client";

import dynamic from "next/dynamic";
import type { Deck, DeckTier, Slide } from "@/types/deck";
import { TierBasicRenderer } from "@/components/renderers/tier-basic/tier-basic-renderer";
import { TierPlusRenderer } from "@/components/renderers/tier-plus/tier-plus-renderer";

const TierProRenderer = dynamic(
  () =>
    import("@/components/renderers/tier-pro/tier-pro-renderer").then(
      (m) => m.TierProRenderer
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#070A12] text-sm text-white/50">
        Loading cinematic scene…
      </div>
    ),
  }
);

interface SlideRendererProps {
  deck: Deck;
  slide: Slide;
  slideIndex: number;
  tier?: DeckTier;
  diagramStep?: number;
  className?: string;
}

export function SlideRenderer({
  deck,
  slide,
  slideIndex,
  tier,
  diagramStep = 0,
  className,
}: SlideRendererProps) {
  const activeTier = tier ?? deck.tier;

  if (activeTier === "pro") {
    return (
      <TierProRenderer
        slide={slide}
        theme={deck.theme}
        slideIndex={slideIndex}
        diagramStep={diagramStep}
        className={className}
      />
    );
  }

  if (activeTier === "plus") {
    return (
      <TierPlusRenderer
        slide={slide}
        theme={deck.theme}
        slideIndex={slideIndex}
        diagramStep={diagramStep}
        className={className}
      />
    );
  }

  return (
    <TierBasicRenderer
      slide={slide}
      theme={deck.theme}
      className={className}
    />
  );
}
