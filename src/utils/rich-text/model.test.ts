import { describe, expect, it } from "vitest";
import {
  createParagraph,
  documentFromMarkdown,
  documentFromPlainText,
  mergeAdjacentRuns,
  paragraphPlainText,
  sameMark,
  serializeToPlainText,
  splitRunsAtOffsets,
  toggleMark,
} from "./model";
import type { RichTextParagraph, TextRun } from "./types";

describe("createParagraph", () => {
  it("wraps plain text in a single unmarked run", () => {
    expect(createParagraph("p1", "hello")).toEqual({
      id: "p1",
      runs: [{ text: "hello", marks: [] }],
    });
  });
});

describe("documentFromPlainText", () => {
  it("splits on blank lines into one paragraph per block, no marks", () => {
    const doc = documentFromPlainText("Primero.\n\nSegundo.\n\nTercero.");
    expect(doc.paragraphs).toHaveLength(3);
    expect(doc.paragraphs.map((p) => paragraphPlainText(p))).toEqual([
      "Primero.",
      "Segundo.",
      "Tercero.",
    ]);
    expect(doc.paragraphs[0].runs[0].marks).toEqual([]);
  });

  it("ignores leading/trailing blank lines", () => {
    const doc = documentFromPlainText("\n\nSolo esto.\n\n");
    expect(doc.paragraphs).toHaveLength(1);
  });
});

describe("paragraphPlainText / serializeToPlainText", () => {
  it("concatenates run text within a paragraph", () => {
    const p: RichTextParagraph = {
      id: "p1",
      runs: [
        { text: "hola ", marks: [] },
        { text: "mundo", marks: [{ type: "bold" }] },
      ],
    };
    expect(paragraphPlainText(p)).toBe("hola mundo");
  });

  it("joins paragraphs with a blank line", () => {
    const doc = documentFromPlainText("Uno.\n\nDos.");
    expect(serializeToPlainText(doc)).toBe("Uno.\n\nDos.");
  });
});

describe("sameMark", () => {
  it("matches non-highlight marks by type alone", () => {
    expect(sameMark({ type: "bold" }, { type: "bold" })).toBe(true);
  });

  it("requires matching color for highlight marks", () => {
    expect(
      sameMark(
        { type: "highlight", color: "category.yellow-light" },
        { type: "highlight", color: "category.yellow-light" },
      ),
    ).toBe(true);
    expect(
      sameMark(
        { type: "highlight", color: "category.yellow-light" },
        { type: "highlight", color: "category.green-light" },
      ),
    ).toBe(false);
  });
});

describe("splitRunsAtOffsets", () => {
  it("splits a single run at the given character offsets", () => {
    const runs: TextRun[] = [{ text: "hello world", marks: [] }];
    const split = splitRunsAtOffsets(runs, [5]);
    expect(split.map((r) => r.text)).toEqual(["hello", " world"]);
  });

  it("is a no-op for offsets that already land on a run boundary", () => {
    const runs: TextRun[] = [
      { text: "hello", marks: [] },
      { text: " world", marks: [] },
    ];
    expect(splitRunsAtOffsets(runs, [5]).map((r) => r.text)).toEqual([
      "hello",
      " world",
    ]);
  });
});

describe("mergeAdjacentRuns", () => {
  it("merges consecutive runs with identical marks", () => {
    const runs: TextRun[] = [
      { text: "he", marks: [{ type: "bold" }] },
      { text: "llo", marks: [{ type: "bold" }] },
      { text: " world", marks: [] },
    ];
    expect(mergeAdjacentRuns(runs)).toEqual([
      { text: "hello", marks: [{ type: "bold" }] },
      { text: " world", marks: [] },
    ]);
  });

  it("drops empty runs", () => {
    const runs: TextRun[] = [
      { text: "", marks: [] },
      { text: "hi", marks: [] },
    ];
    expect(mergeAdjacentRuns(runs)).toEqual([{ text: "hi", marks: [] }]);
  });
});

describe("toggleMark", () => {
  it("adds a mark to the runs fully inside the given range", () => {
    const p = createParagraph("p1", "hello world");
    const next = toggleMark(p, 0, 5, { type: "bold" });
    expect(next.runs).toEqual([
      { text: "hello", marks: [{ type: "bold" }] },
      { text: " world", marks: [] },
    ]);
  });

  it("removes the mark when the whole range already has it (toggle off)", () => {
    const p = createParagraph("p1", "hello world");
    const bolded = toggleMark(p, 0, 5, { type: "bold" });
    const toggledOff = toggleMark(bolded, 0, 5, { type: "bold" });
    expect(toggledOff.runs).toEqual([{ text: "hello world", marks: [] }]);
  });

  it("only adds the mark when the range is partially marked (not a toggle-off)", () => {
    const p: RichTextParagraph = {
      id: "p1",
      runs: [
        { text: "hel", marks: [{ type: "bold" }] },
        { text: "lo world", marks: [] },
      ],
    };
    const next = toggleMark(p, 0, 5, { type: "bold" });
    expect(next.runs).toEqual([
      { text: "hello", marks: [{ type: "bold" }] },
      { text: " world", marks: [] },
    ]);
  });

  it("replaces a highlight of a different color rather than stacking marks", () => {
    const p = createParagraph("p1", "hello");
    const yellow = toggleMark(p, 0, 5, {
      type: "highlight",
      color: "category.yellow-light",
    });
    const green = toggleMark(yellow, 0, 5, {
      type: "highlight",
      color: "category.green-light",
    });
    expect(green.runs).toEqual([
      {
        text: "hello",
        marks: [{ type: "highlight", color: "category.green-light" }],
      },
    ]);
  });

  it("is a no-op for a collapsed (zero-length) range", () => {
    const p = createParagraph("p1", "hello");
    expect(toggleMark(p, 2, 2, { type: "bold" })).toBe(p);
  });
});

describe("documentFromMarkdown", () => {
  it("splits paragraphs on blank lines, same as plain text", () => {
    const doc = documentFromMarkdown("Primero.\n\nSegundo.");
    expect(doc.paragraphs).toHaveLength(2);
    expect(paragraphPlainText(doc.paragraphs[0])).toBe("Primero.");
    expect(paragraphPlainText(doc.paragraphs[1])).toBe("Segundo.");
  });

  it("maps **bold** and *italic* inline syntax to marks", () => {
    const doc = documentFromMarkdown("hola **mundo** y *chau*");
    expect(doc.paragraphs[0].runs).toEqual([
      { text: "hola ", marks: [] },
      { text: "mundo", marks: [{ type: "bold" }] },
      { text: " y ", marks: [] },
      { text: "chau", marks: [{ type: "italic" }] },
    ]);
  });

  it("also accepts __bold__ and _italic_ underscore syntax", () => {
    const doc = documentFromMarkdown("__fuerte__ y _suave_");
    expect(doc.paragraphs[0].runs).toEqual([
      { text: "fuerte", marks: [{ type: "bold" }] },
      { text: " y ", marks: [] },
      { text: "suave", marks: [{ type: "italic" }] },
    ]);
  });

  it("flattens headers to a single bold paragraph, stripping the # markers", () => {
    const doc = documentFromMarkdown(
      "## Resumen del documento\n\nCuerpo del texto.",
    );
    expect(doc.paragraphs).toHaveLength(2);
    expect(doc.paragraphs[0].runs).toEqual([
      { text: "Resumen del documento", marks: [{ type: "bold" }] },
    ]);
    expect(paragraphPlainText(doc.paragraphs[1])).toBe("Cuerpo del texto.");
  });

  it("flattens bullet list items to plain paragraphs with a leading marker", () => {
    const doc = documentFromMarkdown("- Primero\n- Segundo");
    expect(doc.paragraphs.map((p) => paragraphPlainText(p))).toEqual([
      "• Primero",
      "• Segundo",
    ]);
  });

  it("flattens numbered list items the same way", () => {
    const doc = documentFromMarkdown("1. Uno\n2. Dos");
    expect(doc.paragraphs.map((p) => paragraphPlainText(p))).toEqual([
      "• Uno",
      "• Dos",
    ]);
  });

  it("ignores leading/trailing blank lines, same as documentFromPlainText", () => {
    const doc = documentFromMarkdown("\n\nSolo esto.\n\n");
    expect(doc.paragraphs).toHaveLength(1);
  });

  it("does not double whitespace when joining a wrapped multi-line paragraph", () => {
    const doc = documentFromMarkdown("Hello\n  World");
    expect(paragraphPlainText(doc.paragraphs[0])).toBe("Hello World");
  });

  it("parses inline emphasis inside headings, combining it with the heading's bold mark", () => {
    const boldHeading = documentFromMarkdown("## **Importante** nota");
    expect(boldHeading.paragraphs[0].runs).toEqual([
      { text: "Importante nota", marks: [{ type: "bold" }] },
    ]);

    const italicHeading = documentFromMarkdown("## Nota *importante*");
    expect(italicHeading.paragraphs[0].runs).toEqual([
      { text: "Nota ", marks: [{ type: "bold" }] },
      {
        text: "importante",
        marks: [{ type: "italic" }, { type: "bold" }],
      },
    ]);
  });
});
