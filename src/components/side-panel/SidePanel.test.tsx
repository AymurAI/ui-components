import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { TooltipProvider } from "../tooltip";
import { SidePanel, type SidePanelPerson } from "./SidePanel";

// Radix mide sus superficies flotantes con ResizeObserver, que jsdom no trae.
beforeAll(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
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
