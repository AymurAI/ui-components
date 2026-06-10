import type { Meta, StoryObj } from "@storybook/react";
import { Radio } from "./Radio";

const meta = {
  title: "Components/Radio",
  component: Radio,
  parameters: {
    layout: "centered",
    figma: {
      url: "https://www.figma.com/design/2BahKpebYzaccFih0ZB79y?node-id=1:4612",
    },
  },
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

// Figma: Status=Default, Checked=Off (1:4613)
export const OffDefault: Story = {
  args: { children: "Label option", checked: false },
};

// Figma: Status=Hover, Checked=Off (1:4616)
export const OffHover: Story = {
  args: { children: "Label option", checked: false },
};

// Figma: Status=Disable, Checked=Off (1:4619)
export const OffDisabled: Story = {
  args: { children: "Label option", checked: false, disabled: true },
};

// Figma: Status=Focus, Checked=Off (1:4622)
export const OffFocus: Story = {
  args: { children: "Label option", checked: false },
};

// Figma: Status=Default, Checked=On (1:4625)
export const OnDefault: Story = {
  args: { children: "Label option", checked: true },
};

// Figma: Status=Hover, Checked=On (1:4628)
export const OnHover: Story = {
  args: { children: "Label option", checked: true },
};

// Figma: Status=Disable, Checked=On (1:4631)
export const OnDisabled: Story = {
  args: { children: "Label option", checked: true, disabled: true },
};

// Figma: Status=Focus, Checked=On (1:4634)
export const OnFocus: Story = {
  args: { children: "Label option", checked: true },
};

export const Matrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <Radio name="matrix" value="a" checked={false}>
        Off Default
      </Radio>
      <Radio name="matrix" value="b" checked={false} disabled>
        Off Disabled
      </Radio>
      <Radio name="matrix" value="c" checked={true}>
        On Default
      </Radio>
      <Radio name="matrix" value="d" checked={true} disabled>
        On Disabled
      </Radio>
    </div>
  ),
};
