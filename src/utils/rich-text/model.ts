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

export type { MarkType } from "./types";
// Re-export types for convenience
export type { RichTextDocument, RichTextParagraph, TextMark, TextRun };
