import type { BackgroundEffect, LayoutType } from "@/types/deck";

/** Miniature wireframes for each layout, drawn on a 48x27 grid. */
export function LayoutGlyph({ layout }: { layout: LayoutType }) {
  const bar = "rgba(255,255,255,0.55)";
  const block = "rgba(255,255,255,0.14)";
  return (
    <svg viewBox="0 0 48 27" className="h-full w-full" aria-hidden>
      {layout === "title" && (
        <>
          <rect x="12" y="9" width="24" height="3" rx="1" fill={bar} />
          <rect x="16" y="15" width="16" height="2" rx="1" fill={block} />
        </>
      )}
      {layout === "split" && (
        <>
          <rect x="5" y="4" width="18" height="2.5" rx="1" fill={bar} />
          <rect x="5" y="10" width="18" height="13" rx="1.5" fill={block} />
          <rect x="25" y="10" width="18" height="13" rx="1.5" fill={block} />
        </>
      )}
      {layout === "grid-3" && (
        <>
          <rect x="5" y="4" width="18" height="2.5" rx="1" fill={bar} />
          {[5, 18, 31].map((x) => (
            <rect key={x} x={x} y="10" width="12" height="13" rx="1.5" fill={block} />
          ))}
        </>
      )}
      {layout === "stat-callout" && (
        <>
          <rect x="5" y="4" width="18" height="2.5" rx="1" fill={bar} />
          {[5, 18, 31].map((x) => (
            <g key={x}>
              <rect x={x} y="10" width="12" height="13" rx="1.5" fill={block} />
              <rect x={x + 2} y="13" width="6" height="3" rx="0.8" fill={bar} />
            </g>
          ))}
        </>
      )}
      {layout === "timeline" && (
        <>
          <rect x="5" y="4" width="18" height="2.5" rx="1" fill={bar} />
          <rect x="5" y="16" width="38" height="0.8" fill={block} />
          {[5, 18, 31].map((x) => (
            <g key={x}>
              <circle cx={x + 1} cy="16.4" r="1.6" fill={bar} />
              <rect x={x} y="19.5" width="9" height="1.6" rx="0.8" fill={block} />
            </g>
          ))}
        </>
      )}
      {layout === "cinematic-canvas" && (
        <>
          <rect x="14" y="4" width="20" height="2.5" rx="1" fill={bar} />
          <rect x="8" y="10" width="15" height="13" rx="1.5" fill={block} />
          <rect x="25" y="10" width="15" height="13" rx="1.5" fill={block} />
        </>
      )}
    </svg>
  );
}

export function backgroundPreview(effect: BackgroundEffect, primary: string, secondary: string): string {
  switch (effect) {
    case "color":
      return "#0d0e11";
    case "gradient":
      return `radial-gradient(circle at 85% 0%, ${primary}66, transparent 60%), radial-gradient(circle at 0% 100%, ${secondary}44, transparent 60%), #0b0c0f`;
    case "aurora":
      return `radial-gradient(ellipse at 30% 0%, ${primary}aa, transparent 60%), radial-gradient(ellipse at 90% 100%, ${secondary}77, transparent 55%), #08090b`;
    case "cyber-grid":
      return `linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px) 0 0 / 8px 8px, linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px) 0 0 / 8px 8px, radial-gradient(circle at 50% 0%, ${primary}55, #08090b 70%)`;
    case "starfield":
      return "radial-gradient(1px 1px at 20% 30%, #fff, transparent), radial-gradient(1px 1px at 70% 60%, #fff, transparent), radial-gradient(1px 1px at 40% 80%, #fff, transparent), radial-gradient(1px 1px at 85% 20%, #fff, transparent), radial-gradient(1px 1px at 55% 40%, #ffffffaa, transparent), #05060a";
    case "floating-orbs":
      return `radial-gradient(circle at 30% 40%, ${primary} 0 12%, transparent 13%), radial-gradient(circle at 70% 65%, ${secondary} 0 9%, transparent 10%), radial-gradient(circle at 60% 25%, ${primary}88 0 6%, transparent 7%), #07080b`;
    case "3d-particles":
      return `radial-gradient(1.5px 1.5px at 25% 35%, ${primary}, transparent), radial-gradient(1.5px 1.5px at 65% 55%, ${primary}, transparent), radial-gradient(1.5px 1.5px at 45% 75%, ${secondary}, transparent), radial-gradient(1.5px 1.5px at 80% 30%, ${primary}, transparent), #06070a`;
  }
}
