import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TooltipProvider } from "../tooltip";
import { SidePanel } from "./SidePanel";

const meta = {
  title: "Components/SidePanel",
  component: SidePanel,
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  parameters: {
    layout: "centered",
    figma: {
      url: "https://www.figma.com/design/2BahKpebYzaccFih0ZB79y?node-id=40002322:53113",
    },
  },
} satisfies Meta<typeof SidePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const PEOPLE = [
  { initials: "AB", name: "Persona 1", color: "violet" as const },
  { initials: "AB", name: "Persona 2", color: "green" as const },
  { initials: "JU", name: "Jueza", color: "red" as const },
  { initials: "FI", name: "Fiscal", color: "yellow" as const },
  { initials: "DE", name: "Defensor", color: "pink" as const },
  { initials: "AB", name: "Imputado", color: "orange" as const },
  { initials: "DE", name: "Defensor 2", color: "green-light" as const },
];

const RENAMEABLE_PEOPLE = [
  {
    id: "person-1",
    initials: "AB",
    name: "Persona 1",
    color: "violet" as const,
    renamable: true,
  },
  {
    id: "fiscal",
    initials: "FI",
    name: "Fiscal",
    color: "yellow" as const,
    renamable: true,
  },
  {
    id: "defender",
    initials: "DE",
    name: "Defensor",
    color: "pink" as const,
    renamable: true,
  },
];

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState(0);
    const [time, setTime] = useState("01:15");
    return (
      <div style={{ width: 479 }}>
        <SidePanel
          turn={{
            initials: "AB",
            name: "Persona1",
            time: "01:15",
            color: "violet",
          }}
          people={PEOPLE}
          selectedIndex={selected}
          onSelectPerson={setSelected}
          timestamp={time}
          onTimestampChange={setTime}
        />
      </div>
    );
  },
};

/**
 * Merging into a turn from a different speaker shows a confirm popover —
 * click "Unir con el anterior/siguiente" to see it (Figma "Conflicto Nombre
 * etiqueta", node 40002384:38487).
 */
export const MergeConfirmation: Story = {
  render: () => {
    const [selected, setSelected] = useState(0);
    return (
      <div style={{ width: 479 }}>
        <SidePanel
          turn={{
            initials: "AB",
            name: "Persona1",
            time: "01:15",
            color: "violet",
          }}
          people={PEOPLE}
          selectedIndex={selected}
          onSelectPerson={setSelected}
          timestamp="01:15"
          previousTurnName="Fiscal"
          nextTurnName="Defensor"
          onMergePrevious={() => window.alert("Unido con Fiscal")}
          onMergeNext={() => window.alert("Unido con Defensor")}
        />
      </div>
    );
  },
};

/** "Marca de tiempo" accepts MM:SS or H+:MM:SS. */
export const InvalidTimestamp: Story = {
  render: () => {
    const [time, setTime] = useState("1:5");
    return (
      <div style={{ width: 479 }}>
        <SidePanel
          turn={{
            initials: "AB",
            name: "Persona1",
            time: "01:15",
            color: "violet",
          }}
          people={PEOPLE}
          timestamp={time}
          onTimestampChange={setTime}
        />
      </div>
    );
  },
};

/**
 * Hover a pill and use its pencil to edit. Enter commits a unique name; using
 * "Fiscal" or "Defensor" shows the identity-merge confirmation.
 */
export const RenameAndCollision: Story = {
  render: () => {
    const [people, setPeople] = useState(RENAMEABLE_PEOPLE);
    const [selected, setSelected] = useState(0);
    const [lastAction, setLastAction] = useState("Sin cambios");

    return (
      <div style={{ width: 479 }}>
        <SidePanel
          turn={{
            initials: "AB",
            name: "Persona 1",
            time: "01:15",
            color: "violet",
          }}
          people={people}
          selectedIndex={selected}
          onSelectPerson={setSelected}
          onRenamePerson={(index, nextName) => {
            setPeople((current) =>
              current.map((person, currentIndex) =>
                currentIndex === index ? { ...person, name: nextName } : person,
              ),
            );
            setLastAction(`Renombrada como ${nextName}`);
          }}
          onMergePeople={(sourceIndex, targetIndex) => {
            const source = people[sourceIndex];
            const target = people[targetIndex];
            setPeople((current) =>
              current.filter((_, index) => index !== sourceIndex),
            );
            setSelected(0);
            setLastAction(
              `${source?.name ?? "Origen"} combinada con ${target?.name ?? "destino"}`,
            );
          }}
          timestamp="01:15"
        />
        <p style={{ padding: 16 }}>{lastAction}</p>
      </div>
    );
  },
};
