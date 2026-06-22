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

/** Status=Default — empty placeholder, border #BCBAB8 */
export const Default: Story = {};

/** Status=Focus — dark border #110041 + drop-shadow; click/tab into the input */
export const Focus: Story = {
  render: (args) => (
    // autoFocus triggers :focus-within styles in the wrapper
    <Search {...args} autoFocus />
  ),
};

/** Status=Field — user has typed something; border #9F99A5; right-side controls */
export const Field: Story = {
  args: {
    value: "Buscar",
    defaultValue: "Buscar",
    resultCount: "1 de 2",
    onClear: () => {},
    onPrev: () => {},
    onNext: () => {},
  },
};

/** Status=Suggestion — text with autocomplete ghost; border #9F99A5 + drop-shadow */
export const Suggestion: Story = {
  args: { value: "Buscar", suggestion: "suggestion" },
};

/** Matrix — all 4 Figma variants in one view */
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Default */}
      <Search placeholder="Buscar" />
      {/* Focus — autoFocus triggers the :focus-within ring */}
      <Search placeholder="Buscar" autoFocus />
      {/* Field */}
      <Search
        value="Buscar"
        defaultValue="Buscar"
        resultCount="1 de 2"
        onClear={() => {}}
        onPrev={() => {}}
        onNext={() => {}}
      />
      {/* Suggestion */}
      <Search value="Buscar" suggestion="suggestion" />
    </div>
  ),
};
