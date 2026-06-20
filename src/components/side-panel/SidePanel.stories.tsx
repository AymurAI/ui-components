import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SidePanel } from "./SidePanel";

const meta = {
  title: "Components/SidePanel",
  component: SidePanel,
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
  { initials: "DE", name: "Defensor", color: "green-light" as const },
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
