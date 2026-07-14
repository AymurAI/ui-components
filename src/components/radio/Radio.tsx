import type { InputHTMLAttributes, ReactNode } from "react";
import { css, cva, cx, type RecipeVariantProps } from "@/styled/css";

/**
 * Radio — AymurAI UI Library "🟢radio-button🟢".
 *
 * Figma family: 1:4612, base: 1:4649
 * Variants: Checked=On/Off × {Default, Hover, Disable, Focus}
 * - Circle: 18×18px; outer border action/alt-default (#3F479D)
 * - On: filled inner dot (action/alt-default)
 * - Off: white bg with border
 * - Padding 3px around circle; outer row 8px, gap 8px
 * - Focus: 3px border border/primary (#BCBAB8), radius 3px
 * - Hover: circle border + dot darken to action.hover (#110041)
 */

const radioCircle = cva({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    w: "[18px]",
    h: "[18px]",
    rounded: "full",
    flexShrink: "0",
    borderWidth: "[2px]",
    borderStyle: "solid",
    transitionProperty: "[background-color, border-color]",
    transitionDuration: "fast",
    transitionTimingFunction: "default",
  },
  variants: {
    checked: {
      false: {
        borderColor: "action.alt-default",
        bg: "bg.secondary",
        // inner dot hidden
        "&::after": { display: "none" },
      },
      true: {
        borderColor: "action.alt-default",
        bg: "bg.secondary",
        // inner dot via pseudo-element
        "&::after": {
          content: '""',
          display: "block",
          w: "[8px]",
          h: "[8px]",
          rounded: "full",
          bg: "action.alt-default",
        },
      },
    },
    disabled: {
      true: {
        borderColor: "action.disabled",
        bg: "action.disabled",
        "&::after": {
          bg: "text.onbutton-disabled",
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    checked: false,
    disabled: false,
  },
});

const radioRoot = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: "2", // 8px
    p: "2", // 8px
    cursor: "pointer",
    userSelect: "none",
    // Figma Focus state: 3px border border/primary (#BCBAB8), radius 3px.
    // Use a transparent border in base so layout is stable; fill it on focus-within.
    borderWidth: "[3px]",
    borderStyle: "solid",
    borderColor: "[transparent]",
    rounded: "[3px]",
    textStyle: "label.md.default",
    color: "text.default",

    "&:focus-within": {
      borderColor: "[#BCBAB8]",
    },

    "&:hover:not([data-disabled])": {
      bg: "bg.primary-alternative",
    },

    // Figma Hover: circle border + inner dot darken to action.hover.
    "&:hover:not([data-disabled]) [data-circle]": {
      borderColor: "action.hover",
    },
    "&:hover:not([data-disabled]) [data-circle='true']::after": {
      bg: "action.hover",
    },
  },
  variants: {
    disabled: {
      true: {
        cursor: "not-allowed",
        color: "text.disabled",
      },
      false: {},
    },
  },
  defaultVariants: {
    disabled: false,
  },
});

export type RadioProps = RecipeVariantProps<typeof radioRoot> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  value?: string;
  children?: ReactNode;
  className?: string;
} & Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "checked" | "defaultChecked" | "type"
  >;

export function Radio({
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  name,
  value,
  children,
  className,
  ...rest
}: RadioProps) {
  const isControlled = checked !== undefined;
  const isChecked = !!checked || !!defaultChecked;

  return (
    <label
      className={cx(radioRoot({ disabled }), className)}
      data-disabled={disabled ? "" : undefined}
    >
      {/* Hidden native input for accessibility */}
      <input
        {...rest}
        type="radio"
        name={name}
        value={value}
        checked={isControlled ? checked : undefined}
        defaultChecked={!isControlled ? defaultChecked : undefined}
        disabled={disabled}
        onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
        className={css({
          position: "absolute",
          w: "[1px]",
          h: "[1px]",
          p: "0",
          m: "[-1px]",
          overflow: "hidden",
          whiteSpace: "nowrap",
          borderWidth: "0",
        })}
      />
      {/* Visual circle */}
      <span
        aria-hidden="true"
        data-circle={isChecked ? "true" : "false"}
        className={radioCircle({ checked: isChecked, disabled })}
      />
      {children}
    </label>
  );
}

export default Radio;
