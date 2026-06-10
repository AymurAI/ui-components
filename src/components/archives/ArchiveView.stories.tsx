import type { Meta, StoryObj } from "@storybook/react";
import { ArchiveView } from "./ArchiveView";

const meta = {
  title: "Components/Archives/ArchiveView",
  component: ArchiveView,
  tags: ["autodocs"],
  args: { fileName: "Archivo 1.doc" },
} satisfies Meta<typeof ArchiveView>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma: Type=Previsualitation */
export const Preview: Story = { args: { type: "preview" } };

/** Figma: Type=Previsualitation Error */
export const PreviewError: Story = { args: { type: "preview-error" } };

/** Figma: Type=Document OK */
export const DocumentOk: Story = { args: { type: "document-ok" } };

/** Figma: Type=Document Error */
export const DocumentError: Story = { args: { type: "document-error" } };

/** With selected state */
export const PreviewSelected: Story = {
  args: { type: "preview", selected: true },
};

/** Matrix */
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, padding: 16, flexWrap: "wrap" }}>
      <ArchiveView type="preview" fileName="Archivo 1.doc" />
      <ArchiveView type="preview-error" fileName="Archivo 2.doc" />
      <ArchiveView type="document-ok" fileName="Archivo 3.doc" />
      <ArchiveView type="document-error" fileName="Archivo 4.doc" />
    </div>
  ),
};
