import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
    figma: {
      url: "https://www.figma.com/design/2BahKpebYzaccFih0ZB79y?node-id=25:12490",
    },
  },
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Figma: Checked=No, Status=Default (25:12491)
export const UncheckedDefault: Story = {
  args: { children: "Label option", checked: false },
};

// Figma: Checked=No, Status=Hover (25:12494) — hover via CSS
export const UncheckedHover: Story = {
  args: { children: "Label option", checked: false },
};

// Figma: Checked=No, Status=Disable (25:12497)
export const UncheckedDisabled: Story = {
  args: { children: "Label option", checked: false, disabled: true },
};

// Figma: Checked=No, Status=Focus (25:12500) — focus via :focus-within CSS
export const UncheckedFocus: Story = {
  args: { children: "Label option", checked: false },
};

// Figma: Checked=Yes, Status=Default (25:12503)
export const CheckedDefault: Story = {
  args: { children: "Label option", checked: true },
};

// Figma: Checked=Yes, Status=Hover (25:12506)
export const CheckedHover: Story = {
  args: { children: "Label option", checked: true },
};

// Figma: Checked=Yes, Status=Disable (25:12509)
export const CheckedDisabled: Story = {
  args: { children: "Label option", checked: true, disabled: true },
};

// Figma: Checked=Yes, Status=Focus (25:12512)
export const CheckedFocus: Story = {
  args: { children: "Label option", checked: true },
};

// Matrix: all variants
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <Checkbox checked={false}>Unchecked Default</Checkbox>
      <Checkbox checked={false} disabled>
        Unchecked Disabled
      </Checkbox>
      <Checkbox checked={true}>Checked Default</Checkbox>
      <Checkbox checked={true} disabled>
        Checked Disabled
      </Checkbox>
      <Checkbox defaultChecked>Uncontrolled</Checkbox>
    </div>
  ),
};
