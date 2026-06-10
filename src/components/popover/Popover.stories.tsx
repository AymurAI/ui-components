import { css } from "@/styled/css";
import type { Meta, StoryObj } from "@storybook/react";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

const meta = {
  title: "Components/Popover",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={css({
            px: "4",
            py: "2",
            border: "primary",
            rounded: "sm",
            cursor: "pointer",
          })}
        >
          Open Popover
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <div
          className={css({
            p: "4",
            textStyle: "paragraph.sm.default",
            minWidth: "[200px]",
          })}
        >
          Popover content goes here.
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithArrow: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={css({
            px: "4",
            py: "2",
            border: "primary",
            rounded: "sm",
            cursor: "pointer",
          })}
        >
          With Arrow
        </button>
      </PopoverTrigger>
      <PopoverContent showArrow>
        <div
          className={css({
            p: "4",
            textStyle: "paragraph.sm.default",
            minWidth: "[200px]",
          })}
        >
          Popover content with arrow.
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const BottomPlacement: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={css({
            px: "4",
            py: "2",
            border: "primary",
            rounded: "sm",
            cursor: "pointer",
          })}
        >
          Bottom
        </button>
      </PopoverTrigger>
      <PopoverContent side="bottom" showArrow>
        <div className={css({ p: "4", textStyle: "paragraph.sm.default" })}>
          Positioned at bottom.
        </div>
      </PopoverContent>
    </Popover>
  ),
};
