import type { Meta, StoryObj } from "@storybook/react";
import { Search } from "./Search";

const meta = {
  title: "Components/Search",
  component: Search,
  tags: ["autodocs"],
  args: { placeholder: "Buscar" },
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Status=Default — empty placeholder */
export const Default: Story = {};

/** Status=Field — user has typed something */
export const Field: Story = {
  args: { value: "Buscar", defaultValue: "Buscar" },
};

/** Status=Suggestion — text with autocomplete ghost */
export const Suggestion: Story = {
  args: { value: "Buscar", suggestion: "suggestion" },
};

/** Matrix */
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Search placeholder="Buscar" />
      <Search value="Buscar" />
      <Search value="Buscar" suggestion="suggestion" />
    </div>
  ),
};
