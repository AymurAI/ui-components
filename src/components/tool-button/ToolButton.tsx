import { Repeat, TagSimple, TrashSimple } from "@phosphor-icons/react";
import type { ButtonHTMLAttributes } from "react";
import { css, cva, cx } from "@/styled/css";

/**
 * ToolButton — AymurAI UI Library "Tool Button" family node 40000041:10526.
 *
 * Actions: Reemplazar / Reemplazar todo / Eliminar / Eliminar todo
 *          Agregar etiqueta / Agregar todas
 * States:  Default / Hover / Pressed
 *
 * Figma measurements:
 *   Size: 28×28px, padding: 2px, rounded: 6px
 *
 * Tokens:
 *   action.alt-default  = #3F479D  (Default bg)
 *   action.hover        = #110041  (Hover bg)
 *   action.pressed      = #3F479D  (Pressed bg) + border/primary-alt
 *   text.onbutton-alternative = #FFFFFF (icon color)
 *
 * "Todo/Todas" variants: base icon + "ALL" badge overlay (Figma composite).
 */

const toolButton = cva({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    w: "[28px]",
    h: "[28px]",
    p: "[2px]",
    rounded: "[6px]",
    cursor: "pointer",
    borderWidth: "0",
    color: "text.onbutton-alternative",
    bg: "action.alt-default",
    transitionProperty: "[background-color, border-color]",
    transitionDuration: "fast",
    transitionTimingFunction: "default",
    "&:hover:enabled": {
      bg: "action.hover",
    },
    "&:active:enabled": {
      bg: "action.pressed",
      borderWidth: "[1px]",
      borderStyle: "solid",
      borderColor: "text.default",
    },
    "&:focus-visible:enabled": {
      outline: "primary-alt",
      outlineWidth: "[2px]",
    },
    "&:disabled": {
      cursor: "not-allowed",
      bg: "action.disabled",
    },
  },
});

/** Wrapper that layers a base icon with an "ALL" badge in the bottom-right. */
const iconWrapperStyle = css({
  position: "relative",
  w: "[24px]",
  h: "[24px]",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

/**
 * "ALL" badge — Figma (node 40000041:10521/10525) hand-draws these three
 * letterforms centered on the 28×28 button canvas (bounding box center is
 * ~14,14 — dead center), overlapping the base icon, not offset to a corner.
 * Measured cap-height of the real vectors is ~3.5px — a 6px font (~4.2-4.5px
 * cap-height) ran noticeably larger than that; 4.5px tracks the real size.
 */
const allBadgeStyle = css({
  position: "absolute",
  inset: "[0px]",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "[4.5px]",
  fontWeight: "[700]",
  lineHeight: "[1]",
  letterSpacing: "[0.02em]",
  color: "text.onbutton-alternative",
  // Tight background patch so the badge is readable over the icon
  bg: "[transparent]",
  pointerEvents: "none",
  userSelect: "none",
});

export type ToolButtonAction =
  | "reemplazar"
  | "reemplazar-todo"
  | "eliminar"
  | "eliminar-todo"
  | "agregar-etiqueta"
  | "agregar-todas";

const ACTION_LABELS: Record<ToolButtonAction, string> = {
  reemplazar: "Reemplazar",
  "reemplazar-todo": "Reemplazar todo",
  eliminar: "Eliminar",
  "eliminar-todo": "Eliminar todo",
  "agregar-etiqueta": "Agregar etiqueta",
  "agregar-todas": "Agregar todas",
};

/**
 * Icon per action — matches Figma layer structure (node 40000041:10526).
 *
 * "Todo/Todas" variants composite the singular icon with an "ALL" badge
 * centered on top of it, matching the Figma SVG layout.
 */
function ActionIcon({ action }: { action: ToolButtonAction }) {
  const size = 24;

  switch (action) {
    case "reemplazar":
      return <Repeat size={size} />;

    case "reemplazar-todo":
      return (
        <div className={iconWrapperStyle}>
          <Repeat size={size} />
          <span className={allBadgeStyle}>ALL</span>
        </div>
      );

    case "eliminar":
      return <TrashSimple size={size} />;

    case "eliminar-todo":
      return (
        <div className={iconWrapperStyle}>
          <TrashSimple size={size} />
          <span className={allBadgeStyle}>ALL</span>
        </div>
      );

    case "agregar-etiqueta":
      return <TagSimple size={size} />;

    case "agregar-todas":
      return (
        <div className={iconWrapperStyle}>
          <TagSimple size={size} />
          <span className={allBadgeStyle}>ALL</span>
        </div>
      );

    default:
      return null;
  }
}

export interface ToolButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  action: ToolButtonAction;
}

export function ToolButton({
  action,
  className,
  type = "button",
  "aria-label": ariaLabel,
  title,
  ...props
}: ToolButtonProps) {
  const label = ACTION_LABELS[action];
  return (
    <button
      {...props}
      type={type}
      aria-label={ariaLabel ?? label}
      title={title ?? label}
      className={cx(toolButton(), className)}
    >
      <ActionIcon action={action} />
    </button>
  );
}

export default ToolButton;
