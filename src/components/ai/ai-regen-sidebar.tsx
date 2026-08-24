"use client";

import { useState } from "react";
import { Send, Bot, RotateCcw } from "lucide-react";
import { useDeckStore, selectActiveSlide } from "@/store/deck-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function AiRegenSidebar() {
  const slide = useDeckStore(selectActiveSlide);
  const updateSlide = useDeckStore((s) => s.updateSlide);
  const resetToMock = useDeckStore((s) => s.resetToMock);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m0",
      role: "assistant",
      content:
        "I can rewrite the active slide headline, tighten copy, or suggest a stronger layout. Try: “Make this more cinematic.”",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSend() {
    if (!input.trim() || busy) return;
    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: "user",
      content: input.trim(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setBusy(true);

    // Lightweight local regen heuristics — keeps the UI useful offline.
    await new Promise((r) => setTimeout(r, 450));
    const lower = userMsg.content.toLowerCase();
    let reply =
      "Updated the active slide with a sharper narrative beat. Switch tiers to feel the difference.";

    if (lower.includes("cinematic") || lower.includes("dramatic")) {
      updateSlide(slide.id, {
        headline: amplify(slide.headline),
        subheadline:
          slide.subheadline ??
          "Lean into atmosphere, pause, and visual depth.",
        backgroundEffect: "aurora",
        transitionType: "cinematic-zoom",
      });
      reply =
        "Amplified the headline and set an aurora background with a cinematic zoom transition.";
    } else if (lower.includes("shorter") || lower.includes("tighten")) {
      updateSlide(slide.id, {
        headline: slide.headline.split(" ").slice(0, 6).join(" "),
        subheadline: slide.subheadline
          ? slide.subheadline.split(" ").slice(0, 14).join(" ") + "…"
          : slide.subheadline,
      });
      reply = "Tightened the headline and subheadline for faster scanning.";
    } else if (lower.includes("stat") || lower.includes("number")) {
      updateSlide(slide.id, {
        layoutType: "stat-callout",
        headline: "Proof Points",
      });
      reply = "Switched this frame to a stat-callout layout for sharper proof.";
    } else {
      updateSlide(slide.id, {
        headline: `${slide.headline.replace(/\.$/, "")} — Refined`,
      });
    }

    setMessages((m) => [
      ...m,
      { id: `a_${Date.now()}`, role: "assistant", content: reply },
    ]);
    setBusy(false);
  }

  return (
    <div className="flex h-48 flex-col border-t border-border bg-black/30 md:h-56">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Bot className="h-4 w-4 text-secondary" />
          AI regen chat
        </div>
        <Button size="sm" variant="ghost" onClick={resetToMock}>
          <RotateCcw className="h-3.5 w-3.5" />
          Reset demo
        </Button>
      </div>
      <ScrollArea className="flex-1 px-4 py-2">
        <div className="space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={
                msg.role === "assistant"
                  ? "rounded-lg bg-white/5 px-3 py-2 text-sm text-white/80"
                  : "ml-8 rounded-lg bg-primary/20 px-3 py-2 text-sm"
              }
            >
              {msg.content}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex gap-2 border-t border-border p-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          placeholder="Rewrite this slide…"
          className="min-h-[40px] resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void onSend();
            }
          }}
        />
        <Button size="icon" disabled={busy} onClick={() => void onSend()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function amplify(text: string): string {
  if (text.length < 8) return `${text} — Unleashed`;
  return text.replace(/\bBeyond\b/i, "Beyond the Horizon").replace(/\.$/, "");
}
