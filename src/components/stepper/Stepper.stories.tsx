import type { Meta, StoryObj } from "@storybook/react";
import { Stepper } from "./Stepper";

const STEPS = [
  { label: "Previsualización" },
  { label: "Anonimización" },
  { label: "Revisión" },
  { label: "Descarga" },
];

const meta = {
  title: "Components/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  args: {
    steps: STEPS,
    current: 0,
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma: first step active (Focus), rest disabled */
export const Step1: Story = { args: { current: 0 } };

/** Figma: second step active */
export const Step2: Story = { args: { current: 1 } };

/** Figma: third step active */
export const Step3: Story = { args: { current: 2 } };

/** Figma: last step active */
export const Step4: Story = { args: { current: 3 } };

/** All completed (current past last) */
export const AllCompleted: Story = { args: { current: 4 } };

/** Matrix — all variants */
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {STEPS.map((_, i) => (
        <Stepper key={i} steps={STEPS} current={i} />
      ))}
    </div>
  ),
};
