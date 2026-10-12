"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import type { DeckTheme, Slide, TransitionType } from "@/types/deck";
import {
  SlideContentLayout,
  SlideShell,
  renderStaticBlock,
} from "@/components/renderers/shared/slide-primitives";
import { EASE_OUT_EXPO } from "@/lib/motion";

interface TierPlusRendererProps {
  slide: Slide;
  theme: DeckTheme;
  slideIndex: number;
  diagramStep?: number;
  className?: string;
}

const slideVariants: Record<TransitionType, Variants> = {
  none: { initial: {}, animate: {}, exit: {} },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, x: 80 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -80 },
  },
  morph: {
    initial: { opacity: 0, scale: 0.96, borderRadius: 48 },
    animate: { opacity: 1, scale: 1, borderRadius: 0 },
    exit: { opacity: 0, scale: 1.02 },
  },
  "cinematic-zoom": {
    initial: { opacity: 0, scale: 1.08, filter: "blur(12px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 0.97, filter: "blur(6px)" },
  },
  "camera-pan": {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -60 },
  },
};

const blockVariants: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 0.25 + i * 0.09, duration: 0.7, ease: EASE_OUT_EXPO },
  }),
};

export function TierPlusRenderer({
  slide,
  theme,
  slideIndex,
  diagramStep = 0,
  className,
}: TierPlusRendererProps) {
  const variants = slideVariants[slide.transitionType] ?? slideVariants.fade;
  let diagramIndex = -1;

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: theme.colors.background }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${slide.id}-${slideIndex}`}
          className="h-full w-full"
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        >
          <SlideShell slide={slide} theme={theme} className={className}>
            <motion.div
              className="flex h-full flex-col"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.1 }}
            >
              <SlideContentLayout
                slide={slide}
                theme={theme}
                renderBlock={(block, index) => {
                  const isDiagram = block.type === "diagram-step";
                  if (isDiagram) diagramIndex += 1;
                  const dimmed = isDiagram && diagramIndex > diagramStep;
                  return (
                    <motion.div
                      className="h-full"
                      custom={index}
                      variants={blockVariants}
                      initial="hidden"
                      animate="show"
                    >
                      <motion.div
                        className="h-full"
                        animate={{ opacity: dimmed ? 0.28 : 1, scale: dimmed ? 0.98 : 1 }}
                        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                      >
                        {renderStaticBlock(block, theme)}
                      </motion.div>
                    </motion.div>
                  );
                }}
              />
            </motion.div>
          </SlideShell>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
