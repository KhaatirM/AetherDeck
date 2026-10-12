"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { DeckTier, TemplatePreset } from "@/types/deck";
import { Logo } from "@/components/brand/logo";
import { DescribeStep } from "@/components/create/describe-step";
import { ConfigureStep } from "@/components/create/configure-step";
import { GeneratingStep } from "@/components/create/generating-step";
import { TEMPLATE_PROMPTS } from "@/lib/templates";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Step = "describe" | "configure" | "generating";

const STEPS: { id: Step; label: string }[] = [
  { id: "describe", label: "Describe" },
  { id: "configure", label: "Direct" },
  { id: "generating", label: "Generate" },
];

function inferTemplate(prompt: string): TemplatePreset {
  const text = prompt.toLowerCase();
  if (/\b(pitch|investor|series [a-d]|seed|fundrais)/.test(text)) return "pitch-deck";
  if (/\b(lecture|class|course|lesson|teach|students?)\b/.test(text)) return "lecture";
  if (/\b(keynote|conference|summit|stage)\b/.test(text)) return "cinematic-keynote";
  return "product-launch";
}

interface CreateFlowProps {
  initialPrompt?: string;
  initialTemplate?: TemplatePreset;
}

export function CreateFlow({ initialPrompt, initialTemplate }: CreateFlowProps) {
  const [step, setStep] = useState<Step>(initialPrompt ? "configure" : "describe");
  const [prompt, setPrompt] = useState(
    initialPrompt ?? (initialTemplate ? TEMPLATE_PROMPTS[initialTemplate] : "")
  );
  const [template, setTemplate] = useState<TemplatePreset>(
    initialTemplate ?? inferTemplate(initialPrompt ?? "")
  );
  const [tier, setTier] = useState<DeckTier>("plus");

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="bg-dot-grid absolute inset-0 opacity-70" />
        <div className="absolute left-1/2 top-[-280px] h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,108,255,0.2),transparent)] animate-breathe" />
      </div>

      <header className="relative z-10 flex h-16 items-center justify-between px-6">
        <Logo href="/decks" />
        <ol className="hidden items-center gap-2 sm:flex" aria-label="Progress">
          {STEPS.map((s, i) => (
            <li key={s.id} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex items-center gap-2 text-[12px] transition-colors duration-300",
                  i <= stepIndex ? "text-fg-primary" : "text-fg-tertiary"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full font-mono text-[10px] transition-all duration-300",
                    i < stepIndex && "bg-accent text-white",
                    i === stepIndex && "text-accent-soft shadow-[inset_0_0_0_1px_rgba(124,108,255,0.6)]",
                    i > stepIndex && "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
                  )}
                >
                  {i + 1}
                </span>
                {s.label}
              </span>
              {i < STEPS.length - 1 ? <span className="h-px w-8 bg-white/10" /> : null}
            </li>
          ))}
        </ol>
        <Link
          href="/decks"
          aria-label="Close"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-tertiary transition-colors hover:bg-white/[0.05] hover:text-fg-primary"
        >
          <X className="h-4 w-4" />
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-start justify-center px-6 pb-16 pt-[8vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className="w-full"
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
            transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
          >
            {step === "describe" ? (
              <DescribeStep
                prompt={prompt}
                onPromptChange={setPrompt}
                onContinue={() => setStep("configure")}
              />
            ) : step === "configure" ? (
              <ConfigureStep
                prompt={prompt}
                template={template}
                tier={tier}
                onTemplateChange={setTemplate}
                onTierChange={setTier}
                onBack={() => setStep("describe")}
                onGenerate={() => setStep("generating")}
              />
            ) : (
              <GeneratingStep
                prompt={prompt}
                template={template}
                tier={tier}
                onBack={() => setStep("configure")}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
