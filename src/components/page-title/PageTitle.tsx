import type { HTMLAttributes } from "react";
import { css, cx } from "@/styled/css";

/**
 * PageTitle — semantic heading shared by the main sections of AymurAI flows.
 *
 * The visual contract comes from the repeated `title.md.strong` heading used
 * by onboarding, preview, processing, validation and finish screens. It stays
 * deliberately small: hierarchy and copy belong to the consumer, while the
 * library owns the common typography and reset.
 */
const titleStyle = css({
  m: "0",
  color: "text.default",
  textStyle: "title.md.strong",
  minW: "[0px]",
});

export interface PageTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export function PageTitle({ className, ...props }: PageTitleProps) {
  return <h1 className={cx(titleStyle, className)} {...props} />;
}

export default PageTitle;
