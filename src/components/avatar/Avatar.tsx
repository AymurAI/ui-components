import type { HTMLAttributes } from "react";
import { cva, cx, type RecipeVariantProps } from "@/styled/css";

/**
 * Avatar — initials badge (speaker avatar). AymurAI UI Library node 40001422:54714.
 *
 * A coloured circle with centred initials. Sizes sm (24px) / md (32px); the bg
 * colour distinguishes speakers. Initials use label.sm.default, text.default.
 */
const avatar = cva({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "full",
    flexShrink: "0",
    textAlign: "center",
    color: "text.default",
    textStyle: "label.sm.default",
    userSelect: "none",
  },
  variants: {
    size: {
      sm: { w: "6", h: "6" }, // 24px
      md: { w: "8", h: "8" }, // 32px
    },
    color: {
      primary: { bg: "bg.primary-highlight" },
      secondary: { bg: "bg.secondary-highlight" },
      warning: { bg: "system.warning-secondary" },
      success: { bg: "system.success-secondary" },
      // Speaker palette (Figma "bg/category/*") — 7 colours × base/-light.
      violet: {
        bg: "category.violet",
        color: "text.onbutton-alternative",
      },
      "violet-light": { bg: "category.violet-light" },
      green: { bg: "category.green" },
      "green-light": { bg: "category.green-light" },
      red: { bg: "category.red" },
      "red-light": { bg: "category.red-light" },
      yellow: { bg: "category.yellow" },
      "yellow-light": { bg: "category.yellow-light" },
      pink: { bg: "category.pink" },
      "pink-light": { bg: "category.pink-light" },
      orange: { bg: "category.orange" },
      "orange-light": { bg: "category.orange-light" },
      blue: { bg: "category.blue" },
      "blue-light": { bg: "category.blue-light" },
    },
  },
  defaultVariants: { size: "sm", color: "primary" },
});

export type AvatarColor =
  | "primary"
  | "secondary"
  | "warning"
  | "success"
  | "violet"
  | "violet-light"
  | "green"
  | "green-light"
  | "red"
  | "red-light"
  | "yellow"
  | "yellow-light"
  | "pink"
  | "pink-light"
  | "orange"
  | "orange-light"
  | "blue"
  | "blue-light";

export type AvatarProps = RecipeVariantProps<typeof avatar> & {
  /** Initials shown inside the circle (e.g. "AD") */
  initials: string;
  className?: string;
} & Omit<HTMLAttributes<HTMLSpanElement>, "color">;

export function Avatar({
  initials,
  size,
  color,
  className,
  ...props
}: AvatarProps) {
  return (
    <span className={cx(avatar({ size, color }), className)} {...props}>
      {initials}
    </span>
  );
}

export default Avatar;
