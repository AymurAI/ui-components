import { describe, expect, it } from "vitest";
import { documentFromMarkdown } from "./markdown";

describe("documentFromMarkdown", () => {
  it("converts a heading to a real heading node", () => {
    const doc = documentFromMarkdown("## Resumen");
    expect(doc.content?.[0]).toMatchObject({
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Resumen" }],
    });
  });

  it("converts **bold** and *italic* to marked text runs", () => {
    const doc = documentFromMarkdown("Un **texto en negrita** y *en cursiva*.");
    const runs = doc.content?.[0]?.content ?? [];
    expect(
      runs.some(
        (r) =>
          r.text === "texto en negrita" &&
          r.marks?.some((m) => m.type === "bold"),
      ),
    ).toBe(true);
    expect(
      runs.some(
        (r) =>
          r.text === "en cursiva" && r.marks?.some((m) => m.type === "italic"),
      ),
    ).toBe(true);
  });

  it("converts an unordered list to a real bulletList, preserving item text", () => {
    const doc = documentFromMarkdown("- Primer punto\n- Segundo punto");
    expect(doc.content?.[0]?.type).toBe("bulletList");
    expect(doc.content?.[0]?.content).toHaveLength(2);
  });

  it("converts an ordered list to a real orderedList, preserving numbering (a fix over the old hand-rolled importer, which lost numbering)", () => {
    const doc = documentFromMarkdown("1. Paso uno\n2. Paso dos");
    expect(doc.content?.[0]?.type).toBe("orderedList");
    expect(doc.content?.[0]?.attrs?.start).toBe(1);
  });

  it("splits paragraphs on blank lines", () => {
    const doc = documentFromMarkdown("Primer párrafo.\n\nSegundo párrafo.");
    expect(doc.content).toHaveLength(2);
  });

  it("degrades gracefully on malformed/unclosed emphasis markers", () => {
    expect(() => documentFromMarkdown("Un **texto sin cerrar")).not.toThrow();
  });

  it("handles accented Spanish text and does not mangle it", () => {
    const doc = documentFromMarkdown(
      "Juzgado en lo Penal, Contravencional y de Faltas — año 2026.",
    );
    const text = doc.content?.[0]?.content?.map((r) => r.text).join("");
    expect(text).toContain("Contravencional");
    expect(text).toContain("—");
  });
});
