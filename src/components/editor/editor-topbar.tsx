"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Download, FileText, Play, Presentation, Sparkles } from "lucide-react";
import type { DeckTier } from "@/types/deck";
import { selectActiveDeck, useDeckStore } from "@/store/deck-store";
import { LogoMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Segmented } from "@/components/ui/segmented";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportDeckToPptx } from "@/lib/export/pptx";
import { printDeckToPdf } from "@/lib/export/pdf";
import { cn } from "@/lib/utils";

export function EditorTopbar() {
  const deck = useDeckStore(selectActiveDeck);
  const renameDeck = useDeckStore((s) => s.renameDeck);
  const setTier = useDeckStore((s) => s.setTier);
  const aiOpen = useDeckStore((s) => s.aiDrawerOpen);
  const setAiOpen = useDeckStore((s) => s.setAiDrawerOpen);

  const [title, setTitle] = useState(deck.title);
  const [exporting, setExporting] = useState(false);

  useEffect(() => setTitle(deck.title), [deck.title]);

  function commitTitle() {
    const next = title.trim();
    if (next && next !== deck.title) renameDeck(deck.id, next);
    else setTitle(deck.title);
  }

  return (
    <header className="relative z-20 grid h-12 shrink-0 grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-4 md:grid-cols-[1fr_auto_1fr] border-b border-hairline bg-surface-1/60 px-3 backdrop-blur-xl">
      <div className="flex min-w-0 items-center gap-1.5">
        <Link href="/decks" className="flex items-center gap-2 rounded-md px-1.5 py-1 text-[13px] text-fg-tertiary transition-colors hover:text-fg-primary">
          <LogoMark className="h-6 w-6" />
          <span className="hidden sm:inline">Decks</span>
        </Link>
        <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-fg-tertiary/60 sm:block" />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={commitTitle}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
            if (e.key === "Escape") {
              setTitle(deck.title);
              e.currentTarget.blur();
            }
          }}
          aria-label="Deck title"
          className="hidden min-w-0 max-w-[320px] flex-1 truncate sm:block rounded-md bg-transparent px-1.5 py-1 text-[13px] font-medium text-fg-primary outline-none transition-colors hover:bg-white/[0.04] focus:bg-white/[0.05] focus:shadow-[inset_0_0_0_1px_rgba(124,108,255,0.5)]"
        />
      </div>

      <Segmented<DeckTier>
        className="justify-self-center"
        ariaLabel="Visual tier"
        value={deck.tier}
        onChange={setTier}
        options={[
          { value: "basic", label: "Basic" },
          { value: "plus", label: "Plus" },
          { value: "pro", label: "Pro" },
        ]}
      />

      <div className="flex items-center justify-end gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAiOpen(!aiOpen)}
              className={cn(aiOpen && "bg-white/[0.06] text-fg-primary")}
            >
              <Sparkles className="text-accent-soft" />
              <span className="hidden lg:inline">Refine</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Refine slide <Kbd>Ctrl</Kbd>
            <Kbd>J</Kbd>
          </TooltipContent>
        </Tooltip>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" disabled={exporting}>
              <Download />
              <span className="hidden lg:inline">{exporting ? "Exporting…" : "Export"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={async () => {
                setExporting(true);
                try {
                  await exportDeckToPptx(deck);
                } finally {
                  setExporting(false);
                }
              }}
            >
              <Presentation /> PowerPoint (.pptx)
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => printDeckToPdf(deck)}>
              <FileText /> PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" asChild>
              <Link href={`/present/${deck.id}`}>
                <Play className="fill-current" />
                <span className="hidden sm:inline">Present</span>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Present <Kbd>P</Kbd>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
