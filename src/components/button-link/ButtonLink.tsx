import { type RecipeVariantProps, cva, cx } from "@/styled/css";
import { CaretDown } from "phosphor-react";
import type { AnchorHTMLAttributes, ReactNode } from "react";

/**
 * ButtonLink — AymurAI UI Library "🟢button-link🟢".
 *
 * Figma family: 21:5346
 * Variants: Size=M|S × Type=Default|Alternative
 *
 * - Both sizes: text cta.md.strong (Archivo SemiBold 16px), gap 4px, rounded md (8px)
 * - Type=Default:     color text.onbutton-alt (#576171)
 * - Type=Alternative: color text.onbutton-alternative (#FFFFFF)
 * - Size=M: icon 16×16, text 16px, gap 4px
 * - Size=S: same, plus a trailing caret-down (angle-down-small) 16×16
 * - No explicit width/height; inline flex element
 */

const buttonLink = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1", // 4px
    rounded: "md", // 8px
    textStyle: "cta.md.strong",
    textDecoration: "none",
    cursor: "pointer",
    transitionProperty: "[color, opacity]",
    transitionDuration: "fast",
    transitionTimingFunction: "default",
    borderWidth: "0",
    bg: "[transparent]",
    outline: "none",

    "&:focus-visible": {
      outline: "primary-alt",
      outlineWidth: "[2px]",
      outlineStyle: "solid",
    },

    "&:hover": {
      opacity: "[0.8]",
    },

    "&:active": {
      opacity: "[0.6]",
    },
  },
  variants: {
    type: {
      Default: {
        color: "text.onbutton-alt",
      },
      Alternative: {
        color: "text.onbutton-alternative",
      },
    },
    size: {
      // Both sizes share the same inline layout and 4px gap in Figma.
      M: {},
      S: {},
    },
  },
  defaultVariants: {
    type: "Default",
    size: "M",
  },
});

export type ButtonLinkProps = RecipeVariantProps<typeof buttonLink> & {
  href?: string;
  /** Icon on the left slot */
  iconLeft?: ReactNode;
  /** Icon on the right slot */
  iconRight?: ReactNode;
  children?: ReactNode;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children">;

export function ButtonLink({
  href = "#",
  type,
  size,
  iconLeft,
  iconRight,
  children,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={cx(buttonLink({ type, size }), className)}
      {...props}
    >
      {iconLeft && <span aria-hidden="true">{iconLeft}</span>}
      {children}
      {/* Figma Size=S always carries a trailing caret-down (angle-down-small)
          as the exclusive right slot. For Size=M the caller controls iconRight. */}
      {size === "S" ? (
        <span aria-hidden="true">
          <CaretDown size={16} />
        </span>
      ) : (
        iconRight && <span aria-hidden="true">{iconRight}</span>
      )}
    </a>
  );
}

export default ButtonLink;
