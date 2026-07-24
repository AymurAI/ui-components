import type { JSONContent } from "@tiptap/core";

/**
 * Splits plain text into `paragraph` nodes on blank-line boundaries,
 * matching the pre-Tiptap `documentFromPlainText`'s behavior exactly.
 */
export function documentFromPlainText(text: string): JSONContent {
  const blocks = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0);

  return {
    type: "doc",
    content: blocks.map((block) => ({
      type: "paragraph",
      content: [{ type: "text", text: block }],
    })),
  };
}

function paragraphPlainText(paragraph: JSONContent): string {
  if (!paragraph.content) return "";
  return paragraph.content.map((node) => node.text ?? "").join("");
}

/** Joins paragraph plain text with a blank line, matching the pre-Tiptap `serializeToPlainText`. */
export function serializeDocumentToPlainText(doc: JSONContent): string {
  const paragraphs = doc.content ?? [];
  return paragraphs
    .map((paragraph) => paragraphPlainText(paragraph))
    .join("\n\n");
}
