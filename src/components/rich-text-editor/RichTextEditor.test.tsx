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
