import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import type { GenerateDeckRequest } from "@/types/deck";
import { deckSchema } from "@/lib/ai/schemas";
import { buildFallbackDeck } from "@/lib/ai/fallback-deck";
import { aetherTheme } from "@/lib/themes";
import { uid } from "@/lib/utils";

export async function generateDeckFromPrompt(request: GenerateDeckRequest) {
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY);
  const provider =
    process.env.AI_PROVIDER === "anthropic" && hasAnthropic
      ? "anthropic"
      : hasOpenAI
        ? "openai"
        : hasAnthropic
          ? "anthropic"
          : null;

  if (!provider) {
    return {
      deck: buildFallbackDeck(request),
      source: "mock" as const,
    };
  }

  try {
    const model =
      provider === "anthropic"
        ? createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })(
            "claude-3-5-sonnet-20241022"
          )
        : createOpenAI({ apiKey: process.env.OPENAI_API_KEY })(
            "gpt-4o-mini"
          );

    const { object } = await generateObject({
      model,
      schema: deckSchema,
      prompt: buildSystemPrompt(request),
    });

    const now = new Date().toISOString();
    const deck = {
      ...object,
      id: object.id || uid("deck"),
      tier: request.tier,
      theme: object.theme ?? aetherTheme,
      createdAt: now,
      updatedAt: now,
      slides: object.slides.map((slide) => ({
        ...slide,
        id: slide.id || uid("slide"),
        blocks: slide.blocks.map((block) => ({
          ...block,
          id: block.id || uid("block"),
        })),
      })),
    };

    return { deck, source: provider };
  } catch (error) {
    console.error("[generate-deck] AI failed, using fallback", error);
    return {
      deck: buildFallbackDeck(request),
      source: "mock-fallback" as const,
    };
  }
}

function buildSystemPrompt(request: GenerateDeckRequest): string {
  return `You are AetherDeck, an elite presentation designer.
Return a complete Deck JSON for a ${request.template ?? "general"} presentation.
Tier preference: ${request.tier}.
Target slide count: ${request.slideCount ?? 7}.
Use varied layoutTypes (title, split, grid-3, stat-callout, timeline, cinematic-canvas).
Include backgroundEffect and transitionType on every slide.
Use a dark cinematic theme: background near #08090B, foreground near #EDEDEF, violet primary, cyan secondary.
All theme colors must be 6-digit hex strings like #7C6CFF.
User brief:
${request.prompt}`;
}
