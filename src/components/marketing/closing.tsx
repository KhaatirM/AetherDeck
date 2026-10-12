import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { Reveal } from "@/components/marketing/reveal";

export function ClosingCta() {
  return (
    <section className="relative px-6 py-32">
      <Reveal>
        <div className="bg-noise relative mx-auto max-w-5xl overflow-hidden rounded-[28px] bg-surface-1 px-8 py-20 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)] sm:px-16">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute left-1/2 top-[-60%] h-[460px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,108,255,0.35),transparent)] animate-breathe" />
            <div className="bg-dot-grid absolute inset-0 opacity-60" />
          </div>
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-balance text-[36px] font-semibold leading-[1.05] tracking-[-0.04em] text-gradient sm:text-[52px]">
              Your next presentation deserves a{" "}
              <span className="font-serif font-normal italic text-gradient-accent">stage.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-md text-[15.5px] leading-relaxed text-fg-secondary">
              Start with a sentence. Leave with a deck that feels like it took a week.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button variant="light" size="lg" asChild>
                <Link href="/new">
                  Start creating
                  <ArrowRight />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/decks">Open the app</Link>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

const FOOTER_LINKS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "Create a deck", href: "/new" },
      { label: "My decks", href: "/decks" },
      { label: "Templates", href: "/new" },
    ],
  },
  {
    heading: "Tiers",
    links: [
      { label: "Basic", href: "/#tiers" },
      { label: "Plus", href: "/#tiers" },
      { label: "Pro", href: "/#tiers" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "GitHub", href: "https://github.com/KhaatirM/AetherDeck" },
      { label: "How it works", href: "/#workflow" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-fg-tertiary">
            Cinematic presentations, written and staged by AI.
          </p>
        </div>
        {FOOTER_LINKS.map((group) => (
          <div key={group.heading}>
            <div className="mb-4 text-[12px] font-medium text-fg-secondary">{group.heading}</div>
            <ul className="flex flex-col gap-2.5">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[13px] text-fg-tertiary transition-colors hover:text-fg-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-hairline">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-[12px] text-fg-tertiary">
          <span>© {new Date().getFullYear()} AetherDeck</span>
          <span className="font-mono">Made for the stage</span>
        </div>
      </div>
    </footer>
  );
}
