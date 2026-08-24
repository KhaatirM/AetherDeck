import Link from "next/link";
import {
  Clapperboard,
  Layers3,
  Sparkles,
  Wand2,
  Orbit,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const TIERS = [
  {
    name: "Basic",
    icon: Layers3,
    copy: "Modern minimalist cards, grids, timelines, and crisp typography.",
  },
  {
    name: "Plus",
    icon: Wand2,
    copy: "Framer Motion reveals, morphing transitions, and step diagrams.",
  },
  {
    name: "Pro",
    icon: Orbit,
    copy: "Three.js worlds — starfields, orbs, camera travel, ambient light.",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-dvh overflow-hidden">
      <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-6 py-10">
        <nav className="mb-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Clapperboard className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold tracking-wide">
              AetherDeck
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/editor">Open editor</Link>
            </Button>
            <Button variant="accent" size="sm" asChild>
              <Link href="/present">Present demo</Link>
            </Button>
          </div>
        </nav>

        <section className="flex flex-1 flex-col justify-center gap-10 pb-16">
          <div className="max-w-3xl space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-3 py-1 text-xs text-muted">
              <Sparkles className="h-3.5 w-3.5 text-secondary" />
              AI presentations with three cinematic tiers
            </p>
            <h1 className="text-gradient text-5xl font-semibold tracking-tight md:text-7xl">
              Present beyond slides.
            </h1>
            <p className="max-w-2xl text-lg text-white/70 md:text-xl">
              AetherDeck turns a prompt into a living deck — Minimalist Basic,
              Fluid Plus, or fully immersive Pro with WebGL atmospheres. Built
              for founders, educators, and keynote storytellers.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" variant="accent" asChild>
                <Link href="/editor">Launch workspace</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/present">Watch the demo deck</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className="rounded-2xl border border-border bg-white/5 p-5 backdrop-blur-xl transition hover:border-primary/40 hover:bg-white/[0.07]"
              >
                <tier.icon className="mb-3 h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">{tier.name}</h2>
                <p className="mt-2 text-sm text-muted">{tier.copy}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-black/30 px-5 py-4 text-sm text-muted">
            <FileDown className="h-4 w-4 text-secondary" />
            Export to Web Player, PDF, and PPTX · Works offline with mock AI
            when no API key is set
          </div>
        </section>
      </div>
    </main>
  );
}
