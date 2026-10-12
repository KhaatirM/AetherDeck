import type { Transition, Variants } from "framer-motion";

export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const DURATION = {
  fast: 0.18,
  base: 0.32,
  slow: 0.6,
  cinematic: 1.1,
} as const;

export const transitionBase: Transition = {
  duration: DURATION.base,
  ease: EASE_OUT_EXPO,
};

export const transitionSlow: Transition = {
  duration: DURATION.slow,
  ease: EASE_OUT_EXPO,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: transitionSlow },
};

export const blurIn: Variants = {
  hidden: { opacity: 0, filter: "blur(10px)", y: 8 },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT_EXPO },
  },
};

export function stagger(staggerChildren = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren, delayChildren } },
  };
}

export const viewportOnce = { once: true, margin: "-80px" } as const;
