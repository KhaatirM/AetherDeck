"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: React.ReactNode;
}

interface SegmentedProps<T extends string> {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  size?: "sm" | "md";
  className?: string;
  ariaLabel?: string;
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  size = "md",
  className,
  ariaLabel,
}: SegmentedProps<T>) {
  const layoutId = useId();
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "relative inline-flex items-center gap-0.5 rounded-[10px] bg-white/[0.03] p-0.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
        className
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative z-10 inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors duration-200",
              size === "sm" ? "h-6 px-2.5 text-[11.5px]" : "h-7 px-3 text-[12.5px]",
              active ? "text-fg-primary" : "text-fg-tertiary hover:text-fg-secondary"
            )}
          >
            {active ? (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 -z-10 rounded-lg bg-white/[0.09] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_1px_3px_rgba(0,0,0,0.4)]"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            ) : null}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
