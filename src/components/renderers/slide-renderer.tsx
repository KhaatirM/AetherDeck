"use client";

import { memo } from "react";
import dynamic from "next/dynamic";
import type { Deck, DeckTheme, DeckTier, Slide } from "@/types/deck";
import { TierBasicRenderer } from "@/components/renderers/tier-basic/tier-basic-renderer";
import { TierPlusRenderer } from "@/components/renderers/tier-plus/tier-plus-renderer";
import { ScaledSlide } from "@/components/renderers/scaled-slide";

const TierProRenderer = dynamic(
  () =>
    import("@/components/renderers/tier-pro/tier-pro-renderer").then((m) => m.TierProRenderer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#08090B]">
        <span className="shimmer-text font-mono text-[15px] tracking-[0.2em]">
          RENDERING SCENE
        </span>
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
}

/** Renders a slide at the 1280x720 design size. Wrap in ScaledSlide to fit a container. */
export function SlideRenderer({ deck, slide, slideIndex, tier, diagramStep = 0 }: SlideRendererProps) {
  const activeTier = tier ?? deck.tier;

  if (activeTier === "pro") {
    return (
      <TierProRenderer
        slide={slide}
        theme={deck.theme}
        slideIndex={slideIndex}
        diagramStep={diagramStep}
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
      />
    );
  }

  return <TierBasicRenderer slide={slide} theme={deck.theme} />;
}

/** Static, memoized Basic-tier preview for thumbnails and deck cards. */
export const SlideThumbnail = memo(function SlideThumbnail({
  slide,
  theme,
  className,
}: {
  slide: Slide;
  theme: DeckTheme;
  className?: string;
}) {
  return (
    <ScaledSlide className={className}>
      <div className="pointer-events-none h-full w-full select-none">
        <TierBasicRenderer slide={slide} theme={theme} />
      </div>
    </ScaledSlide>
  );
});
