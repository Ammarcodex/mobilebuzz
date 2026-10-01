import type { Spec } from "./types";

// Tried in order against each line. Covers the common ways a spec sheet
// ends up formatted after copy-pasting from a phone-specs site, Wikipedia,
// or a manufacturer page into a plain-text box.
const LINE_PATTERNS: RegExp[] = [
  /^(.+?):\s*(.+)$/, // "Label: Value"
  /^(.+?)\s[-–—]\s(.+)$/, // "Label - Value" / – / —
  /^(.+?)\t+(.+)$/, // "Label<TAB>Value"
  /^(.+?) {2,}(.+)$/, // "Label<2+ spaces>Value"
];

const MAX_LABEL_LENGTH = 40;

/** Best-effort parse of pasted spec-sheet text into label/value rows. */
export function parseSpecText(text: string): Spec[] {
  const specs: Spec[] = [];
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim().replace(/^[-•*]\s+/, "");
    if (!line) continue;

    for (const pattern of LINE_PATTERNS) {
      const match = line.match(pattern);
      if (!match) continue;
      const label = match[1].trim();
      const value = match[2].trim();
      if (label && value && label.length <= MAX_LABEL_LENGTH) {
        specs.push({ label, value });
      }
      break;
    }
  }
  return specs;
}
