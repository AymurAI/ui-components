import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ComponentPropsWithoutRef, HTMLAttributes } from "react";
import { css, cva, cx } from "@/styled/css";

/**
 * Dialog — Radix UI dialog with AymurAI styling.
 * Ported from desktop-app/src/renderer/src/components/ui/dialog.tsx
 *
 * No Figma component backs `DialogContent`'s `size` variants — this design
 * system file has no Dialog/Modal family at all. Breakpoints are lifted
 * from desktop-app's real per-usage overrides instead (confirmations ~420px,
 * forms ~520px, the "¿Cómo funciona?" tutorial ~900–1024px via a
 * `minWidth:900px` + `maxW:5xl!` hack). Every size stays viewport-bound
 * (`min(px, vw)`) instead of the old hard `minWidth`, which is what let the
 * tutorial dialog overflow narrow windows.
 */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

const overlayStyles = css({
  position: "fixed",
  inset: "[0]",
  zIndex: 50,
  bg: "overlay",

  "&[data-state='open']": {
    animation: "fadeIn",
  },
  "&[data-state='closed']": {
    animation: "fadeOut",
  },
});

export type DialogContentSize = "sm" | "md" | "lg" | "full";

const contentStyles = cva({
  base: {
    position: "fixed",
    inset: "[0]",
    margin: "auto",
    zIndex: 50,

    bg: "bg.secondary",
    rounded: "sm",
    p: "6",
    boxShadow: "dialog",

    minW: "[300px]",
    maxH: "[90vh]",
    overflowY: "auto",

    "&[data-state='open']": {
      animation: "fadeIn",
    },
    "&[data-state='closed']": {
      animation: "fadeOut",
    },
  },
  variants: {
    size: {
      // Confirmations — e.g. "¿Eliminar esta etiqueta?"
      sm: {
        width: "[min(420px,90vw)]",
        maxW: "[420px]",
        h: "[fit-content]",
      },
      // Forms — e.g. entity/label resolution
      md: {
        width: "[min(520px,92vw)]",
        maxW: "[520px]",
        h: "[fit-content]",
      },
      // Tutorials — e.g. the 2×2 "¿Cómo funciona?" step grid
      lg: {
        width: "[min(1024px,92vw)]",
        maxW: "[1024px]",
        h: "[fit-content]",
      },
      // Complex screens that need real vertical room, not just fit-content
      full: {
        width: "[min(1440px,96vw)]",
        maxW: "[1440px]",
        h: "[90vh]",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const headerStyles = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: "4",
});

const footerStyles = css({
  display: "flex",
  gap: "2",
  justifyContent: "flex-end",
  alignItems: "center",
  mt: "8",
});

export interface DialogOverlayProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {}

export function DialogOverlay({ className, ...props }: DialogOverlayProps) {
  return (
    <DialogPrimitive.Overlay
      className={cx(overlayStyles, className)}
      {...props}
    />
  );
}

export interface DialogContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  container?: HTMLElement;
  /** Confirmations (sm) · forms (md, default) · tutorials (lg) · complex screens (full) */
  size?: DialogContentSize;
}

export function DialogContent({
  className,
  container,
  children,
  size = "md",
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal container={container}>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cx(contentStyles({ size }), className)}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(headerStyles, className)} {...props} />;
}

export function DialogFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(footerStyles, className)} {...props} />;
}

export default Dialog;
