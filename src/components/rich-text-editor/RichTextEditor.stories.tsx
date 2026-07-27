import type { Meta, StoryObj } from "@storybook/react";
import type { JSONContent } from "@tiptap/core";
import { useState } from "react";
import { documentFromMarkdown } from "@/utils/rich-text/markdown";
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
          marks: [{ type: "highlight", attrs: { color: "#FFF2C6" } }],
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

const SAMPLE_MARKDOWN = `## Resumen del documento

El presente caso tramita ante el **Juzgado en lo Penal, Contravencional y de Faltas N.º 10**.

1. **Hechos relevantes**
   - Hecho relevante uno
   - Hecho relevante dos
2. **Decisión adoptada**
   - Se dispusieron *medidas de protección* urgentes.

---

## Entidades relevantes

| Medida | Plazo |
| --- | --- |
| Exclusión del hogar | Inmediato |
| Prohibición de acercamiento | 180 días |`;

export const FromMarkdown: Story = {
  render: () => {
    const [doc, setDoc] = useState<JSONContent>(() =>
      documentFromMarkdown(SAMPLE_MARKDOWN),
    );
    return (
      <RichTextEditor
        document={doc}
        onChange={setDoc}
        title="Resumen 10/04/2025"
      />
    );
  },
};
