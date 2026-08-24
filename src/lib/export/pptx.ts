import type { Deck } from "@/types/deck";

export async function exportDeckToPptx(deck: Deck): Promise<void> {
  const PptxGenJS = (await import("pptxgenjs")).default;
  const pptx = new PptxGenJS();
  pptx.author = "AetherDeck";
  pptx.title = deck.title;
  pptx.subject = deck.description ?? "Generated with AetherDeck";

  const bg = deck.theme.colors.background.replace("#", "");
  const fg = deck.theme.colors.foreground.replace("#", "");
  const accent = deck.theme.colors.primary.replace("#", "");

  for (const slide of deck.slides) {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: "100%",
      h: "100%",
      fill: { color: bg.length === 6 ? bg : "070A12" },
    });

    s.addText(slide.headline, {
      x: 0.6,
      y: 0.45,
      w: 8.8,
      h: 1,
      fontSize: 32,
      bold: true,
      color: fg.length === 6 ? fg : "F8FAFC",
      fontFace: "Arial",
    });

    if (slide.subheadline) {
      s.addText(slide.subheadline, {
        x: 0.6,
        y: 1.4,
        w: 8.8,
        h: 0.7,
        fontSize: 16,
        color: "94A3B8",
        fontFace: "Arial",
      });
    }

    let y = 2.3;
    for (const block of slide.blocks) {
      const lines: string[] = [];
      if (block.title) lines.push(block.title);
      if (block.value) lines.push(`${block.value} — ${block.label ?? ""}`);
      if (block.body) lines.push(block.body);
      if (block.items?.length) lines.push(...block.items.map((i) => `• ${i}`));

      if (!lines.length) continue;

      s.addText(lines.join("\n"), {
        x: 0.6,
        y,
        w: 8.8,
        h: Math.min(1.4, 0.28 * lines.length + 0.3),
        fontSize: 14,
        color: fg.length === 6 ? fg : "F8FAFC",
        fontFace: "Arial",
        fill: { color: "111827" },
        line: { color: accent.length === 6 ? accent : "8B5CF6", width: 1 },
      });
      y += Math.min(1.55, 0.28 * lines.length + 0.45);
      if (y > 5.2) break;
    }

    if (slide.notes) {
      s.addNotes(slide.notes);
    }
  }

  await pptx.writeFile({
    fileName: `${slugify(deck.title) || "aetherdeck"}.pptx`,
  });
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
