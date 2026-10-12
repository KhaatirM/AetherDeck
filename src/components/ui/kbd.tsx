import * as React from "react";
import { cn } from "@/lib/utils";

export function Kbd({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-hairline-strong bg-surface-2 px-1 font-mono text-[10px] font-medium text-fg-tertiary shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]",
        className
      )}
      {...props}
    />
  );
}
