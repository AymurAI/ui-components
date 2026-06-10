import { cva, cx } from "@/styled/css";
import { CheckCircle } from "phosphor-react";

/**
 * ArchiveTabs — AymurAI UI Library "archive-tabs" family node 186:18202.
 *
 * Figma states:
 *   Selected   — bg action.default (#C5CAFF), border text.default (#110041),
 *                drop-shadow 2px 2px 5px rgba(17,0,65,0.25)
 *   Completed  — bg action.pressed/brand.primary (#3F479D), text white,
 *                CheckCircle icon on right
 *   Unselected — bg bg.primary-alternative (#E5E8FF), no border
 *
 * Figma measurements: h:51px, px:16px, rounded:2px
 */

const archiveTab = cva({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "[10px]",
    h: "[51px]",
    px: "4", // 16px
    py: "[14px]",
    rounded: "xs", // 2px
    cursor: "pointer",
    borderWidth: "0",
    textStyle: "label.md.default",
    whiteSpace: "nowrap",
    transitionProperty: "[background-color, border-color, box-shadow]",
    transitionDuration: "fast",
    transitionTimingFunction: "default",
  },
  variants: {
    status: {
      selected: {
        bg: "action.default",
        borderWidth: "[1px]",
        borderStyle: "solid",
        borderColor: "text.default",
        color: "text.default",
        boxShadow: "[2px_2px_5px_rgba(17,0,65,0.25)]",
      },
      completed: {
        bg: "action.pressed",
        color: "text.onbutton-alternative",
        borderWidth: "0",
      },
      unselected: {
        bg: "bg.primary-alternative",
        color: "text.default",
        borderWidth: "0",
        "&:hover": {
          bg: "action.default",
        },
      },
    },
  },
  defaultVariants: { status: "unselected" },
});

export type ArchiveTabStatus = "selected" | "completed" | "unselected";

export interface ArchiveTabsProps {
  label: string;
  status?: ArchiveTabStatus;
  onClick?: () => void;
  className?: string;
}

export function ArchiveTabs({
  label,
  status = "unselected",
  onClick,
  className,
}: ArchiveTabsProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={status === "selected"}
      onClick={onClick}
      className={cx(archiveTab({ status }), className)}
    >
      <span>{label}</span>
      {status === "completed" && <CheckCircle size={23} />}
    </button>
  );
}

export default ArchiveTabs;
