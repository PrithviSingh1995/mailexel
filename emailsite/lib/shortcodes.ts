/**
 * Shortcode parser — converts WordPress-style [shortcode] tags to HTML.
 * Supported tags: section, tip, warning, note, step, checklist, quote,
 *   highlight, badge, button, cta, code, divider, table
 */

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function attr(raw: string, name: string, fallback = "") {
  const m = raw.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, "i"));
  return m ? m[1] : fallback;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Process block shortcodes first, then inline. */
export function parseShortcodes(html: string): string {
  let out = html;

  // [section title="Section Title"]...[/section]
  // Wraps content in a styled card and registers an H2 with an ID for the TOC.
  out = out.replace(/\[section([^\]]*)\]([\s\S]*?)\[\/section\]/gi, (_, attrs, body) => {
    const title = attr(attrs, "title", "Section");
    const id = slugify(title.slice(0, 80));
    return `<div class="blog-section-card"><h2 id="${id}">${esc(title)}</h2>${body.trim()}</div>`;
  });

  // [faq question="..."]...[/faq]
  // Renders as a <details open> accordion item — all open by default, click to collapse.
  out = out.replace(/\[faq([^\]]*)\]([\s\S]*?)\[\/faq\]/gi, (_, attrs, body) => {
    const question = attr(attrs, "question", "Question");
    return `<details class="sc-faq-item" open><summary>${esc(question)}</summary><div class="sc-faq-body">${body.trim()}</div></details>`;
  });

  // [tip]...[/tip]
  out = out.replace(/\[tip\]([\s\S]*?)\[\/tip\]/gi,
    (_, body) => `<div class="sc-tip">${body.trim()}</div>`);

  // [warning]...[/warning]
  out = out.replace(/\[warning\]([\s\S]*?)\[\/warning\]/gi,
    (_, body) => `<div class="sc-warning">${body.trim()}</div>`);

  // [note]...[/note]
  out = out.replace(/\[note\]([\s\S]*?)\[\/note\]/gi,
    (_, body) => `<div class="sc-note">${body.trim()}</div>`);

  // [step num="1" title="Step Title"]...[/step]
  out = out.replace(/\[step([^\]]*)\]([\s\S]*?)\[\/step\]/gi, (_, attrs, body) => {
    const num = attr(attrs, "num", "1");
    const title = attr(attrs, "title");
    return `<div class="sc-step">
  <div class="sc-step-num">${esc(num)}</div>
  <div class="sc-step-body">
    ${title ? `<div class="sc-step-title">${esc(title)}</div>` : ""}
    <div class="sc-step-content">${body.trim()}</div>
  </div>
</div>`;
  });

  // [checklist]item\nitem\n[/checklist]
  out = out.replace(/\[checklist\]([\s\S]*?)\[\/checklist\]/gi, (_, body) => {
    const items = body.split("\n").map((l: string) => l.trim()).filter(Boolean);
    const lis = items.map((item: string) => `<li>${item}</li>`).join("\n");
    return `<ul class="sc-checklist">${lis}</ul>`;
  });

  // [quote author="Name"]...[/quote]
  out = out.replace(/\[quote([^\]]*)\]([\s\S]*?)\[\/quote\]/gi, (_, attrs, body) => {
    const author = attr(attrs, "author");
    return `<blockquote class="sc-quote">${body.trim()}${author ? `<cite class="sc-quote-author">— ${esc(author)}</cite>` : ""}</blockquote>`;
  });

  // [cta title="" button="" url=""]...[/cta]
  out = out.replace(/\[cta([^\]]*)\]([\s\S]*?)\[\/cta\]/gi, (_, attrs, body) => {
    const title = attr(attrs, "title");
    const button = attr(attrs, "button", "Get Started");
    const url = attr(attrs, "url", "#");
    return `<div class="sc-cta">
  ${title ? `<div class="sc-cta-title">${esc(title)}</div>` : ""}
  ${body.trim() ? `<div class="sc-cta-body">${body.trim()}</div>` : ""}
  <a href="${esc(url)}" class="sc-cta-btn">${esc(button)}</a>
</div>`;
  });

  // [code lang="js"]...[/code]
  out = out.replace(/\[code([^\]]*)\]([\s\S]*?)\[\/code\]/gi, (_, attrs, body) => {
    const lang = attr(attrs, "lang", "code");
    return `<div class="sc-code-block">
  <div class="sc-code-lang">${esc(lang)}</div>
  <pre>${body.trim()}</pre>
</div>`;
  });

  // [table]H1|H2\nR1C1|R1C2\n[/table]
  out = out.replace(/\[table\]([\s\S]*?)\[\/table\]/gi, (_, body) => {
    const rows = body.trim().split("\n").map((l: string) => l.trim()).filter(Boolean);
    if (!rows.length) return "";
    const [header, ...dataRows] = rows;
    const thCells = header.split("|").map((c: string) => `<th>${c.trim()}</th>`).join("");
    const trRows = dataRows.map((r: string) => {
      const tds = r.split("|").map((c: string) => `<td>${c.trim()}</td>`).join("");
      return `<tr>${tds}</tr>`;
    }).join("\n");
    return `<div class="sc-table-wrap"><table><thead><tr>${thCells}</tr></thead><tbody>${trRows}</tbody></table></div>`;
  });

  // Inline shortcodes (order matters — do after block)

  // [button text="" url=""]
  out = out.replace(/\[button([^\]]*)\]/gi, (_, attrs) => {
    const text = attr(attrs, "text", "Click here");
    const url = attr(attrs, "url", "#");
    return `<a href="${esc(url)}" class="sc-button">${esc(text)}</a>`;
  });

  // [highlight]...[/highlight]
  out = out.replace(/\[highlight\]([\s\S]*?)\[\/highlight\]/gi,
    (_, body) => `<mark class="sc-highlight">${body}</mark>`);

  // [badge]...[/badge]
  out = out.replace(/\[badge\]([\s\S]*?)\[\/badge\]/gi,
    (_, body) => `<span class="sc-badge">${body.trim()}</span>`);

  // [divider]
  out = out.replace(/\[divider\]/gi, `<hr class="sc-divider" />`);

  return out;
}

// ── Templates for the admin dropdown ────────────────────────────────────────────

export interface ShortcodeTemplate {
  label: string;
  category: string;
  description: string;
  template: string;
}

export const SHORTCODES: ShortcodeTemplate[] = [
  // Sections
  {
    label: "Section",
    category: "Sections",
    description: "Named section card — appears in TOC",
    template: '[section title="Section Title"]\n<p>Your section content goes here.</p>\n[/section]',
  },
  {
    label: "FAQ Item",
    category: "Sections",
    description: "Accordion FAQ — open by default",
    template: '[faq question="Your question here?"]\nYour answer goes here. Be clear and concise.\n[/faq]',
  },
  // Info Boxes
  {
    label: "Tip",
    category: "Info Boxes",
    description: "Green tip box",
    template: '[tip]Your helpful tip goes here.[/tip]',
  },
  {
    label: "Warning",
    category: "Info Boxes",
    description: "Amber warning box",
    template: '[warning]Important warning message here.[/warning]',
  },
  {
    label: "Note",
    category: "Info Boxes",
    description: "Blue note box",
    template: '[note]Additional note or information here.[/note]',
  },
  // Steps
  {
    label: "Step",
    category: "Steps & Lists",
    description: "Numbered step block",
    template: '[step num="1" title="Step Title"]Describe what to do in this step.[/step]',
  },
  {
    label: "Checklist",
    category: "Steps & Lists",
    description: "Checkmark list",
    template: '[checklist]\nFirst item\nSecond item\nThird item\n[/checklist]',
  },
  // Tables & Data
  {
    label: "Table",
    category: "Tables & Data",
    description: "Formatted table (pipe-separated)",
    template: '[table]\nColumn 1|Column 2|Column 3\nRow 1 A|Row 1 B|Row 1 C\nRow 2 A|Row 2 B|Row 2 C\n[/table]',
  },
  {
    label: "Code Block",
    category: "Tables & Data",
    description: "Syntax-highlighted code block",
    template: '[code lang="javascript"]\nconsole.log("Hello, world!");\n[/code]',
  },
  // Visual
  {
    label: "Quote",
    category: "Visual",
    description: "Styled blockquote",
    template: '[quote author="Author Name"]Your quote text goes here.[/quote]',
  },
  {
    label: "CTA Banner",
    category: "Visual",
    description: "Black call-to-action banner",
    template: '[cta title="Ready to Get Started?" button="Free Download" url="/#download"]Try MailExel free — no registration required.[/cta]',
  },
  {
    label: "Button",
    category: "Visual",
    description: "Inline red button",
    template: '[button text="Download Now" url="/#download"]',
  },
  {
    label: "Highlight",
    category: "Visual",
    description: "Yellow highlight",
    template: '[highlight]important text[/highlight]',
  },
  {
    label: "Badge",
    category: "Visual",
    description: "Red pill badge",
    template: '[badge]New[/badge]',
  },
  {
    label: "Divider",
    category: "Visual",
    description: "Horizontal rule",
    template: '[divider]',
  },
];
