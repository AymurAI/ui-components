import { cx } from "@/styled/css";
import { useId } from "react";

/**
 * CheckCircle — AymurAI UI Library.
 *
 * Figma family: 1568:25593 (success/complete state icon). A full ring, NOT a tick.
 * Stroke is a 3-stop gradient matching `gradients.primary` token:
 *   249.5deg — #C5CAFF (action.default) → #8591E8 → #3F479D (action.alt-default).
 * Completed/success state.
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
      {/* Gradient circle — gradients.primary token: 249.5deg, #C5CAFF → #8591E8 → #3F479D */}
      <path
        d="M24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42Z"
        stroke={`url(#${gradId})`}
        strokeWidth={3.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        {/*
          Matches Figma `gradients.primary`:
          linear-gradient(249.5deg, #C5CAFF -33.26%, #8591E8 28.49%, #3F479D 82.99%)
          SVG coords derived from 249.5deg on a 48×48 userSpaceOnUse canvas.
          x1/y1 = light end (C5CAFF), x2/y2 = dark end (3F479D).
        */}
        <linearGradient
          id={gradId}
          x1={52.9}
          y1={13.2}
          x2={-4.9}
          y2={34.8}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} stopColor="#C5CAFF" />
          <stop offset={0.2849} stopColor="#8591E8" />
          <stop offset={0.8299} stopColor="#3F479D" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default CheckCircle;
