export type MarkType = "bold" | "italic" | "underline" | "highlight";

export interface TextMark {
  type: MarkType;
  /** Only present when type === "highlight" — a token from RICH_TEXT_HIGHLIGHT_COLORS. */
  color?: string;
}

export interface TextRun {
  text: string;
  marks: TextMark[];
}

export interface RichTextParagraph {
  id: string;
  runs: TextRun[];
}

export interface RichTextDocument {
  paragraphs: RichTextParagraph[];
}
