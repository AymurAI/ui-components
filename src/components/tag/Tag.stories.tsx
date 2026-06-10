import type { Meta, StoryObj } from "@storybook/react";
import { Tag } from "./Tag";
import type { TagVariant } from "./Tag";

const meta = {
  title: "Components/Tag",
  component: Tag,
  parameters: {
    layout: "centered",
    figma: {
      url: "https://www.figma.com/design/2BahKpebYzaccFih0ZB79y?node-id=40000041:10589",
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "Persona",
        "CUIJ",
        "Num_Expediente",
        "Num_Actuacion",
        "Fecha",
      ] satisfies TagVariant[],
    },
    status: { control: "select", options: ["Default", "Hover"] },
    value: { control: "text" },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

// Figma: Persona (40000041:10495)
export const Persona: Story = {
  args: { variant: "Persona" },
};

// Figma: CUIJ (40000041:10498)
export const CUIJ: Story = {
  args: { variant: "CUIJ" },
};

// Figma: Num_Expediente (40000041:10501)
export const NumExpediente: Story = {
  args: { variant: "Num_Expediente" },
};

// Figma: Num_Actuacion (40000041:10504)
export const NumActuacion: Story = {
  args: { variant: "Num_Actuacion" },
};

// Figma: Fecha (40000041:10507)
export const Fecha: Story = {
  args: { variant: "Fecha" },
};

export const Hover: Story = {
  args: { variant: "Persona", status: "Hover" },
};

export const CustomValue: Story = {
  args: { variant: "Persona", value: "GARCÍA, JUAN" },
};

// Matrix — all variants
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <Tag variant="Persona" />
      <Tag variant="CUIJ" />
      <Tag variant="Num_Expediente" />
      <Tag variant="Num_Actuacion" />
      <Tag variant="Fecha" />
    </div>
  ),
};
