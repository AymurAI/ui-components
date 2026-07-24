import type {
  RichTextDocument,
  RichTextParagraph,
  TextMark,
  TextRun,
} from "./types";

export function createParagraph(id: string, text: string): RichTextParagraph {
  return { id, runs: [{ text, marks: [] }] };
}

export function documentFromPlainText(text: string): RichTextDocument {
  const blocks = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0);

  return {
    paragraphs: blocks.map((block, index) =>
      createParagraph(`p${index}`, block),
    ),
  };
}

const HEADING_RE = /^(#{1,3})\s+(.+)$/;
const UNORDERED_ITEM_RE = /^[-*]\s+(.+)$/;
const ORDERED_ITEM_RE = /^\d+[.)]\s+(.+)$/;
// Combined inline tokenizer for **bold**/__bold__ and *italic*/_italic_,
// ported from backend's feature/summarization-ui branch
// (frontend/src/renderer/src/utils/markdown/markdown.ts,
// markdownToSafeInlineParts) — proven regex, not reinvented. Link syntax is
// deliberately unhandled: this editor has no link mark, so a markdown link
// is left as literal text for now (out of scope, same as the original
// plan's "no links" boundary).
const INLINE_TOKEN_RE =
  /(\*\*([^*]+)\*\*)|(__([^_]+)__)|(\*([^*]+)\*)|(_([^_]+)_)/g;

function parseInlineRuns(text: string): TextRun[] {
  const runs: TextRun[] = [];
  let lastIndex = 0;
  INLINE_TOKEN_RE.lastIndex = 0;

  let match = INLINE_TOKEN_RE.exec(text);
  while (match !== null) {
    if (match.index > lastIndex) {
      runs.push({ text: text.slice(lastIndex, match.index), marks: [] });
    }
    if (match[2] !== undefined || match[4] !== undefined) {
      runs.push({
        text: (match[2] ?? match[4]) as string,
        marks: [{ type: "bold" }],
      });
    } else if (match[6] !== undefined || match[8] !== undefined) {
      runs.push({
        text: (match[6] ?? match[8]) as string,
        marks: [{ type: "italic" }],
      });
    }
    lastIndex = INLINE_TOKEN_RE.lastIndex;
    match = INLINE_TOKEN_RE.exec(text);
  }

  if (lastIndex < text.length) {
    runs.push({ text: text.slice(lastIndex), marks: [] });
  }

  return runs.length > 0 ? runs : [{ text, marks: [] }];
}

export function documentFromMarkdown(markdown: string): RichTextDocument {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const paragraphs: RichTextParagraph[] = [];
  let bufferedLines: string[] = [];
  let paragraphIndex = 0;

  const flushBufferedParagraph = () => {
    const text = bufferedLines.join(" ").trim();
    bufferedLines = [];
    if (text.length === 0) return;
    paragraphs.push({
      id: `p${paragraphIndex++}`,
      runs: mergeAdjacentRuns(parseInlineRuns(text)),
    });
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.length === 0) {
      flushBufferedParagraph();
      continue;
    }

    const heading = line.match(HEADING_RE);
    if (heading) {
      flushBufferedParagraph();
      const headingRuns = parseInlineRuns(heading[2].trim()).map((run) => ({
        text: run.text,
        marks: run.marks.some((m) => m.type === "bold")
          ? run.marks
          : [...run.marks, { type: "bold" as const }],
      }));
      paragraphs.push({
        id: `p${paragraphIndex++}`,
        runs: mergeAdjacentRuns(headingRuns),
      });
      continue;
    }

    const unorderedItem = line.match(UNORDERED_ITEM_RE);
    const orderedItem = line.match(ORDERED_ITEM_RE);
    const listItemText = unorderedItem?.[1] ?? orderedItem?.[1];
    if (listItemText !== undefined) {
      flushBufferedParagraph();
      paragraphs.push({
        id: `p${paragraphIndex++}`,
        runs: mergeAdjacentRuns(parseInlineRuns(`• ${listItemText}`)),
      });
      continue;
    }

    bufferedLines.push(line);
  }
  flushBufferedParagraph();

  return { paragraphs };
}

export function paragraphPlainText(paragraph: RichTextParagraph): string {
  return paragraph.runs.map((run) => run.text).join("");
}

export function serializeToPlainText(document: RichTextDocument): string {
  return document.paragraphs.map(paragraphPlainText).join("\n\n");
}

export function sameMark(a: TextMark, b: TextMark): boolean {
  if (a.type !== b.type) return false;
  return a.type === "highlight" ? a.color === b.color : true;
}

function marksEqual(a: TextMark[], b: TextMark[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((mark) => b.some((other) => sameMark(mark, other)));
}

function splitRunAt(run: TextRun, offset: number): [TextRun, TextRun] {
  return [
    { text: run.text.slice(0, offset), marks: run.marks },
    { text: run.text.slice(offset), marks: run.marks },
  ];
}

export function splitRunsAtOffsets(
  runs: TextRun[],
  offsets: number[],
): TextRun[] {
  const sortedOffsets = [...new Set(offsets)].sort((a, b) => a - b);
  let result = runs;

  for (const offset of sortedOffsets) {
    const next: TextRun[] = [];
    let pos = 0;
    for (const run of result) {
      const runStart = pos;
      const runEnd = pos + run.text.length;
      if (offset > runStart && offset < runEnd) {
        const [before, after] = splitRunAt(run, offset - runStart);
        next.push(before, after);
      } else {
        next.push(run);
      }
      pos = runEnd;
    }
    result = next;
  }

  return result;
}

export function mergeAdjacentRuns(runs: TextRun[]): TextRun[] {
  const merged: TextRun[] = [];
  for (const run of runs) {
    if (run.text.length === 0) continue;
    const prev = merged[merged.length - 1];
    if (prev && marksEqual(prev.marks, run.marks)) {
      prev.text += run.text;
    } else {
      merged.push({ text: run.text, marks: run.marks });
    }
  }
  return merged;
}

export function toggleMark(
  paragraph: RichTextParagraph,
  startOffset: number,
  endOffset: number,
  mark: TextMark,
): RichTextParagraph {
  if (startOffset === endOffset) return paragraph;
  const from = Math.min(startOffset, endOffset);
  const to = Math.max(startOffset, endOffset);

  const splitRuns = splitRunsAtOffsets(paragraph.runs, [from, to]);

  const inRange = (runStart: number, runEnd: number) =>
    runStart >= from && runEnd <= to && runEnd > runStart;

  let pos = 0;
  const runsInRange = splitRuns.filter((run) => {
    const runStart = pos;
    pos += run.text.length;
    return inRange(runStart, pos);
  });

  const allHaveMark =
    runsInRange.length > 0 &&
    runsInRange.every((run) => run.marks.some((m) => sameMark(m, mark)));

  pos = 0;
  const nextRuns = splitRuns.map((run) => {
    const runStart = pos;
    pos += run.text.length;
    if (!inRange(runStart, pos)) return run;

    const withoutSameType = run.marks.filter((m) => m.type !== mark.type);
    return {
      text: run.text,
      marks: allHaveMark ? withoutSameType : [...withoutSameType, mark],
    };
  });

  return { ...paragraph, runs: mergeAdjacentRuns(nextRuns) };
}

export function getActiveHighlightColor(
  paragraph: RichTextParagraph,
  startOffset: number,
  endOffset: number,
): string | undefined {
  if (startOffset === endOffset) return undefined;
  const from = Math.min(startOffset, endOffset);
  const to = Math.max(startOffset, endOffset);
  const splitRuns = splitRunsAtOffsets(paragraph.runs, [from, to]);

  let pos = 0;
  const runsInRange = splitRuns.filter((run) => {
    const runStart = pos;
    pos += run.text.length;
    return runStart >= from && pos <= to && pos > runStart;
  });

  if (runsInRange.length === 0) return undefined;

  const firstColor = runsInRange[0].marks.find(
    (m) => m.type === "highlight",
  )?.color;
  if (!firstColor) return undefined;

  const allSameColor = runsInRange.every((run) =>
    run.marks.some((m) => m.type === "highlight" && m.color === firstColor),
  );

  return allSameColor ? firstColor : undefined;
}

export interface ListMarkerInfo {
  marker: string;
  ordered: boolean;
  number?: number;
}

const BULLET_MARKER = "• ";
const ORDERED_MARKER_RE = /^(\d+)([.)]) /;

export function parseListMarker(text: string): ListMarkerInfo | null {
  if (text.startsWith(BULLET_MARKER)) {
    return { marker: BULLET_MARKER, ordered: false };
  }
  const match = text.match(ORDERED_MARKER_RE);
  if (match) {
    return {
      marker: `${match[1]}${match[2]} `,
      ordered: true,
      number: Number(match[1]),
    };
  }
  return null;
}

export type { MarkType } from "./types";
// Re-export types for convenience
export type { RichTextDocument, RichTextParagraph, TextMark, TextRun };
