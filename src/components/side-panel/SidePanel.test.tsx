import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { TooltipProvider } from "../tooltip";
import { SidePanel, type SidePanelPerson } from "./SidePanel";

// Radix measures its floating surfaces with ResizeObserver, which jsdom lacks.
beforeAll(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
  Element.prototype.scrollIntoView = () => {};
});

const PEOPLE: SidePanelPerson[] = [
  { id: "s1", initials: "P1", name: "Persona 1", renamable: true },
  { id: "s2", initials: "P2", name: "Persona 2", renamable: true },
];

function renderPanel(
  props: Partial<React.ComponentProps<typeof SidePanel>> = {},
) {
  return render(
    <TooltipProvider>
      <SidePanel
        turn={{ initials: "P1", name: "Persona 1", time: "01:15" }}
        people={PEOPLE}
        timestamp="01:15"
        {...props}
      />
    </TooltipProvider>,
  );
}

describe("SidePanel people section", () => {
  it("titles the section 'Personas identificadas'", () => {
    renderPanel();
    expect(screen.getByText("Personas identificadas")).toBeInTheDocument();
  });

  it("does not title it 'Personas sugeridas' anymore", () => {
    renderPanel();
    expect(screen.queryByText("Personas sugeridas")).not.toBeInTheDocument();
  });
});

const ROLES: SidePanelPerson[] = [
  { id: "r1", initials: "JU", name: "Juez/a" },
  { id: "r2", initials: "FI", name: "Fiscal" },
];

describe("SidePanel new-person menu", () => {
  it("calls onNewPerson directly when there are no options", async () => {
    const onNewPerson = vi.fn();
    renderPanel({ onNewPerson });
    await userEvent.click(screen.getByRole("button", { name: /Nuevo/ }));
    expect(onNewPerson).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole("button", { name: "Fiscal" }),
    ).not.toBeInTheDocument();
  });

  it("opens a menu with the roles when options are provided", async () => {
    renderPanel({ newPersonOptions: ROLES, onSelectNewPersonOption: vi.fn() });
    expect(
      screen.queryByRole("button", { name: "Fiscal" }),
    ).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Nuevo/ }));
    expect(screen.getByRole("button", { name: "Juez/a" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fiscal" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Nueva persona" }),
    ).toBeInTheDocument();
  });

  it("reports the chosen role index and closes the menu", async () => {
    const onSelectNewPersonOption = vi.fn();
    renderPanel({ newPersonOptions: ROLES, onSelectNewPersonOption });
    await userEvent.click(screen.getByRole("button", { name: /Nuevo/ }));
    await userEvent.click(screen.getByRole("button", { name: "Fiscal" }));
    expect(onSelectNewPersonOption).toHaveBeenCalledWith(1);
    expect(
      screen.queryByRole("button", { name: "Fiscal" }),
    ).not.toBeInTheDocument();
  });

  it("routes the footer action to onNewPerson and closes the menu", async () => {
    const onNewPerson = vi.fn();
    renderPanel({
      newPersonOptions: ROLES,
      onSelectNewPersonOption: vi.fn(),
      onNewPerson,
    });
    await userEvent.click(screen.getByRole("button", { name: /Nuevo/ }));
    await userEvent.click(
      screen.getByRole("button", { name: "Nueva persona" }),
    );
    expect(onNewPerson).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole("button", { name: "Nueva persona" }),
    ).not.toBeInTheDocument();
  });
});
