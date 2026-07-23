import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { RichTextDocument } from "@/utils/rich-text/types";
import { RichTextEditor } from "./RichTextEditor";

const doc: RichTextDocument = {
  paragraphs: [
    {
      id: "p1",
      runs: [
        { text: "hola ", marks: [] },
        { text: "mundo", marks: [{ type: "bold" }] },
      ],
    },
    {
      id: "p2",
      runs: [{ text: "segundo párrafo", marks: [{ type: "italic" }] }],
    },
  ],
};

describe("RichTextEditor", () => {
  it("renders each paragraph and applies bold/italic styling per run", () => {
    render(<RichTextEditor document={doc} />);
    expect(screen.getByText("mundo").tagName).toBe("STRONG");
    expect(screen.getByText("segundo párrafo").tagName).toBe("EM");
  });

  it("renders underline and highlight runs with <u> and <mark>", () => {
    const marksDoc: RichTextDocument = {
      paragraphs: [
        {
          id: "p1",
          runs: [
            { text: "subrayado", marks: [{ type: "underline" }] },
            {
              text: "resaltado",
              marks: [{ type: "highlight", color: "category.yellow-light" }],
            },
          ],
        },
      ],
    };
    render(<RichTextEditor document={marksDoc} />);
    expect(screen.getByText("subrayado").tagName).toBe("U");
    expect(screen.getByText("resaltado").tagName).toBe("MARK");
  });

  it("renders the title and calls onTitleChange when edited", () => {
    const onTitleChange = vi.fn();
    render(
      <RichTextEditor
        document={doc}
        title="Resumen 10/04/2025"
        onTitleChange={onTitleChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /editar título/i }));
    const input = screen.getByDisplayValue("Resumen 10/04/2025");
    fireEvent.change(input, { target: { value: "Nuevo título" } });
    fireEvent.blur(input);
    expect(onTitleChange).toHaveBeenCalledWith("Nuevo título");
  });

  it("makes the body non-editable and hides the title's edit button in readOnly mode", () => {
    render(<RichTextEditor document={doc} title="X" readOnly />);
    expect(
      screen.queryByRole("button", { name: /editar título/i }),
    ).not.toBeInTheDocument();
    const body = screen.getByRole("textbox");
    expect(body).toHaveAttribute("contenteditable", "false");
  });
});

describe("RichTextEditor — toolbar", () => {
  function selectAll(paragraphEl: Element) {
    const range = document.createRange();
    range.selectNodeContents(paragraphEl);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  it("toggles bold on the current selection and calls onChange", () => {
    const onChange = vi.fn();
    const singleRunDoc: RichTextDocument = {
      paragraphs: [{ id: "p1", runs: [{ text: "hola mundo", marks: [] }] }],
    };
    render(<RichTextEditor document={singleRunDoc} onChange={onChange} />);

    const paragraphEl = screen.getByText("hola mundo").closest("p")!;
    selectAll(paragraphEl);
    fireEvent.select(paragraphEl);

    fireEvent.click(screen.getByRole("button", { name: /negrita/i }));

    expect(onChange).toHaveBeenCalledWith({
      paragraphs: [
        { id: "p1", runs: [{ text: "hola mundo", marks: [{ type: "bold" }] }] },
      ],
    });
  });

  it("hides the formatting toolbar in readOnly mode (Copy remains)", () => {
    render(
      <RichTextEditor
        document={{
          paragraphs: [{ id: "p1", runs: [{ text: "x", marks: [] }] }],
        }}
        readOnly
      />,
    );
    expect(
      screen.queryByRole("button", { name: /negrita/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /cursiva/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /subrayado/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /resaltar/i }),
    ).not.toBeInTheDocument();
    // Copy is an export action, not an editing affordance — it stays visible.
    expect(screen.getByRole("button", { name: /copiar/i })).toBeInTheDocument();
  });

  it("renders formatting buttons in Figma order (Underline, Italic, Bold, Highlight) with a divider before Copy", () => {
    render(
      <RichTextEditor
        document={{
          paragraphs: [{ id: "p1", runs: [{ text: "x", marks: [] }] }],
        }}
      />,
    );
    const buttons = screen.getAllByRole("button", {
      name: /subrayado|cursiva|negrita|resaltar|copiar/i,
    });
    expect(buttons.map((b) => b.getAttribute("aria-label"))).toEqual([
      "Subrayado",
      "Cursiva",
      "Negrita",
      "Resaltar",
      "Copiar",
    ]);
    expect(
      screen.getByTestId("rich-text-editor-toolbar-divider"),
    ).toBeInTheDocument();
  });

  it("reconciles typed text back into the model on input", () => {
    const onChange = vi.fn();
    const singleRunDoc: RichTextDocument = {
      paragraphs: [{ id: "p1", runs: [{ text: "hola", marks: [] }] }],
    };
    render(<RichTextEditor document={singleRunDoc} onChange={onChange} />);

    const paragraphEl = screen.getByText("hola").closest("p")!;
    paragraphEl.textContent = "hola mundo";
    fireEvent.input(paragraphEl);

    expect(onChange).toHaveBeenCalledWith({
      paragraphs: [{ id: "p1", runs: [{ text: "hola mundo", marks: [] }] }],
    });
  });
});

describe("RichTextEditor — highlight + copy", () => {
  it("renders exactly the 12 Figma-specified highlight swatches with human Spanish labels", () => {
    render(<RichTextEditor document={{ paragraphs: [] }} />);
    fireEvent.click(screen.getByRole("button", { name: /resaltar/i }));

    const expectedLabels = [
      "Azul claro",
      "Azul",
      "Verde claro",
      "Verde",
      "Naranja claro",
      "Naranja",
      "Rosa claro",
      "Rosa",
      "Rojo claro",
      "Rojo",
      "Amarillo claro",
      "Amarillo",
    ];
    for (const label of expectedLabels) {
      expect(
        screen.getByRole("button", { name: new RegExp(`^${label}$`, "i") }),
      ).toBeInTheDocument();
    }
    expect(
      screen.queryByRole("button", { name: /violeta/i }),
    ).not.toBeInTheDocument();
  });

  it("applies the correct highlight color for a solid-shade swatch click", () => {
    const onChange = vi.fn();
    const singleRunDoc: RichTextDocument = {
      paragraphs: [{ id: "p1", runs: [{ text: "hola mundo", marks: [] }] }],
    };
    render(<RichTextEditor document={singleRunDoc} onChange={onChange} />);

    const paragraphEl = screen.getByText("hola mundo").closest("p")!;
    const range = document.createRange();
    range.selectNodeContents(paragraphEl);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    fireEvent.select(paragraphEl);

    fireEvent.click(screen.getByRole("button", { name: /resaltar/i }));
    fireEvent.click(screen.getByRole("button", { name: /^azul$/i }));

    expect(onChange).toHaveBeenCalledWith({
      paragraphs: [
        {
          id: "p1",
          runs: [
            {
              text: "hola mundo",
              marks: [{ type: "highlight", color: "category.blue" }],
            },
          ],
        },
      ],
    });
  });

  it("copies the serialized plain text to the clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(
      <RichTextEditor
        document={{
          paragraphs: [{ id: "p1", runs: [{ text: "hola mundo", marks: [] }] }],
        }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /copiar/i }));
    expect(writeText).toHaveBeenCalledWith("hola mundo");
  });

  it("copies to the clipboard in readOnly mode", () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(
      <RichTextEditor
        readOnly
        document={{
          paragraphs: [
            { id: "p1", runs: [{ text: "solo lectura", marks: [] }] },
          ],
        }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /copiar/i }));
    expect(writeText).toHaveBeenCalledWith("solo lectura");
  });
});

describe("RichTextEditor — structural editing", () => {
  function placeCaret(paragraphEl: Element, offset: number) {
    const walker = document.createTreeWalker(paragraphEl, NodeFilter.SHOW_TEXT);
    const textNode = walker.nextNode() as Text;
    const range = document.createRange();
    range.setStart(textNode, offset);
    range.collapse(true);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  it("splits the current paragraph into two on Enter at the caret", () => {
    const onChange = vi.fn();
    const singleRunDoc: RichTextDocument = {
      paragraphs: [{ id: "p1", runs: [{ text: "hola mundo", marks: [] }] }],
    };
    render(<RichTextEditor document={singleRunDoc} onChange={onChange} />);

    const paragraphEl = screen.getByText("hola mundo").closest("p")!;
    placeCaret(paragraphEl, 4); // between "hola" and " mundo"

    fireEvent.keyDown(paragraphEl, { key: "Enter" });

    expect(onChange).toHaveBeenCalledTimes(1);
    const next = onChange.mock.calls[0][0] as RichTextDocument;
    expect(next.paragraphs).toHaveLength(2);
    expect(next.paragraphs[0].id).toBe("p1");
    expect(next.paragraphs[0].runs).toEqual([{ text: "hola", marks: [] }]);
    expect(next.paragraphs[1].runs).toEqual([{ text: " mundo", marks: [] }]);
    expect(next.paragraphs[1].id).not.toBe("p1");
  });

  it("preserves marks on both halves when splitting", () => {
    const onChange = vi.fn();
    const boldDoc: RichTextDocument = {
      paragraphs: [
        { id: "p1", runs: [{ text: "hola mundo", marks: [{ type: "bold" }] }] },
      ],
    };
    render(<RichTextEditor document={boldDoc} onChange={onChange} />);

    const paragraphEl = screen.getByText("hola mundo").closest("p")!;
    placeCaret(paragraphEl, 4);
    fireEvent.keyDown(paragraphEl, { key: "Enter" });

    const next = onChange.mock.calls[0][0] as RichTextDocument;
    expect(next.paragraphs[0].runs).toEqual([
      { text: "hola", marks: [{ type: "bold" }] },
    ]);
    expect(next.paragraphs[1].runs).toEqual([
      { text: " mundo", marks: [{ type: "bold" }] },
    ]);
  });

  it("does not split on Shift+Enter", () => {
    const onChange = vi.fn();
    const singleRunDoc: RichTextDocument = {
      paragraphs: [{ id: "p1", runs: [{ text: "hola mundo", marks: [] }] }],
    };
    render(<RichTextEditor document={singleRunDoc} onChange={onChange} />);

    const paragraphEl = screen.getByText("hola mundo").closest("p")!;
    placeCaret(paragraphEl, 4);
    fireEvent.keyDown(paragraphEl, { key: "Enter", shiftKey: true });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("merges into the previous paragraph on Backspace at offset 0", () => {
    const onChange = vi.fn();
    const twoParaDoc: RichTextDocument = {
      paragraphs: [
        { id: "p1", runs: [{ text: "hola", marks: [{ type: "bold" }] }] },
        { id: "p2", runs: [{ text: "mundo", marks: [] }] },
      ],
    };
    render(<RichTextEditor document={twoParaDoc} onChange={onChange} />);

    const secondEl = screen.getByText("mundo").closest("p")!;
    placeCaret(secondEl, 0);
    fireEvent.keyDown(secondEl, { key: "Backspace" });

    expect(onChange).toHaveBeenCalledTimes(1);
    const next = onChange.mock.calls[0][0] as RichTextDocument;
    expect(next.paragraphs).toHaveLength(1);
    expect(next.paragraphs[0].id).toBe("p1");
    expect(next.paragraphs[0].runs).toEqual([
      { text: "hola", marks: [{ type: "bold" }] },
      { text: "mundo", marks: [] },
    ]);
  });

  it("does not merge on Backspace at the start of the first paragraph", () => {
    const onChange = vi.fn();
    const twoParaDoc: RichTextDocument = {
      paragraphs: [
        { id: "p1", runs: [{ text: "hola", marks: [] }] },
        { id: "p2", runs: [{ text: "mundo", marks: [] }] },
      ],
    };
    render(<RichTextEditor document={twoParaDoc} onChange={onChange} />);

    const firstEl = screen.getByText("hola").closest("p")!;
    placeCaret(firstEl, 0);
    fireEvent.keyDown(firstEl, { key: "Backspace" });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not merge on Backspace mid-paragraph", () => {
    const onChange = vi.fn();
    const twoParaDoc: RichTextDocument = {
      paragraphs: [
        { id: "p1", runs: [{ text: "hola", marks: [] }] },
        { id: "p2", runs: [{ text: "mundo", marks: [] }] },
      ],
    };
    render(<RichTextEditor document={twoParaDoc} onChange={onChange} />);

    const secondEl = screen.getByText("mundo").closest("p")!;
    placeCaret(secondEl, 2);
    fireEvent.keyDown(secondEl, { key: "Backspace" });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("seeds a first paragraph when typing into an empty document", () => {
    const onChange = vi.fn();
    render(
      <RichTextEditor document={{ paragraphs: [] }} onChange={onChange} />,
    );

    const body = screen.getByRole("textbox");
    body.textContent = "primer texto";
    fireEvent.input(body);

    expect(onChange).toHaveBeenCalledTimes(1);
    const next = onChange.mock.calls[0][0] as RichTextDocument;
    expect(next.paragraphs).toHaveLength(1);
    expect(next.paragraphs[0].runs).toEqual([
      { text: "primer texto", marks: [] },
    ]);
  });

  it("clamps a cross-paragraph selection to the end of the first paragraph", () => {
    const onChange = vi.fn();
    const twoParaDoc: RichTextDocument = {
      paragraphs: [
        { id: "p1", runs: [{ text: "hola", marks: [] }] },
        { id: "p2", runs: [{ text: "mundo", marks: [] }] },
      ],
    };
    render(<RichTextEditor document={twoParaDoc} onChange={onChange} />);

    const firstEl = screen.getByText("hola").closest("p")!;
    const secondEl = screen.getByText("mundo").closest("p")!;
    const range = document.createRange();
    range.setStart(firstEl.firstChild as Text, 0);
    range.setEnd(secondEl.firstChild as Text, 5);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    fireEvent.select(firstEl);

    fireEvent.click(screen.getByRole("button", { name: /negrita/i }));

    // Only the first paragraph is affected, and the mark covers exactly its
    // full text ("hola") — no out-of-bounds corruption, second paragraph
    // untouched.
    const next = onChange.mock.calls[0][0] as RichTextDocument;
    expect(next.paragraphs[0].runs).toEqual([
      { text: "hola", marks: [{ type: "bold" }] },
    ]);
    expect(next.paragraphs[1].runs).toEqual([{ text: "mundo", marks: [] }]);
  });
});
