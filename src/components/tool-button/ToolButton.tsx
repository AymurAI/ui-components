import { Backspace, Repeat, TrashSimple } from "phosphor-react";
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

/** "ALL" badge — positioned bottom-right of the 24×24 icon area. */
const allBadgeStyle = css({
  position: "absolute",
  bottom: "[0px]",
  right: "[0px]",
  fontSize: "[6px]",
  fontWeight: "[700]",
  lineHeight: "[1]",
  letterSpacing: "[0.02em]",
  color: "text.onbutton-alternative",
  // Tight background patch so the badge is readable over the icon's bottom-right
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
 * "Todo/Todas" variants composite the singular icon with an absolute "ALL"
 * badge overlaid in the bottom-right quadrant, matching the Figma SVG layout.
 * "Agregar" uses Backspace rotated 180° (produces the right-pointing tag shape).
 */
function ActionIcon({ action }: { action: ToolButtonAction }) {
  const size = 24;
  const flipped = { transform: "rotate(180deg)" };

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
      return <Backspace size={size} style={flipped} />;

    case "agregar-todas":
      return (
        <div className={iconWrapperStyle}>
          <Backspace size={size} style={flipped} />
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
  ...props
}: ToolButtonProps) {
  const label = ACTION_LABELS[action];
  return (
    <button
      {...props}
      type={type}
      aria-label={label}
      title={label}
      className={cx(toolButton(), className)}
    >
      <ActionIcon action={action} />
    </button>
  );
}

export default ToolButton;
