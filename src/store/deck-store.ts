"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ContentBlock,
  Deck,
  DeckTheme,
  DeckTier,
  Slide,
  ViewportMode,
} from "@/types/deck";
import { mockDeck } from "@/lib/mock-deck";
import { uid } from "@/lib/utils";

interface DeckStore {
  deck: Deck;
  activeSlideIndex: number;
  viewportMode: ViewportMode;
  isGenerating: boolean;
  rightPanelTab: "blocks" | "theme" | "tier" | "export";
  diagramStep: number;
  _hasHydrated: boolean;

  setHasHydrated: (value: boolean) => void;
  setDeck: (deck: Deck) => void;
  setTitle: (title: string) => void;
  setTier: (tier: DeckTier) => void;
  setTheme: (theme: Partial<DeckTheme>) => void;
  setActiveSlideIndex: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  setViewportMode: (mode: ViewportMode) => void;
  setIsGenerating: (value: boolean) => void;
  setRightPanelTab: (tab: DeckStore["rightPanelTab"]) => void;
  setDiagramStep: (step: number) => void;
  updateSlide: (slideId: string, patch: Partial<Slide>) => void;
  updateBlock: (
    slideId: string,
    blockId: string,
    patch: Partial<ContentBlock>
  ) => void;
  addSlide: (slide?: Partial<Slide>) => void;
  deleteSlide: (slideId: string) => void;
  reorderSlides: (from: number, to: number) => void;
  resetToMock: () => void;
}

function touch(deck: Deck): Deck {
  return { ...deck, updatedAt: new Date().toISOString() };
}

export const useDeckStore = create<DeckStore>()(
  persist(
    (set, get) => ({
      deck: mockDeck,
      activeSlideIndex: 0,
      viewportMode: "edit",
      isGenerating: false,
      rightPanelTab: "tier",
      diagramStep: 0,
      _hasHydrated: false,

      setHasHydrated: (_hasHydrated) => set({ _hasHydrated }),

      setDeck: (deck) =>
        set({ deck: touch(deck), activeSlideIndex: 0, diagramStep: 0 }),

      setTitle: (title) =>
        set((s) => ({ deck: touch({ ...s.deck, title }) })),

      setTier: (tier) =>
        set((s) => ({ deck: touch({ ...s.deck, tier }) })),

      setTheme: (theme) =>
        set((s) => ({
          deck: touch({
            ...s.deck,
            theme: {
              ...s.deck.theme,
              ...theme,
              colors: { ...s.deck.theme.colors, ...theme.colors },
              typography: {
                ...s.deck.theme.typography,
                ...theme.typography,
              },
            },
          }),
        })),

      setActiveSlideIndex: (index) => {
        const max = get().deck.slides.length - 1;
        set({
          activeSlideIndex: Math.max(0, Math.min(index, max)),
          diagramStep: 0,
        });
      },

      nextSlide: () => {
        const { activeSlideIndex, deck } = get();
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

      setViewportMode: (viewportMode) => set({ viewportMode }),
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      setRightPanelTab: (rightPanelTab) => set({ rightPanelTab }),
      setDiagramStep: (diagramStep) => set({ diagramStep }),

      updateSlide: (slideId, patch) =>
        set((s) => ({
          deck: touch({
            ...s.deck,
            slides: s.deck.slides.map((slide) =>
              slide.id === slideId ? { ...slide, ...patch } : slide
            ),
          }),
        })),

      updateBlock: (slideId, blockId, patch) =>
        set((s) => ({
          deck: touch({
            ...s.deck,
            slides: s.deck.slides.map((slide) => {
              if (slide.id !== slideId) return slide;
              return {
                ...slide,
                blocks: slide.blocks.map((block) =>
                  block.id === blockId ? { ...block, ...patch } : block
                ),
              };
            }),
          }),
        })),

      addSlide: (slide) =>
        set((s) => {
          const newSlide: Slide = {
            id: uid("slide"),
            layoutType: "title",
            headline: "New Slide",
            subheadline: "Add your message",
            blocks: [
              {
                id: uid("block"),
                type: "text",
                body: "Start writing…",
              },
            ],
            backgroundEffect: "gradient",
            transitionType: "fade",
            ...slide,
          };
          const slides = [...s.deck.slides, newSlide];
          return {
            deck: touch({ ...s.deck, slides }),
            activeSlideIndex: slides.length - 1,
          };
        }),

      deleteSlide: (slideId) =>
        set((s) => {
          if (s.deck.slides.length <= 1) return s;
          const slides = s.deck.slides.filter((slide) => slide.id !== slideId);
          const activeSlideIndex = Math.min(
            s.activeSlideIndex,
            slides.length - 1
          );
          return {
            deck: touch({ ...s.deck, slides }),
            activeSlideIndex,
          };
        }),

      reorderSlides: (from, to) =>
        set((s) => {
          const slides = [...s.deck.slides];
          const [moved] = slides.splice(from, 1);
          slides.splice(to, 0, moved);
          return {
            deck: touch({ ...s.deck, slides }),
            activeSlideIndex: to,
          };
        }),

      resetToMock: () =>
        set({
          deck: structuredClone(mockDeck),
          activeSlideIndex: 0,
          diagramStep: 0,
        }),
    }),
    {
      name: "aetherdeck-store",
      partialize: (state) => ({
        deck: state.deck,
        activeSlideIndex: state.activeSlideIndex,
        viewportMode: state.viewportMode,
        rightPanelTab: state.rightPanelTab,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export function selectActiveSlide(state: DeckStore): Slide {
  return state.deck.slides[state.activeSlideIndex] ?? state.deck.slides[0];
}
