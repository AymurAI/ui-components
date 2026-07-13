import type { Meta, StoryObj } from "@storybook/react";
import { css } from "@/styled/css";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./Dialog";

const meta = {
  title: "Components/Dialog",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={css({
            px: "4",
            py: "2",
            bg: "action.default",
            rounded: "sm",
            cursor: "pointer",
            textStyle: "cta.md.strong",
          })}
        >
          Open Dialog
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={css({ textStyle: "subtitle.md.strong" })}>
            Dialog Title
          </DialogTitle>
          <DialogClose asChild>
            <button type="button" className={css({ cursor: "pointer" })}>
              ✕
            </button>
          </DialogClose>
        </DialogHeader>
        <DialogDescription
          className={css({
            textStyle: "paragraph.sm.default",
            color: "text.lighter",
          })}
        >
          This is the dialog description. It provides context for the dialog
          content.
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
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
              Cancel
            </button>
          </DialogClose>
          <button
            type="button"
            className={css({
              px: "4",
              py: "2",
              bg: "action.default",
              rounded: "sm",
              cursor: "pointer",
              textStyle: "cta.md.strong",
            })}
          >
            Confirm
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithLongContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={css({
            px: "4",
            py: "2",
            bg: "action.default",
            rounded: "sm",
            cursor: "pointer",
          })}
        >
          Open Long Dialog
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={css({ textStyle: "subtitle.md.strong" })}>
            Confirmation Required
          </DialogTitle>
        </DialogHeader>
        <p className={css({ textStyle: "paragraph.sm.default" })}>
          This action cannot be undone. Please confirm that you want to proceed.
          All associated data will be permanently removed from our servers.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <button
              type="button"
              className={css({ cursor: "pointer", px: "4", py: "2" })}
            >
              Cancel
            </button>
          </DialogClose>
          <button
            type="button"
            className={css({
              px: "4",
              py: "2",
              bg: "system.error",
              color: "text.onbutton-alternative",
              rounded: "sm",
              cursor: "pointer",
            })}
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
