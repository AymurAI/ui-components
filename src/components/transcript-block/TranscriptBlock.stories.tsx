import type { Meta, StoryObj } from "@storybook/react";
import { TranscriptBlock } from "./TranscriptBlock";

const SAMPLE =
  "Estamos aquí reunidos en relación a un caso que tiene el número 78274, que es un caso que usted conoce, que la fiscalía está trabajando la investigación de ese caso, para lo cual estaba en principio prevista la discusión de los hechos como corresponde en un juicio oral y público.";

const meta = {
  title: "Components/TranscriptBlock",
  component: TranscriptBlock,
  parameters: {
    layout: "padded",
    figma: {
      url: "https://www.figma.com/design/2BahKpebYzaccFih0ZB79y?node-id=40002318:32859",
    },
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "selected", "hover", "typed"],
    },
    color: {
      control: "inline-radio",
      options: ["primary", "secondary", "warning", "success"],
    },
  },
  args: {
    initials: "AB",
    name: "Persona1",
    time: "01:15",
    text: SAMPLE,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 875 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TranscriptBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { variant: "default" } };
export const Selected: Story = { args: { variant: "selected" } };
export const SelectHover: Story = { args: { variant: "hover" } };
export const Typed: Story = { args: { variant: "typed" } };

export const Conversation: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <TranscriptBlock
        initials="AB"
        name="Jueza"
        time="00:42"
        text={SAMPLE}
        color="warning"
      />
      <TranscriptBlock
        initials="FD"
        name="Defensor"
        time="01:15"
        text={SAMPLE}
        color="success"
        variant="selected"
      />
    </div>
  ),
};
