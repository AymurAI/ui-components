import { Article } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react";
import { CardTool } from "./CardTool";

const meta = {
  title: "Components/CardTool",
  component: CardTool,
  args: {
    icon: <Article />,
    title: "Resumen de documentos",
    description: "Resumen automático de documentos",
    interactive: true,
  },
} satisfies Meta<typeof CardTool>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = {
  args: { disabled: true, interactive: false },
};
