import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { Reveal } from "@/components/marketing/reveal";
import { COMPANY_NAME, LEGAL_DOCUMENTS } from "@/lib/legal";

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

interface FooterGroup {
  heading: string;
  links: { label: string; href: string }[];
}

const FOOTER_LINKS: FooterGroup[] = [
  {
    heading: "Product",
    links: [
      { label: "Create a deck", href: "/new" },
      { label: "My decks", href: "/decks" },
      { label: "Templates", href: "/#templates" },
      { label: "Visual tiers", href: "/#tiers" },
      { label: "Features", href: "/#features" },
      { label: "How it works", href: "/#workflow" },
    ],
  },
  {
    heading: "Explore",
    links: [
      { label: "Pitch decks", href: "/new?template=pitch-deck" },
      { label: "Product launches", href: "/new?template=product-launch" },
      { label: "Lectures", href: "/new?template=lecture" },
      { label: "Keynotes", href: "/new?template=cinematic-keynote" },
    ],
  },
  {
    heading: "Legal",
    links: LEGAL_DOCUMENTS.map((doc) => ({ label: doc.title, href: `/legal/${doc.slug}` })),
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[520px]" aria-hidden>
        <div className="absolute bottom-[-260px] left-1/2 h-[520px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,108,255,0.14),transparent)]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div
          aria-hidden
          className="select-none overflow-hidden pt-8 text-center text-[clamp(56px,15.5vw,196px)] font-semibold leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.06)] [mask-image:linear-gradient(to_bottom,black_30%,transparent_95%)]"
        >
          <span className="bg-gradient-to-b from-white/[0.07] to-transparent bg-clip-text">AetherDeck</span>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-[260px] text-[13px] leading-relaxed text-fg-tertiary">
              Cinematic presentations, written and staged by AI.
            </p>
            <Button variant="secondary" size="sm" className="mt-6" asChild>
              <Link href="/new">
                Start creating
                <ArrowRight />
              </Link>
            </Button>
          </div>

          {FOOTER_LINKS.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <div className="mb-4 text-[13px] font-medium text-fg-primary">{group.heading}</div>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-fg-tertiary transition-colors duration-200 hover:text-fg-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-hairline py-7 text-[12px] text-fg-tertiary sm:flex-row sm:items-center sm:justify-between">
          <span>
            AetherDeck is developed by <span className="text-fg-secondary">{COMPANY_NAME}</span>
          </span>
          <span>
            © {new Date().getFullYear()} {COMPANY_NAME} All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
