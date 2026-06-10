import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./Spinner";

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
    figma: {
      url: "https://www.figma.com/design/2BahKpebYzaccFih0ZB79y?node-id=1994:29039",
    },
  },
  argTypes: {
    size: { control: { type: "range", min: 16, max: 96, step: 4 } },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

// Figma default: 48px (1568:25629 / 1568:25624)
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
      <Spinner size={24} />
      <Spinner size={36} />
      <Spinner size={48} />
      <Spinner size={64} />
    </div>
  ),
};
