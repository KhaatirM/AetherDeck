import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={cn("h-7 w-7", className)}
    >
      <defs>
        <linearGradient id="aether-mark" x1="4" y1="4" x2="28" y2="28">
          <stop offset="0" stopColor="#B4A9FF" />
          <stop offset="0.55" stopColor="#7C6CFF" />
          <stop offset="1" stopColor="#4B3FD1" />
        </linearGradient>
      </defs>
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="9"
        fill="#111216"
        stroke="rgba(255,255,255,0.09)"
      />
      <path
        d="M9 22.5 15.2 8.8a.9.9 0 0 1 1.6 0L23 22.5"
        stroke="url(#aether-mark)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.6 17.2h8.8"
        stroke="url(#aether-mark)"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

export function Logo({
  href = "/",
  className,
  showWordmark = true,
}: {
  href?: string;
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        className
      )}
    >
      <LogoMark className="transition-transform duration-500 ease-out group-hover:rotate-[-6deg]" />
      {showWordmark ? (
        <span className="text-[15px] font-semibold tracking-[-0.02em] text-fg-primary">
          AetherDeck
        </span>
      ) : null}
    </Link>
  );
}
