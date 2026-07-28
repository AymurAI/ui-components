import type { HTMLAttributes, ReactNode } from "react";
import { css, cva, cx } from "@/styled/css";
import { PageTitle } from "../page-title";

/**
 * WorkflowStepLayout — application shell for one step of a multi-screen flow.
 *
 * The component owns only layout: a bounded viewport, fixed header/footer
 * regions and one main overflow boundary. Routing, progress, translations and
 * domain state stay in the consumer and arrive as pre-built slots.
 */
const rootStyle = css({
  boxSizing: "border-box",
  display: "flex",
  flexDir: "column",
  w: "full",
  h: "[100dvh]",
  minH: "[0px]",
  overflow: "hidden",
  bg: "bg.primary",
});

const regionStyle = css({
  flexShrink: "0",
  w: "full",
});

const mainStyle = cva({
  base: {
    flex: "1",
    minH: "[0px]",
    w: "full",
    overflowX: "hidden",
    bg: "bg.primary",
  },
  variants: {
    fullBleed: {
      false: { overflowY: "auto" },
      true: { overflow: "hidden" },
    },
  },
  defaultVariants: {
    fullBleed: false,
  },
});

const contentStyle = cva({
  base: {
    boxSizing: "border-box",
    w: "full",
  },
  variants: {
    fullBleed: {
      false: {
        minH: "full",
        maxW: "5xl",
        mx: "auto",
        px: { base: "4", sm: "6", md: "8" },
        pt: { base: "6", xl: "16" },
        pb: { base: "6", xl: "16" },
      },
      true: {
        h: "full",
        minH: "[0px]",
        overflow: "hidden",
      },
    },
  },
  defaultVariants: {
    fullBleed: false,
  },
});

const headingRowStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "6",
  w: "full",
  minW: "[0px]",
  mb: "8",
});

export interface WorkflowStepLayoutProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Pre-built application header. Navigation and progress stay in the consumer. */
  header?: ReactNode;
  /** Page-title content. Rendered as a semantic {@link PageTitle}. */
  title?: ReactNode;
  /** Optional element before the title, normally a back button or icon. */
  leading?: ReactNode;
  /** Pre-built footer. Actions and product branding stay in the consumer. */
  footer?: ReactNode;
  /**
   * Removes standard insets and contains overflow so editors and split views
   * can own their internal scrolling without creating a second page scroll.
   */
  fullBleed?: boolean;
  /** Class applied to the `<main>` region. */
  mainClassName?: string;
  /** Class applied to the inner content container. */
  contentClassName?: string;
}

export function WorkflowStepLayout({
  header,
  title,
  leading,
  footer,
  fullBleed = false,
  mainClassName,
  contentClassName,
  className,
  children,
  ...props
}: WorkflowStepLayoutProps) {
  const hasHeading = title !== undefined || leading !== undefined;

  return (
    <div className={cx(rootStyle, className)} {...props}>
      {header !== undefined && (
        <header className={regionStyle}>{header}</header>
      )}
      <main className={cx(mainStyle({ fullBleed }), mainClassName)}>
        <div className={cx(contentStyle({ fullBleed }), contentClassName)}>
          {hasHeading && (
            <div className={headingRowStyle}>
              {leading}
              {title !== undefined && <PageTitle>{title}</PageTitle>}
            </div>
          )}
          {children}
        </div>
      </main>
      {footer !== undefined && (
        <footer className={regionStyle}>{footer}</footer>
      )}
    </div>
  );
}

export default WorkflowStepLayout;
