import type { Meta, StoryObj } from "@storybook/react";
import { ArchiveProgress } from "./ArchiveProgress";

const meta = {
  title: "Components/Archives/ArchiveProgress",
  component: ArchiveProgress,
  tags: ["autodocs"],
  args: { fileName: "Archivo 1.doc", progress: 0 },
} satisfies Meta<typeof ArchiveProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma: Status=Default 20% */
export const Default20: Story = { args: { status: "default", progress: 20 } };

/** Figma: Status=Default 50% */
export const Default50: Story = { args: { status: "default", progress: 50 } };

/** Figma: Status=Stoped */
export const Stopped: Story = { args: { status: "stopped", progress: 20 } };

/** Figma: Status=Replace archive */
export const Replace: Story = { args: { status: "replace", progress: 0 } };

/** Figma: Status=Error */
export const ErrorState: Story = { args: { status: "error", progress: 0 } };

/** Figma: Status=Completed */
export const Completed: Story = {
  args: { status: "completed", progress: 100 },
};

/** Matrix — all states */
export const Matrix: Story = {
  render: () => (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 8, padding: 20 }}
    >
      <ArchiveProgress
        status="default"
        progress={20}
        fileName="Archivo 1.doc"
      />
      <ArchiveProgress
        status="default"
        progress={50}
        fileName="Archivo 2.doc"
      />
      <ArchiveProgress
        status="stopped"
        progress={20}
        fileName="Archivo 3.doc"
      />
      <ArchiveProgress status="replace" progress={0} fileName="Archivo 4.doc" />
      <ArchiveProgress status="error" progress={0} fileName="Archivo 5.doc" />
      <ArchiveProgress
        status="completed"
        progress={100}
        fileName="Archivo 6.doc"
      />
    </div>
  ),
};
