import { NextResponse } from "next/server";
import { z } from "zod";
import { generateDeckFromPrompt } from "@/lib/ai/generate-deck";

const requestSchema = z.object({
  prompt: z.string().min(3),
  tier: z.enum(["basic", "plus", "pro"]).default("plus"),
  template: z
    .enum(["pitch-deck", "product-launch", "lecture", "cinematic-keynote"])
    .optional(),
  slideCount: z.number().int().min(3).max(16).optional(),
});

export async function POST(req: Request) {
  try {
    const json: unknown = await req.json();
    const parsed = requestSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await generateDeckFromPrompt(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate deck" },
      { status: 500 }
    );
  }
}
