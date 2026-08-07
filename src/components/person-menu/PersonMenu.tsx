import { PlusIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { css, cx } from "@/styled/css";
import type { AvatarColor } from "../avatar";
import { AvatarPill } from "../avatar-pill";
import { Button } from "../button";

/**
 * PersonMenu — floating list of people/roles to choose from, with an
 * optional footer action. AymurAI UI Library node 40002701:44844
 * ("single select").
 *
 * It's just the surface: it doesn't mount a Popover or handle opening or
 * anchoring. The consumer positions it — SidePanel anchors it with a Popover
 * on the "Nuevo" button; desktop-app's SpeakerPicker places it inside its
 * own floating bar.
 *
 * Each row is wrapped in a <button> because AvatarPill renders a <span> and
 * isn't focusable: in a menu that would leave the options out of keyboard
 * reach.
 */
export type PersonMenuOption = {
  /** Stable consumer identity; used as the React key when available. */
  id?: string;
  /** Avatar initials, e.g. "FI" */
  initials: string;
  /** Displayed name, e.g. "Fiscal" */
  name: string;
  color?: AvatarColor;
};

export type PersonMenuProps = {
  /** Menu rows, in render order. May be empty. */
  options: PersonMenuOption[];
  /** Receives the index in `options` of the chosen row. */
  onSelectOption: (index: number) => void;
  /** Index marked as selected. */
  selectedIndex?: number;
  /** Footer action label; omit to skip rendering it. */
  footerLabel?: string;
  onFooterAction?: () => void;
  /**
   * Content under the rows instead of the button, when the consumer needs
   * something else (e.g. a free-text name input). Takes priority over
   * `footerLabel`/`onFooterAction`.
   */
  footerSlot?: ReactNode;
  /** Accessible label for the container. */
  "aria-label"?: string;
  className?: string;
};

const surface = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "1", // 4px
  p: "2", // 8px
  bg: "bg.secondary",
  rounded: "md", // 8px
  // Figma uses the shared `shadow` style (0 0 10px rgba(0,0,0,.1)); `menu`
  // is the existing floating-surface token and the difference is imperceptible.
  boxShadow: "menu",
});

const optionButton = css({
  display: "block",
  width: "full",
  textAlign: "left",
  borderWidth: "0",
  bg: "[transparent]",
  p: "0",
  cursor: "pointer",
  rounded: "xl", // 24px — focus ring follows the pill shape
  "&:focus-visible": {
    outline: "primary-alt",
    outlineWidth: "[2px]",
    outlineOffset: "[2px]",
  },
});

// Button has no 40px size (sm=32, md=48) and centers its content; Figma
// calls for 40px height and left-aligned content.
const footerButton = css({
  w: "full",
  h: "10", // 40px
  justifyContent: "flex-start",
});

export function PersonMenu({
  options,
  onSelectOption,
  selectedIndex,
  footerLabel,
  onFooterAction,
  footerSlot,
  className,
  "aria-label": ariaLabel = "Personas",
}: PersonMenuProps) {
  const footer =
    footerSlot ??
    (footerLabel && onFooterAction ? (
      <Button
        variant="tertiary"
        size="sm"
        onClick={onFooterAction}
        className={footerButton}
      >
        <PlusIcon size={16} />
        {footerLabel}
      </Button>
    ) : null);

  if (options.length === 0 && !footer) return null;

  return (
    <div className={cx(surface, className)} role="group" aria-label={ariaLabel}>
      {options.map((option, index) => (
        <button
          key={option.id ?? `${option.initials}-${option.name}-${index}`}
          type="button"
          className={optionButton}
          aria-label={option.name}
          aria-current={index === selectedIndex ? "true" : undefined}
          onClick={() => onSelectOption(index)}
        >
          <AvatarPill
            initials={option.initials}
            name={option.name}
            color={option.color}
            state={index === selectedIndex ? "selected" : "default"}
          />
        </button>
      ))}
      {footer}
    </div>
  );
}

export default PersonMenu;
