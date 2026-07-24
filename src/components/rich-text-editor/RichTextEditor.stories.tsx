import type { Meta, StoryObj } from "@storybook/react";
import type { JSONContent } from "@tiptap/core";
import { useState } from "react";
import { RichTextEditor } from "./RichTextEditor";

const sampleDoc: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "El presente caso tramita ante el Juzgado en lo Penal, ",
        },
        {
          type: "text",
          text: "Contravencional y de Faltas",
          marks: [{ type: "bold" }],
        },
        { type: "text", text: " N.º 10." },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Se dispusieron medidas de protección urgentes.",
          marks: [
            { type: "highlight", attrs: { color: "category.yellow-light" } },
          ],
        },
      ],
    },
  ],
};

const meta: Meta<typeof RichTextEditor> = {
  title: "Components/RichTextEditor",
  component: RichTextEditor,
};
export default meta;

type Story = StoryObj<typeof RichTextEditor>;

export const Editable: Story = {
  render: () => {
    const [doc, setDoc] = useState(sampleDoc);
    const [title, setTitle] = useState("Resumen 10/04/2025");
    return (
      <RichTextEditor
        document={doc}
        onChange={setDoc}
        title={title}
        onTitleChange={setTitle}
      />
    );
  },
};

export const ReadOnlyPreview: Story = {
  args: {
    document: sampleDoc,
    title: "Resumen 10/04/2025",
    readOnly: true,
  },
};

export const Empty: Story = {
  args: {
    document: { type: "doc", content: [] },
    title: "Resumen",
  },
};

export const Lists: Story = {
  render: () => {
    const [doc, setDoc] = useState<JSONContent>({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "• Primer punto" }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "• Segundo punto" }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "1. Paso uno" }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "2. Paso dos" }],
        },
      ],
    });
    return <RichTextEditor document={doc} onChange={setDoc} title="Listas" />;
  },
};

// TODO(later task): re-derive this from real markdown once a JSONContent-
// producing markdown parser exists (Task 2 only added plain-text helpers).
export const FromMarkdown: Story = {
  render: () => {
    const [doc, setDoc] = useState<JSONContent>({
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Resumen del documento" }],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "El presente caso tramita ante el " },
            {
              type: "text",
              text: "Juzgado en lo Penal, Contravencional y de Faltas N.º 10",
              marks: [{ type: "bold" }],
            },
            { type: "text", text: "." },
          ],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Hecho relevante uno" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Hecho relevante dos" }],
                },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Se dispusieron " },
            {
              type: "text",
              text: "medidas de protección",
              marks: [{ type: "italic" }],
            },
            { type: "text", text: " urgentes." },
          ],
        },
      ],
    });
    return (
      <RichTextEditor
        document={doc}
        onChange={setDoc}
        title="Resumen 10/04/2025"
      />
    );
  },
};
