import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-[72px] w-full rounded-[10px] bg-white/[0.03] px-3 py-2 text-[13px] leading-relaxed text-fg-primary shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)] transition-shadow placeholder:text-fg-tertiary hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.11)] focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_1px_rgba(124,108,255,0.7),0_0_0_3px_rgba(124,108,255,0.15)] disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
