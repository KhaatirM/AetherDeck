"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { DeckTheme, Slide } from "@/types/deck";
import {
  SlideContentLayout,
  SlideShell,
  renderStaticBlock,
} from "@/components/renderers/shared/slide-primitives";
import { ProBackdrop } from "@/components/renderers/tier-pro/pro-backdrop";
import { EASE_OUT_EXPO } from "@/lib/motion";

interface TierProRendererProps {
  slide: Slide;
  theme: DeckTheme;
  slideIndex: number;
  diagramStep?: number;
  className?: string;
}

export function TierProRenderer({
  slide,
  theme,
  slideIndex,
  diagramStep = 0,
  className,
}: TierProRendererProps) {
  let diagramIndex = -1;

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: theme.colors.background }}>
      <ProBackdrop effect={slide.backgroundEffect} theme={theme} slideIndex={slideIndex} />
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={slide.id}
          className="relative z-10 h-full w-full"
          initial={{ opacity: 0, scale: 1.08, filter: "blur(14px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
          transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
        >
          <SlideShell slide={slide} theme={theme} className={className} transparent>
            <SlideContentLayout
              slide={slide}
              theme={theme}
              renderBlock={(block, index) => {
                const isDiagram = block.type === "diagram-step";
                if (isDiagram) diagramIndex += 1;
                const dimmed = isDiagram && diagramIndex > diagramStep;
                return (
                  <motion.div
                    className="h-full [&>*]:backdrop-blur-md"
                    initial={{ opacity: 0, y: 40, z: -80 }}
                    animate={{ opacity: dimmed ? 0.3 : 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.8, ease: EASE_OUT_EXPO }}
                  >
                    {renderStaticBlock(block, theme)}
                  </motion.div>
                );
              }}
            />
          </SlideShell>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
