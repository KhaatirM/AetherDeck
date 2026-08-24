"use client";

import { useDeckStore, selectActiveSlide } from "@/store/deck-store";
import type { BackgroundEffect, DeckTier, LayoutType, TransitionType } from "@/types/deck";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { exportDeckToPptx } from "@/lib/export/pptx";
import { printDeckToPdf } from "@/lib/export/pdf";

const TIERS: { id: DeckTier; label: string; blurb: string }[] = [
  {
    id: "basic",
    label: "Basic",
    blurb: "Modern minimalist cards & typography",
  },
  {
    id: "plus",
    label: "Plus",
    blurb: "Fluid motion & staggered reveals",
  },
  {
    id: "pro",
    label: "Pro",
    blurb: "Cinematic WebGL immersion",
  },
];

const LAYOUTS: LayoutType[] = [
  "title",
  "split",
  "grid-3",
  "stat-callout",
  "timeline",
  "cinematic-canvas",
];

const BACKGROUNDS: BackgroundEffect[] = [
  "color",
  "gradient",
  "aurora",
  "cyber-grid",
  "starfield",
  "floating-orbs",
  "3d-particles",
];

const TRANSITIONS: TransitionType[] = [
  "none",
  "fade",
  "slide",
  "morph",
  "cinematic-zoom",
  "camera-pan",
];

export function VisualInspector() {
  const deck = useDeckStore((s) => s.deck);
  const slide = useDeckStore(selectActiveSlide);
  const rightPanelTab = useDeckStore((s) => s.rightPanelTab);
  const setRightPanelTab = useDeckStore((s) => s.setRightPanelTab);
  const setTier = useDeckStore((s) => s.setTier);
  const setTheme = useDeckStore((s) => s.setTheme);
  const updateSlide = useDeckStore((s) => s.updateSlide);
  const updateBlock = useDeckStore((s) => s.updateBlock);
  const setTitle = useDeckStore((s) => s.setTitle);

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-l border-border glass-strong">
      <div className="border-b border-border px-4 py-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
          Inspector
        </p>
        <p className="text-sm font-medium">Visual controls</p>
      </div>

      <Tabs
        value={rightPanelTab}
        onValueChange={(v) =>
          setRightPanelTab(v as typeof rightPanelTab)
        }
        className="flex min-h-0 flex-1 flex-col px-3 pt-3"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tier">Tier</TabsTrigger>
          <TabsTrigger value="blocks">Blocks</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 pb-4">
          <TabsContent value="tier" className="space-y-3 pr-2">
            {TIERS.map((tier) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => setTier(tier.id)}
                className={cn(
                  "w-full rounded-xl border p-3 text-left transition-all",
                  deck.tier === tier.id
                    ? "border-primary/60 bg-primary/10"
                    : "border-border bg-white/5 hover:border-white/25"
                )}
              >
                <div className="text-sm font-semibold">{tier.label}</div>
                <div className="mt-1 text-xs text-muted">{tier.blurb}</div>
              </button>
            ))}

            <div className="space-y-2 pt-2">
              <Label>Layout</Label>
              <div className="flex flex-wrap gap-1.5">
                {LAYOUTS.map((layout) => (
                  <Button
                    key={layout}
                    size="sm"
                    variant={
                      slide.layoutType === layout ? "default" : "secondary"
                    }
                    onClick={() =>
                      updateSlide(slide.id, { layoutType: layout })
                    }
                  >
                    {layout}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Background</Label>
              <div className="flex flex-wrap gap-1.5">
                {BACKGROUNDS.map((bg) => (
                  <Button
                    key={bg}
                    size="sm"
                    variant={
                      slide.backgroundEffect === bg ? "default" : "secondary"
                    }
                    onClick={() =>
                      updateSlide(slide.id, { backgroundEffect: bg })
                    }
                  >
                    {bg}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Transition</Label>
              <div className="flex flex-wrap gap-1.5">
                {TRANSITIONS.map((t) => (
                  <Button
                    key={t}
                    size="sm"
                    variant={
                      slide.transitionType === t ? "default" : "secondary"
                    }
                    onClick={() =>
                      updateSlide(slide.id, { transitionType: t })
                    }
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="blocks" className="space-y-4 pr-2">
            <div className="space-y-2">
              <Label>Deck title</Label>
              <Input
                value={deck.title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input
                value={slide.headline}
                onChange={(e) =>
                  updateSlide(slide.id, { headline: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Subheadline</Label>
              <Textarea
                value={slide.subheadline ?? ""}
                onChange={(e) =>
                  updateSlide(slide.id, { subheadline: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Presenter notes</Label>
              <Textarea
                value={slide.notes ?? ""}
                onChange={(e) =>
                  updateSlide(slide.id, { notes: e.target.value })
                }
                placeholder="Speaking notes for this slide…"
              />
            </div>
            {slide.blocks.map((block) => (
              <div
                key={block.id}
                className="space-y-2 rounded-xl border border-border bg-white/5 p-3"
              >
                <p className="text-[10px] uppercase tracking-wider text-muted">
                  {block.type}
                </p>
                {block.title !== undefined ? (
                  <Input
                    value={block.title ?? ""}
                    placeholder="Title"
                    onChange={(e) =>
                      updateBlock(slide.id, block.id, {
                        title: e.target.value,
                      })
                    }
                  />
                ) : null}
                {block.body !== undefined ||
                block.type === "text" ||
                block.type === "card" ||
                block.type === "quote" ? (
                  <Textarea
                    value={block.body ?? ""}
                    placeholder="Body"
                    onChange={(e) =>
                      updateBlock(slide.id, block.id, {
                        body: e.target.value,
                      })
                    }
                  />
                ) : null}
                {block.value !== undefined ? (
                  <Input
                    value={block.value ?? ""}
                    placeholder="Stat value"
                    onChange={(e) =>
                      updateBlock(slide.id, block.id, {
                        value: e.target.value,
                      })
                    }
                  />
                ) : null}
                {block.label !== undefined ? (
                  <Input
                    value={block.label ?? ""}
                    placeholder="Stat label"
                    onChange={(e) =>
                      updateBlock(slide.id, block.id, {
                        label: e.target.value,
                      })
                    }
                  />
                ) : null}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="theme" className="space-y-3 pr-2">
            <div className="space-y-2">
              <Label>Theme name</Label>
              <Input
                value={deck.theme.name}
                onChange={(e) => setTheme({ name: e.target.value })}
              />
            </div>
            {(
              [
                ["primary", "Primary"],
                ["secondary", "Secondary"],
                ["accent", "Accent"],
                ["background", "Background"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="flex items-center gap-3">
                <Label className="w-24">{label}</Label>
                <input
                  type="color"
                  className="h-9 w-12 cursor-pointer rounded border border-border bg-transparent"
                  value={deck.theme.colors[key]}
                  onChange={(e) =>
                    setTheme({ colors: { ...deck.theme.colors, [key]: e.target.value } })
                  }
                />
                <Input
                  value={deck.theme.colors[key]}
                  onChange={(e) =>
                    setTheme({
                      colors: { ...deck.theme.colors, [key]: e.target.value },
                    })
                  }
                />
              </div>
            ))}
            <div className="space-y-2">
              <Label>Ambient style</Label>
              <div className="flex flex-wrap gap-1.5">
                {(["glass", "solid", "neon", "cinematic"] as const).map(
                  (style) => (
                    <Button
                      key={style}
                      size="sm"
                      variant={
                        deck.theme.ambientStyle === style
                          ? "default"
                          : "secondary"
                      }
                      onClick={() => setTheme({ ambientStyle: style })}
                    >
                      {style}
                    </Button>
                  )
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-3 pr-2">
            <p className="text-sm text-muted">
              Export your deck for the stage, boardroom, or web player.
            </p>
            <Button
              className="w-full"
              variant="accent"
              onClick={() => void exportDeckToPptx(deck)}
            >
              Download PPTX
            </Button>
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => printDeckToPdf(deck)}
            >
              Print / Save PDF
            </Button>
            <Button className="w-full" variant="outline" asChild>
              <a href="/present" target="_blank" rel="noreferrer">
                Open Web Player
              </a>
            </Button>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </aside>
  );
}
