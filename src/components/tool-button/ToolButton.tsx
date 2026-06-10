import { cva, cx } from "@/styled/css";
import { ArrowsClockwise, Tag, Trash, TrashSimple } from "phosphor-react";
import type { ButtonHTMLAttributes } from "react";

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

function ActionIcon({ action }: { action: ToolButtonAction }) {
  const size = 24;
  switch (action) {
    case "reemplazar":
      return <ArrowsClockwise size={size} />;
    case "reemplazar-todo":
      return <ArrowsClockwise size={size} weight="fill" />;
    case "eliminar":
      return <TrashSimple size={size} />;
    case "eliminar-todo":
      return <Trash size={size} />;
    case "agregar-etiqueta":
      return <Tag size={size} />;
    case "agregar-todas":
      return <Tag size={size} weight="fill" />;
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
