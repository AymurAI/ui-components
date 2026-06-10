import { css, cx } from "@/styled/css";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { ComponentPropsWithoutRef } from "react";

/**
 * Tooltip — Radix UI tooltip with AymurAI styling.
 * Ported from desktop-app/src/renderer/src/components/ui/tooltip.tsx
 *
 * Figma: Tooltip family node 187:18217.
 */
export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

const contentStyles = css({
  zIndex: 50,
  bg: "bg.primary",
  rounded: "md",
  boxShadow: "[0px 0px 15px 0px #00000026]",

  "&[data-state='delayed-open']": {
    animation: "fadeIn",
  },
  "&[data-state='closed']": {
    animation: "fadeOut",
  },
});

const arrowStyles = css({
  fill: "bg.primary",
});

export interface TooltipContentProps
  extends ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  showArrow?: boolean;
}

export function TooltipContent({
  className,
  sideOffset = 6,
  showArrow = true,
  children,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cx(contentStyles, className)}
        {...props}
      >
        {children}
        {showArrow && <TooltipPrimitive.Arrow className={arrowStyles} />}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export default Tooltip;
