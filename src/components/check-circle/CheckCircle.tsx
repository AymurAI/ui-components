import { cx } from "@/styled/css";

/**
 * CheckCircle — AymurAI UI Library.
 *
 * Figma node 1568:25588 (the "Spinner" frame's 5th/completed state — sibling
 * nodes named "CheckCircle" in that same frame are actually spinner rotation
 * frames with no tick; this is the only one with a checkmark). Solid stroke,
 * #3F479D (action.alt-default) — NOT a gradient; a prior version of this
 * component drew an invented 3-stop gradient and omitted the tick entirely,
 * matching neither Figma reference.
 */

export type CheckCircleProps = {
  /** Size in px — defaults to 48 (Figma native). */
  size?: number;
  className?: string;
  "aria-label"?: string;
};

export function CheckCircle({
  size = 48,
  className,
  "aria-label": ariaLabel = "Success",
}: CheckCircleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={ariaLabel}
      role="img"
      className={cx(className)}
    >
      <path
        d="M24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42Z"
        stroke="#3F479D"
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32.25 19.5L21.2499 30L15.75 24.75"
        stroke="#3F479D"
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default CheckCircle;
