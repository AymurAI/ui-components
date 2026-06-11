import { cx } from "@/styled/css";
import { useId } from "react";

/**
 * CheckCircle — AymurAI UI Library.
 *
 * Figma family: 1568:25593 (success/complete state icon). Geometry matches the
 * exported Figma vector (src/assets/check-circle.svg): a full ring, NOT a tick.
 * Base circle stroke #C5CAFF (= action.default) + gradient overlay from
 * action/alt-default (#3F479D) → transparent. Completed/success state.
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
  // Unique gradient id per instance to avoid <defs> collisions when several
  // CheckCircle elements are rendered on the same page.
  const gradId = useId();
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
      {/* Base circle — brand/secondary */}
      <path
        d="M24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42Z"
        stroke="#C5CAFF"
        strokeWidth={3.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Gradient overlay circle — action/alt-default fade */}
      <path
        d="M24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42Z"
        stroke={`url(#${gradId})`}
        strokeWidth={3.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id={gradId}
          x1={20}
          y1={6}
          x2={36}
          y2={40}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3F479D" />
          <stop offset={1} stopColor="#3F479D" stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default CheckCircle;
