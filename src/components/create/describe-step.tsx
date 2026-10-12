"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";

const EXAMPLES = [
  "A Series A pitch for an AI infrastructure startup",
  "Launching a smart home device that learns routines",
  "A lecture on why stories are memorable",
  "Quarterly review for a 40-person design team",
];

interface DescribeStepProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onContinue: () => void;
}

export function DescribeStep({ prompt, onPromptChange, onContinue }: DescribeStepProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const canContinue = prompt.trim().length >= 3;

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
      <h1 className="text-balance text-[36px] font-semibold leading-[1.05] tracking-[-0.04em] text-gradient sm:text-[48px]">
        What’s the{" "}
        <span className="font-serif font-normal italic text-gradient-accent">story?</span>
      </h1>
      <p className="mt-4 text-[15px] text-fg-secondary">
        A sentence is enough. An outline is even better.
      </p>

      <div className="mt-10 w-full rounded-2xl bg-surface-1/90 p-2 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.09),0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-shadow focus-within:shadow-[0_0_0_1px_rgba(124,108,255,0.55),0_0_0_5px_rgba(124,108,255,0.1),0_30px_80px_-30px_rgba(124,108,255,0.4)]">
        <textarea
          ref={ref}
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && canContinue) {
              e.preventDefault();
              onContinue();
            }
          }}
          rows={5}
          placeholder="Describe your topic, audience and the key points you want to land…"
          className="w-full resize-none bg-transparent px-3 py-2.5 text-[15px] leading-relaxed text-fg-primary outline-none placeholder:text-fg-tertiary"
        />
        <div className="flex items-center justify-between px-2 pb-1">
          <span className="flex items-center gap-1.5 text-[11.5px] text-fg-tertiary">
            <Kbd>Ctrl</Kbd>
            <Kbd>
              <CornerDownLeft className="h-2.5 w-2.5" />
            </Kbd>
            to continue
          </span>
          <Button size="sm" disabled={!canContinue} onClick={onContinue}>
            Continue
            <ArrowRight />
          </Button>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => {
              onPromptChange(example);
              ref.current?.focus();
            }}
            className="rounded-full bg-white/[0.03] px-3.5 py-1.5 text-[12.5px] text-fg-secondary shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)] transition-all hover:bg-white/[0.06] hover:text-fg-primary"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
