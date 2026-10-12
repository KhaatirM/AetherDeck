import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-4 tracking-tight",
  {
    variants: {
      variant: {
        default: "border-hairline bg-surface-2 text-fg-secondary",
        accent: "border-accent/30 bg-accent/10 text-accent-soft",
        outline: "border-hairline-strong bg-transparent text-fg-secondary",
        success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
