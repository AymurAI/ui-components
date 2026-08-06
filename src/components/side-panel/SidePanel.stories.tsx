import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TooltipProvider } from "../tooltip";
import { SidePanel, type SidePanelPerson } from "./SidePanel";

const ROLE_OPTIONS: SidePanelPerson[] = [
  { id: "r1", initials: "JU", name: "Juez/a", color: "violet" },
  { id: "r2", initials: "FI", name: "Fiscal", color: "green-light" },
  { id: "r3", initials: "DE", name: "Defensor/a", color: "pink" },
  { id: "r4", initials: "QU", name: "Querella", color: "yellow" },
];

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
  { initials: "AB", name: "Persona 3", color: "orange" as const },
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
        newPersonOptions={ROLE_OPTIONS}
        onSelectNewPersonOption={() => {}}
      />
    );
  },
};

/** Intrinsic widths — Voz a Texto wrapper (sm) · entities panel (md) · Figma reference (lg, default) */
export const Sizes: Story = {
  render: () => {
    const [selected, setSelected] = useState(0);
    return (
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {(["sm", "md", "lg"] as const).map((size) => (
          <SidePanel
            key={size}
            size={size}
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
            newPersonOptions={ROLE_OPTIONS}
            onSelectNewPersonOption={() => {}}
          />
        ))}
      </div>
    );
  },
};

/**
 * `maxW:"full"` only shrinks the panel below its intrinsic size when a
 * bounding ancestor actually constrains the available width — here a fixed
 * 280px column, narrower than even `size="sm"` (360px).
 */
export const NarrowContainer: Story = {
  render: () => (
    <div style={{ width: 280, border: "1px dashed #9F99A5" }}>
      <SidePanel
        size="sm"
        turn={{
          initials: "AB",
          name: "Persona1",
          time: "01:15",
          color: "violet",
        }}
        people={PEOPLE}
        timestamp="01:15"
        newPersonOptions={ROLE_OPTIONS}
        onSelectNewPersonOption={() => {}}
      />
    </div>
  ),
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
        previousTurnName="Persona 2"
        nextTurnName="Persona 3"
        onMergePrevious={() => window.alert("Unido con Persona 2")}
        onMergeNext={() => window.alert("Unido con Persona 3")}
        newPersonOptions={ROLE_OPTIONS}
        onSelectNewPersonOption={() => {}}
      />
    );
  },
};

/** "Marca de tiempo" accepts MM:SS or H+:MM:SS. */
export const InvalidTimestamp: Story = {
  render: () => {
    const [time, setTime] = useState("1:5");
    return (
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
        newPersonOptions={ROLE_OPTIONS}
        onSelectNewPersonOption={() => {}}
      />
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
      <div>
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

/** Réplica del nodo 40002701:44829, con el desplegable de "Nuevo" disponible. */
export const WithNewPersonMenu: Story = {
  args: {
    people: [
      { id: "s1", initials: "P1", name: "Persona 1", renamable: true },
      { id: "s2", initials: "P2", name: "Persona 2", renamable: true },
      { id: "s3", initials: "P3", name: "Persona 3", renamable: true },
    ],
    selectedIndex: 0,
    timestamp: "01:15",
    turn: { initials: "P1", name: "Persona 1", time: "01:15", color: "violet" },
    newPersonOptions: ROLE_OPTIONS,
    onSelectNewPersonOption: () => {},
  },
};

/** Sin `newPersonOptions`: "Nuevo" llama a onNewPerson directo (retrocompatible). */
export const WithoutNewPersonMenu: Story = {
  args: {
    people: [{ id: "s1", initials: "P1", name: "Persona 1", renamable: true }],
    timestamp: "01:15",
    turn: { initials: "P1", name: "Persona 1", time: "01:15", color: "violet" },
    newPersonOptions: undefined,
  },
};
