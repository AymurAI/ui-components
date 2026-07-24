import { describe, expect, it } from "vitest";
import {
  documentFromPlainText,
  serializeDocumentToPlainText,
} from "./tiptap-text";

describe("documentFromPlainText", () => {
  it("splits on blank lines into paragraph nodes", () => {
    const doc = documentFromPlainText("First paragraph.\n\nSecond paragraph.");
    expect(doc).toEqual({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "First paragraph." }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "Second paragraph." }],
        },
      ],
    });
  });

  it("trims leading/trailing blank lines and collapses 3+ newlines like 2", () => {
    const doc = documentFromPlainText("\n\n\nOnly paragraph.\n\n\n");
    expect(doc.content).toHaveLength(1);
    expect(doc.content?.[0]).toEqual({
      type: "paragraph",
      content: [{ type: "text", text: "Only paragraph." }],
    });
  });

  it("returns an empty doc for empty input", () => {
    expect(documentFromPlainText("")).toEqual({ type: "doc", content: [] });
  });
});

describe("serializeDocumentToPlainText", () => {
  it("joins paragraph text with a blank line", () => {
    const doc = {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "First." }] },
        { type: "paragraph", content: [{ type: "text", text: "Second." }] },
      ],
    };
    expect(serializeDocumentToPlainText(doc)).toBe("First.\n\nSecond.");
  });

  it("concatenates multiple text/run nodes within one paragraph with no separator", () => {
    const doc = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Bold", marks: [{ type: "bold" }] },
            { type: "text", text: " and plain." },
          ],
        },
      ],
    };
    expect(serializeDocumentToPlainText(doc)).toBe("Bold and plain.");
  });

  it("returns an empty string for an empty document", () => {
    expect(serializeDocumentToPlainText({ type: "doc", content: [] })).toBe("");
  });

  it("renders an empty paragraph (no content array) as an empty line", () => {
    const doc = {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "A." }] },
        { type: "paragraph" },
        { type: "paragraph", content: [{ type: "text", text: "B." }] },
      ],
    };
    expect(serializeDocumentToPlainText(doc)).toBe("A.\n\n\n\nB.");
  });
});
