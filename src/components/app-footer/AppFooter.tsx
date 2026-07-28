import type { HTMLAttributes, ReactNode } from "react";
import { css, cx } from "@/styled/css";

/**
 * AppFooter — bottom bar shared across every pipeline (Dataset, Anonimizador,
 * Voz a Texto). AymurAI UI Library "bar" node 40002579:88245 (bottom bar of
 * the "Anonimizador - Preview" screen).
 *
 * `leading` and `actions` are pre-built content — the library only owns the
 * shell (height, border, background, padding, slot placement, wrapping).
 * `leading` is desktop-app's `BuiltBy` (DataGénero branding belongs to the
 * product, not the library); `actions` is usually one or two `Button`s.
 *
 * `mt: "auto"` pushes the footer to the bottom when it's the last child of
 * a `display:flex; flexDirection:column; minH:100vh` page wrapper (the
 * standard sticky-footer pattern) — the library can't force this on its
 * own without controlling the whole page.
 */

const root = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "4", // 16px — matches the Figma gap between leading/actions when they fit on one line
  minH: "[99px]",
  px: "12", // 48px
  py: "6", // 24px
  bg: "bg.secondary",
  borderTopWidth: "[1px]",
  borderTopStyle: "solid",
  borderTopColor: "[#BCBAB8]", // border.primary colour, no bare token
  w: "full",
  flexShrink: "0",
  mt: "auto",
});

const leadingWrap = css({
  display: "flex",
  alignItems: "center",
  minW: "[0px]",
});

const actionsWrap = css({
  display: "flex",
  alignItems: "center",
  gap: "4", // 16px
  flexWrap: "wrap",
  justifyContent: "flex-end",
  // Keeps actions right-aligned even when they wrap onto their own line;
  // a no-op when `root` still has room to lay both slots out side by side.
  ml: "auto",
});

export interface AppFooterProps extends HTMLAttributes<HTMLDivElement> {
  leading?: ReactNode;
  actions?: ReactNode;
}

export function AppFooter({
  leading,
  actions,
  className,
  ...props
}: AppFooterProps) {
  return (
    <div className={cx(root, className)} {...props}>
      {leading && <div className={leadingWrap}>{leading}</div>}
      {actions && <div className={actionsWrap}>{actions}</div>}
    </div>
  );
}

export default AppFooter;
