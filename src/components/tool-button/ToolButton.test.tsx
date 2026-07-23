import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ToolButton } from "./ToolButton";

describe("ToolButton", () => {
  it("uses the action's default label as aria-label and title when none is passed", () => {
    render(<ToolButton action="agregar-etiqueta" />);
    const button = screen.getByRole("button", { name: "Agregar etiqueta" });
    expect(button).toHaveAttribute("title", "Agregar etiqueta");
  });

  it("lets a consumer override aria-label and title", () => {
    render(
      <ToolButton
        action="agregar-etiqueta"
        aria-label="Afectar una ocurrencia"
        title="Afectar una ocurrencia"
      />,
    );
    expect(
      screen.getByRole("button", { name: "Afectar una ocurrencia" }),
    ).toHaveAttribute("title", "Afectar una ocurrencia");
    expect(
      screen.queryByRole("button", { name: "Agregar etiqueta" }),
    ).not.toBeInTheDocument();
  });

  it("still forwards onClick and disabled when aria-label is overridden", () => {
    const onClick = vi.fn();
    render(
      <ToolButton
        action="eliminar"
        aria-label="Eliminar esta ocurrencia"
        onClick={onClick}
        disabled
      />,
    );
    const button = screen.getByRole("button", {
      name: "Eliminar esta ocurrencia",
    });
    expect(button).toBeDisabled();
  });
});
