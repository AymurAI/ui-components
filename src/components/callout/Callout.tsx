import type { Icon } from "phosphor-react";
import { Bell, X } from "phosphor-react";
import type { HTMLAttributes } from "react";
import { cva, cx } from "@/styled/css";
import { styled } from "@/styled/jsx";
import { hstack } from "@/styled/patterns";

/**
 * Callout — inline notification banner.
 * Ported from desktop-app/src/renderer/src/components/ui/callout.tsx
 *
 * Figma: Toast family node 1994:30384 — Error / Warning / Success / Info.
 * `size="compact"` has no dedicated Figma frame; it formalizes the
 * hand-rolled "Transcribiendo audio…" notice from desktop-app's Voz a Texto
 * flow (16px padding, 8px gap and 24px icon already match `size="normal"` —
 * only the radius and text style shrink).
 */

/**
 * Container recipe — background + border only.
 * Message text color is always text.default (set in base); accent color is
 * applied separately to the icon and dismiss button via accentRecipe.
 */
const calloutRecipe = cva({
  base: {
    ...hstack.raw({
      alignItems: "center",
      gap: "2", // Figma: 8px
    }),

    px: "4",
    py: "4", // Figma: 16px uniform padding

    rounded: "sm",
    borderWidth: "[1px]",
    borderStyle: "solid",

    width: "full",

    // Message text is always text.default (#110041) across all variants.
    color: "text.default",
    textStyle: "label.md.default", // Figma: Archivo 16/120%
  },
  variants: {
    variant: {
      error: {
        bg: "system.error-secondary",
        borderColor: "system.error",
      },
      warning: {
        bg: "system.warning-secondary",
        borderColor: "system.warning",
      },
      success: {
        bg: "system.success-secondary",
        borderColor: "system.success",
      },
      info: {
        bg: "system.info-secondary",
        borderColor: "system.info",
      },
    },
    noBorder: {
      true: {
        borderWidth: "0",
      },
    },
    size: {
      normal: {},
      compact: {
        rounded: "xs", // Figma-scale radius token: 2px
        textStyle: "subtitle.sm.strong", // 14px/600
      },
    },
  },
  defaultVariants: {
    variant: "info",
    noBorder: false,
    size: "normal",
  },
});

/**
 * Accent recipe — maps variant to its accent color.
 * Applied only to the icon element and the dismiss (X) button so the accent
 * colour is scoped to those chrome elements, not the message text.
 */
const accentRecipe = cva({
  base: {},
  variants: {
    variant: {
      error: { color: "system.error" },
      warning: { color: "system.warning" },
      success: { color: "system.success" },
      info: { color: "system.info" },
    },
  },
  defaultVariants: { variant: "info" },
});

export type CalloutVariant = "error" | "warning" | "success" | "info";
export type CalloutSize = "normal" | "compact";

export interface CalloutProps extends HTMLAttributes<HTMLDivElement> {
  message: string;
  variant?: CalloutVariant;
  size?: CalloutSize;
  noBorder?: boolean;
  onDismiss?: () => void;
  icon?: Icon;
}

export function Callout({
  message,
  variant = "info",
  size = "normal",
  noBorder = false,
  onDismiss,
  icon: IconComponent = Bell,
  className,
  ...props
}: CalloutProps) {
  const accent = accentRecipe({ variant });
  return (
    <div
      className={cx(calloutRecipe({ variant, size, noBorder }), className)}
      {...props}
    >
      <styled.span className={accent} flexShrink="0" lineHeight="[0]">
        <IconComponent size={24} weight="regular" aria-hidden="true" />
      </styled.span>
      <styled.span flex="1">{message}</styled.span>
      {onDismiss && (
        <styled.button
          type="button"
          aria-label="Dismiss notification"
          onClick={onDismiss}
          cursor="pointer"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          flexShrink="0"
          p="0"
          bg="[transparent]"
          borderWidth="0"
          lineHeight="[0]"
          className={accent}
        >
          <X size={24} aria-hidden="true" />
        </styled.button>
      )}
    </div>
  );
}

export default Callout;
