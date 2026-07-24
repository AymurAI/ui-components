// src/utils/rich-text/selection.ts
export function getRangeOffsets(
  root: HTMLElement,
  range: Range,
): { start: number; end: number } {
  const preStart = range.cloneRange();
  preStart.selectNodeContents(root);
  preStart.setEnd(range.startContainer, range.startOffset);
  const start = preStart.toString().length;

  const preEnd = range.cloneRange();
  preEnd.selectNodeContents(root);
  preEnd.setEnd(range.endContainer, range.endOffset);
  const end = preEnd.toString().length;

  return { start, end };
}

export function setCaretOffset(root: HTMLElement, offset: number): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let remaining = offset;
  let targetNode: Text | null = null;
  let targetOffset = 0;
  let node = walker.nextNode();

  while (node) {
    const text = node as Text;
    const length = text.textContent?.length ?? 0;
    if (remaining <= length) {
      targetNode = text;
      targetOffset = remaining;
      break;
    }
    remaining -= length;
    targetNode = text;
    targetOffset = length;
    node = walker.nextNode();
  }

  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  if (targetNode) {
    range.setStart(targetNode, targetOffset);
  } else {
    range.selectNodeContents(root);
  }
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}
