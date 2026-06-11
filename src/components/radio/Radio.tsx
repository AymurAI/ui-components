import { type RecipeVariantProps, css, cva, cx } from "@/styled/css";
import type { InputHTMLAttributes, ReactNode } from "react";

/**
 * Radio — AymurAI UI Library "🟢radio-button🟢".
 *
 * Figma family: 1:4612, base: 1:4649
 * Variants: Checked=On/Off × {Default, Hover, Disable, Focus}
 * - Circle: 18×18px; outer border action/alt-default (#3F479D)
 * - On: filled inner dot (action/alt-default)
 * - Off: white bg with border
 * - Padding 3px around circle; outer row 8px, gap 8px
 * - Focus: 3px outline border/primary
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
    rounded: "xs",
    textStyle: "label.md.default",
    color: "text.default",

    "&:focus-within": {
      outline: "primary",
      outlineWidth: "[3px]",
      outlineStyle: "solid",
    },

    "&:hover:not([data-disabled])": {
      bg: "bg.primary-alternative",
    },
  },
  variants: {
    disabled: {
      true: {
        cursor: "not-allowed",
        // Figma disabled label colour (text/text-onbutton-disabled #A9A9A9);
        // the circle handles its own per-slot disabled colours.
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
        className={radioCircle({ checked: !!checked, disabled })}
      />
      {children}
    </label>
  );
}

export default Radio;
