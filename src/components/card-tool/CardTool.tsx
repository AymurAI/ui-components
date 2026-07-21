import type { HTMLAttributes, ReactNode } from "react";
import { css, cva, cx } from "@/styled/css";
import { Card } from "../card";

const iconContainer = cva({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    w: "[70px]",
    h: "[70px]",
    p: "[14px]",
    rounded: "[14px]",
    flexShrink: "0",
    "& svg": { w: "full", h: "full" },
  },
  variants: {
    disabled: {
      true: { bg: "bg.secondary", color: "text.lighter" },
      false: { bg: "bg.primary-alternative", color: "text.default" },
    },
  },
  defaultVariants: { disabled: false },
});

const content = css({
  display: "flex",
  flexDir: "column",
  alignItems: "flex-start",
  gap: "4",
});

const copy = css({
  display: "flex",
  flexDir: "column",
  gap: "1",
  minW: "0",
});

const titleStyle = css({
  margin: "0", // no preflight — <h2>/<p> keep the UA default margin otherwise
  textStyle: "subtitle.md.strong",
});
const descriptionStyle = css({
  margin: "0",
  textStyle: "subtitle.sm.default",
  color: "text.lighter",
});

export interface CardToolProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
  disabled?: boolean;
  interactive?: boolean;
}

/** Feature-launch card content. Wrap enabled cards with the consumer's router link. */
export function CardTool({
  icon,
  title,
  description,
  disabled = false,
  interactive = false,
  className,
  ...props
}: CardToolProps) {
  return (
    <Card
      {...props}
      disabled={disabled}
      clickable={interactive && !disabled}
      aria-disabled={disabled || undefined}
      className={cx(css({ h: "full" }), className)}
    >
      <div className={content}>
        <div className={iconContainer({ disabled })}>{icon}</div>
        <div className={copy}>
          <h2 className={titleStyle}>{title}</h2>
          <p className={descriptionStyle}>{description}</p>
        </div>
      </div>
    </Card>
  );
}

export default CardTool;
