import type { Meta, StoryObj } from "@storybook/react";
import { Suggestion } from "./Suggestion";

const meta = {
  title: "Components/Suggestion",
  component: Suggestion,
  args: { children: "Suggested text" },
} satisfies Meta<typeof Suggestion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Clickable: Story = { args: { clickable: true } };
export const Rounded: Story = { args: { rounded: true } };
export const ClickableRounded: Story = {
  args: { clickable: true, rounded: true },
};
