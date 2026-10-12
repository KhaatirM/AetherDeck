import type {
  Deck,
  DeckTheme,
  DeckTier,
  GenerateDeckRequest,
  Slide,
  TemplatePreset,
} from "@/types/deck";
import { aetherTheme, emberTheme, glacierTheme } from "@/lib/themes";
import { uid } from "@/lib/utils";

interface BuildOptions {
  /** Deterministic ids and timestamps, used for seeded decks rendered on the server. */
  idPrefix?: string;
  now?: string;
}

export function buildFallbackDeck(
  request: GenerateDeckRequest,
  options: BuildOptions = {}
): Deck {
  let counter = 0;
  const makeId = (kind: string): string =>
    options.idPrefix ? `${options.idPrefix}_${kind}_${counter++}` : uid(kind);

  const topic = request.prompt.trim() || "Untitled vision";
  const now = options.now ?? new Date().toISOString();
  const template = request.template ?? "product-launch";

  return {
    id: options.idPrefix ? `${options.idPrefix}_deck` : uid("deck"),
    title: titleFromPrompt(topic, template),
    description: topic,
    theme: themeForTemplate(template),
    tier: request.tier,
    createdAt: now,
    updatedAt: now,
    slides: slidesForTemplate(template, titleFromPrompt(topic, template), request.tier, makeId),
  };
}

export function titleFromPrompt(prompt: string, template: TemplatePreset): string {
  const cleaned = prompt
    .replace(/^(please\s+)?(create|make|build|generate|write)\s+(me\s+)?(an?|the)\s+/i, "")
    .replace(/\s+(deck|presentation|keynote)\b/i, "")
    .split(/[.!?\n]/)[0]
    .trim();

  if (cleaned.length >= 4) {
    const clipped = cleaned.length > 56 ? `${cleaned.slice(0, 54).trimEnd()}…` : cleaned;
    return clipped.charAt(0).toUpperCase() + clipped.slice(1);
  }

  switch (template) {
    case "pitch-deck":
      return "Investor pitch";
    case "lecture":
      return "Lecture";
    case "cinematic-keynote":
      return "Cinematic keynote";
    default:
      return "Product launch";
  }
}

function themeForTemplate(template: TemplatePreset): DeckTheme {
  switch (template) {
    case "cinematic-keynote":
      return emberTheme;
    case "lecture":
      return glacierTheme;
    default:
      return aetherTheme;
  }
}

function slidesForTemplate(
  template: TemplatePreset,
  title: string,
  tier: DeckTier,
  makeId: (kind: string) => string
): Slide[] {
  const heroBg = tier === "pro" ? "starfield" : tier === "plus" ? "aurora" : "gradient";
  const copy = TEMPLATE_COPY[template];

  return [
    {
      id: makeId("slide"),
      layoutType: "title",
      headline: title,
      subheadline: copy.subtitle,
      backgroundEffect: heroBg,
      transitionType: "cinematic-zoom",
      notes: "Open strong. Let the title sit for a beat before you speak.",
      blocks: [{ id: makeId("block"), type: "text", body: copy.kicker }],
    },
    {
      id: makeId("slide"),
      layoutType: "split",
      headline: copy.problemHeadline,
      subheadline: copy.problemSub,
      backgroundEffect: "gradient",
      transitionType: "slide",
      notes: "Frame the tension before offering the resolution.",
      blocks: [
        {
          id: makeId("block"),
          type: "card",
          title: "Today",
          body: copy.today,
          items: copy.todayItems,
        },
        {
          id: makeId("block"),
          type: "card",
          title: "Tomorrow",
          body: copy.tomorrow,
          items: copy.tomorrowItems,
        },
      ],
    },
    {
      id: makeId("slide"),
      layoutType: "grid-3",
      headline: copy.pillarsHeadline,
      subheadline: "Three ideas worth remembering.",
      backgroundEffect: "cyber-grid",
      transitionType: "morph",
      blocks: copy.pillars.map((pillar, i) => ({
        id: makeId("block"),
        type: "card" as const,
        title: pillar.title,
        body: pillar.body,
        accentColor: ["#5EE7F2", "#7C6CFF", "#B4A9FF"][i],
      })),
    },
    {
      id: makeId("slide"),
      layoutType: "stat-callout",
      headline: copy.statsHeadline,
      backgroundEffect: "color",
      transitionType: "fade",
      blocks: copy.stats.map((stat) => ({
        id: makeId("block"),
        type: "stat" as const,
        value: stat.value,
        label: stat.label,
      })),
    },
    {
      id: makeId("slide"),
      layoutType: "timeline",
      headline: copy.timelineHeadline,
      subheadline: "A clear sequence from idea to impact.",
      backgroundEffect: "gradient",
      transitionType: "slide",
      blocks: copy.timeline.map((step, i) => ({
        id: makeId("block"),
        type: "timeline-item" as const,
        title: step.title,
        body: step.body,
        stepIndex: i,
      })),
    },
    {
      id: makeId("slide"),
      layoutType: "cinematic-canvas",
      headline: copy.momentHeadline,
      subheadline: copy.momentSub,
      backgroundEffect: "floating-orbs",
      transitionType: "camera-pan",
      notes: "Slow down here. This is the emotional peak.",
      blocks: [
        { id: makeId("block"), type: "quote", title: "Principle", body: copy.quote },
        {
          id: makeId("block"),
          type: "diagram-step",
          title: "Atmosphere",
          body: "Light, depth and motion frame the message.",
          stepIndex: 0,
        },
        {
          id: makeId("block"),
          type: "diagram-step",
          title: "Resolution",
          body: "The audience leaves with one clear idea.",
          stepIndex: 1,
        },
      ],
    },
    {
      id: makeId("slide"),
      layoutType: "title",
      headline: copy.closing,
      subheadline: copy.closingSub,
      backgroundEffect: "aurora",
      transitionType: "cinematic-zoom",
      blocks: [{ id: makeId("block"), type: "bullet-list", items: copy.closingItems }],
    },
  ];
}

interface TemplateCopy {
  subtitle: string;
  kicker: string;
  problemHeadline: string;
  problemSub: string;
  today: string;
  todayItems: string[];
  tomorrow: string;
  tomorrowItems: string[];
  pillarsHeadline: string;
  pillars: { title: string; body: string }[];
  statsHeadline: string;
  stats: { value: string; label: string }[];
  timelineHeadline: string;
  timeline: { title: string; body: string }[];
  momentHeadline: string;
  momentSub: string;
  quote: string;
  closing: string;
  closingSub: string;
  closingItems: string[];
}

const TEMPLATE_COPY: Record<TemplatePreset, TemplateCopy> = {
  "pitch-deck": {
    subtitle: "A focused investor narrative: problem, wedge, traction, and the ask.",
    kicker: "Seed to Series A · Confidential",
    problemHeadline: "The market is broken",
    problemSub: "Teams spend more on infrastructure than on the product itself.",
    today: "Fragmented tooling and runaway compute costs.",
    todayItems: ["Weeks to provision", "Opaque pricing", "No observability"],
    tomorrow: "One control plane that scales with ambition.",
    tomorrowItems: ["Minutes to deploy", "Predictable spend", "Built-in insight"],
    pillarsHeadline: "Why we win",
    pillars: [
      { title: "Wedge", body: "Start where the pain is sharpest and the budget already exists." },
      { title: "Moat", body: "Proprietary scheduling data compounds with every workload." },
      { title: "Motion", body: "Bottom-up adoption that converts into enterprise contracts." },
    ],
    statsHeadline: "Traction",
    stats: [
      { value: "4.2×", label: "Year-over-year revenue growth" },
      { value: "128%", label: "Net revenue retention" },
      { value: "$2.1M", label: "Annual recurring revenue" },
    ],
    timelineHeadline: "Use of funds",
    timeline: [
      { title: "Engineering", body: "Double the core platform team." },
      { title: "Go-to-market", body: "Land the first ten enterprise logos." },
      { title: "Expansion", body: "Open two new regions in EMEA." },
    ],
    momentHeadline: "The window is now",
    momentSub: "Compute demand is compounding faster than tooling can keep up.",
    quote: "The companies that own the control plane will own the decade.",
    closing: "Let's build it together",
    closingSub: "Raising $12M to define the category.",
    closingItems: ["Lead investor sought", "Close targeted for Q1", "Data room available"],
  },
  "product-launch": {
    subtitle: "A launch story with product clarity and cinematic polish.",
    kicker: "Introducing · Available today",
    problemHeadline: "Presentations stopped evolving",
    problemSub: "Ideas moved forward. Slides stayed flat.",
    today: "Templates, bullets, and click-through fatigue.",
    todayItems: ["Flat layouts", "No motion hierarchy", "Forgettable delivery"],
    tomorrow: "Story-first decks rendered with cinematic intent.",
    tomorrowItems: ["Structured by AI", "Directed motion", "Immersive depth"],
    pillarsHeadline: "Three ways to tell it",
    pillars: [
      { title: "Basic", body: "Minimal, precise layouts that respect the content." },
      { title: "Plus", body: "Choreographed motion that guides every glance." },
      { title: "Pro", body: "Real-time 3D atmospheres for moments that matter." },
    ],
    statsHeadline: "Built for impact",
    stats: [
      { value: "40s", label: "From prompt to first draft" },
      { value: "3", label: "Visual tiers, switchable live" },
      { value: "100%", label: "Exportable to PDF and PPTX" },
    ],
    timelineHeadline: "Launch path",
    timeline: [
      { title: "Prompt", body: "Describe the story in a sentence." },
      { title: "Direct", body: "Choose the tier and refine the beats." },
      { title: "Present", body: "Take the stage, or export anywhere." },
    ],
    momentHeadline: "Enter the Pro experience",
    momentSub: "Depth, light and atmosphere, rendered in real time.",
    quote: "A presentation should feel like a short film, not a spreadsheet.",
    closing: "Available today",
    closingSub: "Switch tiers live. Export when you're ready.",
    closingItems: ["Start free in the browser", "Present with one keystroke", "Export to PDF and PPTX"],
  },
  lecture: {
    subtitle: "A teaching arc with clear beats and memorable visuals.",
    kicker: "Lecture 04 · Visual storytelling",
    problemHeadline: "Why stories stick",
    problemSub: "Narrative structure is how humans compress meaning.",
    today: "Facts delivered as lists fade within hours.",
    todayItems: ["Low recall", "Passive audiences", "No emotional anchor"],
    tomorrow: "Concepts framed as arcs are remembered for weeks.",
    tomorrowItems: ["Tension and release", "Concrete imagery", "Active attention"],
    pillarsHeadline: "Three principles",
    pillars: [
      { title: "Contrast", body: "Meaning emerges from difference." },
      { title: "Sequence", body: "Order shapes understanding." },
      { title: "Emotion", body: "Feeling makes knowledge durable." },
    ],
    statsHeadline: "Key takeaways",
    stats: [
      { value: "22×", label: "More memorable than facts alone" },
      { value: "65%", label: "Of people are visual learners" },
      { value: "10m", label: "Average attention span per segment" },
    ],
    timelineHeadline: "The arc",
    timeline: [
      { title: "Setup", body: "Establish the world and the stakes." },
      { title: "Conflict", body: "Introduce the tension worth resolving." },
      { title: "Resolution", body: "Deliver the insight as the payoff." },
    ],
    momentHeadline: "The insight",
    momentSub: "Every great lecture builds to a single moment.",
    quote: "People forget what you said, but remember how you made them feel.",
    closing: "Questions & discussion",
    closingSub: "Reading list and slides are shared after class.",
    closingItems: ["Office hours: Thursday 3pm", "Assignment due next week", "Readings in the course portal"],
  },
  "cinematic-keynote": {
    subtitle: "A keynote built for emotion, pacing, and stage presence.",
    kicker: "Keynote · Live",
    problemHeadline: "Every era has its medium",
    problemSub: "Ours is still waiting to be invented.",
    today: "We broadcast ideas through rectangles of text.",
    todayItems: ["Static frames", "Shrinking attention", "Lost nuance"],
    tomorrow: "We will stage ideas as experiences.",
    tomorrowItems: ["Spatial", "Responsive", "Unforgettable"],
    pillarsHeadline: "Three shifts",
    pillars: [
      { title: "From slides", body: "To scenes with depth and rhythm." },
      { title: "From reading", body: "To feeling the argument unfold." },
      { title: "From audience", body: "To participants in the story." },
    ],
    statsHeadline: "The moment",
    stats: [
      { value: "1", label: "Idea the room must remember" },
      { value: "18m", label: "The ideal keynote length" },
      { value: "∞", label: "Ways to make it land" },
    ],
    timelineHeadline: "The journey",
    timeline: [
      { title: "Silence", body: "Begin with a pause the room can feel." },
      { title: "Rise", body: "Build tension with every scene." },
      { title: "Reveal", body: "Land the idea in a single frame." },
    ],
    momentHeadline: "This is the moment",
    momentSub: "Let the room breathe before you speak again.",
    quote: "The future is not a destination. It is a direction we choose together.",
    closing: "The story continues",
    closingSub: "Thank you.",
    closingItems: ["Follow along online", "Share the recording", "Join the conversation"],
  },
};
