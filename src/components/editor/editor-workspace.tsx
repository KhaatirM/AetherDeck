"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeckStore, useHydrated } from "@/store/deck-store";
import { EditorTopbar } from "@/components/editor/editor-topbar";
import { SlideNavigator } from "@/components/editor/slide-navigator";
import { LiveViewport } from "@/components/editor/live-viewport";
import { VisualInspector } from "@/components/editor/visual-inspector";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  return Boolean(el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)));
}

export function EditorWorkspace({ deckId }: { deckId: string }) {
  const hydrated = useHydrated();
  const router = useRouter();
  const openDeck = useDeckStore((s) => s.openDeck);
  const exists = useDeckStore((s) => Boolean(s.decks[deckId]));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    setReady(openDeck(deckId));
  }, [hydrated, deckId, openDeck, exists]);

  useEffect(() => {
    if (!ready) return;
    function onKey(e: KeyboardEvent) {
      const state = useDeckStore.getState();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        state.setAiDrawerOpen(!state.aiDrawerOpen);
        return;
      }
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        state.nextSlide();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        state.prevSlide();
      } else if (e.key.toLowerCase() === "p") {
        router.push(`/present/${deckId}`);
      } else if (e.key === "Escape" && state.aiDrawerOpen) {
        state.setAiDrawerOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ready, deckId, router]);

  if (hydrated && !exists) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-tertiary">404</span>
        <h1 className="mt-3 text-[22px] font-semibold tracking-[-0.03em]">This deck isn’t here</h1>
        <p className="mt-2 max-w-sm text-[13.5px] text-fg-secondary">
          Decks are saved in the browser where they were created. It may have been deleted, or made on another device.
        </p>
        <Button className="mt-8" size="sm" asChild>
          <Link href="/decks">Back to decks</Link>
        </Button>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex h-dvh flex-col">
        <div className="h-12 border-b border-hairline" />
        <div className="flex flex-1">
          <div className="w-[212px] border-r border-hairline p-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="mb-2.5 ml-6 aspect-video" />
            ))}
          </div>
          <div className="flex flex-1 items-center justify-center p-10">
            <Skeleton className="aspect-video w-full max-w-4xl" />
          </div>
          <div className="hidden w-[296px] border-l border-hairline lg:block" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <EditorTopbar />
      <div className="flex min-h-0 flex-1">
        <div className="hidden md:flex">
          <SlideNavigator />
        </div>
        <LiveViewport />
        <div className="hidden lg:flex">
          <VisualInspector />
        </div>
      </div>
    </div>
  );
}
