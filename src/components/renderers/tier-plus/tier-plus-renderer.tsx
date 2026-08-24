"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { DeckTheme, Slide } from "@/types/deck";
import {
  BlockCard,
  SlideContentLayout,
  SlideShell,
} from "@/components/renderers/shared/slide-primitives";

interface TierPlusRendererProps {
  slide: Slide;
  theme: DeckTheme;
  slideIndex: number;
  diagramStep?: number;
  className?: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 120, damping: 18 },
  },
};

export function TierPlusRenderer({
  slide,
  theme,
  slideIndex,
  diagramStep = 0,
  className,
}: TierPlusRendererProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${slide.id}-${slideIndex}`}
        className="h-full w-full"
        initial={{ opacity: 0, x: 48 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -48 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <SlideShell slide={slide} theme={theme} className={className}>
          <motion.div
            className="flex h-full flex-col"
            variants={container}
            initial="hidden"
            animate="show"
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
                    variants={item}
                    animate={
                      isDiagram
                        ? {
                            opacity: dimmed ? 0.35 : 1,
                            scale: dimmed ? 0.97 : 1,
                          }
                        : undefined
                    }
                  >
                    <BlockCard block={block} theme={theme} />
                  </motion.div>
                );
              }}
            />
          </motion.div>
        </SlideShell>
      </motion.div>
    </AnimatePresence>
  );
}
