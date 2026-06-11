import { type RecipeVariantProps, cva, cx } from "@/styled/css";
import type { HTMLAttributes } from "react";

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
    },
  },
  defaultVariants: { size: "sm", color: "primary" },
});

export type AvatarColor = "primary" | "secondary" | "warning" | "success";

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
