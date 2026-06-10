import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Switch } from "./Switch";

const meta = {
  title: "Components/Switch",
  component: Switch,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true },
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Switch checked={checked} onCheckedChange={setChecked} />
        <span>{checked ? "On" : "Off"}</span>
      </div>
    );
  },
};

export const Matrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Switch />
        <span>Unchecked</span>
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Switch defaultChecked />
        <span>Checked</span>
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Switch disabled />
        <span>Disabled unchecked</span>
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Switch disabled defaultChecked />
        <span>Disabled checked</span>
      </div>
    </div>
  ),
};
