"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buildFallbackDeck } from "@/lib/ai/fallback-deck";
import { TEMPLATES } from "@/lib/templates";
import { SlideThumbnail } from "@/components/renderers/slide-renderer";
import { Reveal, SectionHeading } from "@/components/marketing/reveal";

const PREVIEWS = TEMPLATES.map((template) => ({
  template,
  deck: buildFallbackDeck(
    { prompt: template.samplePrompt, tier: "basic", template: template.id },
    { idPrefix: `tpl_${template.id}`, now: "2026-01-01T00:00:00.000Z" }
  ),
}));

export function TemplateStrip() {
  return (
    <section id="templates" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Templates"
          title="Start from a narrative that already works."
          description="Each template encodes a proven story structure. Bring the topic; AetherDeck brings the arc."
        />
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PREVIEWS.map(({ template, deck }, i) => (
            <Reveal key={template.id} delay={i * 0.06}>
              <Link
                href={`/new?template=${template.id}`}
                className="group block rounded-2xl bg-surface-1 p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12),0_24px_48px_-24px_rgba(124,108,255,0.45)]"
              >
                <div className="overflow-hidden rounded-[10px]">
                  <SlideThumbnail slide={deck.slides[0]} theme={deck.theme} />
                </div>
                <div className="flex items-start justify-between gap-3 px-2 pb-2 pt-4">
                  <div>
                    <div className="text-[14px] font-medium text-fg-primary">{template.name}</div>
                    <div className="mt-1 text-[12.5px] leading-snug text-fg-tertiary">{template.blurb}</div>
                  </div>
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-fg-tertiary transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg-primary" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
