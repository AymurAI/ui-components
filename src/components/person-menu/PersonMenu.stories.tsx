import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { PersonMenu, type PersonMenuOption } from "./PersonMenu";

const ROLES: PersonMenuOption[] = [
  { id: "r1", initials: "JU", name: "Juez/a", color: "violet" },
  { id: "r2", initials: "FI", name: "Fiscal", color: "yellow" },
  { id: "r3", initials: "DE", name: "Defensor/a", color: "green-light" },
  { id: "r4", initials: "DN", name: "Denunciante", color: "blue" },
  { id: "r5", initials: "AC", name: "Acusado/a", color: "orange" },
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

/** Replica of node 40002701:44844. */
export const Default: Story = {};

export const WithSelection: Story = { args: { selectedIndex: 1 } };

/** All roles already used: only the footer action remains. */
export const Empty: Story = { args: { options: [] } };

/** The longest label in the real set, to check the hug width doesn't break. */
export const LongNames: Story = {
  args: {
    options: [
      ...ROLES,
      {
        id: "r6",
        initials: "NA",
        name: "Niño/a - Adolescente",
        color: "red",
      },
    ],
  },
};

/** As desktop-app's SpeakerPicker uses it: a free-text name input in the footer. */
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
