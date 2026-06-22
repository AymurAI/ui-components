import { css, cx } from "@/styled/css";

/**
 * StatusBar — AymurAI UI Library "StatusBar/1440" family node 40000455:30893.
 *
 * The Figma node is a macOS-style chrome bar: a simulated browser window frame
 * (time+battery strip, tab bar, address bar) rendered at 1440px.
 *
 * Structure extracted from Figma:
 *   1. Time+Battery bar  — h:22px, black bg (#000000)
 *   2. Tabs bar          — h:42px, bg #202124, contains traffic-light buttons +
 *                          tab pill + new-tab button
 *   3. Toolbar/address   — h:36px, bg #35363a, back/fwd icons + address bar +
 *                          profile icon
 *
 * Tokens:
 *   None of the StatusBar colours map to AymurAI semantic tokens — they are
 *   macOS chrome colors (black, #202124, #35363a, #F1F3F4). These are wrapped
 *   in escape hatches per the strictTokens rule.
 *
 * `variant` prop controls which part of the bar is rendered:
 *   "full"      — all three sections (default)
 *   "tabs"      — time+battery + tabs only
 *   "address"   — address toolbar only
 *
 * Props accept overrides for the active tab title and URL.
 *
 * Assumption: Traffic lights and favicon are decorative; no interactive
 * behaviour is wired. The tab close / new-tab icons are Unicode glyphs.
 */

// ── Sub-section: Time + Battery ──────────────────────────────────────────────

function TimeBatteryBar() {
  return (
    <div
      className={css({
        h: "[22px]",
        bg: "[#000000]",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        px: "[18px]",
        flexShrink: "0",
      })}
      aria-hidden
    >
      <span
        className={css({
          color: "[#FFFFFF]",
          fontSize: "[12px]",
          fontFamily: "[SF Pro Text, system-ui, sans-serif]",
          letterSpacing: "[-0.1px]",
        })}
      >
        100% · Tue 9:41
      </span>
    </div>
  );
}

// ── Sub-section: Traffic lights ───────────────────────────────────────────────
//
// Each dot uses its own css() call so Panda can statically extract the escape-
// hatch bg value at build time. Passing a dynamic variable into css({ bg: var })
// is not statically analysable and produces no CSS output.

const trafficLightRed = css({
  w: "[12px]",
  h: "[12px]",
  rounded: "full",
  bg: "[#FF5F57]",
  flexShrink: "0",
});
const trafficLightYellow = css({
  w: "[12px]",
  h: "[12px]",
  rounded: "full",
  bg: "[#FEBC2E]",
  flexShrink: "0",
});
const trafficLightGreen = css({
  w: "[12px]",
  h: "[12px]",
  rounded: "full",
  bg: "[#28C840]",
  flexShrink: "0",
});

function TrafficLights() {
  return (
    <div
      className={css({
        display: "flex",
        gap: "[6px]",
        alignItems: "center",
        flexShrink: "0",
      })}
    >
      <div className={trafficLightRed} />
      <div className={trafficLightYellow} />
      <div className={trafficLightGreen} />
    </div>
  );
}

// ── Sub-section: Tabs bar ─────────────────────────────────────────────────────

interface TabsBarProps {
  tabTitle: string;
}

function TabsBar({ tabTitle }: TabsBarProps) {
  return (
    <div
      className={css({
        h: "[42px]",
        bg: "[#202124]",
        display: "flex",
        alignItems: "center",
        px: "[13px]",
        gap: "[7px]",
        flexShrink: "0",
      })}
    >
      <TrafficLights />
      {/* Active tab pill */}
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          gap: "[8px]",
          bg: "[#35363a]",
          rounded: "[8px_8px_0_0]",
          px: "[12px]",
          h: "[34px]",
          minW: "[120px]",
          maxW: "[256px]",
          flexShrink: "0",
        })}
      >
        {/* Favicon placeholder */}
        <div
          className={css({
            w: "[16px]",
            h: "[16px]",
            rounded: "full",
            bg: "action.default",
            flexShrink: "0",
          })}
        />
        <span
          className={css({
            color: "[#FFFFFF]",
            fontSize: "[12px]",
            fontFamily: "[Roboto, sans-serif]",
            flex: "1",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          })}
        >
          {tabTitle}
        </span>
        <span
          className={css({
            color: "[rgba(255,255,255,0.5)]",
            fontSize: "[10px]",
            flexShrink: "0",
            cursor: "pointer",
          })}
          aria-hidden
        >
          ✕
        </span>
      </div>
      {/* New tab button */}
      <span
        className={css({
          color: "[rgba(255,255,255,0.6)]",
          fontSize: "[16px]",
          cursor: "pointer",
          lineHeight: "[1]",
        })}
        aria-hidden
      >
        +
      </span>
    </div>
  );
}

// ── Sub-section: Address / Toolbar bar ───────────────────────────────────────

interface AddressBarProps {
  url: string;
}

function AddressBar({ url }: AddressBarProps) {
  return (
    <div
      className={css({
        h: "[36px]",
        bg: "[#35363a]",
        display: "flex",
        alignItems: "center",
        px: "[18px]",
        gap: "[14px]",
        flexShrink: "0",
      })}
    >
      {/* Back/forward arrows (decorative) */}
      <span
        className={css({
          color: "[rgba(255,255,255,0.4)]",
          fontSize: "[14px]",
          userSelect: "none",
        })}
      >
        ‹ ›
      </span>
      {/* Address input pill */}
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          gap: "[12px]",
          bg: "[#F1F3F4]",
          rounded: "[14px]",
          px: "[14px]",
          h: "[28px]",
          flex: "1",
          overflow: "hidden",
        })}
      >
        <span
          className={css({
            fontSize: "[11px]",
            color: "[#5F6368]",
            userSelect: "none",
          })}
        >
          🔒
        </span>
        <span
          className={css({
            fontSize: "[14px]",
            fontFamily: "[Roboto, sans-serif]",
            color: "[#202124]",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: "1",
          })}
        >
          {url}
        </span>
      </div>
      {/* Profile icon placeholder */}
      <div
        className={css({
          w: "[22px]",
          h: "[22px]",
          rounded: "full",
          bg: "action.alt-default",
          flexShrink: "0",
        })}
      />
    </div>
  );
}

// ── Public API ────────────────────────────────────────────────────────────────

export type StatusBarVariant = "full" | "tabs" | "address";

export interface StatusBarProps {
  /** Which section(s) to render */
  variant?: StatusBarVariant;
  /** Displayed tab title */
  tabTitle?: string;
  /** Displayed address bar URL */
  url?: string;
  className?: string;
}

export function StatusBar({
  variant = "full",
  tabTitle = "Aymurai",
  url = "www.aymurai.com",
  className,
}: StatusBarProps) {
  return (
    <div
      className={cx(
        css({
          display: "flex",
          flexDir: "column",
          w: "full",
          overflow: "hidden",
        }),
        className,
      )}
      role="presentation"
      aria-hidden
    >
      {(variant === "full" || variant === "tabs") && (
        <>
          <TimeBatteryBar />
          <TabsBar tabTitle={tabTitle} />
        </>
      )}
      {(variant === "full" || variant === "address") && (
        <AddressBar url={url} />
      )}
    </div>
  );
}

export default StatusBar;
