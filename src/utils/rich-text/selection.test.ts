// src/utils/rich-text/selection.test.ts
import { describe, expect, it } from "vitest";
import { getRangeOffsets, setCaretOffset } from "./selection";

function makeParagraph(html: string): HTMLElement {
  const el = document.createElement("p");
  el.innerHTML = html;
  document.body.appendChild(el);
  return el;
}

describe("getRangeOffsets", () => {
  it("returns 0-length offsets for a collapsed range at the start", () => {
    const el = makeParagraph("hello world");
    const range = document.createRange();
    range.setStart(el.firstChild as Text, 0);
    range.collapse(true);
    expect(getRangeOffsets(el, range)).toEqual({ start: 0, end: 0 });
  });

  it("returns the plain-text offsets of a selection within a single text node", () => {
    const el = makeParagraph("hello world");
    const range = document.createRange();
    range.setStart(el.firstChild as Text, 0);
    range.setEnd(el.firstChild as Text, 5);
    expect(getRangeOffsets(el, range)).toEqual({ start: 0, end: 5 });
  });

  it("returns offsets spanning multiple child nodes", () => {
    const el = makeParagraph("<b>hello</b> world");
    const boldText = el.querySelector("b")?.firstChild as Text;
    const plainText = el.childNodes[1] as Text; // " world"
    const range = document.createRange();
    range.setStart(boldText, 3); // inside "hello", after "hel"
    range.setEnd(plainText, 4); // inside " world", after " wor"
    expect(getRangeOffsets(el, range)).toEqual({ start: 3, end: 9 });
  });
});

describe("setCaretOffset", () => {
  it("places a collapsed caret at the given offset within a single text node", () => {
    const el = makeParagraph("hello world");
    document.body.appendChild(el);
    setCaretOffset(el, 5);

    const selection = window.getSelection();
    expect(selection?.rangeCount).toBe(1);
    const range = selection!.getRangeAt(0);
    expect(range.collapsed).toBe(true);
    expect(range.startContainer).toBe(el.firstChild);
    expect(range.startOffset).toBe(5);
  });

  it("places the caret in the correct child node when the offset spans multiple nodes", () => {
    const el = makeParagraph("<b>hello</b> world");
    document.body.appendChild(el);
    setCaretOffset(el, 7);

    const selection = window.getSelection();
    const range = selection!.getRangeAt(0);
    const plainTextNode = el.childNodes[1]; // " world"
    expect(range.startContainer).toBe(plainTextNode);
    expect(range.startOffset).toBe(2); // "hello" (5) + 2 into " world" = offset 7
  });

  it("does not throw for an empty element (no text nodes)", () => {
    const el = document.createElement("p");
    document.body.appendChild(el);
    expect(() => setCaretOffset(el, 0)).not.toThrow();
  });

  it("clamps to the end of the last text node when the offset exceeds the content length", () => {
    const el = makeParagraph("hi");
    document.body.appendChild(el);
    setCaretOffset(el, 100);

    const selection = window.getSelection();
    const range = selection!.getRangeAt(0);
    expect(range.startContainer).toBe(el.firstChild);
    expect(range.startOffset).toBe(2);
  });
});
