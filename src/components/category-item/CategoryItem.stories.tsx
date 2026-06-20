import type { Meta, StoryObj } from "@storybook/react";
import { CategoryItem } from "./CategoryItem";

const meta = {
  title: "Components/CategoryItem",
  component: CategoryItem,
  parameters: {
    layout: "centered",
    figma: {
      url: "https://www.figma.com/design/2BahKpebYzaccFih0ZB79y?node-id=40001297:49803",
    },
  },
} satisfies Meta<typeof CategoryItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Categoria" },
  decorators: [
    (Story) => (
      <div style={{ width: 415 }}>
        <Story />
      </div>
    ),
  ],
};

export const Checked: Story = {
  args: { label: "Categoria", defaultChecked: true },
  decorators: [
    (Story) => (
      <div style={{ width: 415 }}>
        <Story />
      </div>
    ),
  ],
};

export const List: Story = {
  render: () => (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 4, width: 415 }}
    >
      <CategoryItem label="Personas" defaultChecked />
      <CategoryItem label="Fechas" />
      <CategoryItem label="Números de expediente" defaultChecked />
      <CategoryItem label="Categoría deshabilitada" disabled />
    </div>
  ),
};
