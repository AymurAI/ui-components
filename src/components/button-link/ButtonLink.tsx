import { type RecipeVariantProps, cva, cx } from "@/styled/css";
import type { AnchorHTMLAttributes, ReactNode } from "react";

/**
 * ButtonLink — AymurAI UI Library "🟢button-link🟢".
 *
 * Figma family: 21:5346
 * Variants: Size=M|S × Type=Default|Alternative
 *
 * - Both sizes: text cta.md.strong (Archivo SemiBold 16px), gap 4px, rounded md (8px)
 * - Type=Default:     color #576171 (text/text-onbutton-alt — NOT in token set, escape hatch used)
 * - Type=Alternative: color text.onbutton-alternative (#FFFFFF)
 * - Size=M: icon 16×16, text 16px
 * - Size=S: icon 16×16, text 16px (same text size, different outer spacing)
 * - No explicit width/height; inline flex element
 *
 * TOKEN GAP: "text/text-onbutton-alt" (#576171) has no semantic token.
 *   Using escape hatch: color: "[#576171]"
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
        // text/text-onbutton-alt — TOKEN GAP: no semantic token for #576171
        color: "[#576171]",
      },
      Alternative: {
        color: "text.onbutton-alternative",
      },
    },
    size: {
      M: {
        // Size M: no extra padding (inline content sizing)
      },
      S: {
        // Size S: same layout, smaller gap context
        gap: "[2px]",
      },
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
      {iconRight && <span aria-hidden="true">{iconRight}</span>}
    </a>
  );
}

export default ButtonLink;
