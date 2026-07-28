import type { Meta, StoryObj } from "@storybook/react";
import { PageTitle } from "./PageTitle";

const meta = {
  title: "Components/PageTitle",
  component: PageTitle,
  args: {
    children: "1. Selección de archivo",
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof PageTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongTitle: Story = {
  args: {
    children: "Revisá y validá la información extraída del documento",
  },
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
