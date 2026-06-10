import { css } from "@/styled/css";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip";

const meta = {
  title: "Components/Tooltip",
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger>
        <span
          className={css({
            px: "4",
            py: "2",
            border: "primary",
            rounded: "sm",
            cursor: "default",
          })}
        >
          Hover me
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <span
          className={css({ px: "3", py: "2", textStyle: "label.sm.default" })}
        >
          This is a tooltip
        </span>
      </TooltipContent>
    </Tooltip>
  ),
};

export const WithoutArrow: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger>
        <span
          className={css({
            px: "4",
            py: "2",
            border: "primary",
            rounded: "sm",
            cursor: "default",
          })}
        >
          No arrow
        </span>
      </TooltipTrigger>
      <TooltipContent showArrow={false}>
        <span
          className={css({ px: "3", py: "2", textStyle: "label.sm.default" })}
        >
          Tooltip without arrow
        </span>
      </TooltipContent>
    </Tooltip>
  ),
};

export const BottomPlacement: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger>
        <span
          className={css({
            px: "4",
            py: "2",
            border: "primary",
            rounded: "sm",
            cursor: "default",
          })}
        >
          Bottom tooltip
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <span
          className={css({ px: "3", py: "2", textStyle: "label.sm.default" })}
        >
          Positioned at the bottom
        </span>
      </TooltipContent>
    </Tooltip>
  ),
};
