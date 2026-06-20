import type { Meta, StoryObj } from "@storybook/react";
import { AvatarPill } from "./AvatarPill";

const meta = {
  title: "Components/AvatarPill",
  component: AvatarPill,
  parameters: {
    layout: "centered",
    figma: {
      url: "https://www.figma.com/design/2BahKpebYzaccFih0ZB79y?node-id=40002313:53080",
    },
  },
  argTypes: {
    selected: { control: "boolean" },
    color: {
      control: "inline-radio",
      options: ["primary", "secondary", "warning", "success"],
    },
  },
} satisfies Meta<typeof AvatarPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { initials: "AB", name: "Name Surname", selected: false },
};

export const Selected: Story = {
  args: { initials: "AB", name: "Name Surname", selected: true },
};

export const Matrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <AvatarPill initials="AB" name="Persona 1" color="primary" />
      <AvatarPill initials="AB" name="Persona 2" color="success" />
      <AvatarPill initials="JU" name="Jueza" color="warning" />
      <AvatarPill initials="DE" name="Defensor" color="secondary" selected />
    </div>
  ),
};
