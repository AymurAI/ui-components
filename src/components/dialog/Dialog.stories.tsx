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

function sizeTrigger(label: string) {
  return (
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
        {label}
      </button>
    </DialogTrigger>
  );
}

/** Confirmations — e.g. "¿Eliminar esta etiqueta?" */
export const SizeSm: Story = {
  render: () => (
    <Dialog>
      {sizeTrigger("Open sm")}
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle className={css({ textStyle: "subtitle.md.strong" })}>
            ¿Eliminar esta etiqueta?
          </DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <button
              type="button"
              className={css({ cursor: "pointer", px: "4", py: "2" })}
            >
              Cancelar
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
            Eliminar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/** Forms — e.g. entity/label resolution */
export const SizeMd: Story = {
  render: () => (
    <Dialog>
      {sizeTrigger("Open md")}
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle className={css({ textStyle: "subtitle.md.strong" })}>
            Resolver entidad
          </DialogTitle>
        </DialogHeader>
        <DialogDescription
          className={css({
            textStyle: "paragraph.sm.default",
            color: "text.lighter",
          })}
        >
          Elegí la entidad correcta para el término seleccionado.
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <button
              type="button"
              className={css({ cursor: "pointer", px: "4", py: "2" })}
            >
              Cancelar
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
            Confirmar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/** Tutorials — the 2×2 "¿Cómo funciona?" step grid */
export const SizeLg: Story = {
  render: () => (
    <Dialog>
      {sizeTrigger("Open lg")}
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle className={css({ textStyle: "subtitle.md.strong" })}>
            ¿Cómo funciona?
          </DialogTitle>
          <DialogClose asChild>
            <button type="button" className={css({ cursor: "pointer" })}>
              ✕
            </button>
          </DialogClose>
        </DialogHeader>
        <div
          className={css({
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "6",
          })}
        >
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={css({
                display: "flex",
                flexDir: "column",
                gap: "2",
              })}
            >
              <div
                className={css({
                  bg: "bg.primary",
                  rounded: "sm",
                  h: "[130px]",
                })}
              />
              <span className={css({ textStyle: "label.md.default" })}>
                Paso {step}
              </span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  ),
};

/** Complex screens that need real vertical room */
export const SizeFull: Story = {
  render: () => (
    <Dialog>
      {sizeTrigger("Open full")}
      <DialogContent size="full">
        <DialogHeader>
          <DialogTitle className={css({ textStyle: "subtitle.md.strong" })}>
            Pantalla completa
          </DialogTitle>
          <DialogClose asChild>
            <button type="button" className={css({ cursor: "pointer" })}>
              ✕
            </button>
          </DialogClose>
        </DialogHeader>
        <p className={css({ textStyle: "paragraph.sm.default" })}>
          Ocupa el alto disponible (90vh) en vez de ajustarse al contenido —
          para flujos complejos con su propio scroll interno.
        </p>
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
