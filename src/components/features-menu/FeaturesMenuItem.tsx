import type { ReactNode } from "react";
import { css, cva, cx } from "@/styled/css";

/**
 * FeaturesMenuItem — a single entry in {@link FeaturesMenu}: icon + label,
 * no description. AymurAI UI Library "Menu" node 40000732:79289 ("item
 * menu" sub-frame).
 *
 * Figma specs this label in Inter SemiBold — every other text style in this
 * library is Archivo. Kept on the shared `label.md.strong` token (Archivo)
 * instead, for visual consistency with the rest of the app; treated as a
 * likely Figma inconsistency rather than a deliberate exception.
 *
 * Disabled styling mirrors {@link Card}'s convention (bg.primary/text.lighter
 * on the card) plus {@link CardTool}'s icon-box convention (bg.secondary/
 * text.lighter) — this is a distinct, smaller card shape from both, but
 * reuses their established disabled treatment for consistency.
 */

const item = cva({
  base: {
    display: "flex",
    flexDir: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "3", // 12px
    w: "full",
    bg: "bg.secondary",
    border: "primary",
    rounded: "md", // 8px
    p: "4", // 16px
    cursor: "pointer",
    transitionProperty: "[border, box-shadow]",
    transitionDuration: "normal",
    transitionTimingFunction: "default",
    "&:hover:enabled": {
      border: "primary-alt",
      boxShadow: "card-hover",
    },
    "&:focus-visible:enabled": {
      outline: "primary-alt",
      outlineWidth: "[2px]",
      boxShadow: "focus",
    },
    "&:disabled": {
      cursor: "default",
      bg: "bg.primary",
      color: "text.lighter",
    },
  },
  variants: {
    fullWidth: {
      true: { gridColumn: "1 / -1" },
      false: {},
    },
  },
  defaultVariants: { fullWidth: false },
});

const iconContainer = cva({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    w: "[40px]",
    h: "[40px]",
    p: "2", // 8px
    rounded: "md", // 8px
    flexShrink: "0",
    "& svg": { w: "full", h: "full" },
  },
  variants: {
    disabled: {
      true: { bg: "bg.secondary", color: "text.lighter" },
      false: { bg: "bg.primary-alternative", color: "text.default" },
    },
  },
  defaultVariants: { disabled: false },
});

const label = css({
  margin: "0", // no preflight — <p> keeps the UA default margin otherwise
  textStyle: "label.md.strong",
  whiteSpace: "nowrap",
});

export interface FeaturesMenuItemProps {
  icon: ReactNode;
  label: string;
  disabled?: boolean;
  /** Spans both grid columns — e.g. a trailing "Configuración" row. */
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
}

export function FeaturesMenuItem({
  icon,
  label: labelText,
  disabled = false,
  fullWidth = false,
  onClick,
  className,
}: FeaturesMenuItemProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cx(item({ fullWidth }), className)}
    >
      <span className={iconContainer({ disabled })}>{icon}</span>
      <p className={label}>{labelText}</p>
    </button>
  );
}

export default FeaturesMenuItem;
