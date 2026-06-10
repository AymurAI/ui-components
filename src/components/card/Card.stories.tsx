import { css } from "@/styled/css";
import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const meta = {
  title: "Components/Card",
  component: Card,
  args: {
    children: (
      <p className={css({ textStyle: "paragraph.sm.default" })}>
        Card content goes here.
      </p>
    ),
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: "sm" } };
export const Disabled: Story = { args: { disabled: true } };
export const Clickable: Story = { args: { clickable: true } };
export const ClickableDisabled: Story = {
  args: { clickable: true, disabled: true },
};

export const Matrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24, maxWidth: 600 }}>
      <Card>
        <p>Default (large, not clickable)</p>
      </Card>
      <Card size="sm">
        <p>Small size</p>
      </Card>
      <Card disabled>
        <p>Disabled</p>
      </Card>
      <Card clickable>
        <p>Clickable — hover for shadow effect</p>
      </Card>
      <Card clickable disabled>
        <p>Clickable + Disabled</p>
      </Card>
    </div>
  ),
};
