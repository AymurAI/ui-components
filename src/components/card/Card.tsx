import { cva, cx } from "@/styled/css";

/**
 * Card — generic content container with size, disabled, and clickable variants.
 * Ported from desktop-app/src/renderer/src/components/ui/card.tsx
 */
const styles = cva({
  base: {
    transitionProperty: "[border, box-shadow]",
    transitionTimingFunction: "default",
    transitionDuration: "normal",
  },
  variants: {
    size: {
      lg: {
        p: "8",
        rounded: "sm",
      },
      sm: {
        rounded: "lg",
        p: "4",
      },
    },
    disabled: {
      true: {
        border: "primary",
        bg: "bg.primary",
        color: "text.lighter",
      },
      false: {
        border: "primary",
        bg: "bg.secondary",
      },
    },
    clickable: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      clickable: true,
      disabled: false,
      css: {
        cursor: "pointer",
        "&:hover": {
          border: "primary-alt",
          boxShadow: "card-hover",
        },
      },
    },
    {
      clickable: true,
      disabled: true,
      css: {
        cursor: "not-allowed",
      },
    },
  ],
  defaultVariants: {
    disabled: false,
    clickable: false,
    size: "lg",
  },
});

export interface CardProps {
  children?: React.ReactNode;
  disabled?: boolean;
  size?: "lg" | "sm";
  clickable?: boolean;
  className?: string;
}

export function Card({
  disabled = false,
  size = "lg",
  clickable = false,
  children,
  className,
}: CardProps) {
  const classes = styles({ size, disabled, clickable });
  return <div className={cx(className, classes)}>{children}</div>;
}

export default Card;
