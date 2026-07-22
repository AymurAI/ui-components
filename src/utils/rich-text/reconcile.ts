import {
  mergeAdjacentRuns,
  paragraphPlainText,
  splitRunsAtOffsets,
} from "./model";
import type { RichTextParagraph, TextMark } from "./types";

export function reconcileParagraphText(
  paragraph: RichTextParagraph,
  nextText: string,
): RichTextParagraph {
  const prevText = paragraphPlainText(paragraph);
  if (prevText === nextText) return paragraph;

  let prefixLen = 0;
  const maxPrefix = Math.min(prevText.length, nextText.length);
  while (prefixLen < maxPrefix && prevText[prefixLen] === nextText[prefixLen]) {
    prefixLen++;
  }

  let suffixLen = 0;
  const maxSuffix = Math.min(prevText.length, nextText.length) - prefixLen;
  while (
    suffixLen < maxSuffix &&
    prevText[prevText.length - 1 - suffixLen] ===
      nextText[nextText.length - 1 - suffixLen]
  ) {
    suffixLen++;
  }

  const prevMiddleEnd = prevText.length - suffixLen;
  const splitRuns = splitRunsAtOffsets(paragraph.runs, [
    prefixLen,
    prevMiddleEnd,
  ]);

  const middleMarks: TextMark[] = (() => {
    if (prefixLen === 0) return [];
    let pos = 0;
    for (const run of splitRuns) {
      const runEnd = pos + run.text.length;
      if (pos < prefixLen && prefixLen <= runEnd) {
        return run.marks;
      }
      pos = runEnd;
    }
    return [];
  })();

  const before: typeof splitRuns = [];
  const after: typeof splitRuns = [];
  let pos = 0;
  for (const run of splitRuns) {
    const runStart = pos;
    const runEnd = pos + run.text.length;
    pos = runEnd;
    if (runEnd <= prefixLen) before.push(run);
    else if (runStart >= prevMiddleEnd) after.push(run);
  }

  const middleText = nextText.slice(prefixLen, nextText.length - suffixLen);
  const middleRun =
    middleText.length > 0 ? [{ text: middleText, marks: middleMarks }] : [];

  return {
    ...paragraph,
    runs: mergeAdjacentRuns([...before, ...middleRun, ...after]),
  };
}
