import type { ContentBlock, DeckTheme, Slide } from "@/types/deck";
import { cn } from "@/lib/utils";

interface SlideShellProps {
  slide: Slide;
  theme: DeckTheme;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function SlideShell({
  slide,
  theme,
  children,
  className,
  style,
}: SlideShellProps) {
  const bg = resolveBackground(slide, theme);
  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden p-8 md:p-12",
        className
      )}
      style={{
        background: bg,
        color: theme.colors.foreground,
        fontFamily: theme.typography.bodyFont,
        ...style,
      }}
      data-layout={slide.layoutType}
      data-bg={slide.backgroundEffect}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div
          className="absolute -left-20 top-10 h-64 w-64 rounded-full blur-3xl"
          style={{ background: theme.colors.primary, opacity: 0.25 }}
        />
        <div
          className="absolute -right-16 bottom-0 h-72 w-72 rounded-full blur-3xl"
          style={{ background: theme.colors.secondary, opacity: 0.2 }}
        />
      </div>
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </div>
  );
}

function resolveBackground(slide: Slide, theme: DeckTheme): string {
  switch (slide.backgroundEffect) {
    case "aurora":
      return `linear-gradient(135deg, ${theme.colors.background} 0%, #1a1040 45%, #0a2a3a 100%)`;
    case "cyber-grid":
      return `linear-gradient(180deg, ${theme.colors.background} 0%, #0c1224 100%)`;
    case "gradient":
      return `linear-gradient(145deg, ${theme.colors.background}, #12182b 55%, #1a1030)`;
    case "starfield":
    case "floating-orbs":
    case "3d-particles":
      return "transparent";
    case "color":
    default:
      return theme.colors.background;
  }
}

export function SlideHeader({
  headline,
  subheadline,
  theme,
  align = "left",
  className,
}: {
  headline: string;
  subheadline?: string;
  theme: DeckTheme;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <header
      className={cn(
        "mb-8 space-y-3",
        align === "center" && "text-center",
        className
      )}
    >
      <h1
        className={cn(
          "font-semibold tracking-tight text-balance",
          theme.typography.scale === "dramatic"
            ? "text-4xl md:text-5xl lg:text-6xl"
            : theme.typography.scale === "comfortable"
              ? "text-3xl md:text-4xl"
              : "text-2xl md:text-3xl"
        )}
        style={{ fontFamily: theme.typography.headingFont }}
      >
        {headline}
      </h1>
      {subheadline ? (
        <p className="max-w-3xl text-base text-white/70 md:text-lg">
          {subheadline}
        </p>
      ) : null}
    </header>
  );
}

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

  if (block.type === "stat") {
    return (
      <div
        className={cn(
          "rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md",
          className
        )}
      >
        <div
          className="text-4xl font-bold tracking-tight md:text-5xl"
          style={{ color: accent }}
        >
          {block.value}
        </div>
        <div className="mt-2 text-sm text-white/65">{block.label}</div>
      </div>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote
        className={cn(
          "rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md",
          className
        )}
      >
        <p className="text-xl font-medium leading-relaxed text-white/90 md:text-2xl">
          “{block.body}”
        </p>
        {block.title ? (
          <footer className="mt-4 text-sm uppercase tracking-widest text-white/50">
            {block.title}
          </footer>
        ) : null}
      </blockquote>
    );
  }

  if (block.type === "bullet-list") {
    return (
      <ul
        className={cn(
          "space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md",
          className
        )}
      >
        {(block.items ?? []).map((item) => (
          <li key={item} className="flex gap-3 text-white/85">
            <span
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: accent }}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      className={cn(
        "group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/[0.08]",
        className
      )}
      style={{
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px ${accent}10`,
      }}
    >
      {block.title ? (
        <h3 className="mb-2 text-lg font-semibold" style={{ color: accent }}>
          {block.title}
        </h3>
      ) : null}
      {block.body ? (
        <p className="text-sm leading-relaxed text-white/75">{block.body}</p>
      ) : null}
      {block.items?.length ? (
        <ul className="mt-3 space-y-1.5">
          {block.items.map((item) => (
            <li key={item} className="text-sm text-white/65">
              · {item}
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
  const centered =
    slide.layoutType === "title" || slide.layoutType === "cinematic-canvas";

  return (
    <>
      <SlideHeader
        headline={slide.headline}
        subheadline={slide.subheadline}
        theme={theme}
        align={centered ? "center" : "left"}
        className={centered ? "mx-auto" : undefined}
      />

      {slide.layoutType === "title" && (
        <div className="mx-auto mt-auto flex max-w-2xl flex-col items-center gap-4 pb-8">
          {slide.blocks.map((block, i) => renderBlock(block, i))}
        </div>
      )}

      {slide.layoutType === "split" && (
        <div className="grid flex-1 gap-4 md:grid-cols-2">
          {slide.blocks.map((block, i) => renderBlock(block, i))}
        </div>
      )}

      {slide.layoutType === "grid-3" && (
        <div className="grid flex-1 gap-4 md:grid-cols-3">
          {slide.blocks.map((block, i) => renderBlock(block, i))}
        </div>
      )}

      {slide.layoutType === "stat-callout" && (
        <div className="grid flex-1 items-center gap-4 md:grid-cols-3">
          {slide.blocks.map((block, i) => renderBlock(block, i))}
        </div>
      )}

      {slide.layoutType === "timeline" && (
        <div className="relative flex flex-1 flex-col justify-center gap-4">
          <div
            className="absolute bottom-4 left-4 top-4 w-px md:left-6"
            style={{ background: `${theme.colors.primary}55` }}
          />
          {slide.blocks.map((block, i) => (
            <div key={block.id} className="relative pl-10 md:pl-14">
              <div
                className="absolute left-2.5 top-5 h-3 w-3 rounded-full md:left-[18px]"
                style={{ background: theme.colors.primary }}
              />
              {renderBlock(block, i)}
            </div>
          ))}
        </div>
      )}

      {slide.layoutType === "cinematic-canvas" && (
        <div className="mx-auto grid max-w-4xl flex-1 gap-4 md:grid-cols-2">
          {slide.blocks.map((block, i) => renderBlock(block, i))}
        </div>
      )}
    </>
  );
}
