import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
    figma: {
      url: "https://www.figma.com/design/2BahKpebYzaccFih0ZB79y?node-id=40001422:54714",
    },
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md"] },
    color: {
      control: "inline-radio",
      options: ["primary", "secondary", "warning", "success"],
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { initials: "AD", size: "sm", color: "primary" },
};

export const Matrix: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      <Avatar initials="AD" color="primary" />
      <Avatar initials="AB" color="secondary" />
      <Avatar initials="MC" color="warning" />
      <Avatar initials="JL" color="success" />
      <Avatar initials="AD" color="primary" size="md" />
    </div>
  ),
};
