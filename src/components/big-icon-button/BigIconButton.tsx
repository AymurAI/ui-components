import { Spinner } from "@/components/spinner/Spinner";
import { type RecipeVariantProps, cva, cx } from "@/styled/css";
import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * BigIconButton — AymurAI UI Library "🟢big icon button🟢".
 *
 * Figma family: 21:5117
 * Variants: Type=Primary|Secondary|Tertiary × Size=Big|Small × State=Default|Hover|Pressed|Focus|Disabled|Loading
 *
 * Dimensions:
 *   - Big:   48×48px, padding 12px, rounded 6px → [6px] escape (no 6px token, nearest is sm=4 or md=8)
 *   - Small: 36×36px, padding 8px,  rounded 6px
 *
 * Colors:
 *   - Primary:   bg action.default (#C5CAFF), icon text.onbutton-default
 *   - Secondary: bg bg.secondary, border action.alt-default, icon text.onbutton-default
 *   - Tertiary:  bg transparent, icon text.onbutton-default
 *
 * TOKEN GAP: rounded "6px" — no exact token. Using escape hatch "[6px]".
 */

const bigIconButton = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexDir: "column",
    overflow: "hidden",
    position: "relative",
    cursor: "pointer",
    flexShrink: "0",
    borderWidth: "0",

    transitionProperty: "[background-color, color, box-shadow, border-color]",
    transitionDuration: "slow",
    transitionTimingFunction: "default",

    "&:disabled": {
      cursor: "not-allowed",
    },

    "&:focus-visible": {
      outline: "primary-alt",
      outlineWidth: "[2px]",
      outlineStyle: "solid",
      boxShadow: "focus",
    },
  },
  variants: {
    variant: {
      primary: {
        bg: "action.default",
        color: "text.onbutton-default",
        "&:hover:enabled": {
          bg: "action.hover",
          color: "text.onbutton-alternative",
        },
        "&:active:enabled": {
          bg: "action.pressed",
          color: "text.onbutton-alternative",
        },
        // TOKEN GAP: Figma action-disabled for this component = #E2EBF3 (blue-tinted),
        // not the warm-grey #E0DDE2 stored in action.disabled. Escape until token updated.
        "&:disabled": { bg: "[#E2EBF3]", color: "text.onbutton-default" },
      },
      secondary: {
        bg: "bg.secondary",
        color: "text.onbutton-default",
        borderWidth: "[2px]",
        borderStyle: "solid",
        borderColor: "action.alt-default",
        // TOKEN GAP: Figma secondary-hover border = #728197 (muted blue-grey);
        // action.hover = #110041 is wrong here. Escape until token promoted.
        "&:hover:enabled": { borderColor: "[#728197]" },
        "&:active:enabled": {
          bg: "action.pressed",
          color: "text.onbutton-alternative",
          borderColor: "action.pressed",
        },
        // TOKEN GAP: Figma disabled border uses same #E2EBF3 as primary disabled bg.
        "&:disabled": {
          borderColor: "[#E2EBF3]",
          color: "text.onbutton-disabled",
        },
      },
      tertiary: {
        bg: "[transparent]",
        color: "text.onbutton-default",
        // Figma tertiary hover: no bg fill — stays transparent.
        "&:active:enabled": {
          bg: "action.pressed",
          color: "text.onbutton-alternative",
        },
        "&:disabled": { color: "text.onbutton-disabled" },
      },
    },
    size: {
      // Big: 48×48px, p:12px
      big: {
        w: "[48px]",
        h: "[48px]",
        p: "3", // 12px
        rounded: "[6px]", // TOKEN GAP: no 6px token
      },
      // Small: 36×36px, p:8px
      small: {
        w: "[36px]",
        h: "[36px]",
        p: "2", // 8px
        rounded: "[6px]", // TOKEN GAP: no 6px token
      },
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "big",
  },
});

export type BigIconButtonProps = RecipeVariantProps<typeof bigIconButton> & {
  isLoading?: boolean;
  children?: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function BigIconButton({
  variant,
  size,
  isLoading,
  disabled,
  children,
  className,
  type = "button",
  ...props
}: BigIconButtonProps) {
  const spinnerSize = size === "small" ? 20 : 24;

  return (
    <button
      {...props}
      type={type}
      disabled={disabled || isLoading}
      className={cx(bigIconButton({ variant, size }), className)}
    >
      {isLoading ? <Spinner size={spinnerSize} /> : children}
    </button>
  );
}

export default BigIconButton;
