import type { TemplatePreset } from "@/types/deck";

export interface TemplateInfo {
  id: TemplatePreset;
  name: string;
  blurb: string;
  samplePrompt: string;
}

export const TEMPLATES: TemplateInfo[] = [
  {
    id: "pitch-deck",
    name: "Pitch Deck",
    blurb: "Problem, wedge, traction and the ask.",
    samplePrompt: "NebulaForge Series A",
  },
  {
    id: "product-launch",
    name: "Product Launch",
    blurb: "Reveal what's new with clarity and drama.",
    samplePrompt: "Introducing Halo",
  },
  {
    id: "lecture",
    name: "Lecture",
    blurb: "A teaching arc built for recall.",
    samplePrompt: "Generative storytelling 101",
  },
  {
    id: "cinematic-keynote",
    name: "Cinematic Keynote",
    blurb: "Pacing and emotion for the big stage.",
    samplePrompt: "The next frontier",
  },
];

export const TEMPLATE_PROMPTS: Record<TemplatePreset, string> = {
  "pitch-deck": "A Series A pitch for NebulaForge, an AI infrastructure company, aimed at top-tier investors.",
  "product-launch": "A launch keynote introducing Halo, a smart home device that learns your routines.",
  lecture: "A university lecture on how storytelling principles make information memorable.",
  "cinematic-keynote": "A cinematic keynote about the next frontier of human creativity and technology.",
};
