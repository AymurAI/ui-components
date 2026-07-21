import { css, cx } from "@/styled/css";

/**
 * TutorialGrid — responsive grid of "how it works" step cards.
 *
 * No Figma frame documents this; it formalizes desktop-app's own
 * `HowItWorks`/`Card` (a fixed 2-column, non-responsive grid used inside
 * the "¿Cómo funciona?" modal in every pipeline) — same image size (200×130,
 * object-fit contain), numbered badge, and card chrome. What's new here is
 * the responsive column count the plan calls for: desktop-app's original
 * never collapsed to one column on narrow windows.
 *
 * No i18next — image, alt text, title and description all come from the
 * consumer; the step number is derived from each step's position.
 */

export interface TutorialStep {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
}

export interface TutorialGridProps {
  steps: TutorialStep[];
  className?: string;
}

const grid = css({
  display: "grid",
  gridTemplateColumns: { base: "1fr", md: "repeat(2, 1fr)" },
  gap: "6", // 24px
  w: "full",
});

const card = css({
  display: "flex",
  alignItems: "center",
  gap: "4", // 16px
  bg: "bg.secondary",
  border: "primary",
  rounded: "sm",
  px: "4", // 16px
  py: "6", // 24px
  h: "full", // equal height within a row
});

const image = css({
  w: "[200px]",
  h: "[130px]",
  objectFit: "contain",
  flexShrink: "0",
});

const stepAndCopy = css({
  display: "flex",
  flexDir: "column",
  gap: "4", // 16px
  minW: "[0px]",
});

const stepBadge = css({
  margin: "0", // no preflight — <p> keeps the UA default margin otherwise
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  w: "9", // 36px
  h: "9",
  flexShrink: "0",
  bg: "action.alt-default",
  color: "text.onbutton-alternative",
  rounded: "full",
  textStyle: "cta.md.strong",
});

const copy = css({
  display: "flex",
  flexDir: "column",
  gap: "1", // 4px
  minW: "[0px]",
});

const titleStyle = css({
  margin: "0",
  textStyle: "paragraph.sm.strong",
  color: "text.default",
});

const descriptionStyle = css({
  margin: "0",
  textStyle: "subtitle.sm.default",
  color: "text.lighter",
});

export function TutorialGrid({ steps, className }: TutorialGridProps) {
  return (
    <div className={cx(grid, className)}>
      {steps.map((step, index) => (
        <div key={index} className={card}>
          <img src={step.image} alt={step.imageAlt} className={image} />
          <div className={stepAndCopy}>
            <p className={stepBadge}>{index + 1}</p>
            <div className={copy}>
              <h2 className={titleStyle}>{step.title}</h2>
              <p className={descriptionStyle}>{step.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TutorialGrid;
