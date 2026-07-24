import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { JSONContent } from "@tiptap/core";
import { describe, expect, it, vi } from "vitest";
import { RichTextEditor } from "./RichTextEditor";

const doc: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        { type: "text", text: "hola " },
        { type: "text", text: "mundo", marks: [{ type: "bold" }] },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "segundo párrafo",
          marks: [{ type: "italic" }],
        },
      ],
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
    const marksDoc: JSONContent = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "subrayado",
              marks: [{ type: "underline" }],
            },
            {
              type: "text",
              text: "resaltado",
              marks: [
                {
                  type: "highlight",
                  attrs: { color: "category.yellow-light" },
                },
              ],
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

  it("wraps the body in a bordered, rounded, shadowed card inside a gray panel", () => {
    render(<RichTextEditor document={{ type: "doc", content: [] }} />);
    const panel = screen.getByTestId("rich-text-editor-panel");
    const card = screen.getByTestId("rich-text-editor-card");
    expect(panel).toContainElement(card);
    expect(card).toContainElement(screen.getByRole("textbox"));
  });

  it("defaults the body card's max height to 532px", () => {
    render(<RichTextEditor document={{ type: "doc", content: [] }} />);
    const card = screen.getByTestId("rich-text-editor-card");
    expect(card.style.maxHeight).toBe("532px");
  });

  it("lets a consumer override the body card's max height via maxBodyHeight", () => {
    render(
      <RichTextEditor
        document={{ type: "doc", content: [] }}
        maxBodyHeight="800px"
      />,
    );
    const card = screen.getByTestId("rich-text-editor-card");
    expect(card.style.maxHeight).toBe("800px");
  });

  it("renders a <br> fallback for a paragraph with no runs, instead of an empty <p>", () => {
    const emptyParagraphDoc: JSONContent = {
      type: "doc",
      content: [{ type: "paragraph" }],
    };
    const { container } = render(
      <RichTextEditor document={emptyParagraphDoc} />,
    );
    // ProseMirror (Tiptap's rendering engine) has no paragraph-id concept —
    // it injects its own trailing <br> into an otherwise-empty text block so
    // the caret can still be hosted there, on whichever <p> is empty.
    const paragraphEl = container.querySelector("p");
    expect(paragraphEl?.querySelector("br")).toBeTruthy();
  });

  it("does not call onChange when the document prop changes externally (not from user typing)", async () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <RichTextEditor document={doc} onChange={onChange} />,
    );
    expect(screen.getByText("mundo")).toBeInTheDocument();

    const nextDoc: JSONContent = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "otro resumen cargado externo" }],
        },
      ],
    };
    rerender(<RichTextEditor document={nextDoc} onChange={onChange} />);

    // The external content sync is applied via a `useEffect`, so wait for it
    // to flush before asserting.
    await waitFor(() =>
      expect(
        screen.getByText("otro resumen cargado externo"),
      ).toBeInTheDocument(),
    );
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("RichTextEditor — toolbar", () => {
  it("hides the formatting toolbar in readOnly mode (Copy remains)", () => {
    render(
      <RichTextEditor
        document={{
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "x" }],
            },
          ],
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

  it("renders formatting buttons in Bold/Italic/Underline/Highlight order, with a divider before Copy, right-aligned above the title", () => {
    render(
      <RichTextEditor
        document={{
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "x" }],
            },
          ],
        }}
        title="Resumen"
      />,
    );
    const buttons = screen.getAllByRole("button", {
      name: /subrayado|cursiva|negrita|resaltar|copiar/i,
    });
    expect(buttons.map((b) => b.getAttribute("aria-label"))).toEqual([
      "Negrita",
      "Cursiva",
      "Subrayado",
      "Resaltar",
      "Copiar",
    ]);
    expect(
      screen.getByTestId("rich-text-editor-toolbar-divider"),
    ).toBeInTheDocument();

    const panel = screen.getByTestId("rich-text-editor-panel");
    const toolbar = screen.getByTestId("rich-text-editor-toolbar");
    const titleRow = screen
      .getByText("Resumen")
      .closest('[data-testid="rich-text-editor-title-row"]')!;
    const allChildren = Array.from(panel.querySelectorAll("[data-testid]"));
    const toolbarIndex = allChildren.indexOf(toolbar);
    const titleIndex = allChildren.indexOf(titleRow as Element);
    expect(toolbarIndex).toBeLessThan(titleIndex);
  });

  it("toggles bold on the current selection and calls onChange", async () => {
    const onChange = vi.fn();
    const singleRunDoc: JSONContent = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "hola mundo" }],
        },
      ],
    };
    render(<RichTextEditor document={singleRunDoc} onChange={onChange} />);

    const paragraphEl = screen.getByText("hola mundo").closest("p")!;
    const range = document.createRange();
    range.selectNodeContents(paragraphEl);
    // The Tiptap/ProseMirror view only reacts to a "selectionchange" event
    // when its contentEditable root is the focused element (see
    // prosemirror-view's `hasFocusAndSelection`) — a plain DOM Range/
    // Selection without focus is invisible to it. jsdom also dispatches
    // "selectionchange" as a queued (async) task, so a microtask tick is
    // needed before the editor's internal selection reflects it.
    (screen.getByRole("textbox") as HTMLElement).focus();
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    fireEvent.select(paragraphEl);
    await waitFor(() => {
      expect(window.getSelection()?.isCollapsed).toBe(false);
    });

    fireEvent.click(screen.getByRole("button", { name: /negrita/i }));

    expect(onChange).toHaveBeenCalledWith({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "hola mundo", marks: [{ type: "bold" }] },
          ],
        },
      ],
    });
  });

  it("toggles bold via the toolbar and reflects active state", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const doc = {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Hello" }] },
      ],
    };
    render(<RichTextEditor document={doc} onChange={handleChange} />);

    const editorEl = screen.getByTestId("rich-text-editor-card");
    // Select "Hello" via a native selection so the toolbar acts on it. The
    // contentEditable must be focused first — ProseMirror's view only reacts
    // to a "selectionchange" event when its own DOM root has focus.
    const textNode = editorEl.querySelector("p")!.firstChild!;
    const range = document.createRange();
    range.selectNodeContents(textNode);
    (screen.getByRole("textbox") as HTMLElement).focus();
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    await user.click(screen.getByRole("button", { name: "Negrita" }));

    expect(handleChange).toHaveBeenCalled();
    const lastCall = handleChange.mock.calls.at(-1)![0];
    expect(lastCall.content[0].content[0].marks).toEqual([{ type: "bold" }]);
    expect(screen.getByRole("button", { name: "Negrita" })).toHaveAttribute(
      "data-state",
      "on",
    );
  });

  it("toggles italic via the toolbar and reflects active state", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const doc = {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Hello" }] },
      ],
    };
    render(<RichTextEditor document={doc} onChange={handleChange} />);

    const editorEl = screen.getByTestId("rich-text-editor-card");
    const textNode = editorEl.querySelector("p")!.firstChild!;
    const range = document.createRange();
    range.selectNodeContents(textNode);
    (screen.getByRole("textbox") as HTMLElement).focus();
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    await user.click(screen.getByRole("button", { name: "Cursiva" }));

    expect(handleChange).toHaveBeenCalled();
    const lastCall = handleChange.mock.calls.at(-1)![0];
    expect(lastCall.content[0].content[0].marks).toEqual([{ type: "italic" }]);
    expect(screen.getByRole("button", { name: "Cursiva" })).toHaveAttribute(
      "data-state",
      "on",
    );
  });

  it("toggles underline via the toolbar and reflects active state", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const doc = {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Hello" }] },
      ],
    };
    render(<RichTextEditor document={doc} onChange={handleChange} />);

    const editorEl = screen.getByTestId("rich-text-editor-card");
    const textNode = editorEl.querySelector("p")!.firstChild!;
    const range = document.createRange();
    range.selectNodeContents(textNode);
    (screen.getByRole("textbox") as HTMLElement).focus();
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    await user.click(screen.getByRole("button", { name: "Subrayado" }));

    expect(handleChange).toHaveBeenCalled();
    const lastCall = handleChange.mock.calls.at(-1)![0];
    expect(lastCall.content[0].content[0].marks).toEqual([
      { type: "underline" },
    ]);
    expect(screen.getByRole("button", { name: "Subrayado" })).toHaveAttribute(
      "data-state",
      "on",
    );
  });
});

describe("RichTextEditor — highlight + copy", () => {
  it("renders exactly the 12 Figma-specified highlight swatches with human Spanish labels", () => {
    render(<RichTextEditor document={{ type: "doc", content: [] }} />);
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

  it("applies the correct highlight color for a solid-shade swatch click", async () => {
    const onChange = vi.fn();
    const singleRunDoc: JSONContent = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "hola mundo" }],
        },
      ],
    };
    render(<RichTextEditor document={singleRunDoc} onChange={onChange} />);

    const paragraphEl = screen.getByText("hola mundo").closest("p")!;
    const range = document.createRange();
    range.selectNodeContents(paragraphEl);
    // The contentEditable must be focused first — ProseMirror's view only
    // reacts to a "selectionchange" event when its own DOM root has focus
    // (see the "toggles bold via toolbar" test above for the same pattern).
    (screen.getByRole("textbox") as HTMLElement).focus();
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    fireEvent.select(paragraphEl);
    await waitFor(() => {
      expect(window.getSelection()?.isCollapsed).toBe(false);
    });

    fireEvent.click(screen.getByRole("button", { name: /resaltar/i }));
    fireEvent.click(screen.getByRole("button", { name: /^azul$/i }));

    expect(onChange).toHaveBeenCalledWith({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "hola mundo",
              marks: [{ type: "highlight", attrs: { color: "category.blue" } }],
            },
          ],
        },
      ],
    });
  });

  it("copies the serialized plain text to the clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    render(
      <RichTextEditor
        document={{
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "hola mundo" }],
            },
          ],
        }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /copiar/i }));
    expect(writeText).toHaveBeenCalledWith("hola mundo");
  });

  it("shows a border only on the swatch matching the current selection's highlight, and none by default", () => {
    const onChange = vi.fn();
    const highlightDoc: JSONContent = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "hola",
              marks: [{ type: "highlight", attrs: { color: "category.blue" } }],
            },
          ],
        },
      ],
    };
    render(<RichTextEditor document={highlightDoc} onChange={onChange} />);

    const paragraphEl = screen.getByText("hola").closest("p")!;
    const range = document.createRange();
    range.selectNodeContents(paragraphEl);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    fireEvent.select(paragraphEl);

    fireEvent.click(screen.getByRole("button", { name: /resaltar/i }));
    const blueSwatch = screen.getByRole("button", { name: /^azul$/i });
    const greenSwatch = screen.getByRole("button", { name: /^verde$/i });

    // jsdom's computed-style engine can't resolve a `border` shorthand whose
    // value is a CSS custom property (our design tokens compile to
    // `border: var(--aym-borders-primary-alt)`), so `toHaveStyle` always
    // reports "none" here regardless of which class is applied — a jsdom/
    // cssstyle limitation, not a real bug. Asserting on the generated
    // utility class name is the reliable way to check which swatch got the
    // active border class within this test environment.
    expect(blueSwatch.className).toMatch(/(?:^|\s)aym-bd_primary-alt(?:\s|$)/);
    expect(greenSwatch.className).not.toMatch(
      /(?:^|\s)aym-bd_primary-alt(?:\s|$)/,
    );
  });

  it("clicking the already-active swatch again removes the highlight and its border", async () => {
    const onChange = vi.fn();
    const plainDoc: JSONContent = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "hola" }],
        },
      ],
    };
    render(<RichTextEditor document={plainDoc} onChange={onChange} />);

    const paragraphEl = screen.getByText("hola").closest("p")!;
    const range = document.createRange();
    range.selectNodeContents(paragraphEl);
    // The contentEditable must be focused first — ProseMirror's view only
    // reacts to a "selectionchange" event when its own DOM root has focus
    // (see the "toggles bold via toolbar" test above for the same pattern).
    (screen.getByRole("textbox") as HTMLElement).focus();
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    fireEvent.select(paragraphEl);
    await waitFor(() => {
      expect(window.getSelection()?.isCollapsed).toBe(false);
    });

    fireEvent.click(screen.getByRole("button", { name: /resaltar/i }));
    const blueSwatch = screen.getByRole("button", { name: /^azul$/i });

    fireEvent.click(blueSwatch);
    expect(blueSwatch.className).toMatch(/(?:^|\s)aym-bd_primary-alt(?:\s|$)/);

    fireEvent.click(blueSwatch);
    expect(blueSwatch.className).not.toMatch(
      /(?:^|\s)aym-bd_primary-alt(?:\s|$)/,
    );
  });

  it("copies to the clipboard in readOnly mode", () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    render(
      <RichTextEditor
        readOnly
        document={{
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "solo lectura" }],
            },
          ],
        }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /copiar/i }));
    expect(writeText).toHaveBeenCalledWith("solo lectura");
  });

  it("does not apply a highlight or show a swatch as active when clicked with no active selection", () => {
    const onChange = vi.fn();
    render(
      <RichTextEditor
        document={{
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "hola" }],
            },
          ],
        }}
        onChange={onChange}
      />,
    );

    // No selection is ever made — open the popover and click a swatch cold.
    fireEvent.click(screen.getByRole("button", { name: /resaltar/i }));
    const blueSwatch = screen.getByRole("button", { name: /^azul$/i });
    fireEvent.click(blueSwatch);

    expect(onChange).not.toHaveBeenCalled();
    expect(blueSwatch.className).not.toMatch(
      /(?:^|\s)aym-bd_primary-alt(?:\s|$)/,
    );
  });
});

// StarterKit bundles BulletList/OrderedList/ListItem/ListKeymap (backed by
// @tiptap/extension-list) with zero extra configuration. Verified empirically
// here rather than assumed: typing "- "/"1. " autoformats into real list
// nodes, Enter continues/exits the list, and — critically — the pre-Tiptap
// hand-rolled-paragraph bug where typing into the paragraph produced by
// exiting an empty list item landed in the *previous* paragraph instead
// (documented in an earlier plan's task-7-report.md) does not reproduce with
// real ProseMirror list nodes.
//
// Each scenario is driven as a single, uninterrupted `userEvent.type(...)`
// call starting from a fresh empty paragraph, rather than programmatically
// setting a DOM Range/Selection mid-sequence and then continuing to type.
// That's a deliberate choice, not a style preference: jsdom has no real
// layout engine, so once a re-render moves the selection, userEvent's own
// pointer-position-based caret tracking (which falls back to a stubbed
// `elementFromPoint`) can desync from the Range we set by hand, and the
// following keystrokes land in the wrong node. Typing the whole scenario in
// one call lets userEvent track the caret itself the whole way through,
// which is reliable in this environment; splitting it up is not.
describe("RichTextEditor — lists", () => {
  it("autoformats '- ' into a real bullet list item while typing", async () => {
    const handleChange = vi.fn();
    const doc: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };
    render(<RichTextEditor document={doc} onChange={handleChange} />);
    const user = userEvent.setup();
    const editable = screen.getByRole("textbox");
    await user.click(editable);
    await user.type(editable, "- Primer punto");

    const lastCall = handleChange.mock.calls.at(-1)![0];
    expect(lastCall.content[0].type).toBe("bulletList");
    expect(lastCall.content[0].content[0].type).toBe("listItem");
    expect(lastCall.content[0].content[0].content[0].content[0].text).toBe(
      "Primer punto",
    );
  });

  it("autoformats '1. ' into a real ordered list item while typing", async () => {
    const handleChange = vi.fn();
    const doc: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };
    render(<RichTextEditor document={doc} onChange={handleChange} />);
    const user = userEvent.setup();
    const editable = screen.getByRole("textbox");
    await user.click(editable);
    await user.type(editable, "1. Paso uno");

    const lastCall = handleChange.mock.calls.at(-1)![0];
    expect(lastCall.content[0].type).toBe("orderedList");
    expect(lastCall.content[0].content[0].type).toBe("listItem");
    expect(lastCall.content[0].content[0].content[0].content[0].text).toBe(
      "Paso uno",
    );
  });

  it("continues an ordered list on Enter, adding a sibling item", async () => {
    const handleChange = vi.fn();
    const doc: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };
    render(<RichTextEditor document={doc} onChange={handleChange} />);
    const user = userEvent.setup();
    const editable = screen.getByRole("textbox");
    await user.click(editable);
    await user.type(editable, "1. Paso uno{Enter}Paso dos");

    const lastCall = handleChange.mock.calls.at(-1)![0];
    const items = lastCall.content[0].content;
    expect(lastCall.content[0].type).toBe("orderedList");
    expect(items).toHaveLength(2);
    expect(items[0].content[0].content[0].text).toBe("Paso uno");
    expect(items[1].content[0].content[0].text).toBe("Paso dos");
  });

  it("exits the list when Enter is pressed on an empty list item", async () => {
    const handleChange = vi.fn();
    const doc: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };
    render(<RichTextEditor document={doc} onChange={handleChange} />);
    const user = userEvent.setup();
    const editable = screen.getByRole("textbox");
    await user.click(editable);
    // "- Primer punto" autoformats to a bullet item; the first Enter
    // continues the list with a new empty item; the second Enter, pressed
    // on that now-empty item, exits the list instead of adding another one.
    await user.type(editable, "- Primer punto{Enter}{Enter}");

    const lastCall = handleChange.mock.calls.at(-1)![0];
    expect(lastCall.content[0].type).toBe("bulletList");
    expect(lastCall.content[0].content).toHaveLength(1);
    expect(lastCall.content[0].content[0].content[0].content[0].text).toBe(
      "Primer punto",
    );
    expect(lastCall.content[1].type).toBe("paragraph");
  });

  it("regression: typing into the paragraph produced by exiting an empty list item lands there, not in the previous item (task-7-report.md bug)", async () => {
    const handleChange = vi.fn();
    const doc: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };
    render(<RichTextEditor document={doc} onChange={handleChange} />);
    const user = userEvent.setup();
    const editable = screen.getByRole("textbox");
    await user.click(editable);
    await user.type(editable, "- Primer punto{Enter}{Enter}texto");

    const lastCall = handleChange.mock.calls.at(-1)![0];
    // The bulletList item's own text must be untouched — this is exactly
    // the failure mode from the pre-Tiptap bug, where the typed text was
    // misrouted into the previous (list) paragraph instead of the new one.
    expect(lastCall.content[0].content[0].content[0].content[0].text).toBe(
      "Primer punto",
    );
    const typedNode = lastCall.content.find(
      (node: JSONContent) => node.type === "paragraph" && node.content,
    );
    expect(typedNode?.content?.[0].text).toBe("texto");
  });
});
