import { z } from "zod";

export const contentBlockSchema = z.object({
  id: z.string(),
  type: z.enum([
    "text",
    "bullet-list",
    "stat",
    "card",
    "quote",
    "image-placeholder",
    "timeline-item",
    "diagram-step",
  ]),
  title: z.string().optional(),
  body: z.string().optional(),
  items: z.array(z.string()).optional(),
  value: z.string().optional(),
  label: z.string().optional(),
  icon: z.string().optional(),
  accentColor: z.string().optional(),
  stepIndex: z.number().optional(),
});

export const slideSchema = z.object({
  id: z.string(),
  layoutType: z.enum([
    "title",
    "split",
    "grid-3",
    "stat-callout",
    "timeline",
    "cinematic-canvas",
  ]),
  headline: z.string(),
  subheadline: z.string().optional(),
  blocks: z.array(contentBlockSchema),
  backgroundEffect: z.enum([
    "color",
    "gradient",
    "3d-particles",
    "cyber-grid",
    "aurora",
    "starfield",
    "floating-orbs",
  ]),
  transitionType: z.enum([
    "none",
    "fade",
    "slide",
    "morph",
    "cinematic-zoom",
    "camera-pan",
  ]),
  notes: z.string().optional(),
});

export const deckThemeSchema = z.object({
  name: z.string(),
  mode: z.enum(["dark", "light"]),
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    background: z.string(),
    foreground: z.string(),
    muted: z.string(),
    card: z.string(),
    border: z.string(),
  }),
  typography: z.object({
    headingFont: z.string(),
    bodyFont: z.string(),
    scale: z.enum(["compact", "comfortable", "dramatic"]),
  }),
  ambientStyle: z.enum(["glass", "solid", "neon", "cinematic"]),
});

export const deckSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  theme: deckThemeSchema,
  tier: z.enum(["basic", "plus", "pro"]),
  slides: z.array(slideSchema).min(3).max(16),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type GeneratedDeck = z.infer<typeof deckSchema>;
