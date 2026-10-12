"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const SLIDE_WIDTH = 1280;
export const SLIDE_HEIGHT = 720;

interface ScaledSlideProps {
  children: React.ReactNode;
  /** "width" keeps a 16:9 box that fills its container's width; "contain" letterboxes inside any box. */
  fit?: "width" | "contain";
  className?: string;
}

/**
 * Renders slide content at a fixed 1280x720 design resolution and scales it
 * to the container, so typography and layout are identical at every size.
 */
export function ScaledSlide({ children, fit = "width", className }: ScaledSlideProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      setScale(
        fit === "contain"
          ? Math.min(width / SLIDE_WIDTH, height / SLIDE_HEIGHT)
          : width / SLIDE_WIDTH
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [fit]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden",
        fit === "width" ? "aspect-video w-full" : "h-full w-full",
        className
      )}
    >
      <div
        className="absolute transition-opacity duration-300"
        style={{
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          opacity: scale > 0 ? 1 : 0,
          ...(fit === "contain"
            ? {
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) scale(${scale || 0.0001})`,
                transformOrigin: "center",
              }
            : {
                left: 0,
                top: 0,
                transform: `scale(${scale || 0.0001})`,
                transformOrigin: "top left",
              }),
        }}
      >
        {children}
      </div>
    </div>
  );
}
