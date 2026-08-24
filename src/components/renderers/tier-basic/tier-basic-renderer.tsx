"use client";

import type { DeckTheme, Slide } from "@/types/deck";
import {
  BlockCard,
  SlideContentLayout,
  SlideShell,
} from "@/components/renderers/shared/slide-primitives";

interface TierBasicRendererProps {
  slide: Slide;
  theme: DeckTheme;
  className?: string;
}

export function TierBasicRenderer({
  slide,
  theme,
  className,
}: TierBasicRendererProps) {
  return (
    <SlideShell slide={slide} theme={theme} className={className}>
      <SlideContentLayout
        slide={slide}
        theme={theme}
        renderBlock={(block) => (
          <BlockCard key={block.id} block={block} theme={theme} />
        )}
      />
    </SlideShell>
  );
}
