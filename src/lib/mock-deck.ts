import type { Deck, DeckTheme } from "@/types/deck";

export const aetherDarkTheme: DeckTheme = {
  name: "Aether Night",
  mode: "dark",
  colors: {
    primary: "#8B5CF6",
    secondary: "#06B6D4",
    accent: "#F472B6",
    background: "#070A12",
    foreground: "#F8FAFC",
    muted: "#94A3B8",
    card: "rgba(15, 23, 42, 0.72)",
    border: "rgba(148, 163, 184, 0.18)",
  },
  typography: {
    headingFont: "var(--font-display)",
    bodyFont: "var(--font-sans)",
    scale: "dramatic",
  },
  ambientStyle: "cinematic",
};

export const mockDeck: Deck = {
  id: "deck_aether_demo",
  title: "AetherDeck — Present Beyond Slides",
  description:
    "A cinematic multi-tier presentation experience that redefines how ideas move.",
  theme: aetherDarkTheme,
  tier: "plus",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  slides: [
    {
      id: "slide_01",
      layoutType: "title",
      headline: "Present Beyond Slides",
      subheadline:
        "AetherDeck turns prompts into living decks — Minimalist, Fluid, or fully Cinematic.",
      backgroundEffect: "aurora",
      transitionType: "cinematic-zoom",
      notes: "Open with energy. Pause after the tagline.",
      blocks: [
        {
          id: "b1",
          type: "text",
          body: "Three visual tiers. One coherent storytelling system.",
        },
      ],
    },
    {
      id: "slide_02",
      layoutType: "split",
      headline: "The Problem With Presentations",
      subheadline: "Static decks flatten ideas that deserve motion and depth.",
      backgroundEffect: "gradient",
      transitionType: "slide",
      notes: "Contrast old vs new presentation culture.",
      blocks: [
        {
          id: "b2",
          type: "card",
          title: "Yesterday",
          body: "Bullet dumps, clipart, and click-through fatigue.",
          items: ["Flat layouts", "No motion hierarchy", "Weak emotional arc"],
        },
        {
          id: "b3",
          type: "card",
          title: "Tomorrow",
          body: "Story-first decks with tiered cinematic rendering.",
          items: ["Modular blocks", "Fluid motion", "Immersive 3D scenes"],
        },
      ],
    },
    {
      id: "slide_03",
      layoutType: "grid-3",
      headline: "Three Cinematic Tiers",
      subheadline: "Pick the intensity that matches your audience.",
      backgroundEffect: "cyber-grid",
      transitionType: "morph",
      blocks: [
        {
          id: "b4",
          type: "card",
          title: "Basic",
          body: "Modern minimalist cards, grids, and crisp typography.",
          icon: "sparkles",
          accentColor: "#06B6D4",
        },
        {
          id: "b5",
          type: "card",
          title: "Plus",
          body: "Framer Motion reveals, morphing layouts, and step diagrams.",
          icon: "zap",
          accentColor: "#8B5CF6",
        },
        {
          id: "b6",
          type: "card",
          title: "Pro",
          body: "WebGL worlds, depth cameras, particles, and ambient light.",
          icon: "orbit",
          accentColor: "#F472B6",
        },
      ],
    },
    {
      id: "slide_04",
      layoutType: "stat-callout",
      headline: "Built for Impact",
      subheadline: "Numbers that land with presence.",
      backgroundEffect: "color",
      transitionType: "fade",
      blocks: [
        {
          id: "b7",
          type: "stat",
          value: "3×",
          label: "Higher retention with motion storytelling",
        },
        {
          id: "b8",
          type: "stat",
          value: "40s",
          label: "Average time from prompt to first deck",
        },
        {
          id: "b9",
          type: "stat",
          value: "100%",
          label: "Exportable to Web, PDF, and PPTX",
        },
      ],
    },
    {
      id: "slide_05",
      layoutType: "timeline",
      headline: "From Prompt to Stage",
      subheadline: "A clean pipeline from idea to immersive delivery.",
      backgroundEffect: "gradient",
      transitionType: "slide",
      blocks: [
        {
          id: "b10",
          type: "timeline-item",
          title: "Prompt",
          body: "Describe the narrative or paste an outline.",
          stepIndex: 0,
        },
        {
          id: "b11",
          type: "timeline-item",
          title: "Structure",
          body: "AI returns typed slides, blocks, and transitions.",
          stepIndex: 1,
        },
        {
          id: "b12",
          type: "timeline-item",
          title: "Render",
          body: "Choose Basic, Plus, or Pro visual intensity.",
          stepIndex: 2,
        },
        {
          id: "b13",
          type: "timeline-item",
          title: "Present",
          body: "Fullscreen player with keyboard-native control.",
          stepIndex: 3,
        },
      ],
    },
    {
      id: "slide_06",
      layoutType: "cinematic-canvas",
      headline: "Enter the Pro Experience",
      subheadline: "Depth. Light. Atmosphere. Your ideas deserve a stage.",
      backgroundEffect: "starfield",
      transitionType: "camera-pan",
      notes: "Let the starfield breathe before advancing.",
      blocks: [
        {
          id: "b14",
          type: "quote",
          body: "A presentation should feel like a short film — not a spreadsheet.",
          title: "Design Principle",
        },
        {
          id: "b15",
          type: "diagram-step",
          title: "Camera Travel",
          body: "Each slide advances the virtual camera through space.",
          stepIndex: 0,
        },
        {
          id: "b16",
          type: "diagram-step",
          title: "Ambient Layers",
          body: "Particles, orbs, and aurora respond to theme accents.",
          stepIndex: 1,
        },
      ],
    },
    {
      id: "slide_07",
      layoutType: "title",
      headline: "Ready to Build?",
      subheadline: "Generate a deck, switch tiers live, and export anywhere.",
      backgroundEffect: "floating-orbs",
      transitionType: "cinematic-zoom",
      blocks: [
        {
          id: "b17",
          type: "bullet-list",
          items: [
            "AI outline → structured Deck JSON",
            "Live tier switching in the editor",
            "Web player · PDF · PPTX exports",
          ],
        },
      ],
    },
  ],
};

export function cloneMockDeck(overrides?: Partial<Deck>): Deck {
  return {
    ...structuredClone(mockDeck),
    id: `deck_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}
