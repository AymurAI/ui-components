import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button/Button";
import { Player } from "./Player";

const meta = {
  title: "Components/Player",
  component: Player,
  parameters: {
    layout: "fullscreen",
    figma: {
      url: "https://www.figma.com/design/2BahKpebYzaccFih0ZB79y?node-id=40001482:38874",
    },
  },
} satisfies Meta<typeof Player>;

export default meta;
type Story = StoryObj<typeof meta>;

// 8:12 total, matching the Figma reference.
const DURATION = 8 * 60 * 1000 + 12 * 1000;

export const Default: Story = {
  args: { src: "", durationMs: DURATION },
  render: (args) => (
    <div style={{ width: "100%", maxWidth: 1080 }}>
      <Player {...args} />
    </div>
  ),
};

export const WithFinishButton: Story = {
  args: { src: "", durationMs: DURATION },
  render: (args) => (
    <div style={{ width: "100%", maxWidth: 1080 }}>
      <Player {...args} rightSlot={<Button>Finalizar</Button>} />
    </div>
  ),
};
