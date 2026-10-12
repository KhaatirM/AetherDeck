import type { DeckTheme } from "@/types/deck";

export const aetherTheme: DeckTheme = {
  name: "Aether",
  mode: "dark",
  colors: {
    primary: "#7C6CFF",
    secondary: "#5EE7F2",
    accent: "#B4A9FF",
    background: "#08090B",
    foreground: "#EDEDEF",
    muted: "#A1A1AA",
    card: "rgba(255, 255, 255, 0.03)",
    border: "rgba(255, 255, 255, 0.08)",
  },
  typography: {
    headingFont: "var(--font-display)",
    bodyFont: "var(--font-sans)",
    scale: "dramatic",
  },
  ambientStyle: "cinematic",
};

export const emberTheme: DeckTheme = {
  ...aetherTheme,
  name: "Ember",
  colors: {
    ...aetherTheme.colors,
    primary: "#FF8A5C",
    secondary: "#FFC46B",
    accent: "#FFB199",
    background: "#0B0908",
  },
};

export const glacierTheme: DeckTheme = {
  ...aetherTheme,
  name: "Glacier",
  colors: {
    ...aetherTheme.colors,
    primary: "#5EE7F2",
    secondary: "#7C6CFF",
    accent: "#A5F3FC",
    background: "#070A0C",
  },
};
