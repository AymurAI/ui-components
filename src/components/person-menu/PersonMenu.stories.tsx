import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { PersonMenu, type PersonMenuOption } from "./PersonMenu";

const ROLES: PersonMenuOption[] = [
  { id: "r1", initials: "DE", name: "Defensor/a", color: "green-light" },
  { id: "r2", initials: "FI", name: "Fiscal", color: "yellow" },
  { id: "r3", initials: "QU", name: "Querella", color: "pink" },
  { id: "r4", initials: "AC", name: "Acusado/a", color: "orange" },
];

const meta = {
  title: "Components/PersonMenu",
  component: PersonMenu,
  parameters: {
    layout: "centered",
    figma: {
      url: "https://www.figma.com/design/2BahKpebYzaccFih0ZB79y?node-id=40002701:44844",
    },
  },
  args: {
    options: ROLES,
    onSelectOption: () => {},
    footerLabel: "Nueva persona",
    onFooterAction: () => {},
  },
} satisfies Meta<typeof PersonMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Réplica del nodo 40002701:44844. */
export const Default: Story = {};

export const WithSelection: Story = { args: { selectedIndex: 1 } };

/** Todos los roles ya usados: sólo queda la acción al pie. */
export const Empty: Story = { args: { options: [] } };

/** La etiqueta más larga del set real, para verificar el ancho hug. */
export const LongNames: Story = {
  args: {
    options: [
      ...ROLES,
      {
        id: "r5",
        initials: "NA",
        name: "Niño/a - Adolescente",
        color: "violet",
      },
    ],
  },
};

/** Como lo usa el SpeakerPicker de desktop-app: input de nombre libre al pie. */
export const WithFooterSlot: Story = {
  render: (args) => {
    const [name, setName] = useState("");
    return (
      <PersonMenu
        {...args}
        footerSlot={
          <input
            aria-label="Nombre de la persona"
            placeholder="Nombre de la persona"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        }
      />
    );
  },
};
