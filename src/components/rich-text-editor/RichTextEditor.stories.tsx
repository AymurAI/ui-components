import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { documentFromMarkdown } from "@/utils/rich-text/model";
import type { RichTextDocument } from "@/utils/rich-text/types";
import { RichTextEditor } from "./RichTextEditor";

const sampleDoc: RichTextDocument = {
  paragraphs: [
    {
      id: "p1",
      runs: [
        {
          text: "El presente caso tramita ante el Juzgado en lo Penal, ",
          marks: [],
        },
        { text: "Contravencional y de Faltas", marks: [{ type: "bold" }] },
        { text: " N.º 10.", marks: [] },
      ],
    },
    {
      id: "p2",
      runs: [
        {
          text: "Se dispusieron medidas de protección urgentes.",
          marks: [{ type: "highlight", color: "category.yellow-light" }],
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
    document: { paragraphs: [] },
    title: "Resumen",
  },
};

export const Lists: Story = {
  render: () => {
    const [doc, setDoc] = useState<RichTextDocument>({
      paragraphs: [
        { id: "p1", runs: [{ text: "• Primer punto", marks: [] }] },
        { id: "p2", runs: [{ text: "• Segundo punto", marks: [] }] },
        { id: "p3", runs: [{ text: "1. Paso uno", marks: [] }] },
        { id: "p4", runs: [{ text: "2. Paso dos", marks: [] }] },
      ],
    });
    return <RichTextEditor document={doc} onChange={setDoc} title="Listas" />;
  },
};

export const FromMarkdown: Story = {
  render: () => {
    const [doc, setDoc] = useState(
      documentFromMarkdown(
        "## Resumen del documento\n\nEl presente caso tramita ante el **Juzgado en lo Penal, Contravencional y de Faltas N.º 10**.\n\n- Hecho relevante uno\n- Hecho relevante dos\n\nSe dispusieron *medidas de protección* urgentes.",
      ),
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
