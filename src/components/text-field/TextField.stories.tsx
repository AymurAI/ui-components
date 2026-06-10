import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TextField } from "./TextField";

const meta = {
  title: "Components/TextField",
  component: TextField,
  args: { value: "", onChange: () => {} },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Placeholder state — empty value */
export const Placeholder: Story = {
  args: { placeholder: "Enter text…", label: "Label" },
};

/** Typed state — has a value */
export const Typed: Story = {
  args: { value: "Hello world", label: "Label" },
};

/** With helper text */
export const WithHelper: Story = {
  args: {
    placeholder: "Enter text…",
    label: "Label",
    helper: "Helper message",
  },
};

/** Error state */
export const ErrorState: Story = {
  args: {
    placeholder: "Enter text…",
    label: "Label",
    error: "This field is required",
  },
};

/** Disabled state */
export const Disabled: Story = {
  args: {
    placeholder: "Enter text…",
    label: "Label",
    disabled: true,
    value: "Disabled value",
  },
};

/** With prefix */
export const WithPrefix: Story = {
  args: { placeholder: "0.00", label: "Amount", prefix: "$" },
};

/** With suffix */
export const WithSuffix: Story = {
  args: { placeholder: "0.00", label: "Weight", suffix: "kg" },
};

/** With suggestion */
export const WithSuggestion: Story = {
  args: { placeholder: "", label: "Label", suggestion: "Suggested text" },
};

/** Small size */
export const Small: Story = {
  args: { placeholder: "Small field…", label: "Small", size: "sm" },
};

/** Interactive controlled example */
export const Controlled: Story = {
  render: () => {
    const [val, setVal] = useState("");
    return (
      <TextField
        label="Controlled"
        placeholder="Type something…"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        helper="This is a controlled input"
      />
    );
  },
};

/** Full state matrix */
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24, maxWidth: 400 }}>
      <TextField
        label="Placeholder"
        placeholder="Enter text…"
        value=""
        onChange={() => {}}
      />
      <TextField label="Typed" value="Hello world" onChange={() => {}} />
      <TextField
        label="With suggestion"
        value=""
        suggestion="AI suggestion"
        onChange={() => {}}
      />
      <TextField
        label="With prefix"
        prefix="$"
        value=""
        placeholder="0.00"
        onChange={() => {}}
      />
      <TextField
        label="With suffix"
        suffix="kg"
        value=""
        placeholder="0.00"
        onChange={() => {}}
      />
      <TextField
        label="Error"
        value=""
        error="Required field"
        onChange={() => {}}
      />
      <TextField
        label="Disabled"
        value="Can't edit"
        disabled
        onChange={() => {}}
      />
      <TextField
        label="Small"
        size="sm"
        placeholder="Small"
        value=""
        onChange={() => {}}
      />
    </div>
  ),
};
