"use client";

import Link from "next/link";
import { Layers3 } from "lucide-react";
import { SlideNavigator } from "@/components/editor/slide-navigator";
import { LiveViewport } from "@/components/editor/live-viewport";
import { VisualInspector } from "@/components/editor/visual-inspector";
import { PromptModal } from "@/components/ai/prompt-modal";
import { AiRegenSidebar } from "@/components/ai/ai-regen-sidebar";
import { useDeckStore } from "@/store/deck-store";
import { Button } from "@/components/ui/button";

export function EditorWorkspace() {
  const title = useDeckStore((s) => s.deck.title);
  const tier = useDeckStore((s) => s.deck.tier);
  const isGenerating = useDeckStore((s) => s.isGenerating);

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <header className="flex items-center justify-between gap-3 border-b border-border glass-strong px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-white/5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <Layers3 className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted">
                AetherDeck
              </p>
              <p className="truncate text-sm font-semibold">{title}</p>
            </div>
          </Link>
          <span className="hidden rounded-full border border-border px-2.5 py-1 text-[10px] uppercase tracking-wider text-muted sm:inline">
            Tier · {tier}
          </span>
          {isGenerating ? (
            <span className="animate-pulse text-xs text-secondary">
              Generating…
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <PromptModal />
          <Button variant="secondary" size="sm" asChild>
            <Link href="/present">Present</Link>
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <SlideNavigator />
        <div className="flex min-w-0 flex-1 flex-col">
          <LiveViewport />
          <AiRegenSidebar />
        </div>
        <VisualInspector />
      </div>
    </div>
  );
}
