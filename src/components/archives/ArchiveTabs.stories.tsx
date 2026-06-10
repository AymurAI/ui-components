import type { Meta, StoryObj } from "@storybook/react";
import { ArchiveTabs } from "./ArchiveTabs";

const meta = {
  title: "Components/Archives/ArchiveTabs",
  component: ArchiveTabs,
  tags: ["autodocs"],
  args: { label: "Archivo1.doc" },
} satisfies Meta<typeof ArchiveTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma: Status=Selected */
export const Selected: Story = { args: { status: "selected" } };

/** Figma: Status=Completed */
export const Completed: Story = { args: { status: "completed" } };

/** Figma: Status=Unselected */
export const Unselected: Story = { args: { status: "unselected" } };

/** Matrix */
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 4 }}>
      <ArchiveTabs label="Archivo1.doc" status="selected" />
      <ArchiveTabs label="Archivo1.doc" status="completed" />
      <ArchiveTabs label="Archivo2.doc" status="unselected" />
    </div>
  ),
};
