import { Reveal, SectionHeading } from "@/components/marketing/reveal";

const STEPS = [
  {
    title: "Describe",
    body: "A sentence, an outline or a full brief. Pick a template if you want a head start.",
  },
  {
    title: "Direct",
    body: "Choose the visual tier, refine copy in the inspector, and reshape any slide with AI.",
  },
  {
    title: "Deliver",
    body: "Present fullscreen with one keystroke, or export to PowerPoint and PDF.",
  },
];

export function Workflow() {
  return (
    <section id="workflow" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="How it works" title="From blank page to standing ovation." />
        <div className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
          <div
            className="pointer-events-none absolute left-0 right-0 top-[19px] hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:block"
            aria-hidden
          />
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1} className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink font-mono text-[12px] text-accent-soft shadow-[inset_0_0_0_1px_rgba(124,108,255,0.35),0_0_24px_-4px_rgba(124,108,255,0.5)]">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-6 text-[19px] font-semibold tracking-[-0.02em] text-fg-primary">
                {step.title}
              </h3>
              <p className="mt-2 max-w-xs text-[14px] leading-relaxed text-fg-secondary">{step.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
