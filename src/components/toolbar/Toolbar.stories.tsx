import type { Meta, StoryObj } from "@storybook/react";
import { css } from "@/styled/css";
import { Toolbar } from "./Toolbar";

const meta = {
  title: "Components/Toolbar",
  component: Toolbar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma: Property1=Anonimizador — search + tool buttons */
export const Anonimizador: Story = {
  args: {
    context: "anonimizador",
    toolButtons: ["reemplazar", "reemplazar-todo", "eliminar", "eliminar-todo"],
  },
};

/** Figma: Property1=Set de datos — search only (no tool buttons) */
export const SetDeDatos: Story = {
  args: {
    context: "set-de-datos",
  },
};

/** Figma: Property1=Search+Switch — search + switch label on right */
export const SearchSwitch: Story = {
  args: {
    context: "search-switch",
    rightSlot: (
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          gap: "2",
          p: "2",
        })}
      >
        <div
          className={css({
            bg: "action.disabled",
            w: "[32px]",
            h: "[19px]",
            rounded: "full",
            p: "1",
          })}
        />
        <span
          className={css({
            textStyle: "label.md.default",
            color: "text.default",
          })}
        >
          Modo Edición
        </span>
      </div>
    ),
  },
};

/** Matrix — all contexts */
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <Toolbar
        context="anonimizador"
        toolButtons={[
          "reemplazar",
          "reemplazar-todo",
          "eliminar",
          "eliminar-todo",
        ]}
      />
      <Toolbar context="set-de-datos" />
      <Toolbar context="search-switch" />
    </div>
  ),
};
