import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import type { ComponentPropsWithoutRef } from "react";
import { css, cx } from "@/styled/css";

/**
 * ContextMenu — Radix UI context menu with AymurAI styling.
 *
 * Right-click menu, not a Popover: Radix's context-menu primitive owns
 * cursor-position anchoring, keyboard nav, and dismiss-on-outside-click for
 * this exact "menu at the click point" shape, which Popover isn't built for.
 *
 * `ContextMenuTrigger`'s own `disabled` prop is the mechanism for "only show
 * our menu sometimes" (e.g. only while the caret is inside a table) — when
 * disabled, the native browser context menu shows through instead.
 */
export const ContextMenu = ContextMenuPrimitive.Root;
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

const contentStyles = css({
  zIndex: 50,
  minW: "[200px]",
  bg: "bg.secondary",
  border: "primary",
  rounded: "sm",
  boxShadow: "popover",
  py: "2",

  "&[data-state='open']": {
    animation: "fadeIn",
  },
  "&[data-state='closed']": {
    animation: "fadeOut",
  },
});

export function ContextMenuContent({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        className={cx(contentStyles, className)}
        {...props}
      >
        {children}
      </ContextMenuPrimitive.Content>
    </ContextMenuPrimitive.Portal>
  );
}

const itemStyles = css({
  display: "flex",
  alignItems: "center",
  gap: "2",
  px: "4",
  py: "2",
  textStyle: "label.md.default",
  color: "text.default",
  cursor: "pointer",
  outline: "none",
  userSelect: "none",

  "&[data-highlighted]": {
    bg: "bg.primary-alternative",
  },
  "&[data-disabled]": {
    cursor: "not-allowed",
    color: "text.lighter",
  },
});

export function ContextMenuItem({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item>) {
  return (
    <ContextMenuPrimitive.Item
      className={cx(itemStyles, className)}
      {...props}
    />
  );
}

const separatorStyles = css({
  h: "[1px]",
  my: "1",
  bg: "[#BCBAB8]",
});

export function ContextMenuSeparator({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      className={cx(separatorStyles, className)}
      {...props}
    />
  );
}

export default ContextMenu;
