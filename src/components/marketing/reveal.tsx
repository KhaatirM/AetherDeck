"use client";

import { motion } from "framer-motion";
import { EASE_OUT_EXPO, viewportOnce } from "@/lib/motion";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, y = 18, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={viewportOnce}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal
      className={
        align === "center"
          ? "mx-auto flex max-w-2xl flex-col items-center text-center"
          : "flex max-w-xl flex-col items-start"
      }
    >
      <span className="mb-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-accent-soft">
        <span className="h-px w-5 bg-accent/60" />
        {eyebrow}
      </span>
      <h2 className="text-balance text-[34px] font-semibold leading-[1.08] tracking-[-0.035em] text-gradient sm:text-[44px]">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-pretty text-[16px] leading-relaxed text-fg-secondary">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
