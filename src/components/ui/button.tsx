import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-medium tracking-[-0.01em] transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-200 ease-out outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_1px_2px_rgba(0,0,0,0.4),0_0_0_1px_rgba(124,108,255,0.6)] hover:bg-[#8a7bff] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_6px_24px_-6px_rgba(124,108,255,0.7),0_0_0_1px_rgba(124,108,255,0.8)]",
        light:
          "bg-fg-primary text-ink shadow-[inset_0_-1px_0_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.4)] hover:bg-white",
        secondary:
          "bg-white/[0.04] text-fg-primary shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-white/[0.07] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]",
        ghost:
          "text-fg-secondary hover:bg-white/[0.05] hover:text-fg-primary",
        outline:
          "text-fg-primary shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] hover:bg-white/[0.04]",
        accent:
          "bg-accent text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_0_0_1px_rgba(124,108,255,0.6)] hover:bg-[#8a7bff]",
        destructive:
          "bg-red-500/90 text-white hover:bg-red-500",
      },
      size: {
        default: "h-9 rounded-[10px] px-4 text-[13px] [&_svg]:size-4",
        sm: "h-8 rounded-lg px-3 text-[12.5px] [&_svg]:size-3.5",
        xs: "h-7 rounded-md px-2.5 text-xs [&_svg]:size-3.5",
        lg: "h-11 rounded-xl px-5 text-[14px] [&_svg]:size-4",
        xl: "h-12 rounded-xl px-6 text-[15px] [&_svg]:size-4",
        icon: "h-8 w-8 rounded-lg [&_svg]:size-4",
        "icon-sm": "h-7 w-7 rounded-md [&_svg]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
