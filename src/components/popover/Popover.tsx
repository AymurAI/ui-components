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

const baseStyles = css({
  zIndex: 50,

  "&[data-state='open']": {
    animation: "fadeIn",
  },
  "&[data-state='closed']": {
    animation: "fadeOut",
  },
});

// The default look: a light surface, rounded corners, and the standard
// popover shadow. `surface={false}` skips this for consumers that render
// their own fully-styled surface (a custom menu grid, a colored toolbar)
// and only want this shell for positioning/animation/focus-trap behavior.
const surfaceStyles = css({
  bg: "bg.primary",
  rounded: "lg",
  boxShadow: "popover",
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
  /**
   * Set to `false` when the content renders its own fully-styled surface
   * (background, radius, shadow) and this shell should stay inert apart
   * from positioning/animation — e.g. FeaturesMenu's grid or an
   * already-colored toolbar. Defaults to `true` (the standard light-surface
   * look). Pair with `showArrow={false}` when disabling the surface, since
   * the default arrow is colored to match it.
   */
  surface?: boolean;
}

export function PopoverContent({
  className,
  sideOffset = 8,
  showArrow = false,
  container,
  children,
  surface = true,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Content
        sideOffset={sideOffset}
        className={cx(baseStyles, surface && surfaceStyles, className)}
        {...props}
      >
        {children}
        {showArrow && <PopoverPrimitive.Arrow className={arrowStyles} />}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}

export default Popover;
