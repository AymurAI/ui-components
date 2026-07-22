import { describe, expect, it } from "vitest";
import { createParagraph } from "./model";
import { reconcileParagraphText } from "./reconcile";
import type { RichTextParagraph } from "./types";

describe("reconcileParagraphText", () => {
  it("returns the same paragraph when the text is unchanged", () => {
    const p = createParagraph("p1", "hello");
    expect(reconcileParagraphText(p, "hello")).toBe(p);
  });

  it("extends the trailing run when text is appended", () => {
    const p: RichTextParagraph = {
      id: "p1",
      runs: [{ text: "hello", marks: [{ type: "bold" }] }],
    };
    const next = reconcileParagraphText(p, "hello world");
    expect(next.runs).toEqual([
      { text: "hello world", marks: [{ type: "bold" }] },
    ]);
  });

  it("shrinks a run when trailing text is deleted", () => {
    const p = createParagraph("p1", "hello world");
    const next = reconcileParagraphText(p, "hello");
    expect(next.runs).toEqual([{ text: "hello", marks: [] }]);
  });

  it("inserts unmarked text in the middle, inheriting the marks at that position", () => {
    const p: RichTextParagraph = {
      id: "p1",
      runs: [
        { text: "hello ", marks: [{ type: "italic" }] },
        { text: "world", marks: [] },
      ],
    };
    // Insert "brave new " right after "hello ".
    const next = reconcileParagraphText(p, "hello brave new world");
    expect(next.runs).toEqual([
      { text: "hello brave new ", marks: [{ type: "italic" }] },
      { text: "world", marks: [] },
    ]);
  });

  it("deletes text from the middle without disturbing marks on either side", () => {
    const p: RichTextParagraph = {
      id: "p1",
      runs: [
        { text: "hello ", marks: [{ type: "bold" }] },
        { text: "cruel ", marks: [] },
        { text: "world", marks: [{ type: "italic" }] },
      ],
    };
    const next = reconcileParagraphText(p, "hello world");
    expect(next.runs).toEqual([
      { text: "hello ", marks: [{ type: "bold" }] },
      { text: "world", marks: [{ type: "italic" }] },
    ]);
  });
});
