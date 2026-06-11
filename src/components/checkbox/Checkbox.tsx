import { type RecipeVariantProps, css, cva, cx } from "@/styled/css";
import { Check } from "phosphor-react";
import type { InputHTMLAttributes, ReactNode } from "react";

/**
 * Checkbox — AymurAI UI Library "🟢checkbox🟢".
 *
 * Figma family: 25:12490, base: 25:12527
 * Variants: Checked × {Default, Hover, Disable, Focus}
 * - Box: 18×18px, border-radius 4px (token sm)
 * - Padding around box: 3px; outer row padding: 8px; gap: 8px
 * - Unchecked: 2px border action/alt-default (#3F479D)
 * - Checked: filled action/alt-default bg, white check icon
 * - Focus: 3px border border/primary (#BCBAB8)
 * - Disabled: action/disabled bg & border
 */

const checkboxBox = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    w: "[18px]",
    h: "[18px]",
    rounded: "sm",
    flexShrink: "0",
    transitionProperty: "[background-color, border-color]",
    transitionDuration: "fast",
    transitionTimingFunction: "default",
  },
  variants: {
    checked: {
      false: {
        borderWidth: "[2px]",
        borderStyle: "solid",
        borderColor: "action.alt-default",
        bg: "[transparent]",
        color: "[transparent]",
      },
      true: {
        borderWidth: "[2px]",
        borderStyle: "solid",
        borderColor: "action.alt-default",
        bg: "action.alt-default",
        color: "text.onbutton-alternative",
      },
    },
    disabled: {
      true: {
        borderColor: "action.disabled",
        bg: "action.disabled",
        color: "text.onbutton-disabled",
      },
      false: {},
    },
  },
  defaultVariants: {
    checked: false,
    disabled: false,
  },
});

const checkboxRoot = cva({
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

    // Focus ring on the wrapper (matches Figma Focus state: 3px border/primary)
    "&:focus-within": {
      outline: "primary",
      outlineWidth: "[3px]",
      outlineStyle: "solid",
    },

    "&:hover:not([data-disabled])": {
      bg: "bg.primary-alternative",
    },

    // Figma Hover + Checked: the box darkens to action.hover (#110041).
    "&:hover:not([data-disabled]) [data-checked='true']": {
      bg: "action.hover",
      borderColor: "action.hover",
    },
  },
  variants: {
    disabled: {
      true: {
        cursor: "not-allowed",
        // Per-slot disabled colours (Figma) rather than a blanket opacity:
        // the box already maps action.disabled; here we dim the label.
        color: "text.lighter",
      },
      false: {},
    },
  },
  defaultVariants: {
    disabled: false,
  },
});

export type CheckboxProps = RecipeVariantProps<typeof checkboxRoot> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  children?: ReactNode;
  className?: string;
} & Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "checked" | "defaultChecked" | "type"
  >;

export function Checkbox({
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  name,
  children,
  className,
  ...rest
}: CheckboxProps) {
  const isControlled = checked !== undefined;

  return (
    <label
      className={cx(checkboxRoot({ disabled }), className)}
      data-disabled={disabled ? "" : undefined}
    >
      {/* Hidden native input for accessibility */}
      <input
        {...rest}
        type="checkbox"
        name={name}
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
      {/* Visual box */}
      <span
        aria-hidden="true"
        data-checked={!!checked || !!defaultChecked}
        className={checkboxBox({
          checked: !!checked || !!defaultChecked,
          disabled,
        })}
      >
        {(checked || defaultChecked) && <Check size={12} weight="bold" />}
      </span>
      {children}
    </label>
  );
}

export default Checkbox;
