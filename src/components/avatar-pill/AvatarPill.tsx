import { PencilSimple } from "phosphor-react";
import type { HTMLAttributes } from "react";
import { css, cva, cx, type RecipeVariantProps } from "@/styled/css";
import { Avatar, type AvatarColor } from "../avatar";

/**
 * AvatarPill — speaker chip used in the Voz a texto (speech-to-text) side panel.
 * AymurAI UI Library node 40002313:53080.
 *
 * Reuses {@link Avatar} (24px circle) plus a name label inside a rounded pill.
 *
 * Figma states: Default | Selected | Hover (reveals a rename pencil) | Typing
 * (edit focus — confirmed with design: triggered manually by selecting the
 * person from the pill, not tied to audio playback).
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
    state: {
      default: {
        bg: "bg.secondary", // #FFFFFF
        "&:hover": { bg: "bg.primary-alternative" },
      },
      selected: { bg: "bg.primary-alternative" }, // #E5E8FF
      typing: {
        bg: "bg.secondary",
        border: "primary-alt",
      },
    },
  },
  defaultVariants: { state: "default" },
});

const pillName = cva({
  base: {
    textStyle: "label.md.default", // Archivo 16px
    whiteSpace: "nowrap",
    flexShrink: "0",
  },
  variants: {
    state: {
      default: { color: "text.lighter" }, // #625C68
      selected: { color: "text.default" }, // #110041
      typing: { color: "text.default" },
    },
  },
  defaultVariants: { state: "default" },
});

const renameButton = css({
  display: "none",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: "0",
  borderWidth: "0",
  bg: "[transparent]",
  color: "text.default",
  cursor: "pointer",
  p: "0",
  ".aym-pill-root:hover &": { display: "flex" },
});

export type AvatarPillState = "default" | "selected" | "typing";

export type AvatarPillProps = Omit<
  RecipeVariantProps<typeof pillRoot>,
  "state"
> & {
  /** Initials shown inside the avatar circle (e.g. "AB") */
  initials: string;
  /** Speaker name shown next to the avatar */
  name: string;
  /** Avatar circle colour (per-speaker) */
  color?: AvatarColor;
  /** Figma "Property 1": default | selected | typing (edit focus) */
  state?: AvatarPillState;
  /**
   * @deprecated use `state="selected"` instead — kept for backwards
   * compatibility, ignored when `state` is passed explicitly.
   */
  selected?: boolean;
  /** Shown as a pencil icon on hover; omit to hide the rename affordance */
  onRename?: () => void;
  renameLabel?: string;
  className?: string;
} & Omit<HTMLAttributes<HTMLSpanElement>, "color">;

export function AvatarPill({
  initials,
  name,
  state,
  selected,
  color = "primary",
  onRename,
  renameLabel = "Renombrar",
  className,
  ...props
}: AvatarPillProps) {
  const resolvedState: AvatarPillState =
    state ?? (selected ? "selected" : "default");

  return (
    <span
      className={cx(
        "aym-pill-root",
        pillRoot({ state: resolvedState }),
        className,
      )}
      {...props}
    >
      <Avatar initials={initials} size="sm" color={color} />
      <span className={pillName({ state: resolvedState })}>{name}</span>
      {onRename && resolvedState !== "typing" && (
        <button
          type="button"
          onClick={onRename}
          aria-label={renameLabel}
          className={renameButton}
        >
          <PencilSimple size={14} />
        </button>
      )}
    </span>
  );
}

export default AvatarPill;
