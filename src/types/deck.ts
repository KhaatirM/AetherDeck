/** Core AetherDeck data model */

export type DeckTier = "basic" | "plus" | "pro";

export type LayoutType =
  | "title"
  | "split"
  | "grid-3"
  | "stat-callout"
  | "timeline"
  | "cinematic-canvas";

export type BackgroundEffect =
  | "color"
  | "gradient"
  | "3d-particles"
  | "cyber-grid"
  | "aurora"
  | "starfield"
  | "floating-orbs";

export type TransitionType =
  | "none"
  | "fade"
  | "slide"
  | "morph"
  | "cinematic-zoom"
  | "camera-pan";

export type BlockType =
  | "text"
  | "bullet-list"
  | "stat"
  | "card"
  | "quote"
  | "image-placeholder"
  | "timeline-item"
  | "diagram-step";

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  card: string;
  border: string;
}

export interface ThemeTypography {
  headingFont: string;
  bodyFont: string;
  scale: "compact" | "comfortable" | "dramatic";
}

export interface DeckTheme {
  name: string;
  mode: "dark" | "light";
  colors: ThemeColors;
  typography: ThemeTypography;
  ambientStyle: "glass" | "solid" | "neon" | "cinematic";
}

export interface ContentBlock {
  id: string;
  type: BlockType;
  title?: string;
  body?: string;
  items?: string[];
  value?: string;
  label?: string;
  icon?: string;
  accentColor?: string;
  stepIndex?: number;
}

export interface Slide {
  id: string;
  layoutType: LayoutType;
  headline: string;
  subheadline?: string;
  blocks: ContentBlock[];
  backgroundEffect: BackgroundEffect;
  transitionType: TransitionType;
  notes?: string;
  accentOverride?: string;
}

export interface Deck {
  id: string;
  title: string;
  description?: string;
  theme: DeckTheme;
  tier: DeckTier;
  slides: Slide[];
  createdAt: string;
  updatedAt: string;
}

export type ViewportMode = "edit" | "preview" | "present";

export type TemplatePreset =
  | "pitch-deck"
  | "product-launch"
  | "lecture"
  | "cinematic-keynote";

export interface GenerateDeckRequest {
  prompt: string;
  tier: DeckTier;
  template?: TemplatePreset;
  slideCount?: number;
}
