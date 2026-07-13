import type { ReactNode } from "react";
import { Search } from "@/components/search/Search";
import {
  ToolButton,
  type ToolButtonAction,
} from "@/components/tool-button/ToolButton";
import { css, cx } from "@/styled/css";

/**
 * Toolbar — AymurAI UI Library "tool_bar" family node 40001298:54861.
 *
 * Figma contexts:
 *   Anonimizador    — Search (wide) + vertical divider + label fields + button (1440px)
 *   Set de datos    — Search + vertical divider + filter dropdowns (846px)
 *   Search+Switch   — Search (wide) + Switch+label (1440px)
 *
 * Assumptions:
 *   - The toolbar is full-width of its container by default (max-w is a
 *     consumer concern). Width tokens from Figma (846 / 1440) are not set
 *     here; the container controls width.
 *   - Vertical dividers between sections are rendered as thin 1px lines.
 *   - The "Anonimizador" right-side controls (label dropdowns + button) are
 *     passed as `rightSlot` children for maximum flexibility.
 *   - The Switch in Search+Switch context is the library's Switch component
 *     but is passed as `rightSlot` for composition.
 *   - bg.secondary = #FFFFFF (white bar background)
 *
 * The ToolButton row in the Anonimizador toolbar shown in the Figma is
 * actually the outer toolbar section — within the same bar or below, exposed
 * via `toolButtons` prop.
 */

// Vertical divider — Figma: 1px × 48px line, color #BCBAB8 (border/primary stroke).
// No standalone color token for #BCBAB8 exists; escape hatch used (token gap: border.primary-color).
function ToolbarDivider() {
  return (
    <div
      className={css({
        w: "[1px]",
        h: "12",
        bg: "[#BCBAB8]",
        flexShrink: "0",
        alignSelf: "center",
      })}
    />
  );
}

export type ToolbarContext = "anonimizador" | "set-de-datos" | "search-switch";

export interface ToolbarProps {
  context?: ToolbarContext;
  /** Search input value */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  /** Right slot — pass any node (Switch+label, button, filter controls, etc.) */
  rightSlot?: ReactNode;
  /** Tool buttons shown in the action zone (Anonimizador context) */
  toolButtons?: ToolButtonAction[];
  onToolButtonClick?: (action: ToolButtonAction) => void;
  className?: string;
  /** Pass children for fully custom layouts */
  children?: ReactNode;
}

export function Toolbar({
  context = "anonimizador",
  searchValue,
  onSearchChange,
  rightSlot,
  toolButtons,
  onToolButtonClick,
  className,
  children,
}: ToolbarProps) {
  // Figma layout per context:
  //   anonimizador  — items: end, justify: space-between, pt: 42px, pb: 24px
  //   set-de-datos  — items: end, justify: start, gap: 24px, py: 24px
  //   search-switch — items: center, justify: space-between, pt: 42px, pb: 24px
  const isSetDeDatos = context === "set-de-datos";
  const alignItems = context === "search-switch" ? "center" : "flex-end";
  return (
    <div
      className={cx(
        css({
          display: "flex",
          alignItems,
          justifyContent: isSetDeDatos ? "flex-start" : "space-between",
          bg: "bg.secondary",
          pt: isSetDeDatos ? "6" : "[42px]",
          pb: "6",
          px: "12",
          w: "full",
          gap: isSetDeDatos ? "6" : "0",
        }),
        className,
      )}
    >
      {/* Search zone — always present, fills available space */}
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          flex: "1",
          minW: "[0px]",
          h: "12",
        })}
      >
        <Search
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className={css({ flex: "1" })}
        />
      </div>

      {/* Tool buttons (optional, shown in Anonimizador context) */}
      {toolButtons && toolButtons.length > 0 && (
        <>
          <ToolbarDivider />
          <div
            className={css({
              display: "flex",
              alignItems: "center",
              gap: "4",
              flexShrink: "0",
            })}
          >
            {toolButtons.map((action) => (
              <ToolButton
                key={action}
                action={action}
                onClick={() => onToolButtonClick?.(action)}
              />
            ))}
          </div>
        </>
      )}

      {/* Right slot (optional) */}
      {rightSlot && (
        <>
          <ToolbarDivider />
          <div
            className={css({
              display: "flex",
              alignItems: "center",
              flexShrink: "0",
            })}
          >
            {rightSlot}
          </div>
        </>
      )}

      {/* Fully custom children override */}
      {children}
    </div>
  );
}

export default Toolbar;
