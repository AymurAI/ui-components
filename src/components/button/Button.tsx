import { CircleNotch } from "phosphor-react";
import type { ButtonHTMLAttributes } from "react";
import { css, cva, cx, type RecipeVariantProps } from "@/styled/css";

/**
 * Button — AymurAI UI Library "🟢button🟢".
 *
 * Figma variants: Type=Primary|Secondary|Tertiary, Size=Big|Small,
 * State=Default|Hover|Pressed|Focus|Disabled|Loading.
 *   - Big   → p:16, h:48, radius:4 (token sm)
 *   - Small → px:16 py:8, h:32, radius:4
 * Text: cta.md.strong (Archivo SemiBold 16/100%).
 */
const button = cva({
  base: {
    display: "flex",
    flexDir: "row",
    gap: "1", // 4px
    justifyContent: "center",
    alignItems: "center",

    transitionProperty: "[background-color, color, box-shadow]",
    transitionDuration: "slow", // 300ms
    transitionTimingFunction: "default",

    borderWidth: "0",
    textStyle: "cta.md.strong",
    cursor: "pointer",

    "&:disabled": {
      cursor: "not-allowed",
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
        "&:focus-visible:enabled": {
          bg: "action.focus",
          outline: "primary-alt",
          outlineWidth: "[2px]",
          boxShadow: "focus",
        },
        "&:disabled": {
          bg: "action.disabled",
          color: "text.onbutton-default",
        },
      },
      secondary: {
        color: "text.onbutton-default",
        bg: "bg.secondary",
        borderWidth: "[2px]",
        borderStyle: "solid",
        borderColor: "action.alt-default",
        "&:hover:enabled": {
          bg: "bg.secondary",
          borderColor: "action.hover",
        },
        "&:active:enabled": {
          color: "text.onbutton-alternative",
          bg: "action.pressed",
          borderColor: "action.pressed",
        },
        "&:focus-visible:enabled": {
          boxShadow: "focus",
          outline: "primary-alt",
          outlineWidth: "[2px]",
          bg: "bg.secondary",
        },
        "&:disabled": {
          color: "text.onbutton-disabled",
          bg: "bg.secondary",
          borderColor: "action.disabled",
        },
      },
      tertiary: {
        // Text/ghost button: transparent surface, default text.
        bg: "[transparent]",
        color: "text.onbutton-default",
        "&:hover:enabled": {
          bg: "bg.primary-alternative",
        },
        "&:active:enabled": {
          bg: "action.pressed",
          color: "text.onbutton-alternative",
        },
        "&:focus-visible:enabled": {
          outline: "primary-alt",
          outlineWidth: "[2px]",
        },
        "&:disabled": {
          color: "text.onbutton-disabled",
        },
      },
      none: {
        padding: "0",
        bg: "[inherit]",
      },
    },
    size: {
      // Big
      md: { h: "12", padding: "4", rounded: "sm" },
      // Small
      sm: { h: "8", py: "2", px: "4", rounded: "sm" },
      "icon-md": { h: "12", w: "12", padding: "3", rounded: "md" },
      "icon-sm": { h: "9", w: "9", padding: "2", rounded: "md" },
    },
    checked: {
      true: {
        bg: "action.pressed !important",
        color: "text.onbutton-alternative !important",
      },
      false: {},
    },
  },
  defaultVariants: {
    size: "md",
    variant: "primary",
    checked: false,
  },
});

export type ButtonProps = RecipeVariantProps<typeof button> &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    isLoading?: boolean;
  };

export function Button({
  size,
  variant,
  isLoading,
  disabled,
  children,
  className,
  checked,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={cx(button({ size, variant, checked }), className)}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <CircleNotch className={css({ animation: "spin" })} />
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
