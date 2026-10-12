"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HeroPrompt } from "@/components/marketing/hero-prompt";
import { ProductPreview } from "@/components/marketing/product-preview";
import { EASE_OUT_EXPO } from "@/lib/motion";

export function Hero() {
  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 20, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 1, ease: EASE_OUT_EXPO, delay },
  });

  return (
    <section id="product" className="relative overflow-hidden pb-24 pt-36 sm:pt-44">
      {/* Ambient layers */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="bg-line-grid absolute inset-0" />
        <div className="absolute left-1/2 top-[-260px] h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,108,255,0.28),transparent)] animate-breathe" />
        <div className="absolute left-[62%] top-[120px] h-[360px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(94,231,242,0.10),transparent)] animate-breathe [animation-delay:-4s]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center text-center">
          <motion.div {...enter(0)}>
            <Link
              href="/new"
              className="group mb-8 inline-flex items-center gap-2.5 rounded-full bg-white/[0.03] py-1 pl-1 pr-3.5 text-[12.5px] text-fg-secondary shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] transition-colors hover:text-fg-primary"
            >
              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-medium text-accent-soft shadow-[inset_0_0_0_1px_rgba(124,108,255,0.3)]">
                New
              </span>
              Pro tier with real-time 3D scenes
              <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <motion.h1
            {...enter(0.08)}
            className="max-w-4xl text-balance text-[48px] font-semibold leading-[0.98] tracking-[-0.05em] text-gradient sm:text-[72px] lg:text-[86px]"
          >
            Presentations,{" "}
            <span className="font-serif text-[1.08em] font-normal italic tracking-[-0.02em] text-gradient-accent">
              directed.
            </span>
          </motion.h1>

          <motion.p
            {...enter(0.16)}
            className="mt-7 max-w-xl text-pretty text-[17px] leading-relaxed text-fg-secondary sm:text-[18px]"
          >
            Describe your story once. AetherDeck writes, designs and stages it — from
            minimalist clarity to fully cinematic 3D.
          </motion.p>

          <motion.div {...enter(0.24)} className="mt-10 w-full">
            <HeroPrompt />
            <p className="mt-4 text-[12px] text-fg-tertiary">
              No account needed · Works offline with built-in sample generation
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.4, ease: EASE_OUT_EXPO, delay: 0.35 }}
          className="relative mt-20 [perspective:2000px]"
        >
          <div className="absolute -inset-x-20 -top-20 bottom-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_30%,rgba(124,108,255,0.16),transparent)]" aria-hidden />
          <ProductPreview />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" aria-hidden />
        </motion.div>
      </div>
    </section>
  );
}
