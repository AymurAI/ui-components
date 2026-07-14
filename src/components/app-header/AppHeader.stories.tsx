import type { Meta, StoryObj } from "@storybook/react";
import { AppHeader } from "./AppHeader";

const STEPS = [
  "Previsualización",
  "Transcripción",
  "Validación",
  "Finalización",
];

const meta = {
  title: "Components/AppHeader",
  component: AppHeader,
  parameters: {
    layout: "fullscreen",
    figma: {
      url: "https://www.figma.com/design/2BahKpebYzaccFih0ZB79y?node-id=173:16655",
    },
  },
  args: {
    steps: STEPS,
    current: 0,
  },
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma library symbol: bare iso mark, only the active step shows a label. */
export const Default: Story = {};

/** Real Voz a Texto screens (e.g. Editor) show the full logo + feature name. */
export const WithFeatureName: Story = {
  args: { featureName: "Voz a Texto" },
};

export const FirstStep: Story = {
  args: { featureName: "Voz a Texto", current: 0 },
};

export const LastStep: Story = {
  args: { featureName: "Voz a Texto", current: 3 },
};
