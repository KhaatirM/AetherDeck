import type { Deck, DeckTier, GenerateDeckRequest, TemplatePreset } from "@/types/deck";
import { aetherDarkTheme } from "@/lib/mock-deck";
import { uid } from "@/lib/utils";

export function buildFallbackDeck(request: GenerateDeckRequest): Deck {
  const topic = request.prompt.trim().slice(0, 80) || "Untitled Vision";
  const now = new Date().toISOString();
  const tier = request.tier;
  const template = request.template ?? "product-launch";

  return {
    id: uid("deck"),
    title: titleFromPrompt(topic, template),
    description: `Generated locally from: ${topic}`,
    theme: {
      ...aetherDarkTheme,
      name:
        template === "cinematic-keynote"
          ? "Cinema Night"
          : template === "lecture"
            ? "Lecture Glow"
            : "Aether Night",
    },
    tier,
    createdAt: now,
    updatedAt: now,
    slides: slidesForTemplate(template, topic, tier),
  };
}

function titleFromPrompt(topic: string, template: TemplatePreset): string {
  if (topic.length > 4) return topic.replace(/\.$/, "");
  switch (template) {
    case "pitch-deck":
      return "Investor Pitch";
    case "lecture":
      return "Lecture Deck";
    case "cinematic-keynote":
      return "Cinematic Keynote";
    default:
      return "Product Launch";
  }
}

function slidesForTemplate(
  template: TemplatePreset,
  topic: string,
  tier: DeckTier
): Deck["slides"] {
  const bg =
    tier === "pro"
      ? ("starfield" as const)
      : tier === "plus"
        ? ("aurora" as const)
        : ("gradient" as const);

  const base = [
    {
      id: uid("slide"),
      layoutType: "title" as const,
      headline: topic.length > 60 ? topic.slice(0, 57) + "…" : topic,
      subheadline: subtitle(template),
      backgroundEffect: bg,
      transitionType: "cinematic-zoom" as const,
      notes: "Open strong. Own the silence after the first line.",
      blocks: [
        {
          id: uid("block"),
          type: "text" as const,
          body: "Crafted by AetherDeck · mock generation (no API key required).",
        },
      ],
    },
    {
      id: uid("slide"),
      layoutType: "split" as const,
      headline: "The Opportunity",
      subheadline: "Why this story matters now.",
      backgroundEffect: "gradient" as const,
      transitionType: "slide" as const,
      blocks: [
        {
          id: uid("block"),
          type: "card" as const,
          title: "Context",
          body: `Audiences are saturated. ${topic} needs presence, not more slides.`,
          items: ["Attention is scarce", "Emotion beats bullets", "Tiered visuals win"],
        },
        {
          id: uid("block"),
          type: "card" as const,
          title: "Approach",
          body: "Structure the narrative, then render with the right cinematic intensity.",
          items: ["Prompt → structure", "Blocks → motion", "Export → stage"],
        },
      ],
    },
    {
      id: uid("slide"),
      layoutType: "grid-3" as const,
      headline: template === "pitch-deck" ? "Market Wedges" : "Core Pillars",
      subheadline: "Three ideas to remember.",
      backgroundEffect: "cyber-grid" as const,
      transitionType: "morph" as const,
      blocks: [
        {
          id: uid("block"),
          type: "card" as const,
          title: "Clarity",
          body: "Every frame has one job.",
          accentColor: "#06B6D4",
        },
        {
          id: uid("block"),
          type: "card" as const,
          title: "Motion",
          body: "Plus-tier reveals guide attention.",
          accentColor: "#8B5CF6",
        },
        {
          id: uid("block"),
          type: "card" as const,
          title: "Immersion",
          body: "Pro-tier worlds make moments land.",
          accentColor: "#F472B6",
        },
      ],
    },
    {
      id: uid("slide"),
      layoutType: "stat-callout" as const,
      headline: template === "lecture" ? "Key Takeaways" : "Traction Signals",
      backgroundEffect: "color" as const,
      transitionType: "fade" as const,
      blocks: [
        {
          id: uid("block"),
          type: "stat" as const,
          value: "01",
          label: "Narrative arc defined",
        },
        {
          id: uid("block"),
          type: "stat" as const,
          value: "02",
          label: "Visual tier selected",
        },
        {
          id: uid("block"),
          type: "stat" as const,
          value: "03",
          label: "Ready to present",
        },
      ],
    },
    {
      id: uid("slide"),
      layoutType: "timeline" as const,
      headline: template === "product-launch" ? "Launch Path" : "Journey",
      subheadline: "A clear sequence from idea to impact.",
      backgroundEffect: "gradient" as const,
      transitionType: "slide" as const,
      blocks: [
        {
          id: uid("block"),
          type: "timeline-item" as const,
          title: "Discover",
          body: "Capture the prompt and audience.",
          stepIndex: 0,
        },
        {
          id: uid("block"),
          type: "timeline-item" as const,
          title: "Design",
          body: "Compose layouts, blocks, and transitions.",
          stepIndex: 1,
        },
        {
          id: uid("block"),
          type: "timeline-item" as const,
          title: "Deliver",
          body: "Present live or export to PPTX / PDF.",
          stepIndex: 2,
        },
      ],
    },
    {
      id: uid("slide"),
      layoutType: "cinematic-canvas" as const,
      headline: "The Moment",
      subheadline: "This is where Pro tier breathes.",
      backgroundEffect: "floating-orbs" as const,
      transitionType: "camera-pan" as const,
      blocks: [
        {
          id: uid("block"),
          type: "quote" as const,
          title: "Principle",
          body: "If the room feels something, the deck succeeded.",
        },
        {
          id: uid("block"),
          type: "diagram-step" as const,
          title: "Atmosphere",
          body: "Light, particles, and depth frame the message.",
          stepIndex: 0,
        },
      ],
    },
    {
      id: uid("slide"),
      layoutType: "title" as const,
      headline: closing(template),
      subheadline: "Switch tiers live. Export when ready.",
      backgroundEffect: "aurora" as const,
      transitionType: "cinematic-zoom" as const,
      blocks: [
        {
          id: uid("block"),
          type: "bullet-list" as const,
          items: [
            "Edit blocks in the inspector",
            "Present fullscreen with keyboard control",
            "Export Web · PDF · PPTX",
          ],
        },
      ],
    },
  ];

  return base;
}

function subtitle(template: TemplatePreset): string {
  switch (template) {
    case "pitch-deck":
      return "A concise investor narrative generated for AetherDeck.";
    case "lecture":
      return "A teaching arc with clear beats and memorable visuals.";
    case "cinematic-keynote":
      return "A keynote built for emotion, pacing, and stage presence.";
    default:
      return "A launch story with product clarity and cinematic polish.";
  }
}

function closing(template: TemplatePreset): string {
  switch (template) {
    case "pitch-deck":
      return "Let's Build the Future";
    case "lecture":
      return "Questions & Discussion";
    case "cinematic-keynote":
      return "The Story Continues";
    default:
      return "Launch With Confidence";
  }
}
