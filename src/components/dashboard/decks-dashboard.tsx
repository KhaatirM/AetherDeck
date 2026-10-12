"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Plus, Search } from "lucide-react";
import type { Deck } from "@/types/deck";
import { selectSortedDecks, useDeckStore, useHydrated } from "@/store/deck-store";
import { TEMPLATES } from "@/lib/templates";
import { DeckCard } from "@/components/dashboard/deck-card";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { useShallow } from "zustand/react/shallow";

export function DecksDashboard() {
  const hydrated = useHydrated();
  const decks = useDeckStore(useShallow(selectSortedDecks));
  const renameDeck = useDeckStore((s) => s.renameDeck);
  const duplicateDeck = useDeckStore((s) => s.duplicateDeck);
  const deleteDeck = useDeckStore((s) => s.deleteDeck);

  const [query, setQuery] = useState("");
  const [renaming, setRenaming] = useState<Deck | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleting, setDeleting] = useState<Deck | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? decks.filter((d) => d.title.toLowerCase().includes(q)) : decks;
  }, [decks, query]);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-hairline bg-ink/75 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-3">
            <Logo showWordmark={false} className="md:hidden" />
            <h1 className="text-[14px] font-medium text-fg-primary">Decks</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-tertiary" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search decks"
                className="h-8 w-56 pl-8 text-[12.5px]"
              />
            </div>
            <Button size="sm" asChild>
              <Link href="/new">
                <Plus /> New deck
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24 pt-10">
        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-[22px] font-semibold tracking-[-0.03em] text-fg-primary">Your decks</h2>
              <p className="mt-1 text-[13px] text-fg-tertiary">
                {hydrated ? `${decks.length} ${decks.length === 1 ? "deck" : "decks"}` : "\u00a0"}
              </p>
            </div>
          </div>

          {!hydrated ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-surface-1 p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
                  <Skeleton className="aspect-video w-full rounded-[10px]" />
                  <Skeleton className="mx-2 mt-4 h-3.5 w-2/3" />
                  <Skeleton className="mx-2 mb-2 mt-2.5 h-3 w-1/3" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState searching={Boolean(query)} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((deck, i) => (
                <motion.div
                  key={deck.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay: Math.min(i, 8) * 0.04 }}
                >
                  <DeckCard
                    deck={deck}
                    onRename={(d) => {
                      setRenaming(d);
                      setRenameValue(d.title);
                    }}
                    onDuplicate={(d) => duplicateDeck(d.id)}
                    onDelete={(d) => setDeleting(d)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-16">
          <h2 className="text-[15px] font-medium text-fg-primary">Start from a template</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TEMPLATES.map((template) => (
              <Link
                key={template.id}
                href={`/new?template=${template.id}`}
                className="group flex items-center justify-between gap-3 rounded-xl bg-surface-1 px-4 py-3.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] transition-all hover:bg-surface-2 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
              >
                <div className="min-w-0">
                  <div className="text-[13px] font-medium text-fg-primary">{template.name}</div>
                  <div className="truncate text-[12px] text-fg-tertiary">{template.blurb}</div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-fg-tertiary transition-transform group-hover:translate-x-0.5 group-hover:text-fg-primary" />
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Dialog open={Boolean(renaming)} onOpenChange={(open) => !open && setRenaming(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename deck</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (renaming && renameValue.trim()) renameDeck(renaming.id, renameValue.trim());
              setRenaming(null);
            }}
            className="flex flex-col gap-5"
          >
            <Input autoFocus value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setRenaming(null)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete “{deleting?.title}”?</DialogTitle>
            <DialogDescription>This removes the deck from this browser. It can’t be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (deleting) deleteDeck(deleting.id);
                setDeleting(null);
              }}
            >
              Delete deck
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function EmptyState({ searching }: { searching: boolean }) {
  return (
    <div className="bg-noise relative flex flex-col items-center overflow-hidden rounded-2xl border border-dashed border-white/10 px-6 py-20 text-center">
      <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,108,255,0.18),transparent)]" />
      <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
        {searching ? <Search className="h-4 w-4 text-fg-secondary" /> : <Plus className="h-4 w-4 text-accent-soft" />}
      </div>
      <h3 className="relative mt-5 text-[15px] font-medium text-fg-primary">
        {searching ? "No decks match your search" : "No decks yet"}
      </h3>
      <p className="relative mt-1.5 max-w-xs text-[13px] leading-relaxed text-fg-tertiary">
        {searching
          ? "Try a different title."
          : "Describe your idea and AetherDeck will write, design and stage it for you."}
      </p>
      {!searching ? (
        <Button className="relative mt-6" size="sm" asChild>
          <Link href="/new">
            <Plus /> Create your first deck
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
