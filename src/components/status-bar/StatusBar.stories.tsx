import type { Meta, StoryObj } from "@storybook/react";
import { StatusBar } from "./StatusBar";

const meta = {
  title: "Components/StatusBar",
  component: StatusBar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof StatusBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma: Full StatusBar/1440 — all three sections */
export const Full: Story = {
  args: { variant: "full", tabTitle: "Aymurai", url: "www.aymurai.com" },
};

/** Tabs only (time + tab bar) */
export const TabsOnly: Story = {
  args: { variant: "tabs" },
};

/** Address bar only */
export const AddressOnly: Story = {
  args: { variant: "address" },
};

/** Custom tab title and URL */
export const CustomContent: Story = {
  args: {
    variant: "full",
    tabTitle: "Anonimizador - Aymurai",
    url: "app.aymurai.com/anonimizador",
  },
};

/** Matrix */
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <StatusBar variant="full" />
      <StatusBar variant="tabs" />
      <StatusBar variant="address" />
    </div>
  ),
};
