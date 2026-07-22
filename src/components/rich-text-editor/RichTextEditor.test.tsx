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

  it("hides the toolbar entirely in readOnly mode", () => {
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
  it("applies the clicked swatch's color as a highlight mark on the selection", () => {
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
    fireEvent.click(
      screen.getByRole("button", { name: /category.yellow-light/i }),
    );

    expect(onChange).toHaveBeenCalledWith({
      paragraphs: [
        {
          id: "p1",
          runs: [
            {
              text: "hola mundo",
              marks: [{ type: "highlight", color: "category.yellow-light" }],
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
});
