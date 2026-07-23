import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
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
