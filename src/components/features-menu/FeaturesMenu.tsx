import type { HTMLAttributes } from "react";
import { css, cx } from "@/styled/css";

/**
 * FeaturesMenu — the grid chrome for a set of {@link FeaturesMenuItem}s.
 * AymurAI UI Library "Menu" node 40000732:79289.
 *
 * Two columns, matching Figma exactly — this is sized for a small anchored
 * popover, not a full-page layout, so it doesn't need to reflow at
 * viewport breakpoints the way a page-level grid would.
 *
 * Purely a container: place `<FeaturesMenuItem>`s (optionally wrapped in
 * the consumer's own router link/onClick) as children. A trailing item
 * that doesn't share its row (e.g. "Configuración") uses
 * `<FeaturesMenuItem fullWidth />` to span both columns.
 */

const grid = css({
  display: "grid",
  gridTemplateColumns: "[repeat(2,140px)]",
  gap: "2", // 8px
  bg: "bg.primary",
  rounded: "md", // 8px
  p: "4", // 16px
  boxShadow: "menu",
});

export interface FeaturesMenuProps extends HTMLAttributes<HTMLDivElement> {}

export function FeaturesMenu({ className, ...props }: FeaturesMenuProps) {
  return <div className={cx(grid, className)} {...props} />;
}

export default FeaturesMenu;
