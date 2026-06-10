import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Select, type SelectOption } from "./Select";

const OPTIONS: SelectOption[] = [
  { id: "apple", text: "Apple" },
  { id: "banana", text: "Banana" },
  { id: "cherry", text: "Cherry" },
  { id: "date", text: "Date" },
  { id: "elderberry", text: "Elderberry" },
];

const meta = {
  title: "Components/Select",
  component: Select,
  args: { options: OPTIONS, placeholder: "Select an option…" },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: "Fruit" } };
export const WithValue: Story = { args: { label: "Fruit", value: "banana" } };
export const Disabled: Story = { args: { label: "Fruit", disabled: true } };
export const Small: Story = { args: { label: "Fruit", size: "sm" } };
export const WithPrefix: Story = { args: { label: "Fruit", prefix: "Select" } };
export const WithSuffix: Story = { args: { label: "Fruit", suffix: "items" } };
export const WithSuggestion: Story = {
  args: {
    label: "Fruit",
    suggestion: { id: "cherry", text: "Cherry (suggested)" },
  },
};
export const PriorityOrder: Story = {
  args: {
    label: "Fruit",
    priorityOrder: ["cherry", "banana"],
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <div style={{ maxWidth: 300 }}>
        <Select
          label="Controlled"
          options={OPTIONS}
          placeholder="Pick a fruit…"
          value={value}
          onChange={(opt) => setValue(opt.id)}
        />
        <p style={{ marginTop: 8 }}>Selected: {value ?? "none"}</p>
      </div>
    );
  },
};

export const Matrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24, maxWidth: 300 }}>
      <Select label="Default" options={OPTIONS} placeholder="Select…" />
      <Select label="With value" options={OPTIONS} value="banana" />
      <Select label="Disabled" options={OPTIONS} disabled />
      <Select label="Small" options={OPTIONS} size="sm" placeholder="Select…" />
      <Select
        label="With suggestion"
        options={OPTIONS}
        suggestion={{ id: "cherry" }}
        placeholder="Select…"
      />
    </div>
  ),
};
