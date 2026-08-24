"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { DeckTheme, Slide } from "@/types/deck";
import {
  BlockCard,
  SlideContentLayout,
  SlideShell,
} from "@/components/renderers/shared/slide-primitives";
import { ProBackdrop } from "@/components/renderers/tier-pro/pro-backdrop";

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
  return (
    <div className="relative h-full w-full overflow-hidden">
      <ProBackdrop
        effect={slide.backgroundEffect}
        theme={theme}
        slideIndex={slideIndex}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          className="relative z-10 h-full w-full"
          initial={{ opacity: 0, scale: 1.06, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <SlideShell
            slide={slide}
            theme={theme}
            className={className}
            style={{ background: "transparent" }}
          >
            <SlideContentLayout
              slide={slide}
              theme={theme}
              renderBlock={(block, index) => {
                const isDiagram = block.type === "diagram-step";
                const dimmed = isDiagram && index > diagramStep;
                return (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{
                      opacity: dimmed ? 0.4 : 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.15 + index * 0.1,
                      duration: 0.55,
                    }}
                  >
                    <BlockCard
                      block={block}
                      theme={theme}
                      className="border-white/15 bg-black/35 shadow-2xl shadow-black/40"
                    />
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
