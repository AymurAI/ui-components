import { type RecipeVariantProps, cva, cx } from "@/styled/css";
import type { HTMLAttributes } from "react";
import { Avatar, type AvatarColor } from "../avatar";

/**
 * AvatarPill — speaker chip used in the Voz a texto (speech-to-text) side panel.
 * AymurAI UI Library node 40002313:53080.
 *
 * Reuses {@link Avatar} (24px circle) plus a name label inside a rounded pill.
 * Two states: Default (white bg, lighter name) and Selected (primary-alternative
 * bg, default name). The avatar circle colour is per-speaker (passthrough).
 */
const pillRoot = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: "2", // 8px
    p: "2", // 8px
    rounded: "xl", // 24px
    cursor: "default",
    userSelect: "none",
  },
  variants: {
    selected: {
      true: { bg: "bg.primary-alternative" }, // #E5E8FF
      false: { bg: "bg.secondary" }, // #FFFFFF
    },
  },
  defaultVariants: { selected: false },
});

const pillName = cva({
  base: {
    textStyle: "label.md.default", // Archivo 16px
    whiteSpace: "nowrap",
    flexShrink: "0",
  },
  variants: {
    selected: {
      true: { color: "text.default" }, // #110041
      false: { color: "text.lighter" }, // #625C68
    },
  },
  defaultVariants: { selected: false },
});

export type AvatarPillProps = RecipeVariantProps<typeof pillRoot> & {
  /** Initials shown inside the avatar circle (e.g. "AB") */
  initials: string;
  /** Speaker name shown next to the avatar */
  name: string;
  /** Avatar circle colour (per-speaker) */
  color?: AvatarColor;
  className?: string;
} & Omit<HTMLAttributes<HTMLSpanElement>, "color">;

export function AvatarPill({
  initials,
  name,
  selected,
  color = "primary",
  className,
  ...props
}: AvatarPillProps) {
  return (
    <span className={cx(pillRoot({ selected }), className)} {...props}>
      <Avatar initials={initials} size="sm" color={color} />
      <span className={pillName({ selected })}>{name}</span>
    </span>
  );
}

export default AvatarPill;
