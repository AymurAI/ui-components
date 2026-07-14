import * as RadixSwitch from "@radix-ui/react-switch";
import { css } from "@/styled/css";

/**
 * Switch — Radix UI switch with AymurAI styling.
 * Ported from desktop-app/src/renderer/src/components/ui/switch.tsx
 */
// Figma: Switch Status=Inactive/Active — track 32×19px, thumb 12×12px, padding 4px
const rootStyle = css({
  width: "[32px]",
  height: "[19px]",
  borderRadius: "full",
  borderWidth: "0",
  cursor: "pointer",
  position: "relative",
  flexShrink: "0",
  // Inactive: #E0DDE2 = action.disabled
  bg: "action.disabled",

  transitionProperty: "[background-color]",
  transitionDuration: "slow",
  transitionTimingFunction: "default",

  '&[data-state="checked"]': {
    // Active: #3F479D = brand.primary
    bg: "brand.primary",
  },

  "&:disabled": {
    cursor: "not-allowed",
    opacity: "0.4",
  },
});

const thumbStyle = css({
  display: "block",
  // Figma thumb: 12×12px (track 32 - 2×4px padding = 24 travel space; thumb 12px)
  width: "[12px]",
  height: "[12px]",
  borderRadius: "full",
  bg: "bg.secondary",
  position: "absolute",
  // Center vertically: (19 - 12) / 2 = 3.5px ≈ 3.5px (matches Figma y=3.5)
  top: "[3.5px]",
  left: "[4px]",

  transitionProperty: "[transform]",
  transitionDuration: "slow",
  transitionTimingFunction: "default",

  '&[data-state="checked"]': {
    // Travel: 32 - 4px left padding - 12px thumb - 4px right padding = 12px
    transform: "[translateX(12px)]",
  },
});

export type SwitchProps = RadixSwitch.SwitchProps;

export function Switch(props: SwitchProps) {
  return (
    <RadixSwitch.Root className={rootStyle} {...props}>
      <RadixSwitch.Thumb className={thumbStyle} />
    </RadixSwitch.Root>
  );
}

export default Switch;
