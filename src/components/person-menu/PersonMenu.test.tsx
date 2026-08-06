import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PersonMenu, type PersonMenuOption } from "./PersonMenu";

const OPTIONS: PersonMenuOption[] = [
  { id: "r1", initials: "DE", name: "Defensor/a", color: "green-light" },
  { id: "r2", initials: "FI", name: "Fiscal", color: "yellow" },
  { id: "r3", initials: "JU", name: "Juez/a", color: "violet" },
];

describe("PersonMenu", () => {
  it("renders one button per option, named after the person", () => {
    render(<PersonMenu options={OPTIONS} onSelectOption={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: "Defensor/a" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fiscal" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Juez/a" })).toBeInTheDocument();
  });

  it("reports the index of the clicked option", () => {
    const onSelectOption = vi.fn();
    render(<PersonMenu options={OPTIONS} onSelectOption={onSelectOption} />);
    screen.getByRole("button", { name: "Fiscal" }).click();
    expect(onSelectOption).toHaveBeenCalledWith(1);
  });

  it("marks the selected option with aria-current", () => {
    render(
      <PersonMenu
        options={OPTIONS}
        onSelectOption={vi.fn()}
        selectedIndex={2}
      />,
    );
    expect(screen.getByRole("button", { name: "Juez/a" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("button", { name: "Fiscal" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("renders the footer action and reports clicks on it", () => {
    const onFooterAction = vi.fn();
    render(
      <PersonMenu
        options={OPTIONS}
        onSelectOption={vi.fn()}
        footerLabel="Nueva persona"
        onFooterAction={onFooterAction}
      />,
    );
    screen.getByRole("button", { name: "Nueva persona" }).click();
    expect(onFooterAction).toHaveBeenCalledTimes(1);
  });

  it("lets footerSlot replace the footer button", () => {
    render(
      <PersonMenu
        options={OPTIONS}
        onSelectOption={vi.fn()}
        footerLabel="Nueva persona"
        onFooterAction={vi.fn()}
        footerSlot={<input aria-label="Nombre de la persona" />}
      />,
    );
    expect(screen.getByLabelText("Nombre de la persona")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Nueva persona" }),
    ).not.toBeInTheDocument();
  });

  it("renders only the footer when there are no options left", () => {
    render(
      <PersonMenu
        options={[]}
        onSelectOption={vi.fn()}
        footerLabel="Nueva persona"
        onFooterAction={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Nueva persona" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("renders nothing when there is neither an option nor a footer", () => {
    const { container } = render(
      <PersonMenu options={[]} onSelectOption={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("labels the group so assistive tech can announce it", () => {
    render(
      <PersonMenu
        options={OPTIONS}
        onSelectOption={vi.fn()}
        aria-label="Elegir persona o rol"
      />,
    );
    expect(
      screen.getByRole("group", { name: "Elegir persona o rol" }),
    ).toBeInTheDocument();
  });
});
