import { type RecipeVariantProps, css, cva, cx } from "@/styled/css";
import { XCircle } from "phosphor-react";
import type { HTMLAttributes, MouseEventHandler } from "react";

/**
 * Option — selectable menu/list row used in the Voz a texto flows.
 * AymurAI UI Library node 40001295:56887.
 *
 * Layout: h 32px, px 8px / py 6px, rounded sm (4px), label on the left and a
 * dismiss XCircle on the right. Highlighted (selected/hover) uses
 * bg.primary-alternative (#E5E8FF).
 */
const optionRoot = cva({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "2",
    w: "full",
    h: "[32px]",
    px: "2", // 8px
    py: "[6px]",
    rounded: "sm", // 4px
    textStyle: "label.md.default",
    color: "text.default",
    cursor: "pointer",
    userSelect: "none",
    bg: "[transparent]",
    transitionProperty: "[background-color]",
    transitionDuration: "fast",
    transitionTimingFunction: "default",
    "&:hover": { bg: "bg.primary-alternative" },
  },
  variants: {
    selected: {
      true: { bg: "bg.primary-alternative" }, // #E5E8FF
      false: {},
    },
  },
  defaultVariants: { selected: false },
});

const removeButton = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: "0",
  p: "0",
  borderWidth: "0",
  bg: "[transparent]",
  cursor: "pointer",
  color: "[#343330]", // Figma icon colour "stone" — no semantic token
  "&:focus-visible": {
    outline: "primary-alt",
    outlineWidth: "[2px]",
  },
});

export type OptionProps = RecipeVariantProps<typeof optionRoot> & {
  /** Row label */
  label: string;
  /** Called when the trailing XCircle is clicked */
  onRemove?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "onSelect">;

export function Option({
  label,
  selected,
  onRemove,
  className,
  ...props
}: OptionProps) {
  return (
    <div className={cx(optionRoot({ selected }), className)} {...props}>
      <span>{label}</span>
      <button
        type="button"
        aria-label="Quitar"
        className={removeButton}
        onClick={onRemove}
      >
        <XCircle size={16} />
      </button>
    </div>
  );
}

export default Option;
