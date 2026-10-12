"use client";

import { Command, FileDown, MonitorPlay, Sparkles, WifiOff, Wand2 } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Kbd } from "@/components/ui/kbd";
import { Reveal, SectionHeading } from "@/components/marketing/reveal";
import { cn } from "@/lib/utils";

function Card({
  className,
  icon: Icon,
  title,
  description,
  children,
}: {
  className?: string;
  icon: typeof Sparkles;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <SpotlightCard className={cn("h-full overflow-hidden rounded-[20px] bg-surface-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]", className)}>
      <div className="flex h-full flex-col">
        <div className="relative flex-1 overflow-hidden">{children}</div>
        <div className="p-6 pt-0">
          <div className="mb-2 flex items-center gap-2 text-[14.5px] font-medium text-fg-primary">
            <Icon className="h-4 w-4 text-accent-soft" />
            {title}
          </div>
          <p className="text-[13.5px] leading-relaxed text-fg-secondary">{description}</p>
        </div>
      </div>
    </SpotlightCard>
  );
}

function OutlineVisual() {
  const rows = ["Title · Presentations, directed", "Problem · Slides stopped evolving", "Pillars · Three cinematic tiers", "Proof · Built for impact", "Path · From prompt to stage"];
  return (
    <div className="flex h-full min-h-[200px] flex-col justify-center gap-2 p-6">
      {rows.map((row, i) => (
        <div
          key={row}
          className="flex items-center gap-3 rounded-lg bg-white/[0.025] px-3 py-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]"
          style={{ opacity: 1 - i * 0.14 }}
        >
          <span className="font-mono text-[10px] text-accent-soft">{String(i + 1).padStart(2, "0")}</span>
          <span className="truncate text-[12.5px] text-fg-secondary">{row}</span>
        </div>
      ))}
    </div>
  );
}

function ExportVisual() {
  return (
    <div className="flex h-full min-h-[180px] items-center justify-center gap-3 p-6">
      {["PPTX", "PDF", "WEB"].map((label, i) => (
        <div
          key={label}
          className="flex h-[86px] w-[68px] flex-col justify-between rounded-lg bg-surface-2 p-2.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_12px_24px_-8px_rgba(0,0,0,0.6)]"
          style={{ transform: `rotate(${(i - 1) * 6}deg) translateY(${i === 1 ? -6 : 0}px)` }}
        >
          <div className="flex flex-col gap-1">
            <span className="h-1 w-8 rounded-full bg-white/15" />
            <span className="h-1 w-5 rounded-full bg-white/10" />
          </div>
          <span className="font-mono text-[10px] font-medium text-fg-primary">{label}</span>
        </div>
      ))}
    </div>
  );
}

function KeysVisual() {
  return (
    <div className="flex h-full min-h-[180px] items-center justify-center gap-2 p-6">
      {["Space", "←", "→", "N", "Esc"].map((k) => (
        <Kbd key={k} className="h-9 min-w-9 rounded-lg px-2.5 text-[12px] text-fg-secondary">
          {k}
        </Kbd>
      ))}
    </div>
  );
}

export function FeatureBento() {
  return (
    <section id="features" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Crafted end to end"
          title="Everything between the idea and the applause."
        />
        <div className="mt-16 grid auto-rows-[minmax(300px,auto)] gap-4 md:grid-cols-6">
          <Reveal className="md:col-span-4">
            <Card
              icon={Sparkles}
              title="Structured by AI"
              description="Your prompt becomes a typed narrative — layouts, blocks, transitions and speaker notes — not a wall of text."
            >
              <OutlineVisual />
            </Card>
          </Reveal>
          <Reveal className="md:col-span-2" delay={0.05}>
            <Card
              icon={Wand2}
              title="Live tier switching"
              description="Move between Basic, Plus and Pro instantly. Content stays put."
            >
              <div className="flex h-full min-h-[180px] items-center justify-center">
                <div className="flex flex-col items-center gap-1.5">
                  {["Pro", "Plus", "Basic"].map((t, i) => (
                    <div
                      key={t}
                      className="rounded-lg bg-surface-2 px-5 py-2 text-[12px] text-fg-secondary shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]"
                      style={{ width: 150 - i * 18, opacity: 1 - i * 0.22 }}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Reveal>
          <Reveal className="md:col-span-2" delay={0.05}>
            <Card
              icon={MonitorPlay}
              title="Presenter mode"
              description="Fullscreen playback with keyboard control and private notes."
            >
              <KeysVisual />
            </Card>
          </Reveal>
          <Reveal className="md:col-span-2" delay={0.1}>
            <Card icon={FileDown} title="Export anywhere" description="PowerPoint, PDF, or a shareable web player.">
              <ExportVisual />
            </Card>
          </Reveal>
          <Reveal className="md:col-span-2" delay={0.15}>
            <Card
              icon={WifiOff}
              title="Works without keys"
              description="No API key? Rich sample generation keeps everything usable offline."
            >
              <div className="flex h-full min-h-[180px] items-center justify-center">
                <div className="flex items-center gap-2 rounded-full bg-emerald-400/[0.07] px-3 py-1.5 text-[12px] text-emerald-300/90 shadow-[inset_0_0_0_1px_rgba(52,211,153,0.2)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
                  Local generation ready
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="mt-6 flex items-center justify-center gap-2 text-[12.5px] text-fg-tertiary">
          <Command className="h-3.5 w-3.5" />
          Keyboard-first everywhere. Press <Kbd>P</Kbd> in the editor to present.
        </Reveal>
      </div>
    </section>
  );
}
