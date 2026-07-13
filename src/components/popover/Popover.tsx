import * as PopoverPrimitive from "@radix-ui/react-popover";
import type { ComponentPropsWithoutRef } from "react";
import { css, cx } from "@/styled/css";

/**
 * Popover — Radix UI popover with AymurAI styling.
 * Ported from desktop-app/src/renderer/src/components/ui/popover.tsx
 */
export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;

const contentStyles = css({
  zIndex: 50,
  bg: "bg.primary",
  rounded: "lg",
  boxShadow: "popover",

  "&[data-state='open']": {
    animation: "fadeIn",
  },
  "&[data-state='closed']": {
    animation: "fadeOut",
  },
});

const arrowStyles = css({
  // Match the popover surface so the caret reads as one shape (was bg.secondary
  // = #FFFFFF against a bg.primary #F6F5F7 body → visible seam).
  fill: "bg.primary",
});

export interface PopoverContentProps
  extends ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  showArrow?: boolean;
  container?: HTMLElement;
}

export function PopoverContent({
  className,
  sideOffset = 8,
  showArrow = false,
  container,
  children,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Content
        sideOffset={sideOffset}
        className={cx(contentStyles, className)}
        {...props}
      >
        {children}
        {showArrow && <PopoverPrimitive.Arrow className={arrowStyles} />}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}

export default Popover;
