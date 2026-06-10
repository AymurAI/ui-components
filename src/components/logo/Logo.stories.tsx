import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "./Logo";

const meta = {
  title: "Components/Logo",
  component: Logo,
  tags: ["autodocs"],
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma: Version=Logo */
export const LogoVariant: Story = { args: { variant: "logo" } };

/** Figma: Version=Logo+Feature */
export const LogoFeature: Story = {
  args: { variant: "logo-feature", featureName: "Anonimizador" },
};

/** Figma: Version=Iso */
export const Iso: Story = { args: { variant: "iso" } };

/** Matrix — all variants */
export const Matrix: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 32,
        padding: 24,
        background: "#f6f5f7",
      }}
    >
      <Logo variant="logo" />
      <Logo variant="logo-feature" featureName="Anonimizador" />
      <Logo variant="logo-feature" featureName="Set de datos" />
      <Logo variant="iso" />
    </div>
  ),
};
