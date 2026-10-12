"use client";

import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

export function SpotlightCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }, []);

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={cn("spotlight", className)}
      {...props}
    >
      <div className="relative z-[1] h-full">{children}</div>
    </div>
  );
}
