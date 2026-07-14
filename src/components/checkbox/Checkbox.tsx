import { Check } from "phosphor-react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { css, cva, cx, type RecipeVariantProps } from "@/styled/css";

/**
 * Checkbox — AymurAI UI Library "🟢checkbox🟢".
 *
 * Figma family: 25:12490, base: 25:12527
 * Variants: Checked × {Default, Hover, Disable, Focus}
 * - Box: 18×18px total, border-radius 4px (token sm)
 * - Unchecked default: 2px border action/alt-default (#3F479D), transparent bg
 * - Unchecked hover: 1px border #BCBAB8
 * - Checked default: filled action/alt-default bg, no border, white check icon 16px
 * - Checked hover: filled action/hover (#110041) bg
 * - Focus: 4px border action/hover (#110041) on the box, rounded-[6px]
 * - Disabled unchecked: bg action/disabled (#E0DDE2) + 2px border #BCBAB8
 * - Disabled checked: bg action/disabled (#E0DDE2), no border, dimmed tick
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
    transitionProperty: "[background-color, border-color, border-width]",
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
        // Figma: checked box is a filled square — no visible border, just bg
        borderWidth: "0",
        bg: "action.alt-default",
        color: "text.onbutton-alternative",
      },
    },
    disabled: {
      // Disabled unchecked: bg action/disabled + 2px border #BCBAB8 (border/primary color)
      // Disabled checked: bg action/disabled only, tick uses onbutton-disabled color
      true: {
        borderWidth: "[2px]",
        borderStyle: "solid",
        borderColor: "[#BCBAB8]",
        bg: "action.disabled",
        color: "text.onbutton-disabled",
      },
      false: {},
    },
  },
  compoundVariants: [
    // Disabled + checked: bg only, no border (Figma: bg-[#e0dde2], no border)
    {
      checked: true,
      disabled: true,
      css: {
        borderWidth: "0",
      },
    },
  ],
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
    p: "2", // 8px outer row padding
    cursor: "pointer",
    userSelect: "none",
    rounded: "xs",
    textStyle: "label.md.default",
    color: "text.default",

    // Hover (unchecked): box border changes to 1px #BCBAB8
    "&:hover:not([data-disabled]) [data-box][data-checked='false']": {
      borderWidth: "[1px]",
      borderColor: "[#BCBAB8]",
    },

    // Hover (checked): box bg darkens to action.hover (#110041)
    "&:hover:not([data-disabled]) [data-box][data-checked='true']": {
      bg: "action.hover",
    },

    // Focus: 4px solid action.hover (#110041) border on the box, radius 6px
    "&:focus-within [data-box]": {
      borderWidth: "[4px]",
      borderStyle: "solid",
      borderColor: "action.hover",
      rounded: "[6px]",
    },
  },
  variants: {
    disabled: {
      true: {
        cursor: "not-allowed",
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
        data-box
        data-checked={String(!!checked || !!defaultChecked)}
        className={checkboxBox({
          checked: !!checked || !!defaultChecked,
          disabled,
        })}
      >
        {(checked || defaultChecked) && <Check size={16} weight="bold" />}
      </span>
      {children}
    </label>
  );
}

export default Checkbox;
