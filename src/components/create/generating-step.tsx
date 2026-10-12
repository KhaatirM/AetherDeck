"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, Loader2, RotateCcw } from "lucide-react";
import type { Deck, DeckTier, TemplatePreset } from "@/types/deck";
import { useDeckStore } from "@/store/deck-store";
import { Button } from "@/components/ui/button";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

const STAGES = [
  "Understanding your brief",
  "Structuring the narrative",
  "Designing layouts",
  "Staging transitions",
];

const STAGE_MS = 750;
const ROW_MS = 140;

interface GeneratingStepProps {
  prompt: string;
  template: TemplatePreset;
  tier: DeckTier;
  onBack: () => void;
}

export function GeneratingStep({ prompt, template, tier, onBack }: GeneratingStepProps) {
  const router = useRouter();
  const createDeck = useDeckStore((s) => s.createDeck);

  const [stage, setStage] = useState(0);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [visibleRows, setVisibleRows] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const finished = useRef(false);

  // Request
  useEffect(() => {
    const controller = new AbortController();
    setError(null);
    setDeck(null);
    setStage(0);
    setVisibleRows(0);
    finished.current = false;

    fetch("/api/generate-deck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, tier, template, slideCount: 7 }),
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = (await res.json()) as { deck?: Deck; error?: string };
        if (!res.ok || !data.deck) throw new Error(data.error ?? "Generation failed");
        setDeck(data.deck);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Generation failed");
      });

    return () => controller.abort();
  }, [prompt, tier, template, attempt]);

  // Stage progression: holds on the last stage until the deck arrives
  useEffect(() => {
    if (error) return;
    if (stage >= STAGES.length - 1 && !deck) return;
    if (stage >= STAGES.length) return;
    const id = window.setTimeout(() => setStage((s) => s + 1), STAGE_MS);
    return () => window.clearTimeout(id);
  }, [stage, deck, error]);

  // Outline reveal, then hand off to the editor
  useEffect(() => {
    if (!deck || stage < STAGES.length) return;
    if (visibleRows < deck.slides.length) {
      const id = window.setTimeout(() => setVisibleRows((n) => n + 1), ROW_MS);
      return () => window.clearTimeout(id);
    }
    if (finished.current) return;
    finished.current = true;
    const id = window.setTimeout(() => {
      createDeck(deck);
      router.push(`/editor/${deck.id}`);
    }, 650);
    return () => window.clearTimeout(id);
  }, [deck, stage, visibleRows, createDeck, router]);

  if (error) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.25)]">
          <AlertCircle className="h-5 w-5 text-red-300" />
        </div>
        <h1 className="mt-5 text-[20px] font-semibold tracking-[-0.02em]">Generation didn’t finish</h1>
        <p className="mt-2 text-[13.5px] text-fg-secondary">{error}</p>
        <div className="mt-8 flex gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            Back
          </Button>
          <Button size="sm" onClick={() => setAttempt((a) => a + 1)}>
            <RotateCcw /> Try again
          </Button>
        </div>
      </div>
    );
  }

  const outlineReady = deck && stage >= STAGES.length;

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(124,108,255,0.9),transparent_60%)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.6, ease: "linear", repeat: Infinity }}
        />
        <span className="absolute inset-[2px] rounded-full bg-ink" />
        <span className="absolute inset-0 rounded-full bg-accent/20 blur-xl" />
        <span className="relative font-mono text-[11px] text-accent-soft">
          {outlineReady ? `${visibleRows}/${deck.slides.length}` : `${Math.min(stage + 1, STAGES.length)}/${STAGES.length}`}
        </span>
      </div>

      <h1 className="mt-8 text-center text-[24px] font-semibold tracking-[-0.03em]">
        {outlineReady ? <span className="text-gradient">{deck.title}</span> : <span className="shimmer-text">Composing your deck</span>}
      </h1>

      <div className="mt-10 w-full">
        <AnimatePresence mode="wait" initial={false}>
          {!outlineReady ? (
            <motion.ul
              key="stages"
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-1"
            >
              {STAGES.map((label, i) => {
                const done = i < stage;
                const current = i === stage;
                return (
                  <li
                    key={label}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] transition-colors duration-500",
                      current ? "bg-white/[0.03] text-fg-primary" : done ? "text-fg-secondary" : "text-fg-tertiary/60"
                    )}
                  >
                    <span className="flex h-4 w-4 items-center justify-center">
                      {done ? (
                        <Check className="h-3.5 w-3.5 text-accent-soft" />
                      ) : current ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-fg-secondary" />
                      ) : (
                        <span className="h-1 w-1 rounded-full bg-current" />
                      )}
                    </span>
                    {label}
                  </li>
                );
              })}
            </motion.ul>
          ) : (
            <motion.ol key="outline" className="flex flex-col gap-1.5">
              {deck.slides.slice(0, visibleRows).map((slide, i) => (
                <motion.li
                  key={slide.id}
                  initial={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                  className="flex items-center gap-3 rounded-lg bg-white/[0.025] px-3 py-2.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]"
                >
                  <span className="font-mono text-[10.5px] text-accent-soft">{String(i + 1).padStart(2, "0")}</span>
                  <span className="truncate text-[13.5px] text-fg-primary">{slide.headline}</span>
                  <span className="ml-auto shrink-0 font-mono text-[10.5px] text-fg-tertiary">{slide.layoutType}</span>
                </motion.li>
              ))}
            </motion.ol>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
