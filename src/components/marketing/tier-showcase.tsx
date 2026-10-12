"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Layers3, Orbit, Wand2 } from "lucide-react";
import type { DeckTier } from "@/types/deck";
import { mockDeck } from "@/lib/mock-deck";
import { ScaledSlide } from "@/components/renderers/scaled-slide";
import { SlideRenderer } from "@/components/renderers/slide-renderer";
import { Reveal, SectionHeading } from "@/components/marketing/reveal";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

const TIERS: {
  id: DeckTier;
  name: string;
  tagline: string;
  description: string;
  icon: typeof Layers3;
  details: string[];
}[] = [
  {
    id: "basic",
    name: "Basic",
    tagline: "Modern minimalist",
    description: "Precise grids, considered typography and quiet confidence. Ideal for boardrooms and documents.",
    icon: Layers3,
    details: ["Cards, grids and timelines", "Crisp static layouts", "Print-perfect export"],
  },
  {
    id: "plus",
    name: "Plus",
    tagline: "Fluid motion",
    description: "Choreographed reveals and morphing transitions that guide every glance through the story.",
    icon: Wand2,
    details: ["Staggered entrances", "Per-slide transitions", "Step-through diagrams"],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Cinematic 3D",
    description: "Real-time WebGL atmospheres with camera travel, depth and ambient light. Made for the stage.",
    icon: Orbit,
    details: ["Starfields, orbs and meshes", "3D camera between slides", "Theme-reactive lighting"],
  },
];

export function TierShowcase() {
  const [tier, setTier] = useState<DeckTier>("plus");
  const slideIndex = 2;

  return (
    <section id="tiers" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Three visual tiers"
          title="One story. Three levels of spectacle."
          description="Every deck is structured once and rendered at the intensity you choose. Switch tiers live, at any time, without touching a single slide."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className="flex flex-col gap-2">
            {TIERS.map((t, i) => {
              const active = t.id === tier;
              return (
                <Reveal key={t.id} delay={i * 0.06}>
                  <button
                    type="button"
                    onClick={() => setTier(t.id)}
                    className={cn(
                      "relative w-full rounded-2xl p-5 text-left transition-colors duration-300",
                      active ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                    )}
                  >
                    {active ? (
                      <motion.span
                        layoutId="tier-active"
                        className="absolute inset-0 rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
                        transition={{ type: "spring", stiffness: 400, damping: 36 }}
                      />
                    ) : null}
                    <div className="relative flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                          active
                            ? "bg-accent/15 text-accent-soft shadow-[inset_0_0_0_1px_rgba(124,108,255,0.35)]"
                            : "bg-white/[0.04] text-fg-tertiary"
                        )}
                      >
                        <t.icon className="h-4 w-4" />
                      </span>
                      <div>
                        <div className={cn("text-[15px] font-medium", active ? "text-fg-primary" : "text-fg-secondary")}>
                          {t.name}
                        </div>
                        <div className="text-[12px] text-fg-tertiary">{t.tagline}</div>
                      </div>
                    </div>
                    <motion.div
                      initial={false}
                      animate={{ height: active ? "auto" : 0, opacity: active ? 1 : 0 }}
                      transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                      className="relative overflow-hidden"
                    >
                      <p className="pt-4 text-[13.5px] leading-relaxed text-fg-secondary">{t.description}</p>
                      <ul className="mt-4 flex flex-col gap-2">
                        {t.details.map((d) => (
                          <li key={d} className="flex items-center gap-2.5 text-[12.5px] text-fg-tertiary">
                            <span className="h-1 w-1 rounded-full bg-accent-soft" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </button>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.1}>
            <div className="frame-gradient rounded-[18px] bg-surface-1 p-3 shadow-window sm:p-4">
              <div className="overflow-hidden rounded-[10px]">
                <ScaledSlide>
                  <SlideRenderer
                    deck={mockDeck}
                    slide={mockDeck.slides[slideIndex]}
                    slideIndex={slideIndex}
                    tier={tier}
                  />
                </ScaledSlide>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
