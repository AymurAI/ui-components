import type { Meta, StoryObj } from "@storybook/react";
import { CheckCircle } from "./CheckCircle";

const meta = {
  title: "Components/CheckCircle",
  component: CheckCircle,
  parameters: {
    layout: "centered",
    figma: {
      url: "https://www.figma.com/design/2BahKpebYzaccFih0ZB79y?node-id=1568:25593",
    },
  },
  argTypes: {
    size: { control: { type: "range", min: 16, max: 96, step: 4 } },
    "aria-label": { control: "text" },
  },
} satisfies Meta<typeof CheckCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

// Figma node: 1568:25593 (48×48)
export const Default: Story = {
  args: { size: 48 },
};

export const Small: Story = {
  args: { size: 24 },
};

export const Large: Story = {
  args: { size: 64 },
};

export const Matrix: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <CheckCircle size={24} />
      <CheckCircle size={36} />
      <CheckCircle size={48} />
      <CheckCircle size={64} />
    </div>
  ),
};
