import type { ContentBlock, DeckTheme, Slide } from "@/types/deck";
import { cn } from "@/lib/utils";

/*
 * All slide primitives are designed for a fixed 1280x720 canvas (see ScaledSlide),
 * so sizes are absolute and never depend on viewport breakpoints.
 */

interface SlideShellProps {
  slide: Slide;
  theme: DeckTheme;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  transparent?: boolean;
}

export function SlideShell({
  slide,
  theme,
  children,
  className,
  style,
  transparent = false,
}: SlideShellProps) {
  const { primary, secondary, background, foreground } = theme.colors;
  return (
    <div
      className={cn("relative flex h-full w-full flex-col overflow-hidden px-[80px] py-[68px]", className)}
      style={{
        background: transparent ? "transparent" : background,
        color: foreground,
        fontFamily: theme.typography.bodyFont,
        ...style,
      }}
      data-layout={slide.layoutType}
      data-bg={slide.backgroundEffect}
    >
      {!transparent ? <Atmosphere slide={slide} primary={primary} secondary={secondary} /> : null}
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </div>
  );
}

function Atmosphere({
  slide,
  primary,
  secondary,
}: {
  slide: Slide;
  primary: string;
  secondary: string;
}) {
  const effect = slide.backgroundEffect;
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {effect === "aurora" || effect === "starfield" || effect === "floating-orbs" || effect === "3d-particles" ? (
        <>
          <div
            className="absolute -top-[30%] left-[10%] h-[620px] w-[820px] rounded-full blur-[120px]"
            style={{ background: primary, opacity: 0.22 }}
          />
          <div
            className="absolute -bottom-[35%] right-[-5%] h-[560px] w-[700px] rounded-full blur-[130px]"
            style={{ background: secondary, opacity: 0.14 }}
          />
        </>
      ) : null}
      {effect === "gradient" ? (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(900px 520px at 85% -10%, ${primary}2e, transparent 70%), radial-gradient(700px 480px at -10% 110%, ${secondary}1c, transparent 70%)`,
          }}
        />
      ) : null}
      {effect === "cyber-grid" ? (
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse 80% 70% at 50% 0%, #000 30%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 0%, #000 30%, transparent 100%)",
            }}
          />
          <div
            className="absolute -top-[40%] left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full blur-[120px]"
            style={{ background: primary, opacity: 0.16 }}
          />
        </>
      ) : null}
      {effect === "color" ? (
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${primary}80, transparent)` }}
        />
      ) : null}
    </div>
  );
}

export function SlideHeader({
  headline,
  subheadline,
  theme,
  align = "left",
  hero = false,
}: {
  headline: string;
  subheadline?: string;
  theme: DeckTheme;
  align?: "left" | "center";
  hero?: boolean;
}) {
  return (
    <header
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start",
        hero ? "gap-6" : "mb-11 gap-4"
      )}
    >
      <h1
        className={cn(
          "text-balance font-semibold",
          hero
            ? "max-w-[1000px] text-[84px] leading-[0.98] tracking-[-0.045em]"
            : "max-w-[960px] text-[52px] leading-[1.04] tracking-[-0.035em]"
        )}
        style={{ fontFamily: theme.typography.headingFont }}
      >
        {headline}
      </h1>
      {subheadline ? (
        <p
          className={cn(
            "text-pretty leading-[1.45] tracking-[-0.01em]",
            hero ? "max-w-[760px] text-[24px]" : "max-w-[820px] text-[21px]"
          )}
          style={{ color: `${theme.colors.foreground}a6` }}
        >
          {subheadline}
        </p>
      ) : null}
    </header>
  );
}

const cardSurface =
  "rounded-[22px] border border-white/[0.08] bg-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]";

export function BlockCard({
  block,
  theme,
  className,
}: {
  block: ContentBlock;
  theme: DeckTheme;
  className?: string;
}) {
  const accent = block.accentColor ?? theme.colors.primary;
  const fg = theme.colors.foreground;

  if (block.type === "stat") {
    return (
      <div className={cn(cardSurface, "flex h-full flex-col justify-between p-9", className)}>
        <div
          className="text-[88px] font-semibold leading-none tracking-[-0.05em]"
          style={{
            backgroundImage: `linear-gradient(180deg, ${fg} 20%, ${accent})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {block.value}
        </div>
        <div className="mt-8 text-[19px] leading-snug" style={{ color: `${fg}99` }}>
          {block.label}
        </div>
      </div>
    );
  }

  if (block.type === "quote") {
    return (
      <figure className={cn(cardSurface, "flex h-full flex-col justify-between p-10", className)}>
        <blockquote
          className="text-[30px] leading-[1.25] tracking-[-0.02em]"
          style={{ fontFamily: "var(--font-serif)", color: fg }}
        >
          “{block.body}”
        </blockquote>
        {block.title ? (
          <figcaption
            className="mt-8 font-mono text-[13px] uppercase tracking-[0.18em]"
            style={{ color: `${fg}73` }}
          >
            {block.title}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (block.type === "bullet-list") {
    return (
      <ul className={cn("flex flex-col gap-4", className)}>
        {(block.items ?? []).map((item) => (
          <li key={item} className="flex items-center gap-4 text-[21px]" style={{ color: `${fg}d9` }}>
            <span className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: accent, boxShadow: `0 0 14px ${accent}` }} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "text") {
    return (
      <p className={cn("text-[20px] leading-relaxed", className)} style={{ color: `${fg}99` }}>
        {block.body}
      </p>
    );
  }

  return (
    <div className={cn(cardSurface, "flex h-full flex-col p-9", className)}>
      {block.type === "diagram-step" || block.type === "timeline-item" ? (
        <span
          className="mb-5 font-mono text-[13px] tracking-[0.12em]"
          style={{ color: accent }}
        >
          {String((block.stepIndex ?? 0) + 1).padStart(2, "0")}
        </span>
      ) : (
        <span
          className="mb-6 block h-[3px] w-10 rounded-full"
          style={{ background: accent, boxShadow: `0 0 18px ${accent}` }}
        />
      )}
      {block.title ? (
        <h3 className="text-[26px] font-semibold leading-tight tracking-[-0.025em]" style={{ color: fg }}>
          {block.title}
        </h3>
      ) : null}
      {block.body ? (
        <p className="mt-3 text-[18px] leading-[1.5]" style={{ color: `${fg}a0` }}>
          {block.body}
        </p>
      ) : null}
      {block.items?.length ? (
        <ul className="mt-auto flex flex-col gap-2.5 pt-7">
          {block.items.map((item) => (
            <li key={item} className="flex items-center gap-3 text-[17px]" style={{ color: `${fg}b3` }}>
              <span className="h-px w-4" style={{ background: `${fg}55` }} />
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function SlideContentLayout({
  slide,
  theme,
  renderBlock,
}: {
  slide: Slide;
  theme: DeckTheme;
  renderBlock: (block: ContentBlock, index: number) => React.ReactNode;
}) {
  const blocks = (className?: string) =>
    slide.blocks.map((block, i) => (
      <div key={block.id} className={className}>
        {renderBlock(block, i)}
      </div>
    ));

  switch (slide.layoutType) {
    case "title":
      return (
        <div className="flex h-full flex-col items-center justify-center gap-12">
          <SlideHeader
            headline={slide.headline}
            subheadline={slide.subheadline}
            theme={theme}
            align="center"
            hero
          />
          <div className="flex flex-col items-center gap-4">{blocks()}</div>
        </div>
      );

    case "split":
      return (
        <>
          <SlideHeader headline={slide.headline} subheadline={slide.subheadline} theme={theme} />
          <div className="grid flex-1 grid-cols-2 gap-6">{blocks("h-full")}</div>
        </>
      );

    case "grid-3":
      return (
        <>
          <SlideHeader headline={slide.headline} subheadline={slide.subheadline} theme={theme} />
          <div className="grid flex-1 grid-cols-3 gap-6">{blocks("h-full")}</div>
        </>
      );

    case "stat-callout":
      return (
        <>
          <SlideHeader headline={slide.headline} subheadline={slide.subheadline} theme={theme} />
          <div
            className="grid flex-1 gap-6"
            style={{ gridTemplateColumns: `repeat(${Math.max(1, Math.min(slide.blocks.length, 4))}, minmax(0, 1fr))` }}
          >
            {blocks("h-full")}
          </div>
        </>
      );

    case "timeline":
      return (
        <>
          <SlideHeader headline={slide.headline} subheadline={slide.subheadline} theme={theme} />
          <div className="relative mt-auto">
            <div
              className="absolute left-0 right-0 top-[7px] h-px"
              style={{ background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.foreground}26 80%)` }}
            />
            <div
              className="grid gap-8"
              style={{ gridTemplateColumns: `repeat(${Math.max(1, slide.blocks.length)}, minmax(0, 1fr))` }}
            >
              {slide.blocks.map((block, i) => (
                <div key={block.id} className="relative pt-10">
                  <span
                    className="absolute left-0 top-0 h-[15px] w-[15px] rounded-full border-[3px]"
                    style={{
                      borderColor: theme.colors.primary,
                      background: theme.colors.background,
                      boxShadow: `0 0 20px ${theme.colors.primary}`,
                    }}
                  />
                  {renderBlock(block, i)}
                </div>
              ))}
            </div>
          </div>
        </>
      );

    case "cinematic-canvas":
      return (
        <>
          <SlideHeader
            headline={slide.headline}
            subheadline={slide.subheadline}
            theme={theme}
            align="center"
          />
          <div
            className="mx-auto grid w-full max-w-[1040px] flex-1 gap-6"
            style={{ gridTemplateColumns: slide.blocks.length > 2 ? "1.3fr 1fr 1fr" : "repeat(2, minmax(0, 1fr))" }}
          >
            {blocks("h-full")}
          </div>
        </>
      );
  }
}

/** Timeline items render without card chrome so the horizontal rail reads cleanly. */
export function TimelineItem({ block, theme }: { block: ContentBlock; theme: DeckTheme }) {
  const fg = theme.colors.foreground;
  return (
    <div>
      <span className="font-mono text-[13px] tracking-[0.12em]" style={{ color: theme.colors.primary }}>
        {String((block.stepIndex ?? 0) + 1).padStart(2, "0")}
      </span>
      <h3 className="mt-3 text-[26px] font-semibold tracking-[-0.025em]" style={{ color: fg }}>
        {block.title}
      </h3>
      {block.body ? (
        <p className="mt-2.5 text-[18px] leading-[1.5]" style={{ color: `${fg}99` }}>
          {block.body}
        </p>
      ) : null}
    </div>
  );
}

export function renderStaticBlock(block: ContentBlock, theme: DeckTheme) {
  return block.type === "timeline-item" ? (
    <TimelineItem block={block} theme={theme} />
  ) : (
    <BlockCard block={block} theme={theme} />
  );
}
