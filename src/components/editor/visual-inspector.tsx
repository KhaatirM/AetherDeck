"use client";

import type { BackgroundEffect, DeckTheme, LayoutType, TransitionType } from "@/types/deck";
import {
  selectActiveDeck,
  selectActiveSlide,
  useDeckStore,
  type InspectorTab,
} from "@/store/deck-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGlyph, backgroundPreview } from "@/components/editor/layout-swatches";
import { aetherTheme, emberTheme, glacierTheme } from "@/lib/themes";
import { cn } from "@/lib/utils";

const LAYOUTS: { id: LayoutType; label: string }[] = [
  { id: "title", label: "Title" },
  { id: "split", label: "Split" },
  { id: "grid-3", label: "Grid" },
  { id: "stat-callout", label: "Stats" },
  { id: "timeline", label: "Timeline" },
  { id: "cinematic-canvas", label: "Cinematic" },
];

const BACKGROUNDS: { id: BackgroundEffect; label: string }[] = [
  { id: "color", label: "Solid" },
  { id: "gradient", label: "Gradient" },
  { id: "aurora", label: "Aurora" },
  { id: "cyber-grid", label: "Grid" },
  { id: "starfield", label: "Stars" },
  { id: "floating-orbs", label: "Orbs" },
  { id: "3d-particles", label: "Particles" },
];

const TRANSITIONS: { id: TransitionType; label: string }[] = [
  { id: "none", label: "None" },
  { id: "fade", label: "Fade" },
  { id: "slide", label: "Slide" },
  { id: "morph", label: "Morph" },
  { id: "cinematic-zoom", label: "Zoom" },
  { id: "camera-pan", label: "Pan" },
];

const PRESET_THEMES: DeckTheme[] = [aetherTheme, emberTheme, glacierTheme];

function Section({ title, children, hint }: { title: string; children: React.ReactNode; hint?: string }) {
  return (
    <section className="border-b border-hairline px-4 py-4 last:border-b-0">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-[12px] font-medium text-fg-primary">{title}</h3>
        {hint ? <span className="text-[11px] text-fg-tertiary">{hint}</span> : null}
      </div>
      {children}
    </section>
  );
}

function SwatchButton({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} className="group flex flex-col items-center gap-1.5" aria-pressed={active}>
      <span
        className={cn(
          "relative block aspect-video w-full overflow-hidden rounded-[7px] bg-surface-2 transition-shadow duration-200",
          active
            ? "shadow-[inset_0_0_0_1.5px_rgba(124,108,255,1),0_0_0_3px_rgba(124,108,255,0.15)]"
            : "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] group-hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]"
        )}
      >
        {children}
      </span>
      <span className={cn("text-[11px] transition-colors", active ? "text-fg-primary" : "text-fg-tertiary group-hover:text-fg-secondary")}>
        {label}
      </span>
    </button>
  );
}

export function VisualInspector() {
  const deck = useDeckStore(selectActiveDeck);
  const slide = useDeckStore(selectActiveSlide);
  const tab = useDeckStore((s) => s.inspectorTab);
  const setTab = useDeckStore((s) => s.setInspectorTab);
  const setTheme = useDeckStore((s) => s.setTheme);
  const updateSlide = useDeckStore((s) => s.updateSlide);
  const updateBlock = useDeckStore((s) => s.updateBlock);

  return (
    <aside className="flex w-[296px] shrink-0 flex-col border-l border-hairline bg-surface-1/40">
      <Tabs value={tab} onValueChange={(v) => setTab(v as InspectorTab)} className="flex min-h-0 flex-1 flex-col">
        <div className="flex h-11 items-center px-3">
          <TabsList className="w-full">
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
          </TabsList>
        </div>

        <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">
          <TabsContent value="design">
            <Section title="Layout">
              <div className="grid grid-cols-3 gap-x-2 gap-y-3">
                {LAYOUTS.map((layout) => (
                  <SwatchButton
                    key={layout.id}
                    label={layout.label}
                    active={slide.layoutType === layout.id}
                    onClick={() => updateSlide(slide.id, { layoutType: layout.id })}
                  >
                    <span className="absolute inset-0 p-0.5">
                      <LayoutGlyph layout={layout.id} />
                    </span>
                  </SwatchButton>
                ))}
              </div>
            </Section>

            <Section title="Background" hint={deck.tier === "pro" ? "Rendered in 3D" : undefined}>
              <div className="grid grid-cols-4 gap-x-2 gap-y-3">
                {BACKGROUNDS.map((bg) => (
                  <SwatchButton
                    key={bg.id}
                    label={bg.label}
                    active={slide.backgroundEffect === bg.id}
                    onClick={() => updateSlide(slide.id, { backgroundEffect: bg.id })}
                  >
                    <span
                      className="absolute inset-0"
                      style={{ background: backgroundPreview(bg.id, deck.theme.colors.primary, deck.theme.colors.secondary) }}
                    />
                  </SwatchButton>
                ))}
              </div>
            </Section>

            <Section title="Transition" hint={deck.tier === "basic" ? "Plays in Plus and Pro" : undefined}>
              <div className="grid grid-cols-3 gap-1.5">
                {TRANSITIONS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => updateSlide(slide.id, { transitionType: t.id })}
                    className={cn(
                      "h-8 rounded-lg text-[12px] transition-all",
                      slide.transitionType === t.id
                        ? "bg-accent/15 text-fg-primary shadow-[inset_0_0_0_1px_rgba(124,108,255,0.5)]"
                        : "bg-white/[0.03] text-fg-tertiary shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] hover:text-fg-primary"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </Section>
          </TabsContent>

          <TabsContent value="content">
            <Section title="Slide">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="headline">Headline</Label>
                  <Input
                    id="headline"
                    value={slide.headline}
                    onChange={(e) => updateSlide(slide.id, { headline: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="subheadline">Supporting line</Label>
                  <Textarea
                    id="subheadline"
                    rows={2}
                    value={slide.subheadline ?? ""}
                    onChange={(e) => updateSlide(slide.id, { subheadline: e.target.value })}
                  />
                </div>
              </div>
            </Section>

            <Section title="Blocks" hint={`${slide.blocks.length}`}>
              <div className="flex flex-col gap-3">
                {slide.blocks.map((block) => (
                  <div key={block.id} className="flex flex-col gap-2 rounded-xl bg-white/[0.02] p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-fg-tertiary">
                      {block.type.replace("-", " ")}
                    </span>
                    {block.type === "stat" ? (
                      <div className="grid grid-cols-[72px_1fr] gap-2">
                        <Input
                          aria-label="Value"
                          value={block.value ?? ""}
                          onChange={(e) => updateBlock(slide.id, block.id, { value: e.target.value })}
                        />
                        <Input
                          aria-label="Label"
                          value={block.label ?? ""}
                          onChange={(e) => updateBlock(slide.id, block.id, { label: e.target.value })}
                        />
                      </div>
                    ) : null}
                    {block.title !== undefined ? (
                      <Input
                        aria-label="Title"
                        value={block.title}
                        onChange={(e) => updateBlock(slide.id, block.id, { title: e.target.value })}
                      />
                    ) : null}
                    {block.body !== undefined ? (
                      <Textarea
                        aria-label="Body"
                        rows={2}
                        value={block.body}
                        onChange={(e) => updateBlock(slide.id, block.id, { body: e.target.value })}
                      />
                    ) : null}
                    {block.items ? (
                      <Textarea
                        aria-label="List items, one per line"
                        rows={Math.max(2, block.items.length)}
                        value={block.items.join("\n")}
                        onChange={(e) => updateBlock(slide.id, block.id, { items: e.target.value.split("\n") })}
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Speaker notes">
              <Textarea
                rows={4}
                value={slide.notes ?? ""}
                placeholder="Only visible to you while presenting"
                onChange={(e) => updateSlide(slide.id, { notes: e.target.value })}
              />
            </Section>
          </TabsContent>

          <TabsContent value="theme">
            <Section title="Presets">
              <div className="grid grid-cols-3 gap-2">
                {PRESET_THEMES.map((preset) => {
                  const active = preset.name === deck.theme.name;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setTheme(preset)}
                      className={cn(
                        "flex flex-col gap-2 rounded-xl p-2 text-left transition-shadow",
                        active
                          ? "shadow-[inset_0_0_0_1.5px_rgba(124,108,255,1)]"
                          : "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)]"
                      )}
                    >
                      <span
                        className="block h-9 rounded-md"
                        style={{
                          background: `radial-gradient(circle at 80% 0%, ${preset.colors.primary}, transparent 70%), radial-gradient(circle at 0% 100%, ${preset.colors.secondary}99, transparent 70%), ${preset.colors.background}`,
                        }}
                      />
                      <span className="px-0.5 text-[11.5px] text-fg-secondary">{preset.name}</span>
                    </button>
                  );
                })}
              </div>
            </Section>

            <Section title="Colors">
              <div className="flex flex-col gap-2">
                {(
                  [
                    ["primary", "Primary"],
                    ["secondary", "Secondary"],
                    ["background", "Background"],
                    ["foreground", "Text"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-2">
                    <label className="relative h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
                      <span className="absolute inset-0" style={{ background: deck.theme.colors[key] }} />
                      <input
                        type="color"
                        aria-label={label}
                        className="absolute inset-0 cursor-pointer opacity-0"
                        value={deck.theme.colors[key].slice(0, 7)}
                        onChange={(e) => setTheme({ name: "Custom", colors: { ...deck.theme.colors, [key]: e.target.value } })}
                      />
                    </label>
                    <span className="w-20 text-[12px] text-fg-secondary">{label}</span>
                    <Input
                      className="h-8 font-mono text-[11.5px] uppercase"
                      value={deck.theme.colors[key]}
                      onChange={(e) => setTheme({ name: "Custom", colors: { ...deck.theme.colors, [key]: e.target.value } })}
                    />
                  </div>
                ))}
              </div>
            </Section>
          </TabsContent>
        </div>
      </Tabs>
    </aside>
  );
}
