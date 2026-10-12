"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ContentBlock,
  Deck,
  DeckTheme,
  DeckTier,
  Slide,
} from "@/types/deck";
import { mockDeck, seedDecks } from "@/lib/mock-deck";
import { uid } from "@/lib/utils";

export type InspectorTab = "design" | "content" | "theme";

interface DeckStore {
  decks: Record<string, Deck>;
  activeDeckId: string | null;
  activeSlideIndex: number;
  diagramStep: number;
  isGenerating: boolean;
  inspectorTab: InspectorTab;
  aiDrawerOpen: boolean;

  createDeck: (deck: Deck) => string;
  duplicateDeck: (deckId: string) => string | null;
  deleteDeck: (deckId: string) => void;
  renameDeck: (deckId: string, title: string) => void;
  openDeck: (deckId: string) => boolean;

  setTier: (tier: DeckTier) => void;
  setTheme: (theme: Partial<DeckTheme>) => void;
  setActiveSlideIndex: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  setDiagramStep: (step: number) => void;
  setIsGenerating: (value: boolean) => void;
  setInspectorTab: (tab: InspectorTab) => void;
  setAiDrawerOpen: (open: boolean) => void;
  updateSlide: (slideId: string, patch: Partial<Slide>) => void;
  updateBlock: (slideId: string, blockId: string, patch: Partial<ContentBlock>) => void;
  addSlide: (slide?: Partial<Slide>) => void;
  duplicateSlide: (slideId: string) => void;
  deleteSlide: (slideId: string) => void;
  resetDemo: () => void;
}

type PersistedState = Pick<DeckStore, "decks" | "activeDeckId" | "inspectorTab">;

function stamp(deck: Deck): Deck {
  return { ...deck, updatedAt: new Date().toISOString() };
}

function initialDecks(): Record<string, Deck> {
  return Object.fromEntries(seedDecks().map((deck) => [deck.id, deck]));
}

export const useDeckStore = create<DeckStore>()(
  persist(
    (set, get) => {
      /** Applies a change to the active deck and bumps its updatedAt. */
      const mutateActive = (fn: (deck: Deck) => Deck) => {
        const { activeDeckId, decks } = get();
        if (!activeDeckId || !decks[activeDeckId]) return;
        set({ decks: { ...decks, [activeDeckId]: stamp(fn(decks[activeDeckId])) } });
      };

      return {
        decks: initialDecks(),
        activeDeckId: mockDeck.id,
        activeSlideIndex: 0,
        diagramStep: 0,
        isGenerating: false,
        inspectorTab: "design",
        aiDrawerOpen: false,

        createDeck: (deck) => {
          set((s) => ({
            decks: { ...s.decks, [deck.id]: deck },
            activeDeckId: deck.id,
            activeSlideIndex: 0,
            diagramStep: 0,
          }));
          return deck.id;
        },

        duplicateDeck: (deckId) => {
          const source = get().decks[deckId];
          if (!source) return null;
          const now = new Date().toISOString();
          const copy: Deck = {
            ...structuredClone(source),
            id: uid("deck"),
            title: `${source.title} (copy)`,
            createdAt: now,
            updatedAt: now,
          };
          set((s) => ({ decks: { ...s.decks, [copy.id]: copy } }));
          return copy.id;
        },

        deleteDeck: (deckId) =>
          set((s) => {
            const decks = { ...s.decks };
            delete decks[deckId];
            return {
              decks,
              activeDeckId: s.activeDeckId === deckId ? null : s.activeDeckId,
            };
          }),

        renameDeck: (deckId, title) =>
          set((s) => {
            const deck = s.decks[deckId];
            if (!deck) return s;
            return { decks: { ...s.decks, [deckId]: stamp({ ...deck, title }) } };
          }),

        openDeck: (deckId) => {
          if (!get().decks[deckId]) return false;
          if (get().activeDeckId !== deckId) {
            set({ activeDeckId: deckId, activeSlideIndex: 0, diagramStep: 0 });
          }
          return true;
        },

        setTier: (tier) => mutateActive((deck) => ({ ...deck, tier })),

        setTheme: (theme) =>
          mutateActive((deck) => ({
            ...deck,
            theme: {
              ...deck.theme,
              ...theme,
              colors: { ...deck.theme.colors, ...theme.colors },
              typography: { ...deck.theme.typography, ...theme.typography },
            },
          })),

        setActiveSlideIndex: (index) => {
          const deck = selectActiveDeck(get());
          const max = deck.slides.length - 1;
          set({ activeSlideIndex: Math.max(0, Math.min(index, max)), diagramStep: 0 });
        },

        nextSlide: () => {
          const { activeSlideIndex } = get();
          const deck = selectActiveDeck(get());
          if (activeSlideIndex < deck.slides.length - 1) {
            set({ activeSlideIndex: activeSlideIndex + 1, diagramStep: 0 });
          }
        },

        prevSlide: () => {
          const { activeSlideIndex } = get();
          if (activeSlideIndex > 0) {
            set({ activeSlideIndex: activeSlideIndex - 1, diagramStep: 0 });
          }
        },

        setDiagramStep: (diagramStep) => set({ diagramStep }),
        setIsGenerating: (isGenerating) => set({ isGenerating }),
        setInspectorTab: (inspectorTab) => set({ inspectorTab }),
        setAiDrawerOpen: (aiDrawerOpen) => set({ aiDrawerOpen }),

        updateSlide: (slideId, patch) =>
          mutateActive((deck) => ({
            ...deck,
            slides: deck.slides.map((slide) =>
              slide.id === slideId ? { ...slide, ...patch } : slide
            ),
          })),

        updateBlock: (slideId, blockId, patch) =>
          mutateActive((deck) => ({
            ...deck,
            slides: deck.slides.map((slide) =>
              slide.id !== slideId
                ? slide
                : {
                    ...slide,
                    blocks: slide.blocks.map((block) =>
                      block.id === blockId ? { ...block, ...patch } : block
                    ),
                  }
            ),
          })),

        addSlide: (slide) => {
          const newSlide: Slide = {
            id: uid("slide"),
            layoutType: "title",
            headline: "Untitled slide",
            subheadline: "Add a supporting line",
            blocks: [{ id: uid("block"), type: "text", body: "Start writing…" }],
            backgroundEffect: "gradient",
            transitionType: "fade",
            ...slide,
          };
          const insertAt = get().activeSlideIndex + 1;
          mutateActive((deck) => {
            const slides = [...deck.slides];
            slides.splice(insertAt, 0, newSlide);
            return { ...deck, slides };
          });
          set({ activeSlideIndex: insertAt, diagramStep: 0 });
        },

        duplicateSlide: (slideId) => {
          const deck = selectActiveDeck(get());
          const index = deck.slides.findIndex((s) => s.id === slideId);
          if (index < 0) return;
          const source = deck.slides[index];
          const copy: Slide = {
            ...structuredClone(source),
            id: uid("slide"),
            blocks: source.blocks.map((b) => ({ ...b, id: uid("block") })),
          };
          mutateActive((d) => {
            const slides = [...d.slides];
            slides.splice(index + 1, 0, copy);
            return { ...d, slides };
          });
          set({ activeSlideIndex: index + 1, diagramStep: 0 });
        },

        deleteSlide: (slideId) => {
          const deck = selectActiveDeck(get());
          if (deck.slides.length <= 1) return;
          mutateActive((d) => ({ ...d, slides: d.slides.filter((s) => s.id !== slideId) }));
          set((s) => ({
            activeSlideIndex: Math.min(s.activeSlideIndex, deck.slides.length - 2),
            diagramStep: 0,
          }));
        },

        resetDemo: () =>
          set((s) => ({
            decks: { ...s.decks, [mockDeck.id]: structuredClone(mockDeck) },
            activeDeckId: mockDeck.id,
            activeSlideIndex: 0,
            diagramStep: 0,
          })),
      };
    },
    {
      name: "aetherdeck-store",
      version: 1,
      partialize: (state): PersistedState => ({
        decks: state.decks,
        activeDeckId: state.activeDeckId,
        inspectorTab: state.inspectorTab,
      }),
      migrate: (persisted, version): PersistedState => {
        const state = (persisted ?? {}) as Partial<PersistedState> & { deck?: Deck };
        if (version === 0 && state.deck) {
          return {
            decks: { ...initialDecks(), [state.deck.id]: state.deck },
            activeDeckId: state.deck.id,
            inspectorTab: "design",
          };
        }
        return {
          decks: state.decks ?? initialDecks(),
          activeDeckId: state.activeDeckId ?? mockDeck.id,
          inspectorTab: state.inspectorTab ?? "design",
        };
      },
    }
  )
);

export function selectActiveDeck(state: Pick<DeckStore, "decks" | "activeDeckId">): Deck {
  return (state.activeDeckId && state.decks[state.activeDeckId]) || mockDeck;
}

export function selectActiveSlide(
  state: Pick<DeckStore, "decks" | "activeDeckId" | "activeSlideIndex">
): Slide {
  const deck = selectActiveDeck(state);
  return deck.slides[state.activeSlideIndex] ?? deck.slides[0];
}

export function selectSortedDecks(state: Pick<DeckStore, "decks">): Deck[] {
  return Object.values(state.decks).sort(
    (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
  );
}

const noopSubscribe = () => () => {};

/**
 * True only after the client has mounted and localStorage has been read,
 * so persisted UI never renders during SSR or the hydration pass.
 */
export function useHydrated(): boolean {
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const rehydrated = useSyncExternalStore(
    (onChange) => useDeckStore.persist.onFinishHydration(onChange),
    () => useDeckStore.persist.hasHydrated(),
    () => false
  );
  return mounted && rehydrated;
}
