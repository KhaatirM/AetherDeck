import type { Deck } from "@/types/deck";
import { aetherTheme } from "@/lib/themes";
import { buildFallbackDeck } from "@/lib/ai/fallback-deck";

/** Fixed timestamp so seeded decks render identically on server and client. */
const SEED_TIME = "2026-01-01T00:00:00.000Z";

export const mockDeck: Deck = {
  id: "deck_aether_demo",
  title: "AetherDeck — Present beyond slides",
  description: "A cinematic multi-tier presentation experience that redefines how ideas move.",
  theme: aetherTheme,
  tier: "plus",
  createdAt: SEED_TIME,
  updatedAt: SEED_TIME,
  slides: [
    {
      id: "slide_01",
      layoutType: "title",
      headline: "Present beyond slides",
      subheadline:
        "AetherDeck turns a single prompt into a living deck. Minimal, fluid, or fully cinematic.",
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
      headline: "Slides stopped evolving",
      subheadline: "Static decks flatten ideas that deserve motion and depth.",
      backgroundEffect: "gradient",
      transitionType: "slide",
      notes: "Contrast old versus new presentation culture.",
      blocks: [
        {
          id: "b2",
          type: "card",
          title: "Yesterday",
          body: "Bullet dumps, clip art, and click-through fatigue.",
          items: ["Flat layouts", "No motion hierarchy", "Weak emotional arc"],
        },
        {
          id: "b3",
          type: "card",
          title: "Tomorrow",
          body: "Story-first decks with tiered cinematic rendering.",
          items: ["Modular blocks", "Directed motion", "Immersive 3D scenes"],
        },
      ],
    },
    {
      id: "slide_03",
      layoutType: "grid-3",
      headline: "Three cinematic tiers",
      subheadline: "Choose the intensity that matches the room.",
      backgroundEffect: "cyber-grid",
      transitionType: "morph",
      blocks: [
        {
          id: "b4",
          type: "card",
          title: "Basic",
          body: "Minimal cards, grids and crisp typography.",
          icon: "sparkles",
          accentColor: "#5EE7F2",
        },
        {
          id: "b5",
          type: "card",
          title: "Plus",
          body: "Choreographed reveals, morphing layouts and step diagrams.",
          icon: "zap",
          accentColor: "#7C6CFF",
        },
        {
          id: "b6",
          type: "card",
          title: "Pro",
          body: "Real-time WebGL worlds, depth cameras and ambient light.",
          icon: "orbit",
          accentColor: "#B4A9FF",
        },
      ],
    },
    {
      id: "slide_04",
      layoutType: "stat-callout",
      headline: "Built for impact",
      subheadline: "Numbers that land with presence.",
      backgroundEffect: "color",
      transitionType: "fade",
      blocks: [
        { id: "b7", type: "stat", value: "3×", label: "Higher retention with motion storytelling" },
        { id: "b8", type: "stat", value: "40s", label: "From prompt to first draft" },
        { id: "b9", type: "stat", value: "100%", label: "Exportable to web, PDF and PPTX" },
      ],
    },
    {
      id: "slide_05",
      layoutType: "timeline",
      headline: "From prompt to stage",
      subheadline: "A clean pipeline from idea to immersive delivery.",
      backgroundEffect: "gradient",
      transitionType: "slide",
      blocks: [
        { id: "b10", type: "timeline-item", title: "Prompt", body: "Describe the narrative or paste an outline.", stepIndex: 0 },
        { id: "b11", type: "timeline-item", title: "Structure", body: "AI returns typed slides, blocks and transitions.", stepIndex: 1 },
        { id: "b12", type: "timeline-item", title: "Render", body: "Choose Basic, Plus or Pro visual intensity.", stepIndex: 2 },
        { id: "b13", type: "timeline-item", title: "Present", body: "A fullscreen player with keyboard-native control.", stepIndex: 3 },
      ],
    },
    {
      id: "slide_06",
      layoutType: "cinematic-canvas",
      headline: "Enter the Pro experience",
      subheadline: "Depth. Light. Atmosphere. Your ideas deserve a stage.",
      backgroundEffect: "starfield",
      transitionType: "camera-pan",
      notes: "Let the starfield breathe before advancing.",
      blocks: [
        {
          id: "b14",
          type: "quote",
          body: "A presentation should feel like a short film, not a spreadsheet.",
          title: "Design principle",
        },
        {
          id: "b15",
          type: "diagram-step",
          title: "Camera travel",
          body: "Each slide advances the virtual camera through space.",
          stepIndex: 0,
        },
        {
          id: "b16",
          type: "diagram-step",
          title: "Ambient layers",
          body: "Particles, orbs and aurora respond to theme accents.",
          stepIndex: 1,
        },
      ],
    },
    {
      id: "slide_07",
      layoutType: "title",
      headline: "Ready when you are",
      subheadline: "Generate a deck, switch tiers live, and export anywhere.",
      backgroundEffect: "floating-orbs",
      transitionType: "cinematic-zoom",
      blocks: [
        {
          id: "b17",
          type: "bullet-list",
          items: [
            "AI outline to structured deck",
            "Live tier switching in the editor",
            "Web player, PDF and PPTX export",
          ],
        },
      ],
    },
  ],
};

export function seedDecks(): Deck[] {
  return [
    mockDeck,
    buildFallbackDeck(
      {
        prompt: "NebulaForge Series A",
        tier: "pro",
        template: "pitch-deck",
      },
      { idPrefix: "seed_pitch", now: "2025-12-30T15:20:00.000Z" }
    ),
    buildFallbackDeck(
      {
        prompt: "Generative storytelling 101",
        tier: "basic",
        template: "lecture",
      },
      { idPrefix: "seed_lecture", now: "2025-12-27T09:45:00.000Z" }
    ),
  ];
}
