import type { Meta, StoryObj } from "@storybook/react";
import { ToolButton } from "./ToolButton";

const meta = {
  title: "Components/ToolButton",
  component: ToolButton,
  tags: ["autodocs"],
  args: { action: "reemplazar" },
} satisfies Meta<typeof ToolButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Reemplazar: Story = { args: { action: "reemplazar" } };
export const ReemplazarTodo: Story = { args: { action: "reemplazar-todo" } };
export const Eliminar: Story = { args: { action: "eliminar" } };
export const EliminarTodo: Story = { args: { action: "eliminar-todo" } };
export const AgregarEtiqueta: Story = { args: { action: "agregar-etiqueta" } };
export const AgregarTodas: Story = { args: { action: "agregar-todas" } };
export const Disabled: Story = {
  args: { action: "reemplazar", disabled: true },
};

/** Matrix — all actions × states */
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {(
          [
            "reemplazar",
            "reemplazar-todo",
            "eliminar",
            "eliminar-todo",
            "agregar-etiqueta",
            "agregar-todas",
          ] as const
        ).map((action) => (
          <ToolButton key={action} action={action} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {(
          [
            "reemplazar",
            "reemplazar-todo",
            "eliminar",
            "eliminar-todo",
          ] as const
        ).map((action) => (
          <ToolButton key={action} action={action} disabled />
        ))}
      </div>
    </div>
  ),
};
