import type { HTMLAttributes } from "react";
import { css, cva, cx, type RecipeVariantProps } from "@/styled/css";
import { Avatar, type AvatarColor } from "../avatar";

/**
 * TranscriptBlock — a single speaker turn in the Voz a texto (speech-to-text)
 * transcript. AymurAI UI Library node 40002318:32859.
 *
 * Header: avatar (24px) + speaker name (label.md.strong) + timestamp.
 * Body: Archivo Light 16px / 26px line-height, text.default.
 *
 * Variants (Figma "Property 1"):
 *  - default       no left bar; body padded px 32.
 *  - selected      brand.primary left bar (4px); plain body.
 *  - hover         selected + body bg primary-alternative @80% (rounded md).
 *  - typed         selected + white body with border.primary (editing state).
 */
const transcriptRoot = cva({
  base: { display: "flex", w: "full" },
  variants: {
    variant: {
      default: { flexDirection: "column", gap: "3" }, // 12px
      selected: { flexDirection: "row", gap: "[11px]", alignItems: "stretch" },
      hover: { flexDirection: "row", gap: "[11px]", alignItems: "stretch" },
      typed: { flexDirection: "row", gap: "[11px]", alignItems: "stretch" },
    },
  },
  defaultVariants: { variant: "default" },
});

const bar = css({
  w: "[4px]",
  flexShrink: "0",
  alignSelf: "stretch",
  bg: "brand.primary", // #3F479D
  rounded: "lg", // 16px
});

const content = css({
  display: "flex",
  flexDirection: "column",
  gap: "3", // 12px
  flex: "1",
  minW: "0",
});

const header = css({
  display: "flex",
  alignItems: "center",
  gap: "[10px]",
});

const avatarName = css({
  display: "flex",
  alignItems: "center",
  gap: "2", // 8px
});

const speakerName = css({
  textStyle: "label.md.strong", // Archivo SemiBold 16px
  color: "text.lighter", // #625C68
  whiteSpace: "nowrap",
});

const timestamp = css({
  textStyle: "label.md.default",
  color: "text.lighter",
  whiteSpace: "nowrap",
});

const transcriptBody = cva({
  base: {
    fontFamily: "primary", // Archivo
    fontWeight: "[300]", // Light
    fontSize: "[16px]",
    lineHeight: "[26px]",
    color: "text.default",
    w: "full",
  },
  variants: {
    variant: {
      default: { px: "8" }, // 32px
      selected: { pl: "4", pr: "8", py: "2" }, // pl16 pr32 py8
      hover: {
        pl: "4",
        pr: "8",
        py: "2",
        rounded: "md", // 8px
        bg: "[rgba(229,232,255,0.8)]", // primary-alternative @ 80%
      },
      typed: {
        pl: "4",
        pr: "8",
        py: "2",
        rounded: "md",
        bg: "bg.secondary",
        border: "primary", // 1px solid #BCBAB8
      },
    },
  },
  defaultVariants: { variant: "default" },
});

export type TranscriptBlockProps = RecipeVariantProps<typeof transcriptRoot> & {
  /** Speaker initials shown in the avatar */
  initials: string;
  /** Speaker name */
  name: string;
  /** Timestamp label (e.g. "01:15") */
  time: string;
  /** Transcript text for this turn */
  text: string;
  /** Avatar circle colour (per-speaker) */
  color?: AvatarColor;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "color">;

export function TranscriptBlock({
  initials,
  name,
  time,
  text,
  variant = "default",
  color = "primary",
  className,
  ...props
}: TranscriptBlockProps) {
  const head = (
    <div className={header}>
      <div className={avatarName}>
        <Avatar initials={initials} size="sm" color={color} />
        <span className={speakerName}>{name}</span>
      </div>
      <span className={timestamp}>{time}</span>
    </div>
  );
  const body = <p className={transcriptBody({ variant })}>{text}</p>;

  if (variant === "default") {
    return (
      <article
        className={cx(transcriptRoot({ variant }), className)}
        {...props}
      >
        {head}
        {body}
      </article>
    );
  }

  return (
    <article className={cx(transcriptRoot({ variant }), className)} {...props}>
      <div className={bar} />
      <div className={content}>
        {head}
        {body}
      </div>
    </article>
  );
}

export default TranscriptBlock;
