// src/utils/rich-text/selection.test.ts
import { describe, expect, it } from "vitest";
import { getRangeOffsets } from "./selection";

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
