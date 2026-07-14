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
      options: [
        "primary",
        "secondary",
        "warning",
        "success",
        "violet",
        "violet-light",
        "green",
        "green-light",
        "red",
        "red-light",
        "yellow",
        "yellow-light",
        "pink",
        "pink-light",
        "orange",
        "orange-light",
        "blue",
        "blue-light",
      ],
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { initials: "AD", size: "sm", color: "violet" },
};

/**
 * Figma bg/category/* speaker-palette — 7 colours × base/-light, both sizes,
 * plus the semantic set (primary/secondary/warning/success).
 */
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <Avatar initials="AB" color="violet" size="sm" />
        <Avatar initials="CD" color="green" size="sm" />
        <Avatar initials="EF" color="red" size="sm" />
        <Avatar initials="GH" color="yellow" size="sm" />
        <Avatar initials="IJ" color="pink" size="sm" />
        <Avatar initials="KL" color="orange" size="sm" />
        <Avatar initials="MN" color="blue" size="sm" />
      </div>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <Avatar initials="AB" color="violet-light" size="sm" />
        <Avatar initials="CD" color="green-light" size="sm" />
        <Avatar initials="EF" color="red-light" size="sm" />
        <Avatar initials="GH" color="yellow-light" size="sm" />
        <Avatar initials="IJ" color="pink-light" size="sm" />
        <Avatar initials="KL" color="orange-light" size="sm" />
        <Avatar initials="MN" color="blue-light" size="sm" />
      </div>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <Avatar initials="AB" color="violet" size="md" />
        <Avatar initials="CD" color="green" size="md" />
        <Avatar initials="EF" color="red" size="md" />
        <Avatar initials="GH" color="yellow" size="md" />
        <Avatar initials="IJ" color="pink" size="md" />
        <Avatar initials="KL" color="orange" size="md" />
        <Avatar initials="MN" color="blue" size="md" />
      </div>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <Avatar initials="AB" color="violet-light" size="md" />
        <Avatar initials="CD" color="green-light" size="md" />
        <Avatar initials="EF" color="red-light" size="md" />
        <Avatar initials="GH" color="yellow-light" size="md" />
        <Avatar initials="IJ" color="pink-light" size="md" />
        <Avatar initials="KL" color="orange-light" size="md" />
        <Avatar initials="MN" color="blue-light" size="md" />
      </div>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <Avatar initials="AD" color="primary" size="sm" />
        <Avatar initials="AB" color="secondary" size="sm" />
        <Avatar initials="MC" color="warning" size="sm" />
        <Avatar initials="JL" color="success" size="sm" />
      </div>
    </div>
  ),
};
