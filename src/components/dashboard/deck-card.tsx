"use client";

import Link from "next/link";
import { Copy, MoreHorizontal, Pencil, Play, Trash2 } from "lucide-react";
import type { Deck } from "@/types/deck";
import { SlideThumbnail } from "@/components/renderers/slide-renderer";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { timeAgo } from "@/lib/utils";

const TIER_LABEL: Record<Deck["tier"], string> = { basic: "Basic", plus: "Plus", pro: "Pro" };

interface DeckCardProps {
  deck: Deck;
  onRename: (deck: Deck) => void;
  onDuplicate: (deck: Deck) => void;
  onDelete: (deck: Deck) => void;
}

export function DeckCard({ deck, onRename, onDuplicate, onDelete }: DeckCardProps) {
  return (
    <div className="group relative rounded-2xl bg-surface-1 p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] transition-all duration-300 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12),0_24px_48px_-28px_rgba(124,108,255,0.5)]">
      <Link href={`/editor/${deck.id}`} className="block outline-none" aria-label={`Open ${deck.title}`}>
        <div className="relative overflow-hidden rounded-[10px]">
          <div className="transition-transform duration-700 ease-out group-hover:scale-[1.025]">
            <SlideThumbnail slide={deck.slides[0]} theme={deck.theme} />
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-[10px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]" />
        </div>
        <div className="px-2 pb-1.5 pt-3.5">
          <div className="truncate pr-8 text-[14px] font-medium tracking-[-0.01em] text-fg-primary">
            {deck.title}
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-[12px] text-fg-tertiary">
            <Badge variant={deck.tier === "pro" ? "accent" : "default"} className="py-0">
              {TIER_LABEL[deck.tier]}
            </Badge>
            <span>{deck.slides.length} slides</span>
            <span className="h-0.5 w-0.5 rounded-full bg-fg-tertiary" />
            <span suppressHydrationWarning>Edited {timeAgo(deck.updatedAt)}</span>
          </div>
        </div>
      </Link>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          aria-label="Deck actions"
          className="absolute bottom-[46px] right-3 flex h-7 w-7 items-center justify-center rounded-md text-fg-tertiary opacity-0 transition-all hover:bg-white/[0.06] hover:text-fg-primary focus-visible:opacity-100 group-hover:opacity-100 data-[state=open]:bg-white/[0.06] data-[state=open]:opacity-100"
        >
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/present/${deck.id}`}>
              <Play /> Present
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onRename(deck)}>
            <Pencil /> Rename
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onDuplicate(deck)}>
            <Copy /> Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive onSelect={() => onDelete(deck)}>
            <Trash2 /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
