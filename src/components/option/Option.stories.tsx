import type { Meta, StoryObj } from "@storybook/react";
import { Option } from "./Option";

const meta = {
  title: "Components/Option",
  component: Option,
  parameters: {
    layout: "centered",
    figma: {
      url: "https://www.figma.com/design/2BahKpebYzaccFih0ZB79y?node-id=40001295:56887",
    },
  },
  argTypes: {
    selected: { control: "boolean" },
  },
} satisfies Meta<typeof Option>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Content", selected: false },
  decorators: [
    (Story) => (
      <div style={{ width: 407 }}>
        <Story />
      </div>
    ),
  ],
};

export const Selected: Story = {
  args: { label: "Content", selected: true },
  decorators: [
    (Story) => (
      <div style={{ width: 407 }}>
        <Story />
      </div>
    ),
  ],
};

export const List: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", width: 407 }}>
      <Option label="Persona 1" selected />
      <Option label="Persona 2" />
      <Option label="Jueza" />
      <Option label="Fiscal" />
    </div>
  ),
};
