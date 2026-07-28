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

/** Concatenates the `.text` of a node's *direct* children — marks are flat
 * siblings on text nodes in Tiptap's JSON model, never extra nesting, so
 * this is exactly a paragraph/heading's full text. */
function directText(node: JSONContent): string {
  if (!node.content) return "";
  return node.content.map((child) => child.text ?? "").join("");
}

/** A table cell's content is one or more paragraphs, not text nodes
 * directly — join their text with a space so a multi-paragraph cell still
 * reads as one plain-text table cell instead of breaking the row. */
function cellText(cell: JSONContent): string {
  return (cell.content ?? [])
    .map((child) =>
      child.type === "text" ? (child.text ?? "") : directText(child),
    )
    .join(" ")
    .trim();
}

function tableRowCells(row: JSONContent): string[] {
  return (row.content ?? []).map(cellText);
}

/** Renders as a lightweight markdown-style table (header row, `---`
 * separator, body rows, cells pipe-separated) — readable as tabular data in
 * a plain-text export, rather than vanishing or reading as unrelated lines. */
function tableToPlainText(table: JSONContent): string {
  const rows = table.content ?? [];
  if (rows.length === 0) return "";
  // No separator to draw for a lone row — there's no body to distinguish it from.
  if (rows.length === 1) return tableRowCells(rows[0]).join(" | ");
  const [headerRow, ...bodyRows] = rows;
  const headerCells = tableRowCells(headerRow);
  const separator = headerCells.map(() => "---").join(" | ");
  const bodyLines = bodyRows.map((row) => tableRowCells(row).join(" | "));
  return [headerCells.join(" | "), separator, ...bodyLines].join("\n");
}

/**
 * Collects one "line" (itself possibly multi-line, e.g. a table) per
 * top-level block, recursing through list/list-item wrappers so a
 * bulletList/orderedList's items each become their own line instead of
 * vanishing — `directText` alone only reads a node's immediate children,
 * and a list's children are listItems, not text nodes.
 */
function collectLines(node: JSONContent, lines: string[]): void {
  switch (node.type) {
    case "table":
      lines.push(tableToPlainText(node));
      return;
    case "bulletList":
    case "orderedList":
    case "listItem":
      for (const child of node.content ?? []) collectLines(child, lines);
      return;
    default:
      lines.push(directText(node));
  }
}

/** Joins one line per top-level block with a blank line, matching the
 * pre-Tiptap `serializeToPlainText`. */
export function serializeDocumentToPlainText(doc: JSONContent): string {
  const lines: string[] = [];
  for (const node of doc.content ?? []) collectLines(node, lines);
  return lines.join("\n\n");
}
