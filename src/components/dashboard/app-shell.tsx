"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Plus, Settings, Shapes } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/decks", label: "Decks", icon: LayoutGrid },
  { href: "/new", label: "Templates", icon: Shapes },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-hairline bg-surface-1/40 px-3 py-4 md:flex">
        <div className="px-2 pb-6 pt-1">
          <Logo />
        </div>

        <Link
          href="/new"
          className="mb-5 flex h-9 items-center gap-2 rounded-[10px] bg-white/[0.04] px-3 text-[13px] font-medium text-fg-primary shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] transition-colors hover:bg-white/[0.07]"
        >
          <Plus className="h-4 w-4 text-accent-soft" />
          New deck
        </Link>

        <nav className="flex flex-col gap-0.5">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-8 items-center gap-2.5 rounded-lg px-3 text-[13px] transition-colors",
                  active
                    ? "bg-white/[0.06] text-fg-primary"
                    : "text-fg-secondary hover:bg-white/[0.03] hover:text-fg-primary"
                )}
              >
                <item.icon className={cn("h-4 w-4", active ? "text-fg-primary" : "text-fg-tertiary")} />
                {item.label}
              </Link>
            );
          })}
          <div className="flex h-8 cursor-not-allowed items-center gap-2.5 rounded-lg px-3 text-[13px] text-fg-tertiary">
            <Settings className="h-4 w-4" />
            Settings
            <Badge className="ml-auto px-1.5 py-0 text-[10px]">Soon</Badge>
          </div>
        </nav>

        <div className="mt-auto rounded-xl bg-white/[0.025] p-3.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-2 text-[12px] font-medium text-fg-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            Local workspace
          </div>
          <p className="mt-1.5 text-[11.5px] leading-relaxed text-fg-tertiary">
            Decks are saved in this browser.
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
