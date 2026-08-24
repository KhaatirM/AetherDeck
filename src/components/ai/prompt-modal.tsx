"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import type { DeckTier, TemplatePreset } from "@/types/deck";
import { useDeckStore } from "@/store/deck-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const PRESETS: {
  id: TemplatePreset;
  label: string;
  prompt: string;
}[] = [
  {
    id: "pitch-deck",
    label: "Pitch Deck",
    prompt:
      "Create a startup pitch deck for an AI infrastructure company called NebulaForge targeting Series A investors.",
  },
  {
    id: "product-launch",
    label: "Product Launch",
    prompt:
      "Create a product launch keynote for AetherDeck introducing three cinematic presentation tiers.",
  },
  {
    id: "lecture",
    label: "Lecture",
    prompt:
      "Create an educational lecture deck explaining how generative AI transforms visual storytelling.",
  },
  {
    id: "cinematic-keynote",
    label: "Cinematic Keynote",
    prompt:
      "Create a cinematic keynote about the future of immersive presentations with bold emotional beats.",
  },
];

const TIER_OPTIONS: { id: DeckTier; label: string }[] = [
  { id: "basic", label: "Basic" },
  { id: "plus", label: "Plus" },
  { id: "pro", label: "Pro" },
];

export function PromptModal() {
  const setDeck = useDeckStore((s) => s.setDeck);
  const setIsGenerating = useDeckStore((s) => s.setIsGenerating);
  const isGenerating = useDeckStore((s) => s.isGenerating);
  const currentTier = useDeckStore((s) => s.deck.tier);

  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState(PRESETS[1].prompt);
  const [tier, setTier] = useState<DeckTier>(currentTier);
  const [template, setTemplate] = useState<TemplatePreset>("product-launch");
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setError(null);
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-deck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          tier,
          template,
          slideCount: 7,
        }),
      });
      const data = (await res.json()) as {
        deck?: import("@/types/deck").Deck;
        error?: string;
        source?: string;
      };
      if (!res.ok || !data.deck) {
        throw new Error(data.error ?? "Failed to generate deck");
      }
      setDeck(data.deck);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="accent" size="sm">
          <Sparkles className="h-4 w-4" />
          Generate with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Generate a deck</DialogTitle>
          <DialogDescription>
            Describe your narrative or pick a template. Without an API key,
            AetherDeck returns a rich mock deck tailored to your prompt.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Template preset</Label>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setTemplate(preset.id);
                    setPrompt(preset.prompt);
                  }}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-left text-sm transition-all",
                    template === preset.id
                      ? "border-primary/60 bg-primary/15"
                      : "border-border bg-white/5 hover:border-white/25"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Visual tier</Label>
            <div className="flex gap-2">
              {TIER_OPTIONS.map((option) => (
                <Button
                  key={option.id}
                  size="sm"
                  variant={tier === option.id ? "default" : "secondary"}
                  onClick={() => setTier(option.id)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Prompt / outline</Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              placeholder="Topic, audience, and key beats…"
            />
          </div>

          {error ? (
            <p className="text-sm text-red-300">{error}</p>
          ) : null}

          <Button
            className="w-full"
            variant="accent"
            disabled={isGenerating || !prompt.trim()}
            onClick={() => void handleGenerate()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Build deck
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
