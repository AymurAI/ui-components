import { css } from "@/styled/css";
import * as RadixSwitch from "@radix-ui/react-switch";

/**
 * Switch — Radix UI switch with AymurAI styling.
 * Ported from desktop-app/src/renderer/src/components/ui/switch.tsx
 */
const rootStyle = css({
  width: "[44px]",
  height: "[24px]",
  borderRadius: "full",
  // strictTokens: `border: "none"` is invalid — use borderWidth: "0"
  borderWidth: "0",
  cursor: "pointer",
  position: "relative",
  flexShrink: "0",
  bg: "bg.primary-highlight",

  transitionProperty: "[background-color]",
  transitionDuration: "slow",
  transitionTimingFunction: "default",

  '&[data-state="checked"]': {
    bg: "brand.primary",
  },

  "&:disabled": {
    cursor: "not-allowed",
    opacity: "0.4",
  },
});

const thumbStyle = css({
  display: "block",
  width: "[20px]",
  height: "[20px]",
  borderRadius: "full",
  // "white" is not a semantic token — use escape hatch
  bg: "[white]",
  position: "absolute",
  top: "[2px]",
  left: "[2px]",

  transitionProperty: "[transform]",
  transitionDuration: "slow",
  transitionTimingFunction: "default",

  '&[data-state="checked"]': {
    transform: "[translateX(20px)]",
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
