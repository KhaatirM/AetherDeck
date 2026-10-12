"use client";

import { ArrowLeft, Check, Sparkles } from "lucide-react";
import type { DeckTier, TemplatePreset } from "@/types/deck";
import { TEMPLATES } from "@/lib/templates";
import { mockDeck } from "@/lib/mock-deck";
import { ScaledSlide } from "@/components/renderers/scaled-slide";
import { SlideRenderer } from "@/components/renderers/slide-renderer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TIERS: { id: DeckTier; name: string; tagline: string }[] = [
  { id: "basic", name: "Basic", tagline: "Modern minimalist" },
  { id: "plus", name: "Plus", tagline: "Fluid motion" },
  { id: "pro", name: "Pro", tagline: "Cinematic 3D" },
];

interface ConfigureStepProps {
  prompt: string;
  template: TemplatePreset;
  tier: DeckTier;
  onTemplateChange: (template: TemplatePreset) => void;
  onTierChange: (tier: DeckTier) => void;
  onBack: () => void;
  onGenerate: () => void;
}

function SelectionRing({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] transition-shadow duration-300",
        active
          ? "shadow-[inset_0_0_0_1.5px_rgba(124,108,255,0.9),0_0_0_4px_rgba(124,108,255,0.12)]"
          : "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)] group-hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]"
      )}
    />
  );
}

export function ConfigureStep({
  prompt,
  template,
  tier,
  onTemplateChange,
  onTierChange,
  onBack,
  onGenerate,
}: ConfigureStepProps) {
  return (
    <div className="mx-auto flex max-w-4xl flex-col">
      <div className="text-center">
        <h1 className="text-balance text-[32px] font-semibold tracking-[-0.04em] text-gradient sm:text-[40px]">
          Direct the experience
        </h1>
        <p className="mx-auto mt-3 max-w-xl truncate text-[14px] text-fg-tertiary">
          “{prompt}”
        </p>
      </div>

      <section className="mt-12">
        <h2 className="mb-3 text-[12px] font-medium text-fg-secondary">Narrative structure</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATES.map((t) => {
            const active = t.id === template;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onTemplateChange(t.id)}
                className={cn(
                  "group relative rounded-xl p-4 text-left transition-colors duration-300",
                  active ? "bg-accent/[0.07]" : "bg-surface-1 hover:bg-surface-2"
                )}
              >
                <SelectionRing active={active} />
                <div className="flex items-center justify-between">
                  <span className="text-[13.5px] font-medium text-fg-primary">{t.name}</span>
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-full transition-all duration-300",
                      active ? "scale-100 bg-accent opacity-100" : "scale-75 opacity-0"
                    )}
                  >
                    <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                  </span>
                </div>
                <p className="mt-1.5 text-[12px] leading-snug text-fg-tertiary">{t.blurb}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-[12px] font-medium text-fg-secondary">Visual tier</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {TIERS.map((t) => {
            const active = t.id === tier;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onTierChange(t.id)}
                className={cn(
                  "group relative rounded-2xl p-2 text-left transition-colors duration-300",
                  active ? "bg-accent/[0.06]" : "bg-surface-1 hover:bg-surface-2"
                )}
              >
                <SelectionRing active={active} />
                <div className="pointer-events-none overflow-hidden rounded-[10px]">
                  <ScaledSlide>
                    <SlideRenderer deck={mockDeck} slide={mockDeck.slides[2]} slideIndex={2} tier={t.id} />
                  </ScaledSlide>
                </div>
                <div className="flex items-center justify-between px-2 pb-1.5 pt-3">
                  <div>
                    <div className="text-[13.5px] font-medium text-fg-primary">{t.name}</div>
                    <div className="text-[12px] text-fg-tertiary">{t.tagline}</div>
                  </div>
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-full transition-all duration-300",
                      active ? "scale-100 bg-accent opacity-100" : "scale-75 opacity-0"
                    )}
                  >
                    <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-center text-[12px] text-fg-tertiary">You can switch tiers at any time in the editor.</p>
      </section>

      <div className="mt-12 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft /> Edit prompt
        </Button>
        <Button size="lg" onClick={onGenerate}>
          <Sparkles /> Generate deck
        </Button>
      </div>
    </div>
  );
}
