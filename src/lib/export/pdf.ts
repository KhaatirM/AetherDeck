import type { Deck } from "@/types/deck";

/** Opens a print-optimized HTML document for browser Save-as-PDF. */
export function printDeckToPdf(deck: Deck): void {
  const win = window.open("", "_blank", "noopener,noreferrer,width=1200,height=800");
  if (!win) {
    alert("Please allow popups to export PDF.");
    return;
  }

  const pages = deck.slides
    .map((slide, index) => {
      const blocks = slide.blocks
        .map((block) => {
          const title = block.title
            ? `<h3 style="margin:0 0 6px;color:${block.accentColor ?? deck.theme.colors.primary}">${escapeHtml(block.title)}</h3>`
            : "";
          const value = block.value
            ? `<div style="font-size:28px;font-weight:700">${escapeHtml(block.value)}</div>`
            : "";
          const label = block.label
            ? `<div style="opacity:.7;font-size:12px">${escapeHtml(block.label)}</div>`
            : "";
          const body = block.body
            ? `<p style="margin:0;opacity:.85">${escapeHtml(block.body)}</p>`
            : "";
          const items = block.items?.length
            ? `<ul>${block.items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`
            : "";
          return `<div class="card">${title}${value}${label}${body}${items}</div>`;
        })
        .join("");

      return `
        <section class="page">
          <div class="meta">Slide ${index + 1} · ${escapeHtml(deck.tier.toUpperCase())}</div>
          <h1>${escapeHtml(slide.headline)}</h1>
          ${slide.subheadline ? `<p class="sub">${escapeHtml(slide.subheadline)}</p>` : ""}
          <div class="grid">${blocks}</div>
        </section>
      `;
    })
    .join("");

  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(deck.title)} — PDF</title>
  <style>
    @page { size: landscape; margin: 12mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, Arial, sans-serif;
      background: ${deck.theme.colors.background};
      color: ${deck.theme.colors.foreground};
    }
    .page {
      width: 100%;
      min-height: 180mm;
      padding: 18mm;
      page-break-after: always;
      background: linear-gradient(145deg, ${deck.theme.colors.background}, #12182b);
    }
    .meta { font-size: 11px; letter-spacing: .16em; text-transform: uppercase; opacity: .55; margin-bottom: 10px; }
    h1 { font-size: 34px; margin: 0 0 8px; }
    .sub { font-size: 16px; opacity: .75; margin: 0 0 22px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
    .card {
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(255,255,255,.05);
      border-radius: 14px;
      padding: 14px;
    }
    ul { margin: 8px 0 0; padding-left: 18px; opacity: .8; }
  </style>
</head>
<body>
  ${pages}
  <script>window.onload = () => { window.print(); };</script>
</body>
</html>`);
  win.document.close();
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
