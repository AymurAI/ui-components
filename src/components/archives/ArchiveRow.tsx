import type { ReactNode } from "react";
import { css, cva, cx } from "@/styled/css";

/**
 * ArchiveRow — horizontal file presentation: icon, title, description, and
 * optional leading/trailing actions (e.g. a play button, a delete button).
 *
 * Formalizes the file-info row from the single-document preview screen
 * (Figma node 40002579:88220, frame "Frame 1244833316" — icon container +
 * title/description + trailing Trash) and doubles as the row shape Voz a
 * Texto already uses for its file list (icon/play button + name + duration
 * + delete), so both consumers share one implementation.
 *
 * Actions are passed as fully-built elements (e.g. `<Button variant="tertiary"
 * size="icon-sm"><Trash /></Button>`) — this component only places them,
 * it doesn't know what they do.
 */

const iconContainer = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  w: "[40px]",
  h: "[40px]",
  p: "2", // 8px
  rounded: "md",
  bg: "bg.primary-alternative",
  color: "text.default",
  flexShrink: "0",
  "& svg": { w: "full", h: "full" },
});

const content = css({
  display: "flex",
  flexDir: "column",
  gap: "[2px]",
  flex: "1",
  minW: "[0px]",
});

const titleStyle = css({
  margin: "0", // no preflight — <p> keeps the UA default margin otherwise
  textStyle: "label.md.default",
  color: "text.default",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const descriptionStyle = css({
  margin: "0",
  textStyle: "subtitle.sm.default",
  color: "text.lighter",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const root = cva({
  base: {
    display: "flex",
    alignItems: "center",
    gap: "4", // 16px
    w: "full",
  },
  variants: {
    variant: {
      plain: {},
      outlined: {
        p: "6",
        rounded: "[8px]",
        borderWidth: "[4px]",
        borderStyle: "solid",
        borderColor: "[#BCBAB8]",
        bg: "bg.secondary",
      },
    },
  },
  defaultVariants: { variant: "plain" },
});

export interface ArchiveRowProps {
  icon?: ReactNode;
  title: string;
  description: string;
  variant?: "plain" | "outlined";
  leadingAction?: ReactNode;
  trailingAction?: ReactNode;
  className?: string;
}

export function ArchiveRow({
  icon,
  title,
  description,
  variant = "plain",
  leadingAction,
  trailingAction,
  className,
}: ArchiveRowProps) {
  return (
    <div className={cx(root({ variant }), className)}>
      {leadingAction}
      {icon && <span className={iconContainer}>{icon}</span>}
      <div className={content}>
        <p className={titleStyle}>{title}</p>
        <p className={descriptionStyle}>{description}</p>
      </div>
      {trailingAction}
    </div>
  );
}

export default ArchiveRow;
